import json
import os
import typing as t
from pathlib import Path

from app.core.exceptions import DocumentNotFound, StorageError
from app.schemas import DocumentSummary


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

    @property
    def index_path(self) -> Path:
        return self.base_path / "index.json"

    def _document_path(self, document_id: str) -> Path:
        return self.documents_dir / f"{document_id}.json"

    def save(self, document: dict[str, t.Any]) -> dict[str, t.Any]:
        """
        Persist a document.

        Validates the presence of an id, writes the full document
        record to `storage/documents/{id}.json` using an atomic
        write (temp file + replace), and then updates `index.json`
        with a summary entry for this document.
        """
        document_id = document.get("id")
        if not document_id:
            raise StorageError("Document must have an 'id' field to be saved")

        self._write_document_file(document_id, document)
        self._update_index(document_id, document)

        return document

    def _write_document_file(
        self,
        document_id: str,
        document: dict[str, t.Any],
    ) -> None:
        """
        Write the full document JSON to `documents/{id}.json` atomically.
        """
        path = self._document_path(document_id)
        tmp_path = path.with_suffix(".json.tmp")

        try:
            with tmp_path.open("w", encoding="utf-8") as f:
                json.dump(document, f, ensure_ascii=False)
            os.replace(tmp_path, path)
        except OSError as exc:
            raise StorageError(f"Failed to save document '{document_id}'") from exc

    def _update_index(
        self,
        document_id: str,
        document: dict[str, t.Any],
    ) -> None:
        """
        Upsert a lightweight summary for the document into `index.json`.

        The summary contains the fields required by `DocumentSummary`:
        id, title, created_at, updated_at.
        """
        # Let Pydantic enforce and shape the summary fields
        summary_model = DocumentSummary.model_validate(document)
        summary = summary_model.model_dump(mode="json")

        index = self._read_index()
        index[document_id] = summary
        self._write_index(index)

    def _read_index(self) -> dict[str, t.Any]:
        """
        Read the index file and return its mapping, or {} if it does not exist.
        """
        if not self.index_path.exists():
            return {}

        try:
            with self.index_path.open("r", encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError as exc:
            raise StorageError("Index file is corrupted") from exc
        except OSError as exc:
            raise StorageError("Failed to read index file") from exc

    def _write_index(self, index: dict[str, t.Any]) -> None:
        """
        Write the complete index mapping back to `index.json` atomically.
        """
        tmp_index = self.index_path.with_suffix(".json.tmp")
        try:
            with tmp_index.open("w", encoding="utf-8") as f:
                json.dump(index, f, ensure_ascii=False)
            os.replace(tmp_index, self.index_path)
        except OSError as exc:
            raise StorageError("Failed to write index file") from exc

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

        Returns a list of document summaries derived from `index.json`,
        sorted by `updated_at` in descending order (most recent first).
        """
        index = self._read_index()

        summaries: list[dict[str, t.Any]] = list(index.values())

        # Sort by updated_at descending; missing values should not occur but
        # fall back to the empty string in case, which will sort last.
        summaries.sort(
            key=lambda item: item.get("updated_at") or "",
            reverse=True,
        )

        return summaries
