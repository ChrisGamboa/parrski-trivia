"use client";

import { memo, useEffect, useRef, useState } from "react";
import { QUESTION_TIME_MS } from "@/app/data/types";

interface TimerProps {
  questionStartTime: number;
  onTimeUp: () => void;
}

export const Timer = memo(function Timer({
  questionStartTime,
  onTimeUp,
}: TimerProps) {
  const [seconds, setSeconds] = useState(Math.ceil(QUESTION_TIME_MS / 1000));
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
    const totalSeconds = Math.ceil(QUESTION_TIME_MS / 1000);
    setSeconds(totalSeconds);

    // Single timeout for onTimeUp
    const timeout = setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true;
        onTimeUp();
      }
    }, QUESTION_TIME_MS);

    // 1s interval for countdown text
    const interval = setInterval(() => {
      const elapsed = Date.now() - questionStartTime;
      const left = Math.max(0, QUESTION_TIME_MS - elapsed);
      setSeconds(Math.ceil(left / 1000));
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [questionStartTime, onTimeUp]);

  let timerClass = "timer-text";
  if (seconds <= 3) timerClass += " animate-shake";
  else if (seconds <= 5) timerClass += " animate-pulse-custom";

  return (
    <div>
      <div className={timerClass}>{seconds}s</div>
      <div className="timer-bar-container">
        <div
          className="timer-bar timer-bar--animated"
          key={questionStartTime}
          style={{ animationDuration: `${QUESTION_TIME_MS}ms` }}
        />
      </div>
    </div>
  );
});
