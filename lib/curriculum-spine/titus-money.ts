import type { Course } from "./types";

// Titus, Intro to Money (grammar stage). A SHORT onboarding course taken before the
// gig/earning system unlocks, so he understands WHY before he earns. Teaches that money
// comes from work, that every bit has three jobs (give, save, spend), that saving toward
// a goal means waiting, and that spending it all now (on TV or treats) costs him the
// bigger thing later. Confessional Reformed Baptist stewardship: it is all God's, and we
// manage it faithfully for Him (Luke 16:10; Proverbs 3:9). Hunting/fishing flavor.
//
// Skill scaffolding adapted from the Marble open skill taxonomy, Life Skills domain
// (What Money Is, Needs & Wants, Buying Things, Saving), used as a coverage map only; no
// standards file, content authored fresh in the family's idiom.
// Source: github.com/withmarbleapp/os-taxonomy (ODbL 1.0 / CC BY-SA 4.0).

export const TITUS_MONEY: Course = {
  kidId: "titus",
  subject: "money",
  subjectLabel: "Money",
  emoji: "💰",
  gradeLabel: "3rd Grade",
  stage: "grammar",
  overview:
    "A short start on money before you begin earning. Money comes from good work. Every bit of it has three jobs: give some to God first, save some, and spend some wisely. Saving toward a goal means waiting, and spending it all now on TV or treats costs you the bigger thing you were saving for. Above all, it is all God's, and He calls us to be faithful stewards with what He gives (Luke 16:10).",
  units: [
    {
      id: "titus-money-u1",
      title: "Unit 1 · Money & Wise Choices",
      summary: "Where money comes from, give-save-spend, saving toward a goal, and the cost of spending now.",
      lessons: [
        { id: "titus-money-u1-l1", title: "Where Money Comes From", objective: "Explain that money is earned by work.", teach: "Money does not appear by magic; it is earned by work. When you do a good job on a real task, you earn a reward you can save or spend. God made us to work, and He blesses diligent hands: 'The hand of the diligent makes rich' (Proverbs 10:4). Good work first, then reward.", memoryWork: "Money is earned by good work. 'The hand of the diligent makes rich' (Proverbs 10:4)." },
        { id: "titus-money-u1-l2", title: "Give, Save, Spend", objective: "Name the three jobs of every dollar: give, save, spend.", teach: "Every dollar you earn has three jobs. GIVE some first, back to God, because He gave it all (Proverbs 3:9). SAVE some for later and for goals. SPEND some wisely on what you need. Give first, save second, spend third. That order keeps your heart in the right place.", memoryWork: "Every dollar: give first, save second, spend third." },
        { id: "titus-money-u1-l3", title: "Saving Toward a Goal", objective: "Explain that a big goal is reached by saving a little at a time.", teach: "Say you want a $40 fishing rod, but you only earn $5 a week. If you save it, in 8 weeks you can buy it. Saving toward a goal means waiting and not spending along the way. 'The wise store up choice food' (Proverbs 21:20); a wise person saves on purpose.", memoryWork: "A big goal is reached by saving a little at a time, and waiting." },
        { id: "titus-money-u1-l4", title: "The Cost of Spending Now", objective: "Explain opportunity cost: spending on TV now means less for the goal.", teach: "Here is the hard part. Every time you spend on TV time or a treat now, that is money that does NOT go toward your goal. That is called the cost of choosing: every choice gives something up. Choosing TV today can mean waiting many more weeks for the rod. Count the cost before you spend.", memoryWork: "Every choice gives something up. Spending on TV now means less for your goal later." },
        { id: "titus-money-u1-l5", title: "A Faithful Steward", objective: "Explain that money is God's and we manage it for Him.", teach: "In the end, none of it is really ours; it all belongs to God, and we are His stewards, managing His things. Jesus said, 'One who is faithful in a very little is also faithful in much' (Luke 16:10). Being wise with a few coins now trains you to be trusted with more. That is what a good steward does.", memoryWork: "It is all God's. 'One who is faithful in a very little is also faithful in much' (Luke 16:10)." },
      ],
    },
  ],
};
