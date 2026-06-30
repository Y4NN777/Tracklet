import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

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
    setTimeout(() => removeToast(id), 3500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="pointer-events-none fixed bottom-20 left-1/2 z-50 -translate-x-1/2 space-y-2 lg:bottom-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto animate-slide-up rounded-xl px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-sm ${
              t.type === "success"
                ? "bg-emerald-600/95 text-white"
                : t.type === "error"
                  ? "bg-red-600/95 text-white"
                  : "bg-gray-800/95 text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>
                {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
              </span>
              {t.message}
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
