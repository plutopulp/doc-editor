class AppError(Exception):
    """
    Base application-level exception.
    """

    def __init__(self, message: str = "Application error") -> None:
        self.message = message
        super().__init__(message)


class DocumentNotFound(AppError):
    """
    Raised when a requested document does not exist.
    """

    def __init__(self, document_id: str) -> None:
        super().__init__(f"Document '{document_id}' not found")
        self.document_id = document_id


class StorageError(AppError):
    """
    Raised when a low-level storage operation fails.
    """

    pass
