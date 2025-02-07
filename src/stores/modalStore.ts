import { create } from "zustand";

interface InModalOptions {
  type: "confirm" | "alert";
  message: string;
  btnTxt: string;
  handler: () => void;
}

interface InModalStore {
  isOpen: boolean;
  modalOptions: InModalOptions;
  openModal: (
    message: string,
    btnTxt: string,
    handler?: () => void,
    type?: "confirm" | "alert"
  ) => void;
  closeModal: () => void;
}
export const useModalStore = create<InModalStore>((set) => ({
  isOpen: false,
  modalOptions: {
    type: "confirm",
    message: "",
    btnTxt: "",
    handler: () => set({ isOpen: false }),
  },
  openModal: (
    message,
    btnTxt,
    handler = () => set({ isOpen: false }),
    type = "confirm"
  ) => {
    set({
      isOpen: true,
      modalOptions: {
        type,
        message,
        btnTxt,
        handler,
      },
    });
  },
  closeModal: () => {
    set({ isOpen: false });
  },
}));
