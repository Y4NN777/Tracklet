"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Sparkles,
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
      name: i.wallet,
      href: "/wallet",
      icon: Wallet,
    },
    {
      name: i.growth,
      href: "/growth",
      icon: TrendingUp,
    },
    {
      name: i.assistant,
      href: "/assistant",
      icon: Sparkles,
    },
    {
      name: i.settings,
      href: "/settings",
      icon: Settings,
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border md:hidden">
      <nav className="flex items-center justify-around h-16 px-2">
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.href) || (item.href === '/dashboard' && pathname === '/')

          return (
            <Link key={item.name} href={item.href} className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center justify-center w-full h-14 p-1 gap-1 rounded-none bg-transparent hover:bg-transparent transition-all",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110 stroke-[2.5px]")} />
                <span className="text-[10px] font-bold tracking-tight uppercase">{item.name}</span>
                {isActive && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary animate-in zoom-in duration-300" />}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
