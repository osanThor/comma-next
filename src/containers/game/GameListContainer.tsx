"use client";

import CommentIcon from "@/components/common/icons/CommentIcon";
import PlayIcon from "@/components/common/icons/PlayIcon";
import { getPostsByCategory } from "@/services/post.service";
import { useGameStore } from "@/stores/gameStore";
import formatedCount from "@/utils/formatedCount";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  gameName: string;
};

export default function GameListContainer({ gameName }: Props) {
  const games = useGameStore((state) => state.games);
  const getGamesData = useGameStore((state) => state.getGamesData);
  const getGameTopRankers = useGameStore((state) => state.getGameTopRankers);
  const gameTopRankers = useGameStore((state) => state.gameTopRankers);

  const [postCounts, setPostCounts] = useState<{
    [key: string]: number;
  }>({
    bounceBall: 0,
    mineSweeper: 0,
    flappyBoo: 0,
    tetris: 0,
    shooting: 0,
  });

  const getPostCount = async (category: string) => {
    try {
      const data = await getPostsByCategory(category, "desc", 1, 1);
      if (data) {
        setPostCounts((prev) => ({
          ...prev,
          [category]: data.totalCount,
        }));
      }
    } catch (err) {
      console.error(`${category} 게시글 수 로딩 실패:`, err);
    }
  };

  const filtedGames = games
    .filter((game) => game.name !== gameName)
    .map((game) => ({
      ...game,
      bestScore: gameTopRankers[game.name]?.score || 0,
    }));

  useEffect(() => {
    const handleInit = async () => {
      await getGamesData();
      await getGameTopRankers();
      const arr = Object.keys(postCounts);
      await Promise.all(arr.map((name) => getPostCount(name)));
    };
    handleInit();
  }, []);

  return (
    <>
      {filtedGames.map((game) => (
        <Link
          href={`/game/${game.name}`}
          key={game.id}
          className="col-span-8 sm:col-span-4 lg:col-span-3 flex-1 flex flex-col px-[30px] pt-[23.4px] pb-[17.1px] pl-[27px] pr-[19.8px] rounded-2xl transition-all bg-main-500 text-point-500 hover:bg-point-500 hover:text-main-500"
        >
          <div className="font-dnf text-[21.6px] mb-[4.1px] truncate">
            {game.display_name}
          </div>
          <div className="font-semibold text-[12.6px]">
            BEST SCORE : {formatedCount(game.bestScore)}점
          </div>
          <div className="flex items-end justify-between">
            <div className="text-[10.8px] flex items-center gap-1">
              <CommentIcon />
              {postCounts[gameName]}
            </div>
            <PlayIcon />
          </div>
        </Link>
      ))}
    </>
  );
}
