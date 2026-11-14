import { useEffect, useMemo, useRef, useState } from "react";
import { Save, Undo2, Download, Upload, Trash2, Database, ShieldAlert } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { FormField, SimpleSelect, SectionTitle } from "@/components/common/misc";
import { Input, Switch, Label, Badge } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/overlays";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { resetAllData, STORES } from "@/utils/storage";
import { downloadContentExport, validateContent, applyContentImport, readJsonFile } from "@/utils/contentSync";
import { BAND_OPTIONS, MODULES } from "@/utils/constants";
import { isValidEmail } from "@/utils/format";

const clone = (v) => JSON.parse(JSON.stringify(v));
const TIMEZONES = ["UTC", "Europe/London", "Asia/Dhaka", "Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "America/New_York", "America/Sao_Paulo", "Australia/Sydney"];
const NOTIFS = [
  { key: "newRegistrations", label: "New student registrations", hint: "Notify when a student creates an account" },
  { key: "weeklyReport", label: "Weekly performance report", hint: "Summary of activity every Monday" },
  { key: "inactiveStudents", label: "Inactive student alerts", hint: "Students inactive for more than 14 days" },
  { key: "contentPublished", label: "Content published", hint: "When days, tests or mock tests are published" },
  { key: "systemAlerts", label: "System alerts", hint: "Storage and data integrity warnings" },
];

function Row({ label, hint, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useStore("settings");
  const toast = useToast();
  const fileRef = useRef(null);
  const [draft, setDraft] = useState(() => clone(settings));
  const [errors, setErrors] = useState({});
  const [confirmReset, setConfirmReset] = useState(false);
  const [importState, setImportState] = useState(null);

  useEffect(() => setDraft(clone(settings)), [settings]);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(settings), [draft, settings]);
  const setIn = (section, key, value) => setDraft((d) => ({ ...d, [section]: { ...d[section], [key]: value } }));

  const storageKB = useMemo(() => {
    try {
      return Math.round(Object.values(STORES).reduce((n, s) => n + (localStorage.getItem(s.key)?.length || 0), 0) / 1024);
    } catch {
      return 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, confirmReset]);

  const save = () => {
    const e = {};
    if (draft.profile.name.trim().length < 2) e.name = "Name is required.";
    if (!isValidEmail(draft.profile.email)) e.email = "Enter a valid email.";
    if (draft.platform.name.trim().length < 2) e.platformName = "Platform name is required.";
    if (!isValidEmail(draft.platform.supportEmail)) e.supportEmail = "Enter a valid support email.";
    const t = Number(draft.studyPlan.tasksRequiredPerDay);
    if (!Number.isInteger(t) || t < 1 || t > 4) e.tasks = "Must be between 1 and 4.";
    MODULES.forEach((m) => {
      const v = Number(draft.studyPlan.defaultDurations[m.key]);
      if (!Number.isFinite(v) || v < 5 || v > 240) e.durations = "Durations must be 5–240 minutes.";
    });
    setErrors(e);
    if (Object.keys(e).length) {
      toast({ title: "Settings not saved", description: Object.values(e)[0], variant: "error" });
      return;
    }
    setSettings({
      ...draft,
      studyPlan: { ...draft.studyPlan, tasksRequiredPerDay: t, defaultDurations: Object.fromEntries(MODULES.map((m) => [m.key, Number(draft.studyPlan.defaultDurations[m.key])])) },
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
            <Button variant="secondary" onClick={() => { setDraft(clone(settings)); setErrors({}); }} disabled={!dirty}><Undo2 /> Discard</Button>
            <Button onClick={save} disabled={!dirty}><Save /> Save settings</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface p-5">
          <SectionTitle>Admin profile</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Name" required error={errors.name}>
              <Input value={draft.profile.name} onChange={(e) => setIn("profile", "name", e.target.value)} className={errors.name && "border-destructive"} />
            </FormField>
            <FormField label="Email" required error={errors.email}>
              <Input type="email" value={draft.profile.email} onChange={(e) => setIn("profile", "email", e.target.value)} className={errors.email && "border-destructive"} />
            </FormField>
            <FormField label="Role">
              <SimpleSelect value={draft.profile.role} onValueChange={(v) => setIn("profile", "role", v)} options={["Super Admin", "Content Editor", "Support"]} />
            </FormField>
            <FormField label="Timezone">
              <SimpleSelect value={draft.profile.timezone} onValueChange={(v) => setIn("profile", "timezone", v)} options={TIMEZONES} />
            </FormField>
          </div>
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-subtle p-3 text-xs text-muted-foreground">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Sign-in uses fixed demo credentials (admin@example.com / admin123). Profile changes here do not change the login — this is demonstration authentication only.
          </p>
        </section>

        <section className="surface p-5">
          <SectionTitle>Platform</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Platform name" required error={errors.platformName}>
              <Input value={draft.platform.name} onChange={(e) => setIn("platform", "name", e.target.value)} className={errors.platformName && "border-destructive"} />
            </FormField>
            <FormField label="Support email" required error={errors.supportEmail}>
              <Input type="email" value={draft.platform.supportEmail} onChange={(e) => setIn("platform", "supportEmail", e.target.value)} className={errors.supportEmail && "border-destructive"} />
            </FormField>
            <FormField label="Default target band" hint="Pre-selected for new students">
              <SimpleSelect value={draft.platform.defaultTargetBand} onValueChange={(v) => setIn("platform", "defaultTargetBand", v)} options={BAND_OPTIONS} />
            </FormField>
          </div>
          <div className="mt-4">
            <Row label="Maintenance mode" hint="Mock flag — shows a maintenance banner to students when exported">
              <Switch checked={draft.platform.maintenanceMode} onCheckedChange={(v) => setIn("platform", "maintenanceMode", v)} />
            </Row>
          </div>
        </section>

        <section className="surface p-5">
          <SectionTitle>Study plan & daily tasks</SectionTitle>
          <Row label="Allow access to future days" hint="Included in the content export; the website uses it to unlock days ahead of schedule">
            <Switch checked={draft.studyPlan.allowFutureDays} onCheckedChange={(v) => setIn("studyPlan", "allowFutureDays", v)} />
          </Row>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField label="Unlock mode">
              <SimpleSelect
                value={draft.studyPlan.unlockMode}
                onValueChange={(v) => setIn("studyPlan", "unlockMode", v)}
                options={[{ value: "sequential", label: "Sequential (complete previous day)" }, { value: "calendar", label: "Calendar (one day per date)" }, { value: "open", label: "Open (all days)" }]}
              />
            </FormField>
            <FormField label="Tasks required per day" error={errors.tasks} hint="Tasks needed to mark a day complete">
              <Input type="number" min={1} max={4} value={draft.studyPlan.tasksRequiredPerDay} onChange={(e) => setIn("studyPlan", "tasksRequiredPerDay", e.target.value)} className={errors.tasks && "border-destructive"} />
            </FormField>
          </div>
          <p className="mb-2 mt-5 text-sm font-medium">Default task durations (minutes)</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MODULES.map((m) => (
              <FormField key={m.key} label={m.label}>
                <Input type="number" min={5} max={240} value={draft.studyPlan.defaultDurations[m.key]} onChange={(e) => setIn("studyPlan", "defaultDurations", { ...draft.studyPlan.defaultDurations, [m.key]: e.target.value })} />
              </FormField>
            ))}
          </div>
          {errors.durations && <p className="mt-2 text-xs text-destructive">{errors.durations}</p>}
          <p className="mt-2 text-xs text-muted-foreground">Used as defaults when creating new tasks in the day editor.</p>
        </section>

        <section className="surface p-5">
          <SectionTitle>Notifications <span className="ml-1 text-xs font-normal text-muted-foreground">(mock)</span></SectionTitle>
          {NOTIFS.map((n) => (
            <Row key={n.key} label={n.label} hint={n.hint}>
              <Switch checked={!!draft.notifications[n.key]} onCheckedChange={(v) => setIn("notifications", n.key, v)} aria-label={n.label} />
            </Row>
          ))}
          <Button variant="secondary" size="sm" className="mt-3" onClick={() => toast({ title: "Test notification", description: `Mock email sent to ${settings.profile.email}.`, variant: "success" })}>
            Send test notification
          </Button>
        </section>

        <section className="surface p-5 lg:col-span-2">
          <SectionTitle>Data management</SectionTitle>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <Database className="h-4 w-4" />
              <p className="mt-3 text-sm font-semibold">Local storage</p>
              <p className="mt-1 text-xs text-muted-foreground">All admin data is stored in this browser under <code className="font-mono">ieltsora_admin_*</code> keys ({storageKB} KB).</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-semibold">Content sync</p>
              <p className="mt-1 text-xs text-muted-foreground">Send the study plan and homepage to the website as a JSON file.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => { downloadContentExport(); toast({ title: "Content exported", variant: "success" }); }}><Download /> Export</Button>
                <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={onImport} />
                <Button size="sm" variant="secondary" onClick={() => fileRef.current?.click()}><Upload /> Import</Button>
              </div>
            </div>
            <div className="rounded-lg border border-red-700/30 bg-red-50/40 p-4">
              <p className="text-sm font-semibold text-red-800">Reset all data</p>
              <p className="mt-1 text-xs text-muted-foreground">Restore all demo data. You stay signed in.</p>
              <Button size="sm" variant="destructive" className="mt-3" onClick={() => setConfirmReset(true)}><Trash2 /> Reset everything</Button>
            </div>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset all admin data?"
        description="Every change you have made will be lost and the original demo data restored. This cannot be undone."
        confirmLabel="Reset all data"
        destructive
        onConfirm={() => {
          resetAllData();
          toast({ title: "All data reset", description: "Demo data restored.", variant: "success" });
        }}
      />

      <Dialog open={!!importState} onOpenChange={(o) => !o && setImportState(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import content</DialogTitle>
            <DialogDescription>{importState?.name}</DialogDescription>
          </DialogHeader>
          {importState?.errors.length ? (
            <ul className="list-disc border border-red-700 bg-red-50 p-3 pl-7 text-xs text-red-800">{importState.errors.map((e) => <li key={e}>{e}</li>)}</ul>
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
