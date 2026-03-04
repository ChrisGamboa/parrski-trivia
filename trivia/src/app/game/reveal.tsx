"use client";

import { useEffect } from "react";
import type {
  Question as QuestionType,
  QuestionResult,
  Player,
} from "@/app/data/types";
import { MascotSpeech } from "@/app/components/mascots";

interface RevealProps {
  question: QuestionType;
  result: QuestionResult;
  players: Player[];
  myId: string;
}

export function Reveal({ question, result, players, myId }: RevealProps) {
  const correctIndex = result.correctIndex;
  const myResult = result.players[myId];
  const isCorrect = myResult && myResult.choiceIndex === correctIndex;

  useEffect(() => {
    if (!isCorrect) {
      const audio = new Audio("/sounds/sad-trombone.mp3");
      audio.play().catch(() => {});
    }
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-2">
        <span className="category-badge">{question.category}</span>
      </div>

      <p className="question-text">{question.question}</p>

      <div className="choice-grid">
        {question.choices.map((choice, i) => {
          let className = `choice-btn choice-btn--${i}`;
          if (i === correctIndex) {
            className += " choice-btn--correct";
          } else {
            const someonePickedThis = Object.values(result.players).some(
              (p) => p.choiceIndex === i,
            );
            if (someonePickedThis) {
              className += " choice-btn--wrong-selected";
            } else {
              className += " choice-btn--wrong";
            }
          }
          return (
            <button key={i} className={className} disabled>
              {choice}
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
            const isMe = player.id === myId;
            return (
              <li key={player.id} className="player-item">
                <span>
                  {player.name} {isMe && "(You)"}
                </span>
                <span className={points > 0 ? "points-earned" : ""}>
                  {points > 0 ? `+${points}` : "0"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {isCorrect ? (
        <MascotSpeech
          mascot="luca"
          text={question.commentary.lucaCorrect}
        />
      ) : (
        <MascotSpeech
          mascot="oliver"
          text={question.commentary.oliverWrong}
        />
      )}
    </div>
  );
}
