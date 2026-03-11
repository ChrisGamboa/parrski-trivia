"use client";

import { Player, MAX_PLAYERS } from "@/app/data/types";
import { MascotSpeech } from "@/app/components/mascots";
import { BoomerButton } from "@/app/components/boomer-button";

interface LobbyProps {
  roomCode: string;
  players: Player[];
  isHost: boolean;
  onStart: () => void;
}

export function Lobby({ roomCode, players, isHost, onStart }: LobbyProps) {
  const canStart = players.length >= 2;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-4">
        <h2 className="mb-2">Waiting Room</h2>
        <div className="room-code">{roomCode}</div>
        <p className="mt-2 text-electric-blue">
          Share this code with your friends!
        </p>
      </div>

      <div className="rainbow-divider" />

      <MascotSpeech
        mascot="pickles"
        text={
          players.length < 2
            ? "Waiting for more players to join... *stares at door*"
            : "Everyone's here! Let's GET THIS PARTY STARTED!"
        }
      />

      <div className="mt-4">
        <h3 className="mb-2">
          Players ({players.length}/{MAX_PLAYERS})
        </h3>
        <ul className="player-list">
          {players.map((p, i) => (
            <li
              key={p.id}
              className={`player-item ${i === 0 ? "player-item--host" : ""}`}
            >
              <span>
                {p.name} {i === 0 && "(Host)"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {!canStart && (
        <p className="text-center mt-4 text-yellow waiting-dots">
          Waiting for players
        </p>
      )}

      {isHost && canStart && (
        <div className="text-center mt-4">
          <BoomerButton color="lime" onClick={onStart}>
            Start Game!
          </BoomerButton>
        </div>
      )}

      {!isHost && canStart && (
        <p className="text-center mt-4 text-yellow">
          Waiting for host to start the game...
        </p>
      )}
    </div>
  );
}
