"use client"

import * as React from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { MobileBottomNav } from '@/components/ui/mobile-bottom-nav';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { NotificationBell } from '@/components/notification-bell';
import { AuthGuard } from '@/components/auth-guard';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()

  return (
    <AuthGuard requireAuth={true} requireOnboarding={true}>
      {isMobile ? (
        // Mobile layout with bottom navigation
        <div className="min-h-screen bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b bg-background/80 px-4 backdrop-blur-sm">
            <Logo />
            <div className="flex items-center gap-2">
              <NotificationBell />
              <UserNav />
            </div>
          </header>
          <main className="flex-1 p-4 pb-20">{children}</main>
          <MobileBottomNav />
        </div>
      ) : (
        // Desktop layout with sidebar
        <SidebarProvider>
          <Sidebar collapsible="icon">
            <SidebarHeader>
              <Logo />
            </SidebarHeader>
            <SidebarContent>
              <MainNav />
            </SidebarContent>
            <SidebarFooter>
              {/* Footer content if any */}
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b bg-background/80 px-2 backdrop-blur-sm sm:px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
                  <NotificationBell />
                <UserNav />
              </div>
            </header>
            <main className="flex-1 p-2 sm:p-4">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      )}
    </AuthGuard>
  );
}
