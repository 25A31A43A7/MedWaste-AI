import React, { useEffect, useState } from 'react';
import { Search, Bell, ShieldCheck, WifiOff } from 'lucide-react';
import { checkBackendHealth } from '../services/api';

export default function Header({ user }) {
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    async function verifyHealth() {
      const res = await checkBackendHealth();
      if (res.status === 'healthy') {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    }
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="top-header">
      <div className="header-search">
        <Search size={18} className="search-icon" style={{ color: '#94a3b8' }} />
        <input type="text" placeholder="Search bin IDs, collection units, wards..." />
      </div>

      <div className="header-actions">
        {backendStatus === 'online' ? (
          <div className="health-status-badge" title="FastAPI Backend Connected">
            <span className="health-dot"></span>
            <span>API Online</span>
          </div>
        ) : (
          <div className="health-status-badge" style={{ backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5' }} title="FastAPI Backend Offline">
            <WifiOff size={14} />
            <span>API Offline</span>
          </div>
        )}

        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color="#64748b" />
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '8px',
            height: '8px',
            backgroundColor: '#ef4444',
            borderRadius: '50%'
          }}></span>
        </div>

        <div className="user-profile">
          <div className="avatar">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{user?.name || 'Hospital Admin'}</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.email || 'admin@medwaste.ai'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
