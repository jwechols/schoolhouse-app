// Curriculum content for Titus, Mercy, and Lois
// Each subject has: a concept explanation and practice questions with hints

import { TITUS_TRACKS, MERCY_TRACKS, LOIS_TRACKS, TRUMA_TRACKS } from "@/lib/curriculum-tracks";

export interface CurriculumQuestion {
  id: string;
  prompt: string;
  choices: string[];
  answer: string;
  hint: string; // shown if they get it wrong
}

export interface SubjectCurriculum {
  subjectId: string;
  subjectLabel: string;
  emoji: string;
  concept: string; // kid-friendly explanation shown before practice
  questions: CurriculumQuestion[];
}

// ─── TITUS (3rd grade) ────────────────────────────────────────────────────────

const TITUS_MATH: SubjectCurriculum = {
  subjectId: "math",
  subjectLabel: "Math",
  emoji: "✖️",
  concept:
    "Multiplication is just adding the same number over and over! 3 × 4 means 3 groups of 4. " +
    "We're going to practice times tables for 2, 3, 4, and 5. Once you know these, math gets way easier!",
  questions: [
    {
      id: "tm1",
      prompt: "What is 2 × 3?",
      choices: ["4", "5", "6", "7"],
      answer: "6",
      hint: "Think of 2 groups of 3 dots: ••• and •••. How many total?",
    },
    {
      id: "tm2",
      prompt: "What is 3 × 4?",
      choices: ["7", "10", "12", "14"],
      answer: "12",
      hint: "Count by 3s four times: 3, 6, 9, 12. What's the last number?",
    },
    {
      id: "tm3",
      prompt: "What is 5 × 5?",
      choices: ["10", "20", "25", "30"],
      answer: "25",
      hint: "Count by 5s five times: 5, 10, 15, 20, 25. The answer ends in 5!",
    },
    {
      id: "tm4",
      prompt: "If you have 4 bags with 3 apples each, how many apples total?",
      choices: ["7", "10", "12", "16"],
      answer: "12",
      hint: "4 bags × 3 apples = ? Count 3, 6, 9, 12.",
    },
    {
      id: "tm5",
      prompt: "What is 2 × 8?",
      choices: ["14", "16", "18", "10"],
      answer: "16",
      hint: "Double 8: 8 + 8 = ?",
    },
    {
      id: "tm6",
      prompt: "What is 5 × 3?",
      choices: ["10", "12", "15", "18"],
      answer: "15",
      hint: "Count by 5s three times: 5, 10, 15.",
    },
    {
      id: "tm7",
      prompt: "Sam has 4 boxes. Each box has 4 toys. How many toys?",
      choices: ["8", "12", "16", "20"],
      answer: "16",
      hint: "4 × 4 = ? Think: 4+4 = 8, then 8+8 = 16.",
    },
    {
      id: "tm8",
      prompt: "What fraction of this shape is shaded if 1 out of 4 parts is shaded?",
      choices: ["1/3", "1/4", "1/2", "2/4"],
      answer: "1/4",
      hint: "The bottom number tells how many equal parts total. The top tells how many are shaded.",
    },
  ],
};

const TITUS_GRAMMAR: SubjectCurriculum = {
  subjectId: "grammar",
  subjectLabel: "Grammar",
  emoji: "📖",
  concept:
    "Sentences are built from different kinds of words. Nouns are people, places, or things. " +
    "Verbs are action words. Adjectives describe nouns. Knowing the parts helps you write awesome sentences!",
  questions: [
    {
      id: "tg1",
      prompt: "Which word is a NOUN?",
      choices: ["Run", "Happy", "Dog", "Quickly"],
      answer: "Dog",
      hint: "A noun names a person, place, or THING. Which word is a thing?",
    },
    {
      id: "tg2",
      prompt: "Which word is a VERB?",
      choices: ["Blue", "Jump", "Tall", "Flower"],
      answer: "Jump",
      hint: "A verb is an ACTION word, something you can do. Which word is an action?",
    },
    {
      id: "tg3",
      prompt: "Which word is an ADJECTIVE?",
      choices: ["Eat", "Book", "Fluffy", "Run"],
      answer: "Fluffy",
      hint: "Adjectives DESCRIBE things. Which word tells you what something is like?",
    },
    {
      id: "tg4",
      prompt: "Which is a complete sentence?",
      choices: ["The big dog.", "Running fast.", "She likes pizza.", "Under the tree."],
      answer: "She likes pizza.",
      hint: "A complete sentence needs a WHO (subject) and a DOES (verb). 'She likes pizza' has both!",
    },
    {
      id: "tg5",
      prompt: "What is the plural of 'fox'?",
      choices: ["Foxs", "Foxes", "Foxen", "Fox"],
      answer: "Foxes",
      hint: "Words ending in -x add -es. Fox → fox + es = ?",
    },
    {
      id: "tg6",
      prompt: "What punctuation ends a question?",
      choices: [".", "!", "?", ","],
      answer: "?",
      hint: "Look at this sentence: 'Are you ready', what mark goes at the end?",
    },
    {
      id: "tg7",
      prompt: "What does the contraction 'don't' mean?",
      choices: ["do not", "did not", "does not", "done it"],
      answer: "do not",
      hint: "The apostrophe replaces a letter. Don't = do + n't. What letters does n't replace?",
    },
    {
      id: "tg8",
      prompt: "Which word is a PRONOUN (replaces a noun)?",
      choices: ["Table", "She", "Happy", "Swim"],
      answer: "She",
      hint: "Pronouns are words like I, you, he, she, it, we, they. Which choice is one of those?",
    },
  ],
};

const TITUS_SCIENCE: SubjectCurriculum = {
  subjectId: "science",
  subjectLabel: "Science",
  emoji: "🔬",
  concept:
    "Living things go through life cycles, they're born, they grow, and they change. " +
    "In food chains, plants make energy from the sun, animals eat plants, and other animals eat those animals. " +
    "Every living thing plays an important role!",
  questions: [
    {
      id: "ts1",
      prompt: "What is the order of a butterfly's life cycle?",
      choices: [
        "Butterfly → egg → caterpillar → chrysalis",
        "Egg → caterpillar → chrysalis → butterfly",
        "Egg → butterfly → caterpillar → chrysalis",
        "Caterpillar → egg → butterfly → chrysalis",
      ],
      answer: "Egg → caterpillar → chrysalis → butterfly",
      hint: "It starts as a tiny egg, hatches into a caterpillar, then wraps itself up… what comes last?",
    },
    {
      id: "ts2",
      prompt: "In a food chain, what do we call animals that eat only plants?",
      choices: ["Predators", "Herbivores", "Carnivores", "Omnivores"],
      answer: "Herbivores",
      hint: "Herbi- comes from Latin for plant. Herbivores eat herby/plant things!",
    },
    {
      id: "ts3",
      prompt: "What do plants need to make their own food?",
      choices: [
        "Darkness and soil",
        "Sunlight, water, and air",
        "Rain and snow",
        "Animals",
      ],
      answer: "Sunlight, water, and air",
      hint: "Think about what a plant needs to stay alive. Have you heard of photosynthesis?",
    },
    {
      id: "ts4",
      prompt: "What is at the BOTTOM of most food chains?",
      choices: ["Lions", "Mice", "Plants", "Eagles"],
      answer: "Plants",
      hint: "The bottom of a food chain is where energy comes from. Plants get energy from the sun!",
    },
    {
      id: "ts5",
      prompt: "A tadpole grows into what animal?",
      choices: ["A fish", "A frog", "A turtle", "A salamander"],
      answer: "A frog",
      hint: "Think of a small, swimming creature that lives in ponds and grows legs…",
    },
    {
      id: "ts6",
      prompt: "Which animal is a carnivore (eats only meat)?",
      choices: ["Deer", "Rabbit", "Eagle", "Horse"],
      answer: "Eagle",
      hint: "Carn- means meat/flesh. Eagles swoop down to catch fish and small animals.",
    },
    {
      id: "ts7",
      prompt: "What do we call it when a caterpillar becomes a butterfly?",
      choices: ["Migration", "Metamorphosis", "Hibernation", "Photosynthesis"],
      answer: "Metamorphosis",
      hint: "Meta- means change. Metamorphosis is a BIG change in body shape!",
    },
    {
      id: "ts8",
      prompt: "What force pulls objects toward the ground?",
      choices: ["Magnetism", "Friction", "Gravity", "Wind"],
      answer: "Gravity",
      hint: "Drop a ball, what pulls it DOWN? That's the force we're looking for.",
    },
  ],
};

const TITUS_BIBLE: SubjectCurriculum = {
  subjectId: "bible",
  subjectLabel: "Bible",
  emoji: "✝️",
  concept:
    "Jesus told special stories called parables to teach us about God's kingdom. " +
    "These aren't just old stories, they teach us how to live, how much God loves us, " +
    "and why Jesus came to save us. Let's see how much you know!",
  questions: [
    {
      id: "tbi1",
      prompt: "In the parable of the Prodigal Son, what did the father do when his son came home?",
      choices: [
        "He was angry and sent him away",
        "He ran to meet him and threw a party",
        "He made him work for forgiveness",
        "He ignored him",
      ],
      answer: "He ran to meet him and threw a party",
      hint: "The father in this story shows us how GOD feels when someone comes back to Him. Would God be happy or angry?",
    },
    {
      id: "tbi2",
      prompt: "What happened to Jesus THREE days after He died on the cross?",
      choices: [
        "He went to heaven immediately",
        "He rose from the dead",
        "His disciples carried Him away",
        "Nothing happened",
      ],
      answer: "He rose from the dead",
      hint: "This is the most important event in the whole Bible. Easter Sunday is a celebration of this!",
    },
    {
      id: "tbi3",
      prompt: "In the parable of the Lost Sheep, the shepherd leaves 99 sheep to find how many?",
      choices: ["1", "5", "10", "50"],
      answer: "1",
      hint: "This story shows how much God cares about EVERY single person. He leaves 99 to find just one!",
    },
    {
      id: "tbi4",
      prompt: "How are we saved, by earning it or by God's gift?",
      choices: [
        "By doing enough good works",
        "By being better than others",
        "By God's grace through faith, it's a gift",
        "By our own willpower",
      ],
      answer: "By God's grace through faith, it's a gift",
      hint: "Ephesians 2:8 says grace is a gift. Can you earn a gift, or is it freely given?",
    },
    {
      id: "tbi5",
      prompt: "What does the word 'gospel' mean?",
      choices: ["Good rules", "Good news", "God's book", "Great story"],
      answer: "Good news",
      hint: "Gospel comes from an old English word meaning 'good news.' What was the good news Jesus brought?",
    },
    {
      id: "tbi6",
      prompt: "Jesus fed 5,000 people with how much food to start?",
      choices: [
        "10 loaves and 1 fish",
        "5 loaves and 2 fish",
        "3 loaves and 5 fish",
        "A whole basket of food",
      ],
      answer: "5 loaves and 2 fish",
      hint: "A boy offered his small lunch. It wasn't much, but Jesus used it to do something amazing!",
    },
    {
      id: "tbi7",
      prompt: "What did Jesus say is the GREATEST commandment?",
      choices: [
        "Honor your father and mother",
        "Love God with all your heart, soul, and mind",
        "Do not steal",
        "Keep the Sabbath holy",
      ],
      answer: "Love God with all your heart, soul, and mind",
      hint: "Matthew 22:37, Jesus said there are two great commandments. This is the FIRST and greatest one.",
    },
    {
      id: "tbi8",
      prompt: "Young David defeated the giant Goliath using what?",
      choices: [
        "A sword and armor",
        "A sling and a stone",
        "An arrow and a bow",
        "His bare hands",
      ],
      answer: "A sling and a stone",
      hint: "David didn't use fancy weapons. He trusted God and used a simple shepherd's tool. What do shepherds use?",
    },
  ],
};

// ─── MERCY (Kindergarten) ─────────────────────────────────────────────────────

const MERCY_MATH: SubjectCurriculum = {
  subjectId: "counting",
  subjectLabel: "Counting",
  emoji: "🔢",
  concept:
    "Numbers help us count everything around us! We can count to 20 and even add small numbers together. " +
    "Let's practice counting and adding, it's like a game!",
  questions: [
    {
      id: "mm1",
      prompt: "🐶🐶🐶 How many dogs?",
      choices: ["2", "3", "4"],
      answer: "3",
      hint: "Count them one by one, point to each doggy as you count!",
    },
    {
      id: "mm2",
      prompt: "What number comes AFTER 7?",
      choices: ["6", "8", "9"],
      answer: "8",
      hint: "Count on your fingers: 1, 2, 3, 4, 5, 6, 7… what comes next?",
    },
    {
      id: "mm3",
      prompt: "🍎 + 🍎 = ?  (1 + 1)",
      choices: ["1", "2", "3"],
      answer: "2",
      hint: "Hold up 1 finger on your left hand, 1 finger on your right. How many total?",
    },
    {
      id: "mm4",
      prompt: "🌟🌟 + 🌟🌟 = ?  (2 + 2)",
      choices: ["3", "4", "5"],
      answer: "4",
      hint: "Count all the stars: 1, 2, 3, 4!",
    },
    {
      id: "mm5",
      prompt: "Which number is BIGGER: 12 or 8?",
      choices: ["8", "12", "Equal"],
      answer: "12",
      hint: "When we count, which number comes LATER, 8 or 12? Later = bigger!",
    },
    {
      id: "mm6",
      prompt: "🌺🌺🌺🌺🌺🌺 How many flowers?",
      choices: ["5", "6", "7"],
      answer: "6",
      hint: "Count slowly: 1, 2, 3, 4, 5, 6. Touch each one!",
    },
    {
      id: "mm7",
      prompt: "What number comes AFTER 19?",
      choices: ["18", "20", "21"],
      answer: "20",
      hint: "We're almost at 20! Count: 17, 18, 19, ___",
    },
    {
      id: "mm8",
      prompt: "🍎🍎🍎 + 🍎🍎 = ? (3 + 2)",
      choices: ["4", "5", "6"],
      answer: "5",
      hint: "Count all the apples together: 1, 2, 3… keep going!",
    },
  ],
};

const MERCY_PHONICS: SubjectCurriculum = {
  subjectId: "phonics",
  subjectLabel: "Phonics",
  emoji: "🔤",
  concept:
    "Every letter makes a special sound! When we put sounds together, they make words. " +
    "The word 'cat' has three sounds: /c/ /a/ /t/. Let's practice letter sounds and rhyming words!",
  questions: [
    {
      id: "mf1",
      prompt: "What sound does the letter B make?",
      choices: ["/b/ like Ball", "/p/ like Pop", "/d/ like Dog"],
      answer: "/b/ like Ball",
      hint: "Put your lips together and make the sound. B-b-b-ball! What sound is that?",
    },
    {
      id: "mf2",
      prompt: "Which word RHYMES with 'cat'?",
      choices: ["Dog", "Hat", "Cup"],
      answer: "Hat",
      hint: "Rhyming words end with the same sound. Cat ends with -at. Which word also ends with -at?",
    },
    {
      id: "mf3",
      prompt: "Which word starts with the /S/ sound?",
      choices: ["Moon", "Sun", "Run"],
      answer: "Sun",
      hint: "The /s/ sound is like a snake: sssss. Which word starts with that sound?",
    },
    {
      id: "mf4",
      prompt: "What sound does the letter M make?",
      choices: ["/m/ like Moon", "/n/ like Nut", "/b/ like Ball"],
      answer: "/m/ like Moon",
      hint: "Close your mouth and hum, mmmmm. That's the letter M's sound!",
    },
    {
      id: "mf5",
      prompt: "Which word RHYMES with 'dog'?",
      choices: ["Cat", "Log", "Sun"],
      answer: "Log",
      hint: "Dog ends with -og. Which word also ends with -og?",
    },
    {
      id: "mf6",
      prompt: "Which word starts with the /T/ sound?",
      choices: ["Fish", "Ball", "Tree"],
      answer: "Tree",
      hint: "T makes a tapping sound: t-t-t. Which word starts with t-t-t?",
    },
    {
      id: "mf7",
      prompt: "The word C-A-T spells what animal? 🐱",
      choices: ["Dog", "Cat", "Bird"],
      answer: "Cat",
      hint: "Say each sound: /c/ /a/ /t/. Put them together fast, what word do you hear?",
    },
    {
      id: "mf8",
      prompt: "Which word RHYMES with 'sun'?",
      choices: ["Run", "Cat", "Dog"],
      answer: "Run",
      hint: "Sun ends with -un. Which word also ends with -un?",
    },
  ],
};

