"use client";

import Avatar from "@/components/common/Avatar";
import {
  GameScoreSchema,
  getGameRanking,
  getGameScoreByUser,
} from "@/services/game.service";
import { useAuthStore } from "@/stores/authStore";
import { useGameStore } from "@/stores/gameStore";
import { UserType } from "@/types/auth";
import formatedTime from "@/utils/formatedTime";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

type Props = {
  user: UserType;
  userId: string;
};

export default function UserProfileContainer({ user, userId }: Props) {
  const currentUser = useAuthStore((state) => state.user);

  const userGames = useGameStore((state) => state.userGames);
  const playTime = useGameStore((state) => state.playTime);
  const getUserGameScores = useGameStore((state) => state.getUserGameScores);
  const getRankings = useGameStore((state) => state.getRankings);

  const bio = user
    ? user.bio
    : "아직 자기소개를 작성하지 않으셨습니다. 자기소개를 작성해주세요";

  useEffect(() => {
    getUserGameScores(userId);
  }, [getUserGameScores]);

  useEffect(() => {
    getRankings(userId);
  }, [userGames, getRankings]);

  return (
    <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center mb-16">
      <div className="relative mr-5 md:mr-[78px]">
        {user ? (
          <Avatar src={user.profile_image} size="xl" />
        ) : (
          <div className="w-[156px] h-[156px]  skeleton !rounded-full" />
        )}
        {currentUser && currentUser.id === user?.id && (
          <Link
            href={"/user/edit"}
            className="absolute bottom-[4px] right-[5px] bg-point-500 rounded-full w-[39px] h-[39px] flex items-center justify-center overflow-hidden cursor-pointer transform transition-transform duration-100 ease-in-out hover:scale-125"
          >
            <Image
              className="w-[16px] hover:color-main-500"
              src="/assets/images/icons/editProfile-icon.svg"
              alt="수정"
              width={16}
              height={16}
            />
          </Link>
        )}
      </div>
      <div className="flex flex-col items-center sm:items-start">
        <div className="flex flex-col sm:flex-row flex-wrap">
          <h2 className="text-white font-bold font-dnf text-[30px] text-center sm:text-left mt-4 sm:mt-0 sm:mr-[8px]">
            {user ? user.name : <div className="w-[90px] h-10 skeleton" />}
          </h2>
          <span className="text-gray-400 self-end mb-1 text-sm">
            {user ? user.email : <div className="w-[120px] h-5 skeleton" />}
          </span>
        </div>
        <h2 className="text-gray-300 text-[16px] h-8 mt-[5px] mb-3">{bio}</h2>
        <div className="mt-2 bg-point-500/40 text-white min-h-[38px] px-3.5 py-1 rounded-xl text-base font-semibold flex items-center justify-center text-center">
          총 플레이 시간 | {formatedTime(playTime)}
        </div>
      </div>
    </div>
  );
}
