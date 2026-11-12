import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Download, Upload, RotateCcw, LayoutGrid, List, CalendarX, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { SearchInput, SimpleSelect, EmptyState, StatusDot, ModuleBadge, StatCard } from "@/components/common/misc";
import DayPreview, { missingModules } from "@/components/common/DayPreview";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, Switch } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/overlays";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { PHASES } from "@/utils/constants";
import { resetStore } from "@/utils/storage";
import { downloadContentExport, validateContent, applyContentImport, readJsonFile } from "@/utils/contentSync";
import { cn } from "@/lib/utils";

const totalMinutes = (d) => d.tasks.reduce((n, t) => n + (Number(t.duration) || 0), 0);
const fmtMins = (m) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;

export default function StudyPlanManagement() {
  const [plan, setPlan] = useStore("studyPlan");
  const toast = useToast();
  const fileRef = useRef(null);
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState("all");
  const [status, setStatus] = useState("all");
  const [view, setView] = useState("grid");
  const [preview, setPreview] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [bulk, setBulk] = useState(null); // { phase, published }
  const [importState, setImportState] = useState(null); // { data, errors, fileName }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return plan.filter((d) => {
      if (phase !== "all" && d.phase !== phase) return false;
      if (status === "published" && !d.published) return false;
      if (status === "draft" && d.published) return false;
      if (status === "incomplete" && missingModules(d).length === 0) return false;
      if (!q) return true;
      return String(d.day) === q || d.title.toLowerCase().includes(q) || d.tasks.some((t) => t.title.toLowerCase().includes(q));
    });
  }, [plan, query, phase, status]);

  const published = plan.filter((d) => d.published).length;
  const incomplete = plan.filter((d) => missingModules(d).length > 0).length;
  const avgMins = plan.length ? Math.round(plan.reduce((n, d) => n + totalMinutes(d), 0) / plan.length) : 0;

  const togglePublish = (day) => {
    const target = plan.find((d) => d.day === day);
    setPlan((list) => list.map((d) => (d.day === day ? { ...d, published: !d.published } : d)));
    toast({ title: target.published ? `Day ${day} unpublished` : `Day ${day} published`, variant: "success" });
  };

  const applyBulk = () => {
    const p = PHASES.find((x) => x.name === bulk.phase);
    setPlan((list) => list.map((d) => (!p || (d.day >= p.start && d.day <= p.end) ? { ...d, published: bulk.published } : d)));
    toast({ title: `${bulk.phase === "all" ? "All days" : bulk.phase} ${bulk.published ? "published" : "unpublished"}`, variant: "success" });
  };

  const onImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const data = await readJsonFile(file);
      setImportState({ data, errors: validateContent(data), fileName: file.name });
    } catch (err) {
      toast({ title: "Import failed", description: err.message, variant: "error" });
    }
  };

  const confirmImport = () => {
    applyContentImport(importState.data);
    toast({ title: "Content imported", description: `${importState.data.studyPlan.length} days and homepage content applied.`, variant: "success" });
    setImportState(null);
  };

  const exportNow = () => {
    const data = downloadContentExport();
    toast({ title: "Content exported", description: `${data.studyPlan.length} days + homepage saved as JSON. Import it in the student website's Settings.`, variant: "success" });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="60-Day study plan"
        description="Manage all 60 preparation days. Every day must contain one Reading, Listening, Writing and Speaking task."
        actions={
          <>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImportFile} />
            <Button variant="secondary" onClick={() => fileRef.current?.click()}><Upload /> Import</Button>
            <Button variant="secondary" onClick={exportNow}><Download /> Export content</Button>
            <Button variant="secondary" onClick={() => setConfirmReset(true)}><RotateCcw /> Reset</Button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 tiles lg:grid-cols-4">
        <StatCard className="rounded-none border-0 shadow-none" label="Days" value={plan.length} hint="Across three phases" />
        <StatCard className="rounded-none border-0 shadow-none" label="Published" value={`${published}/${plan.length}`} hint={`${plan.length - published} unpublished`} />
        <StatCard className="rounded-none border-0 shadow-none" label="Total tasks" value={plan.reduce((n, d) => n + d.tasks.length, 0)} hint={incomplete ? `${incomplete} day(s) missing a module` : "All days have four modules"} />
        <StatCard className="rounded-none border-0 shadow-none" label="Avg. study time" value={fmtMins(avgMins)} hint="Per day" />
      </div>

      <div className="mb-6 tiles md:grid-cols-3">
        {PHASES.map((p) => {
          const days = plan.filter((d) => d.day >= p.start && d.day <= p.end);
          const pub = days.filter((d) => d.published).length;
          return (
            <div key={p.name} className="bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="label-xs">Day {p.start}–{p.end}</p>
                  <p className="mt-1 font-semibold">{p.name}</p>
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">{pub}/{days.length} live</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{p.description}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setBulk({ phase: p.name, published: true })} disabled={pub === days.length}>Publish all</Button>
                <Button size="sm" variant="ghost" onClick={() => setBulk({ phase: p.name, published: false })} disabled={pub === 0}>Unpublish all</Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_200px_180px_auto]">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by day number, title or task…" />
        <SimpleSelect value={phase} onValueChange={setPhase} options={[{ value: "all", label: "All phases" }, ...PHASES.map((p) => p.name)]} />
        <SimpleSelect value={status} onValueChange={setStatus} options={[{ value: "all", label: "All statuses" }, { value: "published", label: "Published" }, { value: "draft", label: "Unpublished" }, { value: "incomplete", label: "Missing modules" }]} />
        <div className="flex rounded-lg bg-black/[0.05] p-0.5">
          <button onClick={() => setView("grid")} className={cn("flex h-8 w-9 items-center justify-center rounded-md transition-colors", view === "grid" ? "bg-white text-ink shadow-xs" : "text-muted-foreground hover:text-ink")} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></button>
          <button onClick={() => setView("table")} className={cn("flex h-8 w-9 items-center justify-center rounded-md transition-colors", view === "table" ? "bg-white text-ink shadow-xs" : "text-muted-foreground hover:text-ink")} aria-label="Table view"><List className="h-4 w-4" /></button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={CalendarX} title="No days match these filters" action={<Button variant="secondary" onClick={() => { setQuery(""); setPhase("all"); setStatus("all"); }}>Clear filters</Button>} />
      ) : view === "grid" ? (
        <div className="tiles sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((d) => {
            const missing = missingModules(d);
            return (
              <div key={d.day} className="flex flex-col bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="label-xs">Day {String(d.day).padStart(2, "0")} · {d.phase}</p>
                    <Link to={`/study-plan/${d.day}`} className="mt-1 block truncate font-semibold hover:underline">{d.title}</Link>
                  </div>
                  <Switch checked={d.published} onCheckedChange={() => togglePublish(d.day)} aria-label={`Publish day ${d.day}`} />
                </div>
                <ul className="mt-3 grid flex-1 gap-1.5">
                  {d.tasks.map((t) => (
                    <li key={t.id} className="flex items-center gap-2 text-xs">
                      <ModuleBadge module={t.module} className="w-[72px] shrink-0 justify-center px-1 text-[10px]" />
                      <span className="truncate text-muted-foreground" title={t.title}>{t.title}</span>
                    </li>
                  ))}
                </ul>
                {missing.length > 0 && (
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-amber-800"><AlertTriangle className="h-3 w-3" /> Missing: {missing.join(", ")}</p>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs tabular-nums text-muted-foreground">{fmtMins(totalMinutes(d))} · <StatusDot on={d.published} offLabel="Unpublished" /></span>
                  <div className="flex">
                    <Button variant="ghost" size="icon" onClick={() => setPreview(d)} aria-label="Preview"><Eye /></Button>
                    <Button variant="ghost" size="icon" asChild><Link to={`/study-plan/${d.day}`} aria-label="Edit"><Pencil /></Link></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="surface overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => (
                <TableRow key={d.day}>
                  <TableCell className="font-semibold tabular-nums">{String(d.day).padStart(2, "0")}</TableCell>
                  <TableCell className="min-w-[200px]"><Link to={`/study-plan/${d.day}`} className="font-medium hover:underline">{d.title}</Link></TableCell>
                  <TableCell className="whitespace-nowrap"><Badge variant="outline">{d.phase}</Badge></TableCell>
                  <TableCell className="tabular-nums">
                    {d.tasks.length}
                    {missingModules(d).length > 0 && <AlertTriangle className="ml-1 inline h-3 w-3 text-amber-700" />}
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{fmtMins(totalMinutes(d))}</TableCell>
                  <TableCell><Switch checked={d.published} onCheckedChange={() => togglePublish(d.day)} aria-label={`Publish day ${d.day}`} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setPreview(d)} aria-label="Preview"><Eye /></Button>
                    <Button variant="ghost" size="icon" asChild><Link to={`/study-plan/${d.day}`} aria-label="Edit"><Pencil /></Link></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Student preview</DialogTitle>
            <DialogDescription>How Day {preview?.day} appears in the student's daily plan.</DialogDescription>
          </DialogHeader>
          {preview && <DayPreview day={preview} />}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setPreview(null)}>Close</Button>
            {preview && <Button asChild><Link to={`/study-plan/${preview.day}`}><Pencil /> Edit day</Link></Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!importState} onOpenChange={(o) => !o && setImportState(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import content file</DialogTitle>
            <DialogDescription>{importState?.fileName}</DialogDescription>
          </DialogHeader>
          {importState?.errors.length ? (
            <div className="border border-red-700 bg-red-50 p-3 text-sm text-red-800">
              <p className="font-semibold">This file cannot be imported:</p>
              <ul className="mt-2 list-disc pl-5 text-xs">{importState.errors.map((e) => <li key={e}>{e}</li>)}</ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              This will replace the current study plan ({importState?.data.studyPlan.length} days) and homepage content with the contents of the file.
            </p>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setImportState(null)}>Cancel</Button>
            <Button onClick={confirmImport} disabled={!!importState?.errors.length}>Replace content</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset the study plan?"
        description="All 60 days will be restored to the default plan. Your edits will be lost."
        confirmLabel="Reset plan"
        destructive
        onConfirm={() => {
          resetStore("studyPlan");
          toast({ title: "Study plan reset", description: "Default 60-day plan restored.", variant: "success" });
        }}
      />
      <ConfirmDialog
        open={!!bulk}
        onOpenChange={(o) => !o && setBulk(null)}
        title={`${bulk?.published ? "Publish" : "Unpublish"} every day in ${bulk?.phase}?`}
        description={bulk?.published ? "Students will be able to see these days." : "These days will be hidden from students until published again."}
        confirmLabel={bulk?.published ? "Publish all" : "Unpublish all"}
        destructive={!bulk?.published}
        onConfirm={applyBulk}
      />
    </div>
  );
}
