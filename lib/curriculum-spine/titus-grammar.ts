import type { Course } from "./types";

// Titus, 3rd Grade English Grammar (grammar stage). MCA/Memoria model: this is the
// year to learn the RULES of English grammar by recitation (the "English Grammar
// Recitation" approach, definitions and rules memorized cold). Cover the 8 parts of
// speech, nouns, verbs, sentences, capitalization, and punctuation. Hunting/fishing
// scenarios throughout, matching Titus's outdoors theme and tutor Buck. The
// grammar-stage goal is that Titus can RECITE the rule, then spot it in a sentence.

export const TITUS_GRAMMAR: Course = {
  kidId: "titus",
  subject: "grammar",
  subjectLabel: "Grammar",
  emoji: "📝",
  gradeLabel: "3rd Grade",
  stage: "grammar",
  overview:
    "A full 3rd-grade English grammar year, learned the classical way: rules and definitions memorized by recitation, then spotted in real sentences. Titus meets all 8 parts of speech, digs into nouns and verbs, builds complete sentences with subjects and predicates, learns the four sentence types, and masters the rules for capitalization and punctuation. The grammar-stage goal is that Titus can recite each rule from memory and then find it at work in a sentence.",
  units: [
    {
      id: "titus-grammar-u1",
      title: "Unit 1 · The 8 Parts of Speech",
      summary: "Meet all eight jobs a word can do in a sentence.",
      lessons: [
        { id: "titus-grammar-u1-l1", title: "What the Parts of Speech Are", objective: "Name all 8 parts of speech and explain that they are the jobs words do.", teach: "Every word in English has a job, and there are eight kinds of jobs. They are the noun, pronoun, verb, adjective, adverb, preposition, conjunction, and interjection. Knowing a word's job helps you understand and build sentences. In 'Buck grabbed his rod,' Buck is a noun, grabbed is a verb, and his is a pronoun.", memoryWork: "The 8 parts of speech: noun, pronoun, verb, adjective, adverb, preposition, conjunction, interjection." },
        { id: "titus-grammar-u1-l2", title: "Nouns & Pronouns", objective: "Identify nouns and the pronouns that stand in for them.", teach: "A noun names a person, place, thing, or idea. A pronoun takes the place of a noun so you don't have to repeat it. In 'The hunter cleaned his rifle, then he oiled it,' hunter and rifle are nouns, while his, he, and it are pronouns standing in for them.", memoryWork: "A noun names a person, place, thing, or idea. A pronoun takes the place of a noun." },
        { id: "titus-grammar-u1-l3", title: "Verbs", objective: "Identify the verb as the word that shows action or being.", teach: "A verb shows action or being. Action verbs tell what someone does, like run, cast, or shoot. Being verbs tell that something IS, like am, is, are, was, were. In 'The dog swims across the pond,' swims is the action verb; in 'The lake is calm,' is is a being verb.", memoryWork: "A verb shows action or being." },
        { id: "titus-grammar-u1-l4", title: "Adjectives & Adverbs", objective: "Identify adjectives that describe nouns and adverbs that describe verbs.", teach: "An adjective describes a noun, telling which one, what kind, or how many. An adverb describes a verb, telling how, when, or where, and often ends in -ly. In 'The quick fox ran quietly,' quick is an adjective describing fox, and quietly is an adverb describing ran.", memoryWork: "An adjective describes a noun. An adverb describes a verb, adjective, or another adverb." },
        { id: "titus-grammar-u1-l5", title: "Prepositions", objective: "Identify prepositions that show position or direction.", teach: "A preposition shows the relationship between a noun and another word, often telling where or when. Words like in, on, under, over, by, and through are prepositions. In 'The bass hid under the log,' under tells where the bass hid.", memoryWork: "A preposition shows position or direction: in, on, under, over, by, through, with." },
        { id: "titus-grammar-u1-l6", title: "Conjunctions & Interjections", objective: "Identify conjunctions that join and interjections that exclaim.", teach: "A conjunction joins words or groups of words, like and, but, and or. An interjection is a word that shows sudden feeling and is often followed by an exclamation point. In 'Wow! We caught a bass and a catfish,' Wow is an interjection and and is a conjunction.", memoryWork: "A conjunction joins words together: and, but, or. An interjection shows strong feeling: Wow! Ouch! Hooray!" },
      ],
    },
    {
      id: "titus-grammar-u2",
      title: "Unit 2 · Nouns Up Close",
      summary: "Common and proper, singular and plural, and possessive nouns.",
      lessons: [
        { id: "titus-grammar-u2-l1", title: "Common & Proper Nouns", objective: "Tell the difference between common and proper nouns.", teach: "A common noun names any person, place, or thing and is not capitalized. A proper noun names a SPECIFIC one and always begins with a capital letter. 'lake' is a common noun, but 'Lake Alan Henry' is a proper noun; 'boy' is common, but 'Titus' is proper.", memoryWork: "A common noun names any person, place, or thing. A proper noun names a specific one and is always capitalized." },
        { id: "titus-grammar-u2-l2", title: "Singular & Plural Nouns", objective: "Form regular plurals by adding -s or -es.", teach: "A singular noun names one; a plural noun names more than one. Add -s to make most nouns plural. If a noun ends in s, x, ch, sh, or z, add -es. One hook becomes two hooks; one fox becomes two foxes; one bush becomes two bushes.", memoryWork: "Add -s for most plurals. Add -es to nouns ending in s, x, ch, sh, or z." },
        { id: "titus-grammar-u2-l3", title: "Tricky Plurals", objective: "Form plurals of nouns ending in y and irregular plurals.", teach: "When a noun ends in a consonant plus y, change the y to i and add -es: one berry becomes two berries. Some nouns change completely: one man becomes men, one deer stays deer, one goose becomes geese. These irregular plurals you just have to memorize.", memoryWork: "Consonant + y: change y to i, add -es. Some plurals are irregular: man/men, mouse/mice, deer/deer." },
        { id: "titus-grammar-u2-l4", title: "Singular Possessive Nouns", objective: "Show ownership by one person or thing using apostrophe + s.", teach: "A possessive noun shows that something belongs to someone. To make a singular noun show ownership, add an apostrophe and s ('s). 'The rod that belongs to Buck' becomes 'Buck's rod'; 'the collar of the dog' becomes 'the dog's collar.'", memoryWork: "To show one owner, add apostrophe + s: the hunter's dog." },
        { id: "titus-grammar-u2-l5", title: "Plural Possessive Nouns", objective: "Show ownership by more than one using an apostrophe after the s.", teach: "When a plural noun already ends in s, just add an apostrophe after the s to show ownership. 'The tackle of the boys' becomes 'the boys' tackle.' If a plural does not end in s, add apostrophe + s: 'the men's boots.'", memoryWork: "Plural noun ending in s: add just an apostrophe. The dogs' bowls, the hunters' camp." },
      ],
    },
    {
      id: "titus-grammar-u3",
      title: "Unit 3 · Verbs",
      summary: "Action verbs, being verbs, tense, and subject-verb agreement.",
      lessons: [
        { id: "titus-grammar-u3-l1", title: "Action Verbs", objective: "Identify action verbs that tell what the subject does.", teach: "An action verb tells what someone or something does. It is the word that shows the movement or the doing in a sentence. In 'The buck leaped over the fence,' leaped is the action verb; in 'Titus reeled in the fish,' reeled is the action verb.", memoryWork: "An action verb tells what the subject does." },
        { id: "titus-grammar-u3-l2", title: "Being Verbs", objective: "Identify being (linking) verbs that tell what something is.", teach: "A being verb does not show action; it tells that something exists or connects the subject to a word that describes it. The main being verbs are am, is, are, was, and were. In 'The water is cold,' is links water to cold; in 'They were hungry,' were links they to hungry.", memoryWork: "Being verbs: am, is, are, was, were, be, being, been." },
        { id: "titus-grammar-u3-l3", title: "Present & Past Tense", objective: "Change verbs between present and past tense.", teach: "Tense tells WHEN the action happens. Present tense happens now; past tense already happened. Add -ed to make most verbs past tense. 'I fish today' (present) becomes 'I fished yesterday' (past); 'They hunt' becomes 'they hunted.'", memoryWork: "Present tense = now. Past tense = already happened; add -ed to most verbs." },
        { id: "titus-grammar-u3-l4", title: "Future Tense & Irregular Verbs", objective: "Form the future tense and recognize irregular past-tense verbs.", teach: "Future tense tells what WILL happen; use the helping word will before the verb: 'I will fish tomorrow.' Some verbs do not add -ed for the past; they change form. Catch becomes caught, run becomes ran, go becomes went, swim becomes swam.", memoryWork: "Future tense uses will. Irregular verbs change form: catch/caught, run/ran, go/went." },
        { id: "titus-grammar-u3-l5", title: "Subject-Verb Agreement", objective: "Match a singular or plural subject to the correct verb.", teach: "The subject and verb must agree in number. A singular subject takes a verb that usually ends in s; a plural subject takes a verb without the s. 'The dog runs' (one dog) but 'The dogs run' (more than one). Say the pair out loud to hear if it sounds right.", memoryWork: "Singular subject, verb ends in s: the dog runs. Plural subject, no s: the dogs run." },
      ],
    },
    {
      id: "titus-grammar-u4",
      title: "Unit 4 · Building Sentences",
      summary: "Subjects, predicates, the four sentence types, and articles.",
      lessons: [
        { id: "titus-grammar-u4-l1", title: "What a Sentence Is", objective: "Recognize a complete sentence with a complete thought.", teach: "A sentence is a group of words that tells a complete thought. It begins with a capital letter and ends with an end mark. 'The dog barked' is a sentence; 'the big brown dog' is not, because it does not tell what happened.", memoryWork: "A sentence tells a complete thought. It starts with a capital and ends with an end mark." },
        { id: "titus-grammar-u4-l2", title: "The Complete Subject", objective: "Find the subject that tells who or what the sentence is about.", teach: "The subject of a sentence tells who or what the sentence is about. To find it, ask 'Who or what did something?' In 'The old hunting dog chased the rabbit,' the subject is 'The old hunting dog.' The simple subject is the main noun: dog.", memoryWork: "The subject tells who or what the sentence is about." },
        { id: "titus-grammar-u4-l3", title: "The Complete Predicate", objective: "Find the predicate that tells what the subject does or is.", teach: "The predicate tells what the subject does or is. It always contains the verb. To find it, ask 'What did the subject do?' In 'The old hunting dog chased the rabbit,' the predicate is 'chased the rabbit.' Every complete sentence needs both a subject and a predicate.", memoryWork: "The predicate tells what the subject does or is; it contains the verb." },
        { id: "titus-grammar-u4-l4", title: "The Four Kinds of Sentences", objective: "Name and identify the four sentence types by purpose.", teach: "There are four kinds of sentences. A statement (declarative) tells something and ends with a period. A question (interrogative) asks something and ends with a question mark. A command (imperative) tells you to do something. An exclamation (exclamatory) shows strong feeling and ends with an exclamation point. 'We caught a fish. Did you see it? Grab the net! What a monster!'", memoryWork: "Four sentences: statement (.), question (?), command (.), exclamation (!)." },
        { id: "titus-grammar-u4-l5", title: "Articles: a, an, the", objective: "Use the articles a, an, and the correctly.", teach: "Articles are little words that come before nouns. Use 'a' before a word starting with a consonant sound and 'an' before a vowel sound (a, e, i, o, u). Use 'the' for a specific one. 'A rod, an antler, the lake.' Say 'a boat' but 'an oar.'", memoryWork: "Use a before a consonant sound, an before a vowel sound, the for a specific one." },
      ],
    },
    {
      id: "titus-grammar-u5",
      title: "Unit 5 · Capitalization",
      summary: "The rules for which words begin with a capital letter.",
      lessons: [
        { id: "titus-grammar-u5-l1", title: "Sentences & the Word I", objective: "Capitalize the first word of a sentence and the word I.", teach: "Always begin a sentence with a capital letter. Also always capitalize the word 'I,' no matter where it sits in a sentence. 'Today I went fishing, and I caught two bass.' Both I's are capital.", memoryWork: "Capitalize the first word of a sentence and the word I." },
        { id: "titus-grammar-u5-l2", title: "Names & Proper Nouns", objective: "Capitalize the names of specific people, places, and pets.", teach: "Capitalize the names of specific people, places, and pets, because these are proper nouns. First and last names, the name of a town, and a dog's name all get capitals. 'Titus and his dog Ranger drove to Midland.'", memoryWork: "Capitalize names of specific people, places, and pets." },
        { id: "titus-grammar-u5-l3", title: "Days, Months & Holidays", objective: "Capitalize days of the week, months, and holidays.", teach: "Capitalize the days of the week, the months of the year, and the names of holidays. Do not capitalize the seasons. 'On Thanksgiving in November we went hunting on Saturday,' but 'we hunt every fall.'", memoryWork: "Capitalize days, months, and holidays. Do not capitalize seasons." },
        { id: "titus-grammar-u5-l4", title: "Titles & Special Words", objective: "Capitalize titles of books and the important words in a title.", teach: "Capitalize the first, last, and all important words in the title of a book, song, or movie. Skip small words like a, an, the, and of unless they come first. Also capitalize God and the Bible. 'We read The Call of the Wild.'", memoryWork: "In a title, capitalize the first, last, and all important words. Always capitalize God and the Bible." },
      ],
    },
    {
      id: "titus-grammar-u6",
      title: "Unit 6 · Punctuation",
      summary: "End marks, commas, and apostrophes.",
      lessons: [
        { id: "titus-grammar-u6-l1", title: "End Marks", objective: "Choose the correct end mark for each kind of sentence.", teach: "Every sentence ends with an end mark. Use a period for a statement or command, a question mark for a question, and an exclamation point for strong feeling. 'We set the trap. Where is the deer? A buck is coming!'", memoryWork: "Period for a statement or command. Question mark for a question. Exclamation point for strong feeling." },
        { id: "titus-grammar-u6-l2", title: "Commas in a Series", objective: "Use commas to separate three or more items in a list.", teach: "When you list three or more things, put a comma after each item except the last. Put the word 'and' before the last item. 'We packed rods, hooks, bait, and a net.' The commas keep the list clear.", memoryWork: "Use commas to separate three or more items in a series." },
        { id: "titus-grammar-u6-l3", title: "Commas in Dates & Places", objective: "Use commas in dates and between a city and state.", teach: "Put a comma between the day and the year in a date, and between a city and its state. 'We hunted on November 8, 2026, near Midland, Texas.' The comma keeps the numbers and names from running together.", memoryWork: "Comma between day and year, and between a city and its state: Midland, Texas." },
        { id: "titus-grammar-u6-l4", title: "Commas in Greetings & Lists of Words", objective: "Use commas after a greeting, a closing, and the word yes or no.", teach: "Use a comma after the greeting and the closing of a friendly letter: 'Dear Buck,' and 'Your friend,'. Also use a comma after yes or no at the start of a sentence. 'Yes, the fish are biting.'", memoryWork: "Comma after a letter greeting and closing, and after yes or no at the start." },
        { id: "titus-grammar-u6-l5", title: "Apostrophes in Possessives", objective: "Use an apostrophe to show ownership.", teach: "An apostrophe shows that something belongs to someone. Add apostrophe + s to a singular noun, and just an apostrophe to a plural that ends in s. 'Buck's boat' (one Buck) and 'the hunters' camp' (many hunters).", memoryWork: "Apostrophe + s shows one owner. Just an apostrophe shows plural owners: the dogs' bowls." },
        { id: "titus-grammar-u6-l6", title: "Apostrophes in Contractions", objective: "Use an apostrophe to join two words into a contraction.", teach: "A contraction is two words joined into one, with an apostrophe standing in for the missing letters. 'Do not' becomes 'don't'; 'I am' becomes 'I'm'; 'we will' becomes 'we'll'. The apostrophe marks exactly where the letters were removed.", memoryWork: "A contraction joins two words with an apostrophe for the missing letters: do not = don't." },
      ],
    },
  ],
};
