from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base

class WasteRecord(Base):
    __tablename__ = "waste_records"

    id = Column(Integer, primary_key=True, index=True)
    tracking_id = Column(String(32), unique=True, index=True, nullable=False)
    waste_type = Column(String(100), nullable=False)
    category = Column(String(20), nullable=False) # Yellow, Red, White, Blue
    quantity = Column(Float, nullable=False) # in kg
    location = Column(String(100), nullable=False) # Ward / Department
    status = Column(String(32), default="Pending") # Pending, Segregated, Collected, Disposed
    created_at = Column(DateTime, default=datetime.utcnow)
