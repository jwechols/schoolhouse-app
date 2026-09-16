import type { Course } from "./types";

// Lois, Pre-K Bible (age 3, grammar stage / Memoria "Junior Kindergarten" model).
// The simplest, warmest Bible year: ONE tiny true idea per lesson, built on the
// biggest truths (God made me, God is good, Jesus loves me, Jesus is alive) and
// the gentlest story retellings (Creation, Noah, baby Moses, David, Jonah,
// Christmas, Jesus & the children, Easter). Confessional Reformed Baptist (1689):
// God's sovereignty, His goodness, and Christ's saving love, scaled down to a
// 3-year-old with a gentle princess warmth. Follows the titus-math template.

export const LOIS_BIBLE: Course = {
  kidId: "lois",
  subject: "bible",
  subjectLabel: "Bible",
  emoji: "📖",
  gradeLabel: "Pre-K",
  stage: "grammar",
  overview:
    "A gentle first Bible year for a 3-year-old. One tiny true idea per lesson, each built on the biggest, most comforting truths: God made everything, God made me, God is good, God loves me, Jesus is God's Son, Jesus loves children, Jesus died and rose, and God is always with me. We walk through the sweetest Bible stories (Creation, Noah and the rainbow, baby Moses, David the shepherd boy, Jonah and the big fish, baby Jesus at Christmas, Jesus and the children, and Easter morning). The grammar-stage goal is a heart full of short, true, memorized truths about how much God loves her.",
  units: [
    {
      id: "lois-bible-u1",
      title: "Unit 1 · God Made Everything",
      summary: "God made the whole world, every animal, and Lois too, and it is all good.",
      lessons: [
        { id: "lois-bible-u1-l1", title: "God Made the World", objective: "Know that God made the whole world.", teach: "In the very beginning there was nothing at all. Then God made the whole big beautiful world, all by Himself.", memoryWork: "God made everything." },
        { id: "lois-bible-u1-l2", title: "God Made the Sky and Sea", objective: "Know God made the sky, the sun, and the water.", teach: "God made the warm sun and the twinkly stars, the deep blue sea and the tall green trees. Everything you can see, God made.", memoryWork: "God made everything." },
        { id: "lois-bible-u1-l3", title: "God Made the Animals", objective: "Know that God made all the animals.", teach: "God made every animal, from the tiny ladybug to the great big elephant. He made the fish to swim and the birds to sing.", memoryWork: "God made everything." },
        { id: "lois-bible-u1-l4", title: "God Made Me", objective: "Know that God made me.", teach: "God made you, sweet girl. He made your eyes, your smile, and your kind little heart, and He loves you very much.", memoryWork: "God made me." },
        { id: "lois-bible-u1-l5", title: "God Saw It Was Good", objective: "Know that everything God made is good.", teach: "When God was all done making the world, He looked at it and was happy. Everything God makes is good.", memoryWork: "God is good." },
      ],
    },
    {
      id: "lois-bible-u2",
      title: "Unit 2 · Noah and the Rainbow",
      summary: "Noah obeyed God, God kept everyone safe in the ark, and gave a rainbow promise.",
      lessons: [
        { id: "lois-bible-u2-l1", title: "God Tells Noah", objective: "Know that Noah obeyed God and built the ark.", teach: "God asked a good man named Noah to build a giant boat called an ark. Noah loved God, so he did just what God said.", memoryWork: "Noah obeyed God." },
        { id: "lois-bible-u2-l2", title: "Two by Two", objective: "Know that God brought the animals safely into the ark.", teach: "Two by two the animals walked into the ark. Big ones and small ones, God kept them all safe and dry.", memoryWork: "God keeps me safe." },
        { id: "lois-bible-u2-l3", title: "The Big Rain", objective: "Know that God kept Noah safe in the flood.", teach: "The rain fell and fell and the water got deep. But inside the ark, Noah and the animals were safe with God.", memoryWork: "God keeps me safe." },
        { id: "lois-bible-u2-l4", title: "The Rainbow", objective: "Know that the rainbow is God's promise.", teach: "When the rain stopped, God painted a beautiful rainbow across the sky. It is God's promise that He will always keep His people.", memoryWork: "God keeps His promises." },
      ],
    },
    {
      id: "lois-bible-u3",
      title: "Unit 3 · Baby Moses",
      summary: "God watched over baby Moses in the basket and had a good plan for him.",
      lessons: [
        { id: "lois-bible-u3-l1", title: "Baby in a Basket", objective: "Know the story of baby Moses in the basket.", teach: "A mama had a tiny baby named Moses. To keep him safe, she tucked him in a little basket boat on the river.", memoryWork: "God watches over me." },
        { id: "lois-bible-u3-l2", title: "The Princess Finds Moses", objective: "Know that a princess found and kept baby Moses safe.", teach: "A kind princess found baby Moses floating in the water. She loved him and kept him safe, because God had a good plan all along.", memoryWork: "God has a plan for me." },
        { id: "lois-bible-u3-l3", title: "God Watched Over Moses", objective: "Know that God always watched over Moses, and over me.", teach: "God never took His eyes off baby Moses, not even for one second. God sees you too, all day and all night.", memoryWork: "God watches over me." },
      ],
    },
    {
      id: "lois-bible-u4",
      title: "Unit 4 · David the Shepherd Boy",
      summary: "David cared for his sheep and sang to God, and God is our good Shepherd.",
      lessons: [
        { id: "lois-bible-u4-l1", title: "David the Shepherd Boy", objective: "Know that David took care of the sheep.", teach: "David was a boy who took care of soft, woolly sheep. He led them to green grass and cool water.", memoryWork: "God is my shepherd." },
        { id: "lois-bible-u4-l2", title: "David Sings to God", objective: "Know that David sang happy songs to God.", teach: "David loved to sing happy songs to God out in the fields. You can sing to God too!", memoryWork: "I can sing to God." },
        { id: "lois-bible-u4-l3", title: "God Takes Care of Me", objective: "Know that God cares for me like a good shepherd.", teach: "Just like David took care of his little sheep, God takes care of you. He is your good Shepherd.", memoryWork: "God takes care of me." },
      ],
    },
    {
      id: "lois-bible-u5",
      title: "Unit 5 · Jonah and the Big Fish",
      summary: "Jonah ran from God, a big fish swallowed him, and God's love is bigger than the sea.",
      lessons: [
        { id: "lois-bible-u5-l1", title: "Jonah Runs Away", objective: "Know that Jonah ran away instead of obeying God.", teach: "God asked Jonah to go tell people about Him, but Jonah ran the other way on a boat. We should always obey God.", memoryWork: "I will obey God." },
        { id: "lois-bible-u5-l2", title: "The Big Fish", objective: "Know that a big fish swallowed Jonah and he prayed.", teach: "A great big fish swallowed Jonah in one big gulp! Inside the fish, Jonah prayed and told God he was sorry.", memoryWork: "I can pray to God." },
        { id: "lois-bible-u5-l3", title: "God's Big Love", objective: "Know that God's love is very big.", teach: "God saved Jonah and loved him still. God's love is bigger than the whole deep sea.", memoryWork: "God loves me." },
      ],
    },
    {
      id: "lois-bible-u6",
      title: "Unit 6 · Baby Jesus at Christmas",
      summary: "An angel came to Mary, baby Jesus was born, and He is God's own Son.",
      lessons: [
        { id: "lois-bible-u6-l1", title: "An Angel Visits Mary", objective: "Know that an angel told Mary about a special baby.", teach: "A shining angel came to a young woman named Mary. He said she would have a very special baby, God's own Son.", memoryWork: "Jesus is God's Son." },
        { id: "lois-bible-u6-l2", title: "Baby Jesus Is Born", objective: "Know the story of the first Christmas.", teach: "On the first Christmas, baby Jesus was born and laid in a manger where the animals eat. Jesus is the greatest gift of all.", memoryWork: "Jesus is God's Son." },
        { id: "lois-bible-u6-l3", title: "The Shepherds Come", objective: "Know that shepherds came to see baby Jesus.", teach: "Shepherds hurried through the night to see baby Jesus. They were so happy that God's Son had finally come.", memoryWork: "Jesus is God's Son." },
        { id: "lois-bible-u6-l4", title: "Jesus Is God's Son", objective: "Know that Jesus is God's own Son who came to save us.", teach: "Jesus is not just any baby. Jesus is God's very own Son, who came to love us and to save us.", memoryWork: "Jesus is God's Son." },
      ],
    },
    {
      id: "lois-bible-u7",
      title: "Unit 7 · Jesus Loves Children",
      summary: "Jesus welcomed the little children, was always kind, and He loves Lois.",
      lessons: [
        { id: "lois-bible-u7-l1", title: "Jesus and the Little Children", objective: "Know that Jesus welcomed the little children.", teach: "Little children ran to see Jesus, and Jesus said, 'Let them come to me!' He gave them big warm hugs.", memoryWork: "Jesus loves children." },
        { id: "lois-bible-u7-l2", title: "Jesus Is Kind", objective: "Know that Jesus was always kind and good.", teach: "Jesus was always kind and gentle. He healed the sick and helped the sad. Jesus is so good.", memoryWork: "Jesus is good." },
        { id: "lois-bible-u7-l3", title: "Jesus Loves Me", objective: "Know that Jesus loves me.", teach: "Jesus loves every single little child, and that means Jesus loves you, sweet girl, so very much.", memoryWork: "Jesus loves me." },
      ],
    },
    {
      id: "lois-bible-u8",
      title: "Unit 8 · Easter Morning",
      summary: "Jesus died for us, rose alive on Easter morning, and is always with me.",
      lessons: [
        { id: "lois-bible-u8-l1", title: "Jesus Died for Us", objective: "Know that Jesus died on the cross for us.", teach: "Jesus loves us so much that He died on the cross to take away our sin. It was a very sad day.", memoryWork: "Jesus died for me." },
        { id: "lois-bible-u8-l2", title: "Easter Morning", objective: "Know that Jesus rose alive on Easter.", teach: "On Easter morning the tomb was empty. Jesus was alive again! It was the happiest surprise ever.", memoryWork: "Jesus is alive." },
        { id: "lois-bible-u8-l3", title: "Jesus Is With Me Always", objective: "Know that Jesus is always with me.", teach: "Because Jesus is alive, He is always with you. You are never, ever alone.", memoryWork: "God is always with me." },
      ],
    },
  ],
};
