"use client";
import {
  getNotifications,
  realtimeNewNotifications,
  readNotification,
  readAllNotifications,
} from "@/services/notification.service";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { NotificationType } from "@/types/notification";
import Avatar from "@/components/common/Avatar";
import formatedDate from "@/utils/formatedDate";
import Image from "next/image";

export default function NotificationContainer() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  const [items, setItems] = useState<NotificationType[]>([]);
  const [newAlarm, setNewAlarm] = useState<boolean>(false);
  const [isAll, setIsAll] = useState<boolean>(true);

  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleGetNotifications = async (userId: string) => {
    try {
      const data = await getNotifications(userId);
      if (data) setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const computedItems = useMemo(() => {
    return isAll ? items : items.filter((item) => !item.is_read);
  }, [isAll, items]);

  const handleClickButton = () => {
    if (menuRef.current) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const handleClickAllRead = async () => {
    if (!user) return alert("다시 로그인 해주세요");
    if (!items.some((item) => !item.is_read)) return;
    try {
      await readAllNotifications(user.id);
      await handleGetNotifications(user.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickItem = async (handler: string, targetId: number) => {
    router.push(handler);
    setOpen(false);
    await readNotification(targetId);
  };

  useEffect(() => {
    if (!user || !user.id) return;
    realtimeNewNotifications(user.id, (noti) => {
      if (!noti.is_read) setNewAlarm(true);
    });
  }, [user]);

  useEffect(() => {
    setNewAlarm(false);
    if (user && open) {
      handleGetNotifications(user.id);
    }
  }, [open, user]);

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
    <div className="relative flex items-center justify-center">
      <button
        className="relative"
        ref={buttonRef}
        onClick={handleClickButton}
        aria-label="alarm button"
        type="button"
      >
        {newAlarm && (
          <span className="absolute top-0 right-0 flex h-3 w-3 items-center justify-center -z-10">
            <span className="animate-ping absolute inline-flex h-[20px] w-[20px] translate-x-1 rounded-full bg-point-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-point-500"></span>
          </span>
        )}
        <Image
          className="w-[24px] relative -z-[11]"
          src="/assets/images/icons/alarm-icon.svg"
          alt="알림"
          width={24}
          height={28}
        />
      </button>
      {open && (
        <div
          ref={menuRef}
          id="alarm-dropdown"
          className="absolute bg-white w-[calc(100vw-40px)] max-w-[440px] top-full translate-y-6 right-0 min-w-[180px] rounded-2xl flex flex-col items-center px-10 py-8 shadow-md"
        >
          <div className="w-full flex justify-between items-center mb-5">
            <div className="flex items-center gap-4 text-main-500 font-bold">
              <button
                onClick={() => setIsAll(true)}
                className={twMerge(!isAll && "opacity-30")}
              >
                전체
              </button>
              <button
                onClick={() => setIsAll(false)}
                className={twMerge(isAll && "opacity-30")}
              >
                읽지 않음
              </button>
            </div>
            <button
              onClick={handleClickAllRead}
              className="w-20 h-9 rounded-[10px] bg-main-200 opacity-40 hover:opacity-100 text-white text-sm"
            >
              모두 읽음
            </button>
          </div>
          <div className="w-full max-h-[50vh] overflow-y-auto py-5">
            <ul className="w-full flex flex-col gap-9">
              {computedItems.length === 0 ? (
                <li className="text-center text-main-200">알림이 없습니다.</li>
              ) : (
                computedItems.map((item) => {
                  return (
                    <li
                      className={twMerge(
                        "w-full flex items-center gap-[10px] cursor-pointer",
                        item.is_read && "opacity-60"
                      )}
                      key={item.id}
                      onClick={() =>
                        handleClickItem(`/user/${item.sender.id}/post`, item.id)
                      }
                    >
                      <Avatar src={item.sender.profile_image} />
                      <div className="flex flex-col text-main-500/70">
                        <div className="font-medium text-sm">
                          <span className="font-bold">{item.sender.name}</span>{" "}
                          님이
                          {item.message} <span className="ml-1"></span>
                        </div>
                        <span className="text-xs opacity-70">
                          {formatedDate(item.created_at)}
                        </span>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
