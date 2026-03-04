"use client";

import { memo } from "react";
import type { Player } from "@/app/data/types";
import { MascotSpeech } from "@/app/components/mascots";

interface BettingInterstitialProps {
  bettingLines: { oliver: string; luca: string };
  players: Player[];
  questionNumber: number;
}

export const BettingInterstitial = memo(function BettingInterstitial({
  bettingLines,
  players,
  questionNumber,
}: BettingInterstitialProps) {
  const oliverPlayerIndex = questionNumber % 2;
  const lucaPlayerIndex = (questionNumber + 1) % 2;

  const oliverPlayer = players[oliverPlayerIndex] ?? players[0];
  const lucaPlayer = players[lucaPlayerIndex] ?? players[0];

  const oliverText = bettingLines.oliver.replace(/PLAYER/g, oliverPlayer.name);
  const lucaText = bettingLines.luca.replace(/PLAYER/g, lucaPlayer.name);

  return (
    <div className="animate-fade-in">
      <h3 className="text-center mb-4">The mascots are placing their bets...</h3>
      <MascotSpeech mascot="oliver" text={oliverText} />
      <MascotSpeech mascot="luca" text={lucaText} />
    </div>
  );
});
