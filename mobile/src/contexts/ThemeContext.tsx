import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeName = 'cyberTech' | 'neonNoir' | 'emberGlow' | 'warmSunset' | 'cosmicPurple' | 'toxicForest';

export interface ThemeColors {
  bgPrimary: string;
  surface: string;
  accent: string;
  accentSecondary: string;
  textMuted: string;
  // Derived colors
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
}

export const themes: Record<ThemeName, ThemeColors> = {
  cyberTech: {
    bgPrimary: '#040307',
    surface: '#2A293E',
    accent: '#9668F5',
    accentSecondary: '#6E4FEF',
    textMuted: '#5740A0',
    background: '#040307',
    text: '#FFFFFF',
    textSecondary: '#A0A0B0',
    border: '#3A3950',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    primary: '#9668F5',
    primaryLight: '#B8A0FF',
    primaryDark: '#6E4FEF',
    secondary: '#6E4FEF',
  },
  neonNoir: {
    bgPrimary: '#0F0F11',
    surface: '#1C1C1E',
    accent: '#8B5CF6',
    accentSecondary: '#3B82F6',
    textMuted: '#8E8E93',
    background: '#0F0F11',
    text: '#FFFFFF',
    textSecondary: '#A0A0B0',
    border: '#2C2C2E',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    primary: '#8B5CF6',
    primaryLight: '#A78BFA',
    primaryDark: '#3B82F6',
    secondary: '#3B82F6',
  },
  emberGlow: {
    bgPrimary: '#000000',
    surface: '#121212',
    accent: '#F15A24',
    accentSecondary: '#933D22',
    textMuted: '#808080',
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: '#A0A0B0',
    border: '#2A2A2A',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    primary: '#F15A24',
    primaryLight: '#FF7B4F',
    primaryDark: '#933D22',
    secondary: '#933D22',
  },
  warmSunset: {
    bgPrimary: '#000000',
    surface: '#150F0B',
    accent: '#D95D26',
    accentSecondary: '#F26522',
    textMuted: '#A1A1A1',
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: '#A0A0B0',
    border: '#2A2520',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    primary: '#D95D26',
    primaryLight: '#FF8B4F',
    primaryDark: '#F26522',
    secondary: '#F26522',
  },
  cosmicPurple: {
    bgPrimary: '#050505',
    surface: '#11111B',
    accent: '#5D5FEF',
    accentSecondary: '#9333EA',
    textMuted: '#4C1D95',
    background: '#050505',
    text: '#FFFFFF',
    textSecondary: '#A0A0B0',
    border: '#1E1E2E',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    primary: '#5D5FEF',
    primaryLight: '#818AFF',
    primaryDark: '#9333EA',
    secondary: '#9333EA',
  },
  toxicForest: {
    bgPrimary: '#0A0B0A',
    surface: '#1A1B1A',
    accent: '#1DB954',
    accentSecondary: '#0E3B21',
    textMuted: '#A7F3D0',
    background: '#0A0B0A',
    text: '#FFFFFF',
    textSecondary: '#A0A0B0',
    border: '#2A2B2A',
    success: '#1DB954',
    error: '#EF4444',
    warning: '#F59E0B',
    primary: '#1DB954',
    primaryLight: '#4ADE80',
    primaryDark: '#0E3B21',
    secondary: '#0E3B21',
  },
};

interface ThemeContextType {
  theme: ThemeColors;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@nerra_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('neonNoir');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && themes[savedTheme as ThemeName]) {
        setThemeName(savedTheme as ThemeName);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const setTheme = async (name: ThemeName) => {
    setThemeName(name);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, name);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const theme = themes[themeName];

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}