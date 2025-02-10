import { CommentSchema } from "@/services/comment.service";
import Link from "next/link";
import Avatar from "../common/Avatar";
import formatedDate from "@/utils/formatedDate";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import Image from "next/image";

type Props = {
  item: CommentSchema;
};
export default function PostCommentItem({ item }: Props) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  return (
    <div className="flex flex-row items-center justify-between w-full">
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
      <div className="w-6 flex flex-col items-center justify-center font-medium text-white object-contain cursor-pointer">
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
        {item.like_count > 0 && (
          <p className={twMerge("text-sm", isLiked && "text-point-500")}>
            {item.like_count.toString().padStart(2, "0")}
          </p>
        )}
      </div>
    </div>
  );
}
