"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

type ToastKind = "success" | "warning" | "error" | "info";

type ToastItem = {
  id: string;
  message: string;
  kind: ToastKind;
};

type ToastContextValue = {
  toast: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, kind: ToastKind = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setItems((prev) => [...prev, { id, message, kind }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-20 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2 lg:bottom-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto animate-fade-up flex items-start gap-2 rounded-xl border bg-white px-3.5 py-3 text-sm shadow-lg",
              item.kind === "success" && "border-emerald-100",
              item.kind === "warning" && "border-amber-100",
              item.kind === "error" && "border-red-100"
            )}
          >
            {item.kind === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A36A]" />
            ) : item.kind === "warning" || item.kind === "error" ? (
              <AlertTriangle
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  item.kind === "warning" ? "text-[#E59A22]" : "text-[#DD5365]"
                )}
              />
            ) : null}
            <p className="flex-1 text-[#171B2D]">{item.message}</p>
            <button
              type="button"
              className="text-[#6B7280] hover:text-[#171B2D]"
              onClick={() => dismiss(item.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}
