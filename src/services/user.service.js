import supabase from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";

// 로그인
export const loginWithSocial = async (provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${import.meta.env.VITE_PUBLIC_URL}/login`,
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
export const getUserById = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

// 회원 확인 or 회원가입
export const upsertUser = async (user) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code === "PGRST116") {
    const { addToast } = useToastStore();
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
export const updateUserProfile = async (userId, updates) => {
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
  const { updateUser } = useAuthStore();
  console.log("Auth event:", event);

  if (!session?.user) {
    updateUser(null);
    return;
  }

  if (event === "SIGNED_IN") {
    setTimeout(async () => {
      try {
        const user = await upsertUser(session.user);
        updateUser(user);
      } catch (error) {
        const { addToast } = useToastStore();
        console.error("Error handling auth state change:", error);
        if (error.code === "23505")
          addToast("이미 사용중인 이메일입니다.", "error");
        else addToast(error.message, "error");
        updateUser(null);
      }
    }, 0);
  } else if (event === "SIGNED_OUT") {
    updateUser(null);
  }
});
