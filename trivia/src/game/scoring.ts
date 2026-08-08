import {
  MAX_POINTS,
  MIN_POINTS,
  QUESTION_TIME_MS,
  type Question,
} from "@/app/data/types";

/**
 * Speed-weighted score. Both timestamps come from the server clock, so a
 * player's device clock cannot inflate their points.
 */
export function calculatePoints(
  answeredAt: number,
  questionStartTime: number,
  isCorrect: boolean,
): number {
  if (!isCorrect) return 0;
  const elapsed = answeredAt - questionStartTime;
  if (elapsed <= 0) return MAX_POINTS;
  if (elapsed >= QUESTION_TIME_MS) return MIN_POINTS;
  const fraction = 1 - elapsed / QUESTION_TIME_MS;
  return Math.round(MIN_POINTS + fraction * (MAX_POINTS - MIN_POINTS));
}

function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Draws `count` questions, preferring ones this room has not seen. Only once
 * the bank is exhausted does the history reset, and it restarts from the
 * questions just drawn so the wrap-around cannot immediately repeat them.
 */
export function pickQuestions(
  bank: readonly Question[],
  count: number,
  usedIds: readonly number[],
): { picked: Question[]; usedIds: number[] } {
  const used = new Set(usedIds);
  const unseen = bank.filter((q) => !used.has(q.id));

  if (unseen.length >= count) {
    const picked = shuffle(unseen).slice(0, count);
    return {
      picked,
      usedIds: [...usedIds, ...picked.map((q) => q.id)],
    };
  }

  // Not enough left for a full game: use what remains, then start a new cycle.
  const picked = [...unseen];
  const remaining = shuffle(bank.filter((q) => used.has(q.id)));
  picked.push(...remaining.slice(0, count - picked.length));

  return { picked: shuffle(picked), usedIds: picked.map((q) => q.id) };
}
