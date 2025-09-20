'use client';

import { useToast } from '@/hooks/use-toast';
import { useIntlayer } from 'next-intlayer';

interface ErrorToastProps {
  title?: string;
  description?: string;
}

export function ErrorToast({ title, description }: ErrorToastProps) {
  const i = useIntlayer('error-toast');
  const { toast } = useToast();

  const showError = () => {
    toast({
      title: title || i.error,
      description: description || i.somethingWentWrong,
      variant: 'destructive',
    });
  };

  return showError;
}