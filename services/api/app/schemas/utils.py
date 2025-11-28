from pydantic import BaseModel


class HealthResponse(BaseModel):
    """
    Response model for the health endpoint.
    """

    message: str = "OK"
