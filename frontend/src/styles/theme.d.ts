/**
 * theme.ts — Central theme type and all theme definitions.
 * NO scattered colors anywhere else. All UI tokens live here.
 */
export interface Theme {
    id: string;
    name: string;
    core: {
        background: string;
        surface: string;
        surfaceAlt: string;
        border: string;
        primary: string;
        secondary: string;
        muted: string;
        headingFont: string;
        bodyFont: string;
    };
    navbar: {
        background: string;
        border: string;
        heading: string;
        headingShadow: string;
    };
    panel: {
        background: string;
        border: string;
        label: string;
        heading: string;
    };
    lcd: {
        bezel: string;
        bezelBorder: string;
        bezelShadow: string;
        glass: string;
        pixelOn: string;
        pixelOff: string;
        cursorColor: string;
        font: string;
    };
    dataPin: {
        inactiveBg: string;
        inactiveBorder: string;
        inactiveText: string;
        activeBorder: string;
        activeText: string;
        activeShadow: string;
        hoverBorder?: string;
        hoverText?: string;
    };
    pulseButton: {
        inactiveBg: string;
        inactiveText: string;
        hoverBg: string;
        hoverText: string;
        activeBg: string;
        activeText: string;
        activeShadow: string;
        border: string;
    };
    iconButton: {
        inactiveBg: string;
        inactiveText: string;
        hoverBg: string;
        hoverText: string;
        activeBg: string;
        activeText: string;
        activeShadow: string;
        border: string;
    };
    toggleSwitch: {
        trackOn: string;
        trackOff: string;
        knobOn: string;
        knobOff: string;
        glow: string;
    };
    textInput: {
        background: string;
        border: string;
        text: string;
        placeholder: string;
        focusBorder: string;
    };
    menuDropdown: {
        background: string;
        border: string;
        text: string;
        hoverBg: string;
        shadow: string;
        disabledBg: string;
        disabledBorder: string;
        disabledText: string;
    };
    statusBadge: {
        readyBg: string;
        readyText: string;
        busyBg: string;
        busyText: string;
        connectedBg: string;
        connectedText: string;
        disconnectedBg: string;
        disconnectedText: string;
    };
    log: {
        background: string;
        border: string;
        commandColor: string;
        dataColor: string;
        errorColor: string;
        controlColor: string;
        timestampColor: string;
    };
    diagnostic: {
        background: string;
        border: string;
        text: string;
        label: string;
        value: string;
        shadow: string;
    };
}
export declare const neonBlue: Theme;
export declare const classicGreen: Theme;
export declare const THEMES: Theme[];
//# sourceMappingURL=theme.d.ts.map