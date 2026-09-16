import type { Course } from "./types";

// Lois, Home Skills (grammar stage, Pre-K age 3). The tiniest helping jobs, in Princess
// Crystal's 2-sentence warmth. Confessional framing at a toddler's level: helping makes
// God and Mom and Dad happy, and even little hands can help.
//
// Life Skills scaffolding adapted from the open skill taxonomy as a coverage map only.
// Source: github.com/withmarbleapp/os-taxonomy.

export const LOIS_HOME: Course = {
  kidId: "lois",
  subject: "home",
  subjectLabel: "Helping",
  emoji: "🏠",
  gradeLabel: "Pre-K",
  stage: "grammar",
  overview:
    "The very first helping jobs, just right for a three-year-old. Lois learns to put toys in the bin, put clothes in the hamper, throw trash away, and wipe her hands. Helping is a happy way to love her family.",
  units: [
    {
      id: "lois-home-u1",
      title: "Unit 1 · I Can Help!",
      summary: "Toys in the bin, clothes in the hamper, trash away, and wash hands.",
      lessons: [
        { id: "lois-home-u1-l1", title: "Toys in the Bin", objective: "Put toys into the bin.", teach: "When we finish, we put our toys in the bin. Cleaning up is a happy helper job!", memoryWork: "Toys go in the bin!" },
        { id: "lois-home-u1-l2", title: "Clothes in the Hamper", objective: "Put dirty clothes in the hamper.", teach: "Dirty clothes go in the hamper, not on the floor. You are such a big helper!", memoryWork: "Clothes go in the hamper!" },
        { id: "lois-home-u1-l3", title: "Throw Trash Away", objective: "Put trash in the trash can.", teach: "Little bits of trash go in the trash can. Keeping things clean is helping!", memoryWork: "Trash goes in the can!" },
        { id: "lois-home-u1-l4", title: "Wash Your Hands", objective: "Wash hands with soap and water.", teach: "We wash our hands with soap and water to get them clean. Rub, rub, rinse! Good job!", memoryWork: "Soap, rub, rinse. Clean hands!" },
      ],
    },
  ],
};
