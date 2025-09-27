import React from 'react';

// Simple test app with just basic structure
export default function SimpleApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px', 
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        Honeywell Terminal Manager - Simple Test
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Dashboard</h2>
        <p>✅ React is rendering correctly</p>
        <p>✅ CSS styles are working</p>
        <p>✅ Basic structure is functional</p>
        
        <button 
          style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
          onClick={() => alert('Navigation would work here!')}
        >
          Test Navigation
        </button>
      </div>
    </div>
  );
}