export const BETTING_TIME_MS = 7500;
export const QUESTION_TIME_MS = 20000;
export const REVEAL_TIME_MS = 5000;
export const MAX_POINTS = 1000;
export const MIN_POINTS = 100;
export const QUESTIONS_PER_GAME = 10;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 8;

export type GamePhase =
  | "LOBBY"
  | "BETTING"
  | "QUESTION"
  | "REVEAL"
  | "RESULTS";

/* ---------------------------------------------------------------------------
 * Server-only shapes
 *
 * `Question` carries the answer and the reveal commentary, so it must never be
 * serialised to a client before the reveal — `lucaCorrect` routinely names the
 * correct choice outright. The worker maps it to `PublicQuestion` first.
 * ------------------------------------------------------------------------- */

export interface QuestionCommentary {
  picklesIntro: string;
  lucaCorrect: string;
  oliverWrong: string;
  bettingLines: {
    oliver: string;
    luca: string;
  };
}

export interface Choice {
  text: string;
  image?: string;
}

export interface Question {
  id: number;
  category: string;
  question: string;
  image?: string;
  choices: [Choice, Choice, Choice, Choice];
  correctIndex: number;
  commentary: QuestionCommentary;
}

/* ---------------------------------------------------------------------------
 * Client-facing shapes
 * ------------------------------------------------------------------------- */

export interface PublicQuestion {
  id: number;
  category: string;
  question: string;
  image?: string;
  choices: Choice[];
  picklesIntro: string;
}

export interface PublicPlayer {
  id: string;
  name: string;
  score: number;
}

/** Which player each mascot backed this round, resolved to names by the server. */
export interface BettingCard {
  oliver: string;
  luca: string;
}

/** Only present during REVEAL — this is what unlocks the answer. */
export interface RoundResult {
  correctIndex: number;
  lucaCorrect: string;
  oliverWrong: string;
  players: Record<string, { choiceIndex: number; points: number }>;
}

export interface PublicGameState {
  /** Monotonic; lets the client discard state that arrives out of order. */
  version: number;
  phase: GamePhase;
  players: PublicPlayer[];
  hostId: string;
  /** 1-based; 0 outside of a round. */
  questionNumber: number;
  totalQuestions: number;
  /** Only ever the current question, so there is nothing to read ahead to. */
  question: PublicQuestion | null;
  betting: BettingCard | null;
  /** Who has locked in. Deliberately no choices until REVEAL. */
  answeredIds: string[];
  result: RoundResult | null;
  /** Server epoch ms when the current phase ends; 0 when nothing is running. */
  deadline: number;
  /** Server epoch ms at broadcast, so clients can correct for clock skew. */
  serverNow: number;
}

export const EMPTY_GAME_STATE: PublicGameState = {
  version: 0,
  phase: "LOBBY",
  players: [],
  hostId: "",
  questionNumber: 0,
  totalQuestions: QUESTIONS_PER_GAME,
  question: null,
  betting: null,
  answeredIds: [],
  result: null,
  deadline: 0,
  serverNow: 0,
};
