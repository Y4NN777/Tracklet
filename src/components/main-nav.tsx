'use client';

import {
  LayoutDashboard,
  ReceiptText,
  Target,
  Sparkles,
  Lightbulb,
  Settings,
  User,
  Wallet,
  Tag,
  GraduationCap,
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
  { href: '/accounts', label: 'Accounts', icon: Wallet },
  { href: '/transactions', label: 'Transactions', icon: ReceiptText },
  { href: '/settings/categories', label: 'Categories', icon: Tag },
  { href: '/budgets', label: 'Budgets & Goals', icon: Target },
  { href: '/savings', label: 'Savings AI', icon: Sparkles },
  { href: '/insights', label: 'Financial Insights', icon: Lightbulb },
  { href: '/learning', label: 'Learning Center', icon: GraduationCap },
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
            className="md:py-2"
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm md:text-base">{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
