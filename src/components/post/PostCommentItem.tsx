import { CommentSchema } from "@/services/comment.service";
import Link from "next/link";
import Avatar from "../common/Avatar";
import formatedDate from "@/utils/formatedDate";
import { twMerge } from "tailwind-merge";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import {
  InLikeBody,
  removeLike,
  addLike,
  checkLike,
} from "@/services/like.service";
import { createNotification } from "@/services/notification.service";

type Props = {
  item: CommentSchema;
  postId: string;
};
export default function PostCommentItem({ item, postId }: Props) {
  const user = useAuthStore((state) => state.user);
  const addToast = useToastStore((state) => state.addToast);

  const [disabled, setDisabled] = useState<boolean>(true);
  const [likeCount, setLikeCount] = useState<number>(item.like_count || 0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const handleUnlike = async (body: InLikeBody) => {
    const result = await removeLike(body);
    if (result) {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
    }
  };
  const handlelike = async (body: InLikeBody) => {
    const result = await addLike(body);
    if (result) {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
      if (item.user.id !== body.userId)
        await createNotification({
          userId: item.user.id,
          senderId: body.userId,
          targetId: postId,
          targetType: "comment",
          type: "like",
          message: ` 회원님의 댓글을 좋아합니다.`,
        });
    }
  };

  const handleClickLike = useCallback(async () => {
    try {
      if (!user) return addToast("다시 로그인해주세요.", "error");
      setDisabled(true);
      const body = {
        userId: user.id,
        targetId: item.id,
        targetType: "comment",
      } as InLikeBody;
      if (isLiked) {
        await handleUnlike(body);
      } else {
        await handlelike(body);
      }
      setIsAnimating(true);
    } catch (err) {
      console.error("댓글 좋아요 처리 실패:", err);
      addToast("좋아요 처리를 실패했어요.", "error");
    } finally {
      setDisabled(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [likeCount, isLiked, user]);

  useEffect(() => {
    const handleCheckLike = async (userId: string) => {
      try {
        setDisabled(true);
        const result = await checkLike({
          userId,
          targetId: item.id,
          targetType: "comment",
        });
        setIsLiked(result);
      } catch (err) {
        console.error(err);
      } finally {
        setDisabled(false);
      }
    };
    if (user) {
      handleCheckLike(user.id);
    } else {
      setDisabled(false);
    }
  }, [user]);
  return (
    <li className="flex flex-row items-center justify-between w-full">
      <div className="flex flex-row items-start gap-4">
        <div className="pt-2">
          <Link href={"/"}>
            <Avatar src={item.user.profile_image} />
          </Link>
        </div>
        <div className="pt-2">
          <div className="flex flex-row items-center text-white gap-2">
            <p className="font-semibold text-lg leading-0">
              {item.user?.name || "알수없음"}
            </p>
            <p className="font-medium text-xs text-white/50 leading-0 pt-1">
              {formatedDate(item.created_at)}
            </p>
          </div>
          <p className="w-full max-w-[750px] h-auto text-white/70 font-medium text-sm mr-16">
            {item.content}
          </p>
        </div>
      </div>
      <button
        onClick={handleClickLike}
        className="w-6 flex flex-col items-center justify-center font-medium text-white object-contain cursor-pointer"
        type="button"
        disabled={disabled}
      >
        <Image
          className={twMerge(
            " object-contain transition-all ease-in-out",
            isAnimating && " scale-125"
          )}
          src={
            isLiked
              ? "/assets/images/icons/post-like-icon.png"
              : "/assets/images/icons/post-nolike-icon.png"
          }
          alt="like icon"
          width={24}
          height={26}
        />
        {likeCount > 0 && (
          <p className={twMerge("text-sm", isLiked && "text-point-500")}>
            {likeCount.toString().padStart(2, "0")}
          </p>
        )}
      </button>
    </li>
  );
}
