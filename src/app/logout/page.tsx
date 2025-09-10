'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Loader2 } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performLogout = async () => {
      try {
        const { error } = await auth.signOut();

        if (error) {
          console.error('Logout error:', error);
          setError('Failed to log out. Please try again.');
          setIsLoggingOut(false);
          return;
        }

        // Small delay for better UX
        setTimeout(() => {
          router.push('/login?message=logged_out');
        }, 1000);

      } catch (error) {
        console.error('Unexpected logout error:', error);
        setError('An unexpected error occurred. Please try again.');
        setIsLoggingOut(false);
      }
    };

    performLogout();
  }, [router]);

  const handleManualLogout = async () => {
    setIsLoggingOut(true);
    setError(null);

    try {
      const { error } = await auth.signOut();

      if (error) {
        console.error('Manual logout error:', error);
        setError('Failed to log out. Please try again.');
        setIsLoggingOut(false);
        return;
      }

      router.push('/login?message=logged_out');

    } catch (error) {
      console.error('Unexpected manual logout error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoggingOut(false);
    }
  };

  const returnToLogin = () => {
    router.push('/login');
  };

  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <LogOut className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Logging out...</CardTitle>
            <CardDescription>
              Please wait while we securely log you out of your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              Clearing your session and redirecting...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <LogOut className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Logout Error</CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleManualLogout} className="w-full">
              Try Again
            </Button>
            <Button onClick={returnToLogin} variant="outline" className="w-full">
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <LogOut className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Logged Out Successfully</CardTitle>
          <CardDescription>
            You have been securely logged out of your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={returnToLogin} className="w-full">
            Return to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}