"use client";
import Avatar from "@/components/common/Avatar";
import { useAuthStore } from "@/stores/authStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import NotificationContainer from "./NotificationContainer";
import SideMenuContainer from "./SideMenuContainer";
import LoginIcon from "@/components/common/icons/LoginIcon";

export default function HeaderContainer() {
  const user = useAuthStore((state) => state.user);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 1 }
    );

    if (observerTargetRef.current) {
      observer.observe(observerTargetRef.current);
    }

    return () => {
      if (observerTargetRef.current) {
        observer.unobserve(observerTargetRef.current);
      }
    };
  }, []);

  return (
    <>
      <div ref={observerTargetRef} className="h-0 w-full" />
      <header
        className={twMerge(
          "h-[84px] fixed top-0 left-0 right-0 flex items-center justify-center transition-all z-[99999]",
          isScrolled && "backdrop-blur-sm"
        )}
      >
        <div className="w-[calc(100%-40px)] max-w-[1660px] flex items-center justify-between">
          <h1 className="max-w-[120px]">
            <Link href="/">
              <Image
                src="/assets/images/logo.png"
                alt="logo"
                width={120}
                height={30}
              />
            </Link>
          </h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link tabIndex={-1} href={`/user/${user.id}/post`}>
                  <Avatar src={user.profile_image} size="sm" />
                </Link>
                <NotificationContainer />
                <SideMenuContainer />
              </>
            ) : (
              <Link
                href={"/login"}
                className="text-white/80 transition-all text-sm hover:text-white flex items-center gap-1 leading-3 font-semibold"
              >
                <LoginIcon />
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
