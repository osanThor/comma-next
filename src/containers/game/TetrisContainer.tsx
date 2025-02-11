"use client";

import useTimer from "@/hooks/timer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  COLS,
  BLOCK_SIZE,
  ROWS,
  KEY,
  POINTS,
  LEVEL,
  ROTATION,
} from "@/constants/tetris";
import Board from "@/classes/tetris/board";
import Sound from "@/classes/tetris/sound";
import Piece from "@/classes/tetris/piece";
import formatedTime from "@/utils/formatedTime";

export default function TetrisContainer() {
  const { currentTime, start, stop, reset } = useTimer();

  const [account, setAccount] = useState({ score: 0, level: 0, lines: 0 });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const accountRef = useRef(account);

  const requestId = useRef<number>(null);
  const time = useRef({
    start: 0,
    elapsed: 0,
    level: 0,
  });

  const ctx = useRef<CanvasRenderingContext2D>(null);
  const board = useRef<Board>(null);

  const sound = useRef<Sound>(null);
  const backgroundSound = useRef<HTMLAudioElement>(null);
  const movesSound = useRef<HTMLAudioElement>(null);
  const dropSound = useRef<HTMLAudioElement>(null);
  const pointsSound = useRef<HTMLAudioElement>(null);
  const finishSound = useRef<HTMLAudioElement>(null);

  const moves = {
    [KEY.LEFT]: (p: Piece) => ({ ...p, x: p.x - 1 }),
    [KEY.RIGHT]: (p: Piece) => ({ ...p, x: p.x + 1 }),
    [KEY.DOWN]: (p: Piece) => ({ ...p, y: p.y + 1 }),
    [KEY.SPACE]: (p: Piece) => ({ ...p, y: p.y + 1 }),
    [KEY.UP]: (p: Piece) =>
      board.current && board.current.rotate(p, ROTATION.RIGHT),
    [KEY.Q]: (p: Piece) =>
      board.current && board.current.rotate(p, ROTATION.LEFT),
  } as { [key: number]: (p: Piece) => Piece };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (!board.current) return;
    if (event.keyCode === KEY.P) {
      pause();
    }
    if (event.keyCode === KEY.ESC) {
      gameOver();
    } else if (moves[event.keyCode]) {
      event.preventDefault();
      let p = moves[event.keyCode](board.current.piece) as Piece;
      if (event.keyCode === KEY.SPACE) {
        if (isPlaying && dropSound.current) {
          dropSound.current.play();
        } else {
          return;
        }

        while (board.current.valid(p)) {
          setAccount((prev) => ({
            ...prev,
            score: prev.score + POINTS.SOFT_DROP,
          }));
          board.current.piece.move(p);
          p = moves[KEY.DOWN](board.current.piece) as Piece;
        }
        board.current.piece.hardDrop();
      } else if (board.current.valid(p)) {
        if (isPlaying && movesSound.current) {
          movesSound.current.play();
        }
        board.current.piece.move(p);
        if (event.keyCode === KEY.DOWN && isPlaying) {
          setAccount((prev) => ({
            ...prev,
            score: prev.score + POINTS.SOFT_DROP,
          }));
        }
      }
    }
  };

  const resetGame = () => {
    setAccount({
      score: 0,
      lines: 0,
      level: 0,
    });
    if (board.current) board.current.reset();
    time.current = {
      start: performance.now(),
      elapsed: 0,
      level: LEVEL[account.level],
    };
    reset();
  };

  const play = () => {
    if (!isPlaying && !isPaused) {
      resetGame();
    }

    if (requestId.current) {
      cancelAnimationFrame(requestId.current);
    }

    animate();
    setIsPlaying(true);
    setIsGameOver(false);
    document.addEventListener("keydown", handleKeyPress);
    if (isPaused) setIsPaused(false);
    if (backgroundSound.current) backgroundSound.current.play();
    start();
  };

  const pause = () => {
    if (!backgroundSound.current || !ctx.current || !sound.current) return;
    if (!requestId || !requestId.current) {
      setIsPlaying(true);
      animate();
      backgroundSound.current.play();
      return;
    }

    cancelAnimationFrame(requestId.current);
    requestId.current = null;

    ctx.current.fillStyle = "rgb(29 23 63 / 0.8)";
    ctx.current.fillRect(0, 2.55, 10, 2.7);
    ctx.current.font = "1px Pixel_NES";
    ctx.current.fillStyle = "white";
    ctx.current.fillText("PAUSED", 2.7, 4.1);
    setIsPlaying(false);
    setIsPaused(true);
    sound.current.pause();
    stop();
  };

  const animate = (now = 0) => {
    if (!board.current || !ctx.current || !pointsSound.current) return;
    time.current.elapsed = now - time.current.start;
    if (time.current.elapsed > time.current.level) {
      time.current.start = now;
      if (
        !board.current.drop(
          moves,
          accountRef.current,
          setAccount,
          time,
          pointsSound.current
        )
      ) {
        gameOver();
        return;
      }
    }

    ctx.current.clearRect(
      0,
      0,
      ctx.current.canvas.width,
      ctx.current.canvas.height
    );

    board.current.draw();
    requestId.current = requestAnimationFrame(animate);
  };

  const handleClickPlay = isPlaying ? pause : play;

  const gameOver = () => {
    if (
      !ctx.current ||
      !requestId.current ||
      !sound.current ||
      !finishSound.current
    )
      return;
    cancelAnimationFrame(requestId.current);

    ctx.current.fillStyle = "black";
    ctx.current.fillRect(1.2, 3, 8, 1.2);
    ctx.current.font = "1px Pixel_NES";
    ctx.current.fillStyle = "red";
    ctx.current.fillText("GAME OVER", 1.8, 4);

    sound.current.pause();
    finishSound.current.play();
    stop();

    setIsPlaying(false);
    setIsPlaying(false);
    setIsGameOver(true);
    // emit("open-game-over", account.score, currentTime.value);
  };

  useEffect(() => {
    const canvas = document.getElementById("board") as HTMLCanvasElement;
    const ctxIns = canvas.getContext("2d");
    const canvasNext = document.getElementById("next") as HTMLCanvasElement;
    const ctxNext = canvasNext.getContext("2d");

    if (!ctxIns || !ctxNext) return;
    ctxIns.canvas.width = COLS * BLOCK_SIZE;
    ctxIns.canvas.height = ROWS * BLOCK_SIZE;
    ctxIns.scale(BLOCK_SIZE, BLOCK_SIZE);

    ctxNext.canvas.width = 4 * BLOCK_SIZE;
    ctxNext.canvas.height = 4 * BLOCK_SIZE;
    ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);

    const boardIns = new Board(ctxIns, ctxNext);
    ctx.current = ctxIns;
    board.current = boardIns;

    const soundEl = new Sound(
      document.querySelector("#sound-div") as HTMLElement
    );
    (backgroundSound.current = soundEl.create(
      "/assets/sounds/Dungeon_Theme.mp3",
      "background_sound",
      true
    )),
      (movesSound.current = soundEl.create(
        "/assets/sounds/moves.mp3",
        "moves_sound"
      )),
      (dropSound.current = soundEl.create(
        "/assets/sounds/drop.mp3",
        "drop_sound"
      )),
      (pointsSound.current = soundEl.create(
        "/assets/sounds/points.mp3",
        "points_sound"
      )),
      (finishSound.current = soundEl.create(
        "/assets/sounds/finish.mp3",
        "finish_sound"
      ));
    soundEl.muteToggle();
    soundEl.soundSetting();
    sound.current = soundEl;
  }, []);

  useEffect(() => {
    accountRef.current = account;
  }, [account]);

  useEffect(() => {
    if (isGameOver) {
      console.log("gameOver", account.score, currentTime);
    }
  }, [isGameOver, account, currentTime]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="w-full h-full bg-[url(/assets/images/bg/tetris-bg.jpg)] bg-cover bg-center bg-no-repeat py-4 px-10 font-pixelNes flex flex-col items-center gap-4">
      <h2 className="font-pixelNes text-white text-3xl">TETRIS</h2>
      <div className="tetris-grid">
        <div className="flex flex-col"></div>
        <div className="w-full flex flex-col items-center">
          <canvas
            id="board"
            className="tetris-game-board border-2 border-white rounded-lg  bg-main-500/50 backdrop-blur-sm"
          ></canvas>
        </div>
        <div className="flex flex-col justify-between text-white">
          <div className="flex flex-col gap-3 text-xl pl-3">
            <p>
              Score:
              <span id="score" className="bg-main-500/80 p-1 rounded-lg">
                {account.score}
              </span>
            </p>
            <p>
              Lines:
              <span id="lines" className="bg-main-500/80 p-1 rounded-lg">
                {account.lines}
              </span>
            </p>
            <p>
              Level:
              <span id="level" className="bg-main-500/80 p-1 rounded-lg">
                {account.level}
              </span>
            </p>
            <p>
              PlayTime: <br />
              <span id="time" className="bg-main-500/80 p-1 rounded-lg">
                {formatedTime(currentTime)}
              </span>
            </p>
            <div id="sound-div">
              <span className="cursor-pointer" id="sound-speaker"></span>
              <span className="cursor-pointer" id="sound-description"></span>
            </div>
            <canvas id="next" className="next"></canvas>
          </div>
          <div id="sound-div">
            <span className="cursor-pointer" id="sound-speaker"></span>
            <span className="cursor-pointer" id="sound-description"></span>
          </div>
          <button
            onClick={handleClickPlay}
            className={twMerge(
              "p-4 h-10 text-white rounded-full bg-center bg-cover bg-no-repeat focus:outline-none",
              isPlaying
                ? "bg-[url(/assets/images/game/tetris/pause.png)]"
                : "bg-[url(/assets/images/game/tetris/play.png)]"
            )}
          >
            <span className="sr-only">play button</span>
          </button>
        </div>
      </div>
    </div>
  );
}
