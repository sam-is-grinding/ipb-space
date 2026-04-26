from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repositories.facility_repository import FacilityRepository
from app.services.facility_service import FacilityService
from app.schemas.facility import FacilityCreate, FacilityResponse
from app.schemas.http import HTTPResponse
from api.dependencies import ensure_is_admin

router = APIRouter(prefix="/facilities", tags=["Facilities"])

async def get_facility_service(db: AsyncSession = Depends(get_db)):
    repo = FacilityRepository(db)
    return FacilityService(repo)

@router.get("/", response_model=HTTPResponse)
async def get_all_facilities(service: FacilityService = Depends(get_facility_service)) -> HTTPResponse:
    """
    Endpoint to retrieve a list of all facilities.
    """
    facilities = await service.list_facilities()
    return HTTPResponse(
        success=True,
        data={"items": [FacilityResponse.model_validate(facility).model_dump(mode="json") for facility in facilities]},
    )

@router.post("/", response_model=HTTPResponse)
async def create_facility(
    data: FacilityCreate, 
    service: FacilityService = Depends(get_facility_service),
    is_admin: bool = Depends(ensure_is_admin)
    ) -> HTTPResponse:
    """
    Endpoint to create a new facility. Requires admin privileges.

    Example request body:
    {
        "name": "RK. U1.01",
        "description": "Ruang kelas ber-AC dengan proyektor.",
        "location": "Gedung GWW Lantai 1",
        "capacity": 40,
        "image_url": "https://example.com/images/rk-u1-01.jpg",
        "is_active": true
    }
    """
    facility = await service.add_facility(data)
    return HTTPResponse(success=True, data={"facility": FacilityResponse.model_validate(facility).model_dump(mode="json")})