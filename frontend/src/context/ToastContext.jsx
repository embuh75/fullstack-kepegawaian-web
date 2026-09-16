import { createContext, useCallback, useContext, useRef, useState } from "react";
import { IconCheckCircle, IconXCircle, IconX, IconAlertTriangle } from "../components/icons";

const ToastContext = createContext(null);

const STYLES = {
  success: {
    icon: IconCheckCircle,
    wrap: "bg-white border-emerald-200",
    iconWrap: "bg-emerald-100 text-emerald-600",
  },
  error: {
    icon: IconXCircle,
    wrap: "bg-white border-red-200",
    iconWrap: "bg-red-100 text-red-600",
  },
  warning: {
    icon: IconAlertTriangle,
    wrap: "bg-white border-amber-200",
    iconWrap: "bg-amber-100 text-amber-600",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "success", duration = 3500) => {
      const id = ++counter.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration) {
        setTimeout(() => remove(id), duration);
      }
      return id;
    },
    [remove],
  );

  const toast = {
    success: (msg, d) => push(msg, "success", d),
    error: (msg, d) => push(msg, "error", d),
    warning: (msg, d) => push(msg, "warning", d),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto">
        {toasts.map((t) => {
          const s = STYLES[t.type] || STYLES.success;
          const Icon = s.icon;
          return (
            <div
              key={t.id}
              className={`animate-fade-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border ${s.wrap} p-3.5 shadow-soft`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${s.iconWrap}`}>
                <Icon size={17} />
              </span>
              <p className="mt-1 flex-1 text-sm font-medium text-slate-700">{t.message}</p>
              <button
                onClick={() => remove(t.id)}
                className="mt-1 text-slate-400 transition hover:text-slate-600"
                aria-label="Tutup notifikasi"
              >
                <IconX size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam <ToastProvider>");
  return ctx;
}
