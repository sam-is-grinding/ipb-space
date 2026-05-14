from abc import ABC, abstractmethod
from fastapi import UploadFile


class DocumentStorage(ABC):
    """Abstraction for uploading booking documents to any storage vendor."""

    @abstractmethod
    async def upload_booking_document(self, file: UploadFile) -> str:
        """Upload a booking document and return its public URL/path."""
        raise NotImplementedError

    @abstractmethod
    async def delete_booking_document(self, file_url: str) -> bool:
        """Delete a booking document from storage."""
        raise NotImplementedError
