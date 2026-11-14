/*
 * ORIGINAL demonstration reading passages and questions.
 * None of this content is copied from Cambridge IELTS books. Each Cambridge book/test/passage
 * slot is mapped onto one of these original passages so the practice flow can be demonstrated.
 *
 * Group schema:
 *  { type, instructions, options?, layout?, text?, table?, questions: [{ n, text, answer: [accepted...], explanation }] }
 *  - "[[n]]" tokens inside group.text / table cells / question.text are rendered as inline answer inputs.
 */

import { getCambridgeOverride } from "./cambridgeContent";

export const QUESTION_TYPES = [
  "Multiple Choice",
  "True / False / Not Given",
  "Yes / No / Not Given",
  "Matching Headings",
  "Matching Information",
  "Matching Features",
  "Sentence Completion",
  "Summary Completion",
  "Note Completion",
  "Table Completion",
  "Flow-chart Completion",
  "Short Answer Questions",
];

const TFNG = [
  { value: "TRUE", label: "TRUE" },
  { value: "FALSE", label: "FALSE" },
  { value: "NOT GIVEN", label: "NOT GIVEN" },
];
const YNNG = [
  { value: "YES", label: "YES" },
  { value: "NO", label: "NO" },
  { value: "NOT GIVEN", label: "NOT GIVEN" },
];
const PARAS = ["A", "B", "C", "D", "E", "F"].map((v) => ({ value: v, label: `Paragraph ${v}` }));

/* ------------------------------------------------------------------ PASSAGE 1 SLOT */
const urbanBees = {
  id: "urban-bees",
  title: "The Return of the Urban Beekeeper",
  level: "Passage 1",
  paragraphs: [
    "Twenty years ago, keeping bees in a city would have struck most people as eccentric, if not dangerous. Today, rooftop hives can be found on hotels, office blocks and even fire stations in cities from London to Melbourne. Estimates suggest that the number of registered urban hives in some European capitals has tripled since 2008, a rise driven partly by public concern over the decline of wild pollinators.",
    "Cities turn out to be surprisingly good places for honeybees. Urban gardens, parks and roadside verges contain a far wider variety of flowering plants than modern farmland, where a single crop may stretch for kilometres. Because different species flower at different times, city bees often enjoy a longer foraging season. Temperatures in built-up areas are also typically two to three degrees higher than in the surrounding countryside, allowing colonies to remain active later into the autumn.",
    "Pesticide exposure is another factor. Many municipal authorities have restricted the use of chemical sprays in public spaces, and private gardeners tend to use them in smaller quantities than commercial growers. Researchers in Paris found that hives on city rooftops produced, on average, three times as much honey as hives in nearby agricultural areas.",
    "However, not everyone welcomes the trend. Some ecologists argue that honeybees, which are essentially managed livestock, compete with native wild bees for a limited supply of nectar and pollen. A study in Zurich found that where hive density exceeded ten colonies per square kilometre, the number of wild bee species recorded fell noticeably. The researchers recommended that city planners treat flowering plants, rather than hives, as the priority.",
    "Beekeeping associations have responded by offering training courses for new keepers. A typical beginner's course lasts six weeks and covers hive inspection, disease prevention and the safe handling of swarms. Many associations now require members to plant bee-friendly flowers in proportion to the number of hives they keep. Supporters say this approach benefits both kinds of bee, and turns urban beekeeping into a form of environmental education rather than simply a hobby.",
  ],
  groups: [
    {
      type: "Note Completion",
      instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER from the passage for each answer.",
      layout: "notes",
      heading: "Why cities suit honeybees",
      questions: [
        { n: 1, text: "Cities have a greater [[1]] of flowering plants than farmland.", answer: ["variety"], explanation: "Paragraph 2: 'a far wider variety of flowering plants than modern farmland'." },
        { n: 2, text: "Urban areas are usually two to three [[2]] warmer than the countryside.", answer: ["degrees"], explanation: "Paragraph 2: 'two to three degrees higher'." },
        { n: 3, text: "Colonies can stay active later into the [[3]].", answer: ["autumn", "fall"], explanation: "Paragraph 2: 'remain active later into the autumn'." },
        { n: 4, text: "The use of chemical [[4]] is restricted in many public spaces.", answer: ["sprays"], explanation: "Paragraph 3: 'restricted the use of chemical sprays in public spaces'." },
        { n: 5, text: "Rooftop hives in Paris produced [[5]] times as much honey as rural hives.", answer: ["three", "3"], explanation: "Paragraph 3: 'three times as much honey'." },
      ],
    },
    {
      type: "True / False / Not Given",
      instructions: "Do the following statements agree with the information given in the passage? Choose TRUE, FALSE or NOT GIVEN.",
      options: TFNG,
      questions: [
        { n: 6, text: "The number of urban hives in some European capitals has grown since 2008.", answer: ["TRUE"], explanation: "Paragraph 1 says the number has 'tripled since 2008'." },
        { n: 7, text: "Most city residents are worried about the presence of beehives.", answer: ["NOT GIVEN"], explanation: "The passage mentions concern about pollinators, not residents' feelings about hives." },
        { n: 8, text: "Honeybees can be considered a domesticated species.", answer: ["TRUE"], explanation: "Paragraph 4 calls honeybees 'essentially managed livestock'." },
        { n: 9, text: "The Zurich study found that wild bees disappeared completely where there were many hives.", answer: ["FALSE"], explanation: "The number of species 'fell noticeably' — not to zero." },
        { n: 10, text: "Beginner beekeeping courses are usually free of charge.", answer: ["NOT GIVEN"], explanation: "Course cost is never mentioned." },
      ],
    },
    {
      type: "Short Answer Questions",
      instructions: "Answer the questions below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER from the passage for each answer.",
      questions: [
        { n: 11, text: "How long does a typical beginner's course last?", answer: ["six weeks", "6 weeks"], explanation: "Paragraph 5: 'A typical beginner's course lasts six weeks'." },
        { n: 12, text: "What did the Zurich researchers say planners should prioritise?", answer: ["flowering plants"], explanation: "Paragraph 4: 'treat flowering plants, rather than hives, as the priority'." },
        { n: 13, text: "What do many associations require members to plant?", answer: ["bee-friendly flowers", "bee friendly flowers"], explanation: "Paragraph 5: 'plant bee-friendly flowers'." },
      ],
    },
  ],
};

