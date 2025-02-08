import Image from "next/image";

export default function PostCommentFormContainer() {
  return (
    <form className="relative mx-auto w-full h-full mt-8">
      <button
        type="submit"
        className="absolute bottom-4 right-2 cursor-pointer "
      >
        <Image
          className="opacity-70 hover:opacity-100 transition-opacity duration-300"
          alt="send icon"
          src="/assets/images/icons/post-send-icon.svg"
          width={34}
          height={34}
        />
      </button>
      <textarea
        name="PostComment"
        className="w-full h-full min-h-28 bg-white/20 border-2 focus:placeholder:opacity-0 font-medium rounded-xl p-5 placeholder:text-white/50 text-white resize-none overflow-auto focus:outline-4 focus:outline-point-500/30"
        placeholder="댓글을 입력해주세요 φ(゜▽゜*)♪"
        id=""
      ></textarea>
    </form>
  );
}
