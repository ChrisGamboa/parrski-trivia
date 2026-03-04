"use client";

import styles from "./mascots.module.css";

export function Pickles({ speaking = false, size = "default" }: { speaking?: boolean; size?: "default" | "large" }) {
  const sizeClass = size === "large" ? styles.mascotAvatarLarge : "";
  return (
    <div className={styles.mascot}>
      <div
        className={`${styles.mascotAvatar} ${styles["mascotAvatar--pickles"]} ${sizeClass} ${speaking ? styles.picklesSpeaking : ""}`}
      >
        <img
          src="/images/pickles.png"
          alt="Pickles the Pomeranian"
          className={styles.picklesImg}
        />
      </div>
      <span className={styles.mascotName}>Pickles</span>
    </div>
  );
}

export function Oliver({ speaking: _speaking = false }: { speaking?: boolean }) {
  return (
    <div className={styles.mascot}>
      <div className={`${styles.mascotAvatar} ${styles["mascotAvatar--oliver"]}`}>
        <span>🐈‍⬛</span>
      </div>
      <span className={styles.mascotName}>Oliver</span>
    </div>
  );
}

export function Luca({ speaking: _speaking = false }: { speaking?: boolean }) {
  return (
    <div className={styles.mascot}>
      <div className={`${styles.mascotAvatar} ${styles["mascotAvatar--luca"]}`}>
        <span>🐈</span>
      </div>
      <span className={styles.mascotName}>Luca</span>
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
    <div className={styles.mascotSpeechContainer}>
      <MascotComponent speaking={isSpeaking} />
      <div className={styles.speechBubble}>{text}</div>
    </div>
  );
}
