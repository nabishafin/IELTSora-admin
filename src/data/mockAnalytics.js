/**
 * Analytics series. Time-based metrics are generated deterministically per
 * calendar date (so numbers are stable between reloads) and scaled to the
 * real number of stored students; everything else is derived from stored data.
 */
import { createRng } from "@/utils/random";
import { dayKey } from "@/utils/format";
import { PHASES, MODULES } from "@/utils/constants";

const dateSeed = (d) => Number(dayKey(d).replace(/-/g, ""));

export function generateDailySeries(days, users = []) {
  const activeCount = Math.max(1, users.filter((u) => u.status === "active").length);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const joinedByDay = {};
  users.forEach((u) => {
    const k = dayKey(u.joinedAt);
    joinedByDay[k] = (joinedByDay[k] || 0) + 1;
  });
  const joinTimes = users.map((u) => new Date(u.joinedAt).getTime());
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const rng = createRng(dateSeed(d));
    const weekday = d.getDay();
    const weekendDip = weekday === 0 || weekday === 6 ? 0.78 : 1;
    const t = Math.max(0, (90 - i) / 90);
    const trend = 0.85 + t * 0.15;
    const dau = Math.max(1, Math.round(activeCount * (0.5 + rng() * 0.3) * weekendDip * trend));
    const endOfDay = d.getTime() + 86399999;
    out.push({
      date: d.toISOString(),
      key: dayKey(d),
      dau,
      signups: joinedByDay[dayKey(d)] || 0,
      students: joinTimes.filter((j) => j <= endOfDay).length,
      tasksCompleted: Math.round(dau * (2.4 + rng() * 1.4)),
      sessions: Math.round(dau * (1.2 + rng() * 0.8)),
      reading: Math.round((5.7 + t * 0.6 + (rng() - 0.5) * 0.35) * 10) / 10,
      listening: Math.round((5.9 + t * 0.55 + (rng() - 0.5) * 0.35) * 10) / 10,
    });
  }
  return out;
}

/** Monthly cumulative student growth for the last N months. */
export function monthlyGrowth(users, months = 12) {
  const now = new Date();
  const out = [];
  for (let i = months - 1; i >= 0; i--) {
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const total = users.filter((u) => new Date(u.joinedAt) <= end).length;
    const added = users.filter((u) => {
      const j = new Date(u.joinedAt);
      return j >= start && j <= end;
    }).length;
    out.push({ month: start.toLocaleString("en-US", { month: "short" }), total, added });
  }
  return out;
}

/** Module popularity from students' practice history. */
export function modulePopularity(users) {
  const counts = Object.fromEntries(MODULES.map((m) => [m.key, 0]));
  users.forEach((u) => (u.practiceHistory || []).forEach((p) => (counts[p.module] = (counts[p.module] || 0) + 1)));
  return MODULES.map((m) => ({ module: m.label, key: m.key, sessions: counts[m.key] || 0 }));
}

/** Average band per module from students' module scores. */
export function averageScores(users) {
  return MODULES.map((m) => {
    const vals = users.map((u) => Number(u.scores?.[m.key])).filter((n) => !Number.isNaN(n) && n > 0);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    return { module: m.label, average: Math.round(avg * 10) / 10 };
  });
}

/** Percentage of students who completed each study-plan day. */
export function completionByDay(users) {
  const total = users.length || 1;
  return Array.from({ length: 60 }, (_, i) => {
    const day = i + 1;
    const done = users.filter((u) => u.currentDay > day).length;
    return { day: `D${day}`, dayNo: day, completion: Math.round((done / total) * 100) };
  });
}

/** Students currently in each phase and the share who have finished it. */
export function completionByPhase(users) {
  const total = users.length || 1;
  return PHASES.map((p) => {
    const inPhase = users.filter((u) => u.currentDay >= p.start && u.currentDay <= p.end).length;
    const finished = users.filter((u) => u.currentDay > p.end || (p.end === 60 && u.completedTasks >= 240)).length;
    return { phase: p.name, students: inPhase, finished, completionRate: Math.round((finished / total) * 100) };
  });
}
