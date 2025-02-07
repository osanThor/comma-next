"use client";
import {
  PostSchema,
  SortType,
  getPostsByCategory,
} from "@/services/post.service";
import { useState } from "react";
import useSWR from "swr";

const getPosts = async (
  key: string
): Promise<{ data: PostSchema[]; totalCount: number }> => {
  const { category, sort, page, limit, query } = JSON.parse(key);
  return await getPostsByCategory(category, sort, page, limit, query);
};

export default function usePosts(category: string, limit: number, query = "") {
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<SortType>("desc");

  const chanagePage = (currentPage: number) => {
    setPage(currentPage);
  };
  const changeSort = (currentSort: SortType) => {
    setSort(currentSort);
    setPage(1);
  };

  const {
    data: posts,
    isLoading,
    error,
  } = useSWR<{
    data: PostSchema[];
    totalCount: number;
  }>(JSON.stringify({ category, page, sort, limit, query }), getPosts);

  return {
    posts,
    isLoading,
    error,
    page,
    chanagePage,
    sort,
    changeSort,
  };
}