const MERCY_BIBLE: SubjectCurriculum = {
  subjectId: "bible",
  subjectLabel: "Bible",
  emoji: "📖",
  concept:
    "God loves YOU so much! 🌸 He made the whole world, He sent Jesus to save us, " +
    "and He is always with us. The Bible tells us all about God's amazing love!",
  questions: [
    {
      id: "mbi1",
      prompt: "Who made the whole world? 🌍",
      choices: ["God made it", "It made itself", "People made it"],
      answer: "God made it",
      hint: "Genesis 1 says 'In the beginning, GOD created...' Who made everything?",
    },
    {
      id: "mbi2",
      prompt: "God loves ___.",
      choices: ["Only good people", "Everyone He made 💕", "Only grown-ups"],
      answer: "Everyone He made 💕",
      hint: "John 3:16 says God loved the WHOLE world. Does that include you?",
    },
    {
      id: "mbi3",
      prompt: "What do we call talking to God? 🙏",
      choices: ["Singing", "Prayer", "Reading"],
      answer: "Prayer",
      hint: "When you talk to God and listen to Him, what is that called?",
    },
    {
      id: "mbi4",
      prompt: "Noah built a big ___ to save the animals. 🐘🦁🚢",
      choices: ["House", "Boat (ark)", "Tower"],
      answer: "Boat (ark)",
      hint: "Noah needed something to float on the water. What floats?",
    },
    {
      id: "mbi5",
      prompt: "Jesus fed a huge crowd with just 5 loaves and 2 ___ 🐟🐟",
      choices: ["Cookies", "Fish", "Apples"],
      answer: "Fish",
      hint: "A little boy shared his lunch, it had bread and something that swims in the water!",
    },
    {
      id: "mbi6",
      prompt: "Three days after Jesus died, what happened?",
      choices: ["He stayed in the tomb", "He rose back to life! ✨", "He went far away"],
      answer: "He rose back to life! ✨",
      hint: "We celebrate this on Easter! Jesus came back to life, He is ALIVE!",
    },
    {
      id: "mbi7",
      prompt: "The rainbow 🌈 in the sky is God's special ___.",
      choices: ["Promise", "Decoration", "Accident"],
      answer: "Promise",
      hint: "After the big flood, God put a rainbow in the sky as a sign. What was He making to Noah?",
    },
    {
      id: "mbi8",
      prompt: "Does Jesus love little children? 💕",
      choices: ["Yes! He loves them!", "Only big kids", "Not really"],
      answer: "Yes! He loves them!",
      hint: "Jesus said 'Let the little children come to me', what does that tell you about how He feels?",
    },
  ],
};

// ─── LOIS (Preschool) ─────────────────────────────────────────────────────────
// Lois is 3, no text reading. All visual/emoji-based, BIG buttons.

const LOIS_ABC: SubjectCurriculum = {
  subjectId: "abc",
  subjectLabel: "ABC's",
  emoji: "🔤",
  concept: "Let's learn our letters! Each big picture shows a letter. Tap the right one! 🎉",
  questions: [
    {
      id: "la1",
      prompt: "Which letter is  A  ?",
      choices: ["B", "A", "C"],
      answer: "A",
      hint: "A looks like a mountain with a line across the middle! ▲",
    },
    {
      id: "la2",
      prompt: "🐱 CAT starts with…",
      choices: ["B", "C", "D"],
      answer: "C",
      hint: "C-C-Cat! The first sound is like a cookie: C!",
    },
    {
      id: "la3",
      prompt: "Which letter is  B  ?",
      choices: ["A", "B", "D"],
      answer: "B",
      hint: "B has two bumps on the right side, like two bubbles!",
    },
    {
      id: "la4",
      prompt: "🐶 DOG starts with…",
      choices: ["C", "D", "E"],
      answer: "D",
      hint: "D-D-Dog! D sounds like 'duh'!",
    },
    {
      id: "la5",
      prompt: "Which letter is  S  ?",
      choices: ["R", "S", "T"],
      answer: "S",
      hint: "S is curvy like a snake: sssss! 🐍",
    },
    {
      id: "la6",
      prompt: "🌟 STAR starts with…",
      choices: ["R", "S", "T"],
      answer: "S",
      hint: "S-S-Star! That hissing snake sound!",
    },
    {
      id: "la7",
      prompt: "Which letter comes AFTER A?",
      choices: ["A", "B", "C"],
      answer: "B",
      hint: "A, B, C… A comes first. What comes next?",
    },
    {
      id: "la8",
      prompt: "🦁 LION starts with…",
      choices: ["K", "L", "M"],
      answer: "L",
      hint: "L-L-Lion! L sounds like 'luh'!",
    },
  ],
};

const LOIS_NUMBERS: SubjectCurriculum = {
  subjectId: "numbers",
  subjectLabel: "Numbers",
  emoji: "🔢",
  concept: "Let's count! Look at the pictures and tap the right number! You can do it! 🌟",
  questions: [
    {
      id: "ln1",
      prompt: "🐶 How many dogs?",
      choices: ["1", "2", "3"],
      answer: "1",
      hint: "Count: just one doggy! 1!",
    },
    {
      id: "ln2",
      prompt: "🐶🐶 How many dogs?",
      choices: ["1", "2", "3"],
      answer: "2",
      hint: "Count: 1, 2, two doggies!",
    },
    {
      id: "ln3",
      prompt: "🌟🌟🌟 How many stars?",
      choices: ["2", "3", "4"],
      answer: "3",
      hint: "Count each star: 1, 2, 3!",
    },
    {
      id: "ln4",
      prompt: "🍎🍎🍎🍎 How many apples?",
      choices: ["3", "4", "5"],
      answer: "4",
      hint: "Count: 1, 2, 3, 4 apples!",
    },
    {
      id: "ln5",
      prompt: "🐱🐱🐱🐱🐱 How many cats?",
      choices: ["4", "5", "6"],
      answer: "5",
      hint: "Count: 1, 2, 3, 4, 5 kitties!",
    },
    {
      id: "ln6",
      prompt: "Which number is  3  ?",
      choices: ["2", "3", "4"],
      answer: "3",
      hint: "The number 3 has two bumps on the right side, like a backwards E!",
    },
    {
      id: "ln7",
      prompt: "🦆🦆 How many ducks?",
      choices: ["1", "2", "3"],
      answer: "2",
      hint: "Count: 1 duck, 2 ducks! Quack quack!",
    },
    {
      id: "ln8",
      prompt: "What number comes AFTER 2?   1, 2, ___",
      choices: ["1", "3", "4"],
      answer: "3",
      hint: "Count on your fingers: 1, 2, and then…?",
    },
  ],
};

const LOIS_COLORS: SubjectCurriculum = {
  subjectId: "colors",
  subjectLabel: "Colors",
  emoji: "🎨",
  concept: "Colors are everywhere! Look at the picture and tap the right color name! 🌈",
  questions: [
    {
      id: "lc1",
      prompt: "What color is 🔴?",
      choices: ["Red", "Blue", "Green"],
      answer: "Red",
      hint: "That's the color of apples 🍎 and fire trucks! What color?",
    },
    {
      id: "lc2",
      prompt: "What color is 🔵?",
      choices: ["Red", "Blue", "Yellow"],
      answer: "Blue",
      hint: "That's the color of the sky ☀️ and the ocean! What color?",
    },
    {
      id: "lc3",
      prompt: "What color is 🟡?",
      choices: ["Purple", "Orange", "Yellow"],
      answer: "Yellow",
      hint: "That's the color of the sun ☀️ and bananas 🍌! What color?",
    },
    {
      id: "lc4",
      prompt: "A strawberry 🍓 is what color?",
      choices: ["Blue", "Red", "Green"],
      answer: "Red",
      hint: "Strawberries are bright like a stop sign! What color?",
    },
    {
      id: "lc5",
      prompt: "What color is 🟢?",
      choices: ["Blue", "Green", "Red"],
      answer: "Green",
      hint: "That's the color of grass and frogs 🐸! What color?",
    },
    {
      id: "lc6",
      prompt: "What color is 🟠?",
      choices: ["Red", "Yellow", "Orange"],
      answer: "Orange",
      hint: "That's the color of an orange fruit 🍊! What color?",
    },
    {
      id: "lc7",
      prompt: "The sky ☁️ on a sunny day is what color?",
      choices: ["Green", "Red", "Blue"],
      answer: "Blue",
      hint: "Look up at the sky, what color do you see?",
    },
    {
      id: "lc8",
      prompt: "What color is 🟣?",
      choices: ["Blue", "Pink", "Purple"],
      answer: "Purple",
      hint: "That's the color of grapes 🍇! What color?",
    },
  ],
};

const LOIS_SHAPES: SubjectCurriculum = {
  subjectId: "shapes",
  subjectLabel: "Shapes",
  emoji: "⭐",
  concept: "Shapes are all around us! Let's find them! Tap the right shape name! 🎉",
  questions: [
    {
      id: "ls1",
      prompt: "What shape is ⭕ ?",
      choices: ["Square", "Circle", "Triangle"],
      answer: "Circle",
      hint: "This shape is perfectly round like a ball or the moon! No corners!",
    },
    {
      id: "ls2",
      prompt: "What shape is ⬛ ?",
      choices: ["Circle", "Square", "Triangle"],
      answer: "Square",
      hint: "This shape has 4 equal sides, like a window or a cracker!",
    },
    {
      id: "ls3",
      prompt: "What shape is 🔺 ?",
      choices: ["Circle", "Square", "Triangle"],
      answer: "Triangle",
      hint: "This shape has 3 corners, like a pizza slice 🍕!",
    },
    {
      id: "ls4",
      prompt: "A ball is what shape?",
      choices: ["Square", "Circle", "Triangle"],
      answer: "Circle",
      hint: "Bounce, bounce! A ball is perfectly round with no corners!",
    },
    {
      id: "ls5",
      prompt: "What shape is ⭐ ?",
      choices: ["Heart", "Star", "Circle"],
      answer: "Star",
      hint: "This shape has pointy parts all around it, like the stars in the sky!",
    },
    {
      id: "ls6",
      prompt: "What shape is ❤️ ?",
      choices: ["Heart", "Star", "Triangle"],
      answer: "Heart",
      hint: "This shape means love! It has a dip at the top and a point at the bottom!",
    },
    {
      id: "ls7",
      prompt: "A pizza 🍕 slice looks like what shape?",
      choices: ["Circle", "Square", "Triangle"],
      answer: "Triangle",
      hint: "A pizza slice has a pointy end and a wide end, 3 sides!",
    },
    {
      id: "ls8",
      prompt: "How many corners does a triangle have?",
      choices: ["2", "3", "4"],
      answer: "3",
      hint: "Count the pointy corners on 🔺, touch each one!",
    },
  ],
};

// ─── CLASSICAL / REFORMED CONTENT ────────────────────────────────────────────

export interface CatechismQA {
  q: string;
  a: string;
}

export interface MemoryVerse {
  reference: string;
  text: string;
}

// Keach's Baptist Catechism, age-adapted per kid
export const CATECHISM: Record<string, CatechismQA[]> = {
  lois: [
    { q: "Who made you?", a: "God made me." },
    { q: "What else did God make?", a: "God made all things." },
    { q: "Does God love you?", a: "Yes! God loves me very much." },
    { q: "Who is Jesus?", a: "Jesus is God's Son who loves me." },
    { q: "What do we say to God?", a: "We pray and say thank you to God." },
  ],
  mercy: [
    { q: "Who made you?", a: "God made me." },
    { q: "Why did God make you?", a: "To know Him, love Him, and enjoy Him forever." },
    { q: "What is God?", a: "God is a Spirit, He has no body like us." },
    { q: "Does God know everything?", a: "Yes! God knows all things." },
    { q: "Who is Jesus?", a: "Jesus is the Son of God who died to save us." },
    { q: "What do we call talking to God?", a: "We call it prayer." },
  ],
  titus: [
    { q: "Who made you?", a: "God made me." },
    { q: "What else did God make?", a: "God made all things out of nothing, for His own glory." },
    { q: "Who is God?", a: "God is a Spirit, infinite, eternal, and unchangeable." },
    { q: "Are there more Gods than one?", a: "There is but one only, the living and true God." },
    { q: "What is God's chief attribute?", a: "God is most holy, pure and perfect in all His ways." },
    { q: "Can God do all things?", a: "Yes! God is all-powerful, nothing is too hard for Him." },
    { q: "Does God know all things?", a: "Yes! God knows all things perfectly, even our thoughts." },
    { q: "What is sin?", a: "Sin is disobeying God's commands in thought, word, or deed." },
  ],
  truma: [
    { q: "What is the chief end of man?", a: "Man's chief end is to glorify God, and to enjoy him forever." },
    { q: "What rule has God given to direct us?", a: "The Word of God, which is contained in the Scriptures of the Old and New Testaments, is the only rule to direct us." },
    { q: "What do the Scriptures principally teach?", a: "The Scriptures principally teach what man is to believe concerning God, and what duty God requires of man." },
    { q: "What is God?", a: "God is a Spirit, infinite, eternal, and unchangeable, in his being, wisdom, power, holiness, justice, goodness, and truth." },
    { q: "Are there more gods than one?", a: "There is but one only, the living and true God." },
    { q: "How many persons are there in the Godhead?", a: "There are three persons in the Godhead: the Father, the Son, and the Holy Spirit; and these three are one God, the same in substance, equal in power and glory." },
    { q: "What are the decrees of God?", a: "The decrees of God are his eternal purpose, according to the counsel of his will, whereby, for his own glory, he hath foreordained whatsoever comes to pass." },
  ],
};

// One memory verse per subject (used across all kids, age-appropriate text)
export const MEMORY_VERSES: Record<string, MemoryVerse> = {
  math: {
    reference: "Psalm 147:4",
    text: "He counts the stars and calls them each by name.",
  },
  science: {
    reference: "Psalm 19:1",
    text: "The heavens declare the glory of God; the skies proclaim the work of his hands.",
  },
  grammar: {
    reference: "John 1:1",
    text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
  },
  writing: {
    reference: "John 1:1",
    text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
  },
  history: {
    reference: "Proverbs 21:1",
    text: "The king's heart is a stream of water in the hand of the LORD; he turns it wherever he will.",
  },
  bible: {
    reference: "2 Timothy 3:16",
    text: "All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.",
  },
  counting: {
    reference: "Psalm 147:4",
    text: "He counts the stars and calls them each by name.",
  },
  phonics: {
    reference: "John 1:1",
    text: "In the beginning was the Word, and the Word was with God.",
  },
  abc: {
    reference: "John 1:1",
    text: "In the beginning was the Word.",
  },
  numbers: {
    reference: "Psalm 147:4",
    text: "He counts the stars and calls them each by name.",
  },
  colors: {
    reference: "Genesis 1:31",
    text: "God saw all that he had made, and it was very good.",
  },
  shapes: {
    reference: "Genesis 1:31",
    text: "God saw all that he had made, and it was very good.",
  },
  literature: {
    reference: "Proverbs 4:7",
    text: "The beginning of wisdom is this: Get wisdom, and whatever you get, get insight.",
  },
  theology: {
    reference: "John 17:3",
    text: "And this is eternal life, that they know you, the only true God, and Jesus Christ whom you have sent.",
  },
  default: {
    reference: "Proverbs 1:7",
    text: "The fear of the LORD is the beginning of wisdom; fools despise wisdom and instruction.",
  },
};

