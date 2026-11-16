/*
 * Complete 60-day IELTS preparation plan. Every day has exactly four tasks (Reading, Listening,
 * Writing, Speaking). Content is generated from hand-written, phase-specific focus lists so that
 * every day is distinct and difficulty rises progressively.
 *
 * Task shape (shared with the admin dashboard export format "ieltsora-content-v1"):
 *  { id, module, title, source: {book,test,part}|null, steps: [], duration, difficulty, practice? }
 */
import { WRITING_PROMPTS } from "./writing";
import { CUE_CARDS, PART1_SETS } from "./speaking";
import { getDayVocabulary } from "@/data/vocabulary";

export const PHASES = [
  { key: "Foundation", name: "Foundation", range: [1, 20], description: "Learn the exam format, every question type and core vocabulary and grammar." },
  { key: "Skill Development", name: "Skill Development", range: [21, 40], description: "Complete passages and sections, build coherent writing and fluent speaking under time." },
  { key: "Exam Preparation", name: "Exam Preparation", range: [41, 60], description: "Full-length timed tests, weakness analysis, time management and final mock exams." },
];

export const phaseOf = (day) => (day <= 20 ? "Foundation" : day <= 40 ? "Skill Development" : "Exam Preparation");

const TITLES = [
  // Phase 1
  "IELTS Foundation", "Skimming & Scanning", "True / False / Not Given", "Listening for Details", "Describing Trends",
  "Building Topic Vocabulary", "Paragraph Structure", "Multiple Choice Strategies", "Paraphrase Awareness", "Matching Headings",
  "Pie Charts & Proportions", "Opinion Essays", "Tables & Data", "Discussion Essays", "Processes & Sequences",
  "Problem–Solution Essays", "Letter Writing", "Grammar for Band 6+", "Grouping Information", "Foundation Review",
  // Phase 2
  "Timed Passage Practice", "Full Listening Sections", "Coherence & Cohesion", "Fluency Under Pressure", "Lexical Precision",
  "Complex Sentences", "Writer's Views", "Lecture Note-Taking", "Task 1 Under Time", "Task 2 Under Time",
  "Mistake Analysis I", "Collocations", "Map & Plan Labelling", "Argument Development", "Speaking Part 3 Depth",
  "Summary with Word Lists", "Mixed Question Sets", "Pronunciation & Stress", "Mistake Analysis II", "Skill Development Review",
  // Phase 3
  "Full Mock Test 1", "Weakness Diagnosis", "Time Management", "Cambridge Full Test Day", "Accuracy Drills",
  "Full Mock Test 2", "Band 7 Writing Features", "Listening Section 4 Mastery", "Passage 3 Strategy", "Full Mock Test 3",
  "Speaking Mock Interview", "Error Log Clean-up", "Full Mock Test 4", "Exam-Day Simulation", "Targeted Revision: Reading",
  "Targeted Revision: Listening", "Targeted Revision: Writing", "Final Mock Exam", "Final Review & Strategy", "Exam Readiness",
];

const READING_FOCUS = [
  "Understand the Academic Reading format", "Skim for gist, scan for detail", "True / False / Not Given logic", "Note completion strategy",
  "Short-answer questions and word limits", "Table completion", "Sentence completion", "Multiple-choice elimination",
  "Spotting paraphrase", "Matching headings to paragraphs", "Matching information", "Summary completion",
  "Flow-chart completion", "Yes / No / Not Given vs TFNG", "Matching features", "Guessing vocabulary from context",
  "Reading longer paragraphs efficiently", "Single passage in 20 minutes", "Building an error log", "Foundation reading check-in",
  "Full passage in 20 minutes", "Headings with tricky distractors", "Writer's opinion questions", "Locating answers quickly",
  "Summary completion with word lists", "Complex sentence comprehension", "Writer's views and claims", "Matching features under time",
  "Passage 2 at exam speed", "Passage 3 at exam speed", "Reviewing wrong answers by type", "Academic collocations in context",
  "Mixed TFNG and MCQ sets", "Following an argument across paragraphs", "Inference questions", "Summary with distractor words",
  "Mixed question sets", "Speed reading drills", "Second error-log review", "Skill development reading check-in",
  "Full timed reading test (60 min)", "Diagnose weakest question type", "Time-split strategy: 17/20/23 minutes", "Cambridge full reading test",
  "Accuracy: spelling and word limits", "Full timed reading test (60 min)", "Transfer-time discipline", "Speed + accuracy drill",
  "Passage 3 strategy under pressure", "Full timed reading test (60 min)", "Short targeted passage review", "Clean up the error log",
  "Full timed reading test (60 min)", "Exam-day simulation", "Targeted revision: weakest type", "Light passage review",
  "Light reading maintenance", "Final mock reading test (60 min)", "Final strategy recap", "Confidence passage",
];

