import { CommentSchema, deleteComment } from "@/services/comment.service";
import { useAuthStore } from "@/stores/authStore";
import { useModalStore } from "@/stores/modalStore";
import formatedDate from "@/utils/formatedDate";
import Link from "next/link";
import SmallLike from "../common/icons/SmallLike";
import { useToastStore } from "@/stores/toastStore";
import CommentDeleteIcon from "../common/icons/CommentDeleteIcon";
import { KeyedMutator } from "swr";

type Props = {
  item: CommentSchema;
  mutate: KeyedMutator<{
    data: CommentSchema[];
    totalCount: number;
  }>;
};
export default function UserCommentItem({ item, mutate }: Props) {
  const user = useAuthStore((state) => state.user);
  const openModal = useModalStore((state) => state.openModal);
  const addToast = useToastStore((state) => state.addToast);

  const totalLikes = () => {
    const likeCount = item.like_count || 0;
    if (likeCount >= 1000) {
      return (likeCount / 1000).toFixed(1) + "k";
    }
    return likeCount.toString();
  };

  const handleDeleteComment = async () => {
    try {
      const data = await deleteComment(item.id);
      if (data) {
        addToast("댓글이 삭제 되었어요.");
        mutate();
      }
    } catch (err) {
      console.error(err);
      addToast("댓글을 삭제하기 못했어요.", "error");
    }
  };

  const handleClickDelete = () => {
    openModal("이 댓글을 삭제하시겠어요?", "삭제하기", handleDeleteComment);
  };

  return (
    <div className="w-full max-w-[1000px] relative group">
      <Link
        href={`/post/${item.post_id}`}
        className="min-h-[70px] w-full rounded-2xl py-4 bg-main-600 flex items-start flex-col lg:flex-row flex-wrap lg:items-center px-[33px]"
      >
        <div className="min-w-[200px] flex-1 text-white text-base font-dnf max-w-32 truncate mr-10">
          {item.post.title}
        </div>
        <div className="flex-[1.8] text-white/70 text-base font-medium lg:max-w-[612px] truncate pr-8">
          {item.content}
        </div>
        <div className="flex-1 flex flex-wrap items-center gap-2">
          <div className="flex-[0.6] text-gray-500 text-xs font-medium flex justify-center whitespace-nowrap">
            {formatedDate(item.created_at, "YYYY-MM-DD")}
          </div>
          <div className="flex items-center text-point-500 text-base w-12">
            <SmallLike />
            <span className="ml-1 pt-1">{totalLikes()}</span>
          </div>
        </div>
      </Link>
      {item.user.id === user?.id && (
        <button
          onClick={handleClickDelete}
          className="w-7 h-7 absolute bg-white rounded-full flex md:hidden group-hover:flex items-center justify-center top-2 right-2 lg:-top-2 rlg:ight-0 lg:translate-x-4"
        >
          <CommentDeleteIcon />
        </button>
      )}
    </div>
  );
}
