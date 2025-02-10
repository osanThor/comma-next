"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { SwiperOptions } from "swiper/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { PostSchema } from "@/services/post.service";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

const SWIPER_OPTIONS = {
  slidesPerView: 1,
  navigation: true,
  modules: [Navigation, Pagination],
  pagination: { clickable: true },
} as SwiperOptions;

type Props = {
  post: PostSchema;
};

export default function PostImageContainer({ post }: Props) {
  return (
    <div className="w-full max-w-[440px] flex justify-center flex-shrink-0 ">
      <div className="bg-white w-full max-w-[440px] max-h-[440px] rounded-xl flex items-center justify-center ">
        <div className="w-full max-w-[calc(100%-16px)] flex-grow max-h-[calc(100%-16px)] relative rounded-lg lg:rounded-xl overflow-hidden">
          <Swiper {...SWIPER_OPTIONS}>
            {post.images.length > 0 ? (
              <>
                {post.images.map((img, idx) => (
                  <SwiperSlide
                    key={img}
                    className="relative flex items-center justify-center w-full aspect-square"
                  >
                    <Image
                      className="object-cover w-full h-auto aspect-square"
                      src={img}
                      alt={`image-${idx}`}
                      width={440}
                      height={440}
                    />
                  </SwiperSlide>
                ))}
              </>
            ) : (
              <SwiperSlide>
                <Image
                  src="/assets/images/postDefaultImg.png"
                  alt="default image"
                  className="w-full object-cover object-center rounded-lg lg:rounded-xl"
                  width={440}
                  height={440}
                />
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