const LISTENING_FOCUS = [
  "Understand the Listening format", "Section 1: names, numbers and spelling", "Predicting answers before listening", "Section 1 form completion",
  "Section 2: monologues in social contexts", "Multiple-choice distractors", "Section 1 full practice", "Section 2 map language",
  "Signpost words", "Section 2 matching", "Dates, times and prices", "Section 1 under time",
  "Section 2 under time", "Synonyms in listening", "Section 1 review", "Section 2 review",
  "Spelling accuracy drill", "Section 1 + 2 combined", "Error log for listening", "Foundation listening check-in",
  "Section 3: academic discussions", "Section 3 multiple choice", "Section 4: lecture structure", "Section 4 note completion",
  "Section 3 matching opinions", "Section 4 under time", "Section 3 under time", "Lecture note-taking",
  "Speaker attitude and agreement", "Section 4 with transcript review", "Mistake analysis by section", "Section 3 + 4 combined",
  "Map and plan labelling", "Fast speech and accents", "Section 4 vocabulary", "Section 3 full practice",
  "Mixed sections", "Concentration stamina", "Second error-log review", "Skill development listening check-in",
  "Full timed listening test (40 min)", "Diagnose weakest section", "Using reading time wisely", "Cambridge full listening test",
  "Accuracy: plurals and spelling", "Full timed listening test (40 min)", "Section 3 speaker tracking", "Section 4 mastery",
  "Section 2 maps under pressure", "Full timed listening test (40 min)", "Short targeted section review", "Clean up the error log",
  "Full timed listening test (40 min)", "Exam-day simulation", "Targeted revision: weakest section", "Section 4 mastery review",
  "Light listening maintenance", "Final mock listening test (40 min)", "Final strategy recap", "Confidence section",
];

const WRITING_PLAN = [
  ["Academic Task 1 introduction: paraphrasing the question", "at1-1"],
  ["Task 2 question types: recognising opinion essays", "t2-1"],
  ["Task 1 overview: identifying key features", "at1-2"],
  ["Task 2 introduction paragraphs", "t2-2"],
  ["General Training letter: formal tone", "gt1-1"],
  ["Task 1 language for trends", "at1-1"],
  ["Task 2 body paragraphs: point, explain, example", "t2-3"],
  ["Task 1 comparisons", "at1-6"],
  ["Task 2 conclusions", "t2-4"],
  ["Task 1 pie charts and proportions", "at1-3"],
  ["General Training letter: informal tone", "gt1-2"],
  ["Task 2 – Opinion Essay", "t2-1"],
  ["Task 1 tables", "at1-4"],
  ["Task 2 discussion essays", "t2-5"],
  ["Task 1 process diagrams", "at1-5"],
  ["Task 2 problem–solution essays", "t2-6"],
  ["General Training letter: semi-formal requests", "gt1-3"],
  ["Task 2 advantages and disadvantages", "t2-7"],
  ["Task 1 grouping data logically", "at1-2"],
  ["Foundation review: Task 1 + Task 2 plan", "t2-8"],
  ["Task 1 in 20 minutes", "at1-3"],
  ["Task 2 coherence: paragraph flow", "t2-9"],
  ["Cohesive devices without overuse", "t2-10"],
  ["General Training letter in 20 minutes", "gt1-4"],
  ["Lexical precision in Task 2", "t2-11"],
  ["Complex sentences for Task 1", "at1-4"],
  ["Task 2 two-part questions", "t2-9"],
  ["Task 1 process in 20 minutes", "at1-5"],
  ["Task 1 under time", "at1-6"],
  ["Task 2 under time (40 min)", "t2-12"],
  ["Mistake analysis: rewrite an old essay", "t2-1"],
  ["Collocations for common topics", "t2-3"],
  ["General Training complaint letter", "gt1-5"],
  ["Developing arguments with examples", "t2-2"],
  ["Task 1 overview precision", "at1-1"],
  ["Task 2 counter-arguments", "t2-4"],
  ["Mixed Task 1 practice", "at1-2"],
  ["Grammar range checklist", "t2-5"],
  ["Mistake analysis II: grammar errors", "t2-6"],
  ["Skill development review essay", "t2-7"],
  ["Full Writing Test 1 (Task 1 + Task 2)", "t2-8"],
  ["Diagnose weakest criterion", "t2-9"],
  ["Time management: 20 + 40 minutes", "t2-10"],
  ["Cambridge full writing test", "t2-11"],
  ["Accuracy: proofreading in 3 minutes", "at1-3"],
  ["Full Writing Test 2", "t2-12"],
  ["Band 7 writing features", "t2-2"],
  ["General Training letter under time", "gt1-6"],
  ["Task 1 data selection", "at1-4"],
  ["Full Writing Test 3", "t2-3"],
  ["Task 2 planning in 5 minutes", "t2-4"],
  ["Error log clean-up: rewrite paragraphs", "t2-5"],
  ["Full Writing Test 4", "t2-6"],
  ["Exam-day simulation: writing", "t2-7"],
  ["Targeted revision: Task 1", "at1-6"],
  ["Targeted revision: Task 2", "t2-1"],
  ["Targeted revision: weakest essay type", "t2-11"],
  ["Final Mock Writing Test", "t2-12"],
  ["Final review: templates and checklists", "at1-5"],
  ["Confidence essay", "t2-8"],
];

