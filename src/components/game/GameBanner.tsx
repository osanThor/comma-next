import { GAME_BANNERS, GAME_NAME_MAP } from "@/constants/game";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

type Props = {
  gameName: string;
};

export default function GameBanner({ gameName }: Props) {
  return (
    <div
      className="col-span-8 lg:col-span-12 h-[404px] rounded-2xl bg-main-500 flex flex-col relative"
      style={{
        backgroundImage: `url(${GAME_BANNERS[gameName]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className={twMerge(
          "absolute max-w-full w-full md:w-auto right-[0px] flex flex-col items-center md:items-start gap-5 top-1/2 translate-y-5",
          gameName === "tetris" ? "top-[126px]" : "top-[96px]"
        )}
      >
        <h1 className="text-4xl md:text-6xl text-center md:text-left font-bold font-pixelNes text-white w-[367px] whitespace-pre-line">
          {GAME_NAME_MAP[gameName].join("\n") || gameName}
        </h1>
        <Link
          href={`/game/${gameName}/play`}
          className="group rounded-[60px] text-main-500 hover:text-point-500 bg-point-500 px-5 py-3 relative -translate-x-1 hover:bg-white flex items-center justify-center gap-[6px] transition-transform hover:scale-105"
        >
          <svg
            width="15"
            height="18"
            viewBox="0 0 15 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.9294 0.549587L13.7789 6.97893C14.3588 7.37539 14.7031 8.0169 14.7031 8.70067C14.7031 9.38445 14.3588 10.026 13.7789 10.4224L4.9294 17.4507C4.18075 18.0262 3.1638 18.1607 2.28116 17.8009C1.39852 17.4411 0.792538 16.645 0.703125 15.7279L0.703125 2.26797C0.794068 1.35161 1.40064 0.556933 2.283 0.198172C3.16535 -0.160589 4.18141 -0.0256664 4.9294 0.549587Z"
              fill="currentColor"
            />
          </svg>
          <p className="font-dnf md:text-lg">PLAY GAME</p>
        </Link>
      </div>
    </div>
  );
}
