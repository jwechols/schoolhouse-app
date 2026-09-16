import type { Course } from "./types";

// Lois, Pre-K ABC's (grammar stage, Memoria "Junior Kindergarten" model). Lois is 3.
// This is a gentle FIRST year of letters: recognize all 26 uppercase then lowercase
// letters, learn the one main sound each letter makes with a keyword, sing the alphabet
// in order, match big letters to their little partners, and take the very first steps of
// blending sounds into little words. Pre-reading grammar stage: it lives in memory work,
// chant, and song. Warm princess flavor throughout, for a mom to read aloud. Reformed
// (1689) worldview only where it's natural (God made me, God made the world).

export const LOIS_ABC: Course = {
  kidId: "lois",
  subject: "abc",
  subjectLabel: "ABC's",
  emoji: "🔤",
  gradeLabel: "Pre-K",
  stage: "grammar",
  overview:
    "A gentle first year of letters for a 3-year-old: recognize all 26 uppercase letters and their little lowercase partners, learn the one main sound each letter makes with a keyword to remember it, sing the alphabet in order, match big letters to little ones, and take the very first steps of blending sounds into little words. Unhurried, warm, and full of wonder that God made her mind to learn. Everything here is memory work, sung and chanted and celebrated.",
  units: [
    {
      id: "lois-abc-u1",
      title: "Unit 1 · Meet the Alphabet",
      summary: "What letters are, the ABC song, and big vs. little letters.",
      lessons: [
        { id: "lois-abc-u1-l1", title: "What Are Letters?", objective: "Know that letters are the little pieces we use to make words.", teach: "Letters are like tiny building blocks, and we put them together to make every word we read and say. God gave us letters so we can read His Word and tell people we love them.", memoryWork: "Letters make words." },
        { id: "lois-abc-u1-l2", title: "The Alphabet Song", objective: "Sing the ABC song from beginning to end.", teach: "There are 26 letters, and they always come in the same order. Let's sing them together, because singing helps your heart remember.", memoryWork: "A B C D E F G, H I J K L M N O P, Q R S, T U V, W X, Y and Z." },
        { id: "lois-abc-u1-l3", title: "Big Letters and Little Letters", objective: "See that every letter has a big shape and a little shape.", teach: "Every letter dresses two ways: a big UPPERCASE and a little lowercase, like a mama and her baby. Big A and little a are the very same letter.", memoryWork: "Big A, little a, they are the same letter." },
      ],
    },
    {
      id: "lois-abc-u2",
      title: "Unit 2 · Big Letters A–F",
      summary: "Find and say the sounds for uppercase A through F.",
      lessons: [
        { id: "lois-abc-u2-l1", title: "A and B", objective: "Find A and B and say their sounds.", teach: "A is the first letter, tall with a little belt, and it says /a/ like apple. B has a big round tummy and says /b/ like ball.", memoryWork: "A says /a/ like apple. B says /b/ like ball." },
        { id: "lois-abc-u2-l2", title: "C and D", objective: "Find C and D and say their sounds.", teach: "C is an open curve, like a crown with a piece missing, and it says /k/ like cat. D has a straight back and a round front, and it says /d/ like dog.", memoryWork: "C says /k/ like cat. D says /d/ like dog." },
        { id: "lois-abc-u2-l3", title: "E and F", objective: "Find E and F and say their sounds.", teach: "E has three little arms reaching out, and it says /e/ like egg. F looks like E with the bottom arm gone, and it says /f/ like flower.", memoryWork: "E says /e/ like egg. F says /f/ like flower." },
      ],
    },
    {
      id: "lois-abc-u3",
      title: "Unit 3 · Big Letters G–L",
      summary: "Find and say the sounds for uppercase G through L.",
      lessons: [
        { id: "lois-abc-u3-l1", title: "G and H", objective: "Find G and H and say their sounds.", teach: "G is like a C with a little shelf inside, and it says /g/ like goat. H is two tall poles holding hands in the middle, and it says /h/ like hat.", memoryWork: "G says /g/ like goat. H says /h/ like hat." },
        { id: "lois-abc-u3-l2", title: "I and J", objective: "Find I and J and say their sounds.", teach: "I is one straight, easy line standing tall, and it says /i/ like igloo. J is a tall line with a little hook at the bottom, and it says /j/ like jam.", memoryWork: "I says /i/ like igloo. J says /j/ like jam." },
        { id: "lois-abc-u3-l3", title: "K and L", objective: "Find K and L and say their sounds.", teach: "K has a straight back and two little kicking legs, and it says /k/ like king. L is a tall line with a foot at the bottom, and it says /l/ like love.", memoryWork: "K says /k/ like king. L says /l/ like love." },
      ],
    },
    {
      id: "lois-abc-u4",
      title: "Unit 4 · Big Letters M–R",
      summary: "Find and say the sounds for uppercase M through R.",
      lessons: [
        { id: "lois-abc-u4-l1", title: "M and N", objective: "Find M and N and say their sounds.", teach: "M has two tall mountains side by side, and it says /m/ like moon. N has one little slide in the middle, and it says /n/ like nest.", memoryWork: "M says /m/ like moon. N says /n/ like nest." },
        { id: "lois-abc-u4-l2", title: "O and P", objective: "Find O and P and say their sounds.", teach: "O is a perfect round circle, like the moon in the sky God made, and it says /o/ like octopus. P is a straight line with a bump at the top, and it says /p/ like princess.", memoryWork: "O says /o/ like octopus. P says /p/ like princess." },
        { id: "lois-abc-u4-l3", title: "Q and R", objective: "Find Q and R and say their sounds.", teach: "Q is an O with a little tail, like a queen with a train on her dress, and it says /kw/ like queen. R stands like P with a leg kicked out, and it says /r/ like rose.", memoryWork: "Q says /kw/ like queen. R says /r/ like rose." },
      ],
    },
    {
      id: "lois-abc-u5",
      title: "Unit 5 · Big Letters S–Z",
      summary: "Find and say the sounds for uppercase S through Z (the whole alphabet!).",
      lessons: [
        { id: "lois-abc-u5-l1", title: "S and T", objective: "Find S and T and say their sounds.", teach: "S curves like a slide or a little snake, and it says /s/ like sun. T is a tall line wearing a hat on top, and it says /t/ like tiara.", memoryWork: "S says /s/ like sun. T says /t/ like tiara." },
        { id: "lois-abc-u5-l2", title: "U and V", objective: "Find U and V and say their sounds.", teach: "U is a happy smiley cup, and it says /u/ like umbrella. V is a pointy little valley, and it says /v/ like violet.", memoryWork: "U says /u/ like umbrella. V says /v/ like violet." },
        { id: "lois-abc-u5-l3", title: "W and X", objective: "Find W and X and say their sounds.", teach: "W is two V's holding hands, and it says /w/ like wand. X is two lines that cross, like a little kiss, and it says /ks/ at the end of fox.", memoryWork: "W says /w/ like wand. X says /ks/ like fox." },
        { id: "lois-abc-u5-l4", title: "Y and Z", objective: "Find Y and Z and say their sounds.", teach: "Y is a little cup on a stick, and it says /y/ like yarn. Z zigzags like a lightning bolt, and it says /z/ like zebra. Now you have met the whole alphabet!", memoryWork: "Y says /y/ like yarn. Z says /z/ like zebra." },
      ],
    },
    {
      id: "lois-abc-u6",
      title: "Unit 6 · Little Letters & Matching",
      summary: "Meet the lowercase letters and match each big letter to its little one.",
      lessons: [
        { id: "lois-abc-u6-l1", title: "Little a–g", objective: "Find the little letters a, b, c, d, e, f, g.", teach: "Now meet the baby letters. Little a, b, c, d, e, f, and g make the very same sounds as their big letters. Little a still says /a/ like apple.", memoryWork: "Little letters make the same sounds as big letters." },
        { id: "lois-abc-u6-l2", title: "Little h–n", objective: "Find the little letters h, i, j, k, l, m, n.", teach: "Here come little h, i, j, k, l, m, and n. Some are tall like h and l, and some are short like a and n. Little m still says /m/ like moon.", memoryWork: "Tall letters and short letters, all the same sounds." },
        { id: "lois-abc-u6-l3", title: "Little o–t", objective: "Find the little letters o, p, q, r, s, t.", teach: "Now little o, p, q, r, s, and t. Little p and q hang their tails down below the line. Little t still says /t/ like tiara.", memoryWork: "Little p and q hang down low." },
        { id: "lois-abc-u6-l4", title: "Little u–z", objective: "Find the little letters u, v, w, x, y, z.", teach: "Little u, v, w, x, y, and z finish the whole family, and little y hangs its tail down too. Now you know all 26 little letters!", memoryWork: "26 big letters and 26 little letters." },
        { id: "lois-abc-u6-l5", title: "Matching Big to Little", objective: "Match each big letter to its little letter.", teach: "Every big letter has a matching little letter, like a mama duck and her duckling. Big B goes with little b, and big R goes with little r.", memoryWork: "Big B, little b. Big R, little r. Always a matching pair." },
      ],
    },
    {
      id: "lois-abc-u7",
      title: "Unit 7 · First Sounds Together",
      summary: "The very first steps of pushing letter sounds together into little words.",
      lessons: [
        { id: "lois-abc-u7-l1", title: "Two Sounds Make a Word", objective: "Blend two sounds together into a tiny word.", teach: "When we push two sounds together, they make a word! Slide /a/ and /t/ together and they say 'at'. You just read a word, little one.", memoryWork: "/a/ /t/ says 'at'." },
        { id: "lois-abc-u7-l2", title: "Beginning Sounds", objective: "Hear the very first sound in a word.", teach: "Every word starts with a sound. 'Sun' starts with /s/, and 'mop' starts with /m/. Listen closely for the very first sound.", memoryWork: "Sun starts with /s/. Mop starts with /m/." },
        { id: "lois-abc-u7-l3", title: "Sound It Out", objective: "Sound out a three-sound word slowly, then fast.", teach: "Say each sound slow, then push them together fast: /c/ /a/ /t/... cat! Look at you, you are reading.", memoryWork: "/c/ /a/ /t/ says 'cat'." },
        { id: "lois-abc-u7-l4", title: "Little Words I Can Read", objective: "Read a few short words that end in 'at'.", teach: "Now try more: hat, mat, sat. They all end the same way and just change the first sound. God made your mind able to learn, and look how much you already know!", memoryWork: "cat, hat, mat, sat." },
      ],
    },
  ],
};
