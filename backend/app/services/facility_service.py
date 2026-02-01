from app.repositories.facility_repository import FacilityRepository
from app.models.facility import Facility
from app.schemas.facility import FacilityCreate

class FacilityService:
    def __init__(self, repository: FacilityRepository):
        self.repository = repository

    async def list_facilities(self):
        return await self.repository.get_all()

    async def add_facility(self, data: FacilityCreate):
        new_facility = Facility(**data.model_dump())
        return await self.repository.create(new_facility)