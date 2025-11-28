import typing as t
from datetime import datetime, timezone
from uuid import uuid4

from app.core.exceptions import DocumentNotFound
from app.schemas import (
    DocumentCreate,
    DocumentResponse,
    DocumentSummary,
    DocumentUpdate,
)
from app.storage.file_storage import DocumentStorage


class DocumentService:
    """
    Application service for document operations.
    This layer handles interaction with the document storage.
    """

    def __init__(self, storage: DocumentStorage) -> None:
        self._storage = storage

    def create_document(self, data: DocumentCreate) -> DocumentResponse:
        """
        Create a new document and persist it via storage.
        """
        now = datetime.now(timezone.utc)
        document_id = self._generate_id()

        payload: dict[str, t.Any] = {
            "id": document_id,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
            **data.model_dump(),
        }

        stored = self._storage.save(payload)

        return DocumentResponse.model_validate(stored)

    def get_document(self, document_id: str) -> DocumentResponse:
        """
        Fetch a single document by id.
        """
        stored = self._storage.load(document_id)
        return DocumentResponse.model_validate(stored)

    def list_documents(self) -> list[DocumentSummary]:
        """
        List all documents as lightweight summaries.
        """
        items = self._storage.list()
        return [DocumentSummary.model_validate(item) for item in items]

    def update_document(
        self, document_id: str, data: DocumentUpdate
    ) -> DocumentResponse:
        """
        Update an existing document with new title and/or content.
        Only provided fields are updated.
        """
        # Load existing document
        stored = self._storage.load(document_id)

        # Update only provided fields
        if data.title is not None:
            stored["title"] = data.title
        if data.content is not None:
            stored["content"] = data.content

        # Update timestamp
        stored["updated_at"] = datetime.now(timezone.utc).isoformat()

        # Save back to storage
        updated = self._storage.save(stored)

        return DocumentResponse.model_validate(updated)

    def _generate_id(self) -> str:
        """
        Generate a new document identifier.
        """
        return f"document_{uuid4().hex[:24]}"
