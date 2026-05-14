import os
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.storage.document_storage import DocumentStorage


class LocalDocumentStorage(DocumentStorage):
    """Store files in local disk. Useful for development and vendor-agnostic service wiring."""

    def __init__(self, base_dir: str | None = None, base_url: str | None = None):
        configured_dir = base_dir or os.getenv("BOOKING_DOCUMENT_DIR", "uploads/booking-documents")
        self.base_dir = Path(configured_dir)
        self.base_url = base_url or os.getenv("BOOKING_DOCUMENT_BASE_URL", "/uploads/booking-documents")
        self.base_dir.mkdir(parents=True, exist_ok=True)

    async def upload_booking_document(self, file: UploadFile) -> str:
        filename = file.filename or "document"
        extension = Path(filename).suffix.lower()
        safe_name = f"{uuid4().hex}{extension}"
        destination = self.base_dir / safe_name

        content = await file.read()
        destination.write_bytes(content)
        await file.close()

        return f"{self.base_url.rstrip('/')}/{safe_name}"

    async def delete_booking_document(self, file_url: str) -> bool:
        filename = file_url.split("/")[-1]
        file_path = self.base_dir / filename
        if file_path.exists():
            file_path.unlink()
            return True
        return False
