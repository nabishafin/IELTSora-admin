/*
 * 60 days × 20 words of ORIGINAL IELTS vocabulary (word, part of speech, learner meaning, example).
 * Each plan day carries its list as `day.vocabulary = { theme, words }`.
 */
import { VOCAB_DAYS_01_20 } from "./days01-20";
import { VOCAB_DAYS_21_40 } from "./days21-40";
import { VOCAB_DAYS_41_60 } from "./days41-60";

export const VOCABULARY = [...VOCAB_DAYS_01_20, ...VOCAB_DAYS_21_40, ...VOCAB_DAYS_41_60].sort((a, b) => a.day - b.day);

export const getDayVocabulary = (day) => {
  const d = VOCABULARY.find((v) => v.day === Number(day));
  return d ? { theme: d.theme, words: d.words.map((w) => ({ ...w })) } : null;
};
