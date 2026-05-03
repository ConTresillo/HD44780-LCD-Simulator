/**
 * DisplayPanel.tsx — The central LCD view panel.
 * Shows the pixel LCD + hardware state badges.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { LcdDisplay } from '../../components/lcd/LcdDisplay';
import { DataPin, PulseButton } from '../../components/controls';
import { useLCD } from '../../hooks/useLCD';

export const DisplayPanel: React.FC = () => {
  const { theme } = useTheme();
  const { hardware, view, busState, setBusState, pulseEN } = useLCD();
  const [lastLatched, setLastLatched] = React.useState<string | null>(null);

  if (!view) return <div style={{ color: theme.core.muted }}>Connecting…</div>;

  const { data, rs, rw } = busState;

  const handlePulse = () => {
    pulseEN(data, rs, rw);
    setLastLatched(`0x${data.toString(16).toUpperCase()} → ${rs ? 'DDRAM' : 'CMD'}[0x${hardware?.addressPointer.toString(16).toUpperCase() || '??'}]`);
    setTimeout(() => setLastLatched(null), 2000);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      width: '100%',
    }}>
      {/* MODE BADGE */}
      <div style={{
        background: rs ? 'rgba(52, 199, 89, 0.15)' : 'rgba(0, 122, 255, 0.15)',
        color: rs ? '#34c759' : '#007aff',
        padding: '4px 12px',
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: theme.core.headingFont,
        letterSpacing: '0.05em',
        border: `1px solid ${rs ? 'rgba(52, 199, 89, 0.3)' : 'rgba(0, 122, 255, 0.3)'}`
      }}>
        MODE: {rs ? 'DATA (RS=1)' : 'COMMAND (RS=0)'}
      </div>

      {/* 1. LCD DISPLAY */}
      <LcdDisplay
        view={view}
        blinkOn={hardware?.blinkOn ?? false}
        hardware={hardware || undefined}
      />

      {/* 2. BUS & EXECUTION FLOW */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          background: theme.panel.background,
          border: `1px solid ${theme.panel.border}`,
          padding: '12px 24px',
          borderRadius: 16,
        }}>
          {/* Compact 8-bit Bus */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[7, 6, 5, 4, 3, 2, 1, 0].map(bit => (
              <DataPin 
                key={bit}
                label={`D${bit}`} 
                active={((data >> bit) & 1) === 1} 
                onClick={() => setBusState({ data: data ^ (1 << bit) })} 
              />
            ))}
          </div>

          <div style={{ width: 2, height: 30, background: theme.panel.border }} />

          {/* PROMINENT EN PULSE */}
          <PulseButton 
            label="PULSE EN" 
            onClick={handlePulse} 
            style={{ height: 44, padding: '0 24px' }}
          />
        </div>

        {/* LATCH FEEDBACK */}
        <div style={{ 
          height: 20, 
          fontSize: 10, 
          fontFamily: theme.core.bodyFont, 
          color: theme.core.primary,
          opacity: lastLatched ? 1 : 0,
          transition: 'opacity 200ms'
        }}>
          {lastLatched ? `Latched: ${lastLatched}` : ''}
        </div>
      </div>
    </div>
  );
};

const Badge: React.FC<{ label: string; bg: string; color: string; pulse?: boolean }> = ({ label, bg, color, pulse }) => {
  const { theme } = useTheme();
  return (
    <span style={{
      background: bg, color,
      padding: '3px 10px', borderRadius: 99,
      fontSize: 10, fontFamily: theme.core.headingFont,
      fontWeight: 'bold', letterSpacing: '0.08em',
      animation: pulse ? 'pulse 1.2s ease-in-out infinite' : 'none',
    }}>
      {label}
    </span>
  );
};
