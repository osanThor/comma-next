import PostEditorContainer from "@/containers/post-editor/PostEditorContainer";
import { getPost } from "@/services/post.service";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostEditPage({ params }: Props) {
  const { id } = await params;
  const data = await getPost(id);
  return (
    <div className="contents-box mx-auto w-[calc(100%-40px)] flex flex-col items-center justify-start mt-24 md:py-16 md:px-20 lg:py-24 lg:px-28 mb-80 max-w-[1440px] px-10 py-10 h-auto">
      <PostEditorContainer post={data} />
    </div>
  );
}
