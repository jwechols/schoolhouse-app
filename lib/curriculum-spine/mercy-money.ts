import type { Course } from "./types";

// Mercy, Intro to Money (grammar stage, Kindergarten). A SHORT, warm onboarding course
// before she begins earning. Simple, concrete: money comes from helping and working, it
// has three jars (give, save, spend), saving means waiting for something special, and
// spending it all now means none is left to save. It is all God's, and we thank Him and
// share (Psalm 24:1). Princess Rose's garden warmth.
//
// Skill scaffolding adapted from the Marble open skill taxonomy, Life Skills domain, 
// used as a coverage map only; no standards file, content authored in the family's idiom.
// Source: github.com/withmarbleapp/os-taxonomy (ODbL 1.0 / CC BY-SA 4.0).

export const MERCY_MONEY: Course = {
  kidId: "mercy",
  subject: "money",
  subjectLabel: "Money",
  emoji: "💰",
  gradeLabel: "Kindergarten",
  stage: "grammar",
  overview:
    "A warm little start on money before you begin earning. Money comes from helping and doing good work. Every bit has three jars: a Give jar, a Save jar, and a Spend jar. Saving means waiting for something special, and if you spend it all now, there is none left to save. And the best part: it all belongs to God, so we thank Him and love to share.",
  units: [
    {
      id: "mercy-money-u1",
      title: "Unit 1 · Three Jars",
      summary: "Money from work, give-save-spend jars, patient saving, and God owns it all.",
      lessons: [
        { id: "mercy-money-u1-l1", title: "Money Comes from Helping", objective: "Know money is earned by good work and helping.", teach: "Money is not free; we earn it by helping and doing a good job. When you work hard on your job, you earn a little reward. God is happy when we work with cheerful hands!", memoryWork: "We earn money by helping and doing good work." },
        { id: "mercy-money-u1-l2", title: "Give, Save, Spend Jars", objective: "Name the three jars: give, save, spend.", teach: "Every coin has three jars. The GIVE jar gives some back to God, because He gave it all. The SAVE jar keeps some for later. The SPEND jar buys a little something. Give, save, spend!", memoryWork: "Three jars: give some, save some, spend some." },
        { id: "mercy-money-u1-l3", title: "Saving Means Waiting", objective: "Know that saving means waiting for something special.", teach: "If you want something big and special, you save your coins and wait. A little bit each day grows into enough! Waiting is called patience, and patience is a gift from God.", memoryWork: "Saving means waiting. A little bit grows into enough." },
        { id: "mercy-money-u1-l4", title: "If You Spend It All", objective: "Know that spending everything now leaves nothing to save.", teach: "If you spend all your coins right now on treats or TV, then your save jar is empty. There is nothing left for the special thing you wanted! It is wiser to save some first.", memoryWork: "If you spend it all now, there is none left to save." },
        { id: "mercy-money-u1-l5", title: "It All Belongs to God", objective: "Know that everything is God's, so we thank Him and share.", teach: "The whole world and everything in it belongs to God (Psalm 24:1). So our coins are really His! We say thank you to Him, and we love to share, because sharing makes God glad.", memoryWork: "Everything belongs to God. We say thank you and love to share." },
      ],
    },
  ],
};
