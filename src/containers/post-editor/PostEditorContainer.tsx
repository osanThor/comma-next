"use client";
import { PostSchema, createPost, updatePost } from "@/services/post.service";
import PostEditorContentsContainer from "./PostEditorContentsContainer";
import PostImageContainer from "./PostImageContainer";
import { useLayoutEffect, useState } from "react";
import { useToastStore } from "@/stores/toastStore";
import { useModalStore } from "@/stores/modalStore";
import { uploadImage } from "@/services/upload.service";
import { useAuthStore } from "@/stores/authStore";
import { redirect, useRouter } from "next/navigation";

type Props = {
  post?: PostSchema;
};

export default function PostEditorContainer({ post }: Props) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const addToast = useToastStore((state) => state.addToast);
  const openModal = useModalStore((state) => state.openModal);

  const [images, setImages] = useState<{ file?: File; src: string }[]>(
    post ? post.images.map((img) => ({ src: img })) : []
  );
  const [title, setTitle] = useState<string>(post ? post.title : "");
  const [content, setContent] = useState<string>(post ? post.content : "");

  const handleChangeFields = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target;
    if (name === "title") setTitle(value);
    if (name === "content") setContent(value);
  };

  const handleSavePost = async () => {
    if (!user) return;
    if (!title.trim() || !content.trim())
      return addToast("제목과 내용 모두 입력해주세요.", "error");
    if (images.length > 4)
      return addToast("이미지는 최대 4개까지 업로드 할 수 있어요!", "error");
    try {
      const uploadResults = await Promise.allSettled(
        images.map(async (image) => {
          if (image.file) {
            const uploadedUrl = await uploadImage(image.file);
            return uploadedUrl;
          } else {
            return image.src;
          }
        })
      );
      const successfulUploads = uploadResults
        .filter(
          (result): result is PromiseFulfilledResult<string> =>
            result.status === "fulfilled"
        )
        .map((result) => result.value);

      const body = {
        title,
        content,
        category: post ? post.category : "free",
        images: successfulUploads,
      };

      if (successfulUploads.length !== images.length) {
        addToast("일부 이미지를 업로드하지 못했어요.", "error");
      }
      let result;
      if (post) {
        result = await updatePost({ ...body, postId: post.id });
      } else {
        result = await createPost({
          ...body,
          userId: user.id,
          score: null,
          playTime: null,
        });
      }
      if (result) {
        addToast("성공적으로 저장되었어요!");
        router.push(`/post/${result.postId}`);
      }
    } catch (err) {
      console.error("게시글 저장 중 오류 발생:", err);
      addToast("저장에 오류가 발생했어요..", "error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openModal("이대로 저장하시겠어요?", "저장하기", handleSavePost);
  };

  useLayoutEffect(() => {
    if (!isLoggedIn()) redirect("/login");
    if (post && user && post.user_id !== user.id) redirect("/");
  }, [user, post, isLoggedIn]);

  return (
    <div className="w-full flex flex-col h-auto lg:flex-row items-center lg:items-start justify-center gap-8 lg:px-20">
      <PostImageContainer images={images} setImages={setImages} />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-end justify-between gap-4 w-full max-w-[540px]"
      >
        <PostEditorContentsContainer
          title={title}
          content={content}
          onChange={handleChangeFields}
        />
        <button
          type="submit"
          className="bg-white w-28 h-10 rounded-xl font-dnf text-main-500 disabled:opacity-50 hover:bg-point-500 ml-auto transition-all duration-60 transform hover:scale-110 hover:shadow-xl"
        >
          저장
        </button>
      </form>
    </div>
  );
}
