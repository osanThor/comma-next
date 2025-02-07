import UserRankingItem from "@/components/user/UserRankingItem";
import { useGameStore } from "@/stores/gameStore";

export default function UserRankContainer() {
  const { rankings } = useGameStore();

  const hasContents =
    rankings && rankings.filter((rank) => !!rank).length && rankings.length;

  return (
    <>
      {hasContents ? (
        <div className="w-full flex flex-col gap-3">
          {rankings
            .filter((rank) => !!rank)
            .map((item) => (
              <UserRankingItem key={item.id} item={item} />
            ))}
        </div>
      ) : (
        <div className="w-full flex items-center justify-center py-[200px] text-white/50 text-2xl font-bold">
          플레이된 게임이 없습니다.
        </div>
      )}
    </>
  );
}
