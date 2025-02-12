"use client";

import { formatPlayTime } from "@/classes/shooting/utils";
import GameRankItem from "@/components/game/GameRankItem";
import { GameRankingType, getGameRanking } from "@/services/game.service";
import { useAuthStore } from "@/stores/authStore";
import { useGameStore } from "@/stores/gameStore";
import { useState, useEffect } from "react";

type Props = {
  gameResult: string;
  gameId: string;
  onClose: () => void;
  onShare: () => void;
};

export default function GameOverInfoContainer({
  gameResult,
  gameId,
  onClose,
  onShare,
}: Props) {
  const user = useAuthStore((state) => state.user);
  const gamePayload = useGameStore((state) => state.gamePayload);

  const [filteredRankings, setFilteredRankings] = useState<
    Array<
      | (GameRankingType & { isHighlighted: true })
      | { isLastPlace: true }
      | undefined
    >
  >([]);

  const formatedGamePlayTime = formatPlayTime(gamePayload?.playTime || 0);
  const formatedGameScore = `${gamePayload?.score || 0}점`;

  const getCurrentUserRanking = (
    gameRankingData: GameRankingType[],
    userId: string
  ) => {
    const userRankings = gameRankingData.filter(
      (rank) => rank.user_id === userId
    );

    userRankings.sort(
      (a, b) =>
        new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
    );

    return userRankings.length > 0 ? userRankings[0] : null;
  };

  const filterRankingsForDisplay = (
    rankings: GameRankingType[],
    latestRanking: GameRankingType
  ) => {
    if (!latestRanking) return [];

    const rankMinusOne = rankings.find(
      (rank) => rank.rank === latestRanking.rank - 1
    );
    const rankPlusOne = rankings.find(
      (rank) => rank.rank === latestRanking.rank + 1
    );

    const rankPlusTwo = rankings.find(
      (rank) => rank.rank === latestRanking.rank + 2
    );

    if (!rankPlusOne) {
      return [
        rankMinusOne,
        { ...latestRanking, isHighlighted: true },
        { isLastPlace: true },
      ].filter(Boolean);
    }

    if (latestRanking.rank === 1 && rankPlusTwo) {
      return [
        { ...latestRanking, isHighlighted: true },
        rankPlusOne,
        rankPlusTwo,
      ].filter(Boolean);
    }

    return [
      rankMinusOne,
      { ...latestRanking, isHighlighted: true },
      rankPlusOne,
    ].filter(Boolean);
  };

  useEffect(() => {
    const handleGetGameRankData = async () => {
      try {
        if (!user) return;

        const rankings = await getGameRanking(gameId);
        const latestRanking = getCurrentUserRanking(rankings, user.id);

        if (latestRanking) {
          const result = filterRankingsForDisplay(
            rankings,
            latestRanking
          ) as Array<
            | (GameRankingType & { isHighlighted: true })
            | { isLastPlace: true }
            | undefined
          >;
          setFilteredRankings(result);
        }
      } catch (error) {
        console.error("GET RANKING 실행 중 오류 발생:", error);
      }
    };
    handleGetGameRankData();
  }, [user, gameResult]);
  return (
    <>
      <button
        className="absolute top-3 right-3 opacity-50 hover:opacity-100"
        onClick={onClose}
      >
        <img src="/assets/images/icons/close-icon.svg" alt="닫기" />
      </button>
      <div className="mt-[64px] flex justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-[44px] text-point-500 font-dnf">
          !! GAME OVER !!
        </h1>
      </div>
      <div>
        <div className="w-[calc(100%-32px)] max-w-[358px] mx-auto mt-7 flex items-center flex-col sm:flex-row justify-between gap-3">
          <article className="w-full sm:max-w-[174px] h-[116px] bg-main-700 text-white flex flex-col first-line:justify-center items-center rounded-xl">
            <h2 className="font-dnf text-lg md:text-xl mt-[22px]">TIME</h2>
            <p className="mt-3 font-pretendard font-medium md:text-lg opacity-80">
              {formatedGamePlayTime}
            </p>
          </article>
          <article className="w-full sm:max-w-[174px] h-[116px] bg-main-700 text-white flex flex-col first-line:justify-center items-center rounded-xl">
            <h2 className="font-dnf text-lg md:text-xl mt-[22px]">SCORE</h2>
            <p className="mt-3 font-pretendard font-medium md:text-lg opacity-80">
              {formatedGameScore}
            </p>
          </article>
        </div>
        <div className="h-[246px]">
          <h2 className="font-dnf text-2xl text-white flex justify-center mt-9">
            RANKING
          </h2>
          <div className="mt-[18px] space-y-[10px] flex flex-col items-center">
            {filteredRankings.map((rankData, idx) => {
              if (!rankData) return null;
              return (
                <div key={idx}>
                  {!("isLastPlace" in rankData) ? (
                    <GameRankItem
                      key={rankData.rank}
                      name={rankData.user.name}
                      score={rankData.score}
                      time={rankData.play_time}
                      rank={rankData.rank}
                      isHighlighted={rankData.isHighlighted}
                      gameResult={gameResult}
                    />
                  ) : (
                    <div className="relative flex items-center justify-center rounded-[10px] bg-main-400 w-[326px] h-14 px-6 font-dnf text-white/50 text-xl">
                      <p className="">｡°(っ°´o`°ｃ)°｡</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center my-12">
        <div className="w-[calc(100%-32px)] flex flex-row items-center justify-center gap-4 md:gap-8">
          <button
            onClick={onClose}
            type="button"
            className="font-dnf text-lg md:text-xl text-white w-full max-w-[160px] h-[64px] rounded-xl bg-[#0A58CE]"
          >
            REPLAY
          </button>
          <button
            onClick={onShare}
            type="button"
            className="font-dnf text-lg md:text-xl text-white w-full max-w-[160px] h-[64px] rounded-xl bg-point-500"
          >
            SHARE
          </button>
        </div>
      </div>
    </>
  );
}
