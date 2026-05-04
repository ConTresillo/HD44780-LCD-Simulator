import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/index';
import { useTheme } from '../../app/ThemeProvider';

interface Message {
  id: number;
  sender: 'user' | 'ai' | 'system';
  text: string;
}

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'system', text: 'Secure link established. How can I assist you with the LCD?' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribe = api.onLog((log) => {
      if (log.type === 'AI') {
        let text = log.message;
        if (text.startsWith('Received remote prompt:')) return; // hide internal echo
        if (text.startsWith('Remote AI response:')) text = text.replace('Remote AI response: ', '');
        setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text }]);
      } else if (log.type === 'ERROR' && log.message.includes('AI')) {
        setMessages(prev => [...prev, { id: Date.now(), sender: 'system', text: log.message }]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: input }]);
    api.sendAIRequest(input);
    setInput('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      color: theme.core.primary,
      fontFamily: theme.core.bodyFont
    }}>
      {/* HEADER */}
      <div style={{
        padding: '16px 20px',
        borderBottom: `1px solid ${theme.panel.border}80`,
        background: `${theme.core.surface}80`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ 
          width: 32, height: 32, borderRadius: 16, 
          background: theme.core.primary, color: theme.core.background,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: 16
        }}>✨</div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600 }}>LCD Assistant</div>
          <div style={{ fontSize: '12px', color: theme.core.primary, display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: theme.core.primary, boxShadow: `0 0 8px ${theme.core.primary}` }} />
            Online
          </div>
        </div>
      </div>
      
      {/* MESSAGE STREAM */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none'  // IE
      }}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSys = msg.sender === 'system';
          return (
            <div key={msg.id} style={{
              alignSelf: isUser ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isUser ? 'flex-end' : 'flex-start',
              gap: 4
            }}>
              <div style={{
                padding: isSys ? '8px 12px' : '10px 14px',
                borderRadius: '16px',
                borderBottomRightRadius: isUser ? '4px' : '16px',
                borderBottomLeftRadius: (!isUser && !isSys) ? '4px' : '16px',
                background: isUser ? theme.core.primary : isSys ? 'transparent' : theme.core.background,
                color: isUser ? theme.core.background : isSys ? theme.core.muted : theme.core.primary,
                border: isSys ? `1px solid ${theme.panel.border}` : `1px solid ${isUser ? theme.core.primary : theme.panel.border}`,
                fontSize: isSys ? '12px' : '14px',
                lineHeight: 1.4,
                boxShadow: isUser ? `0 4px 12px ${theme.core.primary}40` : `0 4px 12px rgba(0,0,0,0.1)`
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* INPUT ZONE */}
      <div style={{
        padding: '16px',
        background: `${theme.core.surface}A0`,
        borderTop: `1px solid ${theme.panel.border}80`,
      }}>
        <form onSubmit={handleSend} style={{
          display: 'flex',
          gap: '8px',
          background: theme.core.background,
          padding: '4px 4px 4px 16px',
          borderRadius: '24px',
          border: `1px solid ${theme.panel.border}`,
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = theme.core.primary}
        onBlur={(e) => e.currentTarget.style.borderColor = theme.panel.border}
        >
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me to do something..."
            autoComplete="off"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: theme.core.primary,
              fontSize: '14px',
              fontFamily: theme.core.bodyFont
            }}
          />
          <button type="submit" style={{
            width: 36, height: 36, borderRadius: 18,
            border: 'none',
            background: input.trim() ? theme.core.primary : theme.panel.border,
            color: theme.core.background,
            cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            transition: 'all 0.2s',
            transform: input.trim() ? 'scale(1)' : 'scale(0.9)',
            opacity: input.trim() ? 1 : 0.6
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
