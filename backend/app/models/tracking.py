from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class TrackingEvent(Base):
    __tablename__ = "tracking_events"

    id = Column(Integer, primary_key=True, index=True)
    tracking_id = Column(String(32), index=True, nullable=False)
    event_type = Column(String(50), nullable=False) # Waste Generated, AI Classified, Segregated, Collection Requested, Collection Assigned, Collected, Transported, Received, Processed/Disposed
    location = Column(String(100), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    description = Column(String(255), nullable=True)
