import type { Course } from "./types";

// Truma, Home Skills (dialectic stage, 6th grade). Substantive homemaking and life skills
// for a capable young woman, framed as diligence, service, and hospitality, the heart of
// Proverbs 31 and Colossians 3:23. Lydia's voice: treat her as a competent steward of a
// home in training, never talking down. Confessional Reformed Baptist throughout.
//
// Life Skills scaffolding adapted from the open skill taxonomy as a coverage map only.
// Source: github.com/withmarbleapp/os-taxonomy.

export const TRUMA_HOME: Course = {
  kidId: "truma",
  subject: "home",
  subjectLabel: "Home Skills",
  emoji: "🏠",
  gradeLabel: "6th Grade",
  stage: "logic",
  overview:
    "Real homemaking and life skills for a capable young woman, done as diligent, joyful service to her family and, one day, her own household. Truma learns to clean a room thoroughly, run laundry start to finish, plan and cook a simple meal with kitchen safety, keep a home welcoming through hospitality, and help care for younger siblings. The heart of it is Proverbs 31 diligence and Colossians 3:23: work done heartily, as for the Lord.",
  units: [
    {
      id: "truma-home-u1",
      title: "Unit 1 · Stewarding a Home",
      summary: "Cleaning well, laundry, cooking, kitchen safety, hospitality, and caring for siblings.",
      lessons: [
        { id: "truma-home-u1-l1", title: "Clean a Room Thoroughly", objective: "Clean a room properly, top to bottom.", teach: "A room is cleaned in an order that works: tidy and put away first, then dust from high to low (dust falls), then wipe surfaces, and vacuum or sweep the floor last so you catch what fell. Cleaning top-to-bottom means you never re-dirty what you just cleaned. A well-kept home is a quiet act of love for everyone who lives in it.", memoryWork: "Clean top to bottom: tidy, dust high-to-low, wipe, then floor last." },
        { id: "truma-home-u1-l2", title: "Laundry Start to Finish", objective: "Run a full laundry cycle: sort, wash, dry, fold, put away.", teach: "Laundry is a full cycle, not just a wash. Sort by color and fabric, wash with the right water temperature and the right amount of detergent, dry (checking care labels so nothing shrinks), then fold promptly so clothes don't wrinkle, and put them away. Doing the whole cycle, not just starting it, is what makes it truly helpful.", memoryWork: "Sort, wash, dry, fold, put away, finish the whole cycle." },
        { id: "truma-home-u1-l3", title: "Plan and Cook a Simple Meal", objective: "Plan and prepare a simple, balanced meal.", teach: "A good simple meal has a protein, a vegetable, and a starch. Plan it, gather (and read) the recipe and ingredients first ('mise en place'), then cook, tasting as you go. Start with something manageable like eggs, rice and vegetables, or a simple soup. Feeding people is one of the oldest and kindest forms of service.", memoryWork: "A simple meal: a protein, a vegetable, and a starch. Read the recipe first." },
        { id: "truma-home-u1-l4", title: "Kitchen Safety & Cleanup", objective: "Work safely in the kitchen and clean up thoroughly.", teach: "The kitchen calls for care: sharp knives cut away from you, hot handles turned inward, and raw meat kept separate from other food (wash hands and boards after). When you finish, clean as you go and wipe every surface, so the kitchen is left better than you found it. Diligence protects the people you're serving.", memoryWork: "Cut away from you, keep raw meat separate, and clean as you go." },
        { id: "truma-home-u1-l5", title: "Hospitality: Welcoming Others", objective: "Prepare a home and a heart to welcome guests.", teach: "Hospitality is making others feel welcome and cared for. Practically, that means a tidy space, a warm greeting, something to eat or drink, and real attention to your guest. Scripture commands it plainly: 'Show hospitality to one another without grumbling' (1 Peter 4:9). A welcoming home is a picture of the welcome we have in Christ.", memoryWork: "'Show hospitality to one another without grumbling' (1 Peter 4:9)." },
        { id: "truma-home-u1-l6", title: "Helping with Younger Siblings", objective: "Care for and lead younger siblings patiently.", teach: "Helping with the little ones is real, weighty work: keeping them safe, playing patiently, helping with snacks or clean-up, and setting a kind example. Your patience and gentleness teach them more than your words. It is training for a lifetime of loving service, and it genuinely lightens your parents' load.", memoryWork: "Care for the little ones with patience; your example teaches them most." },
      ],
    },
  ],
};
