import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/overlays";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/form-controls";
import { FormField, SimpleSelect } from "@/components/common/misc";
import ListEditor from "@/components/forms/ListEditor";
import { QUESTION_TYPES, questionTypeMeta } from "@/data/mockQuestions";
import { BOOKS_NEWEST_FIRST, partLabel } from "@/utils/constants";

const QUESTION_MODULES = [
  { value: "reading", label: "Reading" },
  { value: "listening", label: "Listening" },
];

const EMPTY = { module: "reading", book: "10", test: "1", part: "1", type: "multiple-choice", text: "", options: [], answer: "", explanation: "", marks: "1" };

/** Validates a question payload; returns an object of field → message. Exported for reuse/tests. */
export function validateQuestion(q) {
  const errors = {};
  const meta = questionTypeMeta(q.type);
  if (!meta) errors.type = "Choose a question type.";
  else if (!meta.modules.includes(q.module)) errors.type = `${meta.label} is not available for ${q.module}.`;
  if (String(q.text).trim().length < 5) errors.text = "Question text must be at least 5 characters.";
  if (meta?.options === "custom") {
    const opts = q.options.map((o) => o.trim()).filter(Boolean);
    if (opts.length < 2) errors.options = "Add at least two answer options.";
    else if (new Set(opts.map((o) => o.toLowerCase())).size !== opts.length) errors.options = "Options must be unique.";
  }
  if (!String(q.answer).trim()) errors.answer = "Set the correct answer.";
  else if (meta && meta.options !== "none" && !q.options.includes(q.answer)) errors.answer = "The correct answer must be one of the options.";
  const marks = Number(q.marks);
  if (!Number.isFinite(marks) || marks < 0.5 || marks > 10) errors.marks = "Marks must be between 0.5 and 10.";
  return errors;
}

export default function QuestionForm({ open, onOpenChange, initial, defaults, onSubmit, title }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    const src = initial || { ...EMPTY, ...(defaults || {}) };
    setForm({
      module: src.module,
      book: String(src.book),
      test: String(src.test),
      part: String(src.part),
      type: src.type,
      text: src.text || "",
      options: [...(src.options || [])],
      answer: src.answer || "",
      explanation: src.explanation || "",
      marks: String(src.marks ?? 1),
    });
  }, [open, initial, defaults]);

  const meta = questionTypeMeta(form.type);
  const types = QUESTION_TYPES.filter((t) => t.modules.includes(form.module));
  const maxPart = form.module === "reading" ? 3 : 4;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const changeModule = (module) =>
    setForm((f) => {
      const allowed = QUESTION_TYPES.filter((t) => t.modules.includes(module));
      const type = allowed.some((t) => t.value === f.type) ? f.type : allowed[0].value;
      const part = Number(f.part) > (module === "reading" ? 3 : 4) ? "1" : f.part;
      return applyType({ ...f, module, part }, type);
    });
  const applyType = (f, type) => {
    const m = questionTypeMeta(type);
    let options = f.options;
    if (m.options === "fixed") options = [...m.fixed];
    else if (m.options === "none") options = [];
    else if (questionTypeMeta(f.type)?.options === "fixed") options = [];
    const answer = m.options === "none" ? (questionTypeMeta(f.type)?.options === "none" ? f.answer : "") : options.includes(f.answer) ? f.answer : "";
    return { ...f, type, options, answer };
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      module: form.module,
      book: Number(form.book),
      test: Number(form.test),
      part: Number(form.part),
      type: form.type,
      text: form.text.trim(),
      options: form.options.map((o) => o.trim()).filter(Boolean),
      answer: form.answer.trim(),
      explanation: form.explanation.trim(),
      marks: Number(form.marks),
    };
    const errs = validateQuestion(payload);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title || (initial ? "Edit question" : "Create question")}</DialogTitle>
          <DialogDescription>Link the question to a Cambridge book, test and {partLabel(form.module).toLowerCase()}, then set the answer key.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4" noValidate>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <FormField label="Module" required>
              <SimpleSelect value={form.module} onValueChange={changeModule} options={QUESTION_MODULES} />
            </FormField>
            <FormField label="Book" required>
              <SimpleSelect value={form.book} onValueChange={(v) => set("book", v)} options={BOOKS_NEWEST_FIRST.map((n) => ({ value: String(n), label: `Cambridge ${n}` }))} />
            </FormField>
            <FormField label="Test" required>
              <SimpleSelect value={form.test} onValueChange={(v) => set("test", v)} options={[1, 2, 3, 4].map((n) => ({ value: String(n), label: `Test ${n}` }))} />
            </FormField>
            <FormField label={partLabel(form.module)} required>
              <SimpleSelect value={form.part} onValueChange={(v) => set("part", v)} options={Array.from({ length: maxPart }, (_, i) => ({ value: String(i + 1), label: `${partLabel(form.module)} ${i + 1}` }))} />
            </FormField>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
            <FormField label="Question type" required error={errors.type}>
              <SimpleSelect value={form.type} onValueChange={(v) => setForm((f) => applyType(f, v))} options={types.map((t) => ({ value: t.value, label: t.label }))} invalid={!!errors.type} />
            </FormField>
            <FormField label="Marks" required error={errors.marks}>
              <Input type="number" step="0.5" min="0.5" max="10" value={form.marks} onChange={(e) => set("marks", e.target.value)} className={errors.marks && "border-destructive"} />
            </FormField>
          </div>
          <FormField label="Question text" required error={errors.text} hint={meta?.options === "none" ? "Use ________ to mark the gap students must complete." : undefined}>
            <Textarea value={form.text} onChange={(e) => set("text", e.target.value)} className={errors.text && "border-destructive"} />
          </FormField>

          {meta?.options === "custom" && (
            <FormField label="Answer options" required error={errors.options}>
              <ListEditor
                items={form.options}
                onChange={(opts) => setForm((f) => ({ ...f, options: opts, answer: opts.includes(f.answer) ? f.answer : "" }))}
                placeholder={form.type === "map-labelling" ? "Add a map letter, e.g. A" : "Add an option"}
                addLabel="Add option"
              />
            </FormField>
          )}
          {meta?.options === "fixed" && (
            <div className="rounded-lg border border-border bg-subtle px-3 py-2 text-xs text-muted-foreground">Fixed options: {meta.fixed.join(" / ")}</div>
          )}

          <FormField label="Correct answer" required error={errors.answer} hint={meta?.options === "none" ? "Separate acceptable alternatives with a vertical bar, e.g. 6 weeks | six weeks" : undefined}>
            {meta?.options === "none" ? (
              <Input value={form.answer} onChange={(e) => set("answer", e.target.value)} className={errors.answer && "border-destructive"} placeholder="Exact answer" />
            ) : form.options.filter(Boolean).length ? (
              <SimpleSelect value={form.answer || undefined} onValueChange={(v) => set("answer", v)} options={form.options.filter(Boolean)} placeholder="Select the correct option" invalid={!!errors.answer} />
            ) : (
              <p className="rounded-lg border border-dashed border-input px-3 py-2 text-xs text-muted-foreground">Add options first, then choose the correct one.</p>
            )}
          </FormField>

          <FormField label="Explanation" hint="Shown to students after they submit.">
            <Textarea value={form.explanation} onChange={(e) => set("explanation", e.target.value)} className="min-h-[70px]" />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{initial ? "Save question" : "Create question"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
