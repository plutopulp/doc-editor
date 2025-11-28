from functools import lru_cache
from pathlib import Path

from app.services.documents import DocumentService
from app.storage import DocumentStorage


@lru_cache
def get_document_service() -> DocumentService:
    """
    FastAPI dependency that provides a shared DocumentService instance.

    Storage is currently file-based under the ./storage directory.
    """
    base_path = Path("storage")
    storage = DocumentStorage(base_path=base_path)
    return DocumentService(storage=storage)
