import {
  GameScoreSchema,
  getGameRanking,
  getGameScoreByUser,
  getGames,
} from "@/services/game.service";
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
  score: number;
}

export interface InUserRank extends GameScoreSchema {
  rank: number;
  game: InGame;
}

interface InGameStore {
  games: InGame[];
  userGames: GameScoreSchema[];
  playTime: number;
  rankings: InUserRank[];
  gameTopRankers: Record<string, InRanker | null>;
  getGamesData: () => Promise<void>;
  getGameTopRanker: (gameId: string) => Promise<InRanker | null>;
  getGameTopRankers: () => Promise<void>;
  getUserGameScores: (userId: string) => Promise<void>;
  getRankings: (userId: string) => Promise<void>;
}

export const useGameStore = create(
  persist<InGameStore>(
    (set, get) => ({
      games: [],
      userGames: [],
      playTime: 0,
      rankings: [],
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

      getUserGameScores: async (userId: string) => {
        try {
          const data = await getGameScoreByUser(userId);
          if (data) {
            set({
              userGames: data,
            });
          }
        } catch (err) {
          console.error(err);
        }
      },

      getRankings: async (userId: string) => {
        const { userGames } = get();
        if (userGames.length === 0) return;
        try {
          const data = await Promise.all(
            userGames.map((game) => getGameRanking(game.game_id))
          );
          const ranks = data.map((rankingArr) =>
            rankingArr.find((ranking) => ranking.user_id === userId)
          );
          set({ rankings: ranks });

          const totalPlayTime = ranks.reduce((acc, rank) => {
            return acc + (rank?.total_play_time || 0);
          }, 0);

          set({ playTime: totalPlayTime });
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
