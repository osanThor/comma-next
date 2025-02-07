import { twMerge } from "tailwind-merge";

type Props = {
  tag: "game" | "comma";
  onClick: (tagName: "game" | "comma") => void;
};
export default function UserPostsTags({ tag, onClick }: Props) {
  return (
    <div className="w-full md:w-auto flex-1 flex items-center md:gap-4">
      <button
        className={twMerge(
          "md:text-lg w-full md:w-auto font-bold text-white px-7 pb-4 border-b-4 border-point-500 hover:text-point-500 hover:!border-opacity-100",
          tag === "game"
            ? "text-point-500 !border-opacity-100"
            : "!border-opacity-0"
        )}
        onClick={() => onClick("game")}
      >
        GAME
      </button>
      <button
        className={twMerge(
          "md:text-lg w-full md:w-auto font-bold text-white px-7 pb-4 border-b-4 border-point-500 hover:text-point-500 hover:!border-opacity-100",
          tag === "comma"
            ? "text-point-500 !border-opacity-100"
            : "!border-opacity-0"
        )}
        onClick={() => onClick("comma")}
      >
        COMMA
      </button>
    </div>
  );
}
