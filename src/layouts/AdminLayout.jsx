import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import Sidebar, { Logo, NAV_GROUPS } from "@/components/layout/Sidebar";
import { Sheet, SheetContent, ConfirmDialog } from "@/components/ui/overlays";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";

function useSectionTitle() {
  const { pathname } = useLocation();
  const items = NAV_GROUPS.flatMap((g) => g.items);
  const match = items
    .filter((i) => (i.to === "/" ? pathname === "/" : pathname.startsWith(i.to)))
    .sort((a, b) => b.to.length - a.to.length)[0];
  return match?.label || "Admin";
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { logout, session } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { pathname } = useLocation();
  const title = useSectionTitle();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${title} · IELTSora Admin`;
  }, [pathname, title]);

  const doLogout = () => {
    logout();
    toast({ title: "Signed out", description: "Your admin session has ended.", variant: "success" });
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/60 lg:block">
        <Sidebar onLogout={() => setConfirmLogout(true)} />
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar onNavigate={() => setOpen(false)} onLogout={() => { setOpen(false); setConfirmLogout(true); }} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-white/60 bg-white/60 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
              <Menu />
            </Button>
            <div className="lg:hidden">
              <Logo />
            </div>
            <p className="hidden truncate text-sm text-muted-foreground lg:block">
              Admin <span className="mx-1.5">/</span> <span className="font-medium text-ink">{title}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium md:inline">{session?.name}</span>
            <Button variant="outline" size="sm" onClick={() => setConfirmLogout(true)}>
              <LogOut /> <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </header>
        <main className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        onOpenChange={setConfirmLogout}
        title="Log out of the admin dashboard?"
        description="Your data stays saved in this browser. You can sign back in with the demo credentials."
        confirmLabel="Log out"
        onConfirm={doLogout}
      />
    </div>
  );
}
