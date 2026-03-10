from typing import Any
from pydantic import BaseModel

class HTTPResponse(BaseModel):
    """Standardized API response model, containing success status, message, and optional data payload."""
    success: bool
    message: str
    data: dict[str, Any] | None = None