import type { Course } from "./types";

export const TRUMA_MONEY: Course = {
  kidId: "truma",
  subject: "money",
  subjectLabel: "Money",
  emoji: "💰",
  gradeLabel: "6th Grade",
  stage: "logic",
  overview:
    "A short but real start on money before you begin earning. Money is earned through diligent work. Every amount is stewarded in three portions: give first (firstfruits), save, and spend. Saving toward a goal has an opportunity cost, so choosing entertainment now is choosing against the goal later. Small, steady savings grow. And through all of it, money is a good servant but a terrible master, so we hold it with an open hand before God (Luke 16:10; 1 Timothy 6:10).",
  units: [
    {
      id: "truma-money-u1",
      title: "Unit 1 · Stewardship & Wise Money",
      summary: "Work and reward, give/save/spend percentages, opportunity cost, growth, and money as servant not master.",
      lessons: [
        { id: "truma-money-u1-l1", title: "Work and Reward", objective: "Explain the link between diligent work and earning.", teach: "Money is the fruit of work. Scripture ties provision to diligence: 'In all toil there is profit, but mere talk tends only to poverty' (Proverbs 14:23). Before you earn, settle this: the reward follows the work, not the wish. A steward earns honestly and works as unto the Lord (Colossians 3:23).", memoryWork: "'In all toil there is profit, but mere talk tends only to poverty' (Proverbs 14:23)." },
        { id: "truma-money-u1-l2", title: "Give, Save, Spend (with Percentages)", objective: "Split an amount into give/save/spend portions using percentages.", teach: "Divide every amount into three portions. A classic wise split of $50 is give 10% ($5) first as firstfruits (Proverbs 3:9), save 30% ($15), and spend the rest, 60% ($30). The exact numbers can flex, but the ORDER matters: give first, save second, spend last. What you do first reveals what you love most.", memoryWork: "Give first (firstfruits), then save, then spend. Order reveals the heart." },
        { id: "truma-money-u1-l3", title: "Saving Toward a Goal & Opportunity Cost", objective: "Define opportunity cost and apply it to a savings goal.", teach: "Every dollar can do only one thing. Spend it on screen time now, and it can never also go toward the goal you are saving for; that lost alternative is the OPPORTUNITY COST. If a goal costs $60 and you save $10 a week, one week of spending on treats instead pushes the goal a full week further away. Naming the cost before you spend is what wise savers do.", memoryWork: "Opportunity cost: every dollar spent one way is a dollar you cannot use another way." },
        { id: "truma-money-u1-l4", title: "Small Savings Grow", objective: "Explain how steady saving (and interest) grows money over time.", teach: "Saving is not dramatic; it is steady. Ten dollars a week is $520 in a year, without any interest at all. And when savings earn interest, they grow on their own, so patience is quietly rewarded. 'Whoever gathers little by little will increase it' (Proverbs 13:11). The tortoise, not the hare, wins with money.", memoryWork: "'Whoever gathers little by little will increase it' (Proverbs 13:11)." },
        { id: "truma-money-u1-l5", title: "Servant, Not Master", objective: "Explain that money is a tool to steward, not a master to serve.", teach: "Money is a good servant and a cruel master. Jesus said, 'You cannot serve God and money' (Matthew 6:24), and Paul warns that 'the love of money is a root of all kinds of evils' (1 Timothy 6:10). We manage it, give generously, and keep our hearts free, because 'one who is faithful in a very little is also faithful in much' (Luke 16:10). Hold it with an open hand.", memoryWork: "'You cannot serve God and money' (Matthew 6:24). Money is a servant, never a master." },
      ],
    },
    {
      id: "truma-money-u2",
      title: "Unit 2 · Firstfruits & a Free Heart",
      summary: "The local church, contentment vs comparison, debt as a snare, giving in secret.",
      lessons: [
        { id: "truma-money-u2-l1", title: "Firstfruits and the Local Church", objective: "Give first to the gathered church, not as leftover charity.", teach: "The 1689 confession treats giving as part of worship in the local church, not a tip we add if we feel generous. Firstfruits means the first portion, not the scraps. God is not raising funds. He is forming a woman who knows whose the money is.", memoryWork: "Firstfruits belong in the church, as worship, not leftovers." },
        { id: "truma-money-u2-l2", title: "Contentment vs Comparison", objective: "Name comparison as a thief of thanks.", teach: "Comparison is a quiet idol: her dress, her room, her coins. Hebrews 13:5 says be content with what you have, for He has said, 'I will never leave you.' A girl who measures herself by other girls will never have enough. A girl who measures by the Lord's kindness already does.", memoryWork: "Be content with what you have (Hebrews 13:5). Comparison steals thanks." },
        { id: "truma-money-u2-l3", title: "Debt Is a Snare", objective: "Explain why owing is dangerous, even in small ways.", teach: "Proverbs 22:7: the borrower is servant to the lender. You are not taking out a mortgage. You are learning the principle while the numbers are small: do not spend what you do not have. Waiting is freedom. Owing is a leash.", memoryWork: "The borrower is servant to the lender (Proverbs 22:7). Wait rather than owe." },
        { id: "truma-money-u2-l4", title: "Give in Secret", objective: "Prefer hidden generosity to praised generosity.", teach: "Jesus said not to let the left hand know what the right hand is doing (Matthew 6:3–4). Real giving is before the Father, not for a reputation as the generous sister. If praise is the point, it was never a gift.", memoryWork: "Give in secret. The Father who sees in secret will reward." },
      ],
    },
  ],
};
