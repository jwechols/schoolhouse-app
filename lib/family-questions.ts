import { QUESTION_SCRIPTURES } from "./question-scriptures";

export interface Question {
  id: string;
  prompt: string;
  choices: string[];
  answer: string;
  explanation?: string;
  scripture?: string;
}

const QUESTIONS: Record<string, Question[]> = {

  // ── TITUS: GRAMMAR ───────────────────────────────────────────────────
  grammar: [
    { id: "g1",  prompt: "Which word is a NOUN?",            choices: ["Run", "Happy", "Dog", "Quickly"],            answer: "Dog",     explanation: "A noun names a person, place, or thing. Dog is a thing!" },
    { id: "g2",  prompt: "Which word is a VERB?",            choices: ["Blue", "Jump", "Tall", "Flower"],           answer: "Jump",    explanation: "A verb is an action word. Jump is something you do!" },
    { id: "g3",  prompt: "Which word is an ADJECTIVE?",      choices: ["Eat", "Book", "Fluffy", "Run"],             answer: "Fluffy",  explanation: "An adjective describes a noun, fluffy tells what kind." },
    { id: "g4",  prompt: "What is the plural of 'fox'?",     choices: ["Foxs", "Foxes", "Foxen", "Fox"],            answer: "Foxes",   explanation: "Words ending in -x add -es: fox → foxes." },
    { id: "g5",  prompt: "What is the plural of 'child'?",   choices: ["Childs", "Children", "Childes", "Childs'"], answer: "Children", explanation: "Child → children is an irregular plural you memorize." },
    { id: "g6",  prompt: "Which is a PROPER NOUN?",          choices: ["city", "river", "Texas", "mountain"],       answer: "Texas",   explanation: "A proper noun names a specific place and is capitalized." },
    { id: "g7",  prompt: "What does the contraction 'don't' mean?", choices: ["do not", "did not", "does not", "done it"], answer: "do not", explanation: "Don't = do + not. The apostrophe replaces the letter 'o'." },
    { id: "g8",  prompt: "Which sentence is correct?",       choices: ["I goed to school.", "I went to school.", "I go-ed to school.", "I goed school."], answer: "I went to school.", explanation: "'Went' is the irregular past tense of 'go'." },
    { id: "g9",  prompt: "Which word is an ADVERB?",         choices: ["Cat", "Purple", "Slowly", "Book"],           answer: "Slowly",  explanation: "Adverbs describe HOW something is done. Slowly = how you move." },
    { id: "g10", prompt: "Which is a complete sentence?",    choices: ["The big dog.", "Running fast.", "She likes pizza.", "Under the tree."], answer: "She likes pizza.", explanation: "A complete sentence needs a subject (She) and a verb (likes)." },
    { id: "g11", prompt: "What punctuation ends a question?", choices: [".", "!", "?", ","],                        answer: "?",       explanation: "A question mark (?) always ends a question." },
    { id: "g12", prompt: "Which word is a PRONOUN?",         choices: ["Table", "She", "Happy", "Swim"],            answer: "She",     explanation: "Pronouns replace nouns. 'She' replaces a girl's name." },
    { id: "g13", prompt: "What is the plural of 'leaf'?",    choices: ["Leafs", "Leaves", "Leafes", "Leaf"],        answer: "Leaves",  explanation: "Words ending in -f often change to -ves: leaf → leaves." },
    { id: "g14", prompt: "What does the prefix 'un-' mean?", choices: ["again", "not", "before", "after"],           answer: "not",     explanation: "The prefix un- means NOT. Unhappy = not happy." },
    { id: "g15", prompt: "Which word is a CONJUNCTION?",     choices: ["And", "Cat", "Blue", "Run"],                answer: "And",     explanation: "Conjunctions connect words. And, but, or, so are conjunctions." },
    { id: "g16", prompt: "What is the subject of: 'The cat sat on the mat.'?", choices: ["sat", "mat", "The cat", "on"], answer: "The cat", explanation: "The subject is WHO or WHAT the sentence is about." },
    { id: "g17", prompt: "Which word is spelled correctly?",  choices: ["Frend", "Freiend", "Friend", "Freind"],    answer: "Friend",  explanation: "Friend: i before e, fr-i-e-nd." },
    { id: "g18", prompt: "What type of noun is 'kindness'?", choices: ["Proper noun", "Common noun", "Abstract noun", "Plural noun"], answer: "Abstract noun", explanation: "Abstract nouns are things you can't touch, like kindness or bravery." },
    { id: "g19", prompt: "Which sentence uses 'their' correctly?", choices: ["Their going to the park.", "The dog is over their.", "They put their shoes away.", "I live their."], answer: "They put their shoes away.", explanation: "'Their' shows ownership, it belongs to THEM." },
    { id: "g20", prompt: "What is the opposite (antonym) of 'fast'?", choices: ["Quick", "Slow", "Speed", "Race"], answer: "Slow", explanation: "Antonyms are opposites! Fast and slow are antonyms." },
  ],

  // ── TITUS: SCIENCE ──────────────────────────────────────────────────
  science: [
    { id: "s1",  prompt: "Which planet is closest to the Sun?",           choices: ["Venus", "Earth", "Mercury", "Mars"],           answer: "Mercury",     explanation: "Mercury is the smallest planet and closest to the Sun." },
    { id: "s2",  prompt: "What do plants need to make food (photosynthesis)?", choices: ["Darkness and soil", "Sunlight, water, and air", "Rain and snow", "Animals"], answer: "Sunlight, water, and air", explanation: "Plants make food from sunlight, water, and carbon dioxide." },
    { id: "s3",  prompt: "What is the largest planet in our solar system?", choices: ["Saturn", "Neptune", "Jupiter", "Uranus"],        answer: "Jupiter",     explanation: "Over 1,300 Earths could fit inside Jupiter!" },
    { id: "s4",  prompt: "Which body system pumps blood?",                  choices: ["Digestive", "Respiratory", "Circulatory", "Nervous"], answer: "Circulatory", explanation: "The heart, blood, and vessels make up the circulatory system." },
    { id: "s5",  prompt: "What state of matter fills any container?",       choices: ["Solid", "Liquid", "Gas", "Foam"],               answer: "Gas",         explanation: "Gas expands to fill any container, no fixed shape or volume." },
    { id: "s6",  prompt: "What is the process of water evaporating then returning as rain?", choices: ["Erosion", "Water cycle", "Photosynthesis", "Gravity"], answer: "Water cycle", explanation: "Water cycle: evaporation → condensation → precipitation." },
    { id: "s7",  prompt: "Which animal is a mammal?",                       choices: ["Goldfish", "Eagle", "Dolphin", "Frog"],          answer: "Dolphin",     explanation: "Dolphins breathe air, are warm-blooded, and nurse with milk." },
    { id: "s8",  prompt: "What organ is used for breathing?",               choices: ["Heart", "Brain", "Lungs", "Liver"],             answer: "Lungs",       explanation: "Lungs take in oxygen and release carbon dioxide." },
    { id: "s9",  prompt: "How many planets are in our solar system?",       choices: ["7", "8", "9", "10"],                           answer: "8",           explanation: "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune." },
    { id: "s10", prompt: "What kind of rock forms when lava cools?",        choices: ["Sedimentary", "Metamorphic", "Igneous", "Limestone"], answer: "Igneous", explanation: "Igneous rock forms when magma or lava cools and hardens." },
    { id: "s11", prompt: "What force keeps planets orbiting the Sun?",      choices: ["Magnetism", "Gravity", "Wind", "Electricity"],  answer: "Gravity",     explanation: "Gravity is the attraction between objects, it keeps planets in orbit." },
    { id: "s12", prompt: "What do herbivores eat?",                         choices: ["Only meat", "Only plants", "Both", "Only fish"],  answer: "Only plants", explanation: "Herbivores eat only plants. Deer, rabbits, elephants." },
    { id: "s13", prompt: "What is the center of an atom called?",           choices: ["Electron", "Proton", "Shell", "Nucleus"],       answer: "Nucleus",     explanation: "The nucleus is the center of an atom, protons and neutrons live there." },
    { id: "s14", prompt: "Which planet has famous rings?",                  choices: ["Jupiter", "Mars", "Saturn", "Venus"],           answer: "Saturn",      explanation: "Saturn's rings are made of ice and rock!" },
    { id: "s15", prompt: "What is metamorphosis?",                          choices: ["Hibernation", "Migration", "A complete change in form", "Growing taller"], answer: "A complete change in form", explanation: "Caterpillar → chrysalis → butterfly is metamorphosis." },
    { id: "s16", prompt: "What is the primary source of energy for Earth?", choices: ["The Moon", "The Stars", "The Sun", "The Wind"],  answer: "The Sun",     explanation: "The Sun provides heat and light for almost all life on Earth." },
    { id: "s17", prompt: "Which gas do humans breathe to stay alive?",      choices: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"], answer: "Oxygen",   explanation: "We inhale oxygen and exhale carbon dioxide." },
    { id: "s18", prompt: "Where does photosynthesis happen in a plant?",    choices: ["Roots", "Stem", "Leaves", "Flowers"],           answer: "Leaves",      explanation: "Leaves contain chlorophyll that captures sunlight." },
    { id: "s19", prompt: "What is the study of living things called?",      choices: ["Physics", "Chemistry", "Geology", "Biology"],   answer: "Biology",     explanation: "Biology: Greek 'bios' (life) + 'logos' (study)." },
    { id: "s20", prompt: "What do producers make during photosynthesis?",   choices: ["Water", "Oxygen and sugar", "Carbon dioxide", "Soil"], answer: "Oxygen and sugar", explanation: "Plants produce oxygen and glucose (sugar) via photosynthesis." },
  ],

  // ── TITUS: US HISTORY ─────────────────────────────────────────────────
  history: [
    { id: "h1",  prompt: "Who was the first President of the United States?", choices: ["John Adams", "Thomas Jefferson", "George Washington", "Benjamin Franklin"], answer: "George Washington", explanation: "Washington served as 1st President from 1789–1797." },
    { id: "h2",  prompt: "In what year did Columbus arrive in the Americas?", choices: ["1392", "1492", "1592", "1776"],             answer: "1492",          explanation: "In 1492 Columbus sailed the ocean blue!" },
    { id: "h3",  prompt: "What document declared American independence?",     choices: ["The Constitution", "The Bill of Rights", "The Declaration of Independence", "The Mayflower Compact"], answer: "The Declaration of Independence", explanation: "Jefferson wrote it; signed July 4, 1776." },
    { id: "h4",  prompt: "What ship brought the Pilgrims to America in 1620?", choices: ["Santa Maria", "Mayflower", "Endeavour", "Discovery"], answer: "Mayflower",   explanation: "The Pilgrims left England to worship God freely. The Mayflower brought them to Plymouth in 1620." },
    { id: "h5",  prompt: "What do the 13 stripes on the flag represent?",    choices: ["13 wars won", "13 presidents", "The 13 original colonies", "13 years of freedom"], answer: "The 13 original colonies", explanation: "Each stripe represents one of the 13 colonies that became the first states." },
    { id: "h6",  prompt: "How many stars are on the American flag today?",   choices: ["13", "48", "50", "52"],                       answer: "50",            explanation: "One star for each of the 50 states." },
    { id: "h7",  prompt: "What is the capital of the United States?",        choices: ["New York City", "Philadelphia", "Washington D.C.", "Boston"], answer: "Washington D.C.", explanation: "Washington D.C. became the capital in 1800." },
    { id: "h8",  prompt: "Who was the main author of the Declaration?",      choices: ["George Washington", "John Adams", "Benjamin Franklin", "Thomas Jefferson"], answer: "Thomas Jefferson", explanation: "Jefferson was the principal author." },
    { id: "h9",  prompt: "Which man helped the Pilgrims survive by teaching them to farm and fish?", choices: ["Pocahontas", "Crazy Horse", "Squanto", "Sitting Bull"], answer: "Squanto",     explanation: "God's hand was clearly on the colony: Squanto had already learned English years before the Pilgrims arrived, so he could speak directly with them. He taught them to plant corn and fish. Without him, Plymouth would likely have failed." },
    { id: "h10", prompt: "What was the Boston Tea Party about?",             choices: ["A colonial tea festival", "Celebrating British rule", "Protesting taxes without representation", "Trading ships"], answer: "Protesting taxes without representation", explanation: "Colonists dumped British tea in Boston Harbor, 'No taxation without representation!'" },
    { id: "h11", prompt: "Who was the 16th President who helped end slavery?", choices: ["Theodore Roosevelt", "Ulysses S. Grant", "Abraham Lincoln", "Andrew Jackson"], answer: "Abraham Lincoln", explanation: "Lincoln issued the Emancipation Proclamation in 1863." },
    { id: "h12", prompt: "What is the 'supreme law of the land' in America?", choices: ["Declaration of Independence", "The Constitution", "Federalist Papers", "Bill of Rights"], answer: "The Constitution", explanation: "The U.S. Constitution, written in 1787, is the supreme law." },
    { id: "h13", prompt: "What war was fought between the North and South (1861–1865)?", choices: ["Revolutionary War", "Civil War", "War of 1812", "WWI"],  answer: "Civil War",    explanation: "The southern states seceded to preserve slavery, their own secession documents said so in plain language. Lincoln called the war God's judgment on the nation for that sin (his Second Inaugural, 1865). The Union won; slavery was abolished." },
    { id: "h14", prompt: "What was the first permanent English settlement in America?", choices: ["Plymouth", "Jamestown", "Boston", "Roanoke"], answer: "Jamestown", explanation: "Jamestown, Virginia, founded 1607, was the first permanent English settlement." },
    { id: "h15", prompt: "Which president is on the penny?",                 choices: ["Washington", "Lincoln", "Jefferson", "Roosevelt"],  answer: "Lincoln",      explanation: "Lincoln has been on the penny since 1909." },
    { id: "h16", prompt: "What ocean did Columbus cross to reach the Americas?", choices: ["Pacific", "Indian", "Arctic", "Atlantic"],       answer: "Atlantic",     explanation: "Columbus sailed west across the Atlantic Ocean from Spain." },
    { id: "h17", prompt: "Benjamin Franklin was known as a…",               choices: ["General only", "President", "Founding Father and inventor", "King"], answer: "Founding Father and inventor", explanation: "Franklin helped draft the Constitution and discovered electricity in lightning." },
    { id: "h18", prompt: "Where did the Pilgrims land in 1620?",            choices: ["Jamestown", "Plymouth Rock", "New York", "Boston"],  answer: "Plymouth Rock", explanation: "The Pilgrims landed at Plymouth, Massachusetts." },
    { id: "h19", prompt: "Which document begins: 'We the People'?",         choices: ["Declaration of Independence", "The Constitution", "The Mayflower Compact", "Bill of Rights"], answer: "The Constitution", explanation: "The Constitution opens with 'We the People of the United States…'" },
    { id: "h20", prompt: "Who is sometimes called the 'Father of His Country'?", choices: ["Ben Franklin", "John Adams", "George Washington", "Thomas Jefferson"], answer: "George Washington", explanation: "Washington is called the Father of His Country for leading the nation through its founding." },
  ],

  // ── TITUS: BIBLE ──────────────────────────────────────────────────────────
  "titus-bible": [
    { id: "tb1",  prompt: "Peter, Andrew, James, and John were what kind of workers before following Jesus?", choices: ["Farmers", "Fishermen", "Shepherds", "Carpenters"], answer: "Fishermen", explanation: "They fished the Sea of Galilee! Jesus called them to be 'fishers of men', bringing people to God instead of catching fish." },
    { id: "tb2",  prompt: "Jesus said He would make fishermen like Peter into what?", choices: ["Fishers of more fish", "Fishers of men", "Fishers of treasure", "Fishers of knowledge"], answer: "Fishers of men", explanation: "Mark 1:17, 'Follow me and I will make you fishers of men.' Their mission became bringing people to Jesus." },
    { id: "tb3",  prompt: "When Jesus fed 5,000 people, what did the boy have?", choices: ["10 loaves and 1 fish", "5 loaves and 2 fish", "3 loaves and 5 fish", "7 loaves and no fish"], answer: "5 loaves and 2 fish", explanation: "John 6, a boy offered 5 small loaves and 2 fish. Jesus multiplied it to feed the whole crowd. Nothing is too small for God!" },
    { id: "tb4",  prompt: "After a night of catching no fish, Peter obeyed Jesus and let down the nets. What happened?", choices: ["Nothing", "He caught one large fish", "The nets broke from so many fish", "A storm came"], answer: "The nets broke from so many fish", explanation: "Luke 5, so many fish the nets began to break! Peter fell down saying 'I am a sinful man.' That miracle showed who Jesus really was." },
    { id: "tb5",  prompt: "Jesus walked on what body of water?", choices: ["The River Jordan", "The Red Sea", "The Sea of Galilee", "The Mediterranean Sea"], answer: "The Sea of Galilee", explanation: "Matthew 14, Jesus walked on the Sea of Galilee in a storm. Peter stepped out too, then sank when he took his eyes off Jesus!" },
    { id: "tb6",  prompt: "Why did Jesus have to die on the cross?", choices: ["Because soldiers were stronger than Him", "Because He did something wrong", "To take the punishment our sins deserve", "Because He gave up"], answer: "To take the punishment our sins deserve", explanation: "Romans 5:8, 'While we were still sinners, Christ died for us.' Jesus took our punishment so we could be forgiven." },
    { id: "tb7",  prompt: "What happened to Jesus three days after He died?", choices: ["He went to heaven immediately", "He rose from the dead", "His disciples carried Him away", "He appeared only as a spirit"], answer: "He rose from the dead", explanation: "The resurrection is the cornerstone of Christianity! Because Jesus rose, death is defeated. 1 Corinthians 15:20." },
    { id: "tb8",  prompt: "The four Gospels are Matthew, Mark, Luke, and ___.", choices: ["Acts", "Romans", "John", "Revelation"], answer: "John", explanation: "The four Gospels tell the story of Jesus's life, ministry, death, and resurrection from four different perspectives." },
    { id: "tb9",  prompt: "In the parable of the lost sheep, the shepherd leaves how many to find one missing?", choices: ["10", "50", "99", "100"], answer: "99", explanation: "Luke 15, the shepherd leaves 99 sheep to find the one that's lost. God pursues lost sinners with that same love!" },
    { id: "tb10", prompt: "What is sin?", choices: ["Making a mistake on a test", "Breaking God's law in thought, word, or deed", "Being unkind once", "Only things that make people angry"], answer: "Breaking God's law in thought, word, or deed", explanation: "Sin is missing the mark of God's perfect standard. Romans 3:23: ALL have sinned. That's why we need Jesus." },
    { id: "tb11", prompt: "What does the word 'gospel' mean?", choices: ["Good rules", "Good news", "God's book", "Great story"], answer: "Good news", explanation: "Gospel means GOOD NEWS, the good news that Jesus died for sinners and rose again so we can be forgiven!" },
    { id: "tb12", prompt: "Who made the heavens, the earth, the sea, and everything in them?", choices: ["Nature made itself", "Nobody knows", "God made everything", "The universe always existed"], answer: "God made everything", explanation: "Genesis 1, In the beginning, God created everything! From stars to salmon, every creature shows His power and creativity." },
    { id: "tb13", prompt: "God saved Noah and his family by telling him to build a…", choices: ["Tower", "Boat (ark)", "Tent", "Wall"], answer: "Boat (ark)", explanation: "Genesis 6-9, God commanded Noah to build the ark. Two of every animal went in, imagine all those wild creatures!" },
    { id: "tb14", prompt: "What is the Bible?", choices: ["A book of rules", "A history book only", "God's Word, His revelation to us", "A book written only by men's ideas"], answer: "God's Word, His revelation to us", explanation: "2 Timothy 3:16, All Scripture is God-breathed. The Holy Spirit guided the human authors to write God's true Word." },
    { id: "tb15", prompt: "Sola Scriptura means the Bible is…", choices: ["Only for scholars", "The final authority for our faith and life", "One of many equal authorities", "Old and not for today"], answer: "The final authority for our faith and life", explanation: "Sola Scriptura (Scripture alone), the Reformers taught that the Bible, not popes or traditions, is our highest authority." },
    { id: "tb16", prompt: "How are we saved, by earning it or by God's gift?", choices: ["By doing enough good works", "By being better than other people", "By God's grace through faith, it's a gift", "By our own effort and willpower"], answer: "By God's grace through faith, it's a gift", explanation: "Ephesians 2:8-9, 'By grace you have been saved through faith… it is the gift of God, not of works.'" },
    { id: "tb17", prompt: "Young David defeated the giant Goliath using…", choices: ["A sword and armor", "A sling and a stone", "An arrow and a bow", "His bare hands"], answer: "A sling and a stone", explanation: "1 Samuel 17, David ran toward Goliath trusting God. A sling + one stone + faith = giant defeated! God gets the glory." },
    { id: "tb18", prompt: "Daniel was thrown into a den of lions because he refused to stop…", choices: ["Eating certain foods", "Praying to God", "Speaking Hebrew", "Working on his day off"], answer: "Praying to God", explanation: "Daniel 6, Daniel prayed three times a day even when it was illegal. God shut the lions' mouths. Faith over fear!" },
    { id: "tb19", prompt: "What did Jesus say is the greatest commandment?", choices: ["Honor your father and mother", "Love God with all your heart, soul, and mind", "Do not steal", "Keep the Sabbath day holy"], answer: "Love God with all your heart, soul, and mind", explanation: "Matthew 22:37, Jesus said the greatest commandment is loving God completely. The second is to love your neighbor as yourself." },
    { id: "tb20", prompt: "Jesus rose from the dead on which day?", choices: ["Friday", "Saturday", "Sunday", "Monday"], answer: "Sunday", explanation: "That's why Christians worship on Sunday, it's called the Lord's Day, celebrating Christ's resurrection. Every Sunday is a mini Easter!" },
  ],

  // ── MERCY: COUNTING ───────────────────────────────────────────────────────────
  counting: [
    { id: "mc1",  prompt: "🐶🐶🐶 How many dogs?",                    choices: ["2", "3", "4"],  answer: "3" },
    { id: "mc2",  prompt: "What number comes AFTER 7?",              choices: ["6", "8", "9"],  answer: "8" },
    { id: "mc3",  prompt: "🌟🌟🌟🌟🌟 How many stars?",               choices: ["4", "5", "6"],  answer: "5" },
    { id: "mc4",  prompt: "What number comes BEFORE 10?",            choices: ["8", "9", "11"], answer: "9" },
    { id: "mc5",  prompt: "🍎🍎 How many apples?",                   choices: ["1", "2", "3"],  answer: "2" },
    { id: "mc6",  prompt: "15, ___, what comes next?",             choices: ["14", "16", "17"], answer: "16" },
    { id: "mc7",  prompt: "🐱🐱🐱🐱 How many cats?",                  choices: ["3", "4", "5"],  answer: "4" },
    { id: "mc8",  prompt: "Which number is BIGGER: 12 or 18?",       choices: ["12", "18", "Equal"], answer: "18" },
    { id: "mc9",  prompt: "🌺🌺🌺🌺🌺🌺 How many flowers?",            choices: ["5", "6", "7"],  answer: "6" },
    { id: "mc10", prompt: "What number comes AFTER 19?",             choices: ["18", "20", "21"], answer: "20" },
    { id: "mc11", prompt: "Which number is SMALLER: 7 or 11?",       choices: ["7", "11", "Equal"], answer: "7" },
    { id: "mc12", prompt: "🦋🦋🦋🦋🦋🦋🦋 How many butterflies?",      choices: ["6", "7", "8"],  answer: "7" },
    { id: "mc13", prompt: "Count by 2s: 2, 4, 6, ___",              choices: ["7", "8", "9"],  answer: "8" },
    { id: "mc14", prompt: "🐠🐠🐠🐠🐠🐠🐠🐠 How many fish?",           choices: ["7", "8", "9"],  answer: "8" },
    { id: "mc15", prompt: "What number is BETWEEN 13 and 15?",       choices: ["12", "14", "16"], answer: "14" },
  ],

  // ── MERCY: PHONICS ───────────────────────────────────────────────────────────────────
  phonics: [
    { id: "mp1",  prompt: "What sound does B make?",                  choices: ["/b/ like Ball", "/p/ like Pop", "/d/ like Dog"],      answer: "/b/ like Ball" },
    { id: "mp2",  prompt: "Which word starts with the /S/ sound?",    choices: ["Moon", "Sun", "Run"],                               answer: "Sun" },
    { id: "mp3",  prompt: "Which word RHYMES with 'cat'?",             choices: ["Dog", "Hat", "Cup"],                                answer: "Hat" },
    { id: "mp4",  prompt: "What sound does M make?",                   choices: ["/m/ like Moon", "/n/ like Nut", "/b/ like Ball"],    answer: "/m/ like Moon" },
    { id: "mp5",  prompt: "Which word starts with the /T/ sound?",    choices: ["Fish", "Ball", "Tree"],                             answer: "Tree" },
    { id: "mp6",  prompt: "Which word RHYMES with 'dog'?",             choices: ["Cat", "Log", "Sun"],                                answer: "Log" },
    { id: "mp7",  prompt: "Which word starts with the /R/ sound?",    choices: ["Lamp", "Rain", "Moon"],                             answer: "Rain" },
    { id: "mp8",  prompt: "Which word RHYMES with 'sun'?",             choices: ["Run", "Cat", "Dog"],                                answer: "Run" },
    { id: "mp9",  prompt: "What sound does H make?",                   choices: ["/h/ like Hat", "/ch/ like Chip", "/j/ like Jam"],   answer: "/h/ like Hat" },
    { id: "mp10", prompt: "Which word starts with the /P/ sound?",    choices: ["Bear", "Star", "Pink"],                             answer: "Pink" },
    { id: "mp11", prompt: "Which word RHYMES with 'hop'?",             choices: ["Pop", "Cat", "Sun"],                                answer: "Pop" },
    { id: "mp12", prompt: "What letter makes the /K/ sound?",         choices: ["G", "K", "T"],                                     answer: "K" },
    { id: "mp13", prompt: "Which word starts with the /G/ sound?",    choices: ["Flower", "Green", "Yellow"],                        answer: "Green" },
    { id: "mp14", prompt: "Which word RHYMES with 'cake'?",            choices: ["Bake", "Cup", "Fish"],                              answer: "Bake" },
    { id: "mp15", prompt: "What sound does the letter F make?",        choices: ["/f/ like Fish", "/v/ like Van", "/b/ like Ball"],   answer: "/f/ like Fish" },
  ],

  // ── MERCY: SHAPES & COLORS ──────────────────────────────────────────────────
  shapes: [
    { id: "msh1",  prompt: "What color is 🔴?",                          choices: ["Blue", "Red", "Yellow"],     answer: "Red" },
    { id: "msh2",  prompt: "What color is 🔵?",                          choices: ["Blue", "Green", "Purple"],   answer: "Blue" },
    { id: "msh3",  prompt: "What color is 🟡?",                          choices: ["Orange", "Yellow", "Green"],  answer: "Yellow" },
    { id: "msh4",  prompt: "What shape is ⭕ (round)?",                  choices: ["Square", "Circle", "Triangle"], answer: "Circle" },
    { id: "msh5",  prompt: "What shape is ⬛ (4 equal sides)?",          choices: ["Circle", "Square", "Triangle"], answer: "Square" },
    { id: "msh6",  prompt: "What shape is 🔺 (3 corners)?",              choices: ["Circle", "Rectangle", "Triangle"], answer: "Triangle" },
    { id: "msh7",  prompt: "What color is 🟢?",                          choices: ["Blue", "Green", "Yellow"],   answer: "Green" },
    { id: "msh8",  prompt: "What color is 🟠?",                          choices: ["Red", "Orange", "Yellow"],   answer: "Orange" },
    { id: "msh9",  prompt: "How many sides does a triangle have?",        choices: ["2", "3", "4"],              answer: "3" },
    { id: "msh10", prompt: "How many sides does a square have?",         choices: ["3", "4", "5"],              answer: "4" },
    { id: "msh11", prompt: "A ball is what shape?",                      choices: ["Square", "Circle", "Triangle"], answer: "Circle" },
    { id: "msh12", prompt: "What color is the sky on a sunny day? ☀️",   choices: ["Green", "Red", "Blue"],      answer: "Blue" },
    { id: "msh13", prompt: "What shape is a pizza slice?",               choices: ["Circle", "Rectangle", "Triangle"], answer: "Triangle" },
    { id: "msh14", prompt: "What color is a banana? 🍌",                choices: ["Yellow", "Red", "Blue"],     answer: "Yellow" },
    { id: "msh15", prompt: "What color is 🟣?",                          choices: ["Blue", "Pink", "Purple"],    answer: "Purple" },
  ],

  // ── MERCY: ADDITION ─────────────────────────────────────────────────────────────────
  addition: [
    { id: "ma1",  prompt: "🍎 + 🍎 = ?  (1 + 1)",                     choices: ["1", "2", "3"],   answer: "2" },
    { id: "ma2",  prompt: "🐶🐶 + 🐶 = ?  (2 + 1)",                    choices: ["2", "3", "4"],   answer: "3" },
    { id: "ma3",  prompt: "🌟🌟 + 🌟🌟 = ?  (2 + 2)",                  choices: ["3", "4", "5"],   answer: "4" },
    { id: "ma4",  prompt: "🍎🍎🍎 + 🍎🍎 = ?  (3 + 2)",               choices: ["4", "5", "6"],   answer: "5" },
    { id: "ma5",  prompt: "🐱🐱🐱 + 🐱🐱🐱 = ?  (3 + 3)",             choices: ["5", "6", "7"],   answer: "6" },
    { id: "ma6",  prompt: "🌺🌺🌺🌺 + 🌺🌺🌺 = ?  (4 + 3)",           choices: ["6", "7", "8"],   answer: "7" },
    { id: "ma7",  prompt: "🐠🐠🐠🐠 + 🐠🐠🐠🐠 = ?  (4 + 4)",         choices: ["7", "8", "9"],   answer: "8" },
    { id: "ma8",  prompt: "🌟🌟🌟🌟🌟 + 🌟🌟🌟🌟 = ?  (5 + 4)",       choices: ["8", "9", "10"],  answer: "9" },
    { id: "ma9",  prompt: "🍎🍎🍎🍎🍎 + 🍎🍎🍎🍎🍎 = ?  (5 + 5)",     choices: ["9", "10", "11"], answer: "10" },
    { id: "ma10", prompt: "How much is 6 + 1?",                        choices: ["6", "7", "8"],   answer: "7" },
    { id: "ma11", prompt: "How much is 7 + 2?",                        choices: ["8", "9", "10"],  answer: "9" },
    { id: "ma12", prompt: "How much is 4 + 6?",                        choices: ["9", "10", "11"], answer: "10" },
    { id: "ma13", prompt: "How much is 8 + 1?",                        choices: ["8", "9", "10"],  answer: "9" },
    { id: "ma14", prompt: "How much is 3 + 7?",                        choices: ["9", "10", "11"], answer: "10" },
    { id: "ma15", prompt: "You have 🍎🍎 apples. You get 🍎🍎🍎 more. Total?", choices: ["4", "5", "6"], answer: "5" },
  ],

  // ── MERCY: BIBLE ────────────────────────────────────────────────────────────────
  "mercy-bible": [
    { id: "mb1",  prompt: "Who made the whole world? 🌍",                 choices: ["God made it", "It made itself", "People made it"],           answer: "God made it",          explanation: "Genesis 1 says God made everything, the stars, flowers, animals, and you!" },
    { id: "mb2",  prompt: "The Bible is God's special ___.",                choices: ["Book 📖", "Toy", "Game"],                                      answer: "Book 📖",               explanation: "The Bible is God's Word, He gave it to us so we can know Him and love Him." },
    { id: "mb3",  prompt: "God loves ___.",                                  choices: ["Only good people", "Everyone He made", "Only grown-ups"],    answer: "Everyone He made",     explanation: "John 3:16, God loves the whole world so much He sent Jesus for us!" },
    { id: "mb4",  prompt: "Who is Jesus?",                                   choices: ["A king far away", "God's Son who came to save us", "A good teacher only"], answer: "God's Son who came to save us", explanation: "Jesus is God's Son. He came to earth to rescue us from sin and bring us back to God." },
    { id: "mb5",  prompt: "Why did Jesus die on the cross?",                 choices: ["Because He lost a fight", "To pay for our sins so we can be forgiven", "Because He was tired"], answer: "To pay for our sins so we can be forgiven", explanation: "Jesus loved us so much He took our punishment. Now we can be forgiven and be with God!" },
    { id: "mb6",  prompt: "What happened after Jesus died, three days later?", choices: ["He stayed in the tomb", "He rose back to life!", "He went away forever"], answer: "He rose back to life!", explanation: "Easter is when we celebrate that Jesus rose! He is alive right now, and that means He really did save us." },
    { id: "mb7",  prompt: "What do we call talking to God?",                 choices: ["Singing", "Prayer", "Reading"],                              answer: "Prayer",               explanation: "Prayer is how we talk to God! We can thank Him, ask Him things, and tell Him we love Him." },
    { id: "mb8",  prompt: "Noah built a big ___ to save his family and animals. 🐘🦁🚢", choices: ["House", "Boat", "Tower"],                    answer: "Boat",                 explanation: "Noah trusted and obeyed God and built the ark. God kept them safe through the flood." },
    { id: "mb9",  prompt: "How many days did God take to create the world?", choices: ["3 days", "6 days", "10 days"],                               answer: "6 days",               explanation: "Genesis 1, God made everything in 6 days and rested on day 7. That's why we have a week!" },
    { id: "mb10", prompt: "Jesus said to children who came to Him: 'Let the little children come ___.'" , choices: ["back later", "to Me", "to school first"], answer: "to Me",              explanation: "Mark 10:14, Jesus welcomed children! He loves you just as you are." },
    { id: "mb11", prompt: "David was a shepherd boy who became ___.",         choices: ["A fisherman", "A king", "A teacher"],                        answer: "A king",               explanation: "1 Samuel, God chose young David, a shepherd boy, to become the great king of Israel." },
    { id: "mb12", prompt: "The Bible has a New Testament and an ___ Testament.", choices: ["Old", "Big", "Blue"],                                    answer: "Old",                  explanation: "The Bible has two main parts: the Old Testament (before Jesus) and the New Testament (about Jesus and after)." },
    { id: "mb13", prompt: "Jesus fed a huge crowd with 5 small loaves of bread and 2 ___.", choices: ["Cookies", "Fish 🐟", "Apples"],               answer: "Fish 🐟",              explanation: "John 6, Jesus took a little boy's lunch and made enough food for 5,000 people! Nothing is impossible for God." },
    { id: "mb14", prompt: "An angel told Mary: 'You will have a baby. Name Him ___.'" , choices: ["David", "Moses", "Jesus"],                          answer: "Jesus",                explanation: "Luke 1, The angel Gabriel told Mary she would have God's Son and to name Him Jesus, which means 'God saves.'" },
    { id: "mb15", prompt: "The Bible says God so loved the world that He gave His only ___.", choices: ["Gold", "Son", "Angel"],                    answer: "Son",                  explanation: "John 3:16, 'For God so loved the world that He gave His only Son.' Jesus is God's greatest gift to us!" },
  ],

  // ── LOIS: ABC ────────────────────────────────────────────────────────────────────────────
  abc: [
    { id: "la1",  prompt: "Which letter is this?  A",                 choices: ["B", "A", "C"],  answer: "A" },
    { id: "la2",  prompt: "🐱 CAT starts with which letter?",          choices: ["B", "C", "D"],  answer: "C" },
    { id: "la3",  prompt: "Which letter is this?  B",                 choices: ["A", "B", "D"],  answer: "B" },
    { id: "la4",  prompt: "🐶 DOG starts with which letter?",          choices: ["C", "D", "E"],  answer: "D" },
    { id: "la5",  prompt: "Which letter is this?  E",                 choices: ["E", "F", "G"],  answer: "E" },
    { id: "la6",  prompt: "🐸 FROG starts with which letter?",         choices: ["E", "F", "G"],  answer: "F" },
    { id: "la7",  prompt: "Which letter comes AFTER A?",               choices: ["A", "B", "C"],  answer: "B" },
    { id: "la8",  prompt: "🍇 GRAPE starts with which letter?",        choices: ["F", "G", "H"],  answer: "G" },
    { id: "la9",  prompt: "Which letter is this?  H",                 choices: ["G", "H", "I"],  answer: "H" },
    { id: "la10", prompt: "Which letter comes AFTER C?",               choices: ["B", "C", "D"],  answer: "D" },
    { id: "la11", prompt: "🦁 LION starts with which letter?",          choices: ["K", "L", "M"],  answer: "L" },
    { id: "la12", prompt: "Which letter is this?  M",                 choices: ["L", "M", "N"],  answer: "M" },
    { id: "la13", prompt: "🌙 MOON starts with which letter?",          choices: ["L", "M", "N"],  answer: "M" },
    { id: "la14", prompt: "Which letter is this?  S",                 choices: ["R", "S", "T"],  answer: "S" },
    { id: "la15", prompt: "🌟 STAR starts with which letter?",          choices: ["R", "S", "T"],  answer: "S" },
  ],

  // ── LOIS: NUMBERS ───────────────────────────────────────────────────────────────────────────
  numbers: [
    { id: "ln1",  prompt: "🐶 How many dogs?",                         choices: ["1", "2", "3"],  answer: "1" },
    { id: "ln2",  prompt: "🐶🐶 How many dogs?",                        choices: ["1", "2", "3"],  answer: "2" },
    { id: "ln3",  prompt: "🌟🌟🌟 How many stars?",                     choices: ["2", "3", "4"],  answer: "3" },
    { id: "ln4",  prompt: "🍎🍎🍎🍎 How many apples?",                  choices: ["3", "4", "5"],  answer: "4" },
    { id: "ln5",  prompt: "🐱🐱🐱🐱🐱 How many cats?",                  choices: ["4", "5", "6"],  answer: "5" },
    { id: "ln6",  prompt: "Which number is  3 ?",                      choices: ["2", "3", "4"],  answer: "3" },
    { id: "ln7",  prompt: "Which number is  1 ?",                      choices: ["1", "2", "3"],  answer: "1" },
    { id: "ln8",  prompt: "Which number is  5 ?",                      choices: ["4", "5", "6"],  answer: "5" },
    { id: "ln9",  prompt: "What comes AFTER 2?  1, 2, ___",           choices: ["1", "3", "4"],  answer: "3" },
    { id: "ln10", prompt: "What comes AFTER 4?  1, 2, 3, 4, ___",    choices: ["3", "5", "6"],  answer: "5" },
    { id: "ln11", prompt: "🦆🦆 How many ducks?",                       choices: ["1", "2", "3"],  answer: "2" },
    { id: "ln12", prompt: "🌺🌺🌺 How many flowers?",                   choices: ["2", "3", "4"],  answer: "3" },
    { id: "ln13", prompt: "Which number is BIGGER: 4 or 2?",           choices: ["2", "4", "Same"], answer: "4" },
    { id: "ln14", prompt: "🐣🐣🐣🐣 How many baby chicks?",             choices: ["3", "4", "5"],  answer: "4" },
    { id: "ln15", prompt: "What number comes BEFORE 5?",               choices: ["3", "4", "6"],  answer: "4" },
  ],

  // ── LOIS: COLORS ───────────────────────────────────────────────────────────────────────────
  colors: [
    { id: "lc1",  prompt: "What color is 🔴?",                         choices: ["Red", "Blue", "Green"],    answer: "Red" },
    { id: "lc2",  prompt: "What color is 🔵?",                         choices: ["Red", "Blue", "Yellow"],   answer: "Blue" },
    { id: "lc3",  prompt: "What color is 🟡?",                         choices: ["Purple", "Orange", "Yellow"], answer: "Yellow" },
    { id: "lc4",  prompt: "What color is 🟢?",                         choices: ["Blue", "Green", "Red"],    answer: "Green" },
    { id: "lc5",  prompt: "What color is 🟠?",                         choices: ["Red", "Yellow", "Orange"], answer: "Orange" },
    { id: "lc6",  prompt: "What color is 🟣?",                         choices: ["Purple", "Blue", "Pink"],  answer: "Purple" },
    { id: "lc7",  prompt: "A strawberry 🍓 is what color?",            choices: ["Blue", "Red", "Green"],   answer: "Red" },
    { id: "lc8",  prompt: "The sky ☁️ on a sunny day is what color?",  choices: ["Green", "Red", "Blue"],   answer: "Blue" },
    { id: "lc9",  prompt: "Grass 🌿 is what color?",                   choices: ["Green", "Yellow", "Purple"], answer: "Green" },
    { id: "lc10", prompt: "A banana 🍌 is what color?",               choices: ["Red", "Yellow", "Blue"],  answer: "Yellow" },
    { id: "lc11", prompt: "A pumpkin 🎃 is what color?",              choices: ["Yellow", "Purple", "Orange"], answer: "Orange" },
    { id: "lc12", prompt: "What color is fire 🔥 (the bright part)?", choices: ["Blue", "Red", "Green"],   answer: "Red" },
    { id: "lc13", prompt: "What color is a frog 🐸?",                 choices: ["Blue", "Red", "Green"],   answer: "Green" },
    { id: "lc14", prompt: "What color is the sun ☀️?",               choices: ["Yellow", "Orange", "Green"], answer: "Yellow" },
    { id: "lc15", prompt: "What color is 🟣, like grapes 🍇?",       choices: ["Blue", "Purple", "Pink"],  answer: "Purple" },
  ],

  // ── LOIS: SHAPES ──────────────────────────────────────────────────────────────────────────
  "lois-shapes": [
    { id: "ls1",  prompt: "What shape is ⭕ (round, like a ball)?",   choices: ["Square", "Circle", "Triangle"], answer: "Circle" },
    { id: "ls2",  prompt: "What shape is ⬛ (4 equal sides)?",         choices: ["Circle", "Square", "Triangle"], answer: "Square" },
    { id: "ls3",  prompt: "What shape is 🔺 (3 corners)?",             choices: ["Circle", "Square", "Triangle"], answer: "Triangle" },
    { id: "ls4",  prompt: "What shape is ⭐?",                         choices: ["Heart", "Star", "Circle"],      answer: "Star" },
    { id: "ls5",  prompt: "What shape is ❤️?",                        choices: ["Heart", "Star", "Triangle"],    answer: "Heart" },
    { id: "ls6",  prompt: "A pizza 🍕 slice looks like what shape?",  choices: ["Circle", "Square", "Triangle"], answer: "Triangle" },
    { id: "ls7",  prompt: "A ball is what shape?",                     choices: ["Square", "Circle", "Star"],     answer: "Circle" },
    { id: "ls8",  prompt: "A book cover is shaped like what?",         choices: ["Circle", "Triangle", "Square"], answer: "Square" },
    { id: "ls9",  prompt: "How many corners does a triangle have?",    choices: ["2", "3", "4"],                  answer: "3" },
    { id: "ls10", prompt: "What shape is a sunflower's center ⭕?",    choices: ["Triangle", "Circle", "Square"], answer: "Circle" },
    { id: "ls11", prompt: "What shape is ⭐?",                         choices: ["Circle", "Heart", "Star"],      answer: "Star" },
    { id: "ls12", prompt: "What shape has NO corners?",               choices: ["Square", "Triangle", "Circle"], answer: "Circle" },
    { id: "ls13", prompt: "What shape is ❤️, the love symbol?",      choices: ["Star", "Heart", "Circle"],      answer: "Heart" },
    { id: "ls14", prompt: "A sandwich cut in half looks like what?",   choices: ["Circle", "Triangle", "Square"], answer: "Triangle" },
    { id: "ls15", prompt: "What shape is a window? (4 sides)",        choices: ["Circle", "Triangle", "Square"], answer: "Square" },
  ],

  // ── TITUS: THEOLOGY (Catechism for Boys & Girls) ─────────────────────────────────────
  "titus-theology": [
    { id: "tt1",  prompt: "Who made you?",                                 choices: ["My parents made me", "God made me", "I made myself", "Nobody knows"],  answer: "God made me",          explanation: "The catechism asks this first because everything starts here: God is our Creator and we belong to Him!" },
    { id: "tt2",  prompt: "What else did God make?",                       choices: ["Only animals and plants", "Only people", "God made all things", "Only the earth"],        answer: "God made all things",    explanation: "Genesis 1, God made EVERYTHING out of nothing. That's called creation ex nihilo (out of nothing)!" },
    { id: "tt3",  prompt: "Why did God make you and all things?",          choices: ["So we could be happy", "For His own glory", "Because He was lonely", "By accident"],      answer: "For His own glory",      explanation: "God didn't NEED to create, He was already complete. He created to display His own greatness and goodness." },
    { id: "tt4",  prompt: "How can you glorify God?",                      choices: ["By being smart", "By loving Him and obeying Him", "By going to church only", "By being famous"], answer: "By loving Him and obeying Him", explanation: "Glorifying God means making Him look as great as He truly is, by loving and obeying Him!" },
    { id: "tt5",  prompt: "Are there more gods than one?",                 choices: ["Yes, many gods", "Yes, three gods", "There is only one God", "We don't know"],             answer: "There is only one God",  explanation: "Deuteronomy 6:4, 'The LORD is our God, the LORD alone.' This is called monotheism." },
    { id: "tt6",  prompt: "In how many persons does God exist?",           choices: ["One person", "Two persons", "Three persons", "Many persons"],                              answer: "Three persons",          explanation: "God is One Being in three persons: Father, Son, and Holy Spirit. This is the Trinity!" },
    { id: "tt7",  prompt: "What is God?",                                  choices: ["A body like a giant man", "A spirit with no body", "A cloud", "The universe itself"],      answer: "A spirit with no body",  explanation: "John 4:24, 'God is spirit.' He doesn't have a physical body, He's infinite and everywhere at once!" },
    { id: "tt8",  prompt: "Where do we learn how to love and obey God?",  choices: ["In our hearts only", "In the Bible alone", "From church leaders only", "From nature only"], answer: "In the Bible alone",    explanation: "The Bible is God's Word to us, the ONLY rule for what we believe and how we live." },
    { id: "tt9",  prompt: "Who were our first parents?",                  choices: ["Noah and his wife", "Abraham and Sarah", "Adam and Eve", "Moses and Miriam"],              answer: "Adam and Eve",           explanation: "Genesis 2, God formed Adam from dust and Eve from Adam's rib. They were the first humans." },
    { id: "tt10", prompt: "In what condition did God make Adam and Eve?", choices: ["Sinful from the start", "Holy and happy", "Confused and sad", "Partly sinful"],            answer: "Holy and happy",         explanation: "Genesis 1:31, Before the Fall, Adam and Eve were perfectly good, at peace with God. Sin changed that." },
    { id: "tt11", prompt: "What is sin?",                                 choices: ["Making mistakes", "Being mean sometimes", "Any transgression of God's law", "Only really big wrongs"], answer: "Any transgression of God's law", explanation: "1 John 3:4, Sin is breaking God's law in thought, word, or deed. Even one sin makes us guilty." },
    { id: "tt12", prompt: "Did Adam keep the covenant God made with him?", choices: ["Yes, perfectly", "No, he sinned against God", "Partly, just some rules", "We don't know"], answer: "No, he sinned against God", explanation: "Genesis 3, Adam and Eve ate the forbidden fruit. This is called the Fall, and it affected all of us." },
    { id: "tt13", prompt: "Who is Jesus Christ?",                         choices: ["A great prophet only", "An angel", "The Son of God who became man to save sinners", "A good example"], answer: "The Son of God who became man to save sinners", explanation: "John 3:16, God's eternal Son took on human flesh to rescue us from sin. This is the gospel!" },
    { id: "tt14", prompt: "Why did Jesus suffer and die?",                choices: ["By accident", "To be an example of courage", "To atone for our sins", "To start a new religion"], answer: "To atone for our sins", explanation: "Romans 5:8, Jesus died in our place, taking the punishment we deserved. He paid our debt to God." },
    { id: "tt15", prompt: "Where is Jesus now?",                          choices: ["Still in the tomb", "Walking on earth", "In heaven at God's right hand", "Everywhere but not in heaven"], answer: "In heaven at God's right hand", explanation: "Acts 1:9-11, After the resurrection, Jesus ascended to heaven and is interceding for us right now!" },
    { id: "tt16", prompt: "What do we do to receive salvation?",          choices: ["Be baptized and try hard", "Be good enough", "Believe in Jesus, trust and repent", "Earn it by obeying all the rules"], answer: "Believe in Jesus, trust and repent", explanation: "Ephesians 2:8, 'By grace you have been saved, through faith.' Faith in Christ is how we receive forgiveness." },
  ],

  // ── MERCY: THEOLOGY (Catechism for Boys & Girls, age 5) ──────────────────────────────
  "mercy-theology": [
    { id: "mt1", prompt: "Who made you? 🌸",                              choices: ["Mommy and Daddy", "God made me!", "I grew by myself", "The earth"],         answer: "God made me!",           explanation: "God made YOU! He made every part of you and loves you so much. You are His special creation! 🌺" },
    { id: "mt2", prompt: "What did God make besides you? 🌼",            choices: ["Only animals", "Only flowers", "God made ALL things!", "Only the sky"],      answer: "God made ALL things!",   explanation: "God made the flowers, the sky, the animals, and everything beautiful, ALL of it! 🌸" },
    { id: "mt3", prompt: "Why did God make you?",                         choices: ["To do chores", "For His glory, to love and enjoy Him!", "By accident", "To be smart"], answer: "For His glory, to love and enjoy Him!", explanation: "God made you to know Him and love Him! That's the best thing ever! 💛" },
    { id: "mt4", prompt: "How many Gods are there? 🌟",                  choices: ["Many gods", "Two gods", "Only ONE God!", "Three gods"],                       answer: "Only ONE God!",          explanation: "There is only ONE true God, the God of the Bible! He is real and He loves you! ⭐" },
    { id: "mt5", prompt: "Who are the three persons of God? ✝️",         choices: ["Father, Mother, Son", "Father, Son, and Holy Spirit", "God, Angel, Jesus", "Big, Medium, Small"], answer: "Father, Son, and Holy Spirit", explanation: "One God, three persons, Father, Son, and Holy Spirit. This is called the Trinity! It's a beautiful mystery! 🌺" },
    { id: "mt6", prompt: "Where do we learn about God? 📖",              choices: ["From TV", "From the Bible alone", "From our feelings only", "From dreams"],   answer: "From the Bible alone",   explanation: "The Bible is God's special book to us! It tells us everything we need to know about God and how to live. 📖" },
    { id: "mt7", prompt: "Who were the very first people God made? 🌿",  choices: ["Noah and his wife", "Mary and Joseph", "Adam and Eve", "Abraham and Sarah"],  answer: "Adam and Eve",           explanation: "God made Adam from dust and Eve from Adam's rib. They were the very first people! How amazing! 🌸" },
    { id: "mt8", prompt: "What is sin? 😔",                              choices: ["Only really big mistakes", "Forgetting things", "Disobeying God", "Being tired"],  answer: "Disobeying God",        explanation: "Sin is when we disobey God, not doing what He says, or doing what He says not to do. We all sin. 😔" },
    { id: "mt9", prompt: "Who saves us from sin? ✝️",                   choices: ["Ourselves if we try hard", "Our parents", "Jesus saves us!", "Good deeds"],     answer: "Jesus saves us!",        explanation: "Only Jesus can save us from sin! That's why He came, because He loves us so much! ❤️" },
    { id: "mt10", prompt: "Why did Jesus die on the cross? 🌸",         choices: ["By accident", "To show He was brave", "To save us from our sins!", "To start a church"], answer: "To save us from our sins!", explanation: "Jesus took the punishment for our sins so we could be forgiven! That's the best news ever, it's called the Gospel! 🌺" },
  ],

  // ── LOIS: THEOLOGY (simple catechism, age 3) ─────────────────────────────────────────
  "lois-theology": [
    { id: "lot1", prompt: "Who made you? 🌈",                            choices: ["God made me! ❤️", "Nobody made me", "I made myself"],                         answer: "God made me! ❤️",       explanation: "YES! God made you! He made every part of you and loves you SO MUCH! 🌈" },
    { id: "lot2", prompt: "Does God love you? ❤️",                       choices: ["Yes! SO much! ❤️", "Only sometimes", "I don't know"],                        answer: "Yes! SO much! ❤️",      explanation: "Yes yes YES! God loves you MORE than you can even imagine! 💕" },
    { id: "lot3", prompt: "Who is Jesus? ⭐",                            choices: ["God's Son who loves me!", "A superhero", "A friend far away"],                 answer: "God's Son who loves me!", explanation: "Jesus is God's Son! He came to earth because He loves you! ⭐" },
    { id: "lot4", prompt: "How many Gods are there? 🌟",                choices: ["Just ONE God!", "Many gods", "Two gods"],                                      answer: "Just ONE God!",          explanation: "There is ONE God, and He is SO good and loves you so much! 🌟" },
    { id: "lot5", prompt: "Can God see you right now? 👁️",              choices: ["Yes! God always sees me!", "Only at nighttime", "Only at church"],             answer: "Yes! God always sees me!", explanation: "God can see you ALWAYS! Everywhere you go, God is with you! 🌈" },
    { id: "lot6", prompt: "What do we call talking to God? 🙏",          choices: ["Praying!", "Singing only", "Sleeping"],                                       answer: "Praying!",               explanation: "We PRAY to talk to God! He loves to hear from you anytime, anywhere! 🙏" },
  ],

  // ── TITUS: LITERATURE (Aesop's Fables + Greek Myths) ─────────────────────────────────
  "titus-literature": [
    { id: "tl1",  prompt: "In 'The Tortoise and the Hare,' why did the HARE lose the race?",   choices: ["He ran the wrong way", "He was too slow", "He stopped to nap and the tortoise caught up", "He twisted his ankle"], answer: "He stopped to nap and the tortoise caught up", explanation: "The hare was fast but proud, he napped, thinking he had time. Moral: slow and steady wins the race. Consistency beats talent!" },
    { id: "tl2",  prompt: "In 'The Fox and the Grapes,' why did the fox say the grapes were sour?", choices: ["They actually were sour", "He couldn't reach them", "He was allergic", "Another fox told him"], answer: "He couldn't reach them", explanation: "The fox couldn't reach them, so he pretended they weren't worth having. Moral: don't pretend you don't want what you can't have." },
    { id: "tl3",  prompt: "In 'The Grasshopper and the Ant,' who had food in the winter?",     choices: ["The grasshopper", "Both of them", "Only the ant", "Neither"],              answer: "Only the ant",           explanation: "The ant worked hard all summer; the grasshopper sang and played. Moral: work now and you'll be ready later." },
    { id: "tl4",  prompt: "In 'The Boy Who Cried Wolf,' what happened when the real wolf came?", choices: ["Everyone ran to help", "Nobody believed the boy", "The wolf ran away", "The boy was safe"], answer: "Nobody believed the boy", explanation: "He had lied twice, so no one came when he really needed help. Moral: if you lie, people won't trust you when it counts." },
    { id: "tl5",  prompt: "In 'The Lion and the Mouse,' what did the tiny mouse do for the lion?", choices: ["Brought him food", "Chewed through the net to free him", "Warned him of hunters", "Became his servant"], answer: "Chewed through the net to free him", explanation: "The lion spared the mouse's life; later the mouse gnawed the net and freed the lion. Moral: even small friends can do great things." },
    { id: "tl6",  prompt: "In 'The Crow and the Pitcher,' how did the crow raise the water level?", choices: ["Waited for rain", "Tipped it over", "Dropped pebbles in one by one", "Used a straw"], answer: "Dropped pebbles in one by one", explanation: "The crow kept dropping stones until the water rose enough to drink. Moral: think creatively and persist!" },
    { id: "tl7",  prompt: "In 'The Wind and the Sun,' who got the man's coat off?",            choices: ["The wind by blowing hard", "The sun by warmth and gentleness", "The man took it off himself", "Rain soaked it off"], answer: "The sun by warmth and gentleness", explanation: "The harder the wind blew, the tighter the man held his coat. The sun's warmth made him take it off himself. Moral: gentleness works better than force." },
    { id: "tl8",  prompt: "In the TROJAN WAR myth, how did the Greeks finally get inside Troy?", choices: ["They dug a tunnel", "They climbed the walls", "They hid in a giant wooden horse", "They bribed the guards"], answer: "They hid in a giant wooden horse", explanation: "Odysseus's clever plan, the Greeks built a giant hollow horse, hid soldiers inside, and left it as a 'gift.' The Trojans brought it in, and the Greeks attacked at night." },
    { id: "tl9",  prompt: "In the myth of ICARUS, why did Icarus fall into the sea?",           choices: ["He got tired", "He flew too close to the sun and his wax wings melted", "A god pushed him", "He forgot to flap"], answer: "He flew too close to the sun and his wax wings melted", explanation: "His father Daedalus warned him, not too high! But Icarus got excited, flew too high, the wax melted. Moral: don't let pride make you ignore wise warnings." },
    { id: "tl10", prompt: "King MIDAS was granted one wish. What was it, and why was it terrible?", choices: ["To fly, but he got cold", "That everything he touched would turn to gold, even his food and family", "To be invisible, but he was lonely", "To be the strongest man"], answer: "That everything he touched would turn to gold, even his food and family", explanation: "Midas got his wish, but he couldn't eat, drink, or hug anyone. Greed always turns blessings into curses." },
    { id: "tl11", prompt: "The great Greek hero HERCULES (Heracles) was famous for completing how many impossible labors?", choices: ["7", "10", "12", "40"],         answer: "12",                     explanation: "The 12 Labors of Hercules, including slaying the Nemean Lion and cleaning the Augean stables. He's a picture of strength overcoming impossible odds." },
    { id: "tl12", prompt: "ODYSSEUS's journey home after the Trojan War took how long?",         choices: ["1 year", "5 years", "10 years", "20 years"],                             answer: "10 years",               explanation: "Homer's Odyssey follows Odysseus's 10-year journey home, facing the Cyclops, the Sirens, Scylla and Charybdis." },
    { id: "tl13", prompt: "In 'The Fox and the Stork,' the fox served soup in a flat dish. The stork couldn't eat it. The stork got revenge by serving soup in… what?", choices: ["A flat dish", "A tall narrow vase the fox couldn't reach into", "A locked box", "A frozen bowl"], answer: "A tall narrow vase the fox couldn't reach into", explanation: "The stork turned the fox's trick back on him! Moral: treat others as you want to be treated." },
    { id: "tl14", prompt: "What was the moral of 'The Dog and His Shadow'? (A dog drops a bone reaching for its reflection in water.)", choices: ["Dogs should swim better", "Greed can make you lose what you actually have", "Bones aren't worth fighting over", "Reflections are tricks"], answer: "Greed can make you lose what you actually have", explanation: "He already had a bone but wanted the 'bigger' one in the water, dropped his real bone and got nothing. Moral: be content with what you have!" },
    { id: "tl15", prompt: "In Greek myth, who is the king of all the Greek gods?",              choices: ["Poseidon", "Hades", "Zeus", "Apollo"],                                    answer: "Zeus",                   explanation: "Zeus rules from Mount Olympus. Poseidon rules the sea; Hades rules the underworld. Zeus rules them all." },
    { id: "tl16", prompt: "Which fable gives us the phrase 'sour grapes'?",                    choices: ["The Tortoise and the Hare", "The Fox and the Grapes", "The Lion and the Mouse", "The Crow and the Pitcher"], answer: "The Fox and the Grapes", explanation: "We still use 'sour grapes' today for dismissing something you can't have. That's why Aesop is still being quoted 2,600 years later!" },
    { id: "tl17", prompt: "In Pilgrim's Progress, what does Christian carry on his back that he cannot get off no matter what he tries?", choices: ["A treasure chest", "His heavy burden of sin and guilt", "A basket of food", "A sword"], answer: "His heavy burden of sin and guilt", explanation: "Christian's burden is the weight of sin, the guilt that crushes him and he cannot shake off on his own. Only one place will remove it. Psalm 38:4: 'My iniquities have gone over my head; like a heavy burden, they are too heavy for me.'" },
    { id: "tl18", prompt: "In Pilgrim's Progress, where does Christian's burden finally fall off? What does that moment teach us?", choices: ["At the Celestial City gates", "At the foot of the Cross, Jesus removes what we cannot remove ourselves", "In the Slough of Despond", "When he crosses the River"], answer: "At the foot of the Cross, Jesus removes what we cannot remove ourselves", explanation: "When Christian sees the Cross, 'his burden loosed from off his shoulders, and fell from off his back, and began to tumble, and continued to do so till it came to the mouth of the sepulchre, where it fell in, and I saw it no more.' Colossians 2:14, the record of debt nailed to the Cross. 3 leaps of joy!" },
    { id: "tl21", prompt: "In 'The Lion, the Witch and the Wardrobe,' Aslan dies to save Edmund and then comes back to life. What is this a picture of?", choices: ["An old magic spell", "Jesus dying for sinners and rising again", "A lion's natural powers", "A dream the children had"], answer: "Jesus dying for sinners and rising again", explanation: "C.S. Lewis wrote Narnia as a 'supposal', what might it look like if something like Jesus came to a world like Narnia? Aslan's death and resurrection mirrors the gospel. Romans 5:8: 'God shows His love for us in that while we were still sinners, Christ died for us.'" },
    { id: "tl20", prompt: "In J.R.R. Tolkien's 'The Hobbit,' what unexpected hero goes on an adventure with thirteen dwarves?", choices: ["Gandalf the wizard", "Bilbo Baggins, a small hobbit who never expected to be brave", "Frodo the ranger", "Aragorn the king"], answer: "Bilbo Baggins, a small hobbit who never expected to be brave", explanation: "Bilbo is a perfect picture of God choosing the unlikely. He didn't think he was hero material, but God uses the weak things to shame the strong (1 Cor. 1:27). The Hobbit teaches that courage is found by doing the next right thing, not by feeling ready." },
  ],

  // ── MERCY: LITERATURE (Aesop's Fables, age 5) ────────────────────────────────────────
  "mercy-literature": [
    { id: "ml1", prompt: "In 'The Tortoise and the Hare,' who won the race? 🐢",               choices: ["The fast rabbit 🐇", "The slow turtle 🐢", "They tied"],                   answer: "The slow turtle 🐢",    explanation: "The slow, steady turtle won! The fast rabbit took a nap and lost. Never give up! 🌸" },
    { id: "ml2", prompt: "In 'The Ant and the Grasshopper,' who had food in winter? ❄️",        choices: ["The grasshopper", "The ant 🐜", "Both of them"],                            answer: "The ant 🐜",             explanation: "The ant worked hard all summer storing food. The grasshopper just played. Always work hard! 🌺" },
    { id: "ml3", prompt: "The boy cried 'Wolf!' as a joke. When the REAL wolf came, what happened? 🐺", choices: ["People came running!", "Nobody came, they didn't believe him 😢", "The wolf was friendly"], answer: "Nobody came, they didn't believe him 😢", explanation: "Because he had lied before, people didn't trust him. Always tell the truth! 🌸" },
    { id: "ml4", prompt: "A tiny mouse helped a big lion. How? 🦁🐭",                           choices: ["He roared loudly", "He chewed the net and set the lion free!", "He called for help"],  answer: "He chewed the net and set the lion free!", explanation: "The little mouse was very helpful! Even small friends matter. Be kind to everyone! 💛" },
    { id: "ml5", prompt: "The crow needed water but the pitcher was almost empty. What did the crow do? 🐦", choices: ["Gave up", "Broke the pitcher", "Dropped little pebbles in until water rose!"], answer: "Dropped little pebbles in until water rose!", explanation: "The clever crow kept trying! When you can't solve a problem one way, think of another way! 🌸" },
    { id: "ml6", prompt: "The Wind tried to blow a man's coat off. Did it work? 💨",            choices: ["Yes, easily!", "No, the harder it blew, the tighter he held on", "A little bit"],  answer: "No, the harder it blew, the tighter he held on", explanation: "The Wind was too rough! The warm Sun was gentle, and the man took off his coat. Be gentle and kind! 🌺" },
    { id: "ml7", prompt: "The fox said the grapes were 'sour.' Were they really sour? 🍇",     choices: ["Yes, very sour", "No, he just couldn't reach them!", "A little sour"],       answer: "No, he just couldn't reach them!",   explanation: "The fox was making excuses! It's not nice to pretend you don't want something you can't have. 🌸" },
    { id: "ml8", prompt: "What is the lesson of 'The Tortoise and the Hare'? 🐢",              choices: ["Fast is always best!", "Slow and steady wins the race", "Races are for animals only"], answer: "Slow and steady wins the race",       explanation: "Keeping going, even slowly, is better than starting fast and giving up! 💛" },
    { id: "ml9", prompt: "Which story teaches: 'Work hard NOW so you're ready LATER'? 🌿",     choices: ["The Fox and the Grapes", "The Tortoise and the Hare", "The Ant and the Grasshopper"], answer: "The Ant and the Grasshopper",       explanation: "The ant worked and was ready for winter. The grasshopper played and wasn't! Work hard! 🌺" },
    { id: "ml10", prompt: "Which story teaches: 'Even a little friend can be a big help'? 🐭", choices: ["The Ant and the Grasshopper", "The Boy Who Cried Wolf", "The Lion and the Mouse"], answer: "The Lion and the Mouse",           explanation: "The tiny mouse helped the big lion! Be kind to EVERYONE, even little people can do big things! 🌸" },
    { id: "ml11", prompt: "In Pilgrim's Progress, Christian carries a heavy load. He walks to the Cross and BOOM, the load falls off! What does the heavy load mean? 🎉", choices: ["He was carrying too many toys", "His sin and sadness, which Jesus takes away at the Cross! ❤️", "He was very tired from walking", "He forgot to eat breakfast"], answer: "His sin and sadness, which Jesus takes away at the Cross! ❤️", explanation: "Christian jumped for joy when the load fell off! Jesus does that for us, He takes away our sin. That is the BEST news ever! 1 Peter 2:24: 'He bore our sins in his body.' 🌸" },
    { id: "ml13", prompt: "In a wonderful story called 'The Lion, the Witch and the Wardrobe,' a great lion named Aslan is brave and good. What does Aslan show us? 🦁", choices: ["That all lions are friendly", "What true goodness and love look like, like Jesus! ❤️", "That Narnia is a real place", "That witches always win"], answer: "What true goodness and love look like, like Jesus! ❤️", explanation: "Aslan is a beautiful story-picture of Jesus! He is perfectly good, perfectly brave, and he loves the children. C.S. Lewis wanted children to love Aslan and then see Jesus with new eyes. 🌸🦁" },
  ],

  // ── LOIS: LITERATURE (Simple Aesop, age 3) ───────────────────────────────────────────
  "lois-literature": [
    { id: "ll1", prompt: "Who won the big race? 🐢🐇",                                          choices: ["The slow turtle 🐢 won!", "The fast bunny won", "Nobody won"],               answer: "The slow turtle 🐢 won!", explanation: "YES! The little turtle kept going and going and WON! Keep trying! 🌈" },
    { id: "ll2", prompt: "Who worked all summer storing food? 🐜🌿",                           choices: ["The ant 🐜 worked hard!", "The grasshopper played", "Nobody worked"],          answer: "The ant 🐜 worked hard!", explanation: "The ant was a good worker! Working hard is a good thing! 💛" },
    { id: "ll3", prompt: "Did the tiny mouse help the BIG lion? 🦁🐭",                         choices: ["Yes! The mouse helped! 🐭❤️", "No, the mouse ran away", "A fish helped"],      answer: "Yes! The mouse helped! 🐭❤️", explanation: "Even a TINY mouse can be a big help! That's so wonderful! 🌟" },
    { id: "ll4", prompt: "The boy called 'WOLF!' as a joke. Was that a good idea? 🐺",         choices: ["No, we should always tell the truth!", "Yes, jokes are fun", "Maybe okay"],    answer: "No, we should always tell the truth!", explanation: "We always tell the truth! Then people can trust us. 🌈" },
    { id: "ll5", prompt: "Did the fox get the grapes? 🍇",                                     choices: ["No, he couldn't reach them!", "Yes he got them!", "He didn't want grapes"],    answer: "No, he couldn't reach them!", explanation: "The fox couldn't reach the grapes. It's okay when we can't get something! 💛" },
  ],

  // ── LOIS: BIBLE ────────────────────────────────────────────────────────────────────────
  "lois-bible": [
    { id: "lb1",  prompt: "Who made the stars? ⭐⭐⭐",                    choices: ["God did!", "Nobody made them", "We made them"],             answer: "God did!",                       explanation: "God made ALL the stars! He made the sky, the sun, and everything beautiful." },
    { id: "lb2",  prompt: "Who made the animals? 🐘🦁🐸",                choices: ["God made them!", "They made themselves", "Animals made each other"], answer: "God made them!",            explanation: "God made every animal! Big elephants, tiny frogs, and everything in between." },
    { id: "lb3",  prompt: "The Bible 📖 is God's special…",               choices: ["Book", "Toy", "Food"],                                      answer: "Book",                           explanation: "The Bible is God's book. It tells us about God and how much He loves us!" },
    { id: "lb4",  prompt: "God loves ___.",                                  choices: ["Me!", "Only big people", "Only animals"],                   answer: "Me!",                            explanation: "Yes! God loves YOU so much. He made you and knows your name!" },
    { id: "lb5",  prompt: "Noah built a big boat called an ARK 🚢 for all the animals 🐘🦒. Who told him to?", choices: ["His dad told him", "God told him", "A fish told him"], answer: "God told him", explanation: "God told Noah to build the ark. Noah listened and obeyed, and God kept them all safe!" },
    { id: "lb6",  prompt: "We talk to God by ___.",                          choices: ["Praying 🙏", "Sleeping", "Eating"],                            answer: "Praying 🙏",                    explanation: "Prayer is talking to God! We can talk to Him anytime, anywhere. He always listens." },
    { id: "lb7",  prompt: "Does Jesus love little children?",                choices: ["Yes! ❤️", "Only big kids", "Not sure"],                       answer: "Yes! ❤️",                       explanation: "Mark 10:14, Jesus said 'Let the children come to Me.' He loves YOU!" },
    { id: "lb8",  prompt: "God made the flowers 🌸🌼🌺. True or false?",       choices: ["True! God made flowers", "False, flowers grew alone", "Only some flowers"], answer: "True! God made flowers", explanation: "God made every beautiful flower! He loves making beautiful things for us to enjoy." },
    { id: "lb9",  prompt: "The Bible tells us about ___.",                   choices: ["God and His love ❤️", "Cartoons", "Cooking"],                  answer: "God and His love ❤️",           explanation: "The Bible is full of stories about God's love for us. It's the most important book ever!" },
    { id: "lb10", prompt: "Jesus fed LOTS of people with just 5 little loaves and 2 fish 🐟🐟!", choices: ["That's amazing! God can do anything!", "That's not possible", "Only a few people ate"], answer: "That's amazing! God can do anything!", explanation: "Jesus took a tiny lunch and made enough for thousands of people! God can do ANYTHING." },
    { id: "lb11", prompt: "God made YOU. Does He love you?",                 choices: ["Yes! So much! ❤️", "Only sometimes", "I'm not sure"],         answer: "Yes! So much! ❤️",            explanation: "Psalm 139, God made you and knows everything about you, and He loves you SO much!" },
    { id: "lb12", prompt: "The rainbow 🌈 in the sky is God's special ___.", choices: ["Promise", "Decoration", "Mistake"],                        answer: "Promise",                        explanation: "After Noah's flood, God put a rainbow in the sky as a promise. God always keeps His promises!" },
    { id: "lb13", prompt: "Baby Jesus was born in a ___. 🐑🌟",              choices: ["Stable (a place for animals)", "A castle", "A spaceship"],  answer: "Stable (a place for animals)",   explanation: "Luke 2, Jesus was born in a humble stable. Even though He's God's Son, He came in a simple, small place." },
    { id: "lb14", prompt: "Do we go to God when we pray?",                   choices: ["Yes! He hears us 🙏", "No, He is too busy", "Only on Sundays"], answer: "Yes! He hears us 🙏",            explanation: "God hears every prayer! Big prayers, little prayers, He loves to hear from you anytime." },
    { id: "lb15", prompt: "God made the whole world in how many days?",      choices: ["6 days", "1 day", "100 days"],                              answer: "6 days",                         explanation: "Genesis 1, God made EVERYTHING in 6 days! On day 7 He rested. What an amazing Creator!" },
  ],
};

export function getQuestions(kidId: string, gameId: string): Question[] {
  if (kidId === "lois" && gameId === "shapes") {
    return QUESTIONS["lois-shapes"] ?? [];
  }
  if (gameId === "bible") {
    return QUESTIONS[`${kidId}-bible`] ?? [];
  }
  // Per-kid theology and literature banks
  if (gameId === "theology" || gameId === "literature") {
    return QUESTIONS[`${kidId}-${gameId}`] ?? QUESTIONS[gameId] ?? [];
  }
  return QUESTIONS[gameId] ?? [];
}

export function getRandomQuestions(
  kidId: string,
  gameId: string,
  count: number
): Question[] {
  const all = getQuestions(kidId, gameId);
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length)).map((q) => ({
    ...q,
    scripture: QUESTION_SCRIPTURES[q.id] ?? q.scripture,
  }));
}
