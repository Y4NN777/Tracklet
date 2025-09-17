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

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      budgetAlerts: {
        enabled: true,
        thresholds: [80, 90, 100],
      },
      goalReminders: {
        enabled: true,
        frequency: 'weekly',
        daysBeforeDeadline: 7,
      },
      transactionAlerts: {
        enabled: true,
        minAmount: 100,
        unusualSpending: true,
      },
      emailNotifications: {
        enabled: false,
        digest: 'daily',
      },
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

  const updateNotificationPreference = (
    category: keyof UserPreferences['notifications'],
    field: string,
    value: any
  ) => {
    const updatedCategory = { ...preferences.notifications[category], [field]: value };
    const updatedNotifications = { ...preferences.notifications, [category]: updatedCategory };
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

        {/* Budget Alerts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Budget Alerts</CardTitle>
            <CardDescription>Get notified when you're approaching or exceeding budget limits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="budget-alerts-enabled">Enable Budget Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive notifications about budget spending.</p>
              </div>
              <Switch
                id="budget-alerts-enabled"
                checked={preferences.notifications.budgetAlerts.enabled}
                onCheckedChange={(checked) => updateNotificationPreference('budgetAlerts', 'enabled', checked)}
                disabled={saving}
              />
            </div>

            {preferences.notifications.budgetAlerts.enabled && (
              <div>
                <Label className="text-sm font-medium">Alert Thresholds (%)</Label>
                <p className="text-sm text-muted-foreground mb-3">Get notified at these spending percentages.</p>
                <div className="grid grid-cols-3 gap-4">
                  {[80, 90, 100].map((threshold) => (
                    <label key={threshold} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.budgetAlerts.thresholds.includes(threshold)}
                        onChange={(e) => {
                          const current = preferences.notifications.budgetAlerts.thresholds;
                          const updated = e.target.checked
                            ? [...current, threshold].sort((a, b) => a - b)
                            : current.filter(t => t !== threshold);
                          updateNotificationPreference('budgetAlerts', 'thresholds', updated);
                        }}
                        disabled={saving}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{threshold}%</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goal Reminders */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Goal Reminders</CardTitle>
            <CardDescription>Get reminded about your savings goals and deadlines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="goal-reminders-enabled">Enable Goal Reminders</Label>
                <p className="text-sm text-muted-foreground">Receive notifications about savings goals.</p>
              </div>
              <Switch
                id="goal-reminders-enabled"
                checked={preferences.notifications.goalReminders.enabled}
                onCheckedChange={(checked) => updateNotificationPreference('goalReminders', 'enabled', checked)}
                disabled={saving}
              />
            </div>

            {preferences.notifications.goalReminders.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goal-frequency">Reminder Frequency</Label>
                  <select
                    id="goal-frequency"
                    value={preferences.notifications.goalReminders.frequency}
                    onChange={(e) => updateNotificationPreference('goalReminders', 'frequency', e.target.value)}
                    disabled={saving}
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="goal-days-before">Days Before Deadline</Label>
                  <input
                    id="goal-days-before"
                    type="number"
                    min="1"
                    max="30"
                    value={preferences.notifications.goalReminders.daysBeforeDeadline}
                    onChange={(e) => updateNotificationPreference('goalReminders', 'daysBeforeDeadline', parseInt(e.target.value))}
                    disabled={saving}
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Alerts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Transaction Alerts</CardTitle>
            <CardDescription>Get notified about significant or unusual transactions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="transaction-alerts-enabled">Enable Transaction Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive notifications about transactions.</p>
              </div>
              <Switch
                id="transaction-alerts-enabled"
                checked={preferences.notifications.transactionAlerts.enabled}
                onCheckedChange={(checked) => updateNotificationPreference('transactionAlerts', 'enabled', checked)}
                disabled={saving}
              />
            </div>

            {preferences.notifications.transactionAlerts.enabled && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="min-amount">Minimum Alert Amount</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      id="min-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={preferences.notifications.transactionAlerts.minAmount}
                      onChange={(e) => updateNotificationPreference('transactionAlerts', 'minAmount', parseFloat(e.target.value))}
                      disabled={saving}
                      className="w-full pl-8 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Get notified for transactions above this amount.</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="unusual-spending">Detect Unusual Spending</Label>
                    <p className="text-sm text-muted-foreground">Alert me about statistically unusual transactions.</p>
                  </div>
                  <Switch
                    id="unusual-spending"
                    checked={preferences.notifications.transactionAlerts.unusualSpending}
                    onCheckedChange={(checked) => updateNotificationPreference('transactionAlerts', 'unusualSpending', checked)}
                    disabled={saving}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Receive notifications via email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications-enabled">Enable Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
              </div>
              <Switch
                id="email-notifications-enabled"
                checked={preferences.notifications.emailNotifications.enabled}
                onCheckedChange={(checked) => updateNotificationPreference('emailNotifications', 'enabled', checked)}
                disabled={saving}
              />
            </div>

            {preferences.notifications.emailNotifications.enabled && (
              <div>
                <Label htmlFor="email-digest">Email Digest Frequency</Label>
                <select
                  id="email-digest"
                  value={preferences.notifications.emailNotifications.digest}
                  onChange={(e) => updateNotificationPreference('emailNotifications', 'digest', e.target.value)}
                  disabled={saving}
                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="immediate">Immediate</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Digest</option>
                </select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
