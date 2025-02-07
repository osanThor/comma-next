import { getGameRanking, getGames } from "@/services/game.service";
import { UserType } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InGame {
  id: string;
  name: string;
  display_name: string;
}

interface InRanker {
  game: InGame;
  user: UserType;
}

interface InGameStore {
  games: InGame[];
  gameTopRankers: Record<string, InRanker | null>;
  getGamesData: () => Promise<void>;
  getGameTopRanker: (gameId: string) => Promise<InRanker | null>;
  getGameTopRankers: () => Promise<void>;
}

export const useGameStore = create(
  persist<InGameStore>(
    (set, get) => ({
      games: [],
      gameTopRankers: {
        flappyBoo: null,
        mineSweeper: null,
        bounceBall: null,
        tetris: null,
        shooting: null,
      },
      getGamesData: async () => {
        try {
          const data = await getGames();
          if (data) set({ games: data });
        } catch (err) {
          console.error("GET GAME ERROR", err);
          throw err;
        }
      },

      getGameTopRanker: async (gameId: string) => {
        try {
          const data = await getGameRanking(gameId);
          if (data.length > 0) {
            const gameName = data[0].game?.name;
            if (gameName) {
              set((state) => ({
                gameTopRankers: {
                  ...state.gameTopRankers,
                  [gameName]: data[0],
                },
              }));
            }
            return data[0];
          }
          return null;
        } catch (err) {
          console.error("GET RANKER ERROR", err);
          throw err;
        }
      },
      getGameTopRankers: async () => {
        try {
          const { games } = get();
          if (games.length) {
            await Promise.all(
              games.map((game) => get().getGameTopRanker(game.id))
            );
          }
        } catch (err) {
          console.error(err);
        }
      },
    }),
    {
      name: "game-storage",
    }
  )
);
