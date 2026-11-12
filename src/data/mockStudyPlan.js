/**
 * 60-day IELTS study plan generator.
 * The output shape is identical to the `studyPlan` array of the
 * `ieltsora-content-v1` export format consumed by the student website.
 */
import { phaseForDay, CAMBRIDGE_BOOK_NUMBERS } from "@/utils/constants";

/* All 48 Cambridge tests in order: Book 10 Test 1 ... Book 21 Test 4 */
const TESTS = CAMBRIDGE_BOOK_NUMBERS.flatMap((book) => [1, 2, 3, 4].map((test) => ({ book, test })));

/**
 * Per-day definitions.
 * [title, objective1, objective2, writing [taskNo, focus, topic] | "FULL", speaking [partNo, focus, topic] | "FULL"]
 */
const DAYS = [
  // ---------------- Phase 1 · Foundation ----------------
  ["IELTS Foundation", "Understand the structure and timing of all four IELTS modules", "Complete a first task in every module to set a baseline", [1, "Introduction & Overview", "a line graph of public transport use 2000–2020"], [1, "Introduction & Familiar Topics", "your home town and daily routine"]],
  ["Skimming and Scanning", "Skim a passage for gist in under three minutes", "Scan for names, dates and figures without reading every word", [1, "Describing a Line Graph", "monthly visitors to three museums"], [1, "Work and Study", "your job or studies"]],
  ["Understanding Question Types", "Recognise the main Reading and Listening question families", "Choose a strategy for each question type", [2, "Analysing the Question", "whether children should learn a foreign language at primary school"], [1, "Hobbies and Free Time", "free-time activities"]],
  ["Listening for Specific Details", "Predict the type of answer before the audio starts", "Accurately record names, numbers and spellings", [1, "Bar Chart Key Features", "spending on leisure in five countries"], [1, "Food and Cooking", "meals and cooking habits"]],
  ["Main Ideas and Paragraph Structure", "Identify topic sentences in academic paragraphs", "Separate main ideas from supporting examples", [2, "Writing a Clear Position", "university education versus vocational training"], [2, "Cue Card Planning", "a place you enjoy visiting"]],
  ["True / False / Not Given", "Distinguish contradiction from missing information", "Avoid answering from background knowledge", [1, "Pie Chart Proportions", "household energy consumption by source"], [1, "Technology in Daily Life", "mobile phones and apps"]],
  ["Form and Note Completion", "Follow word limits precisely", "Anticipate grammar and word type in each gap", [2, "Body Paragraph Development", "the rise of working from home"], [1, "Weather and Seasons", "your favourite season"]],
  ["Describing Trends", "Use accurate verbs and adverbs to describe change", "Group similar trends in an overview", [1, "Trend Language Practice", "average house prices in four cities"], [2, "Describing People", "a person who inspired you"]],
  ["Everyday Vocabulary Building", "Learn 20 topic words for travel and accommodation", "Use new vocabulary in spoken and written answers", [2, "Introductions and Conclusions", "the effect of tourism on local culture"], [1, "Travel and Holidays", "holidays and travel plans"]],
  ["Matching Headings Basics", "Summarise each paragraph in a few words before matching", "Eliminate headings that only match a detail", [1, "Table Data Selection", "student enrolment by subject 2010–2020"], [1, "Reading and Books", "your reading habits"]],
  ["Numbers, Dates and Spelling", "Transcribe numbers, dates and addresses accurately", "Recognise commonly confused letters and sounds", [2, "Agree or Disagree Essays", "banning private cars from city centres"], [2, "Describing Objects", "a gift you received"]],
  ["Essay Structure Essentials", "Build a four-paragraph Task 2 essay", "Write a focused topic sentence for each body paragraph", [2, "Four-paragraph Structure", "the importance of team sports for children"], [1, "Music and Entertainment", "music you enjoy"]],
  ["Speaking Fluency", "Extend Part 1 answers with reasons and examples", "Reduce long pauses with natural discourse markers", [1, "Comparing Two Charts", "internet access in rural and urban areas"], [1, "Fluency Builders", "friends and neighbours"]],
  ["Sentence Completion", "Check the grammar of completed sentences", "Locate answers using keywords and synonyms", [2, "Supporting Ideas with Examples", "the role of public libraries today"], [2, "Describing Events", "a celebration you attended"]],
  ["Maps and Plans", "Follow directions and spatial language in audio", "Orientate quickly using the map's starting point", [1, "Describing a Map", "changes to a town centre since 1990"], [1, "Places and Buildings", "buildings in your city"]],
  ["Comparing Data", "Make accurate comparisons with comparatives and superlatives", "Highlight the most significant differences", [1, "Comparative Language", "coffee and tea consumption in six countries"], [3, "Introduction to Discussion", "shopping and consumer habits"]],
  ["Opinion Essays", "State and maintain a clear opinion throughout", "Address a counter-argument briefly and effectively", [2, "Opinion Essay Practice", "the influence of advertising on children"], [2, "Describing Experiences", "a time you learned something new"]],
  ["Cue Card Confidence", "Plan a two-minute talk in one minute", "Use the bullet points as a speaking structure", [1, "Process Diagram Basics", "how recycled paper is produced"], [2, "Two-minute Talk", "a skill you would like to learn"]],
  ["Multiple Choice Strategies", "Eliminate distractors systematically", "Read every option before the audio begins", [2, "Paragraph Cohesion", "the benefits of studying history"], [3, "Giving Opinions", "education and learning"]],
  ["Foundation Checkpoint", "Review every error from Days 1–19", "Measure progress against your Day 1 baseline", [2, "Timed Practice Essay", "whether governments should fund the arts"], [1, "Checkpoint Mock Part 1", "mixed familiar topics"]],
  // ---------------- Phase 2 · Skill Development ----------------
  ["Paraphrase Recognition", "Match paraphrased ideas between question and text", "Build a personal synonym bank of 30 items", [1, "Paraphrasing the Prompt", "global smartphone ownership 2010–2025"], [2, "Paraphrasing in Speech", "an app you use often"]],
  ["Yes / No / Not Given", "Identify the writer's views and claims", "Separate opinion from reported fact", [2, "Discussion Essays", "whether space exploration is worth the cost"], [3, "Technology and Society", "technology and society"]],
  ["Multiple Speakers", "Track who says what in Section 3 conversations", "Notice agreement and disagreement signals", [1, "Mixed Charts", "water usage by sector and region"], [1, "Work and Ambitions", "your career plans"]],
  ["Process Diagrams", "Use the passive voice and sequencers accurately", "Describe every stage in logical order", [1, "Process Description", "the manufacture of glass bottles"], [2, "Describing a Process", "a skill you taught someone"]],
  ["Discussion Essays", "Present both views fairly before giving your own", "Balance the length of body paragraphs", [2, "Both Views and Opinion", "online versus classroom learning"], [3, "Education Debates", "the future of schools"]],
  ["Matching Information", "Locate specific information inside paragraphs", "Handle paragraphs that are used more than once", [1, "Selecting Key Features", "waste disposal methods in four countries"], [1, "Environment Habits", "recycling and the environment"]],
  ["Academic Lectures", "Follow the signposting of a Section 4 lecture", "Complete notes at natural lecture speed", [2, "Complex Sentences", "the decline of minority languages"], [2, "Describing a Place", "a historic building you visited"]],
  ["Cohesion and Linking", "Use referencing and linking devices accurately", "Avoid the mechanical overuse of connectors", [2, "Cohesive Devices", "urban growth and housing costs"], [3, "Cities and Urban Life", "city life versus country life"]],
  ["Extended Speaking Answers", "Speak for the full two minutes in Part 2", "Add detail using past, present and future forms", [1, "Dynamic Tables", "international student numbers 2015–2025"], [2, "Extended Long Turn", "a goal you achieved"]],
  ["Summary Completion", "Use the summary to predict missing word types", "Choose from a word bank efficiently", [2, "Advantages and Disadvantages", "living in a multigenerational household"], [3, "Family and Society", "changes in family structure"]],
  ["Distractors in Listening", "Spot corrections and changed answers in audio", "Wait for confirmation before writing an answer", [1, "Line and Bar Combined", "energy production and population growth"], [1, "Health and Fitness", "exercise routines"]],
  ["Maps and Diagrams in Writing", "Describe developments to a site accurately", "Use location and change vocabulary precisely", [1, "Site Development Maps", "a university campus redevelopment"], [2, "Describing a Change", "a change in your local area"]],
  ["Advantages and Disadvantages Essays", "Weigh benefits against drawbacks", "Reach a clearly justified conclusion", [2, "Weighing Arguments", "the four-day working week"], [3, "Work-Life Balance", "work and leisure"]],
  ["Matching Features", "Connect statements to people, dates or theories", "Scan for proper nouns efficiently", [1, "Describing Ranges and Proportions", "the age profile of museum visitors"], [1, "Art and Creativity", "art and design"]],
  ["Table and Flow-chart Completion", "Follow the logic of tables and flow-charts", "Respect word limits and spelling", [2, "Problem and Cause Essays", "the rise in childhood obesity"], [2, "Describing Media", "a documentary you watched"]],
  ["Lexical Resource Upgrade", "Replace basic words with precise academic vocabulary", "Use collocations naturally in context", [2, "Precise Vocabulary", "the role of museums in modern society"], [3, "Media and Information", "news and social media"]],
  ["Abstract Discussion", "Develop abstract ideas with examples in Part 3", "Speculate about the future with appropriate language", [1, "Overview Mastery", "global coffee production by region"], [3, "Abstract Ideas", "globalisation and culture"]],
  ["Problem and Solution Essays", "Link each problem to a realistic solution", "Develop ideas with clear cause and effect", [2, "Problem and Solution", "traffic congestion in large cities"], [2, "Describing a Problem", "a problem you solved"]],
  ["Time Management Drills", "Complete a full Reading passage in 20 minutes", "Transfer answers without losing time", [2, "40-minute Timed Essay", "who is responsible for protecting the environment"], [1, "Rapid Response Practice", "mixed Part 1 topics"]],
  ["Skill Development Checkpoint", "Compare your error rate with Day 20", "Identify two priority weaknesses for Phase 3", [1, "Timed Task 1", "renewable energy share in five countries"], [3, "Checkpoint Mock Parts 2–3", "science and innovation"]],
  // ---------------- Phase 3 · Exam Preparation ----------------
  ["Exam Strategy Briefing", "Finalise a personal timing plan for each module", "Review test-day rules and the answer sheet", [2, "Exam Planning Routine", "the impact of artificial intelligence on employment"], [1, "Full Part 1 Rehearsal", "home, work and interests"]],
  ["Timed Reading Under Pressure", "Complete Passage 3 under strict timing", "Leave the hardest question types until last", [1, "Band 7 Overview Writing", "airline passenger numbers by region"], [2, "Band 7 Long Turn", "an important decision you made"]],
  ["Full Listening Simulation", "Complete demanding sections in one sitting", "Use the transfer time accurately", [2, "Band 7 Argument Development", "whether wealthy nations should help poorer nations"], [3, "Band 7 Discussion", "international cooperation"]],
  ["Band 7+ Task 1", "Write a precise overview with no data errors", "Use a wide range of comparison structures", [1, "Band 7+ Data Description", "employment sectors 1980–2020"], [1, "Natural Intonation", "daily life and routines"]],
  ["Band 7+ Task 2", "Develop each idea fully with explanation and example", "Use a range of complex structures accurately", [2, "Band 7+ Essay", "the growth of fast fashion"], [2, "Advanced Cue Card", "a book that changed your thinking"]],
  ["Full Mock Exam 1", "Complete a full four-module mock under exam conditions", "Record raw scores and convert them to band scores", "FULL", "FULL"],
  ["Error Analysis Review", "Categorise every mistake from Mock Exam 1", "Create a targeted correction plan", [2, "Rewriting for Accuracy", "the advantages of studying abroad"], [3, "Error-focused Discussion", "travel and tourism"]],
  ["Speed and Accuracy", "Reduce reading time per passage to 18 minutes", "Maintain accuracy at a higher speed", [1, "Fast Task 1 (15 minutes)", "online sales as a share of retail"], [1, "Quick-fire Part 1", "weather, food and transport"]],
  ["Complex Argument Essays", "Handle multi-layered questions", "Address every part of the prompt", [2, "Complex Prompts", "economic growth versus environmental protection"], [3, "Complex Opinions", "economics and the environment"]],
  ["Speaking Mock Interview", "Complete Parts 1–3 as one continuous interview", "Self-assess against the four speaking criteria", [1, "Process and Map Review", "how solar panels generate electricity"], [3, "Full Speaking Mock", "a full three-part interview"]],
  ["Full Mock Exam 2", "Complete a second full mock under exam conditions", "Compare band scores with Mock Exam 1", "FULL", "FULL"],
  ["Weak Area Targeting", "Practise only your two weakest question types", "Track improvement on targeted types", [2, "Targeted Essay Practice", "the role of zoos in conservation"], [2, "Targeted Long Turn", "a time you helped someone"]],
  ["Advanced Vocabulary in Context", "Use less common lexical items accurately", "Avoid informal language in academic writing", [1, "Precision Vocabulary in Task 1", "literacy rates in developing regions"], [3, "Advanced Lexis", "science and research"]],
  ["Two-part Questions", "Answer both questions in a two-part prompt", "Give equal development to each part", [2, "Two-part Questions", "why people move to cities and whether this is positive"], [2, "Describing Abstract Ideas", "a law you think is important"]],
  ["Full Mock Exam 3", "Complete a third full mock under exam conditions", "Confirm timing is stable across all modules", "FULL", "FULL"],
  ["Grammar Range and Accuracy", "Use conditionals, relative clauses and passives accurately", "Eliminate recurring grammar errors", [2, "Grammar-focused Rewrite", "the importance of public health campaigns"], [3, "Grammar in Speech", "health and lifestyle"]],
  ["Final Listening Polish", "Review all Section 3 and 4 errors", "Practise sustained concentration", [1, "Final Task 1 Review", "car ownership and cycling rates"], [1, "Confidence Part 1", "hobbies and ambitions"]],
  ["Final Reading Polish", "Review all Matching Headings and TFNG errors", "Confirm your passage order strategy", [2, "Final Task 2 Review", "the value of unpaid volunteer work"], [2, "Confidence Long Turn", "a memorable journey"]],
  ["Full Mock Exam 4", "Complete the final full mock under exam conditions", "Confirm you are consistently at your target band", "FULL", "FULL"],
  ["Exam Day Readiness", "Review strategy notes for every module", "Prepare mentally and logistically for test day", [2, "Light Review & Templates", "a review of your strongest essay"], [1, "Relaxed Warm-up", "a relaxed warm-up conversation"]],
];

