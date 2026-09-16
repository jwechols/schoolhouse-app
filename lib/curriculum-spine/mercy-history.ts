import type { Course } from "./types";

// Mercy, Kindergarten History (grammar stage). "His story": a first taste of long ago,
// told as stories for a five-year-old. Concrete and wonder-filled (pyramids, castles,
// knights), and always under God's rule of all the kingdoms of men (Daniel 2:21; Psalm
// 22:28). Where the ancient nations worshiped false gods, we tell the truth plainly and
// kindly: there is only one true God (Isaiah 45:5). Bible connections are drawn where they
// belong (Joseph and Moses in Egypt; Rome in the days of Jesus and Paul). Princess Rose's
// warm voice. Confessional Reformed Baptist framing throughout.
//
// Skill scaffolding (the ordered topics + mastery evidence) is adapted from the Marble
// open skill taxonomy, Kindergarten History domains, used as a coverage map only. The
// taxonomy's Common Core / national-curriculum alignment file is NOT used, and all
// teaching content is authored fresh in the family's confessional idiom.
// Source: github.com/withmarbleapp/os-taxonomy (ODbL 1.0 / CC BY-SA 4.0).

export const MERCY_HISTORY: Course = {
  kidId: "mercy",
  subject: "history",
  subjectLabel: "History",
  emoji: "🏛️",
  gradeLabel: "Kindergarten",
  stage: "grammar",
  overview:
    "A first taste of long ago, told as stories. Mercy learns that history is what happened before now, and that we find out about it from old things left behind. She visits ancient Egypt with its great river and pyramids (where Joseph and Moses lived), meets the Greeks and Romans (Rome ruled the world when Jesus was born), and steps into the age of castles, kings, knights, and Vikings. Through it all runs one true story: God has always been King over every land and every age (Daniel 2:21).",
  units: [
    {
      id: "mercy-history-u1",
      title: "Unit 1 · Long Ago and Today",
      summary: "What history is, how life long ago was different, and how we know.",
      lessons: [
        { id: "mercy-history-u1-l1", title: "What Is History?", objective: "Know that history is things that happened long ago.", teach: "History is the story of things that happened long ago, before you were born, before even Grandma was born. Kings, families, and whole countries lived long ago. And God was there the whole time, ruling over all of it.", memoryWork: "History is what happened long ago. God has always been King." },
        { id: "mercy-history-u1-l2", title: "Long Ago vs. Today", objective: "Tell one way life long ago was different from today.", teach: "Long ago, life was very different. There were no cars, no lights, and no phones. People rode horses, lit candles, and wrote with feathers. It is fun to see how much has changed, and to thank God for both then and now.", memoryWork: "Long ago there were no cars or phones. People rode horses and used candles." },
        { id: "mercy-history-u1-l3", title: "How We Know: Clues from the Past", objective: "Know we learn about long ago from old things left behind.", teach: "How do we know about long ago? People find clues that were left behind: old bones, broken pots, coins, and buildings. People who dig up these clues are called archaeologists. The clues help us learn the true story of the past.", memoryWork: "We learn about long ago from clues left behind, like old pots and buildings." },
      ],
    },
    {
      id: "mercy-history-u2",
      title: "Unit 2 · Ancient Egypt",
      summary: "The Nile, the pyramids, the pharaohs, and the one true God.",
      lessons: [
        { id: "mercy-history-u2-l1", title: "The Nile River and the Desert", objective: "Know Egypt has a great river and a big desert.", teach: "Egypt is a land far away with a giant river called the Nile and a hot, sandy desert all around. The people lived close to the river because it gave them water to drink and to grow their food. God gave them that river.", memoryWork: "Egypt has a great river called the Nile and a big sandy desert." },
        { id: "mercy-history-u2-l2", title: "The Pyramids and the Sphinx", objective: "Know the Egyptians built huge pyramids long ago.", teach: "Long ago the Egyptians built giant pyramids out of huge stone blocks, taller than many buildings today. They also carved a huge stone lion with a man's face called the Sphinx. It took thousands of workers many years to build them.", memoryWork: "The Egyptians built giant stone pyramids and the great Sphinx." },
        { id: "mercy-history-u2-l3", title: "Pharaohs, Joseph, and Moses", objective: "Know a pharaoh was a king of Egypt, and connect it to the Bible.", teach: "The king of Egypt was called Pharaoh. In the Bible, God sent Joseph to Egypt to save many people from hunger, and later God sent Moses to lead His people out of Egypt. So Egypt is a real place right in our Bible!", memoryWork: "A pharaoh was a king of Egypt. Joseph and Moses lived in Egypt in the Bible." },
        { id: "mercy-history-u2-l4", title: "One True God", objective: "Know the Egyptians worshiped false gods, but there is only one true God.", teach: "The people of Egypt worshiped many pretend gods, made of stone and gold. But those were not real. There is only ONE true God, the God who made the whole world and who saved His people. He alone is God, and He alone should be worshiped.", memoryWork: "There is only one true God. He made everything, and He alone is God." },
      ],
    },
    {
      id: "mercy-history-u3",
      title: "Unit 3 · Greece and Rome",
      summary: "The Greeks and Romans, Roman soldiers and roads, and the story of Rome.",
      lessons: [
        { id: "mercy-history-u3-l1", title: "The Greeks and Romans", objective: "Know the Greeks and Romans lived long ago and built big cities.", teach: "Long ago, two famous peoples were the Greeks and the Romans. They built beautiful cities with tall stone buildings and columns. We still use ideas they had, like counting and building. Rome grew into a giant empire.", memoryWork: "The Greeks and Romans lived long ago and built beautiful stone cities." },
        { id: "mercy-history-u3-l2", title: "Roman Soldiers and Roads", objective: "Know the Romans had strong soldiers and built roads.", teach: "The Romans had strong soldiers who wore metal armor and carried shields. They built long, straight roads all over their land, so people could travel far. Some of those roads are still there today!", memoryWork: "Roman soldiers wore armor, and the Romans built long, straight roads." },
        { id: "mercy-history-u3-l3", title: "Rome in the Days of Jesus", objective: "Know Rome ruled the world when Jesus was born.", teach: "Here is something wonderful: Rome was the ruler of the world when Jesus was born! The Bible tells about Roman soldiers and rulers. God chose that very time in history to send His Son. God rules over every kingdom and every age.", memoryWork: "Rome ruled the world when Jesus was born. God rules over every kingdom." },
      ],
    },
    {
      id: "mercy-history-u4",
      title: "Unit 4 · Castles and Knights",
      summary: "Kings and queens, castles, knights, and the Vikings.",
      lessons: [
        { id: "mercy-history-u4-l1", title: "Kings and Queens", objective: "Know that long ago kings and queens ruled the land.", teach: "Long ago, after the Romans, kings and queens ruled the lands. A king wore a crown and made the rules for his people. But even the greatest king on earth is small next to God, the King of kings.", memoryWork: "Kings and queens ruled long ago. God is the King of kings." },
        { id: "mercy-history-u4-l2", title: "Castles", objective: "Know a castle was a strong stone home built to keep people safe.", teach: "A castle was a huge, strong home made of stone, where a king or lord lived. It had thick walls, tall towers, and sometimes a moat of water around it to keep enemies out. Castles were built to keep people safe.", memoryWork: "A castle was a strong stone home with high walls to keep people safe." },
        { id: "mercy-history-u4-l3", title: "Knights and Armor", objective: "Know a knight was a soldier who wore armor.", teach: "A knight was a soldier who served a king. He wore shiny metal armor to protect his body and rode a horse into battle. In the Bible, Paul says God gives us armor too: the armor of God, to stand strong and true (Ephesians 6).", memoryWork: "A knight wore metal armor and served a king. God gives us His armor too." },
        { id: "mercy-history-u4-l4", title: "The Vikings", objective: "Know the Vikings were sailors from far away who traveled in longships.", teach: "The Vikings were people from cold northern lands who sailed the seas in long wooden boats called longships. They were brave sailors and explorers who traveled very far. They lived a very long time ago.", memoryWork: "The Vikings were sailors who traveled far in long wooden longships." },
      ],
    },
  ],
};
