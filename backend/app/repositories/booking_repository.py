from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.booking import Booking

class BookingRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self):
        result = await self.db.execute(select(Booking))
        return result.scalars().all()

    async def get_by_id(self, booking_id: int):
        stmt = select(Booking).where(Booking.id == booking_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create(self, booking_data: Booking):
        self.db.add(booking_data)
        await self.db.commit()
        await self.db.refresh(booking_data)
        return booking_data

    async def delete(self, booking_id: int):
        booking = await self.get_by_id(booking_id)
        if booking:
            await self.db.delete(booking)
            await self.db.commit()
            return True
        return False

    async def update(self, booking_id: int, updated_data: dict):
        booking = await self.get_by_id(booking_id)
        if booking:
            for key, value in updated_data.items():
                setattr(booking, key, value)
            await self.db.commit()
            await self.db.refresh(booking)
            return booking
        return None
    
    async def get_bookings_by_facility_id(self, facility_id: int):
        stmt = select(Booking).where(Booking.facility_id == facility_id)
        result = await self.db.execute(stmt)
        return result.scalars().all()