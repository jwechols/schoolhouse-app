import type { Course } from "./types";

// Titus, 3rd Grade American History (grammar stage). MCA/Memoria model: the
// grammar-stage goal is a storehouse of PEOPLE, PLACES, DATES, and STORIES held
// by heart, hung on a memorized timeline. This course walks American history from
// the first peoples through the Civil War, told truthfully (including the hard
// parts) under a providential view: God is sovereign over nations and history
// (Acts 17:26). Light outdoors flavor. Follows the TITUS_MATH template.

export const TITUS_HISTORY: Course = {
  kidId: "titus",
  subject: "history",
  subjectLabel: "History",
  emoji: "🏛️",
  gradeLabel: "3rd Grade",
  stage: "grammar",
  overview:
    "A full 3rd-grade American history year: the first peoples of this land, the European explorers, the first colonies (Jamestown, the Pilgrims, Plymouth, Thanksgiving), colonial life, the road to independence and the Revolution, the great founders, the Constitution, westward expansion and Lewis & Clark, and the Civil War and Abraham Lincoln. The grammar-stage goal is a memorized timeline of dates and names Titus can recite by heart. We tell the story truthfully, hard parts and all, remembering that God rules over the nations and their times (Acts 17:26).",
  units: [
    {
      id: "titus-history-u1",
      title: "Unit 1 · Native Americans & the Explorers",
      summary: "Native peoples, Columbus, and the explorers who crossed the sea.",
      lessons: [
        {
          id: "titus-history-u1-l1",
          title: "Native Americans",
          objective: "Describe how the Native American tribes lived on this land long before Europeans arrived.",
          teach: "Long before any European set foot here, many different peoples already lived across this land: the Cherokee and Iroquois in the eastern forests, the Comanche and Apache on the plains, the Pueblo in the dry Southwest. They hunted deer and buffalo, fished the rivers, and grew corn, beans, and squash. Each nation had its own language, homes, and stories. God had made these peoples too, and set the times and places where they would live.",
          memoryWork: "God 'made from one man every nation, and marked out their appointed times and boundaries.' (Acts 17:26)",
          tier: "standard",
          // PILOT: fully authored teach segments + quiz, so this runs the instant
          // baked path (no live AI, no lag). Bake with:
          // npm run prebake -- titus history titus-history-u1-l1
          interactive: [
            {
              kind: "teach",
              text: "Long before any ship sailed over from Europe, this land was already full of people. Hundreds of different tribes lived here, each with its own language, homes, and stories. We call them the Native Americans.",
              say: "Here's something a lot of folks forget, Titus. Long before any ship sailed over from Europe, this land was already full of people. Hundreds of different tribes, each with its own language, homes, and stories. We call them the Native Americans.",
            },
            {
              kind: "teach",
              text: "They spread out across very different country. The Cherokee and Iroquois lived in the eastern forests. The Comanche and Apache rode the wide open plains. The Pueblo built homes of stone and clay in the dry Southwest.",
              say: "And they spread out across mighty different country. The Cherokee and Iroquois in the eastern forests. The Comanche and Apache out on the wide open plains. And the Pueblo, way out in the dry Southwest, building homes of stone and clay.",
            },
            {
              kind: "teach",
              text: "They knew how to live off the land God gave them. They hunted deer and buffalo, fished the rivers, and grew the 'three sisters', corn, beans, and squash, planted together in one field.",
              say: "Now these were skilled people. They hunted deer and buffalo, fished the rivers, and grew what they called the three sisters, corn, beans, and squash, all planted together in one field. Smart farming.",
            },
            {
              kind: "try",
              prompt: "Which three crops, the 'three sisters', did many native peoples grow together?",
              say: "Quick one. Which three crops, the three sisters, did they grow together?",
              choices: ["Corn, beans, and squash", "Rice, wheat, and oats"],
              correctIndex: 0,
              onRight: "That's it! Corn, beans, and squash, the three sisters, growing side by side.",
              onWrong: "Close, but it's the three sisters: corn, beans, and squash.",
            },
            {
              kind: "teach",
              text: "None of this took God by surprise. He made every one of these peoples, and He decided the exact times and places they would live. They were here because He put them here.",
              say: "And here's the big thing, Titus. None of this took God by surprise. He made every one of these peoples, and He set the exact times and places they'd live. They were here because He put them here.",
            },
            {
              kind: "try",
              prompt: "Who decided the times and places where the first peoples would live?",
              say: "So who decided the times and places where these peoples would live?",
              choices: ["God did", "It just happened by chance"],
              correctIndex: 0,
              onRight: "Amen. God made every nation and marked out where they'd live.",
              onWrong: "It was God. He made every nation and set the times and places they'd live.",
            },
            {
              kind: "memory",
              text: "God 'made from one man every nation, and marked out their appointed times and boundaries.' (Acts 17:26)",
              say: "Lock this one in: God made from one man every nation, and marked out their appointed times and boundaries. Acts 17, verse 26.",
            },
          ],
          quiz: [
            { prompt: "Were there people living on this land before Europeans came?", choices: ["Yes, many nations", "No, it was empty"], correctIndex: 0, explanation: "Hundreds of nations already lived here." },
            { prompt: "Where did the Comanche and Apache live?", choices: ["On the plains", "In the eastern forests"], correctIndex: 0, explanation: "The Comanche and Apache lived and hunted on the wide plains." },
            { prompt: "What are the 'three sisters'?", choices: ["Corn, beans, and squash", "Deer, buffalo, and fish"], correctIndex: 0, explanation: "Corn, beans, and squash, planted together in one field." },
            { prompt: "Who made the first peoples and set where they would live?", choices: ["God", "Christopher Columbus"], correctIndex: 0, explanation: "God made every nation and marked out their appointed times and boundaries (Acts 17:26)." },
          ],
        },
        {
          id: "titus-history-u1-l2",
          title: "Christopher Columbus",
          objective: "Tell who Columbus was and why 1492 matters.",
          teach: "Christopher Columbus was an Italian sailor who believed he could reach Asia by sailing west across the Atlantic. In 1492 the king and queen of Spain gave him three small ships, the Niña, the Pinta, and the Santa María. After weeks at sea his crew nearly gave up, but they sighted land in the Caribbean. Columbus never reached Asia; he had found lands new to Europe, and his voyages opened the door between two worlds.",
          memoryWork: "1492, Columbus sailed the ocean blue.",
          tier: "standard",
          // Bake: npm run prebake -- titus history titus-history-u1-l2
          interactive: [
            { kind: "teach", text: "Christopher Columbus was an Italian sailor with a bold idea: reach Asia by sailing WEST across the Atlantic, back when everyone else sailed east around Africa.", say: "Here's a bold one, Titus. Christopher Columbus was an Italian sailor with a big idea: sail west across the ocean to reach Asia, when everybody else was sailing east around Africa." },
            { kind: "teach", text: "In 1492 the king and queen of Spain bet on him. They gave him three small ships: the Niña, the Pinta, and the Santa María.", say: "In 1492 the king and queen of Spain decided to bet on him. Three little ships: the Niña, the Pinta, and the Santa María." },
            { kind: "try", prompt: "How many ships did Columbus sail with in 1492?", say: "Quick one. How many ships did Columbus sail with?", choices: ["Three", "Ten"], correctIndex: 0, onRight: "That's it! The Niña, the Pinta, and the Santa María.", onWrong: "Just three: the Niña, the Pinta, and the Santa María." },
            { kind: "teach", text: "The trip was long and hard. After weeks with no land in sight, his crew nearly gave up and wanted to turn around. Then, finally, they spotted land in the Caribbean.", say: "The trip was long and scary. Weeks went by with no land, and the crew nearly quit on him. Then, finally, land! Islands in the Caribbean." },
            { kind: "teach", text: "Here's the twist: Columbus never actually reached Asia. He had bumped into lands that were new to Europe, and his voyages opened the door between two worlds that had never met.", say: "But here's the twist. He never reached Asia at all. He'd found whole lands Europe had never known about, and he opened the door between two worlds." },
            { kind: "try", prompt: "Did Columbus reach Asia like he planned?", say: "So, did Columbus reach Asia like he planned?", choices: ["No, he found lands new to Europe", "Yes, he landed in China"], correctIndex: 0, onRight: "Right. He thought he had, but he'd found a world new to Europe.", onWrong: "No. He thought so, but he'd actually found lands new to Europe." },
            { kind: "memory", text: "1492, Columbus sailed the ocean blue.", say: "Lock in the date with the little rhyme: in fourteen hundred ninety-two, Columbus sailed the ocean blue." },
          ],
          quiz: [
            { prompt: "In what year did Columbus sail?", choices: ["1492", "1776"], correctIndex: 0, explanation: "1492, Columbus sailed the ocean blue." },
            { prompt: "Which way did he sail to try to reach Asia?", choices: ["West across the Atlantic", "East around Africa"], correctIndex: 0, explanation: "West, the bold new route nobody else was trying." },
            { prompt: "What were his three ships?", choices: ["Niña, Pinta, Santa María", "Mayflower, Discovery, Speedwell"], correctIndex: 0, explanation: "The Niña, the Pinta, and the Santa María." },
            { prompt: "Did Columbus reach Asia?", choices: ["No, lands new to Europe", "Yes, India"], correctIndex: 0, explanation: "He never reached Asia; he found lands new to Europe." },
          ],
        },
        {
          id: "titus-history-u1-l3",
          title: "Two Worlds Meet",
          objective: "Explain what happened when Europeans and Native peoples met, including the hard parts.",
          teach: "When Europe and the Americas met, the greatest thing that crossed the ocean was the gospel of Jesus Christ, carried to a whole new continent. Good gifts came with it: horses, wheat, and new tools went west, while corn, potatoes, and tomatoes went east. It was not all easy, sickness and the sins of men brought real sorrow too, because people everywhere are sinners who need a Savior. But God rules over all of history, and He was already at work planting His church and preparing a new nation that His Word would shape.",
          memoryWork: "God rules over all of history, and He carried the gospel to a new world.",
          tier: "standard",
          // Bake: npm run prebake -- titus history titus-history-u1-l3
          interactive: [
            { kind: "teach", text: "When Europe and the Americas met, the greatest thing that crossed the ocean was the gospel of Jesus Christ, carried to a whole new continent.", say: "Here's the big one, Titus. When the two worlds met, the greatest thing that crossed the ocean was the gospel of Jesus, carried to a brand-new continent." },
            { kind: "teach", text: "Good gifts came too. Horses, wheat, and new tools went west to the Americas; corn, potatoes, and tomatoes went east to Europe. People call it the Columbian Exchange.", say: "Good gifts came with it. Horses, wheat, and tools went west; corn, potatoes, and tomatoes went east. They call it the Columbian Exchange." },
            { kind: "try", prompt: "Which of these went from the Americas over to Europe?", say: "Which of these went from the Americas back to Europe?", choices: ["Potatoes", "Horses"], correctIndex: 0, onRight: "Yes! Potatoes, corn, and tomatoes all went east.", onWrong: "Potatoes went east to Europe. Horses came west." },
            { kind: "teach", text: "It was not all easy. Sickness and the sins of men brought real sorrow too, because people everywhere are sinners who need a Savior.", say: "Now it wasn't all easy, bud. Sickness and the sins of men brought real sorrow, because people everywhere are sinners who need a Savior." },
            { kind: "teach", text: "But God rules over all of history. He was already at work planting His church and preparing a new nation that His Word would shape.", say: "But here's what matters: God rules over all of history. He was already at work planting His church and getting a new nation ready, one His Word would shape." },
            { kind: "try", prompt: "Who rules over all of history, even the hard parts?", say: "So who rules over all of history, even the hard parts?", choices: ["God does", "No one, it's just chance"], correctIndex: 0, onRight: "Amen. God rules over all of it.", onWrong: "God does. He rules over every bit of history." },
            { kind: "memory", text: "God rules over all of history, and He carried the gospel to a new world.", say: "Here's the one to remember: God rules over all of history, and He carried the gospel to a new world." },
          ],
          quiz: [
            { prompt: "What was the greatest thing that crossed the ocean?", choices: ["The gospel of Jesus Christ", "A pile of gold"], correctIndex: 0, explanation: "The gospel of Jesus, carried to a whole new continent." },
            { prompt: "What is the Columbian Exchange?", choices: ["Good things that crossed between the two worlds", "A kind of sailing ship"], correctIndex: 0, explanation: "Horses, wheat, corn, potatoes, and more, crossing between the Americas and Europe." },
            { prompt: "Which came FROM the Americas to Europe?", choices: ["Corn and potatoes", "Wheat and horses"], correctIndex: 0, explanation: "Corn, potatoes, and tomatoes went east. Wheat and horses came west." },
            { prompt: "Who rules over all of history?", choices: ["God", "No one"], correctIndex: 0, explanation: "God rules over all of history and was planting His church in a new world." },
          ],
        },
        {
          id: "titus-history-u1-l4",
          title: "More Explorers",
          objective: "Name several explorers and what they found.",
          teach: "Many explorers followed Columbus. Amerigo Vespucci realized these were new continents, so mapmakers named them 'America' after him. Ponce de León searched Florida for a fountain of youth. Magellan's crew were the first to sail all the way around the whole world. Brave and restless, these men filled in the map of a world God had made larger than they ever guessed.",
          memoryWork: "America is named for Amerigo Vespucci.",
          tier: "standard",
          // Bake: npm run prebake -- titus history titus-history-u1-l4
          interactive: [
            { kind: "teach", text: "Once Columbus opened the door, a whole crowd of explorers came sailing after him, each one wanting to see what was out there.", say: "Once Columbus opened that door, Titus, a whole crowd of explorers came sailing right after him, every one of them itching to see what was out there." },
            { kind: "teach", text: "One of them, Amerigo Vespucci, figured out something big: these weren't the edge of Asia at all. They were whole new continents. Mapmakers were so impressed they named the land 'America' after him.", say: "One of them, Amerigo Vespucci, figured out something big. This wasn't the edge of Asia, no sir. These were whole new continents. The mapmakers were so tickled they named the land America, right after him." },
            { kind: "try", prompt: "Who is America named after?", say: "So who is America named after?", choices: ["Amerigo Vespucci", "Christopher Columbus"], correctIndex: 0, onRight: "That's it! America is named for Amerigo Vespucci.", onWrong: "It's Amerigo Vespucci, he's the one they named America after." },
            { kind: "teach", text: "Another man, Ponce de León, hunted all over Florida for a magic 'fountain of youth' that would keep him young forever. He never found it, because there isn't one. Only God gives everlasting life, and that comes through Jesus, not a magic spring.", say: "Now one fella, Ponce de León, went hunting all over Florida for a magic fountain of youth to keep him young forever. He never found it, bud, 'cause there isn't one. Only God gives everlasting life, and that comes through Jesus, not some magic spring." },
            { kind: "teach", text: "And Magellan's crew did the boldest thing of all: they sailed all the way AROUND the whole world and back. They proved just how big a world God had made.", say: "And Magellan's crew did the boldest thing of all. They sailed all the way around the whole world and back home. They proved just how big a world God had made." },
            { kind: "try", prompt: "Whose crew were the first to sail all the way around the world?", say: "Whose crew sailed all the way around the world?", choices: ["Magellan's crew", "Columbus's crew"], correctIndex: 0, onRight: "Right! Magellan's crew went all the way around.", onWrong: "It was Magellan's crew, the first ones all the way around the world." },
            { kind: "teach", text: "Brave and restless, these men filled in the map of a world God had made far bigger than they ever guessed, and He was spreading people across it for reasons they couldn't yet see.", say: "Brave and restless, these men filled in the map of a world God made far bigger than they ever guessed. And He was spreading folks across it for reasons they couldn't even see yet." },
            { kind: "memory", text: "America is named for Amerigo Vespucci.", say: "Lock this one in: America is named for Amerigo Vespucci." },
          ],
          quiz: [
            { prompt: "Who is America named after?", choices: ["Amerigo Vespucci", "Ponce de León"], correctIndex: 0, explanation: "Vespucci realized these were new continents, so the land was named for him." },
            { prompt: "What was Ponce de León looking for in Florida?", choices: ["A fountain of youth", "A mountain of gold"], correctIndex: 0, explanation: "A magic fountain to stay young, which does not exist. Only God gives everlasting life." },
            { prompt: "Whose crew first sailed all the way around the world?", choices: ["Magellan's", "Columbus's"], correctIndex: 0, explanation: "Magellan's crew were the first all the way around the globe." },
            { prompt: "What did these explorers show about the world?", choices: ["It was far bigger than they guessed", "It was tiny and empty"], correctIndex: 0, explanation: "God had made the world larger than any of them expected." },
          ],
        },
        {
          id: "titus-history-u1-l5",
          title: "Claiming the New Land",
          objective: "Describe how Spain, France, and England each claimed parts of North America.",
          teach: "The nations of Europe raced to claim the new land. Spain took the warm south, from Florida to Mexico, and built missions. France paddled the northern rivers and traded furs with the natives. England settled the Atlantic coast where the thirteen colonies would one day grow. Three flags, three languages, one enormous continent.",
          memoryWork: "Spain, France, and England each claimed part of North America.",
          tier: "standard",
          // Bake: npm run prebake -- titus history titus-history-u1-l5
          interactive: [
            { kind: "teach", text: "Once everyone knew the new land was really there, the nations of Europe took off in a race to claim it. Three of them grabbed the biggest pieces: Spain, France, and England.", say: "Once everybody knew this new land was really out there, Titus, the nations of Europe took off in a race to claim it. Three of 'em grabbed the biggest pieces: Spain, France, and England." },
            { kind: "teach", text: "Spain took the warm south, from Florida down into Mexico. They built missions, little settlements with a church at the heart, to worship God and teach the faith.", say: "Spain took the warm south, from Florida on down into Mexico. And they built missions, little settlements with a church right at the heart, to worship God and teach the faith." },
            { kind: "try", prompt: "Which nation settled the warm south and built missions?", say: "Which nation settled the warm south and built missions?", choices: ["Spain", "England"], correctIndex: 0, onRight: "Yes! Spain took the south and built missions.", onWrong: "That was Spain, down in the warm south building missions." },
            { kind: "teach", text: "France went a different way. They paddled canoes down the great northern rivers and lakes, and traded furs with the native peoples.", say: "France went a whole different way. They paddled canoes down the big northern rivers and lakes, trading furs with the native folks. Rugged work, that." },
            { kind: "teach", text: "England settled the Atlantic coast, right in the middle. That's where the thirteen colonies would one day grow, the very colonies that became our own country, the United States.", say: "And England settled the Atlantic coast, right in the middle. Now pay attention, bud, 'cause that's where the thirteen colonies would grow, the very ones that became our own country, the United States." },
            { kind: "try", prompt: "Which nation settled the Atlantic coast where the thirteen colonies grew?", say: "Which nation settled the Atlantic coast, where the thirteen colonies grew?", choices: ["England", "France"], correctIndex: 0, onRight: "That's it! England, on the Atlantic coast, where our nation began.", onWrong: "It was England, on the Atlantic coast, where the thirteen colonies grew." },
            { kind: "teach", text: "Three flags, three languages, one enormous continent. And through all of it God was quietly preparing a new nation His Word would shape.", say: "So that's three flags, three languages, one enormous continent. And through the whole thing, God was quietly getting a new nation ready, one His Word would shape." },
            { kind: "memory", text: "Spain, France, and England each claimed part of North America.", say: "Here's the one to remember: Spain, France, and England each claimed part of North America." },
          ],
          quiz: [
            { prompt: "Which nation took the warm south and built missions?", choices: ["Spain", "France"], correctIndex: 0, explanation: "Spain settled from Florida to Mexico and built missions." },
            { prompt: "Which nation traded furs along the northern rivers?", choices: ["France", "England"], correctIndex: 0, explanation: "France paddled the northern rivers and traded furs." },
            { prompt: "Which nation settled the Atlantic coast where the thirteen colonies grew?", choices: ["England", "Spain"], correctIndex: 0, explanation: "England's Atlantic settlements became the thirteen colonies, and then the United States." },
            { prompt: "Even as the nations raced for land, who was preparing a new nation?", choices: ["God", "No one"], correctIndex: 0, explanation: "God rules history and was preparing a nation His Word would shape." },
          ],
        },
      ],
    },
    {
      id: "titus-history-u2",
      title: "Unit 2 · The First Colonies",
      summary: "Jamestown, the Pilgrims, Plymouth, Thanksgiving, and colonial life.",
      lessons: [
        { id: "titus-history-u2-l1", title: "Jamestown, 1607", objective: "Tell the story of the first lasting English colony.", teach: "In 1607, before the Pilgrims ever came, English settlers built Jamestown in Virginia, the first English colony that lasted. The early years were brutal: swampy water, hunger, and a 'starving time' that killed most of them. Captain John Smith made a hard rule from Scripture: 'He who does not work shall not eat.' The colony survived when they learned to grow tobacco to sell back to England.", memoryWork: "1607, Jamestown, the first lasting English colony." },
        { id: "titus-history-u2-l2", title: "The Pilgrims and the Mayflower", objective: "Explain who the Pilgrims were and why they crossed the ocean.", teach: "The Pilgrims were English Christians who wanted to worship God freely, apart from the king's church. In 1620 about a hundred of them crowded onto a little ship called the Mayflower and sailed sixty-six hard days across the stormy Atlantic. Before stepping ashore they signed the Mayflower Compact, a promise to make fair laws and govern themselves together. They came seeking not gold but the freedom to serve Christ.", memoryWork: "1620, the Pilgrims sailed on the Mayflower." },
        { id: "titus-history-u2-l3", title: "Plymouth and the First Winter", objective: "Describe the Pilgrims' first hard winter at Plymouth.", teach: "The Pilgrims landed at Plymouth in the cold of winter with no homes and little food. That first winter about half of them died of sickness and cold. In the spring a native man named Squanto, who spoke English, showed them how to plant corn and where to fish. The Pilgrims saw God's kind hand in sending help when they were at the end of their strength.", memoryWork: "Squanto taught the Pilgrims to plant corn and catch fish." },
        { id: "titus-history-u2-l4", title: "The First Thanksgiving", objective: "Tell the story of the first Thanksgiving and its meaning.", teach: "After their first harvest in 1621, the Pilgrims held a feast to thank God for keeping them alive. They invited Chief Massasoit and about ninety Wampanoag men, who brought deer to share. For three days they ate wild turkey, venison, corn, and squash together. It was a table of thanks to the God who provides, and a moment of peace between two very different peoples.", memoryWork: "1621, the first Thanksgiving feast at Plymouth." },
        { id: "titus-history-u2-l5", title: "Life in the Thirteen Colonies", objective: "Describe daily life and the growth of the thirteen colonies.", teach: "Over the next century England's settlements grew into thirteen colonies stretched along the Atlantic coast. Most families were farmers who made almost everything by hand: candles, soap, clothes, and their own bread. Children did real chores by age five and learned to read mainly so they could read the Bible. Sunday meant church, sometimes for hours, for a people who took God seriously.", memoryWork: "There were thirteen English colonies along the Atlantic coast." },
      ],
    },
    {
      id: "titus-history-u3",
      title: "Unit 3 · The Road to Independence",
      summary: "Taxes, protest, the Declaration of 1776, and the Revolution.",
      lessons: [
        { id: "titus-history-u3-l1", title: "Trouble with the King", objective: "Explain why the colonies grew angry with Britain.", teach: "After years of mostly ruling themselves, the colonists were suddenly taxed by King George III and Parliament far across the ocean, on tea, paper, and stamps. What angered them most was having no voice in it: 'No taxation without representation!' became their cry. They believed a people should have a say in the laws they must obey.", memoryWork: "'No taxation without representation', the colonists' cry." },
        { id: "titus-history-u3-l2", title: "The Boston Tea Party", objective: "Tell what happened at the Boston Tea Party.", teach: "In 1773 colonists in Boston had had enough of the tea tax. One December night men disguised as Mohawk Indians boarded three British ships in the harbor and dumped 342 chests of tea into the sea. The king was furious and punished Boston harshly, which only pushed the colonies closer to war. A cup of tea had helped light a revolution.", memoryWork: "1773, the Boston Tea Party." },
        { id: "titus-history-u3-l3", title: "The Shot Heard Round the World", objective: "Describe how the Revolutionary War began in 1775.", teach: "In 1775 British soldiers marched to Lexington and Concord to seize the colonists' weapons. Paul Revere rode through the night warning, 'The British are coming!' At dawn the militia and the redcoats faced off, and a shot rang out, later called 'the shot heard round the world.' The war for independence had begun.", memoryWork: "1775, the Revolutionary War begins at Lexington and Concord." },
        { id: "titus-history-u3-l4", title: "The Declaration of Independence", objective: "Explain what the Declaration of Independence said and when it was signed.", teach: "On July 4, 1776, the leaders of the colonies signed the Declaration of Independence, mostly written by Thomas Jefferson. It boldly announced that the colonies were now free and independent states, no longer under the king. It declared that all men are created equal and given rights by their Creator, not by any king. This is the birthday of the United States of America.", memoryWork: "1776, the Declaration of Independence (July 4)." },
        { id: "titus-history-u3-l5", title: "Winning the War", objective: "Tell how the Americans won independence.", teach: "The war was long and hard. General George Washington's ragged army nearly froze and starved at Valley Forge one terrible winter, yet held together. With help from France, the Americans finally trapped the British army at Yorktown in 1781 and won. A small band of colonies had beaten the strongest empire on earth, a thing few thought possible without the hand of Providence.", memoryWork: "1781, the British surrender at Yorktown." },
      ],
    },
    {
      id: "titus-history-u4",
      title: "Unit 4 · Founders & the Constitution",
      summary: "Washington, Franklin, Jefferson, and the making of the government.",
      lessons: [
        { id: "titus-history-u4-l1", title: "George Washington", objective: "Tell who George Washington was and why he is called the Father of His Country.", teach: "George Washington led the American army through the whole Revolution, then in 1789 became the very first President of the United States. He was so trusted that some wanted to make him a king, but he refused, and he stepped down after two terms so no one man would rule too long. Honest and humble, he set the example every president since has followed. We call him the Father of His Country.", memoryWork: "1789, George Washington becomes the first President." },
        { id: "titus-history-u4-l2", title: "Benjamin Franklin", objective: "Describe Benjamin Franklin and his many talents.", teach: "Benjamin Franklin was perhaps the cleverest American of his day: a printer, writer, inventor, and statesman. He flew a kite in a thunderstorm to study lightning and invented the lightning rod, bifocal glasses, and a better stove. He also helped write the Declaration and won France's help in the war. Franklin proved that hard work and curiosity could take a poor boy very far.", memoryWork: "Benjamin Franklin, printer, inventor, and statesman." },
        { id: "titus-history-u4-l3", title: "Thomas Jefferson", objective: "Tell who Thomas Jefferson was and what he wrote.", teach: "Thomas Jefferson was the Virginia writer who penned most of the Declaration of Independence at just thirty-three years old. Later he became the third President and doubled the size of the country with the Louisiana Purchase. He loved books, invention, and learning, and founded a university. His pen gave America some of her most famous words.", memoryWork: "Thomas Jefferson wrote the Declaration of Independence." },
        { id: "titus-history-u4-l4", title: "The Constitution, 1787", objective: "Explain what the Constitution is and when it was written.", teach: "After the war the new country needed rules to govern itself, so in 1787 leaders met in Philadelphia and wrote the Constitution, still the law of the land today. It splits the government into three branches, the President, the Congress, and the courts, so no one person can seize all the power. The Founders knew from Scripture that man's heart is sinful, so they built a government where power checks power.", memoryWork: "1787, the Constitution is written in Philadelphia." },
        { id: "titus-history-u4-l5", title: "The Bill of Rights", objective: "Describe the Bill of Rights and the freedoms it protects.", teach: "In 1791 the first ten changes, or amendments, were added to the Constitution, together called the Bill of Rights. They guard precious freedoms: to worship God as you believe, to speak freely, and to gather peacefully. The very first freedom listed is freedom of religion, the same freedom the Pilgrims had crossed the ocean to find.", memoryWork: "1791, the Bill of Rights (the first ten amendments)." },
      ],
    },
    {
      id: "titus-history-u5",
      title: "Unit 5 · Westward Expansion",
      summary: "The Louisiana Purchase, Lewis & Clark, and the pioneers.",
      lessons: [
        { id: "titus-history-u5-l1", title: "The Louisiana Purchase", objective: "Explain how the country doubled in size in 1803.", teach: "In 1803 President Jefferson bought a vast stretch of land from France called the Louisiana Territory for about fifteen million dollars, only a few cents an acre. Overnight the size of the United States nearly doubled, opening a huge wilderness of plains, rivers, and mountains. Nobody in the East really knew what was out there.", memoryWork: "1803, the Louisiana Purchase doubles the country." },
        { id: "titus-history-u5-l2", title: "Lewis & Clark", objective: "Tell the story of the Lewis and Clark expedition.", teach: "To explore the new land, Jefferson sent Meriwether Lewis and William Clark on a great journey west in 1804. For over two years they paddled rivers, crossed the Rocky Mountains, and reached the Pacific Ocean. A young Shoshone woman named Sacagawea guided them and helped them make peace with native peoples along the way. They mapped a wild country and brought back news of wonders.", memoryWork: "1804, Lewis and Clark set out to explore the West." },
        { id: "titus-history-u5-l3", title: "Pioneers and the Wagon Trains", objective: "Describe how pioneer families moved west.", teach: "Soon thousands of families loaded covered wagons and rolled west on long trails like the Oregon Trail. The journey took months of dust, rivers, and danger, and many did not survive it. They went hoping for good farmland and a fresh start in the open country. It was a hard, brave, and sometimes heartbreaking chapter of American life.", memoryWork: "Pioneers traveled west in covered wagons on trails like the Oregon Trail." },
        { id: "titus-history-u5-l4", title: "The Cost to Native Peoples", objective: "Explain honestly how westward expansion hurt Native Americans.", teach: "As settlers pushed west, the Native peoples who already lived there were pushed off their lands, again and again. In the Trail of Tears the Cherokee were forced to march hundreds of miles from their homes, and thousands died along the way. This was a real and grievous wrong. We remember it truthfully, for God cares about justice and about every people He has made.", memoryWork: "The Trail of Tears, the Cherokee forced from their homes." },
      ],
    },
    {
      id: "titus-history-u6",
      title: "Unit 6 · A House Divided",
      summary: "Slavery, the Civil War, and Abraham Lincoln.",
      lessons: [
        { id: "titus-history-u6-l1", title: "A Nation Split Over Slavery", objective: "Explain what slavery was and why it divided the nation.", teach: "For a long time in America, especially on Southern farms, people were held as slaves, mostly stolen from Africa, forced to work with no pay and no freedom. This was a deep evil, for every person is made in the image of God. The North increasingly wanted to end slavery while the South wanted to keep it, and the whole nation was torn in two over it.", memoryWork: "Slavery is a great evil, because every person bears God's image." },
        { id: "titus-history-u6-l2", title: "Abraham Lincoln", objective: "Tell who Abraham Lincoln was and how he became President.", teach: "Abraham Lincoln grew up poor in a log cabin, taught himself by reading books by firelight, and became a lawyer and then President in 1861. Tall, honest, and wise, he believed the nation could not last 'half slave and half free.' When he was elected, Southern states left the Union, and the country plunged into war. Few presidents ever faced a heavier burden.", memoryWork: "1861, Abraham Lincoln becomes President." },
        { id: "titus-history-u6-l3", title: "The Civil War", objective: "Describe the Civil War between North and South.", teach: "From 1861 to 1865 the Northern states (the Union) and the Southern states (the Confederacy) fought the Civil War, the bloodiest war in American history, brother against brother. Great battles like Gettysburg cost tens of thousands of lives. It was a terrible price, and God alone could bring any good out of such sorrow.", memoryWork: "1861–1865, the Civil War." },
        { id: "titus-history-u6-l4", title: "Freedom and the End of the War", objective: "Tell how the war ended and slavery was abolished.", teach: "In 1863 Lincoln issued the Emancipation Proclamation, declaring that the slaves were to be free. The Union finally won the war in 1865, and soon after, the Constitution was changed to end slavery everywhere in America forever. Millions of people were freed. It had cost the nation dearly, but a great wrong was at last struck down.", memoryWork: "1865, the Civil War ends and slavery is abolished." },
        { id: "titus-history-u6-l5", title: "The Loss of Lincoln", objective: "Tell what happened to Lincoln at the end of the war.", teach: "Just days after the war ended in 1865, President Lincoln was shot and killed at a theater by a man who hated the Union. The whole country, North and South, mourned. Lincoln had helped save the nation and free the slaves, and he is remembered as one of America's greatest presidents. Even good men are mortal, and the story of nations rests finally in God's hands, not ours.", memoryWork: "1865, President Lincoln is assassinated." },
      ],
    },
    {
      id: "titus-history-u7",
      title: "Unit 7 · Heroes, Inventors & the Timeline",
      summary: "Great Americans, inventions, and putting the whole story in order.",
      lessons: [
        { id: "titus-history-u7-l1", title: "Inventors Who Changed America", objective: "Name key American inventors and what they made.", teach: "American inventors changed how everyone lives. Thomas Edison created the practical light bulb and the phonograph, working through a thousand failures until each one worked. Alexander Graham Bell invented the telephone so people could talk across great distances. The Wright brothers, two bicycle makers from Ohio, built the first flying airplane in 1903. Curiosity and hard work turned dreams into machines.", memoryWork: "1903, the Wright brothers fly the first airplane." },
        { id: "titus-history-u7-l2", title: "Heroes of Faith and Courage", objective: "Tell about brave Americans who did what was right.", teach: "Some Americans are remembered for their courage. Harriet Tubman escaped slavery and then risked her life again and again to lead others to freedom on the Underground Railroad, trusting God to guide her. Later, Frederick Douglass, once a slave, became a powerful voice against slavery. These were ordinary people who did hard, right things at great cost.", memoryWork: "Harriet Tubman led many enslaved people to freedom." },
        { id: "titus-history-u7-l3", title: "Reciting the Timeline", objective: "Say the main dates of American history in order.", teach: "Now put the whole story in a row. History is not a jumble; it is one line, one date leading to the next, all held in the hand of the God who rules time. Chant the timeline until you can say it without looking. When you know the dates in order, you carry the whole American story in your head.", memoryWork: "1492 Columbus · 1607 Jamestown · 1620 Mayflower · 1776 Declaration · 1787 Constitution · 1803 Louisiana Purchase · 1861–1865 Civil War." },
        { id: "titus-history-u7-l4", title: "God Over the Nations", objective: "Explain the providential view: God rules over all of history.", teach: "Looking back over the whole year, we see one big truth: God is sovereign over nations and over history. He raises up rulers and brings them down; He set the times and the places of every people. The story had bright days and dark days, brave people and wicked deeds, yet He was ruling over all of it the whole time. That is why we can study history with both honesty and hope.", memoryWork: "'He changes times and seasons; he removes kings and sets up kings.' (Daniel 2:21)" },
      ],
    },
  ],
};
