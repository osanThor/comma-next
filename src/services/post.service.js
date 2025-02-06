import supabase from "@/lib/supabase/client";

const formetSort = (value) => {
  switch (value) {
    case "dec":
      return ["created_at", "desc"];
    case "asc":
      return ["created_at", "asc"];
    case "likes":
      return ["like_count", "desc"];
    case "comments":
      return ["comment_count", "desc"];
    default:
      return ["created_at", "desc"];
  }
};

export const getPostsByCategory = async (
  category = "free",
  sort = "dec",
  page = 1,
  limit = 10,
  query = ""
) => {
  const { count, error: countError } = await supabase
    .from("posts_with_counts")
    .select("id", { count: "exact" })
    .eq("category", category)
    .ilike("title", `%${query}%`);

  if (countError) throw countError;

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const [sortBy, sortType] = formetSort(sort);

  const { data, error } = await supabase
    .from("posts_with_counts")
    .select("*,user:user_id(id, name, email, profile_image)")
    .eq("category", category)
    .ilike("title", `%${query}%`)
    .order(sortBy, { ascending: sortType === "asc" })
    .range(start, end);

  if (error) throw error;

  return { data: data || [], totalCount: count };
};

export const getPostsByUserId = async (
  userId,
  sort = "dec",
  isComma = false,
  page = 1,
  limit = 10
) => {
  const { count, error: countError } = await supabase
    .from("posts_with_counts")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .filter("category", isComma ? "eq" : "neq", "free");

  if (countError) throw countError;

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const [sortBy, sortType] = formetSort(sort);

  const { data, error } = await supabase
    .from("posts_with_counts")
    .select("*,user:user_id(id, name, email, profile_image)")
    .eq("user_id", userId)
    .filter("category", isComma ? "eq" : "neq", "free")
    .order(sortBy, { ascending: sortType === "asc" })
    .range(start, end);

  if (error) throw error;

  return { data: data || [], totalCount: count };
};

export const getLikedPosts = async (
  userId,
  sort = "dec",
  isComma = false,
  page = 1,
  limit = 10
) => {
  const { data: likedPost, error: likedPostError } = await supabase
    .from("likes")
    .select("post_id")
    .eq("user_id", userId);

  if (likedPostError) throw likedPostError;

  const postIds = likedPost
    .filter((like) => like.post_id)
    .map((like) => like.post_id);

  if (postIds.length === 0) return { data: [], totalCount: 0 };

  const { count, error: countError } = await supabase
    .from("posts_with_counts")
    .select("id", { count: "exact" })
    .in("id", postIds)
    .filter("category", isComma ? "eq" : "neq", "free");

  if (countError) throw countError;

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const [sortBy, sortType] = formetSort(sort);

  const { data, error } = await supabase
    .from("posts_with_counts")
    .select("*,user:user_id(id, name, email, profile_image)")
    .in("id", postIds)
    .filter("category", isComma ? "eq" : "neq", "free")
    .order(sortBy, { ascending: sortType === "asc" })
    .range(start, end);

  if (error) throw error;

  return { data: data || [], totalCount: count };
};

export const createPost = async ({
  userId,
  title,
  category,
  content,
  images,
  score, // string | null
  playTime, // string | null
}) => {
  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        title,
        category,
        content,
        images,
        user_id: userId,
        score,
        play_time: playTime,
      },
    ])
    .select("id");
  if (error) throw error;
  if (data && data.length > 0)
    return { postId: data[0].id, message: "success" };
  return new Error("Create Post Fail");
};

export const updatePost = async ({ postId, title, content, images }) => {
  const { error } = await supabase
    .from("posts")
    .update({ title, content, images })
    .eq("id", postId);

  if (error) throw error;
  return { postId, message: "success" };
};

export const deletePost = async (postId) => {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;
  return "success";
};

export const getPost = async (postId) => {
  const { data, error } = await supabase
    .from("posts_with_counts")
    .select("*,user:user_id(id, name, email, profile_image)")
    .eq("id", postId)
    .single();

  if (error) throw error;
  return data;
};
