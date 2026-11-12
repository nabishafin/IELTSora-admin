/** Mock tests built from the question bank. */
export const DEFAULT_BAND_MAP = [
  { min: 39, band: "9.0" }, { min: 37, band: "8.5" }, { min: 35, band: "8.0" }, { min: 33, band: "7.5" },
  { min: 30, band: "7.0" }, { min: 27, band: "6.5" }, { min: 23, band: "6.0" }, { min: 19, band: "5.5" },
  { min: 15, band: "5.0" }, { min: 13, band: "4.5" }, { min: 10, band: "4.0" },
];

export const DEFAULT_DURATIONS = { reading: 60, listening: 30, writing: 60, speaking: 14 };

export function generateMockTests() {
  const now = Date.now();
  const bandMap = () => DEFAULT_BAND_MAP.map((r) => ({ ...r }));
  return [
    {
      id: "mock-1",
      name: "Academic Mock Test 1 · Full Exam",
      description: "A complete four-module mock exam following official IELTS timing.",
      modules: ["reading", "listening", "writing", "speaking"],
      durations: { ...DEFAULT_DURATIONS },
      questionIds: ["q-1", "q-2", "q-7", "q-8", "q-11", "q-15", "q-19", "q-27", "q-3", "q-4", "q-35", "q-51", "q-55"],
      scoring: { mode: "band", bandMap: bandMap(), marksPerQuestion: 1, passMark: 60 },
      published: true,
      createdAt: new Date(now - 40 * 86400000).toISOString(),
    },
    {
      id: "mock-2",
      name: "Reading Sprint · Timed Passages",
      description: "Reading-only mock focused on speed and the hardest question types.",
      modules: ["reading"],
      durations: { ...DEFAULT_DURATIONS },
      questionIds: ["q-5", "q-9", "q-10", "q-12", "q-13", "q-16", "q-17", "q-20", "q-23", "q-31", "q-43", "q-47"],
      scoring: { mode: "band", bandMap: bandMap(), marksPerQuestion: 1, passMark: 60 },
      published: true,
      createdAt: new Date(now - 21 * 86400000).toISOString(),
    },
    {
      id: "mock-3",
      name: "Listening Diagnostic",
      description: "Short listening diagnostic for new students, scored by marks.",
      modules: ["listening"],
      durations: { ...DEFAULT_DURATIONS },
      questionIds: ["q-6", "q-25", "q-29", "q-30", "q-36", "q-38", "q-52", "q-56", "q-57"],
      scoring: { mode: "marks", bandMap: bandMap(), marksPerQuestion: 1, passMark: 60 },
      published: false,
      createdAt: new Date(now - 5 * 86400000).toISOString(),
    },
  ];
}
