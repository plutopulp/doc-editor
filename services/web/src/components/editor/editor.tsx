"use client";

import React, { useCallback } from "react";
import { useEditorDocument } from "@/hooks/editor";
import { PagePreview } from "./page-preview";

export const Editor: React.FC = () => {
  const {
    text,
    pages,
    selection,
    buffer,
    handleTextChange,
    handleSelectionChange,
  } = useEditorDocument("");

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextText = e.target.value;
      handleTextChange(nextText);
    },
    [handleTextChange]
  );

  const onSelect = useCallback(
    (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart ?? 0;
      const end = target.selectionEnd ?? start;
      handleSelectionChange(start, end);
    },
    [handleSelectionChange]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top toolbar-ish area */}
      <header className="border-b border-slate-200 bg-white px-4 py-2 flex items-center justify-between">
        <div className="font-semibold text-slate-800">
          Materi Document Editor
        </div>
        <div className="text-xs text-slate-500">
          Selection: {selection.start} – {selection.end}
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Left: raw text input */}
        <section className="w-1/3 border-r border-slate-200 flex flex-col">
          <div className="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Source Text
          </div>
          <textarea
            className="flex-1 w-full resize-none p-3 font-sans text-[16px] leading-[20px] border-none outline-none bg-slate-50 focus:bg-white"
            value={text}
            onChange={onChange}
            onSelect={onSelect}
            spellCheck={false}
          />
        </section>

        {/* Right: paginated preview */}
        <section className="flex-1 overflow-auto bg-slate-100">
          <PagePreview pages={pages} buffer={buffer} />
        </section>
      </main>
    </div>
  );
};
