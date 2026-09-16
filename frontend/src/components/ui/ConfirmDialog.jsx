import { IconAlertTriangle, IconLoader } from "../icons";

export default function ConfirmDialog({
  open,
  title = "Konfirmasi",
  description,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  loading = false,
  danger = true,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] animate-fade-in" onClick={onCancel} />
      <div className="relative w-full max-w-sm animate-scale-in rounded-2xl bg-white p-6 shadow-2xl">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            danger ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
          }`}
        >
          <IconAlertTriangle size={22} />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-800">{title}</h3>
        {description && <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button className={danger ? "btn-danger" : "btn-primary"} onClick={onConfirm} disabled={loading}>
            {loading && <IconLoader size={16} />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
