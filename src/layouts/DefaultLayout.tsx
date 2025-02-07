"use client";

import HeaderContainer from "@/containers/common/header/HeaderContainer";
import { useAuthStore } from "@/stores/authStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function DefaultLayout({ children }: Props) {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn()) redirect("/login");
  }, [user, isLoggedIn]);

  return (
    <div className="bg-size font-pretendard font-medium bg-main pt-">
      <HeaderContainer />
      <main className="w-full flex flex-col items-center">{children}</main>
    </div>
  );
}
