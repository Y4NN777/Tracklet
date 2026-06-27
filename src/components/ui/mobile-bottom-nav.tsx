"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Wallet,
  Target,
  GraduationCap,
  Settings,
} from "lucide-react"
import { useIntlayer } from 'next-intlayer';

export function MobileBottomNav() {
  const i = useIntlayer('main-nav');
  const pathname = usePathname()

  const navigationItems = [
    {
      name: i.home,
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: i.finance,
      href: "/accounts",
      icon: Wallet,
    },
    {
      name: i.planning,
      href: "/budgets",
      icon: Target,
    },
    {
      name: i.hub,
      href: "/learning",
      icon: GraduationCap,
    },
    {
      name: i.settings,
      href: "/settings",
      icon: Settings,
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <nav className="flex items-center justify-around h-16 px-2">
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.href) || (item.href === '/dashboard' && pathname === '/')

          return (
            <Link key={item.name} href={item.href} className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center justify-center w-full h-14 p-1 gap-1 rounded-none bg-transparent hover:bg-transparent",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                <span className="text-[10px] font-medium text-center leading-tight">{item.name}</span>
                {isActive && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
