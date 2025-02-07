import NotFoundIcon from "@/components/common/icons/NotFoundIcon";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-size font-pretendard font-medium bg-main flex flex-col items-center justify-center">
      {/* <not-found-icon className="mb-8"></not-found-icon> */}
      <NotFoundIcon />
      <div className="font-dnf text-white text-[50px] mb-10">Oops!</div>
      <div className="text-center text-white text-xl mb-[53px] font-semibold">
        삐빅! 페이지가 우주여행 중이에요
        <br />
        나중에 다시 와주세요!
      </div>
      <Link
        href="/"
        className="w-[calc(100%-40px)] max-w-[365px] h-[58px] flex items-center justify-center transition-all bg-point-500 hover:bg-point-700 text-xl font-semibold text-white rounded-full"
      >
        <Image
          className="w-[114px] mr-1 object-cover"
          src="/assets/images/logo.png"
          alt="logo"
          width={114}
          height={137}
        />
        로 다시 돌아가기
      </Link>
    </main>
  );
}
