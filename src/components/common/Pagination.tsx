"use client";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import PaginArrow from "./icons/PaginArrow";

type Props = {
  page: number;
  total: number;
  pageSize?: number;
  limit?: number;
  onChnage: (page: number) => void;
};

export default function Pagination({
  page = 1,
  total,
  pageSize = 12,
  limit = 5,
  onChnage,
}: Props) {
  console.log(total, pageSize);
  const totalPages = Math.ceil(total / pageSize);
  const [currentPageArray, setCurrentPageArray] = useState<number[]>([]);

  const sliceArrayByLimit = (numPages: number, limit: number): number[][] => {
    const pages = Array.from({ length: numPages }, (_, i) => i + 1);
    const result = [];
    for (let i = 0; i < pages.length; i += limit) {
      result.push(pages.slice(i, i + limit));
    }
    return result;
  };

  useEffect(() => {
    const slicedPageArray = sliceArrayByLimit(totalPages, limit);
    const pageIndex = Math.floor((page - 1) / limit);
    setCurrentPageArray(slicedPageArray[pageIndex] || []);
  }, [totalPages, page, limit]);

  return (
    <>
      {total !== 0 && (
        <div className="flex items-center text-sm  text-white gap-4">
          <button
            onClick={() => onChnage(page - 1)}
            disabled={page === 1}
            className="disabled:opacity-50 text-poin-500"
          >
            <PaginArrow />
          </button>
          {currentPageArray.map((i) => (
            <button
              aria-label={`pagination-${i}`}
              type="button"
              key={i}
              className={twMerge(
                "min-w-[28px] h-[28px]",
                i === page ? "rounded-full bg-point-500 text-white" : ""
              )}
              onClick={() => onChnage(i)}
            >
              {i}
            </button>
          ))}
          <button
            onClick={() => onChnage(page + 1)}
            disabled={page === totalPages}
            className="disabled:opacity-50 text-poin-500"
          >
            <PaginArrow className="-scale-x-100" />
          </button>
        </div>
      )}
    </>
  );
}
