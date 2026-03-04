"use client";

export function Pickles({ speaking = false, size = "default", animated = false }: { speaking?: boolean; size?: "default" | "large"; animated?: boolean }) {
  const sizeClass = size === "large" ? "mascot-avatar--large" : "";
  const speakClass = speaking ? "pickles-speaking" : "";
  const bounceClass = animated ? "pickles-bounce" : "";
  return (
    <div className={`mascot ${bounceClass}`}>
      <div className={`mascot-avatar mascot-avatar--pickles ${sizeClass} ${speakClass}`}>
        <img
          src="/images/pickles.png"
          alt="Pickles the Pomeranian"
          className="mascot-img"
        />
      </div>
      <span className="mascot-name">Pickles</span>
    </div>
  );
}

export function Oliver({ speaking: _speaking = false }: { speaking?: boolean }) {
  return (
    <div className="mascot">
      <div className="mascot-avatar mascot-avatar--oliver">
        <img src="/images/oliver.png" alt="Oliver the cat" className="mascot-img" />
      </div>
      <span className="mascot-name">Oliver</span>
    </div>
  );
}

export function Luca({ speaking: _speaking = false }: { speaking?: boolean }) {
  return (
    <div className="mascot">
      <div className="mascot-avatar mascot-avatar--luca">
        <img src="/images/luca.png" alt="Luca the cat" className="mascot-img" />
      </div>
      <span className="mascot-name">Luca</span>
    </div>
  );
}

interface MascotSpeechProps {
  mascot: "pickles" | "oliver" | "luca";
  text: string;
}

const mascotComponents = {
  pickles: Pickles,
  oliver: Oliver,
  luca: Luca,
};

export function MascotSpeech({ mascot, text }: MascotSpeechProps) {
  const MascotComponent = mascotComponents[mascot];
  const isSpeaking = mascot === "pickles";
  return (
    <div className="mascot-speech">
      <MascotComponent speaking={isSpeaking} />
      <div className="speech-bubble">{text}</div>
    </div>
  );
}
