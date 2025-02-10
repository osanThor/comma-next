import { GAME_DETAILS } from "@/constants/game";
import Image from "next/image";

type Props = {
  gameName: string;
};
export default function GameDescription({ gameName }: Props) {
  return (
    <div className=" col-span-8 lg:col-span-4 row-span-2 bg-main-700 rounded-2xl items-center justify-center flex gap-8 lg:gap-[38px] flex-col md:flex-row lg:flex-col p-4 relative">
      <div className="w-full flex flex-col items-center">
        <h2 className="font-dnf text-white text-2xl mb-[8px]">게임 소개</h2>
        <div className="min-h-[108px] w-full max-w-none lg:max-w-[287px] flex bg-main-600 text-sm text-white text-center rounded-2xl px-5 py-4 items-center justify-center whitespace-pre-line">
          {GAME_DETAILS[gameName].intro}
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <h2 className="font-dnf text-white text-2xl mb-[8px]">게임 설명</h2>
        <div className="w-full max-w-none lg:max-w-[287px] min-h-[239px] bg-main-500 text-base rounded-2xl text-white flex items-center justify-center px-5 py-4 ">
          <ul className="list-decimal text-center list-inside w-full flex flex-col gap-2">
            {GAME_DETAILS[gameName].description.map((desc, idx) => (
              <li key={idx} className="whitespace-pre-line break-keep">
                {desc}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Image
        src="/assets/images/ghost.png"
        alt="ghost"
        className="absolute bottom-[22px] right-[7px] z-10"
        width={92}
        height={62}
      />
    </div>
  );
}
