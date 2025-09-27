import React from 'react';

export default function DebugApp() {
  return (
    <div style={{ padding: '20px', fontSize: '18px' }}>
      <h1>Debug App - Testing Render</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => alert('Click works!')}>Test Button</button>
    </div>
  );
}