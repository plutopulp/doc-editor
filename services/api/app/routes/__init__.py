from fastapi import APIRouter

from .utils import router as utils_router

# Main router for the API
router = APIRouter()

# Nested routers
router.include_router(utils_router)

# Expose only the main router
__all__ = ["router"]
