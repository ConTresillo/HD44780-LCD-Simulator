/**
 * CheatsheetPanel.tsx — Educational sidebar for LCD commands.
 * Fully hex-exhaustive reference and tutorial.
 */
import React, { useState } from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { useLCD } from '../../hooks/useLCD';

export const CheatsheetPanel: React.FC = () => {
  const { theme } = useTheme();
  const { busState } = useLCD();
  const { rs } = busState;
  const [expandedCmd, setExpandedCmd] = useState<string | null>(null);

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', paddingRight: 4 }}>
      {/* 1. TUTORIAL HEADER */}
      {section('HOW TO WRITE A COMMAND', (
        <div style={{ 
          padding: 12, 
          background: theme.core.surfaceAlt, 
          borderRadius: 8, 
          fontSize: 10, 
          color: theme.core.muted,
          lineHeight: 1.5,
          border: `1px solid ${theme.panel.border}`
        }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: theme.core.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>1</div>
            <div>Set <b>RS = 0</b> (Instruction Mode)</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: theme.core.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>2</div>
            <div>Place <b>HEX</b> command on DB0-DB7</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: theme.core.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>3</div>
            <div>Pulse <b>EN</b> pin (High → Low)</div>
          </div>
        </div>
      ))}

      {/* 2. COMMAND SPACE MAP */}
      {section('COMPLETE HEX SPACE', (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
           <HexRange range="0x01" label="Clear Display" />
           <HexRange range="0x02" label="Return Home" />
           <HexRange range="0x04 - 0x07" label="Entry Mode Set" active={expandedCmd === 'entry'} onClick={() => setExpandedCmd(expandedCmd === 'entry' ? null : 'entry')} />
           {expandedCmd === 'entry' && <EntryModeDetail />}
           
           <HexRange range="0x08 - 0x0F" label="Display Control" active={expandedCmd === 'display'} onClick={() => setExpandedCmd(expandedCmd === 'display' ? null : 'display')} />
           {expandedCmd === 'display' && <DisplayControlDetail />}

           <HexRange range="0x10 - 0x1C" label="Cursor/Shift" active={expandedCmd === 'shift'} onClick={() => setExpandedCmd(expandedCmd === 'shift' ? null : 'shift')} />
           {expandedCmd === 'shift' && <ShiftDetail />}

           <HexRange range="0x20 - 0x3F" label="Function Set" active={expandedCmd === 'function'} onClick={() => setExpandedCmd(expandedCmd === 'function' ? null : 'function')} />
           {expandedCmd === 'function' && <FunctionSetDetail />}

           <HexRange range="0x40 - 0x7F" label="Set CGRAM Addr" />
           <HexRange range="0x80 - 0xFF" label="Set DDRAM Addr" />
        </div>
      ))}

      {/* 3. DDRAM MAPPING */}
      {section('DDRAM ADDRESSES', (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <AddrBox label="L1 Start" hex="0x80" />
          <AddrBox label="L2 Start" hex="0xC0" />
          <AddrBox label="L3 (20x4)" hex="0x94" />
          <AddrBox label="L4 (20x4)" hex="0xD4" />
        </div>
      ))}

      <div style={{ marginTop: 'auto', padding: 12, background: theme.panel.background, borderRadius: 8, border: `1px solid ${theme.panel.border}`, opacity: 0.8 }}>
        <div style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4, color: theme.panel.heading }}>PRO TIP</div>
        <div style={{ fontSize: 9, color: theme.core.muted, lineHeight: 1.4 }}>
          Most commands use the upper bits as an "Opcode" and the lower bits as "Parameters".
        </div>
      </div>
    </div>
  );
};

