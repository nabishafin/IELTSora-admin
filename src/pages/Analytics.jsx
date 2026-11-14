import { useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Download } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/misc";
import { ChartCard, ChartTooltip, ChartLegend, axisProps, gridProps } from "@/components/analytics/ChartCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { generateDailySeries, monthlyGrowth, modulePopularity, averageScores, completionByDay, completionByPhase } from "@/data/mockAnalytics";
import { CHART, MODULE_COLORS, moduleColor } from "@/utils/constants";
import { formatDate, formatShortDate, formatNumber } from "@/utils/format";
import { cn } from "@/lib/utils";

const RANGES = [7, 30, 90];
const avg = (arr, k) => (arr.length ? arr.reduce((n, d) => n + d[k], 0) / arr.length : 0);

export default function Analytics() {
  const [users] = useStore("users");
  const toast = useToast();
  const [range, setRange] = useState(30);

  const d = useMemo(() => {
    const series = generateDailySeries(range, users);
    const prev = generateDailySeries(range * 2, users).slice(0, range);
    return {
      series,
      prev,
      growth: monthlyGrowth(users, 12),
      popularity: modulePopularity(users),
      scores: averageScores(users),
      byDay: completionByDay(users),
      byPhase: completionByPhase(users),
    };
  }, [users, range]);

  const delta = (k) => {
    const a = avg(d.series, k);
    const b = avg(d.prev, k);
    if (!b) return "";
    const pct = Math.round(((a - b) / b) * 100);
    return `${pct >= 0 ? "+" : ""}${pct}% vs previous ${range} days`;
  };

  const exportCsv = () => {
    const head = ["date", "daily_active_users", "signups", "students", "tasks_completed", "sessions", "avg_reading_band", "avg_listening_band"];
    const rows = d.series.map((r) => [r.key, r.dau, r.signups, r.students, r.tasksCompleted, r.sessions, r.reading, r.listening]);
    const csv = [head, ...rows].map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `ieltsora-analytics-${range}d.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    toast({ title: "Analytics exported", description: `${d.series.length} days of data`, variant: "success" });
  };

  const tickGap = range === 7 ? 0 : 24;

  return (
    <div>
      <PageHeader
        title="Analytics"
        actions={
          <>
            <div className="flex rounded-lg bg-black/[0.05] p-0.5" role="group" aria-label="Date range">
              {RANGES.map((r) => (
                <button key={r} onClick={() => setRange(r)} className={cn("h-8 px-3", "rounded-md text-sm font-medium transition-colors", range === r ? "bg-white text-ink shadow-xs" : "text-muted-foreground hover:text-ink")}>
                  {r}d
                </button>
              ))}
            </div>
            <Button variant="secondary" onClick={exportCsv}><Download /> Export CSV</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 tiles lg:grid-cols-5">
        <StatCard className="rounded-none border-0 shadow-none" label="Avg. daily active" value={formatNumber(avg(d.series, "dau"))} hint={delta("dau")} />
        <StatCard className="rounded-none border-0 shadow-none" label="Tasks completed" value={formatNumber(d.series.reduce((n, r) => n + r.tasksCompleted, 0))} hint={delta("tasksCompleted")} />
        <StatCard className="rounded-none border-0 shadow-none" label="New students" value={d.series.reduce((n, r) => n + r.signups, 0)} hint={`Last ${range} days`} />
        <StatCard className="rounded-none border-0 shadow-none" label="Avg. reading band" value={avg(d.series, "reading").toFixed(1)} hint={delta("reading")} />
        <StatCard className="rounded-none border-0 shadow-none col-span-2 lg:col-span-1" label="Avg. listening band" value={avg(d.series, "listening").toFixed(1)} hint={delta("listening")} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Daily active users" description={`Last ${range} days`}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={d.series} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="date" tickFormatter={formatShortDate} {...axisProps} minTickGap={tickGap} />
                <YAxis {...axisProps} allowDecimals={false} />
                <Tooltip content={<ChartTooltip labelFormatter={formatDate} />} />
                <Area type="monotone" dataKey="dau" name="Active users" stroke={CHART.primary} fill={CHART.primary} fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Student growth" description="Last 12 months" legend={<ChartLegend items={[{ label: "Total", color: CHART.palette[0] }, { label: "New", color: CHART.palette[1], dashed: true }]} />}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.growth} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="total" name="Total" stroke={CHART.palette[0]} strokeWidth={2} dot={{ r: 2.5, fill: CHART.palette[0] }} />
                <Line type="monotone" dataKey="added" name="New" stroke={CHART.palette[1]} strokeWidth={2} strokeDasharray="4 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Task completion" description="Tasks per day">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.series} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="date" tickFormatter={formatShortDate} {...axisProps} minTickGap={tickGap} />
                <YAxis {...axisProps} allowDecimals={false} />
                <Tooltip content={<ChartTooltip labelFormatter={formatDate} />} cursor={{ fill: "#F5F5F5" }} />
                <Bar dataKey="tasksCompleted" name="Tasks" fill={CHART.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Reading & Listening score trends" description="Average band per day" legend={<ChartLegend items={[{ label: "Reading", color: MODULE_COLORS.reading }, { label: "Listening", color: MODULE_COLORS.listening }]} />}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.series} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="date" tickFormatter={formatShortDate} {...axisProps} minTickGap={tickGap} />
                <YAxis domain={[5, 7]} {...axisProps} />
                <Tooltip content={<ChartTooltip labelFormatter={formatDate} formatter={(v) => Number(v).toFixed(1)} />} />
                <Line type="monotone" dataKey="reading" name="Reading" stroke={MODULE_COLORS.reading} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="listening" name="Listening" stroke={MODULE_COLORS.listening} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Module popularity" description="Sessions, all time">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.popularity} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="module" {...axisProps} />
                <YAxis {...axisProps} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F5F5F5" }} />
                <Bar dataKey="sessions" name="Sessions" barSize={40} radius={[4, 4, 0, 0]}>{d.popularity.map((r) => <Cell key={r.key} fill={moduleColor(r.key)} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Average practice scores" description="Mean band per module">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.scores} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="module" {...axisProps} />
                <YAxis domain={[0, 9]} ticks={[0, 3, 5, 7, 9]} {...axisProps} />
                <Tooltip content={<ChartTooltip formatter={(v) => Number(v).toFixed(1)} />} cursor={{ fill: "#F5F5F5" }} />
                <Bar dataKey="average" name="Average band" barSize={40} radius={[4, 4, 0, 0]}>{d.scores.map((r) => <Cell key={r.module} fill={moduleColor(r.module)} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard className="xl:col-span-2" title="Study plan completion by day" description="% of students past each day">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={d.byDay} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="day" {...axisProps} interval={4} />
                <YAxis {...axisProps} unit="%" domain={[0, 100]} />
                <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
                <Area type="stepAfter" dataKey="completion" name="Completed" stroke={CHART.primary} fill={CHART.primary} fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="mt-6 tiles md:grid-cols-3">
        {d.byPhase.map((p) => (
          <div key={p.phase} className="bg-white p-5">
            <p className="label-xs">{p.phase}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{p.completionRate}%</p>
            <p className="mt-1 text-xs text-muted-foreground">of students finished this phase</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-neutral-200"><div className="h-full rounded-full bg-[#5E8C6E]" style={{ width: `${p.completionRate}%` }} /></div>
            <p className="mt-3 text-xs text-muted-foreground">{p.students} currently in phase · {p.finished} finished</p>
          </div>
        ))}
      </div>
    </div>
  );
}
