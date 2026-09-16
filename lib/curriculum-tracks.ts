import type { SubjectCurriculum } from "@/lib/curriculum";

// ── Skill Tracks: Wilderness · Money · Home ──────────────────────────────────
// Practical life-skills tracks (JM's vision: teach the kids real things, 
// fire, budgeting, serving the household, all under God's Word).
// These seed questions anchor style + difficulty; the AI lesson engine
// generates fresh sets each session, so tracks never run out.

// ─── TITUS (3rd grade, outdoorsman) ──────────────────────────────────────────

const TITUS_WILDERNESS: SubjectCurriculum = {
  subjectId: "wilderness",
  subjectLabel: "Outdoors",
  emoji: "🏕️",
  concept:
    "God made the wild and gave us wisdom to live in it. A good outdoorsman is prepared, patient, and safe, he respects creation because he honors the Creator. Let's learn real skills: fire, water, shelter, and tracking!",
  questions: [
    {
      id: "tw1",
      prompt: "What are the three things every fire needs to burn?",
      choices: ["Heat, fuel, and oxygen", "Matches, paper, and wind", "Sticks, rocks, and sunshine", "Gasoline, wood, and a lighter"],
      answer: "Heat, fuel, and oxygen",
      hint: "It's called the fire triangle! Take away any one of the three and the fire dies. That's also how you put a fire OUT, smother the oxygen or remove the fuel.",
    },
    {
      id: "tw2",
      prompt: "You're lost in the woods. What's the FIRST rule?",
      choices: ["Stop, stay calm, stay put", "Run and look for a road", "Climb the tallest tree", "Follow the first animal trail you see"],
      answer: "Stop, stay calm, stay put",
      hint: "Hunters call it S.T.O.P., Stop, Think, Observe, Plan. People who wander get harder to find. God gave you a mind, panic turns it off, calm turns it on.",
    },
    {
      id: "tw3",
      prompt: "Which of these makes the best tinder to start a fire?",
      choices: ["Dry grass and birch bark", "Green leaves", "Wet moss", "Big thick logs"],
      answer: "Dry grass and birch bark",
      hint: "Tinder must be DRY and thin so a spark can catch. You build up: tinder → kindling (pencil-size sticks) → fuel (big wood). Small to big, always.",
    },
    {
      id: "tw4",
      prompt: "Before you take a shot or cast a line, what does a wise hunter check FIRST?",
      choices: ["What's behind and around the target", "How big the trophy is", "Whether his buddies are watching", "The weather for tomorrow"],
      answer: "What's behind and around the target",
      hint: "Safety first, always, know your target and what's beyond it. A wise man counts the cost before he acts (Luke 14:28). The woods reward the careful.",
    },
  ],
};

const TITUS_MONEY: SubjectCurriculum = {
  subjectId: "money",
  subjectLabel: "Money",
  emoji: "💰",
  concept:
    "Everything belongs to God, money is something He lets us manage for Him. That's called stewardship. A good steward works hard, gives first, saves second, and spends carefully. Let's learn how money really works!",
  questions: [
    {
      id: "tm1",
      prompt: "You earn $10. Following Give-Save-Spend, what do you do FIRST?",
      choices: ["Set aside your giving to God", "Buy something fun", "Hide it under your bed", "Lend it to a friend"],
      answer: "Set aside your giving to God",
      hint: "Proverbs 3:9 says honor the Lord with the FIRSTfruits, not the leftovers. Giving first trains your heart to remember Who it all belongs to.",
    },
    {
      id: "tm2",
      prompt: "What is a budget?",
      choices: ["A plan for where your money goes before you spend it", "A list of things you wish you had", "Money the bank gives you", "A kind of wallet"],
      answer: "A plan for where your money goes before you spend it",
      hint: "A budget is telling your money where to go instead of wondering where it went! Even $5 can have a plan: some to give, some to save, some to spend.",
    },
    {
      id: "tm3",
      prompt: "You want a $40 fishing rod and earn $5 a week. If you save ALL of it, how many weeks until you can buy it?",
      choices: ["8 weeks", "4 weeks", "40 weeks", "5 weeks"],
      answer: "8 weeks",
      hint: "$40 ÷ $5 = 8 weeks. That's patience, and here's the secret: things you save up for feel better than things handed to you. The diligent hand makes rich (Proverbs 10:4).",
    },
    {
      id: "tm4",
      prompt: "What does the Bible say about the ant in Proverbs 6?",
      choices: ["It works hard and stores food without being told", "It's the strongest bug", "It steals from grasshoppers", "It sleeps all winter"],
      answer: "It works hard and stores food without being told",
      hint: "\"Go to the ant, O sluggard; consider her ways and be wise.\" The ant doesn't need a boss watching, she prepares ahead. That's what saving is!",
    },
  ],
};

