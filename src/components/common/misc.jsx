import { Search, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, Input, Label } from "@/components/ui/form-controls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/overlays";
import { moduleLabel } from "@/utils/constants";

export function StatCard({ label, value, hint, icon: Icon, className }) {
  return (
    <div className={cn("border border-border bg-white p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="label-xs">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <p className="mt-3 text-[28px] font-semibold leading-none tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center border border-dashed border-border px-6 py-14 text-center", className)}>
      <Icon className="h-6 w-6 text-muted-foreground" />
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
      <span className={cn("h-1.5 w-1.5 rounded-full", on ? "bg-success" : "bg-neutral-300")} />
      <span className={on ? "text-ink" : "text-muted-foreground"}>{on ? onLabel : offLabel}</span>
    </span>
  );
}

const MODULE_STYLE = {
  reading: "border-ink bg-ink text-white",
  listening: "border-ink bg-white text-ink",
  writing: "border-neutral-400 bg-neutral-100 text-ink",
  speaking: "border-dashed border-ink bg-white text-ink",
};

export function ModuleBadge({ module, className }) {
  return <span className={cn("inline-flex items-center border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide", MODULE_STYLE[module], className)}>{moduleLabel(module)}</span>;
}

export function DifficultyBadge({ difficulty }) {
  const variant = difficulty === "Hard" ? "default" : difficulty === "Medium" ? "outline" : "muted";
  return <Badge variant={variant}>{difficulty}</Badge>;
}

export function SectionTitle({ children, action, className }) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.1em]">{children}</h2>
      {action}
    </div>
  );
}