const THIRD_OBJECTIVE = {
  Foundation: "Complete all four module tasks and log your mistakes",
  "Skill Development": "Complete all four tasks within the recommended time",
  "Exam Preparation": "Work under strict exam timing and review against band descriptors",
};

const FULL_MOCK_TESTS = { 46: TESTS[36], 51: TESTS[37], 55: TESTS[40], 59: TESTS[41] }; // Book 19 T1/T2, Book 20 T1/T2

const READING_TYPES = [
  "Multiple Choice", "True/False/Not Given", "Sentence Completion", "Matching Headings", "Short Answer", "Summary Completion",
  "Note Completion", "Matching Information", "Yes/No/Not Given", "Matching Features", "Table Completion", "Flow-chart Completion",
];

const label = (book, test, partName, part) => `Cambridge IELTS ${book} · Test ${test} · ${partName} ${part}`;

function readingTask(day, phase, counter) {
  let test, part, steps, duration, difficulty;
  if (phase === "Exam Preparation") {
    test = TESTS[24 + Math.floor(counter / 2)];
    part = [2, 3][counter % 2];
    steps = [
      `Complete Passage ${part} in 20 minutes under exam conditions`,
      "Transfer answers without extra time",
      "Analyse errors by question type",
      "Re-read the hardest paragraph for vocabulary",
    ];
    duration = 40;
    difficulty = "Hard";
  } else {
    const offset = phase === "Foundation" ? 0 : 8;
    test = TESTS[offset + Math.floor(counter / 3)];
    part = (counter % 3) + 1;
    const qType = READING_TYPES[(day - 1) % (phase === "Foundation" ? 7 : 12)];
    if (day === 1) {
      steps = ["Practice basic reading questions", "Review incorrect answers"];
    } else if (phase === "Foundation") {
      steps = [`Skim Passage ${part} for gist in 3 minutes`, `Answer ${qType} questions using keywords`, "Check answers and review incorrect ones", "Note five new vocabulary items"];
    } else {
      steps = [`Read Passage ${part} with a 20-minute target`, `Focus on ${qType} questions`, "Highlight paraphrases between questions and text", "Log every error with its reason"];
    }
    duration = phase === "Foundation" ? 45 : 50;
    difficulty = phase === "Foundation" ? (day <= 12 ? "Easy" : "Medium") : day >= 36 ? "Hard" : "Medium";
  }
  return {
    id: `d${day}-reading`,
    module: "reading",
    title: label(test.book, test.test, "Passage", part),
    source: { book: test.book, test: test.test, part },
    steps,
    duration,
    difficulty,
  };
}

