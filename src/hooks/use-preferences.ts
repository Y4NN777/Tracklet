'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { auth, db, supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  dateFormat: string;
  notifications: {
    budgetAlerts: {
      enabled: boolean;
      thresholds: number[];
    };
    goalReminders: {
      enabled: boolean;
      frequency: string;
      daysBeforeDeadline: number;
    };
    transactionAlerts: {
      enabled: boolean;
      minAmount: number;
      unusualSpending: boolean;
    };
    emailNotifications: {
      enabled: boolean;
      digest: string;
    };
  };
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  notifications: {
    budgetAlerts: {
      enabled: true,
      thresholds: [80, 90, 100]
    },
    goalReminders: {
      enabled: true,
      frequency: 'weekly',
      daysBeforeDeadline: 7
    },
    transactionAlerts: {
      enabled: true,
      minAmount: 100,
      unusualSpending: true
    },
    emailNotifications: {
      enabled: false,
      digest: 'daily'
    }
  }
};

export function usePreferences() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const userIdRef = useRef<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Load preferences from localStorage
  const loadLocalPreferences = useCallback((): UserPreferences => {
    try {
      const stored = localStorage.getItem('tracklet-preferences');
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }, []);

  // Save preferences to localStorage
  const saveLocalPreferences = useCallback((prefs: UserPreferences) => {
    try {
      localStorage.setItem('tracklet-preferences', JSON.stringify(prefs));
    } catch (error) {
//      console.warn('Failed to save preferences to localStorage:', error);
    }
  }, []);

  // Sync preferences with database with retry logic
  const syncWithDatabase = useCallback(async (prefs: UserPreferences, retryCount = 0) => {
    const userId = userIdRef.current;
    if (!userId) return;

    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    try {
      await db.updateUserPreferences(userId, prefs);
      setSyncError(null); // Clear any previous error
      console.log('Preferences synced successfully');
    } catch (error) {
      console.warn(`Failed to sync preferences with database (attempt ${retryCount + 1}):`, error);

      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
        console.log(`Retrying sync in ${delay}ms...`);
        setTimeout(() => syncWithDatabase(prefs, retryCount + 1), delay);
      } else {
        const errorMessage = 'Failed to save preferences. Changes may not persist across sessions.';
        setSyncError(errorMessage);
        toast({
          title: 'Sync Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }
  }, [toast]);

  // Load preferences from database and merge with local
  const loadDatabasePreferences = useCallback(async (userId: string) => {
    try {
      const { data: profile } = await db.getUserProfile(userId);
      if (profile?.preferences) {
        const dbPrefs = { ...DEFAULT_PREFERENCES, ...profile.preferences };
        setPreferences(dbPrefs);
        saveLocalPreferences(dbPrefs);
        return;
      }
    } catch (error) {
      console.warn('Failed to load preferences from database:', error);
      // On mobile, this might fail - user will see localStorage preferences
      toast({
        title: 'Sync Warning',
        description: 'Unable to load latest preferences from server. Using local settings.',
        variant: 'default',
      });
    }
  }, [saveLocalPreferences, toast]);

  // Update preferences (local + database sync)
  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    const updatedPrefs = { ...preferences, ...newPreferences };
    setPreferences(updatedPrefs);
    saveLocalPreferences(updatedPrefs);

    // Sync with database if user is logged in
    if (userIdRef.current) {
      await syncWithDatabase(updatedPrefs);
    }
  }, [preferences, saveLocalPreferences, syncWithDatabase]);

  // Initialize preferences on mount
  useEffect(() => {
    let isMounted = true;

    const initializePreferences = async () => {
      setIsLoading(true);

      try {
        // Load from localStorage first
        const localPrefs = loadLocalPreferences();
        if (isMounted) {
          setPreferences(localPrefs);
        }

        // Check if user is logged in with timeout
        const authTimeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Auth timeout')), 300000)
        );

        const authPromise = auth.getUser();

        let currentUser = null;
        try {
          const result = await Promise.race([authPromise, authTimeout]);
          currentUser = result.user;
        } catch (authError) {
          // Continue with null user (unauthenticated)
        }

        userIdRef.current = currentUser?.id ?? null;
        if (isMounted) {
          setUser(currentUser);
        }

        if (currentUser) {
          // Load from database and merge
          try {
            await loadDatabasePreferences(currentUser.id);
          } catch (dbError) {
            // Continue with local preferences only
          }
        }
      } catch (error) {
        // Ensure we have default preferences loaded
        const localPrefs = loadLocalPreferences();
        if (isMounted) {
          setPreferences(localPrefs);
        }
      } finally {
        // Always set loading to false, even if errors occurred
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializePreferences();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user || null;
        userIdRef.current = newUser?.id ?? null;
        setUser(newUser);

        if (newUser) {
          // User logged in - load preferences from database
          try {
            await loadDatabasePreferences(newUser.id);
          } catch (dbError) {
            console.warn('Failed to load database preferences on auth change:', dbError);
          }
        } else {
          // User logged out - keep local preferences but don't sync
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadDatabasePreferences, loadLocalPreferences]);


  return {
    preferences,
    updatePreferences,
    isLoading,
    isLoggedIn: !!user,
    user,
    syncError
  };
}
