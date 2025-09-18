-- =========================================
-- USER PREFERENCES MIGRATION
-- Run this in Supabase SQL Editor to migrate existing user preferences
-- to the new notification structure
-- =========================================

-- Step 1: Migrate existing user preferences to new structure
UPDATE user_profiles
SET preferences = jsonb_build_object(
  'theme', COALESCE(preferences->>'theme', 'system'),
  'currency', COALESCE(preferences->>'currency', 'USD'),
  'dateFormat', COALESCE(preferences->>'dateFormat', 'MM/DD/YYYY'),
  'notifications', jsonb_build_object(
    'budgetAlerts', jsonb_build_object(
      'enabled', COALESCE((preferences->'notifications'->'budgetAlerts')::boolean, true),
      'thresholds', COALESCE(
        preferences->'notifications'->'budgetAlerts'->'thresholds',
        '[80,90,100]'::jsonb
      )
    ),
    'goalReminders', jsonb_build_object(
      'enabled', COALESCE((preferences->'notifications'->'goalReminders')::boolean, true),
      'frequency', COALESCE(
        preferences->'notifications'->'goalReminders'->>'frequency',
        'weekly'
      ),
      'daysBeforeDeadline', COALESCE(
        (preferences->'notifications'->'goalReminders'->'daysBeforeDeadline')::int,
        7
      )
    ),
    'transactionAlerts', jsonb_build_object(
      'enabled', COALESCE(
        preferences->'notifications'->'transactionAlerts'->'enabled',
        true
      ),
      'minAmount', COALESCE(
        (preferences->'notifications'->'transactionAlerts'->'minAmount')::float,
        100.0
      ),
      'unusualSpending', COALESCE(
        preferences->'notifications'->'transactionAlerts'->'unusualSpending',
        true
      )
    ),
    'emailNotifications', jsonb_build_object(
      'enabled', COALESCE(
        preferences->'notifications'->'emailNotifications'->'enabled',
        false
      ),
      'digest', COALESCE(
        preferences->'notifications'->'emailNotifications'->>'digest',
        'daily'
      )
    )
  )
)
WHERE preferences IS NOT NULL;

-- Step 2: For users with no preferences at all, set defaults
UPDATE user_profiles
SET preferences = '{
  "theme": "system",
  "currency": "USD",
  "dateFormat": "MM/DD/YYYY",
  "notifications": {
    "budgetAlerts": {
      "enabled": true,
      "thresholds": [80, 90, 100]
    },
    "goalReminders": {
      "enabled": true,
      "frequency": "weekly",
      "daysBeforeDeadline": 7
    },
    "transactionAlerts": {
      "enabled": true,
      "minAmount": 100,
      "unusualSpending": true
    },
    "emailNotifications": {
      "enabled": false,
      "digest": "daily"
    }
  }
}'::jsonb
WHERE preferences IS NULL;

-- Step 3: Verify the migration worked
SELECT
  id,
  preferences->'notifications'->'transactionAlerts'->'enabled' as transaction_alerts_enabled,
  preferences->'notifications'->'budgetAlerts'->'thresholds' as budget_thresholds
FROM user_profiles
LIMIT 5;