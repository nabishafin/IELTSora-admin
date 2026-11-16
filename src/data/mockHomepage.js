/** Default homepage content for the student website (shape matches the content export). */
import { DEFAULT_HOMEPAGE } from "@/data/website/homepage";

/** The homepage text the admin used to ship with (kept only to recognise an untouched saved homepage). */
export const legacyHomepage = {
  heroTitle: "Your IELTS Goal. One Focused Day at a Time.",
  heroDescription:
    "A structured 60-day plan that combines Cambridge practice, timed mock tests and daily tasks across Reading, Listening, Writing and Speaking, so you always know exactly what to do next.",
  primaryCta: "Start Your 60-Day Journey",
  secondaryCta: "Explore Practice",
  features: [
    { title: "60-Day Study Plan", description: "Four focused tasks every day, organised into Foundation, Skill Development and Exam Preparation phases." },
    { title: "Cambridge Practice Library", description: "Practise with Cambridge IELTS 10–21 tests, organised by passage, section and task." },
    { title: "Full Mock Tests", description: "Timed, exam-style mock tests with automatic band score estimation for Reading and Listening." },
    { title: "Progress Tracking", description: "See your completed tasks, module scores and estimated band in one clear dashboard." },
    { title: "Every Question Type", description: "From Matching Headings to Map Labelling, practise every IELTS question format." },
    { title: "Writing and Speaking Guidance", description: "Step-by-step task instructions and self-assessment checklists based on the band descriptors." },
  ],
  testimonials: [
    { name: "Aisha R.", role: "Medical graduate, Dhaka", band: "7.5", quote: "Having one clear plan for each day stopped me from wasting time. I went from 6.0 to 7.5 in two months." },
    { name: "Lucas S.", role: "Software engineer, São Paulo", band: "8.0", quote: "The mock tests felt exactly like exam day. The timing practice in the final phase made the real test feel easy." },
    { name: "Mei Lin C.", role: "Master's applicant, Shanghai", band: "7.0", quote: "I finally understood True / False / Not Given. The daily structure kept me consistent." },
  ],
  faqs: [
    { q: "How long does the study plan take?", a: "The plan has 60 days. Each day contains one Reading, Listening, Writing and Speaking task and takes around two to three hours." },
    { q: "Do I need the Cambridge IELTS books?", a: "Practice tasks reference Cambridge IELTS 10–21. The platform organises them so you always know which passage or section to complete." },
    { q: "Can I skip ahead to later days?", a: "By default days unlock in order so you build skills progressively. Your administrator may enable open access." },
    { q: "Is this suitable for General Training?", a: "The plan focuses on Academic IELTS, but Listening and Speaking practice is identical for both versions." },
    { q: "How is my band score estimated?", a: "Reading and Listening raw scores are converted using standard band tables. Writing and Speaking use self-assessment against the official criteria." },
  ],
  footer: {
    tagline: "Focused IELTS preparation, one day at a time.",
    email: "support@ieltsora.example",
    phone: "+44 20 0000 0000",
    address: "12 Learning Lane, London, United Kingdom",
  },
};

/** Default homepage = exactly what the student website shows out of the box. */
export const defaultHomepage = DEFAULT_HOMEPAGE;
