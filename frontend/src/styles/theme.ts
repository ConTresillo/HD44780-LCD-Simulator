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

// ── Neon Blue theme ──────────────────────────────────────────────────────────
export const neonBlue: Theme = {
  id: 'neonBlue',
  name: 'Neon Blue',

  core: {
    background: '#080c14',
    surface: '#0f1724',
    surfaceAlt: '#131d2e',
    border: '#1e2d45',
    primary: '#c8d8f0',
    secondary: '#7a9fc0',
    muted: '#3a5070',
    headingFont: "'Orbitron', sans-serif",
    bodyFont: "'Share Tech Mono', monospace",
  },

  navbar: {
    background: '#0a1020',
    border: '#1e2d45',
    heading: '#38bdf8',
    headingShadow: '0 0 18px #38bdf860',
  },

  panel: {
    background: '#0f1724',
    border: '#1e2d45',
    label: '#4a6a90',
    heading: '#38bdf8',
  },

  lcd: {
    bezel: '#0d1f0d',
    bezelBorder: '#1a3a1a',
    bezelShadow: '0 0 40px #00ff4130, inset 0 0 20px #00000080',
    glass: '#0a1a0a',
    pixelOn: '#39ff14',
    pixelOff: '#0d2a0d',
    cursorColor: '#39ff14',
    font: "'VT323', monospace",
  },

  dataPin: {
    inactiveBg: '#0f1724',
    inactiveBorder: '#1e2d45',
    inactiveText: '#4a6a90',
    activeBorder: '#38bdf8',
    activeText: '#080c14',
    activeShadow: '0 0 8px #38bdf880',
    hoverBorder: '#2a5070',
    hoverText: '#7ab8d8',
  },

  pulseButton: {
    inactiveBg: '#0f1724',
    inactiveText: '#4a6a90',
    hoverBg: '#131d2e',
    hoverText: '#7ab8d8',
    activeBg: '#0d2a45',
    activeText: '#38bdf8',
    activeShadow: '0 0 12px #38bdf860',
    border: '#1e2d45',
  },

  iconButton: {
    inactiveBg: '#0f1724',
    inactiveText: '#4a6a90',
    hoverBg: '#131d2e',
    hoverText: '#7ab8d8',
    activeBg: '#0d2a45',
    activeText: '#38bdf8',
    activeShadow: '0 0 10px #38bdf850',
    border: '#1e2d45',
  },

  toggleSwitch: {
    trackOn: '#0ea5e9',
    trackOff: '#1e2d45',
    knobOn: '#ffffff',
    knobOff: '#4a6a90',
    glow: '0 0 8px #0ea5e980',
  },

  textInput: {
    background: '#080c14',
    border: '#1e2d45',
    text: '#c8d8f0',
    placeholder: '#3a5070',
    focusBorder: '#38bdf8',
  },

  menuDropdown: {
    background: '#0f1724',
    border: '#1e2d45',
    text: '#c8d8f0',
    hoverBg: '#131d2e',
    shadow: '0 8px 24px #00000080',
    disabledBg: '#080c14',
    disabledBorder: '#141e2e',
    disabledText: '#2a3a50',
  },

  statusBadge: {
    readyBg: '#052e1680',
    readyText: '#4ade80',
    busyBg: '#450a0a80',
    busyText: '#f87171',
    connectedBg: '#0c4a6e80',
    connectedText: '#38bdf8',
    disconnectedBg: '#1c1917',
    disconnectedText: '#78716c',
  },

  log: {
    background: '#060a10',
    border: '#1e2d45',
    commandColor: '#38bdf8',
    dataColor: '#4ade80',
    errorColor: '#f87171',
    controlColor: '#fbbf24',
    timestampColor: '#3a5070',
  },

  diagnostic: {
    background: '#0a1020f0',
    border: '#38bdf840',
    text: '#38bdf8',
    label: '#3a5070',
    value: '#ffffff',
    shadow: '0 12px 32px #00000080',
  },
};

