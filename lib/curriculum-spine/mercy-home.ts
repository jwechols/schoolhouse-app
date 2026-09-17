import type { Course } from "./types";

export const MERCY_HOME: Course = {
  kidId: "mercy",
  subject: "home",
  subjectLabel: "Home Skills",
  emoji: "🏠",
  gradeLabel: "Kindergarten",
  stage: "grammar",
  overview:
    "Happy little jobs for helping at home, done to love and serve the family. Mercy learns to put away her toys, set the table, make her bed, help care for a pet or plant, wipe up spills, fold cloths, put shoes away, help a sister, and work cheerfully.",
  units: [
    {
      id: "mercy-home-u1",
      title: "Unit 1 · Little Helper",
      summary: "Toys away, set the table, make the bed, care for a pet, and wipe up spills.",
      lessons: [
        { id: "mercy-home-u1-l1", title: "Put Away Your Toys", objective: "Put toys back in their place when done playing.", teach: "When we finish playing, we put the toys back in their home: blocks in the bin, dolls on the shelf. A tidy room is a happy room! Cleaning up is a way to say thank you and to help Mom.", memoryWork: "When I'm done, I put it away. Helping is loving!" },
        { id: "mercy-home-u1-l2", title: "Set the Table", objective: "Put a plate, fork, and cup at each seat.", teach: "Setting the table helps everyone get ready to eat. Put a plate at each seat, a fork beside it, and a cup at the top. Count the seats so everyone has a place. What a good helper!", memoryWork: "A plate, a fork, and a cup for each person." },
        { id: "mercy-home-u1-l3", title: "Make Your Bed", objective: "Pull up the blanket and set the pillow.", teach: "In the morning, pull your blanket up smooth and set your pillow on top. Now your bed looks neat and cozy! Starting the day by making your bed is a lovely little habit.", memoryWork: "Blanket up, pillow on top. My bed is made!" },
        { id: "mercy-home-u1-l4", title: "Care for a Pet or Plant", objective: "Help feed a pet or water a plant.", teach: "Living things need care every day. We can give a pet fresh water and food, or water a thirsty plant. God takes care of us, and we get to help take care of His creatures. Gentle hands!", memoryWork: "Feed the pet, water the plant. Caring is kind." },
        { id: "mercy-home-u1-l5", title: "Wipe Up a Spill", objective: "Clean up a small spill with a cloth.", teach: "Everybody spills sometimes, and that's okay! Grab a cloth or paper towel and wipe it up, then throw the towel away or put it in the wash. Cleaning up your own spill is being responsible.", memoryWork: "If I spill, I wipe it up. That's being responsible!" },
      ],
    },
    {
      id: "mercy-home-u2",
      title: "Unit 2 · Cheerful Helper",
      summary: "Fold cloths, shoes by the door, help a sister, work without grumbling.",
      lessons: [
        { id: "mercy-home-u2-l1", title: "Fold the Washcloths", objective: "Fold a small cloth in half twice.", teach: "A washcloth folded neat is ready for the next wash. Fold in half, then half again. Small jobs done well make the whole house kinder.", memoryWork: "Fold it neat. Little jobs matter." },
        { id: "mercy-home-u2-l2", title: "Shoes by the Door", objective: "Put shoes in their place when coming in.", teach: "Shoes live by the door, not in the hall. Putting them away is honoring the house God gave us.", memoryWork: "Shoes by the door, every time." },
        { id: "mercy-home-u2-l3", title: "Help a Sister", objective: "Do one kind help for Lois or Truma.", teach: "Sisters are a gift. You can get a book, hold a hand, or pick up a toy she dropped. Love looks like help.", memoryWork: "Love looks like helping my sister." },
        { id: "mercy-home-u2-l4", title: "No Grumbling", objective: "Do a job with a cheerful face.", teach: "God tells us to do all things without grumbling (Philippians 2:14). A cheerful helper makes the work lighter for Mom. We work as for the Lord.", memoryWork: "Do it cheerfully, without grumbling." },
      ],
    },
  ],
};
