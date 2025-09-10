"use client"

import { Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Landmark className="h-6 w-6 text-primary flex-shrink-0" />
      <h1 className={cn(
        "text-lg font-bold text-primary transition-opacity duration-200",
        isCollapsed && "opacity-0"
      )}>
        FinTrack
      </h1>
    </div>
  );
}
