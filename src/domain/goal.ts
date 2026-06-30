export interface GoalProgress {
  savedAmount: number;
  targetAmount: number;
  remaining: number;
  percentage: number;
  isCompleted: boolean;
}

export function computeGoalProgress(goal: {
  savedAmount: number;
  targetAmount: number;
}): GoalProgress {
  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
  const percentage =
    goal.targetAmount > 0
      ? Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100))
      : 0;

  return {
    savedAmount: goal.savedAmount,
    targetAmount: goal.targetAmount,
    remaining,
    percentage,
    isCompleted: goal.savedAmount >= goal.targetAmount,
  };
}

export function estimateMonthsRemaining(
  goal: { savedAmount: number; targetAmount: number },
  monthlyContributionRate: number,
): number | null {
  if (goal.savedAmount >= goal.targetAmount) return 0;
  if (monthlyContributionRate <= 0) return null;
  return Math.ceil((goal.targetAmount - goal.savedAmount) / monthlyContributionRate);
}
