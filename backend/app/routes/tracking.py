from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.waste import WasteRecord
from app.models.tracking import TrackingEvent
from app.schemas.tracking import TrackingCreate, TrackingResponse, TrackingDetailResponse

router = APIRouter(prefix="/api/tracking", tags=["Waste Tracking"])

@router.get("/{tracking_id}", response_model=TrackingDetailResponse)
def get_waste_tracking_timeline(tracking_id: str, db: Session = Depends(get_db)):
    waste_rec = db.query(WasteRecord).filter(WasteRecord.tracking_id.ilike(tracking_id)).first()
    
    events = db.query(TrackingEvent).filter(
        TrackingEvent.tracking_id.ilike(tracking_id)
    ).order_by(TrackingEvent.timestamp.asc()).all()

    if not waste_rec and len(events) == 0:
        raise HTTPException(status_code=404, detail=f"No tracking record found for ID: {tracking_id}")

    # Build default fallback waste metadata if waste_rec exists
    cat = waste_rec.category if waste_rec else "Yellow"
    qty = waste_rec.quantity if waste_rec else 10.0
    curr_loc = waste_rec.location if waste_rec else "Hospital Central Depot"
    curr_status = waste_rec.status if waste_rec else "Segregated"

    # If events list is empty, seed an initial "Waste Generated" event automatically
    if len(events) == 0 and waste_rec:
        initial_event = TrackingEvent(
            tracking_id=waste_rec.tracking_id,
            event_type="Waste Generated",
            location=waste_rec.location,
            timestamp=waste_rec.created_at or datetime.utcnow(),
            description=f"Waste record {waste_rec.tracking_id} registered ({waste_rec.waste_type})"
        )
        db.add(initial_event)
        db.commit()
        events = [initial_event]

    return {
        "waste_record": waste_rec,
        "tracking_id": tracking_id,
        "current_status": curr_status,
        "current_location": curr_loc,
        "category": cat,
        "quantity": qty,
        "events": events
    }

@router.post("", response_model=TrackingResponse, status_code=201)
def create_tracking_event(event_in: TrackingCreate, db: Session = Depends(get_db)):
    event_obj = TrackingEvent(
        tracking_id=event_in.tracking_id,
        event_type=event_in.event_type,
        location=event_in.location,
        description=event_in.description,
        timestamp=datetime.utcnow()
    )
    db.add(event_obj)
    
    # Sync waste record location/status if applicable
    waste_rec = db.query(WasteRecord).filter(WasteRecord.tracking_id == event_in.tracking_id).first()
    if waste_rec:
        waste_rec.location = event_in.location
        if event_in.event_type in ["Collected", "Transported", "Disposed"]:
            waste_rec.status = event_in.event_type

    db.commit()
    db.refresh(event_obj)
    return event_obj
