"use client";

import { memo } from "react";

export const Pickles = memo(function Pickles({
  speaking = false,
  size = "default",
  animated = false,
}: {
  speaking?: boolean;
  size?: "default" | "large";
  animated?: boolean;
}) {
  const sizeClass = size === "large" ? "mascot-avatar--large" : "";
  const speakClass = speaking ? "pickles-speaking" : "";
  const bounceClass = animated ? "pickles-bounce" : "";
  return (
    <div className={`mascot ${bounceClass}`}>
      <div
        className={`mascot-avatar mascot-avatar--pickles ${sizeClass} ${speakClass}`}
      >
        <img
          src="/images/pickles.png"
          alt="Pickles the Pomeranian"
          className="mascot-img"
        />
      </div>
      <span className="mascot-name">Pickles</span>
    </div>
  );
});

export const Oliver = memo(function Oliver({
  speaking = false,
}: {
  speaking?: boolean;
}) {
  return (
    <div className="mascot">
      <div
        className={`mascot-avatar mascot-avatar--oliver ${speaking ? "oliver-speaking" : ""}`}
      >
        <img
          src="/images/oliver.png"
          alt="Oliver the cat"
          className="mascot-img"
          style={{ objectPosition: "center 20%" }}
        />
      </div>
      <span className="mascot-name">Oliver</span>
    </div>
  );
});

export const Luca = memo(function Luca({
  speaking = false,
}: {
  speaking?: boolean;
}) {
  return (
    <div className="mascot">
      <div
        className={`mascot-avatar mascot-avatar--luca ${speaking ? "luca-speaking" : ""}`}
      >
        <img
          src="/images/luca.png"
          alt="Luca the cat"
          className="mascot-img"
        />
      </div>
      <span className="mascot-name">Luca</span>
    </div>
  );
});

interface MascotSpeechProps {
  mascot: "pickles" | "oliver" | "luca";
  text: string;
}

const mascotComponents = {
  pickles: Pickles,
  oliver: Oliver,
  luca: Luca,
};

export const MascotSpeech = memo(function MascotSpeech({
  mascot,
  text,
}: MascotSpeechProps) {
  const MascotComponent = mascotComponents[mascot];
  return (
    <div className="mascot-speech">
      <MascotComponent speaking />
      <div className="speech-bubble">{text}</div>
    </div>
  );
});
