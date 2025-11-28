import json
import os
import typing as t
from pathlib import Path

from app.core.exceptions import DocumentNotFound, StorageError


class DocumentStorage:
    """
    Storage interface for documents.

    Planned on-disk layout (relative to the API project root):

      storage/
        documents/
          {id}.json      # full document record:
                         #   { id, title, content, created_at, updated_at }
        index.json       # map of document summaries:
                         #   { [id]: { id, title, created_at, updated_at } }

    The `save()` method will accept and return full document dicts, while
    `list()` will return a list of summary dicts compatible with
    `DocumentSummary` (id, title, created_at, updated_at).

    For now this class remains a stub; the file-based implementation will
    be added in subsequent steps.
    """

    def __init__(self, base_path: str | Path) -> None:
        self.base_path = Path(base_path)
        self.documents_dir = self.base_path / "documents"
        self.documents_dir.mkdir(parents=True, exist_ok=True)

    def _document_path(self, document_id: str) -> Path:
        return self.documents_dir / f"{document_id}.json"

    def save(self, document: dict[str, t.Any]) -> dict[str, t.Any]:
        """
        Persist a document.

        Validates the presence of an id and writes the full document
        record to `storage/documents/{id}.json` using an atomic
        write (temp file + replace).
        """
        document_id = document.get("id")
        if not document_id:
            raise StorageError("Document must have an 'id' field to be saved")

        path = self._document_path(document_id)
        tmp_path = path.with_suffix(".json.tmp")

        try:
            with tmp_path.open("w", encoding="utf-8") as f:
                json.dump(document, f, ensure_ascii=False)
            os.replace(tmp_path, path)
        except OSError as exc:
            raise StorageError(f"Failed to save document '{document_id}'") from exc

        return document

    def load(self, document_id: str) -> dict[str, t.Any]:
        """
        Load a document.

        Reads `storage/documents/{id}.json` and returns the parsed
        JSON dict. Raises `DocumentNotFound` if the file does not
        exist.
        """
        path = self._document_path(document_id)
        if not path.exists():
            raise DocumentNotFound(document_id)

        try:
            with path.open("r", encoding="utf-8") as f:
                return json.load(f)
        except OSError as exc:
            raise StorageError(f"Failed to load document '{document_id}'") from exc

    def list(self) -> list[dict[str, t.Any]]:
        """
        List stored documents.

        Stub implementation: always return empty list.
        """
        return []
