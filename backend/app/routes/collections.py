from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models.collection import CollectionRequest
from app.models.waste import WasteRecord
from app.models.tracking import TrackingEvent
from app.models.unit import CollectionUnit
from app.schemas.collection import CollectionCreate, CollectionUpdate, CollectionResponse

router = APIRouter(prefix="/api/collections", tags=["Collection Requests"])

def helper_log_tracking(db: Session, tracking_id: str, event_type: str, location: str, description: str):
    event = TrackingEvent(
        tracking_id=tracking_id,
        event_type=event_type,
        location=location,
        description=description,
        timestamp=datetime.utcnow()
    )
    db.add(event)

@router.post("", response_model=CollectionResponse, status_code=201)
def create_collection_request(req_in: CollectionCreate, db: Session = Depends(get_db)):
    req_obj = CollectionRequest(
        waste_id=req_in.waste_id,
        location=req_in.location,
        waste_category=req_in.waste_category,
        quantity=req_in.quantity,
        priority=req_in.priority or "Medium",
        status="Pending",
        created_at=datetime.utcnow()
    )
    db.add(req_obj)
    db.commit()
    db.refresh(req_obj)

    # Find associated waste record tracking_id if waste_id provided
    tracking_id = None
    if req_in.waste_id:
        waste_rec = db.query(WasteRecord).filter(WasteRecord.id == req_in.waste_id).first()
        if waste_rec:
            tracking_id = waste_rec.tracking_id
            waste_rec.status = "Pending Pickup"
            db.commit()
    
    if not tracking_id:
        # Check if there is any waste record matching location
        waste_rec = db.query(WasteRecord).filter(WasteRecord.location == req_in.location).order_by(WasteRecord.id.desc()).first()
        if waste_rec:
            tracking_id = waste_rec.tracking_id
        else:
            tracking_id = f"MW-2026-REQ{req_obj.id}"

    # Automatically create tracking event
    helper_log_tracking(
        db,
        tracking_id=tracking_id,
        event_type="Collection Requested",
        location=req_in.location,
        description=f"Collection request #{req_obj.id} logged with priority {req_in.priority}"
    )
    db.commit()

    return req_obj

@router.get("", response_model=List[CollectionResponse])
def get_collection_requests(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CollectionRequest)
    if status and status != "All":
        query = query.filter(CollectionRequest.status.ilike(f"%{status}%"))
    if priority and priority != "All":
        query = query.filter(CollectionRequest.priority.ilike(f"%{priority}%"))
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (CollectionRequest.location.ilike(search_fmt)) |
            (CollectionRequest.assigned_unit.ilike(search_fmt)) |
            (CollectionRequest.waste_category.ilike(search_fmt))
        )
    return query.order_by(CollectionRequest.id.desc()).all()

@router.put("/{req_id}", response_model=CollectionResponse)
def update_collection_request(req_id: int, req_in: CollectionUpdate, db: Session = Depends(get_db)):
    req_obj = db.query(CollectionRequest).filter(CollectionRequest.id == req_id).first()
    if not req_obj:
        raise HTTPException(status_code=404, detail="Collection request not found")
    
    old_status = req_obj.status
    update_data = req_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(req_obj, field, value)
    
    if req_in.status == "Completed" and not req_obj.completed_at:
        req_obj.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(req_obj)

    # Determine tracking_id
    tracking_id = None
    waste_rec = None
    if req_obj.waste_id:
        waste_rec = db.query(WasteRecord).filter(WasteRecord.id == req_obj.waste_id).first()
        if waste_rec:
            tracking_id = waste_rec.tracking_id
    if not tracking_id:
        waste_rec = db.query(WasteRecord).filter(WasteRecord.location == req_obj.location).order_by(WasteRecord.id.desc()).first()
        if waste_rec:
            tracking_id = waste_rec.tracking_id
        else:
            tracking_id = f"MW-2026-REQ{req_obj.id}"

    # Log tracking event if status changed or unit assigned
    if req_in.status and req_in.status != old_status:
        status_event_map = {
            "Assigned": ("Collection Assigned", f"Assigned to mobile collection unit: {req_obj.assigned_unit or 'Mobile EV Unit'}"),
            "In Transit": ("Transported", f"Mobile collection unit in transit to {req_obj.location}"),
            "Collecting": ("Collecting", f"Unit collecting waste from {req_obj.location}"),
            "Collected": ("Collected", f"Waste collected successfully from {req_obj.location}"),
            "Completed": ("Processed/Disposed", f"Waste delivered to Common Bio-Medical Waste Treatment Facility (CBWTF)"),
            "Cancelled": ("Cancelled", f"Collection request #{req_obj.id} was cancelled")
        }
        
        event_type, default_desc = status_event_map.get(
            req_in.status, 
            (f"Status: {req_in.status}", f"Collection request updated to {req_in.status}")
        )
        
        helper_log_tracking(
            db,
            tracking_id=tracking_id,
            event_type=event_type,
            location=req_obj.location,
            description=default_desc
        )

        # Sync waste record status
        if waste_rec:
            waste_rec.status = req_in.status
            db.commit()

    # Sync assigned mobile unit if applicable
    if req_obj.assigned_unit:
        unit_obj = db.query(CollectionUnit).filter(CollectionUnit.unit_name.ilike(f"%{req_obj.assigned_unit}%")).first()
        if unit_obj:
            if req_obj.status == "Assigned":
                unit_obj.status = "Assigned"
                unit_obj.destination = req_obj.location
                unit_obj.current_task = f"Pickup #{req_obj.id} ({req_obj.waste_category})"
            elif req_obj.status == "Collecting":
                unit_obj.status = "Collecting"
                unit_obj.current_location = req_obj.location
            elif req_obj.status == "Collected":
                unit_obj.status = "En Route"
                unit_obj.destination = "Treatment Plant (CBWTF)"
                unit_obj.capacity = min(100, unit_obj.capacity + 25)
            elif req_obj.status == "Completed":
                unit_obj.status = "Available"
                unit_obj.destination = "Charging Dock A"
                unit_obj.current_task = "None"
            db.commit()

    return req_obj
