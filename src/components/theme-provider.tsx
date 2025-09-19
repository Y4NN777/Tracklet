'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'fintrack-preferences',
  ...props
}: ThemeProviderProps) {
  // Start with default theme (same on server and client)
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Track if we're on the client side yet
  const [isClient, setIsClient] = useState(false);

  // This runs ONLY on the client side, after hydration
  useEffect(() => {
    setIsClient(true); // Now we know we're on the client

    // Check if we're recovering from a language switch
    const switchingFlag = sessionStorage.getItem('language-switching');
    const preservedTheme = sessionStorage.getItem('theme-at-switch') as Theme;

    if (switchingFlag === 'true' && preservedTheme) {
      // Clear the flags and restore theme in preferences object
      sessionStorage.removeItem('language-switching');
      sessionStorage.removeItem('theme-at-switch');

      const currentPrefs = JSON.parse(localStorage.getItem(storageKey) || '{}');
      currentPrefs.theme = preservedTheme;
      localStorage.setItem(storageKey, JSON.stringify(currentPrefs));
      setTheme(preservedTheme);
      return;
    }

    // Otherwise, use the stored theme from preferences object
    const storedPrefs = localStorage.getItem(storageKey);
    if (storedPrefs) {
      try {
        const preferences = JSON.parse(storedPrefs);
        if (preferences.theme) {
          setTheme(preferences.theme);
        }
      } catch (error) {
        console.warn('Failed to parse theme preferences:', error);
      }
    }
  }, [storageKey]);

  // Listen for language change events
  useEffect(() => {
    if (!isClient) return;

    const handleLanguageChange = (event: CustomEvent) => {
      const { previousTheme } = event.detail;
      if (previousTheme) {
        // Ensure the theme is preserved
        localStorage.setItem(storageKey, previousTheme);
        setTheme(previousTheme);
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, [isClient, storageKey]);

  // Apply the theme to the page
  useEffect(() => {
    if (!isClient) return; // Don't run on server

    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    let actualTheme = theme;
    if (theme === 'system') {
      // Check user's system preference
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    root.classList.add(actualTheme);
  }, [theme, isClient]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);

      // Only save to localStorage if we're on the client
      if (isClient) {
        const currentPrefs = JSON.parse(localStorage.getItem(storageKey) || '{}');
        currentPrefs.theme = newTheme;
        localStorage.setItem(storageKey, JSON.stringify(currentPrefs));
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};