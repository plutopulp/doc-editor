"use client";

import React from "react";
import {
  useEditorDocument,
  useLayoutOptionsState,
  useDocumentSave,
} from "@/hooks/editor";
import { PagePreview } from "./page-preview";
import { LayoutToolbar } from "./layout-toolbar";
import { EditorHeader } from "./editor-header";
import { EditorTextarea } from "./editor-textarea";
import type { DocumentResponse } from "@/lib/api";

interface EditorProps {
  initialDocument?: DocumentResponse;
}

export const Editor: React.FC<EditorProps> = ({ initialDocument }) => {
  const { layoutOptions, updateLayoutOptions } = useLayoutOptionsState();

  const {
    text,
    pages,
    selection,
    buffer,
    handleTextChange,
    handleSelectionChange,
  } = useEditorDocument(initialDocument?.content ?? "", layoutOptions);

  const { title, setTitle, isDirty, isUpdating, saveMessage, handleSave } =
    useDocumentSave(
      initialDocument?.id,
      initialDocument?.title ?? "Untitled Document",
      initialDocument?.content ?? ""
    );

  return (
    <div className="min-h-screen flex flex-col">
      {initialDocument && (
        <EditorHeader
          title={title}
          onTitleChange={setTitle}
          onSave={() => handleSave(text)}
          isDirty={isDirty(text)}
          isSaving={isUpdating}
          saveMessage={saveMessage}
        />
      )}

      <LayoutToolbar
        layoutOptions={layoutOptions}
        onChange={updateLayoutOptions}
        selection={selection}
      />

      <main className="flex flex-1 overflow-hidden">
        <EditorTextarea
          value={text}
          onChange={handleTextChange}
          onSelect={handleSelectionChange}
          layoutOptions={layoutOptions}
        />

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
