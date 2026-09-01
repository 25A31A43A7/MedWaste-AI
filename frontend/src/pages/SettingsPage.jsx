import React from 'react';
import { Settings, Save, Shield, Bell, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>System & Facility Settings</h1>
          <p>MedWaste AI Infrastructure Configuration & CPCB Threshold Rules</p>
        </div>
        <button className="btn btn-primary">
          <Save size={16} /> Save Configuration
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <div className="card-title">Hospital / Facility Profile</div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label>Medical Institution Name</label>
              <input type="text" className="form-input" defaultValue="AIIMS Super Specialty Hospital" style={{ paddingLeft: '12px' }} />
            </div>
            <div className="form-group">
              <label>Pollution Control Board License No.</label>
              <input type="text" className="form-input" defaultValue="CPCB/BMW/2026/DEL-0091" style={{ paddingLeft: '12px' }} />
            </div>
            <div className="form-group">
              <label>Chief Waste Management Officer</label>
              <input type="text" className="form-input" defaultValue="Dr. Rajeshwari Swaminathan" style={{ paddingLeft: '12px' }} />
            </div>
            <div className="form-group">
              <label>Contact Email for Biohazard Dispatch</label>
              <input type="email" className="form-input" defaultValue="biohazard@aiims.edu.in" style={{ paddingLeft: '12px' }} />
            </div>
          </form>
        </div>

        <div className="card">
          <div className="card-title">AI & Sensor Thresholds</div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label>Ultrasonic Bin Capacity Warning Threshold (%)</label>
              <input type="number" className="form-input" defaultValue="85" style={{ paddingLeft: '12px' }} />
            </div>
            <div className="form-group">
              <label>Minimum AI Vision Confidence Score (%)</label>
              <input type="number" className="form-input" defaultValue="90" style={{ paddingLeft: '12px' }} />
            </div>
            <div className="form-group">
              <label>Maximum Statutory Storage Time (Hours)</label>
              <input type="number" className="form-input" defaultValue="48" style={{ paddingLeft: '12px' }} />
            </div>
            <div className="form-group">
              <label>FastAPI Backend Endpoint</label>
              <input type="text" className="form-input" defaultValue="http://localhost:8000/api" style={{ paddingLeft: '12px' }} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
