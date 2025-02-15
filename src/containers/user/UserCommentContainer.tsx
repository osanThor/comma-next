import Filter, { SortOptionsType } from "@/components/common/Filter";
import Pagination from "@/components/common/Pagination";
import UserCommentItem from "@/components/user/UserCommentItem";
import useUserComments from "@/hooks/userComments";

type Props = {
  userId: string;
};
const SORT_OPTIONS = [
  { name: "인기순", value: "likes" },
  { name: "최신순", value: "desc" },
] as SortOptionsType[];

export default function UserCommentContainer({ userId }: Props) {
  const { comments, isLoading, page, changePage, sort, changeSort, mutate } =
    useUserComments(userId);

  return (
    <>
      <div className="flex max-w-[1000px] items-end justify-between mb-[30px]">
        <div className="text-white text-xl md:text-2xl font-semibold pt-1 leading-4">
          댓글
          <span className="ml-1">{comments ? comments?.totalCount : 0}</span>개
        </div>
        <Filter sort={sort} sortOption={SORT_OPTIONS} onChange={changeSort} />
      </div>
      {isLoading ? (
        <div className="flex flex-col gap-5 pr-[70px] mb-[70px] mt-[30px]">
          {Array(10)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="w-full h-[70px] max-w-[1000px] relative skeleton"
              />
            ))}
        </div>
      ) : comments?.data.length === 0 ? (
        <div className="w-full flex items-center justify-center py-[200px] text-white/50 text-2xl font-bold mt-[30px]">
          작성한 댓글이 존재하지 않습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-5 mb-[70px] mt-[30px]">
          {comments?.data.map((item) => (
            <UserCommentItem key={item.id} item={item} mutate={mutate} />
          ))}
        </div>
      )}
      <div className="w-full max-w-[1000px] flex justify-center">
        <Pagination
          page={page}
          total={comments?.totalCount || 0}
          onChnage={changePage}
          pageSize={10}
        />
      </div>
    </>
  );
}
