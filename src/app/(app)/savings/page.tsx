import { SavingsForm } from '@/components/savings-form';

export default function SavingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Savings Advisor</h1>
        <p className="text-muted-foreground">
          Leverage artificial intelligence to uncover hidden savings opportunities in your budget.
        </p>
      </div>
      <SavingsForm />
    </div>
  );
}
