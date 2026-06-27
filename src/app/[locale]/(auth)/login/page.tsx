'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/supabase';
import { useIntlayer } from 'next-intlayer';

export default function LoginPage() {
  const i = useIntlayer('login-page');
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error } = await auth.signIn(formData.email, formData.password);

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        toast({
          title: i.welcomeBackToastTitle.key,
          description: i.welcomeBackToastDescription.key,
        });

        router.push('/dashboard');
      }
    } catch (err) {
      setError(i.unexpectedError.key);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await auth.signInWithGoogle();
      if (error) {
        setError(error.message);
        return;
      }
    } catch (err) {
      setError(i.googleLoginFailed.key);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-2xl shadow-primary/10 rounded-[2rem] overflow-hidden bg-card/50 backdrop-blur-xl">
      <CardHeader className="space-y-2 pt-10 px-8">
        <CardTitle className="text-3xl font-black tracking-tight">{i.title}</CardTitle>
        <CardDescription className="text-base">
          {i.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="rounded-xl border-none bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider opacity-60 ml-1">{i.emailLabel}</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground opacity-50" />
              <Input
                id="email"
                type="email"
                placeholder={i.emailPlaceholder.key}
                className="pl-12 h-14 rounded-2xl bg-muted/30 border-none shadow-inner text-base"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider opacity-60">{i.passwordLabel}</Label>
              <Link 
                href="/forgot-password" 
                className="text-xs font-bold text-primary hover:underline uppercase tracking-wider"
              >
                {i.forgotPasswordLink}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground opacity-50" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={i.passwordPlaceholder.key}
                className="pl-12 h-14 rounded-2xl bg-muted/30 border-none shadow-inner text-base"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 rounded-2xl text-lg font-black shadow-lg shadow-primary/20 group"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                {i.signInButton}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </Button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <Separator className="opacity-50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
            <span className="bg-transparent px-4 text-muted-foreground">{i.orContinueWith}</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-14 rounded-2xl text-base font-bold border-2 hover:bg-muted/50"
          onClick={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              {i.googleButton}
            </>
          )}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 pb-10 bg-muted/30 pt-6">
        <div className="text-sm font-medium text-muted-foreground text-center">
          {i.noAccount}{' '}
          <Link href="/signup" className="text-primary hover:underline font-black uppercase tracking-tight ml-1">
            {i.signInLink}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