const HexRange: React.FC<{ range: string, label: string, active?: boolean, onClick?: () => void }> = ({ range, label, active, onClick }) => {
  const { theme } = useTheme();
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '6px 8px', 
        background: active ? theme.core.surfaceAlt : 'transparent',
        borderRadius: 6,
        cursor: onClick ? 'pointer' : 'default',
        border: `1px solid ${active ? theme.core.primary + '44' : 'transparent'}`,
        transition: 'all 200ms ease'
      }}>
      <code style={{ fontSize: 9, color: theme.core.primary, fontWeight: 'bold' }}>{range}</code>
      <span style={{ fontSize: 10, color: active ? theme.core.primary : theme.core.muted }}>{label}</span>
    </div>
  );
};

const AddrBox: React.FC<{ label: string, hex: string }> = ({ label, hex }) => {
  const { theme } = useTheme();
  return (
    <div style={{ background: theme.core.background, padding: 8, borderRadius: 6, border: `1px solid ${theme.panel.border}`, textAlign: 'center' }}>
      <div style={{ fontSize: 8, color: theme.core.muted, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 10, fontWeight: 'bold', color: theme.core.primary }}>{hex}</div>
    </div>
  );
};

// DETAIL COMPONENTS
const EntryModeDetail = () => {
  const { theme } = useTheme();
  return (
    <div style={{ margin: '4px 0 12px 8px', padding: 8, borderLeft: `2px solid ${theme.core.primary}22`, fontSize: 9, color: theme.core.muted, background: theme.core.surfaceAlt + '44', borderRadius: '0 8px 8px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ textAlign: 'left', opacity: 0.7 }}><th style={{ paddingBottom: 4 }}>HEX</th><th style={{ paddingBottom: 4 }}>Meaning</th></tr></thead>
        <tbody>
          <tr><td>0x04</td><td>Cursor Left</td></tr>
          <tr><td>0x05</td><td>Left + Shift</td></tr>
          <tr><td>0x06</td><td>Cursor Right</td></tr>
          <tr><td>0x07</td><td>Right + Shift</td></tr>
        </tbody>
      </table>
    </div>
  );
}

const DisplayControlDetail = () => {
  const { theme } = useTheme();
  return (
    <div style={{ margin: '4px 0 12px 8px', padding: 8, borderLeft: `2px solid ${theme.core.primary}22`, fontSize: 9, color: theme.core.muted, background: theme.core.surfaceAlt + '44', borderRadius: '0 8px 8px 0' }}>
      <div style={{ marginBottom: 4, fontWeight: 'bold', color: theme.core.primary }}>Bit Flags: D (Disp), C (Curs), B (Blink)</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr><td>0x08</td><td>All OFF</td></tr>
          <tr><td>0x0C</td><td>Disp ON</td></tr>
          <tr><td>0x0E</td><td>Disp + Curs</td></tr>
          <tr><td>0x0F</td><td>All ON</td></tr>
        </tbody>
      </table>
    </div>
  );
}

const ShiftDetail = () => {
  const { theme } = useTheme();
  return (
    <div style={{ margin: '4px 0 12px 8px', padding: 8, borderLeft: `2px solid ${theme.core.primary}22`, fontSize: 9, color: theme.core.muted, background: theme.core.surfaceAlt + '44', borderRadius: '0 8px 8px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr><td>0x10</td><td>Cursor L</td></tr>
          <tr><td>0x14</td><td>Cursor R</td></tr>
          <tr><td>0x18</td><td>Shift L</td></tr>
          <tr><td>0x1C</td><td>Shift R</td></tr>
        </tbody>
      </table>
    </div>
  );
}

const FunctionSetDetail = () => {
  const { theme } = useTheme();
  return (
    <div style={{ margin: '4px 0 12px 8px', padding: 8, borderLeft: `2px solid ${theme.core.primary}22`, fontSize: 9, color: theme.core.muted, background: theme.core.surfaceAlt + '44', borderRadius: '0 8px 8px 0' }}>
      <div style={{ marginBottom: 4, fontWeight: 'bold', color: theme.core.primary }}>Combinations:</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        <div>0x20: 4-bit, 1L</div>
        <div>0x28: 4-bit, 2L</div>
        <div>0x30: 8-bit, 1L</div>
        <div>0x38: 8-bit, 2L</div>
      </div>
    </div>
  );
}
