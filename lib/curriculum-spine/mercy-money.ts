import type { Course } from "./types";

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
    {
      id: "mercy-money-u2",
      title: "Unit 2 · Open Hands",
      summary: "Offering at church, wants vs needs, sharing with a sister, contentment.",
      lessons: [
        { id: "mercy-money-u2-l1", title: "The Offering", objective: "Know we give at church because God is first.", teach: "On the Lord's Day we give some of what God gave us. It is not paying God back. It is worship. A cheerful giver makes God glad (2 Corinthians 9:7).", memoryWork: "Giving at church is worship." },
        { id: "mercy-money-u2-l2", title: "Need or Want?", objective: "Tell a need from a want.", teach: "A need is something we must have: food, a coat, a home. A want is extra, like a toy. It is wise to take care of needs first.", memoryWork: "Needs first, wants later." },
        { id: "mercy-money-u2-l3", title: "Share with a Sister", objective: "Gladly share a coin or a treat.", teach: "Sisters share. If you have two, you can give one. God loves when we are generous with each other.", memoryWork: "If I have two, I can share one." },
        { id: "mercy-money-u2-l4", title: "Enough", objective: "Be glad with what God has given.", teach: "Contentment is being glad with enough. Always wanting more makes a sad heart. 'Godliness with contentment is great gain' (1 Timothy 6:6).", memoryWork: "God has given me enough. Thank you, Lord." },
      ],
    },
  ],
};
