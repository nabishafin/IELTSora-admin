import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Eye, Pencil, Plus, Save, Trash2, Undo2, RotateCcw, AlertTriangle, CalendarX, Clock } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { FormField, SimpleSelect, ModuleBadge, DifficultyBadge, EmptyState, SectionTitle } from "@/components/common/misc";
import DayPreview, { missingModules, sourceLabel, vocabIssues } from "@/components/common/DayPreview";
import ListEditor from "@/components/forms/ListEditor";
import TaskForm from "@/components/forms/TaskForm";
import VocabularyEditor from "@/components/forms/VocabularyEditor";
import { getDayVocabulary } from "@/data/vocabulary";
import { Input, Switch, Label, Badge } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/overlays";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { getDefaultDay } from "@/data/mockStudyPlan";
import { PHASES, TOTAL_DAYS, MODULE_KEYS } from "@/utils/constants";
import { uid } from "@/utils/random";

const clone = (v) => JSON.parse(JSON.stringify(v));

export default function DayManagement() {
  const { day: dayParam } = useParams();
  const dayNo = Number(dayParam);
  const navigate = useNavigate();
  const toast = useToast();
  const [plan, setPlan] = useStore("studyPlan");
  const [settings] = useStore("settings");
  const stored = plan.find((d) => d.day === dayNo);

  const [draft, setDraft] = useState(() => (stored ? clone(stored) : null));
  const [errors, setErrors] = useState({});
  const [taskDialog, setTaskDialog] = useState(null); // { index } | { index: -1, module }
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);
  const [confirmRestore, setConfirmRestore] = useState(false);

  useEffect(() => {
    setDraft(stored ? clone(stored) : null);
    setErrors({});
    // reload only when the day changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayNo]);

  const dirty = useMemo(() => draft && stored && JSON.stringify(draft) !== JSON.stringify(stored), [draft, stored]);

  if (!stored || !draft) {
    return (
      <div>
        <PageHeader title={`Day ${dayParam}`} back={{ to: "/study-plan", label: "Back to study plan" }} />
        <EmptyState icon={CalendarX} title="This day does not exist" description={`The study plan has ${plan.length} days.`} action={<Button asChild><Link to="/study-plan">View all days</Link></Button>} />
      </div>
    );
  }

  const setField = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const missing = missingModules(draft);
  const vIssues = vocabIssues(draft.vocabulary);
  const totalMins = draft.tasks.reduce((n, t) => n + (Number(t.duration) || 0), 0);

  const go = (to) => (dirty ? setPendingNav(to) : navigate(to));

  const moveTask = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= draft.tasks.length) return;
    const tasks = [...draft.tasks];
    [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
    setField("tasks", tasks);
  };

  const saveTask = (values) => {
    if (taskDialog.index === -1) {
      const id = draft.tasks.some((t) => t.id === `d${dayNo}-${values.module}`) ? `d${dayNo}-${values.module}-${uid("t").slice(-5)}` : `d${dayNo}-${values.module}`;
      setField("tasks", [...draft.tasks, { id, ...values }]);
      toast({ title: "Task added", description: "Remember to save the day to keep your changes." });
    } else {
      setField("tasks", draft.tasks.map((t, i) => (i === taskDialog.index ? { ...t, ...values } : t)));
      toast({ title: "Task updated", description: "Remember to save the day to keep your changes." });
    }
    setTaskDialog(null);
  };

  const save = () => {
    const next = {};
    if (draft.title.trim().length < 3) next.title = "Day title must be at least 3 characters.";
    if (!draft.objectives.length) next.objectives = "Add at least one learning objective.";
    if (draft.published && missing.length) next.tasks = `A published day needs all four module tasks. Missing: ${missing.join(", ")}. Add them or unpublish the day.`;
    if (!draft.tasks.length) next.tasks = "Add at least one task.";
    if (draft.published && vIssues.length) next.vocabulary = `A published day needs exactly 20 complete, unique vocabulary words. ${vIssues[0]} Fix the list or unpublish the day.`;
    setErrors(next);
    if (Object.keys(next).length) {
      toast({ title: "Day not saved", description: Object.values(next)[0], variant: "error" });
      return;
    }
    const vocabulary = draft.vocabulary
      ? {
          theme: String(draft.vocabulary.theme || "").trim(),
          words: (draft.vocabulary.words || [])
            .map((w) => ({ word: String(w.word || "").trim(), pos: w.pos || "noun", meaning: String(w.meaning || "").trim(), example: String(w.example || "").trim() }))
            .filter((w) => w.word || w.meaning || w.example),
        }
      : null;
    const clean = { ...draft, title: draft.title.trim(), objectives: draft.objectives.map((o) => o.trim()).filter(Boolean), vocabulary };
    setPlan((list) => list.map((d) => (d.day === dayNo ? clean : d)));
    setDraft(clone(clean));
    toast({ title: `Day ${dayNo} saved`, description: missing.length || vIssues.length ? `Saved as unpublished. ${missing.length ? `Missing: ${missing.join(", ")}. ` : ""}${vIssues[0] || ""}` : "All changes are stored locally.", variant: "success" });
  };

  const resetVocabulary = () => {
    setField("vocabulary", getDayVocabulary(dayNo) || { theme: "", words: [] });
    toast({ title: "Default words loaded", description: "Review and save the day to apply them." });
  };

  const restoreDefault = () => {
    const def = getDefaultDay(dayNo);
    if (def) {
      setDraft(def);
      toast({ title: "Default content loaded", description: "Review and save to apply it." });
    }
  };

  const nextModuleToAdd = MODULE_KEYS.find((m) => missing.includes(m)) || "reading";

  return (
    <div>
      <PageHeader
        back={{ to: "/study-plan", label: "Back to study plan" }}
        eyebrow={`Day ${String(dayNo).padStart(2, "0")} of ${TOTAL_DAYS} · ${draft.phase}`}
        title={draft.title || "Untitled day"}
        description={
          <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {Math.floor(totalMins / 60)}h {totalMins % 60}m estimated</span>
            <span>{draft.tasks.length} tasks</span>
            {dirty && <Badge variant="warning">Unsaved changes</Badge>}
          </span>
        }
        actions={
          <>
            <Button variant="secondary" size="icon" onClick={() => go(`/study-plan/${dayNo - 1}`)} disabled={dayNo <= 1} aria-label="Previous day"><ChevronLeft /></Button>
            <Button variant="secondary" size="icon" onClick={() => go(`/study-plan/${dayNo + 1}`)} disabled={dayNo >= plan.length} aria-label="Next day"><ChevronRight /></Button>
            <Button variant="secondary" onClick={() => setPreviewOpen(true)}><Eye /> Preview</Button>
            <Button variant="secondary" onClick={() => setDraft(clone(stored))} disabled={!dirty}><Undo2 /> Discard</Button>
            <Button onClick={save} disabled={!dirty}><Save /> Save day</Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="order-2 xl:order-1">
          <SectionTitle
            action={
              <Button size="sm" onClick={() => setTaskDialog({ index: -1, module: nextModuleToAdd })}>
                <Plus /> Create task
              </Button>
            }
          >
            Module tasks
          </SectionTitle>
          {(missing.length > 0 || errors.tasks) && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-600/30 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                {errors.tasks || `Each day requires four module tasks. Missing: ${missing.join(", ")}.`}
                {missing.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {missing.map((m) => (
                      <Button key={m} size="sm" variant="secondary" onClick={() => setTaskDialog({ index: -1, module: m })}><Plus /> Add {m}</Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {draft.tasks.length === 0 ? (
            <EmptyState title="No tasks yet" description="Create a Reading, Listening, Writing and Speaking task for this day." action={<Button onClick={() => setTaskDialog({ index: -1, module: "reading" })}><Plus /> Create task</Button>} />
          ) : (
            <ol className="tiles">
              {draft.tasks.map((t, i) => (
                <li key={t.id} className="flex flex-col gap-3 bg-white p-4 sm:flex-row sm:items-start">
                  <div className="flex items-center gap-2 sm:w-28 sm:flex-col sm:items-start">
                    <span className="text-xs tabular-nums text-muted-foreground">Task {i + 1}</span>
                    <ModuleBadge module={t.module} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug">{t.title}</p>
                    {sourceLabel(t.source, t.module) && <p className="mt-0.5 text-xs text-muted-foreground">Source: {sourceLabel(t.source, t.module)}</p>}
                    <ul className="mt-2 grid gap-0.5 text-sm text-muted-foreground">
                      {t.steps.map((s, k) => <li key={k}>{k + 1}. {s}</li>)}
                    </ul>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <DifficultyBadge difficulty={t.difficulty} />
                      <Badge variant="outline">{t.duration} min</Badge>
                      {t.practice && <Badge variant="muted">Linked practice</Badge>}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-0.5 self-end sm:self-start">
                    <Button variant="ghost" size="icon" onClick={() => moveTask(i, -1)} disabled={i === 0} aria-label="Move up"><ArrowUp /></Button>
                    <Button variant="ghost" size="icon" onClick={() => moveTask(i, 1)} disabled={i === draft.tasks.length - 1} aria-label="Move down"><ArrowDown /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setTaskDialog({ index: i })} aria-label="Edit task"><Pencil /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteIdx(i)} aria-label="Delete task"><Trash2 /></Button>
                  </div>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-6">
            {errors.vocabulary && (
              <p className="mb-3 rounded-lg border border-red-700/30 bg-red-50 px-3 py-2 text-sm text-red-800">{errors.vocabulary}</p>
            )}
            <VocabularyEditor vocabulary={draft.vocabulary} onChange={(v) => setField("vocabulary", v)} onReset={resetVocabulary} highlight={!!errors.vocabulary} />
          </div>
        </div>

        <aside className="surface order-1 grid content-start gap-4 p-5 xl:order-2">
          <SectionTitle>Day details</SectionTitle>
          <FormField label="Day title" htmlFor="d-title" required error={errors.title}>
            <Input id="d-title" value={draft.title} onChange={(e) => setField("title", e.target.value)} className={errors.title && "border-destructive"} />
          </FormField>
          <FormField label="Phase" htmlFor="d-phase" hint="Defaults: Day 1–20 Foundation, 21–40 Skill Development, 41–60 Exam Preparation">
            <SimpleSelect id="d-phase" value={draft.phase} onValueChange={(v) => setField("phase", v)} options={PHASES.map((p) => p.name)} />
          </FormField>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="d-pub">Published</Label>
              <p className="mt-0.5 text-xs text-muted-foreground">Visible to students in the daily plan</p>
            </div>
            <Switch id="d-pub" checked={draft.published} onCheckedChange={(v) => setField("published", v)} />
          </div>
          <FormField label="Learning objectives" required error={errors.objectives}>
            <ListEditor items={draft.objectives} onChange={(v) => setField("objectives", v)} placeholder="Add an objective" multiline={false} />
          </FormField>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => setConfirmRestore(true)}><RotateCcw /> Load default content for this day</Button>
        </aside>
      </div>

      <TaskForm
        open={!!taskDialog}
        onOpenChange={(o) => !o && setTaskDialog(null)}
        initial={taskDialog && taskDialog.index >= 0 ? draft.tasks[taskDialog.index] : null}
        defaultModule={taskDialog?.module || "reading"}
        defaultDurations={settings.studyPlan?.defaultDurations || {}}
        onSubmit={saveTask}
      />

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Student preview</DialogTitle>
            <DialogDescription>Preview of the current draft{dirty ? " (unsaved)" : ""}.</DialogDescription>
          </DialogHeader>
          <DayPreview day={draft} />
          <DialogFooter><Button variant="secondary" onClick={() => setPreviewOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteIdx !== null}
        onOpenChange={(o) => !o && setDeleteIdx(null)}
        title="Delete this task?"
        description={deleteIdx !== null ? `"${draft.tasks[deleteIdx]?.title}" will be removed from Day ${dayNo} when you save.` : ""}
        confirmLabel="Delete task"
        destructive
        onConfirm={() => setField("tasks", draft.tasks.filter((_, i) => i !== deleteIdx))}
      />
      <ConfirmDialog
        open={!!pendingNav}
        onOpenChange={(o) => !o && setPendingNav(null)}
        title="Discard unsaved changes?"
        description="You have unsaved edits on this day. Leaving now will discard them."
        confirmLabel="Discard and continue"
        destructive
        onConfirm={() => navigate(pendingNav)}
      />
      <ConfirmDialog
        open={confirmRestore}
        onOpenChange={setConfirmRestore}
        title="Load default content?"
        description="The draft will be replaced with the original content for this day. Nothing is saved until you click Save day."
        confirmLabel="Load default"
        onConfirm={restoreDefault}
      />
    </div>
  );
}
