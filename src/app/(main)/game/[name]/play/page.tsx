import notFound from "@/app/not-found";
import GameOverModalContainer from "@/containers/game-over/GameOverModalContainer";
import BounceBallContainer from "@/containers/game/BounceBallContainer";
import FlappyBooContainer from "@/containers/game/FlappyBooContainer";
import MineSweeperContainer from "@/containers/game/MineSweeperContainer";
import ShootingContainer from "@/containers/game/ShootingContainer";
import TetrisContainer from "@/containers/game/TetrisContainer";
import { getGameByName } from "@/services/game.service";
import { getMetadata } from "@/utils/getMetadata";
import { isMobileDevice } from "@/utils/isMobileDevice";
import { JSX } from "react";

type Props = {
  params: Promise<{ name: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { name: gameName } = await params;
  const data = await getGameByName(gameName);
  return getMetadata({
    title: `플레이 ${data.display_name}`,
  });
}

const GAME_CONTAINERS = {
  tetris: <TetrisContainer />,
  bounceBall: <BounceBallContainer />,
  flappyBoo: <FlappyBooContainer />,
  mineSweeper: <MineSweeperContainer />,
  shooting: <ShootingContainer />,
} as { [key: string]: JSX.Element };

export default async function GamePlayPage({ params }: Props) {
  const { name: gameName } = await params;
  const isMobile = await isMobileDevice();

  if (!Object.keys(GAME_CONTAINERS).includes(gameName)) return notFound();

  return (
    <div className="w-full flex justify-center items-center h-screen pt-[16.666vh] pb-[11.111vh] ">
      <section className="w-[calc(100%-40px)] max-w-[1300px] h-[700px] bg-black flex items-center justify-center rounded-3xl overflow-hidden capture">
        {isMobile ? (
          <div className="w-full h-full bg-main-600 flex items-center justify-center text-center font-bold text-white leading-9">
            ｡°(っ°´o`°ｃ)°｡
            <br />
            <b>PC</b>로 다시 접속해주세요..
          </div>
        ) : (
          <>{GAME_CONTAINERS[gameName]}</>
        )}
        <GameOverModalContainer gameName={gameName} />
      </section>
    </div>
  );
}
