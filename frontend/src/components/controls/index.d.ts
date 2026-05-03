/**
 * Primitive UI controls — ported design from frontend_old.
 * All theme-driven. No hardcoded colors.
 */
import React from 'react';
export interface DataPinProps {
    label: string;
    active: boolean;
    onClick?: () => void;
}
export declare const DataPin: React.FC<DataPinProps>;
export interface PulseButtonProps {
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    fullWidth?: boolean;
    style?: React.CSSProperties;
}
export declare const PulseButton: React.FC<PulseButtonProps>;
export interface IconButtonProps {
    label: string;
    onClick?: () => void;
    variant?: 'default' | 'danger' | 'success';
    style?: React.CSSProperties;
}
export declare const IconButton: React.FC<IconButtonProps>;
export interface ToggleSwitchProps {
    active: boolean;
    onClick: () => void;
}
export declare const ToggleSwitch: React.FC<ToggleSwitchProps>;
export interface TextInputProps {
    value: string;
    placeholder?: string;
    onChange: (v: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    width?: number | string;
}
export declare const TextInput: React.FC<TextInputProps>;
export interface MenuDropdownProps {
    value: string;
    options: string[];
    onChange: (v: string) => void;
    disabled?: boolean;
}
export declare const MenuDropdown: React.FC<MenuDropdownProps>;
//# sourceMappingURL=index.d.ts.map