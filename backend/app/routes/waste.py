import random
import string
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.waste import WasteRecord
from app.schemas.waste import WasteCreate, WasteUpdate, WasteResponse

router = APIRouter(prefix="/api/waste", tags=["Waste Management"])

def generate_tracking_id() -> str:
    """Generate unique tracking ID like MW-2026-8901."""
    digits = ''.join(random.choices(string.digits, k=4))
    return f"MW-2026-{digits}"

@router.post("", response_model=WasteResponse, status_code=201)
def create_waste_record(waste_in: WasteCreate, db: Session = Depends(get_db)):
    # Ensure tracking_id uniqueness
    for _ in range(10):
        tid = generate_tracking_id()
        existing = db.query(WasteRecord).filter(WasteRecord.tracking_id == tid).first()
        if not existing:
            break
    
    db_obj = WasteRecord(
        tracking_id=tid,
        waste_type=waste_in.waste_type,
        category=waste_in.category,
        quantity=waste_in.quantity,
        location=waste_in.location,
        status=waste_in.status or "Pending"
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("", response_model=List[WasteResponse])
def get_waste_records(
    category: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(WasteRecord)
    
    if category and category != "All":
        query = query.filter(WasteRecord.category.ilike(f"%{category}%"))
    if status and status != "All":
        query = query.filter(WasteRecord.status.ilike(f"%{status}%"))
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (WasteRecord.tracking_id.ilike(search_fmt)) |
            (WasteRecord.waste_type.ilike(search_fmt)) |
            (WasteRecord.location.ilike(search_fmt))
        )
        
    return query.order_by(WasteRecord.id.desc()).all()

@router.get("/{waste_id}", response_model=WasteResponse)
def get_waste_record(waste_id: int, db: Session = Depends(get_db)):
    record = db.query(WasteRecord).filter(WasteRecord.id == waste_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Waste record not found")
    return record

@router.put("/{waste_id}", response_model=WasteResponse)
def update_waste_record(waste_id: int, waste_in: WasteUpdate, db: Session = Depends(get_db)):
    record = db.query(WasteRecord).filter(WasteRecord.id == waste_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Waste record not found")
    
    update_data = waste_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)
        
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{waste_id}")
def delete_waste_record(waste_id: int, db: Session = Depends(get_db)):
    record = db.query(WasteRecord).filter(WasteRecord.id == waste_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Waste record not found")
    
    db.delete(record)
    db.commit()
    return {"message": f"Waste record {waste_id} deleted successfully", "id": waste_id}
