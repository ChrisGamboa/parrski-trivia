import { DurableObject } from "cloudflare:workers";

import { questions as QUESTION_BANK } from "@/app/data/questions";
import {
  BETTING_TIME_MS,
  MAX_PLAYERS,
  MIN_PLAYERS,
  QUESTIONS_PER_GAME,
  QUESTION_TIME_MS,
  REVEAL_TIME_MS,
  type GamePhase,
  type PublicGameState,
  type Question,
  type RoundResult,
} from "@/app/data/types";
import { calculatePoints, pickQuestions } from "./scoring";

const STORAGE_KEY = "room";

interface StoredPlayer {
  id: string;
  name: string;
  score: number;
  joinedAt: number;
}

interface StoredAnswer {
  choiceIndex: number;
  /** Stamped by the server on receipt — never supplied by the client. */
  answeredAt: number;
}

interface RoomState {
  version: number;
  phase: GamePhase;
  players: StoredPlayer[];
  hostId: string;
  /** Full questions, answers included. Never leaves the Durable Object. */
  questions: Question[];
  currentIndex: number;
  deadline: number;
  answers: Record<string, StoredAnswer>;
  betting: { oliver: string; luca: string } | null;
  result: RoundResult | null;
  /** Question ids already used in this room, so repeats stay rare. */
  usedQuestionIds: number[];
}

function emptyRoom(): RoomState {
  return {
    version: 0,
    phase: "LOBBY",
    players: [],
    hostId: "",
    questions: [],
    currentIndex: 0,
    deadline: 0,
    answers: {},
    betting: null,
    result: null,
    usedQuestionIds: [],
  };
}

