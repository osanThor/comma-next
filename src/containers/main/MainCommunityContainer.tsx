"use client";

import Filter from "@/components/common/Filter";
import Pagination from "@/components/common/Pagination";
import PostItem from "@/components/common/PostItem";
import PostSkeleton from "@/components/common/PostSkeleton";
import TitleLeft from "@/components/common/icons/TitleLeft";
import TitleRight from "@/components/common/icons/TitleRight";
import usePosts from "@/hooks/posts";
import { SortType } from "@/services/post.service";
import Link from "next/link";

const SORT_OPTIONS = [
  { name: "인기순", value: "likes" },
  { name: "최신순", value: "desc" },
] as { name: string; value: SortType }[];

export default function MainCommunityContainer() {
  const { posts, isLoading, page, chanagePage, sort, changeSort } = usePosts(
    "free",
    12
  );

  return (
    <section className="w-[calc(100%-40px)] max-w-[1440px] flex flex-col items-center contents-box py-[83px] mb-10">
      <h2 className="flex flex-col items-center text-2xl md:text-4xl font-dnf text-white relative mb-[30px]">
        <TitleLeft className="scale-50 md:scale-100 h-10 absolute right-[calc(100%-30px)] md:right-[calc(100%+28px)] bottom-0" />
        <span className="text-xl md:text-3xl">COMMA</span>
        COMMUNITY
        <TitleRight className="scale-50 md:scale-100 h-10 absolute left-[calc(100%-30px)] md:left-[calc(100%+28px)] bottom-0" />
      </h2>
      <Link
        href="/post/write?category=free"
        className="w-[258px] h-12 flex items-center justify-center bg-white hover:bg-point-500 rounded-full text-xl font-dnf transition-all mb-2"
      >
        글 쓰러 가기
      </Link>
      <div className="w-[calc(100%-40px)] max-w-[970px] flex flex-col">
        <div className="w-full flex items-center justify-end mb-5">
          <Filter sort={sort} sortOption={SORT_OPTIONS} onChange={changeSort} />
          {/* <base-filter
        :sort="sort"
        :sortOption="sortOption"
        @change-sort="handleChangeSort"
      ></base-filter> */}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-4 gap-x-5 gap-y-[30px] mb-[70px]">
            <PostSkeleton length={12} />
          </div>
        ) : posts?.data.length === 0 ? (
          <div className="w-full flex items-center justify-center py-[200px] text-white/50 text-2xl font-bold">
            포스트가 존재하지 않습니다.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-x-5 gap-y-[30px] mb-[70px]">
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
    </section>
  );
}
