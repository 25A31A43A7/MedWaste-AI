from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class WasteBase(BaseModel):
    waste_type: str = Field(..., example="Infectious Gauze & Dressing")
    category: str = Field(..., example="Yellow")
    quantity: float = Field(..., example=15.5)
    location: str = Field(..., example="ICU Ward 4A")
    status: Optional[str] = "Pending"

class WasteCreate(WasteBase):
    pass

class WasteUpdate(BaseModel):
    waste_type: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[float] = None
    location: Optional[str] = None
    status: Optional[str] = None

class WasteResponse(WasteBase):
    id: int
    tracking_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class ClassifyResponse(BaseModel):
    category: str = Field(..., example="Yellow")
    predictedWasteType: str = Field(..., example="Infectious Surgical Waste")
    confidence: int = Field(..., example=94)
    recommendation: str = Field(..., example="Dispose in designated yellow non-chlorinated biohazard container")
