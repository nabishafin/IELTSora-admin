import { createRng, pick, randInt } from "@/utils/random";

const PEOPLE = [
  ["Aisha Rahman", "Bangladesh"], ["Lucas Silva", "Brazil"], ["Mei Lin Chen", "China"], ["Arjun Patel", "India"],
  ["Fatima Al-Sayed", "Egypt"], ["Daniel Kim", "South Korea"], ["Sofia Rossi", "Italy"], ["Omar Haddad", "Jordan"],
  ["Nguyen Thi Lan", "Vietnam"], ["Carlos Mendoza", "Mexico"], ["Yuki Tanaka", "Japan"], ["Amara Okafor", "Nigeria"],
  ["Elena Petrova", "Russia"], ["Hassan Raza", "Pakistan"], ["Priya Sharma", "India"], ["Mateo Garcia", "Spain"],
  ["Zainab Hussain", "Iraq"], ["Kofi Mensah", "Ghana"], ["Ana Ferreira", "Portugal"], ["Tariq Aziz", "Bangladesh"],
  ["Leila Karimi", "Iran"], ["Siti Nurhaliza", "Malaysia"], ["Ahmet Yilmaz", "Turkey"], ["Grace Wanjiru", "Kenya"],
  ["Juan Pablo Ortiz", "Colombia"], ["Hana Novak", "Czech Republic"], ["Ravi Kumar", "Sri Lanka"], ["Isabella Martins", "Brazil"],
  ["Minh Tran", "Vietnam"], ["Nadia Benali", "Morocco"], ["Chen Wei", "China"], ["Sara Johansson", "Sweden"],
  ["Rahul Verma", "India"], ["Ayesha Siddiqui", "Pakistan"], ["Jose Ramirez", "Philippines"], ["Noor Fatima", "UAE"],
  ["Kenji Watanabe", "Japan"], ["Olga Shevchenko", "Ukraine"], ["Samuel Adeyemi", "Nigeria"], ["Mariam Khalil", "Lebanon"],
];

const DOMAINS = ["example.com", "example.org", "example.net", "mail.example.com"];
const TARGETS = [6.0, 6.5, 6.5, 7.0, 7.0, 7.0, 7.5, 7.5, 8.0];
const round5 = (n) => Math.max(4, Math.min(9, Math.round(n * 2) / 2));

const ACTIVITIES = {
  reading: (b, t) => `Cambridge ${b} · Test ${t} · Passage ${randIntSafe(1, 3)}`,
  listening: (b, t) => `Cambridge ${b} · Test ${t} · Section ${randIntSafe(1, 4)}`,
  writing: () => pickSafe(["Academic Task 1 · Line graph", "Academic Task 2 · Opinion essay", "Academic Task 1 · Process diagram", "Academic Task 2 · Discussion essay"]),
  speaking: () => pickSafe(["Part 1 · Familiar topics", "Part 2 · Cue card", "Part 3 · Discussion"]),
};
let _rng = Math.random;
const randIntSafe = (a, b) => randInt(_rng, a, b);
const pickSafe = (arr) => pick(_rng, arr);

const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[^a-z\s]/g, "").trim().split(/\s+/);

export function makePracticeHistory(rng, { currentDay, estimatedBand, lastActive, count }) {
  _rng = rng;
  const modules = ["reading", "listening", "writing", "speaking"];
  const history = [];
  const last = new Date(lastActive).getTime();
  for (let i = 0; i < count; i++) {
    const module = pick(rng, modules);
    const type = module === "reading" || module === "listening" ? (rng() < 0.7 ? "cambridge" : "study-plan") : rng() < 0.15 ? "mock" : "study-plan";
    const book = randInt(rng, 10, 21);
    const test = randInt(rng, 1, 4);
    const day = Math.max(1, currentDay - i);
    const activity =
      type === "study-plan"
        ? `Day ${day} · ${module[0].toUpperCase() + module.slice(1)} task`
        : type === "mock"
          ? `Mock Test · ${module[0].toUpperCase() + module.slice(1)}`
          : ACTIVITIES[module](book, test);
    history.push({
      id: `ph-${i}-${Math.floor(rng() * 1e6)}`,
      date: new Date(last - i * randInt(rng, 1, 3) * 86400000 - randInt(rng, 0, 20) * 3600000).toISOString(),
      module,
      type,
      activity,
      score: round5(estimatedBand + (rng() - 0.5) * 1.5),
      duration: randInt(rng, 15, 60),
    });
  }
  return history;
}

export function generateUsers() {
  const now = Date.now();
  return PEOPLE.map(([name, country], i) => {
    const rng = createRng(1000 + i * 7919);
    const parts = slug(name);
    const email = `${parts[0]}.${parts[parts.length - 1]}${i % 3 === 0 ? randInt(rng, 10, 99) : ""}@${DOMAINS[i % DOMAINS.length]}`;
    const status = rng() < 0.8 ? "active" : "inactive";
    const joinedDaysAgo = randInt(rng, 3, 340);
    const maxDay = Math.min(60, Math.max(1, Math.floor(joinedDaysAgo * 0.9)));
    const currentDay = randInt(rng, 1, maxDay);
    const completedTasks = Math.min(240, Math.max(0, (currentDay - 1) * 4 + randInt(rng, 0, 3) - randInt(rng, 0, Math.floor(currentDay / 6))));
    const targetBand = pick(rng, TARGETS);
    const progress = currentDay / 60;
    const estimatedBand = round5(targetBand - 1.5 + progress * 1.3 + (rng() - 0.5) * 0.6);
    const scores = {
      reading: round5(estimatedBand + (rng() - 0.4) * 1),
      listening: round5(estimatedBand + (rng() - 0.4) * 1),
      writing: round5(estimatedBand - 0.5 + (rng() - 0.5) * 0.8),
      speaking: round5(estimatedBand + (rng() - 0.5) * 0.8),
    };
    const lastActiveDays = status === "active" ? randInt(rng, 0, 6) : randInt(rng, 18, 70);
    const lastActive = new Date(now - lastActiveDays * 86400000 - randInt(rng, 0, 20) * 3600000).toISOString();
    return {
      id: `u-${i + 1}`,
      name,
      email,
      country,
      status,
      joinedAt: new Date(now - joinedDaysAgo * 86400000).toISOString(),
      currentDay,
      completedTasks,
      targetBand,
      estimatedBand,
      scores,
      lastActive,
      practiceHistory: makePracticeHistory(rng, { currentDay, estimatedBand, lastActive, count: randInt(rng, 4, 10) }),
    };
  });
}
