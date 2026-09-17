import type { Course } from "./types";

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
    {
      id: "lois-money-u2",
      title: "Unit 2 · Give First",
      summary: "The give jar is for church, waiting is good, we do not grab, we say thank you.",
      lessons: [
        { id: "lois-money-u2-l1", title: "The Give Jar", objective: "Know the first pennies go to give.", teach: "The give jar is first. We give because God gave to us. Church is a happy place to give.", memoryWork: "Give first. God gave to us." },
        { id: "lois-money-u2-l2", title: "Wait for the Special Thing", objective: "Practice waiting instead of grabbing.", teach: "Wanting is okay. Grabbing is not. We wait, and Mom helps us save.", memoryWork: "Wait. Don't grab." },
        { id: "lois-money-u2-l3", title: "Thank You, God", objective: "Say thank you for what we have.", teach: "A full heart says thank you even for a little. God likes thankful children.", memoryWork: "Thank you, God, for what I have." },
      ],
    },
  ],
};
