'use client';

import { useState } from 'react';
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
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function TermsAcceptancePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [acceptances, setAcceptances] = useState({
    terms: false,
    privacy: false,
    dataProcessing: false
  });

  const handleAcceptanceChange = (type: keyof typeof acceptances) => {
    setAcceptances(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleAcceptAll = async () => {
    if (!acceptances.terms || !acceptances.privacy || !acceptances.dataProcessing) {
      toast({
        title: 'Please accept all terms',
        description: 'You must accept all terms and conditions to continue.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({
          title: 'Authentication Error',
          description: 'Please log in again.',
          variant: 'destructive',
        });
        return;
      }

      // Update user profile with terms acceptance
      const { error } = await supabase
        .from('user_profiles')
        .update({
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Failed to accept terms:', error);
        toast({
          title: 'Error',
          description: 'Failed to accept terms. Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Terms accepted!',
          description: 'Welcome to FinTrack. Setting up your account...',
        });
        // Redirect to main onboarding flow
        router.push('/onboarding/onboarding');
      }
    } catch (error) {
      console.error('Error accepting terms:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept terms. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = () => {
    // For OAuth users, declining terms means they can't use the app
    // Redirect them back to login or show an explanation
    router.push('/auth/login?message=terms_required');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to FinTrack</CardTitle>
          <CardDescription className="text-lg">
            Before we get started, please review and accept our terms and conditions
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <ScrollArea className="h-[400px] w-full border rounded-lg p-4">
            {/* Terms of Service */}
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-primary mt-1" />
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
                <Lock className="h-5 w-5 text-primary mt-1" />
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
                <Database className="h-5 w-5 text-primary mt-1" />
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

          {/* Acceptance Checkboxes */}
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleDecline}
              className="w-full sm:w-auto"
              disabled={loading}
            >
              Decline & Return to Login
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="w-full sm:w-auto"
              disabled={loading || !acceptances.terms || !acceptances.privacy || !acceptances.dataProcessing}
            >
              {loading ? 'Accepting...' : 'Accept All & Continue'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            By continuing, you acknowledge that you have read and understood our terms and conditions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}