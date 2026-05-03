/**
 * InterpreterPanel.tsx — Live command decoder and character preview.
 * Switches mode based on RS pin state.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { useLCD } from '../../hooks/useLCD';
import { LcdCell } from '../../components/lcd/LcdCell';
import { charToBitmap } from '../../components/lcd/LcdDisplay';

const COMMAND_DB = [
  { name: "Clear Display", mask: 0xFF, value: 0x01, group: "System" },
  { name: "Return Home", mask: 0xFF, value: 0x02, group: "System" },
  { name: "Entry Mode Set", mask: 0xFC, value: 0x04, group: "Entry", params: ["I/D", "S"] },
  { name: "Display Control", mask: 0xF8, value: 0x08, group: "Display", params: ["D", "C", "B"] },
  { name: "Cursor/Display Shift", mask: 0xF0, value: 0x10, group: "Shift", params: ["S/C", "R/L"] },
  { name: "Function Set", mask: 0xE0, value: 0x20, group: "Function", params: ["DL", "N", "F"] },
  { name: "Set CGRAM Addr", mask: 0xC0, value: 0x40, group: "Address" },
  { name: "Set DDRAM Addr", mask: 0x80, value: 0x80, group: "Address" }
];

// Binary bit visualization helper
const BitDisplay: React.FC<{ value: number, theme: any }> = ({ value, theme }) => (
  <div style={{ display: 'flex', gap: 4, marginBottom: 16, justifyContent: 'center' }}>
    {[7, 6, 5, 4, 3, 2, 1, 0].map(i => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <div style={{
          width: 20, height: 24,
          background: (value >> i) & 1 ? theme.core.primary : theme.panel.background,
          color: (value >> i) & 1 ? '#fff' : theme.core.muted,
          borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 'bold',
          border: `1px solid ${theme.panel.border}`
        }}>
          {(value >> i) & 1}
        </div>
        <div style={{ fontSize: 8, color: theme.core.muted }}>b{i}</div>
      </div>
    ))}
  </div>
);

export const InterpreterPanel: React.FC = () => {
  const { theme } = useTheme();
  const { busState } = useLCD();

  if (!busState) return null;
  const { data, rs } = busState;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', minWidth: 200 }}>
      {/* 1. RS STATUS HEADER */}
      <div style={{
        padding: '12px',
        background: theme.core.surfaceAlt,
        border: `1px solid ${theme.panel.border}`,
        borderRadius: 12,
        textAlign: 'center',
        boxShadow: rs ? `0 0 15px ${theme.dataPin.activeBorder}33` : 'none',
        transition: 'all 300ms ease'
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 'bold',
          color: theme.core.primary,
          fontFamily: theme.core.headingFont,
          letterSpacing: '0.1em'
        }}>
          {rs ? 'DATA MODE (WRITE)' : 'COMMAND MODE (INSTR)'}
        </div>
        <div style={{ fontSize: 9, color: theme.core.muted, marginTop: 4, fontFamily: theme.core.bodyFont, opacity: 0.8 }}>
          PIN RS = <span style={{ color: rs ? theme.dataPin.activeBorder : theme.core.muted }}>{rs ? 'HIGH' : 'LOW'}</span>
        </div>
      </div>

      <BitDisplay value={data} theme={theme} />

      {/* 2. MODE-DRIVEN CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {rs ? (
          <DataPreview data={data} theme={theme} />
        ) : (
          <CommandDecoder data={data} theme={theme} />
        )}
      </div>

      {/* 3. SIGNAL STATUS FOOTER */}
      <div style={{
        padding: 12,
        background: theme.core.background,
        borderRadius: 10,
        border: `1px solid ${theme.panel.border}`
      }}>
        <div style={{ fontSize: 8, fontWeight: 'bold', marginBottom: 8, color: theme.panel.label, letterSpacing: '0.1em' }}>HARDWARE SIGNALS</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: theme.core.muted, fontFamily: theme.core.bodyFont }}>
          <span>RS: {rs ? 'H' : 'L'}</span>
          <span>RW: {busState.rw ? 'R' : 'W'}</span>
          <span>EN: {busState.en ? 'H' : 'L'}</span>
        </div>
      </div>
    </div>
  );
};

