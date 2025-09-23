-- Add budget_id column to transactions table for budget assignment
-- This allows transactions to be explicitly assigned to specific budgets

ALTER TABLE transactions
ADD COLUMN budget_id UUID REFERENCES budgets(id);

-- Create index for performance on budget queries
CREATE INDEX idx_transactions_budget_id ON transactions(budget_id);

-- Add comment for documentation
COMMENT ON COLUMN transactions.budget_id IS 'Optional reference to the budget this transaction is assigned to. Allows for precise budget tracking when multiple budgets exist for the same category.';