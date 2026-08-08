"use client";

import { MAX_PLAYERS, MIN_PLAYERS, type PublicPlayer } from "@/app/data/types";
import { MascotSpeech } from "@/app/components/mascots";
import { BoomerButton } from "@/app/components/boomer-button";

interface LobbyProps {
  roomCode: string;
  players: PublicPlayer[];
  hostId: string;
  isHost: boolean;
  busy: boolean;
  onStart: () => void;
}

export function Lobby({
  roomCode,
  players,
  hostId,
  isHost,
  busy,
  onStart,
}: LobbyProps) {
  const canStart = players.length >= MIN_PLAYERS;

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
          canStart
            ? "Everyone's here! Let's GET THIS PARTY STARTED!"
            : "Waiting for more players to join... *stares at door*"
        }
      />

      <div className="mt-4">
        <h3 className="mb-2">
          Players ({players.length}/{MAX_PLAYERS})
        </h3>
        <ul className="player-list">
          {players.map((p) => (
            <li
              key={p.id}
              className={`player-item ${p.id === hostId ? "player-item--host" : ""}`}
            >
              <span>
                {p.name} {p.id === hostId && "(Host)"}
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
          <BoomerButton color="lime" onClick={onStart} disabled={busy}>
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
