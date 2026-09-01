from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.unit import CollectionUnit
from app.schemas.unit import UnitCreate, UnitUpdate, UnitResponse

router = APIRouter(prefix="/api/units", tags=["Collection Units"])

@router.get("", response_model=List[UnitResponse])
def get_collection_units(db: Session = Depends(get_db)):
    return db.query(CollectionUnit).order_by(CollectionUnit.id.asc()).all()

@router.put("/{unit_id}", response_model=UnitResponse)
def update_collection_unit(unit_id: int, unit_in: UnitUpdate, db: Session = Depends(get_db)):
    unit_obj = db.query(CollectionUnit).filter(CollectionUnit.id == unit_id).first()
    if not unit_obj:
        raise HTTPException(status_code=404, detail="Collection unit not found")
    
    update_data = unit_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(unit_obj, field, value)

    db.commit()
    db.refresh(unit_obj)
    return unit_obj
