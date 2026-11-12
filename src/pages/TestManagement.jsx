import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Eye, Save, Undo2, ListChecks, Headphones, BookOpen, PenLine, Mic, ChevronLeft, ChevronRight, RotateCcw, FileQuestion } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { FormField, SimpleSelect, EmptyState, SectionTitle } from "@/components/common/misc";
import ListEditor from "@/components/forms/ListEditor";
import { Input, Textarea, Switch, Label, Badge } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, ConfirmDialog } from "@/components/ui/overlays";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/hooks/useLocalStorage";
import { getDefaultTest } from "@/data/mockCambridge";
import { questionTypeLabel } from "@/data/mockQuestions";

const clone = (v) => JSON.parse(JSON.stringify(v));
const VISUALS = ["line graph", "bar chart", "pie charts", "table", "process diagram", "maps", "mixed charts"];
const words = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0);

function QuestionLink({ module, book, test, part, count }) {
  return (
    <Link to={`/questions?module=${module}&book=${book}&test=${test}&part=${part}`} className="inline-flex items-center gap-1.5 rounded bg-black/[0.05] px-2.5 py-1 text-xs font-medium hover:bg-black/[0.09]">
      <ListChecks className="h-3.5 w-3.5" /> {count} question{count === 1 ? "" : "s"}
    </Link>
  );
}

