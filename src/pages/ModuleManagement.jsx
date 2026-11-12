import { useEffect, useMemo, useState } from "react";
import { Save, Undo2, RotateCcw, BookOpen, Headphones, PenLine, Mic, EyeOff } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { FormField, SectionTitle } from "@/components/common/misc";
import ListEditor from "@/components/forms/ListEditor";
import { Input, Textarea, Switch, Label, Badge } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/overlays";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { resetStore } from "@/utils/storage";
import { MODULE_COLORS } from "@/utils/constants";
import { cn } from "@/lib/utils";

const ICONS = { reading: BookOpen, listening: Headphones, writing: PenLine, speaking: Mic };
const clone = (v) => JSON.parse(JSON.stringify(v));

export default function ModuleManagement() {
  const [modules, setModules] = useStore("modules");
  const [questions] = useStore("questions");
  const toast = useToast();
  const [activeKey, setActiveKey] = useState("reading");
  const stored = modules.find((m) => m.key === activeKey) || modules[0];
  const [draft, setDraft] = useState(() => clone(stored));
  const [errors, setErrors] = useState({});
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setDraft(clone(stored));
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, modules]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(stored), [draft, stored]);

  const save = () => {
    const next = {};
    if (draft.name.trim().length < 2) next.name = "Name is required.";
    if (draft.description.trim().length < 10) next.description = "Description must be at least 10 characters.";
    if (draft.instructions.trim().length < 10) next.instructions = "Instructions must be at least 10 characters.";
    if (!draft.categories.length) next.categories = "Add at least one practice category.";
    setErrors(next);
    if (Object.keys(next).length) {
      toast({ title: "Module not saved", description: Object.values(next)[0], variant: "error" });
      return;
    }
    setModules((list) => list.map((m) => (m.key === draft.key ? { ...draft, name: draft.name.trim(), description: draft.description.trim(), instructions: draft.instructions.trim() } : m)));
    toast({ title: `${draft.name} saved`, variant: "success" });
  };

  const quickToggle = (m) => {
    setModules((list) => list.map((x) => (x.key === m.key ? { ...x, visible: !x.visible } : x)));
    toast({ title: `${m.name} ${m.visible ? "hidden from" : "visible to"} students`, variant: "success" });
  };

  const switchTo = (key) => {
    if (dirty && !window.confirm("Discard unsaved changes to this module?")) return;
    setActiveKey(key);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Modules"
        description="Manage the four IELTS modules — visibility, descriptions, student instructions and practice categories."
        actions={<Button variant="secondary" onClick={() => setConfirmReset(true)}><RotateCcw /> Reset modules</Button>}
      />

      <div className="tiles sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((m) => {
          const Icon = ICONS[m.key];
          const qCount = questions.filter((q) => q.module === m.key).length;
          return (
            <div key={m.key} className={cn("flex flex-col p-5", activeKey === m.key && "!bg-subtle")}>
              <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${MODULE_COLORS[m.key]}1A`, color: MODULE_COLORS[m.key] }}><Icon className="h-4 w-4" /></span>
                <Switch checked={m.visible} onCheckedChange={() => quickToggle(m)} aria-label={`Toggle ${m.name} visibility`} />
              </div>
              <p className="mt-4 font-semibold">{m.name}</p>
              <p className="mt-1 line-clamp-2 flex-1 text-xs text-muted-foreground">{m.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <Badge variant={m.visible ? "success" : "muted"}>{m.visible ? "Visible" : "Hidden"}</Badge>
                <span className="text-muted-foreground">{m.categories.length} categories{m.key === "reading" || m.key === "listening" ? ` · ${qCount} questions` : ""}</span>
              </div>
              <Button variant={activeKey === m.key ? "default" : "secondary"} size="sm" className="mt-4" onClick={() => switchTo(m.key)}>
                {activeKey === m.key ? "Editing" : "Edit module"}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="surface p-5">
          <SectionTitle
            action={
              <div className="flex gap-2">
                {dirty && <Badge variant="warning">Unsaved</Badge>}
                <Button size="sm" variant="secondary" onClick={() => setDraft(clone(stored))} disabled={!dirty}><Undo2 /> Discard</Button>
                <Button size="sm" onClick={save} disabled={!dirty}><Save /> Save</Button>
              </div>
            }
          >
            Edit {stored.name}
          </SectionTitle>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <FormField label="Display name" required error={errors.name}>
                <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={errors.name && "border-destructive"} />
              </FormField>
              <div className="flex h-10 items-center gap-3 rounded-lg border border-border px-3">
                <Label htmlFor="mod-vis">Visible to students</Label>
                <Switch id="mod-vis" checked={draft.visible} onCheckedChange={(v) => setDraft({ ...draft, visible: v })} />
              </div>
            </div>
            <FormField label="Description" required error={errors.description}>
              <Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={errors.description && "border-destructive"} />
            </FormField>
            <FormField label="Student instructions" required error={errors.instructions} hint="Shown at the start of every practice session in this module.">
              <Textarea value={draft.instructions} onChange={(e) => setDraft({ ...draft, instructions: e.target.value })} className={cn("min-h-[110px]", errors.instructions && "border-destructive")} />
            </FormField>
            <FormField label="Practice categories" required error={errors.categories}>
              <ListEditor items={draft.categories} onChange={(v) => setDraft({ ...draft, categories: v })} placeholder="Add a category, e.g. Matching Headings" addLabel="Add" />
            </FormField>
          </div>
        </div>

        <aside className="surface h-fit overflow-hidden">
          <p className="label-xs border-b border-border px-5 py-3">Student preview</p>
          <div className={cn("p-5", !draft.visible && "opacity-50")}>
            {!draft.visible && <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium"><EyeOff className="h-3.5 w-3.5" /> Hidden from students</p>}
            <h3 className="text-lg font-semibold">{draft.name || "Module"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{draft.description}</p>
            <div className="mt-4 rounded-lg bg-subtle p-3 text-sm">{draft.instructions}</div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {draft.categories.map((c, i) => <span key={i} className="rounded bg-black/[0.05] px-2.5 py-1 text-xs">{c}</span>)}
            </div>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset all modules?"
        description="Visibility, descriptions, instructions and categories for all four modules will return to their defaults."
        confirmLabel="Reset modules"
        destructive
        onConfirm={() => {
          resetStore("modules");
          toast({ title: "Modules reset", variant: "success" });
        }}
      />
    </div>
  );
}
