import { Clock, Target, BookOpen, Languages } from "lucide-react";
import { ModuleBadge, DifficultyBadge } from "@/components/common/misc";
import { Badge } from "@/components/ui/form-controls";
import { MODULE_KEYS } from "@/utils/constants";

export const sourceLabel = (source, module) => {
  if (!source || !source.book) return null;
  const partName = module === "reading" ? "Passage" : module === "listening" ? "Section" : "Part";
  const part = source.part === null || source.part === undefined || source.part === "" || source.part === "full" ? "Full test" : `${partName} ${source.part}`;
  return `Cambridge IELTS ${source.book} · Test ${source.test} · ${part}`;
};

export const missingModules = (day) => MODULE_KEYS.filter((m) => !day.tasks.some((t) => t.module === m));

export const VOCAB_TARGET = 20;
export const VOCAB_COLOR = "#4E8A8A";
export const vocabCount = (day) => day.vocabulary?.words?.length || 0;

/** Problems that stop a day being published: exactly 20 words, each with word + meaning, no duplicates. */
export function vocabIssues(vocab) {
  const words = vocab?.words || [];
  const issues = [];
  if (words.length !== VOCAB_TARGET) issues.push(`The day needs exactly ${VOCAB_TARGET} vocabulary words (currently ${words.length}).`);
  const incomplete = words.filter((w) => !String(w.word || "").trim() || !String(w.meaning || "").trim()).length;
  if (incomplete) issues.push(`${incomplete} word(s) are missing the word or its meaning.`);
  const seen = new Set();
  const dups = new Set();
  words.forEach((w) => {
    const k = String(w.word || "").trim().toLowerCase();
    if (!k) return;
    if (seen.has(k)) dups.add(k);
    seen.add(k);
  });
  if (dups.size) issues.push(`Duplicate word(s): ${[...dups].join(", ")}.`);
  return issues;
}

/** Student-style rendering of a study-plan day (used in preview dialogs). */
export default function DayPreview({ day }) {
  const total = day.tasks.reduce((n, t) => n + (Number(t.duration) || 0), 0);
  const missing = missingModules(day);
  return (
    <div className="grid gap-5">
      <div className="border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Day {String(day.day).padStart(2, "0")}</Badge>
          <Badge variant="outline">{day.phase}</Badge>
          {!day.published && <Badge variant="warning">Unpublished</Badge>}
        </div>
        <h3 className="mt-3 text-xl font-semibold tracking-tight">{day.title || "Untitled day"}</h3>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> Estimated study time: {Math.floor(total / 60)}h {total % 60}m · {day.tasks.length} tasks
        </p>
      </div>
      {day.objectives?.length > 0 && (
        <div>
          <p className="label-xs mb-2 inline-flex items-center gap-1.5"><Target className="h-3 w-3" /> Learning objectives</p>
          <ul className="grid gap-1.5 text-sm">
            {day.objectives.map((o, i) => (
              <li key={i} className="flex gap-2"><span className="text-muted-foreground">—</span>{o}</li>
            ))}
          </ul>
        </div>
      )}
      {missing.length > 0 && (
        <p className="rounded-lg border border-amber-600/30 bg-amber-50 px-3 py-2 text-xs text-amber-900">Missing required module task(s): {missing.join(", ")}.</p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {day.tasks.map((t) => (
          <div key={t.id} className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <ModuleBadge module={t.module} />
              <span className="text-xs tabular-nums text-muted-foreground">{t.duration} min</span>
            </div>
            <p className="mt-3 text-sm font-semibold leading-snug">{t.title}</p>
            {sourceLabel(t.source, t.module) && (
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><BookOpen className="h-3 w-3" />{sourceLabel(t.source, t.module)}</p>
            )}
            <ul className="mt-3 grid gap-1 text-xs text-muted-foreground">
              {(t.steps || []).map((s, i) => (
                <li key={i} className="flex gap-1.5"><span>{i + 1}.</span>{s}</li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <DifficultyBadge difficulty={t.difficulty} />
              <span className="h-8 rounded-md bg-ink px-3 text-xs font-medium leading-8 text-white">Start practice</span>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="inline-flex items-center gap-2 text-sm font-semibold">
            <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold" style={{ background: `${VOCAB_COLOR}1A`, color: VOCAB_COLOR }}>
              <Languages className="h-3 w-3" /> Vocabulary
            </span>
            {day.vocabulary?.theme || "No theme"}
          </p>
          <span className="text-xs tabular-nums text-muted-foreground">{vocabCount(day)} / {VOCAB_TARGET} words</span>
        </div>
        {vocabCount(day) === 0 ? (
          <p className="mt-3 text-xs text-muted-foreground">No vocabulary for this day.</p>
        ) : (
          <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
            {day.vocabulary.words.map((w, i) => (
              <li key={i} className="flex gap-2">
                <span className="w-5 shrink-0 text-right tabular-nums text-muted-foreground">{i + 1}.</span>
                <span className="min-w-0">
                  <strong className="font-semibold">{w.word}</strong> <em className="text-muted-foreground">{w.pos}</em>
                  <span className="text-muted-foreground"> — {w.meaning}</span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
