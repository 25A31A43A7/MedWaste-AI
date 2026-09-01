from pydantic import BaseModel, Field
from typing import Optional

class UnitCreate(BaseModel):
    unit_name: str = Field(..., example="EV-Unit-01")
    status: Optional[str] = "Available"
    battery: Optional[int] = 100
    capacity: Optional[int] = 0
    current_location: Optional[str] = "Charging Station A"
    destination: Optional[str] = "Standby"
    current_task: Optional[str] = "None"

class UnitUpdate(BaseModel):
    status: Optional[str] = None
    battery: Optional[int] = None
    capacity: Optional[int] = None
    current_location: Optional[str] = None
    destination: Optional[str] = None
    current_task: Optional[str] = None

class UnitResponse(BaseModel):
    id: int
    unit_name: str
    status: str
    battery: int
    capacity: int
    current_location: str
    destination: str
    current_task: str

    class Config:
        from_attributes = True
