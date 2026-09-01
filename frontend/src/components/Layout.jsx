import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-container">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        user={user} 
        onLogout={onLogout} 
      />
      <div className="main-wrapper">
        <Header user={user} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
