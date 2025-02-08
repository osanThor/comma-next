import Footer from "@/components/common/Footer";
import PostCommentsContainer from "@/containers/post/PostCommentsContainer";
import PostContentContainer from "@/containers/post/PostContentContainer";
import PostImageContainer from "@/containers/post/PostImageContainer";
import { getPost } from "@/services/post.service";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getPost(id);
  return (
    <>
      <div className="contents-box mx-auto flex flex-col min-h-[calc(100vh-193px)] items-center justify-start mt-24 mb-10 w-[calc(100%-40px)] max-w-[1440px] py-4 md:py-10 lg:py-[120px] h-auto">
        <section className="w-[calc(100%-40px)] max-w-[1092px] flex flex-col flex-grow gap-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
            <PostImageContainer post={data} />
            <article className="flex flex-col gap-4 justify-between text-white flex-grow w-full">
              <PostContentContainer post={data} />
            </article>
          </div>
          <PostCommentsContainer />
        </section>
      </div>
      <Footer />
    </>
  );
}
