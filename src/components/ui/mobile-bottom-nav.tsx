"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  CreditCard,
  Target,
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
      <nav className="flex items-center justify-around h-16 px-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = isActive ? item.activeIcon : item.icon

          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center justify-center h-12 w-12 p-0 gap-1",
                  isActive && "text-primary"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}