import Image from "next/image";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const DEFAULT_PROFILE = "/assets/images/defaultProfile.png";

const AVATAR_SIZES = {
  xs: "w-[18px] h-[18px] min-w-[18px] min-h-[18px]",
  sm: "w-[27px] h-[27px] min-w-[27px] min-h-[27px]",
  base: "w-[50px] h-[50px] min-w-[50px] min-h-[50px]",
  lg: "w-[60px] h-[60px] min-w-[60px] min-h-[60px]",
  xl: "w-[156px] h-[156px] min-w-[156px] min-h-[156px]",
};

type Props = {
  src?: string;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
};

export default function Avatar({
  src = DEFAULT_PROFILE,
  size = "base",
}: Props) {
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  const handleImgLoad = () => {
    setImgLoaded(true);
  };

  return (
    <div
      className={twMerge(
        "flex items-center rounded-full justify-center overflow-hidden relative bg-white",
        AVATAR_SIZES[size]
      )}
    >
      {!imgLoaded && (
        <div
          v-if="!imgLoaded"
          className="w-full absolute top-0 left-0 bottom-0 right-0 bg-main-100 animate-pulse"
        />
      )}
      <Image
        className="min-w-full min-h-full object-cover"
        src={src}
        alt="avatar"
        onLoad={handleImgLoad}
      />
    </div>
  );
}
