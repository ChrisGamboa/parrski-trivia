import { GameClient } from "@/app/game/game-client";

export function Room({ params }: { params: { code: string } }) {
  return <GameClient roomCode={params.code} />;
}
