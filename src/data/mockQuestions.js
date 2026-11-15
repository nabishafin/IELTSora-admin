/** Question bank — original demo questions (not copied from Cambridge). */

export const QUESTION_TYPES = [
  { value: "multiple-choice", label: "Multiple Choice", modules: ["reading", "listening"], options: "custom" },
  { value: "tfng", label: "True / False / Not Given", modules: ["reading"], options: "fixed", fixed: ["True", "False", "Not Given"] },
  { value: "ynng", label: "Yes / No / Not Given", modules: ["reading"], options: "fixed", fixed: ["Yes", "No", "Not Given"] },
  { value: "matching-headings", label: "Matching Headings", modules: ["reading"], options: "custom" },
  { value: "matching-information", label: "Matching Information", modules: ["reading"], options: "custom" },
  { value: "matching-features", label: "Matching Features", modules: ["reading", "listening"], options: "custom" },
  { value: "sentence-completion", label: "Sentence Completion", modules: ["reading", "listening"], options: "none" },
  { value: "summary-completion", label: "Summary Completion", modules: ["reading", "listening"], options: "none" },
  { value: "note-completion", label: "Note Completion", modules: ["reading", "listening"], options: "none" },
  { value: "table-completion", label: "Table Completion", modules: ["reading", "listening"], options: "none" },
  { value: "flow-chart-completion", label: "Flow-chart Completion", modules: ["reading", "listening"], options: "none" },
  { value: "short-answer", label: "Short Answer", modules: ["reading", "listening"], options: "none" },
  { value: "form-completion", label: "Form Completion", modules: ["listening"], options: "none" },
  { value: "map-labelling", label: "Map / Plan Labelling", modules: ["listening"], options: "custom" },
];

export const questionTypeMeta = (value) => QUESTION_TYPES.find((t) => t.value === value);
export const questionTypeLabel = (value) => questionTypeMeta(value)?.label || value;

const HEADINGS = ["i. Early records ignored", "ii. A gap between belief and evidence", "iii. Calls for caution", "iv. A new collaborative approach", "v. Commercial applications"];
const PARAS = ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "Paragraph E"];
const PEOPLE = ["A. Dr Helen Marsh", "B. Professor Ito", "C. The 1987 survey team", "D. Critics of the research"];
const MAP = ["A", "B", "C", "D", "E", "F", "G", "H"];

