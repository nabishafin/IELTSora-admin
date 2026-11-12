/**
 * Cross-app content sync.
 * The admin dashboard and the student website run on different origins, so
 * they cannot share localStorage. Content is exchanged as a JSON file in the
 * `ieltsora-content-v1` format, which the student website imports.
 */
import { getStore, setStore } from "@/utils/storage";
import { MODULE_KEYS, PHASES } from "@/utils/constants";

export const CONTENT_FORMAT = "ieltsora-content-v1";
const PHASE_NAMES = PHASES.map((p) => p.name);

const sanitizeTask = (t) => ({
  id: String(t.id),
  module: t.module,
  title: t.title,
  source: t.source && t.source.book ? { book: Number(t.source.book), test: Number(t.source.test), part: t.source.part === null || t.source.part === undefined || t.source.part === "" ? null : Number(t.source.part) } : null,
  steps: Array.isArray(t.steps) ? t.steps.filter(Boolean).map(String) : [],
  duration: Number(t.duration) || 0,
  difficulty: t.difficulty,
});

const sanitizeDay = (d) => ({
  day: Number(d.day),
  title: d.title,
  phase: d.phase,
  objectives: Array.isArray(d.objectives) ? d.objectives.filter(Boolean).map(String) : [],
  published: Boolean(d.published),
  tasks: (d.tasks || []).map(sanitizeTask),
});

const sanitizeHomepage = (h) => ({
  heroTitle: h.heroTitle || "",
  heroDescription: h.heroDescription || "",
  primaryCta: h.primaryCta || "",
  secondaryCta: h.secondaryCta || "",
  features: (h.features || []).map((f) => ({ title: f.title || "", description: f.description || "" })),
  testimonials: (h.testimonials || []).map((t) => ({ name: t.name || "", role: t.role || "", band: String(t.band ?? ""), quote: t.quote || "" })),
  faqs: (h.faqs || []).map((f) => ({ q: f.q || "", a: f.a || "" })),
  footer: {
    tagline: h.footer?.tagline || "",
    email: h.footer?.email || "",
    phone: h.footer?.phone || "",
    address: h.footer?.address || "",
  },
});

export function buildContentExport() {
  const settings = getStore("settings");
  return {
    format: CONTENT_FORMAT,
    exportedAt: new Date().toISOString(),
    studyPlan: getStore("studyPlan").map(sanitizeDay).sort((a, b) => a.day - b.day),
    homepage: sanitizeHomepage(getStore("homepage")),
    settings: { allowFutureDays: Boolean(settings?.studyPlan?.allowFutureDays) },
  };
}

export function downloadContentExport() {
  const data = buildContentExport();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ieltsora-content-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return data;
}

/** Returns a list of validation errors (empty when the payload is valid). */
export function validateContent(data) {
  const errors = [];
  if (!data || typeof data !== "object") return ["File is not a JSON object."];
  if (data.format !== CONTENT_FORMAT) errors.push(`Unsupported format "${data.format ?? "missing"}" — expected "${CONTENT_FORMAT}".`);
  if (!Array.isArray(data.studyPlan)) errors.push("studyPlan must be an array.");
  else
    data.studyPlan.forEach((d, i) => {
      if (!Number.isInteger(Number(d.day))) errors.push(`studyPlan[${i}].day is invalid.`);
      if (!PHASE_NAMES.includes(d.phase)) errors.push(`Day ${d.day}: invalid phase "${d.phase}".`);
      if (!Array.isArray(d.tasks)) errors.push(`Day ${d.day}: tasks must be an array.`);
      else d.tasks.forEach((t) => !MODULE_KEYS.includes(t.module) && errors.push(`Day ${d.day}: invalid module "${t.module}".`));
    });
  if (!data.homepage || typeof data.homepage !== "object") errors.push("homepage is missing.");
  return errors.slice(0, 6);
}

/** Applies a validated content payload to the admin stores. */
export function applyContentImport(data) {
  setStore("studyPlan", data.studyPlan.map(sanitizeDay).sort((a, b) => a.day - b.day));
  setStore("homepage", sanitizeHomepage(data.homepage));
  if (data.settings && typeof data.settings.allowFutureDays === "boolean") {
    const s = getStore("settings");
    setStore("settings", { ...s, studyPlan: { ...s.studyPlan, allowFutureDays: data.settings.allowFutureDays } });
  }
}

export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch {
        reject(new Error("The selected file is not valid JSON."));
      }
    };
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsText(file);
  });
}
