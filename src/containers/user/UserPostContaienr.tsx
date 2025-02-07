import Filter, { SortOptionsType } from "@/components/common/Filter";
import Pagination from "@/components/common/Pagination";
import PostItem from "@/components/common/PostItem";
import PostSkeleton from "@/components/common/PostSkeleton";
import useUserPosts from "@/hooks/userPosts";
import { SortType } from "@/services/post.service";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  userId: string;
};

const SORT_OPTIONS = [
  { name: "인기순", value: "likes" },
  { name: "최신순", value: "desc" },
] as SortOptionsType[];

export default function UserPostContaienr({ userId }: Props) {
  const [tag, setTag] = useState<"game" | "comma">("game");
  const { posts, isLoading, page, chanagePage, sort, changeSort } =
    useUserPosts(userId, tag === "comma", true);

  const handleClickTag = (tagName: "game" | "comma") => {
    if (tag === tagName) return;
    setTag(tagName);
    chanagePage(1);
  };

  return (
    <div>
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            className={twMerge(
              "text-lg font-bold text-white px-7 pb-4 border-b-4 border-point-500 hover:text-point-500 hover:!border-opacity-100",
              tag === "game"
                ? "text-point-500 !border-opacity-100"
                : "!border-opacity-0"
            )}
            onClick={() => handleClickTag("game")}
          >
            GAME
          </button>
          <button
            className={twMerge(
              "text-lg font-bold text-white px-7 pb-4 border-b-4 border-point-500 hover:text-point-500 hover:!border-opacity-100",
              tag === "comma"
                ? "text-point-500 !border-opacity-100"
                : "!border-opacity-0"
            )}
            onClick={() => handleClickTag("comma")}
          >
            COMMA
          </button>
        </div>
        <Filter sort={sort} sortOption={SORT_OPTIONS} onChange={changeSort} />
      </div>
      {isLoading ? (
        <div className="grid grid-cols-4 gap-x-5 gap-y-[30px] mb-[70px] mt-[30px]">
          <PostSkeleton length={12} />
        </div>
      ) : posts?.data.length === 0 ? (
        <div className="w-full flex items-center justify-center py-[200px] text-white/50 text-2xl font-bold mt-[30px]">
          포스트가 존재하지 않습니다.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-x-5 gap-y-[30px] mb-[70px] mt-[30px]">
          {posts?.data.map((item) => (
            <PostItem key={item.id} item={item} />
          ))}
        </div>
      )}
      <div className="w-full flex justify-center">
        <Pagination
          page={page}
          total={posts?.totalCount || 0}
          onChnage={chanagePage}
        />
      </div>
    </div>
  );
}
