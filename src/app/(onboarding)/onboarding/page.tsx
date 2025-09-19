'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, Check, ArrowRight, ArrowLeft, Bot, Target, BarChart3, RefreshCw, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, db, supabase } from '@/lib/supabase';

const ONBOARDING_STEPS = [
  { id: 1, title: 'Welcome to FinTrack', description: 'Your AI-powered finance companion awaits' },
  { id: 2, title: 'Discover FinTrack', description: 'Learn what makes your financial journey smarter' },
  { id: 3, title: 'Profile Setup', description: 'Personalize your experience' },
  { id: 4, title: 'Preferences', description: 'Customize your financial settings' },
  { id: 5, title: 'You\'re All Set!', description: 'Ready to take control of your finances' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form data
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [preferences, setPreferences] = useState({
    theme: 'system',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      budgetAlerts: true,
      goalReminders: true
    }
  });

  useEffect(() => {
    const checkUser = async () => {
      const { user, error } = await auth.getUser();
      if (error || !user) {
        router.push('/login');
        return;
      }

      setUser(user);

      const { data: profile } = await db.getUserProfile(user.id);
      if (profile) {
        setFullName(profile.full_name || '');
        setAvatarUrl(profile.avatar_url || '');
        if (profile.preferences) {
          setPreferences(profile.preferences);
        }
        if (profile.onboarding_step && profile.onboarding_step > 1) {
          const adjustedStep = profile.onboarding_step > 2 ? profile.onboarding_step - 1 : profile.onboarding_step;
          setCurrentStep(adjustedStep < 5 ? adjustedStep : 1); // Reset if invalid
        }
      }
    };

    checkUser();
  }, [router]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);

      setAvatarUrl(publicUrl);
      await db.updateUserProfile(user.id, { avatar_url: publicUrl });

      toast({ title: 'Avatar uploaded!', description: 'Your profile picture has been saved.' });
    } catch (error) {
      toast({ title: 'Upload failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (user) {
        try {
          const dbStep = nextStep >= 3 ? nextStep + 1 : nextStep;
          await db.updateOnboardingProgress(user.id, dbStep);
        } catch (error) {
          console.error('Failed to save progress:', error);
        }
      }
    } else {
      setIsLoading(true);
      try {
        if (user) {
          try { await db.updateOnboardingProgress(user.id, 5, true); } catch (e) { console.error(e); }
          try { await db.updateUserPreferences(user.id, preferences); } catch (e) { console.error(e); }
        }

        toast({ title: 'Welcome to FinTrack!', description: 'Redirecting you to the dashboard...' });
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push('/dashboard');
      } catch (error) {
        console.error('Onboarding completion failed:', error);
        toast({ title: 'Setup failed', description: 'Redirecting you anyway.', variant: 'destructive' });
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    if (user) {
      const dbStep = currentStep >= 3 ? currentStep + 1 : currentStep;
      await db.updateOnboardingProgress(user.id, dbStep);
    }
    handleNext();
  };

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{ONBOARDING_STEPS[currentStep - 1].title}</CardTitle>
          <CardDescription>{ONBOARDING_STEPS[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="text-center space-y-4">
                <Check className="w-12 h-12 text-primary mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Welcome to FinTrack!</h3>
                <p className="text-muted-foreground">Hello {user.user_metadata?.full_name || 'there'}! Let's set up your profile.</p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
                <div className="flex items-center"><Bot className="w-6 h-6 mr-2" /> AI-Powered Insights</div>
                <div className="flex items-center"><Target className="w-6 h-6 mr-2" /> Goal Tracking</div>
                <div className="flex items-center"><BarChart3 className="w-6 h-6 mr-2" /> Smart Budgeting</div>
                <div className="flex items-center"><RefreshCw className="w-6 h-6 mr-2" /> Cross-Device Sync</div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>{(fullName || user.email).charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={() => document.getElementById('avatar-upload')?.click()} disabled={isLoading}>
                  <Upload className="w-4 h-4 mr-2" /> Upload Photo
                </Button>
                <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                <div className="w-full space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={preferences.currency} onValueChange={(value) => setPreferences({...preferences, currency: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center space-y-4">
                <Check className="w-12 h-12 text-green-600 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">You\'re All Set!</h3>
                <p className="text-muted-foreground">Welcome to FinTrack! Your personalized experience is ready.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex gap-2">
          {currentStep === 3 && (
            <Button variant="ghost" onClick={handleSkip}>Skip for now</Button>
          )}
          <Button onClick={handleNext} disabled={isLoading}>
            {currentStep === 5 ? (isLoading ? 'Completing Setup...' : 'Get Started') : 'Continue'}
            {currentStep < 5 && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}