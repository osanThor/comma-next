import Footer from "@/components/common/Footer";
import GameBanner from "@/components/game/GameBanner";
import GameDescription from "@/components/game/GameDescription";
import GameListContainer from "@/containers/game/GameListContainer";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function GamePage({ params }: Props) {
  const { name: gameName } = await params;
  return (
    <>
      <div className="w-[calc(100%-40px)] max-w-[1440px] min-h-screen pt-[120px]">
        <div className="w-full grid grid-cols-8 lg:grid-cols-16 gap-4 md:gap-7">
          <GameBanner gameName={gameName} />
          <GameDescription gameName={gameName} />
          <GameListContainer gameName={gameName} />
        </div>
      </div>
      <Footer />
    </>
  );
}
