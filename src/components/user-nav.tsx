'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreditCard, LogOut, Settings, User } from 'lucide-react';
import { auth } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function UserNav() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // Step 1: Call logout API for server-side cleanup
      const response = await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.warn('Logout API failed, proceeding with client logout');
      }

      // Step 2: Client-side logout (triggers AuthGuard redirect)
      const { error } = await auth.signOut();

      if (error) {
        console.error('Client logout error:', error);
        toast({
          title: 'Error',
          description: 'Failed to log out. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Step 3: Success feedback (AuthGuard handles redirect)
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });

    } catch (error) {
      console.error('Logout error:', error);

      // Fallback: Try client-only logout
      try {
        const { error: fallbackError } = await auth.signOut();
        if (!fallbackError) {
          toast({
            title: 'Logged out',
            description: 'You have been logged out.',
          });
        }
      } catch (fallbackError) {
        toast({
          title: 'Error',
          description: 'Failed to log out. Please refresh the page.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://placehold.co/100x100.png" alt="@shadcn" data-ai-hint="person portrait" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">User</p>
            <p className="text-xs leading-none text-muted-foreground">
              user@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings/profile">
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Button>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Button>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
