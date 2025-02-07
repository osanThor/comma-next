import supabase from "@/lib/supabase/client";

type SortType = "desc" | "asc" | "likes" | "comments";

interface InDefaultPost {
  title: string;
  content: string;
  images: string[];
}

interface InPostBody extends InDefaultPost {
  userId: string;
  title: string;
  category: string;
  score: string | null;
  playTime: string | null;
}

interface InPostPayload extends InDefaultPost {
  postId: string;
}

const formetSort = (value: SortType) => {
  switch (value) {
    case "desc":
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
  category: string = "free",
  sort: SortType = "desc",
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
  userId: string,
  sort: SortType = "desc",
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
  userId: string,
  sort: SortType = "desc",
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
  score,
  playTime,
}: InPostBody) => {
  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        title,
        category,
        content,
        images,
        score,
        user_id: userId,
        play_time: playTime,
      },
    ])
    .select("id");
  if (error) throw error;
  if (data && data.length > 0)
    return { postId: data[0].id, message: "success" };
  return new Error("Create Post Fail");
};

export const updatePost = async ({
  postId,
  title,
  content,
  images,
}: InPostPayload) => {
  const { error } = await supabase
    .from("posts")
    .update({ title, content, images })
    .eq("id", postId);

  if (error) throw error;
  return { postId, message: "success" };
};

export const deletePost = async (postId: string) => {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;
  return "success";
};

export const getPost = async (postId: string) => {
  const { data, error } = await supabase
    .from("posts_with_counts")
    .select("*,user:user_id(id, name, email, profile_image)")
    .eq("id", postId)
    .single();

  if (error) throw error;
  return data;
};
