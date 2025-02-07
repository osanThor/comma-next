"use client";
import {
  PostSchema,
  SortType,
  getLikedPosts,
  getPostsByUserId,
} from "@/services/post.service";
import { useState } from "react";
import useSWR from "swr";

const getUserPosts = async (
  key: string
): Promise<{ data: PostSchema[]; totalCount: number }> => {
  const { userId, sort, isComma, page } = JSON.parse(key);
  return await getPostsByUserId(userId, sort, isComma, page, 12);
};
const getUserLikedPosts = async (
  key: string
): Promise<{ data: PostSchema[]; totalCount: number }> => {
  const { userId, sort, isComma, page } = JSON.parse(key);
  return await getLikedPosts(userId, sort, isComma, page, 12);
};

export default function useUserPosts(
  userId: string,
  isComma: boolean,
  isPost: boolean
) {
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
  }>(
    JSON.stringify({ isComma, page, sort, userId }),
    isPost ? getUserPosts : getUserLikedPosts
  );

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
