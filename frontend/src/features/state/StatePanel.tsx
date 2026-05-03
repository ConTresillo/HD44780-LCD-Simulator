/**
 * StatePanel.tsx — Live hardware state readout.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { useLCD } from '../../hooks/useLCD';

export const StatePanel: React.FC = () => {
  const { theme } = useTheme();
  const { hardware } = useLCD();

  if (!hardware) {
    return (
      <div style={panelStyle(theme)}>
        <Label theme={theme}>HARDWARE STATE</Label>
        <div style={{ color: theme.core.muted, fontSize: 12, fontFamily: theme.core.bodyFont }}>Waiting for connection…</div>
      </div>
    );
  }

  const h = hardware;
  const rows: [string, string][] = [
    ['Address Pointer', `0x${h.addressPointer.toString(16).padStart(2,'0').toUpperCase()} (${h.addressPointer})`],
    ['RAM Mode', h.ramType],
    ['Entry Mode', `${h.entryModeIncrement ? 'INCREMENT' : 'DECREMENT'} / Shift: ${h.entryModeShift ? 'ON' : 'OFF'}`],
    ['Display', `${h.displayOn ? 'ON' : 'OFF'} / Cursor: ${h.cursorOn ? 'ON' : 'OFF'} / Blink: ${h.blinkOn ? 'ON' : 'OFF'}`],
    ['Data Mode', `${h.dataLength}-bit / ${h.numLines}-line / ${h.font}`],
    ['Shift Offset', String(h.shiftOffset)],
    ['Initialized', `${h.initialized} (pulses: ${h.initCount}/3)`],
    ['Busy Flag', h.busyFlag ? '🔴 BUSY' : '🟢 READY'],
    ['RS / RW / EN', `${h.rs?1:0} / ${h.rw?1:0} / ${h.en?1:0}`],
  ];

  return (
    <div style={panelStyle(theme)}>
      <Label theme={theme}>HARDWARE STATE</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rows.map(([key, val]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ color: theme.panel.label, fontSize: 11, fontFamily: theme.core.bodyFont, whiteSpace: 'nowrap' }}>{key}</span>
            <span style={{ color: theme.core.primary, fontSize: 11, fontFamily: theme.core.bodyFont, textAlign: 'right' }}>{val}</span>
          </div>
        ))}
      </div>

      {/* DDRAM Row preview */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 10, color: theme.panel.label, fontFamily: theme.core.headingFont, letterSpacing: '0.08em', marginBottom: 6 }}>
          DDRAM ROWS
        </div>
        <DdramRow label="Row 1 (0x00)" bytes={h.ddram.slice(0x00, 0x10)} theme={theme} />
        <DdramRow label="Row 2 (0x40)" bytes={h.ddram.slice(0x40, 0x50)} theme={theme} />
      </div>
    </div>
  );
};

const DdramRow: React.FC<{ label: string; bytes: number[]; theme: any }> = ({ label, bytes, theme }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ fontSize: 9, color: theme.panel.label, fontFamily: theme.core.bodyFont, marginBottom: 3 }}>{label}</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {bytes.map((b, i) => (
        <span key={i} style={{
          fontSize: 9, fontFamily: theme.core.bodyFont,
          color: b === 0x20 ? theme.core.muted : theme.panel.heading,
          background: theme.panel.background,
          border: `1px solid ${theme.panel.border}`,
          borderRadius: 3, padding: '1px 4px',
        }}>
          {b.toString(16).padStart(2,'0').toUpperCase()}
        </span>
      ))}
    </div>
  </div>
);

const panelStyle = (theme: any): React.CSSProperties => ({
  background: theme.panel.background,
  border: `1px solid ${theme.panel.border}`,
  borderRadius: 12, padding: 20,
  display: 'flex', flexDirection: 'column', gap: 12,
});

const Label: React.FC<{ theme: any; children: React.ReactNode }> = ({ theme, children }) => (
  <div style={{
    fontSize: 10, color: theme.panel.heading,
    fontFamily: theme.core.headingFont, letterSpacing: '0.1em',
    borderBottom: `1px solid ${theme.panel.border}`, paddingBottom: 8,
  }}>
    {children}
  </div>
);
