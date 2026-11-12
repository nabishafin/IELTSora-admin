import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, LineChart, Line } from "recharts";
import { Pencil, Power, Trash2, Mail, MapPin, CalendarDays, Clock, UserX } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { StatCard, ModuleBadge, EmptyState, SimpleSelect, SectionTitle } from "@/components/common/misc";
import { ChartCard, ChartTooltip, ChartLegend, axisProps, gridProps } from "@/components/analytics/ChartCard";
import StudentForm from "@/components/forms/StudentForm";
import { Pagination, paginate } from "@/components/tables/Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, Progress } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/overlays";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { MODULES, CHART, phaseForDay, PHASES } from "@/utils/constants";
import { formatBand, formatDate, timeAgo, pct, formatShortDate } from "@/utils/format";

const TYPE_LABEL = { cambridge: "Cambridge", "study-plan": "Study plan", mock: "Mock test" };

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [users, setUsers] = useStore("users");
  const user = users.find((u) => u.id === id);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [moduleFilter, setModuleFilter] = useState("all");
  const [page, setPage] = useState(1);

  const history = useMemo(
    () => [...(user?.practiceHistory || [])].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [user]
  );
  const filteredHistory = moduleFilter === "all" ? history : history.filter((h) => h.module === moduleFilter);
  const trend = useMemo(() => [...history].reverse().map((h) => ({ date: h.date, score: h.score, module: h.module })), [history]);

  if (!user) {
    return (
      <div>
        <PageHeader title="Student not found" back={{ to: "/users", label: "Back to students" }} />
        <EmptyState icon={UserX} title="This student does not exist" description="The account may have been deleted." action={<Button asChild><Link to="/users">View all students</Link></Button>} />
      </div>
    );
  }

  const update = (patch) => setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, ...patch } : u)));
  const perf = MODULES.map((m) => ({ module: m.label, key: m.key, band: user.scores?.[m.key] || 0 }));
  const phase = phaseForDay(user.currentDay);
  const phaseInfo = PHASES.find((p) => p.name === phase);
  const totalMinutes = history.reduce((n, h) => n + (h.duration || 0), 0);

  const saveEdit = (form) => {
    update({ name: form.name, email: form.email, country: form.country, targetBand: form.targetBand, status: form.status, currentDay: form.currentDay, completedTasks: Math.min(user.completedTasks, form.currentDay * 4) });
    setEditOpen(false);
    toast({ title: "Profile updated", description: form.name, variant: "success" });
  };

  return (
    <div>
      <PageHeader
        back={{ to: "/users", label: "Back to students" }}
        eyebrow={`Student · ${user.id}`}
        title={user.name}
        description={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{user.email}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{user.country}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Joined {formatDate(user.joinedAt)}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Active {timeAgo(user.lastActive)}</span>
          </span>
        }
        actions={
          <>
            <Badge variant={user.status === "active" ? "success" : "muted"} className="mr-1">{user.status}</Badge>
            <Button variant="secondary" onClick={() => setEditOpen(true)}><Pencil /> Edit</Button>
            <Button variant={user.status === "active" ? "secondary" : "default"} onClick={() => setConfirmToggle(true)}>
              <Power /> {user.status === "active" ? "Deactivate" : "Activate"}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(true)} aria-label="Delete student" title="Delete student"><Trash2 /></Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-px border border-border bg-border lg:grid-cols-5">
        <StatCard className="border-0" label="Current day" value={`${user.currentDay}/60`} hint={phase} />
        <StatCard className="border-0" label="Completed tasks" value={user.completedTasks} hint={`${pct(user.completedTasks, 240)}% of 240`} />
        <StatCard className="border-0" label="Estimated band" value={formatBand(user.estimatedBand)} hint={`Target ${formatBand(user.targetBand)}`} />
        <StatCard className="border-0" label="Practice sessions" value={history.length} hint={`${totalMinutes} minutes logged`} />
        <StatCard className="border-0 col-span-2 lg:col-span-1" label="Gap to target" value={user.targetBand - user.estimatedBand > 0 ? `−${(user.targetBand - user.estimatedBand).toFixed(1)}` : "On track"} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="border border-border p-5">
          <SectionTitle>60-day progress</SectionTitle>
          <p className="text-3xl font-semibold tabular-nums">{pct(user.currentDay - 1, 60)}%</p>
          <Progress value={pct(user.currentDay - 1, 60)} className="mt-3" />
          <div className="mt-5 grid gap-3">
            {PHASES.map((p) => {
              const done = Math.max(0, Math.min(p.end, user.currentDay - 1) - p.start + 1);
              const len = p.end - p.start + 1;
              return (
                <div key={p.name}>
                  <div className="flex justify-between text-xs">
                    <span className={p.name === phase ? "font-semibold" : "text-muted-foreground"}>{p.name}</span>
                    <span className="tabular-nums text-muted-foreground">{done}/{len} days</span>
                  </div>
                  <Progress value={(done / len) * 100} className="mt-1 h-1" />
                </div>
              );
            })}
          </div>
          <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">{phaseInfo?.description}</p>
        </div>

        <ChartCard title="Module performance" description="Latest estimated band per module vs target">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perf} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="module" {...axisProps} />
                <YAxis domain={[0, 9]} ticks={[0, 3, 5, 7, 9]} {...axisProps} />
                <Tooltip content={<ChartTooltip formatter={(v) => formatBand(v)} />} cursor={{ fill: "#F7F7F7" }} />
                <ReferenceLine y={user.targetBand} stroke={CHART.mid} strokeDasharray="4 3" label={{ value: `Target ${formatBand(user.targetBand)}`, position: "insideTopRight", fontSize: 10, fill: CHART.mid }} />
                <Bar dataKey="band" name="Band" fill={CHART.ink} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Score trend" description="Practice session scores over time" legend={<ChartLegend items={[{ label: "Session score", color: CHART.ink }, { label: "Target", color: CHART.mid, dashed: true }]} />}>
          {trend.length < 2 ? (
            <EmptyState className="mx-3 my-6" title="Not enough sessions" description="A trend appears after two practice sessions." />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="date" tickFormatter={formatShortDate} {...axisProps} minTickGap={20} />
                  <YAxis domain={[3, 9]} {...axisProps} />
                  <Tooltip content={<ChartTooltip labelFormatter={formatDate} formatter={(v) => formatBand(v)} />} />
                  <ReferenceLine y={user.targetBand} stroke={CHART.mid} strokeDasharray="4 3" />
                  <Line type="monotone" dataKey="score" name="Score" stroke={CHART.ink} strokeWidth={2} dot={{ r: 3, fill: CHART.ink }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      <div className="mt-6 border border-border">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[15px] font-semibold">Practice history</h3>
            <p className="text-xs text-muted-foreground">{filteredHistory.length} sessions</p>
          </div>
          <SimpleSelect
            className="sm:w-48"
            value={moduleFilter}
            onValueChange={(v) => { setModuleFilter(v); setPage(1); }}
            options={[{ value: "all", label: "All modules" }, ...MODULES.map((m) => ({ value: m.key, label: m.label }))]}
          />
        </div>
        {filteredHistory.length === 0 ? (
          <EmptyState className="m-4" title="No practice sessions" description="Sessions completed by this student will appear here." />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Band</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginate(filteredHistory, page, 8).map((h) => (
                  <TableRow key={h.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(h.date)}</TableCell>
                    <TableCell><ModuleBadge module={h.module} /></TableCell>
                    <TableCell className="min-w-[220px]">{h.activity}</TableCell>
                    <TableCell><Badge variant="outline">{TYPE_LABEL[h.type] || h.type}</Badge></TableCell>
                    <TableCell className="tabular-nums">{h.duration} min</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{formatBand(h.score)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination page={page} pageSize={8} total={filteredHistory.length} onPageChange={setPage} />
          </>
        )}
      </div>

      <StudentForm open={editOpen} onOpenChange={setEditOpen} initial={user} onSubmit={saveEdit} existingEmails={users.map((u) => u.email)} />
      <ConfirmDialog
        open={confirmToggle}
        onOpenChange={setConfirmToggle}
        title={user.status === "active" ? "Deactivate this account?" : "Activate this account?"}
        description={user.status === "active" ? "The student will be marked inactive. This is a mock action stored locally." : "The student will be marked active again."}
        confirmLabel={user.status === "active" ? "Deactivate" : "Activate"}
        destructive={user.status === "active"}
        onConfirm={() => {
          const next = user.status === "active" ? "inactive" : "active";
          update({ status: next });
          toast({ title: next === "active" ? "Account activated" : "Account deactivated", variant: "success" });
        }}
      />
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Delete ${user.name}?`}
        description="The account and its practice history will be permanently removed from this browser."
        confirmLabel="Delete student"
        destructive
        onConfirm={() => {
          setUsers((list) => list.filter((u) => u.id !== user.id));
          toast({ title: "Student deleted", variant: "success" });
          navigate("/users", { replace: true });
        }}
      />
    </div>
  );
}
