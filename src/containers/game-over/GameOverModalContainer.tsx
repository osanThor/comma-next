"use client";

import { getGameByName, updateGameScore } from "@/services/game.service";
import { useAuthStore } from "@/stores/authStore";
import { useGameStore } from "@/stores/gameStore";
import { useEffect, useState } from "react";
import GameOverInfoContainer from "./GameOverInfoContainer";

type Props = {
  gameName: string;
};

export default function GameOverModalContainer({ gameName }: Props) {
  const user = useAuthStore((state) => state.user);
  const gamePayload = useGameStore((state) => state.gamePayload);
  const updateGamePayload = useGameStore((state) => state.updateGamePayload);
  const [gameId, setGameId] = useState<string | null>(null);

  const [gameResult, setGameResult] = useState("");

  const [isShare, setIsShare] = useState(false);

  const handleClose = () => {
    setGameResult("");
    updateGamePayload(null);
    setIsShare(false);
  };

  const handleChangeIsShare = (newValue: boolean) => {
    setIsShare(newValue);
  };

  useEffect(() => {
    if (!user || !gamePayload) return;
    const handleGameOver = async () => {
      const game = await getGameByName(gameName);
      setGameId(game.id);
      const updateResult = await updateGameScore(
        game.id,
        user.id,
        gamePayload.score,
        gamePayload.playTime
      );

      setGameResult(updateResult);
    };
    handleGameOver();
    return () => {
      setGameResult("");
      updateGamePayload(null);
    };
  }, [gamePayload]);

  return (
    <>
      {gamePayload !== null && (
        <div className="fixed inset-0 flex justify-center items-center z-50 pt-10 bg-main-50/50 backdrop-blur-sm">
          <div className="relative w-[calc(100%-40px)] max-w-[530px] h-[calc(100%-40px)] max-h-[748px] border-4 border-white rounded-[28px] bg-main-500">
            <div className="w-full h-full overflow-y-auto">
              {!user ? (
                <></>
              ) : !isShare ? (
                <>
                  {gameId && (
                    <GameOverInfoContainer
                      gameResult={gameResult}
                      gameId={gameId}
                      onClose={handleClose}
                      onShare={() => handleChangeIsShare(true)}
                    />
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
