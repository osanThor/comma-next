"use client";

import { addLike, checkLike, removeLike } from "@/services/like.service";
import { createNotification } from "@/services/notification.service";
import { PostSchema } from "@/services/post.service";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { useCallback, useEffect, useState } from "react";

type Props = {
  post: PostSchema;
};

export default function PostLikeContainer({ post }: Props) {
  const user = useAuthStore((state) => state.user);

  const addToast = useToastStore((state) => state.addToast);

  const [disabled, setDisabled] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(post.like_count || 0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const handleClickLike = useCallback(async () => {
    try {
      if (!user) return addToast("다시 로그인해주세요.", "error");
      setDisabled(true);
      console.log(isLiked);
      if (isLiked) {
        // unlike
        const result = await removeLike({
          userId: user.id,
          targetId: post.id,
          targetType: "post",
        });
        if (result) {
          setLikeCount((prev) => prev - 1);
          setIsLiked(false);
        }
      } else {
        //like
        const result = await addLike({
          userId: user.id,
          targetId: post.id,
          targetType: "post",
        });
        if (result) {
          setLikeCount((prev) => prev + 1);
          setIsLiked(true);
          await createNotification({
            userId: post.user.id,
            senderId: user.id,
            targetId: post.id,
            targetType: "post",
            type: "like",
            message: ` 회원님의 게시글을 좋아합니다.`,
          });
        }
      }
    } catch (err) {
      console.error("게시글 좋아요 처리 실패:", err);
      addToast("좋아요 처리를 실패했어요.", "error");
    } finally {
      setDisabled(false);
    }
  }, [likeCount, isLiked, user]);

  useEffect(() => {
    const handleCheckLike = async (userId: string) => {
      try {
        const result = await checkLike({
          userId,
          targetId: post.id,
          targetType: "post",
        });
        setIsLiked(result);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) handleCheckLike(user.id);
  }, [user]);
  return (
    <button
      onClick={handleClickLike}
      className="flex flex-row items-center gap-2 cursor-pointer hover:bg-point-500/60 bg-point-500/30 px-4 py-3 rounded-full"
      type="button"
      disabled={disabled}
    >
      <img
        className="w-5 h-5 object-contain"
        src={
          isLiked
            ? "/assets/images/icons/post-like-icon.png"
            : "/assets/images/icons/post-nolike-icon.png"
        }
      />
      {likeCount > 0 && <p className="text-sm">{likeCount}</p>}
    </button>
  );
}
