import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, RotateCcw, AlertTriangle, Languages } from "lucide-react";
import { Input } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/overlays";
import { SimpleSelect } from "@/components/common/misc";
import { VOCAB_COLOR, VOCAB_TARGET, vocabIssues } from "@/components/common/DayPreview";
import { cn } from "@/lib/utils";

export const POS_OPTIONS = ["noun", "verb", "adjective", "adverb", "phrase"];
const blankWord = () => ({ word: "", pos: "noun", meaning: "", example: "" });
const GRID = "grid grid-cols-[28px_1.1fr_120px_1.6fr_1.8fr_108px] gap-2";

/**
 * Inline editor for a day's vocabulary ({ theme, words }).
 * Words can be added, edited in place, reordered and deleted (with confirmation).
 */
export default function VocabularyEditor({ vocabulary, onChange, onReset, highlight }) {
  const vocab = vocabulary || { theme: "", words: [] };
  const words = vocab.words || [];
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const issues = vocabIssues(vocab);

  const counts = {};
  words.forEach((w) => {
    const k = String(w.word || "").trim().toLowerCase();
    if (k) counts[k] = (counts[k] || 0) + 1;
  });
  const isDup = (w) => counts[String(w.word || "").trim().toLowerCase()] > 1;

  const setWords = (next) => onChange({ ...vocab, words: next });
  const updateWord = (i, k, v) => setWords(words.map((w, j) => (j === i ? { ...w, [k]: v } : w)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= words.length) return;
    const next = [...words];
    [next[i], next[j]] = [next[j], next[i]];
    setWords(next);
  };
  const complete = issues.length === 0;

  return (
    <section className={cn("surface p-5", highlight && !complete && "ring-2 ring-amber-400/60")}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${VOCAB_COLOR}1A`, color: VOCAB_COLOR }}>
            <Languages className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight">Vocabulary</h2>
            <p className="text-xs text-muted-foreground">Twenty words students learn on this day</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn("rounded px-2.5 py-1 text-xs font-semibold tabular-nums", !complete && "bg-amber-100 text-amber-900")}
            style={complete ? { background: `${VOCAB_COLOR}1A`, color: VOCAB_COLOR } : undefined}
          >
            {words.length} / {VOCAB_TARGET}
          </span>
          <Button type="button" size="sm" variant="outline" onClick={() => setConfirmReset(true)}>
            <RotateCcw /> Reset to default words
          </Button>
        </div>
      </div>

      <div className="mb-4 grid gap-1.5 sm:max-w-md">
        <label htmlFor="vocab-theme" className="text-sm font-medium">Theme</label>
        <Input id="vocab-theme" value={vocab.theme || ""} onChange={(e) => onChange({ ...vocab, theme: e.target.value })} placeholder="e.g. Education" />
      </div>

      {!complete && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-600/30 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <ul className="grid gap-0.5">{issues.map((m) => <li key={m}>{m}</li>)}</ul>
        </div>
      )}

      {words.length === 0 ? (
        <p className="rounded-lg border border-dashed border-input px-4 py-8 text-center text-sm text-muted-foreground">No words yet. Add words or reset to the default list.</p>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-[760px]">
            <div className={cn(GRID, "px-1 pb-2 text-xs font-medium text-muted-foreground")}>
              <span>#</span><span>Word</span><span>Part of speech</span><span>Meaning</span><span>Example</span><span className="text-right">Actions</span>
            </div>
            <ol className="grid gap-1.5">
              {words.map((w, i) => (
                <li key={i} className={cn(GRID, "items-center rounded-lg px-1 py-0.5 hover:bg-black/[0.02]")}>
                  <span className="text-right text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                  <Input value={w.word} onChange={(e) => updateWord(i, "word", e.target.value)} aria-label={`Word ${i + 1}`} className={cn("h-8", (!String(w.word).trim() || isDup(w)) && "border-destructive")} placeholder="word" />
                  <SimpleSelect value={w.pos || "noun"} onValueChange={(v) => updateWord(i, "pos", v)} options={POS_OPTIONS} className="h-8" />
                  <Input value={w.meaning} onChange={(e) => updateWord(i, "meaning", e.target.value)} aria-label={`Meaning ${i + 1}`} className={cn("h-8", !String(w.meaning).trim() && "border-destructive")} placeholder="meaning" />
                  <Input value={w.example || ""} onChange={(e) => updateWord(i, "example", e.target.value)} aria-label={`Example ${i + 1}`} className="h-8" placeholder="example sentence" />
                  <div className="flex justify-end">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move word up"><ArrowUp /></Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(i, 1)} disabled={i === words.length - 1} aria-label="Move word down"><ArrowDown /></Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteIdx(i)} aria-label="Delete word"><Trash2 /></Button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => setWords([...words, blankWord()])}>
        <Plus /> Add word
      </Button>

      <ConfirmDialog
        open={deleteIdx !== null}
        onOpenChange={(o) => !o && setDeleteIdx(null)}
        title="Delete this word?"
        description={deleteIdx !== null ? `"${words[deleteIdx]?.word || "Untitled word"}" will be removed when you save the day.` : ""}
        confirmLabel="Delete word"
        destructive
        onConfirm={() => setWords(words.filter((_, j) => j !== deleteIdx))}
      />
      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset to the default words?"
        description="The theme and all words for this day will be replaced with the default list. Nothing is saved until you click Save day."
        confirmLabel="Reset words"
        onConfirm={onReset}
      />
    </section>
  );
}
