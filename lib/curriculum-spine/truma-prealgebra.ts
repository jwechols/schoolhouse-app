import type { Course } from "./types";

// Truma's math course. Her REAL books are Singapore Math "Dimensions Math" 5A + 5B
// (©2022 Singapore Math Inc.). This spine mirrors those two Home Instructor's Guide
// Schemes of Work exactly, chapter for chapter, lesson for lesson, so the app teaches
// what she is actually holding in her hands (JM, 2026-07-22: "she's not in pre-algebra
// yet, these are her books"). Singapore's grade 5 runs ahead of the US grade, so a 6th
// grader working 5A/5B is on-level placement.
//
// NOTE ON THE INTERNAL SLUG: the subject id stays "prealgebra" because that string is
// wired through the tutor route, practice, trophies, and progress tracking. Truma never
// sees it; every LABEL she sees now reads "Math". Renaming the slug would touch a dozen
// files for no student-visible gain, so we keep the slug and swap the content + labels.
//
// DEPTH: this first pass authors the complete 5A + 5B scope & sequence (every lesson has
// a title + objective, which drives the AI tutor and the parent plan). The three fraction
// units she is entering now (U4/U5/U6) plus U1 are richly authored with teach + memory
// work + worked examples, and U4 L1 "Fractions and Division" carries a full interactive
// teach->try->respond script (her flagship lesson). Later units carry solid objectives and
// teaching notes and get enriched as she reaches them. 5A Ch 7 (after "Fractions and Area")
// and Ch 8 (Volume) were not in the photographed pages; those lessons are filled from the
// standard published 5A sequence and marked `// verify`.
//
// The Reformed 1689 worldview surfaces only where it belongs: the order, proportion, and
// beauty of number reflect the God who made all things by measure, number, and weight.