// Theological hooks connecting each subject to faith (used in lesson engine system prompt context)
export const THEOLOGICAL_HOOKS: Record<string, string> = {
  math:
    "Numbers and mathematical order reflect God's perfect, consistent nature. God created a universe governed by precise laws, math is how we read His creation. 'He counts the stars and calls them each by name' (Psalm 147:4).",
  science:
    "We study creation to know the Creator better. Every living thing, every ecosystem, every force of nature declares God's wisdom and power. 'The heavens declare the glory of God' (Psalm 19:1).",
  grammar:
    "Language itself comes from God, 'In the beginning was the Word' (John 1:1). Learning to communicate clearly and precisely is an act of stewardship over the gift God gave us.",
  writing:
    "God is a communicating God, He spoke creation into being and gave us His Word. Learning to write well is training in the craft God uses to reach us.",
  history:
    "History is His story, God is sovereign over all nations and all times. Every empire that rose and fell did so under His providential hand. 'The king's heart is in the hand of the Lord' (Proverbs 21:1).",
  bible:
    "All Scripture is breathed out by God and is the foundation of all wisdom. We study the Bible not merely to learn facts, but to know the living God who wrote it.",
  counting:
    "God is a God of order, and numbers reflect that order. Counting is one of the first ways we learn to see patterns God built into creation.",
  phonics:
    "God gave us language as a gift. Learning to read and write opens up the greatest book ever written, the Word of God.",
  default:
    "The fear of the LORD is the beginning of wisdom. Everything we learn, math, words, science, is ultimately about knowing the God who made it all.",
};

// Classical trivium framing per subject
// Grammar stage: facts to memorize | Logic stage: reasons to understand
export const CLASSICAL_FRAMING: Record<string, { grammar: string; logic: string }> = {
  math: {
    grammar: "Memorize facts: times tables, number bonds, arithmetic rules. The goal is automatic recall, facts in the brain like letters of the alphabet.",
    logic: "Understand why: Why does multiplication work? How do fractions represent parts of a whole? Connect operations to real-world meaning.",
  },
  grammar: {
    grammar: "Memorize rules: parts of speech, sentence patterns, spelling rules, punctuation marks. Chant them, repeat them, own them.",
    logic: "Understand structure: Why do sentences have subjects and predicates? How does a comma change meaning? Analyze what you read.",
  },
  science: {
    grammar: "Learn vocabulary and facts: names of organs, stages of life cycles, classification categories. Build the mental map of creation.",
    logic: "Understand processes: Why does photosynthesis work? How do ecosystems maintain balance? Trace cause and effect in nature.",
  },
  history: {
    grammar: "Learn names, dates, places, and events: Who, what, when, where. Build the timeline. Know the facts before analyzing them.",
    logic: "Understand causes and effects: Why did civilizations rise and fall? How did geography shape history? See God's providence in events.",
  },
  bible: {
    grammar: "Learn the stories, people, books, and key verses. Know the narrative of Scripture from Genesis to Revelation.",
    logic: "Understand theology: What does this passage teach about God? About man? About salvation? How does the Old Testament point to Christ?",
  },
  default: {
    grammar: "Start with facts: memorize the vocabulary, names, and foundational information for this subject.",
    logic: "Move to understanding: ask why and how, connect ideas, explain your reasoning.",
  },
};

export function getCatechism(kidId: string): CatechismQA[] {
  return CATECHISM[kidId] ?? CATECHISM.titus;
}

export function getMemoryVerse(subject: string): MemoryVerse {
  return MEMORY_VERSES[subject] ?? MEMORY_VERSES.default;
}

export function getTheologicalHook(subject: string): string {
  return THEOLOGICAL_HOOKS[subject] ?? THEOLOGICAL_HOOKS.default;
}

// ─── LOIS BIBLE ───────────────────────────────────────────────────────────────

const LOIS_BIBLE: SubjectCurriculum = {
  subjectId: "bible",
  subjectLabel: "Bible",
  emoji: "📖",
  concept: "God loves you SO much! He made everything, the sun, animals, and YOU! Let's learn about God! 🌈",
  questions: [
    {
      id: "lb1",
      prompt: "Who made the sun ☀️ and the moon 🌙?",
      choices: ["God made them!", "A big bird 🐦", "A giant 🦕"],
      answer: "God made them!",
      hint: "In the Bible it says God made the light and the sky! Genesis 1!",
    },
    {
      id: "lb2",
      prompt: "Who loves Lois very much? ❤️",
      choices: ["A dragon 🐉", "God loves me!", "A robot 🤖"],
      answer: "God loves me!",
      hint: "John 3:16 says God loves the whole world, and that means YOU!",
    },
    {
      id: "lb3",
      prompt: "Who made all the animals? 🐶🐱🐘",
      choices: ["A farmer 👨‍🌾", "A factory", "God made them!"],
      answer: "God made them!",
      hint: "Genesis says God made every living creature, every dog, cat, and elephant!",
    },
    {
      id: "lb4",
      prompt: "What do we do to talk to God? 🙏",
      choices: ["We pray!", "We shout 📢", "We sleep 😴"],
      answer: "We pray!",
      hint: "Prayer is how we talk to God, He always listens!",
    },
    {
      id: "lb5",
      prompt: "Who is God's Son? 👑",
      choices: ["Moses", "Jesus!", "Noah 🚢"],
      answer: "Jesus!",
      hint: "Jesus is God's Son who came to earth to love us and save us!",
    },
    {
      id: "lb6",
      prompt: "God saw all He made and said it was... ?",
      choices: ["Scary 😱", "Very Good! ✅", "Boring 😐"],
      answer: "Very Good! ✅",
      hint: "Genesis 1:31, God looked at everything He made and said it was very good!",
    },
    {
      id: "lb7",
      prompt: "God put a 🌈 rainbow in the sky after what? 🌧️",
      choices: ["A big storm", "A big flood 🌊", "A big fire 🔥"],
      answer: "A big flood 🌊",
      hint: "Noah and the ark! After the flood, God sent a rainbow as a promise!",
    },
    {
      id: "lb8",
      prompt: "Who does God take care of every day? 🌟",
      choices: ["Only kings 👑", "Only adults", "Everyone! Me too! 😊"],
      answer: "Everyone! Me too! 😊",
      hint: "Psalm 23 says God is our shepherd, He takes care of ALL His people, even little ones!",
    },
  ],
};

// ─── TRUMA CURRICULUM (6th grade) ────────────────────────────────────────────

const TRUMA_PREALGEBRA: SubjectCurriculum = {
  subjectId: "prealgebra",
  subjectLabel: "Pre-Algebra",
  emoji: "📐",
  concept:
    "Pre-algebra is where arithmetic meets thinking in patterns. Variables like x just mean 'some unknown number we're solving for.' " +
    "A key idea: whatever you do to one side of an equation, do to the other. Balance is everything. " +
    "We'll also look at ratios, percentages, and the order of operations (PEMDAS: Parentheses, Exponents, Multiply, Divide, Add, Subtract).",
  questions: [
    {
      id: "tpa1",
      prompt: "Solve for x: x + 7 = 15",
      choices: ["x = 6", "x = 8", "x = 22", "x = 7"],
      answer: "x = 8",
      hint: "Subtract 7 from both sides: x = 15 − 7 = 8.",
    },
    {
      id: "tpa2",
      prompt: "Solve for x: 3x = 24",
      choices: ["x = 6", "x = 7", "x = 8", "x = 9"],
      answer: "x = 8",
      hint: "Divide both sides by 3: x = 24 ÷ 3 = 8.",
    },
    {
      id: "tpa3",
      prompt: "Evaluate: 2 + 3 × 4 (follow order of operations)",
      choices: ["20", "14", "10", "24"],
      answer: "14",
      hint: "PEMDAS: Multiply first, 3 × 4 = 12. Then add: 2 + 12 = 14.",
    },
    {
      id: "tpa4",
      prompt: "What is 40% of 80?",
      choices: ["24", "32", "36", "40"],
      answer: "32",
      hint: "40% = 0.40. Multiply: 0.40 × 80 = 32.",
    },
    {
      id: "tpa5",
      prompt: "If a:b = 3:5 and a = 12, what is b?",
      choices: ["15", "18", "20", "25"],
      answer: "20",
      hint: "If 3 parts = 12, then 1 part = 4. So 5 parts = 5 × 4 = 20.",
    },
    {
      id: "tpa6",
      prompt: "Simplify: 5x + 3x",
      choices: ["8x", "15x", "8x²", "53x"],
      answer: "8x",
      hint: "Like terms: 5x + 3x = (5+3)x = 8x. Think of x as apples, 5 apples + 3 apples.",
    },
    {
      id: "tpa7",
      prompt: "Solve: 2x − 4 = 10",
      choices: ["x = 5", "x = 6", "x = 7", "x = 3"],
      answer: "x = 7",
      hint: "Add 4 to both sides: 2x = 14. Divide by 2: x = 7.",
    },
    {
      id: "tpa8",
      prompt: "Evaluate: (6 + 2) × 3 − 4",
      choices: ["20", "24", "18", "22"],
      answer: "20",
      hint: "Parentheses first: (6+2) = 8. Then 8 × 3 = 24. Then 24 − 4 = 20.",
    },
  ],
};

const TRUMA_WRITING: SubjectCurriculum = {
  subjectId: "writing",
  subjectLabel: "Writing",
  emoji: "✍️",
  concept:
    "Good writing is clear thinking made visible. In classical education, you learn by imitation first: " +
    "study great sentences, then write like them. We'll focus on essay structure (thesis, body, conclusion), " +
    "the difference between showing and telling, and rhetorical devices like chiasmus, anaphora, and antithesis. " +
    "A strong writer argues clearly, supports with evidence, and speaks with a distinct voice.",
  questions: [
    {
      id: "tw1",
      prompt: "Which of these is a thesis statement (not just a topic)?",
      choices: [
        "The Civil War was a major event.",
        "The Civil War, caused by economic and moral divisions over slavery, fundamentally reshaped the nation.",
        "Abraham Lincoln was the president.",
        "Many people fought in the Civil War.",
      ],
      answer: "The Civil War, caused by economic and moral divisions over slavery, fundamentally reshaped the nation.",
      hint: "A thesis makes a specific, arguable CLAIM, not just a general statement of fact.",
    },
    {
      id: "tw2",
      prompt: "What is anaphora in writing?",
      choices: [
        "A type of paragraph break",
        "Repeating a word or phrase at the start of successive sentences for emphasis",
        "A figure of speech comparing two unlike things",
        "The conclusion of an essay",
      ],
      answer: "Repeating a word or phrase at the start of successive sentences for emphasis",
      hint: "Think of 'We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields...', Churchill used anaphora.",
    },
    {
      id: "tw3",
      prompt: "Show vs. tell: Which is 'showing'?",
      choices: [
        "She was very nervous.",
        "She had a great time.",
        "Her hands trembled as she gripped the podium, her voice barely above a whisper.",
        "It was a hard day.",
      ],
      answer: "Her hands trembled as she gripped the podium, her voice barely above a whisper.",
      hint: "Showing uses sensory details and actions to let the reader FEEL the emotion, not just name it.",
    },
    {
      id: "tw4",
      prompt: "What goes in the BODY paragraphs of a classical 5-paragraph essay?",
      choices: [
        "A hook and background",
        "Three supporting points with evidence and explanation",
        "A restatement of the thesis only",
        "Questions for the reader",
      ],
      answer: "Three supporting points with evidence and explanation",
      hint: "Each body paragraph has a topic sentence, supporting evidence, and analysis that connects back to the thesis.",
    },
    {
      id: "tw5",
      prompt: "Which word makes this sentence more precise? 'The dog walked across the yard.'",
      choices: [
        "The dog quickly moved across the yard.",
        "The old hound limped across the frost-covered yard.",
        "The dog went across the yard slowly.",
        "The dog did go across the yard.",
      ],
      answer: "The old hound limped across the frost-covered yard.",
      hint: "Specific nouns (hound) and vivid verbs (limped) with concrete details (frost-covered) are always stronger than vague modifiers.",
    },
    {
      id: "tw6",
      prompt: "What is chiasmus?",
      choices: [
        "A three-part list for emphasis",
        "A reversal of grammatical structure in successive phrases",
        "A comparison using 'like' or 'as'",
        "Starting sentences with the same word",
      ],
      answer: "A reversal of grammatical structure in successive phrases",
      hint: "JFK: 'Ask not what your country can do for you, ask what you can do for your country.' The structure flips.",
    },
    {
      id: "tw7",
      prompt: "In the writing process, what comes BEFORE drafting?",
      choices: ["Editing", "Publishing", "Prewriting and outlining", "Peer review"],
      answer: "Prewriting and outlining",
      hint: "Good writers plan before they write, brainstorm, research, then outline the structure before drafting.",
    },
    {
      id: "tw8",
      prompt: "Which transition word signals a counterargument?",
      choices: ["Furthermore", "In addition", "Admittedly", "Therefore"],
      answer: "Admittedly",
      hint: "'Admittedly' introduces a concession, acknowledging the other side before refuting it. Strong arguers address opposing views.",
    },
  ],
};

const TRUMA_SCIENCE_6: SubjectCurriculum = {
  subjectId: "science",
  subjectLabel: "Science",
  emoji: "🔬",
  concept:
    "We study creation to know the Creator better. 6th-grade science covers cells (the building blocks of life), " +
    "ecosystems and food webs, earth science (rock cycle, water cycle, layers of the earth), and physical science basics. " +
    "Key idea: everything we discover in science reflects the order, precision, and beauty of God's design.",
  questions: [
    {
      id: "ts61",
      prompt: "Which organelle is called the 'powerhouse of the cell'?",
      choices: ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"],
      answer: "Mitochondria",
      hint: "Mitochondria produce ATP (energy) through cellular respiration, without them, cells couldn't function.",
    },
    {
      id: "ts62",
      prompt: "What is the process plants use to convert light into food?",
      choices: ["Respiration", "Photosynthesis", "Fermentation", "Transpiration"],
      answer: "Photosynthesis",
      hint: "Photo = light, synthesis = making. Plants use sunlight + CO₂ + water to make glucose (sugar).",
    },
    {
      id: "ts63",
      prompt: "Which type of rock forms from cooled magma or lava?",
      choices: ["Sedimentary", "Metamorphic", "Igneous", "Limestone"],
      answer: "Igneous",
      hint: "Igneous comes from the Latin word for fire (ignis). Basalt and granite are igneous rocks.",
    },
    {
      id: "ts64",
      prompt: "In a food chain, what is a primary consumer?",
      choices: [
        "An organism that makes its own food",
        "An animal that eats only plants",
        "A decomposer",
        "A top predator",
      ],
      answer: "An animal that eats only plants",
      hint: "Primary consumers = herbivores. They eat producers (plants). Secondary consumers eat primary consumers.",
    },
    {
      id: "ts65",
      prompt: "What drives the water cycle?",
      choices: ["Gravity alone", "The moon's gravity", "Solar energy and gravity", "Wind only"],
      answer: "Solar energy and gravity",
      hint: "The sun evaporates water → it rises and condenses into clouds → gravity pulls it back as precipitation.",
    },
    {
      id: "ts66",
      prompt: "What is the thickest layer of the Earth?",
      choices: ["Crust", "Outer core", "Inner core", "Mantle"],
      answer: "Mantle",
      hint: "The mantle is about 2,900 km thick, far thicker than the crust (5–70 km) or the cores.",
    },
    {
      id: "ts67",
      prompt: "What is the difference between a cell membrane and a cell wall?",
      choices: [
        "Cell walls are only in animal cells",
        "Cell membranes are rigid; cell walls are flexible",
        "Cell walls (plant/bacteria) are rigid; membranes (all cells) are flexible",
        "They are identical structures",
      ],
      answer: "Cell walls (plant/bacteria) are rigid; membranes (all cells) are flexible",
      hint: "All cells have a membrane. Only plant cells, fungi, and bacteria have rigid cell walls for extra support.",
    },
    {
      id: "ts68",
      prompt: "What causes the seasons on Earth?",
      choices: [
        "Earth's distance from the sun",
        "Earth's axial tilt as it orbits the sun",
        "The moon's phases",
        "Sunspot activity",
      ],
      answer: "Earth's axial tilt as it orbits the sun",
      hint: "Earth is tilted at 23.5°. When your hemisphere tilts toward the sun, it's summer; away = winter.",
    },
  ],
};

