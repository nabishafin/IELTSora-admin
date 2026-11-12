/**
 * Cambridge IELTS library (Books 10–21, Tests 1–4).
 * IMPORTANT: every passage, transcript and prompt here is ORIGINAL demo content
 * written for IELTSora. No text is copied from the published Cambridge books.
 */
import { CAMBRIDGE_BOOK_NUMBERS } from "@/utils/constants";

const READING_TOPICS = [
  ["The Hidden Life of Urban Bees", "urban beekeeping"],
  ["Rethinking the Night Sky", "light pollution"],
  ["The Economics of Repair", "the repair economy"],
  ["Salt Roads of the Ancient World", "historic salt trading routes"],
  ["Why Forests Talk", "underground fungal networks"],
  ["The Language of Bird Migration", "bird navigation"],
  ["Concrete That Heals Itself", "self-repairing building materials"],
  ["The Psychology of Waiting", "how people perceive queues"],
  ["Rivers Under the City", "buried urban rivers"],
  ["The Rise of Vertical Farming", "indoor vertical agriculture"],
  ["Memory and the Sense of Smell", "scent and memory"],
  ["Lost Crops of the Andes", "traditional mountain agriculture"],
  ["The Science of Sleep in Teenagers", "adolescent sleep patterns"],
  ["Glass: A Material Reinvented", "the history of glassmaking"],
  ["Coral Gardeners", "coral reef restoration"],
  ["The Quiet Revolution of the Bicycle", "cycling infrastructure"],
  ["Maps That Changed the World", "the history of cartography"],
  ["Desert Water Harvesting", "collecting water from fog"],
  ["The Mathematics of Crowds", "pedestrian crowd behaviour"],
  ["Children and Second Languages", "early language acquisition"],
  ["Tidal Energy at the Crossroads", "tidal power generation"],
  ["The Craft of Timekeeping", "the development of clocks"],
  ["Wolves Return to Europe", "large carnivore recovery"],
  ["The Invention of the Public Library", "the origins of public libraries"],
  ["Plastics in the Deep Ocean", "deep-sea microplastics"],
  ["Ancient Engineers of Rome", "Roman aqueduct construction"],
  ["The Business of Boredom", "boredom and creativity"],
  ["Volcanic Soils and Vineyards", "volcanic agriculture"],
  ["How Cities Keep Cool", "urban heat islands"],
  ["The Secret Lives of Octopuses", "cephalopod intelligence"],
  ["Paper Money and Trust", "the origins of banknotes"],
  ["Silent Sounds: Infrasound in Nature", "infrasound communication in animals"],
  ["The Return of the Tram", "modern tram networks"],
  ["Archaeology From the Air", "aerial and satellite archaeology"],
  ["Seeds for the Future", "global seed banks"],
  ["Colour Perception Across Cultures", "colour vocabulary in different languages"],
];

const LISTENING = {
  1: [
    ["Booking a Community Hall", "a caller arranging to hire a community hall for a birthday party"],
    ["Joining a Cycling Club", "a new member asking about cycling club membership"],
    ["Hotel Reservation Enquiry", "a guest checking room options for a family holiday"],
    ["Registering at a Language School", "a student enrolling in evening language classes"],
    ["Lost Property Report", "a traveller reporting a bag left on a train"],
    ["Renting a Holiday Cottage", "a couple asking about a cottage by the coast"],
  ],
  2: [
    ["Guided Tour of a Botanic Garden", "a guide introducing the main zones of a botanic garden"],
    ["Volunteer Programme Briefing", "a coordinator explaining roles for festival volunteers"],
    ["New Leisure Centre Facilities", "a manager describing a newly opened leisure centre"],
    ["Radio Talk on Local Markets", "a presenter describing weekend farmers' markets"],
    ["Museum Audio Guide", "an introduction to a maritime museum's galleries"],
    ["City Walking Trail", "a talk about a self-guided heritage trail"],
  ],
  3: [
    ["Planning a Group Presentation", "two students dividing work for a presentation on renewable energy"],
    ["Tutorial on a Field Trip Report", "a tutor giving feedback on a geography field report"],
    ["Discussing a Marketing Case Study", "students analysing a small company's advertising campaign"],
    ["Research Methods Seminar", "two students choosing a survey method for their project"],
    ["Preparing a Science Poster", "students organising results from a plant growth experiment"],
    ["Course Selection Advice", "an adviser helping a student choose optional modules"],
  ],
  4: [
    ["Lecture: The History of Chocolate", "a lecture on how chocolate production spread worldwide"],
    ["Lecture: Animal Camouflage", "a lecture on how animals use colour and pattern"],
    ["Lecture: Sustainable Architecture", "a lecture on energy-efficient building design"],
    ["Lecture: The Psychology of Habits", "a lecture on how habits are formed and broken"],
    ["Lecture: Ocean Currents and Climate", "a lecture on how currents distribute heat"],
    ["Lecture: Early Printing Technology", "a lecture on the spread of the printing press"],
  ],
};

