/* ORIGINAL demonstration speaking questions (not Cambridge material). */
import { getCambridgeOverride, parseUploadedId } from "./cambridgeContent";

export const SPEAKING_PARTS = {
  part1: { label: "Part 1", name: "Introduction and Interview", answerSeconds: 30, description: "Short answers about familiar topics. 4–5 minutes in the real test." },
  part2: { label: "Part 2", name: "Individual Long Turn", prepSeconds: 60, answerSeconds: 120, description: "One minute to prepare, then speak for up to two minutes." },
  part3: { label: "Part 3", name: "Discussion", answerSeconds: 60, description: "Abstract questions linked to the Part 2 topic. 4–5 minutes in the real test." },
};

export const PART1_SETS = [
  { id: "p1-hometown", topic: "Hometown", questions: ["Where is your hometown?", "What do you like most about it?", "Has your hometown changed much in recent years?", "Is it a good place for young people to live?", "Would you like to live there in the future?"] },
  { id: "p1-work", topic: "Work or Studies", questions: ["Do you work or are you a student?", "Why did you choose that job or subject?", "What do you find most interesting about it?", "Is there anything you would like to change about it?", "What do you plan to do in the future?"] },
  { id: "p1-reading", topic: "Reading", questions: ["Do you enjoy reading?", "What kinds of things do you usually read?", "Did you read a lot when you were a child?", "Do you prefer printed books or e-books?", "Has the internet changed the way people read?"] },
  { id: "p1-weather", topic: "Weather", questions: ["What's the weather like where you live?", "What is your favourite kind of weather?", "Does the weather affect your mood?", "Do you check the weather forecast every day?", "Has the weather in your country changed recently?"] },
  { id: "p1-technology", topic: "Technology", questions: ["How often do you use a computer?", "What apps do you use most?", "Do you think you spend too much time on your phone?", "Which piece of technology would you find hardest to live without?", "Did you learn to use technology from your parents?"] },
  { id: "p1-food", topic: "Food and Cooking", questions: ["What kind of food do you like?", "Do you cook at home?", "What is a traditional dish from your country?", "Do you prefer eating at home or in restaurants?", "Have your eating habits changed since you were a child?"] },
  { id: "p1-music", topic: "Music", questions: ["What kind of music do you listen to?", "When do you usually listen to music?", "Have you ever learned to play an instrument?", "Do you prefer live music or recorded music?", "Is music important in your culture?"] },
  { id: "p1-travel", topic: "Travel", questions: ["Do you like travelling?", "Where did you go on your last trip?", "Do you prefer travelling alone or with others?", "What do you usually pack when you travel?", "Is there a place you would really like to visit?"] },
  { id: "p1-sport", topic: "Sport and Exercise", questions: ["Do you do any sport?", "What sports are popular in your country?", "Did you play sports at school?", "Do you prefer watching or playing sport?", "How do you stay healthy?"] },
  { id: "p1-friends", topic: "Friends", questions: ["How often do you see your friends?", "What do you usually do together?", "Do you prefer having a few close friends or many friends?", "How did you meet your best friend?", "Is it easy to make new friends as an adult?"] },
];