const SPEAKING_FOCUS = [
  ["Part 1 introduction questions", "part1"], ["Part 1: extending short answers", "part1"], ["Part 2: understanding the cue card", "part2"],
  ["Part 1: talking about familiar topics", "part1"], ["Part 3: giving opinions", "part3"], ["Part 2: using your one minute", "part2"],
  ["Part 1: fluency practice", "part1"], ["Part 2: structuring a long turn", "part2"], ["Part 3: reasons and examples", "part3"],
  ["Part 1: natural vocabulary", "part1"], ["Part 2: describing places", "part2"], ["Part 2 – Cue Card", "part2"],
  ["Part 3: comparing past and present", "part3"], ["Part 1: pronunciation focus", "part1"], ["Part 2: describing people", "part2"],
  ["Part 3: speculating about the future", "part3"], ["Part 1: speaking about routines", "part1"], ["Part 2: describing events", "part2"],
  ["Part 3: balanced answers", "part3"], ["Foundation speaking check-in", "part2"],
  ["Part 2: full two minutes", "part2"], ["Part 3: extended answers", "part3"], ["Part 1: fluency under time", "part1"],
  ["Fluency under pressure", "part2"], ["Topic vocabulary upgrade", "part3"], ["Complex structures in speech", "part2"],
  ["Part 3: agreeing and disagreeing", "part3"], ["Part 2: storytelling", "part2"], ["Part 1: idiomatic language", "part1"],
  ["Part 3: abstract topics", "part3"], ["Mistake analysis: recorded answers", "part2"], ["Collocations in speech", "part1"],
  ["Part 2: describing objects", "part2"], ["Part 3: problem-solving answers", "part3"], ["Part 3 depth practice", "part3"],
  ["Part 2: unexpected topics", "part2"], ["Mixed Parts 1–3", "part1"], ["Pronunciation & word stress", "part2"],
  ["Mistake analysis II", "part3"], ["Skill development speaking review", "part2"],
  ["Full Speaking Mock 1", "part2"], ["Diagnose weakest criterion", "part3"], ["Timing a full interview", "part1"],
  ["Cambridge full speaking test", "part2"], ["Accuracy: tense control", "part3"], ["Full Speaking Mock 2", "part2"],
  ["Band 7 speaking features", "part3"], ["Part 1 quick-fire practice", "part1"], ["Part 2 under exam conditions", "part2"],
  ["Full Speaking Mock 3", "part3"], ["Speaking Mock Interview", "part2"], ["Error log: repeated mistakes", "part1"],
  ["Full Speaking Mock 4", "part3"], ["Exam-day simulation: speaking", "part2"], ["Targeted revision: fluency", "part1"],
  ["Targeted revision: vocabulary", "part3"], ["Targeted revision: pronunciation", "part2"], ["Final Speaking Mock", "part2"],
  ["Final review: confidence tips", "part3"], ["Exam readiness interview", "part1"],
];

function difficultyFor(day) {
  if (day <= 14) return "Easy";
  if (day <= 34) return "Medium";
  return "Hard";
}

