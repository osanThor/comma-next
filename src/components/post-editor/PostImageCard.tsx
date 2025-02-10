import Image from "next/image";
import { twMerge } from "tailwind-merge";

type Props = {
  imgSrc?: string;
  index: number;
  size: "lg" | "sm";
  addImage: () => void;
  removeImage: () => void;
};

const BOX_SIZES = {
  lg: "col-span-3 row-span-2 ",
  sm: "col-span-1 row-span-1",
};

export default function PostImageCard({
  imgSrc,
  index,
  size,
  addImage,
  removeImage,
}: Props) {
  const opacity = Math.max(1 - index * 0.2, 0.3);
  const zIndex = 100 - index;

  return (
    <div
      className={twMerge(
        "relative rounded-xl transition-all duration-100 aspect-square  transform hover:scale-105 hover:shadow-xl cursor-pointer overflow-hidden",
        BOX_SIZES[size]
      )}
      style={{ zIndex }}
    >
      {imgSrc ? (
        <div className="w-full h-full bg-white">
          <Image
            onClick={removeImage}
            src={imgSrc}
            alt={"post image" + index}
            className="object-cover min-h-full aspect-square"
            fill
          />
        </div>
      ) : (
        <div
          onClick={addImage}
          className="w-full h-full bg-white"
          style={{ opacity }}
        >
          <Image
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            src="/assets/images/icons/postEdit-ImgPlus-icon.svg"
            alt="Add Image"
            width={26}
            height={26}
          />
        </div>
      )}
    </div>
  );
}
