from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base

class CollectionRequest(Base):
    __tablename__ = "collection_requests"

    id = Column(Integer, primary_key=True, index=True)
    waste_id = Column(Integer, nullable=True)
    location = Column(String(100), nullable=False)
    waste_category = Column(String(20), nullable=False) # Yellow, Red, White, Blue
    quantity = Column(Float, nullable=False)
    priority = Column(String(20), default="Medium") # Low, Medium, High, Critical
    assigned_unit = Column(String(50), nullable=True)
    status = Column(String(32), default="Pending") # Pending, Assigned, In Transit, Collecting, Collected, Completed, Cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
