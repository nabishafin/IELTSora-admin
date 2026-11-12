import { cn } from "@/lib/utils";
import { CHART } from "@/utils/constants";

export function ChartCard({ title, description, children, className, action, legend }) {
  return (
    <div className={cn("flex flex-col border border-border bg-white", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 pb-2">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {legend && <div className="px-5">{legend}</div>}
      <div className="flex-1 px-2 pb-4 pt-2">{children}</div>
    </div>
  );
}

/** Legend for gray-scale series; dashed swatch doubles as secondary encoding. */
export function ChartLegend({ items }) {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-0 w-4"
            style={{ borderTop: `2px ${it.dashed ? "dashed" : "solid"} ${it.color}` }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}

export function ChartTooltip({ active, payload, label, formatter, labelFormatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-ink bg-white px-3 py-2 text-xs shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
      <p className="mb-1 font-semibold">{labelFormatter ? labelFormatter(label) : label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center justify-between gap-4 text-muted-foreground">
          <span>{p.name}</span>
          <span className="font-semibold tabular-nums text-ink">{formatter ? formatter(p.value, p) : p.value}</span>
        </p>
      ))}
    </div>
  );
}

export const axisProps = {
  stroke: CHART.mid,
  tick: { fontSize: 11, fill: CHART.mid },
  tickLine: false,
  axisLine: { stroke: CHART.faint },
};

export const gridProps = { stroke: CHART.grid, vertical: false };
