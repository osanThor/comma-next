import { isMobileDevice } from "@/utils/isMobileDevice";

type Props = {
  params: Promise<{ name: string }>;
};
export default async function GamePlayPage({ params }: Props) {
  const { name: gameName } = await params;
  const isMobile = await isMobileDevice();
  return (
    <div className="w-full flex justify-center items-center h-screen pt-[16.666vh] pb-[11.111vh]">
      <section className="w-[calc(100%-40px)] max-w-[1300px] h-[700px] bg-black flex items-center justify-center rounded-3xl overflow-hidden capture">
        {isMobile ? (
          <div className="w-full h-full bg-main-600 flex items-center justify-center text-center font-bold text-white leading-9">
            ｡°(っ°´o`°ｃ)°｡
            <br />
            PC로 다시 접속해주세요..
          </div>
        ) : (
          <></>
        )}
        {/* <div className="fixed inset-0 flex justify-center items-center bg-main-800/40 z-50 pt-10">
          <game-over-modal
        :play-time="playTime"
        :score="score"
        :game-result="gameResult"
      ></game-over-modal>
        </div> */}
      </section>
    </div>
  );
}
