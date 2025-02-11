export function useBackgroundMusic() {
  const gameMusic = new Audio("/assets/sounds/shooting-game-music.mp3");

  gameMusic.loop = true;
  gameMusic.volume = 0.5;

  const playGameMusic = () => {
    gameMusic.play();
  };

  const stopAllMusic = () => {
    gameMusic.pause();
    gameMusic.currentTime = 0;
  };

  const setMute = (isMuted) => {
    gameMusic.muted = isMuted;
  };

  return {
    playGameMusic,
    stopAllMusic,
    setMute,
  };
}