const TRUMA_HISTORY_6: SubjectCurriculum = {
  subjectId: "history",
  subjectLabel: "History",
  emoji: "🏛️",
  concept:
    "History is His story, God is sovereign over nations and times. We study ancient civilizations in 6th grade: " +
    "Mesopotamia (the world's first civilization), Egypt (the Nile, pharaohs, and exodus), Greece (democracy, philosophy, Olympics), " +
    "and Rome (republic, empire, and the spread of Christianity). Key question always: How does God's providence show in these events?",
  questions: [
    {
      id: "th61",
      prompt: "Which two rivers gave Mesopotamia its name ('land between the rivers')?",
      choices: ["Nile and Congo", "Tigris and Euphrates", "Indus and Ganges", "Amazon and Orinoco"],
      answer: "Tigris and Euphrates",
      hint: "Mesopotamia (Greek: 'between rivers') was in modern Iraq. The Tigris and Euphrates enabled the world's first farming civilizations.",
    },
    {
      id: "th62",
      prompt: "What was the world's first known writing system?",
      choices: ["Hieroglyphics", "Latin alphabet", "Cuneiform", "Chinese characters"],
      answer: "Cuneiform",
      hint: "Sumerians (Mesopotamia) invented cuneiform, wedge-shaped marks pressed into clay tablets, around 3100 BC.",
    },
    {
      id: "th63",
      prompt: "What was the main purpose of the Egyptian pyramids?",
      choices: ["Food storage", "Tombs for pharaohs", "Fortresses against invaders", "Temples for worship"],
      answer: "Tombs for pharaohs",
      hint: "Egyptians believed in an afterlife. The pyramids preserved the pharaoh's body and treasures for the next life.",
    },
    {
      id: "th64",
      prompt: "Athens is credited with inventing which form of government?",
      choices: ["Monarchy", "Oligarchy", "Democracy", "Theocracy"],
      answer: "Democracy",
      hint: "Athens under Cleisthenes (~500 BC) created the first direct democracy, citizens voted on laws themselves.",
    },
    {
      id: "th65",
      prompt: "The Roman Republic became an Empire under which ruler?",
      choices: ["Julius Caesar", "Augustus Caesar", "Nero", "Cicero"],
      answer: "Augustus Caesar",
      hint: "Julius Caesar was assassinated. His adopted son Octavian won the civil war and became Augustus, the first emperor, in 27 BC.",
    },
    {
      id: "th66",
      prompt: "Which Greek philosopher was Aristotle's teacher?",
      choices: ["Socrates", "Plato", "Homer", "Euclid"],
      answer: "Plato",
      hint: "The trio: Socrates taught Plato, Plato taught Aristotle, Aristotle taught Alexander the Great.",
    },
    {
      id: "th67",
      prompt: "What language was most commonly spoken in the Roman Empire at the time of Christ?",
      choices: ["Latin only", "Hebrew", "Greek (Koine)", "Aramaic only"],
      answer: "Greek (Koine)",
      hint: "Alexander the Great spread Greek (Koine = 'common') across the ancient world. This is why the New Testament was written in Greek.",
    },
    {
      id: "th68",
      prompt: "What event in 476 AD is traditionally used to mark the fall of the Western Roman Empire?",
      choices: [
        "Julius Caesar's assassination",
        "The sack of Rome by the Visigoths",
        "The deposition of the last Roman emperor by Odoacer",
        "Constantine's conversion to Christianity",
      ],
      answer: "The deposition of the last Roman emperor by Odoacer",
      hint: "In 476 AD, the Germanic chieftain Odoacer deposed Romulus Augustulus, the last Western Roman emperor.",
    },
  ],
};

const TRUMA_BIBLE_6: SubjectCurriculum = {
  subjectId: "bible",
  subjectLabel: "Bible",
  emoji: "✝️",
  concept:
    "The Five Solas are the heart of the Reformation, what the church recovered in the 1500s: " +
    "Scripture Alone (Sola Scriptura), Faith Alone (Sola Fide), Grace Alone (Sola Gratia), " +
    "Christ Alone (Solus Christus), Glory to God Alone (Soli Deo Gloria). " +
    "We'll also study the Westminster Shorter Catechism, key doctrines, and how the Old and New Testament connect.",
  questions: [
    {
      id: "tb61",
      prompt: "What does 'Sola Scriptura' mean?",
      choices: [
        "Scripture and tradition are equal authorities",
        "Scripture alone is the final authority for faith and practice",
        "Only the Pope can interpret Scripture",
        "The church decides what Scripture means",
      ],
      answer: "Scripture alone is the final authority for faith and practice",
      hint: "Reformers like Luther argued that no church tradition or pope has authority ABOVE the Bible itself.",
    },
    {
      id: "tb62",
      prompt: "Which Reformer famously nailed 95 Theses to the Wittenberg church door in 1517?",
      choices: ["John Calvin", "Ulrich Zwingli", "Martin Luther", "William Tyndale"],
      answer: "Martin Luther",
      hint: "Luther's 95 Theses challenged the sale of indulgences and sparked the Protestant Reformation.",
    },
    {
      id: "tb63",
      prompt: "What does 'justification by faith alone' (Sola Fide) mean?",
      choices: [
        "We earn salvation through good works",
        "We are declared righteous before God through faith in Christ, not by our works",
        "Baptism is required for salvation",
        "Salvation depends on faith plus sacraments",
      ],
      answer: "We are declared righteous before God through faith in Christ, not by our works",
      hint: "Ephesians 2:8-9, 'For by grace you have been saved through faith... not a result of works.'",
    },
    {
      id: "tb64",
      prompt: "What is the Westminster Shorter Catechism's answer to Q1: 'What is the chief end of man?'",
      choices: [
        "To be good and kind to others",
        "To know the Bible well",
        "To glorify God, and to enjoy Him forever",
        "To obey the church's teaching",
      ],
      answer: "To glorify God, and to enjoy Him forever",
      hint: "This is the foundation of all Christian learning, everything we do should be to glorify God.",
    },
    {
      id: "tb65",
      prompt: "How does the Old Testament primarily point to Christ?",
      choices: [
        "It doesn't, the two Testaments are unrelated",
        "Through prophecy, types (foreshadows), and the sacrificial system",
        "Only through the Ten Commandments",
        "Through the Psalms alone",
      ],
      answer: "Through prophecy, types (foreshadows), and the sacrificial system",
      hint: "The OT sacrificial system foreshadowed Christ's atoning sacrifice. Jesus said 'all the Scriptures speak of me' (Luke 24:27).",
    },
    {
      id: "tb66",
      prompt: "What is the doctrine of the Trinity?",
      choices: [
        "God is three separate gods",
        "God changes over time into different persons",
        "One God in three co-equal persons: Father, Son, and Holy Spirit",
        "Jesus and the Holy Spirit are lesser beings",
      ],
      answer: "One God in three co-equal persons: Father, Son, and Holy Spirit",
      hint: "The Nicene Creed (325 AD) established: three persons, one substance (essence). Not three gods, not one person with three modes.",
    },
    {
      id: "tb67",
      prompt: "What is 'Soli Deo Gloria'?",
      choices: [
        "The glory belongs to the saints",
        "To God alone be the glory",
        "Glory comes through righteous living",
        "Man shares in God's glory through baptism",
      ],
      answer: "To God alone be the glory",
      hint: "Bach wrote 'SDG' (Soli Deo Gloria) on all his compositions. All praise, honor, and glory belong to God alone.",
    },
    {
      id: "tb68",
      prompt: "What is general revelation vs. special revelation?",
      choices: [
        "General = Scripture; Special = church tradition",
        "General = God revealed through creation/conscience; Special = God revealed through Scripture and Christ",
        "General = popular beliefs; Special = secret teachings",
        "They are the same thing",
      ],
      answer: "General = God revealed through creation/conscience; Special = God revealed through Scripture and Christ",
      hint: "Psalm 19:1 shows general revelation (nature). 2 Tim 3:16 shows special revelation (Scripture). Both come from God.",
    },
  ],
};

// ─── TRUMA: LITERATURE (Classical, 6th grade) ────────────────────────────────

const TRUMA_LITERATURE_6: SubjectCurriculum = {
  subjectId: "literature",
  subjectLabel: "Literature",
  emoji: "📜",
  concept:
    "Classical literature is the foundation of Western thought. We begin with Homer's epics (Iliad, Odyssey), " +
    "move through Aesop's moral philosophy and Greek drama, then encounter Plutarch's Lives, biography as moral " +
    "formation. Shakespeare introduces elevated English rhetoric. We also study the great Christian literary tradition: " +
    "John Bunyan's Pilgrim's Progress (written in Bedford prison, 1678), the greatest English allegory, by a Particular " +
    "Baptist whose theology mirrors the 1689 LBCF. C.S. Lewis and J.R.R. Tolkien, two Oxford Christians who showed " +
    "that imagination serves theology. Lewis's Chronicles of Narnia and Tolkien's Lord of the Rings are works of deep " +
    "Christian sub-creation, not merely fantasy. " +
    "The goal is not information but formation: great literature shapes how we think, feel, and argue. " +
    "Key question always: What is this author teaching about virtue, justice, courage, and the good life?",
  questions: [
    {
      id: "tlit1",
      prompt: "Homer's Iliad centers on one emotion in Achilles that drives the entire plot. What is it?",
      choices: ["Fear", "Grief", "Wrath / Rage", "Pride"],
      answer: "Wrath / Rage",
      hint: "The very first word of the Iliad in Greek is 'menis', wrath. Achilles's rage at being dishonored by Agamemnon sets everything in motion.",
    },
    {
      id: "tlit2",
      prompt: "What is the 'kleos' that Greek heroes like Achilles and Hector seek in Homer's epics?",
      choices: ["Treasure and gold", "Glory / eternal fame won through heroic deeds", "The favor of the gods", "Long life and family"],
      answer: "Glory / eternal fame won through heroic deeds",
      hint: "Kleos (glory) is the Greek hero's ultimate goal, to be remembered forever through stories like the Iliad. Achilles chooses short glorious life over long obscure life.",
    },
    {
      id: "tlit3",
      prompt: "In Homer's Odyssey, what quality does Odysseus possess above all others that gets him home?",
      choices: ["Strength like Achilles", "Speed and athleticism", "Craftiness, cunning, and resourcefulness", "Favor of all the gods"],
      answer: "Craftiness, cunning, and resourcefulness",
      hint: "Odysseus's epithet in Homer is 'polytropos', 'man of many ways/turns.' He outsmarts the Cyclops, the Sirens, Scylla, always by his wits.",
    },
    {
      id: "tlit4",
      prompt: "The Trojan War is said to have started because of a judgment made by Paris. What was he judging?",
      choices: ["Which city was most powerful", "Which goddess (Hera, Athena, or Aphrodite) was most beautiful", "Who should be king of Troy", "Which army should fight first"],
      answer: "Which goddess (Hera, Athena, or Aphrodite) was most beautiful",
      hint: "The 'Judgment of Paris', he chose Aphrodite, who offered him Helen of Sparta. That choice launched the Trojan War.",
    },
    {
      id: "tlit5",
      prompt: "Plutarch's Lives pairs Greek and Roman figures together. What is his primary purpose in doing so?",
      choices: ["To compare military tactics", "To show which civilization was superior", "Moral instruction, to model virtue and vice through real historical lives", "To write accurate history"],
      answer: "Moral instruction, to model virtue and vice through real historical lives",
      hint: "Plutarch says his purpose is to provide 'mirrors' of virtue for his readers. He pairs a Greek with a Roman and draws moral lessons from each. Biography as formation.",
    },
    {
      id: "tlit6",
      prompt: "In Greek tragedy, what is 'hubris' and why does it destroy heroes?",
      choices: [
        "Excessive bravery, heroes fight too hard",
        "Excessive pride, thinking oneself above human limits or the gods, which provokes divine punishment",
        "Cowardice in battle",
        "Bad luck sent by fate",
      ],
      answer: "Excessive pride, thinking oneself above human limits or the gods, which provokes divine punishment",
      hint: "Hubris (Greek: 'outrage against the gods') is the fatal flaw of many tragic heroes. Oedipus, Agamemnon, Ajax, all fall because they forget their human limits.",
    },
    {
      id: "tlit7",
      prompt: "What is the central moral lesson of 'The Grasshopper and the Ant' in Aesop?",
      choices: [
        "Work is more important than play always",
        "Hard work now produces provision later; idleness leads to ruin",
        "Grasshoppers and ants can't be friends",
        "Summer is better than winter",
      ],
      answer: "Hard work now produces provision later; idleness leads to ruin",
      hint: "This is applied wisdom (what the Greeks called 'phronesis'), practical intelligence about how to live. Proverbs 6:6-8 says the same thing.",
    },
    {
      id: "tlit8",
      prompt: "Shakespeare's plays are organized into three categories. Name them.",
      choices: [
        "Epic, lyric, and dramatic",
        "Comedies, tragedies, and histories",
        "Love stories, war stories, and comedies",
        "Greek, Roman, and English plays",
      ],
      answer: "Comedies, tragedies, and histories",
      hint: "Shakespeare's First Folio (1623) organized his 37 plays as comedies (end in marriage), tragedies (end in death), and histories (English kings).",
    },
    {
      id: "tlit9",
      prompt: "John Bunyan wrote Pilgrim's Progress while imprisoned for preaching without a license. What does this tell us about his theology and convictions?",
      choices: [
        "He was a reckless person who ignored the law",
        "He believed preaching the gospel was an obedience to God that exceeded the state's authority to silence, and he held that conviction at great personal cost",
        "He wrote the book to get out of prison sooner",
        "He was a minor figure in church history",
      ],
      answer: "He believed preaching the gospel was an obedience to God that exceeded the state's authority to silence, and he held that conviction at great personal cost",
      hint: "Bunyan spent 12 years in Bedford Gaol (1660-1672) rather than promise to stop preaching. He was a Particular Baptist, theologically close to the 1689 London Baptist Confession. Acts 5:29: 'We must obey God rather than men.' The same conviction that landed him in prison gave us one of the greatest books in the English language.",
    },
    {
      id: "tlit10",
      prompt: "In Pilgrim's Progress, Vanity Fair is a town where everything, titles, pleasures, kingdoms, lusts, is sold. Faithful is martyred there. What does Vanity Fair represent?",
      choices: [
        "A literal fairground that Bunyan visited",
        "The world system, distraction, compromise, and opposition to the gospel, which kills those who won't buy what it sells",
        "A warning against shopping",
        "The Roman Catholic Church specifically",
      ],
      answer: "The world system, distraction, compromise, and opposition to the gospel, which kills those who won't buy what it sells",
      hint: "Bunyan drew on Ecclesiastes ('vanity of vanities') and 1 John 2:15-17. Faithful refuses to buy anything at Vanity Fair, and is put on trial and executed. His death is modeled on the martyrdom of Stephen (Acts 7). Hopeful rises from the crowd at that moment. The world always offers to sell you what it cannot give and kills what it cannot corrupt.",
    },
    {
      id: "tlit11",
      prompt: "J.R.R. Tolkien coined the term 'eucatastrophe.' What does it mean, and what is the ultimate eucatastrophe in history?",
      choices: [
        "A tragedy with a surprise villain, the Fall of Mordor",
        "The sudden, joyful turn in a story that overturns disaster, and the ultimate example is the Resurrection of Christ",
        "Tolkien's word for the destruction of the One Ring",
        "A Greek tragedy ending with unexpected mercy",
      ],
      answer: "The sudden, joyful turn in a story that overturns disaster, and the ultimate example is the Resurrection of Christ",
      hint: "Tolkien wrote: 'The Birth of Christ is the eucatastrophe of Man's history. The Resurrection is the eucatastrophe of the story of the Incarnation.' All great stories shadow the Gospel's structure: things go wrong, then something wonderful overturns everything.",
    },
    {
      id: "tlit12",
      prompt: "Tolkien said he was a 'sub-creator' when he wrote The Lord of the Rings. What did he mean?",
      choices: [
        "He was writing below his talent level for children",
        "He was writing a sequel to someone else's story",
        "Human beings reflect the image of God by making stories and worlds, we create because our Creator created us",
        "He meant his stories were less important than Scripture",
      ],
      answer: "Human beings reflect the image of God by making stories and worlds, we create because our Creator created us",
      hint: "Tolkien argued in his essay 'On Fairy-Stories' that imagination is a gift from the Creator, we are 'sub-creators' made in His image. Writing Middle-earth was an act of worship. This connects to Genesis 1:1, the first thing Scripture tells us about God is that He creates.",
    },
    {
      id: "tlit13",
      prompt: "C.S. Lewis said Aslan in the Chronicles of Narnia was not an 'allegory' of Christ but a 'supposal.' What is the difference?",
      choices: [
        "No difference, allegory and supposal mean the same thing",
        "Allegory = Aslan secretly IS Jesus; Supposal = asking what Christ-like qualities might look like if Jesus came to a world like Narnia as a lion",
        "A supposal is less Christian than an allegory",
        "Lewis was wrong, Aslan is a straightforward allegory",
      ],
      answer: "Allegory = Aslan secretly IS Jesus; Supposal = asking what Christ-like qualities might look like if Jesus came to a world like Narnia as a lion",
      hint: "Lewis wrote: 'Suppose there were a world like Narnia and it needed redemption, what might the Son of God do there?' Aslan is not a code for Jesus, he is what Lewis imagined the Second Person of the Trinity might be like in that world. This is the difference between allegory and imaginative theological fiction.",
    },
  ],
};

