import PostEditorContainer from "@/containers/post-editor/PostEditorContainer";
import { getMetadata } from "@/utils/getMetadata";

export async function generateMetadata() {
  return getMetadata({ title: "포스트 작성" });
}

export default function PostWritePage() {
  return (
    <div className="contents-box mx-auto w-[calc(100%-40px)] flex flex-col items-center justify-start mt-24 md:py-16 lg:py-24  mb-80 max-w-[1440px] px-10 py-10 h-auto">
      <PostEditorContainer />
    </div>
  );
}
