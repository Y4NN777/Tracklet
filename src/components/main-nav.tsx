'use client';

import {
  LayoutDashboard,
  ReceiptText,
  Target,
  Sparkles,
  Lightbulb,
  Settings,
  User,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ReceiptText },
  { href: '/budgets', label: 'Budgets & Goals', icon: Target },
  { href: '/savings', label: 'Savings AI', icon: Sparkles },
  { href: '/insights', label: 'Financial Insights', icon: Lightbulb },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/settings/profile', label: 'Profile', icon: User },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
