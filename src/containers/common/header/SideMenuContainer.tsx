import LogoutIcon from "@/components/common/icons/LogoutIcon";
import { logout } from "@/services/user.service";
import { useGameStore } from "@/stores/gameStore";
import { useModalStore } from "@/stores/modalStore";
import { useToastStore } from "@/stores/toastStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function SideMenuContainer() {
  const router = useRouter();

  const addToast = useToastStore((state) => state.addToast);
  const games = useGameStore((state) => state.games);
  const getGamesData = useGameStore((state) => state.getGamesData);
  const openModal = useModalStore((state) => state.openModal);

  const [open, setOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleGetGameData = async () => {
    await getGamesData();
  };

  const handleClickButton = () => {
    if (menuRef.current) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  function handleClickItem(gameName: string) {
    router.push(`/game/${gameName}`);
    setOpen(false);
  }

  const handleLogout = async () => {
    await logout();
    addToast("다시 돌아오실거죠...?", "error");
    router.push("/login");
  };

  const handleClickLogout = () => {
    openModal(
      "“아쉬워요...” \n 그래도 로그아웃 하시겠어요?",
      "로그아웃",
      handleLogout
    );
  };
  useEffect(() => {
    handleGetGameData();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current
      ) {
        if (buttonRef.current.contains(e.target as Node)) return;
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick, { capture: true });
    return () =>
      window.removeEventListener("mousedown", handleClick, { capture: true });
  }, [menuRef, buttonRef]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        tabIndex={-1}
        onClick={handleClickButton}
        className="flex items-center justify-center"
        aria-label="sidebar button"
        type="button"
      >
        <Image
          className={twMerge("transition-all w-7", open && "rotate-90")}
          src="/assets/images/icons/sidebar-icon.svg"
          alt="사이드바"
          width={28}
          height={28}
        />
      </button>
      {open && (
        <div
          id="menu-dropdown"
          ref={menuRef}
          className="absolute bg-white w-[180px] top-full translate-y-6 right-0 min-w-[180px] rounded-2xl flex flex-col items-center gap-[40px] px-6 py-4 font-semibold shadow-md"
        >
          <nav className="w-full flex flex-col">
            {games.map((game) => (
              <button
                key={game.id}
                className="w-full border-main-200/20 border-b-2 last:border-0 pt-3 pb-[10px] flex justify-center text-main-500 hover:text-point-500"
                onClick={() => handleClickItem(game.name)}
              >
                {game.display_name}
              </button>
            ))}
          </nav>
          <button
            className="text-main-300 hover:text-main-500 flex items-center text-sm gap-[2px]"
            aria-label="logout button"
            type="button"
            onClick={handleClickLogout}
          >
            <LogoutIcon />
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
