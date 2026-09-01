from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from app.database import engine, SessionLocal, Base
from app.models.waste import WasteRecord
from app.models.collection import CollectionRequest
from app.models.unit import CollectionUnit
from app.models.tracking import TrackingEvent
from app.models.alert import Alert
from app.routes import health, classification, waste, collections, units, tracking, alerts, analytics

# Create all database tables
Base.metadata.create_all(bind=engine)

def seed_demo_data():
    """Seed initial realistic demo records for all modules if empty."""
    db = SessionLocal()
    try:
        # 1. Seed Waste Records
        if db.query(WasteRecord).count() == 0:
            initial_wastes = [
                WasteRecord(tracking_id="MW-2026-9081", waste_type="Infectious Gauze & Surgical Dressing", category="Yellow", quantity=45.2, location="ICU - Ward 4A", status="Collected"),
                WasteRecord(tracking_id="MW-2026-9082", waste_type="Sharps & Used Scalpel Blades", category="White", quantity=12.8, location="Surgical OT 2", status="Segregated"),
                WasteRecord(tracking_id="MW-2026-9083", waste_type="Contaminated Recyclable Plastic Tubing", category="Red", quantity=88.0, location="Emergency ER", status="Pending"),
                WasteRecord(tracking_id="MW-2026-9084", waste_type="Glass Medicine Vials & Ampoules", category="Blue", quantity=24.5, location="Radiology Lab", status="Pending"),
                WasteRecord(tracking_id="MW-2026-9085", waste_type="Soiled Cotton & Anatomical Tissue", category="Yellow", quantity=31.0, location="Pediatrics Ward B", status="Disposed"),
            ]
            db.add_all(initial_wastes)
            db.commit()

        # 2. Seed Collection Units
        if db.query(CollectionUnit).count() == 0:
            initial_units = [
                CollectionUnit(unit_name="EV-Unit-01 (North Loop)", status="Assigned", battery=88, capacity=45, current_location="North Wing Bay 2", destination="ICU Ward 4A", current_task="Pickup Request #REQ-101"),
                CollectionUnit(unit_name="EV-Unit-02 (South Loop)", status="En Route", battery=72, capacity=80, current_location="Central Corridor", destination="CBWTF Processing Facility", current_task="Transporting Red Plastics"),
                CollectionUnit(unit_name="EV-Unit-03 (Express EV)", status="Available", battery=100, capacity=0, current_location="Charging Dock A", destination="Standby", current_task="None"),
            ]
            db.add_all(initial_units)
            db.commit()

        # 3. Seed Collection Requests
        if db.query(CollectionRequest).count() == 0:
            initial_reqs = [
                CollectionRequest(waste_id=1, location="ICU - Ward 4A", waste_category="Yellow", quantity=45.2, priority="High", assigned_unit="EV-Unit-01 (North Loop)", status="Collected", created_at=datetime.utcnow()),
                CollectionRequest(waste_id=2, location="Surgical OT 2", waste_category="White", quantity=12.8, priority="Critical", assigned_unit="EV-Unit-03 (Express EV)", status="Assigned", created_at=datetime.utcnow()),
                CollectionRequest(waste_id=3, location="Emergency ER", waste_category="Red", quantity=88.0, priority="Medium", assigned_unit=None, status="Pending", created_at=datetime.utcnow()),
            ]
            db.add_all(initial_reqs)
            db.commit()

        # 4. Seed Tracking Events for MW-2026-9081
        if db.query(TrackingEvent).count() == 0:
            t_events = [
                TrackingEvent(tracking_id="MW-2026-9081", event_type="Waste Generated", location="ICU Ward 4A", timestamp=datetime.utcnow(), description="Initial medical waste generated during surgery"),
                TrackingEvent(tracking_id="MW-2026-9081", event_type="AI Classified", location="ICU Ward 4A Scanner", timestamp=datetime.utcnow(), description="AI Vision classified waste as Yellow Biohazard (94% confidence)"),
                TrackingEvent(tracking_id="MW-2026-9081", event_type="Segregated", location="ICU Ward 4A Bin 01", timestamp=datetime.utcnow(), description="Sealed in Yellow Non-Chlorinated Bag"),
                TrackingEvent(tracking_id="MW-2026-9081", event_type="Collection Requested", location="ICU Ward 4A", timestamp=datetime.utcnow(), description="Emergency collection dispatch #REQ-101 created"),
                TrackingEvent(tracking_id="MW-2026-9081", event_type="Collection Assigned", location="ICU Ward 4A", timestamp=datetime.utcnow(), description="Assigned to EV-Unit-01 (North Loop)"),
                TrackingEvent(tracking_id="MW-2026-9081", event_type="Collected", location="ICU Ward 4A", timestamp=datetime.utcnow(), description="Picked up by EV Van 01"),
            ]
            db.add_all(t_events)
            db.commit()

        # 5. Seed Alerts
        if db.query(Alert).count() == 0:
            initial_alerts = [
                Alert(alert_type="Mis-Segregation", severity="High", message="Plastic item detected in Yellow Infectious bin via AI Scanner", location="Surgical OT 2", status="Active", timestamp=datetime.utcnow()),
                Alert(alert_type="Container Capacity", severity="Critical", message="EV-Unit-02 waste container is 80% full. Route to CBWTF required.", location="Central Corridor", status="Active", timestamp=datetime.utcnow()),
                Alert(alert_type="Delayed Collection", severity="Medium", message="Pending pickup at Emergency ER past 4-hour window", location="Emergency ER", status="Active", timestamp=datetime.utcnow()),
            ]
            db.add_all(initial_alerts)
            db.commit()
    finally:
        db.close()

# Run seed on startup
seed_demo_data()

app = FastAPI(
    title="MedWaste AI Backend API Engine",
    description="Smart Mobile Medical-Waste Collection and Segregation System (SIH26115)",
    version="1.3.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All API Routers
app.include_router(health.router)
app.include_router(classification.router)
app.include_router(waste.router)
app.include_router(collections.router)
app.include_router(units.router)
app.include_router(tracking.router)
app.include_router(alerts.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {
        "message": "MedWaste AI Backend Core Service Running",
        "docs": "/docs",
        "endpoints": {
            "health": "/api/health",
            "waste": "/api/waste",
            "classify": "/api/waste/classify",
            "collections": "/api/collections",
            "units": "/api/units",
            "tracking": "/api/tracking/{tracking_id}",
            "alerts": "/api/alerts",
            "analytics": "/api/analytics"
        }
    }
