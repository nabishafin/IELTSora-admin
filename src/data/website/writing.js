/* ORIGINAL demonstration writing prompts (not Cambridge material). */
import { getCambridgeOverride, parseUploadedId } from "./cambridgeContent";

export const WRITING_TYPES = {
  "academic-task-1": { label: "Academic Task 1", minWords: 150, minutes: 20 },
  "general-task-1": { label: "General Training Task 1", minWords: 150, minutes: 20 },
  "task-2": { label: "Writing Task 2", minWords: 250, minutes: 40 },
};

export const WRITING_PROMPTS = [
  /* ---------- Academic Task 1 (visuals rendered with Recharts) ---------- */
  {
    id: "at1-1",
    type: "academic-task-1",
    title: "Household internet access",
    category: "Line graph",
    prompt:
      "The graph below shows the percentage of households with internet access in three countries between 2000 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visual: {
      kind: "line",
      xKey: "year",
      unit: "%",
      series: ["Norland", "Westmark", "Osteria"],
      data: [
        { year: "2000", Norland: 32, Westmark: 18, Osteria: 6 },
        { year: "2005", Norland: 55, Westmark: 34, Osteria: 12 },
        { year: "2010", Norland: 78, Westmark: 52, Osteria: 25 },
        { year: "2015", Norland: 89, Westmark: 70, Osteria: 46 },
        { year: "2020", Norland: 95, Westmark: 84, Osteria: 71 },
      ],
    },
  },
  {
    id: "at1-2",
    type: "academic-task-1",
    title: "Museum visitors",
    category: "Bar chart",
    prompt:
      "The chart below shows the number of visitors (in thousands) to four museums in a city in 2010 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visual: {
      kind: "bar",
      xKey: "museum",
      unit: "k",
      series: ["2010", "2020"],
      data: [
        { museum: "Science", 2010: 420, 2020: 610 },
        { museum: "History", 2010: 380, 2020: 300 },
        { museum: "Art", 2010: 250, 2020: 340 },
        { museum: "Maritime", 2010: 120, 2020: 95 },
      ],
    },
  },
  {
    id: "at1-3",
    type: "academic-task-1",
    title: "Electricity sources",
    category: "Pie charts",
    prompt:
      "The pie charts compare the sources of electricity generation in one country in 1990 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visual: {
      kind: "pie",
      unit: "%",
      charts: [
        { label: "1990", data: [{ name: "Coal", value: 52 }, { name: "Gas", value: 18 }, { name: "Nuclear", value: 20 }, { name: "Hydro", value: 8 }, { name: "Wind & solar", value: 2 }] },
        { label: "2020", data: [{ name: "Coal", value: 14 }, { name: "Gas", value: 31 }, { name: "Nuclear", value: 17 }, { name: "Hydro", value: 9 }, { name: "Wind & solar", value: 29 }] },
      ],
    },
  },
  {
    id: "at1-4",
    type: "academic-task-1",
    title: "Weekly leisure hours",
    category: "Table",
    prompt:
      "The table below shows the average number of hours per week spent on four leisure activities by people in different age groups.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visual: {
      kind: "table",
      headers: ["Age group", "Watching TV", "Social media", "Sport", "Reading"],
      rows: [
        ["16–24", "6.5", "14.2", "4.8", "1.9"],
        ["25–44", "9.1", "8.7", "3.2", "2.6"],
        ["45–64", "14.3", "4.1", "2.5", "4.0"],
        ["65+", "21.0", "1.6", "1.8", "6.3"],
      ],
    },
  },
  {
    id: "at1-5",
    type: "academic-task-1",
    title: "Recycling glass bottles",
    category: "Process diagram",
    prompt:
      "The diagram below shows the process of recycling glass bottles.\n\nSummarise the information by selecting and reporting the main features.",
    visual: {
      kind: "process",
      steps: ["Bottles collected from recycling banks", "Transported to processing plant", "Sorted by colour", "Washed and labels removed", "Crushed into 'cullet'", "Melted at 1,500°C", "Moulded into new bottles", "Delivered to shops"],
    },
  },
  {
    id: "at1-6",
    type: "academic-task-1",
    title: "Commuting methods",
    category: "Bar chart",
    prompt:
      "The chart below shows how workers in one city travelled to work in 2005 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    visual: {
      kind: "bar",
      xKey: "mode",
      unit: "%",
      series: ["2005", "2025"],
      data: [
        { mode: "Car", 2005: 54, 2025: 38 },
        { mode: "Bus", 2005: 21, 2025: 17 },
        { mode: "Train", 2005: 12, 2025: 19 },
        { mode: "Bicycle", 2005: 5, 2025: 14 },
        { mode: "Walking", 2005: 8, 2025: 12 },
      ],
    },
  },

  /* ---------- General Training Task 1 (letters) ---------- */
  {
    id: "gt1-1",
    type: "general-task-1",
    title: "Noise from a neighbouring flat",
    category: "Formal letter — complaint",
    prompt:
      "You live in a rented flat. For several weeks, the people in the flat next door have been making a lot of noise late at night.\n\nWrite a letter to your landlord. In your letter:\n• describe the problem\n• explain how it is affecting you\n• say what you would like your landlord to do\n\nBegin your letter as follows: Dear Mr Collins,",
  },
  {
    id: "gt1-2",
    type: "general-task-1",
    title: "Thanking a friend",
    category: "Informal letter",
    prompt:
      "A friend recently helped you when you moved to a new city.\n\nWrite a letter to your friend. In your letter:\n• thank them for their help\n• describe your new home\n• invite them to visit you\n\nBegin your letter as follows: Dear …,",
  },
  {
    id: "gt1-3",
    type: "general-task-1",
    title: "Applying for a part-time job",
    category: "Semi-formal letter",
    prompt:
      "You have seen an advertisement for a part-time job at a local bookshop.\n\nWrite a letter to the manager. In your letter:\n• explain why you are interested in the job\n• describe your relevant experience\n• say when you are available to work\n\nBegin your letter as follows: Dear Sir or Madam,",
  },
  {
    id: "gt1-4",
    type: "general-task-1",
    title: "Changing your work schedule",
    category: "Semi-formal letter — request",
    prompt:
      "You would like to change your working hours for the next three months.\n\nWrite a letter to your manager. In your letter:\n• explain why you need to change your hours\n• say what hours you would like to work\n• suggest how your work could still be completed\n\nBegin your letter as follows: Dear Ms Rahman,",
  },
  {
    id: "gt1-5",
    type: "general-task-1",
    title: "Improving a local park",
    category: "Formal letter — suggestion",
    prompt:
      "The park near your home is in poor condition.\n\nWrite a letter to the local council. In your letter:\n• describe the condition of the park\n• explain why the park is important to local people\n• suggest what improvements could be made\n\nBegin your letter as follows: Dear Sir or Madam,",
  },
  {
    id: "gt1-6",
    type: "general-task-1",
    title: "A lost item on a train",
    category: "Formal letter — enquiry",
    prompt:
      "You left a bag on a train last week.\n\nWrite a letter to the train company. In your letter:\n• give details of your journey\n• describe the bag and its contents\n• explain what you would like the company to do\n\nBegin your letter as follows: Dear Sir or Madam,",
  },

  /* ---------- Task 2 (essays) ---------- */
  { id: "t2-1", type: "task-2", title: "Unpaid community service", category: "Opinion essay", prompt: "Some people believe that unpaid community service should be a compulsory part of high school programmes.\n\nTo what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience." },
  { id: "t2-2", type: "task-2", title: "Working from home", category: "Discussion essay", prompt: "Some people think that working from home benefits both employees and employers, while others believe it has more drawbacks than benefits.\n\nDiscuss both these views and give your own opinion." },
  { id: "t2-3", type: "task-2", title: "Traffic in large cities", category: "Problem–solution essay", prompt: "Traffic congestion is becoming a serious problem in many large cities.\n\nWhat are the causes of this problem, and what measures could be taken to solve it?" },
  { id: "t2-4", type: "task-2", title: "Online learning", category: "Advantages & disadvantages", prompt: "More and more university courses are now taught entirely online.\n\nDo the advantages of this development outweigh the disadvantages?" },
  { id: "t2-5", type: "task-2", title: "Space exploration spending", category: "Opinion essay", prompt: "Some people argue that governments should spend money on exploring outer space, while others think this money should be spent on problems on Earth.\n\nDiscuss both views and give your own opinion." },
  { id: "t2-6", type: "task-2", title: "Young people and fast food", category: "Problem–solution essay", prompt: "In many countries, young people are eating more fast food than in the past.\n\nWhy is this happening? What can be done to encourage healthier eating?" },
  { id: "t2-7", type: "task-2", title: "Tourism and local culture", category: "Advantages & disadvantages", prompt: "International tourism has brought enormous benefits to many places. At the same time, there is concern about its impact on local inhabitants and the environment.\n\nDo the disadvantages of international tourism outweigh the advantages?" },
  { id: "t2-8", type: "task-2", title: "Museums and free entry", category: "Opinion essay", prompt: "Museums and art galleries should be free for everyone to visit.\n\nTo what extent do you agree or disagree?" },
  { id: "t2-9", type: "task-2", title: "Technology and family life", category: "Two-part question", prompt: "Modern technology has changed the way families spend time together.\n\nHow has technology affected family life? Is this a positive or negative development?" },
  { id: "t2-10", type: "task-2", title: "Older workers", category: "Discussion essay", prompt: "Some people think that companies should employ more older workers, while others believe younger employees are more valuable.\n\nDiscuss both views and give your own opinion." },
  { id: "t2-11", type: "task-2", title: "Plastic packaging", category: "Problem–solution essay", prompt: "The amount of plastic packaging used by supermarkets has increased considerably.\n\nWhat problems does this cause, and what solutions can you suggest?" },
  { id: "t2-12", type: "task-2", title: "Children and competition", category: "Opinion essay", prompt: "Some people think that children should be taught to be competitive, while others believe they should learn to co-operate.\n\nDiscuss both views and give your own opinion." },
];

