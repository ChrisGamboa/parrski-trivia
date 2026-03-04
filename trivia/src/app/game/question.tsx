"use client";

import { memo, useState, useEffect } from "react";
import type { Question as QuestionType, Player } from "@/app/data/types";
import { Timer } from "@/app/components/timer";
import { MascotSpeech } from "@/app/components/mascots";
import { BettingInterstitial } from "./betting-interstitial";

interface QuestionProps {
  question: QuestionType;
  questionNumber: number;
  totalQuestions: number;
  questionStartTime: number;
  selectedChoice: number | null;
  onAnswer: (choiceIndex: number) => void;
  onTimeUp: () => void;
  players: Player[];
}

const ChoiceButton = memo(function ChoiceButton({
  choice,
  index,
  selected,
  disabled,
  onAnswer,
}: {
  choice: string;
  index: number;
  selected: boolean;
  disabled: boolean;
  onAnswer: (choiceIndex: number) => void;
}) {
  let className = `choice-btn choice-btn--${index}`;
  if (selected) className += " choice-btn--selected";
  return (
    <button
      className={className}
      onClick={() => onAnswer(index)}
      disabled={disabled}
    >
      {choice}
    </button>
  );
});

export const Question = memo(function Question({
  question,
  questionNumber,
  totalQuestions,
  questionStartTime,
  selectedChoice,
  onAnswer,
  onTimeUp,
  players,
}: QuestionProps) {
  const [showBetting, setShowBetting] = useState(true);

  useEffect(() => {
    setShowBetting(true);
    const timer = setTimeout(() => setShowBetting(false), 7500);
    return () => clearTimeout(timer);
  }, [questionNumber]);

  if (showBetting) {
    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-2">
          <span className="category-badge">{question.category}</span>
          <span className="text-electric-blue">
            Question {questionNumber} / {totalQuestions}
          </span>
        </div>

        <Timer questionStartTime={questionStartTime} onTimeUp={onTimeUp} />

        <BettingInterstitial
          bettingLines={question.commentary.bettingLines}
          players={players}
          questionNumber={questionNumber}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <span className="category-badge">{question.category}</span>
        <span className="text-electric-blue">
          Question {questionNumber} / {totalQuestions}
        </span>
      </div>

      <Timer questionStartTime={questionStartTime} onTimeUp={onTimeUp} />

      <MascotSpeech mascot="pickles" text={question.commentary.picklesIntro} />

      <p className="question-text">{question.question}</p>

      <div className="choice-grid">
        {question.choices.map((choice, i) => (
          <ChoiceButton
            key={i}
            choice={choice}
            index={i}
            selected={selectedChoice === i}
            disabled={selectedChoice !== null}
            onAnswer={onAnswer}
          />
        ))}
      </div>

      {selectedChoice !== null && (
        <p className="text-center mt-4 animate-pulse-custom text-yellow">
          Locked in! Waiting for opponent...
        </p>
      )}
    </div>
  );
});
