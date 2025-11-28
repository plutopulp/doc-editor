from datetime import datetime

from pydantic import BaseModel, Field


class TimestampMixin(BaseModel):
    """
    Mixin for timestamp fields.
    """

    created_at: datetime = Field(..., description="Creation timestamp (UTC)")
    updated_at: datetime = Field(..., description="Last update timestamp (UTC)")


class DocumentBase(BaseModel):
    """
    Shared fields for document payloads.
    """

    title: str = Field(..., description="Human-readable document title")
    content: str = Field(..., description="Full document content text")


class DocumentCreate(DocumentBase):
    """
    Payload for creating a new document.
    """

    pass


class DocumentResponse(DocumentBase, TimestampMixin):
    """
    Full document representation returned by the API.
    """

    id: str = Field(..., description="Document identifier")


class DocumentSummary(TimestampMixin):
    """
    Lightweight view used for listings.
    """

    id: str = Field(..., description="Document identifier")
    title: str = Field(..., description="Human-readable document title")
