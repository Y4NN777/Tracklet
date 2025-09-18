'use client';

import React, { createContext, useContext } from 'react';
import { usePreferences, UserPreferences } from '@/hooks/use-preferences';
import { useTheme as useThemeProviderTheme } from '@/components/theme-provider';

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
  isLoggedIn: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const preferencesData = usePreferences();

  return (
    <PreferencesContext.Provider value={preferencesData}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferencesContext() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferencesContext must be used within a PreferencesProvider');
  }
  return context;
}

// Helper hook for theme management
export function useTheme() {
  const { preferences, updatePreferences } = usePreferencesContext();
  const { theme: themeProviderTheme, setTheme: setThemeProviderTheme } = useThemeProviderTheme();

  // Use the resolved theme from preferences (handles system theme logic)
  const theme = preferences.theme === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : preferences.theme;

  const setTheme = async (newTheme: 'light' | 'dark' | 'system') => {
    // Update database preferences first
    await updatePreferences({ theme: newTheme });

    // Then sync with ThemeProvider (which handles localStorage and DOM)
    setThemeProviderTheme(newTheme);
  };

  // Sync ThemeProvider with database preferences on load
  React.useEffect(() => {
    if (preferences.theme && preferences.theme !== themeProviderTheme) {
      // If database theme differs from ThemeProvider, sync it
      setThemeProviderTheme(preferences.theme);
    }
  }, [preferences.theme, themeProviderTheme, setThemeProviderTheme]);

  return { theme, setTheme };
}

// Helper hook for currency formatting
export function useCurrency() {
  const { preferences } = usePreferencesContext();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: preferences.currency,
    }).format(amount);
  };

  return { currency: preferences.currency, formatCurrency };
}

// Helper hook for date formatting
export function useDateFormat() {
  const { preferences } = usePreferencesContext();

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    switch (preferences.dateFormat) {
      case 'DD/MM/YYYY':
        return dateObj.toLocaleDateString('en-GB');
      case 'YYYY-MM-DD':
        return dateObj.toISOString().split('T')[0];
      default: // MM/DD/YYYY
        return dateObj.toLocaleDateString('en-US');
    }
  };

  return { dateFormat: preferences.dateFormat, formatDate };
}