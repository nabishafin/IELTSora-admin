import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line } from "recharts";
import { Users as UsersIcon, UserCheck, ListChecks, CheckCircle2, BookOpen, ClipboardCheck, Activity, ArrowRight } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { StatCard, ModuleBadge, SectionTitle, EmptyState } from "@/components/common/misc";
import { ChartCard, ChartTooltip, axisProps, gridProps } from "@/components/analytics/ChartCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress, Badge } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useLocalStorage";
import { generateDailySeries, monthlyGrowth, modulePopularity, completionByPhase } from "@/data/mockAnalytics";
import { CHART } from "@/utils/constants";
import { formatDate, formatNumber, formatShortDate, timeAgo, pct, formatBand } from "@/utils/format";

export default function Overview() {
  const [users] = useStore("users");
  const [plan] = useStore("studyPlan");
  const [mockTests] = useStore("mockTests");
  const [cambridge] = useStore("cambridge");

  const data = useMemo(() => {
    const active = users.filter((u) => u.status === "active").length;
    const totalTasks = plan.reduce((n, d) => n + d.tasks.length, 0);
    const completed = users.reduce((n, u) => n + (u.completedTasks || 0), 0);
    const possible = users.length * totalTasks;
    const history = users.flatMap((u) => (u.practiceHistory || []).map((p) => ({ ...p, user: u })));
    const cambridgeSessions = history.filter((h) => h.type === "cambridge").length;
    const daily = generateDailySeries(30, users);
    const sessions30 = daily.reduce((n, d) => n + d.sessions, 0);
    return {
      active,
      totalTasks,
      completed,
      completionRate: pct(completed, possible),
      cambridgeSessions,
      daily,
      sessions30,
      growth: monthlyGrowth(users, 12),
      popularity: modulePopularity(users),
      phases: completionByPhase(users),
      recentUsers: [...users].sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt)).slice(0, 6),
      recentActivity: history.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8),
    };
  }, [users, plan]);

  const publishedTests = cambridge.reduce((n, b) => n + b.tests.filter((t) => t.published).length, 0);
  const publishedDays = plan.filter((d) => d.published).length;

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title="Platform overview"
        description="A snapshot of students, content and activity across the IELTSora platform."
        actions={
          <>
            <Button variant="secondary" asChild>
              <Link to="/analytics">Full analytics</Link>
            </Button>
            <Button asChild>
              <Link to="/study-plan">Manage study plan</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-3 xl:grid-cols-6">
        <StatCard className="border-0" label="Registered students" value={formatNumber(users.length)} hint={`${data.recentUsers.filter((u) => Date.now() - new Date(u.joinedAt) < 30 * 864e5).length} joined in 30 days`} icon={UsersIcon} />
        <StatCard className="border-0" label="Active students" value={formatNumber(data.active)} hint={`${pct(data.active, users.length)}% of all accounts`} icon={UserCheck} />
        <StatCard className="border-0" label="Daily plan tasks" value={formatNumber(data.totalTasks)} hint={`${publishedDays}/60 days published`} icon={ListChecks} />
        <StatCard className="border-0" label="Tasks completed" value={formatNumber(data.completed)} hint={`${data.completionRate}% of all assigned tasks`} icon={CheckCircle2} />
        <StatCard className="border-0" label="Cambridge sessions" value={formatNumber(data.cambridgeSessions)} hint={`${publishedTests}/48 tests published`} icon={BookOpen} />
        <StatCard className="border-0" label="Mock tests" value={formatNumber(mockTests.length)} hint={`${mockTests.filter((m) => m.published).length} published`} icon={ClipboardCheck} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <ChartCard className="xl:col-span-2" title="Daily active users" description={`Last 30 days · ${formatNumber(data.sessions30)} practice sessions`} action={<Activity className="h-4 w-4 text-muted-foreground" />}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.daily} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="date" tickFormatter={formatShortDate} {...axisProps} minTickGap={24} />
                <YAxis {...axisProps} allowDecimals={false} />
                <Tooltip content={<ChartTooltip labelFormatter={formatDate} />} />
                <Area type="monotone" dataKey="dau" name="Active users" stroke={CHART.ink} fill={CHART.ink} fillOpacity={0.06} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Popular modules" description="Practice sessions by module">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.popularity} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={CHART.grid} horizontal={false} />
                <XAxis type="number" {...axisProps} allowDecimals={false} />
                <YAxis type="category" dataKey="module" {...axisProps} width={72} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F7F7F7" }} />
                <Bar dataKey="sessions" name="Sessions" fill={CHART.ink} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <ChartCard className="xl:col-span-2" title="Student growth" description="Cumulative registered students, last 12 months">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.growth} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="total" name="Total students" stroke={CHART.ink} strokeWidth={2} dot={{ r: 2.5, fill: CHART.ink }} />
                <Line type="monotone" dataKey="added" name="New this month" stroke={CHART.light} strokeDasharray="4 3" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <div className="border border-border p-5">
          <SectionTitle>Completion by phase</SectionTitle>
          <div className="grid gap-5">
            {data.phases.map((p) => (
              <div key={p.phase}>
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium">{p.phase}</span>
                  <span className="tabular-nums text-muted-foreground">{p.completionRate}% finished</span>
                </div>
                <Progress value={p.completionRate} className="mt-2" />
                <p className="mt-1.5 text-xs text-muted-foreground">{p.students} students currently in this phase · {p.finished} finished</p>
              </div>
            ))}
            <div className="border-t border-border pt-4">
              <p className="label-xs">Overall task completion</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">{data.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="border border-border">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-[15px] font-semibold">Recent registrations</h3>
            <Link to="/users" className="inline-flex items-center gap-1 text-xs font-medium hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {data.recentUsers.length === 0 ? (
            <EmptyState className="m-5" title="No students yet" description="New registrations will appear here." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <Link to={`/users/${u.id}`} className="font-medium hover:underline">{u.name}</Link>
                      <p className="text-xs text-muted-foreground">{u.country}</p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(u.joinedAt)}</TableCell>
                    <TableCell className="tabular-nums">{u.currentDay}/60</TableCell>
                    <TableCell>
                      <Badge variant={u.status === "active" ? "success" : "muted"}>{u.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="border border-border">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-[15px] font-semibold">Recent student activity</h3>
            <span className="text-xs text-muted-foreground">Latest practice sessions</span>
          </div>
          {data.recentActivity.length === 0 ? (
            <EmptyState className="m-5" title="No activity yet" />
          ) : (
            <ul className="divide-y divide-border">
              {data.recentActivity.map((a) => (
                <li key={a.id + a.user.id} className="flex items-center gap-3 px-5 py-3">
                  <ModuleBadge module={a.module} className="w-[84px] justify-center" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">
                      <Link to={`/users/${a.user.id}`} className="font-medium hover:underline">{a.user.name}</Link>
                      <span className="text-muted-foreground"> · {a.activity}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{timeAgo(a.date)} · {a.duration} min</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{formatBand(a.score)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