const TITUS_HOME: SubjectCurriculum = {
  subjectId: "home",
  subjectLabel: "Home Skills",
  emoji: "🔨",
  concept:
    "A man serves his family with his hands. Knowing how to cook an egg, use a tool, patch things up, and help when someone's hurt, these skills make you useful, and being useful is a way of loving people. Work is a gift from God!",
  questions: [
    {
      id: "th1",
      prompt: "Which way do you turn a screw to TIGHTEN it?",
      choices: ["Right (clockwise)", "Left (counter-clockwise)", "Either way works", "Push it straight in"],
      answer: "Right (clockwise)",
      hint: "Righty-tighty, lefty-loosey! Clockwise tightens, counter-clockwise loosens. Works for screws, bolts, jar lids, and garden hoses.",
    },
    {
      id: "th2",
      prompt: "Your little sister scrapes her knee. After you get a grown-up, what does the cut need first?",
      choices: ["Gentle washing with clean water", "A bandage right over the dirt", "Ice", "Nothing, just leave it"],
      answer: "Gentle washing with clean water",
      hint: "Clean first, THEN cover. A bandage over dirt traps germs inside. Wash it, pat it dry, then bandage. You just did real first aid!",
    },
    {
      id: "th3",
      prompt: "What's the safe way to hand someone a knife or scissors?",
      choices: ["Handle first, blade toward yourself", "Blade first so they can see it", "Toss it gently", "Slide it across the floor"],
      answer: "Handle first, blade toward yourself",
      hint: "The one holding the blade controls the danger, so YOU take the careful part and give them the safe part. That's what serving others looks like, even in small things.",
    },
    {
      id: "th4",
      prompt: "Why do we wash hands BEFORE cooking?",
      choices: ["So germs from our hands don't get in the food", "To make our hands warm", "Because soap smells good", "So the food tastes salty"],
      answer: "So germs from our hands don't get in the food",
      hint: "Germs are too small to see but real, 20 seconds with soap sends them down the drain. Cooking for people means protecting them too.",
    },
  ],
};

// ─── MERCY (Kindergarten, garden) ────────────────────────────────────────────

const MERCY_WILDERNESS: SubjectCurriculum = {
  subjectId: "wilderness",
  subjectLabel: "Outdoors",
  emoji: "🏕️",
  concept:
    "God made the whole outdoors, the trees, the bugs, the stars! Let's learn how to explore it safely and take care of it, like good helpers in God's big garden.",
  questions: [
    {
      id: "mw1",
      prompt: "If you ever get lost outside, what should you do?",
      choices: ["Stop and stay in one spot", "Keep walking fast", "Hide very quietly"],
      answer: "Stop and stay in one spot",
      hint: "Stay put and be loud, not lost and quiet! When you stay in one place, Mom and Dad can find you fast. 🌸",
    },
    {
      id: "mw2",
      prompt: "What do plants need to grow?",
      choices: ["Sun, water, and soil", "Candy and juice", "Blankets and pillows"],
      answer: "Sun, water, and soil",
      hint: "God feeds His flowers with sunshine, rain, and good dirt! When you water a garden, you're helping God's plan for the plants. ☀️💧",
    },
    {
      id: "mw3",
      prompt: "Should you ever touch a wild animal, even a cute one?",
      choices: ["No, look with your eyes, not your hands", "Yes, if it's fluffy", "Yes, if it's small"],
      answer: "No, look with your eyes, not your hands",
      hint: "Wild animals can be scared of us and might bite. We can love God's creatures by watching them and leaving them safe. 🐿️",
    },
    {
      id: "mw4",
      prompt: "What should you bring on a walk outside on a hot sunny day?",
      choices: ["Water to drink", "A blanket", "Your pillow"],
      answer: "Water to drink",
      hint: "Water keeps your body happy in the sun! Explorers always bring water. 💧",
    },
  ],
};

