'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIntlayer } from 'next-intlayer';

export default function ForgotPasswordPage() {
  const i = useIntlayer('forgot-password-page');
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TODO: Implement actual password reset with Supabase
      // For now, simulate sending reset email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      toast({
        title: i.emailSentToastTitle.key,
        description: i.emailSentToastDescription.key,
      });
    } catch (err) {
      setError(i.sendFailedError.key);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-success/10 p-3">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">{i.successTitle}</CardTitle>
          <CardDescription className="text-center">
            {typeof i.successDescription === 'function' 
              ? i.successDescription({ email: email })
              : `We've sent a password reset link to ${email}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              {i.noEmailAlert}
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setIsSuccess(false);
              setEmail('');
            }}
          >
            {i.tryAnotherEmailButton}
          </Button>
        </CardContent>
        <CardFooter>
          <Link 
            href="/login" 
            className="text-sm text-muted-foreground hover:text-primary flex items-center mx-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {i.backToLogin}
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{i.title}</CardTitle>
        <CardDescription>
          {i.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">{i.emailLabel}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={i.emailPlaceholder.key}
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {i.sendingButton}
              </>
            ) : (
              i.sendButton
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Link 
          href="/login" 
          className="text-sm text-muted-foreground hover:text-primary flex items-center mx-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {i.backToLogin}
        </Link>
      </CardFooter>
    </Card>
  );
}