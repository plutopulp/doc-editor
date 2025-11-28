from datetime import datetime, timezone

from pydantic import BaseModel, Field, field_serializer


class TimestampMixin(BaseModel):
    """
    Mixin for timestamp fields.
    """

    created_at: datetime = Field(..., description="Creation timestamp (UTC)")
    updated_at: datetime = Field(..., description="Last update timestamp (UTC)")

    @field_serializer("created_at", "updated_at")
    def _serialize_dt(self, value: datetime) -> str:
        """
        Serialize datetimes as ISO strings in UTC timezone.
        """
        return value.astimezone(timezone.utc).isoformat()


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