const WRITING_T1 = [
  ["line graph", "The graph shows the percentage of households with internet access in three countries between 2000 and 2020."],
  ["bar chart", "The chart compares average weekly hours spent on four leisure activities by different age groups."],
  ["pie charts", "The pie charts show how a typical household's energy use was divided in 1990 and 2020."],
  ["table", "The table gives information about the number of international visitors to five cities in 2015 and 2023."],
  ["process diagram", "The diagram illustrates the stages in producing olive oil from harvest to bottling."],
  ["maps", "The maps show changes to a small coastal village between 2000 and the present day."],
  ["mixed charts", "The bar chart and line graph show water consumption by sector and total population in one region."],
  ["line graph", "The graph shows the amount of waste recycled in four European cities from 2005 to 2025."],
];

const WRITING_T2 = [
  "Some people believe that unpaid community service should be a compulsory part of high school programmes. To what extent do you agree or disagree?",
  "In many countries, people are living longer than ever before. What are the advantages and disadvantages of an ageing population?",
  "Some argue that governments should invest in public transport rather than building new roads. Discuss both views and give your own opinion.",
  "More and more people are choosing to work from home. Is this a positive or negative development?",
  "Many young people today spend more time online than with friends in person. Why is this happening, and what effects does it have?",
  "Some people think museums should be free for everyone, while others believe visitors should pay. Discuss both views and give your opinion.",
  "Global tourism has increased dramatically. What problems does this cause, and how can they be solved?",
  "Some believe that children learn best through play, while others think formal teaching is more effective. Discuss both views and give your own opinion.",
];

const SPEAKING = [
  { p1: ["Where do you live at the moment?", "What do you like most about your neighbourhood?", "How often do you visit parks?", "Would you like to move somewhere else in the future?"], card: "Describe a place in nature that you enjoy visiting.", bullets: ["where it is", "how often you go there", "what you do there", "and explain why you enjoy it"], p3: ["Why do people like spending time in nature?", "Should cities create more green spaces?", "How might people's relationship with nature change in the future?"] },
  { p1: ["Do you enjoy cooking?", "What did you eat for breakfast today?", "Is there any food you disliked as a child?", "Do you prefer eating at home or in restaurants?"], card: "Describe a meal you remember well.", bullets: ["what the meal was", "who you ate it with", "where you had it", "and explain why you remember it"], p3: ["How have eating habits changed in your country?", "Should schools teach cooking?", "Is fast food a problem for society?"] },
  { p1: ["What kind of music do you like?", "Did you learn a musical instrument at school?", "When do you usually listen to music?", "Has your taste in music changed over time?"], card: "Describe a skill you learned that took a long time.", bullets: ["what the skill is", "how you learned it", "what difficulties you had", "and explain how you feel about it now"], p3: ["Which skills are most important for young people today?", "Is it better to learn from a teacher or on your own?", "How will technology change the way people learn skills?"] },
  { p1: ["Do you use public transport?", "How do you usually travel to work or study?", "Do you like travelling long distances?", "What would improve transport in your city?"], card: "Describe a journey that did not go as planned.", bullets: ["where you were going", "what went wrong", "how you dealt with the problem", "and explain what you learned from it"], p3: ["Why do people travel more today than in the past?", "What are the effects of tourism on local communities?", "Should air travel be more expensive to protect the environment?"] },
  { p1: ["Do you like reading?", "What did you read as a child?", "Do you prefer printed books or e-books?", "Where do you usually read?"], card: "Describe a person who taught you something important.", bullets: ["who the person is", "how you know them", "what they taught you", "and explain why it was important"], p3: ["What qualities make a good teacher?", "Do parents or schools have more influence on children?", "How has the role of teachers changed?"] },
  { p1: ["How do you usually spend your weekends?", "Do you prefer relaxing indoors or outdoors?", "Do you have any hobbies?", "Have you started a new hobby recently?"], card: "Describe a piece of technology you find useful.", bullets: ["what it is", "when you got it", "how you use it", "and explain why it is useful to you"], p3: ["Has technology made life simpler or more complicated?", "Should children have limits on screen time?", "What technology will be important in twenty years?"] },
];

const paragraphSet = (title, subject, seed) => {
  const years = [1890, 1925, 1968, 1987, 2003, 2011][seed % 6];
  const pctA = 18 + (seed % 7) * 4;
  return [
    `A. Interest in ${subject} has grown steadily over the past two decades. Researchers who once regarded the subject as a niche concern now describe it as central to understanding how societies adapt to change. "${title}" is, in this sense, not only a story about a single phenomenon but about the way knowledge itself develops when new evidence becomes available.`,
    `B. The earliest systematic records date from around ${years}, when a small group of enthusiasts began documenting their observations in detail. Their notes were largely ignored at the time, partly because the methods they used were considered unscientific. Only later did specialists recognise that these informal records contained valuable long-term data that could not be reconstructed in any other way.`,
    `C. Modern studies have challenged several popular assumptions. One widely cited survey found that roughly ${pctA} per cent of participants held beliefs about ${subject} that were contradicted by measurable evidence. The authors argue that this gap between perception and reality is not caused by a lack of interest but by the way the topic has traditionally been presented in schools and the media.`,
    `D. Critics, however, warn against drawing firm conclusions too quickly. They point out that many of the most dramatic findings come from small samples gathered in a limited number of locations. Until larger, coordinated projects are carried out, they suggest, it would be unwise to base public policy on the current research alone.`,
    `E. Despite these reservations, there is broad agreement that ${subject} deserves sustained attention. Several universities have recently launched interdisciplinary programmes that bring together scientists, historians and economists, and early results suggest that this collaborative approach may finally produce answers to questions that have remained unresolved for generations.`,
  ].join("\n\n");
};

