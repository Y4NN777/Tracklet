"use client"

import { Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  // Try to use sidebar context, but handle gracefully if not available
  let isCollapsed = false;
  try {
    const { state } = useSidebar();
    isCollapsed = state === 'collapsed';
  } catch (error) {
    // Sidebar context not available (e.g., in auth pages)
    // Logo will show normally without collapse behavior
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Landmark className="h-6 w-6 text-primary flex-shrink-0" />
      <h1 className={cn(
        "text-lg font-bold text-primary transition-opacity duration-200",
        isCollapsed && "opacity-0"
      )}>
        Tracklet
      </h1>
    </div>
  );
}
