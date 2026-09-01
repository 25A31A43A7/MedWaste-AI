from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.schemas.waste import WasteResponse

class TrackingCreate(BaseModel):
    tracking_id: str = Field(..., example="MW-2026-9081")
    event_type: str = Field(..., example="Collection Requested")
    location: str = Field(..., example="ICU Ward 4A")
    description: Optional[str] = None

class TrackingResponse(BaseModel):
    id: int
    tracking_id: str
    event_type: str
    location: str
    timestamp: datetime
    description: Optional[str] = None

    class Config:
        from_attributes = True

class TrackingDetailResponse(BaseModel):
    waste_record: Optional[WasteResponse] = None
    tracking_id: str
    current_status: str
    current_location: str
    category: str
    quantity: float
    events: List[TrackingResponse]
