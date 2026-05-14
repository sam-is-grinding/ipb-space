from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.facility import Facility

class FacilityRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self):
        result = await self.db.execute(select(Facility))
        return result.scalars().all()

    async def get_by_id(self, facility_id: int):
        stmt = select(Facility).where(Facility.id == facility_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create(self, facility_data: Facility):
        self.db.add(facility_data)
        await self.db.commit()
        await self.db.refresh(facility_data)
        return facility_data