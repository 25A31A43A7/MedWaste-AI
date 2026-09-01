from fastapi import APIRouter
from datetime import datetime

router = APIRouter(prefix="/api", tags=["Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MedWaste AI API Engine",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }
