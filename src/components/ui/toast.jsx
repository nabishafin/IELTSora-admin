import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext(() => {});
const ICONS = { success: CheckCircle2, error: AlertCircle, default: Info };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback(
    ({ title, description, variant = "default", duration = 3200 }) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t.slice(-3), { id, title, description, variant }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const I = ICONS[t.variant] || Info;
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "flex items-start gap-3 rounded-xl border bg-white p-4 shadow-high animate-fade-in",
                t.variant === "error" ? "border-red-700/40" : "border-border"
              )}
            >
              <I className={cn("mt-0.5 h-4 w-4 shrink-0", t.variant === "error" && "text-red-700", t.variant === "success" && "text-green-700")} />
              <div className="flex-1">
                <p className="text-sm font-semibold">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} className="opacity-50 hover:opacity-100" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