function buildDay(day) {
  const i = day - 1;
  const phase = phaseOf(day);
  const p = phase === "Foundation" ? 1 : phase === "Skill Development" ? 2 : 3;
  const difficulty = difficultyFor(day);
  const fullTest = p === 3 && /Full|Mock|Cambridge full|simulation/i.test(READING_FOCUS[i]);

  // Reading source: books cycle 10 → 21 across the 60 days, five days per book.
  const rBook = 10 + Math.floor(i / 5);
  const rTest = (i % 4) + 1;
  const rPart = p === 1 ? [1, 1, 2][i % 3] : p === 2 ? [2, 3][i % 2] : [1, 2, 3][i % 3];
  // Listening source: offset so reading and listening use different tests on the same day.
  const lBook = 10 + Math.floor(i / 5);
  const lTest = ((i + 1) % 4) + 1;
  const lSection = p === 1 ? [1, 2][i % 2] : p === 2 ? [3, 4][i % 2] : [1, 2, 3, 4][i % 4];
  const lFull = p === 3 && /Full|Mock|Cambridge full|simulation/i.test(LISTENING_FOCUS[i]);

  let reading = {
    id: `d${day}-reading`,
    module: "reading",
    title: fullTest ? `Cambridge IELTS ${rBook} · Test ${rTest} · Full Reading Test` : `Cambridge IELTS ${rBook} · Test ${rTest} · Passage ${rPart}`,
    source: { book: rBook, test: rTest, part: fullTest ? "full" : rPart },
    steps: [
      READING_FOCUS[i],
      fullTest ? "Complete all three passages in 60 minutes without pausing" : p === 1 ? "Practise the question types slowly, then check answers" : "Complete the passage in 20 minutes",
      "Review every incorrect answer and note the question type in your error log",
    ],
    duration: fullTest ? 70 : p === 1 ? 45 : p === 2 ? 50 : 40,
    difficulty,
  };
  let listening = {
    id: `d${day}-listening`,
    module: "listening",
    title: lFull ? `Cambridge IELTS ${lBook} · Test ${lTest} · Full Listening Test` : `Cambridge IELTS ${lBook} · Test ${lTest} · Section ${lSection}`,
    source: { book: lBook, test: lTest, part: lFull ? "full" : lSection },
    steps: [
      LISTENING_FOCUS[i],
      lFull ? "Complete all four sections in one sitting" : "Read the questions first and predict answer types",
      "Review the transcript and underline the answer evidence",
    ],
    duration: lFull ? 50 : p === 1 ? 30 : 35,
    difficulty,
  };
  const [wTitle, promptId] = WRITING_PLAN[i];
  const prompt = WRITING_PROMPTS.find((x) => x.id === promptId);
  const writing = {
    id: `d${day}-writing`,
    module: "writing",
    title: wTitle,
    source: null,
    practice: { promptId },
    steps: [
      `Prompt: ${prompt.title} (${prompt.category})`,
      p === 1 ? "Plan for 5 minutes, then write focusing on today's skill" : p === 2 ? "Write under time and check word count" : "Write under full exam conditions",
      "Read the mock feedback and rewrite your weakest paragraph",
    ],
    duration: p === 1 ? 40 : p === 2 ? 50 : 60,
    difficulty,
  };
  const [sTitle, part] = SPEAKING_FOCUS[i];
  const setId = part === "part1" ? PART1_SETS[i % PART1_SETS.length].id : CUE_CARDS[i % CUE_CARDS.length].id;
  const speaking = {
    id: `d${day}-speaking`,
    module: "speaking",
    title: sTitle,
    source: null,
    practice: { part, setId },
    steps: [
      part === "part1" ? `Answer five questions on "${PART1_SETS[i % PART1_SETS.length].topic}"` : part === "part2" ? `Cue card: ${CUE_CARDS[i % CUE_CARDS.length].topic}` : `Discussion: ${CUE_CARDS[i % CUE_CARDS.length].topic}`,
      p === 1 ? "Record yourself and listen back once" : "Speak without pausing for the full time",
      "Complete the self-assessment",
    ],
    duration: p === 1 ? 20 : p === 2 ? 25 : 30,
    difficulty,
  };

  // Day 12 mirrors the specification's example.
  if (day === 12) {
    reading = { ...reading, title: "Cambridge IELTS 16 · Test 1 · Passage 2", source: { book: 16, test: 1, part: 2 } };
    listening = { ...listening, title: "Cambridge IELTS 17 · Test 2 · Section 3", source: { book: 17, test: 2, part: 3 } };
  }

  return {
    day,
    title: TITLES[i],
    phase,
    published: true,
    objectives: [
      `Reading: ${READING_FOCUS[i]}`,
      `Listening: ${LISTENING_FOCUS[i]}`,
      `Writing: ${wTitle}`,
      `Speaking: ${sTitle}`,
    ],
    tasks: [reading, listening, writing, speaking],
    vocabulary: getDayVocabulary(day),
  };
}

export const DAILY_PLAN = Array.from({ length: 60 }, (_, i) => buildDay(i + 1));
export const MODULES = ["reading", "listening", "writing", "speaking"];
