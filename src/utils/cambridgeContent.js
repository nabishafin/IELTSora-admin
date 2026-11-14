/**
 * Cambridge practice content uploaded in the admin — one format for all four modules.
 *
 *   entry = { book, test, module, part, content, updatedAt }
 *
 *   reading   part 1–3  { id, title, lettered, paragraphs: [string], groups: [Group] }
 *   listening part 1–4  { id, title, context, audioUrl, speakers: { Name: Name }, lines: [[Name, text]], groups: [Group] }
 *   writing   part 1–2  { id, type: "academic-task-1" | "general-task-1" | "task-2", title, category, prompt, imageUrl }
 *   speaking  part 1, 3 { id, topic, questions: [string] }
 *   speaking  part 2    { id, topic, cue, bullets: [string], followUp }
 *
 *   Group = { type, instructions, heading?, imageUrl?, layout?, text?, table?, options?, showOptionList?,
 *             questions: [{ n, text, answer: [string], explanation, options? }] }
 *   "[[n]]" in text / table cells / question text is an inline answer box on the website.
 *
 * This is exactly the shape the student website renders. Each IELTS question type has its own editor
 * ("editor" below); toForm / fromForm convert between the editor form and the website format.
 */

import { getReadingPassage } from "@/data/website/reading";
import { getListeningSection } from "@/data/website/listening";
import { getCambridgeWriting } from "@/data/website/writing";
import { getCambridgeSpeaking } from "@/data/website/speaking";

export const CAMBRIDGE_MODULES = {
  reading: { label: "Reading", partLabel: "Passage", parts: 3 },
  listening: { label: "Listening", partLabel: "Section", parts: 4 },
  writing: { label: "Writing", partLabel: "Task", parts: 2 },
  speaking: { label: "Speaking", partLabel: "Part", parts: 3 },
};
export const MODULE_ORDER = ["reading", "listening", "writing", "speaking"];

export const WRITING_TYPES = [
  { value: "academic-task-1", label: "Academic Task 1" },
  { value: "general-task-1", label: "General Training Task 1" },
  { value: "task-2", label: "Task 2 essay" },
];

const TFNG = ["TRUE", "FALSE", "NOT GIVEN"];
const YNNG = ["YES", "NO", "NOT GIVEN"];
const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii"];
export const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const GAP = /_{3,}/g;

/**
 * editor:
 *   mcq        question + A–D choices
 *   statement  statement → fixed answers (TFNG / YNNG)
 *   headings   list of headings (i, ii…) · question = a paragraph letter → heading
 *   paragraph  information → paragraph letter (options come from the passage)
 *   list       option list (A, B…) · statement → letter
 *   map        map image + number of letters · place → letter
 *   gap        one line per question, "___" marks the gap
 *   summary    one paragraph with several "___" gaps, optional word bank
 *   table      table with "___" in cells
 */