/** Built-in prompt, or a task uploaded in the admin (id "cam-{book}-{test}-w{n}"). */
export function getWritingPrompt(id) {
  const builtIn = WRITING_PROMPTS.find((p) => p.id === id);
  if (builtIn) return builtIn;
  const slot = parseUploadedId(id);
  return slot && slot.module === "writing" ? getCambridgeOverride("writing", slot.book, slot.test, slot.part) || undefined : undefined;
}

/** Each Cambridge test slot gets a Task 1 + Task 2 pair: uploaded tasks first, built-in samples otherwise. */
export function getCambridgeWriting(book, test) {
  const t1 = WRITING_PROMPTS.filter((p) => p.type === "academic-task-1");
  const t2 = WRITING_PROMPTS.filter((p) => p.type === "task-2");
  const k = Number(book) * 4 + Number(test);
  return {
    task1: getCambridgeOverride("writing", book, test, 1) || t1[k % t1.length],
    task2: getCambridgeOverride("writing", book, test, 2) || t2[k % t2.length],
  };
}

export const LINKING_WORDS = [
  "however", "moreover", "furthermore", "in addition", "therefore", "consequently", "as a result", "for example",
  "for instance", "on the other hand", "in contrast", "although", "whereas", "while", "nevertheless", "firstly",
  "secondly", "finally", "in conclusion", "overall", "to sum up", "similarly", "likewise", "meanwhile", "thus",
];
