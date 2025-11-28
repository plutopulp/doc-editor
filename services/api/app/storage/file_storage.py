import typing as t
from pathlib import Path

from app.core.exceptions import DocumentNotFound, StorageError


class DocumentStorage:
    """
    Storage interface for documents.

    For now this is a stub; will plug in a real file-based
    implementation later once the service and routes are wired.
    """

    def __init__(self, base_path: str | Path) -> None:
        self.base_path = Path(base_path)

    def save(self, document: dict[str, t.Any]) -> dict[str, t.Any]:
        """
        Persist a document.

        Stub implementation: validate minimal shape and return.
        """
        document_id = document.get("id")
        if not document_id:
            raise StorageError("Document must have an 'id' field to be saved")

        return document

    def load(self, document_id: str) -> dict[str, t.Any]:
        """
        Load a document.

        Stub implementation: always raise not found.
        """
        raise DocumentNotFound(document_id)

    def list(self) -> list[dict[str, t.Any]]:
        """
        List stored documents.

        Stub implementation: always return empty list.
        """
        return []
