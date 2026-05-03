import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Primitive UI controls — ported design from frontend_old.
 * All theme-driven. No hardcoded colors.
 */
import React, { useState } from 'react';
import { useTheme } from '../../app/ThemeProvider';
export const DataPin = ({ label, active, onClick }) => {
    const { theme } = useTheme();
    const [hovered, setHovered] = useState(false);
    return (_jsx("button", { type: "button", onClick: onClick, onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), style: {
            width: 40, height: 40,
            borderRadius: 8,
            border: `1px solid ${active ? theme.dataPin.activeBorder : hovered ? (theme.dataPin.hoverBorder || theme.dataPin.inactiveBorder) : theme.dataPin.inactiveBorder}`,
            background: active ? theme.dataPin.activeBorder : theme.dataPin.inactiveBg,
            color: active ? theme.dataPin.activeText : hovered ? (theme.dataPin.hoverText || theme.dataPin.inactiveText) : theme.dataPin.inactiveText,
            boxShadow: active ? theme.dataPin.activeShadow : hovered ? `0 0 10px ${theme.core.border}` : 'none',
            transform: active ? 'scale(1.08)' : hovered ? 'scale(1.15)' : 'scale(1)',
            fontFamily: theme.core.bodyFont,
            fontSize: 12,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            userSelect: 'none',
        }, children: label }));
};
export const PulseButton = ({ label, isActive, onClick, fullWidth, style }) => {
    const { theme } = useTheme();
    const [st, setSt] = useState('idle');
    const bg = st === 'active' ? theme.pulseButton.activeBg : st === 'hover' ? theme.pulseButton.hoverBg : theme.pulseButton.inactiveBg;
    const color = st === 'active' ? theme.pulseButton.activeText : st === 'hover' ? theme.pulseButton.hoverText : theme.pulseButton.inactiveText;
    const shadow = st === 'active' || isActive ? theme.pulseButton.activeShadow : 'none';
    return (_jsx("button", { type: "button", onClick: onClick, onMouseEnter: () => setSt('hover'), onMouseLeave: () => setSt('idle'), onMouseDown: () => setSt('active'), onMouseUp: () => setSt('hover'), style: {
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
            ...style
        }, children: label }));
};
export const IconButton = ({ label, onClick, variant = 'default', style }) => {
    const { theme } = useTheme();
    const [st, setSt] = useState('idle');
    const bg = st === 'active' ? theme.iconButton.activeBg : st === 'hover' ? theme.iconButton.hoverBg : theme.iconButton.inactiveBg;
    const color = st === 'active' ? theme.iconButton.activeText : st === 'hover' ? theme.iconButton.hoverText : theme.iconButton.inactiveText;
    return (_jsx("button", { type: "button", onClick: onClick, onMouseEnter: () => setSt('hover'), onMouseLeave: () => setSt('idle'), onMouseDown: () => setSt('active'), onMouseUp: () => setSt('hover'), style: {
            padding: '8px 16px', borderRadius: 6,
            border: `1px solid ${theme.iconButton.border}`,
            background: bg, color,
            boxShadow: st === 'active' ? theme.iconButton.activeShadow : st === 'hover' ? `0 0 10px ${theme.core.primary}40` : 'none',
            fontFamily: theme.core.bodyFont,
            fontSize: 11, fontWeight: 'bold', cursor: 'pointer',
            transform: st === 'active' ? 'scale(0.96)' : st === 'hover' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 200ms ease-out',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            ...style
        }, children: label }));
};
export const ToggleSwitch = ({ active, onClick }) => {
    const { theme } = useTheme();
    return (_jsx("button", { type: "button", onClick: onClick, style: {
            width: 40, height: 20, borderRadius: 10,
            border: 'none',
            background: active ? theme.toggleSwitch.trackOn : theme.toggleSwitch.trackOff,
            boxShadow: active ? theme.toggleSwitch.glow : 'none',
            cursor: 'pointer', padding: '2px',
            display: 'flex', alignItems: 'center',
            transition: 'all 200ms',
        }, children: _jsx("div", { style: {
                width: 16, height: 16, borderRadius: 8,
                background: active ? theme.toggleSwitch.knobOn : theme.toggleSwitch.knobOff,
                transform: active ? 'translateX(20px)' : 'translateX(0)',
                transition: 'transform 200ms, background 200ms',
            } }) }));
};
export const TextInput = ({ value, placeholder, onChange, onFocus, onBlur, width = 120 }) => {
    const { theme } = useTheme();
    return (_jsx("input", { type: "text", value: value, placeholder: placeholder, onChange: e => onChange(e.target.value), style: {
            width, padding: '6px 10px', borderRadius: 6,
            border: `1px solid ${theme.textInput.border}`,
            background: theme.textInput.background,
            color: theme.textInput.text,
            fontFamily: theme.core.bodyFont,
            fontSize: 12, outline: 'none',
            transition: 'border-color 150ms',
            '--ti-placeholder-color': theme.textInput.placeholder,
        }, onFocus: e => {
            e.target.style.borderColor = theme.textInput.focusBorder;
            onFocus?.();
        }, onBlur: e => {
            e.target.style.borderColor = theme.textInput.border;
            onBlur?.();
        } }));
};
export const MenuDropdown = ({ value, options, onChange, disabled = false }) => {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
        const h = (e) => { if (!ref.current?.contains(e.target))
            setOpen(false); };
        window.addEventListener('mousedown', h);
        return () => window.removeEventListener('mousedown', h);
    }, []);
    return (_jsxs("div", { ref: ref, style: { position: 'relative', width: '100%' }, children: [_jsxs("button", { type: "button", disabled: disabled, onClick: () => !disabled && setOpen(o => !o), style: {
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
                }, children: [_jsx("span", { children: value }), _jsx("span", { style: { opacity: 0.6, fontSize: 10 }, children: open ? '▴' : '▾' })] }), open && !disabled && (_jsx("div", { style: {
                    position: 'absolute', left: 0, right: 0, top: '100%', marginTop: 4,
                    borderRadius: 6, border: `1px solid ${theme.menuDropdown.border}`,
                    background: theme.menuDropdown.background,
                    boxShadow: theme.menuDropdown.shadow,
                    zIndex: 20, maxHeight: 200, overflowY: 'auto',
                }, children: options.map(opt => (_jsx("button", { type: "button", onClick: () => { onChange(opt); setOpen(false); }, style: {
                        width: '100%', textAlign: 'left',
                        padding: '7px 12px', border: 'none',
                        background: opt === value ? theme.menuDropdown.hoverBg : 'transparent',
                        color: theme.menuDropdown.text,
                        fontFamily: theme.core.bodyFont, fontSize: 12, cursor: 'pointer',
                        transition: 'background 75ms',
                    }, onMouseEnter: e => (e.currentTarget.style.background = theme.menuDropdown.hoverBg), onMouseLeave: e => (e.currentTarget.style.background = opt === value ? theme.menuDropdown.hoverBg : 'transparent'), children: opt }, opt))) }))] }));
};
//# sourceMappingURL=index.js.map