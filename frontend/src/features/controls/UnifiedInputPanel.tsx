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
  const { theme } = useTheme();
  const { pulseEN, busState, setBusState, hardware } = useLCD();
  const { data, rs, rw } = busState;
  const [mode, setMode] = useState<InputMode>('ASCII');
  
  // Local UI state for the text box to allow free typing/clearing
  const [inputValue, setInputValue] = useState('');

  // Sync Global -> Local (when pins change manually)
  React.useEffect(() => {
    const derived = mode === 'ASCII' 
      ? String.fromCharCode(data) 
      : mode === 'HEX' 
        ? `0x${data.toString(16).padStart(2, '0').toUpperCase()}` 
        : data.toString(2).padStart(8, '0');
    
    // Only update if it's different to avoid fighting the user
    if (derived !== inputValue && (mode !== 'HEX' || !inputValue.startsWith('0x'))) {
       setInputValue(derived);
    }
  }, [data, mode]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    
    if (mode === 'ASCII') {
      if (val.length > 0) {
        setBusState({ data: val.charCodeAt(0), rs: true });
      }
    } else if (mode === 'HEX') {
      const hex = val.startsWith('0x') ? val : `0x${val}`;
      const code = parseInt(hex, 16);
      if (!isNaN(code)) setBusState({ data: code, rs: false });
    } else if (mode === 'BIN') {
      const code = parseInt(val, 2);
      if (!isNaN(code) && val.length === 8) setBusState({ data: code });
    }
  };

  const handleExecute = () => {
    pulseEN(data, rs, rw);
  };

  const getPlaceholder = () => {
    if (mode === 'ASCII') return 'Enter character...';
    if (mode === 'HEX') return 'Enter hex (e.g. 0x01)';
    return 'Enter data byte';
  };

  // Hardware constraints: Disable if Busy
  const isBusy = hardware?.busyFlag ?? false;
  // Read mode constraint (simplified check: if RW is high)
  const isReadMode = rw;

  return (
    <div style={{
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      padding: '20px 32px',
      background: theme.panel.background,
      border: `1px solid ${theme.panel.border}`,
      borderRadius: 100, // Pill shape
      boxShadow: theme.navbar.headingShadow,
      opacity: isReadMode ? 0.6 : 1,
      pointerEvents: isReadMode ? 'none' : 'auto',
    }}>
      <div style={{ width: 100 }}>
        <MenuDropdown 
          value={mode} 
          options={['ASCII', 'HEX', 'BIN']} 
          onChange={(v) => setMode(v as InputMode)} 
        />
      </div>

      <TextInput 
        value={inputValue} 
        onChange={handleInputChange} 
        placeholder={getPlaceholder()} 
        width={240}
      />

      <IconButton 
        label="EXECUTE" 
        onClick={handleExecute}
        variant={isBusy ? 'danger' : 'success'}
      />
      
      {isReadMode && (
        <span style={{ fontSize: 10, color: theme.log.errorColor, fontFamily: theme.core.headingFont }}>
          READ MODE ACTIVE (UI LOCKED)
        </span>
      )}
    </div>
  );
};
