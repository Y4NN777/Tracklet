import { ThemeProvider } from '@/components/theme-provider';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </ThemeProvider>
  );
}