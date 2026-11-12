const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatShortDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatMonth(value) {
  const d = new Date(value);
  return `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
}

export function timeAgo(value) {
  if (!value) return "—";
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return months < 12 ? `${months}mo ago` : `${Math.round(months / 12)}y ago`;
}

export const formatNumber = (n) => new Intl.NumberFormat("en-US").format(Math.round(n || 0));
export const formatBand = (n) => (n === null || n === undefined || n === "" ? "—" : Number(n).toFixed(1));
export const pct = (part, total) => (total ? Math.round((part / total) * 100) : 0);

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || "").trim());

export function daysAgoISO(days, base = new Date()) {
  const d = new Date(base);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export function dayKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
