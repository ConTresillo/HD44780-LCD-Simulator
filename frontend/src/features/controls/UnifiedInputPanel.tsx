/**
 * UnifiedInputPanel.tsx — Single entry point for all LCD interactions.
 * Mode-driven: ASCII (Data), HEX (Command), BIN (GPIO).
 */
import React, { useState } from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { TextInput, IconButton, MenuDropdown } from '../../components/controls';
import { useLCD } from '../../hooks/useLCD';

type InputMode = 'ASCII' | 'HEX' | 'BIN';

export const UnifiedInputPanel: React.FC = () => {
  const [mode, setMode] = useState<'ASCII' | 'HEX' | 'BIN'>('ASCII');

  return (
    <div style={{
      background: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: 12,
      padding: '16px',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 'bold' }}>MANUAL INJECTION</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['ASCII', 'HEX', 'BIN'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m as any)}
              style={{
                background: mode === m ? '#444' : '#222',
                color: '#fff',
                border: '1px solid #555',
                padding: '4px 8px',
                fontSize: 10,
                cursor: 'pointer'
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <input
        type="text"
        readOnly
        value={`MODE: ${mode}`}
        style={{
          width: '100%',
          background: '#000',
          color: '#0f0',
          border: '1px solid #333',
          padding: '8px',
          fontFamily: 'monospace'
        }}
      />
    </div>
  );
};
