import React, { RefObject } from "react";
import type { TextBuffer } from "@/types/text-buffer";
import type { LayoutOptions, PageSlice } from "@/types/layout";

type PageProps = {
  slice: PageSlice;
  buffer: TextBuffer;
  totalPages: number;
  layoutOptions: LayoutOptions;
};

const Page: React.FC<PageProps> = ({
  slice,
  buffer,
  totalPages,
  layoutOptions,
}) => {
  const text = buffer.getSlice(slice.start, slice.end);
  const pageNumber = slice.pageIndex + 1;

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-sm m-4 mx-auto">
      <div
        className="flex flex-col"
        style={{
          width: layoutOptions.pageWidth,
          height: layoutOptions.pageHeight,
          paddingTop: layoutOptions.marginTop,
          paddingBottom: layoutOptions.marginBottom,
          paddingLeft: layoutOptions.marginLeft,
          paddingRight: layoutOptions.marginRight,
        }}
      >
        <div className="flex-1 overflow-hidden">
          <pre
            className="whitespace-pre-wrap font-sans wrap-break-word"
            style={{
              fontSize: `${layoutOptions.fontSize}px`,
              lineHeight: `${layoutOptions.lineHeight}px`,
            }}
          >
            {text}
          </pre>
        </div>
      </div>
      <div className="pt-2 pb-2 text-center text-xs text-gray-500 shrink-0">
        Page {pageNumber} of {totalPages}
      </div>
    </div>
  );
};

type PagePreviewProps = {
  pages: PageSlice[];
  buffer: RefObject<TextBuffer>;
  layoutOptions: LayoutOptions;
};

export const PagePreview: React.FC<PagePreviewProps> = ({
  pages,
  buffer,
  layoutOptions,
}) => {
  const totalPages = pages.length || 1;

  return (
    <div className="flex flex-col items-center justify-start py-8 bg-slate-100 overflow-y-auto">
      {pages.map((slice) => (
        <Page
          key={slice.pageIndex}
          slice={slice}
          buffer={buffer.current}
          totalPages={totalPages}
          layoutOptions={layoutOptions}
        />
      ))}
    </div>
  );
};