export const CUE_CARDS = [
  { id: "cc-skill", topic: "A skill you learned", cue: "Describe a skill you learned that you think is useful.", bullets: ["what the skill is", "when and how you learned it", "how often you use it"], followUp: "and explain why you think it is useful.", part3: ["What skills do young people need most today?", "Is it better to learn skills from a teacher or by yourself online?", "Do you think schools focus enough on practical skills?", "How might the skills people need change in the future?"] },
  { id: "cc-place", topic: "A peaceful place", cue: "Describe a place you go to when you want to relax.", bullets: ["where it is", "how often you go there", "what you do there"], followUp: "and explain why it helps you to relax.", part3: ["Why do people find it hard to relax nowadays?", "Should cities create more quiet public spaces?", "Do older and younger people relax in different ways?", "Can technology help people to relax?"] },
  { id: "cc-person", topic: "A person who inspired you", cue: "Describe a person who has had an important influence on you.", bullets: ["who this person is", "how you know them", "what they did"], followUp: "and explain how they influenced you.", part3: ["Who are the main role models for young people today?", "Do celebrities have a responsibility to behave well?", "Are teachers as influential as they used to be?", "How do parents influence their children's career choices?"] },
  { id: "cc-book", topic: "A book you enjoyed", cue: "Describe a book you read that you found interesting.", bullets: ["what the book was", "when you read it", "what it was about"], followUp: "and explain why you found it interesting.", part3: ["Why do some people prefer films to books?", "Should children be required to read books at school?", "Will printed books disappear in the future?", "What can we learn from reading fiction?"] },
  { id: "cc-event", topic: "A memorable celebration", cue: "Describe a celebration you attended that you remember well.", bullets: ["what the celebration was", "where it took place", "who was there"], followUp: "and explain why it was memorable.", part3: ["Why are celebrations important in society?", "Have traditional celebrations changed in your country?", "Do people spend too much money on celebrations?", "Are public celebrations better than private ones?"] },
  { id: "cc-tech", topic: "A useful app or website", cue: "Describe an app or website that you find useful.", bullets: ["what it is", "how you found out about it", "what you use it for"], followUp: "and explain why it is useful to you.", part3: ["How has the internet changed the way people learn?", "Are there any dangers in relying too much on apps?", "Should children's screen time be limited?", "What new technology might be common in ten years?"] },
  { id: "cc-trip", topic: "A journey you remember", cue: "Describe a journey you went on that was longer than expected.", bullets: ["where you were going", "how you travelled", "why it took longer"], followUp: "and explain how you felt about it.", part3: ["Why do people enjoy travelling?", "How could public transport in cities be improved?", "Is air travel too cheap today?", "Will people travel less in the future?"] },
  { id: "cc-goal", topic: "A goal you achieved", cue: "Describe a goal you set and achieved.", bullets: ["what the goal was", "why you set it", "how you achieved it"], followUp: "and explain how you felt when you achieved it.", part3: ["Is it important for young people to set goals?", "Why do many people fail to achieve their goals?", "Should schools reward effort or results?", "Do people value success differently in different cultures?"] },
  { id: "cc-environment", topic: "Protecting the environment", cue: "Describe something you do to help the environment.", bullets: ["what you do", "when you started doing it", "how easy or difficult it is"], followUp: "and explain why you do it.", part3: ["Who is more responsible for the environment: individuals or governments?", "Should companies be fined for pollution?", "How can children be taught to care for nature?", "Is economic growth compatible with protecting the environment?"] },
  { id: "cc-advice", topic: "Good advice", cue: "Describe a time when you received good advice.", bullets: ["who gave you the advice", "what the advice was", "whether you followed it"], followUp: "and explain why it was good advice.", part3: ["Who do young people usually ask for advice?", "Is advice from the internet reliable?", "Why do some people refuse to take advice?", "Should professionals such as doctors give advice for free online?"] },
  { id: "cc-building", topic: "An interesting building", cue: "Describe a building you find interesting.", bullets: ["where it is", "what it looks like", "what it is used for"], followUp: "and explain why you find it interesting.", part3: ["Should old buildings always be preserved?", "How does architecture affect people's mood?", "Are modern cities becoming too similar?", "Who should pay for maintaining historic buildings?"] },
  { id: "cc-food", topic: "A meal you enjoyed", cue: "Describe a special meal you had.", bullets: ["what you ate", "where you had it", "who you were with"], followUp: "and explain why it was special.", part3: ["How have eating habits changed in your country?", "Is it important for families to eat together?", "Should schools teach cooking?", "Why is fast food so popular?"] },
];

const builtInFor = (book, test) => {
  const k = Number(book) * 4 + Number(test);
  return { part1: PART1_SETS[k % PART1_SETS.length], card: CUE_CARDS[k % CUE_CARDS.length] };
};

/** Part 2 + Part 3 uploaded for a test, merged into one card (missing pieces fall back to the built-in card). */
function uploadedCard(book, test) {
  const p2 = getCambridgeOverride("speaking", book, test, 2);
  const p3 = getCambridgeOverride("speaking", book, test, 3);
  if (!p2 && !p3) return null;
  const base = builtInFor(book, test).card;
  return {
    id: `cam-${book}-${test}-s2`,
    topic: p2?.topic || p3?.topic || base.topic,
    cue: p2?.cue || base.cue,
    bullets: p2 ? p2.bullets : base.bullets,
    followUp: p2 ? p2.followUp : base.followUp,
    part3: p3?.questions?.length ? p3.questions : base.part3,
  };
}

/** Exact lookups (undefined when the id is unknown). Uploaded ids look like "cam-21-1-s1" / "cam-21-1-s2". */
export function findPart1Set(id) {
  const builtIn = PART1_SETS.find((s) => s.id === id);
  if (builtIn) return builtIn;
  const slot = parseUploadedId(id);
  return slot?.module === "speaking" && slot.part === 1 ? getCambridgeOverride("speaking", slot.book, slot.test, 1) || undefined : undefined;
}
export function findCueCard(id) {
  const builtIn = CUE_CARDS.find((c) => c.id === id);
  if (builtIn) return builtIn;
  const slot = parseUploadedId(id);
  return slot?.module === "speaking" && slot.part === 2 ? uploadedCard(slot.book, slot.test) || undefined : undefined;
}
export const getCueCard = (id) => findCueCard(id) || CUE_CARDS[0];
export const getPart1Set = (id) => findPart1Set(id) || PART1_SETS[0];

/** Speaking set for a Cambridge book/test slot: uploaded parts first, built-in samples otherwise. */
export function getCambridgeSpeaking(book, test) {
  const base = builtInFor(book, test);
  return { part1: getCambridgeOverride("speaking", book, test, 1) || base.part1, card: uploadedCard(book, test) || base.card };
}

export const SPEAKING_CRITERIA = [
  { key: "fluency", label: "Fluency & Coherence" },
  { key: "lexical", label: "Lexical Resource" },
  { key: "grammar", label: "Grammatical Range & Accuracy" },
  { key: "pronunciation", label: "Pronunciation" },
];
