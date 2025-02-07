"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { SwiperOptions, Swiper as SwiperType } from "swiper/types";

import "swiper/css";
import "swiper/css/pagination";

import { useGameStore } from "@/stores/gameStore";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import Image from "next/image";

const INITIAL_INDEX = 2;
const SWIPER_OPTIONS = {
  slidesPerView: 5,
  centeredSlides: true,
  initialSlide: INITIAL_INDEX,
} as SwiperOptions;

const DISPLAY_NAME = {
  bounceBall: "BOUNCE \n BALL",
  tetris: "TETRIS",
  flappyBoo: "Flappy \n boo",
  shooting: "Shoot \n Aliens",
  mineSweeper: "Mine \n sweeper",
} as Record<string, string>;

export default function MainCardContainer() {
  const games = useGameStore((state) => state.games);

  const swiperRef = useRef<SwiperType>(null);
  const [activeIndex, setActiveIndex] = useState(INITIAL_INDEX);
  const [targetIdx, setTargetIdx] = useState<number | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const calculateOffset = (idx: number) => Math.abs(idx - activeIndex);
  const isNegativeOffset = (idx: number) => idx - activeIndex < 0;

  const handleSwiperInit = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    setActiveIndex(swiper.activeIndex ?? 0);
  };

  const handleSlideChange = () => {
    if (swiperRef.current) {
      setActiveIndex(swiperRef.current.activeIndex ?? 0);
      if (swiperRef.current.activeIndex !== targetIdx) {
        setTargetIdx(null);
      }
    }
  };

  const moveSlide = async (nextTarget: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        swiperRef.current?.slideTo(nextTarget);
        setActiveIndex(nextTarget);
        resolve();
      }, 100);
    });
  };

  const handleClickTarget = async (idx: number) => {
    if (!swiperRef.current) return;

    const isUpper = idx > activeIndex;
    let target = activeIndex;

    if (isUpper) {
      while (target < idx) {
        target++;
        await moveSlide(target);
      }
    } else {
      while (target > idx) {
        target--;
        await moveSlide(target);
      }
    }

    setTargetIdx(targetIdx === idx ? null : idx);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (!swiperRef.current) return;
    if (![37, 39, 32, 38, 40].includes(event.keyCode)) return;

    event.preventDefault();
    if (event.keyCode === 37) {
      swiperRef.current.slidePrev();
    } else if (event.keyCode === 39) {
      swiperRef.current.slideNext();
    } else if (event.keyCode === 32 || event.keyCode === 38) {
      setTargetIdx(targetIdx === activeIndex ? null : activeIndex);
    }
  };

  const mouseDownHeader = (event: MouseEvent) => {
    event.preventDefault();
    if (
      targetRef.current &&
      !targetRef.current.contains(event.target as Node)
    ) {
      setTargetIdx(null);
    }
  };

  useEffect(() => {
    if (targetIdx !== null) {
      window.addEventListener("mousedown", mouseDownHeader);
    } else {
      window.removeEventListener("mousedown", mouseDownHeader);
    }
  }, [targetIdx]);

  useEffect(() => {
    document.removeEventListener("keydown", handleKeyPress);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("mousedown", mouseDownHeader);
    };
  }, [activeIndex, targetIdx]);
  return (
    <div
      ref={targetRef}
      className="w-[calc(100%-32px)] max-w-[1200px] h-[41vh] max-h-[400px]"
    >
      <Swiper
        onSwiper={handleSwiperInit}
        onSlideChange={handleSlideChange}
        className="main-swiper w-full"
        {...SWIPER_OPTIONS}
      >
        {games.map((game, idx: number) => (
          <SwiperSlide
            key={game.id}
            className={twMerge(
              "group max-w-[374px] w-full relative flex justify-center",
              calculateOffset(idx) === 1 && "z-20 ",
              calculateOffset(idx) === 2 && "z-10 ",
              idx === activeIndex && "z-30",
              targetIdx === idx && "z-40"
            )}
          >
            <div
              onClick={() => handleClickTarget(idx)}
              className={twMerge(
                "w-full min-w-[370px] h-[516px] cursor-pointer left-1/2 -translate-x-1/2 relative rounded-3xl p-2 font-pixelNes ease-linear bg-white shadow-xl transition-all z-[9] flex items-center justify-center text-2xl font-bold bg-[url(/assets/images/bg/main/main-card-bg.jpg)] bg-no-repeat bg-center bg-cover",
                calculateOffset(idx) === 1 &&
                  (isNegativeOffset(idx)
                    ? "-rotate-6 translate-y-10"
                    : "rotate-6 translate-y-10"),
                calculateOffset(idx) === 2 &&
                  (isNegativeOffset(idx)
                    ? "-rotate-12 translate-y-[140px] "
                    : "rotate-12 translate-y-[140px] "),
                calculateOffset(idx) > 2 &&
                  (isNegativeOffset(idx)
                    ? "-rotate-90 translate-y-96"
                    : "rotate-90 translate-y-96"),
                idx === activeIndex &&
                  "text-point-500 rotate-0 -translate-y-7 ",
                targetIdx === idx && "rotate-0 -translate-y-[300px] scale-110"
              )}
            >
              <div className="w-full flex h-full bg-point-500 rounded-3xl overflow-hidden relative flex-col items-center">
                <img
                  className="w-full h-full object-cover"
                  src={`/assets/images/bg/main/main-card-${game.name}.jpg`}
                  alt={`main-card-${game.name}`}
                />
                <h2 className="text-white absolute text-[50px] text-center top-[60px] leading-[45px]">
                  {DISPLAY_NAME[game.name]}
                </h2>
              </div>
              {targetIdx === idx && (
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 border-2 border-white rounded-full flex items-center justify-center">
                  <Link
                    href={`/game/${game.name}`}
                    className="text-3xl text-white w-[180px] flex items-center justify-center py-3 bg-main-500 transition-all hover:bg-point-500 rounded-full"
                  >
                    Play
                  </Link>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
