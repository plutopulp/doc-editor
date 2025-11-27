"use client";

import React, { RefObject } from "react";
import type { TextBuffer } from "@/types/text-buffer";
import type { PageSlice } from "@/types/layout";

type PageProps = {
  slice: PageSlice;
  buffer: TextBuffer;
  totalPages: number;
};

const Page: React.FC<PageProps> = ({ slice, buffer, totalPages }) => {
  const text = buffer.getSlice(slice.start, slice.end);
  const pageNumber = slice.pageIndex + 1;

  return (
    <div className="bg-white shadow-md border border-gray-300 m-4 mx-auto">
      <div className="w-[794px] h-[1123px] p-10 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <pre className="whitespace-pre-wrap font-sans text-[16px] leading-[20px]">
            {text}
          </pre>
        </div>
        <div className="pt-4 text-center text-xs text-gray-500">
          Page {pageNumber} of {totalPages}
        </div>
      </div>
    </div>
  );
};

type PagePreviewProps = {
  pages: PageSlice[];
  buffer: RefObject<TextBuffer>;
};

export const PagePreview: React.FC<PagePreviewProps> = ({ pages, buffer }) => {
  const totalPages = pages.length || 1;

  return (
    <div className="flex flex-col items-center justify-center py-8 bg-slate-100">
      {pages.map((slice) => (
        <Page
          key={slice.pageIndex}
          slice={slice}
          buffer={buffer.current}
          totalPages={totalPages}
        />
      ))}
    </div>
  );
};
