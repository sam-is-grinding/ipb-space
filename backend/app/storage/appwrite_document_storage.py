import asyncio
import os
import re
from uuid import uuid4

from appwrite.client import Client
from appwrite.id import ID
from appwrite.input_file import InputFile
from appwrite.services.storage import Storage
from fastapi import HTTPException, UploadFile, status

from app.storage.document_storage import DocumentStorage


class AppwriteDocumentStorage(DocumentStorage):
    """Store booking documents in Appwrite Storage."""

    def __init__(
        self,
        endpoint: str | None = None,
        project_id: str | None = None,
        api_key: str | None = None,
        bucket_id: str | None = None,
    ):
        self.endpoint = (endpoint or os.getenv("APPWRITE_ENDPOINT", "")).rstrip("/")
        self.project_id = project_id or os.getenv("APPWRITE_PROJECT_ID")
        self.api_key = api_key or os.getenv("APPWRITE_API_KEY")
        self.bucket_id = bucket_id or os.getenv("APPWRITE_BUCKET_ID")

        missing = [
            name
            for name, value in {
                "APPWRITE_ENDPOINT": self.endpoint,
                "APPWRITE_PROJECT_ID": self.project_id,
                "APPWRITE_API_KEY": self.api_key,
                "APPWRITE_BUCKET_ID": self.bucket_id,
            }.items()
            if not value
        ]
        if missing:
            raise ValueError(f"Missing Appwrite config: {', '.join(missing)}")

        client = Client()
        client.set_endpoint(self.endpoint)
        client.set_project(self.project_id)
        client.set_key(self.api_key)
        self.storage = Storage(client)

    async def upload_booking_document(self, file: UploadFile) -> str:
        file_bytes = await file.read()
        filename = file.filename or f"booking-document-{uuid4().hex}"

        appwrite_file = InputFile.from_bytes(file_bytes, filename=filename)
        file_id = ID.unique()

        try:
            created = await asyncio.to_thread(
                self.storage.create_file,
                bucket_id=self.bucket_id,
                file_id=file_id,
                file=appwrite_file,
            )
        except Exception as exc:
            await file.close()
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to upload document to Appwrite: {exc}",
            ) from exc

        await file.close()

        created_id = created.get("$id") if isinstance(created, dict) else file_id
        custom_template = os.getenv("APPWRITE_FILE_URL_TEMPLATE")
        if custom_template:
            return custom_template.format(
                endpoint=self.endpoint,
                project_id=self.project_id,
                bucket_id=self.bucket_id,
                file_id=created_id,
            )

        return (
            f"{self.endpoint}/storage/buckets/{self.bucket_id}/files/{created_id}"
            f"/view?project={self.project_id}"
        )

    async def delete_booking_document(self, file_url: str) -> bool:
        # Match file_id in Appwrite URL or custom template
        # Default pattern: /files/{file_id}/view
        match = re.search(r"/files/([^/?#]+)", file_url)
        if not match:
            return False

        file_id = match.group(1)
        try:
            await asyncio.to_thread(
                self.storage.delete_file,
                bucket_id=self.bucket_id,
                file_id=file_id,
            )
            return True
        except Exception:
            return False
