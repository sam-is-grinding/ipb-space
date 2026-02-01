from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False) # Contoh: "RK. U1.01"
    description = Column(Text, nullable=True)         # Contoh: "Ruang Kelas AC, Proyektor"
    location = Column(String, nullable=False)         # Contoh: "Gedung GWW Lantai 2"
    capacity = Column(Integer, default=0)
    image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)         # If is renovation, set false
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())