/*
 * ORIGINAL demonstration listening sections (not Cambridge material).
 * There are no recorded MP3 files in this demo. The "audio" is SAMPLE AUDIO generated live by the
 * browser's built-in text-to-speech engine from the transcript below — this is clearly labelled in the UI.
 */

import { getCambridgeOverride } from "./cambridgeContent";

const ABC = (labels) => labels.map((label, i) => ({ value: "ABCDEFG"[i], label: `${"ABCDEFG"[i]}. ${label}` }));

const gym = {
  id: "gym-membership",
  title: "Gym Membership Enquiry",
  context: "A man is phoning a sports centre to join the gym.",
  speakers: { R: "Receptionist", C: "Caller" },
  lines: [
    ["R", "Good morning, Riverside Sports Centre. How can I help?"],
    ["C", "Hi, I'd like to join the gym, please. Could you take my details?"],
    ["R", "Of course. What's your name?"],
    ["C", "It's Daniel Harper. That's H, A, R, P, E, R."],
    ["R", "Thank you, Daniel. And your address?"],
    ["C", "Forty-two Mill Lane, in Westbridge. W, E, S, T, B, R, I, D, G, E."],
    ["R", "Which membership were you thinking of? We have standard, off-peak and family."],
    ["C", "I work during the day, so I'll come in the evenings. Is off-peak only during the day?"],
    ["R", "That's right, off-peak is weekdays before four p.m. So for evenings you'd need standard, which is thirty-five pounds a month."],
    ["C", "Thirty-five, okay. Is there a joining fee?"],
    ["R", "Normally there's a twenty-pound fee, but we're not charging it this month."],
    ["C", "Oh, good."],
    ["R", "How did you hear about us?"],
    ["C", "A colleague recommended you."],
    ["R", "Lovely. And do you have any injuries we should know about?"],
    ["C", "I hurt my knee playing football last year, but it's fine now."],
    ["R", "I'll note that down. Your first session is an induction with a trainer. Would Saturday at ten work?"],
    ["C", "Saturday's difficult. Could I do Thursday evening instead?"],
    ["R", "Thursday at seven it is. See you then."],
  ],
  groups: [
    {
      type: "Form Completion",
      instructions: "Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.",
      layout: "form",
      heading: "Riverside Sports Centre — New Member",
      questions: [
        { n: 1, text: "Name: Daniel [[1]]", answer: ["harper"], explanation: "He spells it: H-A-R-P-E-R." },
        { n: 2, text: "Address: 42 Mill Lane, [[2]]", answer: ["westbridge"], explanation: "'Forty-two Mill Lane, in Westbridge'." },
        { n: 3, text: "Membership type: [[3]]", answer: ["standard"], explanation: "For evenings 'you'd need standard'." },
        { n: 4, text: "Monthly cost: £[[4]]", answer: ["35", "thirty-five", "thirty five"], explanation: "'thirty-five pounds a month'." },
        { n: 5, text: "Heard about the centre from a [[5]]", answer: ["colleague"], explanation: "'A colleague recommended you'." },
        { n: 6, text: "Medical note: previous [[6]] injury", answer: ["knee"], explanation: "'I hurt my knee playing football'." },
      ],
    },
    {
      type: "Multiple Choice",
      instructions: "Choose the correct letter, A, B or C.",
      questions: [
        { n: 7, text: "How much is the joining fee this month?", options: ABC(["£20", "£35", "nothing"]), answer: ["C"], explanation: "'we're not charging it this month'." },
        { n: 8, text: "When will the induction take place?", options: ABC(["Saturday at 10 a.m.", "Thursday at 7 p.m.", "Thursday at 10 a.m."]), answer: ["B"], explanation: "'Thursday at seven it is'." },
      ],
    },
  ],
};

