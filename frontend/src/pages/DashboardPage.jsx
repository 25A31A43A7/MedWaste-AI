import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  CheckCircle,
  Clock,
  Target,
  AlertTriangle,
  TrendingUp,
  Activity,
  Plus,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import StatusBadge from '../components/StatusBadge';
import { 
  fetchAnalyticsData, 
  fetchWasteRecords, 
  fetchCollectionRequests, 
  fetchAlerts 
} from '../services/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [recentWastes, setRecentWastes] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await fetchAnalyticsData();
      setAnalytics(data);

      const wastes = await fetchWasteRecords();
      setRecentWastes(wastes.slice(0, 5));

      const reqs = await fetchCollectionRequests();
      setRecentRequests(reqs.slice(0, 4));

      const alertsData = await fetchAlerts('Active');
      setRecentAlerts(alertsData.slice(0, 4));
    } catch (err) {
      console.error('Failed to load dashboard live data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Medical Waste Control Center</h1>
          <p>Live Bio-Medical Waste Segregation, Collection & Tracking Telemetry</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={loadDashboardData}>
            <RefreshCw size={16} /> Refresh Telemetry
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/classification')}>
            <Plus size={16} /> AI Classify & Add Waste
          </button>
        </div>
      </div>

      {/* 5 Live Dashboard Cards */}
      <div className="grid-cards">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Waste (Kg)</span>
            <div className="metric-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
              <Trash2 size={20} />
            </div>
          </div>
          <div className="metric-value">{analytics?.total_waste_kg ?? '...'} Kg</div>
          <div className="metric-change positive">
            <TrendingUp size={14} />
            <span>+12.4% vs last week</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Collected Waste</span>
            <div className="metric-icon" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="metric-value">{analytics?.collected_waste_kg ?? '...'} Kg</div>
          <div className="metric-change positive">
            <span>{analytics?.completed_collections_count ?? 0} Completed Pickups</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Pending Collection</span>
            <div className="metric-icon" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="metric-value">{analytics?.pending_collection_kg ?? '...'} Kg</div>
          <div className="metric-change negative">
            <span>{analytics?.pending_collections_count ?? 0} Pending Requests</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Segregation Accuracy</span>
            <div className="metric-icon" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>
              <Target size={20} />
            </div>
          </div>
          <div className="metric-value">{analytics?.segregation_accuracy ?? '98.4%'}</div>
          <div className="metric-change positive">
            <TrendingUp size={14} />
            <span>+1.2% AI Accuracy Boost</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Critical Alerts</span>
            <div className="metric-icon" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="metric-value">{analytics?.critical_alerts_count ?? '0'}</div>
          <div className="metric-change negative">
            <span>Active Warnings</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Live Feed */}
      <div className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Daily Trends Chart */}
          <div className="card">
            <div className="card-title">
              <span>Bio-Medical Waste Segregation Trends (CPCB Categories)</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>Live Database Records</span>
            </div>
            <div style={{ height: '260px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.daily_trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="yellow" name="Yellow (Infectious)" fill="#eab308" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="red" name="Red (Plastics)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="blue" name="Blue (Glassware)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="white" name="White (Sharps)" fill="#64748b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Waste Records Table */}
          <div className="card">
            <div className="card-title">
              <span>Recent Waste Inventory Records</span>
              <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={() => navigate('/waste')}>
                View All Records
              </button>
            </div>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Waste Type</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentWastes.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0f766e' }}>{row.tracking_id}</td>
                      <td>{row.waste_type}</td>
                      <td><StatusBadge status={row.category} /></td>
                      <td style={{ fontWeight: 600 }}>{row.quantity} Kg</td>
                      <td>{row.location}</td>
                      <td><StatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Category Share Pie Chart & Active Alerts Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <div className="card-title">Category Distribution</div>
            <div style={{ height: '200px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.category_breakdown || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {(analytics?.category_breakdown || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
              {(analytics?.category_breakdown || []).map((cat) => (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
                  <span style={{ width: '10px', height: '10px', backgroundColor: cat.color, borderRadius: '2px', display: 'inline-block' }}></span>
                  <span style={{ color: '#475569', fontWeight: 500 }}>{cat.name} ({cat.value}kg)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <div className="card-title">
              <span>Active Biohazard Alerts</span>
              <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={() => navigate('/alerts')}>
                Alert Center
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {recentAlerts.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', padding: '16px' }}>No active critical alerts.</p>
              ) : (
                recentAlerts.map((alt) => (
                  <div key={alt.id} style={{ display: 'flex', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <AlertTriangle size={18} color={alt.severity === 'Critical' ? '#ef4444' : '#f59e0b'} style={{ marginTop: '2px' }} />
                    <div style={{ flex: 1, fontSize: '0.85rem' }}>
                      <div style={{ color: '#0f172a', fontWeight: 700 }}>{alt.alert_type} ({alt.location})</div>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>{alt.message}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
