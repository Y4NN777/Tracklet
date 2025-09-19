"use client"

import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileDataCard, TransactionCard, BudgetCard } from "./mobile-data-card"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface MobileDataListProps {
  items: any[]
  type: "transactions" | "budgets" | "goals" | "generic"
  renderTableRow?: (item: any) => React.ReactNode
  renderCard?: (item: any) => React.ReactNode
  emptyState?: {
    title: string
    description: string
    action?: {
      label: string
      onClick: () => void
    }
  }
  loading?: boolean
  className?: string
}

export function MobileDataList({
  items,
  type,
  renderTableRow,
  renderCard,
  emptyState,
  loading = false,
  className
}: MobileDataListProps) {
  const isMobile = useIsMobile()

  // Default card renderers for common types
  const getDefaultCardRenderer = (itemType: string) => {
    switch (itemType) {
      case "transactions":
        return (item: any) => (
          <TransactionCard
            key={item.id}
            transaction={item}
//            onEdit={() => console.log("Edit transaction", item.id)}
//            onDelete={() => console.log("Delete transaction", item.id)}
          />
        )
      case "budgets":
        return (item: any) => (
          <BudgetCard
            key={item.id || item.name}
            budget={item}
//            onEdit={() => console.log("Edit budget", item.id || item.name)}
//            onDelete={() => console.log("Delete budget", item.id || item.name)}
          />
        )
      default:
        return (item: any) => (
          <MobileDataCard
            key={item.id || item.name}
            title={item.title || item.name || "Item"}
            subtitle={item.subtitle || item.description}
            amount={item.amount}
            badge={item.badge}
            metadata={item.metadata}
          />
        )
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-3 bg-muted rounded w-20"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  // Empty state
  if (items.length === 0 && emptyState) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-[300px] space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold">{emptyState.title}</h3>
            <p className="text-muted-foreground mt-2">{emptyState.description}</p>
          </div>
          {emptyState.action && (
            <Button onClick={emptyState.action.onClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {emptyState.action.label}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // Mobile view - always use cards
  if (isMobile) {
    const cardRenderer = renderCard || getDefaultCardRenderer(type)

    return (
      <div className={className}>
        {items.map(cardRenderer)}
      </div>
    )
  }

  // Desktop view - use table if available, otherwise cards
  if (renderTableRow) {
    return (
      <div className={cn("border rounded-md", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(renderTableRow)}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Fallback to cards on desktop if no table renderer
  const cardRenderer = renderCard || getDefaultCardRenderer(type)
  return (
    <div className={className}>
      {items.map(cardRenderer)}
    </div>
  )
}

// Utility hook for responsive behavior
export function useResponsiveDataView() {
  const isMobile = useIsMobile()

  return {
    isMobile,
    viewMode: isMobile ? "cards" : "table",
    shouldUseCards: isMobile
  }
}