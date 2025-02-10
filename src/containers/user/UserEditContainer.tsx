"use client";
import { uploadImage } from "@/services/upload.service";
import { updateUserProfile } from "@/services/user.service";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

const DEFAULT_PROFILE = "/assets/images/defaultProfile.png";

export default function UserEditContainer() {
  const router = useRouter();
  const updateUser = useAuthStore((state) => state.updateUser);
  const user = useAuthStore((state) => state.user);

  const addToast = useToastStore((state) => state.addToast);

  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [profilePictureSrc, setProfilePictureSrc] = useState<string>("");
  const [bio, setBio] = useState<string>(user?.bio || "");
  const [charCount, setCharCount] = useState<number>(bio.length || 0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    if (user) router.push(`/user/${user.id}/post`);
  };
  const updateCharCount = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
  };

  const handleClickFile = async () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    if (file) {
      setProfilePictureFile(file);
      setProfilePictureSrc(URL.createObjectURL(file)); // 미리보기용 URL
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) return addToast("다시 로그인해주세요.", "error");
      if (!name) return addToast("닉네임을 입력해주세요.", "error");
      if (name.length > 10)
        return addToast("닉네임은 최대 10자까지에요.", "error");
      if (bio.length > 150)
        return addToast("자기소개는 최대 150자까지에요.", "error");

      const body = {
        name: name.trim(),
        bio: bio.trim() || null,
      } as {
        name: string;
        bio: string | null;
        profile_image?: string | undefined;
      };

      if (profilePictureFile) {
        const url = await uploadImage(profilePictureFile);
        body.profile_image = url;
      }

      const data = await updateUserProfile(user.id, body);
      if (data) {
        addToast("성공적으로 저장 됐어요.");
        updateUser({ ...user, ...body });
        router.push(`/user/${user.id}/post`);
      }
    } catch (err) {
      console.error(err);
      addToast("정보 수정에 실패했어요.", "error");
    }
  };

  useEffect(() => {
    if (user) {
      console.log(user.email);
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio || "");
      setCharCount(user.bio?.length || 0);
    }
  }, [user]);

  return (
    <section className="w-[calc(100%-40px)] max-w-[1440px] py-[60px] mt-[120px] mb-20 flex contents-box">
      <div className="flex flex-col md:flex-row w-[100%] gap-5 md:gap-[122px] px-5">
        <div
          className="md:w-[40%] md:max-w-[540px] border-b md:border-b-0 md:border-r-2 border-white/50 flex items-center justify-center"
          style={{ paddingTop: 66, paddingBottom: 66 }}
        >
          <div className="relative">
            <div className="w-[216px] h-[216px]  bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
              <Image
                className="object-cover rounded-full"
                src={
                  profilePictureSrc || user?.profile_image || DEFAULT_PROFILE
                }
                alt="profile image"
                fill
              />
            </div>
            <div
              className="absolute cursor-pointer bottom-[5px] right-[15px] bg-point-500 rounded-full w-[45px] h-[45px] flex items-center justify-center text-white text-xs overflow-hidden transform transition-transform duration-100 ease-in-out hover:scale-125"
              onClick={handleClickFile}
            >
              <Image
                className="w-[22px]"
                src="/assets/images/icons/pictureEdit-icon.svg"
                alt="수정"
                width={22}
                height={22}
              />
            </div>

            <input
              ref={fileInputRef}
              id="profile-picture-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <form
          className="flex-1 pt-5 flex flex-col w-full max-w-[624px]"
          onSubmit={handleUpdateUser}
        >
          <h2 className="text-white font-dnf text-3xl md:text-5xl">PROFILE</h2>
          <label
            htmlFor="name"
            className="text-white text-xl block font-bold mt-12"
          >
            닉네임
          </label>
          <input
            id="name"
            type="text"
            className="w-full max-w-[624px] h-[56px] rounded-[12px] px-7 mt-2.5 text-lg font-medium text-[#2E2E2E]"
            placeholder="닉네임을 입력해주세요."
            name="name"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
          />

          <label
            htmlFor="email"
            className="text-white text-xl block font-bold mt-[29px]"
          >
            이메일
          </label>
          <input
            id="email"
            type="text"
            className="w-full max-w-[624px] h-[56px] rounded-[12px] px-7 mt-2.5 text-lg font-medium text-white/20"
            name="email"
            disabled
            value={email}
          />
          <label
            htmlFor="bio"
            className="text-white text-xl block font-bold mt-[29px]"
          >
            자기소개
          </label>
          <div className="flex flex-col">
            <textarea
              id="bio"
              className="w-full max-w-[624px] h-32 rounded-[12px] py-5 px-6 resize-none mt-2.5 text-lg font-medium text-[#2E2E2E]"
              placeholder="아직 자기소개를 작성하지 않으셨습니다. 자기소개를 작성해주세요."
              name="bio"
              maxLength={150}
              onInput={updateCharCount}
              value={bio || ""}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
            <h2
              className={twMerge(
                "float-left text-sm text-white py-2 pl-2",
                charCount >= 150
                  ? "text-point-500 font-medium"
                  : "text-white/50"
              )}
            >
              현재 글자 수: {charCount} / 150
            </h2>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="w-[66px] h-[32px] bg-main-500 rounded-lg text-white mr-2 hover:bg-white hover:text-main-500"
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              type="submit"
              className="min-w-[66px] h-[32px] bg-point-500 rounded-lg text-white hover:bg-white hover:text-point-500"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