const CommandDecoder: React.FC<{ data: number, theme: any }> = ({ data, theme }) => {
  const matches = COMMAND_DB.filter(cmd => (data & cmd.mask) === cmd.value);
  const matched = matches[0];

  if (!matched) {
    return (
      <div style={{
        background: theme.core.background,
        padding: 20, borderRadius: 12, border: `1px solid ${theme.log.errorColor}33`,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 11, fontWeight: 'bold', color: theme.log.errorColor, marginBottom: 4 }}>Unknown 0x{data.toString(16).toUpperCase()}</div>
        <div style={{ fontSize: 9, color: theme.core.muted }}>Check bit pattern.</div>
      </div>
    );
  }

  const related = COMMAND_DB.filter(c => c.group === matched.group && c.name !== matched.name);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: theme.panel.background, padding: 16, borderRadius: 12, border: `1px solid ${theme.panel.border}` }}>
        <div style={{ fontSize: 9, color: theme.panel.label, marginBottom: 8, letterSpacing: '0.05em' }}>{matched.group.toUpperCase()}</div>
        <div style={{ fontSize: 15, fontWeight: 'bold', color: theme.core.primary, marginBottom: 12, fontFamily: theme.core.headingFont }}>{matched.name}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {matched.params?.map(p => {
            const { bit, desc } = getParamDetail(matched.name, p, data);
            return (
              <div key={p} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, alignItems: 'center' }}>
                <span style={{ color: theme.panel.label }}>Bit {bit} ({p})</span>
                <span style={{ color: theme.core.primary, fontWeight: 'bold' }}>{desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ padding: '4px' }}>
          <div style={{ fontSize: 8, color: theme.panel.label, marginBottom: 8, letterSpacing: '0.05em' }}>SIMILAR COMMANDS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {related.slice(0, 3).map(r => (
              <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: theme.core.muted }}>
                <span>{r.name}</span>
                <span>0x{r.value.toString(16).toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DataPreview: React.FC<{ data: number, theme: any }> = ({ data, theme }) => {
  const char = data >= 32 && data <= 126 ? String.fromCharCode(data) : ' ';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* CGROM Pixel Preview */}
      <div style={{
        background: theme.lcd.glass,
        padding: '24px',
        borderRadius: 14,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        border: `1px solid ${theme.panel.border}`,
        position: 'relative',
        boxShadow: `inset 0 0 20px ${theme.lcd.pixelOff}22`
      }}>
        <div style={{ fontSize: 8, color: theme.panel.label, fontWeight: 'bold', fontFamily: theme.core.headingFont, letterSpacing: '0.1em', opacity: 0.7 }}>CELL PREVIEW (5x8)</div>
        <div style={{ transform: 'scale(2.5)', margin: '10px 0' }}>
          <LcdCell bitmap={charToBitmap(data)} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 'bold', color: theme.core.primary, fontFamily: theme.core.headingFont }}>'{char}'</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: theme.core.background, padding: 14, borderRadius: 12, border: `1px solid ${theme.panel.border}`, textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: theme.core.muted, fontWeight: 'bold', marginBottom: 4 }}>HEX</div>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: theme.core.primary, fontFamily: theme.core.bodyFont }}>0x{data.toString(16).toUpperCase().padStart(2, '0')}</div>
        </div>
        <div style={{ background: theme.core.background, padding: 14, borderRadius: 12, border: `1px solid ${theme.panel.border}`, textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: theme.core.muted, fontWeight: 'bold', marginBottom: 4 }}>DEC</div>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: theme.core.primary, fontFamily: theme.core.bodyFont }}>{data}</div>
        </div>
      </div>

      <div style={{ background: theme.panel.background, padding: 16, borderRadius: 12, border: `1px solid ${theme.panel.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 'bold', color: theme.panel.label, marginBottom: 12, letterSpacing: '0.05em', fontFamily: theme.core.headingFont }}>ASCII QUICK REF</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: 11, color: theme.core.muted, fontFamily: theme.core.bodyFont }}>
          {[
            ['A', '0x41'], ['a', '0x61'],
            ['B', '0x42'], ['b', '0x62'],
            ['0', '0x30'], ['1', '0x31']
          ].map(([c, h]) => (
            <div key={c} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${theme.panel.border}44`, paddingBottom: 2 }}>
              <span>{c}</span> <span style={{ color: theme.core.primary, fontWeight: 'bold' }}>{h}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function getParamDetail(cmd: string, param: string, byte: number): { bit: number, desc: string } {
  const b = byte || 0;
  if (cmd === "Entry Mode Set") {
    if (param === "I/D") return { bit: 1, desc: (b & 0x02) ? "Increment" : "Decrement" };
    if (param === "S") return { bit: 0, desc: (b & 0x01) ? "Shift ON" : "Shift OFF" };
  }
  if (cmd === "Display Control") {
    if (param === "D") return { bit: 2, desc: (b & 0x04) ? "Display ON" : "Display OFF" };
    if (param === "C") return { bit: 1, desc: (b & 0x02) ? "Cursor ON" : "Cursor OFF" };
    if (param === "B") return { bit: 0, desc: (b & 0x01) ? "Blink ON" : "Blink OFF" };
  }
  if (cmd === "Cursor/Display Shift") {
    if (param === "S/C") return { bit: 3, desc: (b & 0x08) ? "Display Shift" : "Cursor Move" };
    if (param === "R/L") return { bit: 2, desc: (b & 0x04) ? "Right" : "Left" };
  }
  if (cmd === "Function Set") {
    if (param === "DL") return { bit: 4, desc: (b & 0x10) ? "8-bit" : "4-bit" };
    if (param === "N") return { bit: 3, desc: (b & 0x08) ? "2-line" : "1-line" };
    if (param === "F") return { bit: 2, desc: (b & 0x04) ? "5x10" : "5x8" };
  }
  return { bit: -1, desc: "-" };
}
