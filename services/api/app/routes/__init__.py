from fastapi import APIRouter

from .documents import router as documents_router
from .utils import router as utils_router

# Main router for the API
router = APIRouter()

# Nested routers
router.include_router(utils_router)
router.include_router(documents_router)

# Expose only the main router
__all__ = ["router"]
