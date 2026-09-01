from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AlertCreate(BaseModel):
    alert_type: str = Field(..., example="Mis-Segregation")
    severity: str = Field(..., example="High")
    message: str = Field(..., example="Plastic item detected in Yellow Infectious bin")
    location: str = Field(..., example="Surgical OT 2")

class AlertResponse(BaseModel):
    id: int
    alert_type: str
    severity: str
    message: str
    location: str
    status: str
    timestamp: datetime

    class Config:
        from_attributes = True
