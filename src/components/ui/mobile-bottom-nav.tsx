"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Wallet,
  CreditCard,
  Target,
  PiggyBank,
  GraduationCap,
  TrendingUp,
  Settings,
  HomeIcon,
  CreditCardIcon,
  TargetIcon,
  TrendingUpIcon,
  SettingsIcon
} from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    activeIcon: HomeIcon
  },
  {
    name: "Accounts",
    href: "/accounts",
    icon: Wallet,
    activeIcon: Wallet
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: CreditCard,
    activeIcon: CreditCardIcon
  },
  {
    name: "Budgets",
    href: "/budgets",
    icon: Target,
    activeIcon: TargetIcon
  },
  {
    name: "Savings",
    href: "/savings",
    icon: PiggyBank,
    activeIcon: PiggyBank
  },
  {
    name: "Learning",
    href: "/learning",
    icon: GraduationCap,
    activeIcon: GraduationCap
  },
  {
    name: "Insights",
    href: "/insights",
    icon: TrendingUp,
    activeIcon: TrendingUpIcon
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    activeIcon: SettingsIcon
  }
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <nav className="flex items-center h-16 px-2 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-1 min-w-max">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = isActive ? item.activeIcon : item.icon

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[60px] h-12 p-1 gap-1 flex-shrink-0 rounded-lg",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium text-center leading-tight">{item.name}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}