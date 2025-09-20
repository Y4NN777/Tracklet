'use client';

import { useState, useEffect, Suspense } from 'react';
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
import { useIntlayer } from 'next-intlayer';

function TermsAcceptanceContent() {
  const i = useIntlayer('terms-page');
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

  const handleDecline = () => {
    router.push('/auth/login?message=terms_required');
  };

  const handleAcceptAll = async () => {
    // For authenticated users (OAuth flow), require all checkboxes
    if (isAuthenticated && (!acceptances.terms || !acceptances.privacy || !acceptances.dataProcessing)) {
      toast({
        title: i.acceptAllToastTitle,
        description: i.acceptAllToastDescription,
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

      // Get user profile to check onboarding status
      const { data: profile } = await db.getUserProfile(user.id);

      // Success - show toast and redirect
      toast({
        title: i.termsAcceptedToastTitle,
        description: i.termsAcceptedToastDescription,
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
        // Fallback redirect
        if (profile?.onboarding_completed) {
          window.location.href = '/';
        } else {
          window.location.href = '/onboarding';
        }
      }

    } catch (error) {
      // Show specific error to user
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      toast({
        title: i.acceptanceFailedToastTitle,
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);  // Always reset loading state
    }
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
                <p className="text-muted-foreground">{i.loading}</p>
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
            <CardTitle className="text-2xl">{i.title}</CardTitle>
            <CardDescription className="text-lg">
              {isAuthenticated === null
                ? i.loading
                : isAuthenticated
                  ? i.descriptionAuthenticated
                  : i.descriptionUnauthenticated
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
                    <h3 className="font-semibold text-lg mb-2">{i.termsOfServiceTitle}</h3>
                    <div className="text-sm text-muted-foreground space-y-3">
                      <p>
                        <strong>{i.terms1Title}</strong><br />
                        {i.terms1Content}
                      </p>
                      <p>
                        <strong>{i.terms2Title}</strong><br />
                        {i.terms2Content}
                      </p>
                      <p>
                        <strong>{i.terms3Title}</strong><br />
                        {i.terms3Content}
                      </p>
                      <p>
                        <strong>{i.terms4Title}</strong><br />
                        {i.terms4Content}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Privacy Policy */}
                <div className="flex items-start space-x-3">
                  <Lock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{i.privacyPolicyTitle}</h3>
                    <div className="text-sm text-muted-foreground space-y-3">
                      <p>
                        <strong>{i.privacy1Title}</strong><br />
                        {i.privacy1Content}
                      </p>
                      <p>
                        <strong>{i.privacy2Title}</strong><br />
                        {i.privacy2Content}
                      </p>
                      <p>
                        <strong>{i.privacy3Title}</strong><br />
                        {i.privacy3Content}
                      </p>
                      <p>
                        <strong>{i.privacy4Title}</strong><br />
                        {i.privacy4Content}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Data Processing */}
                <div className="flex items-start space-x-3">
                  <Database className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{i.dataProcessingTitle}</h3>
                    <div className="text-sm text-muted-foreground space-y-3">
                      <p>
                        <strong>{i.data1Title}</strong><br />
                        {i.data1Content}
                      </p>
                      <p>
                        <strong>{i.data2Title}</strong><br />
                        {i.data2Content}
                      </p>
                      <p>
                        <strong>{i.data3Title}</strong><br />
                        {i.data3Content}
                      </p>
                      <p>
                        <strong>{i.data4Title}</strong><br />
                        {i.data4Content}
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
                      {i.acceptTermsLabel}
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {i.acceptTermsDescription}
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
                      {i.acceptPrivacyLabel}
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {i.acceptPrivacyDescription}
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
                      {i.acceptDataLabel}
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {i.acceptDataDescription}
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
                    {i.unauthenticatedInfo}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons - Conditional based on authentication and loading state */}
            {isAuthenticated === null ? (
              // Loading state
              <div className="flex justify-center pt-6 border-t">
                <div className="text-sm text-muted-foreground">{i.loading}</div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={isAuthenticated ? handleDecline : () => router.push(returnTo || '/signup')}
                  className="w-full sm:w-auto"
                  disabled={loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {isAuthenticated ? i.declineButton : i.backToSignupButton}
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto"
                  disabled={loading || (isAuthenticated && (!acceptances.terms || !acceptances.privacy || !acceptances.dataProcessing))}
                >
                  {loading
                    ? (isAuthenticated ? i.acceptingButton : i.redirectingButton)
                    : (isAuthenticated ? i.acceptAllButton : i.readTermsButton)
                  }
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              {i.unauthenticatedInfo}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading component that can access i18n
function LoadingFallback() {
  const i = useIntlayer('terms-page');
  
  return (
    <div className="fixed inset-0 min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8 px-4 overflow-auto">
      <div className="w-full max-w-6xl mx-auto">
        <Card className="w-full shadow-xl">
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{i.loading}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function TermsAcceptancePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TermsAcceptanceContent />
    </Suspense>
  );
}