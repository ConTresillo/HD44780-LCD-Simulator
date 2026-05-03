import React from 'react';
import type { GPIOTrace } from '../hooks/useLCD';

interface TimelineProps {
  traces: GPIOTrace[];
}

export const Timeline: React.FC<TimelineProps> = ({ traces }) => {
  return (
    <div style={{
      backgroundColor: '#111',
      padding: '1rem',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      overflowX: 'auto',
      maxHeight: '400px'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '80px 40px 40px 80px 80px 40px',
        borderBottom: '1px solid #333',
        paddingBottom: '0.5rem',
        marginBottom: '0.5rem',
        color: '#94a3b8'
      }}>
        <div>Timestamp</div>
        <div>RS</div>
        <div>EN</div>
        <div>Bus (Hex)</div>
        <div>Assembled</div>
        <div>Exec</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
        {traces.map((t, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '80px 40px 40px 80px 80px 40px',
            padding: '0.25rem 0',
            borderBottom: '1px solid #222',
            color: t.executed ? '#3b82f6' : '#eee'
          }}>
            <div style={{ color: '#64748b' }}>{new Date(t.timestamp).toLocaleTimeString([], { hour12: false, minute:'2-digit', second:'2-digit' })}.{t.timestamp % 1000}</div>
            <div>{t.rs ? '1' : '0'}</div>
            <div style={{ color: t.en ? '#ef4444' : '#22c55e' }}>{t.en ? 'H' : 'L'}</div>
            <div>
              {t.mode === '4bit' ? (t.data >> 4).toString(16).toUpperCase() : t.data.toString(16).toUpperCase().padStart(2, '0')}
              <span style={{ color: '#64748b', marginLeft: '4px' }}>
                ({t.nibblePhase || '-'})
              </span>
            </div>
            <div>
              {t.assembledByte !== null ? `0x${t.assembledByte.toString(16).toUpperCase().padStart(2, '0')}` : '-'}
            </div>
            <div style={{ textAlign: 'center' }}>{t.executed ? '│' : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
