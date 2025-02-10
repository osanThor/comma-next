import PostCommentItem from "@/components/post/PostCommentItem";
import { CommentSchema } from "@/services/comment.service";

type Props = {
  comments: CommentSchema[];
  isLoading: boolean;
};
export default function PostCommentsListContainer({
  comments,
  isLoading,
}: Props) {
  return (
    <div className="w-full flex flex-col items-center gap-8 lg:gap-12 mb-8 lg:mb-12">
      {isLoading ? (
        <>
          {Array(10)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className="w-full h-[58px] skeleton" />
            ))}
        </>
      ) : comments.length ? (
        <>
          {comments.map((item) => (
            <PostCommentItem key={item.id} item={item} />
          ))}
        </>
      ) : (
        <div className="w-full flex items-center justify-center py-[200px] text-white/50 text-2xl font-bold mt-[30px]">
          작성한 댓글이 존재하지 않습니다.
        </div>
      )}
    </div>
  );
}
