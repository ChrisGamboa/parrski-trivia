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
  const canStart = players.length === MAX_PLAYERS;

  return (
    <div className="fade-in">
      <div className="text-center mb-2">
        <h2 className="mb-1">Waiting Room</h2>
        <div className="room-code">{roomCode}</div>
        <p className="mt-1" style={{ color: "var(--electric-blue)" }}>
          Share this code with your opponent!
        </p>
      </div>

      <div className="rainbow-divider" />

      <MascotSpeech
        mascot="pickles"
        text={
          players.length < MAX_PLAYERS
            ? "Waiting for another player to join... *stares at door*"
            : "Both players are here! Let's GET THIS PARTY STARTED!"
        }
      />

      <div className="mt-2">
        <h3 className="mb-1">
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
        <p
          className="text-center mt-2 waiting-dots"
          style={{ color: "var(--yellow)" }}
        >
          Waiting for opponent
        </p>
      )}

      {isHost && canStart && (
        <div className="text-center mt-2">
          <BoomerButton color="lime" onClick={onStart}>
            Start Game!
          </BoomerButton>
        </div>
      )}

      {!isHost && canStart && (
        <p className="text-center mt-2" style={{ color: "var(--yellow)" }}>
          Waiting for host to start the game...
        </p>
      )}
    </div>
  );
}
