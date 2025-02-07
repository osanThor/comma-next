import { USER_NAV_MENUS } from "@/constants/user";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function UserPage({ params }: Props) {
  const { slug } = await params;
  const userId = slug[0];
  const path = slug[1];
  if (!path) redirect(`/user/${userId}/post`);
  if (!USER_NAV_MENUS.map((menu) => menu.value).includes(path)) notFound();

  return (
    <section className="w-[calc(100%-40px)] max-w-[1640px] min-h-[calc(100vh-140px)] mt-[100px] flex flex-col contents-box py-[90px] mb-10 px-10 lg:px-20">
      <div className="flex w-full h-full flex-grow gap-[7vw]">
        <div className="min-w-[212px] border-white/70 border-r-2 flex flex-col relative">
          <div className="w-full flex flex-col gap-7 sticky top-[100px] left-0">
            {USER_NAV_MENUS.map((menu) => (
              <Link
                key={menu.value}
                href={`/user/${userId}/${menu.value}`}
                className={twMerge(
                  "block text-white hover:text-point-500 text-xl font-bold transition-all",
                  path === menu.value && "text-point-500"
                )}
              >
                {menu.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="w-full flex flex-col">
          {/* <router-view :user="user" :user-id="userId"></router-view> */}
        </div>
      </div>
      <Image
        src="/assets/images/singleGhost.png"
        alt="ghost"
        className="absolute bottom-[-27px] -left-8 w-[129px] h-[118px] z-10 overflow-visible"
        width={130}
        height={120}
      />
    </section>
  );
}