function listeningTask(day, phase, counter) {
  let test, part, steps, duration, difficulty;
  if (phase === "Exam Preparation") {
    test = TESTS[24 + Math.floor(counter / 2)];
    part = [3, 4][counter % 2];
    steps = [`Complete Section ${part} under timed conditions`, "Transfer answers in capital letters", "Mark and calculate your accuracy", "Review every distractor you selected"];
    duration = 35;
    difficulty = "Hard";
  } else {
    const offset = phase === "Foundation" ? 0 : 8;
    test = TESTS[offset + Math.floor(counter / 4)];
    part = (counter % 4) + 1;
    if (day === 1) {
      steps = ["Read the instructions and preview the questions", "Listen once and complete Section 1", "Check answers with the transcript"];
    } else if (phase === "Foundation") {
      steps = [`Preview the questions for Section ${part} before playing`, "Listen once only and answer every question", "Check spelling and word limits", "Replay difficult parts with the transcript"];
    } else {
      steps = [`Predict answer types for Section ${part}`, "Listen once at exam speed", "Identify the distractors you fell for", "Shadow two minutes of the transcript"];
    }
    duration = phase === "Foundation" ? 30 : 35;
    difficulty = phase === "Foundation" ? (day <= 12 ? "Easy" : "Medium") : day >= 36 ? "Hard" : "Medium";
  }
  return {
    id: `d${day}-listening`,
    module: "listening",
    title: label(test.book, test.test, "Section", part),
    source: { book: test.book, test: test.test, part },
    steps,
    duration,
    difficulty,
  };
}

