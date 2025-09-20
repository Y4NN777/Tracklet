'use client';

import { Logo } from '@/components/logo';
import { useIntlayer } from 'next-intlayer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const i = useIntlayer('auth-layout');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center space-y-2">
          <Logo />
          <p className="text-muted-foreground text-center">
            {i.subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}