import React, { useState } from 'react';
import { useTheme } from '../../app/ThemeProvider';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Props {
  onLoginSuccess: () => void;
}

export function AILoginScreen({ onLoginSuccess }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/ai/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        onLoginSuccess();
      } else {
        setError('Access denied. Invalid password.');
      }
    } catch (err) {
      setError('Connection to AI core failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      padding: '24px',
      color: theme.core.primary
    }}>
      <div style={{
        marginBottom: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{ 
          width: 48, height: 48, borderRadius: 24, 
          background: `${theme.core.primary}20`,
          color: theme.core.primary,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: 24, marginBottom: 8
        }}>
          ✨
        </div>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>LCD Assistant</h3>
        <p style={{ margin: 0, fontSize: '13px', color: theme.core.muted }}>Please authenticate to continue</p>
      </div>

      <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            border: `1px solid ${theme.panel.border}`,
            background: theme.core.background,
            color: theme.core.primary,
            fontSize: '14px',
            outline: 'none',
            fontFamily: theme.core.bodyFont,
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = theme.core.primary}
          onBlur={(e) => e.target.style.borderColor = theme.panel.border}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: theme.core.primary,
            color: theme.core.background,
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s'
          }}
        >
          {loading ? 'Verifying...' : 'Unlock'}
        </button>
      </form>
      
      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '8px',
          background: '#ff4d4f20',
          color: '#ff4d4f',
          fontSize: '13px',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
