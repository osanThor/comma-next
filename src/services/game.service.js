import supabase from "@/lib/supabase/client";

export const getGames = async () => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("order", { ascending: false });

  if (error) throw error;
  return data;
};

export const getGameByName = async (gameName) => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("name", gameName)
    .single();

  if (error) throw error;
  return data;
};

export const updateGameScore = async (gameId, userId, score, playTime) => {
  const { data: existingGameData, error: existingGameError } = await supabase
    .from("game_scores")
    .select("score,total_play_time")
    .eq("game_id", gameId)
    .eq("user_id", userId)
    .single();
  if (existingGameError && existingGameError.code === "PGRST116") {
    const { error: insertGameError } = await supabase
      .from("game_scores")
      .insert([
        {
          game_id: gameId,
          user_id: userId,
          score,
          play_time: playTime,
          total_play_time: playTime,
        },
      ]);
    if (insertGameError) throw insertGameError;
    return "new success";
  }
  if (existingGameError) {
    throw existingGameError;
  }

  const renewal = existingGameData.score < score;

  const { error: updateGameError } = await supabase
    .from("game_scores")
    .update([
      {
        score: renewal ? score : existingGameData.score,
        play_time: renewal ? playTime : existingGameData.play_time,
        total_play_time: existingGameData.total_play_time + playTime,
      },
    ])
    .eq("game_id", gameId)
    .eq("user_id", userId);
  if (updateGameError) throw updateGameError;
  return renewal ? "new success" : "success";
};

export const getGameRanking = async (gameId, sortType = "desc") => {
  const { data, error } = await supabase
    .from("game_scores")
    .select(
      "*,user:user_id(id, name, email, profile_image),game:game_id(id,name,display_name)"
    )
    .eq("game_id", gameId)
    .order("score", { ascending: sortType === "asc" });
  if (!data) return [];
  if (error) throw error;

  return data.map((game, idx) => ({ ...game, rank: idx + 1 }));
};

export const getGameScoreByUser = async (userId, sortType = "desc") => {
  const { data, error } = await supabase
    .from("game_scores")
    .select("*")
    .eq("user_id", userId)
    .order("score", { ascending: sortType === "asc" });

  if (!data) return [];
  if (error) throw error;

  return data;
};
