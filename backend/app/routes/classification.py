from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form
from app.schemas.waste import ClassifyResponse
from app.services.classifier import classify_medical_waste

router = APIRouter(prefix="/api/waste", tags=["AI Classification"])

@router.post("/classify", response_model=ClassifyResponse)
async def classify_waste(file: Optional[UploadFile] = File(None)):
    filename = file.filename if file and file.filename else "image.jpg"
    content = None
    if file:
        content = await file.read()
    
    result = classify_medical_waste(filename=filename, file_bytes=content)
    return result
