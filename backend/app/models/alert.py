from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String(50), nullable=False) # Mis-Segregation, High-Risk Waste, Pickup Delay, Container Capacity, Low Battery
    severity = Column(String(20), nullable=False) # Critical, High, Medium, Low
    message = Column(String(255), nullable=False)
    location = Column(String(100), nullable=False)
    status = Column(String(20), default="Active") # Active, Resolved
    timestamp = Column(DateTime, default=datetime.utcnow)
