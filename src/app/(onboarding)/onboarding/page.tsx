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
  { id: 3, title: 'Terms & Privacy', description: 'Review our terms and privacy policy' },
  { id: 4, title: 'Profile Setup', description: 'Personalize your experience' },
  { id: 5, title: 'Preferences', description: 'Customize your financial settings' },
  { id: 6, title: 'You\'re All Set!', description: 'Ready to take control of your finances' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

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

      // Detect if user signed up via OAuth
      setIsOAuthUser(user.app_metadata?.provider !== 'email');

      // Load existing profile
      const { data: profile } = await db.getUserProfile(user.id);
      if (profile) {
        setProfile(profile);
        setFullName(profile.full_name || '');
        setAvatarUrl(profile.avatar_url || '');
        setTermsAccepted(profile.terms_accepted || false);
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
    if (currentStep < 6) {
      let nextStep = currentStep + 1;

      // Skip terms step for non-OAuth users
      if (currentStep === 2 && !isOAuthUser) {
        nextStep = 4; // Skip from app info (2) to profile setup (4)
      }

      setCurrentStep(nextStep);

      // Save progress
      if (user) {
        try {
          await db.updateOnboardingProgress(user.id, nextStep);
        } catch (error) {
          console.error('Failed to save progress:', error);
          // Continue anyway - don't block user progress
        }
      }
    } else {
      // Complete onboarding with proper error handling
      setIsLoading(true);
      try {
        if (user) {
          // Update onboarding progress
          try {
            await db.updateOnboardingProgress(user.id, 6, true);
          } catch (error) {
            console.error('Failed to update onboarding progress:', error);
            // Continue with other operations
          }

          // Update user preferences
          try {
            await db.updateUserPreferences(user.id, preferences);
          } catch (error) {
            console.error('Failed to update preferences:', error);
            // Continue with other operations
          }

          // Update terms acceptance
          if (termsAccepted || !isOAuthUser) {
            try {
              await supabase
                .from('user_profiles')
                .update({
                  terms_accepted: true,
                  terms_accepted_at: new Date().toISOString()
                })
                .eq('id', user.id);
            } catch (error) {
              console.error('Failed to update terms acceptance:', error);
              // Continue anyway
            }
          }
        }

        // Small delay to allow database operations to complete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify profile update before redirect
        const { data: verifiedProfile, error: verifyError } = await db.getUserProfile(user.id);

        if (verifiedProfile?.onboarding_completed) {
          toast({
            title: 'Welcome to FinTrack!',
            description: 'Your account is ready to go.'
          });

          // Add delay to let toast be visible before navigation
          await new Promise(resolve => setTimeout(resolve, 1500));
          router.push('/');
        } else {
          // Profile update may not be visible yet, wait and retry
          console.warn('Profile verification failed, retrying...', verifyError);

          toast({
            title: 'Almost there!',
            description: 'Finalizing your account setup...'
          });

          // Wait a moment and retry verification
          setTimeout(async () => {
            const { data: retryProfile } = await db.getUserProfile(user.id);
            if (retryProfile?.onboarding_completed) {
              toast({
                title: 'Welcome to FinTrack!',
                description: 'Your account is ready to go.'
              });

              // Add delay before navigation
              await new Promise(resolve => setTimeout(resolve, 1500));
              router.push('/');
            } else {
              // If still not updated, show error but redirect anyway
              console.error('Profile update verification failed after retry');
              toast({
                title: 'Setup completed',
                description: 'Welcome to FinTrack! Some preferences may update shortly.',
                variant: 'default'
              });

              // Add delay before navigation
              await new Promise(resolve => setTimeout(resolve, 1500));
              router.push('/');
            }
          }, 2000);
        }
      } catch (error) {
        console.error('Onboarding completion failed:', error);
        toast({
          title: 'Setup completed with minor issues',
          description: 'Welcome to FinTrack! Some preferences may need to be set later.',
        });

        // Add delay before navigation even on error
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Still redirect to dashboard
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      let prevStep = currentStep - 1;

      // Skip terms step for non-OAuth users
      if (currentStep === 4 && !isOAuthUser) {
        prevStep = 2; // Skip from profile setup (4) back to app info (2)
      }

      setCurrentStep(prevStep);
    }
  };

  const handleSkip = async () => {
    if (user) {
      await db.updateOnboardingProgress(user.id, currentStep);
    }
    handleNext();
  };

  // Calculate total steps
  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of {totalSteps}</span>
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
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Welcome to FinTrack! <PartyPopper className="w-5 h-5" />
                </h3>
                <p className="text-muted-foreground">
                  Hello {user.user_metadata?.display_name || user.user_metadata?.name || user.user_metadata?.full_name || 'there'}! Your account has been created successfully. Let's set up your personalized finance experience.
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Discover FinTrack</h3>
                <p className="text-muted-foreground mb-6">Your AI-powered companion for smart financial management</p>
              </div>

              <div className="grid gap-4">
                <div className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">AI-Powered Insights</h4>
                    <p className="text-sm text-muted-foreground">Get smart spending analysis and personalized recommendations to optimize your finances.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Goal Tracking</h4>
                    <p className="text-sm text-muted-foreground">Set and monitor savings goals with visual progress tracking and milestone celebrations.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Smart Budgeting</h4>
                    <p className="text-sm text-muted-foreground">Create intelligent budgets with automatic alerts and spending pattern analysis.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Cross-Device Sync</h4>
                    <p className="text-sm text-muted-foreground">Access your financial data seamlessly across all your devices with real-time synchronization.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && isOAuthUser && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Terms & Privacy</h3>
                <p className="text-muted-foreground mb-6">Please review and accept our terms to continue</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Terms of Service</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    By using FinTrack, you agree to our terms of service which govern how we collect, use, and protect your financial data.
                  </p>
                  <a href="/terms" className="text-sm text-primary hover:underline">Read full terms →</a>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Privacy Policy</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your privacy is our priority. We use bank-level security to protect your financial information and never share it without your consent.
                  </p>
                  <a href="/privacy" className="text-sm text-primary hover:underline">Read privacy policy →</a>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms-acceptance"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="terms-acceptance" className="text-sm">
                    I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>
            </div>
          )}

          {(currentStep === 4 || (currentStep === 3 && !isOAuthUser)) && (
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>
                    {fullName ? fullName.charAt(0).toUpperCase() : (user.user_metadata?.display_name || user.user_metadata?.name || user.email).charAt(0).toUpperCase()}
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
                          <Upload className="w-4 h-4 mr-2" />
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

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Customize Your Experience</h3>
                <p className="text-muted-foreground">Set your preferences for the best financial tracking experience</p>
              </div>

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
                      {/* Major Global Reserve Currencies */}
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>

                      {/* European Currencies */}
                      <SelectItem value="SEK">SEK - Swedish Krona</SelectItem>
                      <SelectItem value="NOK">NOK - Norwegian Krone</SelectItem>
                      <SelectItem value="DKK">DKK - Danish Krone</SelectItem>
                      <SelectItem value="PLN">PLN - Polish Złoty</SelectItem>
                      <SelectItem value="CZK">CZK - Czech Koruna</SelectItem>
                      <SelectItem value="HUF">HUF - Hungarian Forint</SelectItem>
                      <SelectItem value="RON">RON - Romanian Leu</SelectItem>
                      <SelectItem value="BGN">BGN - Bulgarian Lev</SelectItem>
                      <SelectItem value="HRK">HRK - Croatian Kuna</SelectItem>
                      <SelectItem value="ISK">ISK - Icelandic Króna</SelectItem>

                      {/* North American Currencies */}
                      <SelectItem value="MXN">MXN - Mexican Peso</SelectItem>

                      {/* South American Currencies */}
                      <SelectItem value="BRL">BRL - Brazilian Real</SelectItem>
                      <SelectItem value="ARS">ARS - Argentine Peso</SelectItem>
                      <SelectItem value="CLP">CLP - Chilean Peso</SelectItem>
                      <SelectItem value="COP">COP - Colombian Peso</SelectItem>
                      <SelectItem value="PEN">PEN - Peruvian Sol</SelectItem>
                      <SelectItem value="UYU">UYU - Uruguayan Peso</SelectItem>
                      <SelectItem value="PYG">PYG - Paraguayan Guarani</SelectItem>
                      <SelectItem value="BOB">BOB - Bolivian Boliviano</SelectItem>
                      <SelectItem value="VES">VES - Venezuelan Bolívar</SelectItem>

                      {/* Asian Currencies */}
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="KRW">KRW - South Korean Won</SelectItem>
                      <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                      <SelectItem value="HKD">HKD - Hong Kong Dollar</SelectItem>
                      <SelectItem value="TWD">TWD - New Taiwan Dollar</SelectItem>
                      <SelectItem value="THB">THB - Thai Baht</SelectItem>
                      <SelectItem value="MYR">MYR - Malaysian Ringgit</SelectItem>
                      <SelectItem value="IDR">IDR - Indonesian Rupiah</SelectItem>
                      <SelectItem value="PHP">PHP - Philippine Peso</SelectItem>
                      <SelectItem value="VND">VND - Vietnamese Dong</SelectItem>
                      <SelectItem value="PKR">PKR - Pakistani Rupee</SelectItem>
                      <SelectItem value="BDT">BDT - Bangladeshi Taka</SelectItem>
                      <SelectItem value="LKR">LKR - Sri Lankan Rupee</SelectItem>
                      <SelectItem value="NPR">NPR - Nepalese Rupee</SelectItem>
                      <SelectItem value="MMK">MMK - Myanmar Kyat</SelectItem>
                      <SelectItem value="KHR">KHR - Cambodian Riel</SelectItem>
                      <SelectItem value="LAK">LAK - Lao Kip</SelectItem>

                      {/* Middle East & Central Asian Currencies */}
                      <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                      <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                      <SelectItem value="QAR">QAR - Qatari Riyal</SelectItem>
                      <SelectItem value="KWD">KWD - Kuwaiti Dinar</SelectItem>
                      <SelectItem value="BHD">BHD - Bahraini Dinar</SelectItem>
                      <SelectItem value="OMR">OMR - Omani Rial</SelectItem>
                      <SelectItem value="JOD">JOD - Jordanian Dinar</SelectItem>
                      <SelectItem value="ILS">ILS - Israeli Shekel</SelectItem>
                      <SelectItem value="TRY">TRY - Turkish Lira</SelectItem>
                      <SelectItem value="EGP">EGP - Egyptian Pound</SelectItem>
                      <SelectItem value="MAD">MAD - Moroccan Dirham</SelectItem>
                      <SelectItem value="TND">TND - Tunisian Dinar</SelectItem>
                      <SelectItem value="DZD">DZD - Algerian Dinar</SelectItem>
                      <SelectItem value="LYD">LYD - Libyan Dinar</SelectItem>
                      <SelectItem value="SDG">SDG - Sudanese Pound</SelectItem>
                      <SelectItem value="SYP">SYP - Syrian Pound</SelectItem>
                      <SelectItem value="IQD">IQD - Iraqi Dinar</SelectItem>
                      <SelectItem value="IRR">IRR - Iranian Rial</SelectItem>
                      <SelectItem value="YER">YER - Yemeni Rial</SelectItem>
                      <SelectItem value="AZN">AZN - Azerbaijani Manat</SelectItem>
                      <SelectItem value="KZT">KZT - Kazakhstani Tenge</SelectItem>
                      <SelectItem value="UZS">UZS - Uzbekistani Som</SelectItem>
                      <SelectItem value="TJS">TJS - Tajikistani Somoni</SelectItem>
                      <SelectItem value="TMT">TMT - Turkmenistani Manat</SelectItem>
                      <SelectItem value="AFN">AFN - Afghan Afghani</SelectItem>

                      {/* African Currencies */}
                      <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                      <SelectItem value="TZS">TZS - Tanzanian Shilling</SelectItem>
                      <SelectItem value="UGX">UGX - Ugandan Shilling</SelectItem>
                      <SelectItem value="RWF">RWF - Rwandan Franc</SelectItem>
                      <SelectItem value="BIF">BIF - Burundian Franc</SelectItem>
                      <SelectItem value="ETB">ETB - Ethiopian Birr</SelectItem>
                      <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                      <SelectItem value="XOF">XOF - West African CFA Franc</SelectItem>
                      <SelectItem value="XAF">XAF - Central African CFA Franc</SelectItem>
                      <SelectItem value="CDF">CDF - Congolese Franc</SelectItem>
                      <SelectItem value="MGA">MGA - Malagasy Ariary</SelectItem>
                      <SelectItem value="MUR">MUR - Mauritian Rupee</SelectItem>
                      <SelectItem value="SCR">SCR - Seychellois Rupee</SelectItem>
                      <SelectItem value="MWK">MWK - Malawian Kwacha</SelectItem>
                      <SelectItem value="ZMW">ZMW - Zambian Kwacha</SelectItem>
                      <SelectItem value="BWP">BWP - Botswana Pula</SelectItem>
                      <SelectItem value="SZL">SZL - Swazi Lilangeni</SelectItem>
                      <SelectItem value="LSL">LSL - Lesotho Loti</SelectItem>
                      <SelectItem value="NAD">NAD - Namibian Dollar</SelectItem>
                      <SelectItem value="MZN">MZN - Mozambican Metical</SelectItem>
                      <SelectItem value="AOA">AOA - Angolan Kwanza</SelectItem>
                      <SelectItem value="CVE">CVE - Cape Verdean Escudo</SelectItem>
                      <SelectItem value="STN">STN - São Tomé and Príncipe Dobra</SelectItem>
                      <SelectItem value="GMD">GMD - Gambian Dalasi</SelectItem>
                      <SelectItem value="SLL">SLL - Sierra Leonean Leone</SelectItem>
                      <SelectItem value="LRD">LRD - Liberian Dollar</SelectItem>

                      {/* Oceania Currencies */}
                      <SelectItem value="NZD">NZD - New Zealand Dollar</SelectItem>
                      <SelectItem value="FJD">FJD - Fijian Dollar</SelectItem>
                      <SelectItem value="TOP">TOP - Tongan Paʻanga</SelectItem>
                      <SelectItem value="WST">WST - Samoan Tala</SelectItem>
                      <SelectItem value="VUV">VUV - Vanuatu Vatu</SelectItem>
                      <SelectItem value="SBD">SBD - Solomon Islands Dollar</SelectItem>
                      <SelectItem value="PGK">PGK - Papua New Guinean Kina</SelectItem>

                      {/* Cryptocurrencies (for completeness) */}
                      <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                      <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                      <SelectItem value="USDT">USDT - Tether</SelectItem>
                      <SelectItem value="BNB">BNB - Binance Coin</SelectItem>
                      <SelectItem value="ADA">ADA - Cardano</SelectItem>
                      <SelectItem value="SOL">SOL - Solana</SelectItem>
                      <SelectItem value="DOT">DOT - Polkadot</SelectItem>
                      <SelectItem value="DOGE">DOGE - Dogecoin</SelectItem>
                      <SelectItem value="AVAX">AVAX - Avalanche</SelectItem>
                      <SelectItem value="MATIC">MATIC - Polygon</SelectItem>
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

          {currentStep === 6 && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  You're All Set! <PartyPopper className="w-5 h-5" />
                </h3>
                <p className="text-muted-foreground">
                  Welcome to FinTrack, {user.user_metadata?.display_name || user.user_metadata?.name || user.user_metadata?.full_name || 'valued user'}! Your personalized finance tracking experience is ready. Start managing your money smarter today!
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
          {(currentStep === 4 || (currentStep === 3 && !isOAuthUser)) && (
            <Button variant="ghost" onClick={handleSkip}>
              Skip for now
            </Button>
          )}
          {currentStep === 3 && isOAuthUser && !termsAccepted && (
            <Button variant="ghost" onClick={() => router.push('/login')}>
              Decline & Sign Out
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={isLoading || (currentStep === 3 && isOAuthUser && !termsAccepted)}
          >
            {currentStep === 6 ? (
              isLoading ? (
                <>Completing Setup...</>
              ) : (
                <>Get Started</>
              )
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
