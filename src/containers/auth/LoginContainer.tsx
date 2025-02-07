"use client";
import KakaoIcon from "@/components/common/icons/KakaoIcon";
import { loginWithSocial } from "@/services/user.service";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginContainer() {
  const user = useAuthStore((state) => state.user);
  const addToast = useToastStore((state) => state.addToast);

  const router = useRouter();

  const googleLogin = async () => await loginWithSocial("google");

  const kakaoLogin = async () => await loginWithSocial("kakao");

  useEffect(() => {
    if (user !== null) {
      router.push("/");
      addToast("로그인 성공! 어서오세요.");
    }
  }, [user]);
  return (
    <div className="w-full max-w-[299px] flex flex-col gap-5">
      <button
        className="bg-kakao transition-all hover:bg-[#261C07] text-black hover:text-kakao rounded-full flex items-center justify-center h-[53px] font-semibold"
        type="button"
        aria-label="kakao login"
        onClick={kakaoLogin}
      >
        <span className="mr-3">
          <KakaoIcon />
        </span>
        카카오로 시작하기
      </button>
      <button
        className="bg-white rounded-full flex items-center justify-center h-[53px] font-semibold hover:bg-[#1A3672] hover:text-white transition-all"
        type="button"
        aria-label="google login"
        onClick={googleLogin}
      >
        <span className="flex items-center justify-center w-6 h-6 mr-2">
          <Image
            className="object-cover w-5"
            src="/assets/images/icons/google-icon.svg"
            alt="google icon"
            width={20}
            height={20}
          />
        </span>
        Google로 시작하기
      </button>
    </div>
  );
}
