import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Zap, 
  MapPin, 
  Navigation, 
  RefreshCw, 
  BatteryCharging, 
  CheckCircle2,
  Building,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { fetchCollectionUnits, updateCollectionUnit } from '../services/api';

export default function MobileUnitsPage() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeUnit, setActiveUnit] = useState(null);

  const loadUnits = async () => {
    setLoading(true);
    try {
      const data = await fetchCollectionUnits();
      setUnits(data);
      if (data.length > 0 && !activeUnit) {
        setActiveUnit(data[0]);
      }
    } catch (err) {
      console.error('Failed to load collection units', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

  const handleSimulateStep = async (unit) => {
    let nextStatus = unit.status;
    let nextLoc = unit.current_location;
    let nextDest = unit.destination;
    let nextCap = unit.capacity;

    if (unit.status === 'Available') {
      nextStatus = 'Assigned';
      nextLoc = 'Depot / Bay 1';
      nextDest = 'ICU Ward 4A';
    } else if (unit.status === 'Assigned') {
      nextStatus = 'En Route';
      nextLoc = 'Central Hospital Corridor';
      nextDest = 'ICU Ward 4A';
    } else if (unit.status === 'En Route') {
      nextStatus = 'Collecting';
      nextLoc = 'ICU Ward 4A';
      nextDest = 'Collection Point B';
    } else if (unit.status === 'Collecting') {
      nextStatus = 'Returning';
      nextLoc = 'In Transit to CBWTF';
      nextDest = 'Common Bio-Medical Waste Treatment Facility';
      nextCap = min(100, unit.capacity + 30);
    } else {
      nextStatus = 'Available';
      nextLoc = 'Charging Station A';
      nextDest = 'Standby';
      nextCap = 0;
    }

    try {
      const updated = await updateCollectionUnit(unit.id, {
        status: nextStatus,
        current_location: nextLoc,
        destination: nextDest,
        capacity: nextCap
      });
      loadUnits();
      if (activeUnit?.id === unit.id) {
        setActiveUnit(updated);
      }
    } catch (err) {
      alert('Error updating unit status');
    }
  };

  const calculateProgress = (status) => {
    switch (status) {
      case 'Available': return 0;
      case 'Assigned': return 25;
      case 'En Route': return 50;
      case 'Collecting': return 75;
      case 'Returning': return 90;
      case 'Maintenance': return 0;
      default: return 50;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Smart Mobile Collection Unit Telemetry</h1>
          <p style={{ color: '#0f766e', fontWeight: 600 }}>
            Software Simulation — Electric Vehicle (EV) Mobile Fleet & Route Dispatch
          </p>
        </div>
        <button className="btn btn-outline" onClick={loadUnits}>
          <RefreshCw size={16} /> Refresh Fleet Status
        </button>
      </div>

      {/* Grid of Mobile EV Units */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          Loading fleet telemetry...
        </div>
      ) : (
        <div className="grid-cards" style={{ marginBottom: '24px' }}>
          {units.map((unit) => (
            <div 
              key={unit.id}
              className="card"
              style={{
                cursor: 'pointer',
                borderColor: activeUnit?.id === unit.id ? '#0f766e' : '#e2e8f0',
                borderWidth: activeUnit?.id === unit.id ? '2px' : '1px',
                boxShadow: activeUnit?.id === unit.id ? '0 4px 12px rgba(15,118,110,0.15)' : 'none'
              }}
              onClick={() => setActiveUnit(unit)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ backgroundColor: '#ccfbf1', color: '#0f766e', padding: '10px', borderRadius: '10px' }}>
                    <Truck size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{unit.unit_name}</h3>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>ID: UNIT-#{unit.id}</span>
                  </div>
                </div>
                <StatusBadge status={unit.status} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                      <Zap size={14} color="#10b981" /> Battery Level
                    </span>
                    <strong>{unit.battery}%</strong>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#e2e8f0', height: '6px', borderRadius: '3px' }}>
                    <div style={{ width: `${unit.battery}%`, backgroundColor: '#10b981', height: '100%', borderRadius: '3px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Waste Container Fill</span>
                    <strong style={{ color: unit.capacity > 75 ? '#ef4444' : '#0f172a' }}>{unit.capacity}% Full</strong>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#e2e8f0', height: '6px', borderRadius: '3px' }}>
                    <div style={{
                      width: `${unit.capacity}%`,
                      backgroundColor: unit.capacity > 75 ? '#ef4444' : '#0284c7',
                      height: '100%',
                      borderRadius: '3px'
                    }}></div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem' }}>
                  <div><strong>Location:</strong> {unit.current_location}</div>
                  <div><strong>Destination:</strong> {unit.destination}</div>
                  <div><strong>Active Task:</strong> {unit.current_task}</div>
                </div>
              </div>

              <button 
                className="btn btn-outline" 
                style={{ width: '100%', marginTop: '14px', justifyContent: 'center', fontSize: '0.78rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSimulateStep(unit);
                }}
              >
                Simulate Next Movement Phase
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Simulated Route Visualization Component (Pure HTML/CSS Map) */}
      {activeUnit && (
        <div className="card">
          <div className="card-title">
            <span>Route Simulation — {activeUnit.unit_name}</span>
            <span className="badge badge-success">Telemetry Stream Live</span>
          </div>

          {/* Pure HTML/CSS Simulated Map View */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '30px',
            borderRadius: '12px',
            color: 'white',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              {/* Node 1: Hospital Ward */}
              <div style={{ textAlign: 'center', flex: 1, minWidth: '140px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                  <Building size={24} />
                </div>
                <strong style={{ fontSize: '0.9rem', display: 'block' }}>Hospital Wards</strong>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Waste Generation Point</span>
              </div>

              <div style={{ color: '#0d9488' }}>
                <ArrowRight size={24} />
              </div>

              {/* Node 2: Collection Point */}
              <div style={{ textAlign: 'center', flex: 1, minWidth: '140px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#0f766e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                  <Truck size={24} />
                </div>
                <strong style={{ fontSize: '0.9rem', display: 'block' }}>Mobile Collection Point</strong>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{activeUnit.current_location}</span>
              </div>

              <div style={{ color: '#0d9488' }}>
                <ArrowRight size={24} />
              </div>

              {/* Node 3: Processing Facility */}
              <div style={{ textAlign: 'center', flex: 1, minWidth: '140px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                  <ShieldCheck size={24} />
                </div>
                <strong style={{ fontSize: '0.9rem', display: 'block' }}>Treatment Plant (CBWTF)</strong>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Final Disposal & Autoclave</span>
              </div>
            </div>

            {/* Simulated Live Route Progress Bar */}
            <div style={{ marginTop: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Route Progress ({activeUnit.status})</span>
                <strong style={{ color: '#10b981' }}>{calculateProgress(activeUnit.status)}% Completed</strong>
              </div>
              <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{
                  width: `${calculateProgress(activeUnit.status)}%`,
                  backgroundColor: '#10b981',
                  height: '100%',
                  borderRadius: '5px',
                  transition: 'width 0.5s ease-in-out'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
