import type { Course } from "./types";

// Lois, Home Skills (grammar stage, Pre-K age 3). Princess Crystal's 2-sentence warmth.
// Confessional framing at a toddler's level: helping makes God and Mom and Dad happy.

export const LOIS_HOME: Course = {
  kidId: "lois",
  subject: "home",
  subjectLabel: "Helping",
  emoji: "🏠",
  gradeLabel: "Pre-K",
  stage: "grammar",
  overview:
    "The very first helping jobs, just right for a three-year-old. Lois learns to put toys in the bin, put clothes in the hamper, throw trash away, wash her hands, share, come when called, use gentle hands, and help her sisters. Helping is a happy way to love her family.",
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
    {
      id: "lois-home-u2",
      title: "Unit 2 · Kind Little Hands",
      summary: "Share, come when called, gentle hands, and help a sister.",
      lessons: [
        { id: "lois-home-u2-l1", title: "We Share", objective: "Offer a toy to a sister.", teach: "God gives us good things to share. When we share a toy, we love our sister.", memoryWork: "Share. God loves a cheerful giver!" },
        { id: "lois-home-u2-l2", title: "Come When Called", objective: "Come to Mom or Dad when they call.", teach: "When Mom or Dad says your name, we come. Coming quickly is honoring them, and that makes God glad.", memoryWork: "When they call, I come!" },
        { id: "lois-home-u2-l3", title: "Gentle Hands", objective: "Touch people and pets gently.", teach: "Hands can hug, help, and hold. Gentle hands show love. No hitting. Jesus is kind, and we can be kind too.", memoryWork: "Gentle hands. Kind like Jesus." },
        { id: "lois-home-u2-l4", title: "Help a Sister", objective: "Do one small help for Mercy or Truma.", teach: "Big sisters and little sisters take care of each other. You can bring a book, a sock, or a smile.", memoryWork: "I can help my sister!" },
      ],
    },
  ],
};