const MERCY_MONEY: SubjectCurriculum = {
  subjectId: "money",
  subjectLabel: "Money",
  emoji: "💰",
  concept:
    "All our money comes from God! We give some to God first, save some for later, and spend some carefully. That's how we take good care of what He gives us.",
  questions: [
    {
      id: "mm1",
      prompt: "Who does everything we have really belong to?",
      choices: ["God", "The store", "The bank"],
      answer: "God",
      hint: "The earth is the Lord's and everything in it (Psalm 24:1)! God shares with us, so we share too. 🌸",
    },
    {
      id: "mm2",
      prompt: "You have 3 jars: Give, Save, Spend. Which one is for helping church and others?",
      choices: ["Give", "Save", "Spend"],
      answer: "Give",
      hint: "The Give jar goes first! Giving makes our hearts happy because God loves a cheerful giver. 💝",
    },
    {
      id: "mm3",
      prompt: "If you save 1 dollar every week for 3 weeks, how many dollars do you have?",
      choices: ["3 dollars", "1 dollar", "10 dollars"],
      answer: "3 dollars",
      hint: "1 + 1 + 1 = 3! Saving means your money grows little by little, like a flower. 🌷",
    },
    {
      id: "mm4",
      prompt: "What does it mean to WAIT and save for something special?",
      choices: ["Being patient", "Being grumpy", "Being sleepy"],
      answer: "Being patient",
      hint: "Patience means waiting with a happy heart! Things we wait for feel extra special when we finally get them. 🌸",
    },
  ],
};

const MERCY_HOME: SubjectCurriculum = {
  subjectId: "home",
  subjectLabel: "Home Skills",
  emoji: "🏡",
  concept:
    "Helping at home is a way to love your family! Setting the table, watering flowers, cleaning up, every little job makes our home a happy place. God made you a wonderful helper!",
  questions: [
    {
      id: "mh1",
      prompt: "Where does a fork go when you set the table?",
      choices: ["Next to the plate", "On the chair", "In the cup"],
      answer: "Next to the plate",
      hint: "Fork on the left of the plate, like they're holding hands! Setting the table is a beautiful way to serve your family. 🍽️",
    },
    {
      id: "mh2",
      prompt: "What do we do with toys when we finish playing?",
      choices: ["Put them back where they live", "Leave them on the floor", "Hide them under the couch"],
      answer: "Put them back where they live",
      hint: "Every toy has a home! Putting things away keeps our house safe and pretty, and it makes Mom smile. 🌸",
    },
    {
      id: "mh3",
      prompt: "How long should you wash your hands with soap?",
      choices: ["While you sing a whole song like Jesus Loves Me", "Just one second", "You don't need soap"],
      answer: "While you sing a whole song like Jesus Loves Me",
      hint: "Sing your song while you scrub, that's how long it takes to wash the germs away! 🧼",
    },
    {
      id: "mh4",
      prompt: "A plant's leaves are droopy and the dirt is dry. What does it need?",
      choices: ["Water", "A nap", "A bandage"],
      answer: "Water",
      hint: "Droopy leaves and dry dirt mean 'I'm thirsty!' A little gardener knows just what to do. 💧🌷",
    },
  ],
};

// ─── LOIS (Pre-K, age 3, princess) ───────────────────────────────────────────

const LOIS_WILDERNESS: SubjectCurriculum = {
  subjectId: "wilderness",
  subjectLabel: "Outdoors",
  emoji: "🦋",
  concept: "God made the outside! Let's learn about it! 🌳",
  questions: [
    {
      id: "lw1",
      prompt: "Who made the trees and the sky?",
      choices: ["God", "A robot", "The TV"],
      answer: "God",
      hint: "God made everything outside! Say it: God made it all! 🌳",
    },
    {
      id: "lw2",
      prompt: "What do we drink when we play outside in the sun?",
      choices: ["Water 💧", "Mud", "Leaves"],
      answer: "Water 💧",
      hint: "Water makes our bodies happy! Glug glug! 💧",
    },
    {
      id: "lw3",
      prompt: "Is fire hot or cold?",
      choices: ["Hot! 🔥", "Cold ❄️", "Wet"],
      answer: "Hot! 🔥",
      hint: "Fire is HOT hot hot! Only grown-ups touch fire things. 🔥",
    },
    {
      id: "lw4",
      prompt: "What does a little bird live in?",
      choices: ["A nest", "A car", "A shoe"],
      answer: "A nest",
      hint: "Birdies build cozy nests in trees! God takes care of the birdies. 🐦",
    },
  ],
};

