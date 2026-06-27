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
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, User, Loader2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/supabase';
import { useIntlayer } from 'next-intlayer';
import { mapSignupError } from '@/lib/signup-error-messages';

export default function SignupPage() {
  const i = useIntlayer('signup-page');
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError(i.passwordsDoNotMatch.key);
      return false;
    }
    if (formData.password.length < 8) {
      setError(i.passwordTooShort.key);
      return false;
    }
    if (!formData.agreeToTerms) {
      setError(i.mustAgreeToTerms.key);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const { data, error } = await auth.signUp({
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        agreeToTerms: formData.agreeToTerms,
      });

      if (error) {
        setError(mapSignupError(error.message, i));
        return;
      }

      if (data?.user) {
        await auth.signIn(formData.email, formData.password);
        toast({ title: i.accountCreatedToastTitle.key, description: i.accountCreatedToastDescription.key });
        router.push('/onboarding');
      }
    } catch (err) {
      setError(i.accountCreationFailed.key);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      await auth.signInWithGoogle();
    } catch (err) {
      setError(i.googleSignupFailed.key);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-2xl shadow-primary/10 rounded-[2rem] overflow-hidden bg-card/50 backdrop-blur-xl">
      <CardHeader className="space-y-2 pt-10 px-8 text-center">
        <CardTitle className="text-3xl font-black tracking-tight">{i.title}</CardTitle>
        <CardDescription className="text-base">{i.description}</CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="rounded-xl border-none bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                <Input
                  placeholder="John Doe"
                  className="pl-10 h-12 rounded-xl bg-muted/30 border-none shadow-inner"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10 h-12 rounded-xl bg-muted/30 border-none shadow-inner"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 h-12 rounded-xl bg-muted/30 border-none shadow-inner"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-10 h-12 rounded-xl bg-muted/30 border-none shadow-inner"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-primary/5 p-3 rounded-xl border border-primary/10">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
            />
            <label htmlFor="terms" className="text-xs font-medium leading-none">
              I agree to the <Link href="/terms" className="text-primary font-bold hover:underline">Terms & Conditions</Link>
            </label>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black shadow-lg shadow-primary/20" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Create Account"}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><Separator className="opacity-50" /></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-muted-foreground bg-transparent px-4">Or sign up with</div>
        </div>

        <Button variant="outline" className="w-full h-12 rounded-xl border-2 font-bold" onClick={handleGoogleSignup} disabled={isLoading || isGoogleLoading}>
           Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center pb-10 bg-muted/30 pt-6">
        <p className="text-sm font-medium text-muted-foreground">
          Already have an account? <Link href="/login" className="text-primary font-black uppercase tracking-tight ml-1">Log in</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