const cottage = {
  id: "holiday-cottage",
  title: "Booking a Holiday Cottage",
  context: "A woman is calling a holiday company to book a cottage.",
  speakers: { A: "Agent", C: "Customer" },
  lines: [
    ["A", "Hello, Lakeside Holiday Cottages, Mark speaking."],
    ["C", "Hello, I'd like to book a cottage for a week in August."],
    ["A", "Certainly. Can I take your surname?"],
    ["C", "Yes, it's Okonjo. O, K, O, N, J, O."],
    ["A", "Thank you. How many people will be staying?"],
    ["C", "Two adults and three children, so five altogether."],
    ["A", "And which dates?"],
    ["C", "From the fourteenth to the twenty-first of August."],
    ["A", "Let me check. Our Willow Cottage is available. It sleeps six and has a garden facing the lake."],
    ["C", "That sounds lovely. How much is it?"],
    ["A", "For that week it's six hundred and forty pounds, and that includes cleaning. Towels are extra, at five pounds per person."],
    ["C", "We'll bring our own towels. Can we bring our dog?"],
    ["A", "Dogs are allowed in Willow Cottage, but there's a charge of twenty pounds."],
    ["C", "That's fine. How do I pay the deposit?"],
    ["A", "We only accept bank transfer for deposits. It's a quarter of the total."],
  ],
  groups: [
    {
      type: "Form Completion",
      instructions: "Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.",
      layout: "form",
      heading: "Lakeside Holiday Cottages — Booking",
      questions: [
        { n: 1, text: "Surname: [[1]]", answer: ["okonjo"], explanation: "Spelled O-K-O-N-J-O." },
        { n: 2, text: "Number of guests: [[2]]", answer: ["5", "five"], explanation: "'five altogether'." },
        { n: 3, text: "Arrival date: [[3]] August", answer: ["14", "14th", "fourteenth"], explanation: "'From the fourteenth…'." },
        { n: 4, text: "Cottage name: [[4]] Cottage", answer: ["willow"], explanation: "'Our Willow Cottage is available'." },
        { n: 5, text: "Price for the week: £[[5]]", answer: ["640"], explanation: "'six hundred and forty pounds'." },
        { n: 6, text: "Charge for a dog: £[[6]]", answer: ["20", "twenty"], explanation: "'a charge of twenty pounds'." },
      ],
    },
    {
      type: "Multiple Choice",
      instructions: "Choose the correct letter, A, B or C.",
      questions: [
        { n: 7, text: "What does the customer decide about towels?", options: ABC(["She will pay for them.", "She will bring her own.", "She will use the cottage's free towels."]), answer: ["B"], explanation: "'We'll bring our own towels'." },
        { n: 8, text: "How must the deposit be paid?", options: ABC(["by credit card", "in cash on arrival", "by bank transfer"]), answer: ["C"], explanation: "'We only accept bank transfer for deposits'." },
      ],
    },
  ],
};

