import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldAlert, LogIn, CalendarDays, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form-controls";
import { FormField } from "@/components/common/misc";
import { Logo } from "@/components/layout/Sidebar";
import { DEMO_CREDENTIALS, useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";
import { isValidEmail } from "@/utils/format";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length) return;
    const res = login(email, password);
    if (!res.ok) {
      setFormError(res.error);
      return;
    }
    toast({ title: "Welcome back", description: "Signed in to the IELTSora admin dashboard.", variant: "success" });
    const to = location.state?.from && location.state.from !== "/login" ? location.state.from : "/";
    navigate(to, { replace: true });
  };

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setErrors({});
    setFormError("");
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Left: form card */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <Logo />
          </div>
          <div className="surface p-6 shadow-low sm:p-8">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Welcome back. Sign in to manage IELTSora.</p>

            <div className="mt-6 rounded-lg border border-[#0074E2]/20 bg-[#0074E2]/5 p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#0074E2]" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-semibold">Demonstration authentication</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Credentials are checked in the browser and the session is stored in LocalStorage. This is not production security.
                  </p>
                  <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="font-mono">{DEMO_CREDENTIALS.email}</dd>
                    <dt className="text-muted-foreground">Password</dt>
                    <dd className="font-mono">{DEMO_CREDENTIALS.password}</dd>
                  </dl>
                  <Button type="button" variant="outline" size="sm" className="mt-3" onClick={fillDemo}>
                    Fill demo credentials
                  </Button>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="mt-6 grid gap-4" noValidate>
              {formError && <p className="rounded-lg border border-red-700/30 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{formError}</p>}
              <FormField label="Email" htmlFor="email" error={errors.email}>
                <Input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={errors.email ? "border-destructive" : ""} placeholder="admin@example.com" />
              </FormField>
              <FormField label="Password" htmlFor="password" error={errors.password}>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-black/[0.05] hover:text-ink" aria-label={show ? "Hide password" : "Show password"}>
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormField>
              <Button type="submit" size="lg" className="mt-2 w-full">
                <LogIn /> Sign in
              </Button>
            </form>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} IELTSora · Demonstration build</p>
        </div>
      </div>

      {/* Right: media panel */}
      <div className="hidden p-3 lg:block">
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-[#1B1B1B] p-12 text-white">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#0171E3]/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-[#6B1EFD]/25 blur-3xl" />
          <div className="relative flex items-center gap-2 text-sm text-neutral-300">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-ink">I</span>
            IELTSora Admin
          </div>
          <div className="relative">
            <p className="text-sm text-neutral-400">Content & platform management</p>
            <h2 className="mt-3 max-w-md text-4xl font-semibold leading-tight tracking-tight">Run the whole 60-day IELTS programme from one place.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-neutral-400">Edit daily tasks, manage the Cambridge 10–21 library and question bank, build mock tests and follow every student's progress.</p>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {[
                { icon: CalendarDays, value: "60", label: "Plan days" },
                { icon: BookOpen, value: "48", label: "Cambridge tests" },
                { icon: Users, value: "40", label: "Demo students" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                  <s.icon className="h-4 w-4 text-neutral-400" />
                  <p className="mt-3 text-2xl font-semibold tabular-nums">{s.value}</p>
                  <p className="text-xs text-neutral-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex gap-1.5">
            {["#0171E3", "#EB6E00", "#6B1EFD", "#0B991F"].map((c) => (
              <span key={c} className="h-1.5 w-8 rounded-full" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
