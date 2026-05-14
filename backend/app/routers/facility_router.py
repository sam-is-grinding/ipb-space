from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repositories.facility_repository import FacilityRepository
from app.repositories.asset_repository import AssetRepository
from app.services.facility_service import FacilityService
from app.schemas.facility import FacilityCreate, FacilityUpdate, FacilityResponse
from app.schemas.http import HTTPResponse
from app.api.dependencies import ensure_is_admin

router = APIRouter(prefix="/facilities", tags=["Facilities"])

async def get_facility_service(db: AsyncSession = Depends(get_db)):
    repo = FacilityRepository(db)
    asset_repo = AssetRepository(db)
    return FacilityService(repo, asset_repo)

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

@router.get("/{facility_id}", response_model=HTTPResponse)
async def get_facility_by_id(
    facility_id: int, 
    service: FacilityService = Depends(get_facility_service)
    ) -> HTTPResponse:
    """
    Endpoint to retrieve a specific facility by its ID.
    """
    facility = await service.get_facility(facility_id)
    return HTTPResponse(
        success=True, 
        data={"facility": FacilityResponse.model_validate(facility).model_dump(mode="json")}
    )

@router.post("/", response_model=HTTPResponse, status_code=status.HTTP_201_CREATED)
async def create_facility(
    data: FacilityCreate, 
    service: FacilityService = Depends(get_facility_service),
    is_admin: bool = Depends(ensure_is_admin)
    ) -> HTTPResponse:
    """
    Endpoint to create a new facility. Requires admin privileges.
    """
    facility = await service.add_facility(data)
    return HTTPResponse(success=True, data={"facility": FacilityResponse.model_validate(facility).model_dump(mode="json")})

@router.put("/{facility_id}", response_model=HTTPResponse)
async def update_facility(
    facility_id: int,
    data: FacilityUpdate,
    service: FacilityService = Depends(get_facility_service),
    is_admin: bool = Depends(ensure_is_admin)
) -> HTTPResponse:
    """
    Endpoint to update an existing facility. Requires admin privileges.
    """
    facility = await service.update_facility(facility_id, data)
    return HTTPResponse(success=True, data={"facility": FacilityResponse.model_validate(facility).model_dump(mode="json")})

@router.delete("/{facility_id}", response_model=HTTPResponse)
async def delete_facility(
    facility_id: int,
    service: FacilityService = Depends(get_facility_service),
    is_admin: bool = Depends(ensure_is_admin)
) -> HTTPResponse:
    """
    Endpoint to delete a facility. Requires admin privileges.
    """
    await service.delete_facility(facility_id)
    return HTTPResponse(success=True, data={"message": "Facility deleted successfully"})