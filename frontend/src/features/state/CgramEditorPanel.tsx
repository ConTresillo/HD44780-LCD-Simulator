/**
 * CgramEditorPanel.tsx — High-fidelity CGRAM Editor.
 * Uniformly styled with the core design system.
 */
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { useLCD } from '../../hooks/useLCD';
import { IconButton, TextInput } from '../../components/controls';

// --- PIXEL COMPONENT (Uniform with BusBit) ---
const PixelCell: React.FC<{
  isActive: boolean;
  onClick: () => void;
  theme: any;
}> = ({ isActive, onClick, theme }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: 22,
        height: 22,
        background: isActive ? theme.core.primary : isHovered ? `${theme.core.primary}22` : theme.core.background,
        border: `1px solid ${isActive ? theme.core.primary : isHovered ? theme.core.primary : theme.panel.border}`,
        borderRadius: 4,
        cursor: 'pointer',
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isActive ? `0 0 12px ${theme.core.primary}66` : isHovered ? `0 0 8px ${theme.core.primary}33` : 'none',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        zIndex: isHovered ? 2 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Subtle indicator for OFF state */}
      {!isActive && <div style={{ width: 2, height: 2, background: theme.core.muted, borderRadius: '50%', opacity: isHovered ? 1 : 0.2 }} />}
    </div>
  );
};

