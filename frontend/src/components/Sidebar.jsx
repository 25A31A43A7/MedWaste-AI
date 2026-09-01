import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Trash2,
  ScanLine,
  ClipboardList,
  Truck,
  QrCode,
  BarChart3,
  FileText,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  LogOut
} from 'lucide-react';

export default function Sidebar({ collapsed, setCollapsed, user, onLogout }) {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Waste Management', path: '/waste', icon: Trash2 },
    { label: 'AI Classification', path: '/classification', icon: ScanLine },
    { label: 'Collection Requests', path: '/collections', icon: ClipboardList },
    { label: 'Mobile Units', path: '/units', icon: Truck },
    { label: 'Waste Tracking', path: '/tracking', icon: QrCode },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Alerts', path: '/alerts', icon: AlertTriangle, badge: 3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Activity size={22} />
          </div>
          {!collapsed && <span>MedWaste AI</span>}
        </div>
        <button 
          className="sidebar-toggle-btn" 
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!collapsed && (
                <span style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.label}
                  {item.badge && (
                    <span style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      borderRadius: '10px', 
                      padding: '2px 7px', 
                      fontSize: '0.72rem', 
                      fontWeight: '700' 
                    }}>
                      {item.badge}
                    </span>
                  )}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button 
          onClick={onLogout}
          className="sidebar-nav-item" 
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
