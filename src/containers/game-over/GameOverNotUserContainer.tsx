"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  onClose: () => void;
};

export default function GameOverNotUserContainer({ onClose }: Props) {
  const router = useRouter();
  const handleMoveToLogin = () => {
    router.push("/login");
  };
  return (
    <div className="flex flex-col h-full">
      <button
        className="absolute top-3 right-3 opacity-50 hover:opacity-100"
        onClick={onClose}
      >
        <Image
          src="/assets/images/icons/close-icon.svg"
          alt="닫기"
          width={40}
          height={40}
        />
      </button>
      <div className="mt-[64px] flex justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-[44px] text-point-500 font-dnf">
          !! GAME OVER !!
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center mt-10 flex-grow">
        <h2 className="text-white font-dnf text-4xl md:text-5xl">
          `*ଘ(੭*ˊᵕˋ)੭*و`
        </h2>
        <p className="text-white text-center mt-7 font-dnf text-lg sm:text-xl">
          간단히 로그인하고
          <br /> 다른 사람들과 <span className="text-point-500">점수</span>를
          겨뤄봐요!
        </p>
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
            onClick={handleMoveToLogin}
            type="button"
            className="font-dnf text-lg md:text-xl text-white w-full max-w-[160px] h-[64px] rounded-xl bg-point-500"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
