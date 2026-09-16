import type { Course } from "./types";

// Mercy, Home Skills (grammar stage, Kindergarten). Simple, doable helping jobs for a
// five-year-old, framed as loving and serving the family. Warm and concrete. Confessional
// framing: helping is a happy way to love others and honor God (Colossians 3:23).
//
// Life Skills scaffolding adapted from the open skill taxonomy as a coverage map only.
// Source: github.com/withmarbleapp/os-taxonomy.

export const MERCY_HOME: Course = {
  kidId: "mercy",
  subject: "home",
  subjectLabel: "Home Skills",
  emoji: "🏠",
  gradeLabel: "Kindergarten",
  stage: "grammar",
  overview:
    "Happy little jobs for helping at home, done to love and serve the family. Mercy learns to put away her toys, set the table, make her bed, help care for a pet or plant, and wipe up spills. Helping is a joyful way to love others, and even small hands can do good work for God.",
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
  ],
};
