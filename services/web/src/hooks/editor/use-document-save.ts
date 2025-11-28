import { useState } from "react";
import { useUpdateDocument } from "@/hooks/api";

/**
 * Hook for managing document save state and operations
 */
export function useDocumentSave(
  documentId: string | undefined,
  initialTitle: string,
  initialContent: string
) {
  const { updateDocument, isUpdating } = useUpdateDocument();

  const [title, setTitle] = useState(initialTitle);
  const [lastSavedTitle, setLastSavedTitle] = useState(initialTitle);
  const [lastSavedContent, setLastSavedContent] = useState(initialContent);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Track if there are unsaved changes
  const isDirty = (currentContent: string) =>
    title !== lastSavedTitle || currentContent !== lastSavedContent;

  // Save handler
  const handleSave = async (currentContent: string) => {
    if (!documentId) return;
    if (title === lastSavedTitle && currentContent === lastSavedContent) return;

    setSaveMessage(null);
    const result = await updateDocument(documentId, {
      title,
      content: currentContent,
    });

    if (result) {
      setLastSavedTitle(title);
      setLastSavedContent(currentContent);
      setSaveMessage("Saved successfully");
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setSaveMessage("Failed to save");
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  return {
    title,
    setTitle,
    isDirty,
    isUpdating,
    saveMessage,
    handleSave,
  };
}
