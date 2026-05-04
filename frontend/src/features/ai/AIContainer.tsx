import React, { useState } from 'react';
import { AILoginScreen } from './AILoginScreen';
import { AIChatbot } from './AIChatbot';

import { api } from '../../services/index';

import { useTheme } from '../../app/ThemeProvider';

export function AIContainer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Delay reconnect slightly to ensure the browser commits the Set-Cookie
    // header to its jar before the new WebSocket upgrade request fires.
    setTimeout(() => {
      api.disconnect();
      setTimeout(() => api.connect(), 100);
    }, 200);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      fontFamily: theme.core.bodyFont
    }}>
      {/* EXPANDED CONVERSATIONAL SURFACE */}
      <div style={{
        marginBottom: 16,
        width: 380,
        height: isOpen ? 520 : 0,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        background: `${theme.core.surface}B3`, // Hex + Alpha for translucency
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 20,
        border: `1px solid ${theme.panel.border}80`,
        boxShadow: `0 12px 48px rgba(0,0,0,0.4), inset 0 1px 0 ${theme.core.primary}20`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transformOrigin: 'bottom right',
        transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)'
      }}>
        {isOpen && (
          !isAuthenticated ? (
            <AILoginScreen onLoginSuccess={handleLoginSuccess} />
          ) : (
            <AIChatbot />
          )
        )}
      </div>

      {/* FLOATING TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          background: isOpen ? theme.core.surface : theme.core.primary,
          color: isOpen ? theme.core.primary : theme.core.background,
          border: `1px solid ${isOpen ? theme.core.primary : 'transparent'}`,
          boxShadow: `0 4px 20px ${theme.core.primary}66`,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {/* Simple elegant SVG icon */}
        <svg 
          width="24" height="24" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: 'transform 0.3s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0)' }}
        >
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </>
          ) : (
            <>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="10" r="1" fill="currentColor"></circle>
              <circle cx="8" cy="10" r="1" fill="currentColor"></circle>
              <circle cx="16" cy="10" r="1" fill="currentColor"></circle>
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
