export default function PageHeader({ icon: Icon, iconWrap = "bg-brand-50 text-brand-600", title, description, count, action }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconWrap}`}>
            <Icon size={20} />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            {typeof count === "number" && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                {count}
              </span>
            )}
          </div>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
