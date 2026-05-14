from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class FacilityCreate(BaseModel):
    name: str
    code: str
    location: str
    capacity: int
    threshold: Optional[int] = 0
    image_url: Optional[str] = None
    condition: Optional[str] = None
    contact_person: Optional[str] = None


class FacilityResponse(FacilityCreate):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)