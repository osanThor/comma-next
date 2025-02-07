import { PostSchema } from "@/services/post.service";
import formatedDate from "@/utils/formatedDate";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Avatar from "./Avatar";
import SmallLike from "./icons/SmallLike";

const DEFAULT_THUMBNAIL = "/assets/images/postDefaultImg.png";

type Props = {
  item: PostSchema;
};

export default function PostItem({ item }: Props) {
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  return (
    <Link
      href={`/post/${item.id}`}
      className="text-white rounded-lg overflow-hidden flex flex-col"
    >
      <div className="w-full h-[130px] relative flex items-center justify-center overflow-hidden">
        {!imgLoaded && (
          <span className="absolute top-0 left-0 bottom-0 right-0 bg-main-200 animate-pulse"></span>
        )}
        <Image
          className="object-cover min-w-full min-h-full"
          src={item.images[0] || DEFAULT_THUMBNAIL}
          alt="post thumbnail"
          onLoad={() => setImgLoaded(true)}
          fill
        />
      </div>
      <div className="p-4 bg-main-500 flex-grow flex flex-col">
        <div className="flex gap-2 items-end mb-3 justify-between">
          <div className="text-sm font-dnf line-clamp-1">{item.title}</div>
          <div className="text-[10px] text-white/70">
            {formatedDate(item.created_at)}
          </div>
        </div>
        <div className="line-clamp-2 text-xs opacity-70 mb-3 break-words flex-grow">
          {item.content}
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="text-xs flex items-center gap-1">
            <Avatar src={item.user.profile_image} size="xs" />
            {item.user.name}
          </div>
          <div className="text-[10px] leading-3 flex items-center gap-1 text-point-500">
            <SmallLike />
            {item.like_count > 999 ? "999+" : item.like_count}
          </div>
        </div>
      </div>
    </Link>
  );
}
