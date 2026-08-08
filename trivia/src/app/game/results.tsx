"use client";

import type { PublicPlayer } from "@/app/data/types";
import { MascotSpeech } from "@/app/components/mascots";
import { BoomerButton } from "@/app/components/boomer-button";

interface ResultsProps {
  players: PublicPlayer[];
  isHost: boolean;
  busy: boolean;
  onPlayAgain: () => void;
}

function list(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export function Results({ players, isHost, busy, onPlayAgain }: ResultsProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const topScore = sorted[0]?.score ?? 0;
  const winners = sorted.filter((p) => p.score === topScore);
  const isTie = winners.length > 1;
  const winnerNames = list(winners.map((p) => p.name));

  const picklesVerdict = isTie
    ? `IT'S A ${winners.length}-WAY TIE?! ${winnerNames} are ALL winners! Or all losers! I can't decide! *confused spinning*`
    : `${winnerNames} WINS! What a CHAMPION! I'm so proud I could BARK! *barks 47 times*`;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-4">
        <h1>GAME OVER!</h1>
        <p className="winner-text mt-2">
          {isTie ? `It's a tie — ${winnerNames}!` : `${winnerNames} Wins!`}
        </p>
      </div>

      <div className="rainbow-divider" />

      <div className="mt-4">
        <h3 className="mb-2 text-center">Final Scores</h3>
        <ul className="player-list">
          {sorted.map((player) => (
            <li key={player.id} className="player-item">
              <span>
                {player.score === topScore && !isTie ? "👑 " : ""}
                {player.name}
              </span>
              <span className="score-big">{player.score}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <MascotSpeech mascot="pickles" text={picklesVerdict} />
      </div>

      <div className="text-center mt-4">
        {isHost ? (
          <BoomerButton color="pink" onClick={onPlayAgain} disabled={busy}>
            Play Again!
          </BoomerButton>
        ) : (
          <p className="text-yellow">Waiting for host to start a new game...</p>
        )}
      </div>
    </div>
  );
}
