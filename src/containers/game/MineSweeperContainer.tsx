"use client";

import useTimer from "@/hooks/timer";
import { useGameStore } from "@/stores/gameStore";
import formatedTime from "@/utils/formatedTime";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Cell {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacentMines: number;
  isHovered: boolean;
}

const ROWS = 16;
const COLS = 24;
const MINE_COUNT = 30;
const REMAIN_TIME = 600000; // 10 minutes in ms

export default function MineSweeperContainer() {
  const updateGamePayload = useGameStore((state) => state.updateGamePayload);

  const { currentTime, start, stop, reset } = useTimer();

  const score = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false); // 🚀 깜빡이는 상태 저장
  const [showVictory, setShowVictory] = useState(false);

  const timeOutRef = useRef<NodeJS.Timeout>(null);
  const [revealedList, setRevealedList] = useState<number[]>([]);

  const [flagCount, setFlagCount] = useState(MINE_COUNT);
  const cells = useRef<Cell[]>(
    Array.from({ length: ROWS * COLS }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacentMines: 0,
      isHovered: false,
    }))
  );

  const gridStyle = {
    gridTemplateRows: `repeat(${ROWS}, 1fr)`,
    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
  };

  const resetGame = () => {
    reset();
    setIsPlaying(false);
    setIsGameOver(false);
    setShowVictory(false);
    setFlagCount(MINE_COUNT);
    setRevealedList([]);
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
      timeOutRef.current = null;
    }

    cells.current.splice(
      0,
      cells.current.length,
      ...Array.from({ length: ROWS * COLS }, () => ({
        mine: false,
        revealed: false,
        flagged: false,
        adjacentMines: 0,
        isHovered: false,
      }))
    );
    placeMines();
    calculateAdjacentMines();
  };

  const toggleHover = (index: number, hoverState: boolean) => {
    cells.current[index].isHovered = hoverState;
  };

  const placeMines = () => {
    let placedMines = 0;
    while (placedMines < MINE_COUNT) {
      const index = Math.floor(Math.random() * (ROWS * COLS));
      const row = Math.floor(index / COLS);
      const col = index % COLS;
      if (
        !cells.current[index].mine &&
        row >= 0 &&
        row < ROWS &&
        col >= 0 &&
        col < COLS
      ) {
        cells.current[index].mine = true;
        placedMines++;
      }
    }
  };
  const revealAllMines = () => {
    setIsGameOver(true);
    const mineCells = cells.current
      .map((cell, index) => ({ cell, index }))
      .filter(({ cell }) => cell.mine);

    mineCells.forEach((item, i) => {
      setTimeout(() => {
        setRevealedList((prev) => [...prev, item.index]);
      }, (2000 / mineCells.length) * i);
    });
  };
  const calculateAdjacentMines = () => {
    const directions = [
      -1,
      1,
      -COLS,
      COLS,
      -COLS - 1,
      -COLS + 1,
      COLS - 1,
      COLS + 1,
    ];

    cells.current.forEach((cell, index) => {
      if (cell.mine) return;
      let count = 0;
      directions.forEach((dir) => {
        const neighborIndex = index + dir;
        const neighborRow = Math.floor(neighborIndex / COLS);
        const currentRow = Math.floor(index / COLS);
        const neighborCol = neighborIndex % COLS;
        const currentCol = index % COLS;
        if (
          neighborIndex >= 0 &&
          neighborIndex < ROWS * COLS &&
          Math.abs(neighborRow - currentRow) <= 1 &&
          Math.abs(neighborCol - currentCol) <= 1 &&
          cells.current[neighborIndex]?.mine
        ) {
          count++;
        }
      });
      cell.adjacentMines = count;
    });
  };

  const revealCell = (index: number) => {
    if (isGameOver || cells.current[index].flagged) return;
    if (showVictory && !isPlaying) return;
    if (!isPlaying) {
      start();
      setIsPlaying(true);
    }

    const cell = cells.current[index];
    cell.revealed = true;

    if (cell.mine) {
      setIsPlaying(false);
      stop();
      revealAllMines();

      score.current = 0;
      timeOutRef.current = setTimeout(() => {
        console.log("gameOver", score.current, currentTime);
        updateGamePayload({ score: score.current, playTime: currentTime });
      }, 3000);
      return;
    }

    if (cell.adjacentMines === 0) {
      revealAdjacentCells(index);
    }
  };

  const revealAdjacentCells = (index: number) => {
    const directions = [
      -1,
      1,
      -COLS,
      COLS,
      -COLS - 1,
      -COLS + 1,
      COLS - 1,
      COLS + 1,
    ];
    directions.forEach((dir) => {
      const neighborIndex = index + dir;
      if (neighborIndex >= 0 && neighborIndex < ROWS * COLS) {
        const neighbor = cells.current[neighborIndex];
        if (!neighbor.revealed && !neighbor.mine) {
          revealCell(neighborIndex);
        }
      }
    });
  };

  const toggleFlag = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    if (isGameOver || cells.current[index].revealed) return;

    if (!cells.current[index].flagged) {
      // 깃발 추가
      if (flagCount > 0) {
        cells.current[index].flagged = true;
        setFlagCount((prev) => prev - 1);
      }
    } else {
      // 깃발 제거
      cells.current[index].flagged = false;
      setFlagCount((prev) => prev + 1);
    }
    checkVictory();
  };

  const checkVictory = () => {
    const allMinesFlagged = cells.current.every((cell) =>
      cell.mine ? cell.flagged : true
    );
    if (allMinesFlagged) {
      setIsPlaying(false);
      stop();

      score.current = Math.round(REMAIN_TIME - currentTime);
      // 🚀 Victory 애니메이션
      setShowVictory(true);

      timeOutRef.current = setTimeout(() => {
        setShowVictory(false);
        console.log("gameOver", score.current, currentTime);
        updateGamePayload({ score: score.current, playTime: currentTime });
        // emits("open-game-over", account.score, currentTime.value);
      }, 3000);
    }
  };

  useEffect(() => {
    const targetTime = REMAIN_TIME - currentTime;
    if (targetTime <= 10000) {
      setIsBlinking(true);
      if (targetTime <= 0) {
        stop();
        score.current = 0;
        setIsGameOver(true);
        console.log("gameOver", score.current, currentTime);
        updateGamePayload({ score: score.current, playTime: currentTime });
      }
    } else {
      setIsBlinking(false);
    }
  }, [currentTime]);

  useEffect(() => {
    resetGame();
    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
        timeOutRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div
        id="min-sweeper"
        className="w-full h-full bg-[url(/assets/images/bg/mineSweeper-bg.jpg)] bg-cover bg-center bg-no-repeat font-pixelNes flex flex-col items-center"
      >
        <div id="app" className="text-center mt-20 w-[calc(full-60px)]">
          <div className="flex justify-between">
            <span className="text-white items-start">
              TIME :{" "}
              <span className={isBlinking ? "blinking" : ""} id="time">
                {formatedTime(REMAIN_TIME - currentTime)}
              </span>
            </span>
            <span className="text-white text-right items-end">
              🚩 : {flagCount}
            </span>
          </div>

          <div className="flex justify-center items-start mt-4 w-full">
            <div className="grid-container">
              <div className="grid" style={gridStyle}>
                {cells.current.map((cell, idx) => (
                  <div
                    key={idx}
                    className={twMerge(
                      "cell flex items-center justify-center border border-gray-300",
                      cell.revealed && !cell.mine && "bg-gray-200",
                      cell.mine && cell.revealed && "bg-red-400",
                      !cell.revealed && "bg-gray-400",
                      cell.revealed &&
                        cell.adjacentMines > 0 &&
                        "text-gray-800",
                      !cell.revealed && "cursor-pointer",
                      cell.revealed && "cursor-default",
                      cell.isHovered && !cell.revealed && "bg-gray-600"
                    )}
                    onClick={() => revealCell(idx)}
                    onContextMenu={(e) => toggleFlag(e, idx)}
                    onMouseOver={() => toggleHover(idx, true)}
                    onMouseLeave={() => toggleHover(idx, false)}
                  >
                    {cell.revealed && !cell.mine && cell.adjacentMines > 0 && (
                      <span>{cell.adjacentMines}</span>
                    )}
                    {cell.flagged && !cell.revealed && <span>🚩</span>}
                    {cell.mine && cell.revealed && <span>💣</span>}
                    {cell.mine && revealedList.includes(idx) && <span>💣</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={resetGame}
            // @click="resetGame"
            className="mt-8 px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-700 font-pixelNes text-xl w-40"
          >
            RESTART
          </button>
        </div>

        {showVictory && <div className="victory-message">🎉 Victory! 🎉</div>}
        {/* <transition name="fade">
          <div v-if="showVictory" className="victory-message">
            🎉 Victory! 🎉
          </div>
        </transition> */}
      </div>
    </>
  );
}
