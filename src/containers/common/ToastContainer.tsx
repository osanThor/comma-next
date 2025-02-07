"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "@/stores/toastStore";
import { twMerge } from "tailwind-merge";
import CommaIcon from "@/components/common/icons/CommaIcon";

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed z-[99999] bottom-10 right-7 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={twMerge(
              "w-[calc(100vw-32px)] max-w-[470px] rounded-xl border-2 px-10 py-[24px] text-white font-dnf border-white shadow-lg transition backdrop-blur-sm flex justify-center items-center gap-2",
              toast.type === "success" ? "bg-point-500/30" : "bg-[#0A90CE]/30"
            )}
            onClick={() => removeToast(toast.id)} // 클릭하면 제거
          >
            <CommaIcon />
            <span>
              {toast.message}{" "}
              {toast.type === "success" ? " ♡(*´ ˘ `*)♡" : " (っ°´o`°ｃ)"}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
