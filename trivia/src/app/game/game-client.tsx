"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSyncedState } from "rwsdk/use-synced-state/client";
import type {
  GameState,
  PlayerAnswer,
  QuestionResult,
} from "@/app/data/types";
import {
  INITIAL_GAME_STATE,
  MAX_PLAYERS,
  QUESTIONS_PER_GAME,
  REVEAL_TIME_MS,
} from "@/app/data/types";
import {
  getPlayerId,
  getSavedPlayerName,
  savePlayerName,
  calculatePoints,
  pickRandomIndices,
} from "@/app/shared/utils";
import { questions as allQuestions } from "@/app/data/questions";
import { Lobby } from "./lobby";
import { Question } from "./question";
import { Reveal } from "./reveal";
import { Results } from "./results";

const NO_ANSWER: PlayerAnswer = {
  questionIndex: -1,
  choiceIndex: -1,
  answeredAt: 0,
};

export function GameClient({ roomCode }: { roomCode: string }) {
  const myId = useRef(getPlayerId()).current;

  const [game, setGame] = useSyncedState<GameState>(
    INITIAL_GAME_STATE,
    "game",
    roomCode,
  );

  const [myAnswer, setMyAnswer] = useSyncedState<PlayerAnswer>(
    NO_ANSWER,
    `answer-${myId}`,
    roomCode,
  );

  // Track the opponent's answer
  const opponent = game.players.find((p) => p.id !== myId);
  const opponentId = opponent?.id ?? "none";
  const [opponentAnswer] = useSyncedState<PlayerAnswer>(
    NO_ANSWER,
    `answer-${opponentId}`,
    roomCode,
  );

  const [nameInput, setNameInput] = useState(getSavedPlayerName);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  const isHost = game.hostId === myId;
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-rejoin: check if we're already in the player list
  useEffect(() => {
    if (game.players.some((p) => p.id === myId)) {
      setJoined(true);
    }
  }, [game.players, myId]);

  // Host: detect both answered → advance to reveal
  useEffect(() => {
    if (!isHost || game.phase !== "QUESTION") return;
    if (game.players.length < MAX_PLAYERS) return;

    const currentQIdx = game.currentQuestionIndex;
    const bothAnswered = game.players.every((p) => {
      if (p.id === myId) {
        return (
          myAnswer.questionIndex === currentQIdx && myAnswer.choiceIndex >= 0
        );
      }
      return (
        opponentAnswer.questionIndex === currentQIdx &&
        opponentAnswer.choiceIndex >= 0
      );
    });

    if (bothAnswered) {
      advanceToReveal();
    }
  }, [game.phase, game.currentQuestionIndex, myAnswer, opponentAnswer]);

  // Host: auto-advance from reveal after REVEAL_TIME_MS
  useEffect(() => {
    if (!isHost || game.phase !== "REVEAL") return;

    revealTimerRef.current = setTimeout(() => {
      advanceFromReveal();
    }, REVEAL_TIME_MS);

    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, [isHost, game.phase, game.results.length]);

  function handleJoin() {
    const name = nameInput.trim();
    if (!name) {
      setError("Enter your name!");
      return;
    }
    if (game.players.length >= MAX_PLAYERS) {
      setError("Room is full!");
      return;
    }
    if (game.players.some((p) => p.id === myId)) {
      setJoined(true);
      return;
    }
    savePlayerName(name);
    const isFirstPlayer = game.players.length === 0;
    setGame({
      ...game,
      players: [
        ...game.players,
        { id: myId, name, score: 0, joinedAt: Date.now() },
      ],
      hostId: isFirstPlayer ? myId : game.hostId,
    });
    setJoined(true);
  }

  function handleStart() {
    if (!isHost) return;
    const questionOrder = pickRandomIndices(
      allQuestions.length,
      QUESTIONS_PER_GAME,
    );
    setGame({
      ...game,
      phase: "QUESTION",
      questionOrder,
      currentQuestionIndex: 0,
      questionStartTime: Date.now(),
      results: [],
      players: game.players.map((p) => ({ ...p, score: 0 })),
    });
    setMyAnswer(NO_ANSWER);
  }

  const handleAnswer = useCallback(
    (choiceIndex: number) => {
      if (myAnswer.questionIndex === game.currentQuestionIndex) return;
      setMyAnswer({
        questionIndex: game.currentQuestionIndex,
        choiceIndex,
        answeredAt: Date.now(),
      });
    },
    [game.currentQuestionIndex, myAnswer.questionIndex],
  );

  function advanceToReveal() {
    if (!isHost) return;
    const qIdx = game.currentQuestionIndex;
    const questionId = game.questionOrder[qIdx];
    const question = allQuestions[questionId];

    const playerResults: QuestionResult["players"] = {};
    for (const player of game.players) {
      let answer: PlayerAnswer;
      if (player.id === myId) {
        answer = myAnswer;
      } else {
        answer = opponentAnswer;
      }

      const chose =
        answer.questionIndex === qIdx ? answer.choiceIndex : -1;
      const isCorrect = chose === question.correctIndex;
      const points = calculatePoints(
        answer.answeredAt || game.questionStartTime + 20000,
        game.questionStartTime,
        isCorrect,
      );

      playerResults[player.id] = { choiceIndex: chose, points };
    }

    const result: QuestionResult = {
      questionIndex: qIdx,
      correctIndex: question.correctIndex,
      players: playerResults,
    };

    const updatedPlayers = game.players.map((p) => ({
      ...p,
      score: p.score + (playerResults[p.id]?.points ?? 0),
    }));

    setGame({
      ...game,
      phase: "REVEAL",
      results: [...game.results, result],
      players: updatedPlayers,
    });
  }

  function advanceFromReveal() {
    if (!isHost) return;
    const nextQIdx = game.currentQuestionIndex + 1;
    if (nextQIdx >= QUESTIONS_PER_GAME) {
      setGame({ ...game, phase: "RESULTS" });
    } else {
      setGame({
        ...game,
        phase: "QUESTION",
        currentQuestionIndex: nextQIdx,
        questionStartTime: Date.now(),
      });
      setMyAnswer(NO_ANSWER);
    }
  }

  const handleTimeUp = useCallback(() => {
    if (!isHost) return;
    advanceToReveal();
  }, [isHost, game, myAnswer, opponentAnswer]);

  function handlePlayAgain() {
    if (!isHost) return;
    const questionOrder = pickRandomIndices(
      allQuestions.length,
      QUESTIONS_PER_GAME,
    );
    setGame({
      ...game,
      phase: "QUESTION",
      questionOrder,
      currentQuestionIndex: 0,
      questionStartTime: Date.now(),
      results: [],
      players: game.players.map((p) => ({ ...p, score: 0 })),
    });
    setMyAnswer(NO_ANSWER);
  }

  // Join screen (not yet in the game)
  if (!joined) {
    return (
      <div className="boomer-container">
        <div className="text-center mb-4">
          <h1>PARRSKI TRIVIA</h1>
          <div className="room-code mt-2">{roomCode}</div>
        </div>

        <div className="rainbow-divider" />

        {game.players.length >= MAX_PLAYERS ? (
          <div className="boomer-card text-center">
            <h2 className="text-red">Room Full!</h2>
            <p className="mt-2">This room already has {MAX_PLAYERS} players.</p>
            <a
              href="/"
              className="text-electric-blue inline-block mt-4"
            >
              Back to Home
            </a>
          </div>
        ) : (
          <div className="boomer-card">
            <h3 className="mb-2">Enter Your Name</h3>
            <div className="flex gap-4 items-center flex-wrap">
              <input
                className="boomer-input"
                type="text"
                placeholder="Your name..."
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setError("");
                }}
                maxLength={20}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />
              <button
                className="boomer-btn boomer-btn--lime"
                onClick={handleJoin}
              >
                Join Game
              </button>
            </div>
            {error && (
              <p className="mt-2 text-red">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Main game rendering by phase
  const currentQuestionId = game.questionOrder[game.currentQuestionIndex];
  const currentQuestion = allQuestions[currentQuestionId];

  return (
    <div className="boomer-container">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl">PARRSKI TRIVIA</h2>
        {game.phase !== "LOBBY" && (
          <div className="flex gap-4">
            {game.players.map((p) => (
              <span
                key={p.id}
                className={`text-sm ${p.id === myId ? "text-lime" : "text-electric-blue"}`}
              >
                {p.name}: {p.score}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="rainbow-divider" />

      {game.phase === "LOBBY" && (
        <Lobby
          roomCode={roomCode}
          players={game.players}
          isHost={isHost}
          onStart={handleStart}
        />
      )}

      {game.phase === "QUESTION" && currentQuestion && (
        <Question
          question={currentQuestion}
          questionNumber={game.currentQuestionIndex + 1}
          totalQuestions={QUESTIONS_PER_GAME}
          questionStartTime={game.questionStartTime}
          selectedChoice={
            myAnswer.questionIndex === game.currentQuestionIndex
              ? myAnswer.choiceIndex
              : null
          }
          onAnswer={handleAnswer}
          onTimeUp={handleTimeUp}
        />
      )}

      {game.phase === "REVEAL" && currentQuestion && (
        <Reveal
          question={currentQuestion}
          result={game.results[game.results.length - 1]}
          players={game.players}
          myId={myId}
        />
      )}

      {game.phase === "RESULTS" && (
        <Results
          players={game.players}
          isHost={isHost}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
