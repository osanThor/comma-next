import { UserType } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InAuthStore {
  user: UserType | null;
  updateUser: (user: UserType | null) => void;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create(
  persist<InAuthStore>(
    (set, get) => ({
      user: null,
      updateUser: (user) => set({ user }),
      isLoggedIn: () => !!get().user,
    }),
    {
      name: "auth-storage",
    }
  )
);
