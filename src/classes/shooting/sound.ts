"use client";

import { useRef, useEffect } from "react";

export default function useBackgroundMusic() {
  const gameMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gameMusicRef.current = new Audio(
        "/assets/sounds/shooting-game-music.mp3"
      );
      gameMusicRef.current.loop = true;
      gameMusicRef.current.volume = 0.5;
    }
  }, []);

  const playGameMusic = () => {
    gameMusicRef.current?.play();
  };

  const stopAllMusic = () => {
    if (gameMusicRef.current) {
      gameMusicRef.current.pause();
      gameMusicRef.current.currentTime = 0;
    }
  };

  const setMute = (isMuted: boolean) => {
    if (gameMusicRef.current) {
      gameMusicRef.current.muted = isMuted;
    }
  };

  return {
    playGameMusic,
    stopAllMusic,
    setMute,
  };
}
