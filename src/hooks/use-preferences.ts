'use client';

import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '@/lib/supabase';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  dateFormat: string;
  notifications: {
    budgetAlerts: boolean;
    goalReminders: boolean;
  };
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  notifications: {
    budgetAlerts: true,
    goalReminders: true
  }
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Load preferences from localStorage
  const loadLocalPreferences = useCallback((): UserPreferences => {
    try {
      const stored = localStorage.getItem('fintrack-preferences');
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }, []);

  // Save preferences to localStorage
  const saveLocalPreferences = useCallback((prefs: UserPreferences) => {
    try {
      localStorage.setItem('fintrack-preferences', JSON.stringify(prefs));
    } catch (error) {
      console.warn('Failed to save preferences to localStorage:', error);
    }
  }, []);

  // Sync preferences with database
  const syncWithDatabase = useCallback(async (prefs: UserPreferences) => {
    if (!user) return;

    try {
      await db.updateUserPreferences(user.id, prefs);
    } catch (error) {
      console.warn('Failed to sync preferences with database:', error);
    }
  }, [user]);

  // Load preferences from database and merge with local
  const loadDatabasePreferences = useCallback(async () => {
    if (!user) return;

    try {
      const { data: profile } = await db.getUserProfile(user.id);
      if (profile?.preferences) {
        const dbPrefs = { ...DEFAULT_PREFERENCES, ...profile.preferences };
        setPreferences(dbPrefs);
        saveLocalPreferences(dbPrefs);
      }
    } catch (error) {
      console.warn('Failed to load preferences from database:', error);
    }
  }, [user, saveLocalPreferences]);

  // Update preferences (local + database sync)
  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    const updatedPrefs = { ...preferences, ...newPreferences };
    setPreferences(updatedPrefs);
    saveLocalPreferences(updatedPrefs);

    // Sync with database if user is logged in
    if (user) {
      await syncWithDatabase(updatedPrefs);
    }
  }, [preferences, saveLocalPreferences, syncWithDatabase, user]);

  // Initialize preferences on mount
  useEffect(() => {
    const initializePreferences = async () => {
      setIsLoading(true);

      // Load from localStorage first
      const localPrefs = loadLocalPreferences();
      setPreferences(localPrefs);

      // Check if user is logged in
      const { user: currentUser } = await auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        // Load from database and merge
        await loadDatabasePreferences();
      }

      setIsLoading(false);
    };

    initializePreferences();
  }, []); // Empty dependency array - run only once on mount


  return {
    preferences,
    updatePreferences,
    isLoading,
    isLoggedIn: !!user,
    user
  };
}