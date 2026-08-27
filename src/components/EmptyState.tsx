interface EmptyStateProps {
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-light p-12 text-center">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        className="mb-4 text-border"
      >
        <rect
          x="6"
          y="10"
          width="36"
          height="28"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M6 18h36"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <h3 className="text-base font-semibold text-on-surface">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-on-surface-muted">{message}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-light transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
