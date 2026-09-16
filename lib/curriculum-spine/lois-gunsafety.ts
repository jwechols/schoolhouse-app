import type { Course } from "./types";

// Lois, Gun Safety (grammar stage, Pre-K age 3). The Eddie Eagle rule, in Princess
// Crystal's 2-sentence warmth: if you ever see a gun, STOP, don't touch, get away,
// and tell a grown-up. A gun is never a toy. Taught gently, with no fear, just a
// clear, happy little rule she can remember. Mom reads it aloud.

export const LOIS_GUNSAFETY: Course = {
  kidId: "lois",
  subject: "gunsafety",
  subjectLabel: "Gun Safety",
  emoji: "🛑",
  gradeLabel: "Pre-K",
  stage: "grammar",
  overview:
    "The most important gun rule, just right for a three-year-old. If Lois ever sees a gun, she learns to STOP, not touch it, get away, and tell a grown-up. A gun is not a toy. It is taught calmly and clearly so she simply knows what to do.",
  units: [
    {
      id: "lois-gunsafety-u1",
      title: "Unit 1 · If You See a Gun",
      summary: "Stop, don't touch, get away, and tell a grown-up.",
      lessons: [
        { id: "lois-gunsafety-u1-l1", title: "Stop!", objective: "If you see a gun, stop right away.", teach: "A gun is not a toy. If you ever see one, the very first thing to do is STOP. Freeze like a little statue and do not go closer.", memoryWork: "If I see a gun, I STOP." },
        { id: "lois-gunsafety-u1-l2", title: "Don't Touch", objective: "Never touch a gun.", teach: "Never, ever touch a gun, even if it looks shiny or fun. Guns are only for grown-ups. Keep your hands to yourself.", memoryWork: "I do not touch a gun." },
        { id: "lois-gunsafety-u1-l3", title: "Get Away", objective: "Walk away from the gun.", teach: "After you stop and do not touch, walk away from the gun. Go out of the room to somewhere safe.", memoryWork: "I get away." },
        { id: "lois-gunsafety-u1-l4", title: "Tell a Grown-Up", objective: "Tell a trusted grown-up right away.", teach: "Go find Mom or Dad or a safe grown-up and tell them you saw a gun. Telling is the brave and good thing to do, and you will never be in trouble for telling.", memoryWork: "Stop, don't touch, get away, tell a grown-up!" },
      ],
    },
  ],
};
