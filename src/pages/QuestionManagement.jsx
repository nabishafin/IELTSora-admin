import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Copy, Trash2, FileQuestion, X, Eye } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { SearchInput, SimpleSelect, EmptyState, ModuleBadge, StatCard } from "@/components/common/misc";
import { Pagination, SortableHead, paginate } from "@/components/tables/Pagination";
import QuestionForm from "@/components/forms/QuestionForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/overlays";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { QUESTION_TYPES, questionTypeLabel } from "@/data/mockQuestions";
import { BOOKS_NEWEST_FIRST, partLabel } from "@/utils/constants";
import { formatDate } from "@/utils/format";
import { uid } from "@/utils/random";

const PAGE_SIZE = 12;
const FILTER_KEYS = ["module", "book", "test", "part", "type"];

export default function QuestionManagement() {
  const [questions, setQuestions] = useStore("questions");
  const [, setMockTests] = useStore("mockTests");
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ field: "createdAt", dir: "desc" });
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null); // { initial, mode }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const f = Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) || "all"]));
  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete(key);
    else next.set(key, value);
    if (key === "module") {
      const t = QUESTION_TYPES.find((x) => x.value === next.get("type"));
      if (t && value !== "all" && !t.modules.includes(value)) next.delete("type");
      if (value === "reading" && next.get("part") === "4") next.delete("part");
    }
    setParams(next, { replace: true });
    setPage(1);
  };
  const activeFilters = FILTER_KEYS.filter((k) => f[k] !== "all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = questions.filter((x) => {
      if (f.module !== "all" && x.module !== f.module) return false;
      if (f.book !== "all" && x.book !== Number(f.book)) return false;
      if (f.test !== "all" && x.test !== Number(f.test)) return false;
      if (f.part !== "all" && x.part !== Number(f.part)) return false;
      if (f.type !== "all" && x.type !== f.type) return false;
      return !q || x.text.toLowerCase().includes(q) || String(x.answer).toLowerCase().includes(q) || x.id.includes(q);
    });
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const av = a[sort.field];
      const bv = b[sort.field];
      return (typeof av === "number" ? av - bv : String(av).localeCompare(String(bv))) * dir;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, query, sort, params]);

  const onSort = (field) => setSort((s) => ({ field, dir: s.field === field && s.dir === "asc" ? "desc" : "asc" }));
  const typeOptions = QUESTION_TYPES.filter((t) => f.module === "all" || t.modules.includes(f.module));

  const defaults = useMemo(
    () => ({
      module: f.module !== "all" ? f.module : "reading",
      book: f.book !== "all" ? Number(f.book) : 10,
      test: f.test !== "all" ? Number(f.test) : 1,
      part: f.part !== "all" ? Number(f.part) : 1,
      type: f.type !== "all" ? f.type : f.module === "listening" ? "form-completion" : "multiple-choice",
      options: [],
      marks: 1,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params]
  );

  const submit = (payload) => {
    if (form.mode === "edit") {
      setQuestions((list) => list.map((q) => (q.id === form.initial.id ? { ...q, ...payload, updatedAt: new Date().toISOString() } : q)));
      toast({ title: "Question updated", variant: "success" });
    } else {
      const q = { id: uid("q"), ...payload, createdAt: new Date().toISOString() };
      setQuestions((list) => [q, ...list]);
      toast({ title: form.mode === "duplicate" ? "Question duplicated" : "Question created", description: questionTypeLabel(q.type), variant: "success" });
      setSort({ field: "createdAt", dir: "desc" });
      setPage(1);
    }
    setForm(null);
  };

  const remove = () => {
    const id = deleteTarget.id;
    setQuestions((list) => list.filter((q) => q.id !== id));
    setMockTests((list) => list.map((m) => ({ ...m, questionIds: m.questionIds.filter((x) => x !== id) })));
    toast({ title: "Question deleted", description: "It was also removed from any mock tests.", variant: "success" });
  };

  const byModule = (m) => questions.filter((q) => q.module === m).length;

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Question bank"
        description="Create and manage Reading and Listening questions for every Cambridge book, test, passage and section."
        actions={<Button onClick={() => setForm({ mode: "create", initial: null })}><Plus /> Create question</Button>}
      />

      <div className="mb-6 grid grid-cols-2 tiles lg:grid-cols-4">
        <StatCard className="rounded-none border-0 shadow-none" label="Total questions" value={questions.length} />
        <StatCard className="rounded-none border-0 shadow-none" label="Reading" value={byModule("reading")} />
        <StatCard className="rounded-none border-0 shadow-none" label="Listening" value={byModule("listening")} />
        <StatCard className="rounded-none border-0 shadow-none" label="Question types" value={new Set(questions.map((q) => q.type)).size} hint={`of ${QUESTION_TYPES.length} supported`} />
      </div>

      <div className="surface overflow-hidden">
        <div className="grid gap-3 border-b border-border p-4">
          <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search question text, answer or ID…" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <SimpleSelect value={f.module} onValueChange={(v) => setFilter("module", v)} options={[{ value: "all", label: "All modules" }, { value: "reading", label: "Reading" }, { value: "listening", label: "Listening" }]} />
            <SimpleSelect value={f.book} onValueChange={(v) => setFilter("book", v)} options={[{ value: "all", label: "All books" }, ...BOOKS_NEWEST_FIRST.map((n) => ({ value: String(n), label: `Cambridge ${n}` }))]} />
            <SimpleSelect value={f.test} onValueChange={(v) => setFilter("test", v)} options={[{ value: "all", label: "All tests" }, ...[1, 2, 3, 4].map((n) => ({ value: String(n), label: `Test ${n}` }))]} />
            <SimpleSelect value={f.part} onValueChange={(v) => setFilter("part", v)} options={[{ value: "all", label: "All parts" }, ...Array.from({ length: f.module === "reading" ? 3 : 4 }, (_, i) => ({ value: String(i + 1), label: f.module === "all" ? `Part ${i + 1}` : `${partLabel(f.module)} ${i + 1}` }))]} />
            <SimpleSelect className="col-span-2 md:col-span-1" value={f.type} onValueChange={(v) => setFilter("type", v)} options={[{ value: "all", label: "All types" }, ...typeOptions.map((t) => ({ value: t.value, label: t.label }))]} />
          </div>
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeFilters.map((k) => (
                <button key={k} onClick={() => setFilter(k, "all")} className="inline-flex items-center gap-1 rounded-full bg-black/[0.06] px-2.5 py-0.5 text-xs font-medium hover:bg-black/[0.1]">
                  {k}: {k === "type" ? questionTypeLabel(f[k]) : f[k]} <X className="h-3 w-3" />
                </button>
              ))}
              <button className="text-xs text-muted-foreground underline" onClick={() => { setParams({}, { replace: true }); setPage(1); }}>Clear all</button>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            className="m-4"
            icon={FileQuestion}
            title="No questions found"
            description={activeFilters.length || query ? "No questions match the current filters." : "The question bank is empty."}
            action={<Button onClick={() => setForm({ mode: "create", initial: null })}><Plus /> Create question</Button>}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHead label="Question" field="text" sort={sort} onSort={onSort} />
                  <SortableHead label="Module" field="module" sort={sort} onSort={onSort} />
                  <SortableHead label="Type" field="type" sort={sort} onSort={onSort} />
                  <SortableHead label="Book" field="book" sort={sort} onSort={onSort} />
                  <TableHead>Test / Part</TableHead>
                  <TableHead>Answer</TableHead>
                  <SortableHead label="Marks" field="marks" sort={sort} onSort={onSort} />
                  <SortableHead label="Created" field="createdAt" sort={sort} onSort={onSort} />
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginate(filtered, page, PAGE_SIZE).map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="min-w-[280px] max-w-[420px]">
                      <button className="line-clamp-2 text-left font-medium hover:underline" onClick={() => setViewTarget(q)}>{q.text}</button>
                    </TableCell>
                    <TableCell><ModuleBadge module={q.module} /></TableCell>
                    <TableCell className="whitespace-nowrap text-xs">{questionTypeLabel(q.type)}</TableCell>
                    <TableCell className="tabular-nums">{q.book}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">T{q.test} · {partLabel(q.module)} {q.part}</TableCell>
                    <TableCell className="max-w-[180px] truncate text-xs" title={q.answer}><Badge variant="outline" className="max-w-full truncate">{q.answer}</Badge></TableCell>
                    <TableCell className="tabular-nums">{q.marks}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDate(q.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon" onClick={() => setViewTarget(q)} aria-label="View"><Eye /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setForm({ mode: "edit", initial: q })} aria-label="Edit"><Pencil /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setForm({ mode: "duplicate", initial: { ...q, text: `${q.text} (copy)` } })} aria-label="Duplicate"><Copy /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(q)} aria-label="Delete"><Trash2 /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
          </>
        )}
      </div>

      <QuestionForm
        open={!!form}
        onOpenChange={(o) => !o && setForm(null)}
        initial={form?.mode === "edit" ? form.initial : form?.mode === "duplicate" ? form.initial : null}
        defaults={defaults}
        title={form?.mode === "duplicate" ? "Duplicate question" : undefined}
        onSubmit={submit}
      />

      <Dialog open={!!viewTarget} onOpenChange={(o) => !o && setViewTarget(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewTarget && questionTypeLabel(viewTarget.type)}</DialogTitle>
            <DialogDescription>{viewTarget && `Cambridge ${viewTarget.book} · Test ${viewTarget.test} · ${partLabel(viewTarget.module)} ${viewTarget.part} · ${viewTarget.marks} mark(s)`}</DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="grid gap-4 text-sm">
              <p className="font-medium">{viewTarget.text}</p>
              {viewTarget.options.length > 0 && (
                <ul className="grid gap-1">
                  {viewTarget.options.map((o) => (
                    <li key={o} className={o === viewTarget.answer ? "rounded-lg border border-[#198100]/40 bg-[#198100]/10 px-3 py-1.5 font-semibold" : "rounded-lg border border-border px-3 py-1.5"}>{o}</li>
                  ))}
                </ul>
              )}
              <div className="border-t border-border pt-3">
                <p className="label-xs">Correct answer</p>
                <p className="mt-1 font-semibold">{viewTarget.answer}</p>
              </div>
              {viewTarget.explanation && (
                <div>
                  <p className="label-xs">Explanation</p>
                  <p className="mt-1 text-muted-foreground">{viewTarget.explanation}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setViewTarget(null)}>Close</Button>
            <Button onClick={() => { setForm({ mode: "edit", initial: viewTarget }); setViewTarget(null); }}><Pencil /> Edit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this question?"
        description={deleteTarget ? `"${deleteTarget.text.slice(0, 90)}${deleteTarget.text.length > 90 ? "…" : ""}" will be removed from the bank and from any mock tests.` : ""}
        confirmLabel="Delete question"
        destructive
        onConfirm={remove}
      />
    </div>
  );
}
