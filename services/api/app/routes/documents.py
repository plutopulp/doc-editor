from fastapi import APIRouter, Depends, Path, status

from app.core import DocumentNotFound, StorageError, get_document_service
from app.core.http_exceptions import HttpInternalServerError, HttpNotFound, ResourceType
from app.schemas import DocumentCreate, DocumentResponse, DocumentSummary
from app.services.documents import DocumentService

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post(
    "",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new document",
    responses={
        201: {"description": "Document created successfully"},
        500: {"description": "Internal server error"},
    },
)
def create_document(
    payload: DocumentCreate,
    service: DocumentService = Depends(get_document_service),
) -> DocumentResponse:
    """
    Create and persist a new document.

    Parameters:
        payload: Document title and content to create.

    Returns:
        The newly created document, including id and timestamps.
    """
    try:
        return service.create_document(payload)
    except StorageError as exc:  # unhandled storage error
        raise HttpInternalServerError() from exc


@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a document by id",
    responses={
        200: {"description": "Document found"},
        404: {"description": "Document not found"},
        500: {"description": "Internal server error"},
    },
)
def get_document(
    document_id: str = Path(..., description="Identifier of the document to retrieve"),
    service: DocumentService = Depends(get_document_service),
) -> DocumentResponse:
    """
    Retrieve a single document by its identifier.

    Parameters:
        document_id: The id of the document to retrieve.

    Returns:
        The full document if it exists.
    """
    try:
        return service.get_document(document_id)
    except DocumentNotFound as exc:
        raise HttpNotFound(
            resource_type=ResourceType.DOCUMENT,
            resource_id=document_id,
        ) from exc
    except StorageError as exc:  # unhandled storage error
        raise HttpInternalServerError() from exc


@router.get(
    "",
    response_model=list[DocumentSummary],
    status_code=status.HTTP_200_OK,
    summary="List documents",
    responses={
        200: {"description": "List of documents"},
        500: {"description": "Internal server error"},
    },
)
def list_documents(
    service: DocumentService = Depends(get_document_service),
) -> list[DocumentSummary]:
    """
    List all documents as summaries.

    Returns:
        A list of document summaries (id, title, timestamps).
    """
    try:
        return service.list_documents()
    except StorageError as exc:  # unhandled storage error
        raise HttpInternalServerError() from exc
