"use client";

import type { Question as QuestionType } from "@/app/data/types";
import { Timer } from "@/app/components/timer";
import { MascotSpeech } from "@/app/components/mascots";

interface QuestionProps {
  question: QuestionType;
  questionNumber: number;
  totalQuestions: number;
  questionStartTime: number;
  selectedChoice: number | null;
  onAnswer: (choiceIndex: number) => void;
  onTimeUp: () => void;
}

export function Question({
  question,
  questionNumber,
  totalQuestions,
  questionStartTime,
  selectedChoice,
  onAnswer,
  onTimeUp,
}: QuestionProps) {
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-1">
        <span className="category-badge">{question.category}</span>
        <span style={{ color: "var(--electric-blue)" }}>
          Question {questionNumber} / {totalQuestions}
        </span>
      </div>

      <Timer questionStartTime={questionStartTime} onTimeUp={onTimeUp} />

      <MascotSpeech mascot="pickles" text={question.commentary.picklesIntro} />

      <p className="question-text mt-2">{question.question}</p>

      <div className="choice-grid">
        {question.choices.map((choice, i) => {
          let className = `choice-btn choice-btn--${i}`;
          if (selectedChoice === i) className += " choice-btn--selected";
          return (
            <button
              key={i}
              className={className}
              onClick={() => onAnswer(i)}
              disabled={selectedChoice !== null}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {selectedChoice !== null && (
        <p className="text-center mt-2 pulse" style={{ color: "var(--yellow)" }}>
          Locked in! Waiting for opponent...
        </p>
      )}
    </div>
  );
}
