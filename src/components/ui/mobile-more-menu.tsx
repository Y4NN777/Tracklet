"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Wallet,
  PiggyBank,
  GraduationCap,
  TrendingUp,
  Tag
} from "lucide-react"

const moreItems = [
  {
    name: "Accounts",
    href: "/accounts",
    icon: Wallet
  },
  {
    name: "Savings",
    href: "/savings",
    icon: PiggyBank
  },
  {
    name: "Learning",
    href: "/learning",
    icon: GraduationCap
  },
  {
    name: "Insights",
    href: "/insights",
    icon: TrendingUp
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Tag
  }
]

interface MobileMoreMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileMoreMenu({ open, onOpenChange }: MobileMoreMenuProps) {
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-lg">
        <SheetHeader>
          <SheetTitle>More</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {moreItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.name} href={item.href} onClick={() => onOpenChange(false)}>
                <Button
                  variant={isActive ? "default" : "outline"}
                  className={cn(
                    "flex flex-col items-center justify-center h-20 w-full p-4 gap-2",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium text-center">{item.name}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}