"use client";

import { useState, useEffect } from "react";

interface MascotOverlayProps {
  type: "correct" | "wrong";
}

export function MascotOverlay({ type }: MascotOverlayProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="mascot-overlay">
      {type === "correct" ? (
        <img
          src="/images/pickles.png"
          alt="Pickles celebrates!"
          className="mascot-overlay-img pickles-zoom"
        />
      ) : (
        <img
          src="/images/oliver.png"
          alt="Oliver faceplants"
          className="mascot-overlay-img oliver-faceplant"
          style={{ objectPosition: "center 20%" }}
        />
      )}
    </div>
  );
}