// [type, module, text, options, answer, explanation]
const SEED = [
  // Multiple choice
  ["multiple-choice", "reading", "What is the writer's main purpose in the first paragraph?", ["To criticise early researchers", "To explain why interest in the topic has increased", "To describe a recent experiment", "To compare two scientific theories"], "To explain why interest in the topic has increased", "Paragraph A focuses on growing interest and why the topic is now seen as central."],
  ["multiple-choice", "reading", "According to the passage, why were early records initially ignored?", ["They were written in another language", "Their methods were considered unscientific", "They were lost for many years", "They contradicted government policy"], "Their methods were considered unscientific", "Paragraph B states the methods were 'considered unscientific'."],
  ["multiple-choice", "listening", "Why did the café move to a new location?", ["It needed a bigger kitchen", "Visitors complained about noise", "To make room for an exhibition space", "Because of building repairs"], "To make room for an exhibition space", "The speaker says it was relocated 'to make room for a new exhibition space'."],
  ["multiple-choice", "listening", "What do the students decide about presenting their data?", ["They will use pie charts", "They will use a table", "They will ask the tutor to decide", "They will present it orally"], "They will use a table", "Eight categories make pie charts confusing, so a table is preferred."],
  ["multiple-choice", "reading", "What do critics say about the most dramatic findings?", ["They were funded by private companies", "They come from small samples", "They have been widely replicated", "They are too old to be relevant"], "They come from small samples", "Paragraph D: findings 'come from small samples gathered in a limited number of locations'."],
  ["multiple-choice", "listening", "What is the weekday rate for hiring the hall?", ["£20", "£32", "£45", "£52"], "£32", "The standard rate is £45 but on weekdays it 'drops to £32'."],
  // TFNG
  ["tfng", "reading", "Interest in the subject has decreased in recent years.", null, "False", "The passage says interest 'has grown steadily'."],
  ["tfng", "reading", "The earliest records were made by professional scientists.", null, "False", "They were made by 'a small group of enthusiasts'."],
  ["tfng", "reading", "Several universities have launched interdisciplinary programmes.", null, "True", "Paragraph E states this directly."],
  ["tfng", "reading", "The interdisciplinary programmes are funded by national governments.", null, "Not Given", "Funding sources are not mentioned."],
  // YNNG
  ["ynng", "reading", "The writer believes the topic has been poorly presented in schools.", null, "Yes", "The authors argue the gap is caused by how the topic 'has traditionally been presented in schools'."],
  ["ynng", "reading", "The writer thinks public policy should immediately change.", null, "No", "The writer reports that it 'would be unwise to base public policy on the current research alone'."],
  ["ynng", "reading", "The writer considers collaborative research more expensive.", null, "Not Given", "Cost is not discussed."],
  ["ynng", "reading", "The writer agrees that the topic deserves sustained attention.", null, "Yes", "'There is broad agreement that ... deserves sustained attention.'"],
  // Matching headings
  ["matching-headings", "reading", "Choose the correct heading for Paragraph B.", HEADINGS, "i. Early records ignored", "Paragraph B explains why early notes were ignored."],
  ["matching-headings", "reading", "Choose the correct heading for Paragraph C.", HEADINGS, "ii. A gap between belief and evidence", "Paragraph C describes beliefs contradicted by evidence."],
  ["matching-headings", "reading", "Choose the correct heading for Paragraph D.", HEADINGS, "iii. Calls for caution", "Critics warn against drawing conclusions too quickly."],
  ["matching-headings", "reading", "Choose the correct heading for Paragraph E.", HEADINGS, "iv. A new collaborative approach", "Paragraph E mentions interdisciplinary programmes."],
  // Matching information
  ["matching-information", "reading", "Which paragraph contains a reference to a percentage of survey participants?", PARAS, "Paragraph C", "Paragraph C cites a survey percentage."],
  ["matching-information", "reading", "Which paragraph mentions the date of the earliest systematic records?", PARAS, "Paragraph B", "Paragraph B gives the date of the earliest records."],
  ["matching-information", "reading", "Which paragraph describes a limitation of current research?", PARAS, "Paragraph D", "Paragraph D discusses small sample sizes."],
  ["matching-information", "reading", "Which paragraph mentions experts from different academic fields?", PARAS, "Paragraph E", "Scientists, historians and economists are mentioned in Paragraph E."],
  // Matching features
  ["matching-features", "reading", "Who first suggested that informal records had long-term value?", PEOPLE, "A. Dr Helen Marsh", "Dr Marsh is credited with re-evaluating the early notes."],
  ["matching-features", "reading", "Who argued that sample sizes were too small?", PEOPLE, "D. Critics of the research", "Critics raised concerns about samples."],
  ["matching-features", "listening", "Which student is responsible for the conclusion section?", ["A. Maya", "B. Tom", "C. Both students"], "B. Tom", "Tom agrees to link conclusions to the research question."],
  ["matching-features", "listening", "Which facility is closed on Mondays?", ["A. The café", "B. The north wing", "C. The information desk", "D. The car park"], "B. The north wing", "The north wing is closed on Mondays for maintenance."],
  // Sentence completion
  ["sentence-completion", "reading", "Early records were largely ignored because the methods were seen as __________. (ONE WORD)", null, "unscientific", "Paragraph B."],
  ["sentence-completion", "reading", "Researchers now describe the subject as __________ to understanding social change. (ONE WORD)", null, "central", "Paragraph A."],
  ["sentence-completion", "listening", "The site first opened to the public in __________.", null, "1998", "The speaker gives the opening year."],
  ["sentence-completion", "listening", "Parking is free after __________ o'clock.", null, "six", "Free 'after six o'clock'."],
  // Summary completion
  ["summary-completion", "reading", "A survey showed that many people held beliefs that were contradicted by measurable __________.", null, "evidence", "Paragraph C."],
  ["summary-completion", "reading", "New university programmes bring together scientists, historians and __________.", null, "economists", "Paragraph E."],
  ["summary-completion", "listening", "The students still need to link their __________ back to the original question.", null, "conclusions", "Tutor's question about conclusions."],
  ["summary-completion", "reading", "Critics recommend larger, __________ projects before policy decisions are made.", null, "coordinated", "Paragraph D."],
  // Note completion
  ["note-completion", "listening", "Caller's surname: __________", null, "Morgan", "Spelled M-O-R-G-A-N."],
  ["note-completion", "listening", "Deposit required: £__________", null, "20", "A deposit of £20."],
  ["note-completion", "reading", "Earliest records: made by a small group of __________", null, "enthusiasts", "Paragraph B."],
  ["note-completion", "listening", "Number of times the site has been expanded: __________", null, "three", "'expanded three times'."],
  // Table completion
  ["table-completion", "listening", "Standard rate | Weekday rate | Deposit — Weekday rate: £__________", null, "32", "Weekday rate given in the conversation."],
  ["table-completion", "reading", "Period: 1987 | Source: __________ | Finding: informal notes", null, "enthusiasts", "Paragraph B."],
  ["table-completion", "listening", "Location | Feature — Bottom of plan: main __________", null, "entrance", "'main entrance at the bottom'."],
  ["table-completion", "reading", "Group | Concern — Critics | small __________", null, "samples", "Paragraph D."],
  // Flow-chart completion
  ["flow-chart-completion", "reading", "Informal notes → recognised as valuable __________ data → used in modern studies", null, "long-term", "Paragraph B."],
  ["flow-chart-completion", "listening", "Collect data → choose __________ format → write conclusions", null, "presentation", "Students discuss how to present data."],
  ["flow-chart-completion", "reading", "Small studies → critics urge caution → larger __________ projects", null, "coordinated", "Paragraph D."],
  ["flow-chart-completion", "listening", "Arrive at entrance → visit information desk → walk straight to the __________", null, "café", "The café is straight ahead."],
  // Short answer
  ["short-answer", "reading", "Which three groups of specialists are mentioned in Paragraph E? (NO MORE THAN THREE WORDS)", null, "scientists, historians, economists", "Paragraph E."],
  ["short-answer", "listening", "What is the caller's phone number?", null, "07700 914 362", "Given in Section 1."],
  ["short-answer", "listening", "On which day is the north wing closed?", null, "Monday", "Closed on Mondays."],
  ["short-answer", "reading", "What do critics say is limited, apart from sample size? (TWO WORDS)", null, "number of locations", "'a limited number of locations'."],
  // Form completion
  ["form-completion", "listening", "Booking form — Name: Daniela __________", null, "Morgan", "Spelled in the recording."],
  ["form-completion", "listening", "Booking form — Contact number: __________", null, "07700 914 362", "Given by the caller."],
  ["form-completion", "listening", "Booking form — Deposit paid: £__________", null, "20", "Deposit amount."],
  ["form-completion", "listening", "Booking form — Parking: free after __________ pm", null, "6", "Free after six."],
  // Map labelling
  ["map-labelling", "listening", "Label the plan: Information desk", MAP, "B", "To the left of the main entrance."],
  ["map-labelling", "listening", "Label the plan: Café", MAP, "D", "Straight ahead from the entrance."],
  ["map-labelling", "listening", "Label the plan: New exhibition space", MAP, "E", "Former café location."],
  ["map-labelling", "listening", "Label the plan: North wing", MAP, "G", "At the top of the plan."],
  ["map-labelling", "listening", "Label the plan: Car park", MAP, "H", "Behind the building."],
  ["multiple-choice", "reading", "Which word best describes the writer's overall attitude?", ["Dismissive", "Cautiously optimistic", "Strongly critical", "Indifferent"], "Cautiously optimistic", "The writer notes reservations but ends positively."],
];

const BOOKS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

export function generateQuestions() {
  const base = new Date();
  return SEED.map(([type, module, text, options, answer, explanation], i) => {
    const meta = questionTypeMeta(type);
    const maxPart = module === "reading" ? 3 : 4;
    const created = new Date(base);
    created.setDate(created.getDate() - (SEED.length - i) * 2);
    return {
      id: `q-${i + 1}`,
      module,
      book: BOOKS[i % BOOKS.length],
      test: (Math.floor(i / 12) % 4) + 1,
      part: (i % maxPart) + 1,
      type,
      text,
      options: meta.options === "fixed" ? [...meta.fixed] : options ? [...options] : [],
      answer,
      explanation,
      marks: 1,
      createdAt: created.toISOString(),
    };
  });
}
