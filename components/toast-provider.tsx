"use client";

import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastTone = "success" | "error" | "info";
type ToastInput = { title: string; message?: string; tone?: ToastTone };
type ToastItem = ToastInput & { id: number };

const ToastContext = createContext<((toast: ToastInput) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const dismiss = useCallback((id: number) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);
  const showToast = useCallback(
    (toast: ToastInput) => {
      const id = ++nextId.current;
      setToasts((items) => [...items.slice(-3), { ...toast, id }]);
      window.setTimeout(() => dismiss(id), toast.tone === "error" ? 6500 : 4500);
    },
    [dismiss],
  );
  const value = useMemo(() => showToast, [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div className={`toast toast-${toast.tone ?? "info"}`} key={toast.id}>
            <span className="toast-icon" aria-hidden="true">
              {toast.tone === "success" ? <CheckCircle2 /> : toast.tone === "error" ? <CircleAlert /> : <Info />}
            </span>
            <span className="toast-copy">
              <strong>{toast.title}</strong>
              {toast.message ? <span>{toast.message}</span> : null}
            </span>
            <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification">
              <X />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
