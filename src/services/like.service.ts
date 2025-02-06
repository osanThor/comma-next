import supabase from "@/lib/supabase/client";

interface InLikeBody {
  userId: string;
  targetId: string;
  targetType: "post" | "comment";
}

const filterData = ({ userId, targetId, targetType }: InLikeBody) => {
  if (!["post", "comment"].includes(targetType)) {
    throw new Error("Invalid targetType. Must be 'post' or 'comment'.");
  }

  return {
    user_id: userId,
    [`${targetType}_id`]: targetId,
  };
};

export const checkLike = async (params: InLikeBody) => {
  const filter = filterData(params);

  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .match(filter);

  if (error) throw error;

  return data.length > 0;
};

export const addLike = async (body: InLikeBody) => {
  const filter = filterData(body);

  const { error } = await supabase //
    .from("likes")
    .insert([filter]);

  if (error) throw error;

  return "success";
};

export const removeLike = async (body: InLikeBody) => {
  const filter = filterData(body);
  const { error } = await supabase //
    .from("likes")
    .delete()
    .match(filter);

  if (error) throw error;

  return "success";
};
