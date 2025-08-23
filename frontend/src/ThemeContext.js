// src/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const themes = {
  light: {
    primary: '#E8B4CB',
    secondary: '#F7E7CE', 
    accent: '#C8A8E9',
    background: 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)',
    surface: '#FFFFFF',
    text: '#2C3E50',
    textSecondary: '#6C757D',
    border: '#E9ECEF',
    shadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  dark: {
    primary: '#FF6B9D',
    secondary: '#45A29E',
    accent: '#FFC947', 
    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
    surface: '#16213E',
    text: '#EAEAEA',
    textSecondary: '#B0B0B0', 
    border: '#0F3460',
    shadow: '0 4px 20px rgba(255,255,255,0.1)'
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('outfique-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-background', themes[theme].background);
    document.documentElement.style.setProperty('--theme-primary', themes[theme].primary);
    document.documentElement.style.setProperty('--theme-surface', themes[theme].surface);
    document.documentElement.style.setProperty('--theme-text', themes[theme].text);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('outfique-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
