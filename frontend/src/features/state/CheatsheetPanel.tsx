/**
 * CheatsheetPanel.tsx — Educational sidebar for LCD commands.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { useLCD } from '../../hooks/useLCD';

export const CheatsheetPanel: React.FC = () => {
  const { theme } = useTheme();
  const { busState } = useLCD();
  const { rs } = busState;

  const section = (title: string, content: React.ReactNode) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontSize: 10, color: theme.panel.heading,
        fontFamily: theme.core.headingFont,
        letterSpacing: '0.1em', marginBottom: 12,
        borderBottom: `1px solid ${theme.panel.border}`,
        paddingBottom: 6,
      }}>
        {title}
      </div>
      {content}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* MODE INDICATOR */}
      {section('CURRENT MODE', (
        <div style={{
          padding: '12px',
          background: rs ? 'rgba(52, 199, 89, 0.1)' : 'rgba(0, 122, 255, 0.1)',
          border: `1px solid ${rs ? 'rgba(52, 199, 89, 0.3)' : 'rgba(0, 122, 255, 0.3)'}`,
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 9, color: theme.core.muted, marginBottom: 2 }}>REGISTER SELECT (RS)</div>
          <div style={{ 
            fontSize: 14, 
            fontWeight: 'bold', 
            color: rs ? theme.statusBadge.connectedText : theme.core.primary,
            fontFamily: theme.core.headingFont
          }}>
            {rs ? 'DATA MODE (RS=1)' : 'COMMAND MODE (RS=0)'}
          </div>
          <div style={{ fontSize: 9, color: theme.core.muted, marginTop: 4 }}>
            {rs ? 'Writing to DDRAM/CGRAM' : 'Executing Controller Instructions'}
          </div>
        </div>
      ))}

      {/* COMMAND LIST */}
      {section('COMMAND CHEATSHEET', (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <CmdRow hex="01" label="Clear Display" theme={theme} />
          <CmdRow hex="02" label="Return Home" theme={theme} />
          <CmdRow hex="04-07" label="Entry Mode Set" theme={theme} />
          <CmdRow hex="08-0F" label="Display Control" theme={theme} />
          <CmdRow hex="10-1F" label="Cursor/Display Shift" theme={theme} />
          <CmdRow hex="20-3F" label="Function Set" theme={theme} />
          <CmdRow hex="40-7F" label="Set CGRAM Addr" theme={theme} />
          <CmdRow hex="80-FF" label="Set DDRAM Addr" theme={theme} />
        </div>
      ))}

      {/* PIN HELP */}
      <div style={{ marginTop: 'auto', padding: 12, background: theme.panel.background, borderRadius: 8, border: `1px solid ${theme.panel.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 8, color: theme.panel.heading }}>SIGNAL FLOW</div>
        <div style={{ fontSize: 10, color: theme.core.muted, lineHeight: 1.4 }}>
          1. Set <b>RS</b> and <b>Data</b> pins.<br/>
          2. Pulse <b>EN</b> (High → Low).<br/>
          3. LCD latch data on <b>Falling Edge</b>.
        </div>
      </div>
    </div>
  );
};

const CmdRow: React.FC<{ hex: string; label: string; theme: any }> = ({ hex, label, theme }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
    <code style={{ fontSize: 10, color: theme.core.primary, background: theme.panel.background, padding: '2px 4px', borderRadius: 4 }}>
      0x{hex}
    </code>
    <span style={{ fontSize: 10, color: theme.core.muted, fontFamily: theme.core.bodyFont }}>{label}</span>
  </div>
);
