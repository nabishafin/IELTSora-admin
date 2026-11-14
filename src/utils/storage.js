/**
 * Data access layer.
 * All admin data lives in localStorage under `ieltsora_admin_*` keys and is
 * seeded from the mock data on first load. Pages only talk to this module
 * (through the hooks in src/hooks), so swapping it for a REST/GraphQL client
 * later only requires changing the functions below.
 */
import { generateStudyPlan } from "@/data/mockStudyPlan";
import { defaultHomepage } from "@/data/mockHomepage";
import { defaultSettings } from "@/data/mockSettings";
import { getDayVocabulary } from "@/data/vocabulary";

export const PREFIX = "ieltsora_admin_";
export const SESSION_KEY = `${PREFIX}session`;
export const CHANGE_EVENT = "ieltsora-admin-storage";

const clone = (v) => JSON.parse(JSON.stringify(v));

export const STORES = {
  studyPlan: { key: `${PREFIX}study_plan`, seed: generateStudyPlan },
  // Uploaded Cambridge Reading passages / Listening sections (see utils/cambridgeContent.js).
  cambridge: { key: `${PREFIX}cambridge_content`, seed: () => [] },
  homepage: { key: `${PREFIX}homepage`, seed: () => clone(defaultHomepage) },
  settings: { key: `${PREFIX}settings`, seed: () => clone(defaultSettings) },
};

/**
 * One-off migrations applied when stored data is read. Each returns the same
 * object when nothing changed, or a new value that is written back.
 */
const MIGRATIONS = {
  // v2: every study-plan day carries 20 vocabulary words.
  [`${PREFIX}study_plan`]: (plan) =>
    Array.isArray(plan) && plan.some((d) => d && d.vocabulary === undefined)
      ? plan.map((d) => (d && d.vocabulary === undefined ? { ...d, vocabulary: getDayVocabulary(d.day) } : d))
      : plan,
};

const cache = new Map();

export function readJSON(key, fallback) {
  if (cache.has(key)) return cache.get(key);
  try {
    const raw = window.localStorage.getItem(key);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      const migrated = MIGRATIONS[key] ? MIGRATIONS[key](parsed) : parsed;
      if (migrated !== parsed) writeJSON(key, migrated, { silent: true });
      else cache.set(key, parsed);
      return migrated;
    }
  } catch {
    /* corrupted or unavailable storage — fall back to seed */
  }
  const value = typeof fallback === "function" ? fallback() : fallback;
  writeJSON(key, value, { silent: true });
  return value;
}

export function writeJSON(key, value, { silent = false } = {}) {
  cache.set(key, value);
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Failed to persist", key, err);
  }
  if (!silent) window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }));
}

export function invalidate(key) {
  if (key) cache.delete(key);
  else cache.clear();
}

export const getStore = (name) => readJSON(STORES[name].key, STORES[name].seed);
export const setStore = (name, value) => writeJSON(STORES[name].key, value);
export const resetStore = (name) => setStore(name, STORES[name].seed());

/** Clears every admin data key (keeps the login session) and re-seeds. */
export function resetAllData() {
  Object.values(STORES).forEach(({ key }) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    cache.delete(key);
  });
  Object.keys(STORES).forEach((name) => getStore(name));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key: null } }));
}