const museum = {
  id: "harbour-museum",
  title: "Harbour Museum Orientation",
  context: "A guide is welcoming visitors to a museum.",
  speakers: { G: "Guide" },
  lines: [
    ["G", "Welcome to the Harbour Museum. Before you start exploring, let me explain the layout using the plan in front of you."],
    ["G", "As you come in through the main entrance, the central hall is straight ahead of you. The cloakroom is immediately on your left as you enter, so please leave large bags there."],
    ["G", "To the right of the entrance you'll find the gift shop, which is open until half an hour after the galleries close."],
    ["G", "If you walk into the central hall and turn left, you'll find the café, which serves hot food until three."],
    ["G", "The lift is in the far right corner of the building, at the back."],
    ["G", "Directly behind the central hall, also at the back, is the children's gallery, with hands-on exhibits."],
    ["G", "A few practical points. We're open every day except Tuesday. You may take photographs, but please don't use flash, as it damages older exhibits."],
    ["G", "Free guided tours start at eleven a.m. and two p.m. from the central hall. Enjoy your visit."],
  ],
  groups: [
    {
      type: "Map Labelling",
      instructions: "Label the plan below. Choose the correct letter, A–G.",
      layout: "map",
      map: [
        ["A", "B", "C"],
        ["D", "Central Hall", "E"],
        ["F", "Main Entrance", "G"],
      ],
      options: "ABCDEFG".split("").map((v) => ({ value: v, label: v })),
      questions: [
        { n: 1, text: "Cloakroom", answer: ["F"], explanation: "'immediately on your left as you enter'." },
        { n: 2, text: "Gift shop", answer: ["G"], explanation: "'To the right of the entrance'." },
        { n: 3, text: "Café", answer: ["D"], explanation: "'walk into the central hall and turn left'." },
        { n: 4, text: "Lift", answer: ["C"], explanation: "'far right corner… at the back'." },
        { n: 5, text: "Children's gallery", answer: ["B"], explanation: "'Directly behind the central hall'." },
      ],
    },
    {
      type: "Multiple Choice",
      instructions: "Choose the correct letter, A, B or C.",
      questions: [
        { n: 6, text: "On which day is the museum closed?", options: ABC(["Monday", "Tuesday", "Sunday"]), answer: ["B"], explanation: "'open every day except Tuesday'." },
        { n: 7, text: "What is the rule about photography?", options: ABC(["It is not allowed.", "It is allowed without flash.", "It is allowed only in the central hall."]), answer: ["B"], explanation: "'You may take photographs, but please don't use flash'." },
        { n: 8, text: "When do guided tours begin?", options: ABC(["11 a.m. and 2 p.m.", "10 a.m. and 3 p.m.", "every hour"]), answer: ["A"], explanation: "'start at eleven a.m. and two p.m.'." },
      ],
    },
  ],
};

const garden = {
  id: "community-garden",
  title: "Community Garden Volunteer Briefing",
  context: "A volunteer leader is briefing new volunteers.",
  speakers: { L: "Leader" },
  lines: [
    ["L", "Good morning everyone, and thanks for volunteering. My name's Priya, that's P, R, I, Y, A, and I coordinate the garden."],
    ["L", "Let me run through the jobs for each area this month. Watering used to take hours, but that's now done automatically by the irrigation system, so you won't need to worry about it."],
    ["L", "In the vegetable beds, the main job is weeding, as the weeds are growing faster than the crops."],
    ["L", "Over in the orchard, the apple trees need pruning before the spring growth starts."],
    ["L", "Around the pond, we need people for litter collection, because visitors unfortunately leave quite a lot of rubbish there."],
    ["L", "And in the greenhouse, we'll be planting seeds for the summer crop."],
    ["L", "Please wear strong boots, as the paths can be muddy. All the tools are kept in the shed next to the gate."],
    ["L", "We'll stop for a tea break at eleven, and finish at one."],
  ],
  groups: [
    {
      type: "Matching",
      instructions: "What is the main task in each area? Choose the correct letter, A–E.",
      options: ABC(["watering", "weeding", "pruning", "litter collection", "planting seeds"]),
      showOptionList: true,
      questions: [
        { n: 1, text: "Vegetable beds", answer: ["B"], explanation: "'the main job is weeding'." },
        { n: 2, text: "Orchard", answer: ["C"], explanation: "'the apple trees need pruning'." },
        { n: 3, text: "Pond", answer: ["D"], explanation: "'we need people for litter collection'." },
        { n: 4, text: "Greenhouse", answer: ["E"], explanation: "'planting seeds for the summer crop'." },
      ],
    },
    {
      type: "Note Completion",
      instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
      layout: "notes",
      heading: "Volunteer information",
      questions: [
        { n: 5, text: "Wear strong [[5]]", answer: ["boots"], explanation: "'Please wear strong boots'." },
        { n: 6, text: "Tools are kept in the [[6]] next to the gate", answer: ["shed"], explanation: "'kept in the shed next to the gate'." },
        { n: 7, text: "Tea break at [[7]]", answer: ["11", "eleven", "11am", "11 am", "11:00"], explanation: "'a tea break at eleven'." },
        { n: 8, text: "Coordinator's name: [[8]]", answer: ["priya"], explanation: "Spelled P-R-I-Y-A." },
      ],
    },
  ],
};

