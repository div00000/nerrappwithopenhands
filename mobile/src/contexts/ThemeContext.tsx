import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Merged theme - balanced, premium, readable
export const nerraTheme = {
  // Backgrounds - rich dark, not pure black
  background: '#0D0D12',
  surface: '#16161D',
  surfaceLight: '#1E1E28',
  
  // Primary - elegant violet/purple, not shouty
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  primaryDark: '#5B21B6',
  
  // Accent - complementary cyan/teal for freshness
  accent: '#06B6D4',
  accentLight: '#22D3EE',
  
  // Text - high contrast for readability
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  textLight: '#CBD5E1',
  
  // Borders - subtle, not harsh
  border: '#2D2D3A',
  borderLight: '#3D3D4A',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Gradients (for cards/headers)
  gradientPrimary: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
  gradientAccent: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowLight: 'rgba(124, 58, 237, 0.15)',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  
  // Card specific
  cardBackground: '#16161D',
  cardBorder: '#2D2D3A',
  
  // Input fields
  inputBackground: '#1E1E28',
  inputBorder: '#2D2D3A',
  inputPlaceholder: '#64748B',
  
  // Tab bar
  tabBarBackground: '#16161D',
  tabBarBorder: '#2D2D3A',
  tabBarActive: '#7C3AED',
  tabBarInactive: '#64748B',
  
  // Modal
  modalBackground: '#1A1A24',
  modalBorder: '#2D2D3A',
};

// Fallback theme (same as nerraTheme)
const fallbackTheme = nerraTheme;

type ThemeType = typeof nerraTheme;

