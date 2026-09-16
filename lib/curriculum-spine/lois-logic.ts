import type { Course } from "./types";

// Lois, Pre-K "Thinking" (grammar stage, age 3). The subject id is "logic" to match her
// existing tile (label "Thinking"), so this Course drives her spine-tracked lesson flow.
// The very first thinking skills, scaled to a three-year-old: same and different, things
// that go together, sorting, big and little, opposites, position words, and what comes
// next. Kept tiny and warm for Princess Crystal's 2-sentence voice. Confessional framing:
// God made her mind to think, and He made a world of order she can begin to see (Genesis 1;
// Proverbs 20:12, "the hearing ear and the seeing eye, the Lord has made them both").
//
// Skill scaffolding (the ordered topics) is adapted from the Marble open skill taxonomy, 
// age 3-4 early-reasoning topics, used as a coverage map only. The taxonomy's standards
// alignment file is NOT used; all content is authored fresh in the family's idiom.
// Source: github.com/withmarbleapp/os-taxonomy (ODbL 1.0 / CC BY-SA 4.0).

export const LOIS_LOGIC: Course = {
  kidId: "lois",
  subject: "logic",
  subjectLabel: "Thinking",
  emoji: "🐾",
  gradeLabel: "Pre-K",
  stage: "grammar",
  overview:
    "The very first thinking games, just right for a three-year-old. Lois learns to tell same from different, to match things that go together, to sort by color, to know big from little, to say opposites, to use words like in, on, and under, and to guess what comes next. God made her mind to think, and made a world of order she is just beginning to see.",
  units: [
    {
      id: "lois-logic-u1",
      title: "Unit 1 · Same and Together",
      summary: "Same or different, things that go together, and sorting by color.",
      lessons: [
        { id: "lois-logic-u1-l1", title: "Same or Different", objective: "Point to two things that are the same, and two that are different.", teach: "Two things can be the SAME or DIFFERENT. Two red apples are the same. A cat and a shoe are different!", memoryWork: "Same means alike. Different means not alike." },
        { id: "lois-logic-u1-l2", title: "What Goes Together?", objective: "Match two things that belong together.", teach: "Some things go together! A shoe goes with a foot. A cup goes with a drink. God made our minds to see what fits.", memoryWork: "A shoe goes with a foot. A cup goes with a drink." },
        { id: "lois-logic-u1-l3", title: "Sort by Color", objective: "Put things of the same color together.", teach: "We can sort things into groups. Put all the red ones here, all the blue ones there. Sorting is thinking!", memoryWork: "Sorting means putting the same ones together." },
      ],
    },
    {
      id: "lois-logic-u2",
      title: "Unit 2 · Big, Little, and Opposites",
      summary: "Big and little, and simple opposites.",
      lessons: [
        { id: "lois-logic-u2-l1", title: "Big and Little", objective: "Tell which is big and which is little.", teach: "Some things are BIG and some are LITTLE. An elephant is big. A mouse is little. God made them all!", memoryWork: "Big is large. Little is small." },
        { id: "lois-logic-u2-l2", title: "Opposites", objective: "Say the opposite: up/down, hot/cold.", teach: "An opposite is the other way. Up and down. Hot and cold. Day and night. Can you say the other one?", memoryWork: "Up and down. Hot and cold. Those are opposites." },
        { id: "lois-logic-u2-l3", title: "In, On, and Under", objective: "Use position words: in, on, under.", teach: "Where is it? The cat is IN the box. The cup is ON the table. The shoe is UNDER the bed!", memoryWork: "In, on, and under tell us where something is." },
      ],
    },
    {
      id: "lois-logic-u3",
      title: "Unit 3 · Order and What Comes Next",
      summary: "Patterns, first-next-last, and guessing what happens next.",
      lessons: [
        { id: "lois-logic-u3-l1", title: "What Comes Next?", objective: "Finish a simple pattern.", teach: "A pattern repeats: red, blue, red, blue... what comes next? Red! Your mind can see the pattern.", memoryWork: "A pattern repeats over and over." },
        { id: "lois-logic-u3-l2", title: "First, Next, Last", objective: "Put three steps in order.", teach: "Things happen in order. First we wake up, next we eat, last we play. First, next, last!", memoryWork: "First, next, last tells the order things happen." },
        { id: "lois-logic-u3-l3", title: "What Will Happen?", objective: "Guess what happens next in a simple story.", teach: "We can guess what comes next! If you tip the cup, the water will spill. Good thinking, Lois!", memoryWork: "We can think about what will happen next." },
      ],
    },
  ],
};
