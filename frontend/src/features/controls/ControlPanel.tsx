/**
 * ControlPanel.tsx — High-level utility commands and configuration.
 */
import React from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { IconButton } from '../../components/controls';
import { useLCD } from '../../hooks/useLCD';

const QUICK_COMMANDS = [
  { label: 'Clear Display', byte: 0x01 },
  { label: 'Return Home', byte: 0x02 },
  { label: 'Display ON', byte: 0x0C },
  { label: 'Display OFF', byte: 0x08 },
  { label: 'Set 2-Line', byte: 0x38 },
  { label: 'Set 1-Line', byte: 0x30 },
  { label: 'Init Seq (x3)', byte: 0x30, repeat: 3 },
];

export const ControlPanel: React.FC = () => {
  const { theme } = useTheme();
  const { sendCommand, reset, updateConfig, hardware } = useLCD();

  const h = hardware;

  // Helper to construct Display Control command (0x08 | D | C | B)
  const setDisplayState = (d: boolean, c: boolean, b: boolean) => {
    let byte = 0x08;
    if (d) byte |= 0x04;
    if (c) byte |= 0x02;
    if (b) byte |= 0x01;
    sendCommand(byte);
  };

  const label = (text: string) => (
    <div style={{
      fontSize: 10, color: theme.panel.label,
      fontFamily: theme.core.headingFont,
      letterSpacing: '0.1em', marginBottom: 12,
      borderBottom: `1px solid ${theme.panel.border}`,
      paddingBottom: 6,
    }}>
      {text}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* 1. DISPLAY CONTROL (MODULAR) */}
      <div>
        {label('DISPLAY CONTROL')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <IconButton 
            label={h?.displayOn ? "DISPLAY: ON" : "DISPLAY: OFF"} 
            variant={h?.displayOn ? "success" : "secondary"}
            onClick={() => setDisplayState(!h?.displayOn, !!h?.cursorOn, !!h?.blinkOn)} 
          />
          <IconButton 
            label={h?.cursorOn ? "CURSOR: ON" : "CURSOR: OFF"} 
            variant={h?.cursorOn ? "success" : "secondary"}
            onClick={() => setDisplayState(!!h?.displayOn, !h?.cursorOn, !!h?.blinkOn)} 
          />
          <IconButton 
            label={h?.blinkOn ? "BLINK: ON" : "BLINK: OFF"} 
            variant={h?.blinkOn ? "success" : "secondary"}
            onClick={() => setDisplayState(!!h?.displayOn, !!h?.cursorOn, !h?.blinkOn)} 
          />
          <IconButton label="CLEAR DISPLAY" onClick={() => sendCommand(0x01)} />
        </div>
      </div>

      {/* 2. SHIFT OPERATIONS */}
      <div>
        {label('SHIFT OPERATIONS')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <IconButton label="CURSOR ←" onClick={() => sendCommand(0x10)} />
          <IconButton label="CURSOR →" onClick={() => sendCommand(0x14)} />
          <IconButton label="DISPLAY ←" onClick={() => sendCommand(0x18)} />
          <IconButton label="DISPLAY →" onClick={() => sendCommand(0x1C)} />
        </div>
      </div>

      {/* 3. HARDWARE UTILITIES */}
      <div>
        {label('SYSTEM CONTROL')}
        <div style={{ display: 'flex', gap: 8 }}>
          <IconButton label="RETURN HOME" onClick={() => sendCommand(0x02)} />
          <IconButton label="RESET" variant="danger" onClick={reset} />
          <IconButton 
            label={h?.fastMode ? "TURBO: ON" : "TURBO: OFF"} 
            variant={h?.fastMode ? "success" : "secondary"}
            onClick={() => updateConfig({ fastMode: !h?.fastMode })} 
          />
        </div>
      </div>

    </div>
  );
};
