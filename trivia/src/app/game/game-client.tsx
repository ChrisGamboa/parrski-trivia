"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { MAX_PLAYERS } from "@/app/data/types";
import { getPlayerId, getSavedPlayerName, savePlayerName } from "@/app/shared/utils";
import { useRoom } from "./use-room";
import { Lobby } from "./lobby";
import { Question as QuestionView } from "./question";
import { BettingInterstitial } from "./betting-interstitial";
import { Reveal } from "./reveal";
import { Results } from "./results";

export default function GameClient({ roomCode }: { roomCode: string }) {
  const myId = useRef(getPlayerId()).current;
  const { game, serverOffset, join, start, answer, leaveBeacon } = useRoom(
    roomCode,
    myId,
  );

  const [nameInput, setNameInput] = useState(getSavedPlayerName);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // What we picked this round. The server only tells everyone *that* a player
  // has answered, never what they chose, so our own choice is tracked here
  // until the reveal.
  const [myPick, setMyPick] = useState<{
    questionNumber: number;
    choiceIndex: number;
  } | null>(null);

  const joined = !!game?.players.some((p) => p.id === myId);
  const isHost = game?.hostId === myId;

  const run = useCallback(async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }, []);

  function handleJoin() {
    const name = nameInput.trim();
    if (!name) {
      setError("Enter your name!");
      return;
    }
    savePlayerName(name);
    void run(() => join(name));
  }

  const handleAnswer = useCallback(
    (choiceIndex: number) => {
      if (!game || game.phase !== "QUESTION") return;
      if (game.answeredIds.includes(myId)) return;
      setMyPick({ questionNumber: game.questionNumber, choiceIndex });
      void run(() => answer(game.questionNumber, choiceIndex));
    },
    [game, myId, answer, run],
  );

  // Release the seat if the tab closes while we're still in the lobby, so a
  // host who wanders off doesn't strand the room with a game nobody can start.
  const inLobby = game?.phase === "LOBBY";
  useEffect(() => {
    if (!joined || !inLobby) return;
    window.addEventListener("pagehide", leaveBeacon);
    return () => window.removeEventListener("pagehide", leaveBeacon);
  }, [joined, inLobby, leaveBeacon]);

  // Drop a stale pick once the round moves on.
  useEffect(() => {
    if (game && myPick && myPick.questionNumber !== game.questionNumber) {
      setMyPick(null);
    }
  }, [game?.questionNumber]);

  if (!game) {
    return (
      <div className="boomer-container text-center mt-8">
        <h2 className="waiting-dots">Connecting</h2>
      </div>
    );
  }

  /* --------------------------------------------------------------------- */
  /* Join screen                                                            */
  /* --------------------------------------------------------------------- */

  if (!joined) {
    const full = game.players.length >= MAX_PLAYERS;
    const running = game.phase !== "LOBBY";

    return (
      <div className="boomer-container">
        <div className="text-center mb-4">
          <h1>PARRSKI TRIVIA</h1>
          <div className="room-code mt-2">{roomCode}</div>
        </div>

        <div className="rainbow-divider" />

        {full || running ? (
          <div className="boomer-card text-center">
            <h2 className="text-red">{full ? "Room Full!" : "Game In Progress"}</h2>
            <p className="mt-2">
              {full
                ? `This room already has ${MAX_PLAYERS} players.`
                : "This round has already started. Hang tight or start your own room."}
            </p>
            <a href="/" className="text-electric-blue inline-block mt-4">
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
                disabled={busy}
              >
                Join Game
              </button>
            </div>
            {error && <p className="mt-2 text-red">{error}</p>}
          </div>
        )}
      </div>
    );
  }

  /* --------------------------------------------------------------------- */
  /* In the game                                                            */
  /* --------------------------------------------------------------------- */

  const myChoice =
    myPick?.questionNumber === game.questionNumber ? myPick.choiceIndex : null;

  return (
    <div className="boomer-container">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
        <h2 className="text-xl">PARRSKI TRIVIA</h2>
        {game.phase !== "LOBBY" && (
          <div className="flex gap-4 flex-wrap">
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
          hostId={game.hostId}
          isHost={!!isHost}
          busy={busy}
          onStart={() => void run(start)}
        />
      )}

      {game.phase === "BETTING" && game.betting && (
        <BettingInterstitial
          betting={game.betting}
          category={game.question?.category ?? ""}
          questionNumber={game.questionNumber}
          totalQuestions={game.totalQuestions}
        />
      )}

      {game.phase === "QUESTION" && game.question && (
        <QuestionView
          question={game.question}
          questionNumber={game.questionNumber}
          totalQuestions={game.totalQuestions}
          deadline={game.deadline}
          serverOffset={serverOffset}
          myChoice={myChoice}
          iAnswered={game.answeredIds.includes(myId)}
          players={game.players}
          answeredIds={game.answeredIds}
          onAnswer={handleAnswer}
        />
      )}

      {game.phase === "REVEAL" && game.question && game.result && (
        <Reveal
          // Remount per round, so the sting and the mascot overlay replay
          // instead of staying spent after the first reveal.
          key={game.questionNumber}
          question={game.question}
          result={game.result}
          players={game.players}
          myId={myId}
        />
      )}

      {game.phase === "RESULTS" && (
        <Results
          players={game.players}
          isHost={!!isHost}
          busy={busy}
          onPlayAgain={() => void run(start)}
        />
      )}

      {error && <p className="mt-4 text-center text-red">{error}</p>}
    </div>
  );
}
