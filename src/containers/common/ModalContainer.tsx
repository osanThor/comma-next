"use client";
import { useModalStore } from "@/stores/modalStore";
import { useRef } from "react";

export default function ModalContainer() {
  const modalBgRef = useRef<HTMLDivElement>(null);

  const isOpen = useModalStore((state) => state.isOpen);
  const modalOptions = useModalStore((state) => state.modalOptions);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleClickBg = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalBgRef.current && modalBgRef.current === e.target) closeModal();
  };
  const handleClickButton = () => {
    modalOptions.handler();
    closeModal();
  };
  return (
    <>
      {isOpen && (
        <div
          ref={modalBgRef}
          className="fixed top-0 left-0 bottom-0 right-0 bg-main-500/50 backdrop-blur-sm flex items-center justify-center z-[999999]"
          onClick={handleClickBg}
        >
          <div className="w-[calc(100%-32px)] max-w-[472px] flex flex-col items-center font-dnf text-white p-6 bg-main-500/80 border-2 border-white rounded-xl">
            <div className="text-xl mb-3">｡°(っ°´o`°ｃ)°｡</div>
            <div className="text-lg mb-6 text-center max-w-[320px] break-keep whitespace-pre-line">
              {modalOptions.message}
            </div>
            <div className="flex items-center justify-center gap-6 text-lg">
              <button
                onClick={handleClickButton}
                className="p-1 w-[140px] h-[50px] rounded-lg bg-main-400 hover:bg-main-300"
              >
                {modalOptions.btnTxt}
              </button>
              {modalOptions.type !== "alert" && (
                <button
                  onClick={closeModal}
                  className="p-1 w-[140px] h-[50px] rounded-lg bg-point-500 hover:bg-point-400"
                >
                  돌아가기
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
