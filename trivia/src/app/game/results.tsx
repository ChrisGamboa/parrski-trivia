"use client";

import type { Player } from "@/app/data/types";
import { MascotSpeech } from "@/app/components/mascots";
import { BoomerButton } from "@/app/components/boomer-button";

interface ResultsProps {
  players: Player[];
  isHost: boolean;
  onPlayAgain: () => void;
}

export function Results({ players, isHost, onPlayAgain }: ResultsProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const isTie = sorted.length > 1 && sorted[0].score === sorted[1].score;

  let picklesVerdict: string;
  if (isTie) {
    picklesVerdict =
      "IT'S A TIE?! You're BOTH winners! Or both losers! I can't decide! *confused spinning*";
  } else {
    picklesVerdict = `${winner.name} WINS! What a CHAMPION! I'm so proud I could BARK! *barks 47 times*`;
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-4">
        <h1>GAME OVER!</h1>
        {isTie ? (
          <p className="winner-text mt-2">It's a TIE!</p>
        ) : (
          <p className="winner-text mt-2">{winner.name} Wins!</p>
        )}
      </div>

      <div className="rainbow-divider" />

      <div className="mt-4">
        <h3 className="mb-2 text-center">Final Scores</h3>
        <ul className="player-list">
          {sorted.map((player, i) => (
            <li key={player.id} className="player-item">
              <span>
                {i === 0 && !isTie ? "👑 " : ""}
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
          <BoomerButton color="pink" onClick={onPlayAgain}>
            Play Again!
          </BoomerButton>
        ) : (
          <p className="text-yellow">
            Waiting for host to start a new game...
          </p>
        )}
      </div>
    </div>
  );
}