interface ThemeContextType {
  theme: ThemeType;
  themeName: string;
  setTheme: (name: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Available themes
const themes: Record<string, ThemeType> = {
  nerra: nerraTheme,
  neonNoir: {
    background: '#0F0F11',
    surface: '#1C1C1E',
    surfaceLight: '#2A2A2E',
    primary: '#8B5CF6',
    primaryLight: '#A78BFA',
    primaryDark: '#6D28D9',
    accent: '#3B82F6',
    accentLight: '#60A5FA',
    text: '#FFFFFF',
    textMuted: '#8E8E93',
    textLight: '#E5E5E5',
    border: '#2C2C2E',
    borderLight: '#3D3D4A',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    gradientPrimary: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
    gradientAccent: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowLight: 'rgba(139, 92, 246, 0.15)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    cardBackground: '#1C1C1E',
    cardBorder: '#2C2C2E',
    inputBackground: '#1C1C1E',
    inputBorder: '#2C2C2E',
    inputPlaceholder: '#6B6B6B',
    tabBarBackground: '#1C1C1E',
    tabBarBorder: '#2C2C2E',
    tabBarActive: '#8B5CF6',
    tabBarInactive: '#8E8E93',
    modalBackground: '#1A1A1E',
    modalBorder: '#2C2C2E',
  },
  cyberTech: {
    background: '#040307',
    surface: '#2A293E',
    surfaceLight: '#3A3950',
    primary: '#9668F5',
    primaryLight: '#B39DFF',
    primaryDark: '#6E4FEF',
    accent: '#8B5CF6',
    accentLight: '#A78BFA',
    text: '#FFFFFF',
    textMuted: '#5740A0',
    textLight: '#E5E5FF',
    border: '#3A3950',
    borderLight: '#4A4970',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#6366F1',
    gradientPrimary: 'linear-gradient(135deg, #9668F5 0%, #6E4FEF 100%)',
    gradientAccent: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
    shadow: 'rgba(0, 0, 0, 0.4)',
    shadowLight: 'rgba(150, 104, 245, 0.2)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    cardBackground: '#2A293E',
    cardBorder: '#3A3950',
    inputBackground: '#2A293E',
    inputBorder: '#3A3950',
    inputPlaceholder: '#5740A0',
    tabBarBackground: '#2A293E',
    tabBarBorder: '#3A3950',
    tabBarActive: '#9668F5',
    tabBarInactive: '#5740A0',
    modalBackground: '#252340',
    modalBorder: '#3A3950',
  },
  emberGlow: {
    background: '#000000',
    surface: '#121212',
    surfaceLight: '#1E1E1E',
    primary: '#F15A24',
    primaryLight: '#FF8A5C',
    primaryDark: '#933D22',
    accent: '#FB923C',
    accentLight: '#FDBA74',
    text: '#FFFFFF',
    textMuted: '#808080',
    textLight: '#F5F5F5',
    border: '#2A2A2A',
    borderLight: '#3A3A3A',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    gradientPrimary: 'linear-gradient(135deg, #F15A24 0%, #933D22 100%)',
    gradientAccent: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowLight: 'rgba(241, 90, 36, 0.15)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    cardBackground: '#121212',
    cardBorder: '#2A2A2A',
    inputBackground: '#121212',
    inputBorder: '#2A2A2A',
    inputPlaceholder: '#666666',
    tabBarBackground: '#121212',
    tabBarBorder: '#2A2A2A',
    tabBarActive: '#F15A24',
    tabBarInactive: '#808080',
    modalBackground: '#0F0F0F',
    modalBorder: '#2A2A2A',
  },
  warmSunset: {
    background: '#000000',
    surface: '#150F0B',
    surfaceLight: '#1F1812',
    primary: '#D95D26',
    primaryLight: '#FF8A5C',
    primaryDark: '#A64A1C',
    accent: '#F26522',
    accentLight: '#FF8A5C',
    text: '#FFFFFF',
    textMuted: '#A1A1A1',
    textLight: '#F5F5F5',
    border: '#2A2520',
    borderLight: '#3A3530',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    gradientPrimary: 'linear-gradient(135deg, #D95D26 0%, #F26522 100%)',
    gradientAccent: 'linear-gradient(135deg, #F26522 0%, #FB923C 100%)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowLight: 'rgba(217, 93, 38, 0.15)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    cardBackground: '#150F0B',
    cardBorder: '#2A2520',
    inputBackground: '#150F0B',
    inputBorder: '#2A2520',
    inputPlaceholder: '#6B5A4A',
    tabBarBackground: '#150F0B',
    tabBarBorder: '#2A2520',
    tabBarActive: '#D95D26',
    tabBarInactive: '#A1A1A1',
    modalBackground: '#120D08',
    modalBorder: '#2A2520',
  },
  cosmicPurple: {
    background: '#050505',
    surface: '#11111B',
    surfaceLight: '#1A1A28',
    primary: '#5D5FEF',
    primaryLight: '#818CF8',
    primaryDark: '#4338CA',
    accent: '#9333EA',
    accentLight: '#A855F7',
    text: '#FFFFFF',
    textMuted: '#4C1D95',
    textLight: '#E5E5FF',
    border: '#1E1E2E',
    borderLight: '#2E2E40',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#6366F1',
    gradientPrimary: 'linear-gradient(135deg, #5D5FEF 0%, #9333EA 100%)',
    gradientAccent: 'linear-gradient(135deg, #9333EA 0%, #6366F1 100%)',
    shadow: 'rgba(0, 0, 0, 0.4)',
    shadowLight: 'rgba(93, 95, 239, 0.2)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    cardBackground: '#11111B',
    cardBorder: '#1E1E2E',
    inputBackground: '#11111B',
    inputBorder: '#1E1E2E',
    inputPlaceholder: '#3D1D95',
    tabBarBackground: '#11111B',
    tabBarBorder: '#1E1E2E',
    tabBarActive: '#5D5FEF',
    tabBarInactive: '#4C1D95',
    modalBackground: '#0F0F18',
    modalBorder: '#1E1E2E',
  },
  toxicForest: {
    background: '#0A0B0A',
    surface: '#1A1B1A',
    surfaceLight: '#252825',
    primary: '#1DB954',
    primaryLight: '#4ADE80',
    primaryDark: '#0E3B21',
    accent: '#22C55E',
    accentLight: '#4ADE80',
    text: '#FFFFFF',
    textMuted: '#A7F3D0',
    textLight: '#DCFCE7',
    border: '#2A2B2A',
    borderLight: '#3A3B3A',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    gradientPrimary: 'linear-gradient(135deg, #1DB954 0%, #0E3B21 100%)',
    gradientAccent: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowLight: 'rgba(29, 185, 84, 0.15)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    cardBackground: '#1A1B1A',
    cardBorder: '#2A2B2A',
    inputBackground: '#1A1B1A',
    inputBorder: '#2A2B2A',
    inputPlaceholder: '#4A6B50',
    tabBarBackground: '#1A1B1A',
    tabBarBorder: '#2A2B2A',
    tabBarActive: '#1DB954',
    tabBarInactive: '#A7F3D0',
    modalBackground: '#151615',
    modalBorder: '#2A2B2A',
  },
};

const THEME_STORAGE_KEY = '@nerra_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeNameState] = useState<string>('nerra');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && themes[savedTheme]) {
        setThemeNameState(savedTheme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const setTheme = async (name: string) => {
    if (themes[name]) {
      setThemeNameState(name);
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, name);
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    }
  };

  const value: ThemeContextType = {
    theme: themes[themeName] || fallbackTheme,
    themeName,
    setTheme,
    availableThemes: Object.keys(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: fallbackTheme,
      themeName: 'nerra',
      setTheme: () => {},
      availableThemes: Object.keys(themes),
    };
  }
  return context;
}

export default ThemeContext;
