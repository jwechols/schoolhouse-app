import type { Course } from "./types";

// Mercy, Kindergarten Phonics/Reading (grammar stage). MCA/Memoria model: this is
// the year to learn every letter sound (Classical Phonics, the 44 phonograms), blend
// short-vowel CVC words, meet the digraphs and silent-e, and read the first sight
// words and simple sentences (First Start Reading). Gentle garden/flower flavor for a
// 5-year-old. Structure, depth, and tone follow titus-math.ts, the template course.

export const MERCY_PHONICS: Course = {
  kidId: "mercy",
  subject: "phonics",
  subjectLabel: "Phonics",
  emoji: "🔤",
  gradeLabel: "Kindergarten",
  stage: "grammar",
  overview:
    "A full Kindergarten reading year: learn the sound every letter makes, then blend those sounds into little words (cat, sun, bed). Meet the two-letter teams (sh, ch, th) and the magic silent-e that makes vowels say their names. Learn the first sight words by heart and read your very first sentences. The grammar-stage goal is a child who can sound out words and read simple sentences, one seed at a time until the whole garden grows.",
  units: [
    {
      id: "mercy-phonics-u1",
      title: "Unit 1 · Letter Sounds (the phonograms)",
      summary: "Learn the sound each letter makes, including the five short vowels.",
      lessons: [
        { id: "mercy-phonics-u1-l1", title: "Letters Make Sounds", objective: "Understand that each letter stands for a sound, and words are made of sounds.", teach: "Every letter has a job: it makes a sound. When we put sounds together, they make words, and words tell us things. Point to the letter S and hiss like a snake, 'sss.' God gave us words so we can read His Word and talk to the people we love. Reading is like planting seeds; one sound at a time grows into a whole garden.", memoryWork: "A letter is a picture of a sound." },
        { id: "mercy-phonics-u1-l2", title: "Short a, and m, s, t", objective: "Say the short a sound and the sounds for m, s, t.", teach: "Short a says 'aaa' like the a in apple. Open your mouth and say 'aaa.' M says 'mmm' like humming, s says 'sss' like a snake, t says 't' like a tiny tap. These are the first sounds we need to make our first little words.", memoryWork: "a = 'aaa' (apple), m = 'mmm', s = 'sss', t = 't'." },
        { id: "mercy-phonics-u1-l3", title: "Short i, and p, n", objective: "Say the short i sound and the sounds for p, n.", teach: "Short i says 'ih' like the i in igloo. P says 'p' like a little pop of your lips, n says 'nnn' like a humming nose. Feel your lips pop when you say p, and touch your nose when you say n. Practice: 'ih,' 'p,' 'nnn.'", memoryWork: "i = 'ih' (igloo), p = 'p', n = 'nnn'." },
        { id: "mercy-phonics-u1-l4", title: "Short o, and d, g", objective: "Say the short o sound and the sounds for d, g.", teach: "Short o says 'ah' like the o in octopus. Open wide like a doctor is looking in your mouth: 'ah.' D says 'd' like a drum, and g says 'g' like the g in goat (a hard g, from the back of your throat). Say them softly: 'ah,' 'd,' 'g.'", memoryWork: "o = 'ah' (octopus), d = 'd', g = 'g' (goat)." },
        { id: "mercy-phonics-u1-l5", title: "Short u, and b, f, h", objective: "Say the short u sound and the sounds for b, f, h.", teach: "Short u says 'uh' like the u in umbrella. B says 'b' like a bouncing ball, f says 'fff' like wind in the flowers, h says 'h' like a warm breath on your hands. Say each one and feel where it comes from: 'uh,' 'b,' 'fff,' 'h.'", memoryWork: "u = 'uh' (umbrella), b = 'b', f = 'fff', h = 'h'." },
        { id: "mercy-phonics-u1-l6", title: "Short e, and the last letters", objective: "Say the short e sound and the sounds for c, j, k, l, r, v, w, y, z.", teach: "Short e says 'eh' like the e in egg. Now we finish the garden of letters: c and k both say 'k,' j says 'j' like jam, l says 'lll,' r says 'rrr' like a growl, v says 'vvv,' w says 'w' like wind, y says 'y' like yes, z says 'zzz' like a bee. When you know all the sounds, you can start to read.", memoryWork: "e = 'eh' (egg); the five vowels are a, e, i, o, u." },
      ],
    },
    {
      id: "mercy-phonics-u2",
      title: "Unit 2 · Blending Short-a Words",
      summary: "Push sounds together to read your first little words.",
      lessons: [
        { id: "mercy-phonics-u2-l1", title: "Blending Two Sounds", objective: "Blend two sounds together smoothly (like 'at' and 'am').", teach: "Blending means sliding sounds together without stopping. Say 'aaa' then 't' and slide them: 'aaat,' 'at.' Try 'aaa' and 'mmm': 'am.' Don't say the sounds one at a time with breaks; let them hold hands and walk together.", memoryWork: "Blend by sliding: a-t makes 'at.'" },
        { id: "mercy-phonics-u2-l2", title: "The -at Family", objective: "Read CVC words in the -at family (cat, hat, mat, sat, bat).", teach: "A word family shares the same ending. Put a sound in front of 'at': c-at is cat, h-at is hat, m-at is mat. The same ending makes a whole family of words. If you can read one, you can read them all by swapping the first sound.", memoryWork: "-at: cat, hat, mat, sat, bat, rat." },
        { id: "mercy-phonics-u2-l3", title: "The -an Family", objective: "Read CVC words in the -an family (man, pan, can, fan, ran).", teach: "Now try the ending 'an.' Put a sound in front: m-an is man, p-an is pan, f-an is fan. Sound out the first letter, then slide into 'an.' A fan cools you off on a hot Midland afternoon.", memoryWork: "-an: man, pan, can, fan, ran, tan." },
        { id: "mercy-phonics-u2-l4", title: "The -ap and -ad Families", objective: "Read CVC words in the -ap and -ad families (map, nap, sad, dad).", teach: "Two more short-a families. 'ap' gives us map, nap, tap, lap; 'ad' gives us sad, dad, mad, had. Blend the first sound into the ending. When you take a nap you rest, just like we rest in the Lord who made us.", memoryWork: "-ap: map, nap, tap. -ad: sad, dad, had." },
        { id: "mercy-phonics-u2-l5", title: "Reading Short-a Words", objective: "Read a mix of short-a CVC words quickly and correctly.", teach: "Now mix the families up: cat, man, map, bad, ran, hat. Point to each word, sound it out, then say it fast. Reading gets easier the more you practice, like a flower opening a little more each sunny day.", memoryWork: "Every short-a word has the 'aaa' sound in the middle." },
      ],
    },
    {
      id: "mercy-phonics-u3",
      title: "Unit 3 · The Other Short Vowels",
      summary: "Read CVC words with i, o, u, and e.",
      lessons: [
        { id: "mercy-phonics-u3-l1", title: "Short i Words", objective: "Read CVC words with short i (sit, pig, win, big).", teach: "Now the vowel in the middle is i, saying 'ih.' Sound it out: s-i-t is sit, p-i-g is pig, b-i-g is big. The middle vowel tells your mouth what sound to make. A little pig sits in the mud.", memoryWork: "-it: sit, hit, bit. -ig: pig, big, dig. -in: win, pin, fin." },
        { id: "mercy-phonics-u3-l2", title: "Short o Words", objective: "Read CVC words with short o (dog, pot, hop, top).", teach: "The middle vowel is o, saying 'ah.' Blend it: d-o-g is dog, h-o-p is hop, t-o-p is top. Open your mouth wide for that 'ah' in the middle. A dog can hop over a log.", memoryWork: "-ot: pot, hot, dot. -og: dog, log, fog. -op: hop, top, mop." },
        { id: "mercy-phonics-u3-l3", title: "Short u Words", objective: "Read CVC words with short u (sun, bug, cup, run).", teach: "The middle vowel is u, saying 'uh.' Sound it out: s-u-n is sun, b-u-g is bug, c-u-p is cup. God made the sun to warm the flowers so they grow. A bug can sit on a bud.", memoryWork: "-un: sun, run, fun. -ug: bug, hug, rug. -up: cup, pup." },
        { id: "mercy-phonics-u3-l4", title: "Short e Words", objective: "Read CVC words with short e (bed, hen, red, wet).", teach: "The middle vowel is e, saying 'eh.' Blend it: b-e-d is bed, h-e-n is hen, r-e-d is red. A red hen sits in her nest. This is the last short vowel, so now you can read all five.", memoryWork: "-et: wet, pet, net. -en: hen, pen, ten. -ed: bed, red, fed." },
        { id: "mercy-phonics-u3-l5", title: "Mixing All the Vowels", objective: "Read CVC words with any short vowel and hear the middle sound.", teach: "Watch how the middle vowel changes the whole word: cat, cot, cut; pit, pot, pet. The first and last sounds stay, but the vowel in the middle changes everything. Listen closely to the middle sound and let it guide you.", memoryWork: "The vowel in the middle is the heart of the word." },
        { id: "mercy-phonics-u3-l6", title: "Beginning and Ending Sounds", objective: "Hear and name the first and last sound in a CVC word.", teach: "Every little word has a beginning, a middle, and an end. In 'map,' the first sound is 'mmm,' the middle is 'aaa,' the last is 'p.' Say a word slowly and stretch it out to hear each sound, like counting petals on a flower.", memoryWork: "Every CVC word: beginning sound, vowel, ending sound." },
      ],
    },
    {
      id: "mercy-phonics-u4",
      title: "Unit 4 · Letter Teams (Digraphs & Blends)",
      summary: "Two letters that team up to make one new sound.",
      lessons: [
        { id: "mercy-phonics-u4-l1", title: "The ck Team", objective: "Read words ending in ck (duck, sock, back, kick).", teach: "Sometimes two letters make one sound. C and k stand together as 'ck' and say just 'k' at the end of a short word. Sound it out: d-u-ck is duck, s-o-ck is sock. A duck has a little back.", memoryWork: "ck = 'k' at the end (duck, sock, back)." },
        { id: "mercy-phonics-u4-l2", title: "The sh Team", objective: "Read words with sh (ship, fish, shop, wish).", teach: "S and h team up to make 'shhh,' the quiet sound like when we hush. Blend it: sh-i-p is ship, f-i-sh is fish. The 'sh' is one sound even though it is two letters. We say 'shhh' to be still and listen.", memoryWork: "sh = 'shhh' (ship, fish, shop)." },
        { id: "mercy-phonics-u4-l3", title: "The ch Team", objective: "Read words with ch (chin, chip, much, chat).", teach: "C and h team up to say 'ch' like a little sneeze or a choo-choo train. Blend it: ch-i-n is chin, ch-i-p is chip. Touch your chin when you say 'chin.' The train goes 'ch-ch-ch.'", memoryWork: "ch = 'ch' (chin, chip, chop, much)." },
        { id: "mercy-phonics-u4-l4", title: "The th Team", objective: "Read words with th (this, that, with, thin).", teach: "T and h team up to make 'th,' with your tongue peeking out between your teeth. Blend it: th-i-s is this, th-a-t is that. We use 'this' and 'that' every day. Try it: put your tongue out a tiny bit and say 'thhh.'", memoryWork: "th = 'thh' (this, that, with, thin)." },
        { id: "mercy-phonics-u4-l5", title: "wh and Starting Blends", objective: "Read wh words and blends where two sounds slide together (whip, stop, flag, clap).", teach: "W and h make 'wh' like when you whisper 'what.' Some letters blend at the start, and you can still hear both: st-op is stop, fl-ag is flag, cl-ap is clap. Say each sound quickly and slide them together.", memoryWork: "wh = 'wh' (what, when); blends: st, fl, cl, bl slide two sounds." },
      ],
    },
    {
      id: "mercy-phonics-u5",
      title: "Unit 5 · Magic Silent-e (Long Vowels)",
      summary: "The silent e at the end that makes a vowel say its name.",
      lessons: [
        { id: "mercy-phonics-u5-l1", title: "The Magic e", objective: "Understand that a silent e at the end makes the vowel say its long name.", teach: "Here is a magic trick. When e comes at the end of a word, it is silent, but it reaches back and makes the vowel say its own name. 'cap' has short a, but add e and it becomes 'cape,' with a saying 'ay.' The e does not make a sound; it just does its magic.", memoryWork: "Silent e makes the vowel say its name." },
        { id: "mercy-phonics-u5-l2", title: "a_e Words", objective: "Read long a words with silent e (cake, gate, name, lake).", teach: "With a and a silent e, the a says 'ay' like in cake. Blend it: c-a-ke is cake, g-a-te is gate. Compare: 'tap' becomes 'tape,' 'can' becomes 'cane.' We can bake a cake with a name on it.", memoryWork: "a_e = 'ay' (cake, gate, name, lake)." },
        { id: "mercy-phonics-u5-l3", title: "i_e Words", objective: "Read long i words with silent e (bike, kite, time, five).", teach: "With i and a silent e, the i says 'eye' like in bike. Blend it: b-i-ke is bike, k-i-te is kite. Compare: 'kit' becomes 'kite,' 'rip' becomes 'ripe.' We can fly a kite for a long time.", memoryWork: "i_e = 'eye' (bike, kite, time, five)." },
        { id: "mercy-phonics-u5-l4", title: "o_e Words", objective: "Read long o words with silent e (rose, home, bone, nose.)", teach: "With o and a silent e, the o says 'oh' like in rose. Blend it: r-o-se is rose, h-o-me is home. Compare: 'not' becomes 'note,' 'hop' becomes 'hope.' A rose is a flower that smells sweet on your nose.", memoryWork: "o_e = 'oh' (rose, home, bone, nose)." },
        { id: "mercy-phonics-u5-l5", title: "u_e and e_e Words", objective: "Read long u and long e words with silent e (cute, mule, these).", teach: "With u and a silent e, the u says 'you' like in cute. With e and a silent e, the e says 'ee' like in these. Blend it: c-u-te is cute, th-e-se is these. Now the magic e works with every vowel.", memoryWork: "u_e = 'you' (cute, mule); e_e = 'ee' (these, Pete)." },
      ],
    },
    {
      id: "mercy-phonics-u6",
      title: "Unit 6 · Sight Words & First Sentences",
      summary: "Learn common words by heart and read your first sentences.",
      lessons: [
        { id: "mercy-phonics-u6-l1", title: "First Sight Words", objective: "Read the sight words the, a, I, is, it by heart.", teach: "Some words show up so often that we learn them by sight, quick as a snap, without sounding them out. These are: the, a, I, is, it. A few of them do not follow the rules, so we just remember them. Look, say, and remember.", memoryWork: "Sight words: the, a, I, is, it." },
        { id: "mercy-phonics-u6-l2", title: "More Sight Words", objective: "Read the sight words you, to, and, said, was by heart.", teach: "Here are five more words to know by heart: you, to, and, said, was. We use 'and' to join things, like 'a cat and a dog.' Practice each one until you know it the moment you see it.", memoryWork: "Sight words: you, to, and, said, was." },
        { id: "mercy-phonics-u6-l3", title: "Even More Sight Words", objective: "Read the sight words have, they, are, my, we by heart.", teach: "Five more friends to know by sight: have, they, are, my, we. These little words hold our sentences together. Say each one, then find it on a page and point to it. 'We are glad' uses three of them.", memoryWork: "Sight words: have, they, are, my, we." },
        { id: "mercy-phonics-u6-l4", title: "Reading a Sentence", objective: "Read a simple sentence with a capital, spaces, and a period.", teach: "A sentence starts with a big capital letter and ends with a period, a little dot that means stop. Words have spaces between them so we know where one ends. Read slowly, left to right: 'The cat is on the mat.' Point to each word as you read it.", memoryWork: "A sentence starts with a capital and ends with a period." },
        { id: "mercy-phonics-u6-l5", title: "Reading a Little Story", objective: "Read three short sentences in a row and understand what happened.", teach: "Now you can read a tiny story: 'I have a red hen. The hen sat on a big egg. We are so glad.' Read each sentence, then tell what happened in your own words. You are a reader now, and reading lets us open God's Word for ourselves.", memoryWork: "Read left to right, top to bottom, one word at a time." },
      ],
    },
  ],
};