const LOIS_MONEY: SubjectCurriculum = {
  subjectId: "money",
  subjectLabel: "Pennies!",
  emoji: "🪙",
  concept: "God gives us everything! We share, we save, we say thank you! 🪙",
  questions: [
    {
      id: "lm1",
      prompt: "Who gives us everything we have?",
      choices: ["God", "The store", "A dragon"],
      answer: "God",
      hint: "God gives us every good thing! Thank you, God! 💝",
    },
    {
      id: "lm2",
      prompt: "You have 1 penny and get 1 more. How many pennies?",
      choices: ["2", "5", "0"],
      answer: "2",
      hint: "One penny plus one penny is TWO pennies! 🪙🪙",
    },
    {
      id: "lm3",
      prompt: "What do we say when someone gives us something?",
      choices: ["Thank you!", "Nothing", "More!"],
      answer: "Thank you!",
      hint: "Thank you, thank you! A princess always says thank you! 👑",
    },
    {
      id: "lm4",
      prompt: "Sharing with others makes God…",
      choices: ["Happy! 😊", "Sleepy", "Grumpy"],
      answer: "Happy! 😊",
      hint: "God loves it when we share! Sharing is loving! 💕",
    },
  ],
};

const LOIS_HOME: SubjectCurriculum = {
  subjectId: "home",
  subjectLabel: "Helper!",
  emoji: "🧺",
  concept: "You are Mommy's big helper! Let's learn helper things! 🧺",
  questions: [
    {
      id: "lh1",
      prompt: "Where do dirty clothes go?",
      choices: ["The laundry basket", "Under the bed", "On the dog"],
      answer: "The laundry basket",
      hint: "In the basket they go! What a big helper you are! 🧺",
    },
    {
      id: "lh2",
      prompt: "What do we do with toys when we're all done?",
      choices: ["Clean them up", "Throw them", "Step on them"],
      answer: "Clean them up",
      hint: "Clean up, clean up! Every toy goes home! ✨",
    },
    {
      id: "lh3",
      prompt: "What do we wash before we eat?",
      choices: ["Our hands", "Our shoes", "The cat"],
      answer: "Our hands",
      hint: "Washy washy hands with soap! Bye-bye germs! 🧼",
    },
    {
      id: "lh4",
      prompt: "Helping Mommy and Daddy shows them…",
      choices: ["Love! 💕", "Nothing", "That you're sleepy"],
      answer: "Love! 💕",
      hint: "Helping is loving! God made you a wonderful helper! 💕",
    },
  ],
};

// ─── TRUMA (6th grade, rhetoric stage) ───────────────────────────────────────

const TRUMA_WILDERNESS: SubjectCurriculum = {
  subjectId: "wilderness",
  subjectLabel: "Outdoors",
  emoji: "🏕️",
  concept:
    "Real competence outdoors: fire craft, water, navigation, weather, and first response. Creation is God's general revelation (Psalm 19), studying it carefully and moving through it skillfully are both acts of worship. These are skills you'll actually use, and one day teach.",
  questions: [
    {
      id: "trw1",
      prompt: "Why does a properly built fire lay go tinder → kindling → fuel wood, in that order?",
      choices: [
        "Each stage catches at a higher temperature, so the flame must grow through them in sequence",
        "It looks more organized",
        "Big logs light fastest so they anchor the fire",
        "The order doesn't actually matter if you use enough matches",
      ],
      answer: "Each stage catches at a higher temperature, so the flame must grow through them in sequence",
      hint: "A match can't ignite a log because the log needs far more sustained heat to reach ignition temperature. Tinder catches from a spark, kindling from tinder's flame, fuel from kindling's coals. Order is the whole skill.",
    },
    {
      id: "trw2",
      prompt: "You're day-hiking and clouds build fast, the temperature drops, and wind picks up. Best decision?",
      choices: [
        "Turn back or get to safe shelter now, weather changes beat schedules",
        "Push to the summit since you're close",
        "Wait under the tallest tree",
        "Split up so someone can go for help faster",
      ],
      answer: "Turn back or get to safe shelter now, weather changes beat schedules",
      hint: "Most wilderness emergencies are a chain of small pride-driven choices. The tallest tree is a lightning target, splitting up multiplies risk, and summits will still be there next week. Prudence is a virtue (Proverbs 22:3: the prudent sees danger and hides himself).",
    },
    {
      id: "trw3",
      prompt: "Which water source is generally SAFEST to drink after filtering/boiling?",
      choices: [
        "Fast-moving clear stream water, collected upstream of trails and camps",
        "Still pond water near a beaver dam",
        "Any water, as long as it looks clear",
        "Puddle water since it's fresh rain",
      ],
      answer: "Fast-moving clear stream water, collected upstream of trails and camps",
      hint: "Moving water discourages stagnant growth, and collecting upstream of human/animal activity lowers contamination. But 'looks clear' means nothing, giardia is invisible. Filter or boil regardless.",
    },
    {
      id: "trw4",
      prompt: "Without a compass, which of these is the most reliable direction clue?",
      choices: [
        "The sun rises in the east and sets in the west",
        "Moss always grows on the north side of trees",
        "Birds always fly south",
        "Rivers always flow north",
      ],
      answer: "The sun rises in the east and sets in the west",
      hint: "The moss rule is folklore, moss grows wherever it's damp and shaded. The sun's path is physics: rises east, arcs south (in the northern hemisphere), sets west. Track shadow movement for 15 minutes and you have an east-west line.",
    },
  ],
};

