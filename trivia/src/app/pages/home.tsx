"use client";

import { useSyncedState } from "rwsdk/use-synced-state/client";

export const Home = () => {
  const [count, setCount] = useSyncedState("counter", 0);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Parrski Trivia</h1>
      <p>Shared counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
