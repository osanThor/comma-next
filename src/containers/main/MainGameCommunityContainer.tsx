"use client";
import CommentIcon from "@/components/common/icons/CommentIcon";
import PlayIcon from "@/components/common/icons/PlayIcon";
import TitleLeft from "@/components/common/icons/TitleLeft";
import TitleRight from "@/components/common/icons/TitleRight";
import { getPostsByCategory } from "@/services/post.service";
import { useGameStore } from "@/stores/gameStore";
import formatedCount from "@/utils/formatedCount";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MainGameCommunityContainer() {
  const games = useGameStore((state) => state.games);
  const gameTopRankers = useGameStore((state) => state.gameTopRankers);

  const [postCounts, setPostCounts] = useState<{ [key: string]: number }>({
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
          [category]: data.totalCount as number,
        }));
      }
    } catch (err) {
      console.error(`${category} 게시글 수 로딩 실패:`, err);
    }
  };

  useEffect(() => {
    Promise.all(Object.keys(postCounts).map((name) => getPostCount(name)));
  }, []);

  return (
    <section className="w-[calc(100%-40px)] max-w-[1440px] overflow-x-hidden flex flex-col items-center">
      <h2 className="flex flex-col items-center text-3xl md:text-5xl font-dnf text-point-500 relative mb-[62px]">
        <TitleLeft className="scale-50 md:scale-100 h-10 absolute right-[calc(100%-30px)] md:right-[calc(100%+28px)] bottom-0" />
        <span className="text-2xl md:text-4xl">GAME</span>
        COMMUNITY
        <TitleRight className="scale-50 md:scale-100 h-10 absolute left-[calc(100%-30px)] md:left-[calc(100%+28px)] bottom-0" />
      </h2>
      <ul className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-[18px] mb-[95px]">
        {games.map((game) => (
          <li key={game.id} className="flex-1 w-full ">
            <Link
              href={`/game/${game.name}`}
              className="flex flex-col flex-1 px-[30px] pt-[26px] pb-[19px] rounded-2xl transition-all bg-main-500 text-point-500 hover:bg-point-500 hover:text-main-500"
            >
              <div className="font-dnf text-2xl mb-1 truncate">
                {game.display_name}
              </div>
              <div className="font-semibold text-sm">
                BEST SCORE :{" "}
                {formatedCount(gameTopRankers[game.name]?.score || 0)}점
              </div>
              <div className="flex items-end justify-between">
                <div className="text-xs flex items-center gap-1">
                  <CommentIcon />
                  {postCounts[game.name] > 999 ? "999+" : postCounts[game.name]}
                </div>
                <PlayIcon />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
