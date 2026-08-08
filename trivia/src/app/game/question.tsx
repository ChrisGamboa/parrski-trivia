"use client";

import { memo } from "react";

import { QUESTION_TIME_MS } from "@/app/data/types";
import type { Choice, PublicPlayer, PublicQuestion } from "@/app/data/types";
import { Timer } from "@/app/components/timer";
import { MascotSpeech } from "@/app/components/mascots";

interface QuestionProps {
  question: PublicQuestion;
  questionNumber: number;
  totalQuestions: number;
  deadline: number;
  serverOffset: React.RefObject<number>;
  myChoice: number | null;
  iAnswered: boolean;
  players: PublicPlayer[];
  answeredIds: string[];
  onAnswer: (choiceIndex: number) => void;
}

const ChoiceButton = memo(function ChoiceButton({
  choice,
  index,
  selected,
  disabled,
  onAnswer,
}: {
  choice: Choice;
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
      {choice.image && (
        <img src={choice.image} alt={choice.text} className="choice-img" />
      )}
      {choice.text}
    </button>
  );
});

export const Question = memo(function Question({
  question,
  questionNumber,
  totalQuestions,
  deadline,
  serverOffset,
  myChoice,
  iAnswered,
  players,
  answeredIds,
  onAnswer,
}: QuestionProps) {
  const waitingOn = players.filter((p) => !answeredIds.includes(p.id));

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <span className="category-badge">{question.category}</span>
        <span className="text-electric-blue">
          Question {questionNumber} / {totalQuestions}
        </span>
      </div>

      <Timer
        deadline={deadline}
        serverOffset={serverOffset}
        totalMs={QUESTION_TIME_MS}
      />

      <MascotSpeech mascot="pickles" text={question.picklesIntro} />

      <p className="question-text">{question.question}</p>

      {question.image && (
        <img src={question.image} alt="" className="question-img" />
      )}

      <div className="choice-grid">
        {question.choices.map((choice, i) => (
          <ChoiceButton
            key={i}
            choice={choice}
            index={i}
            selected={myChoice === i}
            disabled={iAnswered}
            onAnswer={onAnswer}
          />
        ))}
      </div>

      {iAnswered && (
        <p className="text-center mt-4 animate-pulse-custom text-yellow">
          {waitingOn.length === 0
            ? "Locked in!"
            : `Locked in! Waiting for ${waitingOn.map((p) => p.name).join(", ")}...`}
        </p>
      )}
    </div>
  );
});
