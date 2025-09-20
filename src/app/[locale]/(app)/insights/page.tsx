'use client';

import { InsightsForm } from '@/components/insights-form';
import { useIntlayer } from 'next-intlayer';

export default function InsightsPage() {
  const i = useIntlayer('insights-page');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{i.title}</h1>
        <p className="text-muted-foreground mt-2">
          {i.description}
        </p>
      </div>
      <InsightsForm />
    </div>
  );
}
