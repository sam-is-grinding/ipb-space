from pydantic import BaseModel, ConfigDict
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
    updated_at: Optional[datetime] = None
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)