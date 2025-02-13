import UserEditContainer from "@/containers/user/UserEditContainer";
import { getMetadata } from "@/utils/getMetadata";

export async function generateMetadata() {
  return getMetadata({ title: "사용자 수정" });
}

export default function UserEditPage() {
  return <UserEditContainer />;
}
