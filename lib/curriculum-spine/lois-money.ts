import type { Course } from "./types";

// Lois, Intro to Money (grammar stage, Pre-K age 3). The tiniest, gentlest start before
// she begins earning. Kept to Princess Crystal's 2-sentence voice: money comes from
// helping, we give-save-spend, saving lets us get something special later, and it is all
// God's gift. Confessional framing at a toddler's level (James 1:17, every good gift is
// from God).
//
// Skill scaffolding adapted from the Marble open skill taxonomy, Life Skills domain, 
// used as a coverage map only; content authored fresh in the family's idiom.
// Source: github.com/withmarbleapp/os-taxonomy (ODbL 1.0 / CC BY-SA 4.0).

export const LOIS_MONEY: Course = {
  kidId: "lois",
  subject: "money",
  subjectLabel: "Pennies",
  emoji: "🪙",
  gradeLabel: "Pre-K",
  stage: "grammar",
  overview:
    "The gentlest first taste of money. We get pennies by helping. We can give some, save some, and spend some. If we save, we can get something special later. And every good thing is a gift from God.",
  units: [
    {
      id: "lois-money-u1",
      title: "Unit 1 · Pennies!",
      summary: "Pennies come from helping, give-save-spend, saving for later, and God's good gifts.",
      lessons: [
        { id: "lois-money-u1-l1", title: "Helping Earns Pennies", objective: "Know we get money by helping.", teach: "When we help, we earn pennies. Helping is good and makes God happy!", memoryWork: "We earn pennies by helping." },
        { id: "lois-money-u1-l2", title: "Give, Save, Spend", objective: "Know we give some, save some, spend some.", teach: "We give some pennies, save some, and spend some. Three little jars!", memoryWork: "Give some, save some, spend some." },
        { id: "lois-money-u1-l3", title: "Save for Something Special", objective: "Know saving lets us get something special later.", teach: "If we save our pennies and wait, we can get something special. Waiting is worth it!", memoryWork: "Save and wait, and get something special." },
        { id: "lois-money-u1-l4", title: "Every Gift Is from God", objective: "Know everything good comes from God.", teach: "Every good thing comes from God. We say thank you, God!", memoryWork: "Every good gift comes from God. Thank you, God!" },
      ],
    },
  ],
};
