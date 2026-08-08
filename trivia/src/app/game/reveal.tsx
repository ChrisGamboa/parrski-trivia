"use client";

import { memo, useEffect } from "react";

import type { PublicPlayer, PublicQuestion, RoundResult } from "@/app/data/types";
import { MascotSpeech } from "@/app/components/mascots";
import { MascotOverlay } from "@/app/components/mascot-overlay";

interface RevealProps {
  question: PublicQuestion;
  /** Only sent once the round is over — this is where the answer arrives. */
  result: RoundResult;
  players: PublicPlayer[];
  myId: string;
}

export const Reveal = memo(function Reveal({
  question,
  result,
  players,
  myId,
}: RevealProps) {
  const { correctIndex } = result;
  const myResult = result.players[myId];
  const isCorrect = !!myResult && myResult.choiceIndex === correctIndex;

  useEffect(() => {
    if (!isCorrect) {
      const audio = new Audio("/sounds/sad-trombone.mp3");
      audio.play().catch(() => {});
    }
  }, [isCorrect]);

  return (
    <div className="animate-fade-in">
      <MascotOverlay type={isCorrect ? "correct" : "wrong"} />

      <div className="text-center mb-2">
        <span className="category-badge">{question.category}</span>
      </div>

      <p className="question-text">{question.question}</p>

      {question.image && (
        <img src={question.image} alt="" className="question-img" />
      )}

      <div className="choice-grid">
        {question.choices.map((choice, i) => {
          let className = `choice-btn choice-btn--${i}`;
          if (i === correctIndex) {
            className += " choice-btn--correct";
          } else {
            const someonePickedThis = Object.values(result.players).some(
              (p) => p.choiceIndex === i,
            );
            className += someonePickedThis
              ? " choice-btn--wrong-selected"
              : " choice-btn--wrong";
          }
          return (
            <button key={i} className={className} disabled>
              {choice.image && (
                <img src={choice.image} alt={choice.text} className="choice-img" />
              )}
              {choice.text}
              {i === correctIndex && " ✓"}
            </button>
          );
        })}
      </div>

      <div className="rainbow-divider" />

      <div className="mt-2">
        <h3 className="mb-2">Points This Round</h3>
        <ul className="player-list">
          {players.map((player) => {
            const pr = result.players[player.id];
            const points = pr?.points ?? 0;
            const picked = pr?.choiceIndex ?? -1;
            return (
              <li key={player.id} className="player-item">
                <span>
                  {player.name} {player.id === myId && "(You)"}
                  {picked < 0 && (
                    <span className="text-sm text-yellow"> — no answer</span>
                  )}
                </span>
                <span className={points > 0 ? "points-earned" : ""}>
                  {points > 0 ? `+${points}` : "0"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <MascotSpeech
        mascot={isCorrect ? "luca" : "oliver"}
        text={isCorrect ? result.lucaCorrect : result.oliverWrong}
      />
    </div>
  );
});
