/**
 * App.tsx — Root composition.
 * Providers → Layout → Features.
 */
import React from 'react';
import { ThemeProvider } from './app/ThemeProvider';
import { StoreProvider } from './store/store';
import { Navbar } from './components/layout/Navbar';
import { DisplayPanel } from './features/display/DisplayPanel';
import { ControlPanel } from './features/controls/ControlPanel';
import { UnifiedInputPanel } from './features/controls/UnifiedInputPanel';
import { GpioPanel } from './features/controls/GpioPanel';
import { LogPanel } from './features/logs/LogPanel';

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <AppShell />
      </StoreProvider>
    </ThemeProvider>
  );
}

import { InterpreterPanel } from './features/state/InterpreterPanel';

function AppShell() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--app-bg)',
      color: 'var(--app-text)',
      fontFamily: 'var(--app-font)',
      overflow: 'hidden',
    }}>
      <Navbar />
      
      <main style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '320px 1fr 320px',
        gridTemplateRows: '1fr auto',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        {/* LEFT: LIVE INTERPRETER */}
        <div style={{ 
          borderRight: '1px solid var(--app-border)', 
          background: 'var(--app-surface)',
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 32
        }}>
          <InterpreterPanel />
          <GpioPanel />
        </div>

        {/* CENTER: PRIMARY FLOW (LCD -> BUS -> INPUT) */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px',
          gap: 40,
          background: 'var(--app-bg)',
          overflowY: 'auto'
        }}>
          <DisplayPanel />
          <div style={{ width: '100%', maxWidth: 600 }}>
             <UnifiedInputPanel />
          </div>
        </div>

        {/* RIGHT: Quick Controls */}
        <div style={{ 
          borderLeft: '1px solid var(--app-border)', 
          background: 'var(--app-surface)',
          padding: '24px',
          overflowY: 'auto'
        }}>
          <ControlPanel />
        </div>

        {/* BOTTOM: Global Audit Logs */}
        <div style={{ 
          gridColumn: '1 / -1',
          borderTop: '1px solid var(--app-border)',
          height: '220px',
          background: 'var(--app-surface)'
        }}>
          <LogPanel />
        </div>
      </main>
    </div>
  );
}
