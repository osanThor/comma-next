import { SortType } from "@/services/post.service";
import { useMemo, useState } from "react";
import FilterArrow from "./icons/FilterArrow";
import { twMerge } from "tailwind-merge";

type Props = {
  sort: SortType;
  sortOption: { name: string; value: SortType }[];
  onChange: (sort: SortType) => void;
};
export default function Filter({ sort = "desc", sortOption, onChange }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const currentSort = useMemo(() => {
    const matchedOption = sortOption.find((option) => option.value === sort);
    return matchedOption ? matchedOption.name : "인기순";
  }, [sort]);

  const otherSortOptions = useMemo(
    () => sortOption.filter((option) => option.value !== sort),
    [sort]
  );

  const handleToggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleChangeSort = (currentSort: SortType) => {
    onChange(currentSort);
  };

  return (
    <div className="w-[106px] h-9 relative z-10">
      <div
        onClick={handleToggleOpen}
        className="w-[106px] border border-white rounded-md text-white absolute top-0 left-0 bg-white/20 backdrop-blur-lg"
      >
        <div className="flex items-center h-9 pl-10 pr-3 relative cursor-pointer font-semibold">
          <FilterArrow
            className={twMerge(
              "absolute top-[5px] left-3 transition-all",
              open && "rotate-180"
            )}
          />
          {currentSort}
        </div>
        {otherSortOptions.map((opts) => (
          <div
            onClick={() => handleChangeSort(opts.value)}
            className={twMerge(
              "transition-all overflow-hidden",
              open ? "h-9" : "h-0"
            )}
            key={opts.value}
          >
            <div className="flex items-center h-9 pl-10 pr-3 relative cursor-pointer font-semibold opacity-70 hover:opacity-100">
              {opts.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