// ─── TRUMA: THEOLOGY (Westminster Shorter Catechism + Reformed doctrine) ──────

const TRUMA_THEOLOGY: SubjectCurriculum = {
  subjectId: "theology",
  subjectLabel: "Theology",
  emoji: "🕊️",
  concept:
    "Theology is the queen of the sciences, the study of God and of all things in relation to God. " +
    "We use the Westminster Shorter Catechism (1647) as our framework: 107 Q&A that teach what Scripture " +
    "reveals about God, man, sin, salvation, law, and prayer. We also study the Five Solas of the Reformation " +
    "and the Doctrines of Grace (TULIP). The goal is not to memorize facts but to know the God behind each answer, " +
    "and to be able to defend these truths with Scripture and reason.",
  questions: [
    {
      id: "tth1",
      prompt: "Question 1 of the Westminster Shorter Catechism: 'What is the chief end of man?'",
      choices: [
        "To be happy and comfortable",
        "To obey God's laws perfectly",
        "To glorify God, and to enjoy him forever",
        "To serve our families and communities",
      ],
      answer: "To glorify God, and to enjoy him forever",
      hint: "This is the foundation of all theology. Everything else answers: How do we glorify Him? How do we enjoy Him? John Piper's 'God is most glorified when we are most satisfied in Him' is an application of this.",
    },
    {
      id: "tth2",
      prompt: "What does 'Sola Scriptura' (one of the Five Solas) mean?",
      choices: [
        "Scripture is one of many equal authorities",
        "Scripture alone is the supreme, final authority for Christian faith and practice",
        "Only scholars can interpret Scripture",
        "Scripture and tradition are equal authorities",
      ],
      answer: "Scripture alone is the supreme, final authority for Christian faith and practice",
      hint: "This was Luther's battle cry at the Reformation. The Roman Church added tradition as equal to Scripture. Luther said: Scripture ALONE, 'Sola Scriptura.'",
    },
    {
      id: "tth3",
      prompt: "What does TULIP stand for in Reformed theology (Doctrines of Grace)?",
      choices: [
        "Total Grace, Unconditional Love, Limited Sin, Irresistible Faith, Perseverance of Man",
        "Total Depravity, Unconditional Election, Limited Atonement, Irresistible Grace, Perseverance of the Saints",
        "True Religion, Universal Salvation, Love, Incarnation, Prayer",
        "Total Faith, Unlimited Grace, Lordship, Inspiration, Providence",
      ],
      answer: "Total Depravity, Unconditional Election, Limited Atonement, Irresistible Grace, Perseverance of the Saints",
      hint: "TULIP summarizes the Canons of Dort (1618-1619). Each letter maps to a key doctrine about human sinfulness and God's sovereign grace in salvation.",
    },
    {
      id: "tth4",
      prompt: "The Westminster Catechism Q4 asks: 'What is God?' What is the answer?",
      choices: [
        "God is the universe and everything in it",
        "God is our heavenly Father who loves everyone",
        "God is a Spirit, infinite, eternal, and unchangeable, in his being, wisdom, power, holiness, justice, goodness, and truth",
        "God is unknowable, we cannot define him",
      ],
      answer: "God is a Spirit, infinite, eternal, and unchangeable, in his being, wisdom, power, holiness, justice, goodness, and truth",
      hint: "This is the most comprehensive single sentence about God's nature in the Reformed tradition. Notice: infinite (no limits), eternal (no time), unchangeable (immutable). Contrast with how false gods are depicted.",
    },
    {
      id: "tth5",
      prompt: "What does 'Total Depravity' mean? Which of these best expresses it?",
      choices: [
        "Every person is as evil as they could possibly be",
        "Sin has corrupted every part of human nature, mind, will, affections, so that without grace we cannot seek God",
        "Only our actions are sinful, not our nature",
        "We are totally depraved only after we actually commit sins",
      ],
      answer: "Sin has corrupted every part of human nature, mind, will, affections, so that without grace we cannot seek God",
      hint: "Total = the extent (all of us), not the degree (as bad as possible). Romans 3:10-11: 'None is righteous... no one seeks God.' This is why God must initiate salvation.",
    },
    {
      id: "tth6",
      prompt: "What is 'Unconditional Election' in Reformed theology?",
      choices: [
        "God chose us because He foresaw we would choose Him",
        "God chose the elect based solely on His sovereign will and grace, not on anything in us",
        "We can elect ourselves into salvation by sincerely choosing God",
        "Election means God treats everyone equally",
      ],
      answer: "God chose the elect based solely on His sovereign will and grace, not on anything in us",
      hint: "Ephesians 1:4-5, 'He chose us in him before the foundation of the world.' Romans 9:11, not 'because of works but because of him who calls.' Grace is free, not earned.",
    },
    {
      id: "tth7",
      prompt: "What is 'justification by faith alone' (Sola Fide)?",
      choices: [
        "We are made righteous gradually through obedience",
        "God declares the sinner righteous because of Christ's righteousness, received through faith alone, not works",
        "Faith plus baptism plus good works together justify us",
        "Justification means God ignores our sin",
      ],
      answer: "God declares the sinner righteous because of Christ's righteousness, received through faith alone, not works",
      hint: "Romans 4:5, 'To the one who does not work but believes in him who justifies the ungodly, his faith is counted as righteousness.' This is forensic, legal declaration, not inner change.",
    },
    {
      id: "tth8",
      prompt: "What does the 1689 London Baptist Confession say about God's decree (Chapter 3)?",
      choices: [
        "God reacts to human decisions and adjusts His plans accordingly",
        "God's decree is His eternal purpose, according to the counsel of His will, whereby He has foreordained whatever comes to pass",
        "God decrees only good things but not sinful events",
        "God's decree only covers salvation, not history",
      ],
      answer: "God's decree is His eternal purpose, according to the counsel of His will, whereby He has foreordained whatever comes to pass",
      hint: "Ephesians 1:11, 'According to the purpose of him who works all things according to the counsel of his will.' This includes history, nations, your life, and salvation.",
    },
  ],
};

const TRUMA_LOGIC: SubjectCurriculum = {
  subjectId: "logic",
  subjectLabel: "Logic",
  emoji: "🧠",
  concept:
    "Logic is the art of thinking God's thoughts after Him. God is not the author of confusion but of order (1 Corinthians 14:33), so His truth holds together without contradiction. We are commanded to love the Lord with all our MIND (Matthew 22:37), to test everything and hold fast what is good (1 Thessalonians 5:21), and always to be ready to give a reason for our hope (1 Peter 3:15). A sound argument has true premises and a conclusion that truly follows. Learn to spot a valid argument from a fallacy, and you will guard both your studies and your doctrine.",
  questions: [
    {
      id: "truma-logic-1",
      prompt: "All Scripture is God-breathed. Second Timothy is Scripture. Therefore…",
      choices: ["Second Timothy is God-breathed", "Second Timothy is unreliable", "We cannot know", "Paul must have written it alone"],
      answer: "Second Timothy is God-breathed",
      hint: "This is a valid syllogism: all A are B; C is an A; therefore C is B. The conclusion follows necessarily from true premises (2 Timothy 3:16).",
    },
    {
      id: "truma-logic-2",
      prompt: "'If a teaching contradicts Scripture, it is false. This teaching contradicts Scripture.' What follows?",
      choices: ["The teaching is false", "The teaching is true", "Scripture is mistaken", "Nothing follows"],
      answer: "The teaching is false",
      hint: "This is modus ponens: if P then Q; P; therefore Q. Because the premise is affirmed, the conclusion is certain.",
    },
    {
      id: "truma-logic-3",
      prompt: "'If the Bible were merely a human book, it would be full of errors. It is not full of errors.' What follows?",
      choices: ["It is not merely a human book", "It is merely a human book", "It must have errors", "Nothing follows"],
      answer: "It is not merely a human book",
      hint: "This is modus tollens: if P then Q; not-Q; therefore not-P. Denying the consequent lets you deny the antecedent.",
    },
    {
      id: "truma-logic-4",
      prompt: "In the argument 'Since God is holy, His people must be holy,' which part is the conclusion?",
      choices: ["His people must be holy", "God is holy", "Both are conclusions", "There is no conclusion"],
      answer: "His people must be holy",
      hint: "The premise ('God is holy') supports the conclusion. The word 'since' marks the premise; what it leads to is the conclusion (1 Peter 1:16).",
    },
    {
      id: "truma-logic-5",
      prompt: "'You can't trust her argument about grace, because she's only in sixth grade.' What fallacy is this?",
      choices: ["Ad hominem, attacking the person, not the argument", "A valid syllogism", "Appeal to Scripture", "Modus ponens"],
      answer: "Ad hominem, attacking the person, not the argument",
      hint: "An ad hominem ignores the argument and attacks the arguer. A claim stands or falls on its reasons, not on who says it.",
    },
    {
      id: "truma-logic-6",
      prompt: "You argue for the doctrines of grace, and someone replies, 'So you think we can just sin all we want?' What has he done?",
      choices: ["Built a straw man, misrepresenting your view", "Given a sound rebuttal", "Stated a valid syllogism", "Defined his terms"],
      answer: "Built a straw man, misrepresenting your view",
      hint: "A straw man swaps your real position for a weaker, false one and attacks that. Paul answers this very distortion in Romans 6:1-2.",
    },
    {
      id: "truma-logic-7",
      prompt: "'Either you fully comprehend the Trinity, or you must reject it.' What is wrong with this?",
      choices: ["It's a false dilemma, there are more than two options", "It is perfectly valid", "It is a syllogism", "Nothing is wrong"],
      answer: "It's a false dilemma, there are more than two options",
      hint: "A false dilemma offers only two choices when more exist. We can humbly believe what God reveals without comprehending all of it (Deuteronomy 29:29).",
    },
    {
      id: "truma-logic-8",
      prompt: "'I met one rude person from that city, so everyone there must be rude.' What fallacy is this?",
      choices: ["Hasty generalization", "Modus tollens", "A valid deduction", "A definition"],
      answer: "Hasty generalization",
      hint: "A hasty generalization draws a sweeping conclusion from too little evidence. One example cannot prove a claim about everyone.",
    },
    {
      id: "truma-logic-9",
      prompt: "'He is honest because he says so, and we know he's telling the truth because he is honest.' What is this shape of reasoning?",
      choices: ["Circular reasoning", "A valid proof", "Induction", "Modus ponens"],
      answer: "Circular reasoning",
      hint: "Circular reasoning assumes the very thing it's trying to prove; the conclusion just restates the premise, so it proves nothing.",
    },
    {
      id: "truma-logic-10",
      prompt: "Reasoning from a general truth to a certain conclusion ('All men are mortal; Socrates is a man; so Socrates is mortal') is called…",
      choices: ["Deduction", "Induction", "A fallacy", "An opinion"],
      answer: "Deduction",
      hint: "Deduction moves from general premises to a conclusion that MUST follow. Induction, by contrast, reasons from particular cases to a likely general rule.",
    },
    {
      id: "truma-logic-11",
      prompt: "You get a hard problem wrong. What is the wisest next step?",
      choices: ["Study WHY it was wrong and repair your understanding", "Skip it and move on quickly", "Decide you're just bad at it", "Blame the question"],
      answer: "Study WHY it was wrong and repair your understanding",
      hint: "'A righteous man falls seven times and rises again' (Proverbs 24:16). A mistake you understand becomes knowledge you keep.",
    },
    {
      id: "truma-logic-12",
      prompt: "Before a big test, what does a wise learner do FIRST?",
      choices: ["Find the topics she doesn't yet understand and work there", "Only review what she already knows well", "Guess at what might be asked", "Wait and hope for the best"],
      answer: "Find the topics she doesn't yet understand and work there",
      hint: "Knowing what you do NOT yet know is half of learning. Aim your effort at the gaps, not the parts already mastered.",
    },
  ],
};

