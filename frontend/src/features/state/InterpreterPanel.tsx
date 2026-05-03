/**
 * InterpreterPanel.tsx — Live command decoder and character preview.
 * Switches mode based on RS pin state.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { useLCD } from '../../hooks/useLCD';

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
  const { data, rs } = busState;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      {/* 1. RS STATUS (THE SWITCHER) */}
      <div style={{
        padding: '12px',
        background: rs ? 'rgba(52, 199, 89, 0.1)' : 'rgba(0, 122, 255, 0.1)',
        border: `1px solid ${rs ? 'rgba(52, 199, 89, 0.3)' : 'rgba(0, 122, 255, 0.3)'}`,
        borderRadius: 8,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 16, fontWeight: '900', color: rs ? '#34c759' : '#007aff', fontFamily: theme.core.headingFont }}>
          {rs ? 'DATA MODE' : 'COMMAND MODE'}
        </div>
        <div style={{ fontSize: 9, color: theme.core.muted, marginTop: 2 }}>Register Select (RS) = {rs ? '1 (High)' : '0 (Low)'}</div>
      </div>

      <BitDisplay value={data} theme={theme} />

      {/* 2. MODE-DRIVEN CONTENT */}
      {rs ? (
        <DataPreview data={data} theme={theme} />
      ) : (
        <CommandDecoder data={data} theme={theme} />
      )}
      
      {/* 3. PIN STATE FOOTER */}
      <div style={{ marginTop: 'auto', padding: 12, background: theme.panel.background, borderRadius: 8, border: `1px solid ${theme.panel.border}` }}>
        <div style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4, color: theme.panel.heading }}>SIGNAL STATUS</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: theme.core.muted }}>
          <span>RS: {rs ? 'HIGH' : 'LOW'}</span>
          <span>RW: {busState.rw ? 'READ' : 'WRITE'}</span>
          <span>EN: {busState.en ? 'HIGH' : 'LOW'}</span>
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
        background: 'rgba(255, 59, 48, 0.05)', 
        padding: 20, borderRadius: 12, border: '1px solid rgba(255, 59, 48, 0.2)',
        textAlign: 'center' 
      }}>
        <div style={{ fontSize: 12, fontWeight: 'bold', color: '#ff3b30', marginBottom: 4 }}>Unknown Command (0x{data.toString(16).toUpperCase()})</div>
        <div style={{ fontSize: 10, color: theme.core.muted }}>No valid instruction match. Check bit pattern or RS mode.</div>
      </div>
    );
  }

  // Get related commands (same group but different value)
  const related = COMMAND_DB.filter(c => c.group === matched.group && c.name !== matched.name);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: theme.panel.background, padding: 16, borderRadius: 12, border: `1px solid ${theme.panel.border}` }}>
        <div style={{ fontSize: 9, color: theme.panel.label, marginBottom: 8, letterSpacing: '0.05em' }}>GROUP: {matched.group.toUpperCase()}</div>
        <div style={{ fontSize: 16, fontWeight: 'bold', color: theme.core.primary, marginBottom: 12 }}>{matched.name}</div>
        
        {/* Bit-level breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {matched.params?.map(p => {
            const { bit, desc } = getParamDetail(matched.name, p, data);
            return (
              <div key={p} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, alignItems: 'center' }}>
                <span style={{ color: theme.panel.label }}>Bit {bit} ({p})</span>
                <span style={{ color: theme.core.primary, fontWeight: 'bold', textAlign: 'right' }}>{desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ padding: '0 8px' }}>
          <div style={{ fontSize: 9, color: theme.panel.label, marginBottom: 8 }}>RELATED IN GROUP</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {related.map(r => (
              <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: theme.core.muted }}>
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
  const char = data >= 32 ? String.fromCharCode(data) : ' ';
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 5x8 Pixel Preview */}
      <div style={{ 
        background: theme.lcd.glass, 
        padding: 16, borderRadius: 12, 
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        border: '2px solid rgba(0,0,0,0.1)',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: 9, color: 'rgba(0,0,0,0.4)', fontWeight: 'bold' }}>CGROM PIXEL PREVIEW</div>
        <div style={{ fontSize: 48, fontFamily: theme.core.bodyFont, color: '#1a1f02' }}>{char}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: theme.panel.background, padding: 8, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: theme.core.muted }}>HEX</div>
          <div style={{ fontSize: 12, fontWeight: 'bold' }}>0x{data.toString(16).toUpperCase()}</div>
        </div>
        <div style={{ background: theme.panel.background, padding: 8, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: theme.core.muted }}>DEC</div>
          <div style={{ fontSize: 12, fontWeight: 'bold' }}>{data}</div>
        </div>
      </div>
      
      <div style={{ background: theme.panel.background, padding: 12, borderRadius: 12, border: `1px solid ${theme.panel.border}` }}>
        <div style={{ fontSize: 9, fontWeight: 'bold', color: theme.panel.heading, marginBottom: 8, letterSpacing: '0.05em' }}>ASCII REFERENCE</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 10, color: theme.core.muted }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>A</span> <span>0x41</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>B</span> <span>0x42</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>a</span> <span>0x61</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>b</span> <span>0x62</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>0</span> <span>0x30</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>1</span> <span>0x31</span></div>
        </div>
      </div>
    </div>
  );
};

function getParamDetail(cmd: string, param: string, byte: number): { bit: number, desc: string } {
  if (cmd === "Entry Mode Set") {
    if (param === "I/D") return { bit: 1, desc: (byte & 0x02) ? "Increment" : "Decrement" };
    if (param === "S") return { bit: 0, desc: (byte & 0x01) ? "Shift ON" : "Shift OFF" };
  }
  if (cmd === "Display Control") {
    if (param === "D") return { bit: 2, desc: (byte & 0x04) ? "Display ON" : "Display OFF" };
    if (param === "C") return { bit: 1, desc: (byte & 0x02) ? "Cursor ON" : "Cursor OFF" };
    if (param === "B") return { bit: 0, desc: (byte & 0x01) ? "Blink ON" : "Blink OFF" };
  }
  if (cmd === "Cursor/Display Shift") {
    if (param === "S/C") return { bit: 3, desc: (byte & 0x08) ? "Display Shift" : "Cursor Move" };
    if (param === "R/L") return { bit: 2, desc: (byte & 0x04) ? "Right" : "Left" };
  }
  if (cmd === "Function Set") {
    if (param === "DL") return { bit: 4, desc: (byte & 0x10) ? "8-bit" : "4-bit" };
    if (param === "N") return { bit: 3, desc: (byte & 0x08) ? "2-line" : "1-line" };
    if (param === "F") return { bit: 2, desc: (byte & 0x04) ? "5x10" : "5x8" };
  }
  return { bit: -1, desc: "-" };
}
