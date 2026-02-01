from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FacilityCreate(BaseModel):
    name: str
    location: str
    capacity: int
    description: Optional[str] = None

class FacilityResponse(FacilityCreate):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True