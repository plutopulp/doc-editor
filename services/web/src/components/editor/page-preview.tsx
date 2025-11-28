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
    <div className="flex flex-col items-center">
      <div
        className="bg-white shadow-xl border border-gray-200 rounded-md box-border"
        style={{
          width: layoutOptions.pageWidth,
          height: layoutOptions.pageHeight,
          paddingTop: layoutOptions.marginTop,
          paddingBottom: layoutOptions.marginBottom,
          paddingLeft: layoutOptions.marginLeft,
          paddingRight: layoutOptions.marginRight,
        }}
      >
        <pre
          className="whitespace-pre-wrap font-sans wrap-break-word"
          style={{
            fontSize: `${layoutOptions.fontSize}px`,
            lineHeight: `${layoutOptions.lineHeight}px`,
          }}
          suppressHydrationWarning
        >
          {text}
        </pre>
      </div>

      {/* Footer */}
      <div className="pt-3 text-center text-xs text-gray-500">
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
    <div className="flex-1 overflow-y-auto bg-slate-100 py-10">
      <div className="flex flex-col items-center gap-10">
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
    </div>
  );
};
