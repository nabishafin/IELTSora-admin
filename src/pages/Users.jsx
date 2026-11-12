import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Eye, Power, Trash2, Download, Users as UsersIcon } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { SearchInput, SimpleSelect, EmptyState, StatCard } from "@/components/common/misc";
import { Pagination, SortableHead, paginate } from "@/components/tables/Pagination";
import StudentForm from "@/components/forms/StudentForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, Progress } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/overlays";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { formatBand, formatDate, timeAgo, pct } from "@/utils/format";
import { uid } from "@/utils/random";

const PAGE_SIZE = 10;

export default function Users() {
  const [users, setUsers] = useStore("users");
  const [settings] = useStore("settings");
  const toast = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [country, setCountry] = useState("all");
  const [phase, setPhase] = useState("all");
  const [sort, setSort] = useState({ field: "joinedAt", dir: "desc" });
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [toggleTarget, setToggleTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = users.filter((u) => {
      if (status !== "all" && u.status !== status) return false;
      if (country !== "all" && u.country !== country) return false;
      if (phase === "1" && u.currentDay > 20) return false;
      if (phase === "2" && (u.currentDay < 21 || u.currentDay > 40)) return false;
      if (phase === "3" && u.currentDay < 41) return false;
      return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.country.toLowerCase().includes(q);
    });
    const dir = sort.dir === "asc" ? 1 : -1;
    list = [...list].sort((a, b) => {
      const av = a[sort.field];
      const bv = b[sort.field];
      if (typeof av === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return list;
  }, [users, query, status, country, phase, sort]);

  const pageItems = paginate(filtered, page, PAGE_SIZE);
  const onSort = (field) => setSort((s) => ({ field, dir: s.field === field && s.dir === "asc" ? "desc" : "asc" }));
  const resetPage = (fn) => (v) => {
    fn(v);
    setPage(1);
  };

  const countries = Array.from(new Set(users.map((u) => u.country))).sort();
  const active = users.filter((u) => u.status === "active").length;

  const addStudent = (form) => {
    const now = new Date().toISOString();
    const user = {
      id: uid("u"),
      name: form.name,
      email: form.email,
      country: form.country,
      status: form.status,
      joinedAt: now,
      currentDay: form.currentDay,
      completedTasks: Math.max(0, (form.currentDay - 1) * 4),
      targetBand: form.targetBand,
      estimatedBand: Math.max(4, form.targetBand - 1.5),
      scores: { reading: 0, listening: 0, writing: 0, speaking: 0 },
      lastActive: now,
      practiceHistory: [],
    };
    setUsers((list) => [user, ...list]);
    setFormOpen(false);
    toast({ title: "Student added", description: `${user.name} can now be managed from the student list.`, variant: "success" });
  };

  const toggleStatus = () => {
    const u = toggleTarget;
    const next = u.status === "active" ? "inactive" : "active";
    setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, status: next } : x)));
    toast({ title: next === "active" ? "Account activated" : "Account deactivated", description: u.name, variant: "success" });
  };

  const deleteUser = () => {
    const u = deleteTarget;
    setUsers((list) => list.filter((x) => x.id !== u.id));
    toast({ title: "Student deleted", description: `${u.name} was removed.`, variant: "success" });
    if ((page - 1) * PAGE_SIZE >= filtered.length - 1) setPage((p) => Math.max(1, p - 1));
  };

  const exportCsv = () => {
    const rows = [["Name", "Email", "Country", "Status", "Joined", "Current day", "Completed tasks", "Target band", "Estimated band"]].concat(
      filtered.map((u) => [u.name, u.email, u.country, u.status, formatDate(u.joinedAt), u.currentDay, u.completedTasks, u.targetBand, u.estimatedBand])
    );
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `ieltsora-students-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    toast({ title: "Export ready", description: `${filtered.length} students exported to CSV.`, variant: "success" });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Users"
        title="Students"
        description="Search, filter and manage every mock student account on the platform."
        actions={
          <>
            <Button variant="secondary" onClick={exportCsv} disabled={!filtered.length}>
              <Download /> Export CSV
            </Button>
            <Button onClick={() => setFormOpen(true)}>
              <Plus /> Add student
            </Button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-px border border-border bg-border lg:grid-cols-4">
        <StatCard className="border-0" label="Total" value={users.length} />
        <StatCard className="border-0" label="Active" value={active} hint={`${pct(active, users.length)}%`} />
        <StatCard className="border-0" label="Inactive" value={users.length - active} />
        <StatCard className="border-0" label="Avg. current day" value={users.length ? Math.round(users.reduce((n, u) => n + u.currentDay, 0) / users.length) : 0} />
      </div>

      <div className="border border-border">
        <div className="grid gap-3 border-b border-border p-4 md:grid-cols-[1fr_160px_180px_180px]">
          <SearchInput value={query} onChange={resetPage(setQuery)} placeholder="Search by name, email or country…" />
          <SimpleSelect value={status} onValueChange={resetPage(setStatus)} options={[{ value: "all", label: "All statuses" }, { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
          <SimpleSelect value={phase} onValueChange={resetPage(setPhase)} options={[{ value: "all", label: "All phases" }, { value: "1", label: "Foundation (1–20)" }, { value: "2", label: "Skill Dev. (21–40)" }, { value: "3", label: "Exam Prep (41–60)" }]} />
          <SimpleSelect value={country} onValueChange={resetPage(setCountry)} options={[{ value: "all", label: "All countries" }, ...countries]} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            className="m-4"
            title="No students match your filters"
            description="Try a different search term or clear the filters."
            action={
              <Button variant="secondary" onClick={() => { setQuery(""); setStatus("all"); setCountry("all"); setPhase("all"); }}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHead label="Student" field="name" sort={sort} onSort={onSort} />
                  <SortableHead label="Status" field="status" sort={sort} onSort={onSort} />
                  <SortableHead label="Day" field="currentDay" sort={sort} onSort={onSort} />
                  <SortableHead label="Tasks" field="completedTasks" sort={sort} onSort={onSort} />
                  <SortableHead label="Est. band" field="estimatedBand" sort={sort} onSort={onSort} />
                  <SortableHead label="Target" field="targetBand" sort={sort} onSort={onSort} />
                  <SortableHead label="Last active" field="lastActive" sort={sort} onSort={onSort} />
                  <SortableHead label="Joined" field="joinedAt" sort={sort} onSort={onSort} />
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((u) => (
                  <TableRow key={u.id} className="cursor-pointer" onClick={() => navigate(`/users/${u.id}`)}>
                    <TableCell className="min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-border text-[11px] font-semibold">
                          {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                        </span>
                        <div className="min-w-0">
                          <Link to={`/users/${u.id}`} onClick={(e) => e.stopPropagation()} className="font-medium hover:underline">{u.name}</Link>
                          <p className="truncate text-xs text-muted-foreground">{u.email} · {u.country}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.status === "active" ? "success" : "muted"}>{u.status}</Badge>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <p className="text-sm tabular-nums">{u.currentDay}/60</p>
                      <Progress value={(u.currentDay / 60) * 100} className="mt-1 h-1" />
                    </TableCell>
                    <TableCell className="tabular-nums">{u.completedTasks}/240</TableCell>
                    <TableCell className="font-semibold tabular-nums">{formatBand(u.estimatedBand)}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{formatBand(u.targetBand)}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{timeAgo(u.lastActive)}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(u.joinedAt)}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon" asChild title="View profile">
                          <Link to={`/users/${u.id}`} aria-label={`View ${u.name}`}><Eye /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setToggleTarget(u)} title={u.status === "active" ? "Deactivate" : "Activate"} aria-label={u.status === "active" ? "Deactivate" : "Activate"}>
                          <Power />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(u)} title="Delete" aria-label="Delete">
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
          </>
        )}
      </div>

      <StudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={addStudent}
        existingEmails={users.map((u) => u.email)}
        defaultTargetBand={settings.platform?.defaultTargetBand || "7.0"}
      />
      <ConfirmDialog
        open={!!toggleTarget}
        onOpenChange={(o) => !o && setToggleTarget(null)}
        title={toggleTarget?.status === "active" ? `Deactivate ${toggleTarget?.name}?` : `Activate ${toggleTarget?.name}?`}
        description={toggleTarget?.status === "active" ? "The student will no longer be counted as active. You can reactivate the account at any time." : "The student account will be marked active again."}
        confirmLabel={toggleTarget?.status === "active" ? "Deactivate" : "Activate"}
        destructive={toggleTarget?.status === "active"}
        onConfirm={toggleStatus}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name}?`}
        description="This permanently removes the mock account and its practice history from this browser."
        confirmLabel="Delete student"
        destructive
        onConfirm={deleteUser}
      />
    </div>
  );
}