function writingTask(day, phase, spec) {
  const [taskNo, focus, topic] = spec;
  const timed = phase === "Exam Preparation";
  const steps =
    taskNo === 1
      ? [
          `Study the visual: ${topic}`,
          "Write a paraphrased introduction and a clear overview",
          "Write two body paragraphs that group the key data",
          timed ? "Finish within 20 minutes and check the word count (150+)" : "Check the word count (150+) and proofread",
        ]
      : [
          `Analyse the prompt on ${topic}`,
          "Plan your position and two main ideas in 5 minutes",
          "Write at least 250 words in four paragraphs",
          timed ? "Finish within 40 minutes and proofread for accuracy" : "Proofread for grammar, linking and spelling",
        ];
  return {
    id: `d${day}-writing`,
    module: "writing",
    title: `Academic Task ${taskNo} · ${focus}`,
    source: null,
    steps,
    duration: taskNo === 1 ? (timed ? 30 : 40) : 50,
    difficulty: phase === "Foundation" ? (day <= 12 ? "Easy" : "Medium") : phase === "Skill Development" ? "Medium" : "Hard",
  };
}

function speakingTask(day, phase, spec) {
  const [partNo, focus, topic] = spec;
  const steps =
    partNo === 1
      ? [`Answer six Part 1 questions about ${topic}`, "Extend each answer with a reason or example", "Record yourself and note hesitations"]
      : partNo === 2
        ? [`Prepare a cue card about ${topic} in one minute`, "Speak for two full minutes without stopping", "Listen back and note grammar and vocabulary errors"]
        : [`Discuss four Part 3 questions on ${topic}`, "Give opinions with reasons, examples and speculation", "Record and self-assess against the band descriptors"];
  return {
    id: `d${day}-speaking`,
    module: "speaking",
    title: `Part ${partNo} · ${focus}`,
    source: null,
    steps,
    duration: phase === "Foundation" ? 20 : phase === "Skill Development" ? 25 : 30,
    difficulty: phase === "Foundation" ? (day <= 12 ? "Easy" : "Medium") : phase === "Skill Development" ? "Medium" : "Hard",
  };
}

