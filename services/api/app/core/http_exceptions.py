from fastapi import HTTPException, status


class BaseHttpError(HTTPException):
    """
    Base HTTP exception for the API.
    """

    def __init__(self, status_code: int, detail: str) -> None:
        super().__init__(status_code=status_code, detail=detail)


class HttpNotFound(BaseHttpError):
    """
    404 Not Found error.
    """

    def __init__(self, detail: str = "Not found") -> None:
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class HttpInternalServerError(BaseHttpError):
    """
    500 Internal Server Error.
    """

    def __init__(self, detail: str = "Internal server error") -> None:
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
        )
