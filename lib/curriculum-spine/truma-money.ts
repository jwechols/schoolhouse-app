import type { Course } from "./types";

// Truma, Intro to Money (dialectic stage, 6th grade). A SHORT but substantive onboarding
// course before the earning system unlocks, pitched at a junior theologian. Covers work
// and reward, give/save/spend with real percentages and firstfruits, saving toward a goal
// and the opportunity cost of "TV now," how small savings grow, and money as a servant
// rather than a master. Confessional Reformed Baptist stewardship throughout (Luke 16:10;
// 1 Timothy 6:10; Matthew 6:24; Proverbs 3:9). Lydia's voice: engages Truma as a steward
// in training, not a child.
//
// Skill scaffolding adapted from the Marble open skill taxonomy, Life Skills domain
// (What Money Is, Needs & Wants, Costs & Revenue, Saving), used as a coverage map only;
// no standards file, content authored fresh in the family's idiom.
// Source: github.com/withmarbleapp/os-taxonomy (ODbL 1.0 / CC BY-SA 4.0).

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
  ],
};
