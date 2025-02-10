"use client";

import Filter, { SortOptionsType } from "@/components/common/Filter";
import Pagination from "@/components/common/Pagination";
import PostItem from "@/components/common/PostItem";
import PostSkeleton from "@/components/common/PostSkeleton";
import useDebounce from "@/hooks/debounce";
import usePosts from "@/hooks/posts";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  gameName: string;
};

const SORT_OPTIONS = [
  { name: "인기순", value: "likes" },
  { name: "최신순", value: "desc" },
] as SortOptionsType[];

export default function GameCommunityContainer({ gameName }: Props) {
  const [query, setQuery] = useState<string>("");
  const debouncedSearch = useDebounce(query);

  const { posts, isLoading, page, changePage, sort, changeSort } = usePosts(
    gameName,
    12,
    debouncedSearch
  );

  const handleChangeFields = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    changePage(1);
  }, [debouncedSearch, changePage]);

  return (
    <div className="col-span-8 lg:col-span-12 pb-20 border-[3px] px-[60px] pt-[60px] border-white bg-[rgba(23,18,50,0.2)] backdrop-blur-[10px] rounded-[30px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[26px]">
          <h2 className="font-dnf text-white text-[42px]">게시글</h2>
          <Filter sort={sort} sortOption={SORT_OPTIONS} onChange={changeSort} />
        </div>
        <form className="w-[295px] h-[40px] bg-main-500 rounded-3xl opacity-50 relative hover:opacity-100 focus-within:opacity-100">
          <input
            type="text"
            className="w-full h-full bg-transparent outline-none text-white pl-5 pr-[50px]"
            onChange={handleChangeFields}
            value={query || ""}
          />
          <button
            type="submit"
            className="absolute right-[13.4px] top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <Image
              src="/assets/images/icons/search-icon.svg"
              alt="search"
              className="min-w-[26px] object-cover"
              width={26}
              height={26}
            />
          </button>
        </form>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-[30px] mb-[70px] mt-5">
          <PostSkeleton length={12} />
        </div>
      ) : posts?.data.length === 0 ? (
        <div className="w-full flex items-center justify-center py-[200px] mt-5 text-white/50 text-2xl font-bold">
          포스트가 존재하지 않습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-[30px] mb-[70px] mt-5">
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
          limit={5}
        />
      </div>
    </div>
  );
}
