'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Wallet,
  Target,
  PiggyBank,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Landmark
} from 'lucide-react';

const onboardingSteps = [
  {
    title: "Welcome to FinTrack AI",
    description: "Your personal finance assistant powered by artificial intelligence",
    icon: Landmark,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Landmark className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Smart Financial Management</h3>
          <p className="text-muted-foreground mt-2">
            FinTrack AI helps you take control of your finances with intelligent insights and automated tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="border rounded-lg p-4 text-center">
            <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">AI Insights</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Get personalized financial advice
            </p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <Target className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">Smart Budgeting</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Set and track financial goals
            </p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <PiggyBank className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">Savings Tips</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Discover ways to save more
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Track Your Transactions",
    description: "Easily record and categorize your income and expenses",
    icon: Wallet,
    content: (
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Automatic Categorization</h4>
              <p className="text-sm text-muted-foreground">
                Transactions are automatically categorized for easy tracking
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Import from Banks</h4>
              <p className="text-sm text-muted-foreground">
                Connect your bank accounts for automatic transaction imports
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Receipt Scanning</h4>
              <p className="text-sm text-muted-foreground">
                Upload receipts to automatically log expenses
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">Example Transaction</h4>
          <div className="flex justify-between items-center py-2 border-b">
            <span>Grocery Store</span>
            <Badge variant="destructive">-$85.30</Badge>
          </div>
          <div className="flex justify-between items-center py-2">
            <span>Salary Deposit</span>
            <Badge variant="default">+$3,200.00</Badge>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Set Financial Goals",
    description: "Create budgets and savings targets to achieve your financial objectives",
    icon: Target,
    content: (
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <Target className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Emergency Fund</span>
              <span className="text-sm">45%</span>
            </div>
            <Progress value={45} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>$2,250 saved</span>
              <span>$5,000 goal</span>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Vacation to Japan</span>
              <span className="text-sm">15%</span>
            </div>
            <Progress value={15} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>$450 saved</span>
              <span>$3,000 goal</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline">
            <PiggyBank className="h-4 w-4 mr-2" />
            Create Budget
          </Button>
          <Button variant="outline">
            <Target className="h-4 w-4 mr-2" />
            Set Goal
          </Button>
        </div>
      </div>
    )
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = onboardingSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Onboarding complete - redirect to dashboard
      router.push('/');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    router.push('/');
  };

  const StepIcon = onboardingSteps[currentStep].icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className="bg-primary/10 p-3 rounded-full inline-block">
              <StepIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl">{onboardingSteps[currentStep].title}</CardTitle>
          <CardDescription className="mt-2">{onboardingSteps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="min-h-[300px]">
            {onboardingSteps[currentStep].content}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
            <Button variant="ghost" onClick={handleSkip} className="w-full sm:w-auto">
              Skip Onboarding
            </Button>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious} className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
              <Button onClick={handleNext} className="w-full sm:w-auto">
                {currentStep === totalSteps - 1 ? 'Get Started' : 'Next'}
                {currentStep !== totalSteps - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}