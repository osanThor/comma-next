import { CommentSchema, CreateCommentType } from "@/services/comment.service";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import Image from "next/image";
import { FormEvent, useState } from "react";

type Props = {
  postId: string;
  addComment: (body: CreateCommentType) => Promise<void | {
    data: CommentSchema[];
    totalCount: number;
  }>;
};

export default function PostCommentFormContainer({
  postId,
  addComment,
}: Props) {
  const user = useAuthStore((state) => state.user);
  const addToast = useToastStore((state) => state.addToast);

  const [content, setContetn] = useState<string>("");

  const handleAddComment = async () => {
    if (!user) return;
    const result = await addComment({ userId: user.id, postId, content });
    if (result) {
      setContetn("");
      addToast("댓글을 등록했어요.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    handleAddComment();
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await handleAddComment();
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-auto w-full h-full mt-8"
    >
      <button
        type="submit"
        className="absolute bottom-4 right-2 cursor-pointer "
      >
        <Image
          className="opacity-70 hover:opacity-100 transition-opacity duration-300"
          alt="send icon"
          src="/assets/images/icons/post-send-icon.svg"
          width={34}
          height={34}
        />
      </button>
      <textarea
        name="PostComment"
        className="w-full h-full min-h-28 bg-white/20 border-2 focus:placeholder:opacity-0 font-medium rounded-xl p-5 placeholder:text-white/50 text-white resize-none overflow-auto focus:outline-4 focus:outline-point-500/30"
        placeholder="댓글을 입력해주세요 φ(゜▽゜*)♪"
        id="comment-content"
        value={content || ""}
        onChange={(e) => setContetn(e.target.value)}
        onKeyDown={handleKeyPress}
      ></textarea>
    </form>
  );
}
