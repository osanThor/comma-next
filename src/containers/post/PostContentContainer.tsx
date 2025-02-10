"use client";

import { PostSchema, deletePost } from "@/services/post.service";
import { useAuthStore } from "@/stores/authStore";
import { useModalStore } from "@/stores/modalStore";
import { useToastStore } from "@/stores/toastStore";
import formatedDate from "@/utils/formatedDate";
import { useRouter } from "next/navigation";

type Props = {
  post: PostSchema;
};

export default function PostContentContainer({ post }: Props) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const openModal = useModalStore((state) => state.openModal);
  const addToast = useToastStore((state) => state.addToast);

  const handleClickEdit = () => {
    router.push(`/post/${post.id}/edit`);
  };

  const handleDeletePost = async () => {
    try {
      const res = await deletePost(post.id);
      if (res) {
        addToast("작별 인사를 건네요...", "error");
        router.back();
      }
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      throw error;
    }
  };
  const handleClickDelete = async () => {
    openModal(
      `"나 아직 갈 준비가 안 됐어요..."\n그래도 삭제하시겠어요?`,
      "삭제하기",
      handleDeletePost
    );
  };

  return (
    <div className="w-full flex flex-col flex-grow">
      <div className="flex flex-row items-end justify-between w-full">
        <div className="flex-grow">
          <p className="font-medium text-sm text-white/70 mb-2">
            {formatedDate(post.created_at)}
          </p>
          <h2 className="font-dnf text-4xl">{post.title}</h2>
        </div>
        {user && post.user.id === user.id && (
          <div className="flex flex-row gap-3 text-sm whitespace-nowrap font-semibold text-white/50">
            <button
              onClick={handleClickEdit}
              type="button"
              className="hover:text-white/100"
            >
              수정
            </button>
            <button
              onClick={handleClickDelete}
              type="button"
              className="hover:text-white/100"
            >
              삭제
            </button>
          </div>
        )}
      </div>
      <hr className="border-2 opacity-30 w-full my-5 rounded-sm" />
      <div className="flex-grow">
        {post.category !== "free" && (
          <div className="flex flex-row items-center gap-4 font-semibold text-lg mb-4 text-point-500">
            <p>TIME | {post?.play_time}</p>
            <p>SCORE | {post?.score}</p>
          </div>
        )}
        <div className="flex-grow lg:max-h-[275px] lg:overflow-y-auto">
          <p className="font-medium opacity-85 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      </div>
    </div>
  );
}
