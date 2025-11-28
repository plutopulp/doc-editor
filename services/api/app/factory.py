from fastapi import FastAPI

from .routes import router


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    """
    app = FastAPI(title="Doc Editor API", version="0.1.0")

    # Attach the main router
    app.include_router(router)
    return app
