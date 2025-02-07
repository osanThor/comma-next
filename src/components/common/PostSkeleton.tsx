export default function PostSkeleton({ length }: { length: number }) {
  return (
    <>
      {Array(length)
        .fill(0)
        .map((_, idx) => (
          <div
            key={idx}
            className="text-white rounded-lg overflow-hidden flex flex-col"
          >
            <div className="w-full h-[130px] relative flex items-center justify-center overflow-hidden">
              <span className="absolute top-0 left-0 bottom-0 right-0 bg-main-200 animate-pulse"></span>
            </div>
            <div className="p-4 bg-main-500 flex-grow flex flex-col">
              <div className="flex gap-2 items-end mb-3 justify-between">
                <div className="w-20 h-5 skeleton" />
                <div className="w-14 h-4 skeleton" />
              </div>
              <div className="mb-3 flex flex-col gap-1 flex-grow">
                <div className="w-full h-3 skeleton" />
                <div className="w-full h-3 skeleton" />
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="text-xs flex items-center gap-1">
                  <div className="animate-pulse w-[18px] h-[18px] rounded-full opacity-70 bg-main-200" />
                  <div className="w-16 h-3 skeleton" />
                </div>
                <div className="text-[10px] leading-3 flex items-center gap-1 text-point-500">
                  <div className="w-16 h-3 skeleton" />
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
