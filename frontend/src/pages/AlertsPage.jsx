import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, RefreshCw, Filter } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { fetchAlerts, resolveAlert } from '../services/api';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await fetchAlerts(statusFilter);
      setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [statusFilter]);

  const handleResolve = async (id) => {
    try {
      await resolveAlert(id);
      loadAlerts();
    } catch (err) {
      alert('Failed to resolve alert');
    }
  };

  const activeCount = alerts.filter(a => a.status === 'Active').length;
  const criticalCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length;

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Biohazard & System Alerts Center</h1>
          <p>Real-time AI Vision Anomalies, Telemetry & Delayed Pickup Risk Warnings</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Filter Status:</span>
          <select 
            className="form-input" 
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Alerts</option>
            <option value="Active">Active Alerts Only</option>
            <option value="Resolved">Resolved Alerts Only</option>
          </select>
          <button className="btn btn-outline" onClick={loadAlerts}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="grid-cards">
        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Active Alerts</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444' }}>{activeCount}</div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Requires Action</span>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Critical Severity</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b' }}>{criticalCount}</div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Immediate Attention</span>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Resolved Today</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>
            {alerts.filter(a => a.status === 'Resolved').length}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Compliance Maintained</span>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-title">
          <span>Alert Notifications Log</span>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 'normal' }}>
            Showing {alerts.length} records
          </span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Alert Type</th>
                <th>Facility Location</th>
                <th>Severity</th>
                <th>Notification Message</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    Loading alerts from backend...
                  </td>
                </tr>
              ) : alerts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    <CheckCircle2 size={24} color="#10b981" style={{ marginBottom: '8px' }} />
                    <p>No active alerts! Facility operations running normally.</p>
                  </td>
                </tr>
              ) : (
                alerts.map((alt) => (
                  <tr key={alt.id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0f766e' }}>ALT-#{alt.id}</td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{alt.alert_type}</td>
                    <td>{alt.location}</td>
                    <td><StatusBadge status={alt.severity} /></td>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>{alt.message}</td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {alt.timestamp ? new Date(alt.timestamp).toLocaleString() : 'N/A'}
                    </td>
                    <td><StatusBadge status={alt.status} /></td>
                    <td>
                      {alt.status === 'Active' ? (
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '4px 10px', fontSize: '0.75rem', backgroundColor: '#10b981' }}
                          onClick={() => handleResolve(alt.id)}
                        >
                          <CheckCircle2 size={12} /> Mark Resolved
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>Resolved</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