/** Student-style rendering used inside the preview dialog. */
function Preview({ tab, test, book, questions }) {
  const [part, setPart] = useState(1);
  const [answers, setAnswers] = useState({});
  const [essay, setEssay] = useState("");
  useEffect(() => setPart(1), [tab]);

  if (tab === "reading" || tab === "listening") {
    const item = tab === "reading" ? test.reading.find((r) => r.part === part) : test.listening.find((s) => s.section === part);
    const qs = questions.filter((q) => q.module === tab && q.part === part);
    const max = tab === "reading" ? 3 : 4;
    return (
      <div>
        <div className="mb-3 flex flex-wrap gap-1">
          {Array.from({ length: max }, (_, i) => i + 1).map((p) => (
            <Button key={p} size="sm" variant={p === part ? "default" : "secondary"} onClick={() => setPart(p)}>
              {tab === "reading" ? "Passage" : "Section"} {p}
            </Button>
          ))}
        </div>
        <div className="grid overflow-hidden rounded-lg border border-border bg-white md:grid-cols-2">
          <div className="max-h-[52vh] overflow-y-auto border-b border-border p-5 scrollbar-thin md:border-b-0 md:border-r">
            <p className="label-xs">{tab === "reading" ? `Passage ${part}` : `Section ${part}`}</p>
            <h3 className="mt-1 text-lg font-semibold">{item?.title}</h3>
            {tab === "listening" && (
              <div className="mt-3 rounded-lg border border-[#4F74A8]/20 bg-[#4F74A8]/5 p-3 text-xs">
                <p className="font-semibold">Sample audio slot: {item?.audioLabel}</p>
                <p className="mt-0.5 text-muted-foreground">No recording is bundled in this demo — the student app plays clearly labelled sample audio.</p>
              </div>
            )}
            <div className="mt-4 whitespace-pre-line text-sm leading-7">{tab === "reading" ? item?.text : item?.transcript}</div>
          </div>
          <div className="max-h-[52vh] overflow-y-auto p-5 scrollbar-thin">
            <p className="label-xs mb-3">Questions from the bank</p>
            {qs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No questions linked to this part yet.</p>
            ) : (
              <ol className="grid gap-4">
                {qs.map((q, i) => (
                  <li key={q.id} className="text-sm">
                    <p className="text-xs text-muted-foreground">{questionTypeLabel(q.type)}</p>
                    <p className="mt-1 font-medium">{i + 1}. {q.text}</p>
                    {q.options.length ? (
                      <div className="mt-2 grid gap-1">
                        {q.options.map((o) => (
                          <label key={o} className="flex cursor-pointer items-center gap-2 text-sm">
                            <input type="radio" name={q.id} checked={answers[q.id] === o} onChange={() => setAnswers({ ...answers, [q.id]: o })} className="accent-black" /> {o}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <Input className="mt-2 h-9" value={answers[q.id] || ""} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} placeholder="Type your answer" />
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    );
  }
  if (tab === "writing") {
    const task = part === 1 ? test.writing.task1 : test.writing.task2;
    const min = part === 1 ? 150 : 250;
    return (
      <div>
        <div className="mb-3 flex gap-1">
          {[1, 2].map((p) => <Button key={p} size="sm" variant={p === part ? "default" : "secondary"} onClick={() => setPart(p)}>Task {p}</Button>)}
        </div>
        <div className="grid overflow-hidden rounded-lg border border-border bg-white md:grid-cols-2">
          <div className="border-b border-border p-5 md:border-b-0 md:border-r">
            <p className="label-xs">Writing Task {part} · {part === 1 ? `Academic (${task.visual})` : "Essay"}</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-7">{task.prompt}</p>
            {part === 1 && <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-input text-xs text-muted-foreground">[{task.visual} visual]</div>}
          </div>
          <div className="p-5">
            <Textarea value={essay} onChange={(e) => setEssay(e.target.value)} className="min-h-[220px]" placeholder="Students write their response here…" />
            <p className="mt-2 text-xs text-muted-foreground">{words(essay)} words · minimum {min}</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      <div className="surface p-5">
        <p className="label-xs">Part 1 · Introduction and interview</p>
        <ol className="mt-3 grid gap-1.5 text-sm">{test.speaking.part1.map((q, i) => <li key={i}>{i + 1}. {q}</li>)}</ol>
      </div>
      <div className="surface-strong p-5">
        <p className="label-xs">Part 2 · Cue card · 1 min preparation, 2 min speaking</p>
        <p className="mt-3 font-semibold">{test.speaking.part2.cueCard}</p>
        <p className="mt-2 text-sm text-muted-foreground">You should say:</p>
        <ul className="mt-1 grid gap-1 text-sm">{test.speaking.part2.bullets.map((b, i) => <li key={i}>• {b}</li>)}</ul>
      </div>
      <div className="surface p-5">
        <p className="label-xs">Part 3 · Discussion</p>
        <ol className="mt-3 grid gap-1.5 text-sm">{test.speaking.part3.map((q, i) => <li key={i}>{i + 1}. {q}</li>)}</ol>
      </div>
    </div>
  );
}

export default function TestManagement() {
  const { bookId, testNo: testParam } = useParams();
  const bookNo = Number(String(bookId).replace(/^book-/, ""));
  const testNo = Number(testParam);
  const toast = useToast();
  const [books, setBooks] = useStore("cambridge");
  const [questions] = useStore("questions");
  const book = books.find((b) => b.number === bookNo);
  const stored = book?.tests.find((t) => t.testNo === testNo);
  const [draft, setDraft] = useState(() => (stored ? clone(stored) : null));
  const [tab, setTab] = useState("reading");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDefault, setConfirmDefault] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setDraft(stored ? clone(stored) : null);
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookNo, testNo]);

  const dirty = useMemo(() => draft && stored && JSON.stringify(draft) !== JSON.stringify(stored), [draft, stored]);
  const testQuestions = useMemo(() => questions.filter((q) => q.book === bookNo && q.test === testNo), [questions, bookNo, testNo]);

  if (!book || !stored || !draft) {
    return (
      <div>
        <PageHeader title="Test not found" back={{ to: "/cambridge", label: "Back to library" }} />
        <EmptyState icon={FileQuestion} title="This test does not exist" action={<Button asChild><Link to="/cambridge">Open Cambridge library</Link></Button>} />
      </div>
    );
  }

  const countFor = (module, part) => testQuestions.filter((q) => q.module === module && q.part === part).length;
  const setPartField = (module, idx, key, value) => setDraft((d) => ({ ...d, [module]: d[module].map((p, i) => (i === idx ? { ...p, [key]: value } : p)) }));
  const setNested = (path, value) =>
    setDraft((d) => {
      const n = clone(d);
      let o = n;
      path.slice(0, -1).forEach((k) => (o = o[k]));
      o[path[path.length - 1]] = value;
      return n;
    });

  const save = () => {
    const next = {};
    draft.reading.forEach((r) => {
      if (!r.title.trim()) next[`reading-${r.part}-title`] = "Title is required.";
      if (r.text.trim().length < 100) next[`reading-${r.part}-text`] = "Passage text should be at least 100 characters.";
    });
    draft.listening.forEach((s) => {
      if (!s.title.trim()) next[`listening-${s.section}-title`] = "Title is required.";
      if (s.transcript.trim().length < 50) next[`listening-${s.section}-transcript`] = "Transcript should be at least 50 characters.";
    });
    if (draft.writing.task1.prompt.trim().length < 30) next.task1 = "Task 1 prompt is too short.";
    if (draft.writing.task2.prompt.trim().length < 30) next.task2 = "Task 2 prompt is too short.";
    if (!draft.speaking.part2.cueCard.trim()) next.cue = "Cue card is required.";
    if (draft.speaking.part1.length < 2) next.part1 = "Add at least two Part 1 questions.";
    if (draft.speaking.part3.length < 2) next.part3 = "Add at least two Part 3 questions.";
    setErrors(next);
    if (Object.keys(next).length) {
      toast({ title: "Test not saved", description: `${Object.keys(next).length} field(s) need attention.`, variant: "error" });
      return;
    }
    setBooks((list) => list.map((b) => (b.number === bookNo ? { ...b, tests: b.tests.map((t) => (t.testNo === testNo ? draft : t)) } : b)));
    toast({ title: "Test saved", description: `Cambridge ${bookNo} · Test ${testNo}`, variant: "success" });
  };

  const err = (k) => errors[k];
  const fieldClass = (k) => (errors[k] ? "border-destructive" : "");

  return (
    <div>
      <PageHeader
        back={{ to: "/cambridge", label: "Back to library" }}
        eyebrow={book.title}
        title={`Test ${testNo}`}
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            {testQuestions.length} linked questions in the bank
            {dirty && <Badge variant="warning">Unsaved changes</Badge>}
          </span>
        }
        actions={
          <>
            <Button variant="secondary" size="icon" asChild disabled={testNo <= 1}>
              <Link to={testNo > 1 ? `/cambridge/${bookNo}/test/${testNo - 1}` : "#"} aria-label="Previous test" className={testNo <= 1 ? "pointer-events-none opacity-40" : ""}><ChevronLeft /></Link>
            </Button>
            <Button variant="secondary" size="icon" asChild>
              <Link to={testNo < 4 ? `/cambridge/${bookNo}/test/${testNo + 1}` : "#"} aria-label="Next test" className={testNo >= 4 ? "pointer-events-none opacity-40" : ""}><ChevronRight /></Link>
            </Button>
            <div className="flex h-10 items-center gap-2 rounded-lg border border-border px-3">
              <Label htmlFor="t-pub" className="text-xs">Published</Label>
              <Switch id="t-pub" checked={draft.published} onCheckedChange={(v) => setDraft({ ...draft, published: v })} />
            </div>
            <Button variant="secondary" onClick={() => setPreviewOpen(true)}><Eye /> Preview</Button>
            <Button variant="secondary" onClick={() => setDraft(clone(stored))} disabled={!dirty}><Undo2 /> Discard</Button>
            <Button onClick={save} disabled={!dirty}><Save /> Save test</Button>
          </>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="reading"><BookOpen className="h-4 w-4" /> Reading</TabsTrigger>
          <TabsTrigger value="listening"><Headphones className="h-4 w-4" /> Listening</TabsTrigger>
          <TabsTrigger value="writing"><PenLine className="h-4 w-4" /> Writing</TabsTrigger>
          <TabsTrigger value="speaking"><Mic className="h-4 w-4" /> Speaking</TabsTrigger>
        </TabsList>

        <TabsContent value="reading" className="grid gap-4">
          {draft.reading.map((r, i) => (
            <div key={r.part} className="surface p-5">
              <SectionTitle action={<QuestionLink module="reading" book={bookNo} test={testNo} part={r.part} count={countFor("reading", r.part)} />}>Passage {r.part}</SectionTitle>
              <div className="grid gap-4">
                <FormField label="Title" required error={err(`reading-${r.part}-title`)}>
                  <Input value={r.title} onChange={(e) => setPartField("reading", i, "title", e.target.value)} className={fieldClass(`reading-${r.part}-title`)} />
                </FormField>
                <FormField label="Passage text" required error={err(`reading-${r.part}-text`)} hint={`${words(r.text)} words · separate paragraphs with a blank line`}>
                  <Textarea value={r.text} onChange={(e) => setPartField("reading", i, "text", e.target.value)} className={`min-h-[220px] leading-6 ${fieldClass(`reading-${r.part}-text`)}`} />
                </FormField>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="listening" className="grid gap-4">
          {draft.listening.map((s, i) => (
            <div key={s.section} className="surface p-5">
              <SectionTitle action={<QuestionLink module="listening" book={bookNo} test={testNo} part={s.section} count={countFor("listening", s.section)} />}>Section {s.section}</SectionTitle>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Title" required error={err(`listening-${s.section}-title`)}>
                  <Input value={s.title} onChange={(e) => setPartField("listening", i, "title", e.target.value)} className={fieldClass(`listening-${s.section}-title`)} />
                </FormField>
                <FormField label="Audio file label" hint="Mock file name — no audio is uploaded in this demo.">
                  <Input value={s.audioLabel} onChange={(e) => setPartField("listening", i, "audioLabel", e.target.value)} />
                </FormField>
                <FormField className="md:col-span-2" label="Transcript" required error={err(`listening-${s.section}-transcript`)}>
                  <Textarea value={s.transcript} onChange={(e) => setPartField("listening", i, "transcript", e.target.value)} className={`min-h-[160px] font-mono text-xs leading-6 ${fieldClass(`listening-${s.section}-transcript`)}`} />
                </FormField>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="writing" className="grid gap-4">
          <div className="surface p-5">
            <SectionTitle>Writing Task 1 · Academic</SectionTitle>
            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              <FormField label="Visual type">
                <SimpleSelect value={draft.writing.task1.visual} onValueChange={(v) => setNested(["writing", "task1", "visual"], v)} options={VISUALS} />
              </FormField>
              <FormField label="Prompt" required error={err("task1")} hint={`${words(draft.writing.task1.prompt)} words`}>
                <Textarea value={draft.writing.task1.prompt} onChange={(e) => setNested(["writing", "task1", "prompt"], e.target.value)} className={`min-h-[120px] ${fieldClass("task1")}`} />
              </FormField>
            </div>
          </div>
          <div className="surface p-5">
            <SectionTitle>Writing Task 2 · Essay</SectionTitle>
            <FormField label="Prompt" required error={err("task2")} hint={`${words(draft.writing.task2.prompt)} words`}>
              <Textarea value={draft.writing.task2.prompt} onChange={(e) => setNested(["writing", "task2", "prompt"], e.target.value)} className={`min-h-[120px] ${fieldClass("task2")}`} />
            </FormField>
          </div>
        </TabsContent>

        <TabsContent value="speaking" className="grid gap-4 lg:grid-cols-3">
          <div className="surface p-5">
            <SectionTitle>Part 1 · Interview</SectionTitle>
            <FormField error={err("part1")}>
              <ListEditor items={draft.speaking.part1} onChange={(v) => setNested(["speaking", "part1"], v)} placeholder="Add a question" addLabel="Add" />
            </FormField>
          </div>
          <div className="surface p-5">
            <SectionTitle>Part 2 · Cue card</SectionTitle>
            <div className="grid gap-4">
              <FormField label="Cue card" required error={err("cue")}>
                <Textarea value={draft.speaking.part2.cueCard} onChange={(e) => setNested(["speaking", "part2", "cueCard"], e.target.value)} className={fieldClass("cue")} />
              </FormField>
              <FormField label="You should say…">
                <ListEditor items={draft.speaking.part2.bullets} onChange={(v) => setNested(["speaking", "part2", "bullets"], v)} placeholder="Add a bullet point" addLabel="Add" numbered={false} />
              </FormField>
            </div>
          </div>
          <div className="surface p-5">
            <SectionTitle>Part 3 · Discussion</SectionTitle>
            <FormField error={err("part3")}>
              <ListEditor items={draft.speaking.part3} onChange={(v) => setNested(["speaking", "part3"], v)} placeholder="Add a question" addLabel="Add" />
            </FormField>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => setConfirmDefault(true)}><RotateCcw /> Restore default demo content</Button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Practice preview · {tab[0].toUpperCase() + tab.slice(1)}</DialogTitle>
            <DialogDescription>Student-style rendering of the current draft for Cambridge {bookNo} Test {testNo}.</DialogDescription>
          </DialogHeader>
          <Preview tab={tab} test={draft} book={bookNo} questions={testQuestions} />
          <DialogFooter><Button variant="secondary" onClick={() => setPreviewOpen(false)}>Close preview</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDefault}
        onOpenChange={setConfirmDefault}
        title="Restore default content?"
        description="The draft will be replaced with the original demo content for this test. Click Save test to apply it."
        confirmLabel="Restore"
        onConfirm={() => {
          setDraft({ ...getDefaultTest(bookNo, testNo), published: draft.published });
          toast({ title: "Default content loaded", description: "Review and save to apply." });
        }}
      />
    </div>
  );
}
