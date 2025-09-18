import { Logo } from '@/components/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center space-y-2">
          <Logo />
          <p className="text-muted-foreground text-center">
            Smart personal finance management powered by AI
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}