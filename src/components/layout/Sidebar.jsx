import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, CalendarDays, BookOpen, ListChecks, ClipboardCheck, Layers, Home, BarChart3, Settings, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export const NAV_GROUPS = [
  {
    label: "General",
    items: [
      { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
      { to: "/users", label: "Students", icon: Users },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/study-plan", label: "60-Day Plan", icon: CalendarDays },
      { to: "/cambridge", label: "Cambridge Practice", icon: BookOpen },
      { to: "/questions", label: "Question Bank", icon: ListChecks },
      { to: "/mock-tests", label: "Mock Tests", icon: ClipboardCheck },
      { to: "/modules", label: "Modules", icon: Layers },
      { to: "/homepage", label: "Homepage", icon: Home },
    ],
  },
  { label: "System", items: [{ to: "/settings", label: "Settings", icon: Settings }] },
];

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-sm font-bold text-white">I</span>
      <div className="leading-tight">
        <p className="text-[15px] font-semibold tracking-tight">IELTSora</p>
        <p className="text-xs text-muted-foreground">Admin console</p>
      </div>
    </div>
  );
}

export default function Sidebar({ onNavigate, onLogout }) {
  const { session } = useAuth();
  return (
    <div className="flex h-full flex-col bg-white/70 backdrop-blur-xl">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {NAV_GROUPS.map((g) => (
          <div key={g.label} className="mb-5">
            <p className="label-xs mb-1 px-3">{g.label}</p>
            <ul className="grid gap-0.5">
              {g.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive ? "bg-black/[0.06] font-semibold text-ink" : "text-muted-foreground hover:bg-black/[0.04] hover:text-ink"
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-xs font-semibold">AU</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{session?.name || "Admin"}</p>
            <p className="truncate text-xs text-muted-foreground">{session?.email}</p>
          </div>
          <button onClick={onLogout} className="rounded-md p-2 text-muted-foreground hover:bg-black/[0.05] hover:text-ink" aria-label="Log out" title="Log out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