export const TRUMA_PREALGEBRA: Course = {
  kidId: "truma",
  subject: "prealgebra",
  subjectLabel: "Math",
  emoji: "📐",
  gradeLabel: "5th Grade · Singapore 5A/5B",
  stage: "grammar",
  overview:
    "Truma's full year in Dimensions Math 5A and 5B. Book 5A secures the whole-number system (place value to the billions, multiplying and dividing by powers of ten), the language of expressions and order of operations, long multiplication and division, then the heart of the year: all four operations with fractions, followed by measurement and volume. Book 5B moves into decimals and their four operations, the geometry of angles and shapes, data and graphs, and finally ratio, rate, and percentage. The aim is fluent, well-understood number sense: Truma should both KNOW the procedures by heart and SEE why each one is true.",
  units: [
    // ════════════════════════════════════════════════════════════════════════
    // BOOK 5A
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "truma-prealgebra-u1",
      title: "Unit 1 · Whole Numbers (5A Ch 1)",
      summary: "Place value to the billions and multiplying/dividing by powers of ten.",
      lessons: [
        {
          id: "truma-prealgebra-u1-l1",
          title: "Numbers to One Billion",
          objective: "Read, write, and compare whole numbers up to the billions using place value.",
          tier: "standard",
          teach:
            "Our number system is built on groups of three: ones, thousands, millions, billions. Each place is ten times the one to its right, so a 7 in the millions place is worth 7,000,000. To read a large number, split it at the commas and name each group with its period: 4,082,000,315 is 'four billion, eighty-two million, three hundred fifteen.' Comparing large numbers is a place-value race: line them up and the first place where they differ decides which is greater.",
          memoryWork: "Periods left to right: billions, millions, thousands, ones. Each place is ×10 the place to its right.",
          workedExample:
            "Write 'three billion, six hundred five million, forty thousand, nine' in digits.\nBillions: 3\nMillions: 605\nThousands: 040\nOnes: 009\nPut the periods together: 3,605,040,009.",
          // Interactive lesson (Lydia's voice). Bake with:
          // npm run prebake -- truma prealgebra truma-prealgebra-u1-l1
          interactive: [
            {
              kind: "teach",
              text: "Today we climb to the billions. The whole system is built on one small pattern repeating, so the biggest numbers become easy.",
              say: "Hello again, Truma. Today we climb all the way to the billions, and I want you to relax, because this is far gentler than it looks. Every large number, no matter how many digits it has, is built from the same small pattern repeating. Learn the pattern once, and a nine digit number is no harder than a three digit one. We will take it one small idea at a time.",
            },
            {
              kind: "teach",
              text: "A period is a group of three digits. The commas in a number are the fences between periods.",
              say: "Here is the first idea. We bundle digits into groups of three, and each group is called a period. When you see a large number written with commas, those commas are not decoration. They are fences, and each one marks the end of one period and the start of the next. So the commas are already doing half of your reading for you.",
            },
            {
              kind: "try",
              prompt: "How many digits are in one period?",
              say: "A quick check before we go on. How many digits make up a single period?",
              choices: ["Three", "Ten"],
              correctIndex: 0,
              visual: "1,000,000  →  1 | 000 | 000",
              onRight: "Just right. Three digits to a period, and the commas keep the groups apart.",
              onWrong: "Look at how the commas sit: they fence off three digits at a time. Every period holds exactly three digits.",
            },
            {
              kind: "teach",
              text: "From right to left the periods are ones, thousands, millions, billions.",
              say: "Now let us name the periods. Starting from the right and moving left, the first group is the ones, then the thousands, then the millions, and then the billions. Say them in order with me: ones, thousands, millions, billions. Those four names are the ladder we will climb up and down for the rest of the lesson.",
            },
            {
              kind: "teach",
              text: "Inside every period the three places read ones, tens, hundreds.",
              say: "Look inside any single period and you find the same three places every time: ones, tens, and hundreds, reading from the right. This is why the pattern repeats so beautifully. The thousands period has its own ones, tens, and hundreds; so does the millions period. The same little three step pattern lives inside every fence.",
            },
            {
              kind: "teach",
              text: "Each place is worth ten times the place to its right. That is the engine of the whole system.",
              say: "And here is the engine that drives everything. Each place is worth exactly ten times the place just to its right. Step one place to the left and a digit is worth ten times more. Step again and it is ten times more still. That single rule, multiply by ten with each step, is what lets ten small symbols count all the way into the billions. There is a real orderliness here, and it is not an accident.",
            },
            {
              kind: "example",
              text: "7,000,000\nThe 7 has climbed two fences into the millions period, so it is worth seven million.",
              say: "Let me show you the engine at work. Take a seven followed by six zeros. Count the periods from the right: ones, thousands, millions. The seven has climbed two fences, into the millions period, so it is worth seven million. The six zeros are simply holding all the places beneath it open.",
            },
            {
              kind: "try",
              prompt: "In 7,000,000, the 7 sits in which period?",
              say: "Your turn to look closely. In the number seven million, a seven followed by six zeros, which period does that seven sit in?",
              choices: ["Millions", "Thousands"],
              correctIndex: 0,
              visual: "7,000,000  →  7 in the millions period",
              onRight: "Yes. Two commas up from the ones is the millions period, so the seven is worth seven million.",
              onWrong: "Count the periods from the right: ones, thousands, millions. The seven sits past two commas, so it lives in the millions period.",
            },
            {
              kind: "teach",
              text: "To READ a big number, split it at the commas and name each period, adding its period word.",
              say: "Let us put the ladder to use and read a large number. The method is simple: split the number at its commas, then move left to right, naming each three digit group and adding its period word, billion or million or thousand. You are really just reading four small numbers in a row and labeling each one. Watch me do one first.",
            },
            {
              kind: "example",
              text: "4,082,000,315\n4 billion · 082 million · 000 thousand · 315 ones\n= 'four billion, eighty-two million, three hundred fifteen.'",
              say: "Here is a giant number. Four, then zero eight two, then zero zero zero, then three one five. Read it one period at a time from the left. Four billion. Eighty-two million. No thousands at all, so we say nothing there. Three hundred fifteen. So the whole thing is: four billion, eighty-two million, three hundred fifteen. You just name each period and add its period word.",
            },
            {
              kind: "teach",
              text: "Now we read one together, slowly.",
              say: "Your turn to help me now. We will read this next one together, and I will walk beside you. Here is the number: five, then three zero zero, then zero zero zero, then zero zero zero. Four periods. Let us name them left to right and listen for the empty ones.",
            },
            {
              kind: "example",
              text: "5,300,000,000\nBillions: 5 · Millions: 300 · Thousands: 000 · Ones: 000\n= 'five billion, three hundred million.'",
              say: "The first period is five, in the billions, so five billion. The next is three hundred, in the millions, so three hundred million. The thousands are all zeros, so we say nothing for them. The ones are all zeros too. Put the spoken parts together and we have five billion, three hundred million. Notice how the empty periods simply stay silent.",
            },
            {
              kind: "try",
              prompt: "Read 6,000,400,000.",
              say: "Now you read one on your own. How do we say six, zero zero zero, four zero zero, zero zero zero?",
              choices: ["Six billion, four hundred thousand", "Six billion, four hundred million"],
              correctIndex: 0,
              visual: "6 , 000 , 400 , 000",
              onRight: "Yes. The four hundred sits in the thousands period, so it is four hundred thousand, and the empty millions stay silent. Six billion, four hundred thousand.",
              onWrong: "Find the four hundred first. It sits in the thousands period, the third fence from the right, so it is four hundred thousand, not four hundred million. Six billion, four hundred thousand.",
            },
            {
              kind: "try",
              prompt: "How do we read 2,014,000,007?",
              say: "One more reading, and this one has a gap in the middle. How do we read two, zero one four, zero zero zero, zero zero seven?",
              choices: ["Two billion, fourteen million, seven", "Two billion, fourteen thousand, seven"],
              correctIndex: 0,
              visual: "2 , 014 , 000 , 007",
              onRight: "Beautiful. The second period is fourteen million, the thousands are empty, and we finish with seven ones.",
              onWrong: "The zero one four sits in the millions period, so it is fourteen million, not fourteen thousand. The full read is two billion, fourteen million, seven.",
            },
            {
              kind: "teach",
              text: "To WRITE from words, build one period at a time, and pad every inner period to three digits so the commas land right.",
              say: "Now we turn the whole thing around and go from spoken words into written digits. You build the number one period at a time, writing the digits for each. Here is the one careful rule that trips people up: every period except the very first must be filled out to three digits, padding the front with zeros. That padding is exactly what keeps each comma landing in its proper place.",
            },
            {
              kind: "example",
              text: "'Three billion, six hundred five million, forty thousand, nine'\nBillions: 3 · Millions: 605 · Thousands: 040 · Ones: 009\n→ 3,605,040,009",
              say: "Watch this one built piece by piece. Three billion gives us a three. Six hundred five million gives six zero five. Forty thousand is only two digits, so we pad it to zero four zero. And nine ones becomes zero zero nine. Set the periods side by side: three, six zero five, zero four zero, zero zero nine. Three billion, six hundred five million, forty thousand, nine.",
            },
            {
              kind: "try",
              prompt: "In 3,605,040,009, which three digits fill the thousands period?",
              say: "Look back at the number we just built. Which three digits fill the thousands period?",
              choices: ["040", "400"],
              correctIndex: 0,
              visual: "3 , 605 , 040 , 009",
              onRight: "Exactly. Forty thousand is written zero four zero once we pad it to three digits.",
              onWrong: "Forty thousand has only two digits, so we pad the front with a zero: zero four zero. That is the third period from the right.",
            },
            {
              kind: "teach",
              text: "Let us write one from words together.",
              say: "Let us build one together now. I will say the words and we will place each period as we go. The number is seven billion, twenty million, five. Listen for how many periods that is, and notice where the empty ones hide.",
            },
            {
              kind: "example",
              text: "'Seven billion, twenty million, five'\nBillions: 7 · Millions: 020 · Thousands: 000 · Ones: 005\n→ 7,020,000,005",
              say: "Seven billion gives us a seven. Twenty million is only two digits, so we pad it to zero two zero. There is no thousands part spoken, so that whole period is zero zero zero. And five ones becomes zero zero five. Line them up: seven, zero two zero, zero zero zero, zero zero five. Seven billion, twenty million, five.",
            },
            {
              kind: "try",
              prompt: "Write 'four billion, ninety thousand, six' in digits.",
              say: "Your turn to write one alone. Put four billion, ninety thousand, six into digits. Watch the empty period and the padding.",
              choices: ["4,000,090,006", "4,090,000,006"],
              correctIndex: 0,
              visual: "Billions 4 · Millions 000 · Thousands 090 · Ones 006",
              onRight: "Exactly right. The millions are empty, so zero zero zero, and ninety thousand pads to zero nine zero. Four billion, ninety thousand, six is 4,000,090,006.",
              onWrong: "There is no millions part spoken, so that period is zero zero zero. Ninety thousand pads to zero nine zero in the thousands. That gives 4,000,090,006.",
            },
            {
              kind: "teach",
              text: "To COMPARE, line the numbers up by place and read left to right. The first place where they differ decides which is greater.",
              say: "Comparing large numbers is less about their size and more about lining them up. Give them the same number of places, then read from the left. The very moment you reach a place where the digits differ, the larger digit wins and you may stop. It is a race, and the leftmost difference is the finish line.",
            },
            {
              kind: "example",
              text: "4,180,000 vs 4,090,000\nMillions match (4 = 4). Next place: 1 vs 0. 1 wins.\n→ 4,180,000 is greater.",
              say: "Let me show you the race first. Compare four million one hundred eighty thousand with four million ninety thousand. Line them up and read from the left. The millions match, four and four, so we keep going. The next place is a one against a zero. One beats zero, and the race is over. Four million one hundred eighty thousand is greater, and we never even looked at the smaller places.",
            },
            {
              kind: "try",
              prompt: "Which is greater: 7,809,000 or 7,810,000?",
              say: "Now you run the race. Which is greater: seven million eight hundred nine thousand, or seven million eight hundred ten thousand?",
              choices: ["7,810,000", "7,809,000"],
              correctIndex: 0,
              visual: "7,80_ vs 7,81_  →  1 beats 0 in the ten-thousands",
              onRight: "Well run. They match until the ten-thousands place, where a one beats a zero, so 7,810,000 is greater.",
              onWrong: "Read from the left and stop at the first difference. They agree until the ten-thousands place, and there a one beats a zero, so 7,810,000 wins.",
            },
            {
              kind: "teach",
              text: "The pattern never stops. Past the billions comes the trillions, another group of three.",
              say: "Here is something wonderful about this pattern: it never runs out. Just past the billions comes the next period, the trillions, another group of three digits. And past that, still more. You will rarely need trillions, but I want you to see that nothing new has to be learned to reach them. The very same ladder, ones, tens, and hundreds inside each period, and times ten at every step, carries you as high as you could ever wish to count.",
            },
            {
              kind: "try",
              prompt: "Just past the billions period comes which period?",
              say: "A quick look further up the ladder. The period just past the billions, one more group of three to the left, is called what?",
              choices: ["Trillions", "Zillions"],
              correctIndex: 0,
              visual: "... trillions , billions , millions , thousands , ones",
              onRight: "Yes. Trillions comes next, and the pattern simply keeps repeating from there.",
              onWrong: "The true next period is the trillions. Zillion is a playful word, not a real place. After billions comes trillions.",
            },
            {
              kind: "teach",
              text: "Big numbers are not just exercises. They measure real things: people, miles, dollars.",
              say: "Let me show you why this matters far beyond a workbook. Big numbers describe the real world. The number of people alive in a country, the miles to a distant place, the dollars in a nation's budget. When you can read a nine digit number at a glance, the news and the world open up to you. Let us read a few true ones together.",
            },
            {
              kind: "example",
              text: "The United States has about 335,000,000 people.\n335 in the millions period.\n= 'three hundred thirty-five million.'",
              say: "The United States is home to about three hundred thirty-five million people. Look at the number: three three five, then six zeros. The three hundred thirty-five sits in the millions period, and the two empty periods beneath it are simply holding places open. Three hundred thirty-five million. You have just read a real fact about your own country.",
            },
            {
              kind: "try",
              prompt: "The moon is about 239,000 miles away. How do we read it?",
              say: "Here is a real distance. The moon sits about two three nine, followed by three zeros, miles away. How do we say that number?",
              choices: ["Two hundred thirty-nine thousand", "Two hundred thirty-nine million"],
              correctIndex: 0,
              visual: "239 , 000  →  thousands period",
              onRight: "Right. The two hundred thirty-nine sits in the thousands period, so the moon is about two hundred thirty-nine thousand miles away.",
              onWrong: "Count the periods: the two three nine sits in the thousands, not the millions. It is two hundred thirty-nine thousand miles.",
            },
            {
              kind: "try",
              prompt: "Write 'one hundred five million, sixty thousand' in digits.",
              say: "Write one more with me from words. Put one hundred five million, sixty thousand into digits. Mind the empty ones period and the padding.",
              choices: ["105,060,000", "105,600,000"],
              correctIndex: 0,
              visual: "Millions 105 · Thousands 060 · Ones 000",
              onRight: "Exactly. Sixty thousand pads to zero six zero, and the empty ones period is zero zero zero. That is 105,060,000.",
              onWrong: "Sixty thousand pads to zero six zero in the thousands, and the ones period is empty, zero zero zero. That gives 105,060,000.",
            },
            {
              kind: "try",
              prompt: "Which is greater: 1,209,000,000 or 1,210,000,000?",
              say: "One last race, and a close one. Which is greater: one billion two hundred nine million, or one billion two hundred ten million?",
              choices: ["1,210,000,000", "1,209,000,000"],
              correctIndex: 0,
              visual: "1,20_ vs 1,21_  →  1 beats 0 in the ten-millions",
              onRight: "Well run. They agree until the ten-millions place, where a one beats a zero, so 1,210,000,000 is greater.",
              onWrong: "Line them up and read left to right. They match until the ten-millions place, and there a one beats a zero, so 1,210,000,000 wins.",
            },
            {
              kind: "teach",
              text: "An empty period is still there. Its zeros hold every place open.",
              say: "One last idea worth naming. A period full of zeros is easy to rush past, but it is doing important work. Those zeros hold the places open so that every digit above them keeps its true value. Drop a zero and every number to its left slides down and loses ten times its worth. Zeros are not nothing; they are placeholders, and placeholders keep order.",
            },
            {
              kind: "memory",
              text: "Periods left to right: billions, millions, thousands, ones. Each place is ×10 the one to its right. Read and write one period at a time; compare from the left.",
              say: "Let us lock it in, Truma. The periods from left to right are billions, millions, thousands, ones. Every place is ten times the place to its right. You read and write one period at a time, and you compare from the left, stopping at the first difference. You have made numbers up to the billions obey you.",
            },
            {
              kind: "teach",
              text: "A closing thought: order like this is a gift, not an accident.",
              say: "Before you go, one thought worth keeping. The God who made the stars, and numbers each one, and calls them each by name, is a God of order and not of confusion. A number system this tidy, where ten small symbols climb in perfect tens all the way to the billions, is a small echo of that orderliness. When math feels clean and dependable, you are seeing something true about the One who made it. Well done today.",
            },
          ],
          quiz: [
            {
              prompt: "Reading from the right, the periods go:",
              choices: ["Ones, thousands, millions, billions", "Ones, tens, hundreds, thousands", "Ones, millions, thousands, billions"],
              correctIndex: 0,
              explanation: "Periods are groups of three, from the right: ones, thousands, millions, billions.",
            },
            {
              prompt: "In 5,600,000, what is the 5 worth?",
              choices: ["5,000,000", "500,000", "50,000"],
              correctIndex: 0,
              explanation: "The 5 sits in the millions period, so it is worth five million.",
            },
            {
              prompt: "Which is greater: 3,420,000 or 3,240,000?",
              choices: ["3,420,000", "3,240,000", "They are equal"],
              correctIndex: 0,
              explanation: "The millions match; in the hundred-thousands place a 4 beats a 2.",
            },
            {
              prompt: "Which digits show 'four million, twenty thousand'?",
              choices: ["4,020,000", "4,200,000", "420,000"],
              correctIndex: 0,
              explanation: "Four million is 4; twenty thousand pads to 020; the ones are 000, giving 4,020,000.",
            },
            {
              prompt: "Each place is worth how many times the place to its right?",
              choices: ["10", "2", "100"],
              correctIndex: 0,
              explanation: "Our system is base ten: every place is ten times the one to its right.",
            },
          ],
          practiceFocus: "Reading, writing, and comparing numbers to the billions.",
        },
        {
          id: "truma-prealgebra-u1-l2",
          title: "Multiplying by 10, 100, and 1,000",
          objective: "Multiply whole numbers by 10, 100, and 1,000 and explain the place-value shift.",
          teach:
            "Multiplying by ten does not 'add a zero' by magic: it slides every digit one place to the LEFT, because each digit becomes worth ten times as much. So 46 × 10 = 460, 46 × 100 = 4,600, 46 × 1,000 = 46,000. Count the zeros in the ten-number and that is how many places every digit shifts. Understanding the shift keeps you from getting lost with numbers that already end in zeros.",
          memoryWork: "×10 shifts one place left, ×100 shifts two, ×1,000 shifts three. Zeros = places shifted.",
          practiceFocus: "Multiplying by 10, 100, 1,000 and combinations.",
        },
        {
          id: "truma-prealgebra-u1-l3",
          title: "Dividing by 10, 100, and 1,000",
          objective: "Divide whole numbers by 10, 100, and 1,000 and interpret the place-value shift.",
          teach:
            "Dividing by ten is the mirror of multiplying: every digit slides one place to the RIGHT, because each digit becomes worth one tenth as much. So 8,500 ÷ 10 = 850, ÷ 100 = 85, ÷ 1,000 = 8.5. When the shift pushes digits past the ones place you get a decimal, which is your bridge into Book 5B.",
          memoryWork: "÷10 shifts one place right, ÷100 two, ÷1,000 three. Opposite of multiplying.",
          practiceFocus: "Dividing by 10, 100, 1,000; noticing when a decimal appears.",
        },
        {
          id: "truma-prealgebra-u1-l4",
          title: "Multiplying by Tens, Hundreds, and Thousands",
          objective: "Multiply by multiples of ten (e.g., 30, 600, 4,000) using a known fact plus the zeros.",
          teach:
            "To multiply by a multiple of ten, split it into a single-digit fact and a power of ten. For 24 × 30, think 24 × 3 = 72, then × 10 = 720. For 24 × 600: 24 × 6 = 144, then × 100 = 14,400. The known fact does the work; the zeros just shift the place value.",
          memoryWork: "Multiple of ten = (single-digit fact) × (power of ten). Do the fact, then shift.",
          practiceFocus: "Multiplying by 20, 300, 5,000, etc.",
        },
        {
          id: "truma-prealgebra-u1-l5",
          title: "Dividing by Tens, Hundreds, and Thousands",
          objective: "Divide by multiples of ten using a known fact and the place-value shift.",
          teach:
            "Dividing by a multiple of ten works the same way in reverse. For 1,800 ÷ 30, peel off the matching zeros: 180 ÷ 3 = 60. For 24,000 ÷ 600: 240 ÷ 6 = 40. Cancel the same number of zeros from top and bottom first, then use the basic fact.",
          memoryWork: "Cancel matching zeros, then divide with the basic fact.",
          practiceFocus: "Dividing by 20, 400, 6,000, etc.",
        },
        {
          id: "truma-prealgebra-u1-l6",
          title: "Practice",
          objective: "Mix place value and powers-of-ten multiplication and division in review problems.",
          teach:
            "This practice ties Chapter 1 together: read and compare large numbers, then multiply and divide by tens, hundreds, and thousands fluently. Watch the direction of the shift, left for multiply, right for divide, and check that your answer's size makes sense.",
          memoryWork: "Multiply → left, bigger. Divide → right, smaller. Zeros tell you how far.",
          practiceFocus: "Chapter 1 review across all lessons.",
        },
      ],
    },
    {
      id: "truma-prealgebra-u2",
      title: "Unit 2 · Writing and Evaluating Expressions (5A Ch 2)",
      summary: "Parentheses, the order of operations, and turning word problems into expressions.",
      lessons: [
        {
          id: "truma-prealgebra-u2-l1",
          title: "Expressions with Parentheses",
          objective: "Write and evaluate expressions that use parentheses to group operations.",
          teach:
            "An expression is a math phrase, like 5 + 3 × 2. Parentheses are grouping symbols: they say 'do me first.' So (5 + 3) × 2 = 16, but 5 + (3 × 2) = 11. The same numbers give different answers depending on what is grouped, which is exactly why we need a shared rule.",
          memoryWork: "Parentheses mean 'do this first.' Grouping changes the answer.",
          workedExample: "Evaluate (12 - 4) × 3.\nInside the parentheses first: 12 - 4 = 8.\nThen multiply: 8 × 3 = 24.",
          practiceFocus: "Evaluating expressions with parentheses.",
        },
        {
          id: "truma-prealgebra-u2-l2",
          title: "Order of Operations, Part 1",
          objective: "Apply order of operations with parentheses, multiplication, and division.",
          teach:
            "Everyone must read an expression the same way, so we agree on an order: first anything in Parentheses, then Multiplication and Division left to right, then Addition and Subtraction left to right. In 20 - 12 ÷ 4, division comes before subtraction: 12 ÷ 4 = 3, then 20 - 3 = 17.",
          memoryWork: "Order: Parentheses → ×/÷ (left to right) → +/− (left to right).",
          practiceFocus: "Order of operations without exponents.",
        },
        {
          id: "truma-prealgebra-u2-l3",
          title: "Order of Operations, Part 2",
          objective: "Evaluate multi-step expressions with nested grouping and all four operations.",
          teach:
            "Longer expressions can nest one grouping inside another. Work from the innermost parentheses outward, then follow the same ×/÷ before +/− rule. Take it one operation at a time and rewrite the whole expression after each step so you never lose your place.",
          memoryWork: "Innermost parentheses first. Rewrite the whole line after each step.",
          practiceFocus: "Multi-step expressions with nested parentheses.",
        },
        {
          id: "truma-prealgebra-u2-l4",
          title: "Other Ways to Write and Evaluate Expressions",
          objective: "Recognize equivalent expressions and different notations for the same value.",
          teach:
            "The same quantity can be written many ways: 3 × (4 + 5) equals 3 × 4 + 3 × 5, and a fraction bar can act like a grouping symbol and a division at once. Learning to see when two expressions are equal is the first taste of algebra.",
          memoryWork: "Different-looking expressions can have the same value. The fraction bar groups AND divides.",
          practiceFocus: "Matching and evaluating equivalent expressions.",
        },
        {
          id: "truma-prealgebra-u2-l5",
          title: "Word Problems, Part 1",
          objective: "Translate one- and two-step word problems into numerical expressions.",
          teach:
            "The skill is turning words into an expression before you compute. 'Three boxes of 12 crayons, then 5 given away' becomes 3 × 12 - 5. Underline the numbers, decide the operations, and use parentheses to keep the order the story intends.",
          memoryWork: "Read → write the expression → then compute. Parentheses protect the story's order.",
          practiceFocus: "Writing expressions from word problems.",
        },
        {
          id: "truma-prealgebra-u2-l6",
          title: "Word Problems, Part 2",
          objective: "Solve multi-step word problems using expressions and check for reasonableness.",
          teach:
            "Harder problems hide two or three steps. Break the story into parts, write an expression for each, then combine. After computing, look back: does the size of the answer make sense for the story? A quick estimate guards against slips.",
          memoryWork: "Break the story into steps. Estimate to check the answer is reasonable.",
          practiceFocus: "Multi-step word problems.",
        },
        {
          id: "truma-prealgebra-u2-l7",
          title: "Practice",
          objective: "Review expressions, order of operations, and word-problem translation.",
          teach:
            "Chapter 2 review: evaluate expressions accurately with the agreed order, and translate word problems into expressions before solving. Precision with the rule is what carries into algebra.",
          memoryWork: "Same order every time: Parentheses, ×/÷, +/−.",
          practiceFocus: "Chapter 2 review.",
        },
      ],
    },
    {
      id: "truma-prealgebra-u3",
      title: "Unit 3 · Multiplication and Division (5A Ch 3)",
      summary: "Multiplying by 2-digit numbers and long division by 2-digit divisors.",
      lessons: [
        {
          id: "truma-prealgebra-u3-l1",
          title: "Multiplying by a 2-Digit Number, Part 1",
          objective: "Multiply a number by a 2-digit number using partial products.",
          teach:
            "Multiplying by a two-digit number is really two multiplications added together. For 34 × 26, multiply by the 6 (ones) and by the 20 (tens) separately, then add: 34 × 6 = 204 and 34 × 20 = 680, so 204 + 680 = 884. Seeing the two partial products keeps the standard algorithm from feeling like a mystery.",
          memoryWork: "Two-digit multiply = (× ones) + (× tens). The tens row shifts one place left.",
          workedExample: "23 × 15\n23 × 5 = 115\n23 × 10 = 230\n115 + 230 = 345.",
          practiceFocus: "2-digit multiplication with partial products.",
        },
        {
          id: "truma-prealgebra-u3-l2",
          title: "Multiplying by a 2-Digit Number, Part 2",
          objective: "Multiply larger numbers by a 2-digit number fluently with regrouping.",
          teach:
            "Now stretch to three- and four-digit numbers times a two-digit number, carrying (regrouping) as needed. The method is identical: multiply by the ones, multiply by the tens (shifted one place), add. Neatness with the columns is what prevents errors.",
          memoryWork: "Keep columns lined up. Regroup carefully. Add the two rows.",
          practiceFocus: "Multi-digit × 2-digit with regrouping.",
        },
        {
          id: "truma-prealgebra-u3-l3",
          title: "Practice A",
          objective: "Practice 2-digit multiplication in calculations and word problems.",
          teach:
            "Practice makes two-digit multiplication automatic. Alternate between plain calculations and short word problems so the skill sticks in both forms.",
          memoryWork: "Ones row, tens row (shifted), add.",
          practiceFocus: "2-digit multiplication practice.",
        },
        {
          id: "truma-prealgebra-u3-l4",
          title: "Dividing by a Multiple of Ten",
          objective: "Divide by multiples of ten (e.g., ÷ 40) using estimation and known facts.",
          teach:
            "To divide by a multiple of ten, use a friendly fact and estimate. 3,600 ÷ 40: think 360 ÷ 4 = 90. Estimating first tells you roughly how big the quotient should be, which anchors the long-division steps that follow.",
          memoryWork: "Estimate first. Cancel a zero: ÷40 is like ÷4 after dropping a zero.",
          practiceFocus: "Dividing by 20, 30, 40, 50.",
        },
        {
          id: "truma-prealgebra-u3-l5",
          title: "Divide a 2-Digit Number by a 2-Digit Number",
          objective: "Perform long division of a 2-digit number by a 2-digit divisor.",
          teach:
            "Long division is a repeating cycle: Divide, Multiply, Subtract, Bring down. For 84 ÷ 21, estimate 21 into 84 (about 4), multiply 21 × 4 = 84, subtract to get 0. Estimating the quotient digit is the hard part, and it gets easier with the divisibility and rounding sense you already have.",
          memoryWork: "Long division cycle: Divide, Multiply, Subtract, Bring down. Repeat.",
          practiceFocus: "2-digit ÷ 2-digit long division.",
        },
        {
          id: "truma-prealgebra-u3-l6",
          title: "Divide a 3-Digit Number by a 2-Digit Number, Part 1",
          objective: "Divide a 3-digit number by a 2-digit divisor, no remainder.",
          teach:
            "With a three-digit dividend, start by asking whether the divisor fits into the first two digits. For machines like 476 ÷ 28, 28 goes into 47 once (28), subtract to 19, bring down the 6 to make 196, and 28 × 7 = 196. Same cycle, one more step.",
          memoryWork: "Ask: does the divisor fit the first two digits? If not, use three.",
          practiceFocus: "3-digit ÷ 2-digit, exact quotients.",
        },
        {
          id: "truma-prealgebra-u3-l7",
          title: "Divide a 3-Digit Number by a 2-Digit Number, Part 2",
          objective: "Divide a 3-digit number by a 2-digit divisor with remainders and interpretation.",
          teach:
            "Not every division comes out even. A remainder is what is left over after the last subtraction, and it must always be smaller than the divisor. In word problems, the remainder decides whether you round up (need another bus) or drop it (leftover cannot fill a box).",
          memoryWork: "Remainder < divisor, always. In word problems, decide what the remainder means.",
          practiceFocus: "3-digit ÷ 2-digit with remainders.",
        },
        {
          id: "truma-prealgebra-u3-l8",
          title: "Divide a 4-Digit Number by a 2-Digit Number",
          objective: "Divide a 4-digit number by a 2-digit divisor fluently.",
          teach:
            "Four-digit dividends just add another round of the same cycle. Keep your digits in tidy columns and write each quotient digit directly above the digit you are working on, so place value stays correct.",
          memoryWork: "Same cycle, more rounds. Quotient digit sits above the digit you used.",
          practiceFocus: "4-digit ÷ 2-digit long division.",
        },
        {
          id: "truma-prealgebra-u3-l9",
          title: "Practice B",
          objective: "Review multi-digit multiplication and long division together.",
          teach:
            "Chapter 3 review: multiply by two-digit numbers and divide by two-digit divisors, including remainders. Check each division by multiplying the quotient back and adding the remainder.",
          memoryWork: "Check division: (quotient × divisor) + remainder = dividend.",
          practiceFocus: "Chapter 3 review.",
        },
      ],
    },
    {
      id: "truma-prealgebra-u4",
      title: "Unit 4 · Addition and Subtraction of Fractions (5A Ch 4)",
      summary: "Fractions as division, unlike denominators, and adding/subtracting mixed numbers.",
      lessons: [
        {
          id: "truma-prealgebra-u4-l1",
          title: "Fractions and Division",
          objective: "Understand a fraction as a division and write any division as a fraction.",
          teach:
            "A fraction is a division problem in disguise: the bar means 'divide.' So 3/4 means 3 ÷ 4, and if you share 3 cookies equally among 4 girls, each gets 3/4 of a cookie. It works both ways: any division can be written as a fraction, so 7 ÷ 4 = 7/4. When the top is larger than the bottom, the fraction is more than one whole, and you can rewrite it as a mixed number: 7/4 = 1 3/4.",
          memoryWork: "The fraction bar means DIVIDE. Top ÷ bottom. 7 ÷ 4 = 7/4 = 1 3/4.",
          workedExample:
            "Share 5 pizzas equally among 4 friends.\nEach share is 5 ÷ 4 = 5/4 of a pizza.\n5/4 is more than one whole: 5/4 = 1 1/4.\nSo each friend gets 1 whole pizza and 1/4 more.",
          // FLAGSHIP interactive lesson (Lydia's voice). Spoken lines fall back to live
          // TTS until pre-baked with: npm run prebake -- truma prealgebra truma-prealgebra-u4-l1
          interactive: [
            {
              kind: "teach",
              text: "Today's big idea: a fraction is really a division problem in disguise. The fraction bar means 'divide.'",
              say: "Hello, Truma. We're starting fractions, and I want to give you the one key that unlocks all of them. Here it is. A fraction is really a division problem in disguise. That little bar in the middle? It means 'divide.' Let me show you why that's true, step by step, before you try anything.",
            },
            {
              kind: "teach",
              text: "Start with something you already know. Share 1 pizza equally between 2 people. Each person gets 1 ÷ 2 of a pizza, and we write that as the fraction 1/2.",
              say: "Start with something you already know. Take one pizza and share it equally between two people. Each person gets one divided by two of a pizza. And what do we call one divided by two? One half. So the sharing and the fraction are the very same thing. The fraction is just the answer to a sharing problem.",
            },
            {
              kind: "teach",
              text: "The top number is WHAT you share. The bottom number is HOW MANY share it. So in 3/4, you share 3 things among 4 people.",
              say: "Here's how to read any fraction. The top number is what you are sharing. The bottom number is how many people are sharing it. So three fourths means: share three things among four people. Keep that in your mind as we work a real example together.",
            },
            {
              kind: "example",
              text: "Share 3 cookies equally among 4 girls.\n3 cookies ÷ 4 girls.\nGive each girl a fourth of every cookie.\nEach girl collects 3 of those fourths.\nSo 3 ÷ 4 = 3/4. Each girl gets 3/4 of a cookie.",
              say: "Let's work it together. Three cookies, four girls, shared fairly. Cut every cookie into four equal pieces, and give each girl one piece from each cookie. Since there are three cookies, each girl ends up with three of those fourths. So three divided by four equals three fourths. Watch how the division and the fraction gave the exact same answer.",
            },
            {
              kind: "teach",
              text: "So now you can read it both ways: 3/4 means 3 ÷ 4. The fraction and the division are the same.",
              say: "So now you can read it both ways. Three fourths means three divided by four. Same thing, two costumes. Now you're ready to try one.",
            },
            {
              kind: "try",
              prompt: "What does the fraction 5/8 mean as a division?",
              say: "Your turn. What does the fraction five eighths mean as a division?",
              choices: ["5 ÷ 8", "8 ÷ 5"],
              correctIndex: 0,
              visual: "5/8  →  5 ÷ 8",
              onRight: "Exactly. Five eighths means five divided by eight. Top divided by bottom, every time.",
              onWrong: "Look at the bar again. The top goes first: five eighths means five divided by eight, not eight divided by five.",
            },
            {
              kind: "teach",
              text: "It works backwards too. Any division can be written as a fraction: 7 ÷ 4 = 7/4.",
              say: "Now here's the beautiful part, and again I'll show you before you try. It works backwards too. Any division you meet can be turned into a fraction. Seven divided by four is simply seven fourths. The number being divided goes on top.",
            },
            {
              kind: "example",
              text: "Turn 7 ÷ 4 into a number.\n4 goes into 7 one time, with 3 left over.\nThe 3 left over is 3 fourths.\nSo 7 ÷ 4 = 7/4 = 1 3/4.",
              say: "Let's work this one together too. Seven divided by four. Four goes into seven one whole time, and three are left over. Those three left over are three fourths. So seven fourths is the same as one whole and three fourths. A top bigger than the bottom just means more than one whole.",
            },
            {
              kind: "try",
              prompt: "Write 9 ÷ 10 as a fraction.",
              say: "Try this one. How do you write nine divided by ten as a fraction?",
              choices: ["9/10", "10/9"],
              correctIndex: 0,
              visual: "9 ÷ 10  →  9/10",
              onRight: "Yes. Nine divided by ten is nine tenths. The number being divided sits on top.",
              onWrong: "The number being divided goes on top. Nine divided by ten is nine tenths, or 9/10.",
            },
            {
              kind: "teach",
              text: "When the top is bigger than the bottom, the fraction is more than one whole. 7/4 = 1 3/4.",
              say: "One more idea. When the top number is bigger than the bottom, the fraction is worth more than one whole. Seven fourths is one whole and three fourths left over, which we write as one and three fourths.",
            },
            {
              kind: "try",
              prompt: "Write 7 ÷ 2 as a mixed number.",
              say: "Last check. What is seven divided by two, written as a mixed number?",
              choices: ["3 1/2", "2 3/4"],
              correctIndex: 0,
              visual: "7 ÷ 2 = 3 r1  →  3 1/2",
              onRight: "Beautifully done. Seven divided by two is three with one half left over: three and one half.",
              onWrong: "Divide first: two goes into seven three times, with one left over. That one is one half, so the answer is three and one half.",
            },
            {
              kind: "memory",
              text: "The fraction bar means DIVIDE. Top ÷ bottom. A top bigger than the bottom is more than one whole.",
              say: "Lock this in: the fraction bar means divide. Top divided by bottom. And when the top is bigger than the bottom, you have more than one whole. You just unlocked fractions, Truma.",
            },
          ],
          quiz: [
            {
              prompt: "What does 4/5 mean as a division?",
              choices: ["4 ÷ 5", "5 ÷ 4", "4 × 5"],
              correctIndex: 0,
              explanation: "The bar means divide, top first: 4 ÷ 5.",
            },
            {
              prompt: "Write 11 ÷ 3 as a fraction.",
              choices: ["11/3", "3/11", "8/3"],
              correctIndex: 0,
              explanation: "The number being divided goes on top: 11/3.",
            },
            {
              prompt: "Which mixed number equals 9/4?",
              choices: ["2 1/4", "1 3/4", "4 1/2"],
              correctIndex: 0,
              explanation: "4 goes into 9 twice with 1 left over: 2 1/4.",
            },
            {
              prompt: "If 3 pies are shared equally among 4 people, how much does each get?",
              choices: ["3/4 of a pie", "4/3 of a pie", "3 pies"],
              correctIndex: 0,
              explanation: "3 ÷ 4 = 3/4 of a pie each.",
            },
          ],
          practiceFocus: "Fraction as division; converting between improper fractions and mixed numbers.",
        },
        {
          id: "truma-prealgebra-u4-l2",
          title: "Adding Unlike Fractions",
          objective: "Add fractions with unlike denominators by finding a common denominator.",
          teach:
            "You can only add fractions when the pieces are the same size, that is, when the denominators match. To add 1/2 + 1/3, rename both to the same denominator using the least common multiple of 2 and 3, which is 6: 1/2 = 3/6 and 1/3 = 2/6, so 3/6 + 2/6 = 5/6. Add the numerators only; the denominator names the piece size and stays put.",
          memoryWork: "Common denominator first (use the LCM). Add numerators, keep the denominator.",
          workedExample:
            "3/4 + 1/6\nLCM of 4 and 6 is 12.\n3/4 = 9/12 and 1/6 = 2/12.\n9/12 + 2/12 = 11/12.",
          // Interactive lesson (Lydia's voice). Bake with:
          // npm run prebake -- truma prealgebra truma-prealgebra-u4-l2
          interactive: [
            {
              kind: "teach",
              text: "Big idea: you can only add fractions when the pieces are the same size, that is, when the bottom numbers match.",
              say: "Welcome back, Truma. Last time you learned the fraction bar means divide. Today we add fractions, and there is one rule that governs all of it. You can only add fractions when the pieces are the same size. That means the bottom numbers, the denominators, have to match. Let me show you why before you try anything.",
            },
            {
              kind: "teach",
              text: "1/2 and 1/3 name different-sized pieces. A half is bigger than a third, so we cannot just add them as they stand.",
              say: "Look at one half and one third. A half is a bigger piece than a third. Adding them as they are would be like adding one apple and one orange and calling the answer two apples. It does not work. We first have to make the pieces the same kind.",
            },
            {
              kind: "example",
              text: "Rename both to sixths.\n1/2 = 3/6\n1/3 = 2/6\nNow the pieces match, so add: 3/6 + 2/6 = 5/6.",
              say: "Here is the fix, done for you. We rename both fractions into sixths, because six is the smallest number that both two and three divide into. One half becomes three sixths. One third becomes two sixths. Now every piece is a sixth, so we simply add: three sixths plus two sixths is five sixths.",
            },
            {
              kind: "teach",
              text: "The plan every time: find the least common multiple of the denominators, rename both fractions to it, then add the numerators. The denominator stays.",
              say: "So here is the plan you will use every single time. Find the least common multiple of the two bottom numbers. Rename both fractions to that new denominator. Then add only the top numbers. The bottom number names the piece size, so it stays put.",
            },
            {
              kind: "try",
              prompt: "To add 1/4 + 1/3, what size pieces can both become?",
              say: "Your turn. To add one fourth and one third, what size pieces can both of them become?",
              choices: ["Twelfths", "Sevenths"],
              correctIndex: 0,
              visual: "4 and 3  →  LCM = 12",
              onRight: "Yes. Twelve is the least common multiple of four and three, so both become twelfths.",
              onWrong: "Do not add the denominators. Look for the smallest number both four and three divide into. That is twelve, so both become twelfths.",
            },
            {
              kind: "teach",
              text: "Add the numerators only. The denominator names the piece and never gets added.",
              say: "One caution before the next example. You add the top numbers only. The bottom number is the name of the piece, like the word sixths, and you would never add a name to a name. It stays the same.",
            },
            {
              kind: "example",
              text: "3/4 + 1/6\nLCM of 4 and 6 is 12.\n3/4 = 9/12 and 1/6 = 2/12.\n9/12 + 2/12 = 11/12.",
              say: "Let us work a harder one together. Three fourths plus one sixth. The least common multiple of four and six is twelve. Three fourths becomes nine twelfths. One sixth becomes two twelfths. Now add the tops: nine plus two is eleven. The answer is eleven twelfths.",
            },
            {
              kind: "try",
              prompt: "Rename 3/4 into twelfths.",
              say: "Try a step. What is three fourths renamed as twelfths?",
              choices: ["9/12", "7/12"],
              correctIndex: 0,
              visual: "3/4  ×3/3  =  9/12",
              onRight: "Exactly. Multiply top and bottom by three: three fourths is nine twelfths.",
              onWrong: "Four times three is twelve, so multiply the top by three as well: three times three is nine. Three fourths is nine twelfths.",
            },
            {
              kind: "try",
              prompt: "Now finish it: 9/12 + 2/12 = ?",
              say: "Now finish the problem. Nine twelfths plus two twelfths equals what?",
              choices: ["11/12", "11/24"],
              correctIndex: 0,
              visual: "9/12 + 2/12  →  add tops, keep 12ths",
              onRight: "Beautiful. Add the tops, keep the twelfths: eleven twelfths.",
              onWrong: "Add only the top numbers and keep the same denominator. Nine plus two is eleven, over twelfths: eleven twelfths.",
            },
            {
              kind: "teach",
              text: "Last step of good work: simplify the answer if the top and bottom share a factor. 5/10 would become 1/2.",
              say: "One last habit of careful mathematicians. When you finish, check whether the answer can be simplified. If the top and bottom share a common factor, reduce it. Five tenths, for instance, would become one half. Eleven twelfths shares nothing, so it is already in lowest terms.",
            },
            {
              kind: "try",
              prompt: "Add 1/2 + 1/3.",
              say: "Here is the whole thing on your own. What is one half plus one third?",
              choices: ["5/6", "2/5"],
              correctIndex: 0,
              visual: "1/2 = 3/6, 1/3 = 2/6  →  5/6",
              onRight: "Well reasoned, Truma. Both became sixths, three sixths and two sixths, which add to five sixths.",
              onWrong: "Never add across like that. Rename both to sixths first: one half is three sixths, one third is two sixths. Together they make five sixths.",
            },
            {
              kind: "memory",
              text: "Common denominator first (use the LCM). Add the numerators, keep the denominator, then simplify.",
              say: "Lock it in. Common denominator first, using the least common multiple. Add the top numbers, keep the bottom, then simplify. You now own adding fractions.",
            },
          ],
          quiz: [
            {
              prompt: "Before you can add 1/2 + 1/5, you must first:",
              choices: ["Give them a common denominator", "Add the denominators", "Multiply the tops"],
              correctIndex: 0,
              explanation: "Pieces must be the same size first: rename to a common denominator.",
            },
            {
              prompt: "What is the least common denominator for 1/4 and 1/6?",
              choices: ["12", "24", "10"],
              correctIndex: 0,
              explanation: "The least common multiple of 4 and 6 is 12.",
            },
            {
              prompt: "1/3 + 1/6 = ?",
              choices: ["1/2", "2/9", "2/6"],
              correctIndex: 0,
              explanation: "1/3 = 2/6, so 2/6 + 1/6 = 3/6 = 1/2.",
            },
            {
              prompt: "3/4 + 1/8 = ?",
              choices: ["7/8", "4/12", "7/12"],
              correctIndex: 0,
              explanation: "3/4 = 6/8, so 6/8 + 1/8 = 7/8.",
            },
            {
              prompt: "When you add the numerators, the denominator:",
              choices: ["Stays the same", "Is added too", "Doubles"],
              correctIndex: 0,
              explanation: "The denominator names the piece size and stays put.",
            },
          ],
          practiceFocus: "Adding fractions with unlike denominators; simplifying answers.",
        },
        {
          id: "truma-prealgebra-u4-l3",
          title: "Subtracting Unlike Fractions",
          objective: "Subtract fractions with unlike denominators using a common denominator.",
          teach:
            "Subtraction follows the same rule as addition: make the pieces the same size first. For 3/4 - 1/6, rename to twelfths: 9/12 - 2/12 = 7/12. Find the common denominator, rename, subtract the numerators, then simplify if you can.",
          memoryWork: "Same size pieces first. Subtract numerators, keep the denominator, simplify.",
          workedExample: "5/6 - 1/4\nLCM of 6 and 4 is 12.\n5/6 = 10/12 and 1/4 = 3/12.\n10/12 - 3/12 = 7/12.",
          practiceFocus: "Subtracting fractions with unlike denominators.",
        },
        {
          id: "truma-prealgebra-u4-l4",
          title: "Practice A",
          objective: "Practice adding and subtracting unlike fractions and simplifying.",
          teach:
            "Practice mixing addition and subtraction of unlike fractions. The habit is always the same: common denominator, operate on numerators, simplify. Reducing with the GCF keeps answers in lowest terms.",
          memoryWork: "Common denominator → operate → simplify to lowest terms.",
          practiceFocus: "Mixed add/subtract of unlike fractions.",
        },
        {
          id: "truma-prealgebra-u4-l5",
          title: "Adding Mixed Numbers, Part 1",
          objective: "Add mixed numbers with unlike denominators, no regrouping.",
          teach:
            "A mixed number is a whole plus a fraction. To add mixed numbers, add the whole parts and the fraction parts separately, renaming the fractions to a common denominator first. 2 1/4 + 1 1/2 = (2 + 1) + (1/4 + 2/4) = 3 + 3/4 = 3 3/4.",
          memoryWork: "Add wholes and fractions separately. Common denominator for the fraction parts.",
          workedExample: "1 1/3 + 2 1/6\nWholes: 1 + 2 = 3.\nFractions: 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2.\nTotal: 3 1/2.",
          practiceFocus: "Adding mixed numbers, no regrouping.",
        },
        {
          id: "truma-prealgebra-u4-l6",
          title: "Adding Mixed Numbers, Part 2",
          objective: "Add mixed numbers where the fraction parts regroup into another whole.",
          teach:
            "Sometimes the fraction parts add up to more than one whole. 2 3/4 + 1 1/2: fractions give 3/4 + 2/4 = 5/4 = 1 1/4. Carry that extra whole: 2 + 1 + 1 = 4, plus 1/4, so 4 1/4. When the fraction total is improper, convert and regroup.",
          memoryWork: "If the fraction parts exceed one whole, carry the extra whole over.",
          workedExample: "3 2/3 + 1 2/3\nFractions: 2/3 + 2/3 = 4/3 = 1 1/3.\nWholes: 3 + 1 + 1 = 5.\nTotal: 5 1/3.",
          practiceFocus: "Adding mixed numbers with regrouping.",
        },
        {
          id: "truma-prealgebra-u4-l7",
          title: "Subtracting Mixed Numbers, Part 1",
          objective: "Subtract mixed numbers with unlike denominators, no borrowing.",
          teach:
            "Subtract mixed numbers by handling wholes and fractions separately, after renaming to a common denominator. 3 3/4 - 1 1/2 = (3 - 1) + (3/4 - 2/4) = 2 + 1/4 = 2 1/4. This works cleanly when the top fraction is larger than the bottom one.",
          memoryWork: "Subtract wholes and fractions separately, common denominator first.",
          workedExample: "4 5/6 - 2 1/3\nFractions: 5/6 - 2/6 = 3/6 = 1/2.\nWholes: 4 - 2 = 2.\nTotal: 2 1/2.",
          practiceFocus: "Subtracting mixed numbers, no borrowing.",
        },
        {
          id: "truma-prealgebra-u4-l8",
          title: "Subtracting Mixed Numbers, Part 2",
          objective: "Subtract mixed numbers that require borrowing one whole as a fraction.",
          teach:
            "When the top fraction is smaller than the bottom one, borrow one whole and add it to the fraction as a full set of pieces. 4 1/4 - 1 3/4: borrow one whole from the 4 to make 3 5/4, then 5/4 - 3/4 = 2/4 and 3 - 1 = 2, giving 2 2/4 = 2 1/2.",
          memoryWork: "Not enough fraction to subtract? Borrow one whole = one full denominator of pieces.",
          workedExample: "5 1/3 - 2 2/3\nBorrow: 5 1/3 = 4 4/3.\nFractions: 4/3 - 2/3 = 2/3.\nWholes: 4 - 2 = 2.\nTotal: 2 2/3.",
          practiceFocus: "Subtracting mixed numbers with borrowing.",
        },
        {
          id: "truma-prealgebra-u4-l9",
          title: "Practice B",
          objective: "Review adding and subtracting fractions and mixed numbers, including regrouping.",
          teach:
            "Chapter 4 review: unlike denominators, mixed numbers, carrying and borrowing. Common denominator first, operate on the parts, simplify. This chapter is the backbone of fraction work, so aim for real fluency.",
          memoryWork: "Common denominator, operate, regroup if needed, simplify.",
          practiceFocus: "Chapter 4 review.",
        },
      ],
    },
    {
      id: "truma-prealgebra-u5",
      title: "Unit 5 · Multiplication of Fractions (5A Ch 5)",
      summary: "Fraction × whole, fraction × fraction, mixed numbers, and reciprocals.",
      lessons: [
        {
          id: "truma-prealgebra-u5-l1",
          title: "Multiplying a Fraction by a Whole Number",
          objective: "Multiply a fraction by a whole number and interpret it as repeated addition.",
          teach:
            "Multiplying a fraction by a whole number is repeated addition: 3 × 2/5 means 2/5 + 2/5 + 2/5 = 6/5 = 1 1/5. Shortcut: multiply the whole number by the numerator and keep the denominator. Simplify at the end.",
          memoryWork: "whole × a/b = (whole × a)/b. It is repeated addition.",
          workedExample: "4 × 3/8 = 12/8 = 3/2 = 1 1/2.",
          practiceFocus: "Fraction × whole number.",
        },
        {
          id: "truma-prealgebra-u5-l2",
          title: "Multiplying a Whole Number by a Fraction",
          objective: "Find a fraction of a whole number and see that 'of' means multiply.",
          teach:
            "Taking a fraction OF a whole number is multiplication. 2/3 of 12 means 2/3 × 12: divide by the denominator, multiply by the numerator, 12 ÷ 3 = 4, then × 2 = 8. The word 'of' is your signal to multiply.",
          memoryWork: "'of' means multiply. a/b of n = (n ÷ b) × a.",
          workedExample: "3/4 of 20\n20 ÷ 4 = 5\n5 × 3 = 15.",
          practiceFocus: "Fraction of a whole number.",
        },
        {
          id: "truma-prealgebra-u5-l3",
          title: "Word Problems, Part 1",
          objective: "Solve word problems involving a fraction of a quantity.",
          teach:
            "Fraction word problems usually ask for a fraction OF something. Identify the whole, then take the fraction of it. Draw a bar model if it helps: split the whole into the denominator's parts and count the numerator's worth.",
          memoryWork: "Find the whole, take the fraction of it. Bar models make it visible.",
          practiceFocus: "Fraction-of-a-quantity word problems.",
        },
        {
          id: "truma-prealgebra-u5-l4",
          title: "Practice A",
          objective: "Practice multiplying fractions by whole numbers and finding fractions of quantities.",
          teach:
            "Practice both directions: a whole number times a fraction, and a fraction of a whole number. Both are the same multiplication seen from two sides.",
          memoryWork: "Multiply numerators, multiply denominators, simplify.",
          practiceFocus: "Mixed fraction × whole practice.",
        },
        {
          id: "truma-prealgebra-u5-l5",
          title: "Multiplying a Fraction by a Unit Fraction",
          objective: "Multiply a fraction by a unit fraction (numerator 1) and see the area model.",
          teach:
            "A unit fraction has 1 on top. To multiply 1/2 × 1/3, think 'one third of one half': the answer is 1/6. On an area model, one factor cuts the square one way, the other cuts it the other way, and the overlap is the product. Multiply the denominators to name the small pieces.",
          memoryWork: "1/a × 1/b = 1/(a×b). Multiplying fractions makes them SMALLER.",
          workedExample: "1/4 × 1/3 = 1/12.",
          practiceFocus: "Unit fraction × unit fraction.",
        },
        {
          id: "truma-prealgebra-u5-l6",
          title: "Multiplying a Fraction by a Fraction, Part 1",
          objective: "Multiply any two fractions by multiplying across.",
          teach:
            "For any two fractions, multiply the numerators and multiply the denominators: 2/3 × 4/5 = 8/15. There is no common denominator needed, that is only for adding and subtracting. Simplify the result if possible.",
          memoryWork: "Multiply across: (a/b) × (c/d) = ac/bd. No common denominator needed.",
          workedExample: "3/5 × 2/7 = 6/35.",
          practiceFocus: "Fraction × fraction.",
        },
        {
          id: "truma-prealgebra-u5-l7",
          title: "Multiplying a Fraction by a Fraction, Part 2",
          objective: "Simplify before multiplying (cross-cancel) to keep numbers small.",
          teach:
            "You can cancel common factors before you multiply, which keeps the numbers small. For 3/4 × 8/9, cancel 3 with 9 (leaving 1 and 3) and 4 with 8 (leaving 1 and 2): 1/1 × 2/3 = 2/3. Cancelling early beats reducing a giant fraction later.",
          memoryWork: "Cancel common factors (top with any bottom) BEFORE multiplying.",
          workedExample: "5/6 × 3/10\nCancel 5 & 10 → 1 & 2; cancel 3 & 6 → 1 & 2.\n1/2 × 1/2 = 1/4.",
          practiceFocus: "Cross-cancelling before multiplying.",
        },
        {
          id: "truma-prealgebra-u5-l8",
          title: "Multiplying Mixed Numbers",
          objective: "Multiply mixed numbers by converting to improper fractions first.",
          teach:
            "You cannot multiply mixed numbers piece by piece. Convert each to an improper fraction first: 1 1/2 × 2 1/3 = 3/2 × 7/3 = 21/6 = 3 1/2. Convert, multiply across (cancelling if you can), then change back to a mixed number.",
          memoryWork: "Mixed → improper, multiply across, convert back.",
          workedExample: "2 1/4 × 1 1/3 = 9/4 × 4/3 = 36/12 = 3.",
          practiceFocus: "Multiplying mixed numbers.",
        },
        {
          id: "truma-prealgebra-u5-l9",
          title: "Word Problems, Part 2",
          objective: "Solve multi-step problems involving fraction multiplication.",
          teach:
            "Some problems chain a fraction of a fraction, or a fraction of a mixed-number quantity. Work step by step, and remember multiplying by a fraction less than one makes the result smaller, a good reasonableness check.",
          memoryWork: "×  a fraction < 1 makes it smaller. Check your answer's size.",
          practiceFocus: "Multi-step fraction multiplication problems.",
        },
        {
          id: "truma-prealgebra-u5-l10",
          title: "Fractions and Reciprocals",
          objective: "Identify the reciprocal of a number and know its product with the original is 1.",
          teach:
            "Two numbers are reciprocals if they multiply to 1. Flip a fraction to get its reciprocal: the reciprocal of 3/4 is 4/3, and 3/4 × 4/3 = 1. The reciprocal of a whole number n is 1/n. Reciprocals are the secret to dividing fractions in the next chapter.",
          memoryWork: "Reciprocal = flip it. A number × its reciprocal = 1.",
          workedExample: "Reciprocal of 5 is 1/5, and 5 × 1/5 = 1.",
          practiceFocus: "Finding reciprocals.",
        },
        {
          id: "truma-prealgebra-u5-l11",
          title: "Practice B",
          objective: "Review all fraction multiplication and reciprocals.",
          teach:
            "Chapter 5 review: fraction × whole, fraction × fraction, mixed numbers, and reciprocals. Cancel early, convert mixed numbers first, and simplify.",
          memoryWork: "Multiply across, cancel early, convert mixed numbers first.",
          practiceFocus: "Chapter 5 review.",
        },
      ],
    },
    {
      id: "truma-prealgebra-u6",
      title: "Unit 6 · Division of Fractions (5A Ch 6)",
      summary: "Dividing fractions by wholes and wholes by fractions, with word problems.",
      lessons: [
        {
          id: "truma-prealgebra-u6-l1",
          title: "Dividing a Unit Fraction by a Whole Number",
          objective: "Divide a unit fraction by a whole number using a model.",
          teach:
            "Dividing 1/2 by 3 means splitting a half into 3 equal parts: each part is 1/6. Splitting a small piece into more pieces makes even smaller pieces. On a model, cut the half into three, and the whole is now in sixths.",
          memoryWork: "1/a ÷ n = 1/(a×n). Splitting into more parts makes smaller pieces.",
          workedExample: "1/4 ÷ 2 = 1/8.",
          practiceFocus: "Unit fraction ÷ whole number.",
        },
        {
          id: "truma-prealgebra-u6-l2",
          title: "Dividing a Fraction by a Whole Number",
          objective: "Divide any fraction by a whole number by multiplying by its reciprocal.",
          teach:
            "To divide a fraction by a whole number, multiply by the reciprocal of the whole number. 3/4 ÷ 2 = 3/4 × 1/2 = 3/8. 'Dividing by 2' is the same as 'taking half,' which is why the reciprocal works.",
          memoryWork: "Divide by n = multiply by 1/n. Keep, change, flip.",
          workedExample: "2/3 ÷ 4 = 2/3 × 1/4 = 2/12 = 1/6.",
          practiceFocus: "Fraction ÷ whole number.",
        },
        {
          id: "truma-prealgebra-u6-l3",
          title: "Practice A",
          objective: "Practice dividing fractions by whole numbers.",
          teach:
            "Practice the keep-change-flip habit: keep the first fraction, change ÷ to ×, flip the second number to its reciprocal, then multiply and simplify.",
          memoryWork: "Keep, change, flip. Then multiply and simplify.",
          practiceFocus: "Fraction ÷ whole practice.",
        },
        {
          id: "truma-prealgebra-u6-l4",
          title: "Dividing a Whole Number by a Unit Fraction",
          objective: "Divide a whole number by a unit fraction and interpret 'how many fit.'",
          teach:
            "6 ÷ 1/2 asks 'how many halves are in 6?' Since each whole holds 2 halves, the answer is 12. Dividing by a fraction less than one gives a BIGGER answer, which surprises people until they picture 'how many small pieces fit.'",
          memoryWork: "n ÷ 1/b = n × b. Dividing by a fraction < 1 makes it BIGGER.",
          workedExample: "5 ÷ 1/3 = 5 × 3 = 15.",
          practiceFocus: "Whole ÷ unit fraction.",
        },
        {
          id: "truma-prealgebra-u6-l5",
          title: "Dividing a Whole Number by a Fraction",
          objective: "Divide a whole number by any fraction using the reciprocal.",
          teach:
            "Same rule for any fraction: multiply by its reciprocal. 4 ÷ 2/3 = 4 × 3/2 = 12/2 = 6. Keep the whole number, change to multiply, flip the fraction.",
          memoryWork: "Keep, change, flip works for any fraction divisor.",
          workedExample: "6 ÷ 3/4 = 6 × 4/3 = 24/3 = 8.",
          practiceFocus: "Whole ÷ fraction.",
        },
        {
          id: "truma-prealgebra-u6-l6",
          title: "Word Problems",
          objective: "Solve word problems involving division of fractions.",
          teach:
            "Fraction-division problems often ask how many small portions fit in a larger amount ('how many 1/4-cup servings in 3 cups?') or split a fraction into equal shares. Decide which story it is, then keep-change-flip.",
          memoryWork: "'How many fit?' or 'split into equal shares?' Both are division.",
          practiceFocus: "Fraction division word problems.",
        },
        {
          id: "truma-prealgebra-u6-l7",
          title: "Practice B",
          objective: "Review all fraction division.",
          teach:
            "Chapter 6 review: fractions by wholes, wholes by fractions, and word problems. The single rule, multiply by the reciprocal, covers them all.",
          memoryWork: "Every fraction division = multiply by the reciprocal.",
          practiceFocus: "Chapter 6 review.",
        },
      ],
    },
    {
      id: "truma-prealgebra-u7",
      title: "Unit 7 · Measurement (5A Ch 7)",
      summary: "Fractions in measurement conversions and in area.",
      lessons: [
        {
          id: "truma-prealgebra-u7-l1",
          title: "Fractions and Measurement Conversions",
          objective: "Use fractions to convert between units of measure.",
          teach:
            "Fractions make unit conversions natural: since 1 foot = 12 inches, 8 inches is 8/12 = 2/3 of a foot. Convert by writing the part over the whole unit and simplifying. This connects fraction sense to real measuring.",
          memoryWork: "part-unit / whole-unit = the fraction of the larger unit.",
          workedExample: "9 inches as a fraction of a foot: 9/12 = 3/4 ft.",
          practiceFocus: "Fraction-based unit conversions.",
        },
        {
          id: "truma-prealgebra-u7-l2",
          title: "Fractions and Area",
          objective: "Find areas of rectangles with fractional side lengths.",
          teach:
            "Area is still length × width, even when the sides are fractions. A rectangle 3/4 m by 2/3 m has area 3/4 × 2/3 = 6/12 = 1/2 square meter. Multiplying fractions and finding area are the same operation here.",
          memoryWork: "Area = length × width, fractions included.",
          workedExample: "Area of a 1/2 ft by 3/4 ft tile = 1/2 × 3/4 = 3/8 sq ft.",
          practiceFocus: "Area with fractional sides.",
        },
        {
          // verify: standard 5A Ch 7 continues with a Practice; confirm against the guide.
          id: "truma-prealgebra-u7-l3",
          title: "Practice",
          objective: "Review fractional measurement conversions and area.",
          teach:
            "Chapter 7 review: convert using fractions and compute areas with fractional sides. Label units carefully (linear vs. square).",
          memoryWork: "Length units for sides, square units for area.",
          practiceFocus: "Chapter 7 review.",
        },
      ],
    },
    {
      // verify: entire unit filled from the standard published Dimensions 5A Ch 8
      // sequence (Volume of Solid Figures). Confirm lesson list against the 5A guide.
      id: "truma-prealgebra-u8",
      title: "Unit 8 · Volume of Solid Figures (5A Ch 8)",
      summary: "Cubic units, the volume of a rectangular prism, and volume with capacity.",
      lessons: [
        {
          id: "truma-prealgebra-u8-l1",
          title: "Cubic Units",
          objective: "Measure volume by counting unit cubes.",
          teach:
            "Volume is the space inside a solid, measured in unit cubes. A cube 1 cm on each edge is 1 cubic centimeter. Count how many such cubes fill a box to find its volume. This builds the intuition before the formula.",
          memoryWork: "Volume is counted in cubic units (cm³, in³, m³).",
          practiceFocus: "Counting unit cubes.",
        },
        {
          id: "truma-prealgebra-u8-l2",
          title: "Volume of a Rectangular Prism",
          objective: "Find the volume of a cuboid using length × width × height.",
          teach:
            "Instead of counting every cube, multiply the three dimensions: Volume = length × width × height. A box 5 cm × 3 cm × 2 cm holds 30 cubic centimeters. The bottom layer has 5 × 3 = 15 cubes, and there are 2 layers.",
          memoryWork: "Volume of a cuboid = length × width × height.",
          workedExample: "V = 4 × 3 × 6 = 72 cm³.",
          practiceFocus: "Volume of rectangular prisms.",
        },
        {
          id: "truma-prealgebra-u8-l3",
          title: "Volume and Capacity",
          objective: "Relate volume in cubic units to liquid capacity (liters and milliliters).",
          teach:
            "Volume and capacity are linked: 1 cubic centimeter holds 1 milliliter, and 1,000 cm³ = 1 liter. A container's volume tells you how much liquid it can hold. This joins measurement to real containers.",
          memoryWork: "1 cm³ = 1 mL. 1,000 cm³ = 1 L.",
          practiceFocus: "Volume-to-capacity conversions.",
        },
        {
          id: "truma-prealgebra-u8-l4",
          title: "Practice",
          objective: "Review volume of solids and capacity.",
          teach:
            "Chapter 8 review: count cubes, use length × width × height, and convert between cubic units and capacity. Book 5A ends here.",
          memoryWork: "V = l × w × h. 1 cm³ = 1 mL.",
          practiceFocus: "Chapter 8 review.",
        },
      ],
    },
    // ════════════════════════════════════════════════════════════════════════
    // BOOK 5B
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "truma-prealgebra-u9",
      title: "Unit 9 · Decimals (5B Ch 9)",
      summary: "Place value to thousandths, comparing and rounding, and ×/÷ by powers of ten.",
      lessons: [
        { id: "truma-prealgebra-u9-l1", title: "Thousandths", objective: "Understand decimal place value out to the thousandths place.", teach: "Decimals extend place value past the ones: tenths, hundredths, thousandths, each ten times smaller than the one before. 0.007 is seven thousandths. A decimal is just another way to write a fraction whose denominator is a power of ten.", memoryWork: "Places after the point: tenths, hundredths, thousandths.", practiceFocus: "Reading and writing thousandths." },
        { id: "truma-prealgebra-u9-l2", title: "Place Value to Thousandths", objective: "Write decimals in expanded form and identify digit values.", teach: "Each digit after the point names a fraction: in 4.652, the 6 is 6 tenths, the 5 is 5 hundredths, the 2 is 2 thousandths. Expanded form: 4 + 0.6 + 0.05 + 0.002.", memoryWork: "Each place is a fraction: /10, /100, /1000.", practiceFocus: "Expanded form and digit values." },
        { id: "truma-prealgebra-u9-l3", title: "Comparing Decimals", objective: "Compare and order decimals using place value.", teach: "Compare decimals place by place from the left, just like whole numbers. Line up the points. 0.4 is greater than 0.39 because 4 tenths beats 3 tenths, the extra digits do not change that.", memoryWork: "Compare left to right by place. Line up the decimal points.", practiceFocus: "Ordering decimals." },
        { id: "truma-prealgebra-u9-l4", title: "Rounding Decimals", objective: "Round decimals to a given place.", teach: "To round to a place, look at the digit just to its right: 5 or more rounds up, 4 or less rounds down. 3.647 to the hundredth is 3.65 (the 7 rounds the 4 up to 5).", memoryWork: "Look one place right: 5+ up, 4− down.", practiceFocus: "Rounding to tenths and hundredths." },
        { id: "truma-prealgebra-u9-l5", title: "Practice A", objective: "Review decimal place value, comparing, and rounding.", teach: "Practice reading, comparing, and rounding decimals to the thousandth.", memoryWork: "Place value governs reading, comparing, and rounding.", practiceFocus: "Decimals review." },
        { id: "truma-prealgebra-u9-l6", title: "Multiply Decimals by 10, 100, and 1,000", objective: "Multiply decimals by powers of ten via the place-value shift.", teach: "Multiplying a decimal by ten shifts every digit one place left, so the decimal point appears to move right. 3.45 × 10 = 34.5, × 100 = 345.", memoryWork: "×10/100/1000 → point moves right 1/2/3 places.", practiceFocus: "Decimal × powers of ten." },
        { id: "truma-prealgebra-u9-l7", title: "Divide Decimals by 10, 100, and 1,000", objective: "Divide decimals by powers of ten via the place-value shift.", teach: "Dividing by ten shifts digits right, so the point appears to move left. 34.5 ÷ 10 = 3.45, ÷ 100 = 0.345.", memoryWork: "÷10/100/1000 → point moves left 1/2/3 places.", practiceFocus: "Decimal ÷ powers of ten." },
        { id: "truma-prealgebra-u9-l8", title: "Conversion of Measures", objective: "Convert measures using decimals (e.g., cm to m).", teach: "Metric conversions are powers of ten, so decimals do the work: 250 cm = 2.5 m, 1,750 g = 1.75 kg. Shift the point by the number of zeros in the conversion.", memoryWork: "Metric conversions are just ×/÷ powers of ten.", practiceFocus: "Metric conversions with decimals." },
        { id: "truma-prealgebra-u9-l9", title: "Mental Calculation", objective: "Add and subtract decimals mentally using place value and compensation.", teach: "Use friendly numbers: to add 2.9, add 3 and subtract 0.1. Break decimals into wholes and parts to compute in your head.", memoryWork: "Round to friendly, then compensate.", practiceFocus: "Mental decimal calculation." },
        { id: "truma-prealgebra-u9-l10", title: "Practice B", objective: "Review decimals and powers-of-ten operations.", teach: "Chapter 9 review: place value, comparing, rounding, and multiplying/dividing by powers of ten.", memoryWork: "Point moves right to multiply, left to divide.", practiceFocus: "Chapter 9 review." },
      ],
    },
    {
      id: "truma-prealgebra-u10",
      title: "Unit 10 · The Four Operations of Decimals (5B Ch 10)",
      summary: "Adding, subtracting, multiplying, and dividing decimals.",
      lessons: [
        { id: "truma-prealgebra-u10-l1", title: "Adding Decimals to Thousandths", objective: "Add decimals by lining up the decimal points.", teach: "Line up the decimal points so like places add to like places, fill empty places with zeros, then add as usual and bring the point straight down.", memoryWork: "Line up the points. Add like places.", workedExample: "3.4 + 1.256 = 3.400 + 1.256 = 4.656.", practiceFocus: "Adding decimals." },
        { id: "truma-prealgebra-u10-l2", title: "Subtracting Decimals", objective: "Subtract decimals by lining up the decimal points.", teach: "Same as addition: align the points, fill with zeros, subtract, and bring the point down. Borrow across places just like whole numbers.", memoryWork: "Line up the points. Fill zeros. Subtract.", workedExample: "5.2 - 3.47 = 5.20 - 3.47 = 1.73.", practiceFocus: "Subtracting decimals." },
        { id: "truma-prealgebra-u10-l3", title: "Multiplying by 0.1 or 0.01", objective: "Multiply by 0.1 and 0.01 and see the place-value shift.", teach: "Multiplying by 0.1 makes a number ten times smaller (point moves left one place); by 0.01, one hundred times smaller (two places). 46 × 0.1 = 4.6.", memoryWork: "×0.1 → left 1 place; ×0.01 → left 2 places.", practiceFocus: "Multiplying by 0.1 and 0.01." },
        { id: "truma-prealgebra-u10-l4", title: "Multiplying by a Decimal", objective: "Multiply two decimals and place the decimal point by counting places.", teach: "Multiply as if there were no points, then place the point so the answer has as many decimal places as both factors combined. 0.3 × 0.4 = 0.12 (two places).", memoryWork: "Count total decimal places in the factors; the product has that many.", workedExample: "1.2 × 0.5: 12 × 5 = 60, two places → 0.60 = 0.6.", practiceFocus: "Decimal × decimal." },
        { id: "truma-prealgebra-u10-l5", title: "Practice A", objective: "Review adding, subtracting, and multiplying decimals.", teach: "Practice all three operations; watch point placement in multiplication.", memoryWork: "Add/subtract: line up points. Multiply: count places.", practiceFocus: "Decimal operations review." },
        { id: "truma-prealgebra-u10-l6", title: "Dividing by a Whole Number, Part 1", objective: "Divide a decimal by a whole number, point straight up.", teach: "Divide a decimal by a whole number just like long division, and bring the decimal point straight up into the quotient. 4.8 ÷ 3 = 1.6.", memoryWork: "Point goes straight up into the answer.", practiceFocus: "Decimal ÷ whole number." },
        { id: "truma-prealgebra-u10-l7", title: "Dividing by a Whole Number, Part 2", objective: "Divide with extra zeros to continue the quotient.", teach: "When a division does not end, annex zeros after the decimal and keep going. 3 ÷ 4 = 3.00 ÷ 4 = 0.75.", memoryWork: "Add zeros after the point and keep dividing.", practiceFocus: "Decimal division with annexed zeros." },
        { id: "truma-prealgebra-u10-l8", title: "Dividing a Whole Number by 0.1 and 0.01", objective: "Divide by 0.1 and 0.01 and see the result grow.", teach: "Dividing by 0.1 asks 'how many tenths fit,' which makes the answer ten times bigger: 6 ÷ 0.1 = 60. Dividing by 0.01 makes it a hundred times bigger.", memoryWork: "÷0.1 → ×10; ÷0.01 → ×100.", practiceFocus: "Dividing by 0.1 and 0.01." },
        { id: "truma-prealgebra-u10-l9", title: "Dividing a Whole Number by a Decimal", objective: "Divide by a decimal by scaling both numbers to a whole divisor.", teach: "Turn the divisor into a whole number by shifting the point, then shift the dividend the same amount. 12 ÷ 0.4 = 120 ÷ 4 = 30.", memoryWork: "Make the divisor whole; shift the dividend the same way.", practiceFocus: "Whole ÷ decimal." },
        { id: "truma-prealgebra-u10-l10", title: "Practice B", objective: "Review all four decimal operations.", teach: "Chapter 10 review: add, subtract, multiply, and divide decimals, including by 0.1 and 0.01.", memoryWork: "Line up (±), count places (×), shift to whole (÷).", practiceFocus: "Chapter 10 review." },
      ],
    },
    {
      id: "truma-prealgebra-u11",
      title: "Unit 11 · Geometry (5B Ch 11)",
      summary: "Angles, triangles, and quadrilaterals.",
      lessons: [
        { id: "truma-prealgebra-u11-l1", title: "Measuring Angles", objective: "Measure and draw angles with a protractor.", teach: "An angle is measured in degrees with a protractor. Line the center on the vertex and the zero line on one ray, then read where the other ray crosses. A right angle is 90°, a straight angle 180°.", memoryWork: "Right angle 90°, straight angle 180°, full turn 360°.", practiceFocus: "Using a protractor." },
        { id: "truma-prealgebra-u11-l2", title: "Angles and Lines", objective: "Use angles on a line and at a point (supplementary/complementary).", teach: "Angles on a straight line add to 180°; angles around a point add to 360°. Use these facts to find a missing angle by subtracting the known ones.", memoryWork: "On a line = 180°. Around a point = 360°.", practiceFocus: "Finding missing angles." },
        { id: "truma-prealgebra-u11-l3", title: "Classifying Triangles", objective: "Classify triangles by sides and by angles.", teach: "By sides: equilateral (all equal), isosceles (two equal), scalene (none equal). By angles: acute, right, or obtuse. A triangle can carry both kinds of names.", memoryWork: "Sides: equilateral/isosceles/scalene. Angles: acute/right/obtuse.", practiceFocus: "Naming triangles." },
        { id: "truma-prealgebra-u11-l4", title: "The Sum of the Angles in a Triangle", objective: "Use the 180° angle sum of a triangle.", teach: "The three angles of any triangle always add to 180°. Find a missing angle by subtracting the two known angles from 180°.", memoryWork: "Triangle angles sum to 180°.", workedExample: "Angles 50° and 60°: third = 180 − 110 = 70°.", practiceFocus: "Missing triangle angles." },
        { id: "truma-prealgebra-u11-l5", title: "The Exterior Angle of a Triangle", objective: "Relate an exterior angle to the two remote interior angles.", teach: "An exterior angle of a triangle equals the sum of the two interior angles not next to it. This is a fast shortcut for missing angles.", memoryWork: "Exterior angle = sum of the two far interior angles.", practiceFocus: "Exterior angle problems." },
        { id: "truma-prealgebra-u11-l6", title: "Classifying Quadrilaterals", objective: "Identify and classify quadrilaterals by their properties.", teach: "Four-sided shapes are sorted by parallel sides and equal sides/angles: square, rectangle, parallelogram, rhombus, trapezoid. A square is a special rectangle and a special rhombus.", memoryWork: "Sort by parallel sides, equal sides, and right angles.", practiceFocus: "Naming quadrilaterals." },
        { id: "truma-prealgebra-u11-l7", title: "Angles of Quadrilaterals, Part 1", objective: "Use the 360° angle sum of a quadrilateral.", teach: "The four angles of any quadrilateral add to 360° (two triangles' worth). Find a missing angle by subtracting from 360°.", memoryWork: "Quadrilateral angles sum to 360°.", practiceFocus: "Missing quadrilateral angles." },
        { id: "truma-prealgebra-u11-l8", title: "Angles of Quadrilaterals, Part 2", objective: "Apply angle properties of special quadrilaterals.", teach: "Special shapes give extra facts: opposite angles of a parallelogram are equal; a rectangle's angles are all 90°. Combine these with the 360° rule.", memoryWork: "Parallelogram: opposite angles equal. Rectangle: all 90°.", practiceFocus: "Angles in special quadrilaterals." },
        { id: "truma-prealgebra-u11-l9", title: "Drawing Triangles and Quadrilaterals", objective: "Construct triangles and quadrilaterals from given measurements.", teach: "Use a ruler and protractor to draw shapes to given side lengths and angles. Careful construction turns the properties you learned into something you can build.", memoryWork: "Measure sides with the ruler, angles with the protractor.", practiceFocus: "Constructing shapes." },
        { id: "truma-prealgebra-u11-l10", title: "Practice", objective: "Review angle facts and shape classification.", teach: "Chapter 11 review: angle sums, triangle and quadrilateral types, and construction.", memoryWork: "Triangle 180°, quadrilateral 360°.", practiceFocus: "Chapter 11 review." },
      ],
    },
    {
      id: "truma-prealgebra-u12",
      title: "Unit 12 · Data Analysis and Graphs (5B Ch 12)",
      summary: "Averages, line plots, and coordinate and line graphs.",
      lessons: [
        { id: "truma-prealgebra-u12-l1", title: "Average, Part 1", objective: "Find the average (mean) of a set of numbers.", teach: "The average evens out a set: add all the values and divide by how many there are. The average of 4, 7, and 10 is 21 ÷ 3 = 7. It is the number each would have if the total were shared equally.", memoryWork: "Average = total ÷ how many.", workedExample: "Average of 8, 12, 10: (8+12+10) ÷ 3 = 30 ÷ 3 = 10.", practiceFocus: "Computing averages." },
        { id: "truma-prealgebra-u12-l2", title: "Average, Part 2", objective: "Use the average to find a missing value or total.", teach: "Turn the formula around: total = average × how many. If the average of 4 scores is 85, the total is 340, so a missing score can be found by subtraction.", memoryWork: "Total = average × count.", practiceFocus: "Working backward from an average." },
        { id: "truma-prealgebra-u12-l3", title: "Line Plots", objective: "Read and make line plots, including with fractional data.", teach: "A line plot stacks an X for each data value above a number line. It shows how often each value occurs and where the data clusters.", memoryWork: "One X per data point, stacked over its value.", practiceFocus: "Making and reading line plots." },
        { id: "truma-prealgebra-u12-l4", title: "Coordinate Graphs", objective: "Plot and read points on a coordinate grid.", teach: "A point is named by an ordered pair (x, y): go across x first, then up y. The two axes meet at the origin (0, 0).", memoryWork: "(x, y): across first, then up.", practiceFocus: "Plotting coordinates." },
        { id: "truma-prealgebra-u12-l5", title: "Straight Line Graphs", objective: "Interpret straight-line graphs of relationships.", teach: "A straight-line graph shows a steady relationship, like distance over time. Read values off the line, and a steeper line means a faster rate of change.", memoryWork: "Steeper line = faster change.", practiceFocus: "Reading line graphs." },
        { id: "truma-prealgebra-u12-l6", title: "Practice", objective: "Review averages and graphs.", teach: "Chapter 12 review: mean, line plots, coordinates, and line graphs.", memoryWork: "Average = total ÷ count; (x, y) across then up.", practiceFocus: "Chapter 12 review." },
      ],
    },
    {
      id: "truma-prealgebra-u13",
      title: "Unit 13 · Ratio (5B Ch 13)",
      summary: "Finding ratios, equivalent ratios, and comparing quantities.",
      lessons: [
        { id: "truma-prealgebra-u13-l1", title: "Finding the Ratio", objective: "Write a ratio to compare two quantities.", teach: "A ratio compares amounts: 3 cups flour to 2 cups sugar is written 3 : 2. Order matters, the first number names the first quantity. A ratio is a comparison, not a total.", memoryWork: "Ratio a : b compares two amounts. Order matters.", practiceFocus: "Writing ratios." },
        { id: "truma-prealgebra-u13-l2", title: "Equivalent Ratios", objective: "Find equivalent ratios by multiplying or dividing both terms.", teach: "Multiply or divide both parts of a ratio by the same number to get an equivalent ratio: 3 : 2 = 6 : 4 = 9 : 6. Simplify a ratio by dividing both parts by their GCF.", memoryWork: "Scale both terms by the same number. Simplify with the GCF.", workedExample: "Simplify 12 : 8 → divide by 4 → 3 : 2.", practiceFocus: "Equivalent and simplified ratios." },
        { id: "truma-prealgebra-u13-l3", title: "Finding a Quantity", objective: "Use a ratio and one known amount to find the other.", teach: "If the ratio of boys to girls is 2 : 3 and there are 8 boys, each 'part' is 8 ÷ 2 = 4, so girls = 3 × 4 = 12. Find the value of one part, then scale.", memoryWork: "Find one part, then multiply for the other.", practiceFocus: "Finding an unknown quantity from a ratio." },
        { id: "truma-prealgebra-u13-l4", title: "Comparing Three Quantities", objective: "Work with three-term ratios (a : b : c).", teach: "Ratios can compare three amounts at once, like 2 : 3 : 5. The same rules apply: keep the order, scale all terms together, and the parts sum to the whole.", memoryWork: "Three-term ratio: all parts scale together; they sum to the whole.", practiceFocus: "Three-term ratios." },
        { id: "truma-prealgebra-u13-l5", title: "Word Problems", objective: "Solve ratio word problems, often with bar models.", teach: "Draw a bar split into the ratio's parts, find the value of one part from the given total or difference, then answer the question. Bar models make ratio stories clear.", memoryWork: "Bar model → value of one part → answer.", practiceFocus: "Ratio word problems." },
        { id: "truma-prealgebra-u13-l6", title: "Practice", objective: "Review ratios and equivalent ratios.", teach: "Chapter 13 review: write, simplify, and use ratios, including three-term ratios and word problems.", memoryWork: "Order matters; scale both/all terms; find one part.", practiceFocus: "Chapter 13 review." },
      ],
    },
    {
      id: "truma-prealgebra-u14",
      title: "Unit 14 · Rate (5B Ch 14)",
      summary: "Finding rates and solving rate problems.",
      lessons: [
        { id: "truma-prealgebra-u14-l1", title: "Finding the Rate", objective: "Understand a rate as a comparison of two different units.", teach: "A rate compares quantities with different units, like miles per hour or dollars per pound. A unit rate tells the amount for exactly one: 120 miles in 2 hours is 60 miles per hour.", memoryWork: "Rate compares different units. Unit rate = amount for ONE.", workedExample: "$6 for 3 lb → 6 ÷ 3 = $2 per lb.", practiceFocus: "Finding unit rates." },
        { id: "truma-prealgebra-u14-l2", title: "Rate Problems, Part 1", objective: "Use a rate to find a total.", teach: "Multiply the rate by the amount: at 60 mph for 3 hours, distance = 60 × 3 = 180 miles. Rate × amount = total.", memoryWork: "Total = rate × amount.", practiceFocus: "Finding totals from rates." },
        { id: "truma-prealgebra-u14-l3", title: "Rate Problems, Part 2", objective: "Use a rate and total to find the amount.", teach: "Divide to find the missing amount: if you drove 180 miles at 60 mph, time = 180 ÷ 60 = 3 hours. Total ÷ rate = amount.", memoryWork: "Amount = total ÷ rate.", practiceFocus: "Finding amounts from rates." },
        { id: "truma-prealgebra-u14-l4", title: "Word Problems", objective: "Solve multi-step rate word problems.", teach: "Rate stories may combine two rates or ask for an average speed. Identify the rate, the total, and the amount, and use the right one of the three related formulas.", memoryWork: "rate, total, amount: know two, find the third.", practiceFocus: "Rate word problems." },
        { id: "truma-prealgebra-u14-l5", title: "Practice", objective: "Review rates and rate problems.", teach: "Chapter 14 review: unit rates and the rate/total/amount relationships.", memoryWork: "Total = rate × amount, and rearrange.", practiceFocus: "Chapter 14 review." },
      ],
    },
    {
      id: "truma-prealgebra-u15",
      title: "Unit 15 · Percentage (5B Ch 15)",
      summary: "Percent as hundredths, converting among fractions/decimals/percents, and percent of a quantity.",
      lessons: [
        { id: "truma-prealgebra-u15-l1", title: "Meaning of Percentage", objective: "Understand percent as 'per hundred.'", teach: "Percent means 'per hundred,' so 45% is 45 out of 100, or 45/100. A percent is a special fraction with denominator 100, which makes comparing easy.", memoryWork: "Percent = per hundred. 45% = 45/100.", practiceFocus: "Meaning of percent." },
        { id: "truma-prealgebra-u15-l2", title: "Expressing Percentages as Fractions", objective: "Convert a percent to a fraction in lowest terms.", teach: "Write the percent over 100 and simplify: 40% = 40/100 = 2/5. Divide both parts by their GCF.", memoryWork: "percent/100, then simplify.", workedExample: "75% = 75/100 = 3/4.", practiceFocus: "Percent → fraction." },
        { id: "truma-prealgebra-u15-l3", title: "Percentages and Decimals", objective: "Convert between percents and decimals.", teach: "Percent to decimal: divide by 100 (move the point left two places), so 62% = 0.62. Decimal to percent: multiply by 100, so 0.3 = 30%.", memoryWork: "% → decimal: left 2 places. Decimal → %: right 2 places.", practiceFocus: "Percent ↔ decimal." },
        { id: "truma-prealgebra-u15-l4", title: "Expressing Fractions as Percentages", objective: "Convert a fraction to a percent.", teach: "Rename the fraction to hundredths, or divide and multiply by 100: 3/4 = 75/100 = 75%. If the denominator does not divide 100 evenly, divide the fraction and shift the point.", memoryWork: "Fraction → hundredths → percent.", workedExample: "1/5 = 20/100 = 20%.", practiceFocus: "Fraction → percent." },
        { id: "truma-prealgebra-u15-l5", title: "Practice A", objective: "Review conversions among fractions, decimals, and percents.", teach: "Practice moving freely among the three forms; they all name the same amount.", memoryWork: "Fraction, decimal, percent: three names, one value.", practiceFocus: "Conversion review." },
        { id: "truma-prealgebra-u15-l6", title: "Percentage of a Quantity", objective: "Find a percent of a number.", teach: "To find a percent of a number, turn the percent into a fraction or decimal and multiply: 20% of 50 = 0.2 × 50 = 10. 'Of' means multiply, just like with fractions.", memoryWork: "percent of a number = (percent as decimal) × number.", workedExample: "15% of 200 = 0.15 × 200 = 30.", practiceFocus: "Percent of a quantity." },
        { id: "truma-prealgebra-u15-l7", title: "Word Problems", objective: "Solve percent word problems (discounts, increases).", teach: "Real percent problems involve discounts, tax, and increases. Decide whether you add the percent (tax, increase) or subtract it (discount), and always take the percent OF the right amount.", memoryWork: "Discount subtracts; tax/increase adds. Percent OF the base.", practiceFocus: "Percent word problems." },
        { id: "truma-prealgebra-u15-l8", title: "Practice B", objective: "Review all percentage work; end of 5B.", teach: "Chapter 15 review: percent meaning, conversions, percent of a quantity, and word problems. This closes Book 5B, well done, Truma.", memoryWork: "Percent = per hundred; convert freely; 'of' means multiply.", practiceFocus: "Chapter 15 review." },
      ],
    },
  ],
  // Placement probes in curriculum order. Getting the later ones right marks
  // everything through that lesson complete, so Truma can start where she truly
  // is instead of at lesson one. These cover 5A Ch 1-3 so a confident student
  // lands at the start of fractions (Unit 4).
  placement: [
    {
      prompt: "What is 46 × 100?",
      choices: ["4,600", "460", "46,000", "406"],
      correctIndex: 0,
      throughLessonId: "truma-prealgebra-u1-l6",
    },
    {
      prompt: "Evaluate: 20 − 12 ÷ 4",
      choices: ["17", "2", "8", "23"],
      correctIndex: 0,
      throughLessonId: "truma-prealgebra-u2-l7",
    },
    {
      prompt: "What is 476 ÷ 28?",
      choices: ["17", "16", "18", "15"],
      correctIndex: 0,
      throughLessonId: "truma-prealgebra-u3-l9",
    },
  ],
};
