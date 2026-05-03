/**
 * GpioPanel.tsx — Hardware-level pin manipulation.
 * 8-bit Data Bus + RS, RW, EN control.
 */
import React, { useState } from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { DataPin, ToggleSwitch, PulseButton, IconButton } from '../../components/controls';
import { useLCD } from '../../hooks/useLCD';

export const GpioPanel: React.FC = () => {
  const { theme } = useTheme();
  const { busState, setBusState } = useLCD();
  const { rs, rw, en } = busState;

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: 24,
      padding: '0 10px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <DataPin label="RS" active={rs} onClick={() => setBusState({ rs: !rs })} />
        <span style={{ fontSize: 9, fontWeight: 'bold', color: theme.core.muted }}>REG SEL</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <DataPin label="RW" active={rw} onClick={() => setBusState({ rw: !rw })} />
        <span style={{ fontSize: 9, fontWeight: 'bold', color: theme.core.muted }}>RD/WR</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <DataPin label="EN" active={en} onClick={() => setBusState({ en: !en })} />
        <span style={{ fontSize: 9, fontWeight: 'bold', color: theme.core.muted }}>ENABLE</span>
      </div>
    </div>
  );
};
