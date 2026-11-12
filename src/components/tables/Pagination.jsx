import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function Pagination({ page, pageSize, total, onPageChange }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter((p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1);
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-medium text-ink">{from}–{to}</span> of <span className="font-medium text-ink">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button variant="secondary" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft />
        </Button>
        {pages.map((p, i) => (
          <span key={p} className="flex items-center">
            {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-xs text-muted-foreground">…</span>}
            <Button variant={p === page ? "default" : "ghost"} size="sm" className="min-w-8" onClick={() => onPageChange(p)}>
              {p}
            </Button>
          </span>
        ))}
        <Button variant="secondary" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= pageCount} aria-label="Next page">
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export function SortableHead({ label, field, sort, onSort, className }) {
  const active = sort.field === field;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn("inline-flex items-center gap-1 uppercase tracking-wider hover:text-ink", active && "text-ink")}
      >
        {label}
        <Icon className="h-3 w-3" />
      </button>
    </TableHead>
  );
}

export function paginate(items, page, pageSize) {
  return items.slice((page - 1) * pageSize, page * pageSize);
}
