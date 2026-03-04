import { MAX_POINTS, QUESTION_TIME_MS } from "@/app/data/types";

export function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function getPlayerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("parrski-player-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("parrski-player-id", id);
  }
  return id;
}

export function getSavedPlayerName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("parrski-player-name") || "";
}

export function savePlayerName(name: string): void {
  localStorage.setItem("parrski-player-name", name);
}

export function calculatePoints(
  answeredAt: number,
  questionStartTime: number,
  isCorrect: boolean,
): number {
  if (!isCorrect) return 0;
  const elapsed = answeredAt - questionStartTime;
  if (elapsed <= 0) return MAX_POINTS;
  if (elapsed >= QUESTION_TIME_MS) return 100;
  const fraction = 1 - elapsed / QUESTION_TIME_MS;
  return Math.round(100 + fraction * (MAX_POINTS - 100));
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickRandomIndices(total: number, count: number): number[] {
  const indices = Array.from({ length: total }, (_, i) => i);
  return shuffle(indices).slice(0, count);
}
