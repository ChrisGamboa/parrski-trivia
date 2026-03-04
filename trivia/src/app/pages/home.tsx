"use client";

import { useState } from "react";
import { Pickles } from "@/app/components/mascots";
import { BoomerButton } from "@/app/components/boomer-button";
import {
  generateRoomCode,
  getSavedPlayerName,
  savePlayerName,
} from "@/app/shared/utils";

export const Home = () => {
  const [name, setName] = useState(getSavedPlayerName);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  function handleCreate() {
    if (!name.trim()) {
      setError("Enter your name first!");
      return;
    }
    savePlayerName(name.trim());
    const code = generateRoomCode();
    window.location.href = `/room/${code}`;
  }

  function handleJoin() {
    if (!name.trim()) {
      setError("Enter your name first!");
      return;
    }
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 4 || !/^[A-Z]{4}$/.test(code)) {
      setError("Room code must be 4 letters!");
      return;
    }
    savePlayerName(name.trim());
    window.location.href = `/room/${code}`;
  }

  return (
    <div className="boomer-container">
      <div className="marquee-banner">
        <span className="marquee-text">
          WELCOME TO PARRSKI TRIVIA --- HOSTED BY PICKLES THE POMERANIAN ---
          WITH OLIVER AND LUCA ON COMMENTARY --- ARE YOU SMARTER THAN A
          POMERANIAN? --- PROBABLY NOT ---
        </span>
      </div>

      <div className="text-center mb-4">
        <h1>PARRSKI TRIVIA</h1>
        <p className="text-electric-blue text-lg">
          A Boomer-Coded Trivia Faceoff
        </p>
      </div>

      <div className="text-center mb-4">
        <Pickles />
      </div>

      <div className="rainbow-divider" />

      <div className="boomer-card">
        <h3 className="mb-2">What's Your Name?</h3>
        <input
          className="boomer-input"
          type="text"
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          maxLength={20}
        />
      </div>

      <div className="boomer-card">
        <h3 className="mb-2">Create a Room</h3>
        <p className="mb-2 text-lime">
          Start a new game and invite a friend!
        </p>
        <BoomerButton color="pink" onClick={handleCreate}>
          Create Room
        </BoomerButton>
      </div>

      <div className="boomer-card">
        <h3 className="mb-2">Join a Room</h3>
        <div className="flex gap-4 items-center flex-wrap">
          <input
            className="boomer-input boomer-input--code"
            type="text"
            placeholder="CODE"
            value={joinCode}
            onChange={(e) => {
              setJoinCode(e.target.value.toUpperCase().slice(0, 4));
              setError("");
            }}
            maxLength={4}
          />
          <BoomerButton color="lime" onClick={handleJoin}>
            Join
          </BoomerButton>
        </div>
      </div>

      {error && (
        <div className="boomer-card text-center text-red border-red">
          {error}
        </div>
      )}
    </div>
  );
};
