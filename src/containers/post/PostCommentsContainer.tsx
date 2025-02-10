"use client";

import useComments from "@/hooks/comments";
import PostCommentFormContainer from "./PostCommentFormContainer";
import PostCommentsListContainer from "./PostCommentsListContainer";
import { twMerge } from "tailwind-merge";
import Pagination from "@/components/common/Pagination";

type Props = {
  postId: string;
};
export default function PostCommentsContainer({ postId }: Props) {
  const {
    comments,
    isLoading,
    sort,
    changeSort,
    page,
    changePage,
    addComment,
  } = useComments(postId);
  const totalCount = comments ? comments?.totalCount : 0;
  return (
    <>
      <PostCommentFormContainer postId={postId} addComment={addComment} />
      <hr className="border-dashed border-2 mt-8 mb-8 opacity-30 w-full" />
      <div className="flex flex-col items-center w-full mx-auto">
        <div className="flex flex-row items-end justify-between w-full text-white mb-12">
          <p className="font-semibold text-2xl">댓글 {totalCount}개</p>
          <div className="flex flex-row items gap-4 font-medium text-lg">
            <button
              onClick={() => changeSort("desc")}
              className={twMerge(
                "hover:text-point-500",
                sort === "desc" && "text-point-500"
              )}
            >
              최신순
            </button>
            <button
              onClick={() => changeSort("likes")}
              className={twMerge(
                "hover:text-point-500",
                sort === "likes" && "text-point-500"
              )}
            >
              인기순
            </button>
          </div>
        </div>
        <PostCommentsListContainer
          comments={comments ? comments.data : []}
          isLoading={isLoading}
          postId={postId}
        />
        <Pagination
          page={page}
          total={totalCount}
          onChnage={changePage}
          pageSize={10}
        />
      </div>
    </>
  );
}
