import supabase from "@/lib/supabase/client";
import { NotificationType } from "@/types/notification";

interface InNotificationBody {
  userId: string; // 받는 사람
  senderId: string; // 보내는 사람
  targetId?: string;
  targetType?: "post" | "comment";
  type?: "like" | "comment";
  message: string;
}

export const createNotification = async ({
  userId,
  senderId,
  targetId,
  targetType,
  type,
  message,
}: InNotificationBody) => {
  const { error } = await supabase.from("notifications").insert([
    {
      user_id: userId,
      sender_id: senderId,
      target_id: targetId,
      target_type: targetType,
      type,
      message,
    },
  ]);
  if (error) throw error;
  return "success";
};

export const realtimeNewNotifications = (
  userId: string,
  callback: (payload: Record<string, string>) => void
) => {
  return supabase
    .channel("notifications")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
};

export const getNotifications = async (
  userId: string
): Promise<NotificationType[]> => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*,sender:sender_id(id,name,profile_image)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const readNotification = async (notificationId: number) => {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) throw error;
  return "success";
};

export const readAllNotifications = async (userId: string) => {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId);

  if (error) throw error;
  return "success";
};
