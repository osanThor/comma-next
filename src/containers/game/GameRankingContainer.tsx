"use client";

import {
  GameRankingType,
  getGameByName,
  getGameRanking,
} from "@/services/game.service";
import formatedCount from "@/utils/formatedCount";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  gameName: string;
};

export default function GameRankingContainer({ gameName }: Props) {
  const [rankings, setRankings] = useState<GameRankingType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRankingData = async () => {
    setLoading(true);
    setError(null);
    try {
      const gameId = (await getGameByName(gameName)).id;

      console.log(gameId);

      if (!gameId) {
        throw new Error("유효하지 않은 게임입니다");
      }

      const data = await getGameRanking(gameId, "desc");
      setRankings(data);
    } catch (error: unknown) {
      console.error("랭킹 데이터 로딩 실패:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRankImage = (rank: number) => {
    switch (rank) {
      case 1:
        return "/assets/images/medal1.png";
      case 2:
        return "/assets/images/medal2.png";
      case 3:
        return "/assets/images/medal3.png";
      default:
        return "";
    }
  };

  useEffect(() => {
    loadRankingData();
  }, []);

  return (
    <div className="col-span-8 lg:col-span-4 order-1 lg:order-2 py-[30px] bg-main-600 rounded-2xl flex flex-col gap-5 items-center self-start">
      <h2 className="font-dnf text-white text-2xl mb-5 flex items-center gap-2">
        <Image
          src="/assets/images/ranking.png?url"
          alt="ranking"
          className="min-w-6 object-cover"
          width={24}
          height={24}
        />
        RANKING
      </h2>
      {loading ? (
        <div className="text-white text-center">loading...</div>
      ) : error ? (
        <div className="text-red text-center">Error: {error}</div>
      ) : (
        <div className="w-full flex lg:flex-col items-center gap-[12px] px-4 overflow-x-auto">
          {rankings.slice(0, 10).map((rank) => (
            <Link
              className="w-full xl:w-[calc(100%-32px)] flex items-center justify-center"
              key={rank.id}
              href={`/user/${rank.user_id}/post`}
            >
              <div
                className={twMerge(
                  "w-full min-w-[272px] lg:min-w-0 h-[65px] rounded-[12px] pl-[20px] pr-[19px] py-[13px] flex items-center justify-between",
                  rank.rank === 1 && "bg-point-500",
                  rank.rank === 2 && "bg-point-600",
                  rank.rank === 3 && "bg-point-700",
                  rank.rank > 3 && "bg-main-500"
                )}
              >
                {rank.rank <= 3 ? (
                  <Image
                    src={getRankImage(rank.rank)}
                    alt={`${rank.rank}st`}
                    className="w-[42px] h-[39px] mr-[17px]"
                    width={42}
                    height={40}
                  />
                ) : (
                  <span
                    className={twMerge(
                      "font-dnf text-xl text-white flex items-center",
                      rank.rank > 3 && "ml-[13px]",
                      rank.rank === 10 && "ml-[8px]"
                    )}
                  >
                    {rank.rank}
                  </span>
                )}
                <span
                  className={twMerge(
                    "font-dnf text-base text-white block max-w-[80px] truncate overflow-hidden uppercase",
                    rank.rank > 3 && rank.rank !== 10 && "ml-[30px]",
                    rank.rank === 10 && "ml-[24px]"
                  )}
                >
                  {rank.user.name}
                </span>
                <div className="min-w-[60px] text-right">
                  <span className="text-sm text-white">
                    {formatedCount(rank.score)}점
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
