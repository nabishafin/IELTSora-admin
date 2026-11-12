import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, ChevronRight, Library } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { SearchInput, SimpleSelect, EmptyState, StatusDot, FormField, StatCard } from "@/components/common/misc";
import { Input, Textarea, Switch, Label, Badge } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/overlays";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { buildBook } from "@/data/mockCambridge";
import { cn } from "@/lib/utils";

function BookForm({ open, onOpenChange, initial, existingNumbers, onSubmit }) {
  const [form, setForm] = useState({ number: "", title: "", year: "", description: "", published: true });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (!open) return;
    setErrors({});
    const nextNo = Math.max(21, ...existingNumbers) + 1;
    setForm(
      initial
        ? { number: String(initial.number), title: initial.title, year: String(initial.year), description: initial.description, published: initial.published }
        : { number: String(nextNo), title: `Cambridge IELTS ${nextNo}`, year: String(2005 + nextNo), description: "", published: false }
    );
  }, [open, initial, existingNumbers]);

  const submit = (e) => {
    e.preventDefault();
    const n = Number(form.number);
    const y = Number(form.year);
    const next = {};
    if (!Number.isInteger(n) || n < 1 || n > 99) next.number = "Enter a book number between 1 and 99.";
    else if (existingNumbers.includes(n) && n !== initial?.number) next.number = `Book ${n} already exists.`;
    if (form.title.trim().length < 3) next.title = "Enter a title.";
    if (!Number.isInteger(y) || y < 1990 || y > 2100) next.year = "Enter a valid year.";
    if (form.description.trim().length < 10) next.description = "Description must be at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit({ number: n, title: form.title.trim(), year: y, description: form.description.trim(), published: form.published });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit book" : "Add book"}</DialogTitle>
          <DialogDescription>{initial ? "Update book details." : "New books are created with four tests of original demo content you can then edit."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Book number" htmlFor="b-no" required error={errors.number}>
              <Input id="b-no" type="number" value={form.number} disabled={!!initial} onChange={(e) => setForm({ ...form, number: e.target.value })} className={errors.number && "border-destructive"} />
            </FormField>
            <FormField label="Year" htmlFor="b-year" required error={errors.year}>
              <Input id="b-year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={errors.year && "border-destructive"} />
            </FormField>
          </div>
          <FormField label="Title" htmlFor="b-title" required error={errors.title}>
            <Input id="b-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={errors.title && "border-destructive"} />
          </FormField>
          <FormField label="Description" htmlFor="b-desc" required error={errors.description}>
            <Textarea id="b-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={errors.description && "border-destructive"} />
          </FormField>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <Label htmlFor="b-pub">Published</Label>
            <Switch id="b-pub" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{initial ? "Save book" : "Add book"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CambridgeManagement() {
  const [books, setBooks] = useStore("cambridge");
  const [questions] = useStore("questions");
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(null); // { initial }
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sorted = useMemo(() => [...books].sort((a, b) => b.number - a.number), [books]);
  const filtered = sorted.filter((b) => {
    if (status === "published" && !b.published) return false;
    if (status === "draft" && b.published) return false;
    const q = query.trim().toLowerCase();
    return !q || b.title.toLowerCase().includes(q) || String(b.number) === q;
  });
  const active = sorted.find((b) => b.number === selected) || filtered[0];
  const numbers = useMemo(() => books.map((b) => b.number), [books]);
  const testsPublished = books.reduce((n, b) => n + b.tests.filter((t) => t.published).length, 0);

  const updateBook = (number, patch) => setBooks((list) => list.map((b) => (b.number === number ? { ...b, ...patch } : b)));
  const toggleTest = (book, testNo) => {
    const t = book.tests.find((x) => x.testNo === testNo);
    updateBook(book.number, { tests: book.tests.map((x) => (x.testNo === testNo ? { ...x, published: !x.published } : x)) });
    toast({ title: `Test ${testNo} ${t.published ? "unpublished" : "published"}`, description: book.title, variant: "success" });
  };

  const submitBook = (values) => {
    if (form.initial) {
      updateBook(form.initial.number, { title: values.title, year: values.year, description: values.description, published: values.published });
      toast({ title: "Book updated", description: values.title, variant: "success" });
    } else {
      setBooks((list) => [...list, buildBook(values.number, values)]);
      setSelected(values.number);
      toast({ title: "Book added", description: `${values.title} created with four tests.`, variant: "success" });
    }
    setForm(null);
  };

  const qCount = (book, test) => questions.filter((q) => q.book === book && q.test === test).length;

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Cambridge library"
        description="Manage Cambridge IELTS books, their four tests and every passage, section, task and speaking part. All practice content is original demo material."
        actions={<Button onClick={() => setForm({ initial: null })}><Plus /> Add book</Button>}
      />

      <div className="mb-6 grid grid-cols-2 tiles lg:grid-cols-4">
        <StatCard className="rounded-none border-0 shadow-none" label="Books" value={books.length} hint={`${books.filter((b) => b.published).length} published`} />
        <StatCard className="rounded-none border-0 shadow-none" label="Tests" value={books.length * 4} hint={`${testsPublished} published`} />
        <StatCard className="rounded-none border-0 shadow-none" label="Reading passages" value={books.length * 12} />
        <StatCard className="rounded-none border-0 shadow-none" label="Listening sections" value={books.length * 16} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="surface overflow-hidden">
          <div className="grid gap-2 border-b border-border p-3">
            <SearchInput value={query} onChange={setQuery} placeholder="Search books…" />
            <SimpleSelect value={status} onValueChange={setStatus} options={[{ value: "all", label: "All books" }, { value: "published", label: "Published" }, { value: "draft", label: "Unpublished" }]} />
          </div>
          {filtered.length === 0 ? (
            <EmptyState className="m-3" icon={Library} title="No books found" />
          ) : (
            <ul className="grid max-h-[560px] gap-0.5 overflow-y-auto p-2 scrollbar-thin">
              {filtered.map((b) => (
                <li key={b.id}>
                  <button
                    onClick={() => setSelected(b.number)}
                    className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors", active?.number === b.number ? "bg-black/[0.06]" : "hover:bg-black/[0.04]")}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-subtle text-sm font-semibold tabular-nums">{b.number}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{b.title}</span>
                      <span className="block text-xs text-muted-foreground">{b.year} · {b.tests.filter((t) => t.published).length}/4 tests live</span>
                    </span>
                    <StatusDot on={b.published} onLabel="" offLabel="" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {active ? (
          <div>
            <div className="surface p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-border bg-subtle text-2xl font-semibold tabular-nums">{active.number}</span>
                  <div className="min-w-0">
                    <p className="label-xs">Book {active.number} · {active.year}</p>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight">{active.title}</h2>
                    <p className="mt-1 max-w-xl text-sm text-muted-foreground">{active.description}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                    <Label htmlFor="bk-pub" className="text-xs">Published</Label>
                    <Switch
                      id="bk-pub"
                      checked={active.published}
                      onCheckedChange={(v) => {
                        updateBook(active.number, { published: v });
                        toast({ title: v ? "Book published" : "Book unpublished", description: active.title, variant: "success" });
                      }}
                    />
                  </div>
                  <Button variant="secondary" size="icon" onClick={() => setForm({ initial: active })} aria-label="Edit book"><Pencil /></Button>
                  <Button variant="secondary" size="icon" onClick={() => setDeleteTarget(active)} aria-label="Delete book"><Trash2 /></Button>
                </div>
              </div>
            </div>

            <div className="mt-4 tiles md:grid-cols-2">
              {active.tests.map((t) => (
                <div key={t.testNo} className="flex flex-col bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="label-xs">Cambridge {active.number}</p>
                      <h3 className="mt-1 text-lg font-semibold">Test {t.testNo}</h3>
                    </div>
                    <Switch checked={t.published} onCheckedChange={() => toggleTest(active, t.testNo)} aria-label={`Publish test ${t.testNo}`} />
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <dt className="text-muted-foreground">Reading</dt><dd className="truncate text-right">{t.reading.length} passages</dd>
                    <dt className="text-muted-foreground">Listening</dt><dd className="text-right">{t.listening.length} sections</dd>
                    <dt className="text-muted-foreground">Writing</dt><dd className="text-right">Task 1 + Task 2</dd>
                    <dt className="text-muted-foreground">Speaking</dt><dd className="text-right">Parts 1–3</dd>
                    <dt className="text-muted-foreground">Question bank</dt><dd className="text-right">{qCount(active.number, t.testNo)} questions</dd>
                  </dl>
                  <p className="mt-3 truncate text-xs text-muted-foreground" title={t.reading.map((r) => r.title).join(" · ")}>{t.reading.map((r) => r.title).join(" · ")}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <StatusDot on={t.published} offLabel="Unpublished" />
                    <Button size="sm" asChild>
                      <Link to={`/cambridge/${active.number}/test/${t.testNo}`}>Manage test <ChevronRight /></Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {!active.published && <p className="mt-3 text-xs text-muted-foreground"><Badge variant="warning">Note</Badge> This book is unpublished, so its tests are hidden from students even when individually published.</p>}
          </div>
        ) : (
          <EmptyState icon={Library} title="No book selected" description="Add a book to get started." action={<Button onClick={() => setForm({ initial: null })}><Plus /> Add book</Button>} />
        )}
      </div>

      <BookForm open={!!form} onOpenChange={(o) => !o && setForm(null)} initial={form?.initial} existingNumbers={numbers} onSubmit={submitBook} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.title}?`}
        description="The book and its four tests will be removed. Questions linked to it stay in the question bank."
        confirmLabel="Delete book"
        destructive
        onConfirm={() => {
          setBooks((list) => list.filter((b) => b.number !== deleteTarget.number));
          setSelected(null);
          toast({ title: "Book deleted", variant: "success" });
        }}
      />
    </div>
  );
}
