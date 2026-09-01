from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models.alert import Alert
from app.models.unit import CollectionUnit
from app.models.collection import CollectionRequest
from app.schemas.alert import AlertCreate, AlertResponse

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(status: Optional[str] = None, db: Session = Depends(get_db)):
    # 1. Sync dynamic telemetry alerts from collection units & requests
    units = db.query(CollectionUnit).all()
    for u in units:
        if u.battery < 30:
            existing = db.query(Alert).filter(Alert.alert_type == "Low Battery", Alert.location == u.unit_name, Alert.status == "Active").first()
            if not existing:
                db.add(Alert(
                    alert_type="Low Battery",
                    severity="High",
                    message=f"Collection vehicle {u.unit_name} battery low ({u.battery}%). Return to dock.",
                    location=u.unit_name,
                    status="Active",
                    timestamp=datetime.utcnow()
                ))
        if u.capacity > 75:
            existing = db.query(Alert).filter(Alert.alert_type == "Container Capacity", Alert.location == u.unit_name, Alert.status == "Active").first()
            if not existing:
                db.add(Alert(
                    alert_type="Container Capacity",
                    severity="Critical",
                    message=f"Storage container on {u.unit_name} is {u.capacity}% full. Unload required.",
                    location=u.unit_name,
                    status="Active",
                    timestamp=datetime.utcnow()
                ))

    # Sync critical delayed requests
    reqs = db.query(CollectionRequest).filter(CollectionRequest.status == "Pending", CollectionRequest.priority.in_(["Critical", "High"])).all()
    for r in reqs:
        existing = db.query(Alert).filter(Alert.alert_type == "Delayed Collection", Alert.location == r.location, Alert.status == "Active").first()
        if not existing:
            db.add(Alert(
                alert_type="Delayed Collection",
                severity=r.priority,
                message=f"Pending bio-medical pickup at {r.location} requires urgent dispatch ({r.waste_category} category).",
                location=r.location,
                status="Active",
                timestamp=datetime.utcnow()
            ))

    db.commit()

    query = db.query(Alert)
    if status and status != "All":
        query = query.filter(Alert.status.ilike(f"%{status}%"))
    return query.order_by(Alert.timestamp.desc()).all()

@router.put("/{alert_id}/resolve", response_model=AlertResponse)
def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    alert_obj = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert_obj:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert_obj.status = "Resolved"
    db.commit()
    db.refresh(alert_obj)
    return alert_obj
