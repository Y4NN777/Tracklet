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
import { Camera, Upload, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, db, supabase } from '@/lib/supabase';

const ONBOARDING_STEPS = [
  { id: 1, title: 'Welcome', description: 'Let\'s personalize your experience' },
  { id: 2, title: 'Profile Picture', description: 'Add a profile picture (optional)' },
  { id: 3, title: 'Preferences', description: 'Set your financial preferences' },
  { id: 4, title: 'All Set!', description: 'You\'re ready to start tracking' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

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

      // Load existing profile
      const { data: profile } = await db.getUserProfile(user.id);
      if (profile) {
        setProfile(profile);
        setFullName(profile.full_name || '');
        setAvatarUrl(profile.avatar_url || '');
        if (profile.preferences) {
          setPreferences(profile.preferences);
        }
        // Skip to appropriate step based on completion
        if (profile.onboarding_step && profile.onboarding_step > 1) {
          setCurrentStep(profile.onboarding_step);
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
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrl);

      // Update profile
      await db.updateUserProfile(user.id, { avatar_url: publicUrl });

      toast({
        title: 'Avatar uploaded!',
        description: 'Your profile picture has been saved.'
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      // Save progress
      if (user) {
        await db.updateOnboardingProgress(user.id, nextStep);
      }
    } else {
      // Complete onboarding
      if (user) {
        await db.updateOnboardingProgress(user.id, 4, true);
        await db.updateUserPreferences(user.id, preferences);
      }

      toast({
        title: 'Welcome to FinTrack! 🎉',
        description: 'Your account is ready to go.'
      });

      router.push('/');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    if (user) {
      await db.updateOnboardingProgress(user.id, currentStep);
    }
    handleNext();
  };

  const progress = (currentStep / 4) * 100;

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of 4</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{ONBOARDING_STEPS[currentStep - 1].title}</CardTitle>
          <CardDescription>{ONBOARDING_STEPS[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Account Created Successfully!</h3>
                <p className="text-muted-foreground">
                  Welcome to FinTrack, {user.email}. Let's personalize your experience.
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>
                    {fullName ? fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <Label htmlFor="avatar-upload">Profile Picture (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>Uploading...</>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          Upload Photo
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <Label htmlFor="full-name">Full Name (Optional)</Label>
                  <Input
                    id="full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences({...preferences, dateFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Notifications</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="budget-alerts">Budget Alerts</Label>
                      <Switch
                        id="budget-alerts"
                        checked={preferences.notifications.budgetAlerts}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            notifications: { ...preferences.notifications, budgetAlerts: checked }
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="goal-reminders">Goal Reminders</Label>
                      <Switch
                        id="goal-reminders"
                        checked={preferences.notifications.goalReminders}
                        onCheckedChange={(checked) =>
                          setPreferences({
                            ...preferences,
                            notifications: { ...preferences.notifications, goalReminders: checked }
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">You're All Set!</h3>
                <p className="text-muted-foreground">
                  Your FinTrack account is ready. Start tracking your finances and reach your goals!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex gap-2">
          {currentStep === 2 && (
            <Button variant="ghost" onClick={handleSkip}>
              Skip for now
            </Button>
          )}
          <Button onClick={handleNext} disabled={isLoading}>
            {currentStep === 4 ? (
              <>Get Started</>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}