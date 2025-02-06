import { create } from "zustand";

interface InToast {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface InToastStore {
  toasts: InToast[];
  addToast: (
    message: string,
    type?: InToast["type"],
    duration?: number
  ) => void;
  removeToast: (id: number) => void;
}

export const useToastStore = create<InToastStore>((set) => ({
  toasts: [],
  addToast(message, type = "success", duration = 3000) {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, duration);
  },

  removeToast(id) {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
