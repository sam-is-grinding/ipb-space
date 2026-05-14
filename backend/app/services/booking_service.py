from datetime import datetime
from typing import Sequence

from fastapi import HTTPException, UploadFile, status

from app.models.booking import Booking
from app.repositories.booking_repository import BookingRepository
from app.repositories.facility_repository import FacilityRepository
from app.repositories.user_repository import UserRepository
from app.storage.document_storage import DocumentStorage
from app.enums.status_approval import StatusApproval

class BookingService:
    def __init__(
        self,
        booking_repository: BookingRepository,
        facility_repository: FacilityRepository,
        user_repository: UserRepository,
        document_storage: DocumentStorage,
    ):
        self.booking_repository = booking_repository
        self.facility_repository = facility_repository
        self.user_repository = user_repository
        self.document_storage = document_storage

    async def create_booking(
        self,
        facility_id: int,
        user_id: int,
        purpose: str,
        number_of_attendees: int,
        document: UploadFile,
        date_of_booking: datetime,
        start_time: datetime,
        end_time: datetime,
        fee: int | None = None,
    ) -> Booking:
        facility = await self.facility_repository.get_by_id(facility_id)
        if not facility:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Facility not found")

        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        purpose = purpose.strip()
        if len(purpose) < 3:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Purpose must be at least 3 characters")

        if number_of_attendees < 1:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Number of attendees must be at least 1")

        content_type = (document.content_type or "").lower()
        if content_type not in {"application/pdf", "image/jpeg", "image/png"}:
            await document.close()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Document must be a PDF, JPG, or PNG file",
            )

        document_url = await self.document_storage.upload_booking_document(document)

        new_booking = Booking(
            facility_id=facility_id,
            user_id=user_id,
            purpose=purpose,
            number_of_attendees=number_of_attendees,
            document_url=document_url,
            fee=fee,
            date_of_booking=date_of_booking,
            start_time=start_time,
            end_time=end_time,
        )

        return await self.booking_repository.create(new_booking)
    
    async def get_facility_booking_queue(self, facility_id: int):
        facility = await self.facility_repository.get_by_id(facility_id)
        if not facility:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Facility not found")
        return await self.booking_repository.get_bookings_by_facility_id(facility_id)
    
    async def get_all_bookings(self) -> Sequence[Booking]:
        return await self.booking_repository.get_all()

    async def get_booking_by_id(self, booking_id: int) -> Booking:
        booking = await self.booking_repository.get_by_id(booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        return booking

    async def delete_booking(self, booking_id: int) -> bool:
        booking = await self.booking_repository.get_by_id(booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        
        # Delete document from storage if exists
        if booking.document_url:
            await self.document_storage.delete_booking_document(booking.document_url)

        return await self.booking_repository.delete(booking_id)

    async def delete_booking_document(self, booking_id: int) -> bool:
        booking = await self.booking_repository.get_by_id(booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        
        if not booking.document_url:
            return False
            
        success = await self.document_storage.delete_booking_document(booking.document_url)
        if success:
            await self.booking_repository.update(booking_id, {"document_url": None})
            
        return success

    async def update_booking_status(self, booking_id: int, new_status: str):
        old_booking = await self.booking_repository.get_by_id(booking_id)
        if not old_booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

        if new_status not in [s.value for s in StatusApproval]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid status. Valid statuses are: {', '.join([s.value for s in StatusApproval])}")

        return await self.booking_repository.update(old_booking.id, {"status": StatusApproval(new_status).value})
    
    async def handle_handover_to_next_in_queue(self, facility_id: int):
        queue = await self.booking_repository.get_bookings_by_facility_id(facility_id)
        pending_bookings = [b for b in queue if b.status == StatusApproval.PENDING.value]
        if pending_bookings:
            next_booking = pending_bookings[0]
            await self.booking_repository.update(next_booking.id, {"status": StatusApproval.APPROVED.value})