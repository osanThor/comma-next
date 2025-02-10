import { twMerge } from "tailwind-merge";

type Props = {
  title: string;
  content: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export default function PostEditorContentsContainer({
  title,
  content,
  onChange,
}: Props) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      <div className="w-full flex-grow">
        <input
          className="bg-transparent w-full font-dnf text-4xl focus:placeholder:opacity-0 text-white placeholder:text-white/70 focus:outline-none truncate-title"
          type="text"
          name="title"
          maxLength={15}
          placeholder="제목을 입력해주세요..."
          value={title || ""}
          onChange={onChange}
        />
        <hr className="border-2 border-white/30 w-full my-5" />
        <textarea
          className="w-full min-h-[360px] h-full p-7 rounded-xl focus:outline-none focus:placeholder:opacity-0 resize-none overflow-y-auto placeholder:font-medium font-medium text-white bg-white/10 placeholder:text-white/50"
          name="content"
          placeholder="내용을 입력해주세요..."
          value={content || ""}
          onChange={onChange}
        ></textarea>
      </div>
      <div className="flex justify-start items-center mt-2 text-sm">
        <span
          className={twMerge(
            "text-sm font-medium",
            content.length < 540 ? "text-white/80" : "text-point-500"
          )}
        >
          현재 글자 수 : {content.length} / 540
        </span>
      </div>
    </div>
  );
}
