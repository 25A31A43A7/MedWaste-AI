from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CollectionCreate(BaseModel):
    waste_id: Optional[int] = None
    location: str = Field(..., example="ICU Ward 4A")
    waste_category: str = Field(..., example="Yellow")
    quantity: float = Field(..., example=12.5)
    priority: Optional[str] = "Medium" # Low, Medium, High, Critical

class CollectionUpdate(BaseModel):
    assigned_unit: Optional[str] = None
    status: Optional[str] = None # Pending, Assigned, In Transit, Collecting, Collected, Completed, Cancelled
    priority: Optional[str] = None

class CollectionResponse(BaseModel):
    id: int
    waste_id: Optional[int] = None
    location: str
    waste_category: str
    quantity: float
    priority: str
    assigned_unit: Optional[str] = None
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
