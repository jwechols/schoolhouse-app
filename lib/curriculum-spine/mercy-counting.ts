import type { Course } from "./types";

// Mercy, Kindergarten Counting/Math (grammar stage). MCA/Memoria model, Rod &
// Staff Grade 1 level: count and write to 100, recognize numbers, skip-count by
// 2s/5s/10s, compare greater/less/equal, add and subtract facts to ~10-20, simple
// story problems, coins, time to the half-hour, shapes, and simple fractions. The
// grammar-stage goal is joyful counting chants and number facts learned by heart.
// Garden/flower flavor throughout (Mercy's theme). Content written for a mom to
// read aloud to a 5-year-old.

export const MERCY_COUNTING: Course = {
  kidId: "mercy",
  subject: "counting",
  subjectLabel: "Counting",
  emoji: "🔢",
  gradeLabel: "Kindergarten",
  stage: "grammar",
  overview:
    "A full Kindergarten math year: count and write numbers all the way to 100, know each number by sight, and skip-count by 2s, 5s, and 10s. Learn which numbers are greater, less, or equal; add and subtract small numbers by heart; and solve little story problems. Finish with coins, telling time to the half-hour, shapes, and cutting things into halves, thirds, and fourths. The goal is happy counting chants and number facts Mercy knows without stopping to think, like a garden she can walk through with her eyes closed.",
  units: [
    {
      id: "mercy-counting-u1",
      title: "Unit 1 · Counting & Writing Numbers to 100",
      summary: "Count out loud and write numbers from 0 all the way to 100.",
      lessons: [
        {
          id: "mercy-counting-u1-l1",
          title: "Counting to 10",
          objective: "Count objects and say the numbers 1 through 10 in order.",
          teach: "Numbers help us tell how many. Touch each thing one time and say one number as you touch it: 1, 2, 3. Let's count flowers in the garden together, one petal at a time, all the way to 10. The last number you say tells how many there are in all.",
          memoryWork: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10!",
          workedExample:
            "Count the flowers in the garden, one at a time.\nTouch each flower and say one number.\n🌸 is 1. 🌸🌸 is 2. 🌸🌸🌸 is 3.\nThe LAST number you say tells how many there are.",
          // Interactive lesson (Princess Rose's voice). Bake with:
          // npm run prebake -- mercy counting mercy-counting-u1-l1
          interactive: [
            {
              kind: "teach",
              text: "Numbers tell us how many.",
              say: "Hello, sweet Mercy. It is Princess Rose. Today we count in the garden. Numbers help us tell how many flowers we have.",
            },
            {
              kind: "teach",
              text: "Touch each one and say one number: 1, 2, 3.",
              say: "Here is the secret. Touch each flower one time and say one number. One. Two. Three. One touch, one number.",
            },
            {
              kind: "example",
              text: "🌸 is 1.\n🌸🌸 is 2.\n🌸🌸🌸 is 3.",
              say: "Let us count together. One flower. Two flowers. Three flowers. See how each flower gets one number?",
            },
            {
              kind: "try",
              prompt: "Count them: 🌸🌸. How many?",
              say: "Now you try. Count the flowers. One, two. How many flowers?",
              choices: ["2", "3"],
              correctIndex: 0,
              visual: "🌸🌸",
              onRight: "Yes! Two pretty flowers. You touched each one and counted.",
              onWrong: "Let us touch each one. One, two. There are two flowers.",
            },
            {
              kind: "teach",
              text: "The LAST number you say tells how many in all.",
              say: "Here is something special. The last number you say tells how many there are all together. If you end on three, there are three.",
            },
            {
              kind: "try",
              prompt: "Count them: 🌷🌷🌷🌷. How many?",
              say: "Try one more. Count the tulips. One, two, three, four. How many?",
              choices: ["4", "3"],
              correctIndex: 0,
              visual: "🌷🌷🌷🌷",
              onRight: "Wonderful, Mercy! Four tulips. The last number was four.",
              onWrong: "Touch each tulip and count. One, two, three, four. There are four.",
            },
            {
              kind: "memory",
              text: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10!",
              say: "Let us say our counting all the way up. One, two, three, four, five, six, seven, eight, nine, ten! You are a good counter, Mercy.",
            },
          ],
          quiz: [
            { prompt: "Count them: 🌷🌷🌷. How many?", choices: ["3", "2", "4"], correctIndex: 0, explanation: "Touch each one: one, two, three. Three flowers!" },
            { prompt: "What number comes right after 5?", choices: ["4", "5", "6"], correctIndex: 2, explanation: "1, 2, 3, 4, 5, 6. Six comes right after five." },
            { prompt: "Count them: 🌼🌼🌼🌼🌼. How many?", choices: ["6", "5", "4"], correctIndex: 1, explanation: "One, two, three, four, five. Five flowers!" },
            { prompt: "Which number is the biggest?", choices: ["2", "5", "9"], correctIndex: 2, explanation: "Nine is the biggest one here." },
            { prompt: "When we count, what number do we start with?", choices: ["1", "3", "10"], correctIndex: 0, explanation: "We always start counting at one." },
          ],
        },
        {
          id: "mercy-counting-u1-l2",
          title: "Writing Numbers 0 to 10",
          objective: "Write the numerals 0 through 10.",
          teach: "Each number has its own shape we can write down. Zero is a circle that means none, like an empty flower pot. One is a straight line down. Two curves like a swan. Trace them in the air, then write them nice and big on your paper.",
          memoryWork: "Zero means none. One is a line straight down.",
          workedExample:
            "Zero is a circle. It means NONE. 0\nOne is a straight line down. 1\nTwo curves like a swan. 2\nTrace it big in the air, then write it on paper.",
          // Interactive lesson (Princess Rose's voice). Bake with:
          // npm run prebake -- mercy counting mercy-counting-u1-l2
          interactive: [
            {
              kind: "teach",
              text: "Every number has a shape we can write.",
              say: "Hello, sweet Mercy. It is Princess Rose. We can say numbers out loud, and today we learn to write them down. Every number has its own shape.",
            },
            {
              kind: "teach",
              text: "Zero is a circle. It means NONE. 0",
              say: "We start with zero. Zero is a circle, like an empty flower pot with nothing in it. Zero means none.",
              visual: "0️⃣ 🪴",
            },
            {
              kind: "try",
              prompt: "How many flowers are in an EMPTY pot?",
              say: "Here is a thinking one. How many flowers are in an empty pot?",
              choices: ["0", "1", "10"],
              correctIndex: 0,
              visual: "🪴",
              onRight: "Yes! Zero. An empty pot has none at all.",
              onWrong: "An empty pot has nothing in it, so that is zero.",
            },
            {
              kind: "teach",
              text: "One is a straight line down. 1",
              say: "One is the easiest to write. Just a straight line straight down, like a little stem.",
              visual: "1️⃣",
            },
            {
              kind: "example",
              text: "2 curves like a swan.\n3 has two little bumps.",
              say: "Two curves around like a swan on the pond. Three has two little bumps, one on top of the other.",
              visual: "2️⃣ 3️⃣",
            },
            {
              kind: "try",
              prompt: "Which number is just a straight line down?",
              say: "Which number is just a straight line down?",
              choices: ["1", "8", "0"],
              correctIndex: 0,
              visual: "1️⃣",
              onRight: "Wonderful, Mercy! One is a straight line down.",
              onWrong: "It is one. One is a single straight line down.",
            },
            {
              kind: "teach",
              text: "Trace it big in the air first, then write it on paper.",
              say: "Here is the secret to pretty numbers. Trace it big in the air with your finger first, then write it on your paper. Slow hands make happy numbers.",
            },
            {
              kind: "memory",
              text: "Zero means none. One is a line straight down.",
              say: "Let us remember this. Zero means none. One is a line straight down. You are learning to write, Mercy. What a gift God gave us, to put numbers on paper.",
            },
          ],
          quiz: [
            { prompt: "What does 0 mean?", choices: ["None", "One", "Ten"], correctIndex: 0, explanation: "Zero means none at all, like an empty pot." },
            { prompt: "Which number is a straight line down?", choices: ["8", "1", "3"], correctIndex: 1, explanation: "One is a single straight line down." },
            { prompt: "How many flowers are in an empty pot?", choices: ["0", "2"], correctIndex: 0, explanation: "Empty means zero." },
            { prompt: "Which number curves like a swan?", choices: ["2", "7"], correctIndex: 0, explanation: "Two curves around like a swan." },
            { prompt: "What should you do before writing a number on paper?", choices: ["Trace it big in the air", "Close your eyes"], correctIndex: 0, explanation: "Trace it in the air first, then write it. Slow hands make happy numbers." },
          ],
        },
        {
          id: "mercy-counting-u1-l3",
          title: "Counting to 20",
          objective: "Count in order from 1 to 20.",
          teach: "After ten we keep going: eleven, twelve, then thirteen, fourteen, all the way to twenty. Line up 20 little rocks or seeds and count each one. When you get to twenty, that is two whole hands of ten and ten more.",
          memoryWork: "11, 12, 13, 14, 15, 16, 17, 18, 19, 20!",
          workedExample:
            "Line up 20 seeds. 🌱\nCount past ten: eleven, twelve, thirteen...\nKeep going all the way to TWENTY. 20\nTwenty is ten and ten more.",
          // Interactive lesson (Princess Rose's voice). Bake with:
          // npm run prebake -- mercy counting mercy-counting-u1-l3
          interactive: [
            {
              kind: "teach",
              text: "Numbers do not stop at ten!",
              say: "Hello, sweet Mercy. It is Princess Rose. You already count to ten beautifully. Here is happy news. Numbers do not stop at ten. They keep going!",
            },
            {
              kind: "teach",
              text: "After 10 comes 11, then 12.",
              say: "After ten comes eleven. Then twelve. Eleven and twelve have special names all their own.",
              visual: "1️⃣0️⃣ 1️⃣1️⃣ 1️⃣2️⃣",
            },
            {
              kind: "try",
              prompt: "What number comes right after 10?",
              say: "What number comes right after ten?",
              choices: ["11", "9", "20"],
              correctIndex: 0,
              visual: "1️⃣0️⃣ ➡️ ❓",
              onRight: "Yes! Eleven comes right after ten.",
              onWrong: "After ten comes eleven. Ten, eleven, twelve.",
            },
            {
              kind: "teach",
              text: "Then 13, 14, 15, all the way to 20.",
              say: "Then we keep walking. Thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, and twenty!",
            },
            {
              kind: "example",
              text: "Line up 20 seeds. 🌱\nTouch each one and say one number.\nEnd on 20.",
              say: "Let us line up twenty little seeds in the garden. Touch each seed and say one number. When you finish, you will end on twenty.",
              visual: "🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱",
            },
            {
              kind: "try",
              prompt: "What number comes right after 14?",
              say: "Now you try. What number comes right after fourteen?",
              choices: ["15", "13", "16"],
              correctIndex: 0,
              visual: "1️⃣4️⃣ ➡️ ❓",
              onRight: "Wonderful, Mercy! Fifteen comes right after fourteen.",
              onWrong: "After fourteen comes fifteen. Thirteen, fourteen, fifteen.",
            },
            {
              kind: "teach",
              text: "20 is ten and ten more. 🙌 🙌",
              say: "And here is something lovely. Twenty is two whole hands of ten, and then ten more. Ten and ten makes twenty.",
              visual: "🙌 🙌",
            },
            {
              kind: "memory",
              text: "11, 12, 13, 14, 15, 16, 17, 18, 19, 20!",
              say: "Let us say them all together. Eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty! You can count to twenty now, Mercy.",
            },
          ],
          quiz: [
            { prompt: "What comes right after 10?", choices: ["11", "9", "12"], correctIndex: 0, explanation: "Ten, eleven, twelve. Eleven comes right after ten." },
            { prompt: "What comes right after 14?", choices: ["13", "15", "16"], correctIndex: 1, explanation: "Fourteen, then fifteen." },
            { prompt: "What is the last number we counted to?", choices: ["20", "10", "12"], correctIndex: 0, explanation: "We counted all the way to twenty." },
            { prompt: "Ten and ten more makes what?", choices: ["20", "11"], correctIndex: 0, explanation: "Ten and ten is twenty, two whole hands." },
            { prompt: "What comes right after 19?", choices: ["18", "20"], correctIndex: 1, explanation: "Nineteen, then twenty." },
          ],
        },
        {
          id: "mercy-counting-u1-l4",
          title: "Counting by Tens to 100",
          objective: "Count by tens from 10 to 100.",
          teach: "We can count in big jumps of ten to get to 100 fast. Ten, twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety, one hundred. Think of ten flowers tied in a bunch; count the bunches, not every petal.",
          memoryWork: "10, 20, 30, 40, 50, 60, 70, 80, 90, 100!",
          workedExample:
            "Tie ten flowers into one bunch. 💐\nOne bunch is 10. Two bunches is 20.\nCount the BUNCHES, not every flower.\nTen bunches is 100!",
          // Interactive lesson (Princess Rose's voice). Bake with:
          // npm run prebake -- mercy counting mercy-counting-u1-l4
          interactive: [
            {
              kind: "teach",
              text: "There is a fast way to count to 100.",
              say: "Hello, sweet Mercy. It is Princess Rose. Counting to one hundred one at a time takes a long while. So today I will show you a fast way.",
            },
            {
              kind: "teach",
              text: "Tie ten flowers into one bunch. 💐\nOne bunch is 10.",
              say: "Imagine we tie ten flowers together into one pretty bunch. That whole bunch is ten. Now we do not have to count every single flower.",
              visual: "💐",
            },
            {
              kind: "teach",
              text: "Count the BUNCHES: 10, 20, 30.",
              say: "So we count the bunches instead. One bunch is ten. Two bunches is twenty. Three bunches is thirty. Big happy jumps!",
              visual: "💐 💐 💐",
            },
            {
              kind: "try",
              prompt: "Two bunches of ten. How many flowers?",
              say: "You try. If we have two bunches of ten, how many flowers is that?",
              choices: ["20", "2", "12"],
              correctIndex: 0,
              visual: "💐 💐",
              onRight: "Yes! Two bunches of ten is twenty.",
              onWrong: "Ten and ten more. Two bunches of ten is twenty.",
            },
            {
              kind: "example",
              text: "10, 20, 30, 40, 50,\n60, 70, 80, 90, 100!",
              say: "Here is the whole chant. Ten, twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety, one hundred!",
            },
            {
              kind: "try",
              prompt: "What comes right after 30 when we count by tens?",
              say: "When we count by tens, what comes right after thirty?",
              choices: ["40", "31", "20"],
              correctIndex: 0,
              visual: "3️⃣0️⃣ ➡️ ❓",
              onRight: "Wonderful, Mercy! Thirty, then forty.",
              onWrong: "Counting by tens, after thirty comes forty. Twenty, thirty, forty.",
            },
            {
              kind: "teach",
              text: "Every ten ends in 0.",
              say: "Notice something tidy. Every single one of these ends in a zero. Ten, twenty, thirty. God made numbers in neat patterns, so they are easy to remember.",
            },
            {
              kind: "memory",
              text: "10, 20, 30, 40, 50, 60, 70, 80, 90, 100!",
              say: "Let us chant it together. Ten, twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety, one hundred! You just counted to a hundred, Mercy.",
            },
          ],
          quiz: [
            { prompt: "Counting by tens, what comes after 10?", choices: ["20", "11", "30"], correctIndex: 0, explanation: "Ten, then twenty." },
            { prompt: "Counting by tens, what comes after 30?", choices: ["31", "40", "20"], correctIndex: 1, explanation: "Thirty, then forty." },
            { prompt: "Two bunches of ten flowers is how many?", choices: ["20", "2"], correctIndex: 0, explanation: "Ten and ten is twenty." },
            { prompt: "Every number we say when counting by tens ends in what?", choices: ["0", "5"], correctIndex: 0, explanation: "They all end in zero: 10, 20, 30." },
            { prompt: "How many tens make 100?", choices: ["Ten", "Five"], correctIndex: 0, explanation: "Ten bunches of ten make one hundred." },
          ],
        },
        {
          id: "mercy-counting-u1-l5",
          title: "Counting All the Way to 100",
          objective: "Count in order from 1 to 100.",
          teach: "Now we count every single number to 100. It is a long walk, but each ten sounds the same: twenty-one, twenty-two, twenty-three, just like one, two, three. God made numbers in a tidy pattern so we never have to guess what comes next.",
          memoryWork: "After 29 comes 30. After 39 comes 40. Every ten starts a new row.",
          workedExample:
            "Each ten sounds the same:\ntwenty-one, twenty-two, twenty-three\nthirty-one, thirty-two, thirty-three\nAfter 29 comes 30. After 39 comes 40.",
          // Interactive lesson (Princess Rose's voice). Bake with:
          // npm run prebake -- mercy counting mercy-counting-u1-l5
          interactive: [
            {
              kind: "teach",
              text: "Today we count every number to 100.",
              say: "Hello, sweet Mercy. It is Princess Rose. You can jump by tens. Now let us walk every single number, all the way to one hundred.",
            },
            {
              kind: "teach",
              text: "Each ten sounds just the same.\ntwenty-one, twenty-two, twenty-three",
              say: "Here is the happy secret. Each ten sounds just the same as the last. Listen. Twenty-one, twenty-two, twenty-three. Does that sound like one, two, three? It does!",
            },
            {
              kind: "example",
              text: "1, 2, 3\ntwenty-ONE, twenty-TWO, twenty-THREE\nthirty-ONE, thirty-TWO, thirty-THREE",
              say: "One, two, three. Twenty-one, twenty-two, twenty-three. Thirty-one, thirty-two, thirty-three. The little numbers on the end never change their order.",
            },
            {
              kind: "try",
              prompt: "What comes right after 21?",
              say: "You try. What comes right after twenty-one?",
              choices: ["22", "31", "12"],
              correctIndex: 0,
              visual: "2️⃣1️⃣ ➡️ ❓",
              onRight: "Yes! Twenty-two, just like one, two.",
              onWrong: "After twenty-one comes twenty-two, just like one then two.",
            },
            {
              kind: "teach",
              text: "After 29 comes 30. A new row starts!",
              say: "Now here is the tricky part, and the only part you must watch for. When you reach twenty-nine, the row is full. So a brand new row begins. After twenty-nine comes thirty.",
              visual: "2️⃣9️⃣ ➡️ 3️⃣0️⃣",
            },
            {
              kind: "try",
              prompt: "What comes right after 29?",
              say: "This is the important one. What comes right after twenty-nine?",
              choices: ["30", "20", "40"],
              correctIndex: 0,
              visual: "2️⃣9️⃣ ➡️ ❓",
              onRight: "Wonderful, Mercy! After twenty-nine comes thirty. A new row!",
              onWrong: "The row was full, so a new one starts. After twenty-nine comes thirty.",
            },
            {
              kind: "try",
              prompt: "What comes right after 39?",
              say: "One more like it. What comes right after thirty-nine?",
              choices: ["40", "30", "49"],
              correctIndex: 0,
              visual: "3️⃣9️⃣ ➡️ ❓",
              onRight: "Yes! After thirty-nine comes forty. You found the pattern.",
              onWrong: "Same rule as before. After thirty-nine comes forty.",
            },
            {
              kind: "teach",
              text: "God made numbers in a tidy pattern.",
              say: "God made numbers in such a tidy pattern that we never have to guess what comes next. That is a kindness from Him, so little girls can learn them by heart.",
            },
            {
              kind: "memory",
              text: "After 29 comes 30. After 39 comes 40. Every ten starts a new row.",
              say: "Let us remember the rule. After twenty-nine comes thirty. After thirty-nine comes forty. Every ten starts a new row. Well done, Mercy.",
            },
          ],
          quiz: [
            { prompt: "What comes right after 21?", choices: ["22", "31", "12"], correctIndex: 0, explanation: "Twenty-one, twenty-two, just like one, two." },
            { prompt: "What comes right after 29?", choices: ["20", "30", "40"], correctIndex: 1, explanation: "The row is full, so a new row starts at thirty." },
            { prompt: "What comes right after 39?", choices: ["40", "30"], correctIndex: 0, explanation: "After thirty-nine comes forty." },
            { prompt: "Does each ten sound the same as 1, 2, 3?", choices: ["Yes", "No"], correctIndex: 0, explanation: "Twenty-one, twenty-two, twenty-three sounds just like one, two, three." },
            { prompt: "Who made numbers in a tidy pattern?", choices: ["God", "Nobody"], correctIndex: 0, explanation: "God made numbers orderly so we can learn them." },
          ],
        },
      ],
    },
    {
      id: "mercy-counting-u2",
      title: "Unit 2 · Comparing Numbers",
      summary: "Tell which group has more, less, or the same, and use >, <, =.",
      lessons: [
        {
          id: "mercy-counting-u2-l1",
          title: "Which Is More?",
          objective: "Compare two groups and tell which has more.",
          teach: "More means a bigger amount. Put 4 daisies in one row and 6 daisies in another, and match them up one to one. The row that still has flowers left over has MORE. Six is more than four.",
          memoryWork: "The bigger number is MORE.",
          workedExample:
            "Row 1: 🌼🌼🌼🌼 (4)\nRow 2: 🌸🌸🌸🌸🌸🌸 (6)\nMatch them one to one.\nRow 2 still has some LEFT OVER, so row 2 has MORE.",
          // Interactive lesson (Princess Rose's voice). Bake with:
          // npm run prebake -- mercy counting mercy-counting-u2-l1
          interactive: [
            {
              kind: "teach",
              text: "More means a bigger amount.",
              say: "Hello, sweet Mercy. It is Princess Rose. Today we learn a new word. More. More means a bigger amount.",
            },
            {
              kind: "teach",
              text: "Row 1: 🌼🌼🌼🌼\nRow 2: 🌸🌸🌸🌸🌸🌸",
              say: "Look at two rows in our garden. The first row has four daisies. The second row has six blossoms.",
              visual: "🌼🌼🌼🌼\n🌸🌸🌸🌸🌸🌸",
            },
            {
              kind: "teach",
              text: "Match them up one to one.\nThe row with some LEFT OVER has more.",
              say: "Here is the trick. Match them up, one flower next to one flower. Whichever row still has flowers left over is the row that has more.",
            },
            {
              kind: "try",
              prompt: "Which row has MORE?\n🌼🌼🌼🌼\n🌸🌸🌸🌸🌸🌸",
              say: "You try. Which row has more?",
              choices: ["The row with 6", "The row with 4"],
              correctIndex: 0,
              visual: "🌼🌼🌼🌼\n🌸🌸🌸🌸🌸🌸",
              onRight: "Yes! Six is more than four. That row had flowers left over.",
              onWrong: "Match them up. The row of six still has some left over, so six is more.",
            },
            {
              kind: "teach",
              text: "The bigger number is always MORE.",
              say: "And here is a shortcut you can use forever. You do not even have to match them. The bigger number is always the one that is more.",
            },
            {
              kind: "try",
              prompt: "Which is more: 8 or 3?",
              say: "Which is more, eight or three?",
              choices: ["8", "3"],
              correctIndex: 0,
              visual: "8️⃣ ❓ 3️⃣",
              onRight: "Wonderful, Mercy! Eight is more than three.",
              onWrong: "Eight is the bigger number, so eight is more.",
            },
            {
              kind: "try",
              prompt: "Which is more: 5 or 9?",
              say: "One more. Which is more, five or nine?",
              choices: ["9", "5"],
              correctIndex: 0,
              visual: "5️⃣ ❓ 9️⃣",
              onRight: "Yes! Nine is more than five. You have it.",
              onWrong: "Nine is the bigger number, so nine is more.",
            },
            {
              kind: "memory",
              text: "The bigger number is MORE.",
              say: "Let us remember it. The bigger number is more. Well done, Mercy.",
            },
          ],
          quiz: [
            { prompt: "Which is more: 6 or 4?", choices: ["6", "4"], correctIndex: 0, explanation: "Six is the bigger number, so six is more." },
            { prompt: "Which is more: 3 or 8?", choices: ["3", "8"], correctIndex: 1, explanation: "Eight is bigger, so eight is more." },
            { prompt: "How do you find which row has more?", choices: ["Match them one to one", "Close your eyes"], correctIndex: 0, explanation: "Match them up. The row with some left over has more." },
            { prompt: "Which is more: 10 or 7?", choices: ["10", "7"], correctIndex: 0, explanation: "Ten is the bigger number." },
            { prompt: "More means what?", choices: ["A bigger amount", "A smaller amount"], correctIndex: 0, explanation: "More means a bigger amount." },
          ],
        },
        {
          id: "mercy-counting-u2-l2",
          title: "Which Is Less?",
          objective: "Compare two groups and tell which has less.",
          teach: "Less means a smaller amount. Match the rows up again. The row that runs out first has LESS. Three is less than five, because three runs out and five keeps going.",
          memoryWork: "The smaller number is LESS.",
          workedExample:
            "Row 1: 🌷🌷🌷 (3)\nRow 2: 🌻🌻🌻🌻🌻 (5)\nMatch them one to one.\nRow 1 RUNS OUT first, so row 1 has LESS.",
          // Interactive lesson (Princess Rose's voice). Bake with:
          // npm run prebake -- mercy counting mercy-counting-u2-l2
          interactive: [
            {
              kind: "teach",
              text: "Less means a smaller amount.",
              say: "Hello again, sweet Mercy. It is Princess Rose. Yesterday we learned more. Today we learn its little sister. Less. Less means a smaller amount.",
            },
            {
              kind: "teach",
              text: "Row 1: 🌷🌷🌷\nRow 2: 🌻🌻🌻🌻🌻",
              say: "Look at our two rows. The first row has three tulips. The second row has five sunflowers.",
              visual: "🌷🌷🌷\n🌻🌻🌻🌻🌻",
            },
            {
              kind: "teach",
              text: "The row that RUNS OUT first has less.",
              say: "Match them up again, one next to one. This time watch for which row runs out first. That row is the one with less.",
            },
            {
              kind: "try",
              prompt: "Which row has LESS?\n🌷🌷🌷\n🌻🌻🌻🌻🌻",
              say: "You try. Which row has less?",
              choices: ["The row with 3", "The row with 5"],
              correctIndex: 0,
              visual: "🌷🌷🌷\n🌻🌻🌻🌻🌻",
              onRight: "Yes! Three is less than five. That row ran out first.",
              onWrong: "The row of three runs out first, so three is less.",
            },
            {
              kind: "teach",
              text: "The smaller number is always LESS.",
              say: "And here is the shortcut again. The smaller number is always the one that is less.",
            },
            {
              kind: "try",
              prompt: "Which is less: 2 or 7?",
              say: "Which is less, two or seven?",
              choices: ["2", "7"],
              correctIndex: 0,
              visual: "2️⃣ ❓ 7️⃣",
              onRight: "Wonderful, Mercy! Two is less than seven.",
              onWrong: "Two is the smaller number, so two is less.",
            },
            {
              kind: "try",
              prompt: "Which is less: 9 or 6?",
              say: "One more. Which is less, nine or six?",
              choices: ["6", "9"],
              correctIndex: 0,
              visual: "9️⃣ ❓ 6️⃣",
              onRight: "Yes! Six is less than nine. You have it.",
              onWrong: "Six is the smaller number, so six is less.",
            },
            {
              kind: "memory",
              text: "The smaller number is LESS.",
              say: "Let us remember it. The bigger number is more, and the smaller number is less. Well done, Mercy.",
            },
          ],
          quiz: [
            { prompt: "Which is less: 3 or 5?", choices: ["3", "5"], correctIndex: 0, explanation: "Three is smaller, so three is less." },
            { prompt: "Which is less: 8 or 2?", choices: ["8", "2"], correctIndex: 1, explanation: "Two is smaller, so two is less." },
            { prompt: "The row that runs out first has what?", choices: ["Less", "More"], correctIndex: 0, explanation: "Whichever row runs out first has less." },
            { prompt: "Which is less: 10 or 4?", choices: ["4", "10"], correctIndex: 0, explanation: "Four is the smaller number." },
            { prompt: "Less means what?", choices: ["A smaller amount", "A bigger amount"], correctIndex: 0, explanation: "Less means a smaller amount." },
          ],
        },
        {
          id: "mercy-counting-u2-l3",
          title: "Equal Means the Same",
          objective: "Tell when two groups are equal.",
          teach: "Equal means the same amount, not more and not less. If you have 5 seeds and I have 5 seeds, we are equal. When you match them up, nobody has any left over. The equal sign = means both sides are the same.",
          memoryWork: "Equal (=) means the very same amount.",
          workedExample:
            "You: 🌱🌱🌱🌱🌱 (5)\nMe:  🌱🌱🌱🌱🌱 (5)\nMatch them one to one.\nNOBODY has any left over, so we are EQUAL.\n5 = 5",
          // Interactive lesson (Princess Rose's voice). Bake with:
          // npm run prebake -- mercy counting mercy-counting-u2-l3
          interactive: [
            {
              kind: "teach",
              text: "Equal means the very same amount.",
              say: "Hello, sweet Mercy. It is Princess Rose. You know more, and you know less. Now here is the third one. Equal. Equal means the very same amount. Not more, not less.",
            },
            {
              kind: "teach",
              text: "You: 🌱🌱🌱🌱🌱\nMe:  🌱🌱🌱🌱🌱",
              say: "Suppose you have five seeds, and I have five seeds. We match them up, one next to one, and look. Nobody has any left over at all.",
              visual: "🌱🌱🌱🌱🌱\n🌱🌱🌱🌱🌱",
            },
            {
              kind: "teach",
              text: "Nobody has any left over = EQUAL.",
              say: "When nobody has any left over, that is what equal means. We have exactly the same.",
            },
            {
              kind: "try",
              prompt: "You have 5. I have 5. Are we equal?",
              say: "You try. You have five and I have five. Are we equal?",
              choices: ["Yes, equal", "No, I have more"],
              correctIndex: 0,
              visual: "5️⃣ = 5️⃣",
              onRight: "Yes! Five and five are equal. The very same amount.",
              onWrong: "Five and five is the same amount, so we are equal.",
            },
            {
              kind: "teach",
              text: "The equal sign is =\n5 = 5",
              say: "Mathematicians have a little sign for it. Two small lines, just the same length as each other. It looks like this. Five equals five.",
              visual: "=",
            },
            {
              kind: "try",
              prompt: "Which one is TRUE?",
              say: "Which one of these is true?",
              choices: ["3 = 3", "3 = 8"],
              correctIndex: 0,
              visual: "3️⃣ ❓ 3️⃣",
              onRight: "Wonderful, Mercy! Three equals three. Both sides are the same.",
              onWrong: "Three equals three. Three and eight are not the same amount.",
            },
            {
              kind: "try",
              prompt: "You have 4 seeds. I have 6 seeds. Are we equal?",
              say: "One more. You have four seeds and I have six seeds. Are we equal?",
              choices: ["No, not equal", "Yes, equal"],
              correctIndex: 0,
              visual: "4️⃣ ❓ 6️⃣",
              onRight: "Yes, that is right. Four and six are not the same, so we are not equal.",
              onWrong: "Four and six are different amounts, so we are not equal. I would have two left over.",
            },
            {
              kind: "memory",
              text: "Equal (=) means the very same amount.",
              say: "Let us remember it. Equal means the very same amount. Well done, Mercy.",
            },
          ],
          quiz: [
            { prompt: "What does equal mean?", choices: ["The very same amount", "A bigger amount"], correctIndex: 0, explanation: "Equal means exactly the same, not more and not less." },
            { prompt: "Which is TRUE?", choices: ["4 = 4", "4 = 7"], correctIndex: 0, explanation: "Four equals four. Both sides are the same." },
            { prompt: "You have 5 seeds and I have 5 seeds. Are we equal?", choices: ["Yes", "No"], correctIndex: 0, explanation: "Five and five is the same amount, so we are equal." },
            { prompt: "When two rows are equal, how many are left over?", choices: ["None", "Two"], correctIndex: 0, explanation: "Nobody has any left over when they are equal." },
            { prompt: "What sign means equal?", choices: ["=", "+"], correctIndex: 0, explanation: "The equal sign is two small lines, =." },
          ],
        },
        {
          id: "mercy-counting-u2-l4",
          title: "The Signs > < =",
          objective: "Use the >, <, and = signs to compare two numbers.",
          teach: "The > and < sign is like a hungry mouth, and it always opens wide to eat the BIGGER number. 6 > 4 means six is greater than four. 3 < 5 means three is less than five. And 5 = 5 means they are just the same.",
          memoryWork: "The hungry mouth always eats the bigger number.",
          workedExample:
            "The sign is a hungry mouth. 🐊\nIt opens WIDE toward the bigger number.\n6 > 4  (the mouth eats the 6)\n3 < 5  (the mouth eats the 5)\n5 = 5  (the same, so no mouth)",
          // Interactive lesson (Princess Rose's voice). Bake with:
          // npm run prebake -- mercy counting mercy-counting-u2-l4
          interactive: [
            {
              kind: "teach",
              text: "Now we learn the signs. 🐊",
              say: "Hello, sweet Mercy. It is Princess Rose. You know more, less, and equal. Today we learn the little signs that say it for us.",
            },
            {
              kind: "teach",
              text: "The sign is a hungry mouth.\nIt opens WIDE toward the bigger number.",
              say: "Here is the fun part. The sign is a hungry little mouth. And a hungry mouth always opens wide toward the bigger number, because that is the one it wants to eat.",
              visual: "🐊",
            },
            {
              kind: "example",
              text: "6 > 4\nThe mouth opens toward the 6.\nSix is GREATER than four.",
              say: "Look. Six and four. The mouth opens wide toward the six, because six is bigger. We read it, six is greater than four.",
              visual: "6️⃣ > 4️⃣",
            },
            {
              kind: "try",
              prompt: "Which number is the mouth eating?\n8 > 2",
              say: "You try. In eight, mouth, two, which number is the mouth eating?",
              choices: ["8", "2"],
              correctIndex: 0,
              visual: "8️⃣ > 2️⃣",
              onRight: "Yes! It opened wide toward the eight, because eight is bigger.",
              onWrong: "The wide part faces the eight, so it is eating the eight. Eight is bigger.",
            },
            {
              kind: "example",
              text: "3 < 5\nThe mouth opens toward the 5.\nThree is LESS than five.",
              say: "Now the other way. Three and five. This time the mouth opens toward the five, because five is the bigger one. We read it, three is less than five.",
              visual: "3️⃣ < 5️⃣",
            },
            {
              kind: "try",
              prompt: "Which sign belongs here?\n2 ❓ 9",
              say: "Two and nine. Which sign belongs in the middle?",
              choices: ["<", ">"],
              correctIndex: 0,
              visual: "2️⃣ ❓ 9️⃣",
              onRight: "Wonderful, Mercy! The mouth must open toward the nine, so it is two is less than nine.",
              onWrong: "Nine is the bigger number, so the mouth opens that way. Two is less than nine.",
            },
            {
              kind: "teach",
              text: "5 = 5\nThe same, so no hungry mouth.",
              say: "And when both sides are just the same, there is no bigger one to eat. So we use our equal sign instead. Five equals five.",
              visual: "5️⃣ = 5️⃣",
            },
            {
              kind: "try",
              prompt: "Which sign belongs here?\n7 ❓ 7",
              say: "Last one. Seven and seven. Which sign belongs in the middle?",
              choices: ["=", ">"],
              correctIndex: 0,
              visual: "7️⃣ ❓ 7️⃣",
              onRight: "Yes! Seven equals seven. They are the same, so no mouth.",
              onWrong: "They are the same amount, so we use the equal sign. Seven equals seven.",
            },
            {
              kind: "memory",
              text: "The hungry mouth always eats the bigger number.",
              say: "Let us remember it. The hungry mouth always eats the bigger number. Well done, Mercy. You can read math signs now.",
            },
          ],
          quiz: [
            { prompt: "In 6 > 4, which number is bigger?", choices: ["6", "4"], correctIndex: 0, explanation: "The mouth opens toward six, so six is greater." },
            { prompt: "Which sign belongs? 3 ❓ 5", choices: ["<", ">"], correctIndex: 0, explanation: "Five is bigger, so the mouth opens that way. 3 < 5." },
            { prompt: "Which sign belongs? 9 ❓ 2", choices: [">", "<"], correctIndex: 0, explanation: "Nine is bigger, so the mouth opens toward nine. 9 > 2." },
            { prompt: "Which sign belongs? 4 ❓ 4", choices: ["=", ">"], correctIndex: 0, explanation: "They are the same amount, so 4 = 4." },
            { prompt: "The hungry mouth always eats which number?", choices: ["The bigger one", "The smaller one"], correctIndex: 0, explanation: "It always opens wide toward the bigger number." },
          ],
        },
      ],
    },
    {
      id: "mercy-counting-u3",
      title: "Unit 3 · Skip Counting",
      summary: "Count in jumps by 10s, 5s, and 2s, and learn odd and even.",
      lessons: [
        { id: "mercy-counting-u3-l1", title: "Skip Counting by 10s", objective: "Skip-count by tens to 100.", teach: "Skip counting means jumping over numbers instead of saying every one. Counting by tens goes 10, 20, 30, and every number ends in zero. It is like ten flowers in each basket; count the baskets.", memoryWork: "10, 20, 30, 40, 50, 60, 70, 80, 90, 100!" },
        { id: "mercy-counting-u3-l2", title: "Skip Counting by 5s", objective: "Skip-count by fives to 50 or more.", teach: "Counting by fives goes 5, 10, 15, 20, and every number ends in a 5 or a 0. Your hand has 5 fingers, so count hands: one hand is 5, two hands is 10, three hands is 15.", memoryWork: "5, 10, 15, 20, 25, 30, 35, 40, 45, 50!" },
        { id: "mercy-counting-u3-l3", title: "Skip Counting by 2s", objective: "Skip-count by twos to 20 or more.", teach: "Counting by twos goes 2, 4, 6, 8, 10. We count two at a time, like counting shoes in pairs or petals two by two. It is faster than counting one, one, one.", memoryWork: "2, 4, 6, 8, 10, 12, 14, 16, 18, 20!" },
        { id: "mercy-counting-u3-l4", title: "Odd and Even", objective: "Tell whether a small number is odd or even.", teach: "Even numbers can share into two fair groups with none left over, like two friends splitting the seeds evenly. 2, 4, 6, 8, and 10 are even. Odd numbers always have one left over that cannot find a partner: 1, 3, 5, 7, 9.", memoryWork: "Even can share fair; odd has one left over." },
      ],
    },
    {
      id: "mercy-counting-u4",
      title: "Unit 4 · Adding & Taking Away",
      summary: "Add and subtract small numbers by heart and solve story problems.",
      lessons: [
        { id: "mercy-counting-u4-l1", title: "What Is Adding?", objective: "Understand addition as putting groups together.", teach: "Adding means putting two groups together to make a bigger group. If you pick 2 flowers and then pick 3 more, you push them all together and count: 1, 2, 3, 4, 5. So 2 + 3 = 5. The plus sign + means put together.", memoryWork: "Plus (+) means put together and count them all." },
        { id: "mercy-counting-u4-l2", title: "Adding Facts to 5", objective: "Add two numbers that make 5 or less.", teach: "Let's learn small adding facts by heart. Use your fingers: hold up 1, then 2 more, and count 3. Practice these until they are easy: 1+1=2, 2+2=4, 1+4=5, 2+3=5. Adding zero changes nothing; 4+0 is still 4.", memoryWork: "1+1=2, 2+2=4, 2+3=5. Zero added changes nothing." },
        { id: "mercy-counting-u4-l3", title: "Adding Facts to 10", objective: "Add two numbers that make 10 or less.", teach: "Ten is a special friendly number because it fills both hands. Learn the pairs that make ten: 5+5, 6+4, 7+3, 8+2, 9+1. When you know these, math gets much easier later.", memoryWork: "Ten pairs: 5+5, 6+4, 7+3, 8+2, 9+1." },
        { id: "mercy-counting-u4-l4", title: "What Is Taking Away?", objective: "Understand subtraction as taking some away.", teach: "Subtracting means taking some away and seeing how many are left. If you have 5 flowers and give 2 to Mama, count what is left in your hand: 3. So 5 - 2 = 3. The minus sign - means take away.", memoryWork: "Minus (-) means take away; count what is left." },
        { id: "mercy-counting-u4-l5", title: "Subtracting Facts to 10", objective: "Subtract from numbers up to 10.", teach: "Start with the big number and take away with your fingers. 10 - 4: start at ten, fold down four fingers, six are left. Practice: 5-1=4, 8-3=5, 10-5=5. Taking away all of them leaves zero, and taking away none leaves the same number.", memoryWork: "10-5=5, 8-3=5, 5-1=4. Take away all, get zero." },
        { id: "mercy-counting-u4-l6", title: "Little Story Problems", objective: "Listen to a story problem, choose to add or take away, and solve it.", teach: "A story problem is a little story with a number question at the end. Listen for the clue: getting more means add; losing or eating or giving away means take away. 'There were 6 birds, then 2 flew off. How many now?' Two flew away, so take away: 6 - 2 = 4 birds.", memoryWork: "Getting more = add. Going away = take away." },
      ],
    },
    {
      id: "mercy-counting-u5",
      title: "Unit 5 · Money & Time",
      summary: "Name and count coins, and tell time to the hour and half-hour.",
      lessons: [
        { id: "mercy-counting-u5-l1", title: "Pennies and Nickels", objective: "Name the penny and nickel and know their value.", teach: "Coins are little metal money, and each one is worth a number of cents. A penny is brown and worth 1 cent. A nickel is bigger and silver and worth 5 cents, the same as five pennies. The cent sign looks like this: ¢.", memoryWork: "Penny = 1¢. Nickel = 5¢." },
        { id: "mercy-counting-u5-l2", title: "Dimes and Quarters", objective: "Name the dime and quarter and know their value.", teach: "A dime is tiny but worth 10 cents, more than the bigger nickel. A quarter is the biggest coin and worth 25 cents. It is funny that the small dime is worth more than the big nickel; the size does not tell the value.", memoryWork: "Dime = 10¢. Quarter = 25¢." },
        { id: "mercy-counting-u5-l3", title: "Counting Coins", objective: "Count a small group of the same coin.", teach: "To count coins of the same kind, skip-count by their value. Three nickels: count by fives, 5, 10, 15 cents. Four dimes: count by tens, 10, 20, 30, 40 cents. This is why we practiced skip counting.", memoryWork: "Count nickels by 5s; count dimes by 10s." },
        { id: "mercy-counting-u5-l4", title: "Telling Time to the Hour", objective: "Read a clock when it shows an o'clock time.", teach: "A clock has two hands. The short hand tells the hour and the long hand tells the minutes. When the long hand points straight up to the 12 and the short hand points to a number, it is that o'clock. Short hand on 3, long hand on 12, means 3 o'clock.", memoryWork: "Long hand on 12 = o'clock. Short hand tells which hour." },
        { id: "mercy-counting-u5-l5", title: "Telling Time to the Half-Hour", objective: "Read a clock when it shows a half-hour time.", teach: "Half past means the long hand has gone halfway around and points straight down to the 6. The short hand sits between two numbers. Long hand on 6 and short hand just past 3 means half past 3, or 3:30. Half of an hour is 30 minutes.", memoryWork: "Long hand on 6 = half past. Half an hour = 30 minutes." },
      ],
    },
    {
      id: "mercy-counting-u6",
      title: "Unit 6 · Shapes & Fair Shares",
      summary: "Name flat shapes and split one whole into halves, thirds, and fourths.",
      lessons: [
        { id: "mercy-counting-u6-l1", title: "Shapes All Around", objective: "Name a circle, square, triangle, and rectangle.", teach: "Shapes are the outlines of things. A circle is round like the sun with no corners. A square has 4 sides all the same and 4 corners. A triangle has 3 sides and 3 corners. A rectangle has 4 corners but two long sides and two short sides, like a door. God filled His world with shapes to find everywhere.", memoryWork: "Circle: round. Triangle: 3 sides. Square: 4 equal sides. Rectangle: 4 sides, 2 long and 2 short." },
        { id: "mercy-counting-u6-l2", title: "Halves", objective: "Split one whole into two equal parts called halves.", teach: "A half is one of two equal parts of a whole. Cut a cookie straight down the middle so both pieces are the very same size, and each piece is one half. Two halves make one whole again. If the pieces are not the same size, they are not halves.", memoryWork: "Two equal parts = halves. Two halves make a whole." },
        { id: "mercy-counting-u6-l3", title: "Thirds and Fourths", objective: "Split one whole into three or four equal parts.", teach: "We can share a whole into more equal parts. Three equal parts are called thirds. Four equal parts are called fourths, also called quarters. Cut a flower cake into 4 fair pieces so each friend gets a fourth. The more pieces you cut, the smaller each piece is.", memoryWork: "3 equal parts = thirds. 4 equal parts = fourths." },
        { id: "mercy-counting-u6-l4", title: "Fair Shares", objective: "Tell whether parts are equal (fair) and name the share.", teach: "A fair share means every piece is the same size, so nobody gets more or less. Look at a shape cut into parts: if the parts match, they are halves or thirds or fourths; if one is bigger, it is not fair. Sharing fairly is a kind way to love the people at your table.", memoryWork: "Fair shares are equal parts. Equal means the same size." },
      ],
    },
  ],
};
