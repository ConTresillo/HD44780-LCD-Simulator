/**
 * InterpreterPanel.tsx — Robust Bitfield Explorer.
 * Implements precise flex-box sizing to prevent layout collapse.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { useLCD } from '../../hooks/useLCD';

// --- DATA SCHEMA ---
type CommandGroup = {
  name: string;
  mask: number;
  base: number;
  bitLabels: string[];
  bits: {
    position: number;
    name: string;
    values: { bit: number; label: string }[];
  }[];
};

const GROUPS: CommandGroup[] = [
  {
    name: "Clear Display",
    mask: 0xFF,
    base: 0x01,
    bitLabels: ["0", "0", "0", "0", "0", "0", "0", "1"],
    bits: []
  },
  {
    name: "Return Home",
    mask: 0xFF,
    base: 0x02,
    bitLabels: ["0", "0", "0", "0", "0", "0", "1", "0"],
    bits: []
  },
  {
    name: "Entry Mode Set",
    mask: 0xFC,
    base: 0x04,
    bitLabels: ["0", "0", "0", "0", "0", "1", "I/D", "S"],
    bits: [
      { position: 1, name: "I/D", values: [{ bit: 0, label: "Decrement" }, { bit: 1, label: "Increment" }] },
      { position: 0, name: "S", values: [{ bit: 0, label: "No Shift" }, { bit: 1, label: "Shift" }] }
    ]
  },
  {
    name: "Display Control",
    mask: 0xF8,
    base: 0x08,
    bitLabels: ["0", "0", "0", "0", "1", "D", "C", "B"],
    bits: [
      { position: 2, name: "D", values: [{ bit: 0, label: "Disp OFF" }, { bit: 1, label: "Disp ON" }] },
      { position: 1, name: "C", values: [{ bit: 0, label: "Curs OFF" }, { bit: 1, label: "Curs ON" }] },
      { position: 0, name: "B", values: [{ bit: 0, label: "Blink OFF" }, { bit: 1, label: "Blink ON" }] }
    ]
  },
  {
    name: "Cursor / Display Shift",
    mask: 0xF0,
    base: 0x10,
    bitLabels: ["0", "0", "0", "1", "S/C", "R/L", "x", "x"],
    bits: [
      { position: 3, name: "S/C", values: [{ bit: 0, label: "Curs Move" }, { bit: 1, label: "Disp Shift" }] },
      { position: 2, name: "R/L", values: [{ bit: 0, label: "Left" }, { bit: 1, label: "Right" }] }
    ]
  },
  {
    name: "Function Set",
    mask: 0xE0,
    base: 0x20,
    bitLabels: ["0", "0", "1", "DL", "N", "F", "x", "x"],
    bits: [
      { position: 4, name: "DL", values: [{ bit: 0, label: "4-bit" }, { bit: 1, label: "8-bit" }] },
      { position: 3, name: "N", values: [{ bit: 0, label: "1-line" }, { bit: 1, label: "2-line" }] },
      { position: 2, name: "F", values: [{ bit: 0, label: "5x8" }, { bit: 1, label: "5x10" }] }
    ]
  },
  {
    name: "Set CGRAM Address",
    mask: 0xC0,
    base: 0x40,
    bitLabels: ["0", "1", "A", "A", "A", "A", "A", "A"],
    bits: []
  },
  {
    name: "Set DDRAM Address",
    mask: 0x80,
    base: 0x80,
    bitLabels: ["1", "A", "A", "A", "A", "A", "A", "A"],
    bits: []
  }
];

// --- LOGIC ---
function generateVariants(group: CommandGroup) {
  if (group.bits.length === 0) return [];
  const results: { hex: number; label: string }[] = [];
  const bitCount = group.bits.length;
  const total = 1 << bitCount;

  for (let i = 0; i < total; i++) {
    let value = group.base;
    let labelParts: string[] = [];
    group.bits.forEach((bitDef, idx) => {
      const bitValue = (i >> (bitCount - 1 - idx)) & 1;
      value |= bitValue << bitDef.position;
      labelParts.push(bitDef.values.find(v => v.bit === bitValue)?.label || "");
    });
    results.push({ hex: value, label: labelParts.join(" + ") });
  }
  return results.sort((a, b) => a.hex - b.hex);
}

// --- UI COMPONENTS ---

export const InterpreterPanel: React.FC = () => {
  const { theme } = useTheme();
  const { busState } = useLCD();

  if (!busState) return null;
  const { data, rs } = busState;

  // PANEL CONTAINER: Fixed width, responsive content
  const panelStyle: React.CSSProperties = {
    width: 320,
    minWidth: 320,
    maxWidth: 320,
    flexShrink: 0,
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden', // Prevent horizontal spill
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    background: theme.core.background,
    borderRight: `1px solid ${theme.panel.border}`,
    boxSizing: 'border-box',
    fontFamily: "'Outfit', sans-serif"
  };

  const group = GROUPS.find(g => (data & g.mask) === g.base);

  return (
    <div style={panelStyle}>
      {/* 1. RESPONSIVE BIT EXPLORER */}
      <div style={{
        background: `${theme.core.surfaceAlt}88`,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${theme.panel.border}`,
        borderRadius: 14,
        padding: 12,
        minWidth: 0, // CRITICAL: Allow container to shrink
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{ fontSize: 9, fontWeight: 800, opacity: 0.5, marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {rs ? 'Data Mode' : 'Bitfield Mapping'}
        </div>
        <div style={{ display: 'flex', gap: 4, minWidth: 0 }}>
          {[7, 6, 5, 4, 3, 2, 1, 0].map((i, idx) => {
            const bitName = (!rs && group) ? group.bitLabels[idx] : `D${i}`;
            const val = (data >> i) & 1;
            const isParam = (!rs && group && group.bitLabels[idx].length > 1);

            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 7,
                  fontWeight: 900,
                  color: isParam ? theme.core.primary : theme.core.muted,
                  textAlign: 'center',
                  height: 10,
                  overflow: 'hidden',
                  width: '100%',
                  textOverflow: 'ellipsis'
                }}>
                  {bitName}
                </div>
                <div style={{
                  width: '100%',
                  aspectRatio: '0.9',
                  background: val ? theme.core.primary : theme.core.background,
                  color: val ? '#fff' : theme.core.muted,
                  borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 900,
                  border: `1px solid ${val ? theme.core.primary : theme.panel.border}`,
                  transition: 'all 150ms ease',
                  minWidth: 0 // Allow shrinking
                }}>
                  {val}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MODE CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
        {rs ? (
          <DataModeView data={data} theme={theme} />
        ) : (
          group ? <CommandGroupView data={data} group={group} theme={theme} /> : <div style={{ textAlign: 'center', opacity: 0.5, fontSize: 12 }}>Unrecognized Signal</div>
        )}
      </div>
    </div>
  );
};

const CommandGroupView: React.FC<{ data: number, group: CommandGroup, theme: any }> = ({ data, group, theme }) => {
  const variants = generateVariants(group);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
      {/* HEADER */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: theme.core.primary, marginBottom: 2, letterSpacing: '-0.01em' }}>{group.name}</div>
        <div style={{ fontSize: 11, opacity: 0.5, fontFamily: 'monospace' }}>
          HEX: 0x{data.toString(16).toUpperCase()} • BIN: {data.toString(2).padStart(8, '0')}
        </div>
      </div>

      {/* BIT FLAGS */}
      {group.bits.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          {group.bits.map(b => {
            const val = (data >> b.position) & 1;
            const label = b.values.find(v => v.bit === val)?.label;
            return (
              <div key={b.name} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: `${theme.core.surfaceAlt}55`,
                borderRadius: 10,
                border: `1px solid ${theme.panel.border}44`,
                minWidth: 0
              }}>
                <div style={{ fontSize: 9, fontWeight: 900, color: theme.core.primary, background: `${theme.core.primary}15`, padding: '4px 6px', borderRadius: 4, flexShrink: 0 }}>{b.name}</div>
                <div style={{ fontSize: 13, fontWeight: 600, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* VARIANTS (RESPONSIVE) */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 800, opacity: 0.4, marginBottom: 12, letterSpacing: '0.1em' }}>AVAILABLE VARIANTS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {variants.map(v => (
            <div key={v.hex} style={{
              display: 'flex',
              padding: '8px 10px',
              background: v.hex === data ? `${theme.core.primary}10` : 'transparent',
              borderRadius: 8,
              border: `1px solid ${v.hex === data ? `${theme.core.primary}25` : 'transparent'}`,
              opacity: v.hex === data ? 1 : 0.4,
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              minWidth: 0
            }}>
              <span style={{ fontSize: 12, fontWeight: v.hex === data ? 700 : 500, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {v.label}
              </span>
              <code style={{ fontSize: 10, fontWeight: 800, color: theme.core.primary, flexShrink: 0 }}>
                0x{v.hex.toString(16).toUpperCase()}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* ADDRESS CASE */}
      {(group.name.includes("Address")) && (
        <div style={{
          marginTop: 8,
          padding: 16,
          background: theme.core.surfaceAlt,
          borderRadius: 14,
          textAlign: 'center',
          border: `1px solid ${theme.panel.border}`,
          minWidth: 0
        }}>
          <div style={{ fontSize: 9, fontWeight: 800, opacity: 0.5, marginBottom: 4 }}>TARGET ADDRESS</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: theme.core.primary }}>
            0x{(data & ~group.mask).toString(16).toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
};

const DataModeView: React.FC<{ data: number, theme: any }> = ({ data, theme }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
    <div style={{ fontSize: 20, fontWeight: 800 }}>Data Mode</div>
    <div style={{
      background: theme.core.surfaceAlt,
      aspectRatio: '1',
      borderRadius: 24,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${theme.panel.border}`,
      minWidth: 0
    }}>
      <div style={{ fontSize: 72, fontWeight: 900, color: theme.core.primary }}>
        {data >= 32 && data <= 126 ? String.fromCharCode(data) : '?'}
      </div>
      <div style={{ fontSize: 12, opacity: 0.4, marginTop: 12, fontFamily: 'monospace' }}>0x{data.toString(16).toUpperCase()}</div>
    </div>
    <div style={{ fontSize: 12, opacity: 0.5, textAlign: 'center', lineHeight: 1.5 }}>
      Character write to DDRAM or CGRAM based on current address counter.
    </div>
  </div>
);
