from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repositories.facility_repository import FacilityRepository
from app.services.facility_service import FacilityService
from app.schemas.facility import FacilityResponse, FacilityCreate

router = APIRouter(prefix="/facilities", tags=["Facilities"])

async def get_facility_service(db: AsyncSession = Depends(get_db)):
    repo = FacilityRepository(db)
    return FacilityService(repo)

@router.get("/", response_model=list[FacilityResponse])
async def get_all_facilities(service: FacilityService = Depends(get_facility_service)):
    return await service.list_facilities()

@router.post("/", response_model=FacilityResponse)
async def create_facility(data: FacilityCreate, service: FacilityService = Depends(get_facility_service)):
    return await service.add_facility(data)