const project = {
  id: "packaging-project",
  title: "Discussing a Research Project",
  context: "Two students, Emma and Tom, discuss their project with their tutor.",
  speakers: { T: "Tutor", E: "Emma", M: "Tom" },
  lines: [
    ["T", "So, Emma and Tom, how's your project on supermarket packaging going?"],
    ["E", "Quite well. We've decided to focus on fruit and vegetables, because that's where shoppers have the most choice between packaged and loose items."],
    ["M", "Originally we wanted to look at drinks as well, but there were too many brands."],
    ["T", "Sensible. And your method?"],
    ["M", "We're doing observations in three supermarkets. We considered an online questionnaire, but people tend to say they're more environmentally friendly than they really are."],
    ["T", "That's a well-known problem. Any difficulties?"],
    ["E", "One store manager refused permission, so we had to find a replacement. It delayed us by about a week."],
    ["T", "And your findings so far?"],
    ["E", "The surprising thing is that price isn't the main factor. Loose carrots are cheaper, but people still buy the bagged ones. I think it's mainly convenience."],
    ["M", "I'm not sure I agree. I think some shoppers just don't notice the loose option, because it's displayed lower down."],
    ["T", "Interesting, that could be worth testing. For the presentation, I'd suggest you include photographs of the displays."],
    ["E", "Good idea. Should we include our raw data?"],
    ["T", "Put it in an appendix rather than on the slides. And keep the presentation to fifteen minutes."],
  ],
  groups: [
    {
      type: "Multiple Choice",
      instructions: "Choose the correct letter, A, B or C.",
      questions: [
        { n: 1, text: "Why did the students choose fruit and vegetables?", options: ABC(["They are the cheapest products.", "Shoppers have the most choice of packaging.", "Their tutor suggested it."]), answer: ["B"], explanation: "'that's where shoppers have the most choice between packaged and loose items'." },
        { n: 2, text: "Why did they reject an online questionnaire?", options: ABC(["It would be too expensive.", "Answers might not be accurate.", "There would be too few responses."]), answer: ["B"], explanation: "People 'say they're more environmentally friendly than they really are'." },
        { n: 3, text: "What problem did they have?", options: ABC(["A manager refused permission.", "Some data was lost.", "A student was ill."]), answer: ["A"], explanation: "'One store manager refused permission'." },
        { n: 4, text: "Emma thinks shoppers buy bagged carrots mainly because of", options: ABC(["price.", "convenience.", "quality."]), answer: ["B"], explanation: "'I think it's mainly convenience'." },
        { n: 5, text: "Tom believes some shoppers", options: ABC(["don't see the loose option.", "prefer bags for hygiene.", "don't know the prices."]), answer: ["A"], explanation: "'some shoppers just don't notice the loose option'." },
      ],
    },
    {
      type: "Sentence Completion",
      instructions: "Complete the sentences below. Write ONE WORD AND/OR A NUMBER for each answer.",
      questions: [
        { n: 6, text: "The tutor suggests including [[6]] of the displays.", answer: ["photographs", "photos"], explanation: "'include photographs of the displays'." },
        { n: 7, text: "Raw data should be put in an [[7]].", answer: ["appendix"], explanation: "'Put it in an appendix'." },
        { n: 8, text: "The presentation should last [[8]] minutes.", answer: ["15", "fifteen"], explanation: "'keep the presentation to fifteen minutes'." },
      ],
    },
  ],
};

