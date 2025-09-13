import { Logo } from '@/components/logo';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center space-y-2">
          <Logo />
          <h1 className="text-2xl font-bold">Welcome to FinTrack</h1>
          <p className="text-muted-foreground text-center">
            Let's get you set up in just a few steps
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}