// ── Classic Green theme ──────────────────────────────────────────────────────
export const classicGreen: Theme = {
  id: 'classicGreen',
  name: 'Classic Green',

  core: {
    background: '#060d06',
    surface: '#0a150a',
    surfaceAlt: '#0d1a0d',
    border: '#1a3a1a',
    primary: '#a8d8a8',
    secondary: '#5a9a5a',
    muted: '#2a4a2a',
    headingFont: "'Orbitron', sans-serif",
    bodyFont: "'Share Tech Mono', monospace",
  },

  navbar: {
    background: '#080e08',
    border: '#1a3a1a',
    heading: '#39ff14',
    headingShadow: '0 0 18px #39ff1460',
  },

  panel: {
    background: '#0a150a',
    border: '#1a3a1a',
    label: '#3a6a3a',
    heading: '#39ff14',
  },

  lcd: {
    bezel: '#0d1f0d',
    bezelBorder: '#1a3a1a',
    bezelShadow: '0 0 40px #39ff1430, inset 0 0 20px #00000080',
    glass: '#0a1a0a',
    pixelOn: '#39ff14',
    pixelOff: '#0d2a0d',
    cursorColor: '#39ff14',
    font: "'VT323', monospace",
  },

  dataPin: {
    inactiveBg: '#0a150a',
    inactiveBorder: '#1a3a1a',
    inactiveText: '#3a6a3a',
    activeBorder: '#39ff14',
    activeText: '#060d06',
    activeShadow: '0 0 8px #39ff1480',
    hoverBorder: '#2a5a2a',
    hoverText: '#6abf6a',
  },

  pulseButton: {
    inactiveBg: '#0a150a',
    inactiveText: '#3a6a3a',
    hoverBg: '#0d1a0d',
    hoverText: '#6abf6a',
    activeBg: '#0d2a0d',
    activeText: '#39ff14',
    activeShadow: '0 0 12px #39ff1460',
    border: '#1a3a1a',
  },

  iconButton: {
    inactiveBg: '#0a150a',
    inactiveText: '#3a6a3a',
    hoverBg: '#0d1a0d',
    hoverText: '#6abf6a',
    activeBg: '#0d2a0d',
    activeText: '#39ff14',
    activeShadow: '0 0 10px #39ff1450',
    border: '#1a3a1a',
  },

  toggleSwitch: {
    trackOn: '#16a34a',
    trackOff: '#1a3a1a',
    knobOn: '#ffffff',
    knobOff: '#3a6a3a',
    glow: '0 0 8px #16a34a80',
  },

  textInput: {
    background: '#060d06',
    border: '#1a3a1a',
    text: '#a8d8a8',
    placeholder: '#2a4a2a',
    focusBorder: '#39ff14',
  },

  menuDropdown: {
    background: '#0a150a',
    border: '#1a3a1a',
    text: '#a8d8a8',
    hoverBg: '#0d1a0d',
    shadow: '0 8px 24px #00000080',
    disabledBg: '#060d06',
    disabledBorder: '#0f1f0f',
    disabledText: '#1a3a1a',
  },

  statusBadge: {
    readyBg: '#14532d80',
    readyText: '#4ade80',
    busyBg: '#450a0a80',
    busyText: '#f87171',
    connectedBg: '#14532d80',
    connectedText: '#39ff14',
    disconnectedBg: '#1c1917',
    disconnectedText: '#78716c',
  },

  log: {
    background: '#040a04',
    border: '#1a3a1a',
    commandColor: '#39ff14',
    dataColor: '#86efac',
    errorColor: '#f87171',
    controlColor: '#fbbf24',
    timestampColor: '#2a4a2a',
  },

  diagnostic: {
    background: '#040a04f0',
    border: '#39ff1440',
    text: '#39ff14',
    label: '#2a4a2a',
    value: '#a8d8a8',
    shadow: '0 12px 32px #00000080',
  },
};

export const THEMES: Theme[] = [neonBlue, classicGreen];