export const TRUMA_CURRICULUM: Record<string, SubjectCurriculum> = {
  ...TRUMA_TRACKS,
  logic: TRUMA_LOGIC,
  prealgebra: TRUMA_PREALGEBRA,
  writing: TRUMA_WRITING,
  science: TRUMA_SCIENCE_6,
  history: TRUMA_HISTORY_6,
  bible: TRUMA_BIBLE_6,
  literature: TRUMA_LITERATURE_6,
  theology: TRUMA_THEOLOGY,
  grammar: {
    subjectId: "grammar",
    subjectLabel: "Grammar",
    emoji: "📝",
    concept:
      "Classical grammar means mastering the tools of language with precision. We'll cover sentence types, " +
      "clauses (independent vs. dependent), verbals (gerunds, participles, infinitives), and rhetorical devices. " +
      "Latin roots help you decode unfamiliar vocabulary instantly.",
    questions: [
      {
        id: "tg61",
        prompt: "What is a gerund?",
        choices: [
          "A verb describing action",
          "A verb used as a noun (ends in -ing)",
          "An adverb modifying a verb",
          "A conjunction joining clauses",
        ],
        answer: "A verb used as a noun (ends in -ing)",
        hint: "'Swimming is fun.', 'Swimming' is a gerund (a verb acting as the subject/noun).",
      },
      {
        id: "tg62",
        prompt: "Identify the clause type: 'Although she studied hard'",
        choices: ["Independent clause", "Dependent (subordinate) clause", "Simple sentence", "Compound predicate"],
        answer: "Dependent (subordinate) clause",
        hint: "'Although' is a subordinating conjunction, it can't stand alone. It needs an independent clause to complete it.",
      },
      {
        id: "tg63",
        prompt: "Which sentence uses the subjunctive mood correctly?",
        choices: [
          "I wish I was taller.",
          "I wish I were taller.",
          "I wish I am taller.",
          "I wish I be taller.",
        ],
        answer: "I wish I were taller.",
        hint: "The subjunctive mood is used for wishes, hypotheticals, and conditions contrary to fact. 'Were' (not 'was') is correct after 'wish'.",
      },
      {
        id: "tg64",
        prompt: "What does the Latin root 'scrib/script' mean?",
        choices: ["To see", "To write", "To speak", "To carry"],
        answer: "To write",
        hint: "Scribble, scripture, prescription, manuscript, all involve writing! 'Manus' = hand, so manuscript = written by hand.",
      },
      {
        id: "tg65",
        prompt: "Which sentence is in the ACTIVE voice?",
        choices: [
          "The essay was written by the student.",
          "The student wrote the essay.",
          "The essay had been completed.",
          "It was decided that the essay would be written.",
        ],
        answer: "The student wrote the essay.",
        hint: "Active voice: subject DOES the action. Passive voice: subject RECEIVES the action. Active is usually stronger.",
      },
    ],
  },
};

// ─── TITUS: THEOLOGY (3rd grade, Catechism for Boys & Girls, Doctrines of Grace) ──

const TITUS_THEOLOGY: SubjectCurriculum = {
  subjectId: "theology",
  subjectLabel: "Theology",
  emoji: "🕊️",
  concept:
    "Theology means studying who God is and what He has done! We use a catechism, " +
    "that's a list of questions and answers that teach us the most important things " +
    "about God, sin, and how Jesus saves us. God made you to know Him, love Him, and " +
    "enjoy Him forever. Let's see how well you know the big truths of the Bible!",
  questions: [
    {
      id: "tith1",
      prompt: "Who made you?",
      choices: ["My parents", "God made me", "I just happened", "The earth made me"],
      answer: "God made me",
      hint: "Genesis 1:27, 'So God created man in his own image.' You are made by God, on purpose, for a purpose!",
    },
    {
      id: "tith2",
      prompt: "What else did God make?",
      choices: [
        "Only the sky and stars",
        "Only animals and plants",
        "God made all things out of nothing, for His own glory",
        "God made some things but not others",
      ],
      answer: "God made all things out of nothing, for His own glory",
      hint: "Genesis 1:1, 'In the beginning, God created the heavens and the earth.' Everything came from nothing, God spoke and it was!",
    },
    {
      id: "tith3",
      prompt: "Who is God?",
      choices: [
        "God is a very powerful person like us",
        "God is a Spirit, infinite, eternal, and unchangeable",
        "God is the sky and the stars",
        "God is a feeling in our hearts",
      ],
      answer: "God is a Spirit, infinite, eternal, and unchangeable",
      hint: "John 4:24, 'God is spirit.' He has no body, no beginning, and He never changes. He is completely different from anything He made.",
    },
    {
      id: "tith4",
      prompt: "Are there more Gods than one?",
      choices: [
        "Yes, many gods rule different things",
        "Maybe, we can't be sure",
        "There is but one only, the living and true God",
        "Every family can choose their own god",
      ],
      answer: "There is but one only, the living and true God",
      hint: "Deuteronomy 6:4, 'Hear, O Israel: The LORD our God, the LORD is one.' There is only one real God, all other so-called 'gods' are fake.",
    },
    {
      id: "tith5",
      prompt: "What is sin?",
      choices: [
        "Only really bad things like hurting people",
        "Mistakes we make by accident",
        "Disobeying God's commands in thought, word, or deed",
        "Things our parents get upset about",
      ],
      answer: "Disobeying God's commands in thought, word, or deed",
      hint: "1 John 3:4, 'Sin is lawlessness.' Even wrong thoughts are sin! That's why we need Jesus, we can't be perfect on our own.",
    },
    {
      id: "tith6",
      prompt: "What did Jesus do to save us from our sins?",
      choices: [
        "He taught us good rules to follow",
        "He prayed for us from heaven",
        "He lived a perfect life and died in our place, then rose from the dead",
        "He showed us how to be good enough",
      ],
      answer: "He lived a perfect life and died in our place, then rose from the dead",
      hint: "Romans 5:8, 'While we were still sinners, Christ died for us.' He took the punishment we deserved!",
    },
    {
      id: "tith7",
      prompt: "Can God do all things?",
      choices: [
        "No, some things are too hard for God",
        "Yes, but only things we pray about",
        "Yes! God is all-powerful, nothing is too hard for Him",
        "God can do most things, but not everything",
      ],
      answer: "Yes! God is all-powerful, nothing is too hard for Him",
      hint: "Jeremiah 32:17, 'Nothing is too hard for you.' Matthew 19:26, 'With God all things are possible.'",
    },
    {
      id: "tith8",
      prompt: "What is the chief end of man? (from the catechism)",
      choices: [
        "To be happy and comfortable",
        "To be good and follow rules",
        "To glorify God, and to enjoy Him forever",
        "To take care of the earth",
      ],
      answer: "To glorify God, and to enjoy Him forever",
      hint: "1 Corinthians 10:31, 'Do all to the glory of God.' This is why you exist, to show how great God is and to love Him completely!",
    },
  ],
};

// ─── TITUS: LITERATURE (3rd grade, Aesop's Fables + Bible narrative) ──────────

const TITUS_LITERATURE: SubjectCurriculum = {
  subjectId: "literature",
  subjectLabel: "Literature",
  emoji: "📜",
  concept:
    "Stories teach us how to live! Aesop was a storyteller who lived 2,600 years ago. " +
    "His fables use animals to show us lessons about wisdom, honesty, and hard work. " +
    "We also read the Chronicles of Narnia by C.S. Lewis, stories where a great lion named Aslan " +
    "shows us what Jesus is like through imagination. And we read Pilgrim's Progress by John Bunyan, " +
    "the story of a man named Christian who travels from the City of Destruction to the Celestial City, " +
    "carrying a heavy burden of sin until it falls off at the Cross. " +
    "As we read, we ask: What is this teaching me? Is it true? What would a wise person do? " +
    "Good stories help us think better about everything, including the Bible!",
  questions: [
    {
      id: "tilit1",
      prompt: "In Aesop's 'The Tortoise and the Hare,' why does the tortoise win the race?",
      choices: [
        "The tortoise is faster than the hare",
        "The hare gets lost on the way",
        "The tortoise is slow but keeps going steadily; the hare is prideful and stops to rest",
        "The hare falls asleep because he is sick",
      ],
      answer: "The tortoise is slow but keeps going steadily; the hare is prideful and stops to rest",
      hint: "The lesson is: slow and steady wins the race. Pride made the hare careless. Proverbs 16:18 says 'Pride goes before destruction.'",
    },
    {
      id: "tilit2",
      prompt: "In Aesop's 'The Boy Who Cried Wolf,' what happened when the wolf actually came?",
      choices: [
        "The villagers came running to help",
        "The boy scared the wolf away himself",
        "Nobody believed him anymore, and the sheep were lost",
        "The wolf ran away from all the noise",
      ],
      answer: "Nobody believed him anymore, and the sheep were lost",
      hint: "The boy lied twice for fun. When real danger came, no one trusted him. Proverbs 12:17, 'An honest witness tells the truth.'",
    },
    {
      id: "tilit3",
      prompt: "In 'The Ant and the Grasshopper,' what does the ant do all summer that the grasshopper doesn't?",
      choices: [
        "Builds a house underground",
        "Gathers and stores food for winter",
        "Sings and dances with friends",
        "Travels to find a better home",
      ],
      answer: "Gathers and stores food for winter",
      hint: "Proverbs 6:6-8 says 'Go to the ant, you sluggard; consider its ways and be wise!' Work now so you have enough later.",
    },
    {
      id: "tilit4",
      prompt: "In 'The Fox and the Grapes,' the fox cannot reach the grapes so he says they are probably sour. What does this teach us?",
      choices: [
        "Grapes are sometimes sour",
        "Foxes are not good at climbing",
        "It is easy to pretend we don't want something we can't have",
        "We should always try harder before giving up",
      ],
      answer: "It is easy to pretend we don't want something we can't have",
      hint: "This is called 'sour grapes.' We sometimes tell ourselves we didn't want something when we really did but couldn't get it.",
    },
    {
      id: "tilit5",
      prompt: "In 'The Lion and the Mouse,' how does the tiny mouse help the powerful lion?",
      choices: [
        "The mouse brings the lion food",
        "The mouse chews through a net that trapped the lion",
        "The mouse warns the lion about hunters",
        "The mouse leads the lion to water",
      ],
      answer: "The mouse chews through a net that trapped the lion",
      hint: "The lion laughed at the mouse and thought he was useless. But the tiny mouse saved his life! 'No act of kindness, no matter how small, is ever wasted.'",
    },
    {
      id: "tilit6",
      prompt: "What do we call the lesson at the end of a fable?",
      choices: ["A rhyme", "A moral", "A punchline", "A proverb"],
      answer: "A moral",
      hint: "A moral is the lesson, what the story teaches us about right and wrong, wisdom and foolishness. It's like the 'point' of the story.",
    },
    {
      id: "tilit7",
      prompt: "In the story of David and Goliath (1 Samuel 17), why was David not afraid of the giant?",
      choices: [
        "David had a powerful sling",
        "David was taller than he looked",
        "David trusted that God would fight for him, just as God had before",
        "David had fought giants before",
      ],
      answer: "David trusted that God would fight for him, just as God had before",
      hint: "David said: 'The battle is the LORD's!' He remembered how God saved him from a bear and a lion. Faith means trusting God's past faithfulness.",
    },
    {
      id: "tilit8",
      prompt: "A character in a story often faces a problem and must make a choice. What do we call the lesson we learn from their choice?",
      choices: [
        "The title",
        "The theme",
        "The moral or theme",
        "The plot",
      ],
      answer: "The moral or theme",
      hint: "Stories teach us by showing us choices and their consequences. We ask: What did this character do? What happened because of it? What should I do?",
    },
    {
      id: "tilit9",
      prompt: "In Pilgrim's Progress by John Bunyan, the main character is called Christian. What does he carry on his back at the start of the story?",
      choices: [
        "A sword for fighting dragons",
        "A heavy burden, the weight of his sin",
        "A map to the Celestial City",
        "A bag of gold coins",
      ],
      answer: "A heavy burden, the weight of his sin",
      hint: "Christian can't get the burden off no matter how hard he tries. It represents his sin and guilt, which only one place can remove it. Keep reading to find out where! 📜",
    },
    {
      id: "tilit10",
      prompt: "In Pilgrim's Progress, where does Christian's heavy burden finally fall off his back?",
      choices: [
        "When he crosses the river at the end",
        "When he beats the giant Apollyon",
        "At the foot of the Cross, as he sees Jesus crucified for him",
        "When he reaches the Celestial City",
      ],
      answer: "At the foot of the Cross, as he sees Jesus crucified for him",
      hint: "Bunyan writes: 'Then Christian gave three leaps for joy and went on singing.' His burden rolled into the tomb and was seen no more! This is the gospel in picture form: Jesus takes our sin at the Cross. Colossians 2:14! 🎉",
    },
    {
      id: "tilit12",
      prompt: "In 'The Lion, the Witch and the Wardrobe' by C.S. Lewis, the great lion Aslan dies to save Edmund, then comes back to life. Who does Aslan remind us of?",
      choices: [
        "A powerful king who got lucky",
        "Jesus Christ, who died for sinners and rose again",
        "A magical creature with no real meaning",
        "The White Witch who rules Narnia",
      ],
      answer: "Jesus Christ, who died for sinners and rose again",
      hint: "C.S. Lewis called Narnia a 'supposal', what if Jesus came to a world like Narnia as a lion? Aslan's death and resurrection is a picture of the gospel. Aslan is NOT Jesus, but he shows us what Jesus is like!",
    },
    {
      id: "tilit13",
      prompt: "In Narnia, the 'Deep Magic' says every traitor belongs to the White Witch. Aslan honored this law by dying in Edmund's place. What happened then?",
      choices: [
        "The White Witch won and kept Narnia cold forever",
        "Aslan stayed dead and Narnia was sad",
        "The 'Deeper Magic', older than the Deep Magic, brought Aslan back to life",
        "Edmund went back to England and forgot everything",
      ],
      answer: "The 'Deeper Magic', older than the Deep Magic, brought Aslan back to life",
      hint: "This is a picture of the gospel! Sin has a law, death is the penalty. Jesus paid it. But resurrection is the Deeper Magic, 'Death itself would start working backwards.' Romans 6:23! 🦁",
    },
  ],
};

// ─── MERCY: THEOLOGY (Kindergarten, simple catechism, God made me) ───────────

const MERCY_THEOLOGY: SubjectCurriculum = {
  subjectId: "theology",
  subjectLabel: "Theology",
  emoji: "🕊️",
  concept:
    "Theology is learning about God! 🌸 God made you, loves you, and wants you to know Him. " +
    "These questions help us remember the most important things about God and how " +
    "He sent Jesus to save us. You already know some of these, let's see!",
  questions: [
    {
      id: "meth1",
      prompt: "Who made you?",
      choices: ["My mommy", "God made me", "I grew all by myself", "Nature made me"],
      answer: "God made me",
      hint: "Genesis 1:27, God made you on purpose! You are special to Him. 🌸",
    },
    {
      id: "meth2",
      prompt: "Why did God make you?",
      choices: [
        "To be a good helper",
        "To play all day",
        "To know Him, love Him, and enjoy Him forever",
        "To do whatever I want",
      ],
      answer: "To know Him, love Him, and enjoy Him forever",
      hint: "God made you so you could know how wonderful He is and love Him back! Like how you love Mama and Daddy, only even bigger!",
    },
    {
      id: "meth3",
      prompt: "What is God?",
      choices: [
        "God is a big strong man in the sky",
        "God is a Spirit, He doesn't have a body like us",
        "God is the sky and clouds",
        "God is like a grandpa",
      ],
      answer: "God is a Spirit, He doesn't have a body like us",
      hint: "John 4:24, 'God is spirit.' He is everywhere and sees everything, but we cannot touch Him. He is different from us, greater than anything!",
    },
    {
      id: "meth4",
      prompt: "Does God know everything?",
      choices: [
        "No, only some things",
        "Only what we tell Him",
        "Yes! God knows all things",
        "He knows most things",
      ],
      answer: "Yes! God knows all things",
      hint: "Psalm 139:1-4, God knows when you sit down, when you stand up, and even your thoughts! Nothing surprises God.",
    },
    {
      id: "meth5",
      prompt: "Who is Jesus?",
      choices: [
        "A kind teacher long ago",
        "An angel from heaven",
        "Jesus is the Son of God who died to save us",
        "A hero in a story",
      ],
      answer: "Jesus is the Son of God who died to save us",
      hint: "John 3:16, 'God so loved the world that He gave His only Son.' Jesus is God's Son, and He loves you so much!",
    },
    {
      id: "meth6",
      prompt: "What do we call talking to God?",
      choices: ["Singing", "Prayer", "Whispering", "Dreaming"],
      answer: "Prayer",
      hint: "We can talk to God anytime, anywhere! He always listens. 1 Thessalonians 5:17, 'Pray without ceasing.'",
    },
    {
      id: "meth7",
      prompt: "What is sin?",
      choices: [
        "Making a mistake on a test",
        "Being sad",
        "Disobeying God, doing what He says is wrong",
        "Forgetting something",
      ],
      answer: "Disobeying God, doing what He says is wrong",
      hint: "When we lie, or are mean, or don't obey, that is sin. Everyone sins. That is why we need Jesus to forgive us!",
    },
    {
      id: "meth8",
      prompt: "What did Jesus do because He loves us?",
      choices: [
        "He gave us toys and good food",
        "He died for our sins and came back to life",
        "He built us a nice house",
        "He made the flowers bloom for us",
      ],
      answer: "He died for our sins and came back to life",
      hint: "This is the best news in the whole world! Jesus took the punishment for our sin, and then He rose from the dead, Easter morning! 🌸",
    },
  ],
};

