import type { Course } from "./types";

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
    {
      id: "titus-money-u2",
      title: "Unit 2 · Open Hand, Strong Heart",
      summary: "Tithe first, needs vs wants, do not love money, share the extra.",
      lessons: [
        { id: "titus-money-u2-l1", title: "Firstfruits", objective: "Give to the Lord first, not from leftovers.", teach: "Proverbs 3:9 says honor the Lord with your firstfruits, not with whatever is left after treats. In this house that looks like giving to the church first. God does not need your coins. He wants your heart in the right order.", memoryWork: "Honor the Lord with the first, not the leftovers (Proverbs 3:9)." },
        { id: "titus-money-u2-l2", title: "Needs vs Wants", objective: "Sort a list into needs and wants.", teach: "A need keeps a body and a household going: food, clothes that fit, a roof. A want is extra: a new lure, more screen time. Wants are not sins. Putting wants before needs is foolish. A hunter who spends the ammo money on candy goes home empty.", memoryWork: "Needs keep you going. Wants can wait." },
        { id: "titus-money-u2-l3", title: "Do Not Love Money", objective: "Name money as a tool, not a treasure.", teach: "Paul says the love of money is a root of all kinds of evils (1 Timothy 6:10). Coins are a good tool and a terrible king. If a boy is only happy when he is getting, money has him. Hold it with an open hand.", memoryWork: "Money is a tool, never a king (1 Timothy 6:10)." },
        { id: "titus-money-u2-l4", title: "Share the Extra", objective: "Give extra away instead of hoarding.", teach: "When God gives extra, a faithful hunter shares the meat. The same is true of coins. Generosity is not losing. It is acting like a son of a generous Father.", memoryWork: "When God gives extra, I share." },
      ],
    },
  ],
};
