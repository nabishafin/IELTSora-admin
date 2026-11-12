import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Eye, Copy, ClipboardCheck, Timer, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { SearchInput, SimpleSelect, EmptyState, StatusDot, ModuleBadge, FormField, StatCard } from "@/components/common/misc";
import { Input, Textarea, Switch, Checkbox, Label, Badge } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/overlays";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { DEFAULT_BAND_MAP, DEFAULT_DURATIONS } from "@/data/mockTests";
import { questionTypeLabel } from "@/data/mockQuestions";
import { MODULES, BAND_OPTIONS } from "@/utils/constants";
import { formatDate } from "@/utils/format";
import { uid } from "@/utils/random";
import { cn } from "@/lib/utils";

const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const isCorrect = (q, given) => String(q.answer).split("|").some((a) => norm(a) && norm(a) === norm(given));
const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/** Score a set of answers with a mock test's scoring configuration. */
export function scoreMock(test, questions, answers) {
  const correct = questions.filter((q) => isCorrect(q, answers[q.id])).length;
  const per = Number(test.scoring.marksPerQuestion) || 1;
  const marks = correct * per;
  const max = questions.length * per;
  const percent = max ? Math.round((marks / max) * 100) : 0;
  const scaled = questions.length ? Math.round((correct / questions.length) * 40) : 0;
  const map = [...test.scoring.bandMap].sort((a, b) => b.min - a.min);
  const band = map.find((r) => scaled >= r.min)?.band || "< " + (map[map.length - 1]?.band || "4.0");
  return { correct, total: questions.length, marks, max, percent, scaled, band, passed: percent >= Number(test.scoring.passMark) };
}

const blank = () => ({
  name: "",
  description: "",
  modules: ["reading", "listening"],
  durations: { ...DEFAULT_DURATIONS },
  questionIds: [],
  scoring: { mode: "band", bandMap: DEFAULT_BAND_MAP.map((r) => ({ ...r })), marksPerQuestion: 1, passMark: 60 },
  published: false,
});

