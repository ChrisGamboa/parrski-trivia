"use client";

import { memo } from "react";

import type { BettingCard } from "@/app/data/types";
import { MascotSpeech } from "@/app/components/mascots";

interface BettingInterstitialProps {
  /** Already resolved to player names by the server, so every client agrees. */
  betting: BettingCard;
  category: string;
  questionNumber: number;
  totalQuestions: number;
}

export const BettingInterstitial = memo(function BettingInterstitial({
  betting,
  category,
  questionNumber,
  totalQuestions,
}: BettingInterstitialProps) {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <span className="category-badge">{category}</span>
        <span className="text-electric-blue">
          Question {questionNumber} / {totalQuestions}
        </span>
      </div>

      <h3 className="text-center mb-4">The mascots are placing their bets...</h3>
      <MascotSpeech mascot="oliver" text={betting.oliver} />
      <MascotSpeech mascot="luca" text={betting.luca} />
    </div>
  );
});
