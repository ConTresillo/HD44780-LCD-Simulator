/**
 * LogPanel.tsx — Scrolling terminal-style log stream.
 */
import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { useLogs } from '../../hooks/useLogs';
import type { LogEntry } from '../../services/api.types';

export const LogPanel: React.FC = () => {
  const { theme } = useTheme();
  const logs = useLogs();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs.length]);

  const colorFor = (type: LogEntry['type']): string => {
    switch (type) {
      case 'COMMAND': return theme.log.commandColor;
      case 'DATA':    return theme.log.dataColor;
      case 'ERROR':   return theme.log.errorColor;
      case 'CONTROL': return theme.log.controlColor;
      case 'AI':      return theme.core.primary;
      default:        return theme.core.muted;
    }
  };

  return (
    <div style={{
      background: theme.log.background,
      display: 'flex', flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      <div style={{
        fontSize: 10, color: theme.log.commandColor,
        fontFamily: theme.core.headingFont,
        letterSpacing: '0.1em', padding: '12px 16px 8px',
        borderBottom: `1px solid ${theme.log.border}`,
        marginBottom: 8,
      }}>
        SYSTEM LOG
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '0 16px 12px' }}>
        {logs.length === 0 && (
          <div style={{ color: theme.core.muted, fontSize: 11, fontFamily: theme.core.bodyFont, paddingTop: 8 }}>
            Waiting for events…
          </div>
        )}
        {logs.map((entry, i) => {
          const ts = new Date(entry.timestamp).toISOString().slice(11, 23);
          return (
            <div key={i} style={{
              display: 'flex', gap: 10, alignItems: 'baseline',
              marginBottom: 3,
            }}>
              <span style={{ color: theme.log.timestampColor, fontSize: 10, fontFamily: theme.core.bodyFont, whiteSpace: 'nowrap' }}>
                {ts}
              </span>
              <span style={{
                color: colorFor(entry.type), fontSize: 10,
                fontFamily: theme.core.bodyFont, whiteSpace: 'nowrap',
                minWidth: 50,
              }}>
                [{entry.type}]
              </span>
              <span style={{ color: theme.core.secondary, fontSize: 11, fontFamily: theme.core.bodyFont }}>
                {entry.message}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
