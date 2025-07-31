'use client';

import { useToast } from '@/hooks/use-toast';

interface ErrorToastProps {
  title?: string;
  description?: string;
}

export function ErrorToast({ title = 'Error', description = 'Something went wrong. Please try again.' }: ErrorToastProps) {
  const { toast } = useToast();

  const showError = () => {
    toast({
      title,
      description,
      variant: 'destructive',
    });
  };

  return showError;
}