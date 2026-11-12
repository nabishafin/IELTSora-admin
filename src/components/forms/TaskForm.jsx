import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/overlays";
import { Button } from "@/components/ui/button";
import { Input, Switch, Label } from "@/components/ui/form-controls";
import { FormField, SimpleSelect } from "@/components/common/misc";
import ListEditor from "@/components/forms/ListEditor";
import { CAMBRIDGE_BOOK_NUMBERS, DIFFICULTIES, MODULES, PARTS_PER_MODULE, partLabel } from "@/utils/constants";

const blank = (module, duration) => ({ module, title: "", hasSource: module === "reading" || module === "listening", book: "10", test: "1", part: "1", steps: [], duration: String(duration || 30), difficulty: "Medium" });

/** Create / edit a single study-plan task. */
export default function TaskForm({ open, onOpenChange, initial, defaultModule = "reading", defaultDurations = {}, onSubmit }) {
  const [form, setForm] = useState(blank(defaultModule));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (initial) {
      const s = initial.source;
      setForm({
        module: initial.module,
        title: initial.title,
        hasSource: Boolean(s && s.book),
        book: String(s?.book || 10),
        test: String(s?.test || 1),
        part: s && (s.part === null || s.part === undefined || s.part === "" || s.part === "full") ? "full" : String(s?.part || 1),
        steps: [...(initial.steps || [])],
        duration: String(initial.duration),
        difficulty: initial.difficulty || "Medium",
      });
    } else setForm(blank(defaultModule, defaultDurations[defaultModule]));
  }, [open, initial, defaultModule, defaultDurations]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v?.target ? v.target.value : v }));
  const changeModule = (module) =>
    setForm((f) => {
      const maxPart = PARTS_PER_MODULE[module];
      const fullAllowed = module === "reading" || module === "listening";
      let part = f.part;
      if (part === "full" && !fullAllowed) part = "1";
      if (part !== "full" && Number(part) > maxPart) part = "1";
      return { ...f, module, part, duration: initial ? f.duration : String(defaultDurations[module] || f.duration) };
    });

  const partOptions = [
    ...Array.from({ length: PARTS_PER_MODULE[form.module] }, (_, i) => ({ value: String(i + 1), label: `${partLabel(form.module)} ${i + 1}` })),
    ...(form.module === "reading" || form.module === "listening" ? [{ value: "full", label: "Full test (all parts)" }] : []),
  ];

  const autoTitle = () => {
    const part = form.part === "full" ? `Full ${MODULES.find((m) => m.key === form.module).label} Test` : `${partLabel(form.module)} ${form.part}`;
    setForm((f) => ({ ...f, title: `Cambridge IELTS ${f.book} · Test ${f.test} · ${part}` }));
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.title.trim().length < 3) next.title = "Enter a task title (at least 3 characters).";
    const dur = Number(form.duration);
    if (!Number.isFinite(dur) || dur < 5 || dur > 240) next.duration = "Duration must be between 5 and 240 minutes.";
    if (form.steps.length === 0) next.steps = "Add at least one instruction step.";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit({
      module: form.module,
      title: form.title.trim(),
      source: form.hasSource ? { book: Number(form.book), test: Number(form.test), part: form.part === "full" ? "full" : Number(form.part) } : null,
      steps: form.steps.map((s) => s.trim()).filter(Boolean),
      duration: dur,
      difficulty: form.difficulty,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit task" : "Create task"}</DialogTitle>
          <DialogDescription>Assign a module task, its Cambridge source, instructions, duration and difficulty.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Module" htmlFor="t-module" required>
              <SimpleSelect id="t-module" value={form.module} onValueChange={changeModule} options={MODULES.map((m) => ({ value: m.key, label: m.label }))} />
            </FormField>
            <FormField label="Duration (min)" htmlFor="t-dur" required error={errors.duration}>
              <Input id="t-dur" type="number" min={5} max={240} value={form.duration} onChange={set("duration")} className={errors.duration && "border-destructive"} />
            </FormField>
            <FormField label="Difficulty" htmlFor="t-diff">
              <SimpleSelect id="t-diff" value={form.difficulty} onValueChange={set("difficulty")} options={DIFFICULTIES} />
            </FormField>
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="t-src">Link to a Cambridge test</Label>
              <Switch id="t-src" checked={form.hasSource} onCheckedChange={set("hasSource")} />
            </div>
            {form.hasSource && (
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_1.4fr_auto] sm:items-end">
                <FormField label="Book" htmlFor="t-book">
                  <SimpleSelect id="t-book" value={form.book} onValueChange={set("book")} options={CAMBRIDGE_BOOK_NUMBERS.map((n) => ({ value: String(n), label: `Cambridge ${n}` }))} />
                </FormField>
                <FormField label="Test" htmlFor="t-test">
                  <SimpleSelect id="t-test" value={form.test} onValueChange={set("test")} options={[1, 2, 3, 4].map((n) => ({ value: String(n), label: `Test ${n}` }))} />
                </FormField>
                <FormField label={partLabel(form.module)} htmlFor="t-part">
                  <SimpleSelect id="t-part" value={form.part} onValueChange={set("part")} options={partOptions} />
                </FormField>
                <Button type="button" variant="secondary" onClick={autoTitle}>Use as title</Button>
              </div>
            )}
          </div>

          <FormField label="Task title" htmlFor="t-title" required error={errors.title}>
            <Input id="t-title" value={form.title} onChange={set("title")} placeholder="e.g. Cambridge IELTS 16 · Test 1 · Passage 2" className={errors.title && "border-destructive"} />
          </FormField>

          <FormField label="Instructions / steps" required error={errors.steps}>
            <ListEditor items={form.steps} onChange={set("steps")} placeholder="Add an instruction and press Enter" addLabel="Add step" />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{initial ? "Update task" : "Add task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
