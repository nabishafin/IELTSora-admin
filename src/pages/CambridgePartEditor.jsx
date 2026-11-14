import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowDown, ArrowUp, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { FormField, SimpleSelect, EmptyState } from "@/components/common/misc";
import ListEditor from "@/components/forms/ListEditor";
import { Input, Textarea, Switch, Label, Badge } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/overlays";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { CAMBRIDGE_BOOK_NUMBERS, MODULE_COLORS } from "@/utils/constants";
import {
  CAMBRIDGE_MODULES, LETTERS, WRITING_TYPES, answerChoices, blankForm, defaultContent, blankGroup, blankQuestion, entryKey, fromForm, groupMeta, groupSize, optionValues, paragraphCount, toForm, typesFor, validateForm,
} from "@/utils/cambridgeContent";

const isUrl = (v) => /^https?:\/\//i.test(String(v || "").trim());
const move = (arr, i, d) => {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

/* ------------------------------------------------------------------ question groups (Reading / Listening) */
const QUESTION_ROWS = ["mcq", "statement", "headings", "paragraph", "list", "map", "gap"];
const PLACEHOLDER = { mcq: "Question", statement: "Statement", paragraph: "Information to find", list: "Statement", map: "Place on the map", gap: "Text with ___ for the gap" };

function AnswerControl({ choices, value, onChange, placeholder = "Answer" }) {
  if (choices) return <SimpleSelect value={value || undefined} onValueChange={onChange} options={choices} placeholder={placeholder} disabled={!choices.length} />;
  return <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Answer | alternative" />;
}

/** Editable option list with fixed value labels (i, ii… or A, B…). */
function OptionList({ label, values, options, onChange, placeholder }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {options.map((o, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-8 shrink-0 text-right text-sm font-semibold">{values[i]}</span>
          <Input value={o} onChange={(e) => onChange(options.map((x, j) => (j === i ? e.target.value : x)))} placeholder={placeholder} />
          <Button variant="ghost" size="icon" onClick={() => onChange(options.filter((_, j) => j !== i))} aria-label="Remove"><X /></Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="justify-self-start" onClick={() => onChange([...options, ""])}><Plus /> Add</Button>
    </div>
  );
}

/** One answer per ___ gap (Summary and Table). */
function GapAnswers({ count, first, gaps, choices, onChange }) {
  if (!count) return <p className="text-xs text-muted-foreground">Type ___ where each gap goes.</p>;
  const setGap = (i, patch) => {
    const next = Array.from({ length: Math.max(count, gaps.length) }, (_, j) => gaps[j] || { answer: "", explanation: "" });
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  return (
    <div className="grid gap-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="grid items-center gap-2 sm:grid-cols-[32px_180px_1fr]">
          <span className="text-right text-sm font-semibold tabular-nums">{first + i}</span>
          <AnswerControl choices={choices} value={gaps[i]?.answer || ""} onChange={(v) => setGap(i, { answer: v })} />
          <Input className="text-xs" value={gaps[i]?.explanation || ""} onChange={(e) => setGap(i, { explanation: e.target.value })} placeholder="Explanation (optional)" />
        </div>
      ))}
    </div>
  );
}

function TableEditor({ table, onChange }) {
  const cols = table.headers.length;
  const setHeader = (ci, v) => onChange({ ...table, headers: table.headers.map((h, j) => (j === ci ? v : h)) });
  const setCell = (ri, ci, v) => onChange({ ...table, rows: table.rows.map((r, i) => (i === ri ? r.map((c, j) => (j === ci ? v : c)) : r)) });
  return (
    <div className="grid gap-2">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full border-separate border-spacing-1">
          <thead>
            <tr>
              {table.headers.map((h, ci) => (
                <th key={ci} className="min-w-[140px]">
                  <Input className="h-8 font-semibold" value={h} onChange={(e) => setHeader(ci, e.target.value)} placeholder={`Column ${ci + 1}`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, ri) => (
              <tr key={ri}>
                {r.map((c, ci) => (
                  <td key={ci}>
                    <Input className="h-8" value={c} onChange={(e) => setCell(ri, ci, e.target.value)} />
                  </td>
                ))}
                <td className="w-8">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onChange({ ...table, rows: table.rows.filter((_, i) => i !== ri) })} disabled={table.rows.length < 2} aria-label="Remove row"><X /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => onChange({ ...table, rows: [...table.rows, Array(cols).fill("")] })}><Plus /> Row</Button>
        <Button variant="outline" size="sm" onClick={() => onChange({ headers: [...table.headers, ""], rows: table.rows.map((r) => [...r, ""]) })} disabled={cols >= 6}><Plus /> Column</Button>
        <Button variant="ghost" size="sm" onClick={() => onChange({ headers: table.headers.slice(0, -1), rows: table.rows.map((r) => r.slice(0, -1)) })} disabled={cols <= 2}>Remove column</Button>
      </div>
    </div>
  );
}

function GroupEditor({ module, group, index, total, firstNumber, paragraphs, onChange, onMove, onRemove }) {
  const meta = groupMeta(group.type);
  const editor = meta.editor;
  const set = (patch) => onChange({ ...group, ...patch });
  const setQ = (qi, patch) => set({ questions: group.questions.map((q, j) => (j === qi ? { ...q, ...patch } : q)) });
  const choices = answerChoices(group, { paragraphs });
  const size = groupSize(group);
  const last = firstNumber + size - 1;

  const changeType = (type) => {
    const next = groupMeta(type);
    const fresh = blankGroup(module, type);
    const custom = group.instructions && group.instructions !== meta.instructions;
    const keepRows = QUESTION_ROWS.includes(editor) && QUESTION_ROWS.includes(next.editor);
    onChange({
      ...fresh,
      instructions: custom ? group.instructions : next.instructions,
      heading: group.heading,
      questions: keepRows ? group.questions.map((q) => ({ ...blankQuestion(next.editor), text: next.editor === "headings" || editor === "headings" ? "" : q.text, explanation: q.explanation })) : fresh.questions,
    });
  };

  return (
    <section className="surface p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{size ? `Q${firstNumber}${last > firstNumber ? `–${last}` : ""}` : "Q–"}</Badge>
        <SimpleSelect className="h-8 w-56" value={group.type} onValueChange={changeType} options={typesFor(module).map((t) => t.type)} />
        <div className="ml-auto flex">
          <Button variant="ghost" size="icon" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move up"><ArrowUp /></Button>
          <Button variant="ghost" size="icon" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Move down"><ArrowDown /></Button>
          <Button variant="ghost" size="icon" onClick={onRemove} aria-label="Delete group"><Trash2 /></Button>
        </div>
      </div>

      <div className="grid gap-2">
        <Textarea value={group.instructions} onChange={(e) => set({ instructions: e.target.value })} className="min-h-[52px]" aria-label="Instructions" />
        {meta.heading && <Input value={group.heading} onChange={(e) => set({ heading: e.target.value })} placeholder="Heading (optional)" />}
      </div>

      {/* Type-specific parts */}
      <div className="mt-4 grid gap-4">
        {editor === "map" && (
          <div className="grid gap-2 sm:grid-cols-[1fr_140px]">
            <Input value={group.imageUrl} onChange={(e) => set({ imageUrl: e.target.value })} placeholder="Map image link (https://…)" />
            <SimpleSelect value={String(group.mapCount)} onValueChange={(v) => set({ mapCount: Number(v) })} options={[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ value: String(n), label: `A–${LETTERS[n - 1]}` }))} />
            {isUrl(group.imageUrl) && <img src={group.imageUrl.trim()} alt="" className="max-h-56 rounded-lg border border-border object-contain sm:col-span-2" />}
          </div>
        )}
        {editor === "headings" && <OptionList label="Headings" values={optionValues(group.type, group.options.length)} options={group.options} onChange={(v) => set({ options: v })} placeholder="Heading" />}
        {editor === "list" && <OptionList label="Options" values={optionValues(group.type, group.options.length)} options={group.options} onChange={(v) => set({ options: v })} placeholder="Option" />}
        {editor === "paragraph" && <p className="text-xs text-muted-foreground">Options: paragraphs {paragraphs ? `A–${LETTERS[paragraphs - 1]}` : "— add the passage first"}</p>}

        {editor === "summary" && (
          <>
            <Textarea value={group.text} onChange={(e) => set({ text: e.target.value })} className="min-h-[110px] leading-6" placeholder="Summary text with ___ for each gap" />
            <OptionList label="Word bank (optional)" values={optionValues(group.type, group.options.length)} options={group.options} onChange={(v) => set({ options: v })} placeholder="Word" />
            <GapAnswers count={size} first={firstNumber} gaps={group.gaps} choices={choices} onChange={(v) => set({ gaps: v })} />
          </>
        )}
        {editor === "table" && (
          <>
            <TableEditor table={group.table} onChange={(v) => set({ table: v })} />
            <GapAnswers count={size} first={firstNumber} gaps={group.gaps} choices={null} onChange={(v) => set({ gaps: v })} />
          </>
        )}

        {QUESTION_ROWS.includes(editor) && (
          <div className="grid gap-2">
            {group.questions.map((q, qi) => (
              <div key={qi} className="flex items-start gap-2 rounded-lg border border-border bg-white/70 p-2.5">
                <span className="mt-2 w-6 shrink-0 text-right text-sm font-semibold tabular-nums">{firstNumber + qi}</span>
                <div className="grid min-w-0 flex-1 gap-2">
                  <div className="grid gap-2 sm:grid-cols-[1fr_180px]">
                    {editor === "headings" ? (
                      <SimpleSelect value={q.text || undefined} onValueChange={(v) => setQ(qi, { text: v })} options={LETTERS.slice(0, paragraphs).map((l) => ({ value: l, label: `Paragraph ${l}` }))} placeholder="Paragraph" disabled={!paragraphs} />
                    ) : (
                      <Input value={q.text} onChange={(e) => setQ(qi, { text: e.target.value })} placeholder={PLACEHOLDER[editor]} />
                    )}
                    <AnswerControl
                      choices={editor === "mcq" ? LETTERS.slice(0, q.choices.filter((c) => c.trim()).length) : choices}
                      value={q.answer}
                      onChange={(v) => setQ(qi, { answer: v })}
                      placeholder={editor === "headings" ? "Heading" : "Answer"}
                    />
                  </div>
                  {editor === "mcq" && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {q.choices.map((c, ci) => (
                        <div key={ci} className="flex items-center gap-2">
                          <span className="w-4 shrink-0 text-xs font-semibold">{LETTERS[ci]}</span>
                          <Input className="h-8" value={c} onChange={(e) => setQ(qi, { choices: q.choices.map((x, j) => (j === ci ? e.target.value : x)) })} />
                        </div>
                      ))}
                    </div>
                  )}
                  <Input className="h-8 text-xs" value={q.explanation} onChange={(e) => setQ(qi, { explanation: e.target.value })} placeholder="Explanation (optional)" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => set({ questions: group.questions.filter((_, j) => j !== qi) })} aria-label="Delete question"><X /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="justify-self-start" onClick={() => set({ questions: [...group.questions, blankQuestion(editor)] })}><Plus /> Question</Button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ module forms */
function ReadingListeningForm({ module, form, set, firstNumbers }) {
  const setGroups = (groups) => set({ groups });
  return (
    <>
      <section className="surface mb-4 grid gap-4 p-5">
        <FormField label="Title" required>
          <Input value={form.title} onChange={(e) => set({ title: e.target.value })} />
        </FormField>
        {module === "reading" ? (
          <>
            <FormField label="Passage" required hint="Blank line between paragraphs">
              <Textarea value={form.text} onChange={(e) => set({ text: e.target.value })} className="min-h-[260px] leading-6" />
            </FormField>
            <div className="flex items-center gap-3">
              <Switch id="lettered" checked={form.lettered} onCheckedChange={(v) => set({ lettered: v })} />
              <Label htmlFor="lettered">Paragraphs A, B, C…</Label>
            </div>
          </>
        ) : (
          <>
            <FormField label="Audio link" hint="Direct link to an MP3 file">
              <Input value={form.audioUrl} onChange={(e) => set({ audioUrl: e.target.value })} placeholder="https://…/section.mp3" />
            </FormField>
            {isUrl(form.audioUrl) && <audio controls preload="none" src={form.audioUrl.trim()} className="h-9 w-full" />}
            <FormField label="Transcript" hint="One line each — Name: text">
              <Textarea value={form.transcript} onChange={(e) => set({ transcript: e.target.value })} className="min-h-[160px] font-mono text-xs leading-6" placeholder={"Receptionist: Good morning.\nCaller: Hi, I'd like to join the gym."} />
            </FormField>
          </>
        )}
      </section>

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight">Questions</h2>
        <span className="text-xs tabular-nums text-muted-foreground">{form.groups.reduce((n, g) => n + groupSize(g), 0)}</span>
      </div>
      <div className="grid gap-3">
        {form.groups.map((g, gi) => (
          <GroupEditor
            key={gi}
            module={module}
            group={g}
            index={gi}
            total={form.groups.length}
            firstNumber={firstNumbers[gi]}
            paragraphs={paragraphCount(form.text)}
            onChange={(next) => setGroups(form.groups.map((x, j) => (j === gi ? next : x)))}
            onMove={(d) => setGroups(move(form.groups, gi, d))}
            onRemove={() => setGroups(form.groups.filter((_, j) => j !== gi))}
          />
        ))}
        <Button variant="secondary" className="justify-self-start" onClick={() => setGroups([...form.groups, blankGroup(module)])}><Plus /> Question group</Button>
      </div>
    </>
  );
}

function WritingForm({ part, form, set }) {
  return (
    <section className="surface grid gap-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Type">
          {part === 2 ? (
            <Input value="Task 2 essay" disabled />
          ) : (
            <SimpleSelect value={form.type} onValueChange={(v) => set({ type: v })} options={WRITING_TYPES.filter((t) => t.value !== "task-2")} />
          )}
        </FormField>
        <FormField label="Category">
          <Input value={form.category} onChange={(e) => set({ category: e.target.value })} placeholder={part === 2 ? "Opinion essay" : "Line graph"} />
        </FormField>
      </div>
      <FormField label="Title" required>
        <Input value={form.title} onChange={(e) => set({ title: e.target.value })} />
      </FormField>
      <FormField label="Prompt" required>
        <Textarea value={form.prompt} onChange={(e) => set({ prompt: e.target.value })} className="min-h-[160px] leading-6" />
      </FormField>
      {form.type === "academic-task-1" && (
        <>
          <FormField label="Chart / diagram image link">
            <Input value={form.imageUrl} onChange={(e) => set({ imageUrl: e.target.value })} placeholder="https://…/chart.png" />
          </FormField>
          {isUrl(form.imageUrl) && <img src={form.imageUrl.trim()} alt="" className="max-h-64 rounded-lg border border-border object-contain" />}
          {form.visual && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white/70 px-3 py-2 text-sm">
              <span>Built-in {form.visual.kind} chart</span>
              <Button variant="ghost" size="sm" onClick={() => set({ visual: null })}><X /> Remove</Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function SpeakingForm({ part, form, set }) {
  return (
    <section className="surface grid gap-4 p-5">
      <FormField label="Topic" required>
        <Input value={form.topic} onChange={(e) => set({ topic: e.target.value })} />
      </FormField>
      {part === 2 ? (
        <>
          <FormField label="Cue card" required>
            <Input value={form.cue} onChange={(e) => set({ cue: e.target.value })} placeholder="Describe a…" />
          </FormField>
          <FormField label="You should say" required>
            <ListEditor items={form.bullets} onChange={(v) => set({ bullets: v })} placeholder="Bullet point" addLabel="Add" numbered={false} />
          </FormField>
          <FormField label="Last line">
            <Input value={form.followUp} onChange={(e) => set({ followUp: e.target.value })} placeholder="and explain why…" />
          </FormField>
        </>
      ) : (
        <FormField label="Questions" required>
          <ListEditor items={form.questions} onChange={(v) => set({ questions: v })} placeholder="Question" addLabel="Add" />
        </FormField>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ page */
export default function CambridgePartEditor() {
  const { book: b, test: t, module, part: p } = useParams();
  const book = Number(b);
  const test = Number(t);
  const part = Number(p);
  const meta = CAMBRIDGE_MODULES[module];
  const navigate = useNavigate();
  const toast = useToast();
  const [entries, setEntries] = useStore("cambridge");
  const key = `${module}:${book}:${test}:${part}`;
  const stored = entries.find((e) => entryKey(e) === key);
  const [form, setForm] = useState(() => (meta ? toForm(stored?.content || defaultContent(module, book, test, part), module, part) : null));
  const [errors, setErrors] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (meta) setForm(toForm(stored?.content || defaultContent(module, book, test, part), module, part));
    setErrors([]);
    // reload only when the slot changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const firstNumbers = useMemo(() => {
    let n = 1;
    return (form?.groups || []).map((g) => {
      const start = n;
      n += groupSize(g);
      return start;
    });
  }, [form]);

  const valid = meta && form && CAMBRIDGE_BOOK_NUMBERS.includes(book) && test >= 1 && test <= 4 && part >= 1 && part <= meta.parts;
  if (!valid) return <EmptyState title="Not found" action={<Button asChild><Link to="/cambridge">Cambridge Practice</Link></Button>} />;

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const back = `/cambridge?book=${book}&test=${test}`;

  const save = () => {
    const errs = validateForm(form, module, part);
    setErrors(errs);
    if (errs.length) return;
    const entry = { book, test, module, part, content: fromForm(form, module, { book, test, part }), updatedAt: new Date().toISOString() };
    setEntries((list) => [...list.filter((e) => entryKey(e) !== key), entry]);
    toast({ title: "Saved", variant: "success" });
    navigate(back);
  };

  return (
    <div className="max-w-4xl">
      <PageHeader
        back={{ to: back, label: `Cambridge ${book} · Test ${test}` }}
        title={
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: MODULE_COLORS[module] }} />
            {meta.label} · {meta.partLabel} {part}
          </span>
        }
        actions={
          <>
            <Badge variant={stored ? "success" : "muted"}>{stored ? "Edited" : "Default"}</Badge>
            {stored && <Button variant="ghost" onClick={() => setConfirmDelete(true)}><RotateCcw /> Reset</Button>}
            <Button onClick={save}><Save /> Save</Button>
          </>
        }
      />

      {errors.length > 0 && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <ul className="grid gap-0.5">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}

      {module === "writing" ? (
        <WritingForm part={part} form={form} set={set} />
      ) : module === "speaking" ? (
        <SpeakingForm part={part} form={form} set={set} />
      ) : (
        <ReadingListeningForm module={module} form={form} set={set} firstNumbers={firstNumbers} />
      )}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Reset to the default content?"
        confirmLabel="Reset"
        destructive
        onConfirm={() => {
          setEntries((list) => list.filter((e) => entryKey(e) !== key));
          toast({ title: "Reset to default", variant: "success" });
          navigate(back);
        }}
      />
    </div>
  );
}
