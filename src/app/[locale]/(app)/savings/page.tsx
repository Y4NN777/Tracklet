'use client';

import { SavingsForm } from '@/components/savings-form';
import { useIntlayer } from 'next-intlayer';

export default function SavingsPage() {
  const i = useIntlayer('savings-page');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{i.title}</h1>
        <p className="text-muted-foreground mt-2">
          {i.description}
        </p>
      </div>
      <SavingsForm />
    </div>
  );
}
