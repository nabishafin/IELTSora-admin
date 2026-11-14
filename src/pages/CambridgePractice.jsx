import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Pencil, RotateCcw, Download, BookOpen, Headphones, PenLine, Mic, Music } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/form-controls";
import { ConfirmDialog } from "@/components/ui/overlays";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { BOOKS_NEWEST_FIRST, MODULE_COLORS } from "@/utils/constants";
import { CAMBRIDGE_MODULES, MODULE_ORDER, defaultContent, entryKey, summaryOf, titleOf } from "@/utils/cambridgeContent";
import { downloadContentExport } from "@/utils/contentSync";
import { cn } from "@/lib/utils";

const ICONS = { reading: BookOpen, listening: Headphones, writing: PenLine, speaking: Mic };
const TOTAL_PARTS = MODULE_ORDER.reduce((n, m) => n + CAMBRIDGE_MODULES[m].parts, 0); // 12

export default function CambridgePractice() {
  const [entries, setEntries] = useStore("cambridge");
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const book = Number(params.get("book")) || BOOKS_NEWEST_FIRST[0];
  const test = Number(params.get("test")) || 1;
  const [deleteTarget, setDeleteTarget] = useState(null);

  const byKey = useMemo(() => Object.fromEntries(entries.map((e) => [entryKey(e), e])), [entries]);
  const countFor = (b, t) => entries.filter((e) => e.book === b && (t === undefined || e.test === t)).length;
  const select = (b, t) => setParams({ book: String(b), test: String(t) }, { replace: true });

  return (
    <div>
      <PageHeader
        title="Cambridge Practice"
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              downloadContentExport();
              toast({ title: "Exported", description: "Import it in the website's Settings.", variant: "success" });
            }}
          >
            <Download /> Export
          </Button>
        }
      />

      {/* Book + test */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-black/[0.05] p-0.5 scrollbar-thin">
          {BOOKS_NEWEST_FIRST.map((b) => (
            <button
              key={b}
              onClick={() => select(b, test)}
              className={cn("relative shrink-0 rounded-md px-3 py-1.5 text-[13px] font-semibold tabular-nums transition-colors", b === book ? "bg-white shadow-xs" : "text-muted-foreground hover:text-ink")}
              title={`Cambridge IELTS ${b}`}
            >
              {b}
              {countFor(b) > 0 && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#5E8C6E]" />}
            </button>
          ))}
        </div>
        <div className="inline-flex shrink-0 rounded-lg bg-black/[0.05] p-0.5 lg:ml-auto">
          {[1, 2, 3, 4].map((t) => (
            <button key={t} onClick={() => select(book, t)} className={cn("rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors", t === test ? "bg-white shadow-xs" : "text-muted-foreground hover:text-ink")}>
              Test {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Cambridge IELTS {book} · Test {test}</h2>
        <span className="text-xs tabular-nums text-muted-foreground">
          {countFor(book, test)}/{TOTAL_PARTS} edited
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {MODULE_ORDER.map((module) => {
          const meta = CAMBRIDGE_MODULES[module];
          const Icon = ICONS[module];
          const color = MODULE_COLORS[module];
          return (
            <section key={module} className="surface overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border px-5 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: color }}>
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="flex-1 font-semibold">{meta.label}</h3>
              </div>
              <ul className="divide-y divide-border">
                {Array.from({ length: meta.parts }, (_, i) => i + 1).map((part) => {
                  const edited = byKey[`${module}:${book}:${test}:${part}`];
                  const shown = edited || { module, book, test, part, content: defaultContent(module, book, test, part) };
                  const to = `/cambridge/${book}/${test}/${module}/${part}`;
                  return (
                    <li key={part} className="flex items-center gap-3 px-5 py-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold tabular-nums" style={edited ? { background: color, color: "#fff" } : { background: `${color}14`, color }}>
                        {part}
                      </span>
                      <Link to={to} className="min-w-0 flex-1 truncate text-sm font-medium hover:underline">{titleOf(shown)}</Link>
                      <span className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
                        {shown.content.audioUrl && <Music className="h-3 w-3" />}
                        {summaryOf(shown)}
                      </span>
                      <Badge variant={edited ? "success" : "muted"} className="shrink-0">{edited ? "Edited" : "Default"}</Badge>
                      <div className="flex shrink-0">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={to} aria-label="Edit"><Pencil /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(edited)} disabled={!edited} aria-label="Reset to default" title="Reset to default"><RotateCcw /></Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={`Reset "${deleteTarget ? titleOf(deleteTarget) : ""}" to default?`}
        confirmLabel="Reset"
        destructive
        onConfirm={() => {
          const k = entryKey(deleteTarget);
          setEntries((list) => list.filter((x) => entryKey(x) !== k));
          toast({ title: "Reset to default", variant: "success" });
        }}
      />
    </div>
  );
}
