"use client";

import { getGameByName, updateGameScore } from "@/services/game.service";
import { useAuthStore } from "@/stores/authStore";
import { useGameStore } from "@/stores/gameStore";
import { useEffect, useState } from "react";
import GameOverInfoContainer from "./GameOverInfoContainer";
import { useToastStore } from "@/stores/toastStore";
import html2canvas from "html2canvas";
import GameOverShareContainer from "./GameOverShareContainer";
import GameOverNotUserContainer from "./GameOverNotUserContainer";

type Props = {
  gameName: string;
};

export default function GameOverModalContainer({ gameName }: Props) {
  const user = useAuthStore((state) => state.user);
  const gamePayload = useGameStore((state) => state.gamePayload);
  const updateGamePayload = useGameStore((state) => state.updateGamePayload);
  const addToast = useToastStore((state) => state.addToast);

  const [gameId, setGameId] = useState<string | null>(null);

  const [gameResult, setGameResult] = useState("");

  const [isShare, setIsShare] = useState(false);
  const [imageBlobs, setImageBlobs] = useState<
    { file: File; preview: string }[]
  >([]);

  const handleRest = () => {
    setGameResult("");
    updateGamePayload(null);
    setIsShare(false);
  };

  const handleClose = () => {
    handleRest();
    window.location.reload();
  };

  const handleChangeIsShare = (newValue: boolean) => {
    if (newValue === true) {
      openGameShareModal();
    }
    setIsShare(newValue);
  };

  const handleUploadImage = (newFile: { file: File; preview: string }) => {
    setImageBlobs([newFile]);
  };

  const handleRemoveImage = () => {
    setImageBlobs([]);
  };

  const openGameShareModal = () => {
    const screenElement = document.querySelector(".capture") as HTMLElement;
    if (!screenElement) {
      addToast("캡처할 요소를 찾을 수 없어요..", "error");
      console.error("캡처할 요소를 찾을 수 없습니다.");
      return;
    }

    html2canvas(screenElement, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
    })
      .then((canvas) => {
        const imageData = canvas.toDataURL("image/jpeg");

        canvas.toBlob((blob) => {
          if (blob) {
            const fileName = `capture-${Date.now()}.jpeg`;
            const file = new File([blob], fileName, { type: blob.type });
            setImageBlobs([{ file, preview: imageData }]);
            setIsShare(true);
          } else {
            console.error("Blob 생성 실패");
          }
        }, "image/jpeg");
      })
      .catch((error) => {
        console.error("캡처 실패:", error);
      });
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
  }, [gamePayload]);

  useEffect(() => {
    handleRest();
  }, []);

  return (
    <>
      {gamePayload !== null && (
        <div className="fixed inset-0 flex justify-center items-center z-50 pt-10 bg-main-50/50 backdrop-blur-sm">
          <div className="relative w-[calc(100%-40px)] max-w-[530px] h-[calc(100%-40px)] max-h-[748px] border-4 border-white rounded-[28px] bg-main-500">
            <div className="w-full h-full overflow-y-auto">
              {!user ? (
                <>
                  <GameOverNotUserContainer onClose={handleClose} />
                </>
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
                <>
                  <GameOverShareContainer
                    gameName={gameName}
                    imageBlobs={imageBlobs}
                    onUploadImg={handleUploadImage}
                    onRemoveImg={handleRemoveImage}
                    onCancel={() => handleChangeIsShare(false)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
