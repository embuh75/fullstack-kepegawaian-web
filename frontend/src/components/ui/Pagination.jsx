import { IconChevronLeft, IconChevronRight } from "../icons";

export default function Pagination({ page, lastPage, hasMore, total, perPage, onChange }) {
  const canPrev = page > 1;
  const canNext = hasMore !== undefined ? hasMore : lastPage ? page < lastPage : true;

  const startItem = total ? (page - 1) * perPage + 1 : 0;
  const endItem = total ? Math.min(page * perPage, total) : 0;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5 sm:flex-row">
      <p className="text-xs text-slate-500">
        {total ? (
          <>
            Menampilkan <span className="font-semibold text-slate-700">{startItem}</span>–
            <span className="font-semibold text-slate-700">{endItem}</span> dari{" "}
            <span className="font-semibold text-slate-700">{total}</span> data
          </>
        ) : (
          `Halaman ${page}${lastPage ? ` dari ${lastPage}` : ""}`
        )}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          className="btn-secondary !px-2.5 !py-1.5"
          disabled={!canPrev}
          onClick={() => onChange(page - 1)}
        >
          <IconChevronLeft size={16} />
        </button>
        <span className="min-w-[5.5rem] text-center text-xs font-semibold text-slate-600">
          Hal. {page}
          {lastPage ? ` / ${lastPage}` : ""}
        </span>
        <button
          className="btn-secondary !px-2.5 !py-1.5"
          disabled={!canNext}
          onClick={() => onChange(page + 1)}
        >
          <IconChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
