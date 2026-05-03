// src/components/themes/ThemePreview.jsx
import React from 'react';
import { neonBlue } from '../../../infrastructure/themes/neonBlue';

const renderColors = (obj, path = []) => {
  return Object.entries(obj).map(([key, value]) => {
    const currentPath = [...path, key];
    if (typeof value === 'string') {
      return (
        <div
          key={currentPath.join('.')}
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '4px 0',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '24px',
              backgroundColor: value,
              border: '1px solid #000',
              marginRight: '8px',
            }}
          />
          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
            {currentPath.join('.')} → {value}
          </span>
        </div>
      );
    } else if (typeof value === 'object') {
      return (
        <div key={currentPath.join('.')} style={{ marginLeft: '10px' }}>
          <strong>{key}</strong>
          {renderColors(value, currentPath)}
        </div>
      );
    } else {
      return null;
    }
  });
};

export default function ThemePreview() {
  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
      <h1>Theme Preview: Neon Blue</h1>
      {renderColors(neonBlue)}
    </div>
  );
}
