"use client";

import { memo, useEffect, useState, type RefObject } from "react";

interface TimerProps {
  /** Server epoch ms when this phase ends. */
  deadline: number;
  /** serverClock - localClock, so a skewed device clock doesn't shift the bar. */
  serverOffset: RefObject<number>;
  totalMs: number;
}

const TICK_MS = 100;

export const Timer = memo(function Timer({
  deadline,
  serverOffset,
  totalMs,
}: TimerProps) {
  const remainingNow = () =>
    Math.max(0, deadline - (Date.now() + serverOffset.current));

  const [remaining, setRemaining] = useState(remainingNow);

  useEffect(() => {
    setRemaining(remainingNow());
    const id = setInterval(() => {
      const left = remainingNow();
      setRemaining(left);
      if (left <= 0) clearInterval(id);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [deadline]);

  const seconds = Math.ceil(remaining / 1000);
  const fraction = totalMs > 0 ? Math.min(1, remaining / totalMs) : 0;

  let timerClass = "timer-text";
  if (seconds <= 3) timerClass += " animate-shake";
  else if (seconds <= 5) timerClass += " animate-pulse-custom";

  let barColor = "timer-bar--green";
  if (fraction <= 0.25) barColor = "timer-bar--pink";
  else if (fraction <= 0.5) barColor = "timer-bar--yellow";

  return (
    <div>
      <div className={timerClass}>{seconds}s</div>
      <div className="timer-bar-container">
        <div
          className={`timer-bar ${barColor}`}
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
    </div>
  );
});
