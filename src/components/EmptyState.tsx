import type { ReactNode } from "react";
import { ArrowRight, WalletCards } from "lucide-react";

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

export function EmptyState({ title, message, icon, action, secondaryAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-border-light bg-card p-7 text-center sm:p-10">
      <span className="grid h-14 w-14 place-items-center rounded-[1.25rem] bg-primary-container text-primary">
        {icon ?? <WalletCards aria-hidden="true" className="h-6 w-6" />}
      </span>
      <h3 className="mt-5 text-xl font-bold tracking-[-0.035em] text-on-surface">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-on-surface-muted">{message}</p>
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row">
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-light"
            >
              {action.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="min-h-12 rounded-2xl px-4 text-sm font-semibold text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