const seminar = {
  id: "transport-seminar",
  title: "Planning a Transport Seminar",
  context: "Two students, Lucy and Raj, plan a seminar on urban transport.",
  speakers: { L: "Lucy", R: "Raj" },
  lines: [
    ["L", "Raj, we need to divide up the work for the transport seminar."],
    ["R", "Right. I'm happy to do the introduction, since I wrote the outline."],
    ["L", "Great. I'll take the case study on Copenhagen. I visited last summer."],
    ["R", "Then I'll handle the statistics section. I've already collected data from the city council."],
    ["L", "What about the handout?"],
    ["R", "Let's both work on that. It needs input from every section."],
    ["L", "Fine. And I'll lead the questions session at the end."],
    ["R", "Okay. How long should the whole seminar be?"],
    ["L", "The guidelines say forty minutes, including questions. We're in room three B, in the library building."],
    ["R", "And when do the slides need to go to the tutor?"],
    ["L", "By Friday at the latest."],
  ],
  groups: [
    {
      type: "Matching",
      instructions: "Who will be responsible for each part of the seminar? Choose A, B or C.",
      options: ABC(["Lucy", "Raj", "both Lucy and Raj"]),
      showOptionList: true,
      questions: [
        { n: 1, text: "Introduction", answer: ["B"], explanation: "Raj: 'I'm happy to do the introduction'." },
        { n: 2, text: "Copenhagen case study", answer: ["A"], explanation: "Lucy: 'I'll take the case study on Copenhagen'." },
        { n: 3, text: "Statistics", answer: ["B"], explanation: "Raj: 'I'll handle the statistics section'." },
        { n: 4, text: "Handout", answer: ["C"], explanation: "'Let's both work on that'." },
        { n: 5, text: "Questions session", answer: ["A"], explanation: "Lucy: 'I'll lead the questions session'." },
      ],
    },
    {
      type: "Short Answer Questions",
      instructions: "Answer the questions. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
      questions: [
        { n: 6, text: "How long will the seminar last?", answer: ["40 minutes", "forty minutes", "40", "forty"], explanation: "'forty minutes, including questions'." },
        { n: 7, text: "Which room is the seminar in?", answer: ["3b", "three b", "room 3b"], explanation: "'room three B'." },
        { n: 8, text: "By which day must the slides be sent?", answer: ["friday"], explanation: "'By Friday at the latest'." },
      ],
    },
  ],
};

const timekeeping = {
  id: "timekeeping-lecture",
  title: "Lecture: The History of Timekeeping",
  context: "A lecturer talks about how people measured time before modern clocks.",
  speakers: { P: "Lecturer" },
  lines: [
    ["P", "Today I want to look at how people measured time before mechanical clocks. The earliest devices were sundials, used in Egypt as early as fifteen hundred B.C."],
    ["P", "Their obvious limitation was that they were useless at night or on cloudy days."],
    ["P", "To solve this, people developed water clocks, which measured time by the steady flow of water from one container to another. The Greeks called them clepsydras."],
    ["P", "Water clocks worked at night, but the flow rate changed with temperature, so they needed regular adjustment."],
    ["P", "In medieval Europe, candles marked with lines were used in monasteries to divide the night into periods for prayer."],
    ["P", "The first mechanical clocks appeared in the late thirteenth century. They were driven by falling weights and had no faces; they simply rang a bell."],
    ["P", "A major improvement came in sixteen fifty-six, when Christiaan Huygens built the first pendulum clock, which reduced errors from about fifteen minutes a day to about fifteen seconds."],
    ["P", "Finally, John Harrison's marine chronometer in the eighteenth century solved the problem of timekeeping at sea, allowing sailors to calculate their longitude."],
  ],
  groups: [
    {
      type: "Note Completion",
      instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
      layout: "notes",
      heading: "Measuring time before modern clocks",
      questions: [
        { n: 1, text: "Sundials were used in Egypt from about [[1]] BC", answer: ["1500", "1,500"], explanation: "'as early as fifteen hundred B.C.'." },
        { n: 2, text: "Limitation: useless at night or on [[2]] days", answer: ["cloudy"], explanation: "'useless at night or on cloudy days'." },
        { n: 3, text: "Water clocks: the flow rate changed with [[3]]", answer: ["temperature"], explanation: "'the flow rate changed with temperature'." },
        { n: 4, text: "Medieval monasteries used marked [[4]]", answer: ["candles"], explanation: "'candles marked with lines'." },
        { n: 5, text: "Early mechanical clocks were driven by falling [[5]]", answer: ["weights"], explanation: "'driven by falling weights'." },
        { n: 6, text: "They had no faces and simply rang a [[6]]", answer: ["bell"], explanation: "'they simply rang a bell'." },
        { n: 7, text: "The pendulum clock reduced errors to about fifteen [[7]] a day", answer: ["seconds"], explanation: "'to about fifteen seconds'." },
        { n: 8, text: "The marine chronometer helped sailors calculate [[8]]", answer: ["longitude"], explanation: "'allowing sailors to calculate their longitude'." },
      ],
    },
  ],
};

