// src/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const lightPalette = {
  name: 'light',
  // Baby pink theme
  background: '#FFE6F2',         // very soft baby pink page bg
  backgroundAccent: '#FFD6EA',   // slightly deeper pink for surfaces
  primary: '#FF6FA3',            // accent (buttons/active)
  surface: '#FFFFFF',            // cards/surfaces
  text: '#2C2C2C',               // main text
  textSecondary: '#6B7280',      // secondary text
  border: 'rgba(0,0,0,0.08)',    // borders
  shadow: '0 8px 24px rgba(0,0,0,0.08)',
  // Optional gradient for hero or page wash
  pageGradient: 'linear-gradient(180deg, #FFEAF5 0%, #FFE6F2 40%, #FFFFFF 100%)'
};

const darkPalette = {
  name: 'dark',
  // Violet-blue theme
  background: '#0F1446',         // deep indigo/violet-blue
  backgroundAccent: '#181E5A',   // surface alt
  primary: '#7C8CFF',            // accent (buttons/active)
  surface: '#141A4E',            // cards/surfaces
  text: '#EAEAF7',               // main text
  textSecondary: '#B8B9D6',      // secondary text
  border: 'rgba(255,255,255,0.12)',
  shadow: '0 10px 28px rgba(0,0,0,0.45)',
  pageGradient: 'linear-gradient(180deg, #101653 0%, #0F1446 60%, #0D123F 100%)'
};

const themes = { light: lightPalette, dark: darkPalette };

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('outfique-theme') || 'light');

  useEffect(() => {
    const t = themes[theme] || lightPalette;

    // Expose CSS variables globally for CSS files
    const root = document.documentElement;
    root.style.setProperty('--bg', t.background);
    root.style.setProperty('--bg-accent', t.backgroundAccent);
    root.style.setProperty('--page-gradient', t.pageGradient);
    root.style.setProperty('--primary', t.primary);
    root.style.setProperty('--surface', t.surface);
    root.style.setProperty('--text', t.text);
    root.style.setProperty('--text-secondary', t.textSecondary);
    root.style.setProperty('--border', t.border);

    // Also apply body background so full page changes color
    document.body.style.background = t.pageGradient || t.background;
    document.body.style.color = t.text;
    document.body.style.transition = 'background 300ms ease, color 300ms ease';

    localStorage.setItem('outfique-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themes[theme] || lightPalette }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
