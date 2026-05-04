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
import { InterpreterPanel } from './features/state/InterpreterPanel';
import { CgramEditorPanel } from './features/state/CgramEditorPanel';
import { LogPanel } from './features/logs/LogPanel';
import { AIContainer } from './features/ai/AIContainer';

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <AppShell />
      </StoreProvider>
    </ThemeProvider>
  );
}

function AppShell() {
  const [isLogExpanded, setIsLogExpanded] = React.useState(false);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--app-bg)',
      color: 'var(--app-text)',
      fontFamily: '"Outfit", sans-serif',
      overflow: 'hidden',
    }}>
      <Navbar />
      
      <main style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '320px 1fr 260px',
        gridTemplateRows: '1fr auto',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        {/* LEFT: LIVE INTERPRETER & AI CHAT */}
        <aside style={{ 
          borderRight: '1px solid var(--app-border)', 
          background: 'var(--app-surface)',
          padding: '16px',
          overflowY: 'hidden', // Parent is hidden, children scroll
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}>
          <InterpreterPanel />
        </aside>

        {/* CENTER: PRIMARY FLOW (LCD -> BUS -> INPUT) */}
        <section style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '20px',
          gap: 24,
          background: 'var(--app-bg)',
          overflowY: 'auto',
          position: 'relative'
        }}>
          <DisplayPanel />
        </section>

        {/* RIGHT: Quick Controls */}
        <aside style={{ 
          borderLeft: '1px solid var(--app-border)', 
          background: 'var(--app-surface)',
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 32
        }}>
          <ControlPanel />
          <CgramEditorPanel />
        </aside>

        {/* BOTTOM: Collapsible Log Panel */}
        <div style={{ 
          gridColumn: '1 / -1',
          borderTop: '1px solid var(--app-border)',
          background: 'var(--app-surface)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: isLogExpanded ? '280px' : '36px',
          transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {/* Collapse Toggle */}
          <button 
            onClick={() => setIsLogExpanded(!isLogExpanded)}
            style={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--app-border)',
              border: 'none',
              borderRadius: '12px',
              color: 'var(--app-text)',
              fontSize: '10px',
              fontWeight: 'bold',
              padding: '2px 12px',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
            }}
          >
            {isLogExpanded ? '▼ HIDE LOGS' : '▲ SHOW LOGS'}
          </button>
          
          <div style={{ flex: 1, overflow: 'hidden', display: isLogExpanded ? 'block' : 'none' }}>
            <LogPanel />
          </div>
          {!isLogExpanded && (
            <div style={{ 
              height: '36px', 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0 16px',
              fontSize: '11px',
              color: 'var(--app-muted)',
              fontWeight: 'bold',
              letterSpacing: '0.05em'
            }}>
              SYSTEM LOGS (COLLAPSED)
            </div>
          )}
        </div>
      </main>

      {/* FLOATING AI ASSISTANT OVERLAY */}
      <AIContainer />
    </div>
  );
}
