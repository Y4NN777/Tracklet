'use client';

import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Sparkles,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useIntlayer } from 'next-intlayer';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';

export function MainNav() {
  const i = useIntlayer('main-nav');
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: i.home, icon: LayoutDashboard },
    { href: '/wallet', label: i.wallet, icon: Wallet },
    { href: '/growth', label: i.growth, icon: TrendingUp },
    { href: '/assistant', label: i.assistant, icon: Sparkles },
  ];

  return (
    <div className="space-y-4 pt-4">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                  className="py-6"
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="text-base font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <div className="mt-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/settings')}
                  tooltip={i.settings}
                >
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    <span>{i.settings}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
    </div>
  );
}
