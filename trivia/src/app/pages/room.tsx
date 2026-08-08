"use client";

import { lazy, Suspense } from "react";

const GameClient = lazy(() => import("@/app/game/game-client"));

export function Room({ params }: { params: { code: string } }) {
  // The API only accepts A-Z, so a hand-typed lowercase link still works.
  const roomCode = (params.code ?? "").toUpperCase();

  return (
    <Suspense
      fallback={
        <div className="boomer-container text-center mt-8">
          <h2>Loading...</h2>
        </div>
      }
    >
      <GameClient roomCode={roomCode} />
    </Suspense>
  );
}
