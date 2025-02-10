import {
  CommentSchema,
  CreateCommentType,
  createComment,
  getComments as getCommentsByPost,
} from "@/services/comment.service";
import { SortType } from "@/services/post.service";
import { useToastStore } from "@/stores/toastStore";
import { useCallback, useState } from "react";
import useSWR from "swr";

const getComments = async (
  key: string
): Promise<{
  data: CommentSchema[];
  totalCount: number;
}> => {
  const { postId, sort, page } = JSON.parse(key);
  return await getCommentsByPost(postId, sort, page);
};

export default function useComments(postId: string) {
  const addToast = useToastStore((state) => state.addToast);
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<SortType>("desc");

  const changePage = (currentPage: number) => {
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
  }>(JSON.stringify({ page, sort, postId }), getComments);

  const addComment = useCallback(
    async (body: CreateCommentType) => {
      try {
        if (!comments) return;
        console.log(body);
        if (!body.content.trim())
          return addToast("댓글을 입력해주세요.", "error");

        const result = await createComment(body);
        if (result) {
          const newComments = {
            data: [result.data, ...comments.data],
            totalCount: comments.totalCount + 1,
          };
          return mutate(newComments, {
            optimisticData: newComments,
            populateCache: false,
            revalidate: false,
            rollbackOnError: true,
          });
        }
        throw new Error("댓글 등록 실패");
      } catch (err) {
        console.error(err);
        addToast("댓글을 등록에 실패했어요.", "error");
        throw new Error("댓글 등록 실패");
      }
    },
    [comments, mutate]
  );

  return {
    comments,
    isLoading,
    error,
    page,
    changePage,
    sort,
    changeSort,
    addComment,
  };
}
