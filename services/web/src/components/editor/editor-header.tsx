import React from "react";

interface EditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  isDirty: boolean;
  isSaving: boolean;
  saveMessage: string | null;
}

/**
 * Document editor header with title input and save controls
 */
export const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  onTitleChange,
  onSave,
  isDirty,
  isSaving,
  saveMessage,
}) => {
  return (
    <div className="border-b border-slate-200 bg-white px-4 py-3 flex items-center justify-between gap-4">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="flex-1 text-lg font-semibold text-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
        placeholder="Document title"
      />
      <div className="flex items-center gap-3">
        {saveMessage && (
          <span
            className={`text-sm ${
              saveMessage.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {saveMessage}
          </span>
        )}
        {isDirty && (
          <span className="text-xs text-slate-500">Unsaved changes</span>
        )}
        <button
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};
