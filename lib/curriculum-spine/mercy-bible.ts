import type { Course } from "./types";

// Mercy, Kindergarten Bible (grammar stage). MCA/Memoria model: the K year is
// daily recitation, a favorite Bible story told simply plus one short verse or
// truth to lock into memory. The whole year walks God's ONE big story: God made
// everything good; people sinned; God sent Jesus to rescue us; Jesus is making
// all things new. Reformed Baptist (1689): God is King, sin is real, and Jesus
// is the only Rescuer, scaled to a 5-year-old, not softened. Gentle garden
// flavor (Princess Rose's world) woven through. Follows the titus-math template.

export const MERCY_BIBLE: Course = {
  kidId: "mercy",
  subject: "bible",
  subjectLabel: "Bible",
  emoji: "✝️",
  gradeLabel: "Kindergarten",
  stage: "grammar",
  overview:
    "A full Kindergarten Bible year that tells God's one big story: God made everything good, people sinned, God sent Jesus to rescue us, and Jesus is making all things new. Each lesson is a favorite story told simply and faithfully, always pointing to Jesus, with one short verse or truth to memorize by heart. The grammar-stage goal is a child who knows the story of the Bible and can say back a treasury of little verses about who God is and what Jesus has done.",
  units: [
    {
      id: "mercy-bible-u1",
      title: "Unit 1 · God Made Everything Good",
      summary: "Creation, the first people, and how sin spoiled God's good world.",
      lessons: [
        { id: "mercy-bible-u1-l1", title: "In the Beginning", objective: "Know that God made everything out of nothing, just by speaking.", teach: "In the very beginning there was nothing at all, but God was there. God spoke, and light came. He made the sky, the seas, the dry land, the sun and moon and stars, the fish and birds and animals. He made a beautiful world like a garden full of flowers, and only God can do that.", memoryWork: "In the beginning, God created the heavens and the earth. (Genesis 1:1)" },
        { id: "mercy-bible-u1-l2", title: "God Made People", objective: "Know that God made people in His own image, on purpose, to know Him.", teach: "On the sixth day God made the very first man and the very first woman, Adam and Eve. He made them special, in His own image, to love Him and take care of His world. God made you too, on purpose, and He knows your name.", memoryWork: "So God created man in his own image. (Genesis 1:27)" },
        { id: "mercy-bible-u1-l3", title: "It Was Very Good", objective: "Know that everything God made was very good, and God is the King over it all.", teach: "When God finished making the world, He looked at all of it and said it was very good. There was no sadness, no crying, and nothing broken. God is the King, and His good world did just what He said, like flowers turning to face the sun.", memoryWork: "And God saw everything that he had made, and behold, it was very good. (Genesis 1:31)" },
        { id: "mercy-bible-u1-l4", title: "Sin Spoils Everything", objective: "Know that Adam and Eve disobeyed God, and sin broke the good world.", teach: "God gave Adam and Eve one rule, but they listened to the sneaky serpent and disobeyed. That is called sin, and sin is saying no to God. Sin spoiled everything, and it brought sadness and death into the world, like a weed that chokes a garden.", memoryWork: "Everyone has sinned." },
        { id: "mercy-bible-u1-l5", title: "God's First Promise", objective: "Know that even after sin, God promised to send a Rescuer.", teach: "Adam and Eve were in big trouble, and they could not fix what they had done. But God loved them, and He made a promise: one day a Rescuer would come and crush the serpent and make everything right again. That promised Rescuer is Jesus, and God kept His promise.", memoryWork: "God promised to send a Rescuer." },
      ],
    },
    {
      id: "mercy-bible-u2",
      title: "Unit 2 · God Keeps His Promises",
      summary: "Noah and the ark, and God's big promise to Abraham.",
      lessons: [
        { id: "mercy-bible-u2-l1", title: "Noah Builds the Ark", objective: "Know that God told Noah to build an ark and Noah obeyed.", teach: "The world had grown very bad, and people forgot God. But God saw one man named Noah who loved Him. God told Noah to build a giant boat called an ark to keep his family and the animals safe, and Noah did everything God said.", memoryWork: "Noah did all that God commanded him. (Genesis 6:22)" },
        { id: "mercy-bible-u2-l2", title: "The Flood and the Rainbow", objective: "Know that God kept Noah safe and gave the rainbow as a promise.", teach: "The rain came and covered the whole earth, but God kept Noah, his family, and all the animals safe inside the ark. When it was over, God set a beautiful rainbow in the sky, like colorful flowers of light. It was His promise never to flood the whole earth again.", memoryWork: "I have set my bow in the cloud. (Genesis 9:13)" },
        { id: "mercy-bible-u2-l3", title: "God Calls Abraham", objective: "Know that God called Abraham to follow Him and Abraham believed God.", teach: "God spoke to a man named Abraham and told him to leave his home and go to a new land. God promised to bless him and to make his family as many as the stars. Abraham did not know the way, but he trusted God and went, believing God would keep His word.", memoryWork: "Abraham believed God. (Genesis 15:6)" },
        { id: "mercy-bible-u2-l4", title: "God Always Keeps His Word", objective: "Know that God kept His promise to Abraham, and He always keeps His promises.", teach: "God promised Abraham a big family, and even though Abraham was very old, God gave him a son named Isaac. From Abraham's family, long after, came Jesus the Rescuer. God always keeps His promises, every single one.", memoryWork: "God always keeps His promises." },
      ],
    },
    {
      id: "mercy-bible-u3",
      title: "Unit 3 · God Rescues His People",
      summary: "Baby Moses, the Red Sea, David and Goliath.",
      lessons: [
        { id: "mercy-bible-u3-l1", title: "Baby Moses in the Basket", objective: "Know that God watched over baby Moses and kept him safe.", teach: "God's people were slaves in Egypt, and a cruel king wanted to hurt the baby boys. One mother hid her baby, Moses, in a little basket in the river. God watched over him, and a princess found him and cared for him. God was already planning to use Moses to rescue His people.", memoryWork: "God watches over me." },
        { id: "mercy-bible-u3-l2", title: "Crossing the Red Sea", objective: "Know that God split the sea to rescue His people from Egypt.", teach: "When Moses was grown, God sent him to lead His people out of Egypt. The king's army chased them right up to a big sea. Then God did something only God can do: He opened a dry path through the water so His people walked safely across. God fights for His people.", memoryWork: "The LORD will fight for you. (Exodus 14:14)" },
        { id: "mercy-bible-u3-l3", title: "David and Goliath", objective: "Know that God gave young David victory over the giant.", teach: "A huge, scary giant named Goliath made fun of God and His people, and everyone was afraid. But a shepherd boy named David was not afraid, because he trusted God. With one small stone and God's help, David won. The battle belongs to the Lord.", memoryWork: "The battle is the LORD's. (1 Samuel 17:47)" },
        { id: "mercy-bible-u3-l4", title: "God Gives the Victory", objective: "Know that our help comes from God, not from how big or strong we are.", teach: "David did not win because he was big or strong; he won because God helped him. We do not have to be the biggest or the bravest, because God is bigger than anything we fear. The very best rescue came when Jesus beat sin and death for us.", memoryWork: "Our help is in the name of the LORD. (Psalm 124:8)" },
      ],
    },
    {
      id: "mercy-bible-u4",
      title: "Unit 4 · God Is With His People",
      summary: "Daniel, Jonah, and Ruth show God's care and faithfulness.",
      lessons: [
        { id: "mercy-bible-u4-l1", title: "Daniel and the Lions", objective: "Know that Daniel kept praying to God, and God kept him safe.", teach: "Daniel loved God and prayed to Him every day. Some mean men made a rule that no one could pray, but Daniel kept praying anyway. He was thrown into a den of hungry lions, but God shut the lions' mouths and kept him safe all night long.", memoryWork: "My God sent his angel and shut the lions' mouths. (Daniel 6:22)" },
        { id: "mercy-bible-u4-l2", title: "Jonah and the Big Fish", objective: "Know that God rescued Jonah even when Jonah ran away.", teach: "God told Jonah to go tell a city about Him, but Jonah ran away on a boat the other way. God sent a big storm and a great big fish that swallowed Jonah whole. Inside the fish, Jonah prayed, and God saved him. God is patient and full of mercy.", memoryWork: "Salvation belongs to the LORD. (Jonah 2:9)" },
        { id: "mercy-bible-u4-l3", title: "Ruth Follows God", objective: "Know that Ruth chose to follow God and stay with His people.", teach: "Ruth was a young woman whose husband had died, and she was very sad. She could have gone back to her old home, but instead she stayed with Naomi and chose to follow the true God. She trusted God to take care of her.", memoryWork: "Your people shall be my people, and your God my God. (Ruth 1:16)" },
        { id: "mercy-bible-u4-l4", title: "God Cares for Ruth", objective: "Know that God provided for Ruth and gave her a family.", teach: "God took care of Ruth. He gave her food to gather in the fields and a kind husband named Boaz, and later a baby boy. From Ruth's family, one day, came King David and then Jesus. God is always working, even in quiet, ordinary days, like seeds growing under the soil.", memoryWork: "God takes care of me." },
      ],
    },
    {
      id: "mercy-bible-u5",
      title: "Unit 5 · God Sent Jesus",
      summary: "The Christmas story: the Rescuer God promised is born.",
      lessons: [
        { id: "mercy-bible-u5-l1", title: "The Angel's Good News", objective: "Know that the angel told Mary she would be the mother of Jesus.", teach: "God sent the angel Gabriel to a young woman named Mary. The angel said she would have a very special baby, God's own Son, and she must name Him Jesus. Mary was amazed, and she believed God, because nothing is too hard for God.", memoryWork: "Nothing will be impossible with God. (Luke 1:37)" },
        { id: "mercy-bible-u5-l2", title: "Baby Jesus Is Born", objective: "Know that Jesus, the promised Rescuer, was born in Bethlehem.", teach: "Mary and Joseph traveled to a town called Bethlehem, and there was no room for them anywhere. So baby Jesus was born in a stable, and Mary laid Him in a manger where the animals ate. The Rescuer God had promised so long ago had finally come.", memoryWork: "Unto you is born a Savior, who is Christ the Lord. (Luke 2:11)" },
        { id: "mercy-bible-u5-l3", title: "The Shepherds Come", objective: "Know that angels told the shepherds about Jesus, and they came to worship.", teach: "Out in the fields, shepherds were watching their sheep at night. Suddenly the sky filled with angels praising God and telling the good news that Jesus was born. The shepherds hurried to see baby Jesus, and they were so happy they told everyone.", memoryWork: "Glory to God in the highest. (Luke 2:14)" },
        { id: "mercy-bible-u5-l4", title: "The Wise Men Worship", objective: "Know that the wise men followed the star to worship Jesus the King.", teach: "Far away, wise men saw a bright new star and knew a special King had been born. They traveled a long, long way, following the star, until they found Jesus. They bowed down, worshiped Him, and gave Him precious gifts, because Jesus is the true King.", memoryWork: "We have come to worship him. (Matthew 2:2)" },
      ],
    },
    {
      id: "mercy-bible-u6",
      title: "Unit 6 · Jesus Shows Us God's Love",
      summary: "Jesus' miracles and parables: the lost sheep and the good shepherd.",
      lessons: [
        { id: "mercy-bible-u6-l1", title: "Jesus Calms the Storm", objective: "Know that Jesus has power over the wind and waves.", teach: "One night Jesus and His friends were in a boat when a wild storm blew up, and the friends were very scared. Jesus stood up and said, 'Peace! Be still,' and right away the wind stopped and the sea was calm. Even the wind and the waves obey Jesus, because He is God.", memoryWork: "Even the wind and the sea obey him. (Mark 4:41)" },
        { id: "mercy-bible-u6-l2", title: "Jesus Feeds a Crowd", objective: "Know that Jesus fed thousands of people with a little boy's lunch.", teach: "A huge crowd came to hear Jesus, and they were hungry with no food. A little boy shared his five loaves and two fish. Jesus gave thanks and made it into enough to feed thousands, with baskets left over. Jesus cares for us and gives us what we need.", memoryWork: "Jesus gives us everything we need." },
        { id: "mercy-bible-u6-l3", title: "The Lost Sheep", objective: "Know Jesus' story of a shepherd who searches for his one lost sheep.", teach: "Jesus told a story about a shepherd with a hundred sheep. When one wandered off and got lost, the shepherd left the ninety-nine to go find that one, and carried it home rejoicing. Jesus told this story to show that God searches for lost sinners and is full of joy when one is found.", memoryWork: "I have found my sheep that was lost. (Luke 15:6)" },
        { id: "mercy-bible-u6-l4", title: "The Good Shepherd", objective: "Know that Jesus is the Good Shepherd who loves and protects His sheep.", teach: "Jesus said, 'I am the Good Shepherd.' A good shepherd knows each of his sheep and keeps them safe, and Jesus even gave up His own life to save His sheep. If you belong to Jesus, He is your Shepherd, and He will never let you go.", memoryWork: "I am the good shepherd. (John 10:11)" },
        { id: "mercy-bible-u6-l5", title: "Jesus Loves the Children", objective: "Know that Jesus welcomed little children and loves them.", teach: "One day parents brought their little children to Jesus, but His friends tried to send them away. Jesus said, 'Let the children come to me,' and He took them in His arms and blessed them. Jesus loves little children, and He loves you.", memoryWork: "Let the children come to me. (Mark 10:14)" },
      ],
    },
    {
      id: "mercy-bible-u7",
      title: "Unit 7 · Jesus Saves Us and Makes All Things New",
      summary: "Palm Sunday, the cross, Easter, and the promise of heaven.",
      lessons: [
        { id: "mercy-bible-u7-l1", title: "Jesus the King Comes", objective: "Know that the people welcomed Jesus into Jerusalem as their King.", teach: "Jesus rode into the city of Jerusalem on a little donkey. The people waved palm branches and shouted for joy, welcoming Him like a King. They were right that Jesus is King, though He came not on a war horse but gently, to save His people.", memoryWork: "Hosanna! Blessed is he who comes in the name of the Lord. (Mark 11:9)" },
        { id: "mercy-bible-u7-l2", title: "Jesus Died on the Cross", objective: "Know that Jesus died on the cross to take the punishment for our sin.", teach: "Even though Jesus never did anything wrong, He let bad men nail Him to a cross, and there He died. He was not weak; He chose to do it. Jesus took the punishment our sin deserved, so that we could be forgiven and belong to God. That is how much God loves us.", memoryWork: "For God so loved the world, that he gave his only Son. (John 3:16)" },
        { id: "mercy-bible-u7-l3", title: "Jesus Is Alive!", objective: "Know that Jesus rose from the dead on Easter morning.", teach: "Jesus' friends laid Him in a tomb and were so very sad. But on Sunday morning the tomb was empty, because Jesus was alive again! Death could not hold Him. Jesus beat sin and death forever, and everyone who trusts Him will live with Him. This is the best news in all the world.", memoryWork: "He is not here, for he has risen. (Matthew 28:6)" },
        { id: "mercy-bible-u7-l4", title: "Jesus Is Always With Us", objective: "Know that Jesus went up to heaven and promised to be with His people.", teach: "After Jesus rose, He was with His friends again, and then He went up into heaven to be with God the Father. But He promised He would never leave those who love Him, and He sent His Holy Spirit to help us. One day Jesus will come back.", memoryWork: "I am with you always. (Matthew 28:20)" },
        { id: "mercy-bible-u7-l5", title: "God Makes All Things New", objective: "Know that one day Jesus will come back and make everything new and perfect.", teach: "The Bible tells us how the story ends. One day Jesus will come back, and He will wipe away every tear. There will be no more crying, no more sickness, and no more death, and everything sin spoiled will be made new and beautiful forever, like the very best garden. This is the sure hope of everyone who belongs to Jesus.", memoryWork: "Behold, I am making all things new. (Revelation 21:5)" },
      ],
    },
  ],
};
