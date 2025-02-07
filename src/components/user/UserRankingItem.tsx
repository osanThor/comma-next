import { InUserRank } from "@/stores/gameStore";
import Link from "next/link";
import Avatar from "../common/Avatar";
import formatedCount from "@/utils/formatedCount";
import formatedTime from "@/utils/formatedTime";

type Props = {
  item: InUserRank;
};
export default function UserRankingItem({ item }: Props) {
  return (
    <div className="w-full max-w-[1000px]">
      <Link
        href={`/game/${item.game.name}`}
        className="py-2 rounded-full bg-[#19162B]/50 flex items-center pl-4"
      >
        <Avatar src={`/assets/images/game/profile/${item.game.name}.jpg`} />
        <div className="flex-1 flex justify-center text-white text-lg font-semibold">
          {item.game.display_name}
        </div>
        <div className="flex flex-col md:flex-row gap-1">
          <div className="flex-1 flex justify-center text-white text-base font-semibold opacity-70">
            {formatedCount(item.score)}점
          </div>
          <div className="flex-1 flex justify-center text-white text-base font-semibold opacity-70">
            {formatedTime(item.play_time)}
          </div>
        </div>
        <div className="flex-1 flex justify-center text-white text-base font-semibold">
          {item.rank}등
        </div>
      </Link>
    </div>
  );
}
