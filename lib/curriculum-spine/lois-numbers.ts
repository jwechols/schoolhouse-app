import type { Course } from "./types";

// Lois, Pre-K Numbers (grammar stage), age 3. Memoria "Junior Kindergarten" model:
// gentle, oral, repetition-first. This is the year to recognize and name numbers 1-20,
// count real objects one-to-one, count to 20 out loud, trace numerals, learn more vs.
// less, spot simple patterns and shapes, and meet "one more" / "one less" with toys.
// Princess flavor throughout; a mom reads each little lesson aloud. God made numbers
// orderly, and counting is one small way we see His careful world.

export const LOIS_NUMBERS: Course = {
  kidId: "lois",
  subject: "numbers",
  subjectLabel: "Numbers",
  emoji: "🔢",
  gradeLabel: "Pre-K",
  stage: "grammar",
  overview:
    "A gentle first year with numbers for a 3-year-old. Lois will learn to see and name numbers 1 to 20, count real things one at a time, count to 20 out loud, trace her numerals, tell more from less, notice simple patterns and shapes, and play with 'one more' and 'one less.' It is all songs, counting, and touching real objects, read aloud by Mom. The goal is a happy little counter who knows God made a world we can count.",
  units: [
    {
      id: "lois-numbers-u1",
      title: "Unit 1 · Meet the Numbers 1-5",
      summary: "See, say, and count 1, 2, 3, 4, 5.",
      lessons: [
        {
          id: "lois-numbers-u1-l1",
          title: "One and Two",
          objective: "Name the numbers 1 and 2 and count that many objects.",
          teach: "Hold up one finger and say 'one.' Now hold up two and say 'one, two!' Put one crown on the table, then two shoes by the door.",
          memoryWork: "1, 2!",
          workedExample:
            "Hold up one finger. That is ONE. 1\nNow hold up two fingers. That is TWO. 2\nOne crown 👑. Two shoes 👟 👟.",
          // Interactive lesson (Princess Crystal's voice). Bake with:
          // npm run prebake -- lois numbers lois-numbers-u1-l1
          interactive: [
            {
              kind: "teach",
              text: "One! ☝️",
              say: "Hi Lois! It is Princess Crystal. Hold up one finger. One!",
              visual: "☝️",
            },
            {
              kind: "try",
              prompt: "How many? 👑",
              say: "How many crowns? Count with me.",
              choices: ["1", "2"],
              correctIndex: 0,
              visual: "👑",
              onRight: "Yes! One crown. You did it!",
              onWrong: "Just one crown. That is one!",
            },
            {
              kind: "teach",
              text: "Two! ✌️",
              say: "Now hold up two fingers. One, two! That is two.",
              visual: "✌️",
            },
            {
              kind: "try",
              prompt: "How many? 👟 👟",
              say: "How many shoes? Count them.",
              choices: ["1", "2"],
              correctIndex: 1,
              visual: "👟 👟",
              onRight: "Yay! Two shoes. So smart, Lois!",
              onWrong: "Count them. One, two. That is two!",
            },
            {
              kind: "memory",
              text: "1, 2!",
              say: "One, two! You know one and two. Good job!",
              visual: "1️⃣ 2️⃣",
            },
          ],
          quiz: [
            { prompt: "How many crowns? 👑", choices: ["1", "2"], correctIndex: 0, explanation: "One crown! That is 1." },
            { prompt: "How many shoes? 👟 👟", choices: ["1", "2"], correctIndex: 1, explanation: "Two shoes! That is 2." },
            { prompt: "Which is more?", choices: ["1", "2"], correctIndex: 1, explanation: "Two is more than one!" },
          ],
        },
        {
          id: "lois-numbers-u1-l2",
          title: "Three",
          objective: "Name the number 3 and count three objects.",
          teach: "Three little bears, count them: one, two, three! Line up three stuffed animals and tap each one as you say its number.",
          memoryWork: "1, 2, 3!",
          workedExample:
            "Line up three bears. 🧸 🧸 🧸\nTouch each one and say a number. One, two, three!\nThe last number is THREE. 3",
          // Interactive lesson (Princess Crystal's voice). Bake with:
          // npm run prebake -- lois numbers lois-numbers-u1-l2
          interactive: [
            {
              kind: "teach",
              text: "Three! 🧸 🧸 🧸",
              say: "Hi Lois! It is Princess Crystal. Look, three little bears. One, two, three!",
              visual: "🧸 🧸 🧸",
            },
            {
              kind: "try",
              prompt: "How many bears? 🧸 🧸 🧸",
              say: "How many bears? Count with me.",
              choices: ["2", "3"],
              correctIndex: 1,
              visual: "🧸 🧸 🧸",
              onRight: "Yes! Three bears. You did it!",
              onWrong: "Count them. One, two, three. That is three!",
            },
            {
              kind: "teach",
              text: "Count to three! 🌸 🌸 🌸",
              say: "Now three flowers. Touch each one. One, two, three!",
              visual: "🌸 🌸 🌸",
            },
            {
              kind: "try",
              prompt: "How many stars? ⭐ ⭐ ⭐",
              say: "How many stars? Count them.",
              choices: ["3", "4"],
              correctIndex: 0,
              visual: "⭐ ⭐ ⭐",
              onRight: "Yay! Three stars. So smart, Lois!",
              onWrong: "Count them. One, two, three. That is three!",
            },
            {
              kind: "memory",
              text: "1, 2, 3!",
              say: "One, two, three! You know three now. Good job, Lois!",
              visual: "1️⃣ 2️⃣ 3️⃣",
            },
          ],
          quiz: [
            { prompt: "How many bears? 🧸 🧸 🧸", choices: ["2", "3"], correctIndex: 1, explanation: "Three bears! That is 3." },
            { prompt: "How many flowers? 🌸 🌸 🌸", choices: ["3", "1"], correctIndex: 0, explanation: "Three flowers! That is 3." },
            { prompt: "Which is more?", choices: ["2", "3"], correctIndex: 1, explanation: "Three is more than two!" },
          ],
        },
        {
          id: "lois-numbers-u1-l3",
          title: "Four",
          objective: "Name the number 4 and count four objects.",
          teach: "A puppy has four paws. Touch each paw and count: one, two, three, four! Count the four wheels on a toy car too.",
          memoryWork: "1, 2, 3, 4!",
          workedExample:
            "A puppy has four paws. 🐾 🐾 🐾 🐾\nTouch each paw. One, two, three, four!\nThe last number is FOUR. 4",
          // Interactive lesson (Princess Crystal's voice). Bake with:
          // npm run prebake -- lois numbers lois-numbers-u1-l3
          interactive: [
            {
              kind: "teach",
              text: "Four! 🐾 🐾 🐾 🐾",
              say: "Hi Lois! Princess Crystal here. A puppy has four paws. One, two, three, four!",
              visual: "🐾 🐾 🐾 🐾",
            },
            {
              kind: "try",
              prompt: "How many paws? 🐾 🐾 🐾 🐾",
              say: "How many paws? Count with me.",
              choices: ["3", "4"],
              correctIndex: 1,
              visual: "🐾 🐾 🐾 🐾",
              onRight: "Yes! Four paws. You did it!",
              onWrong: "Count them. One, two, three, four. That is four!",
            },
            {
              kind: "teach",
              text: "Count to four! 🍎 🍎 🍎 🍎",
              say: "Now four apples. Touch each one. One, two, three, four!",
              visual: "🍎 🍎 🍎 🍎",
            },
            {
              kind: "try",
              prompt: "How many apples? 🍎 🍎 🍎 🍎",
              say: "How many apples? Count them.",
              choices: ["4", "5"],
              correctIndex: 0,
              visual: "🍎 🍎 🍎 🍎",
              onRight: "Yay! Four apples. So smart, Lois!",
              onWrong: "Count them. One, two, three, four. That is four!",
            },
            {
              kind: "memory",
              text: "1, 2, 3, 4!",
              say: "One, two, three, four! You can count to four. Good job!",
              visual: "1️⃣ 2️⃣ 3️⃣ 4️⃣",
            },
          ],
          quiz: [
            { prompt: "How many paws? 🐾 🐾 🐾 🐾", choices: ["4", "3"], correctIndex: 0, explanation: "Four paws! That is 4." },
            { prompt: "How many apples? 🍎 🍎 🍎 🍎", choices: ["3", "4"], correctIndex: 1, explanation: "Four apples! That is 4." },
            { prompt: "Which is more?", choices: ["3", "4"], correctIndex: 1, explanation: "Four is more than three!" },
          ],
        },
        {
          id: "lois-numbers-u1-l4",
          title: "Five",
          objective: "Name the number 5 and count five objects.",
          teach: "Look at your hand. It has five fingers! Wiggle each one: one, two, three, four, five! God gave you a little counter on each hand.",
          memoryWork: "1, 2, 3, 4, 5!",
          workedExample:
            "Look at your hand. ✋ It has five fingers.\nWiggle each one. One, two, three, four, five!\nThe last number is FIVE. 5",
          // Interactive lesson (Princess Crystal's voice). Bake with:
          // npm run prebake -- lois numbers lois-numbers-u1-l4
          interactive: [
            {
              kind: "teach",
              text: "Five! ✋",
              say: "Hi Lois! Princess Crystal here. Look at your hand. Five fingers! One, two, three, four, five!",
              visual: "✋",
            },
            {
              kind: "try",
              prompt: "How many fingers? ✋",
              say: "How many fingers on one hand? Count with me.",
              choices: ["4", "5"],
              correctIndex: 1,
              visual: "✋",
              onRight: "Yes! Five fingers. You did it!",
              onWrong: "Count them. One, two, three, four, five. That is five!",
            },
            {
              kind: "teach",
              text: "Count to five! ⭐ ⭐ ⭐ ⭐ ⭐",
              say: "Now five stars. Touch each one. One, two, three, four, five!",
              visual: "⭐ ⭐ ⭐ ⭐ ⭐",
            },
            {
              kind: "try",
              prompt: "How many flowers? 🌸 🌸 🌸 🌸 🌸",
              say: "How many flowers? Count them.",
              choices: ["5", "6"],
              correctIndex: 0,
              visual: "🌸 🌸 🌸 🌸 🌸",
              onRight: "Yay! Five flowers. So smart, Lois!",
              onWrong: "Count them. One, two, three, four, five. That is five!",
            },
            {
              kind: "memory",
              text: "1, 2, 3, 4, 5!",
              say: "One, two, three, four, five! You counted to five. God gave you a little counter on each hand. Good job, Lois!",
              visual: "🖐️ 1️⃣2️⃣3️⃣4️⃣5️⃣",
            },
          ],
          quiz: [
            { prompt: "How many fingers? ✋", choices: ["5", "4"], correctIndex: 0, explanation: "Five fingers! That is 5." },
            { prompt: "How many stars? ⭐ ⭐ ⭐ ⭐ ⭐", choices: ["4", "5"], correctIndex: 1, explanation: "Five stars! That is 5." },
            { prompt: "Which is more?", choices: ["4", "5"], correctIndex: 1, explanation: "Five is more than four!" },
          ],
        },
      ],
    },
    {
      id: "lois-numbers-u2",
      title: "Unit 2 · Meet the Numbers 6-10",
      summary: "See, say, and count 6, 7, 8, 9, 10.",
      lessons: [
        {
          id: "lois-numbers-u2-l1",
          title: "Six and Seven",
          objective: "Name the numbers 6 and 7 and count that many objects.",
          teach: "Count six grapes on your plate: one, two, three, four, five, six! Then add one more for seven.",
          memoryWork: "5, 6, 7!",
          workedExample:
            "Count six grapes. 🍇 🍇 🍇 🍇 🍇 🍇\nOne, two, three, four, five, six!\nAdd one more. That is SEVEN. 7",
          // Interactive lesson (Princess Crystal's voice). Bake with:
          // npm run prebake -- lois numbers lois-numbers-u2-l1
          interactive: [
            {
              kind: "teach",
              text: "Six! 🍇 🍇 🍇 🍇 🍇 🍇",
              say: "Hi Lois! It is Princess Crystal. Six grapes on your plate. One, two, three, four, five, six!",
              visual: "🍇 🍇 🍇 🍇 🍇 🍇",
            },
            {
              kind: "try",
              prompt: "How many grapes? 🍇 🍇 🍇 🍇 🍇 🍇",
              say: "How many grapes? Count with me.",
              choices: ["5", "6"],
              correctIndex: 1,
              visual: "🍇 🍇 🍇 🍇 🍇 🍇",
              onRight: "Yes! Six grapes. You did it!",
              onWrong: "Count them. One, two, three, four, five, six. That is six!",
            },
            {
              kind: "teach",
              text: "One more makes seven! 🍓 🍓 🍓 🍓 🍓 🍓 🍓",
              say: "Now put one more. Six and one more is seven. One, two, three, four, five, six, seven!",
              visual: "🍓 🍓 🍓 🍓 🍓 🍓 🍓",
            },
            {
              kind: "try",
              prompt: "How many berries? 🍓 🍓 🍓 🍓 🍓 🍓 🍓",
              say: "How many berries? Count them.",
              choices: ["7", "6"],
              correctIndex: 0,
              visual: "🍓 🍓 🍓 🍓 🍓 🍓 🍓",
              onRight: "Yay! Seven berries. So smart, Lois!",
              onWrong: "Count them. One, two, three, four, five, six, seven. That is seven!",
            },
            {
              kind: "memory",
              text: "5, 6, 7!",
              say: "Five, six, seven! You know six and seven now. Good job, Lois!",
              visual: "5️⃣ 6️⃣ 7️⃣",
            },
          ],
          quiz: [
            { prompt: "How many grapes? 🍇 🍇 🍇 🍇 🍇 🍇", choices: ["6", "5"], correctIndex: 0, explanation: "Six grapes! That is 6." },
            { prompt: "How many berries? 🍓 🍓 🍓 🍓 🍓 🍓 🍓", choices: ["6", "7"], correctIndex: 1, explanation: "Seven berries! That is 7." },
            { prompt: "Which is more?", choices: ["6", "7"], correctIndex: 1, explanation: "Seven is more than six!" },
          ],
        },
        {
          id: "lois-numbers-u2-l2",
          title: "Eight",
          objective: "Name the number 8 and count eight objects.",
          teach: "A spider has eight legs. Count eight crayons in a row and tap each one as you say it.",
          memoryWork: "6, 7, 8!",
          workedExample:
            "A spider has eight legs. 🕷️\nTap each leg. One, two, three, four, five, six, seven, eight!\nThe last number is EIGHT. 8",
          // Interactive lesson (Princess Crystal's voice). Bake with:
          // npm run prebake -- lois numbers lois-numbers-u2-l2
          interactive: [
            {
              kind: "teach",
              text: "Eight! 🕷️",
              say: "Hi Lois! Princess Crystal here. A spider has eight legs. Eight!",
              visual: "🕷️",
            },
            {
              kind: "try",
              prompt: "How many legs does a spider have? 🕷️",
              say: "How many legs does a spider have?",
              choices: ["8", "4"],
              correctIndex: 0,
              visual: "🕷️",
              onRight: "Yes! Eight legs. You did it!",
              onWrong: "A spider has eight legs. That is eight!",
            },
            {
              kind: "teach",
              text: "Count to eight! 🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️",
              say: "Now eight crayons. Tap each one. One, two, three, four, five, six, seven, eight!",
              visual: "🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️",
            },
            {
              kind: "try",
              prompt: "How many crayons? 🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️",
              say: "How many crayons? Count them.",
              choices: ["7", "8"],
              correctIndex: 1,
              visual: "🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️",
              onRight: "Yay! Eight crayons. So smart, Lois!",
              onWrong: "Count them. One, two, three, four, five, six, seven, eight. That is eight!",
            },
            {
              kind: "memory",
              text: "6, 7, 8!",
              say: "Six, seven, eight! You can count to eight. Good job, Lois!",
              visual: "6️⃣ 7️⃣ 8️⃣",
            },
          ],
          quiz: [
            { prompt: "How many legs does a spider have? 🕷️", choices: ["8", "6"], correctIndex: 0, explanation: "Eight legs! That is 8." },
            { prompt: "How many crayons? 🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️ 🖍️", choices: ["7", "8"], correctIndex: 1, explanation: "Eight crayons! That is 8." },
            { prompt: "Which is more?", choices: ["7", "8"], correctIndex: 1, explanation: "Eight is more than seven!" },
          ],
        },
        {
          id: "lois-numbers-u2-l3",
          title: "Nine",
          objective: "Name the number 9 and count nine objects.",
          teach: "Count nine flower petals, one at a time: seven, eight, nine! Almost to ten now.",
          memoryWork: "7, 8, 9!",
          workedExample:
            "Count nine petals. 🌼\nOne at a time. Seven, eight, NINE!\nThe last number is NINE. 9",
          // Interactive lesson (Princess Crystal's voice). Bake with:
          // npm run prebake -- lois numbers lois-numbers-u2-l3
          interactive: [
            {
              kind: "teach",
              text: "Nine! 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸",
              say: "Hi Lois! Princess Crystal here. Nine flower petals. One, two, three, four, five, six, seven, eight, nine!",
              visual: "🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸",
            },
            {
              kind: "try",
              prompt: "How many petals? 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸",
              say: "How many petals? Count with me.",
              choices: ["8", "9"],
              correctIndex: 1,
              visual: "🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸",
              onRight: "Yes! Nine petals. You did it!",
              onWrong: "Count them. Seven, eight, nine. That is nine!",
            },
            {
              kind: "teach",
              text: "Nine is almost ten! ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐",
              say: "Nine is almost ten. Just one more after nine! Count the stars. One, two, three, four, five, six, seven, eight, nine!",
              visual: "⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐",
            },
            {
              kind: "try",
              prompt: "What comes right after 8?",
              say: "What number comes right after eight?",
              choices: ["9", "7"],
              correctIndex: 0,
              visual: "8️⃣ ➡️ ❓",
              onRight: "Yay! Nine comes after eight. So smart, Lois!",
              onWrong: "Nine comes after eight. Seven, eight, nine!",
            },
            {
              kind: "memory",
              text: "7, 8, 9!",
              say: "Seven, eight, nine! You know nine now. Good job, Lois!",
              visual: "7️⃣ 8️⃣ 9️⃣",
            },
          ],
          quiz: [
            { prompt: "How many petals? 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸", choices: ["9", "8"], correctIndex: 0, explanation: "Nine petals! That is 9." },
            { prompt: "What comes right after 8?", choices: ["7", "9"], correctIndex: 1, explanation: "Nine comes right after eight." },
            { prompt: "Which is more?", choices: ["8", "9"], correctIndex: 1, explanation: "Nine is more than eight!" },
          ],
        },
        {
          id: "lois-numbers-u2-l4",
          title: "Ten",
          objective: "Name the number 10 and count ten objects.",
          teach: "Ten little fingers, count them all: one, two, three... all the way to ten! Ten is both hands together.",
          memoryWork: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10!",
          workedExample:
            "Hold up both hands. 🙌\nCount every finger. One, two, three, four, five, six, seven, eight, nine, TEN!\nTen is both hands together. 10",
          // Interactive lesson (Princess Crystal's voice). Bake with:
          // npm run prebake -- lois numbers lois-numbers-u2-l4
          interactive: [
            {
              kind: "teach",
              text: "Ten! 🙌",
              say: "Hi Lois! Princess Crystal here. Hold up both hands. Ten little fingers! Ten is both hands together.",
              visual: "🙌",
            },
            {
              kind: "try",
              prompt: "How many fingers on BOTH hands? 🙌",
              say: "How many fingers on both hands?",
              choices: ["5", "10"],
              correctIndex: 1,
              visual: "🙌",
              onRight: "Yes! Ten fingers. You did it!",
              onWrong: "Five and five more. That is ten!",
            },
            {
              kind: "teach",
              text: "Count to ten! 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑",
              say: "Now ten crowns. Touch each one. One, two, three, four, five, six, seven, eight, nine, ten!",
              visual: "👑 👑 👑 👑 👑 👑 👑 👑 👑 👑",
            },
            {
              kind: "try",
              prompt: "What comes right after 9?",
              say: "What number comes right after nine?",
              choices: ["8", "10"],
              correctIndex: 1,
              visual: "9️⃣ ➡️ ❓",
              onRight: "Yay! Ten comes after nine. So smart, Lois!",
              onWrong: "Ten comes after nine. Eight, nine, ten!",
            },
            {
              kind: "memory",
              text: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10!",
              say: "Let us count all the way. One, two, three, four, five, six, seven, eight, nine, ten! You counted to ten, Lois. God gave you ten little fingers to count with. Good job!",
              visual: "🙌 1️⃣0️⃣",
            },
          ],
          quiz: [
            { prompt: "How many fingers on both hands? 🙌", choices: ["10", "5"], correctIndex: 0, explanation: "Ten fingers! That is 10." },
            { prompt: "What comes right after 9?", choices: ["10", "8"], correctIndex: 0, explanation: "Ten comes right after nine." },
            { prompt: "Which is more?", choices: ["9", "10"], correctIndex: 1, explanation: "Ten is more than nine!" },
          ],
        },
      ],
    },
    {
      id: "lois-numbers-u3",
      title: "Unit 3 · Counting to Twenty",
      summary: "Count out loud from 1 all the way to 20.",
      lessons: [
        { id: "lois-numbers-u3-l1", title: "Numbers 11 and 12", objective: "Name 11 and 12 and count that far out loud.", teach: "After ten comes eleven, then twelve. Count twelve steps as you walk down the hall: ten, eleven, twelve!", memoryWork: "10, 11, 12!" },
        { id: "lois-numbers-u3-l2", title: "Numbers 13 to 15", objective: "Count out loud to 15.", teach: "Keep going past twelve: thirteen, fourteen, fifteen! Count fifteen jumps on the floor.", memoryWork: "13, 14, 15!" },
        { id: "lois-numbers-u3-l3", title: "Numbers 16 to 20", objective: "Count out loud to 20.", teach: "Almost the whole way: sixteen, seventeen, eighteen, nineteen, twenty! Twenty is a big, happy number.", memoryWork: "16, 17, 18, 19, 20!" },
        { id: "lois-numbers-u3-l4", title: "All the Way to Twenty", objective: "Count from 1 to 20 in order.", teach: "Now let's do the whole song together, slow and proud: one, two, three... all the way to twenty! God made every number line up in order.", memoryWork: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20!" },
      ],
    },
    {
      id: "lois-numbers-u4",
      title: "Unit 4 · Counting Real Things",
      summary: "Touch each object once and say one number.",
      lessons: [
        { id: "lois-numbers-u4-l1", title: "One Touch, One Number", objective: "Count objects by touching each one only once.", teach: "Count the ducks! Touch each duck and say one number: one duck, two ducks, three ducks. One touch, one number.", memoryWork: "One thing, one number." },
        { id: "lois-numbers-u4-l2", title: "Counting a Line", objective: "Count objects arranged in a straight line.", teach: "Line up your blocks in a row. Start at one end and count left to right so you don't miss any: one, two, three, four!", memoryWork: "Start at the start, count them all." },
        { id: "lois-numbers-u4-l3", title: "How Many Altogether?", objective: "Say the last number counted as the total.", teach: "Count five berries: one, two, three, four, five. The last number you say tells how many there are. Five berries altogether!", memoryWork: "The last number tells how many." },
        { id: "lois-numbers-u4-l4", title: "Count and Stop", objective: "Count out a chosen number of objects and stop.", teach: "Can you give the princess three crackers? Count them out, one, two, three, and stop! You gave her exactly three.", memoryWork: "Count, then stop." },
      ],
    },
    {
      id: "lois-numbers-u5",
      title: "Unit 5 · Writing Our Numbers",
      summary: "Trace and write the numerals 1 to 10.",
      lessons: [
        { id: "lois-numbers-u5-l1", title: "Tracing 1, 2, 3", objective: "Trace the numerals 1, 2, 3 with a finger or crayon.", teach: "One is a straight line down. Two is a curve and a line. Three is two little bumps. Trace them big in the air first, then on paper.", memoryWork: "1 goes down. 2 curves around. 3 has two bumps." },
        { id: "lois-numbers-u5-l2", title: "Tracing 4, 5, 6", objective: "Trace the numerals 4, 5, 6.", teach: "Four has a corner and a line. Five is a hat and a fat tummy. Six comes down and loops. Go slow and trace right on the lines.", memoryWork: "Slow hands make happy numbers." },
        { id: "lois-numbers-u5-l3", title: "Tracing 7, 8, 9", objective: "Trace the numerals 7, 8, 9.", teach: "Seven is a line and a slide. Eight is two circles, like a snowman. Nine is a circle with a tail.", memoryWork: "8 is a snowman: circle, circle." },
        { id: "lois-numbers-u5-l4", title: "Writing 10", objective: "Write 10 as a 1 next to a 0.", teach: "Ten is special: a one and a zero standing together, 10. Zero is a round hole that means 'none' by itself, but next to the one it makes ten!", memoryWork: "10 is a 1 and a 0." },
      ],
    },
    {
      id: "lois-numbers-u6",
      title: "Unit 6 · More and Less",
      summary: "Tell which group has more and which has less.",
      lessons: [
        { id: "lois-numbers-u6-l1", title: "Which Has More?", objective: "Point to the group that has more objects.", teach: "Look at two little piles of grapes. Which pile has more? The bigger pile has more! Point to it.", memoryWork: "More means a bigger bunch." },
        { id: "lois-numbers-u6-l2", title: "Which Has Less?", objective: "Point to the group that has less.", teach: "Now which pile has less? Less means fewer, the smaller bunch. Point to the little pile.", memoryWork: "Less means fewer." },
        { id: "lois-numbers-u6-l3", title: "The Same", objective: "Tell when two groups have the same amount.", teach: "Line up three spoons and three forks, one next to each other. They match! When nobody has more, they are the same.", memoryWork: "Same means they match." },
        { id: "lois-numbers-u6-l4", title: "Count to Compare", objective: "Count two small groups and say which is more.", teach: "Count each little pile. Four blocks and two blocks: four is more because it comes later when we count. Four beats two!", memoryWork: "Bigger numbers come later." },
      ],
    },
    {
      id: "lois-numbers-u7",
      title: "Unit 7 · Patterns and Shapes",
      summary: "Spot simple patterns and name basic shapes.",
      lessons: [
        { id: "lois-numbers-u7-l1", title: "What Comes Next?", objective: "Continue a simple AB pattern.", teach: "Red bead, blue bead, red bead, blue bead... what comes next? Red! A pattern is a happy thing that keeps repeating.", memoryWork: "Red, blue, red, blue, red!" },
        { id: "lois-numbers-u7-l2", title: "Circle and Square", objective: "Name a circle and a square.", teach: "A circle is round like a ball or the sun. A square has four straight sides that are all the same. Find a circle and a square in the room!", memoryWork: "Circle is round. Square has four sides." },
        { id: "lois-numbers-u7-l3", title: "Triangle", objective: "Name a triangle and count its sides.", teach: "A triangle has three straight sides and three pointy corners, like a slice of pizza. Count them: one, two, three!", memoryWork: "A triangle has 3 sides." },
        { id: "lois-numbers-u7-l4", title: "Shapes All Around", objective: "Find circles, squares, and triangles in real objects.", teach: "A clock is a circle, a window is a square, a party hat is a triangle. God filled our world with shapes to find!", memoryWork: "Circle, square, triangle." },
      ],
    },
    {
      id: "lois-numbers-u8",
      title: "Unit 8 · One More and One Less",
      summary: "Add one more and take one away with real objects.",
      lessons: [
        { id: "lois-numbers-u8-l1", title: "One More", objective: "Find one more by adding a single object.", teach: "You have two teacups. Put one more on the table, now count: one, two, three! One more makes the next number.", memoryWork: "One more is the next number." },
        { id: "lois-numbers-u8-l2", title: "One Less", objective: "Find one less by taking a single object away.", teach: "You have four crayons. Take one away and count what's left: one, two, three. One less is the number before.", memoryWork: "One less is the number before." },
        { id: "lois-numbers-u8-l3", title: "Add One More Together", objective: "Count a small group, add one, and count again.", teach: "Three ducks are swimming. One more duck comes! Count them all again: one, two, three, four. Three and one more is four.", memoryWork: "3 and 1 more is 4." },
        { id: "lois-numbers-u8-l4", title: "Take One Away Together", objective: "Count a small group, take one, and count again.", teach: "Five flowers in a vase. One flower is picked for Mama. Count what's left: one, two, three, four. Five take one is four.", memoryWork: "5 take away 1 is 4." },
      ],
    },
  ],
};
