import Filter, { SortOptionsType } from "@/components/common/Filter";
import Pagination from "@/components/common/Pagination";
import PostItem from "@/components/common/PostItem";
import PostSkeleton from "@/components/common/PostSkeleton";
import UserPostsTags from "@/components/user/UserPostsTags";
import useUserPosts from "@/hooks/userPosts";
import { useState } from "react";

type Props = {
  userId: string;
};

const SORT_OPTIONS = [
  { name: "인기순", value: "likes" },
  { name: "최신순", value: "desc" },
] as SortOptionsType[];

export default function UserLikeContainer({ userId }: Props) {
  const [tag, setTag] = useState<"game" | "comma">("game");
  const { posts, isLoading, page, changePage, sort, changeSort } = useUserPosts(
    userId,
    tag === "comma",
    false
  );

  const handleClickTag = (tagName: "game" | "comma") => {
    if (tag === tagName) return;
    setTag(tagName);
    changePage(1);
  };

  return (
    <div>
      <div className="w-full flex flex-col md:flex-row gap-4 justify-between items-center">
        <UserPostsTags tag={tag} onClick={handleClickTag} />
        <div className="w-full md:w-auto flex-1 flex justify-end">
          <Filter sort={sort} sortOption={SORT_OPTIONS} onChange={changeSort} />
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-[30px] mb-[70px] mt-[30px]">
          <PostSkeleton length={12} />
        </div>
      ) : posts?.data.length === 0 ? (
        <div className="w-full flex items-center justify-center py-[200px] text-white/50 text-2xl font-bold mt-[30px]">
          포스트가 존재하지 않습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-[30px] mb-[70px] mt-[30px]">
          {posts?.data.map((item) => (
            <PostItem key={item.id} item={item} />
          ))}
        </div>
      )}
      <div className="w-full flex justify-center">
        <Pagination
          page={page}
          total={posts?.totalCount || 0}
          onChnage={changePage}
        />
      </div>
    </div>
  );
}
