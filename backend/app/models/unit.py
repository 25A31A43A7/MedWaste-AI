from sqlalchemy import Column, Integer, String
from app.database import Base

class CollectionUnit(Base):
    __tablename__ = "collection_units"

    id = Column(Integer, primary_key=True, index=True)
    unit_name = Column(String(50), unique=True, index=True, nullable=False)
    status = Column(String(32), default="Available") # Available, Assigned, En Route, Collecting, Returning, Maintenance
    battery = Column(Integer, default=100) # 0-100%
    capacity = Column(Integer, default=0) # 0-100% fill level
    current_location = Column(String(100), default="Depot / Charging Station A")
    destination = Column(String(100), default="Standby")
    current_task = Column(String(100), default="None")
