import { useEffect, useMemo, useRef, useState } from "react";
import { Save, Undo2, Download, Upload, Trash2, Database } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { FormField, SectionTitle } from "@/components/common/misc";
import { Input, Switch, Badge } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/overlays";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { resetAllData, STORES } from "@/utils/storage";
import { downloadContentExport, validateContent, applyContentImport, readJsonFile } from "@/utils/contentSync";
import { MODULES } from "@/utils/constants";

const clone = (v) => JSON.parse(JSON.stringify(v));

export default function Settings() {
  const [settings, setSettings] = useStore("settings");
  const toast = useToast();
  const fileRef = useRef(null);
  const [draft, setDraft] = useState(() => clone(settings));
  const [error, setError] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [importState, setImportState] = useState(null);

  useEffect(() => setDraft(clone(settings)), [settings]);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(settings), [draft, settings]);
  const setPlan = (key, value) => setDraft((d) => ({ ...d, studyPlan: { ...d.studyPlan, [key]: value } }));

  const storageKB = useMemo(() => {
    try {
      return Math.round(Object.values(STORES).reduce((n, s) => n + (localStorage.getItem(s.key)?.length || 0), 0) / 1024);
    } catch {
      return 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, confirmReset]);

  const save = () => {
    const bad = MODULES.some((m) => {
      const v = Number(draft.studyPlan.defaultDurations[m.key]);
      return !Number.isFinite(v) || v < 5 || v > 240;
    });
    if (bad) {
      setError("Durations must be 5–240 minutes.");
      toast({ title: "Settings not saved", description: "Durations must be 5–240 minutes.", variant: "error" });
      return;
    }
    setError("");
    setSettings({
      ...draft,
      studyPlan: { ...draft.studyPlan, defaultDurations: Object.fromEntries(MODULES.map((m) => [m.key, Number(draft.studyPlan.defaultDurations[m.key])])) },
    });
    toast({ title: "Settings saved", variant: "success" });
  };

  const onImport = async (ev) => {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    try {
      const data = await readJsonFile(file);
      setImportState({ data, errors: validateContent(data), name: file.name });
    } catch (err) {
      toast({ title: "Import failed", description: err.message, variant: "error" });
    }
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        actions={
          <>
            {dirty && <Badge variant="warning">Unsaved changes</Badge>}
            <Button variant="secondary" onClick={() => { setDraft(clone(settings)); setError(""); }} disabled={!dirty}><Undo2 /> Discard</Button>
            <Button onClick={save} disabled={!dirty}><Save /> Save settings</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface p-5">
          <SectionTitle>60-day plan</SectionTitle>
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-sm font-medium">Open all days</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Students can open any day instead of unlocking them in order.</p>
            </div>
            <Switch checked={draft.studyPlan.allowFutureDays} onCheckedChange={(v) => setPlan("allowFutureDays", v)} />
          </div>
          <p className="mb-2 mt-4 text-sm font-medium">Default task durations (minutes)</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MODULES.map((m) => (
              <FormField key={m.key} label={m.label}>
                <Input type="number" min={5} max={240} value={draft.studyPlan.defaultDurations[m.key]} onChange={(e) => setPlan("defaultDurations", { ...draft.studyPlan.defaultDurations, [m.key]: e.target.value })} />
              </FormField>
            ))}
          </div>
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </section>

        <section className="surface p-5">
          <SectionTitle>Data</SectionTitle>
          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-semibold">Send to website</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Export a JSON file, then import it in the website's Settings.</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="secondary" onClick={() => { downloadContentExport(); toast({ title: "Content exported", variant: "success" }); }}><Download /> Export</Button>
                <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={onImport} />
                <Button size="sm" variant="ghost" onClick={() => fileRef.current?.click()}><Upload /> Import</Button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-red-700/30 bg-red-50/40 p-4">
              <div>
                <p className="text-sm font-semibold text-red-800">Reset all data</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Database className="h-3 w-3" /> {storageKB} KB stored in this browser</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => setConfirmReset(true)}><Trash2 /> Reset</Button>
            </div>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset all admin data?"
        description="The plan, homepage and settings return to the defaults. This cannot be undone."
        confirmLabel="Reset all data"
        destructive
        onConfirm={() => {
          resetAllData();
          toast({ title: "All data reset", variant: "success" });
        }}
      />

      <Dialog open={!!importState} onOpenChange={(o) => !o && setImportState(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import content</DialogTitle>
            <DialogDescription>{importState?.name}</DialogDescription>
          </DialogHeader>
          {importState?.errors.length ? (
            <ul className="list-disc rounded-lg border border-red-700 bg-red-50 p-3 pl-7 text-xs text-red-800">{importState.errors.map((e) => <li key={e}>{e}</li>)}</ul>
          ) : (
            <p className="text-sm text-muted-foreground">Replace the study plan and homepage with this file's content?</p>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setImportState(null)}>Cancel</Button>
            <Button
              disabled={!!importState?.errors.length}
              onClick={() => {
                applyContentImport(importState.data);
                setImportState(null);
                toast({ title: "Content imported", variant: "success" });
              }}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