// ─── MERCY: LITERATURE (Kindergarten, Aesop + simple stories) ────────────────

const MERCY_LITERATURE: SubjectCurriculum = {
  subjectId: "literature",
  subjectLabel: "Literature",
  emoji: "📜",
  concept:
    "Stories are so fun! 🌸 We read fables, short stories with animals that teach us " +
    "important lessons. After each story we ask: What happened? Was the animal wise or " +
    "foolish? What should I do? Great stories help us learn how to be kind, honest, and brave!",
  questions: [
    {
      id: "melit1",
      prompt: "In 'The Tortoise and the Hare,' who wins the race?",
      choices: ["The hare, he is faster", "The tortoise, he kept going and never gave up", "They tied", "Nobody won"],
      answer: "The tortoise, he kept going and never gave up",
      hint: "Slow and steady wins the race! The hare was too proud and stopped to nap. Being faithful and not giving up is very important! 🌸",
    },
    {
      id: "melit2",
      prompt: "In 'The Boy Who Cried Wolf,' why did nobody help when the wolf really came?",
      choices: [
        "They were all asleep",
        "They were too far away",
        "The boy had lied before, so nobody believed him anymore",
        "They did not hear him calling",
      ],
      answer: "The boy had lied before, so nobody believed him anymore",
      hint: "When we lie, people stop trusting us. Proverbs 12:17, 'An honest witness tells the truth.' It is always better to tell the truth! 🌸",
    },
    {
      id: "melit3",
      prompt: "In 'The Ant and the Grasshopper,' who had food when winter came?",
      choices: [
        "The grasshopper, he found berries",
        "Both had plenty of food",
        "The ant, he had worked hard all summer",
        "Nobody had food in winter",
      ],
      answer: "The ant, he had worked hard all summer",
      hint: "The ant worked when the grasshopper played. Working hard now means we have what we need later. Proverbs 6:6, 'Go to the ant and be wise!'",
    },
    {
      id: "melit4",
      prompt: "In 'The Lion and the Mouse,' what surprising thing did the tiny mouse do?",
      choices: [
        "The mouse sang a song for the lion",
        "The mouse brought the lion food",
        "The mouse chewed through a net and saved the lion",
        "The mouse scared away the hunters",
      ],
      answer: "The mouse chewed through a net and saved the lion",
      hint: "The lion thought the mouse was too small to help. But the tiny mouse saved the big lion! Everyone matters, even the small ones. 🌸",
    },
    {
      id: "melit5",
      prompt: "What is the lesson, the 'moral', of a fable?",
      choices: [
        "The funniest part of the story",
        "What the animals look like",
        "The important lesson the story teaches us",
        "The title of the story",
      ],
      answer: "The important lesson the story teaches us",
      hint: "A moral is the lesson! Like when Mama says 'What did we learn today?' at the end of a story. Every fable has a lesson to teach us.",
    },
    {
      id: "melit6",
      prompt: "In the story of Baby Moses (Exodus 2), who kept baby Moses safe?",
      choices: [
        "Moses kept himself safe",
        "His sister Miriam and his brave mother",
        "The Pharaoh's soldiers",
        "An angel carried him",
      ],
      answer: "His sister Miriam and his brave mother",
      hint: "Moses's mother hid him in a basket on the river, and his sister watched over him. God used a brave family to protect a very important baby! 🌸",
    },
    {
      id: "melit7",
      prompt: "In 'The Three Billy Goats Gruff,' why did the goats want to cross the bridge?",
      choices: [
        "To visit their grandmother",
        "To get to the green grass on the other side",
        "To get away from wolves",
        "To play in the river",
      ],
      answer: "To get to the green grass on the other side",
      hint: "The goats needed to eat! They had to be brave and clever to cross the bridge where the troll lived. Being brave means doing the right thing even when we're scared.",
    },
    {
      id: "melit8",
      prompt: "When we read a story, what is one question we should always ask?",
      choices: [
        "How many pages does it have?",
        "What does this story teach me?",
        "What are all the characters' names?",
        "Is the story long or short?",
      ],
      answer: "What does this story teach me?",
      hint: "Good readers ask 'what can I learn?' Every story, even a fun one, teaches us something about life, kindness, or wisdom. 🌸",
    },
    {
      id: "melit9",
      prompt: "In a famous story called Pilgrim's Progress, a man named Christian carries a very heavy load on his back. When he looks at Jesus on the Cross, what happens to his load?",
      choices: [
        "It gets even heavier",
        "It stays on his back forever",
        "It falls off and rolls away, he is FREE! 🎉",
        "He has to carry it to the end of the road",
      ],
      answer: "It falls off and rolls away, he is FREE! 🎉",
      hint: "Christian's heavy load was his sin. And when he saw Jesus, who carried our sin on the Cross, the load fell off! That is what Jesus does for us. 'He himself bore our sins in his body on the tree.' 1 Peter 2:24 🌸",
    },
    {
      id: "melit10",
      prompt: "In a wonderful story called 'The Lion, the Witch and the Wardrobe,' there is a great lion named Aslan. Is Aslan good or bad?",
      choices: [
        "Aslan is scary and bad 😱",
        "Aslan is perfectly good, brave, and kind, and he loves the children ❤️",
        "Aslan is grumpy and mean",
        "Nobody knows if Aslan is good",
      ],
      answer: "Aslan is perfectly good, brave, and kind, and he loves the children ❤️",
      hint: "Aslan is a great lion who is perfectly good, like Jesus! He is brave, kind, and he loves the children who come to Narnia. He shows us what true goodness looks like. 🌸🦁",
    },
  ],
};

// ─── LOIS: THEOLOGY (Pre-K / age 3, God made me, super simple) ──────────────

const LOIS_THEOLOGY: SubjectCurriculum = {
  subjectId: "theology",
  subjectLabel: "Theology",
  emoji: "🕊️",
  concept:
    "God made you, and God loves you! 👑 We are going to learn some very important truths " +
    "about who God is. These are the most wonderful things in the whole world to know! " +
    "Let's learn about our amazing God together!",
  questions: [
    {
      id: "loth1",
      prompt: "Who made you?",
      choices: ["The stork brought me", "God made me! 👑", "I grew from a flower", "A fairy made me"],
      answer: "God made me! 👑",
      hint: "God made you! He made your eyes, your smile, your toes, everything! You are very special to God. 🌈",
    },
    {
      id: "loth2",
      prompt: "Does God love you?",
      choices: ["No, He doesn't know me", "Maybe sometimes", "Yes! God loves me SO much! 💕", "Only when I'm good"],
      answer: "Yes! God loves me SO much! 💕",
      hint: "John 3:16, God loves you SO much! His love never stops, not even when we make mistakes. 👑",
    },
    {
      id: "loth3",
      prompt: "Who is Jesus?",
      choices: [
        "A prince in a story",
        "A superhero",
        "Jesus is God's Son who loves me 💕",
        "A kind neighbor",
      ],
      answer: "Jesus is God's Son who loves me 💕",
      hint: "Jesus is the most wonderful person who ever lived! He is God's own Son, and He loves little children. 👑",
    },
    {
      id: "loth4",
      prompt: "What do we say to God when we talk to Him?",
      choices: [
        "We shout as loud as we can",
        "We snap our fingers",
        "We pray, we talk to God like a friend 🙏",
        "We write Him a letter",
      ],
      answer: "We pray, we talk to God like a friend 🙏",
      hint: "You can talk to God anytime! In your bed, at dinner, anywhere! He always listens. 👑",
    },
    {
      id: "loth5",
      prompt: "What did God make?",
      choices: [
        "Only the sun",
        "Only animals",
        "God made everything! 🌟",
        "God made houses and toys",
      ],
      answer: "God made everything! 🌟",
      hint: "Genesis 1:1, 'In the beginning, God created the heavens and the earth.' The sky, flowers, puppies, YOU, God made it all! 👑",
    },
    {
      id: "loth6",
      prompt: "When Jesus was a little baby, where was He born?",
      choices: [
        "In a big palace 🏰",
        "In a hospital",
        "In a manger, a stable with animals 🐑",
        "In a tree house",
      ],
      answer: "In a manger, a stable with animals 🐑",
      hint: "Baby Jesus was born in a little stable! He was wrapped in cloths and laid in a manger where animals eat. The angels sang for joy! 👑",
    },
  ],
};

// ─── LOIS: LITERATURE (Pre-K / age 3, fun animal stories) ──────────────────

const LOIS_LITERATURE: SubjectCurriculum = {
  subjectId: "literature",
  subjectLabel: "Literature",
  emoji: "📜",
  concept:
    "Story time! 👑 Stories are so fun and so special. Animals in stories teach us " +
    "how to be kind, brave, and good. Let's listen to some wonderful stories together!",
  questions: [
    {
      id: "lolit1",
      prompt: "In 'The Three Little Pigs,' why did the brick house not blow down?",
      choices: [
        "The wolf was too tired",
        "Because bricks are very strong, the pig worked hard to build it right 🧱",
        "The pig scared the wolf away",
        "The wind wasn't blowing",
      ],
      answer: "Because bricks are very strong, the pig worked hard to build it right 🧱",
      hint: "The little pig who worked hard built the strongest house! Working hard and doing things the right way protects us. 👑",
    },
    {
      id: "lolit2",
      prompt: "In 'Goldilocks and the Three Bears,' what did Goldilocks do that was wrong?",
      choices: [
        "She petted the bears",
        "She went into someone's house without asking and used their things 🐻",
        "She ate too many vegetables",
        "She got lost in the woods",
      ],
      answer: "She went into someone's house without asking and used their things 🐻",
      hint: "Goldilocks went into the bears' house without permission. We should always ask before touching other people's things! 👑",
    },
    {
      id: "lolit3",
      prompt: "In 'The Ugly Duckling,' what happened to the duckling at the end?",
      choices: [
        "He became a big duck",
        "He grew into a beautiful swan 🦢",
        "He flew away and got lost",
        "He made friends with all the ducks",
      ],
      answer: "He grew into a beautiful swan 🦢",
      hint: "The little duckling felt different and sad. But God made him to be a beautiful swan! God makes everyone special in their own way. 👑",
    },
    {
      id: "lolit4",
      prompt: "In 'The Very Hungry Caterpillar,' what does the caterpillar turn into?",
      choices: [
        "A butterfly 🦋",
        "A bird",
        "A bigger caterpillar",
        "A pretty moth",
      ],
      answer: "A butterfly 🦋",
      hint: "The caterpillar ate and grew, and then turned into something beautiful! God made butterflies to remind us of how amazing He is. 👑",
    },
    {
      id: "lolit5",
      prompt: "In the story of Noah and the Ark (Genesis 6), why did God send a rainbow at the end?",
      choices: [
        "Because it just rained",
        "To show Noah where to go",
        "As God's promise that He would never flood the whole earth again 🌈",
        "Because the animals liked colorful things",
      ],
      answer: "As God's promise that He would never flood the whole earth again 🌈",
      hint: "God put a rainbow in the sky as His promise! Every time you see a rainbow, you can remember that God always keeps His promises. 👑",
    },
    {
      id: "lolit6",
      prompt: "Stories teach us lessons. What kind of lesson does a story teach?",
      choices: [
        "How to count to ten",
        "How to be kind and good, wisdom lessons! ⭐",
        "How to make cookies",
        "The names of colors",
      ],
      answer: "How to be kind and good, wisdom lessons! ⭐",
      hint: "Every good story teaches us something! Be kind, work hard, tell the truth, trust God. Stories help us know how to live well. 👑",
    },
    {
      id: "lolit7",
      prompt: "In Narnia there is a great lion named ASLAN 🦁. Is Aslan brave and good?",
      choices: [
        "Yes! Aslan is brave and good and loves the children! 🦁❤️",
        "No, Aslan is mean",
        "Aslan is just a regular lion",
      ],
      answer: "Yes! Aslan is brave and good and loves the children! 🦁❤️",
      hint: "Aslan is the wonderful lion in Narnia! He is perfectly good and brave, and he loves the children who come to his special land. 👑🦁",
    },
  ],
};

// ─── LOGIC, fallback stubs (AI generates the real sessions) ─────────────────

const TITUS_LOGIC: SubjectCurriculum = {
  subjectId: "logic",
  subjectLabel: "Logic",
  emoji: "🧠",
  concept: "Logic is the tool God gives us to think clearly. A good argument has true premises and a conclusion that follows from them. Buck says: 'A hunter who tracks truth clearly never goes home empty-handed!'",
  questions: [
    {
      id: "titus-logic-1",
      prompt: "All fish in the lake need water. The bass is a fish in the lake. What must be true?",
      choices: ["The bass needs water", "The bass can fly", "The bass is a bird", "The bass lives on land"],
      answer: "The bass needs water",
      hint: "If ALL fish need water, and the bass IS a fish, then the bass needs water too. That's called a syllogism, two true premises lead to a sure conclusion! 🎣",
    },
    {
      id: "titus-logic-2",
      prompt: "If it rains, the ground gets wet. The ground is NOT wet. What can we conclude?",
      choices: ["It did not rain", "It rained a lot", "The sun is hot", "Nothing, we can't tell"],
      answer: "It did not rain",
      hint: "This is modus tollens: if P then Q; not-Q; therefore not-P. No wet ground means no rain! 🧠",
    },
    {
      id: "titus-logic-3",
      prompt: "Someone says 'You can't trust the Bible because it's old.' What kind of mistake is that?",
      choices: ["Appeal to age, old doesn't mean wrong", "Good logic", "A syllogism", "A fact"],
      answer: "Appeal to age, old doesn't mean wrong",
      hint: "Age doesn't decide truth! The Bible is old AND true. Calling something wrong just because it's old is a fallacy. 📖",
    },
  ],
};

const MERCY_LOGIC: SubjectCurriculum = {
  subjectId: "logic",
  subjectLabel: "Logic",
  emoji: "🧩",
  concept: "Logic means thinking in order! We ask: 'Does this make sense?' and 'Why?' God made our minds to think good thoughts and find true things!",
  questions: [
    {
      id: "mercy-logic-1",
      prompt: "All flowers need water. A rose is a flower. What does a rose need?",
      choices: ["Water", "Sand", "Ice cream", "Nothing"],
      answer: "Water",
      hint: "If ALL flowers need water, and a rose IS a flower, then a rose needs water too! 🌹",
    },
    {
      id: "mercy-logic-2",
      prompt: "First comes morning, then comes noon, then comes evening. What comes after morning?",
      choices: ["Noon", "Evening", "Midnight", "Another morning"],
      answer: "Noon",
      hint: "We put things in order, morning, noon, evening! That's a sequence. 🌅",
    },
    {
      id: "mercy-logic-3",
      prompt: "If you drop a ball, it falls down. You drop a ball. What happens?",
      choices: ["It falls down", "It flies up", "It disappears", "It grows"],
      answer: "It falls down",
      hint: "IF something happens, THEN something else follows. God made a world with patterns we can count on! 🌸",
    },
  ],
};

