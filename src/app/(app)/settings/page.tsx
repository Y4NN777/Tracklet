'use client';

import { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  dateFormat: string;
  notifications: {
    budgetAlerts: boolean;
    goalReminders: boolean;
  };
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      budgetAlerts: true,
      goalReminders: true,
    },
  });

  // Load user preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await apiClient.get('/profile');
      if (response.data?.profile?.preferences) {
        setPreferences(response.data.profile.preferences);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your preferences.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key: keyof UserPreferences, value: any) => {
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);

    setSaving(true);
    try {
      const response = await apiClient.patch('/profile', {
        preferences: updatedPreferences
      });

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated.',
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your preferences.',
        variant: 'destructive',
      });
      // Revert on error
      setPreferences(preferences);
    } finally {
      setSaving(false);
    }
  };

  const updateNotificationPreference = (key: keyof UserPreferences['notifications'], value: boolean) => {
    const updatedNotifications = { ...preferences.notifications, [key]: value };
    updatePreference('notifications', updatedNotifications);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Customize the look and feel of the app.
        </p>
        <Separator className="mt-4" />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Select your preferred color scheme.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={preferences.theme === 'light' ? 'default' : 'outline'}
                  onClick={() => updatePreference('theme', 'light')}
                  disabled={saving}
                >
                  Light
                </Button>
                <Button
                  variant={preferences.theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => updatePreference('theme', 'dark')}
                  disabled={saving}
                >
                  Dark
                </Button>
                <Button
                  variant={preferences.theme === 'system' ? 'default' : 'outline'}
                  onClick={() => updatePreference('theme', 'system')}
                  disabled={saving}
                >
                  System
                </Button>
              </div>
              {saving && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium">Preferences</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your account settings and preferences.
        </p>
        <Separator className="mt-4" />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage your account preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={preferences.currency}
                  onChange={(e) => updatePreference('currency', e.target.value)}
                  disabled={saving}
                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
              <div>
                <Label htmlFor="dateFormat">Date Format</Label>
                <select
                  id="dateFormat"
                  value={preferences.dateFormat}
                  onChange={(e) => updatePreference('dateFormat', e.target.value)}
                  disabled={saving}
                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Manage how you receive alerts and updates.
        </p>
        <Separator className="mt-4" />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Choose what you want to be notified about.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="budget-alerts">Budget Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify me when I'm nearing my budget limits.</p>
              </div>
              <Switch
                id="budget-alerts"
                checked={preferences.notifications.budgetAlerts}
                onCheckedChange={(checked) => updateNotificationPreference('budgetAlerts', checked)}
                disabled={saving}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="goal-reminders">Goal Reminders</Label>
                <p className="text-sm text-muted-foreground">Send me reminders about my savings goals.</p>
              </div>
              <Switch
                id="goal-reminders"
                checked={preferences.notifications.goalReminders}
                onCheckedChange={(checked) => updateNotificationPreference('goalReminders', checked)}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
