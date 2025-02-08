"use client";

import Filter, { SortOptionsType } from "@/components/common/Filter";
import Pagination from "@/components/common/Pagination";
import PostItem from "@/components/common/PostItem";
import PostSkeleton from "@/components/common/PostSkeleton";
import TitleLeft from "@/components/common/icons/TitleLeft";
import TitleRight from "@/components/common/icons/TitleRight";
import usePosts from "@/hooks/posts";
import Link from "next/link";

const SORT_OPTIONS = [
  { name: "인기순", value: "likes" },
  { name: "최신순", value: "desc" },
] as SortOptionsType[];

export default function MainCommunityContainer() {
  const { posts, isLoading, page, chanagePage, sort, changeSort } = usePosts(
    "free",
    12
  );

  return (
    <section className="w-[calc(100%-40px)] max-w-[1440px] flex flex-col items-center contents-box py-10 md:py-[83px] mb-10">
      <h2 className="flex flex-col items-center text-2xl md:text-4xl font-dnf text-white relative mb-[30px]">
        <TitleLeft className="hidden sm:block scale-50 md:scale-100 h-10 absolute right-[calc(100%-30px)] md:right-[calc(100%+28px)] bottom-0" />
        <span className="text-xl md:text-3xl">COMMA</span>
        COMMUNITY
        <TitleRight className="hidden sm:block scale-50 md:scale-100 h-10 absolute left-[calc(100%-30px)] md:left-[calc(100%+28px)] bottom-0" />
      </h2>
      <Link
        href="/post/write?category=free"
        className="w-[258px] h-12 flex items-center justify-center bg-white hover:bg-point-500 rounded-full text-xl font-dnf transition-all mb-2"
      >
        글 쓰러 가기
      </Link>
      <div className="w-[calc(100%-40px)] max-w-[970px] flex flex-col">
        <div className="w-full flex items-center justify-end ">
          <Filter sort={sort} sortOption={SORT_OPTIONS} onChange={changeSort} />
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
            onChnage={chanagePage}
            limit={5}
          />
        </div>
      </div>
    </section>
  );
}
