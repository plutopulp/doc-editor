"use client";

import React, { useCallback } from "react";
import { useEditorDocument } from "@/hooks/editor";
import { PagePreview } from "./page-preview";
import { useLayoutOptionsState } from "@/hooks/editor";
import { LayoutToolbar } from "./layout-toolbar";
import type { DocumentResponse } from "@/lib/api";

interface EditorProps {
  initialDocument?: DocumentResponse;
}

export const Editor: React.FC<EditorProps> = ({ initialDocument }) => {
  const { layoutOptions, updateLayoutOptions } = useLayoutOptionsState();

  // TODO: Use initialDocument.content and initialDocument.title in Step 7
  const initialContent = initialDocument?.content ?? "";

  const {
    text,
    pages,
    selection,
    buffer,
    handleTextChange,
    handleSelectionChange,
  } = useEditorDocument(initialContent, layoutOptions);

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
      {/* Formatting toolbar */}
      <LayoutToolbar
        layoutOptions={layoutOptions}
        onChange={updateLayoutOptions}
        selection={selection}
      />

      <main className="flex flex-1 overflow-hidden">
        {/* Left: raw text input */}
        <section className="w-1/3 border-r border-slate-200 flex flex-col">
          <div className="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Source Text
          </div>

          <textarea
            className="flex-1 w-full resize-none p-3 font-sans border-none outline-none bg-slate-50 focus:bg-white"
            style={{
              fontSize: `${layoutOptions.fontSize}px`,
              lineHeight: `${layoutOptions.lineHeight}px`,
            }}
            value={text}
            onChange={onChange}
            onSelect={onSelect}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
            data-gramm="false"
            data-enable-grammarly="false"
          />
        </section>

        {/* Right: paginated preview */}
        <section className="flex-1 overflow-auto bg-slate-100">
          <PagePreview
            pages={pages}
            buffer={buffer}
            layoutOptions={layoutOptions}
          />
        </section>
      </main>
    </div>
  );
};
