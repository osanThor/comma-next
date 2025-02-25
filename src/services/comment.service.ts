import supabase from "@/lib/supabase/client";
import { UserType } from "@/types/auth";
import { PostSchema } from "./post.service";

export type CommentSchema = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string | null;
  like_count: number;
  user: UserType;
  post: PostSchema;
};

export type CreateCommentType = {
  postId: string;
  content: string;
  userId: string;
};

const formetSort = (value: "desc" | "likes") => {
  switch (value) {
    case "desc":
      return ["created_at", "desc"];
    case "likes":
      return ["like_count", "desc"];
    default:
      return ["created_at", "desc"];
  }
};

export const getComments = async (
  postId: string,
  sort: "desc" | "likes" = "desc",
  page = 1,
  limit = 10
): Promise<{ data: CommentSchema[]; totalCount: number }> => {
  const { count, error: countError } = await supabase
    .from("comments_with_counts")
    .select("id", { count: "exact" })
    .eq("post_id", postId);

  if (countError) throw countError;

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const [sortBy] = formetSort(sort);

  const { data, error } = await supabase
    .from("comments_with_counts")
    .select(
      `
      *,
      user:user_id(id, name, email, profile_image)
      `
    )
    .eq("post_id", postId)
    .order(sortBy, { ascending: false })
    .range(start, end);

  if (error) throw error;

  return {
    data,
    totalCount: count || 0,
  };
};

export const getCommentsByUserId = async (
  userId: string,
  sort: "desc" | "likes" = "desc",
  page = 1,
  limit = 10
): Promise<{ data: CommentSchema[]; totalCount: number }> => {
  const { count, error: countError } = await supabase
    .from("comments_with_counts")
    .select("id", { count: "exact" })
    .eq("user_id", userId);

  if (countError) throw countError;

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const [sortBy] = formetSort(sort);

  const { data, error } = await supabase
    .from("comments_with_counts")
    .select(
      `
      *,
      user:user_id(id, name, email, profile_image),
      post:post_id(id, title)
      `
    )
    .eq("user_id", userId)
    .order(sortBy, { ascending: false })
    .range(start, end);

  if (error) throw error;

  return {
    data,
    totalCount: count || 0,
  };
};

export const createComment = async ({
  postId,
  content,
  userId,
}: CreateCommentType): Promise<{ data: CommentSchema; message: string }> => {
  const { data, error } = await supabase
    .from("comments")
    .insert([{ post_id: postId, content, user_id: userId }])
    .select("*,user:user_id(id, name, email, profile_image)");
  if (error) throw error;
  if (data && data.length > 0) return { data: data[0], message: "success" };
  throw new Error("Create Post Fail");
};

export const deleteComment = async (commentId: string) => {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);
  if (error) throw error;
  return "success";
};
