"use client";

import React, { RefObject } from "react";
import type { TextBuffer } from "@/types/text-buffer";
import type { PageSlice } from "@/types/layout";
import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_MARGIN_TOP,
  PAGE_MARGIN_RIGHT,
  PAGE_MARGIN_LEFT,
  PAGE_MARGIN_BOTTOM,
} from "@/lib/layout/constants";

type PageProps = {
  slice: PageSlice;
  buffer: TextBuffer;
  totalPages: number;
};

const Page: React.FC<PageProps> = ({ slice, buffer, totalPages }) => {
  const text = buffer.getSlice(slice.start, slice.end);
  const pageNumber = slice.pageIndex + 1;

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-sm m-4 mx-auto">
      <div
        className="flex flex-col"
        style={{
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          paddingTop: PAGE_MARGIN_TOP,
          paddingBottom: PAGE_MARGIN_BOTTOM,
          paddingLeft: PAGE_MARGIN_LEFT,
          paddingRight: PAGE_MARGIN_RIGHT,
        }}
      >
        <div className="flex-1 overflow-hidden">
          <pre className="whitespace-pre-wrap font-sans text-[16px] leading-[20px]">
            {text}
          </pre>
        </div>
        <div className="pt-4 text-center text-xs text-gray-500 shrink-0">
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
    <div className="flex flex-col items-center justify-start py-8 bg-slate-100 overflow-y-auto">
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
