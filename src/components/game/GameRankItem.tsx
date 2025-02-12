import { formatPlayTime } from "@/classes/shooting/utils";
import { twMerge } from "tailwind-merge";

type Props = {
  name: string;
  score: number;
  time: number;
  rank: number;
  isHighlighted: boolean;
  gameResult: string;
};

export default function GameRankItem({
  name,
  score,
  time,
  rank,
  isHighlighted,
  gameResult,
}: Props) {
  const formatedName = name.length > 4 ? name.substring(0, 4) + ".." : name;
  return (
    <div
      className={twMerge(
        "relative flex items-center rounded-[10px]",
        isHighlighted
          ? "bg-point-500 w-[362px] h-[62px] px-[26px]"
          : "bg-main-400 w-[326px] h-14 px-6"
      )}
    >
      <div
        className={twMerge(
          "flex-shrink-0 flex flex-col justify-center items-center",
          isHighlighted ? "w-[38px] h-[38px]" : "w-8 h-8"
        )}
      >
        {gameResult === "new success" && isHighlighted && (
          <div>
            <p className="new-text absolute top-[-10px] left-[-10px] font-dnf text-point-500">
              NEW
            </p>
          </div>
        )}
        {rank <= 3 ? (
          <img src={`/assets/images/medal${rank}.png`} alt="Medal Image" />
        ) : (
          <span
            className={twMerge(
              "font-dnf text-xl",
              isHighlighted ? "text-white" : "text-white/50"
            )}
          >
            {rank}
          </span>
        )}
      </div>
      <div
        className={twMerge(
          "flex-1 flex justify-between items-center",
          isHighlighted ? "ml-12" : "ml-10"
        )}
      >
        <span
          className={twMerge(
            "font-dnf text-sm",
            isHighlighted ? "text-white" : "text-white/50"
          )}
        >
          {formatedName}
        </span>
        <span
          className={twMerge(
            "font-pretendard text-xs",
            isHighlighted ? "text-white" : "text-white/50"
          )}
        >
          {score}점
        </span>
        <span
          className={twMerge(
            "font-pretendard text-xs",
            isHighlighted ? "text-white" : "text-white/50"
          )}
        >
          {formatPlayTime(time)}
        </span>
      </div>
    </div>
  );
}
