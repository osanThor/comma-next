"use client";

import { CommentSchema, getCommentsByUserId } from "@/services/comment.service";
import { SortType } from "@/services/post.service";
import { useState } from "react";
import useSWR from "swr";

const getComments = async (
  key: string
): Promise<{
  data: CommentSchema[];
  totalCount: number;
}> => {
  const { userId, sort, page } = JSON.parse(key);
  return await getCommentsByUserId(userId, sort, page);
};

export default function useUserComments(userId: string) {
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
    data: comments,
    isLoading,
    error,
    mutate,
  } = useSWR<{
    data: CommentSchema[];
    totalCount: number;
  }>(JSON.stringify({ page, sort, userId }), getComments);

  return {
    comments,
    isLoading,
    error,
    page,
    chanagePage,
    sort,
    changeSort,
    mutate,
  };
}