export const CgramEditorPanel: React.FC = () => {
  const { theme } = useTheme();
  const { view, sendCommand, writeData } = useLCD();
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [localGlyphs, setLocalGlyphs] = useState<number[][]>(new Array(8).fill(null).map(() => new Array(8).fill(0)));
  const [isDirty, setIsDirty] = useState(new Array(8).fill(false));
  const [isSaving, setIsSaving] = useState(false);

  // Sync from hardware when data arrives, but ONLY for indices that aren't "dirty" (locally edited)
  useEffect(() => {
    if (view?.glyphs) {
      setLocalGlyphs(prev => {
        const next = [...prev];
        view.glyphs.forEach((glyph, idx) => {
          if (!isDirty[idx]) {
            next[idx] = glyph.map(row => {
              let byte = 0;
              row.forEach((pixel, col) => {
                if (pixel) byte |= (1 << (4 - col));
              });
              return byte;
            });
          }
        });
        return next;
      });
    }
  }, [view?.glyphs]);

  const togglePixel = (rowIdx: number, colIdx: number) => {
    const nextGlyphs = [...localGlyphs];
    const glyph = [...nextGlyphs[selectedIndex]];
    glyph[rowIdx] ^= (1 << (4 - colIdx));
    nextGlyphs[selectedIndex] = glyph;
    setLocalGlyphs(nextGlyphs);
    
    const nextDirty = [...isDirty];
    nextDirty[selectedIndex] = true;
    setIsDirty(nextDirty);
  };

  const handleHexChange = (rowIdx: number, val: string) => {
    const hex = val.replace(/[^0-9a-fA-F]/g, '');
    const parsed = parseInt(hex, 16);
    if (!isNaN(parsed)) {
      const nextGlyphs = [...localGlyphs];
      const glyph = [...nextGlyphs[selectedIndex]];
      glyph[rowIdx] = parsed & 0x1F;
      nextGlyphs[selectedIndex] = glyph;
      setLocalGlyphs(nextGlyphs);

      const nextDirty = [...isDirty];
      nextDirty[selectedIndex] = true;
      setIsDirty(nextDirty);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      // 1. SELECT CGRAM LOCATION (0x40 + slot * 8)
      const slotAddr = 0x40 + (selectedIndex * 8);
      await sendCommand(slotAddr);

      // 2. STREAM 8 BYTES (Pattern rows)
      for (let i = 0; i < 8; i++) {
        await writeData(localGlyphs[selectedIndex][i]);
        // Mechanical delay for simulator fidelity
        await new Promise(r => setTimeout(r, 30));
      }

      // 3. RETURN TO DDRAM (0x80)
      await sendCommand(0x80);

      // Mark as pristine
      const nextDirty = [...isDirty];
      nextDirty[selectedIndex] = false;
      setIsDirty(nextDirty);
    } catch (err) {
      console.error('CGRAM Latch Error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // --- UNIFORM STYLING HELPERS ---
  const sectionLabel = (text: string) => (
    <div style={{ 
      fontSize: 9, fontWeight: 800, opacity: 0.5, marginBottom: 12, 
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color: theme.panel.label, fontFamily: theme.core.headingFont
    }}>
      {text}
    </div>
  );

  const cardStyle: React.CSSProperties = {
    background: `${theme.core.surfaceAlt}88`,
    backdropFilter: 'blur(8px)',
    border: `1px solid ${theme.panel.border}`,
    borderRadius: 14, padding: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    display: 'flex', flexDirection: 'column', gap: 12
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* 1. SELECTOR CARD */}
      <div style={cardStyle}>
        {sectionLabel('CGRAM Selector')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map(idx => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              style={{
                padding: '6px',
                background: selectedIndex === idx ? `${theme.core.primary}22` : 'transparent',
                border: `1px solid ${selectedIndex === idx ? theme.core.primary : theme.panel.border}`,
                borderRadius: 8, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                transition: 'all 200ms ease', position: 'relative'
              }}
            >
              {isDirty[idx] && <div style={{ position: 'absolute', top: -3, right: -3, width: 6, height: 6, background: theme.core.secondary, borderRadius: '50%', boxShadow: `0 0 5px ${theme.core.secondary}` }} />}
              <div style={{ fontSize: 7, color: theme.core.muted, fontWeight: 900 }}>0x0{idx}</div>
              <MiniPreview bitmap={localGlyphs[idx]} theme={theme} scale={1.5} />
            </button>
          ))}
        </div>
      </div>

      {/* 2. EDITOR CARD */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          {sectionLabel(`Editing 0x0${selectedIndex}`)}
          {isDirty[selectedIndex] && <span style={{ fontSize: 7, fontWeight: 900, color: theme.core.secondary, letterSpacing: '0.05em' }}>UNSAVED</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {localGlyphs[selectedIndex].map((rowByte, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 7, fontWeight: 900, color: theme.core.muted, width: 12, opacity: 0.5 }}>R{rowIdx}</div>
              
              <div style={{ display: 'flex', gap: 3 }}>
                {[0, 1, 2, 3, 4].map(colIdx => (
                  <PixelCell
                    key={colIdx}
                    isActive={!!((rowByte >> (4 - colIdx)) & 1)}
                    onClick={() => togglePixel(rowIdx, colIdx)}
                    theme={theme}
                  />
                ))}
              </div>

              <div style={{ flex: 1 }} />

              <TextInput 
                value={rowByte.toString(16).toUpperCase().padStart(2, '0')}
                onChange={(v) => handleHexChange(rowIdx, v)}
                width={36}
              />
            </div>
          ))}
        </div>

        <IconButton 
          label={isSaving ? "WRITING..." : "LATCH TO HARDWARE"} 
          variant={isDirty[selectedIndex] ? "success" : "default"}
          onClick={handleSave}
          style={{ width: '100%', marginTop: 8 }}
        />
      </div>

      <div style={{ padding: '0 8px', fontSize: 8, color: theme.core.muted, lineHeight: 1.5, textAlign: 'center', opacity: 0.7 }}>
        <b>Protocol:</b> Set CGRAM Addr (0x40) → Stream 8 Rows → Return to DDRAM (0x80).
      </div>

    </div>
  );
};

const MiniPreview: React.FC<{ bitmap: number[], theme: any, scale: number }> = ({ bitmap, theme, scale }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {bitmap.map((row, r) => (
        <div key={r} style={{ display: 'flex', gap: 0.5 }}>
          {[4, 3, 2, 1, 0].map(c => (
            <div
              key={c}
              style={{
                width: scale,
                height: scale,
                background: (row >> c) & 1 ? theme.core.primary : theme.core.muted,
                borderRadius: 0.2,
                opacity: (row >> c) & 1 ? 1 : 0.1
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
