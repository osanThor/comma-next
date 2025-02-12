import supabase from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { AuthError, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

// 로그인
export const loginWithSocial = async (provider: "google" | "kakao") => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
    },
  });
  if (error) throw error;
  return data;
};

// 로그아웃
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// 회원 정보 확인
export const getUserById = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

// 회원 확인 or 회원가입
export const upsertUser = async (user: User) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code === "PGRST116") {
    const { addToast } = useToastStore.getState();
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || "이름 없음",
          profile_image: user.user_metadata?.avatar_url || null,
          bio: null,
        },
      ])
      .select();

    if (insertError) {
      throw insertError;
    }
    addToast("회원가입 완료!");
    return newUser;
  }

  if (error) throw error;
  return data;
};

// 정보 업뎃
export const updateUserProfile = async (
  userId: string,
  updates: {
    name: string;
    bio: string | null;
    profile_image?: string;
  }
) => {
  const { error } = await supabase
    .from("users")
    .update({
      ...updates,
      updated_at: new Date(),
    })
    .eq("id", userId);

  if (error) throw error;

  return "success";
};

supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event);

  if (!session?.user) {
    const { updateUser } = useAuthStore.getState();
    updateUser(null);
    redirect("/login");
  }

  if (event === "SIGNED_IN") {
    const { updateUser } = useAuthStore.getState();
    setTimeout(async () => {
      try {
        const user = await upsertUser(session.user);
        updateUser(user);
      } catch (error: unknown) {
        const addToast = useToastStore((state) => state.addToast);
        console.error("Error handling auth state change:", error);
        if (error instanceof AuthError) {
          if (error.code === "23505") {
            addToast("이미 사용 중인 이메일입니다.", "error");
          } else {
            addToast(error.message, "error");
          }
        } else if (error instanceof Error) {
          addToast(error.message, "error");
        } else {
          addToast("알 수 없는 오류가 발생했습니다.", "error");
        }
        updateUser(null);
      }
    }, 0);
  } else if (event === "SIGNED_OUT") {
    const { updateUser } = useAuthStore.getState();
    updateUser(null);
    redirect("/login");
  }
});
