import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Truck, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { 
  fetchCollectionRequests, 
  createCollectionRequest, 
  updateCollectionRequest, 
  fetchWasteRecords,
  fetchCollectionUnits 
} from '../services/api';

export default function CollectionRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [wasteOptions, setWasteOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    waste_id: '',
    location: '',
    waste_category: 'Yellow',
    quantity: '10.0',
    priority: 'Medium'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCollectionRequests({
        status: statusFilter,
        priority: priorityFilter,
        search: search
      });
      setRequests(data);

      const wastes = await fetchWasteRecords();
      setWasteOptions(wastes);

      const units = await fetchCollectionUnits();
      setUnitOptions(units);
    } catch (err) {
      console.error('Failed to load collection requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, priorityFilter, search]);

  const handleSelectWaste = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      const w = wasteOptions.find(item => item.id === parseInt(selectedId));
      if (w) {
        setFormData({
          waste_id: w.id.toString(),
          location: w.location,
          waste_category: w.category,
          quantity: w.quantity.toString(),
          priority: 'High'
        });
        return;
      }
    }
    setFormData({ ...formData, waste_id: '' });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCollectionRequest({
        waste_id: formData.waste_id ? parseInt(formData.waste_id) : null,
        location: formData.location,
        waste_category: formData.waste_category,
        quantity: parseFloat(formData.quantity) || 1.0,
        priority: formData.priority
      });
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert('Failed to create collection request');
    }
  };

  const handleAssignUnit = async (reqId, unitName) => {
    try {
      await updateCollectionRequest(reqId, {
        assigned_unit: unitName,
        status: 'Assigned'
      });
      loadData();
    } catch (err) {
      alert('Failed to assign unit');
    }
  };

  const handleStatusChange = async (reqId, newStatus) => {
    try {
      await updateCollectionRequest(reqId, {
        status: newStatus
      });
      loadData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Medical Waste Collection Requests</h1>
          <p>Ward Pickup Requests, Dispatch Queue & Mobile Unit Coordination</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={loadData}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Create Collection Request
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="header-search" style={{ flex: 1, minWidth: '240px', width: 'auto' }}>
            <Search size={18} style={{ color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search request location, assigned unit, category..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Status:</span>
            <select 
              className="form-input" 
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Transit">In Transit</option>
              <option value="Collecting">Collecting</option>
              <option value="Collected">Collected</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Priority:</span>
            <select 
              className="form-input" 
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Requests */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          Loading collection requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          No collection requests found matching your filters.
        </div>
      ) : (
        <div className="grid-cards">
          {requests.map((req) => (
            <div className="card" key={req.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem', color: '#0f766e' }}>
                    REQ-#{req.id}
                  </span>
                  <StatusBadge status={req.priority} />
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  {req.location}
                </h3>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Waste Category:</span>
                    <StatusBadge status={req.waste_category} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Est. Quantity:</span>
                    <strong style={{ color: '#0f172a' }}>{req.quantity} Kg</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Current Status:</span>
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              </div>

              <div>
                {/* Unit Assignment Selector */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Assigned Collection Unit:
                  </label>
                  <select
                    className="form-input"
                    style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                    value={req.assigned_unit || ''}
                    onChange={(e) => handleAssignUnit(req.id, e.target.value)}
                  >
                    <option value="">-- Assign Mobile EV Unit --</option>
                    {unitOptions.map((u) => (
                      <option key={u.id} value={u.unit_name}>
                        {u.unit_name} ({u.status})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Change Dropdown */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    className="form-input"
                    style={{ padding: '4px 8px', fontSize: '0.8rem', flex: 1 }}
                    value={req.status}
                    onChange={(e) => handleStatusChange(req.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Collecting">Collecting</option>
                    <option value="Collected">Collected</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {req.status !== 'Completed' && (
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '0.78rem', backgroundColor: '#10b981' }}
                      onClick={() => handleStatusChange(req.id, 'Completed')}
                      title="Mark Completed"
                    >
                      <CheckCircle2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Collection Request */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', background: '#fff' }}>
            <div className="card-title">
              <span>Create Waste Collection Request</span>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.82rem' }}>Select Existing Waste Record (Optional)</label>
                <select 
                  className="form-input" 
                  style={{ paddingLeft: '12px' }}
                  onChange={handleSelectWaste}
                >
                  <option value="">-- Create Custom Request / Select Record --</option>
                  {wasteOptions.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.tracking_id} - {w.waste_type} ({w.location}, {w.quantity}kg)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.82rem' }}>Pickup Ward / Location</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '12px' }}
                  required
                  placeholder="e.g. ICU Ward 4A, Emergency Room"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.82rem' }}>Waste Category</label>
                  <select 
                    className="form-input" 
                    style={{ paddingLeft: '12px' }}
                    value={formData.waste_category}
                    onChange={(e) => setFormData({ ...formData, waste_category: e.target.value })}
                  >
                    <option value="Yellow">Yellow (Infectious)</option>
                    <option value="Red">Red (Plastics)</option>
                    <option value="White">White (Sharps)</option>
                    <option value="Blue">Blue (Glassware)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.82rem' }}>Est. Quantity (Kg)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="form-input" 
                    style={{ paddingLeft: '12px' }}
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.82rem' }}>Priority Level</label>
                <select 
                  className="form-input" 
                  style={{ paddingLeft: '12px' }}
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Critical">Critical Priority</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Dispatch Collection Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
