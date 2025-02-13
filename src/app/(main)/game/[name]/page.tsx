import Footer from "@/components/common/Footer";
import GameBanner from "@/components/game/GameBanner";
import GameDescription from "@/components/game/GameDescription";
import GameCommunityContainer from "@/containers/game-view/GameCommunityContainer";
import GameListContainer from "@/containers/game-view/GameListContainer";
import GameRankingContainer from "@/containers/game-view/GameRankingContainer";
import { getGameByName } from "@/services/game.service";
import { getMetadata } from "@/utils/getMetadata";

type Props = {
  params: Promise<{ name: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { name: gameName } = await params;
  const data = await getGameByName(gameName);
  return getMetadata({
    title: data.display_name,
    ogImage: `/meta/${gameName}.png`,
  });
}

export default async function GamePage({ params }: Props) {
  const { name: gameName } = await params;
  return (
    <>
      <div className="w-[calc(100%-40px)] max-w-[1440px] min-h-screen pt-[120px] flex flex-col gap-20">
        <div className="w-full grid grid-cols-8 lg:grid-cols-16 gap-4 md:gap-7">
          <GameBanner gameName={gameName} />
          <GameDescription gameName={gameName} />
          <GameListContainer gameName={gameName} />
        </div>
        <div className="w-full grid grid-cols-8 lg:grid-cols-16 gap-4 md:gap-7">
          <GameCommunityContainer gameName={gameName} />
          <GameRankingContainer gameName={gameName} />
        </div>
      </div>
      <Footer />
    </>
  );
}
