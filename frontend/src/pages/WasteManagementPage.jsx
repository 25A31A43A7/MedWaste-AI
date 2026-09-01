import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Filter, 
  RefreshCw, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { 
  fetchWasteRecords, 
  createWasteRecord, 
  updateWasteRecord, 
  deleteWasteRecord 
} from '../services/api';

export default function WasteManagementPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    waste_type: '',
    category: 'Yellow',
    quantity: '',
    location: '',
    status: 'Pending'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchWasteRecords({
        category: categoryFilter,
        status: statusFilter,
        search: search
      });
      setRecords(data);
    } catch (err) {
      console.error('Failed to load waste records from backend', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter, statusFilter, search]);

  const handleOpenAddModal = () => {
    setFormData({
      waste_type: '',
      category: 'Yellow',
      quantity: '10.0',
      location: 'General Ward',
      status: 'Pending'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setEditingRecord(record);
    setFormData({
      waste_type: record.waste_type,
      category: record.category,
      quantity: record.quantity.toString(),
      location: record.location,
      status: record.status
    });
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createWasteRecord({
        ...formData,
        quantity: parseFloat(formData.quantity) || 0
      });
      setIsAddModalOpen(false);
      loadData();
    } catch (err) {
      alert('Error creating waste record');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingRecord) return;
    try {
      await updateWasteRecord(editingRecord.id, {
        ...formData,
        quantity: parseFloat(formData.quantity) || 0
      });
      setIsEditModalOpen(false);
      setEditingRecord(null);
      loadData();
    } catch (err) {
      alert('Error updating waste record');
    }
  };

  const handleDelete = async (id, tracking_id) => {
    if (window.confirm(`Are you sure you want to delete waste record ${tracking_id}?`)) {
      try {
        await deleteWasteRecord(id);
        loadData();
      } catch (err) {
        alert('Error deleting waste record');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Bio-Medical Waste Management</h1>
          <p>SQLite Database Registry — CPCB Segregation Bins & Storage Inventory</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={loadData}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <Plus size={16} /> Add Waste Record
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="header-search" style={{ flex: 1, minWidth: '240px', width: 'auto' }}>
            <Search size={18} style={{ color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search by Tracking ID, Waste Type, or Location..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Category:</span>
            <select 
              className="form-input" 
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Yellow">Yellow (Infectious)</option>
              <option value="Red">Red (Plastics)</option>
              <option value="White">White (Sharps)</option>
              <option value="Blue">Blue (Glassware)</option>
            </select>

            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Status:</span>
            <select 
              className="form-input" 
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Segregated">Segregated</option>
              <option value="Collected">Collected</option>
              <option value="Disposed">Disposed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Waste Records Table */}
      <div className="card">
        <div className="card-title">
          <span>Waste Record Database</span>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 'normal' }}>
            Showing {records.length} records
          </span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Waste Type</th>
                <th>Category</th>
                <th>Quantity (Kg)</th>
                <th>Hospital Location</th>
                <th>Status</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    Loading records from SQLite backend...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No waste records match your search criteria.
                  </td>
                </tr>
              ) : (
                records.map((row) => (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0f766e' }}>
                      {row.tracking_id}
                    </td>
                    <td style={{ fontWeight: 600 }}>{row.waste_type}</td>
                    <td><StatusBadge status={row.category} /></td>
                    <td style={{ fontWeight: 700 }}>{row.quantity} Kg</td>
                    <td>{row.location}</td>
                    <td><StatusBadge status={row.status} /></td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {row.created_at ? new Date(row.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => handleOpenEditModal(row)}
                          title="Edit Record"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#ef4444', borderColor: '#fca5a5' }}
                          onClick={() => handleDelete(row.id, row.tracking_id)}
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Waste Record */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', background: '#fff' }}>
            <div className="card-title">
              <span>Add New Medical Waste Record</span>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              <div className="form-group">
                <label>Waste Description / Type</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '12px' }}
                  required
                  placeholder="e.g. Soiled Cotton Gauze, Used Syringes" 
                  value={formData.waste_type}
                  onChange={(e) => setFormData({ ...formData, waste_type: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>CPCB Category</label>
                  <select 
                    className="form-input" 
                    style={{ paddingLeft: '12px' }}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Yellow">Yellow (Infectious)</option>
                    <option value="Red">Red (Plastics)</option>
                    <option value="White">White (Sharps)</option>
                    <option value="Blue">Blue (Glassware)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantity (Kg)</label>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Hospital Location / Ward</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '12px' }}
                    required
                    placeholder="e.g. ICU Ward 4A" 
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Initial Status</label>
                  <select 
                    className="form-input" 
                    style={{ paddingLeft: '12px' }}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Segregated">Segregated</option>
                    <option value="Collected">Collected</option>
                    <option value="Disposed">Disposed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Waste Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Waste Record */}
      {isEditModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', background: '#fff' }}>
            <div className="card-title">
              <span>Edit Record {editingRecord?.tracking_id}</span>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              <div className="form-group">
                <label>Waste Description / Type</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '12px' }}
                  required
                  value={formData.waste_type}
                  onChange={(e) => setFormData({ ...formData, waste_type: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>CPCB Category</label>
                  <select 
                    className="form-input" 
                    style={{ paddingLeft: '12px' }}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Yellow">Yellow (Infectious)</option>
                    <option value="Red">Red (Plastics)</option>
                    <option value="White">White (Sharps)</option>
                    <option value="Blue">Blue (Glassware)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantity (Kg)</label>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Hospital Location / Ward</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '12px' }}
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select 
                    className="form-input" 
                    style={{ paddingLeft: '12px' }}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Segregated">Segregated</option>
                    <option value="Collected">Collected</option>
                    <option value="Disposed">Disposed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
