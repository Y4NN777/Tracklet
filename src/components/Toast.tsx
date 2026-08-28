import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

interface Toast {
  id: number;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastCtx {
  toasts: Toast[];
  addToast: (type: Toast["type"], message: string) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastCtx | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = ++nextId;
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-24 z-[60] space-y-2 sm:left-1/2 sm:right-auto sm:w-full sm:max-w-md sm:-translate-x-1/2 lg:bottom-6" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === "error" ? "alert" : "status"}
            className={`pointer-events-auto animate-slide-up rounded-2xl border px-4 py-3 text-sm font-medium shadow-lg ${
              t.type === "success"
                ? "border-success bg-success-container text-on-surface"
                : t.type === "error"
                  ? "border-danger bg-danger-container text-on-surface"
                  : "border-primary bg-card text-on-surface"
            }`}
          >
            <div className="flex min-h-11 items-center gap-3">
              {t.type === "success" ? (
                <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0 text-success" />
              ) : t.type === "error" ? (
                <AlertCircle aria-hidden="true" className="h-5 w-5 shrink-0 text-danger" />
              ) : (
                <Info aria-hidden="true" className="h-5 w-5 shrink-0 text-info" />
              )}
              <span className="flex-1">{t.message}</span>
              <button type="button" onClick={() => removeToast(t.id)} className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl hover:bg-on-surface/10" aria-label="Fermer la notification">
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}
