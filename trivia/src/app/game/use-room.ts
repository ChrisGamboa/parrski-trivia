"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSyncedState } from "rwsdk/use-synced-state/client";

import type { PublicGameState } from "@/app/data/types";

/**
 * Backstop poll. The Durable Object pushes every change through synced state,
 * so this only has to cover a dropped socket or a broadcast that failed.
 */
const POLL_MS = 5000;

export class RoomError extends Error {}

async function post(
  roomCode: string,
  action: string,
  body: Record<string, unknown>,
): Promise<PublicGameState> {
  const res = await fetch(`/api/room/${roomCode}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new RoomError(
      (data as { error?: string })?.error ?? "Something went wrong.",
    );
  }
  return data as PublicGameState;
}

export function useRoom(roomCode: string, myId: string) {
  const [game, setGame] = useState<PublicGameState | null>(null);

  // Difference between the server's clock and ours. Every duration the UI
  // shows is derived through this, so a skewed device clock can't desync the
  // countdown from the round the server is actually running.
  const serverOffset = useRef(0);
  const version = useRef(-1);

  const apply = useCallback((next: PublicGameState | null) => {
    if (!next) return;
    if (next.version < version.current) return;
    version.current = next.version;
    if (next.serverNow) serverOffset.current = next.serverNow - Date.now();
    setGame(next);
  }, []);

  // Push channel: the room DO writes public state here on every transition.
  const [synced] = useSyncedState<PublicGameState | null>(
    null,
    "game",
    roomCode,
  );

  useEffect(() => {
    apply(synced);
  }, [synced, apply]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/room/${roomCode}/state`);
      if (res.ok) apply((await res.json()) as PublicGameState);
    } catch {
      // Offline or mid-reconnect; the next poll will pick it up.
    }
  }, [roomCode, apply]);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  const join = useCallback(
    (name: string) => post(roomCode, "join", { playerId: myId, name }).then(apply),
    [roomCode, myId, apply],
  );

  const start = useCallback(
    () => post(roomCode, "start", { playerId: myId }).then(apply),
    [roomCode, myId, apply],
  );

  const answer = useCallback(
    (questionNumber: number, choiceIndex: number) =>
      post(roomCode, "answer", {
        playerId: myId,
        questionNumber,
        choiceIndex,
      }).then(apply),
    [roomCode, myId, apply],
  );

  /**
   * Fire-and-forget seat release for a closing tab. Only safe to call from the
   * lobby: mid-game it would drop a player out of a round they're still in.
   */
  const leaveBeacon = useCallback(() => {
    const body = JSON.stringify({ playerId: myId });
    navigator.sendBeacon?.(
      `/api/room/${roomCode}/leave`,
      new Blob([body], { type: "application/json" }),
    );
  }, [roomCode, myId]);

  return { game, serverOffset, join, start, answer, refresh, leaveBeacon };
}
