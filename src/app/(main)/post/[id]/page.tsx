import Avatar from "@/components/common/Avatar";
import Footer from "@/components/common/Footer";
import PostCommentsContainer from "@/containers/post/PostCommentsContainer";
import PostContentContainer from "@/containers/post/PostContentContainer";
import PostImageContainer from "@/containers/post/PostImageContainer";
import PostLikeContainer from "@/containers/post/PostLikeContainer";
import { getPost } from "@/services/post.service";
import { getMetadata } from "@/utils/getMetadata";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const data = await getPost(id);
  return getMetadata({ title: data.title });
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getPost(id);
  return (
    <>
      <div className="contents-box mx-auto flex flex-col min-h-[calc(100vh-193px)] items-center justify-start mt-24 mb-10 w-[calc(100%-40px)] max-w-[1440px] py-4 md:py-10 lg:py-[120px] h-auto">
        <section className="w-[calc(100%-40px)] max-w-[1092px] flex flex-col flex-grow gap-8">
          <div className="flex flex-col lg:flex-row items-center  lg:items-stretch gap-6 lg:gap-8">
            <PostImageContainer post={data} />
            <article className="flex flex-col gap-4 justify-between text-white flex-grow w-full">
              <PostContentContainer post={data} />
              <div className="w-full flex flex-row items-center justify-between">
                <Link
                  href={`/user/${data?.user?.id}/post`}
                  className="flex flex-row items-center gap-2 cursor-pointer bg-main-500/30 transition-all hover:bg-main-500/50 pl-4 pr-5 py-2 rounded-full"
                >
                  <Avatar
                    src={
                      data?.user?.profile_image ||
                      "/assets/images/defaultProfile.png"
                    }
                    size="sm"
                  />
                  <p className="text-lg font-medium opacity-9 pt-[1px]">
                    {data?.user?.name || "알 수 없음"}
                  </p>
                </Link>
                <PostLikeContainer post={data} />
              </div>
            </article>
          </div>
          <PostCommentsContainer postId={id} />
        </section>
      </div>
      <Footer />
    </>
  );
}