const TRUMA_MONEY: SubjectCurriculum = {
  subjectId: "money",
  subjectLabel: "Money",
  emoji: "💰",
  concept:
    "Stewardship at full strength: budgeting with percentages, interest working for you and against you, honest profit, and generosity as the goal of wealth (Ephesians 4:28, work so you have something to SHARE). Money is a good servant and a terrible master.",
  questions: [
    {
      id: "trm1",
      prompt: "You earn $50. You budget 10% giving, 30% saving, 60% spending. How much goes to each?",
      choices: ["Give $5, save $15, spend $30", "Give $10, save $20, spend $20", "Give $5, save $10, spend $35", "Give $15, save $15, spend $20"],
      answer: "Give $5, save $15, spend $30",
      hint: "Percent means 'per hundred': 10% of 50 = 0.10 × 50 = $5; 30% = $15; 60% = $30. Check: 5 + 15 + 30 = 50. A budget you can't verify with arithmetic is a wish, not a plan.",
    },
    {
      id: "trm2",
      prompt: "What is compound interest?",
      choices: [
        "Earning interest on both your original money AND the interest it already earned",
        "Interest that only banks can earn",
        "A fee for opening a savings account",
        "Interest that stays the same dollar amount forever",
      ],
      answer: "Earning interest on both your original money AND the interest it already earned",
      hint: "Money that earns money that earns money. $100 at 10%/year is $110, then $121, then $133, the growth itself grows. It works FOR savers and AGAINST borrowers. That's why debt is dangerous and early saving is powerful.",
    },
    {
      id: "trm3",
      prompt: "You bake cookies to sell: ingredients cost $8, you sell them all for $20. What's your profit, and what SHOULD come out of it first?",
      choices: ["$12 profit; giving comes first", "$20 profit; spending comes first", "$8 profit; saving comes first", "$12 profit; you owe nothing to anyone"],
      answer: "$12 profit; giving comes first",
      hint: "Profit = revenue minus costs: 20 - 8 = $12. Revenue is not profit, forgetting costs is how businesses die. And the firstfruits principle (Proverbs 3:9) applies to a cookie stand exactly as it does to a company.",
    },
    {
      id: "trm4",
      prompt: "Why does the Bible warn about DEBT (Proverbs 22:7)?",
      choices: [
        "The borrower becomes the slave of the lender, debt binds your future",
        "Money itself is evil",
        "Banks are always dishonest",
        "Borrowing is always a sin in every case",
      ],
      answer: "The borrower becomes the slave of the lender, debt binds your future",
      hint: "Scripture doesn't call money evil (the LOVE of money is the root, 1 Timothy 6:10), and it doesn't flatly forbid borrowing, but it's blunt about what debt does: it obligates tomorrow's freedom to pay for today's wants. The wise treat it as a last resort, not a lifestyle.",
    },
  ],
};