function MockTestForm({ open, onOpenChange, initial, questions, onSubmit }) {
  const [form, setForm] = useState(blank());
  const [errors, setErrors] = useState({});
  const [qSearch, setQSearch] = useState("");
  const [qModule, setQModule] = useState("all");

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setQSearch("");
    setQModule("all");
    setForm(initial ? JSON.parse(JSON.stringify(initial)) : blank());
  }, [open, initial]);

  const bankModules = form.modules.filter((m) => m === "reading" || m === "listening");
  const available = questions.filter((q) => bankModules.includes(q.module));
  const shown = available.filter((q) => (qModule === "all" || q.module === qModule) && (!qSearch.trim() || q.text.toLowerCase().includes(qSearch.toLowerCase())));
  const selected = new Set(form.questionIds);

  const toggleModule = (m, on) =>
    setForm((f) => {
      const modules = on ? MODULES.map((x) => x.key).filter((k) => f.modules.includes(k) || k === m) : f.modules.filter((x) => x !== m);
      const keepIds = f.questionIds.filter((id) => {
        const q = questions.find((x) => x.id === id);
        return q && modules.includes(q.module);
      });
      return { ...f, modules, questionIds: keepIds };
    });
  const toggleQ = (id) => setForm((f) => ({ ...f, questionIds: selected.has(id) ? f.questionIds.filter((x) => x !== id) : [...f.questionIds, id] }));
  const setScoring = (k, v) => setForm((f) => ({ ...f, scoring: { ...f.scoring, [k]: v } }));
  const setBandRow = (i, k, v) => setScoring("bandMap", form.scoring.bandMap.map((r, j) => (j === i ? { ...r, [k]: k === "min" ? Number(v) : v } : r)));

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 3) next.name = "Enter a test name.";
    if (!form.modules.length) next.modules = "Select at least one module.";
    form.modules.forEach((m) => {
      const d = Number(form.durations[m]);
      if (!Number.isFinite(d) || d < 1 || d > 180) next.durations = "Durations must be between 1 and 180 minutes.";
    });
    if (bankModules.length && form.questionIds.length === 0) next.questions = "Add at least one question for Reading/Listening.";
    const per = Number(form.scoring.marksPerQuestion);
    if (!Number.isFinite(per) || per <= 0) next.scoring = "Marks per correct answer must be positive.";
    const pass = Number(form.scoring.passMark);
    if (!Number.isFinite(pass) || pass < 0 || pass > 100) next.scoring = "Pass mark must be 0–100%.";
    if (form.scoring.bandMap.some((r) => !Number.isFinite(r.min) || r.min < 0 || r.min > 40)) next.bandMap = "Band thresholds must be between 0 and 40.";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      durations: Object.fromEntries(Object.entries(form.durations).map(([k, v]) => [k, Number(v)])),
      scoring: { ...form.scoring, marksPerQuestion: per, passMark: pass, bandMap: [...form.scoring.bandMap].sort((a, b) => b.min - a.min) },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit mock test" : "Create mock test"}</DialogTitle>
          <DialogDescription>Choose modules, timing, questions from the bank and how the test is scored.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-5" noValidate>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Name" required error={errors.name}>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={errors.name && "border-destructive"} placeholder="e.g. Academic Mock Test 4" />
            </FormField>
            <div className="flex items-end">
              <div className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5">
                <Label htmlFor="m-pub">Published</Label>
                <Switch id="m-pub" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
              </div>
            </div>
            <FormField className="md:col-span-2" label="Description">
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[60px]" />
            </FormField>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium">Modules & duration <span className="text-destructive">*</span></p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {MODULES.map((m) => {
                const on = form.modules.includes(m.key);
                return (
                  <div key={m.key} className={cn("rounded-lg border p-3 transition-colors", on ? "border-ink bg-white shadow-xs" : "border-border bg-subtle")}>
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                      <Checkbox checked={on} onCheckedChange={(v) => toggleModule(m.key, !!v)} /> {m.label}
                    </label>
                    <div className="mt-2 flex items-center gap-2">
                      <Input type="number" min={1} max={180} disabled={!on} value={form.durations[m.key]} onChange={(e) => setForm({ ...form, durations: { ...form.durations, [m.key]: e.target.value } })} className="h-8" aria-label={`${m.label} minutes`} />
                      <span className="text-xs text-muted-foreground">min</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {(errors.modules || errors.durations) && <p className="mt-2 text-xs text-destructive">{errors.modules || errors.durations}</p>}
            {form.modules.some((m) => m === "writing" || m === "speaking") && (
              <p className="mt-2 text-xs text-muted-foreground">Writing and Speaking sections use prompts and self-assessment, so they are not scored from the question bank.</p>
            )}
          </div>

          {bankModules.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="flex flex-col gap-2 border-b border-border p-3 sm:flex-row sm:items-center">
                <p className="text-sm font-medium sm:mr-auto">Questions <span className="text-muted-foreground">({form.questionIds.length} selected of {available.length})</span></p>
                <SearchInput className="sm:w-56" value={qSearch} onChange={setQSearch} placeholder="Filter questions…" />
                <SimpleSelect className="sm:w-36" value={qModule} onValueChange={setQModule} options={[{ value: "all", label: "All" }, ...bankModules.map((m) => ({ value: m, label: m[0].toUpperCase() + m.slice(1) }))]} />
                <Button type="button" size="sm" variant="secondary" onClick={() => setForm((f) => ({ ...f, questionIds: Array.from(new Set([...f.questionIds, ...shown.map((q) => q.id)])) }))}>Select shown</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setForm((f) => ({ ...f, questionIds: [] }))}>Clear</Button>
              </div>
              <ul className="max-h-64 divide-y divide-border overflow-y-auto scrollbar-thin">
                {shown.length === 0 && <li className="p-4 text-center text-sm text-muted-foreground">No questions match.</li>}
                {shown.map((q) => (
                  <li key={q.id}>
                    <label className="flex cursor-pointer items-start gap-3 px-3 py-2 hover:bg-subtle">
                      <Checkbox className="mt-0.5" checked={selected.has(q.id)} onCheckedChange={() => toggleQ(q.id)} />
                      <span className="min-w-0 flex-1 text-sm">
                        <span className="line-clamp-1">{q.text}</span>
                        <span className="text-xs text-muted-foreground">{q.module} · {questionTypeLabel(q.type)} · Cambridge {q.book} T{q.test}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              {errors.questions && <p className="border-t border-border px-3 py-2 text-xs text-destructive">{errors.questions}</p>}
            </div>
          )}

          <div className="grid gap-4 rounded-lg border border-border p-4 lg:grid-cols-[1fr_1.2fr]">
            <div className="grid content-start gap-3">
              <p className="text-sm font-medium">Scoring</p>
              <FormField label="Scoring mode">
                <SimpleSelect value={form.scoring.mode} onValueChange={(v) => setScoring("mode", v)} options={[{ value: "band", label: "IELTS band estimate" }, { value: "marks", label: "Marks & pass mark" }]} />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Marks per correct answer">
                  <Input type="number" min={0.5} step={0.5} value={form.scoring.marksPerQuestion} onChange={(e) => setScoring("marksPerQuestion", e.target.value)} />
                </FormField>
                <FormField label="Pass mark (%)">
                  <Input type="number" min={0} max={100} value={form.scoring.passMark} onChange={(e) => setScoring("passMark", e.target.value)} />
                </FormField>
              </div>
              {errors.scoring && <p className="text-xs text-destructive">{errors.scoring}</p>}
            </div>
            <div className={cn(form.scoring.mode !== "band" && "opacity-50")}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Band map <span className="text-xs font-normal text-muted-foreground">(raw score scaled to 40)</span></p>
                <div className="flex gap-1">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setScoring("bandMap", [...form.scoring.bandMap, { min: 0, band: "3.5" }])}><Plus /> Row</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setScoring("bandMap", DEFAULT_BAND_MAP.map((r) => ({ ...r })))}><RotateCcw /> Default</Button>
                </div>
              </div>
              <div className="mt-2 grid max-h-52 grid-cols-2 gap-x-3 gap-y-1.5 overflow-y-auto pr-1 scrollbar-thin sm:grid-cols-3">
                {form.scoring.bandMap.map((r, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <Input type="number" min={0} max={40} value={r.min} onChange={(e) => setBandRow(i, "min", e.target.value)} className="h-8 w-14 px-2" aria-label="Minimum raw score" />
                    <span className="text-xs text-muted-foreground">→</span>
                    <SimpleSelect value={r.band} onValueChange={(v) => setBandRow(i, "band", v)} options={["3.5", ...BAND_OPTIONS]} className="h-8 px-2" />
                    <button type="button" className="px-1 text-muted-foreground hover:text-ink" onClick={() => setScoring("bandMap", form.scoring.bandMap.filter((_, j) => j !== i))} aria-label="Remove row">×</button>
                  </div>
                ))}
              </div>
              {errors.bandMap && <p className="mt-1 text-xs text-destructive">{errors.bandMap}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{initial ? "Save mock test" : "Create mock test"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MockPreview({ test, questions, onClose }) {
  const items = useMemo(() => test.questionIds.map((id) => questions.find((q) => q.id === id)).filter(Boolean), [test, questions]);
  const totalSeconds = test.modules.filter((m) => m === "reading" || m === "listening").reduce((n, m) => n + (Number(test.durations[m]) || 0) * 60, 0) || 600;
  const [answers, setAnswers] = useState({});
  const [left, setLeft] = useState(totalSeconds);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (result) return undefined;
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [result]);
  useEffect(() => {
    if (left === 0 && !result) setResult(scoreMock(test, items, answers));
  }, [left, result, test, items, answers]);

  const restart = () => {
    setAnswers({});
    setLeft(totalSeconds);
    setResult(null);
  };
  const answered = items.filter((q) => String(answers[q.id] || "").trim()).length;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-subtle px-4 py-3 text-sm">
        <span className="inline-flex items-center gap-1.5 font-mono font-semibold tabular-nums"><Timer className="h-4 w-4" /> {clock(left)}</span>
        <span className="text-muted-foreground">{answered}/{items.length} answered</span>
        <span className="ml-auto flex flex-wrap gap-1">{test.modules.map((m) => <ModuleBadge key={m} module={m} />)}</span>
      </div>

      {result && (
        <div className="tiles sm:grid-cols-4">
          <div className="bg-white p-4"><p className="label-xs">Raw score</p><p className="mt-1 text-2xl font-semibold tabular-nums">{result.correct}/{result.total}</p></div>
          <div className="bg-white p-4"><p className="label-xs">Marks</p><p className="mt-1 text-2xl font-semibold tabular-nums">{result.marks}/{result.max}</p></div>
          <div className="bg-white p-4"><p className="label-xs">Percentage</p><p className="mt-1 text-2xl font-semibold tabular-nums">{result.percent}%</p></div>
          <div className="bg-white p-4">
            <p className="label-xs">{test.scoring.mode === "band" ? "Estimated band" : "Result"}</p>
            <p className="mt-1 text-2xl font-semibold">{test.scoring.mode === "band" ? result.band : result.passed ? "Pass" : "Fail"}</p>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState title="No bank questions in this test" description="Writing and Speaking sections are self-assessed. Add Reading or Listening questions to preview scoring." />
      ) : (
        <ol className="grid max-h-[46vh] gap-3 overflow-y-auto pr-1 scrollbar-thin">
          {items.map((q, i) => {
            const ok = result && isCorrect(q, answers[q.id]);
            return (
              <li key={q.id} className={cn("rounded-lg border p-4", result ? (ok ? "border-green-700/30 bg-green-50/50" : "border-red-700/30 bg-red-50/50") : "border-border bg-white")}>
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold tabular-nums">{i + 1}.</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground"><span className="capitalize">{q.module}</span> · {questionTypeLabel(q.type)}</p>
                    <p className="mt-1 text-sm font-medium">{q.text}</p>
                    {q.options.length ? (
                      <div className="mt-2 grid gap-1 sm:grid-cols-2">
                        {q.options.map((o) => (
                          <label key={o} className={cn("flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm", answers[q.id] === o ? "border-ink bg-subtle" : "border-border bg-white")}>
                            <input type="radio" disabled={!!result} name={`pv-${q.id}`} checked={answers[q.id] === o} onChange={() => setAnswers({ ...answers, [q.id]: o })} className="accent-black" /> {o}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <Input disabled={!!result} className="mt-2 h-9 max-w-sm" value={answers[q.id] || ""} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} placeholder="Your answer" />
                    )}
                    {result && (
                      <p className="mt-2 inline-flex items-start gap-1.5 text-xs">
                        {ok ? <CheckCircle2 className="h-3.5 w-3.5 text-green-700" /> : <XCircle className="h-3.5 w-3.5 text-red-700" />}
                        <span>Correct answer: <strong>{q.answer}</strong>{q.explanation ? ` — ${q.explanation}` : ""}</span>
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        {result ? (
          <Button onClick={restart}><RotateCcw /> Try again</Button>
        ) : (
          <Button onClick={() => setResult(scoreMock(test, items, answers))} disabled={!items.length}>Submit & score</Button>
        )}
      </DialogFooter>
    </div>
  );
}

export default function MockTestManagement() {
  const [tests, setTests] = useStore("mockTests");
  const [questions] = useStore("questions");
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = tests
    .filter((t) => (status === "all" ? true : status === "published" ? t.published : !t.published))
    .filter((t) => !query.trim() || t.name.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const submit = (values) => {
    if (form.initial?.id) {
      setTests((list) => list.map((t) => (t.id === form.initial.id ? { ...t, ...values } : t)));
      toast({ title: "Mock test updated", description: values.name, variant: "success" });
    } else {
      setTests((list) => [{ ...values, id: uid("mock"), createdAt: new Date().toISOString() }, ...list]);
      toast({ title: "Mock test created", description: values.name, variant: "success" });
    }
    setForm(null);
  };

  const togglePublish = (t) => {
    setTests((list) => list.map((x) => (x.id === t.id ? { ...x, published: !x.published } : x)));
    toast({ title: t.published ? "Mock test unpublished" : "Mock test published", description: t.name, variant: "success" });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Mock tests"
        description="Build timed mock exams from the question bank, configure scoring and preview the student experience."
        actions={<Button onClick={() => setForm({ initial: null })}><Plus /> Create mock test</Button>}
      />

      <div className="mb-6 grid grid-cols-2 tiles lg:grid-cols-4">
        <StatCard className="rounded-none border-0 shadow-none" label="Mock tests" value={tests.length} />
        <StatCard className="rounded-none border-0 shadow-none" label="Published" value={tests.filter((t) => t.published).length} />
        <StatCard className="rounded-none border-0 shadow-none" label="Full exams" value={tests.filter((t) => t.modules.length === 4).length} hint="All four modules" />
        <StatCard className="rounded-none border-0 shadow-none" label="Avg. questions" value={tests.length ? Math.round(tests.reduce((n, t) => n + t.questionIds.length, 0) / tests.length) : 0} />
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_200px]">
        <SearchInput value={query} onChange={setQuery} placeholder="Search mock tests…" />
        <SimpleSelect value={status} onValueChange={setStatus} options={[{ value: "all", label: "All statuses" }, { value: "published", label: "Published" }, { value: "draft", label: "Unpublished" }]} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title={tests.length ? "No mock tests match" : "No mock tests yet"} description="Create a mock test from the question bank." action={<Button onClick={() => setForm({ initial: null })}><Plus /> Create mock test</Button>} />
      ) : (
        <div className="tiles md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((t) => {
            const totalMin = t.modules.reduce((n, m) => n + (Number(t.durations[m]) || 0), 0);
            const missing = t.questionIds.filter((id) => !questions.some((q) => q.id === id)).length;
            return (
              <div key={t.id} className="flex flex-col bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold leading-snug">{t.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.description || "No description."}</p>
                  </div>
                  <Switch checked={t.published} onCheckedChange={() => togglePublish(t)} aria-label="Publish" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1">{t.modules.map((m) => <ModuleBadge key={m} module={m} />)}</div>
                <dl className="tiles mt-4 grid-cols-3 rounded-lg text-center shadow-none">
                  <div className="bg-white p-2"><dt className="label-xs">Duration</dt><dd className="mt-1 text-sm font-semibold tabular-nums">{totalMin}m</dd></div>
                  <div className="bg-white p-2"><dt className="label-xs">Questions</dt><dd className="mt-1 text-sm font-semibold tabular-nums">{t.questionIds.length}</dd></div>
                  <div className="bg-white p-2"><dt className="label-xs">Scoring</dt><dd className="mt-1 text-sm font-semibold">{t.scoring.mode === "band" ? "Band" : `Pass ${t.scoring.passMark}%`}</dd></div>
                </dl>
                {missing > 0 && <p className="mt-2 text-xs text-amber-800">{missing} question(s) no longer exist in the bank.</p>}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground"><StatusDot on={t.published} offLabel="Unpublished" /> · {formatDate(t.createdAt)}</span>
                  <div className="flex">
                    <Button variant="ghost" size="icon" onClick={() => setPreview(t)} aria-label="Preview"><Eye /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setForm({ initial: t })} aria-label="Edit"><Pencil /></Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Duplicate"
                      onClick={() => {
                        setTests((list) => [{ ...JSON.parse(JSON.stringify(t)), id: uid("mock"), name: `${t.name} (copy)`, published: false, createdAt: new Date().toISOString() }, ...list]);
                        toast({ title: "Mock test duplicated", variant: "success" });
                      }}
                    >
                      <Copy />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(t)} aria-label="Delete"><Trash2 /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MockTestForm open={!!form} onOpenChange={(o) => !o && setForm(null)} initial={form?.initial} questions={questions} onSubmit={submit} />

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Preview · {preview?.name}</DialogTitle>
            <DialogDescription>Answer the questions as a student would. Nothing is saved. <Badge variant="muted">Preview mode</Badge></DialogDescription>
          </DialogHeader>
          {preview && <MockPreview key={preview.id} test={preview} questions={questions} onClose={() => setPreview(null)} />}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="The mock test will be removed. Questions remain in the question bank."
        confirmLabel="Delete mock test"
        destructive
        onConfirm={() => {
          setTests((list) => list.filter((t) => t.id !== deleteTarget.id));
          toast({ title: "Mock test deleted", variant: "success" });
        }}
      />
    </div>
  );
}
