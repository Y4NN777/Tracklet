import { Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Landmark className="h-6 w-6 text-primary" />
      <h1 className="text-lg font-bold text-primary">FinTrack</h1>
    </div>
  );
}