const transcriptFor = (section, title, scene) => {
  if (section === 1)
    return `RECEPTIONIST: Good morning, how can I help you?\nCALLER: Hi, I'm calling about ${scene.replace(/^a /, "")}. Could you give me some details?\nRECEPTIONIST: Of course. Can I start by taking your name?\nCALLER: Yes, it's Daniela Morgan — that's M-O-R-G-A-N.\nRECEPTIONIST: Thank you. And a contact number?\nCALLER: It's 07700 914 362.\nRECEPTIONIST: Lovely. The standard rate is £45, but on weekdays it drops to £32. You'll also need to pay a deposit of £20 when you book.\nCALLER: That sounds fine. Is parking available?\nRECEPTIONIST: Yes, there's a car park behind the building, and it's free after six o'clock.`;
  if (section === 2)
    return `SPEAKER: Welcome, everyone, and thank you for coming along today. My name is Peter, and I'll be giving you an overview of ${scene.replace(/^an? /, "")}. First, a little background: the site first opened to the public in 1998, and since then it has been expanded three times. If you look at the plan in front of you, you'll see the main entrance at the bottom. To the left is the information desk, and straight ahead is the café, which was relocated last year to make room for a new exhibition space. Please note that the north wing is closed on Mondays for maintenance.`;
  if (section === 3)
    return `TUTOR: So, how is the project going?\nSTUDENT A: Quite well, I think. We've finished collecting data, but we're still deciding how to present it.\nSTUDENT B: I wanted to use pie charts, but Maya thinks a table would be clearer.\nSTUDENT A: Well, we have eight categories, and pie charts get confusing with that many.\nTUTOR: That's a fair point. What about your conclusions — have you linked them back to your original question?\nSTUDENT B: Not yet. That's something we need to work on before Friday.`;
  return `LECTURER: Today I want to look at ${title.replace(/^Lecture: /, "").toLowerCase()}. Traditionally, this topic has been explained in very simple terms, but recent research suggests the picture is far more complex. I'll begin with some historical context, then move on to three key factors, and finally discuss what this means for future research. The first factor is environmental. Studies carried out in the 1970s showed a clear link between temperature and the patterns we observe, although later work found that this relationship was weaker than first thought. The second factor is economic...`;
};

function buildTest(book, testNo, bookIndex) {
  const base = bookIndex * 12 + (testNo - 1) * 3;
  const tIdx = bookIndex * 4 + (testNo - 1);
  const speaking = SPEAKING[tIdx % SPEAKING.length];
  const t1 = WRITING_T1[tIdx % WRITING_T1.length];
  return {
    testNo,
    published: book <= 20 || testNo <= 2,
    reading: [1, 2, 3].map((part) => {
      const [title, subject] = READING_TOPICS[(base + part - 1) % READING_TOPICS.length];
      return { part, title, text: paragraphSet(title, subject, base + part) };
    }),
    listening: [1, 2, 3, 4].map((section) => {
      const [title, scene] = LISTENING[section][tIdx % LISTENING[section].length];
      return {
        section,
        title,
        audioLabel: `cambridge-${book}-test-${testNo}-section-${section}.mp3`,
        transcript: transcriptFor(section, title, scene),
      };
    }),
    writing: {
      task1: { prompt: `${t1[1]} Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.`, visual: t1[0] },
      task2: { prompt: `${WRITING_T2[tIdx % WRITING_T2.length]} Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.` },
    },
    speaking: {
      part1: [...speaking.p1],
      part2: { cueCard: speaking.card, bullets: [...speaking.bullets] },
      part3: [...speaking.p3],
    },
  };
}

export function buildBook(number, { title, year, description, published = true } = {}, bookIndex) {
  const idx = bookIndex ?? Math.max(0, number - 10);
  return {
    id: `book-${number}`,
    number,
    title: title || `Cambridge IELTS ${number}`,
    year: year || 2005 + number,
    description: description || `Four complete Academic practice tests (demo content) for Cambridge IELTS ${number}.`,
    published,
    tests: [1, 2, 3, 4].map((t) => buildTest(number, t, idx)),
  };
}

export const generateCambridgeLibrary = () =>
  CAMBRIDGE_BOOK_NUMBERS.map((n, i) => buildBook(n, { published: n <= 20 }, i));

export const getDefaultTest = (bookNumber, testNo) => buildTest(bookNumber, testNo, Math.max(0, bookNumber - 10));
