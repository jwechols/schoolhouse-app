import type { Course } from "./types";

// Titus, Home Skills (grammar stage). Real, teachable home skills for an eight-year-old,
// framed as serving the family and working "as for the Lord" (Colossians 3:23). Faithful
// in little things (Luke 16:10). Hunting/fishing flavor where it fits. Confessional
// Reformed Baptist: work is good, given by God, and done in love for family and neighbor.
//
// Life Skills scaffolding adapted from the open skill taxonomy as a coverage map only;
// content authored in the family's idiom. Source: github.com/withmarbleapp/os-taxonomy.

export const TITUS_HOME: Course = {
  kidId: "titus",
  subject: "home",
  subjectLabel: "Home Skills",
  emoji: "🏠",
  gradeLabel: "3rd Grade",
  stage: "grammar",
  overview:
    "Real skills for helping run the home, done as service to the family and to the Lord (Colossians 3:23). Titus learns to make his bed, wash dishes, start laundry, take out trash and tidy a room, and help outside. The heart of it: a faithful worker is a blessing, and doing small jobs well is how we love our family and honor God.",
  units: [
    {
      id: "titus-home-u1",
      title: "Unit 1 · Serving the Family",
      summary: "Bed, dishes, laundry, tidying, and helping outside, done well and cheerfully.",
      lessons: [
        { id: "titus-home-u1-l1", title: "Make Your Bed", objective: "Make a bed neatly to start the day with order.", teach: "Making your bed is the first small win of the day. Pull the sheet flat, lay the blanket up smooth to the top, and set the pillow at the head. A made bed makes the whole room look cared for. Doing the small job well trains you for the big ones (Luke 16:10).", memoryWork: "Do the little job well. 'Whoever is faithful in a very little is faithful also in much' (Luke 16:10)." },
        { id: "titus-home-u1-l2", title: "Clear and Wash Dishes", objective: "Clear the table and wash or load dishes properly.", teach: "After a meal, scrape the plates into the trash, then wash with hot soapy water or load the dishwasher, cups on top. Rinse the sink when you finish. It is a small way to serve everyone who ate, and it keeps the kitchen ready for the next meal.", memoryWork: "Scrape, wash, rinse, and put away. Serving the family is serving the Lord." },
        { id: "titus-home-u1-l3", title: "Start the Laundry", objective: "Sort laundry and start a wash load safely.", teach: "Laundry starts with sorting: lights with lights, darks with darks, so colors do not bleed. Put the clothes in the washer, add the right amount of soap, and start it. Later, move the wet clothes to the dryer. It is a real grown-up skill, and you can learn it now.", memoryWork: "Sort lights from darks, add soap, and start the wash." },
        { id: "titus-home-u1-l4", title: "Take Out Trash & Tidy", objective: "Empty the trash and put a room back in order.", teach: "When the trash is full, tie the bag, take it out, and put a fresh bag in the can. To tidy a room, put every thing back in its home: shoes by the door, toys in the bin, books on the shelf. A place for everything, and everything in its place.", memoryWork: "A place for everything, and everything in its place." },
        { id: "titus-home-u1-l5", title: "Help Outside", objective: "Do a simple outdoor chore like yard work or caring for animals.", teach: "There is always good work outside: picking up sticks, pulling weeds, sweeping the porch, or feeding and watering animals. Outdoor chores keep the place God gave your family cared for, and hard work in the fresh air is a gift. Do it cheerfully, not grumbling.", memoryWork: "Work hard and cheerfully, without grumbling (Philippians 2:14)." },
      ],
    },
  ],
};
