import type { Course } from "./types";

export const TITUS_HOME: Course = {
  kidId: "titus",
  subject: "home",
  subjectLabel: "Home Skills",
  emoji: "🏠",
  gradeLabel: "3rd Grade",
  stage: "grammar",
  overview:
    "Real skills for helping run the home, done as service to the family and to the Lord (Colossians 3:23). Titus learns to make his bed, wash dishes, start laundry, take out trash and tidy a room, help outside, care for the dogs, be ready for the Lord's Day, and honor Mom when the load is heavy.",
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
    {
      id: "titus-home-u2",
      title: "Unit 2 · A Son Who Serves",
      summary: "Dogs, tools, Lord's Day ready, honor Mom when she is tired.",
      lessons: [
        { id: "titus-home-u2-l1", title: "Feed and Water the Dogs", objective: "Feed and water the dogs without being asked.", teach: "Animals God put in your care eat every day, not when you feel like it. Check water first, then food, then a look to see they are well. A boy who keeps his word to a dog is learning to keep his word to people.", memoryWork: "The righteous man regards the life of his beast (Proverbs 12:10)." },
        { id: "titus-home-u2-l2", title: "Tools Go Back", objective: "Return tools and guns to their safe place.", teach: "A tool left out is a tool that gets lost or hurts someone. After you use it, wipe it and put it where it lives. The same rule holds for anything Dad has taught you is not a toy. Respect is how we handle dangerous good gifts.", memoryWork: "Use it, wipe it, put it back." },
        { id: "titus-home-u2-l3", title: "Ready for the Lord's Day", objective: "Lay out clothes and a quiet heart on Saturday.", teach: "The Lord's Day is not a scramble. Saturday night we lay out clothes, find a Bible, and go to bed on time so we can gather with the church without rushing. Preparing is a way of honoring the day God set apart.", memoryWork: "Remember the Lord's Day. Get ready the night before." },
        { id: "titus-home-u2-l4", title: "Honor Mom When She Is Tired", objective: "Notice a load and pick it up without being told.", teach: "A man in training sees when Mom is carrying too much. You can empty the dishwasher, take the baby a book, or just be quiet and helpful. Honor is not a speech. It is a son who makes her load lighter (Exodus 20:12).", memoryWork: "Honor your mother. Make her load lighter." },
      ],
    },
  ],
};
