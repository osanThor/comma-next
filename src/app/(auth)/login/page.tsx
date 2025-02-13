import LoginContainer from "@/containers/auth/LoginContainer";
import { getMetadata } from "@/utils/getMetadata";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata() {
  return getMetadata({ title: "로그인" });
}

export default function page() {
  return (
    <main className="bg-size relative bg-login bg-center font-pretendard">
      <section className="absolute w-[calc(100%-32px)] max-w-[840px] h-[557px] p-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 contents-box">
        <h1 className="mb-[60px] w-[calc(100%-100px)] flex items-center justify-center">
          <Link href={"/"} className="w-full max-w-[408px]">
            <Image
              className="object-cover w-full"
              src="/assets/images/main-title.png"
              alt="logo"
              width={408}
              height={148}
            />
          </Link>
        </h1>
        <LoginContainer />
      </section>
      <Image
        className="absolute top-12 left-12 w-[20%] max-w-[170px]"
        src="/assets/images/login/play@2x.png"
        alt="play"
        width={170}
        height={46}
      />
      <Image
        className="absolute bottom-12 left-12 w-[30%] max-w-[230px]"
        src="/assets/images/login/timeline@2x.png"
        alt="timeline"
        width={230}
        height={57}
      />
      <Image
        className="absolute top-12 right-12 w-[15%] max-w-[85px]"
        src="/assets/images/login/vhs@2x.png"
        alt="vhs"
        width={85}
        height={42}
      />{" "}
    </main>
  );
}
