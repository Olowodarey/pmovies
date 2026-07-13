import Link from "next/link";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

const PaginationControls = ({ page, totalPages, buildHref }: PaginationControlsProps) => {
  const btnBase =
    "px-4 py-1.5 rounded-full border border-edge text-sm transition-colors";
  const active = "text-ink-muted hover:text-ink";
  const disabled = "opacity-40 pointer-events-none text-ink-muted";

  return (
    <div className="flex items-center justify-center gap-3 mt-10">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} className={`${btnBase} ${active}`}>
          ← Prev
        </Link>
      ) : (
        <span className={`${btnBase} ${disabled}`}>← Prev</span>
      )}

      <span className="text-sm text-ink-muted">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link href={buildHref(page + 1)} className={`${btnBase} ${active}`}>
          Next →
        </Link>
      ) : (
        <span className={`${btnBase} ${disabled}`}>Next →</span>
      )}
    </div>
  );
};

export default PaginationControls;
