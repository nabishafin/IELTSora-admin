import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/form-controls";

/**
 * Editable list of strings (steps, objectives, categories, questions…).
 * Supports add, inline edit, remove and optional reordering.
 */
export default function ListEditor({ items = [], onChange, placeholder = "Add an item", addLabel = "Add", multiline = false, reorderable = true, numbered = true, max }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  };
  const update = (i, v) => onChange(items.map((x, j) => (j === i ? v : x)));
  const remove = (i) => onChange(items.filter((_, j) => j !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const Field = multiline ? Textarea : Input;
  const full = max !== undefined && items.length >= max;

  return (
    <div className="grid gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          {numbered && <span className="mt-2.5 w-5 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{i + 1}.</span>}
          <Field value={item} onChange={(e) => update(i, e.target.value)} className={multiline ? "min-h-[60px]" : ""} aria-label={`Item ${i + 1}`} />
          <div className="flex shrink-0">
            {reorderable && (
              <>
                <Button type="button" variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                  <ArrowUp />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                  <ArrowDown />
                </Button>
              </>
            )}
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove">
              <X />
            </Button>
          </div>
        </div>
      ))}
      {!full && (
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder={placeholder}
          />
          <Button type="button" variant="outline" onClick={add} disabled={!draft.trim()}>
            <Plus /> {addLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
