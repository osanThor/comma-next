"use client";

import useTimer from "@/hooks/timer";
import formatedTime from "@/utils/formatedTime";
import { useEffect, useRef, useState } from "react";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  INITIAL_BALL_DX,
  INITIAL_BALL_DY,
  SPEED_INCREASE,
  BALL_SIZE,
} from "@/constants/bounceBall";

export default function BounceBallContainer() {
  const [paddlePosition, setPaddlePosition] = useState(GAME_WIDTH / 2 - 50);
  const [ballX, setBallX] = useState(GAME_WIDTH / 2);
  const [ballY, setBallY] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const paddlePositionRef = useRef(GAME_WIDTH / 2 - 50);
  const ballXRef = useRef(GAME_WIDTH / 2);
  const ballYRef = useRef(50);
  const ballDx = useRef(INITIAL_BALL_DX());
  const ballDy = useRef(INITIAL_BALL_DY);

  const isPlayingRef = useRef(false);

  const { currentTime, start, stop } = useTimer();
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastTime = useRef<number>(0);
  const paddleCollisionProcessed = useRef<boolean>(false);

  const ballSound = useRef<HTMLAudioElement>(null);
  const paddleSound = useRef<HTMLAudioElement>(null);
  const laserSound = useRef<HTMLAudioElement>(null);

  // 3. updateBall 함수 수정
  const updateBall = (timeStamp: number) => {
    if (!isPlayingRef.current) return;

    const deltaTime = lastTime.current
      ? (timeStamp - lastTime.current) / 1000
      : 0;
    lastTime.current = timeStamp;

    ballXRef.current = ballXRef.current + ballDx.current * deltaTime;
    setBallX((prev) => prev + ballDx.current * deltaTime);
    ballYRef.current = ballYRef.current + ballDy.current * deltaTime;
    setBallY((prev) => prev + ballDy.current * deltaTime);

    if (ballYRef.current >= GAME_HEIGHT) {
      setIsGameOver(true);
      setIsPlaying(false);
      stop();
      lastTime.current = 0;

      if (laserSound.current) {
        laserSound.current.currentTime = 0;
        laserSound.current.play().catch(console.error);
      }

      return;
    }

    // 좌우 벽 충돌
    if (ballXRef.current <= 0) {
      ballXRef.current = 0; // 왼쪽 벽에서 위치 보정
      setBallX(0);
      ballDx.current = -ballDx.current;
    } else if (ballXRef.current >= GAME_WIDTH - BALL_SIZE) {
      ballXRef.current = GAME_WIDTH - BALL_SIZE; // 오른쪽 벽에서 위치 보정
      setBallX(GAME_WIDTH - BALL_SIZE);
      ballDx.current = -ballDx.current;
    }

    // 상단 벽 충돌 부분 수정
    if (ballYRef.current <= 0) {
      ballYRef.current = 0; // Y좌표 보정
      setBallY(0);
      ballDy.current = -ballDy.current;

      // 최소 Y속도 보장 (전체 속도의 30% 이상)
      const currentSpeed = Math.sqrt(ballDx.current ** 2 + ballDy.current ** 2);
      const minYSpeed = currentSpeed * 0.3;

      if (Math.abs(ballDy.current) < minYSpeed) {
        // Y속도가 너무 작으면 보정
        ballDy.current = Math.sign(ballDy.current) * minYSpeed;
        // X속도도 함께 보정하여 전체 속도 유지
        const newXSpeed = Math.sqrt(currentSpeed ** 2 - minYSpeed ** 2);
        ballDx.current = Math.sign(ballDx.current) * newXSpeed;
      }
    }
    // 패들 충돌이 없는 경우 플래그 초기화
    if (
      ballYRef.current < GAME_HEIGHT - 85 ||
      ballYRef.current > GAME_HEIGHT - 55
    ) {
      paddleCollisionProcessed.current = false;
    }
    // 패들 충돌 검사에 플래그 조건 추가
    if (
      !paddleCollisionProcessed.current &&
      ballYRef.current >= GAME_HEIGHT - 85 &&
      ballYRef.current <= GAME_HEIGHT - 55 &&
      ballXRef.current + BALL_SIZE >= paddlePositionRef.current &&
      ballXRef.current <= paddlePositionRef.current + 100
    ) {
      paddleCollisionProcessed.current = true;
      if (ballSound.current) {
        ballSound.current.currentTime = 0;
        ballSound.current.play().catch(console.error);
      }
      setScore((prev) => prev + 50);

      const currentSpeed = Math.sqrt(ballDx.current ** 2 + ballDy.current ** 2);
      const newSpeed = currentSpeed + SPEED_INCREASE;

      let angle =
        Math.atan2(-ballDy.current, ballDx.current) +
        ((Math.random() - 0.5) * Math.PI) / 3;

      const minAngle = Math.PI / 9;
      if (Math.abs(angle) < minAngle) {
        angle = angle >= 0 ? minAngle : -minAngle;
      }
      if (Math.abs(Math.PI - Math.abs(angle)) < minAngle) {
        angle = angle >= 0 ? Math.PI - minAngle : -Math.PI + minAngle;
      }

      ballDx.current = Math.cos(angle) * newSpeed;
      ballDy.current = -Math.abs(Math.sin(angle) * newSpeed);
    }

    animationFrameId.current = requestAnimationFrame(updateBall);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying) return;
    const rect = gameContainerRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      setPaddlePosition(Math.max(0, Math.min(mouseX - 50, GAME_WIDTH - 100)));
      paddlePositionRef.current = Math.max(
        0,
        Math.min(mouseX - 50, GAME_WIDTH - 100)
      );
    }
  };

  // 4. cleanupGame 함수 수정
  const cleanupGame = () => {
    if (animationFrameId && animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    lastTime.current = 0;
    stop();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlayingRef.current) {
      cleanupGame();
    } else {
      if (!animationFrameId || !animationFrameId.current) {
        ballDx.current = INITIAL_BALL_DX();
        ballDy.current = INITIAL_BALL_DY;
      }
      setIsPlaying(true);
      isPlayingRef.current = true;
      start();
      animationFrameId.current = requestAnimationFrame(updateBall);
    }
  };

  useEffect(() => {
    if (ballSound.current && paddleSound.current && laserSound.current) {
      ballSound.current.preload = "auto";
      ballSound.current.load();
      paddleSound.current.preload = "auto";
      paddleSound.current.load();
      laserSound.current.preload = "auto";
      laserSound.current.load();
    }
  }, []);

  useEffect(() => {
    if (isGameOver) console.log("gameOver", score, currentTime);
  }, [isGameOver, score]);

  useEffect(() => {
    const handleMouseMoveEvent = (e: MouseEvent) =>
      handleMouseMove(e as unknown as React.MouseEvent<HTMLDivElement>);

    gameContainerRef.current?.addEventListener(
      "mousemove",
      handleMouseMoveEvent
    );
    return () => {
      gameContainerRef.current?.removeEventListener(
        "mousemove",
        handleMouseMoveEvent
      );
    };
  }, [isPlaying]);

  return (
    <div className="w-full h-full bg-[url(/assets/images/bg/bounceBallBg.jpg)] bg-cover bg-center bg-no-repeat py-4 px-10 flex items-center justify-center">
      <audio ref={ballSound} src="/assets/sounds/ball.mp3" hidden />
      <audio ref={paddleSound} src="/assets/sounds/paddle.mp3" hidden />
      <audio ref={laserSound} src="/assets/sounds/laserthing.mp3" hidden />
      <div
        ref={gameContainerRef}
        // ref="gameContainerRef"
        className="game-container w-[500px] h-[700px] relative bg-[url(/assets/images/game/bounceBall/bounceBallBg.png)] backdrop-blur-sm rounded-lg"
        style={{
          boxShadow:
            "0 0 7px #fff, 0 0 10px rgb(0, 100, 200), 0 0 21px rgb(0, 100, 200)",
        }}
      >
        <div className="absolute top-6 left-4">
          {currentTime && (
            <div className="text-[20px] font-pixelNes text-white">
              {formatedTime(currentTime)}
            </div>
          )}
        </div>
        <div className="absolute top-6 right-4">
          <div className="text-[20px] font-pixelNes text-white">{score}</div>
        </div>
        <div
          className="absolute w-[20px] h-[20px]"
          style={{
            left: `${ballX}px`,
            top: `${ballY}px`,
            backgroundImage: "url(/assets/images/game/bounceBall/sprites.png)",
            backgroundPosition: "-115px -15px",
            backgroundSize: "250px 150px",
            imageRendering: "pixelated",
            boxShadow:
              "0 0 15px 5px rgba(255, 255, 0, 0.3), 0 0 30px 10px rgba(255, 200, 0, 0.2)",
            borderRadius: "50%",
          }}
        ></div>
        <div
          className="absolute bottom-[50px] w-[100px] h-[10px]"
          style={{
            left: `${paddlePosition}px`,
            backgroundImage: "url(/assets/images/game/bounceBall/sprites.png)",
            backgroundPosition: "-125px -120px",
            backgroundSize: "250px 150px",
            boxShadow:
              "0 0 15px 5px rgba(147, 51, 234, 0.3), 0 0 30px 10px rgba(168, 85, 247, 0.2)",
            imageRendering: "pixelated",
            borderRadius: "5px",
          }}
        ></div>
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
            <div className="flex flex-col items-center mt-24">
              <h1
                className="flex flex-col items-center text-6xl font-bold text-white font-pixelNes gap-0"
                style={{
                  textShadow: `0 0 10px rgba(255, 255, 255, 0.9),
            0 0 20px rgba(168, 85, 247, 0.8),
            0 0 30px rgba(147, 51, 234, 0.6),
            0 0 40px rgba(168, 85, 247, 0.4), 2px 2px 2px rgba(0, 0, 0, 0.5)`,
                }}
              >
                <span>BOUNCE</span>
                <span className="-mt-2">BALL</span>
              </h1>
              <button
                onClick={togglePlay}
                className="w-[150px] h-[150px] transition-transform duration-200 hover:scale-105"
              >
                <img
                  src="/assets/images/game/tetris/play.png"
                  alt="게임 시작"
                  className="w-full h-full object-contain"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
