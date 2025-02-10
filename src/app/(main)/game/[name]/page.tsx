import Footer from "@/components/common/Footer";
import GameBanner from "@/components/game/GameBanner";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function GamePage({ params }: Props) {
  const { name: gameName } = await params;
  return (
    <>
      <div className="w-[calc(100%-40px)] max-w-[1440px] min-h-screen pt-[120px]">
        <div className="w-full grid grid-cols-5 gap-4 md:gap-7">
          <GameBanner gameName={gameName} />
          <div className="col-span-1 row-span-2 bg-white p-4"></div>
          <div className="col-span-1 row-span-1 bg-white p-4"></div>
          <div className="col-span-1 row-span-1 bg-white p-4"></div>
          <div className="col-span-1 row-span-1 bg-white p-4"></div>
          <div className="col-span-1 row-span-1 bg-white p-4"></div>
        </div>
      </div>
      <Footer />
    </>
  );
}
