import { Search, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, Input, Label } from "@/components/ui/form-controls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/overlays";
import { moduleLabel } from "@/utils/constants";

export function StatCard({ label, value, hint, icon: Icon, className }) {
  return (
    <div className={cn("surface p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="label-xs">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <p className="mt-3 text-[26px] font-semibold leading-none tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed border-input bg-white/60 px-6 py-14 text-center", className)}>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.05]"><Icon className="h-5 w-5 text-muted-foreground" /></span>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search…", className }) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-9" aria-label={placeholder} />
    </div>
  );
}

export function FormField({ label, htmlFor, error, hint, required, children, className }) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/** Thin wrapper around the radix Select. Option values must be non-empty strings. */
export function SimpleSelect({ value, onValueChange, options, placeholder = "Select…", className, id, invalid, disabled }) {
  return (
    <Select value={value === undefined || value === null ? undefined : String(value)} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger id={id} className={cn(invalid && "border-destructive", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => {
          const opt = typeof o === "object" ? o : { value: String(o), label: String(o) };
          return (
            <SelectItem key={opt.value} value={String(opt.value)}>
              {opt.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export function StatusDot({ on, onLabel = "Published", offLabel = "Draft" }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className={cn("h-2 w-2 rounded-full", on ? "bg-[#198100]" : "bg-neutral-300")} />
      <span className={on ? "text-ink" : "text-muted-foreground"}>{on ? onLabel : offLabel}</span>
    </span>
  );
}

/* Module colours — must match the student website exactly. */
const MODULE_STYLE = {
  reading: "bg-[#4F74A8]/10 text-[#4F74A8]",
  listening: "bg-[#B5763A]/10 text-[#B5763A]",
  writing: "bg-[#7A68AE]/10 text-[#7A68AE]",
  speaking: "bg-[#5E8C6E]/10 text-[#5E8C6E]",
};

export function ModuleBadge({ module, className }) {
  return <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold", MODULE_STYLE[module], className)}>{moduleLabel(module)}</span>;
}

export function DifficultyBadge({ difficulty }) {
  const variant = difficulty === "Hard" ? "danger" : difficulty === "Medium" ? "warning" : "success";
  return <Badge variant={variant}>{difficulty}</Badge>;
}

export function SectionTitle({ children, action, className }) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <h2 className="text-base font-semibold tracking-tight">{children}</h2>
      {action}
    </div>
  );
}
