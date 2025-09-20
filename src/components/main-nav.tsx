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
import { useIntlayer } from 'next-intlayer';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export function MainNav() {
  const i = useIntlayer('main-nav');
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: i.dashboard, icon: LayoutDashboard },
    { href: '/accounts', label: i.accounts, icon: Wallet },
    { href: '/transactions', label: i.transactions, icon: ReceiptText },
    { href: '/settings/categories', label: i.categories, icon: Tag },
    { href: '/budgets', label: i.budgetsAndGoals, icon: Target },
    { href: '/savings', label: i.savingsAI, icon: Sparkles },
    { href: '/insights', label: i.financialInsights, icon: Lightbulb },
    { href: '/learning', label: i.learningCenter, icon: GraduationCap },
    { href: '/settings', label: i.settings, icon: Settings },
    { href: '/settings/profile', label: i.profile, icon: User },
  ];

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
