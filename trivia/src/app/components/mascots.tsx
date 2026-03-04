"use client";

import styles from "./mascots.module.css";

// PHOTO SLOT: Replace emoji spans with <img> tags pointing to real pet photos
// e.g. <img src="/images/pickles.jpg" alt="Pickles the Pomeranian" />

export function Pickles() {
  return (
    <div className={styles.mascot}>
      <div className={`${styles.mascotAvatar} ${styles["mascotAvatar--pickles"]}`}>
        <span>🐕</span>
      </div>
      <span className={styles.mascotName}>Pickles</span>
    </div>
  );
}

export function Oliver() {
  return (
    <div className={styles.mascot}>
      <div className={`${styles.mascotAvatar} ${styles["mascotAvatar--oliver"]}`}>
        <span>🐈‍⬛</span>
      </div>
      <span className={styles.mascotName}>Oliver</span>
    </div>
  );
}

export function Luca() {
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
  return (
    <div className={styles.mascotSpeechContainer}>
      <MascotComponent />
      <div className={styles.speechBubble}>{text}</div>
    </div>
  );
}
