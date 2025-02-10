import PostImageCard from "@/components/post-editor/PostImageCard";
import { useToastStore } from "@/stores/toastStore";
import React, { ChangeEvent, useRef } from "react";

type Props = {
  images: { file?: File; src: string }[];
  setImages: React.Dispatch<
    React.SetStateAction<
      {
        file?: File | undefined;
        src: string;
      }[]
    >
  >;
};

export default function PostImageContainer({ images, setImages }: Props) {
  const addToast = useToastStore((state) => state.addToast);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (!imageInputRef.current)
      return addToast("이미지 파일 Input이 없습니다.", "error");
    if (images.length + Array.from(files).length > 4)
      return addToast("이미지는 최대 4개까지 업로드 할 수 있어요!", "error");
    const newImages = Array.from(files).map((file) => ({
      file,
      src: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    addToast("이미지가 업로드되었어요!");
    imageInputRef.current.value = "";
  };

  const handleClickImageFile = () => {
    if (!imageInputRef.current)
      return addToast("이미지 파일 Input이 없습니다.", "error");
    imageInputRef.current.click();
  };

  const handleClickRemoveImageFile = (index: number) => {
    setImages((prev) => {
      const newArr = [...prev];
      return newArr.filter((_, idx) => idx !== index);
    });
  };

  return (
    <div className="w-full md:max-w-[440px] grid grid-cols-3 grid-rows-2 gap-1.5">
      <input
        ref={imageInputRef}
        id={"fileInput"}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleChangeFile}
        multiple
        hidden
      />
      {[0, 1, 2, 3].map((_, idx) => (
        <PostImageCard
          key={"imageCard" + idx}
          imgSrc={images[idx] ? images[idx].src : ""}
          size={!idx ? "lg" : "sm"}
          index={idx}
          addImage={handleClickImageFile}
          removeImage={() => handleClickRemoveImageFile(idx)}
        />
      ))}
    </div>
  );
}
