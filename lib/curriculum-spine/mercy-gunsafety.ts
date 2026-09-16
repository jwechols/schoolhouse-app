import type { Course } from "./types";

// Mercy, Gun Safety (grammar stage, Kindergarten age 5). Princess Rose teaches the
// Eddie Eagle rule with a little more understanding than Lois: guns are not toys,
// only trained grown-ups handle them, and the rule stays the same even when a friend
// is the one showing it. Calm, clear, no fear. Mom reads it aloud.

export const MERCY_GUNSAFETY: Course = {
  kidId: "mercy",
  subject: "gunsafety",
  subjectLabel: "Gun Safety",
  emoji: "🛑",
  gradeLabel: "Kindergarten",
  stage: "grammar",
  overview:
    "The most important gun rule for a five-year-old. Mercy learns that guns are not toys and are only for trained grown-ups, and that if she ever sees one she should stop, not touch it, get away, and tell a grown-up, even if it is a friend who shows her.",
  units: [
    {
      id: "mercy-gunsafety-u1",
      title: "Unit 1 · The Most Important Rule",
      summary: "Guns are not toys. Stop, don't touch, get away, tell a grown-up.",
      lessons: [
        { id: "mercy-gunsafety-u1-l1", title: "Guns Are Not Toys", objective: "Understand that a gun is not a toy and can hurt people.", teach: "A gun is a real tool that can hurt or even kill, so it is never a toy and never a game. Only grown-ups who have been carefully trained are allowed to hold one. That is why we have a special rule.", memoryWork: "A gun is not a toy." },
        { id: "mercy-gunsafety-u1-l2", title: "Stop and Don't Touch", objective: "If you see a gun, stop and do not touch it.", teach: "If you ever see a gun, STOP right where you are and do not touch it, not even one little bit. Your hands stay to yourself.", memoryWork: "Stop. Don't touch." },
        { id: "mercy-gunsafety-u1-l3", title: "Get Away and Tell", objective: "Leave the gun and tell a trusted grown-up.", teach: "Walk away from the gun and go find a grown-up you trust, like Mom or Dad, and tell them right away. You will never be in trouble for telling. Telling keeps everyone safe.", memoryWork: "Get away. Tell a grown-up." },
        { id: "mercy-gunsafety-u1-l4", title: "Even If a Friend Shows You", objective: "Follow the rule even when another child shows you a gun.", teach: "Sometimes a friend or another kid might find a gun and want to show you. The rule is exactly the same: don't touch, get away, and tell a grown-up. A good friend helps keep everyone safe.", memoryWork: "Same rule, even with a friend." },
        { id: "mercy-gunsafety-u1-l5", title: "The Whole Rule", objective: "Say the whole gun-safety rule from memory.", teach: "Let's say the whole rule together, big and brave: STOP. Don't touch. Get away. Tell a grown-up! You know exactly what to do now.", memoryWork: "Stop, don't touch, get away, tell a grown-up!" },
      ],
    },
  ],
};
