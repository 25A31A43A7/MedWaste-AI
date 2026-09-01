from app.schemas.waste import WasteCreate, WasteUpdate, WasteResponse, ClassifyResponse
from app.schemas.collection import CollectionCreate, CollectionUpdate, CollectionResponse
from app.schemas.unit import UnitCreate, UnitUpdate, UnitResponse
from app.schemas.tracking import TrackingCreate, TrackingResponse, TrackingDetailResponse
from app.schemas.alert import AlertCreate, AlertResponse
from app.schemas.analytics import AnalyticsResponse

__all__ = [
    "WasteCreate", "WasteUpdate", "WasteResponse", "ClassifyResponse",
    "CollectionCreate", "CollectionUpdate", "CollectionResponse",
    "UnitCreate", "UnitUpdate", "UnitResponse",
    "TrackingCreate", "TrackingResponse", "TrackingDetailResponse",
    "AlertCreate", "AlertResponse", "AnalyticsResponse"
]
