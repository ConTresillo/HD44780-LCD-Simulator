/**
 * Primitive UI controls — ported design from frontend_old.
 * All theme-driven. No hardcoded colors.
 */
import React, { useState } from 'react';
import { useTheme } from '../../app/ThemeProvider';

// ── DataPin ───────────────────────────────────────────────────────────────────
export interface DataPinProps {
  label: string;
  active: boolean;
  onClick?: () => void;
}
export const DataPin: React.FC<DataPinProps> = ({ label, active, onClick }) => {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 40, height: 40,
        borderRadius: 6,
        border: `1px solid ${active ? theme.dataPin.activeBorder : hovered ? theme.dataPin.hoverBorder ?? theme.dataPin.inactiveBorder : theme.dataPin.inactiveBorder}`,
        background: theme.dataPin.inactiveBg,
        color: active ? theme.dataPin.activeText : hovered ? theme.dataPin.hoverText ?? theme.dataPin.inactiveText : theme.dataPin.inactiveText,
        boxShadow: active ? theme.dataPin.activeShadow : 'none',
        transform: active ? 'scale(1.06)' : hovered ? 'scale(1.02)' : 'scale(1)',
        fontFamily: theme.core.bodyFont,
        fontSize: 11,
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 160ms ease-out',
        userSelect: 'none',
      }}
    >
      {label}
    </button>
  );
};

// ── PulseButton ───────────────────────────────────────────────────────────────
export interface PulseButtonProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
}
export const PulseButton: React.FC<PulseButtonProps> = ({ label, isActive, onClick, fullWidth }) => {
  const { theme } = useTheme();
  const [st, setSt] = useState<'idle'|'hover'|'active'>('idle');

  const bg = st === 'active' ? theme.pulseButton.activeBg : st === 'hover' ? theme.pulseButton.hoverBg : theme.pulseButton.inactiveBg;
  const color = st === 'active' ? theme.pulseButton.activeText : st === 'hover' ? theme.pulseButton.hoverText : theme.pulseButton.inactiveText;
  const shadow = st === 'active' || isActive ? theme.pulseButton.activeShadow : 'none';

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setSt('hover')}
      onMouseLeave={() => setSt('idle')}
      onMouseDown={() => setSt('active')}
      onMouseUp={() => setSt('hover')}
      style={{
        width: fullWidth ? '100%' : 40, height: 40,
        borderRadius: 6,
        border: `1px solid ${theme.pulseButton.border}`,
        background: bg, color, boxShadow: shadow,
        fontFamily: theme.core.bodyFont,
        fontSize: 11, fontWeight: 'bold',
        cursor: 'pointer',
        transform: st === 'active' ? 'scale(1.04)' : 'scale(1)',
        transition: 'all 200ms ease-out',
        userSelect: 'none',
      }}
    >
      {label}
    </button>
  );
};

// ── IconButton ────────────────────────────────────────────────────────────────
export interface IconButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'danger' | 'success';
}
export const IconButton: React.FC<IconButtonProps> = ({ label, onClick, variant = 'default' }) => {
  const { theme } = useTheme();
  const [st, setSt] = useState<'idle'|'hover'|'active'>('idle');

  const bg = st === 'active' ? theme.iconButton.activeBg : st === 'hover' ? theme.iconButton.hoverBg : theme.iconButton.inactiveBg;
  const color = st === 'active' ? theme.iconButton.activeText : st === 'hover' ? theme.iconButton.hoverText : theme.iconButton.inactiveText;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setSt('hover')}
      onMouseLeave={() => setSt('idle')}
      onMouseDown={() => setSt('active')}
      onMouseUp={() => setSt('hover')}
      style={{
        padding: '8px 16px', borderRadius: 6,
        border: `1px solid ${theme.iconButton.border}`,
        background: bg, color,
        boxShadow: st === 'active' ? theme.iconButton.activeShadow : 'none',
        fontFamily: theme.core.bodyFont,
        fontSize: 11, fontWeight: 'bold', cursor: 'pointer',
        transform: st === 'active' ? 'scale(1.04)' : 'scale(1)',
        transition: 'all 300ms ease-out',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
};

// ── ToggleSwitch ──────────────────────────────────────────────────────────────
export interface ToggleSwitchProps {
  active: boolean;
  onClick: () => void;
}
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ active, onClick }) => {
  const { theme } = useTheme();
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 40, height: 20, borderRadius: 10,
        border: 'none',
        background: active ? theme.toggleSwitch.trackOn : theme.toggleSwitch.trackOff,
        boxShadow: active ? theme.toggleSwitch.glow : 'none',
        cursor: 'pointer', padding: '2px',
        display: 'flex', alignItems: 'center',
        transition: 'all 200ms',
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: 8,
        background: active ? theme.toggleSwitch.knobOn : theme.toggleSwitch.knobOff,
        transform: active ? 'translateX(20px)' : 'translateX(0)',
        transition: 'transform 200ms, background 200ms',
      }} />
    </button>
  );
};

// ── TextInput ─────────────────────────────────────────────────────────────────
export interface TextInputProps {
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  width?: number | string;
}
export const TextInput: React.FC<TextInputProps> = ({ value, placeholder, onChange, width = 120 }) => {
  const { theme } = useTheme();
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{
        width, padding: '6px 10px', borderRadius: 6,
        border: `1px solid ${theme.textInput.border}`,
        background: theme.textInput.background,
        color: theme.textInput.text,
        fontFamily: theme.core.bodyFont,
        fontSize: 12, outline: 'none',
        transition: 'border-color 150ms',
        '--ti-placeholder-color': theme.textInput.placeholder,
      } as React.CSSProperties}
      onFocus={e => e.target.style.borderColor = theme.textInput.focusBorder}
      onBlur={e => e.target.style.borderColor = theme.textInput.border}
    />
  );
};

// ── MenuDropdown ──────────────────────────────────────────────────────────────
export interface MenuDropdownProps {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
}
export const MenuDropdown: React.FC<MenuDropdownProps> = ({ value, options, onChange, disabled = false }) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    window.addEventListener('mousedown', h);
    return () => window.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        style={{
          width: '100%', padding: '7px 12px', borderRadius: 6,
          border: `1px solid ${disabled ? theme.menuDropdown.disabledBorder : theme.menuDropdown.border}`,
          background: disabled ? theme.menuDropdown.disabledBg : theme.menuDropdown.background,
          color: disabled ? theme.menuDropdown.disabledText : theme.menuDropdown.text,
          boxShadow: disabled ? 'none' : theme.menuDropdown.shadow,
          fontFamily: theme.core.bodyFont, fontSize: 12,
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          opacity: disabled ? 0.6 : 1,
          transition: 'all 150ms',
        }}
      >
        <span>{value}</span>
        <span style={{ opacity: 0.6, fontSize: 10 }}>{open ? '▴' : '▾'}</span>
      </button>
      {open && !disabled && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '100%', marginTop: 4,
          borderRadius: 6, border: `1px solid ${theme.menuDropdown.border}`,
          background: theme.menuDropdown.background,
          boxShadow: theme.menuDropdown.shadow,
          zIndex: 20, maxHeight: 200, overflowY: 'auto',
        }}>
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                width: '100%', textAlign: 'left',
                padding: '7px 12px', border: 'none',
                background: opt === value ? theme.menuDropdown.hoverBg : 'transparent',
                color: theme.menuDropdown.text,
                fontFamily: theme.core.bodyFont, fontSize: 12, cursor: 'pointer',
                transition: 'background 75ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = theme.menuDropdown.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = opt === value ? theme.menuDropdown.hoverBg : 'transparent')}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
