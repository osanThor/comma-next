"use client";

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SPACESHIP_HEIGHT,
  SPACESHIP_INITIAL_X_OFFSET,
  ENEMY_GENERATION_INTERVALS,
  IMAGE_PATHS,
  SPACESHIP_WIDTH,
} from "@/constants/shooting";
import { Bullet } from "@/classes/shooting/bullet";
import { Enemy } from "@/classes/shooting/enemy";
import useTimer from "@/hooks/timer";
import useBackgroundMusic from "@/classes/shooting/sound";
import { useCallback, useEffect, useRef, useState } from "react";
import formatedTime from "@/utils/formatedTime";
import { generateRandomValue } from "@/classes/shooting/utils";
import { useGameStore } from "@/stores/gameStore";
import { default as NextImage } from "next/image";

export default function ShootingContainer() {
  const updateGamePayload = useGameStore((state) => state.updateGamePayload);

  const { currentTime, start, stop, reset } = useTimer();
  const { playGameMusic, stopAllMusic, setMute } = useBackgroundMusic();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [score, setScore] = useState(0);
  const [playButtonVisible, setPlayButtonVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const spaceshipX = useRef(0);
  const spaceshipY = useRef(0);
  const keysDown = useRef<{ [key: string]: boolean }>({});

  const enemyIntervalId = useRef<NodeJS.Timeout | null>(null);
  const previousIntervalTime = useRef<number | null>(null);
  const requestId = useRef<number | null>(null);

  const images = useRef<{ [key: string]: HTMLImageElement }>({});

  const currentTimeRef = useRef(currentTime);
  const scoreRef = useRef(score);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    const loadImage = (key: string, src: string) => {
      const img = new Image();
      img.src = src;
      images.current[key] = img;
    };

    if (canvasRef.current) {
      canvasRef.current.width = CANVAS_WIDTH;
      canvasRef.current.height = CANVAS_HEIGHT;
      ctxRef.current = canvasRef.current.getContext("2d");

      loadImage("background", IMAGE_PATHS.background);
      loadImage("spaceship", IMAGE_PATHS.spaceship);
      loadImage("bullet", IMAGE_PATHS.bullet);
      loadImage("enemy", IMAGE_PATHS.enemy);
    }
  }, []);

  const createBullet = () => {
    return new Bullet(spaceshipX.current, spaceshipY.current);
  };

  const createEnemy = useCallback(() => {
    let intervalTime = ENEMY_GENERATION_INTERVALS.default;

    const updateEnemyInterval = () => {
      if (enemyIntervalId.current) {
        clearInterval(enemyIntervalId.current);
      }
      enemyIntervalId.current = setInterval(() => {
        new Enemy(generateRandomValue);
      }, intervalTime);
    };

    if (score >= 80) intervalTime = ENEMY_GENERATION_INTERVALS.score80;
    else if (score >= 60) intervalTime = ENEMY_GENERATION_INTERVALS.score60;
    else if (score >= 40) intervalTime = ENEMY_GENERATION_INTERVALS.score40;
    else if (score >= 30) intervalTime = ENEMY_GENERATION_INTERVALS.score30;
    else if (score >= 20) intervalTime = ENEMY_GENERATION_INTERVALS.score20;

    if (intervalTime !== previousIntervalTime.current) {
      previousIntervalTime.current = intervalTime;
      updateEnemyInterval();
    }

    updateEnemyInterval();
  }, [score]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    setMute(!isMuted);
  };

  const update = (deltaTime: number) => {
    const spaceshipSpeed = 500;

    if (keysDown.current["ArrowRight"]) {
      spaceshipX.current += spaceshipSpeed * deltaTime;
    }
    if (keysDown.current["ArrowLeft"]) {
      spaceshipX.current -= spaceshipSpeed * deltaTime;
    }

    if (spaceshipX.current <= 0) spaceshipX.current = 0;
    if (spaceshipX.current >= CANVAS_WIDTH - SPACESHIP_WIDTH) {
      spaceshipX.current = CANVAS_WIDTH - SPACESHIP_WIDTH;
    }

    Bullet.bulletList.forEach((bullet) => {
      if (bullet.alive) {
        bullet.update(deltaTime);
        bullet.checkHit(Enemy.enemyList, setScore);
      }
    });

    Enemy.enemyList.forEach((enemy) => enemy.update(deltaTime));
  };

  const render = () => {
    const ctx = ctxRef.current;
    if (!ctx || !canvasRef.current) return;

    ctx.drawImage(
      images.current["background"],
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
    ctx.drawImage(
      images.current["spaceship"],
      spaceshipX.current,
      spaceshipY.current
    );

    ctx.fillStyle = "white";
    ctx.font = "20px arial";
    ctx.fillText(`PLAY TIME: ${formatedTime(currentTimeRef.current)}`, 160, 20);
    ctx.fillText(`SCORE: ${scoreRef.current}`, 20, 20);

    Bullet.bulletList.forEach((bullet) => {
      if (bullet.alive) {
        ctx.drawImage(images.current["bullet"], bullet.x, bullet.y);
      }
    });

    Enemy.enemyList.forEach((enemy) => {
      ctx.drawImage(images.current["enemy"], enemy.x, enemy.y);
    });
  };

  let lastFrameTime = 0;

  const main = (timestamp: number = 0) => {
    if (!lastFrameTime) lastFrameTime = timestamp;
    const deltaTime = (timestamp - lastFrameTime) / 1000;
    lastFrameTime = timestamp;

    if (!Enemy.isGameOver) {
      update(deltaTime);
      render();
      requestId.current = requestAnimationFrame(main);
    } else {
      stop();
      stopAllMusic();
      console.log("gameOver", scoreRef.current, currentTimeRef.current);
      updateGamePayload({
        score: scoreRef.current,
        playTime: currentTimeRef.current,
      });
      resetGame();
      if (requestId.current) cancelAnimationFrame(requestId.current);
    }
  };

  const startGame = () => {
    setPlayButtonVisible(false);
    playGameMusic();

    spaceshipX.current = CANVAS_WIDTH / 2 - SPACESHIP_INITIAL_X_OFFSET;
    spaceshipY.current = CANVAS_HEIGHT - SPACESHIP_HEIGHT;

    setupKeyboardListener();
    createEnemy();
    start();
    main();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    keysDown.current[event.key] = true;
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    event.preventDefault();
    delete keysDown.current[event.key];
    if (event.key === " ") {
      createBullet();
    }
  };

  const setupKeyboardListener = () => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
  };

  const resetGame = () => {
    setScore(0);
    setPlayButtonVisible(true);
    Enemy.isGameOver = false;
    Enemy.enemyList = [];
    Bullet.bulletList = [];

    spaceshipX.current = CANVAS_WIDTH / 2 - SPACESHIP_INITIAL_X_OFFSET;
    spaceshipY.current = CANVAS_HEIGHT - SPACESHIP_HEIGHT;

    stop();
    reset();
    stopAllMusic();

    if (ctxRef.current) {
      ctxRef.current.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    if (enemyIntervalId.current) clearInterval(enemyIntervalId.current);
    if (requestId.current) cancelAnimationFrame(requestId.current);
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
  };

  useEffect(() => {
    resetGame();
    return () => {
      resetGame();
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-cover bg-center bg-[url(/assets/images/bg/shoot-bg.png)]">
      <div
        className="relative w-[500px] h-[700px] mx-auto transition-all"
        style={{
          boxShadow: !playButtonVisible
            ? "0 0 7px #fff, 0 0 10px rgb(0, 100, 200), 0 0 21px rgb(0, 100, 200)"
            : "",
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
        {playButtonVisible && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <h1
              className="text-center text-6xl font-bold text-white font-pixelNes mb-8"
              style={{
                textShadow: `0 0 10px rgba(255, 255, 255, 0.9),
          0 0 20px rgba(168, 85, 247, 0.8), 0 0 30px rgba(147, 51, 234, 0.6),
          0 0 40px rgba(168, 85, 247, 0.4), 2px 2px 2px rgba(0, 0, 0, 0.5)`,
              }}
            >
              <span>SHOOT</span>
              <br />
              <span>ALIENS</span>
            </h1>
            <button
              onClick={startGame}
              // @click="startGame"
              className="w-[160px] h-[68px] overflow-hidden rounded-full transition-transform duration-200 hover:scale-105"
            >
              <NextImage
                src="/assets/images/game/tetris/play.png"
                alt="play button image"
                className="mt-[-44px]"
                width={160}
                height={160}
              />
            </button>
          </div>
        )}
        <button
          onClick={toggleMute}
          onKeyDown={(e) => {
            e.preventDefault();
          }}
          className="absolute top-0 right-1 focus:outline-none"
        >
          <img
            src={
              isMuted
                ? "/assets/images/game/shooting/mute.png"
                : "/assets/images/game/shooting/sound.png"
            }
            alt="Sound Mute Button"
          />
        </button>
      </div>
    </div>
  );
}
