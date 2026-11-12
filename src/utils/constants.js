export const MODULES = [
  { key: "reading", label: "Reading" },
  { key: "listening", label: "Listening" },
  { key: "writing", label: "Writing" },
  { key: "speaking", label: "Speaking" },
];
export const MODULE_KEYS = MODULES.map((m) => m.key);
export const moduleLabel = (key) => MODULES.find((m) => m.key === key)?.label || key;

export const PHASES = [
  { name: "Foundation", start: 1, end: 20, description: "Learn the format, core strategies and build a baseline." },
  { name: "Skill Development", start: 21, end: 40, description: "Deepen every skill with harder question types and timing." },
  { name: "Exam Preparation", start: 41, end: 60, description: "Full timed tests, mock exams and targeted polishing." },
];
export const phaseForDay = (day) => (PHASES.find((p) => day >= p.start && day <= p.end) || PHASES[0]).name;

export const DIFFICULTIES = ["Easy", "Medium", "Hard"];
export const BAND_OPTIONS = ["4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"];
export const CAMBRIDGE_BOOK_NUMBERS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
export const TOTAL_DAYS = 60;

/** Number of parts per module in a Cambridge test. */
export const PARTS_PER_MODULE = { reading: 3, listening: 4, writing: 2, speaking: 3 };
export const partLabel = (module) =>
  ({ reading: "Passage", listening: "Section", writing: "Task", speaking: "Part" })[module] || "Part";

export const COUNTRIES = [
  "Bangladesh", "Brazil", "China", "Colombia", "Czech Republic", "Egypt", "Ghana", "India", "Iran", "Iraq", "Italy",
  "Japan", "Jordan", "Kenya", "Lebanon", "Malaysia", "Mexico", "Morocco", "Nigeria", "Pakistan", "Philippines",
  "Portugal", "Russia", "Saudi Arabia", "South Korea", "Spain", "Sri Lanka", "Sweden", "Turkey", "UAE", "Ukraine",
  "United Kingdom", "Vietnam", "Other",
];

export const CHART = {
  ink: "#1B1B1B",
  mid: "#737373",
  light: "#a3a3a3",
  faint: "#d4d4d4",
  grid: "#EDEDED",
  primary: "#0171E3",
  palette: ["#0171E3", "#EB6E00", "#6B1EFD", "#0B991F"],
};
/** Module colours (identical to the student website). */
export const MODULE_COLORS = { reading: "#0171E3", listening: "#EB6E00", writing: "#6B1EFD", speaking: "#0B991F" };
export const moduleColor = (keyOrLabel) => MODULE_COLORS[String(keyOrLabel).toLowerCase()] || CHART.primary;
