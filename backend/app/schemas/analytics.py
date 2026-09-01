from pydantic import BaseModel
from typing import List, Dict, Any

class CategoryShare(BaseModel):
    name: str
    value: float
    color: str

class DailyTrendItem(BaseModel):
    date: str
    yellow: float
    red: float
    blue: float
    white: float

class AnalyticsResponse(BaseModel):
    total_waste_kg: float
    collected_waste_kg: float
    pending_collection_kg: float
    pending_collections_count: int
    completed_collections_count: int
    segregation_accuracy: str
    critical_alerts_count: int
    category_breakdown: List[CategoryShare]
    status_breakdown: List[Dict[str, Any]]
    daily_trends: List[DailyTrendItem]
