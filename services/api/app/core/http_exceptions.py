import typing as t
from enum import StrEnum

from fastapi import HTTPException, status


class BaseHttpError(HTTPException):
    """
    Base HTTP exception for the API.

    `detail` is always a dict with at least a 'message' field.
    """

    def __init__(self, status_code: int, message: str, **extra: t.Any) -> None:
        detail = {"message": message, **extra}
        super().__init__(status_code=status_code, detail=detail)


class ResourceType(StrEnum):
    """
    Enum for the type of resource that was not found.
    """

    DOCUMENT = "document"


class HttpNotFound(BaseHttpError):
    """
    404 Not Found error for a specific resource.
    """

    def __init__(
        self,
        resource_type: ResourceType,
        resource_id: str,
        **extra: t.Any,
    ) -> None:
        message = f"{resource_type.value} '{resource_id}' not found"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            message=message,
            resource_type=resource_type.value,
            resource_id=resource_id,
            **extra,
        )


class HttpInternalServerError(BaseHttpError):
    """
    500 Internal Server Error.
    """

    def __init__(self, **extra: t.Any) -> None:
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error",
            **extra,
        )
