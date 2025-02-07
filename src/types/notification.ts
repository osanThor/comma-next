import { UserType } from "./auth";

export type NotificationType = {
  created_at: string;
  id: number;
  is_read: boolean;
  message: string;
  sender_id: string;
  target_id: string;
  target_type?: "post" | "comment";
  type?: "like" | "comment";
  user_id: string;
  sender: UserType;
};
