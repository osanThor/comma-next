"use client";

import { useGameStore } from "@/stores/gameStore";
import { useEffect, useMemo, useRef } from "react";

export default function MainMarqueeContainer() {
  const marqueeRef = useRef(null);

  const games = useGameStore((state) => state.games);
  const gameTopRankers = useGameStore((state) => state.gameTopRankers);
  const getGameTopRankers = useGameStore((state) => state.getGameTopRankers);

  const rankItems = useMemo(() => {
    return Object.values(gameTopRankers)
      .filter((ranker) => ranker !== null)
      .map((item) => {
        return {
          user: item?.user ?? { name: "Unknown User" },
          game: item?.game ?? { display_name: "Unknown Game" },
        };
      });
  }, [gameTopRankers]);

  const animationMarquee = (selector: string, speed: number) => {
    const parentSelector = document.querySelector(selector);
    if (!parentSelector) return;
    const clone = parentSelector.innerHTML;
    const firstElement = parentSelector.firstElementChild as HTMLUListElement;
    if (!firstElement) return;
    let i = 0;
    parentSelector.insertAdjacentHTML("beforeend", clone);
    parentSelector.insertAdjacentHTML("beforeend", clone);

    const moveItem = () => {
      firstElement.style.marginLeft = `-${i}px`;
      if (i > firstElement.clientWidth) i = 0;
      i += speed;
      requestAnimationFrame(moveItem);
    };
    requestAnimationFrame(moveItem);
  };

  useEffect(() => {
    if (games.length) getGameTopRankers();
    if (games.length && marqueeRef.current) animationMarquee("#marquee", 0.5);
  }, [games]);

  return (
    <div
      ref={marqueeRef}
      id="marquee"
      className="w-full bg-main-500/50 h-[50px] flex items-center"
    >
      <ul className="flex gap-[248px] font-semibold text-white pr-[248px]">
        {rankItems.map((item, idx) => (
          <li className="whitespace-nowrap" key={idx}>
            🎉 {item.user.name}님이 [{item.game.display_name}] 신기록에
            달성하셨습니다.
          </li>
        ))}
      </ul>
    </div>
  );
}