export class GameRoom extends DurableObject<Env> {
  #state: RoomState = emptyRoom();
  #roomCode = "";

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    // blockConcurrencyWhile guarantees no request is delivered until the state
    // is loaded, so every handler below can mutate #state synchronously and
    // never observe a torn read. That is what makes joins race-free.
    ctx.blockConcurrencyWhile(async () => {
      const stored = await ctx.storage.get<RoomState>(STORAGE_KEY);
      if (stored) this.#state = { ...emptyRoom(), ...stored };
      this.#roomCode = (await ctx.storage.get<string>("roomCode")) ?? "";
    });
  }

  /* ----------------------------------------------------------------------- */
  /* Public RPC surface                                                       */
  /* ----------------------------------------------------------------------- */

  async getPublicState(roomCode?: string): Promise<PublicGameState> {
    if (roomCode && roomCode !== this.#roomCode) {
      this.#roomCode = roomCode;
      await this.ctx.storage.put("roomCode", roomCode);
    }
    return this.#toPublic();
  }

  async join(
    playerId: string,
    name: string,
    roomCode: string,
  ): Promise<{ ok: true; state: PublicGameState } | { ok: false; error: string }> {
    if (roomCode !== this.#roomCode) {
      this.#roomCode = roomCode;
      await this.ctx.storage.put("roomCode", roomCode);
    }

    const s = this.#state;
    const existing = s.players.find((p) => p.id === playerId);

    if (existing) {
      // Rejoin — a refresh or a reconnect keeps your seat and your score.
      if (existing.name !== name) existing.name = name;
      await this.#commit();
      return { ok: true, state: this.#toPublic() };
    }

    if (s.phase !== "LOBBY") {
      return { ok: false, error: "That game is already in progress." };
    }
    if (s.players.length >= MAX_PLAYERS) {
      return { ok: false, error: "Room is full!" };
    }

    s.players.push({ id: playerId, name, score: 0, joinedAt: Date.now() });
    if (!s.hostId) s.hostId = playerId;

    await this.#commit();
    return { ok: true, state: this.#toPublic() };
  }

  async leave(playerId: string): Promise<PublicGameState> {
    const s = this.#state;
    const before = s.players.length;
    s.players = s.players.filter((p) => p.id !== playerId);
    delete s.answers[playerId];

    if (s.players.length !== before) {
      // Hand the host role on rather than stranding the room.
      if (s.hostId === playerId) s.hostId = s.players[0]?.id ?? "";
      if (s.players.length === 0) {
        // Keep version and history: version must never go backwards or clients
        // would reject every subsequent update as stale.
        this.#state = {
          ...emptyRoom(),
          version: s.version,
          usedQuestionIds: s.usedQuestionIds,
        };
        await this.ctx.storage.deleteAlarm();
      } else if (s.phase === "QUESTION" && this.#everyoneAnswered()) {
        await this.#toReveal();
        return this.#toPublic();
      }
      await this.#commit();
    }
    return this.#toPublic();
  }

  async start(
    playerId: string,
  ): Promise<{ ok: true; state: PublicGameState } | { ok: false; error: string }> {
    const s = this.#state;
    if (playerId !== s.hostId) {
      return { ok: false, error: "Only the host can start the game." };
    }
    if (s.phase !== "LOBBY" && s.phase !== "RESULTS") {
      return { ok: false, error: "The game is already running." };
    }
    if (s.players.length < MIN_PLAYERS) {
      return { ok: false, error: `You need at least ${MIN_PLAYERS} players.` };
    }

    const { picked, usedIds } = pickQuestions(
      QUESTION_BANK,
      QUESTIONS_PER_GAME,
      s.usedQuestionIds,
    );
    s.questions = picked;
    s.usedQuestionIds = usedIds;
    s.currentIndex = 0;
    s.result = null;
    s.players = s.players.map((p) => ({ ...p, score: 0 }));

    await this.#toBetting();
    return { ok: true, state: this.#toPublic() };
  }

  async answer(
    playerId: string,
    questionNumber: number,
    choiceIndex: number,
  ): Promise<PublicGameState> {
    const s = this.#state;
    const isPlayer = s.players.some((p) => p.id === playerId);

    // Late, duplicate, and out-of-round submissions are all dropped silently:
    // the client just re-renders from whatever state comes back.
    if (
      !isPlayer ||
      s.phase !== "QUESTION" ||
      questionNumber !== s.currentIndex + 1 ||
      s.answers[playerId] ||
      choiceIndex < 0 ||
      choiceIndex > 3
    ) {
      return this.#toPublic();
    }

    s.answers[playerId] = { choiceIndex, answeredAt: Date.now() };

    if (this.#everyoneAnswered()) {
      await this.#toReveal();
    } else {
      await this.#commit();
    }
    return this.#toPublic();
  }

  /** DO alarm: the phase clock. Runs whether or not anyone has a tab open. */
  async alarm(): Promise<void> {
    const s = this.#state;
    const now = Date.now();

    // Alarms can fire slightly early; re-arm rather than skipping ahead.
    if (s.deadline > now + 250) {
      await this.ctx.storage.setAlarm(s.deadline);
      return;
    }

    switch (s.phase) {
      case "BETTING":
        await this.#toQuestion();
        break;
      case "QUESTION":
        await this.#toReveal();
        break;
      case "REVEAL":
        await this.#advanceAfterReveal();
        break;
      default:
        break;
    }
  }

  /* ----------------------------------------------------------------------- */
  /* Phase transitions                                                        */
  /* ----------------------------------------------------------------------- */

  async #toBetting(): Promise<void> {
    const s = this.#state;
    s.phase = "BETTING";
    s.answers = {};
    s.result = null;
    s.deadline = Date.now() + BETTING_TIME_MS;
    s.betting = this.#pickBettingTargets();
    await this.ctx.storage.setAlarm(s.deadline);
    await this.#commit();
  }

  async #toQuestion(): Promise<void> {
    const s = this.#state;
    s.phase = "QUESTION";
    s.deadline = Date.now() + QUESTION_TIME_MS;
    await this.ctx.storage.setAlarm(s.deadline);
    await this.#commit();
  }

  async #toReveal(): Promise<void> {
    const s = this.#state;
    const question = s.questions[s.currentIndex];
    if (!question) return;

    // The question opened QUESTION_TIME_MS before its deadline. Both ends of
    // this subtraction are server clock readings, so a player's device clock
    // cannot influence their score.
    const questionStart = s.deadline - QUESTION_TIME_MS;

    const players: RoundResult["players"] = {};
    for (const player of s.players) {
      const answer = s.answers[player.id];
      const choiceIndex = answer ? answer.choiceIndex : -1;
      const points = calculatePoints(
        answer?.answeredAt ?? questionStart + QUESTION_TIME_MS,
        questionStart,
        choiceIndex === question.correctIndex,
      );
      players[player.id] = { choiceIndex, points };
      player.score += points;
    }

    s.result = {
      correctIndex: question.correctIndex,
      lucaCorrect: question.commentary.lucaCorrect,
      oliverWrong: question.commentary.oliverWrong,
      players,
    };
    s.phase = "REVEAL";
    s.deadline = Date.now() + REVEAL_TIME_MS;
    await this.ctx.storage.setAlarm(s.deadline);
    await this.#commit();
  }

  async #advanceAfterReveal(): Promise<void> {
    const s = this.#state;
    const next = s.currentIndex + 1;
    if (next >= s.questions.length) {
      s.phase = "RESULTS";
      s.deadline = 0;
      s.result = null;
      await this.ctx.storage.deleteAlarm();
      await this.#commit();
      return;
    }
    s.currentIndex = next;
    await this.#toBetting();
  }

  /* ----------------------------------------------------------------------- */
  /* Helpers                                                                  */
  /* ----------------------------------------------------------------------- */

  #everyoneAnswered(): boolean {
    const s = this.#state;
    return (
      s.players.length > 0 &&
      s.players.every((p) => s.answers[p.id] !== undefined)
    );
  }

  /**
   * Deterministic so every client sees the same bets, and offset so the two
   * mascots never back the same player when there is more than one to pick.
   */
  #pickBettingTargets(): { oliver: string; luca: string } | null {
    const s = this.#state;
    const n = s.players.length;
    if (n === 0) return null;
    const round = s.currentIndex + 1;
    const oliver = s.players[round % n];
    const luca = s.players[n === 1 ? 0 : (round + 1) % n];
    const question = s.questions[s.currentIndex];
    if (!question) return null;
    return {
      oliver: question.commentary.bettingLines.oliver.replaceAll(
        "PLAYER",
        oliver.name,
      ),
      luca: question.commentary.bettingLines.luca.replaceAll(
        "PLAYER",
        luca.name,
      ),
    };
  }

  #toPublic(): PublicGameState {
    const s = this.#state;
    const question = s.questions[s.currentIndex];
    const inRound =
      s.phase === "BETTING" || s.phase === "QUESTION" || s.phase === "REVEAL";

    return {
      version: s.version,
      phase: s.phase,
      players: s.players.map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
      })),
      hostId: s.hostId,
      questionNumber: inRound ? s.currentIndex + 1 : 0,
      totalQuestions: s.questions.length || QUESTIONS_PER_GAME,
      // Strips correctIndex and the reveal commentary, and only ever exposes
      // the question that is actually in play.
      question:
        inRound && question
          ? {
              id: question.id,
              category: question.category,
              question: question.question,
              image: question.image,
              choices: question.choices.map((c) => ({
                text: c.text,
                image: c.image,
              })),
              picklesIntro: question.commentary.picklesIntro,
            }
          : null,
      betting: s.phase === "BETTING" ? s.betting : null,
      // Who has locked in, never what they picked.
      answeredIds: s.phase === "QUESTION" ? Object.keys(s.answers) : [],
      result: s.phase === "REVEAL" ? s.result : null,
      deadline: s.deadline,
      serverNow: Date.now(),
    };
  }

  async #commit(): Promise<void> {
    this.#state.version += 1;
    await this.ctx.storage.put(STORAGE_KEY, this.#state);
    await this.#broadcast();
  }

  /**
   * Pushes public state to the SyncedStateServer for this room, which fans it
   * out to every subscribed client. That DO is an in-memory cache only, so it
   * is a transport here and never a source of truth.
   */
  async #broadcast(): Promise<void> {
    if (!this.#roomCode) return;
    try {
      const ns = this.env.SYNCED_STATE_SERVER;
      const stub = ns.get(ns.idFromName(this.#roomCode));
      await stub.setState(this.#toPublic(), "game");
    } catch {
      // A failed push is survivable: clients poll and refetch on reconnect.
    }
  }
}
