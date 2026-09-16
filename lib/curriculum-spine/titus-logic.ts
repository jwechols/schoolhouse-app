import type { Course } from "./types";

// Titus, 3rd Grade Logic (grammar stage). Classical-Christian "learning to think
// straight." The grammar-stage goal is NOT formal syllogisms yet (that comes in the
// dialectic stage); it is the raw material of clear thinking: telling true from false,
// same from different, cause from effect, reason from claim, plus the habits of a wise
// thinker (think before you start, check your work, understand WHY, persist, ask well).
// God is the source of all order and truth; to think clearly is to think God's thoughts
// after Him (Proverbs 1:7; John 14:6, Christ is the Truth). Hunting/fishing/outdoors
// scenarios throughout. Follows the titus-science.ts template for depth and tone.
//
// Skill scaffolding (the ordered micro-topics and mastery evidence) is adapted from the
// Marble open skill taxonomy, "Learning to Learn" and early reasoning domains, used as
// a coverage map only. The taxonomy's Common Core / NGSS alignment file is NOT used, and
// all teaching content below is authored fresh in the family's confessional idiom.
// Source: github.com/withmarbleapp/os-taxonomy (ODbL 1.0 / CC BY-SA 4.0).

export const TITUS_LOGIC: Course = {
  kidId: "titus",
  subject: "logic",
  subjectLabel: "Logic",
  emoji: "🧠",
  gradeLabel: "3rd Grade",
  stage: "grammar",
  overview:
    "A full 3rd-grade year learning to think straight. Start with the bedrock of clear thought: true or false, same or different, sorting things into groups, and spotting the odd one out. Then learn to reason: cause and effect, giving a real 'because,' weighing evidence, and telling a fact from an opinion. Move up to early inference with if-then thinking, patterns, and 'all, some, none.' Finish with the habits of a wise thinker: thinking before you start, checking your own work, understanding WHY and not just the answer, sticking with a hard problem, and asking a good question. All of it rests on one truth: God is the author of order and truth, so learning to think clearly is learning to think His thoughts after Him (Proverbs 1:7).",
  units: [
    {
      id: "titus-logic-u1",
      title: "Unit 1 · Thinking Straight",
      summary: "The bedrock of clear thought: true or false, same or different, sorting, and the odd one out.",
      lessons: [
        { id: "titus-logic-u1-l1", title: "True or False?", objective: "Tell whether a plain statement is true or false, and explain that truth matches reality.", teach: "A statement is a sentence that claims something is so, and it is either true or false. It is true when it matches the way things really are, and false when it does not. 'A deer has four legs' is true. 'A fish has feathers' is false. Truth is not about what we WISH were so; it is about what really IS. God Himself cannot lie (Titus 1:2), so truth is real and worth chasing.", memoryWork: "A true statement matches the way things really are.", practiceFocus: "Give Titus outdoor statements to mark true or false (e.g. 'a bass breathes with gills')." },
        { id: "titus-logic-u1-l2", title: "Same and Different", objective: "Compare two things and say one way they are the same and one way they are different.", teach: "Clear thinking starts with careful looking. When you compare two things, you ask 'How are these the same?' and 'How are these different?' A trout and a bass are the SAME in that both are fish that swim and breathe with gills; they are DIFFERENT in size, color, and where they like to hide. Seeing likeness and difference is the first tool of a good thinker.", memoryWork: "To compare is to ask how two things are the same and how they are different." },
        { id: "titus-logic-u1-l3", title: "Sorting into Groups", objective: "Sort a set of things into groups by a rule, and name the rule.", teach: "Sorting means putting things into groups by something they share, and every good sort has a rule. You could sort your tackle box by color, or by kind of lure, or by size. Scientists sort animals into mammals, birds, and fish. When you sort, always be able to say the RULE you used. God made a world of order, and sorting helps us see that order.", memoryWork: "Every good sort follows a rule you can name." },
        { id: "titus-logic-u1-l4", title: "The Odd One Out", objective: "Find which item does not belong in a group and explain why.", teach: "'Which one does not belong?' is a thinking puzzle. First find what most of the things have in common, then spot the one that breaks the rule. Deer, rabbit, bass, fox: the bass is the odd one out, because the others are furry land mammals and the bass is a fish. The trick is not just to POINT at the odd one but to SAY the reason.", memoryWork: "To find the odd one out, name what the others share, then find the one that breaks it." },
        { id: "titus-logic-u1-l5", title: "Opposites", objective: "Give the opposite of a word and explain what an opposite is.", teach: "An opposite is a word that means as far as possible the other way. Up and down, hot and cold, wet and dry, day and night. Opposites help you think in pairs and describe things exactly. If the water is not deep, it is shallow. Knowing opposites sharpens how carefully you can say what you mean.", memoryWork: "An opposite means the farthest other way: hot/cold, up/down, wet/dry." },
      ],
    },
    {
      id: "titus-logic-u2",
      title: "Unit 2 · Reasons & Because",
      summary: "How to reason: cause and effect, giving a real 'because,' weighing evidence, and fact vs. opinion.",
      lessons: [
        { id: "titus-logic-u2-l1", title: "Cause and Effect", objective: "Name the cause and the effect in a simple situation.", teach: "A cause is WHY something happens; the effect is WHAT happens because of it. Rain falls (cause), so the creek rises (effect). You forgot to set the hook (cause), so the fish got away (effect). Good thinkers always ask 'What caused this?' God rules over all causes and effects; nothing happens by dumb luck (Proverbs 16:33).", memoryWork: "The cause is why it happens; the effect is what happens because of it." },
        { id: "titus-logic-u2-l2", title: "Giving a 'Because'", objective: "Back up a claim with a real reason using the word 'because.'", teach: "When you say something is so, a good thinker can say WHY. The word 'because' introduces your reason. Not just 'This is a good fishing spot,' but 'This is a good fishing spot BECAUSE the water is shady and slow, where bass like to rest.' A claim with no reason is just an opinion shouted louder. A claim WITH a reason is an argument you can weigh.", memoryWork: "A good thinker can always give a 'because' for what he claims." },
        { id: "titus-logic-u2-l3", title: "Evidence: How Do You Know?", objective: "Point to evidence that supports a claim.", teach: "Evidence is the proof you can point to. A good tracker does not just guess a deer came by; he points to the tracks, the droppings, and the rubbed bark as evidence. When someone makes a claim, the sharp question is 'How do you know?' The answer should be evidence you can see, hear, or measure, not just a feeling.", memoryWork: "Evidence is the proof you can point to. Always ask: how do you know?" },
        { id: "titus-logic-u2-l4", title: "Fact or Opinion", objective: "Tell a fact (can be checked) from an opinion (what someone likes or thinks).", teach: "A fact is something that can be checked and is true for everyone: 'A largemouth bass can weigh over ten pounds.' An opinion is what a person likes or believes: 'Bass fishing is more fun than deer hunting.' Opinions are fine, but they are not proof, and two people can hold opposite opinions. Knowing which is which keeps you from being fooled.", memoryWork: "A fact can be checked and is true for all; an opinion is what someone likes or thinks." },
        { id: "titus-logic-u2-l5", title: "Reading the Signs (Inference)", objective: "Make a reasonable guess from clues and say what clues led to it.", teach: "To infer is to figure out something you were not told, using clues. You did not SEE the deer, but you see fresh tracks in soft mud, a warm bed of matted grass, and it is dawn, so you INFER a deer bedded here overnight and left recently. A good inference is built on clues you can name, not a wild guess. The better your clues, the better your inference.", memoryWork: "To infer is to make a smart guess from clues you can point to." },
      ],
    },
    {
      id: "titus-logic-u3",
      title: "Unit 3 · If-Then & Patterns",
      summary: "Early inference: if-then thinking, patterns, and 'all, some, none.'",
      lessons: [
        { id: "titus-logic-u3-l1", title: "If-Then Thinking", objective: "Complete a simple 'if... then...' statement.", teach: "'If-then' links a condition to what follows from it. IF it rains, THEN the ground gets wet. IF you feed the fish line out slowly, THEN it will not snap. Much of wisdom is if-then: IF you obey God's Word, THEN you walk in the light. Learning to think in 'if-then' lets you see what follows from what.", memoryWork: "If-then thinking links a cause to what follows: IF this, THEN that." },
        { id: "titus-logic-u3-l2", title: "Patterns: What Comes Next?", objective: "Find the rule in a pattern and say what comes next.", teach: "A pattern is something that repeats by a rule. 2, 4, 6, 8 grows by twos, so next is 10. Red, blue, red, blue means red is next. To solve a pattern, first find the RULE, then use it to say what comes next. God built patterns into creation: day and night, the seasons, the tides. Spotting patterns is a big part of thinking.", memoryWork: "To finish a pattern, find the rule that repeats, then use it." },
        { id: "titus-logic-u3-l3", title: "Always, Sometimes, Never", objective: "Decide whether a statement is always, sometimes, or never true.", teach: "Not every statement is a flat true or false; some are true only PART of the time. 'A fish lives in water' is ALWAYS true. 'It is raining' is SOMETIMES true. 'A deer flies' is NEVER true. Careful thinkers notice the difference, because a 'sometimes' is not the same as an 'always,' and mixing them up leads to mistakes.", memoryWork: "Some statements are always true, some sometimes true, and some never true." },
        { id: "titus-logic-u3-l4", title: "All, Some, and None", objective: "Use 'all,' 'some,' and 'none' correctly to describe a group.", teach: "These little words matter a lot. 'ALL bass are fish' means every single one. 'SOME animals in the pond are fish' means at least one, but not all. 'NONE of the mammals have feathers' means not a single one does. A sloppy thinker says 'all' when he means 'some.' A careful thinker uses the right word, because 'all' and 'some' are very different claims.", memoryWork: "All means every one; some means at least one but not all; none means not a single one." },
        { id: "titus-logic-u3-l5", title: "A Reason That Doesn't Fit", objective: "Spot a conclusion that does not follow from its reason.", teach: "Sometimes a reason sounds fine but does not actually prove the point. 'That man owns a big truck, SO he must be a good hunter.' Owning a truck does not make anyone a good hunter; the reason does not fit the claim. Grown-ups call a bad reason a 'fallacy.' You do not need the fancy word yet; you just need to ask, 'Does that reason really prove it?'", memoryWork: "Always ask: does the reason actually prove the claim, or does it just sound good?" },
      ],
    },
    {
      id: "titus-logic-u4",
      title: "Unit 4 · The Wise Thinker",
      summary: "The habits of a wise thinker: plan, check, understand why, persist, and ask well.",
      lessons: [
        { id: "titus-logic-u4-l1", title: "Think Before You Start", objective: "Make a simple plan before jumping into a problem.", teach: "A wise thinker stops and plans before he starts. Before you cast, you read the water and pick your spot. Before you answer a math problem, you ask 'What is it really asking, and what is my first step?' Rushing in leads to tangles. 'The plans of the diligent lead surely to plenty' (Proverbs 21:5). A moment of thinking up front saves a mess later.", memoryWork: "Think before you start: what is it asking, and what is my first step?" },
        { id: "titus-logic-u4-l2", title: "Check Your Own Work", objective: "Look back over an answer to catch mistakes before calling it done.", teach: "Finishing is not the same as finishing WELL. A wise thinker checks his own work: he reads the answer back, asks 'Does this make sense?', and looks for careless slips. A good fisherman checks his knot before he trusts it with a big fish. Checking your work is not doubting yourself; it is being careful, and it catches most mistakes.", memoryWork: "Before you call it done, check it: does this answer make sense?" },
        { id: "titus-logic-u4-l3", title: "Understand WHY, Not Just the Answer", objective: "Explain WHY an answer is right, not only WHAT the answer is.", teach: "Knowing the answer is good; knowing WHY it is the answer is better. Anyone can memorize that 6 x 3 = 18, but the thinker knows it is because 6 groups of 3 make 18. When you understand the why, you can solve new problems you have never seen. Always push past 'what is the answer?' to 'why is that the answer?'", memoryWork: "Don't just learn the answer; learn WHY it is the answer." },
        { id: "titus-logic-u4-l4", title: "Stick With a Hard Problem", objective: "Keep working on a hard problem instead of quitting at the first snag.", teach: "Hard does not mean impossible; hard means keep going. When a problem feels stuck, a wise thinker slows down, tries a different way, or breaks it into smaller pieces, instead of giving up. Landing a big fish takes patience on the reel. 'A righteous man falls seven times and rises again' (Proverbs 24:16). The feeling of not understanding YET is where real learning begins.", memoryWork: "Stuck is not the same as beaten. Slow down, try another way, keep going." },
        { id: "titus-logic-u4-l5", title: "Ask a Good Question", objective: "Turn 'I don't get it' into a specific question, and know it is wise to ask.", teach: "Asking for help is not weakness; it is wisdom. But 'I don't get it' is hard to help. A good question is specific: 'I understand the first step, but I don't see how you got from here to there.' Naming exactly where you are stuck is itself half of thinking. 'The way of a fool is right in his own eyes, but a wise man listens to counsel' (Proverbs 12:15).", memoryWork: "A good question names exactly where you are stuck. Asking well is wise." },
        { id: "titus-logic-u4-l6", title: "Teach It Back", objective: "Explain something learned in your own words to show you truly understand it.", teach: "The best test of understanding is teaching it to someone else. If you can explain how a food chain works, or why 6 x 3 is 18, in your OWN words so a younger kid gets it, then you really know it. If you get tangled trying to explain it, you have found the exact spot you still need to learn. Teaching it back turns 'I think I know it' into 'I know it.'", memoryWork: "If you can teach it back in your own words, you truly understand it." },
      ],
    },
  ],
};
