'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { usePreferencesContext } from '@/contexts/preferences-context';
import { Loader2 } from 'lucide-react';
import { useIntlayer } from 'next-intlayer';

export default function SettingsPage() {
  const i = useIntlayer('settings-page');
  const { toast } = useToast();
  const { preferences, updatePreferences, isLoading, syncError } = usePreferencesContext();
  const [saving, setSaving] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [pendingMinAmount, setPendingMinAmount] = useState<number | string | null>(null);
  // Show sync error toast
  useEffect(() => {
    if (syncError) {
      toast({
        title: "Sync Warning",
        description: syncError,
        variant: 'destructive',
      });
    }
  }, [syncError, toast]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const updatePreference = async (key: string, value: any) => {
    setSaving(true);
    try {
      if (key === 'notifications') {
        await updatePreferences({ notifications: value });
      } else {
        await updatePreferences({ [key]: value });
      }

      toast({
        title: i.settingsSaved,
        description: i.preferencesUpdated,
      });
    } catch (error) {
 //      console.error('Failed to save preferences:', error);
      toast({
        title: i.error,
        description: i.failedToSave,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateNotificationPreference = (
    category: keyof typeof preferences.notifications,
    field: string,
    value: any
  ) => {
    const updatedCategory = { ...preferences.notifications[category], [field]: value };
    const updatedNotifications = { ...preferences.notifications, [category]: updatedCategory };
    updatePreference('notifications', updatedNotifications);
  };

  const handleMinAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Handle empty input - allow it but don't save yet
    if (inputValue === '') {
      setPendingMinAmount('');
      return;
    }
    
    const numericValue = parseFloat(inputValue);
    
    // Only proceed if we have a valid positive number
    if (isNaN(numericValue) || numericValue < 0) {
      return; // Ignore invalid input
    }
    
    setPendingMinAmount(numericValue);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      updateNotificationPreference('transactionAlerts', 'minAmount', numericValue);
      setPendingMinAmount(null);
    }, 1000);

    setDebounceTimer(timer);
  }, [debounceTimer, updateNotificationPreference]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h3 className="text-lg font-medium">{i.appearanceTitle}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {i.appearanceDescription}
        </p>
        <Separator className="mt-4" />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{i.themeTitle}</CardTitle>
            <CardDescription>{i.themeDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={preferences.theme === 'light' ? 'default' : 'outline'}
                  onClick={() => updatePreference('theme', 'light')}
                  disabled={saving}
                >
                  {i.lightTheme}
                </Button>
                <Button
                  variant={preferences.theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => updatePreference('theme', 'dark')}
                  disabled={saving}
                >
                  {i.darkTheme}
                </Button>
                <Button
                  variant={preferences.theme === 'system' ? 'default' : 'outline'}
                  onClick={() => updatePreference('theme', 'system')}
                  disabled={saving}
                >
                  {i.systemTheme}
                </Button>
              </div>
              {saving && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {i.saving}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium">{i.preferencesTitle}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {i.preferencesDescription}
        </p>
        <Separator className="mt-4" />
        {/* <Card className="mt-6">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage your account preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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
        </Card> */}
      </div>

      <div>
        <h3 className="text-lg font-medium">{i.notificationsTitle}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {i.notificationsDescription}
        </p>
        <Separator className="mt-4" />

        {/* Budget Alerts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{i.budgetAlertsTitle}</CardTitle>
            <CardDescription>{i.budgetAlertsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="budget-alerts-enabled">{i.enableBudgetAlertsLabel}</Label>
                <p className="text-sm text-muted-foreground">{i.enableBudgetAlertsDescription}</p>
              </div>
              <Switch
                id="budget-alerts-enabled"
                checked={preferences.notifications?.budgetAlerts?.enabled ?? true}
                onCheckedChange={(checked) => updateNotificationPreference('budgetAlerts', 'enabled', checked)}
                disabled={saving}
              />
            </div>

            {(preferences.notifications?.budgetAlerts?.enabled ?? true) && (
              <div>
                <Label className="text-sm font-medium">{i.alertThresholdsLabel}</Label>
                <p className="text-sm text-muted-foreground mb-3">{i.alertThresholdsDescription}</p>
                <div className="grid grid-cols-3 gap-4">
                  {[80, 90, 100].map((threshold) => (
                    <label key={threshold} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={(preferences.notifications?.budgetAlerts?.thresholds ?? [80, 90, 100]).includes(threshold)}
                        onChange={(e) => {
                          const current = preferences.notifications?.budgetAlerts?.thresholds ?? [80, 90, 100];
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
            <CardTitle>{i.goalRemindersTitle}</CardTitle>
            <CardDescription>{i.goalRemindersDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="goal-reminders-enabled">{i.enableGoalRemindersLabel}</Label>
                <p className="text-sm text-muted-foreground">{i.enableGoalRemindersDescription}</p>
              </div>
              <Switch
                id="goal-reminders-enabled"
                checked={preferences.notifications?.goalReminders?.enabled ?? true}
                onCheckedChange={(checked) => updateNotificationPreference('goalReminders', 'enabled', checked)}
                disabled={saving}
              />
            </div>

            {(preferences.notifications?.goalReminders?.enabled ?? true) && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goal-frequency">{i.reminderFrequencyLabel}</Label>
                  <select
                    id="goal-frequency"
                    value={preferences.notifications?.goalReminders?.frequency ?? 'weekly'}
                    onChange={(e) => updateNotificationPreference('goalReminders', 'frequency', e.target.value)}
                    disabled={saving}
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="daily">{i.dailyOption}</option>
                    <option value="weekly">{i.weeklyOption}</option>
                    <option value="monthly">{i.monthlyOption}</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="goal-days-before">{i.daysBeforeDeadlineLabel}</Label>
                  <input
                    id="goal-days-before"
                    type="number"
                    min="1"
                    max="30"
                    value={preferences.notifications?.goalReminders?.daysBeforeDeadline ?? 7}
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
            <CardTitle>{i.transactionAlertsTitle}</CardTitle>
            <CardDescription>{i.transactionAlertsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="transaction-alerts-enabled">{i.enableTransactionAlertsLabel}</Label>
                <p className="text-sm text-muted-foreground">{i.enableTransactionAlertsDescription}</p>
              </div>
              <Switch
                id="transaction-alerts-enabled"
                checked={preferences.notifications?.transactionAlerts?.enabled ?? true}
                onCheckedChange={(checked) => updateNotificationPreference('transactionAlerts', 'enabled', checked)}
                disabled={saving}
              />
            </div>

            {(preferences.notifications?.transactionAlerts?.enabled ?? true) && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="min-amount">{i.minAmountLabel}</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{preferences.currency || 'XOF'}</span>
                    <input
                      id="min-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={pendingMinAmount !== null ? pendingMinAmount : (preferences.notifications?.transactionAlerts?.minAmount ?? 100)}
                      onChange={handleMinAmountChange}
                      disabled={saving}
                      className="w-full pl-12 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{i.minAmountDescription}</p>
                  {pendingMinAmount !== null && (
                    <p className="text-xs text-blue-600 mt-1 flex items-center">
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Saving...
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="unusual-spending">{i.detectUnusualSpendingLabel}</Label>
                    <p className="text-sm text-muted-foreground">{i.detectUnusualSpendingDescription}</p>
                  </div>
                  <Switch
                    id="unusual-spending"
                    checked={preferences.notifications?.transactionAlerts?.unusualSpending ?? true}
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
            <CardTitle>{i.emailNotificationsTitle}</CardTitle>
            <CardDescription>{i.emailNotificationsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications-enabled">{i.enableEmailNotificationsLabel}</Label>
                <p className="text-sm text-muted-foreground">{i.emailNotificationsDescription}</p>
              </div>
              <Switch
                id="email-notifications-enabled"
                checked={preferences.notifications?.emailNotifications?.enabled ?? false}
                onCheckedChange={(checked) => updateNotificationPreference('emailNotifications', 'enabled', checked)}
                disabled={saving}
              />
            </div>

            {(preferences.notifications?.emailNotifications?.enabled ?? false) && (
              <div>
                <Label htmlFor="email-digest">{i.emailDigestLabel}</Label>
                <select
                  id="email-digest"
                  value={preferences.notifications?.emailNotifications?.digest ?? 'daily'}
                  onChange={(e) => updateNotificationPreference('emailNotifications', 'digest', e.target.value)}
                  disabled={saving}
                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="immediate">{i.immediateOption}</option>
                  <option value="daily">{i.dailyDigestOption}</option>
                  <option value="weekly">{i.weeklyDigestOption}</option>
                </select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
