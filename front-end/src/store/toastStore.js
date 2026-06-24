import { create } from "zustand";

let idCounter = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],
  push: (toast) => {
    const id = ++idCounter;
    const item = {
      id,
      type: toast.type || "info", // 'success' | 'error' | 'info'
      message: toast.message,
      duration: toast.duration ?? 3500,
    };
    set({ toasts: [...get().toasts, item] });
    if (item.duration > 0) {
      setTimeout(() => get().remove(id), item.duration);
    }
    return id;
  },
  remove: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export const toast = {
  success: (message) => useToastStore.getState().push({ type: "success", message }),
  error: (message) => useToastStore.getState().push({ type: "error", message }),
  info: (message) => useToastStore.getState().push({ type: "info", message }),
};
