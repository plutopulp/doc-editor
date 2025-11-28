import React from "react";
import type { LayoutOptions } from "@/types/layout";

interface EditorTextareaProps {
  value: string;
  onChange: (text: string) => void;
  onSelect: (start: number, end: number) => void;
  layoutOptions: LayoutOptions;
}

/**
 * Text input area for the document editor
 */
export const EditorTextarea: React.FC<EditorTextareaProps> = ({
  value,
  onChange,
  onSelect,
  layoutOptions,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart ?? 0;
    const end = target.selectionEnd ?? start;
    onSelect(start, end);
  };

  return (
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
        value={value}
        onChange={handleChange}
        onSelect={handleSelect}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
        data-gramm="false"
        data-enable-grammarly="false"
      />
    </section>
  );
};
