import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Search, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertCircle,
  Truck,
  Plus
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import StatusBadge from '../components/StatusBadge';
import { fetchTrackingTimeline, fetchWasteRecords, createTrackingEvent } from '../services/api';

export default function WasteTrackingPage() {
  const [searchId, setSearchId] = useState('MW-2026-9081');
  const [trackingData, setTrackingData] = useState(null);
  const [wasteList, setWasteList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add custom event state
  const [newEvent, setNewEvent] = useState({
    event_type: 'Transported',
    location: 'Central Corridor',
    description: 'Waste batch scanned during transit'
  });

  const loadInitialWastes = async () => {
    try {
      const data = await fetchWasteRecords();
      setWasteList(data);
      if (data.length > 0) {
        handleSearch(data[0].tracking_id);
      } else {
        handleSearch('MW-2026-9081');
      }
    } catch (err) {
      handleSearch('MW-2026-9081');
    }
  };

  useEffect(() => {
    loadInitialWastes();
  }, []);

  const handleSearch = async (idToSearch) => {
    const targetId = idToSearch || searchId;
    if (!targetId) return;

    setLoading(true);
    setError('');
    try {
      const data = await fetchTrackingTimeline(targetId);
      setTrackingData(data);
    } catch (err) {
      setError(`No tracking records found for tracking ID: ${targetId}`);
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomEvent = async (e) => {
    e.preventDefault();
    if (!trackingData) return;
    try {
      await createTrackingEvent({
        tracking_id: trackingData.tracking_id,
        event_type: newEvent.event_type,
        location: newEvent.location,
        description: newEvent.description
      });
      handleSearch(trackingData.tracking_id);
    } catch (err) {
      alert('Failed to log tracking event');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>End-to-End Waste Chain-of-Custody Tracking</h1>
          <p>QR Code Barcode Traceability & Audit Trail Timeline</p>
        </div>
      </div>

      {/* Search & Selector Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">Search Waste Batch by Tracking ID</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="header-search" style={{ flex: 1, minWidth: '260px', width: 'auto' }}>
            <Search size={18} style={{ color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Enter Tracking ID e.g. MW-2026-9081" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>

          {wasteList.length > 0 && (
            <select 
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '0.88rem', maxWidth: '240px' }}
              onChange={(e) => {
                setSearchId(e.target.value);
                handleSearch(e.target.value);
              }}
            >
              <option value="">-- Quick Pick Record --</option>
              {wasteList.map((w) => (
                <option key={w.id} value={w.tracking_id}>
                  {w.tracking_id} ({w.category})
                </option>
              ))}
            </select>
          )}

          <button className="btn btn-primary" onClick={() => handleSearch(searchId)}>
            <QrCode size={16} /> Track Batch Timeline
          </button>
        </div>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          Fetching chain-of-custody timeline...
        </div>
      )}

      {error && (
        <div className="card" style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '20px', textAlign: 'center' }}>
          <AlertCircle size={24} style={{ marginBottom: '8px' }} />
          <p>{error}</p>
        </div>
      )}

      {trackingData && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* Left Column: Waste Batch Info & QR Code */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="card-title" style={{ justifyContent: 'center' }}>
                Batch Tracking QR Code
              </div>

              <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', display: 'inline-block', border: '1px solid #e2e8f0', margin: '8px 0 16px 0' }}>
                <QRCodeSVG 
                  value={trackingData.tracking_id} 
                  size={160}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.2rem', color: '#0f766e' }}>
                {trackingData.tracking_id}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Scannable CPCB Biohazard Tag</p>
            </div>

            <div className="card">
              <div className="card-title">Waste Batch Details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>CPCB Category:</span>
                  <StatusBadge status={trackingData.category} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Weight Quantity:</span>
                  <strong>{trackingData.quantity} Kg</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Current Status:</span>
                  <StatusBadge status={trackingData.current_status} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Current Location:</span>
                  <strong>{trackingData.current_location}</strong>
                </div>
              </div>
            </div>

            {/* Quick Add Tracking Event */}
            <div className="card">
              <div className="card-title" style={{ fontSize: '0.95rem' }}>Log Manual Tracking Scan</div>
              <form onSubmit={handleAddCustomEvent} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <select
                  className="form-input"
                  style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                  value={newEvent.event_type}
                  onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
                >
                  <option value="Segregated">Segregated</option>
                  <option value="Collection Requested">Collection Requested</option>
                  <option value="Collection Assigned">Collection Assigned</option>
                  <option value="Collected">Collected</option>
                  <option value="Transported">Transported</option>
                  <option value="Received">Received</option>
                  <option value="Processed/Disposed">Processed/Disposed</option>
                </select>

                <input 
                  type="text" 
                  className="form-input" 
                  style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                  placeholder="Scan Location e.g. Dock 2"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />

                <button type="submit" className="btn btn-primary" style={{ padding: '8px', justifyContent: 'center', fontSize: '0.8rem' }}>
                  <Plus size={14} /> Add Tracking Log Event
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Step-by-Step Vertical Timeline */}
          <div className="card">
            <div className="card-title">
              <span>Custody Event History Timeline</span>
              <span className="badge badge-info">{trackingData.events.length} Events Logged</span>
            </div>

            <div style={{ position: 'relative', paddingLeft: '24px', marginTop: '16px' }}>
              {/* Timeline vertical bar */}
              <div style={{
                position: 'absolute', top: '10px', bottom: '10px', left: '7px',
                width: '3px', backgroundColor: '#e2e8f0', borderRadius: '2px'
              }}></div>

              {trackingData.events.map((event, idx) => (
                <div key={event.id || idx} style={{ position: 'relative', marginBottom: '24px' }}>
                  {/* Circle dot on line */}
                  <div style={{
                    position: 'absolute', left: '-24px', top: '2px',
                    width: '15px', height: '15px', borderRadius: '50%',
                    backgroundColor: idx === trackingData.events.length - 1 ? '#10b981' : '#0f766e',
                    border: '3px solid white', boxShadow: '0 0 0 2px #ccfbf1'
                  }}></div>

                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{event.event_type}</strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Just now'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      <MapPin size={14} color="#0f766e" /> Location: <strong>{event.location}</strong>
                    </div>

                    {event.description && (
                      <p style={{ fontSize: '0.82rem', color: '#64748b', background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