const coral = {
  id: "coral-lecture",
  title: "Lecture: Coral Reef Restoration",
  context: "A marine biologist gives a lecture on restoring coral reefs.",
  speakers: { P: "Lecturer" },
  lines: [
    ["P", "Coral reefs cover less than one per cent of the ocean floor, but they support about a quarter of all marine species."],
    ["P", "The main threat they face is rising sea temperature, which causes bleaching. Corals expel the algae that live in their tissues and turn white."],
    ["P", "One restoration method is coral gardening. Fragments are grown in underwater nurseries, often hanging from structures shaped like trees, and transplanted to the reef after six to twelve months."],
    ["P", "A second approach uses larvae. Researchers collect coral spawn during the annual spawning event and rear the larvae in tanks before releasing them."],
    ["P", "A third, more controversial technique is assisted evolution, in which corals are selectively bred to tolerate heat."],
    ["P", "Critics point out that restoration is expensive, costing up to four hundred thousand dollars per hectare, and that it cannot succeed unless emissions are reduced."],
  ],
  groups: [
    {
      type: "Note Completion",
      instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
      layout: "notes",
      heading: "Coral reef restoration",
      questions: [
        { n: 1, text: "Reefs support about a [[1]] of marine species", answer: ["quarter"], explanation: "'about a quarter of all marine species'." },
        { n: 2, text: "Main threat: rising sea [[2]]", answer: ["temperature"], explanation: "'rising sea temperature'." },
        { n: 3, text: "Bleaching: corals expel [[3]] from their tissues", answer: ["algae"], explanation: "'Corals expel the algae'." },
        { n: 4, text: "Coral gardening: nursery structures shaped like [[4]]", answer: ["trees"], explanation: "'structures shaped like trees'." },
        { n: 5, text: "Fragments transplanted after 6–12 [[5]]", answer: ["months"], explanation: "'after six to twelve months'." },
        { n: 6, text: "Larval method: larvae are reared in [[6]]", answer: ["tanks"], explanation: "'rear the larvae in tanks'." },
        { n: 7, text: "Assisted evolution: corals bred to tolerate [[7]]", answer: ["heat"], explanation: "'selectively bred to tolerate heat'." },
        { n: 8, text: "Cost: up to $[[8]] per hectare", answer: ["400000", "400,000", "400 000"], explanation: "'four hundred thousand dollars per hectare'." },
      ],
    },
  ],
};

export const LISTENING_BANK = { 1: [gym, cottage], 2: [museum, garden], 3: [project, seminar], 4: [timekeeping, coral] };
export const ALL_LISTENING_SECTIONS = [gym, cottage, museum, garden, project, seminar, timekeeping, coral];

export function getListeningSection(book, test, section) {
  const uploaded = getCambridgeOverride("listening", book, test, section);
  if (uploaded) return uploaded;
  const list = LISTENING_BANK[section];
  if (!list) return null;
  return list[(Number(book) + Number(test) + 1) % list.length];
}

export const LISTENING_TIME = { single: 10 * 60, full: 40 * 60 };
