'use client';

import { Logo } from '@/components/logo';
import { useIntlayer } from 'next-intlayer';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const i = useIntlayer('onboarding-layout');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center space-y-2">
          <Logo />
          <h1 className="text-2xl font-bold">{i.welcome}</h1>
          <p className="text-muted-foreground text-center">
            {i.getStarted}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}