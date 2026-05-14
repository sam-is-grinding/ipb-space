from app.repositories.facility_repository import FacilityRepository
from app.repositories.asset_repository import AssetRepository
from app.models.facility import Facility
from app.schemas.facility import FacilityCreate, FacilityUpdate
from fastapi import HTTPException

class FacilityService:
    def __init__(self, repository: FacilityRepository, asset_repository: AssetRepository):
        self.repository = repository
        self.asset_repository = asset_repository

    async def list_facilities(self):
        return await self.repository.get_all()

    async def get_facility(self, facility_id: int):
        facility = await self.repository.get_by_id(facility_id)
        if not facility:
            raise HTTPException(status_code=404, detail="Facility not found")
        return facility

    async def add_facility(self, data: FacilityCreate):
        asset_ids = data.asset_ids
        facility_dict = data.model_dump(exclude={"asset_ids"})
        new_facility = Facility(**facility_dict)

        if asset_ids:
            for aid in asset_ids:
                asset = await self.asset_repository.get_by_id(aid)
                if asset:
                    new_facility.assets.append(asset)

        return await self.repository.create(new_facility)

    async def update_facility(self, facility_id: int, data: FacilityUpdate):
        facility = await self.repository.get_by_id(facility_id)
        if not facility:
            raise HTTPException(status_code=404, detail="Facility not found")

        update_data = data.model_dump(exclude_unset=True)
        asset_ids = update_data.pop("asset_ids", None)

        for key, value in update_data.items():
            setattr(facility, key, value)

        if asset_ids is not None:
            # Clear existing assets
            facility.assets = []
            for aid in asset_ids:
                asset = await self.asset_repository.get_by_id(aid)
                if asset:
                    facility.assets.append(asset)

        await self.repository.db.commit()
        await self.repository.db.refresh(facility)
        return facility

    async def delete_facility(self, facility_id: int):
        facility = await self.repository.get_by_id(facility_id)
        if not facility:
            raise HTTPException(status_code=404, detail="Facility not found")

        await self.repository.db.delete(facility)
        await self.repository.db.commit()
        return True