const TRUMA_HOME: SubjectCurriculum = {
  subjectId: "home",
  subjectLabel: "Home Skills",
  emoji: "🔨",
  concept:
    "Running a household is real leadership: cooking food that's safe and good, handling tools, responding when someone's hurt, keeping order. Titus 2 and Proverbs 31 both paint competence at home as glory, not drudgery. Whatever you do, work heartily, as for the Lord (Colossians 3:23).",
  questions: [
    {
      id: "trh1",
      prompt: "Why must raw chicken never touch foods that won't be cooked (like salad)?",
      choices: [
        "Raw poultry carries salmonella; cooking kills it, but the salad never gets cooked",
        "It makes the salad taste bad",
        "Chicken juice makes lettuce wilt",
        "It's just tradition from old cookbooks",
      ],
      answer: "Raw poultry carries salmonella; cooking kills it, but the salad never gets cooked",
      hint: "This is called cross-contamination. The chicken is safe AFTER 165°F; the cutting board, knife, and your hands are not. Separate boards, wash everything raw poultry touches with hot soapy water.",
    },
    {
      id: "trh2",
      prompt: "Someone in the kitchen gets a minor burn from a hot pan. First response?",
      choices: [
        "Cool running water for 10-20 minutes, then cover loosely",
        "Butter or oil on the burn",
        "Ice directly on the skin",
        "Pop any blisters so they heal faster",
      ],
      answer: "Cool running water for 10-20 minutes, then cover loosely",
      hint: "Butter traps heat IN (it's a cooking fat!), ice damages tissue, and blisters are the body's sterile bandage. Cool water pulls heat out and limits damage depth. Big burn, burn on face/hands, or charred skin → adult + medical help immediately.",
    },
    {
      id: "trh3",
      prompt: "A screw won't tighten because the hole is stripped. What's the real problem?",
      choices: [
        "The threads in the hole are worn smooth, so there's nothing for the screw to grip",
        "The screw is too clean",
        "You're turning it the wrong direction",
        "Screws simply wear out after a week",
      ],
      answer: "The threads in the hole are worn smooth, so there's nothing for the screw to grip",
      hint: "Screws hold by biting spiral threads into material. Overtightening or repeated use can strip those threads smooth. Fixes: a slightly larger screw, a toothpick-and-glue plug, or a threaded insert. Diagnosing WHY something fails is the core repair skill.",
    },
    {
      id: "trh4",
      prompt: "You're making dinner for the family: pasta takes 10 min, sauce takes 25, garlic bread takes 8. When do you start each so it's all done together?",
      choices: [
        "Sauce first, pasta 15 minutes later, bread 2 minutes after the pasta",
        "Everything at the same time",
        "Bread first since it's fastest",
        "Pasta first, then figure the rest out",
      ],
      answer: "Sauce first, pasta 15 minutes later, bread 2 minutes after the pasta",
      hint: "Work backward from the finish: the longest task starts first, and everything else slots in by its duration. 25-10=15, 25-8=17. Chefs call it mise en place thinking, it's the same planning skill as project management.",
    },
  ],
};

export const TRUMA_TRACKS: Record<string, SubjectCurriculum> = {
  wilderness: TRUMA_WILDERNESS,
  money: TRUMA_MONEY,
  home: TRUMA_HOME,
};

// ─── Export maps (merged into ALL_CURRICULUM in curriculum.ts) ───────────────

export const TITUS_TRACKS: Record<string, SubjectCurriculum> = {
  wilderness: TITUS_WILDERNESS,
  money: TITUS_MONEY,
  home: TITUS_HOME,
};

export const MERCY_TRACKS: Record<string, SubjectCurriculum> = {
  wilderness: MERCY_WILDERNESS,
  money: MERCY_MONEY,
  home: MERCY_HOME,
};

export const LOIS_TRACKS: Record<string, SubjectCurriculum> = {
  wilderness: LOIS_WILDERNESS,
  money: LOIS_MONEY,
  home: LOIS_HOME,
};

// Track metadata for hub cards
export const SKILL_TRACKS = [
  { id: "wilderness", emoji: "🏕️", label: "Outdoors", blurb: "Fire, water, trails, God's creation" },
  { id: "money",      emoji: "💰", label: "Money",      blurb: "Give, save, spend, stewardship" },
  { id: "home",       emoji: "🔨", label: "Home Skills", blurb: "Cook, fix, clean, serve your family" },
] as const;
