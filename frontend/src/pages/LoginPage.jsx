import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin@medwaste.ai' && password === 'admin123') {
      onLogin({ email, name: 'Hospital Administrator', role: 'Super Admin' });
      navigate('/dashboard');
    } else {
      setError('Invalid credentials! Use demo login: admin@medwaste.ai / admin123');
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@medwaste.ai');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-icon-box">
            <Activity size={32} />
          </div>
          <h2>MedWaste AI</h2>
          <p>Smart Medical-Waste Collection & Segregation System</p>
        </div>

        <div className="demo-credentials-box">
          <strong>Demo Login Credentials:</strong>
          <div style={{ marginTop: '4px' }}>Email: <code>admin@medwaste.ai</code></div>
          <div>Password: <code>admin123</code></div>
          <button 
            type="button" 
            onClick={handleDemoFill}
            style={{
              marginTop: '8px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#047857',
              backgroundColor: '#a7f3d0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Auto-Fill Demo Credentials
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldAlert size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Hospital Admin Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="admin@medwaste.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px', padding: '12px' }}>
            <span>Sign In to MedWaste Portal</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.78rem', color: '#94a3b8' }}>
          SIH 2026 Prototype — Problem Statement ID: SIH26115
        </div>
      </div>
    </div>
  );
}
