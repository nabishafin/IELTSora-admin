import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldAlert, LogIn } from "lucide-react";
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
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink p-12 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center bg-white text-sm font-bold text-ink">I</span>
          <span className="text-[15px] font-semibold tracking-tight">IELTSora Admin</span>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Content & platform management</p>
          <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight tracking-tight">Manage the 60-day plan, Cambridge library and every student in one place.</h1>
          <ul className="mt-8 grid max-w-md gap-3 text-sm text-neutral-300">
            <li className="border-l border-neutral-600 pl-3">Edit all 60 days and their four module tasks</li>
            <li className="border-l border-neutral-600 pl-3">Manage Cambridge IELTS 10–21, tests and questions</li>
            <li className="border-l border-neutral-600 pl-3">Track student progress and platform analytics</li>
          </ul>
        </div>
        <p className="text-xs text-neutral-500">© {new Date().getFullYear()} IELTSora · Demonstration build</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Admin sign in</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">Use the demo credentials below to access the dashboard.</p>

          <div className="mt-6 border border-dashed border-ink bg-subtle p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
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
                <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={fillDemo}>
                  Fill demo credentials
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 grid gap-4" noValidate>
            {formError && <p className="border border-red-700 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{formError}</p>}
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
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink" aria-label={show ? "Hide password" : "Show password"}>
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>
            <Button type="submit" size="lg" className="mt-2 w-full">
              <LogIn /> Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
