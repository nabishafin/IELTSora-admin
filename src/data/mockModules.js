export function generateModules() {
  return [
    {
      key: "reading",
      name: "Reading",
      visible: true,
      description: "Three academic passages with 40 questions covering every IELTS Reading question type.",
      instructions: "You have 60 minutes for three passages. There is no extra transfer time, so write answers directly on the answer sheet.",
      categories: ["Multiple Choice", "True/False/Not Given", "Yes/No/Not Given", "Matching Headings", "Matching Information", "Matching Features", "Sentence Completion", "Summary Completion", "Short Answer"],
    },
    {
      key: "listening",
      name: "Listening",
      visible: true,
      description: "Four recorded sections, from everyday conversations to academic lectures.",
      instructions: "Each recording is played once. Read the questions before each section and check spelling carefully.",
      categories: ["Form Completion", "Note Completion", "Table Completion", "Multiple Choice", "Map/Plan Labelling", "Matching", "Sentence Completion"],
    },
    {
      key: "writing",
      name: "Writing",
      visible: true,
      description: "Academic Task 1 (visual data) and Task 2 (essay) with model structures and checklists.",
      instructions: "Spend about 20 minutes on Task 1 (150+ words) and 40 minutes on Task 2 (250+ words). Task 2 is worth twice as much.",
      categories: ["Task 1 · Line Graph", "Task 1 · Bar Chart", "Task 1 · Pie Chart", "Task 1 · Table", "Task 1 · Process", "Task 1 · Map", "Task 2 · Opinion", "Task 2 · Discussion", "Task 2 · Problem/Solution"],
    },
    {
      key: "speaking",
      name: "Speaking",
      visible: true,
      description: "Part 1 interview, Part 2 long turn and Part 3 discussion with recording and self-assessment.",
      instructions: "Speak naturally and extend your answers. In Part 2 you have one minute to prepare and should speak for up to two minutes.",
      categories: ["Part 1 · Familiar Topics", "Part 2 · Cue Cards", "Part 3 · Discussion", "Pronunciation Drills"],
    },
  ];
}
