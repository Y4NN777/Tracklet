import { InsightsForm } from '@/components/insights-form';

export default function InsightsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">AI Financial Insights</h1>
        <p className="text-muted-foreground mt-2">
          Get a deeper understanding of your financial health with AI-powered analysis.
        </p>
      </div>
      <InsightsForm />
    </div>
  );
}