export const GROUP_TYPES = [
  { type: "Multiple Choice", editor: "mcq", instructions: "Choose the correct letter, A, B, C or D." },
  { type: "True / False / Not Given", editor: "statement", fixed: TFNG, modules: ["reading"], instructions: "Do the following statements agree with the information given in the passage? Choose TRUE, FALSE or NOT GIVEN." },
  { type: "Yes / No / Not Given", editor: "statement", fixed: YNNG, modules: ["reading"], instructions: "Do the following statements agree with the views of the writer? Choose YES, NO or NOT GIVEN." },
  { type: "Matching Headings", editor: "headings", modules: ["reading"], instructions: "Choose the correct heading for each paragraph from the list of headings." },
  { type: "Matching Information", editor: "paragraph", modules: ["reading"], instructions: "Which paragraph contains the following information? Choose the correct letter." },
  { type: "Matching Features", editor: "list", instructions: "Match each statement with the correct option. You may use any letter more than once." },
  { type: "Matching", editor: "list", modules: ["listening"], instructions: "Choose the correct letter for each question." },
  { type: "Map Labelling", editor: "map", modules: ["listening"], instructions: "Label the map. Choose the correct letter." },
  { type: "Sentence Completion", editor: "gap", instructions: "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer." },
  { type: "Summary Completion", editor: "summary", layout: "summary", heading: true, instructions: "Complete the summary below. Write ONE WORD ONLY for each answer." },
  { type: "Note Completion", editor: "gap", layout: "notes", heading: true, instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer." },
  { type: "Form Completion", editor: "gap", layout: "form", heading: true, modules: ["listening"], instructions: "Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer." },
  { type: "Table Completion", editor: "table", layout: "table", heading: true, instructions: "Complete the table below. Write ONE WORD ONLY for each answer." },
  { type: "Flow-chart Completion", editor: "gap", layout: "flowchart", heading: true, instructions: "Complete the flow-chart below. Write ONE WORD ONLY for each answer." },
  { type: "Short Answer Questions", editor: "gap", instructions: "Answer the questions below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer." },
];
export const groupMeta = (type) => GROUP_TYPES.find((t) => t.type === type) || GROUP_TYPES[0];
export const typesFor = (module) => GROUP_TYPES.filter((t) => !t.modules || t.modules.includes(module));

const str = (v) => (v === null || v === undefined ? "" : String(v)).trim();
const list = (arr) => (Array.isArray(arr) ? arr.map(str).filter(Boolean) : []);
// Option prefixes are a capital letter ("A. ") or a roman numeral ("iv. ") — never a word like "Dr.".
const stripPrefix = (label) => str(label).replace(/^([A-Z]|[ivx]{1,4})\.\s+/, "");
const isUrl = (v) => /^https?:\/\//i.test(str(v));
export const gapCount = (text) => (String(text || "").match(GAP) || []).length;
export const tableGapCount = (table) => (table?.rows || []).reduce((n, r) => n + r.reduce((m, c) => m + gapCount(c), 0), 0);
/** How many numbered questions a form group produces. */
export function groupSize(g) {
  const editor = groupMeta(g.type).editor;
  if (editor === "summary") return gapCount(g.text);
  if (editor === "table") return tableGapCount(g.table);
  return g.questions.length;
}
/** Number of paragraphs in a reading passage form. */
export const paragraphCount = (text) => String(text || "").split(/\n\s*\n/).filter((p) => p.trim()).length;

/** Answer values a question in this group can take (null = typed answer). */
export function answerChoices(group, { paragraphs = 0 } = {}) {
  const meta = groupMeta(group.type);
  switch (meta.editor) {
    case "statement":
      return meta.fixed;
    case "headings":
      return ROMAN.slice(0, list(group.options).length);
    case "paragraph":
      return LETTERS.slice(0, paragraphs);
    case "list":
      return LETTERS.slice(0, list(group.options).length);
    case "map":
      return LETTERS.slice(0, Number(group.mapCount) || 0);
    case "summary":
      return list(group.options).length ? LETTERS.slice(0, list(group.options).length) : null;
    default:
      return null;
  }
}
/** Values shown next to option rows (i, ii… for headings, A, B… otherwise). */
export const optionValues = (type, count) => (groupMeta(type).editor === "headings" ? ROMAN : LETTERS).slice(0, count);

/** The built-in content the website shows for a slot when nothing has been uploaded (same format). */
export function defaultContent(module, book, test, part) {
  if (module === "reading") return getReadingPassage(book, test, part) || null;
  if (module === "listening") return getListeningSection(book, test, part) || null;
  if (module === "writing") return getCambridgeWriting(book, test)[part === 1 ? "task1" : "task2"] || null;
  if (module === "speaking") {
    const { part1, card } = getCambridgeSpeaking(book, test);
    if (part === 1) return { topic: part1.topic, questions: [...part1.questions] };
    if (part === 2) return { topic: card.topic, cue: card.cue, bullets: [...card.bullets], followUp: card.followUp };
    return { topic: card.topic, questions: [...card.part3] };
  }
  return null;
}

/** Stable ids the website uses in its routes (e.g. /app/writing/cam-21-1-w1). */
export const contentId = (module, book, test, part) => `cam-${book}-${test}-${{ reading: "r", listening: "l", writing: "w", speaking: "s" }[module]}${part}`;

export const blankQuestion = (editor) => ({ text: "", answer: "", explanation: "", choices: editor === "mcq" ? ["", "", "", ""] : [] });
export function blankGroup(module, type) {
  const t = type ? groupMeta(type) : typesFor(module)[0];
  return {
    type: t.type,
    instructions: t.instructions,
    heading: "",
    imageUrl: "",
    options: [],
    mapCount: 6,
    text: "",
    table: { headers: ["", ""], rows: [["", ""], ["", ""]] },
    gaps: [],
    questions: t.editor === "summary" || t.editor === "table" ? [] : [blankQuestion(t.editor)],
  };
}

export function blankForm(module, part) {
  if (module === "writing") return { type: part === 2 ? "task-2" : "academic-task-1", title: "", category: "", prompt: "", imageUrl: "" };
  if (module === "speaking") return part === 2 ? { topic: "", cue: "", bullets: [], followUp: "" } : { topic: "", questions: [] };
  return { title: "", text: "", lettered: module === "reading", audioUrl: "", context: "", transcript: "", groups: [blankGroup(module)] };
}

/* ------------------------------------------------------------------ website format → editor form */
const untoken = (t) => str(t).replace(/\[\[\d+\]\]/g, "___");

function groupToForm(g) {
  const meta = groupMeta(g.type);
  const form = { ...blankGroup(null, g.type), type: g.type, instructions: g.instructions || "", heading: g.heading || "", imageUrl: g.imageUrl || "" };
  const gapsFrom = (qs) => qs.map((q) => ({ answer: (q.answer || []).join(" | "), explanation: q.explanation || "" }));
  const qs = g.questions || [];
  switch (meta.editor) {
    case "summary":
      return { ...form, text: untoken(g.text), options: (g.options || []).map((o) => stripPrefix(o.label)), gaps: gapsFrom(qs), questions: [] };
    case "table":
      return { ...form, table: { headers: [...(g.table?.headers || [])], rows: (g.table?.rows || []).map((r) => r.map(untoken)) }, gaps: gapsFrom(qs), questions: [] };
    case "map":
      return { ...form, mapCount: (g.options || []).length || 6, mapGrid: Array.isArray(g.map) ? g.map : null, questions: qs.map((q) => ({ ...blankQuestion("map"), text: str(q.text), answer: (q.answer || [])[0] || "", explanation: q.explanation || "" })) };
    default:
      return {
        ...form,
        options: meta.editor === "headings" || meta.editor === "list" ? (g.options || []).map((o) => stripPrefix(o.label)) : [],
        questions: qs.map((q) => ({
          text: meta.editor === "headings" ? (/Paragraph\s+([A-Z])/.exec(q.text || "")?.[1] || "") : untoken(q.text),
          answer: meta.editor === "gap" ? (q.answer || []).join(" | ") : (q.answer || [])[0] || "",
          explanation: q.explanation || "",
          choices: meta.editor === "mcq" ? (q.options || []).map((o) => stripPrefix(o.label)) : [],
        })),
      };
  }
}

export function toForm(content, module, part) {
  if (!content) return blankForm(module, part);
  if (module === "writing") return { type: content.type, title: content.title || "", category: content.category || "", prompt: content.prompt || "", imageUrl: content.imageUrl || "", visual: content.visual || null };
  if (module === "speaking")
    return part === 2
      ? { topic: content.topic || "", cue: content.cue || "", bullets: [...(content.bullets || [])], followUp: content.followUp || "" }
      : { topic: content.topic || "", questions: [...(content.questions || [])] };
  return {
    title: content.title || "",
    text: (content.paragraphs || []).join("\n\n"),
    lettered: Boolean(content.lettered),
    audioUrl: content.audioUrl || "",
    context: content.context || "",
    transcript: (content.lines || []).map(([who, text]) => (who ? `${content.speakers?.[who] || who}: ${text}` : text)).join("\n"),
    groups: (content.groups || []).map(groupToForm),
  };
}

/* ------------------------------------------------------------------ editor form → website format */
function parseTranscript(text) {
  const lines = [];
  const speakers = {};
  let last = "";
  str(text)
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((l) => {
      const m = /^([^:]{1,30}):\s*(.+)$/.exec(l);
      const who = m ? m[1].trim() : last || "Speaker";
      speakers[who] = who;
      last = who;
      lines.push([who, m ? m[2].trim() : l]);
    });
  return { lines, speakers };
}

const answersOf = (value, choiceMode) => (choiceMode ? [str(value)].filter(Boolean) : str(value).split("|").map(str).filter(Boolean));
/** Sentence of `text` that contains token [[n]] (used as the question text in results). */
const sentenceWith = (text, n) => text.split(/(?<=[.!?])\s+/).find((s) => s.includes(`[[${n}]]`)) || `Gap ${n}`;

function buildGroups(groups, { paragraphs }) {
  let n = 0;
  return groups.map((g) => {
    const meta = groupMeta(g.type);
    const out = { type: g.type, instructions: str(g.instructions) || meta.instructions };
    if (meta.heading && str(g.heading)) out.heading = str(g.heading);
    if (meta.editor === "map" && str(g.imageUrl)) out.imageUrl = str(g.imageUrl);
    if (meta.layout) out.layout = meta.layout;
    if (meta.editor === "map" && !out.imageUrl && Array.isArray(g.mapGrid)) {
      out.layout = "map"; // built-in grid map, kept when no image is given
      out.map = g.mapGrid;
    }
    const choices = answerChoices(g, { paragraphs });

    switch (meta.editor) {
      case "summary": {
        const bank = list(g.options);
        if (bank.length) {
          out.options = bank.map((label, i) => ({ value: LETTERS[i], label: `${LETTERS[i]}. ${label}` }));
          out.showOptionList = true;
        }
        const first = n + 1;
        out.text = str(g.text).replace(GAP, () => `[[${++n}]]`);
        out.questions = Array.from({ length: n - first + 1 }, (_, i) => {
          const gap = g.gaps[i] || {};
          return { n: first + i, text: sentenceWith(out.text, first + i), answer: answersOf(gap.answer, bank.length), explanation: str(gap.explanation) };
        });
        return out;
      }
      case "table": {
        const headers = g.table.headers.map(str);
        const first = n + 1;
        const cellOf = {};
        const rows = g.table.rows.map((r) =>
          r.map((cell, ci) =>
            str(cell).replace(GAP, () => {
              n += 1;
              cellOf[n] = headers[ci] || `Column ${ci + 1}`;
              return `[[${n}]]`;
            })
          )
        );
        out.table = { headers, rows };
        out.questions = Array.from({ length: n - first + 1 }, (_, i) => {
          const gap = g.gaps[i] || {};
          return { n: first + i, text: `${cellOf[first + i]}: ___`, answer: answersOf(gap.answer, false), explanation: str(gap.explanation) };
        });
        return out;
      }
      case "statement":
        out.options = meta.fixed.map((v) => ({ value: v, label: v }));
        break;
      case "headings":
        out.options = list(g.options).map((label, i) => ({ value: ROMAN[i], label: `${ROMAN[i]}. ${label}` }));
        out.showOptionList = true;
        break;
      case "paragraph":
        out.options = choices.map((v) => ({ value: v, label: `Paragraph ${v}` }));
        break;
      case "list":
        out.options = list(g.options).map((label, i) => ({ value: LETTERS[i], label: `${LETTERS[i]}. ${label}` }));
        out.showOptionList = true;
        break;
      case "map":
        out.options = choices.map((v) => ({ value: v, label: v }));
        break;
      default:
    }

    out.questions = g.questions.map((q) => {
      n += 1;
      const question = { n, text: str(q.text), answer: [], explanation: str(q.explanation) };
      if (meta.editor === "gap") {
        question.text = question.text.replace(/_{3,}/, `[[${n}]]`);
        question.answer = answersOf(q.answer, false);
      } else if (meta.editor === "mcq") {
        question.options = list(q.choices).map((c, i) => ({ value: LETTERS[i], label: `${LETTERS[i]}. ${c}` }));
        question.answer = answersOf(q.answer, true);
      } else {
        if (meta.editor === "headings") question.text = `Paragraph ${str(q.text)}`;
        question.answer = answersOf(q.answer, true);
      }
      return question;
    });
    return out;
  });
}

export function fromForm(form, module, { book, test, part }) {
  const id = contentId(module, book, test, part);
  if (module === "writing") {
    const out = { id, type: form.type, title: str(form.title), category: str(form.category) || WRITING_TYPES.find((t) => t.value === form.type)?.label || "", prompt: str(form.prompt) };
    if (str(form.imageUrl)) out.imageUrl = str(form.imageUrl);
    if (form.visual) out.visual = form.visual; // built-in live chart, kept as-is
    return out;
  }
  if (module === "speaking")
    return part === 2
      ? { id, topic: str(form.topic), cue: str(form.cue), bullets: list(form.bullets), followUp: str(form.followUp) }
      : { id, topic: str(form.topic), questions: list(form.questions) };
  const paragraphs = paragraphCount(form.text);
  if (module === "reading") {
    return { id, title: str(form.title), lettered: Boolean(form.lettered), paragraphs: str(form.text).split(/\n\s*\n/).map(str).filter(Boolean), groups: buildGroups(form.groups, { paragraphs }) };
  }
  const { lines, speakers } = parseTranscript(form.transcript);
  return { id, title: str(form.title), context: str(form.context), audioUrl: str(form.audioUrl), speakers, lines, groups: buildGroups(form.groups, { paragraphs: 0 }) };
}

/* ------------------------------------------------------------------ validation (short messages on purpose) */
function validateGroup(g, at, { paragraphs, lettered }) {
  const meta = groupMeta(g.type);
  const errors = [];
  const choices = answerChoices(g, { paragraphs });
  const inChoices = (v) => !choices || choices.includes(str(v));

  if (meta.editor === "summary" || meta.editor === "table") {
    const gaps = meta.editor === "summary" ? gapCount(g.text) : tableGapCount(g.table);
    if (meta.editor === "table" && g.table.headers.some((h) => !str(h))) errors.push(`${at}: fill every column title.`);
    if (!gaps) errors.push(`${at}: add at least one ___ gap.`);
    for (let i = 0; i < gaps; i++) {
      const a = g.gaps[i]?.answer;
      if (!str(a)) errors.push(`${at}, gap ${i + 1}: answer is required.`);
      else if (!inChoices(a)) errors.push(`${at}, gap ${i + 1}: answer must be a word-bank letter.`);
    }
    return errors;
  }

  if (meta.editor === "headings" || meta.editor === "list") {
    if (list(g.options).length < 2) errors.push(`${at}: add at least 2 options.`);
  }
  if (meta.editor === "headings" || meta.editor === "paragraph") {
    if (!lettered) errors.push(`${at}: turn on "Paragraphs A, B, C…".`);
    if (paragraphs < 2) errors.push(`${at}: the passage needs at least 2 paragraphs.`);
  }
  if (meta.editor === "map") {
    if (!isUrl(g.imageUrl) && !Array.isArray(g.mapGrid)) errors.push(`${at}: add the map image link.`);
    if (!(Number(g.mapCount) >= 2)) errors.push(`${at}: set the number of letters.`);
  }
  if (!g.questions.length) errors.push(`${at}: add a question.`);
  g.questions.forEach((q, qi) => {
    const where = `${at}, Q${qi + 1}`;
    if (!str(q.text)) errors.push(meta.editor === "headings" ? `${where}: choose the paragraph.` : `${where}: text is required.`);
    if (!str(q.answer)) errors.push(`${where}: answer is required.`);
    else if (meta.editor === "mcq") {
      const n = list(q.choices).length;
      if (n < 2) errors.push(`${where}: add at least 2 choices.`);
      else if (!LETTERS.slice(0, n).includes(str(q.answer))) errors.push(`${where}: answer must be a choice letter.`);
    } else if (!inChoices(q.answer)) errors.push(`${where}: answer is not one of the options.`);
  });
  return errors;
}

export function validateForm(form, module, part) {
  const errors = [];
  if (module === "writing") {
    if (!str(form.title)) errors.push("Title is required.");
    if (str(form.prompt).length < 20) errors.push("Prompt is required.");
    if (str(form.imageUrl) && !isUrl(form.imageUrl)) errors.push("Image link must start with https://");
    return errors;
  }
  if (module === "speaking") {
    if (!str(form.topic)) errors.push("Topic is required.");
    if (part === 2) {
      if (!str(form.cue)) errors.push("Cue card is required.");
      if (list(form.bullets).length < 2) errors.push("Add at least 2 bullet points.");
    } else if (list(form.questions).length < 2) errors.push("Add at least 2 questions.");
    return errors;
  }

  if (!str(form.title)) errors.push("Title is required.");
  if (module === "reading" && !str(form.text)) errors.push("Passage text is required.");
  if (module === "listening") {
    if (!str(form.audioUrl) && !str(form.transcript)) errors.push("Add an audio link or a transcript.");
    if (str(form.audioUrl) && !isUrl(form.audioUrl)) errors.push("Audio link must start with https://");
  }
  if (!form.groups.length) errors.push("Add a question group.");
  const ctx = { paragraphs: paragraphCount(form.text), lettered: Boolean(form.lettered) };
  form.groups.forEach((g, gi) => errors.push(...validateGroup(g, `Group ${gi + 1}`, ctx)));
  return errors.slice(0, 8);
}

/** Short summary shown in the list, e.g. "13 Q" or "Opinion essay". */
export function summaryOf(entry) {
  const c = entry.content;
  if (entry.module === "writing") return c.category || WRITING_TYPES.find((t) => t.value === c.type)?.label || "";
  if (entry.module === "speaking") return entry.part === 2 ? "Cue card" : `${c.questions?.length || 0} questions`;
  return `${(c.groups || []).reduce((n, g) => n + (g.questions?.length || 0), 0)} Q`;
}
export const titleOf = (entry) => entry.content.title || entry.content.topic || "";
export const entryKey = (e) => `${e.module}:${e.book}:${e.test}:${e.part}`;

/* ------------------------------------------------------------------ export / import */
const shapeOk = (e) => {
  const c = e.content;
  if (!c || typeof c !== "object") return false;
  if (e.module === "reading" || e.module === "listening") return Boolean(str(c.title)) && Array.isArray(c.groups);
  if (e.module === "writing") return Boolean(str(c.prompt)) && WRITING_TYPES.some((t) => t.value === c.type);
  if (e.module === "speaking") return Number(e.part) === 2 ? Boolean(str(c.cue)) : Array.isArray(c.questions);
  return false;
};

export function sanitizeCambridge(entries) {
  return (Array.isArray(entries) ? entries : [])
    .filter((e) => e && CAMBRIDGE_MODULES[e.module] && shapeOk(e))
    .map((e) => ({ book: Number(e.book), test: Number(e.test), module: e.module, part: Number(e.part), content: e.content, updatedAt: e.updatedAt || null }))
    .sort((a, b) => a.book - b.book || a.test - b.test || MODULE_ORDER.indexOf(a.module) - MODULE_ORDER.indexOf(b.module) || a.part - b.part);
}

export function validateCambridge(entries) {
  if (entries === undefined || entries === null) return [];
  if (!Array.isArray(entries)) return ["cambridge must be an array."];
  const errors = [];
  entries.forEach((e, i) => {
    const where = `cambridge[${i}]`;
    const meta = e && CAMBRIDGE_MODULES[e.module];
    if (!meta) return errors.push(`${where}: unknown module.`);
    if (!Number.isInteger(Number(e.book)) || !(Number(e.test) >= 1 && Number(e.test) <= 4)) errors.push(`${where}: invalid book or test.`);
    if (!(Number(e.part) >= 1 && Number(e.part) <= meta.parts)) errors.push(`${where}: invalid part.`);
    if (!shapeOk(e)) errors.push(`${where}: content is incomplete.`);
  });
  return errors;
}
