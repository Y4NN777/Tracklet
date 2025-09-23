"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MoreHorizontal } from "lucide-react"
import { useCurrency } from "@/contexts/preferences-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MobileDataCardProps {
  title: string
  subtitle?: string
  amount?: number | string
  badge?: {
    text: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
  metadata?: Array<{
    label: string
    value: string
    icon?: React.ReactNode
  }>
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: "default" | "destructive"
  }>
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

export function MobileDataCard({
  title,
  subtitle,
  amount,
  badge,
  metadata = [],
  actions = [],
  onClick,
  className,
  children
}: MobileDataCardProps) {
  const formatAmount = (value: number | string) => {
    if (typeof value === 'string') return value
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const CardContentWrapper = onClick ? 'button' : 'div'

  return (
    <Card className={cn("mb-3", onClick && "cursor-pointer hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-4">
        <CardContentWrapper
          className={cn("w-full text-left", onClick && "focus:outline-none")}
          onClick={onClick}
        >
          {/* Header with title and amount/badge */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{title}</h3>
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate mt-1">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-2">
              {amount !== undefined && (
                <span className={cn(
                  "text-sm font-bold",
                  typeof amount === 'number' && amount > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {formatAmount(amount)}
                </span>
              )}
              {badge && (
                <Badge variant={badge.variant || "outline"} className="text-xs">
                  {badge.text}
                </Badge>
              )}
            </div>
          </div>

          {/* Metadata */}
          {metadata.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {metadata.map((item, index) => (
                <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span>{item.label}:</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Custom content */}
          {children}
        </CardContentWrapper>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex justify-end pt-2 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {actions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={action.onClick}
                    className={action.variant === "destructive" ? "text-destructive" : ""}
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Specialized card components
export function TransactionCard({
  transaction,
  onEdit,
  onDelete,
  onClick
}: {
  transaction: any
  onEdit?: () => void
  onDelete?: () => void
  onClick?: () => void
}) {
  const actions = []
  if (onEdit) actions.push({ label: "Edit", onClick: onEdit })
  if (onDelete) actions.push({ label: "Delete", onClick: onDelete, variant: "destructive" as const })

  return (
    <MobileDataCard
      title={transaction.description}
      subtitle={transaction.merchant || transaction.category}
      amount={transaction.amount}
      badge={{ text: transaction.category, variant: "outline" }}
      metadata={[
        { label: "Date", value: new Date(transaction.date).toLocaleDateString() },
        { label: "Status", value: transaction.status || "Completed" }
      ]}
      actions={actions}
      onClick={onClick}
    />
  )
}

export function BudgetCard({
  budget,
  onEdit,
  onDelete,
  onClick
}: {
  budget: any
  onEdit?: () => void
  onDelete?: () => void
  onClick?: () => void
}) {
  const { formatCurrency } = useCurrency()
  const progress = (budget.spent / budget.amount) * 100
  const remaining = budget.amount - budget.spent

  const actions = []
  if (onEdit) actions.push({ label: "Edit", onClick: onEdit })
  if (onDelete) actions.push({ label: "Delete", onClick: onDelete, variant: "destructive" as const })

  return (
    <MobileDataCard
      title={budget.name}
      subtitle={`${formatCurrency(budget.spent || 0)} / ${formatCurrency(budget.amount || 0)} spent`}
      badge={{
        text: `${progress.toFixed(0)}%`,
        variant: progress > 90 ? "destructive" : "default"
      }}
      metadata={[
        { label: "Remaining", value: formatCurrency(remaining) },
        { label: "Category", value: budget.categories?.name || budget.category || "General" },
        { label: "Period", value: budget.period || "monthly" }
      ]}
      actions={actions}
      onClick={onClick}
    >
      <div className="mt-3">
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              progress > 90 ? "bg-destructive" : "bg-primary"
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </MobileDataCard>
  )
}