const LOIS_LOGIC: SubjectCurriculum = {
  subjectId: "logic",
  subjectLabel: "Thinking",
  emoji: "🐾",
  concept: "God made your brain to think! When we put things that go together, that's thinking! What goes with a shoe? A foot! What goes with night? Sleep! Let's play!",
  questions: [
    {
      id: "lois-logic-1",
      prompt: "Which one goes with a book?",
      choices: ["Reading 📖", "Swimming 🏊", "Cooking 🍳"],
      answer: "Reading 📖",
      hint: "Books are for reading! That's what they go together with! 📖",
    },
    {
      id: "lois-logic-2",
      prompt: "What comes AFTER 1, 2, 3?",
      choices: ["4", "7", "10"],
      answer: "4",
      hint: "1, 2, 3, then 4! You're counting in order! ⭐",
    },
    {
      id: "lois-logic-3",
      prompt: "Which one is different: apple, banana, orange, truck?",
      choices: ["Truck 🚛", "Apple 🍎", "Banana 🍌"],
      answer: "Truck 🚛",
      hint: "Apple, banana, and orange are all fruit! A truck is not food, it's a vehicle! 👑",
    },
  ],
};

// ─── WORLDVIEW, fallback stubs (AI generates the real sessions) ──────────────

const TITUS_WORLDVIEW: SubjectCurriculum = {
  subjectId: "worldview",
  subjectLabel: "Worldview",
  emoji: "🌍",
  concept: "A worldview answers four questions every idea must face: Where did we come from? What went wrong? How is it fixed? Where is it going? The Christian answers: Creation, Fall, Redemption, New Creation. There is NO neutral ground, every idea bows to Jesus or rebels against Him.",
  questions: [
    {
      id: "titus-wv-1",
      prompt: "Abraham Kuyper said: 'There is not a square inch in the whole domain of human existence over which Christ does not cry…' what?",
      choices: ["'Mine!', He is Lord of all", "'Maybe mine'", "'Just churches'", "'Just Sundays'"],
      answer: "'Mine!', He is Lord of all",
      hint: "Kuyper meant Jesus is Lord of science, art, math, history, everything! Not just church stuff. Buck says: even the fish in the river and the deer in the woods belong to Jesus! 🦌",
    },
    {
      id: "titus-wv-2",
      prompt: "What happened in the Fall (Genesis 3)?",
      choices: ["Adam and Eve sinned, all creation broke", "Adam fell off a tree", "A big storm came", "Nothing important"],
      answer: "Adam and Eve sinned, all creation broke",
      hint: "The Fall means sin entered the world through Adam. Now everything, people, nature, ideas, is affected by sin. That's why we need Jesus! 🌍",
    },
    {
      id: "titus-wv-3",
      prompt: "Can school subjects like math and science be 'neutral', not about God or against God?",
      choices: ["No, all knowledge belongs to God", "Yes, math has nothing to do with God", "Only Bible class is about God", "Only theology counts"],
      answer: "No, all knowledge belongs to God",
      hint: "Proverbs 1:7 says 'The fear of the LORD is the beginning of wisdom.' That means ALL wisdom, math, science, history, starts with God! 🧠",
    },
  ],
};

const MERCY_WORLDVIEW: SubjectCurriculum = {
  subjectId: "worldview",
  subjectLabel: "Worldview",
  emoji: "🌱",
  concept: "God made a BIG story! It has four parts: God made everything good (Creation). Then sin came and broke things (Fall). Jesus came to fix it (Redemption). One day everything will be made new (New Creation). You are PART of this story!",
  questions: [
    {
      id: "mercy-wv-1",
      prompt: "Who made everything, the flowers, the sky, the animals, YOU?",
      choices: ["God made everything", "Nobody made it", "The sun made it", "Plants made it"],
      answer: "God made everything",
      hint: "Genesis 1:1, 'In the beginning, God created…' God made everything, and everything He made was GOOD! 🌸",
    },
    {
      id: "mercy-wv-2",
      prompt: "When Adam and Eve sinned, what happened to God's good world?",
      choices: ["It got broken by sin", "It got bigger", "It got prettier", "Nothing changed"],
      answer: "It got broken by sin",
      hint: "Sin broke the good world God made. That's called the Fall. But God already had a plan to fix it! 🌱",
    },
    {
      id: "mercy-wv-3",
      prompt: "Why did Jesus come to earth?",
      choices: ["To save us and fix what sin broke", "To see the flowers", "To play with animals", "To count the stars"],
      answer: "To save us and fix what sin broke",
      hint: "Jesus is the Redeemer! He came to save His people and start making everything new again. The story isn't over! 🌹",
    },
  ],
};

const LOIS_WORLDVIEW: SubjectCurriculum = {
  subjectId: "worldview",
  subjectLabel: "God's World",
  emoji: "✨",
  concept: "Everything belongs to God! The flowers, the sky, your toys, YOU! God made it all and loves it all. Psalm 24:1 says 'The earth is the Lord's and everything in it!' Everything is HIS!",
  questions: [
    {
      id: "lois-wv-1",
      prompt: "Who made YOU?",
      choices: ["God made me! 🙏", "I made myself", "Nobody made me"],
      answer: "God made me! 🙏",
      hint: "God made you and loves you SO much! You are His special treasure! ✨",
    },
    {
      id: "lois-wv-2",
      prompt: "Who owns the sun, the moon, and the stars?",
      choices: ["God owns them all! ⭐", "We own them", "No one owns them"],
      answer: "God owns them all! ⭐",
      hint: "Psalm 24 says the earth is the LORD's, that means God! He owns everything He made! 👑",
    },
    {
      id: "lois-wv-3",
      prompt: "Does God love you?",
      choices: ["Yes! God loves me so much! 💕", "Maybe", "No"],
      answer: "Yes! God loves me so much! 💕",
      hint: "God loves you MORE than you can even imagine! He made you on purpose because He wanted YOU! ✨",
    },
  ],
};

// ─── TITUS: US HISTORY (3rd Grade) ──────────────────────────────────────────

const TITUS_HISTORY: SubjectCurriculum = {
  subjectId: "history",
  subjectLabel: "US History",
  emoji: "🏛️",
  concept:
    "History isn't just dates and names, it's God's story. He raises up nations and brings them low according to His plan. " +
    "America was founded by people who came here to worship God freely and build a nation under His law. " +
    "The Declaration of Independence itself says our rights come from our Creator, not from government. " +
    "We'll follow the trail from the first explorers to the Civil War. God's hand is in every chapter. 🎣",
  questions: [
    {
      id: "th1",
      prompt: "In what year did Columbus arrive in the Americas?",
      choices: ["1292", "1392", "1492", "1592"],
      answer: "1492",
      hint: "Remember: 'In 1492, Columbus sailed the ocean blue.' His journey opened the New World, God was at work in ways Columbus himself didn't fully understand. 🌊",
    },
    {
      id: "th2",
      prompt: "Why did the Pilgrims leave England and sail to America?",
      choices: ["To find gold", "To trade with Native Americans", "To worship God freely", "To escape a war"],
      answer: "To worship God freely",
      hint: "The Pilgrims were Separatists, they believed the Church of England had not been fully reformed. They risked everything to worship God according to Scripture. Before landing, they signed the Mayflower Compact, a covenant of self-government under God. 🙏",
    },
    {
      id: "th3",
      prompt: "God providentially prepared a man to help the Pilgrims survive. Who was he?",
      choices: ["Pocahontas", "Sitting Bull", "Squanto", "Crazy Horse"],
      answer: "Squanto",
      hint: "Squanto had already learned English years before the Pilgrims arrived, through a remarkable chain of events in his life. He taught them to plant corn and fish. Without him, Plymouth almost certainly fails. That's not luck; that's providence. 🌽",
    },
    {
      id: "th4",
      prompt: "The Declaration of Independence says our rights come from…",
      choices: ["The government", "The king", "Our Creator", "Majority vote"],
      answer: "Our Creator",
      hint: "The exact words: 'all men are created equal, endowed by their Creator with certain unalienable rights.' Rights come from GOD, which means no government can legitimately take them away. This is the most important sentence in American history. 🦅",
    },
    {
      id: "th5",
      prompt: "Who was the first President of the United States?",
      choices: ["John Adams", "Benjamin Franklin", "Thomas Jefferson", "George Washington"],
      answer: "George Washington",
      hint: "He commanded the Continental Army through 8 brutal years, then when everyone wanted to make him king, he handed power back to the people. He showed the world that free government could actually work. 🏛️",
    },
    {
      id: "th6",
      prompt: "What was the Boston Tea Party (1773)?",
      choices: ["A colonial tea festival", "Colonists dumping British tea to protest taxation without representation", "A British victory parade", "A peace treaty"],
      answer: "Colonists dumping British tea to protest taxation without representation",
      hint: "The colonists believed that being taxed without any say in Parliament violated their God-given rights as Englishmen. They didn't just complain, they acted. 'No taxation without representation!' 🍵",
    },
    {
      id: "th7",
      prompt: "Why did the southern states secede, causing the Civil War?",
      choices: ["Disagreement over tariffs only", "To preserve slavery, their own secession documents said so", "Dispute over western land", "Disagreement over the capital city"],
      answer: "To preserve slavery, their own secession documents said so",
      hint: "The Confederate states were clear in their secession declarations: they were leaving to protect slavery. Lincoln later called the war God's judgment on the nation for that great sin (Second Inaugural, 1865). Slavery is a direct violation of God's law, all men are made in His image. ⚖️",
    },
    {
      id: "th8",
      prompt: "Which president issued the Emancipation Proclamation and led the Union through the Civil War?",
      choices: ["Theodore Roosevelt", "Ulysses S. Grant", "Abraham Lincoln", "Andrew Jackson"],
      answer: "Abraham Lincoln",
      hint: "Lincoln said in his Second Inaugural that the war was God's punishment on both North and South for the sin of slavery. The Emancipation Proclamation (1863) declared enslaved people in rebel states free. The 13th Amendment (1865) ended slavery entirely. 🪙",
    },
  ],
};

// ─── EXPORTED MAPS ────────────────────────────────────────────────────────────

export const TITUS_CURRICULUM: Record<string, SubjectCurriculum> = {
  math: TITUS_MATH,
  grammar: TITUS_GRAMMAR,
  science: TITUS_SCIENCE,
  history: TITUS_HISTORY,
  bible: TITUS_BIBLE,
  theology: TITUS_THEOLOGY,
  literature: TITUS_LITERATURE,
  logic: TITUS_LOGIC,
  worldview: TITUS_WORLDVIEW,
  ...TITUS_TRACKS,
};

const MERCY_SCIENCE: SubjectCurriculum = {
  subjectId: "science",
  subjectLabel: "Science",
  emoji: "🌿",
  concept:
    "Science is exploring the world God made! We learn about animals, plants, weather, and the seasons. Everything God made is good, and it shows how wise and loving He is (Psalm 104). Let's go look!",
  questions: [
    {
      id: "mercy-science-1",
      prompt: "Which one is ALIVE?",
      choices: ["A puppy 🐶", "A rock", "A toy car"],
      answer: "A puppy 🐶",
      hint: "Living things grow, eat, and need water. A puppy does all of those! God gives it life. 🌸",
    },
    {
      id: "mercy-science-2",
      prompt: "What does a little bunny need to live?",
      choices: ["Food and water", "A television", "Nothing at all"],
      answer: "Food and water",
      hint: "Every living thing needs food, water, air, and a home. God gives His creatures what they need! 🐰",
    },
    {
      id: "mercy-science-3",
      prompt: "Where does a fish live?",
      choices: ["In the water", "In a tree", "In a nest"],
      answer: "In the water",
      hint: "God gave each animal just the right home. A fish lives in the water and breathes with gills! 🐟",
    },
    {
      id: "mercy-science-4",
      prompt: "In which season do flowers bloom and it gets warm?",
      choices: ["Spring", "Winter", "Never"],
      answer: "Spring",
      hint: "God made four seasons. In spring the flowers bloom, just like a garden waking up! 🌷",
    },
    {
      id: "mercy-science-5",
      prompt: "What is a window made of?",
      choices: ["Glass", "Bread", "Water"],
      answer: "Glass",
      hint: "Things are made of materials. Glass is smooth and you can see through it! God gave us materials to make useful things. ✨",
    },
  ],
};

const MERCY_HISTORY: SubjectCurriculum = {
  subjectId: "history",
  subjectLabel: "History",
  emoji: "🏛️",
  concept:
    "History is the story of long ago! We learn about kings, pyramids, and castles. And here is the best part: God has always been King over every land and every time (Daniel 2:21). Let's visit long ago!",
  questions: [
    {
      id: "mercy-history-1",
      prompt: "What did the people of Egypt build long ago?",
      choices: ["Giant pyramids", "Rocket ships", "Cars"],
      answer: "Giant pyramids",
      hint: "The Egyptians stacked huge stone blocks into giant pyramids. Joseph and Moses lived in Egypt in the Bible! 🏜️",
    },
    {
      id: "mercy-history-2",
      prompt: "How many true Gods are there?",
      choices: ["Only one true God", "Many gods", "None"],
      answer: "Only one true God",
      hint: "Long ago people worshiped pretend gods, but they were not real. There is only ONE true God who made everything! ✝️",
    },
    {
      id: "mercy-history-3",
      prompt: "Who ruled the world when Jesus was born?",
      choices: ["Rome", "America", "No one"],
      answer: "Rome",
      hint: "Rome ruled the world when Jesus was born. God chose that very time to send His Son. He rules over every kingdom! 👑",
    },
    {
      id: "mercy-history-4",
      prompt: "What was a castle for?",
      choices: ["To keep people safe", "To eat", "To fly"],
      answer: "To keep people safe",
      hint: "A castle was a strong stone home with high walls and towers to keep people safe from enemies. 🏰",
    },
    {
      id: "mercy-history-5",
      prompt: "How do we learn about things that happened long ago?",
      choices: ["Clues left behind", "We just guess", "We can't ever know"],
      answer: "Clues left behind",
      hint: "People find old pots, coins, and buildings left behind. Those clues tell us the true story of the past! 🔎",
    },
  ],
};

export const MERCY_CURRICULUM: Record<string, SubjectCurriculum> = {
  counting: MERCY_MATH,
  phonics: MERCY_PHONICS,
  bible: MERCY_BIBLE,
  theology: MERCY_THEOLOGY,
  literature: MERCY_LITERATURE,
  logic: MERCY_LOGIC,
  worldview: MERCY_WORLDVIEW,
  science: MERCY_SCIENCE,
  history: MERCY_HISTORY,
  ...MERCY_TRACKS,
};

export const LOIS_CURRICULUM: Record<string, SubjectCurriculum> = {
  abc: LOIS_ABC,
  numbers: LOIS_NUMBERS,
  colors: LOIS_COLORS,
  shapes: LOIS_SHAPES,
  bible: LOIS_BIBLE,
  theology: LOIS_THEOLOGY,
  literature: LOIS_LITERATURE,
  logic: LOIS_LOGIC,
  worldview: LOIS_WORLDVIEW,
  ...LOIS_TRACKS,
};

export const ALL_CURRICULUM: Record<string, Record<string, SubjectCurriculum>> = {
  truma: TRUMA_CURRICULUM,
  titus: TITUS_CURRICULUM,
  mercy: MERCY_CURRICULUM,
  lois: LOIS_CURRICULUM,
};

export function getCurriculum(kidId: string, subjectId: string): SubjectCurriculum | null {
  return ALL_CURRICULUM[kidId]?.[subjectId] ?? null;
}
