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
  const { rs, rw } = busState;

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        {label('SIGNAL PINS')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontFamily: theme.core.bodyFont }}>RS (Register Select)</span>
            <ToggleSwitch active={rs} onClick={() => setBusState({ rs: !rs })} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontFamily: theme.core.bodyFont }}>RW (Read / Write)</span>
            <ToggleSwitch active={rw} onClick={() => setBusState({ rw: !rw })} />
          </div>
        </div>
      </div>
    </div>
  );
};
