import MainCardContainer from "@/containers/main/MainCardContainer";
import MainGameCommunityContainer from "@/containers/main/MainGameCommunityContainer";
import MainMarqueeContainer from "@/containers/main/MainMarqueeContainer";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="relative w-full max-w-screen overflow-x-hidden flex flex-col items-center h-screen mb-[152px]">
        <Image
          className="w-[31.927vw] max-w-[613px] absolute -scale-x-100 top-[1.1vw] -left-[148px] pointer-events-none"
          src="/assets/images/cloud.png"
          alt="cloud"
          width={613}
          height={340}
        />
        <Image
          className="w-[31.927vw] max-w-[613px] absolute top-[26.8vh] -right-[148px] pointer-events-none"
          src="/assets/images/cloud.png"
          alt="cloud"
          width={613}
          height={340}
        />
        <div className="w-full pt-[13vh] flex-grow flex flex-col justify-between items-center gap-[8.45vw] overflow-hidden">
          <h2 className="flex items-center justify-center">
            <Image
              className="w-[calc(100%-80px)] max-w-[584px] "
              src="/assets/images/main-title.png"
              alt="title"
              width={584}
              height={210}
            />
          </h2>
          <MainCardContainer />
        </div>
        <MainMarqueeContainer />
      </section>
      <MainGameCommunityContainer />
    </>
  );
}
