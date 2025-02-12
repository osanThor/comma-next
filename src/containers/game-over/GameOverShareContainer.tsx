"use client";

import { formatPlayTime } from "@/classes/shooting/utils";
import { createPost } from "@/services/post.service";
import { uploadImage } from "@/services/upload.service";
import { useAuthStore } from "@/stores/authStore";
import { useGameStore } from "@/stores/gameStore";
import { useToastStore } from "@/stores/toastStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Props = {
  gameName: string;
  imageBlobs: { file: File; preview: string }[];
  onUploadImg: (file: { file: File; preview: string }) => void;
  onRemoveImg: () => void;
  onCancel: () => void;
};

export default function GameOverShareContainer({
  gameName,
  imageBlobs,
  onUploadImg,
  onRemoveImg,
  onCancel,
}: Props) {
  const router = useRouter();

  const gamePayload = useGameStore((state) => state.gamePayload);
  const user = useAuthStore((state) => state.user);
  const addToast = useToastStore((state) => state.addToast);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClickFile = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) return;

    const newFile = {
      file: files[0],
      preview: URL.createObjectURL(files[0]),
    };
    onUploadImg(newFile);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id) return addToast("로그인해주세요.", "error");
    if (!gamePayload) return addToast("게임정보를 가져올수없어요.", "error");
    setLoading(true);
    try {
      const images = await Promise.all(
        imageBlobs.map((file) => uploadImage(file.file))
      );
      const data = await createPost({
        userId: user.id,
        title: title,
        category: gameName,
        content: content,
        images,
        score: `${gamePayload.score}점`,
        playTime: formatPlayTime(gamePayload.playTime),
      });

      if (data && data.postId) {
        const postId = data.postId;
        router.push(`/post/${postId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center">
        <input
          type="text"
          className="w-[calc(100%-32px)] max-w-[372px] mt-[52px] mx-auto text-white font-dnf text-3xl placeholder:text-white placeholder:font-dnf placeholder:opacity-70 bg-transparent text-center focus:outline-none border-none shadow-none focus:placeholder-transparent"
          placeholder="제목을 입력해 주세요..."
          maxLength={15}
          value={title || ""}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="w-[calc(100%-32px)] max-w-[372px] h-[2px] bg-white mt-3 opacity-50"></div>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-[calc(100%-32px)] max-w-[332px] h-[192px] border-[6px] mt-9 border-white rounded-[10px] flex items-center justify-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChangeFile}
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
          />
          {imageBlobs.length === 0 && (
            <button
              type="button"
              onClick={handleClickFile}
              className="absolute w-[42px] h-[42px] rounded-full flex items-center justify-center text-white text-xl shadow-lg"
            >
              <img
                src="/assets/images/icons/gameOver-postEdit-ImgPlus-icon.svg"
                alt="Add Image"
              />
            </button>
          )}
          {imageBlobs.length > 0 && (
            <>
              <div className="w-full h-full relative">
                <Image
                  src={imageBlobs[0].preview}
                  alt="첨부된 이미지"
                  className="w-full h-full object-cover rounded-md"
                  fill
                />
              </div>
              <button
                onClick={onRemoveImg}
                type="button"
                className="group absolute bottom-[-16px] right-[-16px] w-[42px] h-[42px] bg-point-500 hover:bg-white rounded-full flex items-center justify-center text-white text-xl shadow-lg"
              >
                <Image
                  src="/assets/images/icons/trash-white.svg"
                  alt="Delete Image"
                  className="w-7 h-7 object-contain group-hover:hidden"
                  width={28}
                  height={28}
                />
                <Image
                  src="/assets/images/icons/trash-pink.svg"
                  alt="Delete Image Hover"
                  className="w-7 h-7 object-contain hidden group-hover:block"
                  width={28}
                  height={28}
                />
              </button>
            </>
          )}
        </div>
        <div className="w-[calc(100%-32px)] max-w-[372px] h-[230px] border-2 mt-9 border-main-100 rounded-[10px] bg-white bg-opacity-10">
          <textarea
            name="content"
            className="w-full h-full pt-6 pl-8 pr-7 text-white bg-transparent placeholder:text-main-100 placeholder:font-pretendard placeholder:text-base focus:outline-none resize-none focus:placeholder-transparent"
            placeholder="최고의 순간을 공유해 보세요!"
            value={content || ""}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
      </div>
      <div className="w-full flex flex-col items-center my-12">
        <div className="w-[calc(100%-32px)] flex flex-row items-center justify-center gap-4 md:gap-8">
          <button
            onClick={onCancel}
            type="button"
            className="font-dnf text-lg md:text-xl text-white w-full max-w-[160px] h-[64px] rounded-xl bg-main-400"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={loading}
            className="font-dnf text-lg md:text-xl text-white w-full max-w-[160px] h-[64px] rounded-xl bg-point-500"
          >
            SHARE
          </button>
        </div>
      </div>
    </form>
  );
}
