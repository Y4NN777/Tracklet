-- Add manual balance override system to accounts table
-- This allows users to manually set account balances while tracking transaction impact

ALTER TABLE accounts ADD COLUMN IF NOT EXISTS manual_balance DECIMAL(15,2);
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS manual_override_active BOOLEAN DEFAULT false;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS manual_balance_set_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS manual_balance_note TEXT;

-- Add helpful comments
COMMENT ON COLUMN accounts.manual_balance IS 'Manually set account balance (when override is active)';
COMMENT ON COLUMN accounts.manual_override_active IS 'Whether manual balance override is currently active';
COMMENT ON COLUMN accounts.manual_balance_set_at IS 'When the manual balance was last set';
COMMENT ON COLUMN accounts.manual_balance_note IS 'Optional note explaining the manual balance adjustment';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_accounts_manual_override ON accounts(manual_override_active) WHERE manual_override_active = true;