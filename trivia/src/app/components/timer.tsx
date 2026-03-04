"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTION_TIME_MS } from "@/app/data/types";

interface TimerProps {
  questionStartTime: number;
  onTimeUp: () => void;
}

export function Timer({ questionStartTime, onTimeUp }: TimerProps) {
  const [remaining, setRemaining] = useState(QUESTION_TIME_MS);
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
  }, [questionStartTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - questionStartTime;
      const left = Math.max(0, QUESTION_TIME_MS - elapsed);
      setRemaining(left);

      if (left <= 0 && !firedRef.current) {
        firedRef.current = true;
        onTimeUp();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [questionStartTime, onTimeUp]);

  const seconds = Math.ceil(remaining / 1000);
  const fraction = remaining / QUESTION_TIME_MS;

  let colorClass = "timer-bar--green";
  if (fraction < 0.25) colorClass = "timer-bar--pink";
  else if (fraction < 0.5) colorClass = "timer-bar--yellow";

  let timerClass = "timer-text";
  if (seconds <= 3) timerClass += " animate-shake";
  else if (seconds <= 5) timerClass += " animate-pulse-custom";

  return (
    <div>
      <div className={timerClass}>{seconds}s</div>
      <div className="timer-bar-container">
        <div
          className={`timer-bar ${colorClass}`}
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
    </div>
  );
}
