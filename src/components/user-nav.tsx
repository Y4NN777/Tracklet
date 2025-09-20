'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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
import { auth, supabase, db } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useIntlayer } from 'next-intlayer';

export function UserNav() {
  const i = useIntlayer('user-nav');
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user session and profile
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        // Fetch profile data for avatar
        try {
          const profileData = await db.getUserProfile(session.user.id);
          setProfile(profileData.data);
        } catch (error) {
//          console.warn('Failed to load profile:', error);
        }
      }

      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);

        if (session?.user) {
          // Fetch profile data when user signs in
          try {
            const profileData = await db.getUserProfile(session.user.id);
            setProfile(profileData.data);
          } catch (error) {
//            console.warn('Failed to load profile:', error);
          }
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const displayName = user?.user_metadata?.full_name || profile?.full_name || user?.email?.split('@')[0] || i.userFallback;
  const displayEmail = user?.email || i.userEmailFallback;
  // Use profile avatar_url first, then fall back to user metadata
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      const { error } = await auth.signOut();

      if (error) {
//        console.error('Logout error:', error);
        toast({
          title: i.errorTitle,
          description: i.logoutError,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: i.loggedOutTitle,
        description: i.loggedOutDescription,
      });
    } catch (error) {
//      console.error('Unexpected logout error:', error);
      toast({
        title: i.errorTitle,
        description: i.unexpectedLogoutError,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{i.loading}</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings/profile">
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                <span>{i.profile}</span>
              </Button>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>{i.billing}</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                <span>{i.settings}</span>
              </Button>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{i.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
