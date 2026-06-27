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
  ChevronRight,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function MainNav() {
  const i = useIntlayer('main-nav');
  const pathname = usePathname();

  const navGroups = [
    {
      label: i.home,
      items: [
        { href: '/dashboard', label: i.dashboard, icon: LayoutDashboard },
      ]
    },
    {
      label: i.finance,
      items: [
        { href: '/accounts', label: i.accounts, icon: Wallet },
        { href: '/transactions', label: i.transactions, icon: ReceiptText },
      ]
    },
    {
      label: i.planning,
      items: [
        { href: '/budgets', label: i.budgetsAndGoals, icon: Target },
        { href: '/savings', label: i.savingsAI, icon: Sparkles },
        { href: '/insights', label: i.financialInsights, icon: Lightbulb },
      ]
    },
    {
      label: i.hub,
      items: [
        { href: '/learning', label: i.learningCenter, icon: GraduationCap },
      ]
    },
  ];

  return (
    <div className="space-y-4">
      {navGroups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}

      <SidebarGroup>
        <SidebarGroupLabel>{i.settings}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/settings'}
                tooltip={i.settings}
              >
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                  <span>{i.settings}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
}
