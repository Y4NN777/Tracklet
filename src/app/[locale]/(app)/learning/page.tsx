'use client';

import { LearningChat } from '@/components/learning-chat';
import { useIntlayer } from 'next-intlayer';

export default function LearningPage() {
  const i = useIntlayer('learning-page');

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {i.title}
        </h1>
        <p className="text-muted-foreground mt-2">
          {i.description}
        </p>
      </div>

      <div className="h-[calc(100vh-200px)]">
        <LearningChat />
      </div>
    </div>
  );
}