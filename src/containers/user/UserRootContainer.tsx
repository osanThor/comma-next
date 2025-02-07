"use client";

import { getUserById } from "@/services/user.service";
import { useToastStore } from "@/stores/toastStore";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import UserProfileContainer from "./UserProfileContainer";
import UserPostContaienr from "./UserPostContaienr";
import UserLikeContainer from "./UserLikeContainer";
import UserRankContainer from "./UserRankContainer";
import UserCommentContainer from "./UserCommentContainer";

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
      {path === "post" && <UserPostContaienr userId={userId} />}
      {path === "like" && <UserLikeContainer userId={userId} />}
      {path === "rank" && <UserRankContainer />}
      {path === "comment" && <UserCommentContainer userId={userId} />}
    </>
  );
}