function fullMockTasks(day) {
  const { book, test } = FULL_MOCK_TESTS[day];
  return [
    {
      id: `d${day}-reading`,
      module: "reading",
      title: `Cambridge IELTS ${book} · Test ${test} · Full Reading Test`,
      source: { book, test, part: null },
      steps: ["Complete Passages 1–3 in 60 minutes without pausing", "Write answers directly on the answer sheet", "Mark answers and convert the raw score to a band"],
      duration: 60,
      difficulty: "Hard",
    },
    {
      id: `d${day}-listening`,
      module: "listening",
      title: `Cambridge IELTS ${book} · Test ${test} · Full Listening Test`,
      source: { book, test, part: null },
      steps: ["Complete Sections 1–4 with the audio played once", "Use the final minutes to check and transfer answers", "Mark answers and convert the raw score to a band"],
      duration: 40,
      difficulty: "Hard",
    },
    {
      id: `d${day}-writing`,
      module: "writing",
      title: `Full Writing Test · Task 1 & Task 2 (Cambridge ${book} Test ${test})`,
      source: null,
      steps: ["Write Task 1 in 20 minutes (150+ words)", "Write Task 2 in 40 minutes (250+ words)", "Self-assess both tasks against the four writing criteria"],
      duration: 60,
      difficulty: "Hard",
    },
    {
      id: `d${day}-speaking`,
      module: "speaking",
      title: "Full Speaking Test · Parts 1–3",
      source: null,
      steps: ["Complete Part 1 (4–5 minutes) on familiar topics", "Deliver a Part 2 long turn after one minute of preparation", "Complete a Part 3 discussion and record the full test", "Score yourself on fluency, lexis, grammar and pronunciation"],
      duration: 30,
      difficulty: "Hard",
    },
  ];
}

export function generateStudyPlan() {
  const counters = {};
  return DAYS.map((def, i) => {
    const day = i + 1;
    const phase = phaseForDay(day);
    const [title, o1, o2, writing, speaking] = def;
    counters[phase] = counters[phase] ?? 0;
    let tasks;
    if (writing === "FULL") {
      tasks = fullMockTasks(day);
    } else {
      const c = counters[phase]++;
      tasks = [readingTask(day, phase, c), listeningTask(day, phase, c), writingTask(day, phase, writing), speakingTask(day, phase, speaking)];
    }
    return {
      day,
      title,
      phase,
      objectives: [o1, o2, THIRD_OBJECTIVE[phase]],
      published: true,
      tasks,
    };
  });
}

export const defaultStudyPlan = generateStudyPlan();
export const getDefaultDay = (day) => JSON.parse(JSON.stringify(defaultStudyPlan.find((d) => d.day === day) || null));