const bicycle = {
  id: "bicycle-history",
  title: "Two Wheels Through History",
  level: "Passage 1",
  paragraphs: [
    "The bicycle is so familiar that it is easy to forget how recent an invention it is. The first recognisable ancestor, the 'running machine' built by the German inventor Karl Drais in 1817, had no pedals at all. Riders sat on a wooden frame and pushed themselves along with their feet. Drais hoped his machine would replace the horse, which had become expensive to feed after a series of poor harvests.",
    "Pedals arrived in the 1860s, when French makers attached them directly to the front wheel. These machines were nicknamed 'boneshakers' because their iron tyres transmitted every bump in the road to the rider. To travel further with each turn of the pedals, manufacturers enlarged the front wheel, producing the 'high-wheeler' of the 1870s. Its front wheel could measure up to 1.5 metres across, and falls were frequent and serious.",
    "The breakthrough came in 1885 with the 'safety bicycle', designed by John Kemp Starley in England. It had two wheels of similar size and a chain that drove the rear wheel. Three years later, the air-filled tyre, patented by John Boyd Dunlop, made riding far more comfortable. By the 1890s, cycling had become a craze across Europe and North America.",
    "The social effects were considerable. The bicycle gave working people a cheap means of travelling beyond their own neighbourhoods, and historians have even linked it to a rise in marriages between people from different villages. For women in particular, it offered a new degree of independence, and it encouraged a move towards more practical clothing.",
    "Sales declined in many Western countries as cars became affordable in the twentieth century. Yet the bicycle never disappeared. In recent decades, concerns about traffic congestion, air quality and public health have led many cities to build dedicated cycle lanes, and electric bicycles now account for a growing share of new sales.",
  ],
  groups: [
    {
      type: "Table Completion",
      instructions: "Complete the table below. Write ONE WORD ONLY from the passage for each answer.",
      layout: "table",
      table: {
        headers: ["Date", "Development", "Key feature"],
        rows: [
          ["1817", "Running machine", "had no [[1]]"],
          ["1860s", "Boneshaker", "[[2]] tyres made riding uncomfortable"],
          ["1870s", "High-wheeler", "very large front [[3]]"],
          ["1885", "Safety bicycle", "a [[4]] drove the rear wheel"],
          ["1888", "Air-filled tyre", "patented by John Boyd [[5]]"],
        ],
      },
      questions: [
        { n: 1, text: "Running machine had no ___", answer: ["pedals"], explanation: "Paragraph 1: 'had no pedals at all'." },
        { n: 2, text: "Boneshaker: ___ tyres", answer: ["iron"], explanation: "Paragraph 2: 'their iron tyres transmitted every bump'." },
        { n: 3, text: "High-wheeler: very large front ___", answer: ["wheel"], explanation: "Paragraph 2: manufacturers 'enlarged the front wheel'." },
        { n: 4, text: "Safety bicycle: a ___ drove the rear wheel", answer: ["chain"], explanation: "Paragraph 3: 'a chain that drove the rear wheel'." },
        { n: 5, text: "Air-filled tyre patented by John Boyd ___", answer: ["dunlop"], explanation: "Paragraph 3: 'patented by John Boyd Dunlop'." },
      ],
    },
    {
      type: "True / False / Not Given",
      instructions: "Do the following statements agree with the information given in the passage? Choose TRUE, FALSE or NOT GIVEN.",
      options: TFNG,
      questions: [
        { n: 6, text: "Drais intended his invention to be an alternative to the horse.", answer: ["TRUE"], explanation: "Paragraph 1: 'Drais hoped his machine would replace the horse'." },
        { n: 7, text: "The boneshaker was first produced in Germany.", answer: ["FALSE"], explanation: "Pedals were attached by 'French makers'." },
        { n: 8, text: "Falls from the high-wheeler rarely caused injury.", answer: ["FALSE"], explanation: "Falls were 'frequent and serious'." },
        { n: 9, text: "The safety bicycle was cheaper to manufacture than the high-wheeler.", answer: ["NOT GIVEN"], explanation: "Manufacturing costs are not compared." },
        { n: 10, text: "Cycling became extremely popular on two continents in the 1890s.", answer: ["TRUE"], explanation: "'a craze across Europe and North America'." },
      ],
    },
    {
      type: "Sentence Completion",
      instructions: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
      questions: [
        { n: 11, text: "Historians have connected the bicycle with an increase in [[11]] between people from different villages.", answer: ["marriages"], explanation: "Paragraph 4: 'a rise in marriages between people from different villages'." },
        { n: 12, text: "Cycling encouraged women to wear more [[12]].", answer: ["practical clothing"], explanation: "Paragraph 4: 'a move towards more practical clothing'." },
        { n: 13, text: "A growing proportion of new sales are [[13]].", answer: ["electric bicycles"], explanation: "Paragraph 5: 'electric bicycles now account for a growing share of new sales'." },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ PASSAGE 2 SLOT */
const HEADINGS = [
  { value: "i", label: "i. A change in scientific opinion" },
  { value: "ii", label: "ii. The cost of missing sleep before exams" },
  { value: "iii", label: "iii. How memories move within the brain" },
  { value: "iv", label: "iv. Why dreams are often forgotten" },
  { value: "v", label: "v. Different stages with different functions" },
  { value: "vi", label: "vi. A test of memory over time" },
  { value: "vii", label: "vii. Finding hidden solutions" },
  { value: "viii", label: "viii. The link between diet and sleep quality" },
  { value: "ix", label: "ix. Problems with early imaging equipment" },
];

const sleepMemory = {
  id: "sleep-memory",
  title: "Why We Sleep on It",
  level: "Passage 2",
  lettered: true,
  paragraphs: [
    "For most of the twentieth century, sleep was regarded as a passive state in which the brain simply switched off. That view has been overturned. Modern imaging techniques show that the sleeping brain is remarkably active, and that much of this activity appears to be devoted to processing what we have learned during the day.",
    "The process begins with the hippocampus, a small structure deep in the brain that acts as a temporary store for new information. During deep, slow-wave sleep, the hippocampus repeatedly 'replays' recent experiences. These replays are thought to transfer memories to the neocortex, where they can be stored for the long term and linked to existing knowledge.",
    "Evidence for this comes from experiments in which volunteers learn a list of word pairs and are then tested twelve hours later. Those who slept during the interval consistently recall more pairs than those who stayed awake, even when the total time elapsed is identical. The benefit is greatest for material that the learner was told would be tested later, suggesting that the brain prioritises information it judges to be useful.",
    "Sleep may also help us to see connections we missed while awake. In one well-known study, participants worked on a numerical puzzle that contained a hidden shortcut. After a night's sleep, almost 60 per cent discovered the shortcut, compared with around 23 per cent of those who had remained awake. Researchers interpret this as evidence that sleep allows the brain to reorganise information in new ways.",
    "Not all sleep stages play the same role. Rapid eye movement (REM) sleep, the stage most associated with vivid dreaming, appears to be particularly important for emotional memories and creative problem-solving, whereas slow-wave sleep is linked to the retention of facts. A full night of sleep cycles through these stages several times, which is one reason why short naps cannot completely replace it.",
    "The practical implications for students are clear. Staying up all night before an examination may increase the number of hours spent studying, but it is likely to reduce how much is actually remembered. Spreading study over several days, with sleep in between, appears to be a far more efficient strategy.",
  ],
  groups: [
    {
      type: "Matching Headings",
      instructions: "The passage has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings.",
      options: HEADINGS,
      showOptionList: true,
      questions: [
        { n: 1, text: "Paragraph A", answer: ["i"], explanation: "A explains that the old 'passive' view 'has been overturned'." },
        { n: 2, text: "Paragraph B", answer: ["iii"], explanation: "B describes transfer from the hippocampus to the neocortex." },
        { n: 3, text: "Paragraph C", answer: ["vi"], explanation: "C describes volunteers tested twelve hours later." },
        { n: 4, text: "Paragraph D", answer: ["vii"], explanation: "D describes discovering a hidden shortcut in a puzzle." },
        { n: 5, text: "Paragraph E", answer: ["v"], explanation: "E contrasts REM and slow-wave sleep functions." },
        { n: 6, text: "Paragraph F", answer: ["ii"], explanation: "F warns against staying up all night before an exam." },
      ],
    },
    {
      type: "Matching Information",
      instructions: "Which paragraph contains the following information? Choose the correct letter, A–F.",
      options: PARAS,
      questions: [
        { n: 7, text: "a comparison of percentages between two groups", answer: ["D"], explanation: "D: '60 per cent… compared with around 23 per cent'." },
        { n: 8, text: "a reason why a brief rest is less effective than a full night's sleep", answer: ["E"], explanation: "E: 'short naps cannot completely replace it'." },
        { n: 9, text: "a reference to the brain giving priority to certain information", answer: ["C"], explanation: "C: 'the brain prioritises information it judges to be useful'." },
      ],
    },
    {
      type: "Summary Completion",
      instructions: "Complete the summary below. Write ONE WORD ONLY from the passage for each answer.",
      layout: "summary",
      text: "During deep sleep, the [[10]] replays recent experiences so that memories can be moved to the neocortex for long-term storage. In experiments, volunteers who slept remembered more word [[11]] than those who stayed awake. REM sleep is especially linked to [[12]] memories, while slow-wave sleep helps people to retain [[13]].",
      questions: [
        { n: 10, text: "During deep sleep, the ___ replays recent experiences", answer: ["hippocampus"], explanation: "Paragraph B." },
        { n: 11, text: "remembered more word ___", answer: ["pairs"], explanation: "Paragraph C: 'recall more pairs'." },
        { n: 12, text: "REM sleep is linked to ___ memories", answer: ["emotional"], explanation: "Paragraph E: 'important for emotional memories'." },
        { n: 13, text: "slow-wave sleep helps people retain ___", answer: ["facts"], explanation: "Paragraph E: 'linked to the retention of facts'." },
      ],
    },
  ],
};

const verticalFarming = {
  id: "vertical-farming",
  title: "Farming Upwards",
  level: "Passage 2",
  lettered: true,
  paragraphs: [
    "By 2050, the world's population is expected to approach ten billion, and around two-thirds of those people will live in cities. Feeding them will require more food from less land, at a time when climate change is making harvests less predictable. One proposed solution is the vertical farm: a building in which crops are grown indoors on stacked shelves under artificial light.",
    "The advantages are easy to list. Because the environment is fully controlled, vertical farms are unaffected by drought, frost or storms, and crops can be harvested all year round. Pests are largely excluded, so chemical pesticides are rarely needed. Some operators claim to use up to 95 per cent less water than conventional field agriculture, since moisture is captured and recycled.",
    "The growing process itself is highly systematic. Seeds are first germinated in trays of a soil substitute, such as coconut fibre. Once the seedlings have developed roots, they are transferred to shelves where their roots hang in channels of nutrient-rich water. LED lights, tuned to the wavelengths that plants use most efficiently, are switched on for up to eighteen hours a day. Sensors monitor temperature and humidity continuously, and when the crop is mature it is harvested and packaged on site, often within hours of being sold.",
    "The main drawback is energy. Replacing sunlight with electric lighting is expensive, and in regions where electricity comes mainly from fossil fuels, the carbon footprint of a vertically farmed lettuce can exceed that of one grown in a field and transported hundreds of kilometres. Several high-profile vertical farming companies have closed in recent years after failing to control these costs.",
    "For this reason, the range of crops grown indoors remains narrow. Leafy greens and herbs dominate because they grow quickly, are light, and command high prices. Staple crops such as wheat and rice, which need large amounts of light and space relative to their value, are not economically viable under current conditions.",
    "Supporters remain optimistic. LED efficiency has improved significantly over the past decade, and the falling cost of renewable energy could transform the economics of the industry. Vertical farms are unlikely to replace traditional agriculture, but they may become a valuable supplement, especially in cities with limited farmland.",
  ],
  groups: [
    {
      type: "Matching Information",
      instructions: "Which paragraph contains the following information? Choose the correct letter, A–F.",
      options: PARAS,
      questions: [
        { n: 1, text: "an example of a material used instead of soil", answer: ["C"], explanation: "C: 'a soil substitute, such as coconut fibre'." },
        { n: 2, text: "a reason why some businesses have failed", answer: ["D"], explanation: "D: companies 'closed… after failing to control these costs'." },
        { n: 3, text: "a forecast about where most people will live", answer: ["A"], explanation: "A: 'two-thirds of those people will live in cities'." },
        { n: 4, text: "an explanation of why certain crops are favoured", answer: ["E"], explanation: "E: leafy greens 'grow quickly, are light, and command high prices'." },
      ],
    },
    {
      type: "Flow-chart Completion",
      instructions: "Complete the flow-chart below. Write ONE WORD ONLY from the passage for each answer.",
      layout: "flowchart",
      heading: "The vertical farming process",
      questions: [
        { n: 5, text: "Seeds are germinated in trays of coconut [[5]]", answer: ["fibre", "fiber"], explanation: "Paragraph C: 'coconut fibre'." },
        { n: 6, text: "Seedlings move to shelves; roots hang in channels of [[6]]-rich water", answer: ["nutrient"], explanation: "Paragraph C: 'nutrient-rich water'." },
        { n: 7, text: "[[7]] lights are switched on for up to 18 hours a day", answer: ["led"], explanation: "Paragraph C: 'LED lights… up to eighteen hours a day'." },
        { n: 8, text: "Sensors check temperature and [[8]]", answer: ["humidity"], explanation: "Paragraph C: 'Sensors monitor temperature and humidity'." },
        { n: 9, text: "The mature crop is harvested and [[9]] on site", answer: ["packaged"], explanation: "Paragraph C: 'harvested and packaged on site'." },
      ],
    },
    {
      type: "Multiple Choice",
      instructions: "Choose the correct letter, A, B, C or D.",
      questions: [
        {
          n: 10,
          text: "According to paragraph B, vertical farms rarely need pesticides because",
          options: [
            { value: "A", label: "the crops are genetically modified." },
            { value: "B", label: "pests are mostly kept out." },
            { value: "C", label: "the crops grow too quickly to be damaged." },
            { value: "D", label: "the water is recycled." },
          ],
          answer: ["B"],
          explanation: "B: 'Pests are largely excluded, so chemical pesticides are rarely needed'.",
        },
        {
          n: 11,
          text: "The writer mentions a lettuce transported hundreds of kilometres to show that",
          options: [
            { value: "A", label: "transport is the main source of emissions in agriculture." },
            { value: "B", label: "vertical farming is not always better for the environment." },
            { value: "C", label: "fresh lettuce is difficult to transport." },
            { value: "D", label: "field farming is more expensive than vertical farming." },
          ],
          answer: ["B"],
          explanation: "D: the indoor lettuce's carbon footprint 'can exceed' the transported one.",
        },
        {
          n: 12,
          text: "Wheat and rice are not grown in vertical farms mainly because",
          options: [
            { value: "A", label: "they need a lot of light and space compared with their value." },
            { value: "B", label: "consumers prefer grain grown in fields." },
            { value: "C", label: "they cannot grow under LED lighting." },
            { value: "D", label: "they require natural soil." },
          ],
          answer: ["A"],
          explanation: "E: they 'need large amounts of light and space relative to their value'.",
        },
        {
          n: 13,
          text: "What is the writer's overall conclusion?",
          options: [
            { value: "A", label: "Vertical farms will eventually replace traditional farms." },
            { value: "B", label: "Vertical farming has no realistic future." },
            { value: "C", label: "Vertical farms could support conventional agriculture." },
            { value: "D", label: "Vertical farms should receive government funding." },
          ],
          answer: ["C"],
          explanation: "F: 'they may become a valuable supplement'.",
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ PASSAGE 3 SLOT */
const languages = {
  id: "endangered-languages",
  title: "Voices at Risk",
  level: "Passage 3",
  lettered: true,
  paragraphs: [
    "Of the roughly 7,000 languages spoken today, linguists estimate that around 40 per cent are endangered, many with fewer than a thousand speakers. When the last fluent speaker of a language dies, something more than a set of words is lost. In my view, each language represents a unique way of organising experience, and its disappearance diminishes our collective understanding of what the human mind is capable of.",
    "The causes of language loss are well documented. Economic pressure draws young people towards cities, where a dominant national or global language offers better employment. Schools have historically discouraged or even punished the use of minority languages. Parents, wishing to give their children every advantage, may stop speaking the heritage language at home, and within a generation the chain of transmission is broken.",
    "Some commentators argue that this process is natural and even beneficial, since a smaller number of shared languages makes communication and trade easier. The linguist Peter Halvorsen, for example, has suggested that efforts to preserve small languages are often driven more by nostalgia than by the wishes of speakers themselves. I find this position unpersuasive. Speakers rarely abandon a language freely; they do so under pressures that are frequently unjust.",
    "Revitalisation is possible, though difficult. The revival of Hebrew as an everyday spoken language in the late nineteenth and twentieth centuries is the most dramatic example. More recently, Welsh has benefited from bilingual education and broadcasting, and the number of young speakers has risen. The researcher Amina Okafor stresses that success depends less on government funding than on whether families see the language as useful in daily life.",
    "Technology offers new tools. Dictionaries and recordings can now be distributed on smartphones, and online communities allow scattered speakers to interact. Dr Lena Morales, who has worked with indigenous communities in Central America, warns, however, that digital archives may give a false sense of security: a language preserved only in recordings is documented, not alive.",
    "Ultimately, the future of endangered languages rests with their speakers. Outsiders can provide resources and expertise, but decisions about whether and how to maintain a language must be made by the communities concerned. What the rest of us can do is ensure that those choices are made freely, rather than forced by economic or political disadvantage.",
  ],
  groups: [
    {
      type: "Yes / No / Not Given",
      instructions: "Do the following statements agree with the views of the writer? Choose YES, NO or NOT GIVEN.",
      options: YNNG,
      questions: [
        { n: 1, text: "The loss of a language reduces our understanding of human mental abilities.", answer: ["YES"], explanation: "A: its disappearance 'diminishes our collective understanding of what the human mind is capable of'." },
        { n: 2, text: "Most endangered languages are found in Asia.", answer: ["NOT GIVEN"], explanation: "No geographical distribution is given." },
        { n: 3, text: "Speakers usually give up their language entirely by choice.", answer: ["NO"], explanation: "C: 'Speakers rarely abandon a language freely'." },
        { n: 4, text: "Hebrew is the most remarkable example of a language revival.", answer: ["YES"], explanation: "D: 'the most dramatic example'." },
        { n: 5, text: "Governments should spend more on minority-language schools.", answer: ["NOT GIVEN"], explanation: "The writer gives no view on government spending." },
      ],
    },
    {
      type: "Matching Features",
      instructions: "Match each statement with the correct person, A, B or C. You may use any letter more than once.",
      options: [
        { value: "A", label: "A. Peter Halvorsen" },
        { value: "B", label: "B. Amina Okafor" },
        { value: "C", label: "C. Lena Morales" },
      ],
      showOptionList: true,
      questions: [
        { n: 6, text: "Recorded material alone does not keep a language in use.", answer: ["C"], explanation: "Morales: 'documented, not alive'." },
        { n: 7, text: "Preservation efforts may reflect sentimental feelings rather than speakers' preferences.", answer: ["A"], explanation: "Halvorsen: 'driven more by nostalgia than by the wishes of speakers'." },
        { n: 8, text: "Practical usefulness at home matters more than financial support.", answer: ["B"], explanation: "Okafor: 'less on government funding than on whether families see the language as useful'." },
        { n: 9, text: "Digital tools may make people believe a language is safer than it really is.", answer: ["C"], explanation: "Morales: 'a false sense of security'." },
      ],
    },
    {
      type: "Multiple Choice",
      instructions: "Choose the correct letter, A, B, C or D.",
      questions: [
        {
          n: 10,
          text: "According to paragraph B, the chain of transmission is broken when",
          options: [
            { value: "A", label: "schools teach only the national language." },
            { value: "B", label: "parents stop using the language with their children." },
            { value: "C", label: "young people move to other countries." },
            { value: "D", label: "speakers lose interest in their culture." },
          ],
          answer: ["B"],
          explanation: "B: parents 'stop speaking the heritage language at home'.",
        },
        {
          n: 11,
          text: "Why does the writer mention Welsh?",
          options: [
            { value: "A", label: "as an example of a failed revival" },
            { value: "B", label: "to show the value of bilingual education and broadcasting" },
            { value: "C", label: "to show that Hebrew's revival was easier" },
            { value: "D", label: "to criticise government language policy" },
          ],
          answer: ["B"],
          explanation: "D: Welsh 'has benefited from bilingual education and broadcasting'.",
        },
        {
          n: 12,
          text: "What is the main point of the final paragraph?",
          options: [
            { value: "A", label: "Outside experts should lead preservation projects." },
            { value: "B", label: "Communities must be free to decide about their own languages." },
            { value: "C", label: "Economic development matters more than language." },
            { value: "D", label: "Endangered languages cannot realistically be saved." },
          ],
          answer: ["B"],
          explanation: "F: decisions 'must be made by the communities concerned… made freely'.",
        },
      ],
    },
    {
      type: "Summary Completion",
      instructions: "Complete the summary using the list of words, A–F, below.",
      layout: "summary",
      options: [
        { value: "A", label: "A. cities" },
        { value: "B", label: "B. documented" },
        { value: "C", label: "C. forgotten" },
        { value: "D", label: "D. villages" },
        { value: "E", label: "E. translated" },
        { value: "F", label: "F. protected" },
      ],
      showOptionList: true,
      text: "Economic pressure leads young people to move to [[13]], where dominant languages offer better jobs. Digital archives are useful, but a language kept only in recordings is merely [[14]] rather than alive.",
      questions: [
        { n: 13, text: "young people move to ___", answer: ["A"], explanation: "B: 'draws young people towards cities'." },
        { n: 14, text: "a language kept only in recordings is merely ___", answer: ["B"], explanation: "E: 'documented, not alive'." },
      ],
    },
  ],
};

const choice = {
  id: "paradox-of-choice",
  title: "The Paradox of Choice Revisited",
  level: "Passage 3",
  lettered: true,
  paragraphs: [
    "It is widely assumed that more choice makes people happier. Modern supermarkets may stock over 30,000 products, and streaming platforms offer thousands of films. Yet a growing body of research suggests that, beyond a certain point, additional options can leave people less satisfied with what they choose. I believe this finding deserves more attention from businesses and policymakers alike.",
    "The best-known evidence comes from a study by psychologists Sheena Iyengar and Mark Lepper, in which shoppers were offered samples of either six or twenty-four varieties of jam. The larger display attracted more visitors, but shoppers who saw only six varieties were around ten times more likely to make a purchase. The researchers concluded that an excess of options can lead to 'choice overload', in which people delay or avoid deciding altogether.",
    "Later work has complicated this picture. A review by Benjamin Scheibehenne combining dozens of similar experiments found that the average effect of choice overload was close to zero. Overload seemed to occur only under particular conditions: when options were difficult to compare, when people lacked clear preferences, or when they felt under time pressure. I find this more nuanced account convincing, although it is sometimes misreported as proof that the original effect does not exist.",
    "The psychologist Barry Schwartz has drawn a distinction between 'maximisers', who seek the best possible option, and 'satisficers', who are content with an option that is good enough. According to Schwartz, maximisers often achieve objectively better outcomes, such as higher-paying jobs, but report lower satisfaction, partly because they continue to think about the alternatives they rejected.",
    "These findings have practical applications. Some financial advisers have found that employees are more likely to join a pension scheme when offered a small number of clearly differentiated funds. Retailers, too, have experimented with reducing the number of product lines, sometimes with positive effects on sales. The economist Richard Thaler has argued that well-designed default options can help people make better decisions without restricting their freedom.",
    "None of this means that choice is undesirable. The ability to choose is closely tied to a sense of autonomy, which is itself important for wellbeing. The challenge is to present choices in ways that help rather than overwhelm. In my opinion, this is a design problem as much as a psychological one.",
  ],
  groups: [
    {
      type: "Yes / No / Not Given",
      instructions: "Do the following statements agree with the claims of the writer? Choose YES, NO or NOT GIVEN.",
      options: YNNG,
      questions: [
        { n: 1, text: "Businesses should pay more attention to how choice affects satisfaction.", answer: ["YES"], explanation: "A: 'this finding deserves more attention from businesses and policymakers'." },
        { n: 2, text: "The jam study was carried out in more than one country.", answer: ["NOT GIVEN"], explanation: "The study's location is not mentioned." },
        { n: 3, text: "Scheibehenne's review proves that choice overload never happens.", answer: ["NO"], explanation: "C: the writer says this is a misreporting of the review." },
        { n: 4, text: "Some reports of Scheibehenne's findings have been inaccurate.", answer: ["YES"], explanation: "C: 'it is sometimes misreported'." },
        { n: 5, text: "Supermarkets should be legally required to sell fewer products.", answer: ["NOT GIVEN"], explanation: "No legal requirement is discussed." },
      ],
    },
    {
      type: "Matching Features",
      instructions: "Match each finding with the correct researcher(s), A–D. You may use any letter more than once.",
      options: [
        { value: "A", label: "A. Iyengar and Lepper" },
        { value: "B", label: "B. Scheibehenne" },
        { value: "C", label: "C. Schwartz" },
        { value: "D", label: "D. Thaler" },
      ],
      showOptionList: true,
      questions: [
        { n: 6, text: "People who look for the best option may feel less content.", answer: ["C"], explanation: "D: maximisers 'report lower satisfaction'." },
        { n: 7, text: "Too many options can cause people to put off a decision.", answer: ["A"], explanation: "B: people 'delay or avoid deciding altogether'." },
        { n: 8, text: "Pre-selected options can improve decisions while preserving freedom.", answer: ["D"], explanation: "E: 'default options can help people… without restricting their freedom'." },
        { n: 9, text: "Overload depends on specific circumstances.", answer: ["B"], explanation: "C: overload 'seemed to occur only under particular conditions'." },
        { n: 10, text: "A wider range attracted interest but reduced purchases.", answer: ["A"], explanation: "B: the larger display attracted more visitors but fewer purchases." },
      ],
    },
    {
      type: "Sentence Completion",
      instructions: "Complete the sentences below. Write NO MORE THAN THREE WORDS from the passage for each answer.",
      questions: [
        { n: 11, text: "Choice overload is more likely when people lack clear [[11]].", answer: ["preferences"], explanation: "C: 'when people lacked clear preferences'." },
        { n: 12, text: "Maximisers often obtain better outcomes, such as [[12]].", answer: ["higher-paying jobs", "higher paying jobs"], explanation: "D: 'such as higher-paying jobs'." },
        { n: 13, text: "Employees are more likely to join a [[13]] when offered fewer funds.", answer: ["pension scheme"], explanation: "E: 'more likely to join a pension scheme'." },
        { n: 14, text: "The ability to choose is linked to a sense of [[14]].", answer: ["autonomy"], explanation: "F: 'closely tied to a sense of autonomy'." },
      ],
    },
  ],
};

export const READING_BANK = { 1: [urbanBees, bicycle], 2: [sleepMemory, verticalFarming], 3: [languages, choice] };
export const ALL_READING_PASSAGES = [urbanBees, bicycle, sleepMemory, verticalFarming, languages, choice];

/** Deterministically map a Cambridge book/test/passage slot onto an original demo passage. */
export function getReadingPassage(book, test, part) {
  const uploaded = getCambridgeOverride("reading", book, test, part);
  if (uploaded) return uploaded;
  const list = READING_BANK[part];
  if (!list) return null;
  return list[(Number(book) + Number(test)) % list.length];
}

export const READING_TIME = { single: 20 * 60, full: 60 * 60 };
