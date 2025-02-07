"use client";

import { getUserById } from "@/services/user.service";
import { useToastStore } from "@/stores/toastStore";
import { UserType } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import UserProfileContainer from "./UserProfileContainer";

type Props = {
  userId: string;
  path: string;
};

export default function UserRootContainer({ userId, path }: Props) {
  const router = useRouter();

  const addToast = useToastStore((state) => state.addToast);

  const handleGetUser = async (id: string) => {
    try {
      const data = await getUserById(id);
      if (data) {
        return data;
      } else {
        addToast("사용자를 찾을 수 없어요", "error");
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      addToast("사용자를 찾을 수 없어요", "error");
      router.push("/");
    }
  };

  const { data: user } = useSWR(userId, handleGetUser);

  return (
    <>
      <UserProfileContainer user={user} userId={userId} />
    </>
  );
}
