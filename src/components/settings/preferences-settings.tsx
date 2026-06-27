'use client';

import { useState, useEffect, useCallback } from 'react';
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/hooks/use-toast';
import { usePreferencesContext } from '@/contexts/preferences-context';
import { Loader2 } from 'lucide-react';
import { useIntlayer } from 'next-intlayer';

export function PreferencesSettings() {
  const i = useIntlayer('settings-page');
  const { toast } = useToast();
  const { preferences, updatePreferences, isLoading, syncError } = usePreferencesContext();
  const [saving, setSaving] = useState(false);
  const [savingTimer, setSavingTimer] = useState<NodeJS.Timeout | null>(null);
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

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      if (savingTimer) clearTimeout(savingTimer);
    };
  }, [debounceTimer, savingTimer]);

  const updatePreference = (key: string, value: any) => {
    setSaving(true);
    if (savingTimer) clearTimeout(savingTimer);

    const savePromise = key === 'notifications'
      ? updatePreferences({ notifications: value })
      : updatePreferences({ [key]: value });

    const timer = setTimeout(() => {
      setSaving(false);
      setSavingTimer(null);
    }, 250);
    setSavingTimer(timer);

    savePromise
      .then(() => {
        toast({
          title: i.settingsSaved,
          description: i.preferencesUpdated,
        });
      })
      .catch(() => {
        clearTimeout(timer);
        setSaving(false);
        setSavingTimer(null);
        toast({
          title: i.error,
          description: i.failedToSave,
          variant: 'destructive',
        });
      });

    return savePromise;
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
    if (inputValue === '') {
      setPendingMinAmount('');
      return;
    }
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue) || numericValue < 0) return;

    setPendingMinAmount(numericValue);
    if (debounceTimer) clearTimeout(debounceTimer);

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
    <div className="space-y-6">
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
        <h3 className="text-lg font-medium">{i.notificationsTitle}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {i.notificationsDescription}
        </p>
        <Separator className="mt-4" />

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
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
