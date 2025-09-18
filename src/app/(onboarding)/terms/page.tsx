'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  FileText,
  Lock,
  Users,
  Database,
  Mail,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TermsAcceptancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [returnTo, setReturnTo] = useState('');
  const [acceptances, setAcceptances] = useState({
    terms: false,
    privacy: false,
    dataProcessing: false
  });

  // Check authentication status and get return URL
  useEffect(() => {
    const initializePage = async () => {
      try {
        // Check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.warn('Session check error:', sessionError);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!session);
        }

        // Get return URL from query parameters
        const returnUrl = searchParams.get('return_to');
        if (returnUrl) {
          setReturnTo(returnUrl);
        }
      } catch (error) {
        console.error('Error initializing terms page:', error);
        setIsAuthenticated(false);
      }
    };

    initializePage();
  }, [searchParams]);

  const handleAcceptanceChange = (type: keyof typeof acceptances) => {
    setAcceptances(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleAcceptAll = async () => {
    // For authenticated users (OAuth flow), require all checkboxes
    if (isAuthenticated && (!acceptances.terms || !acceptances.privacy || !acceptances.dataProcessing)) {
      toast({
        title: 'Please accept all terms',
        description: 'You must accept all terms and conditions to continue.',
        variant: 'destructive',
      });
      return;
    }

    // For non-authenticated users (signup flow), just redirect back
    if (!isAuthenticated) {
      const redirectUrl = returnTo || '/signup';
      await router.push(redirectUrl);
      return;
    }

    // For authenticated users, proceed with database update
    setLoading(true);
    try {
      // Get current user with better validation
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(`Authentication error: ${userError.message}`);
      }

      if (!user?.id) {
        throw new Error('No authenticated user found');
      }

      console.log('Updating terms acceptance for user:', user.id);

      // Database update with detailed error
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        throw new Error(`Database update failed: ${updateError.message} (Code: ${updateError.code || 'Unknown'})`);
      }

      console.log('Terms acceptance updated successfully');

      // Get user profile to check onboarding status
      const { data: profile } = await db.getUserProfile(user.id);

      // Success - show toast and redirect
      toast({
        title: 'Terms accepted!',
        description: 'Welcome to FinTrack. Setting up your account...',
      });

      // Safe redirect with error handling
      try {
        if (profile?.onboarding_completed) {
          // User already completed onboarding - go to dashboard
          await router.push('/');
        } else {
          // User needs onboarding - go to onboarding page
          await router.push('/onboarding');
        }
      } catch (routerError) {
        console.error('Router navigation failed:', routerError);
        // Fallback redirect
        if (profile?.onboarding_completed) {
          window.location.href = '/';
        } else {
          window.location.href = '/onboarding';
        }
      }

    } catch (error) {
      console.error('Terms acceptance failed:', error);

      // Show specific error to user
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      toast({
        title: 'Terms Acceptance Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);  // Always reset loading state
    }
  };

  const handleDecline = () => {
    // For OAuth users, declining terms means they can't use the app
    // Redirect them back to login or show an explanation
    router.push('/auth/login?message=terms_required');
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="fixed inset-0 min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8 px-4 overflow-auto">
        <div className="w-full max-w-6xl mx-auto">
          <Card className="w-full shadow-xl">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8 px-4 overflow-auto">
      <div className="w-full max-w-6xl mx-auto">
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Terms and Conditions</CardTitle>
            <CardDescription className="text-lg">
              {isAuthenticated === null
                ? "Loading..."
                : isAuthenticated
                  ? "Please review and accept our terms and conditions to continue"
                  : "Please read our terms and conditions before creating your account"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <ScrollArea className="h-[400px] w-full border rounded-lg p-4">
              {/* Terms of Service */}
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Terms of Service</h3>
                    <div className="text-sm text-muted-foreground space-y-3">
                      <p>
                        <strong>1. Acceptance of Terms</strong><br />
                        By accessing and using FinTrack, you accept and agree to be bound by the terms and provision of this agreement.
                      </p>
                      <p>
                        <strong>2. Use License</strong><br />
                        Permission is granted to temporarily use FinTrack for personal, non-commercial transitory viewing only.
                      </p>
                      <p>
                        <strong>3. Disclaimer</strong><br />
                        The materials on FinTrack are provided on an 'as is' basis. FinTrack makes no warranties, expressed or implied.
                      </p>
                      <p>
                        <strong>4. Limitations</strong><br />
                        In no event shall FinTrack be liable for any damages arising out of the use of our services.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Privacy Policy */}
                <div className="flex items-start space-x-3">
                  <Lock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Privacy Policy</h3>
                    <div className="text-sm text-muted-foreground space-y-3">
                      <p>
                        <strong>1. Information We Collect</strong><br />
                        We collect information you provide directly, such as when you create an account or use our services.
                      </p>
                      <p>
                        <strong>2. How We Use Information</strong><br />
                        We use the information to provide, maintain, and improve our services, and to communicate with you.
                      </p>
                      <p>
                        <strong>3. Information Sharing</strong><br />
                        We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.
                      </p>
                      <p>
                        <strong>4. Data Security</strong><br />
                        We implement appropriate security measures to protect your personal information against unauthorized access.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Data Processing */}
                <div className="flex items-start space-x-3">
                  <Database className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Data Processing Agreement</h3>
                    <div className="text-sm text-muted-foreground space-y-3">
                      <p>
                        <strong>1. Data Controller</strong><br />
                        FinTrack acts as the data controller for personal data processed through our services.
                      </p>
                      <p>
                        <strong>2. Legal Basis</strong><br />
                        We process your data based on your consent and legitimate business interests.
                      </p>
                      <p>
                        <strong>3. Data Retention</strong><br />
                        We retain your data for as long as necessary to provide our services and comply with legal obligations.
                      </p>
                      <p>
                        <strong>4. Your Rights</strong><br />
                        You have the right to access, rectify, erase, and port your personal data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Acceptance Checkboxes - Only for authenticated users */}
            {isAuthenticated && (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptances.terms}
                    onCheckedChange={() => handleAcceptanceChange('terms')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                      I accept the Terms of Service
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      I agree to abide by FinTrack's terms and conditions of use.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={acceptances.privacy}
                    onCheckedChange={() => handleAcceptanceChange('privacy')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor="privacy" className="text-sm font-medium cursor-pointer">
                      I accept the Privacy Policy
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      I consent to the collection and processing of my personal data as described.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="dataProcessing"
                    checked={acceptances.dataProcessing}
                    onCheckedChange={() => handleAcceptanceChange('dataProcessing')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor="dataProcessing" className="text-sm font-medium cursor-pointer">
                      I accept the Data Processing Agreement
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      I understand how my financial data will be processed and stored.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Info message for non-authenticated users */}
            {isAuthenticated === false && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    By proceeding with account creation, you acknowledge that you have read and understood our terms and conditions.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons - Conditional based on authentication and loading state */}
            {isAuthenticated === null ? (
              // Loading state
              <div className="flex justify-center pt-6 border-t">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => router.push(returnTo || '/signup')}
                  className="w-full sm:w-auto"
                  disabled={loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {isAuthenticated ? 'Decline & Return to Login' : 'Back to Signup'}
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto"
                  disabled={loading || (isAuthenticated && (!acceptances.terms || !acceptances.privacy || !acceptances.dataProcessing))}
                >
                  {loading
                    ? (isAuthenticated ? 'Accepting...' : 'Redirecting...')
                    : (isAuthenticated ? 'Accept All & Continue' : 'I Have Read the Terms')
                  }
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              By continuing, you acknowledge that you have read and understood our terms and conditions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}