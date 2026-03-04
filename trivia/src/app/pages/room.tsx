"use client";

import { lazy, Suspense } from "react";

const GameClient = lazy(() => import("@/app/game/game-client"));

export function Room({ params }: { params: { code: string } }) {
  return (
    <Suspense
      fallback={
        <div className="boomer-container text-center mt-8">
          <h2>Loading...</h2>
        </div>
      }
    >
      <GameClient roomCode={params.code} />
    </Suspense>
  );
}
