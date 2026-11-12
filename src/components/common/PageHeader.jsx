import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PageHeader({ title, description, actions, back, eyebrow, className }) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="min-w-0">
        {back && (
          <Link to={back.to} className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-ink">
            <ArrowLeft className="h-3.5 w-3.5" /> {back.label}
          </Link>
        )}
        {eyebrow && <p className="label-xs mb-1.5">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h1>
        {description && <div className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
