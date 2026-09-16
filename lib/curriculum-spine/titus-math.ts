import type { Course } from "./types";

// Titus, 3rd Grade Math (grammar stage). MCA/Memoria model: this is the year to
// MASTER multiplication & division facts, secure place value and multi-digit
// add/subtract, and meet fractions, measurement, money, and time. Fishing/outdoors
// scenarios throughout. This is the template all other courses follow.

export const TITUS_MATH: Course = {
  kidId: "titus",
  subject: "math",
  subjectLabel: "Math",
  emoji: "✖️",
  gradeLabel: "3rd Grade",
  stage: "grammar",
  overview:
    "A full 3rd-grade year: lock in place value and fast, accurate multi-digit addition and subtraction, then MASTER the multiplication and division facts through 10 by heart. Finish with fractions, measurement, money, time, and lots of word problems. The grammar-stage goal is fluent, memorized number facts Titus can pull up instantly.",
  units: [
    {
      id: "titus-math-u1",
      title: "Unit 1 · Place Value & Number Sense",
      summary: "Read, write, compare, and round numbers to the thousands.",
      lessons: [
        {
          id: "titus-math-u1-l1",
          title: "Hundreds, Tens & Ones",
          objective: "Read and write 3-digit numbers and name the value of each digit.",
          teach:
            "Every digit has a place, and its place tells its value. In 372, the 3 means 3 hundreds (300), the 7 means 7 tens (70), the 2 means 2 ones. Say it as 'three hundred seventy-two.' Build numbers with bundles: 3 boxes of 100 tackle, 7 packs of 10, 2 loose hooks.",
          memoryWork: "Place values right to left: ones, tens, hundreds, thousands.",
          workedExample:
            "The number 372.\nThe 3 sits in the hundreds place: 300.\nThe 7 sits in the tens place: 70.\nThe 2 sits in the ones place: 2.\n300 + 70 + 2 = 372.",
          // Interactive lesson (Buck's voice). Bake with:
          // npm run prebake -- titus math titus-math-u1-l1
          interactive: [
            {
              kind: "teach",
              text: "Big idea: where a digit sits tells you how much it is worth.",
              say: "Howdy, Titus. Buck here. Today we learn how numbers are built, like packing a tackle box. Here is the big idea. Where a number sits tells you how much it is worth. Let me show you before you try it.",
            },
            {
              kind: "teach",
              text: "Reading right to left: ones, then tens, then hundreds.",
              say: "Start from the right side and walk left. The first spot is the ones. The next spot is the tens. The next spot is the hundreds. Ones, tens, hundreds, just like that.",
            },
            {
              kind: "example",
              text: "Look at 372.\n3 is in the hundreds place: 300.\n7 is in the tens place: 70.\n2 is in the ones place: 2.\n300 + 70 + 2 = 372.",
              say: "Let us take the number three hundred seventy-two apart together. The three is in the hundreds place, so it is worth three hundred. The seven is in the tens place, so it is worth seventy. The two is in the ones place, so it is worth two. Add them up, three hundred plus seventy plus two, and you get three hundred seventy-two.",
            },
            {
              kind: "try",
              prompt: "In 372, what is the 7 really worth?",
              say: "Your turn. In three hundred seventy-two, what is the seven really worth?",
              choices: ["70", "7"],
              correctIndex: 0,
              visual: "3 [7] 2  →  tens place  →  70",
              onRight: "That's it. The seven is in the tens place, so it is worth seventy.",
              onWrong: "Check its spot. The seven is in the tens place, so it counts as seventy, not seven.",
            },
            {
              kind: "teach",
              text: "You read the whole number from the biggest place first: three hundred seventy-two.",
              say: "When you say a number out loud, you start with the biggest place. Hundreds first, then tens, then ones. So we say three hundred seventy-two.",
            },
            {
              kind: "try",
              prompt: "In 548, what does the 5 mean?",
              say: "Try this one. In five hundred forty-eight, what does the five mean?",
              choices: ["5 hundreds", "5 tens"],
              correctIndex: 0,
              visual: "[5] 4 8  →  hundreds place  →  500",
              onRight: "Good eye. The five is in the hundreds place, so it means five hundreds, or 500.",
              onWrong: "Look where the five sits. It is the first digit, the hundreds place, so it means five hundreds.",
            },
            {
              kind: "teach",
              text: "Build a number with bundles: boxes of 100, packs of 10, and loose ones.",
              say: "Picture building it like gear. A hundred is a big box of tackle. A ten is a small pack. A one is a single loose hook. Three boxes, seven packs, and two loose hooks make three hundred seventy-two.",
            },
            {
              kind: "try",
              prompt: "Which digit is in the ones place in 216?",
              say: "One more. Which digit is in the ones place in two hundred sixteen?",
              choices: ["6", "2"],
              correctIndex: 0,
              visual: "2 1 [6]  →  ones place",
              onRight: "Yep. The six is the last digit on the right, so it is in the ones place.",
              onWrong: "The ones place is the very last spot on the right. In two hundred sixteen that digit is the six.",
            },
            {
              kind: "memory",
              text: "Right to left: ones, tens, hundreds, thousands.",
              say: "Lock it in, Titus. Reading right to left: ones, tens, hundreds, thousands. You just learned how every number is built.",
            },
          ],
          quiz: [
            {
              prompt: "In 863, what is the value of the 8?",
              choices: ["800", "80", "8"],
              correctIndex: 0,
              explanation: "The 8 is in the hundreds place, so it is worth 800.",
            },
            {
              prompt: "What is the value of the 4 in 247?",
              choices: ["40", "4", "400"],
              correctIndex: 0,
              explanation: "The 4 is in the tens place: 40.",
            },
            {
              prompt: "Which number has 5 in the tens place?",
              choices: ["352", "523", "235"],
              correctIndex: 0,
              explanation: "In 352 the 5 sits in the tens place (50).",
            },
            {
              prompt: "How do you say 604?",
              choices: ["Six hundred four", "Sixty-four", "Six hundred forty"],
              correctIndex: 0,
              explanation: "6 hundreds, 0 tens, 4 ones: six hundred four.",
            },
            {
              prompt: "3 hundreds, 0 tens, and 9 ones make what number?",
              choices: ["309", "390", "39"],
              correctIndex: 0,
              explanation: "300 + 0 + 9 = 309.",
            },
          ],
        },
        { id: "titus-math-u1-l2", title: "Thousands", objective: "Read and write 4-digit numbers to 9,999.", teach: "A new place opens up: the thousands. 4,258 is 4 thousands, 2 hundreds, 5 tens, 8 ones. The comma separates thousands from the rest so big numbers are easy to read.", memoryWork: "1,000 = ten hundreds." },
        { id: "titus-math-u1-l3", title: "Comparing Numbers", objective: "Use >, <, and = to compare numbers up to the thousands.", teach: "The alligator mouth always opens toward the bigger number. Compare from the left: whichever number has more in the highest place wins. 462 > 458 because 6 tens beats 5 tens.", memoryWork: "The > and < mouth eats the BIGGER number." },
        { id: "titus-math-u1-l4", title: "Rounding to Tens & Hundreds", objective: "Round 2- and 3-digit numbers to the nearest ten and hundred.", teach: "Look at the digit to the right of the place you're rounding. 5 or more, round up; 4 or less, round down. 68 rounds to 70; 342 rounds to 300. Rounding helps you estimate fast, like guessing how many fish are in the whole lake." },
      ],
    },
    {
      id: "titus-math-u2",
      title: "Unit 2 · Addition & Subtraction Fluency",
      summary: "Multi-digit adding and subtracting with carrying and borrowing.",
      lessons: [
        { id: "titus-math-u2-l1", title: "Adding with Carrying", objective: "Add 2- and 3-digit numbers with regrouping.", teach: "Add one column at a time, right to left. When a column makes 10 or more, carry the ten to the next column. 47 + 38: 7 + 8 = 15, write 5 carry 1; 4 + 3 + 1 = 8. Answer 85.", memoryWork: "Add right to left; carry the ten." },
        { id: "titus-math-u2-l2", title: "Subtracting with Borrowing", objective: "Subtract 2- and 3-digit numbers with regrouping.", teach: "When the top digit is too small, borrow a ten from the next column. 52 - 27: you can't do 2 - 7, so borrow: 12 - 7 = 5; then 4 - 2 = 2. Answer 25.", memoryWork: "Can't subtract? Borrow a ten." },
        { id: "titus-math-u2-l3", title: "3-Digit Add & Subtract", objective: "Add and subtract across the hundreds with regrouping.", teach: "Same rules, one more column. Line up the places carefully. Check subtraction by adding your answer back to the number you took away, it should return the top number." },
        { id: "titus-math-u2-l4", title: "Estimating Sums & Differences", objective: "Estimate answers by rounding first.", teach: "Round each number, then add or subtract the rounded numbers for a quick estimate. 312 + 289 is about 300 + 300 = 600. Estimating tells you if your exact answer is reasonable." },
      ],
    },
    {
      id: "titus-math-u3",
      title: "Unit 3 · Multiplication Facts (the big one)",
      summary: "Understand multiplication and memorize the facts through 10.",
      lessons: [
        {
          id: "titus-math-u3-l1",
          title: "What Multiplication Is",
          objective: "Understand multiplication as equal groups and repeated addition.",
          teach: "Multiplication is just fast adding of equal groups. When you have the same number over and over, you don't have to add it one at a time. 4 × 3 means '4 groups of 3.' That's the same as 3 + 3 + 3 + 3 = 12. The times sign (×) is a shortcut for equal groups. God made a world of order, and counting equal groups is one little piece of that order.",
          memoryWork: "4 × 3 means '4 groups of 3.'",
          workedExample:
            "Buck fills 3 buckets with worms for the trip.\nEach bucket holds 5 worms, the SAME number each time.\nSlow way: 5 + 5 + 5.\nFast way: 3 groups of 5, which is 3 × 5.\nCount it up: 5, 10, 15.\nSo 3 × 5 = 15 worms. Same answer, way faster.",
          quiz: [
            {
              prompt: "What does 4 × 3 mean?",
              choices: ["4 groups of 3", "4 plus 3", "3 take away 4", "4 shared into 3"],
              correctIndex: 0,
              explanation: "Yes! 4 × 3 means 4 groups of 3, which is 3 + 3 + 3 + 3 = 12.",
            },
            {
              prompt: "Buck has 2 tackle boxes. Each holds 6 hooks. How many hooks in all?",
              choices: ["8", "6", "12", "62"],
              correctIndex: 2,
              explanation: "2 groups of 6 is 6 + 6 = 12. That's 2 × 6 = 12.",
            },
            {
              prompt: "Which adding problem is the same as 5 × 2?",
              choices: ["5 + 2", "2 + 5 + 2", "5 + 5 + 5 + 5 + 5", "2 + 2 + 2 + 2 + 2"],
              correctIndex: 3,
              explanation: "5 × 2 means 5 groups of 2: 2 + 2 + 2 + 2 + 2 = 10.",
            },
            {
              prompt: "3 + 3 + 3 + 3 is the same as which multiplication?",
              choices: ["3 × 3", "4 × 3", "4 + 3", "3 × 12"],
              correctIndex: 1,
              explanation: "Four 3's is 4 groups of 3, so 4 × 3 = 12.",
            },
            {
              prompt: "Buck catches 3 stringers with 3 bass on each. How many bass?",
              choices: ["6", "3", "9", "33"],
              correctIndex: 2,
              explanation: "3 groups of 3 is 3 + 3 + 3 = 9. That's 3 × 3 = 9.",
            },
          ],
        },
        { id: "titus-math-u3-l2", title: "×2s and ×5s", objective: "Master the 2 and 5 times tables.", teach: "×2 is just doubling. ×5 counts by fives (5, 10, 15, 20...) and always ends in 0 or 5. These are the easiest tables, learn them cold first.", memoryWork: "5s: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50." },
        { id: "titus-math-u3-l3", title: "×3s and ×4s", objective: "Master the 3 and 4 times tables.", teach: "×3 counts by threes; ×4 is double-double (4 × 6 = double 6 is 12, double again is 24). Chant them until they're automatic.", memoryWork: "3s: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30." },
        { id: "titus-math-u3-l4", title: "×6, ×7, ×8, ×9", objective: "Master the harder times tables through 9.", teach: "These are the ones that take real practice. Tricks help: ×9, the digits of the answer add to 9 (9×4=36, 3+6=9). Anything ×0 is 0; anything ×1 is itself. Keep drilling the ones that trip you up.", memoryWork: "Any number × 0 = 0. Any number × 1 = itself." },
        { id: "titus-math-u3-l5", title: "The Whole Table", objective: "Recall any fact 0–10 quickly and accurately.", teach: "Multiplication is commutative: 7 × 8 = 8 × 7, so learning one gives you both. Speed comes from memory, not counting. God made a world of order, and the times table is a little map of that order.", memoryWork: "7 × 8 = 56 (the one everybody forgets)." },
      ],
    },
    {
      id: "titus-math-u4",
      title: "Unit 4 · Division",
      summary: "Division as sharing and the inverse of multiplication.",
      lessons: [
        { id: "titus-math-u4-l1", title: "What Division Is", objective: "Understand division as splitting into equal groups.", teach: "Division shares a total into equal groups. 12 ÷ 3 asks 'how many groups of 3 are in 12?' or 'if I split 12 into 3 groups, how many each?' Both give 4.", memoryWork: "12 ÷ 3 = 'how many 3s make 12?'" },
        { id: "titus-math-u4-l2", title: "Division & Multiplication Are Partners", objective: "Use known multiplication facts to divide.", teach: "Every division fact hides a multiplication fact. 56 ÷ 7 = 8 because 7 × 8 = 56. If you know your times tables, you already know division, just run them backwards.", memoryWork: "Know 7 × 8 = 56, so 56 ÷ 7 = 8." },
        { id: "titus-math-u4-l3", title: "Remainders", objective: "Divide with remainders.", teach: "Sometimes it doesn't split evenly. 13 ÷ 4 = 3 with 1 left over (remainder 1), because 4 × 3 = 12 and one is left. Write it as '3 r1.'" },
        { id: "titus-math-u4-l4", title: "Fact Families", objective: "Write the multiplication and division facts for a set of numbers.", teach: "The numbers 6, 7, 42 make a family: 6×7=42, 7×6=42, 42÷6=7, 42÷7=6. Knowing families turns four facts into one thing to remember." },
      ],
    },
    {
      id: "titus-math-u5",
      title: "Unit 5 · Fractions, Measurement, Money & Word Problems",
      summary: "Parts of a whole, measuring, money, time, and real problems.",
      lessons: [
        { id: "titus-math-u5-l1", title: "Fractions as Parts of a Whole", objective: "Name and compare simple fractions (1/2, 1/3, 1/4).", teach: "A fraction is equal parts of one whole. The bottom (denominator) tells how many equal parts; the top (numerator) tells how many you have. Cut a fish into 4 equal parts and take 3: that's 3/4.", memoryWork: "Bottom = how many parts; top = how many you have." },
        { id: "titus-math-u5-l2", title: "Measurement: Length & Weight", objective: "Measure with inches/feet and understand pounds/ounces.", teach: "12 inches make a foot; 3 feet make a yard. Weight is measured in ounces and pounds (16 ounces = 1 pound). A big bass might weigh 2 pounds.", memoryWork: "12 inches = 1 foot. 16 ounces = 1 pound." },
        { id: "titus-math-u5-l3", title: "Money", objective: "Count coins and bills and make change.", teach: "Penny 1¢, nickel 5¢, dime 10¢, quarter 25¢. Count up to make change: from $1.00 for a 75¢ lure, count 75... 100, that's 25¢ back.", memoryWork: "quarter 25, dime 10, nickel 5, penny 1." },
        { id: "titus-math-u5-l4", title: "Telling Time", objective: "Tell time to the minute and figure elapsed time.", teach: "The short hand is hours, the long hand is minutes (count by 5s around the clock). Elapsed time: from 3:15 to 3:45 is 30 minutes of fishing." },
        { id: "titus-math-u5-l5", title: "Word Problems", objective: "Read a story problem, choose the operation, and solve it.", teach: "Underline the question, circle the numbers, decide: are we combining (add), taking away (subtract), making equal groups (multiply), or sharing (divide)? Then solve and check that the answer makes sense.", memoryWork: "Combine=add, take away=subtract, equal groups=multiply, share=divide." },
      ],
    },
  ],
  placement: [
    { prompt: "What is the value of the 7 in 372?", choices: ["7", "700", "70", "7,000"], correctIndex: 2, throughLessonId: "titus-math-u1-l1" },
    { prompt: "Round 68 to the nearest ten.", choices: ["60", "80", "70", "65"], correctIndex: 2, throughLessonId: "titus-math-u1-l4" },
    { prompt: "47 + 38 = ?", choices: ["75", "85", "83", "715"], correctIndex: 1, throughLessonId: "titus-math-u2-l1" },
    { prompt: "52 − 27 = ?", choices: ["35", "34", "15", "25"], correctIndex: 3, throughLessonId: "titus-math-u2-l2" },
    { prompt: "What does 4 × 3 mean?", choices: ["4 groups of 3", "4 plus 3", "3 take away 4", "4 shared into 3"], correctIndex: 0, throughLessonId: "titus-math-u3-l1" },
    { prompt: "7 × 8 = ?", choices: ["54", "48", "56", "63"], correctIndex: 2, throughLessonId: "titus-math-u3-l5" },
    { prompt: "56 ÷ 7 = ?", choices: ["7", "8", "9", "6"], correctIndex: 1, throughLessonId: "titus-math-u4-l2" },
    { prompt: "Which one shows three-fourths (3/4)?", choices: ["3 of 4 equal parts", "4 of 3 parts", "3 whole pieces", "one half"], correctIndex: 0, throughLessonId: "titus-math-u5-l1" },
  ],
};
