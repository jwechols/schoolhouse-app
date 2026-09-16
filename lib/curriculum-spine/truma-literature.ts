import type { Course } from "./types";

// Truma, 6th Grade Literature (top of the grammar stage). MCA/Memoria model: 6th
// grade is advanced grammar, not logic stage, so this is a rich, memory-anchored
// literature year that gives a capable young scholar the vocabulary and habits of
// real literary analysis while she reads the great medieval stories: King Arthur
// and the Knights of the Round Table, Robin Hood, and Adam of the Road. She learns
// how a story is built (plot, character, setting, theme, point of view), the
// language stories are made of (figurative language), the shape of the hero's
// journey, and the Christian literary imagination (Bunyan, Lewis, Tolkien). The
// confessional conviction underneath: the best human stories echo the one true
// Story of redemption. We name that where it is genuinely there and never force it.

export const TRUMA_LITERATURE: Course = {
  kidId: "truma",
  subject: "literature",
  subjectLabel: "Literature",
  emoji: "📜",
  gradeLabel: "6th Grade",
  stage: "grammar",
  overview:
    "A full 6th-grade classical literature year. Truma masters the tools of literary analysis (plot and conflict, character, setting, theme, point of view, and figurative language) and then puts them to work reading the great medieval stories: King Arthur and the Knights of the Round Table, Robin Hood, and Adam of the Road. She learns the shape of the hero's journey and how great stories carry truth, closing with the Christian literary imagination of Bunyan, Lewis, and Tolkien. The grammar-stage goal is a scholar's working vocabulary she can define and use, and an eye trained to see how a story is built and why it matters.",
  units: [
    {
      id: "truma-literature-u1",
      title: "Unit 1 · The Storyteller's Craft",
      summary:
        "The building blocks every story is made of: plot and conflict, character, setting, theme, and point of view.",
      lessons: [
        {
          id: "truma-literature-u1-l1",
          title: "Plot & the Shape of a Story",
          objective:
            "Identify the five parts of plot and trace them through a story.",
          teach:
            "A plot is the ordered sequence of events, not just a pile of things that happen but a chain where each event causes the next. Classic plots move through five stages: exposition (we meet the characters and world), rising action (tension builds through complications), climax (the turning point of highest tension), falling action (consequences unfold), and resolution or denouement (the story settles). In the tale of the sword in the stone, the exposition is young Arthur living unknown as a squire, the rising action is knight after knight failing to draw the sword, the climax is Arthur pulling it free, and the resolution is his being made king. Learn to name each stage and you can map any story.",
          memoryWork:
            "Five parts of plot: exposition, rising action, climax, falling action, resolution.",
          practiceFocus:
            "Give a short story summary and ask her to label the five plot stages.",
        },
        {
          id: "truma-literature-u1-l2",
          title: "Conflict: the Engine of Story",
          objective:
            "Define conflict and distinguish the main types of conflict.",
          teach:
            "Conflict is the struggle that drives a plot forward; without a problem to face, there is no story. The main kinds are person against person (Arthur against the traitor Mordred), person against nature (a knight lost in a deadly winter forest), person against society (Robin Hood against unjust laws), and person against self (a knight tempted to break his vow). The deepest stories often stack several at once. Notice that conflict is not the same as violence: the hardest conflict is frequently inside a character, the war between what he wants and what is right.",
          memoryWork:
            "Four conflicts: person vs. person, vs. nature, vs. society, vs. self.",
          practiceFocus:
            "Name a scene and ask which type(s) of conflict it shows.",
        },
        {
          id: "truma-literature-u1-l3",
          title: "Character: Round, Flat & Dynamic",
          objective:
            "Analyze characters as protagonist/antagonist, round/flat, and dynamic/static.",
          teach:
            "The protagonist is the character the story follows; the antagonist opposes him. Beyond those roles, ask how full and how changeable a character is. A round character is complex, with strengths and flaws we come to know deeply (Lancelot, the greatest knight and yet the one whose love betrays his king). A flat character is simple, built for one purpose (a nameless herald who only delivers news). A dynamic character changes over the story; a static one stays the same. Watch how a good writer reveals character not by telling us 'he was brave' but by showing him act bravely under pressure.",
          memoryWork:
            "Round = complex; flat = simple. Dynamic = changes; static = stays the same.",
        },
        {
          id: "truma-literature-u1-l4",
          title: "Setting: When & Where",
          objective:
            "Explain how setting shapes mood and meaning in a story.",
          teach:
            "Setting is the time and place of a story, but a strong setting does far more than give an address; it sets the mood and can even shape the plot. The mist-shrouded lake where the Lady of the Lake gives Arthur his sword feels holy and mysterious, and that atmosphere tells us the sword is no ordinary weapon. Medieval stories lean hard on their settings: the great hall at Camelot signals order and fellowship, the wild forest signals danger and testing. When you read, ask what a place makes you feel and how the story would change somewhere else.",
          memoryWork:
            "Setting = the time and place; it creates the mood.",
        },
        {
          id: "truma-literature-u1-l5",
          title: "Theme & Point of View",
          objective:
            "State a story's theme and identify its point of view.",
          teach:
            "Theme is the central idea a story explores, the truth about life it leaves you with, stated as a full thought and not one word: not 'loyalty' but 'loyalty is tested most when it costs us something.' Point of view is the vantage from which the story is told: first person ('I rode to Camelot'), third person limited (following one character's thoughts), or third person omniscient (the narrator knows everyone's mind). Point of view controls what we are allowed to know; a first-person Mordred would hide his treachery, while an omniscient narrator can show us the plot forming. As a Christian reader, Truma can also ask what a theme claims about the world, and whether that claim is true.",
          memoryWork:
            "Theme = the big idea as a full sentence. POV = who is telling the story.",
        },
      ],
    },
    {
      id: "truma-literature-u2",
      title: "Unit 2 · The Language of Story",
      summary:
        "Figurative language: how writers say more than the plain words through simile, metaphor, personification, imagery, and symbol.",
      lessons: [
        {
          id: "truma-literature-u2-l1",
          title: "Literal vs. Figurative Language",
          objective:
            "Distinguish literal from figurative language and explain why writers use it.",
          teach:
            "Literal language means exactly what it says; figurative language uses words in a non-literal way to create a picture, a feeling, or a comparison. When a poet writes that a knight's heart was 'a fortress no fear could storm,' the heart is not really a building, but the image tells us more about his courage than the plain word 'brave' ever could. Figurative language is not decoration; it is a way of seeing. Scripture itself is full of it ('The LORD is my shepherd'), which reminds us that images can carry deep truth.",
          memoryWork:
            "Literal = exact meaning. Figurative = a non-literal picture or comparison.",
        },
        {
          id: "truma-literature-u2-l2",
          title: "Simile & Metaphor",
          objective:
            "Define and distinguish simile and metaphor, and find them in a text.",
          teach:
            "A simile compares two unlike things using 'like' or 'as': 'Sir Gawain fought like a lion.' A metaphor makes the comparison directly, saying one thing is another: 'Sir Gawain was a lion in battle.' Both help us understand something by holding it beside something familiar, but the metaphor is bolder because it fuses the two. Watch for the difference: the moment you see 'like' or 'as,' you have a simile; without them, the same comparison becomes a metaphor.",
          memoryWork:
            "Simile compares with 'like' or 'as.' Metaphor says one thing IS another.",
          practiceFocus:
            "Show sentences and ask her to label each simile or metaphor.",
        },
        {
          id: "truma-literature-u2-l3",
          title: "Personification",
          objective:
            "Identify personification and explain its effect.",
          teach:
            "Personification gives human qualities to something that is not human, whether an animal, an object, or an idea. When a story says 'the wind howled its warning through Sherwood' or 'Death reached for the wounded knight,' the wind and death are being treated as if they could warn and reach. This makes a scene vivid and can make forces of nature or fate feel like characters in their own right. Ask what mood the personification creates: a 'whispering' brook feels gentle, a 'clawing' storm feels cruel.",
          memoryWork:
            "Personification = giving human traits to a non-human thing.",
        },
        {
          id: "truma-literature-u2-l4",
          title: "Imagery: Writing for the Senses",
          objective:
            "Recognize sensory imagery and describe the picture it creates.",
          teach:
            "Imagery is descriptive language that appeals to the five senses, letting a reader see, hear, smell, taste, and feel a scene. A medieval feast described with 'the smoke of roasting venison, the clash of goblets, the red glow of torches on stone' puts you inside the hall. Strong writers layer several senses at once so the world feels real and present. When you read, underline the sensory words and notice which sense a passage leans on and why.",
          memoryWork:
            "Imagery = words that appeal to the five senses.",
        },
        {
          id: "truma-literature-u2-l5",
          title: "Symbol",
          objective:
            "Explain what a symbol is and interpret a symbol in a story.",
          teach:
            "A symbol is a concrete thing that stands for a larger idea beyond itself. Excalibur is a sword, but it also stands for rightful, God-given kingship, which is why returning it to the lake at Arthur's death signals that his reign is over. A round table is furniture, but the Round Table symbolizes equality and brotherhood among the knights, since a circle has no head or foot. Symbols reward careful reading: ask what an object keeps appearing near, and what idea it seems to carry.",
          memoryWork:
            "Symbol = a concrete thing that stands for a bigger idea.",
        },
      ],
    },
    {
      id: "truma-literature-u3",
      title: "Unit 3 · King Arthur & the Hero's Journey",
      summary:
        "The medieval world of Camelot, the code of chivalry, and the shape of the hero's journey through the Arthur legends.",
      lessons: [
        {
          id: "truma-literature-u3-l1",
          title: "The Medieval World & Chivalry",
          objective:
            "Describe the medieval setting and the code of chivalry behind the Arthur stories.",
          teach:
            "The Arthur legends grew out of the Middle Ages, a world of castles, knights, oaths, and a Christian faith woven into daily life. Chivalry was the knight's code: courage, loyalty to one's lord, protection of the weak, honesty, and reverence toward God. Knights of the Round Table swore to 'never do outrage nor murder,' to show mercy, and to help ladies and the helpless. Understanding this code is the key to the stories, because the drama comes from knights either keeping or breaking vows they took before God and their king.",
          memoryWork:
            "Chivalry = the knight's code: courage, loyalty, mercy, honor, faith.",
        },
        {
          id: "truma-literature-u3-l2",
          title: "The Sword in the Stone",
          objective:
            "Trace how Arthur becomes king and analyze the meaning of the sword.",
          teach:
            "The famous opening establishes Arthur's kingship as given, not seized: an anvil and stone appear bearing a sword and the words that whoever draws it is the rightful king of England. Mighty knights strain and fail; the unknown boy Arthur draws it easily. The scene works as exposition (we meet Arthur and his world) and as symbol (the sword marks a divinely appointed king). Notice the theme quietly forming, that true authority is bestowed from above rather than won by force, an idea a Reformed reader will recognize as echoing how God raises up rulers.",
          memoryWork:
            "The sword in the stone = kingship given, not seized.",
        },
        {
          id: "truma-literature-u3-l3",
          title: "The Knights of the Round Table",
          objective:
            "Explain the fellowship of the Round Table and its key knights.",
          teach:
            "Arthur gathers the greatest knights into a fellowship seated at a round table so that none is ranked above another, a symbol of brotherhood and shared honor. Each knight has a distinct character: Lancelot the greatest in skill, Gawain courteous and fierce, Galahad the pure, Kay the sharp-tongued foster brother. This is a chance to practice character analysis across a whole cast, asking who is round and who is flat, and who will prove dynamic. The Round Table also gives us the story's ideal, a just fellowship under a good king, against which every later betrayal will be measured.",
          memoryWork:
            "The Round Table = equality and brotherhood; no head, no foot.",
        },
        {
          id: "truma-literature-u3-l4",
          title: "The Hero's Journey",
          objective:
            "Identify the stages of the hero's journey in a quest tale.",
          teach:
            "Many hero stories follow a common pattern often called the hero's journey: the hero receives a call to adventure, crosses from the ordinary world into a world of trials, faces tests and enemies, meets a supreme ordeal, and returns changed, often carrying something that blesses his people. A knight's quest fits this shape: called from Camelot, he rides into the wild, is tested by combat and temptation, faces his hardest trial, and returns transformed. Learning this map helps Truma see the skeleton beneath many stories, and later see why the true Story of Christ both fits and surpasses the pattern.",
          memoryWork:
            "Hero's journey: call, crossing, trials, ordeal, return changed.",
        },
        {
          id: "truma-literature-u3-l5",
          title: "The Quest for the Holy Grail",
          objective:
            "Analyze the Grail quest as a story about purity and longing.",
          teach:
            "The Grail quest sends the knights searching for a sacred cup, and it turns the usual adventure inward: the prize goes not to the strongest fighter but to the purest heart, Sir Galahad. Knights who trusted only their own strength fail, while the quest exposes what is really in each man. Whatever its legendary form, the tale carries a genuine theme, that the deepest human longing is for the holy, and that longing cannot be satisfied by skill or force. A Christian reader can honor the story's ache for holiness while remembering that Christ, not a relic, is where that longing truly rests.",
          memoryWork:
            "The Grail quest tests the heart, not the sword arm.",
        },
        {
          id: "truma-literature-u3-l6",
          title: "The Fall of Camelot",
          objective:
            "Explain how betrayal and sin bring down Camelot, and state the theme.",
          teach:
            "Camelot falls not to an outside army first but to broken faith within: Lancelot's love for the queen fractures the fellowship, and Mordred's treachery finishes it, ending in the last battle where Arthur is mortally wounded. The dying king commands that Excalibur be returned to the lake, closing the symbol that opened the story. The theme lands with real weight, that even the noblest human kingdom cannot stand where sin is harbored. This is the doctrine of the fall told as tragedy, and it makes the reader long for a King and a kingdom that cannot fall.",
          memoryWork:
            "Camelot falls from sin within, not enemies without.",
        },
      ],
    },
    {
      id: "truma-literature-u4",
      title: "Unit 4 · Robin Hood",
      summary:
        "The outlaw of Sherwood: justice, mercy, and the question of law versus righteousness.",
      lessons: [
        {
          id: "truma-literature-u4-l1",
          title: "The World of Sherwood",
          objective:
            "Describe the setting and situation that create the Robin Hood story.",
          teach:
            "The Robin Hood tales are set in medieval England under corrupt local power, chiefly the Sheriff of Nottingham, while the rightful king is away. Sherwood Forest becomes both a hiding place and a kind of alternative kingdom where the outlaws live by their own fellowship. The setting drives the whole conflict: with justice broken in the towns, the greenwood becomes the place where a rougher justice is done. Notice how the forest here means freedom and refuge, the opposite of the forest-as-danger in the Arthur tales, a good reminder that setting takes its meaning from the story around it.",
          memoryWork:
            "Setting takes its meaning from the story: Sherwood = refuge, not danger.",
        },
        {
          id: "truma-literature-u4-l2",
          title: "Robin Hood: the Outlaw Hero",
          objective:
            "Analyze Robin Hood as a character and the band of Merry Men.",
          teach:
            "Robin Hood is a heroic outlaw: skilled with the bow, quick-witted, generous, and loyal, an outlaw by the law's letter yet honorable by its spirit. Around him gathers a memorable cast: Little John, the giant met on the bridge; Friar Tuck, the fighting priest; Will Scarlet; and Maid Marian. Each is a study in characterization, often introduced through a contest or fight that reveals who they are. Robin is a round character we admire, but a careful reader also weighs his flaws, since a hero we cannot question is a flat one.",
          memoryWork:
            "Robin Hood = the heroic outlaw; his band is revealed through contests.",
        },
        {
          id: "truma-literature-u4-l3",
          title: "Justice, Mercy & the Law",
          objective:
            "Examine the theme of justice versus unjust law in Robin Hood.",
          teach:
            "The famous idea that Robin 'robs from the rich to give to the poor' raises a real and difficult theme: what should a person do when the law itself is unjust? The Sheriff enforces the letter of the law while trampling justice, and Robin breaks the law while defending the weak. This is worth wrestling with rather than settling too fast, because Scripture teaches both that we honor lawful authority (Romans 13) and that God loves justice and defends the poor. A wise reader can admire Robin's mercy and love of justice while still asking whether taking the law into one's own hands is finally right.",
          memoryWork:
            "Theme: what do we owe an unjust law? Honor authority, love justice.",
        },
        {
          id: "truma-literature-u4-l4",
          title: "The Return of the King",
          objective:
            "Explain the resolution and how a good king restores order.",
          teach:
            "Many versions resolve when the rightful king returns, pardons Robin, and sets wrongs right, so the outlaw is finally revealed as loyal to true authority all along. This is the falling action and resolution doing their work, releasing the tension the corrupt Sheriff built up. The pattern of a good king returning to judge the wicked and vindicate the faithful is deeply satisfying because it answers our hunger for justice. A Christian reader may notice a faint echo here of a greater returning King, without pretending Robin Hood set out to preach it.",
          memoryWork:
            "Resolution: the rightful king returns and sets wrongs right.",
        },
      ],
    },
    {
      id: "truma-literature-u5",
      title: "Unit 5 · Adam of the Road",
      summary:
        "A boy, his father, and his dog on the roads of 13th-century England: a coming-of-age journey through the medieval world.",
      lessons: [
        {
          id: "truma-literature-u5-l1",
          title: "A Minstrel's England",
          objective:
            "Describe the historical setting of Adam of the Road and its narrative purpose.",
          teach:
            "Adam of the Road follows Adam Quartermayne, the son of a traveling minstrel in 13th-century England, and its rich setting is part of its purpose: to walk the reader down real medieval roads past monasteries, fairs, manors, and towns. Unlike the legends of Arthur, this is historical fiction, invented characters set in a carefully researched real time and place. The setting is almost a character, teaching us how ordinary medieval people lived, traveled, and worshiped. Watch how the author uses concrete detail and imagery to make a distant century feel touchable.",
          memoryWork:
            "Historical fiction = invented characters in a real, researched setting.",
        },
        {
          id: "truma-literature-u5-l2",
          title: "Adam, Roger & Nick the Dog",
          objective:
            "Analyze Adam as a protagonist and the relationships that shape him.",
          teach:
            "Adam is a warm, hopeful protagonist whose whole world rests on two loves: his father Roger, a charming but unreliable minstrel, and his red spaniel Nick. Characterization here is gentle and realistic rather than legendary; Adam is an ordinary boy we come to know through his hopes, mistakes, and affections. His father is a fine study in a round character, lovable and gifted yet flawed by carelessness. Pay attention to how these relationships set up the central conflict, because a story often breaks the hero's heart precisely where he loves most.",
          memoryWork:
            "We know a character through hopes, mistakes, and who they love.",
        },
        {
          id: "truma-literature-u5-l3",
          title: "Lost on the Road",
          objective:
            "Trace the central conflict and Adam's journey to find what he has lost.",
          teach:
            "The heart of the book is loss: Adam's dog Nick is stolen and then, in the chaos of the chase, he is separated from his father, leaving a boy alone on the medieval roads. This drives a person-against-circumstance conflict and a long search that structures the whole plot as a journey. Adam's travels become a quiet version of the hero's journey, full of trials, kind strangers, and hard lessons. The tension of 'will he find them again' pulls us forward while the road itself changes him.",
          memoryWork:
            "The search for what is lost gives the whole plot its shape.",
        },
        {
          id: "truma-literature-u5-l4",
          title: "Growing Up & Providence",
          objective:
            "State the theme of Adam of the Road and discuss perseverance and providence.",
          teach:
            "By the end Adam is reunited with his father and his dog, but he is no longer the same boy; he has learned patience, courage, and how to trust when everything is uncertain. That change makes him a dynamic character, and the theme comes clear, that growing up means enduring loss and learning to hope through it. A Christian reader can name what the book gestures toward, God's providence, the truth that our steps are ordered even when the road bewilders us (Proverbs 16:9). We hold that gently, letting the story show it rather than forcing a sermon onto it.",
          memoryWork:
            "Theme: growing up means enduring loss and learning to hope.",
        },
      ],
    },
    {
      id: "truma-literature-u6",
      title: "Unit 6 · The Christian Literary Imagination",
      summary:
        "How Bunyan, Lewis, and Tolkien wrote stories that carry the truths of the faith.",
      lessons: [
        {
          id: "truma-literature-u6-l1",
          title: "Allegory: Stories That Stand for More",
          objective:
            "Define allegory and distinguish it from ordinary symbolism.",
          teach:
            "An allegory is a whole story in which the characters, places, and events consistently stand for a deeper meaning, usually spiritual or moral, so that the surface tale and the hidden meaning run side by side from start to finish. It is more than a single symbol; it is a story built to be read on two levels at once. The greatest English allegory is John Bunyan's The Pilgrim's Progress, where the hero named Christian journeys from the City of Destruction to the Celestial City. Learning to read allegory teaches Truma to ask, gently and without over-reading, whether a story means more than it says.",
          memoryWork:
            "Allegory = a whole story where everything stands for a deeper meaning.",
        },
        {
          id: "truma-literature-u6-l2",
          title: "John Bunyan & The Pilgrim's Progress",
          objective:
            "Interpret key allegorical figures in The Pilgrim's Progress.",
          teach:
            "Bunyan, a Puritan preacher who wrote much of the book in prison for his faith, tells the Christian life as a dangerous journey. The names are the interpretation: Christian carries a burden (his sin) that rolls away only at the Cross; he passes through the Slough of Despond (discouragement), climbs the Hill Difficulty, and resists Vanity Fair. Because Bunyan shared Truma's confessional convictions, the allegory teaches real doctrine, that salvation comes by Christ alone and the believer must persevere to the end. Read this way, the story is both a gripping adventure and a map of the Christian life.",
          memoryWork:
            "The Pilgrim's Progress: Christian carries his burden of sin to the Cross.",
        },
        {
          id: "truma-literature-u6-l3",
          title: "C. S. Lewis & Narnia",
          objective:
            "Explain how Lewis uses story to picture spiritual truth without strict allegory.",
          teach:
            "C. S. Lewis called the Narnia books a 'supposal' rather than a strict allegory: suppose there were another world, and suppose the Son of God entered it as a great Lion named Aslan. In The Lion, the Witch, and the Wardrobe, Aslan willingly gives his life on the Stone Table in the place of the traitor Edmund, then rises again by a 'deeper magic,' picturing substitutionary atonement and resurrection. Lewis's aim was to slip past our defenses so that truths grown familiar could strike us fresh. Truma can enjoy the adventure and also name clearly what Aslan is meant to help us see about Christ.",
          memoryWork:
            "Aslan dies in Edmund's place and rises: a picture of Christ's atonement.",
        },
        {
          id: "truma-literature-u6-l4",
          title: "J. R. R. Tolkien & Sub-Creation",
          objective:
            "Explain Tolkien's idea of the writer as a 'sub-creator' making a secondary world.",
          teach:
            "Tolkien, a devout believer and Lewis's friend, disliked heavy-handed allegory but filled Middle-earth with the light of his faith. He taught that because we are made in the image of God the Creator, writers are 'sub-creators' who make smaller worlds that reflect the true one. In The Lord of the Rings the humble hobbit Frodo carries a terrible burden he cannot destroy by his own strength, and mercy shown to the wretched Gollum accomplishes what raw power could not. There is no preaching, yet themes of humility, mercy, sacrifice, and hope shine through the whole tale.",
          memoryWork:
            "Sub-creation: made in God's image, we make worlds that echo His.",
        },
        {
          id: "truma-literature-u6-l5",
          title: "The Eucatastrophe: the Sudden Joyful Turn",
          objective:
            "Define eucatastrophe and connect it to the resurrection.",
          teach:
            "Tolkien coined the word eucatastrophe (Greek eu, 'good,' plus catastrophe, 'turn') for the sudden joyful turn near the end of a great story, when all hope seems lost and rescue breaks in beyond expectation, like the eagles arriving or Frodo saved at the Crack of Doom. Tolkien argued that this piercing joy is a taste of the greatest good news of all, and that the Gospel is the one eucatastrophe that actually happened in history: the empty tomb after the darkest Friday. This is the year's key idea in one word, that our love of the sudden happy ending is really a longing for the Resurrection.",
          memoryWork:
            "Eucatastrophe = the sudden joyful turn; the Resurrection is the true one.",
        },
      ],
    },
    {
      id: "truma-literature-u7",
      title: "Unit 7 · How Great Stories Carry Truth",
      summary:
        "Putting the year's tools together: testing what a story teaches and seeing how the best stories echo the true Story.",
      lessons: [
        {
          id: "truma-literature-u7-l1",
          title: "Reading Like a Scholar",
          objective:
            "Apply the full toolkit of literary analysis to a new passage.",
          teach:
            "A scholar does not just enjoy a story, she interrogates it, moving through plot, conflict, character, setting, point of view, figurative language, symbol, and theme in turn. Given a fresh passage, she asks in order: what happens and what is the conflict, who are these characters and are they round or flat, where and when are we, who is telling this and what do they let me see, what figurative language and symbols appear, and finally what is the theme. This habit of ordered questions turns vague impressions into real understanding. The goal of the year has been to make these questions second nature.",
          memoryWork:
            "Ask in order: plot, conflict, character, setting, POV, figures, symbol, theme.",
          practiceFocus:
            "Give an unseen short passage and walk her through the full analysis.",
        },
        {
          id: "truma-literature-u7-l2",
          title: "Does the Story Tell the Truth?",
          objective:
            "Evaluate a story's theme against what is true, good, and beautiful.",
          teach:
            "Once you have found a theme, the last scholarly question is whether it is true, because a story can be beautifully told and still teach something false. A tale might claim that revenge brings peace, or that a person can save himself by trying hard enough, and a discerning reader can love the craft while rejecting the lie. Truma weighs a story's claims against Scripture and the confession she holds, asking what this story says about God, people, sin, and hope, and whether that is so. This is not being suspicious of stories; it is honoring them enough to take their ideas seriously.",
          memoryWork:
            "A story can be well told and still teach something false. Test the theme.",
        },
        {
          id: "truma-literature-u7-l3",
          title: "Echoes of the True Story",
          objective:
            "Explain how many great stories reflect the pattern of the one true Story.",
          teach:
            "Across the year the same shapes have kept returning: a rightful king, a costly sacrifice, a hero who loses everything and rises, a sudden joyful turn when hope is gone. These are not accidents. The Bible tells one true Story of creation, fall, redemption, and restoration, and the deepest human stories keep echoing its pattern because that pattern is written into the world God made. This is why a knight's sacrifice or a hobbit's mercy can move us so deeply; they rhyme, faintly, with the Cross and the empty tomb. We say this with care, honoring each story on its own terms and never forcing an echo that is not really there.",
          memoryWork:
            "The Bible's Story: creation, fall, redemption, restoration.",
        },
        {
          id: "truma-literature-u7-l4",
          title: "Your Turn to Tell It Well",
          objective:
            "Use the year's craft and discernment to shape and share a story of her own.",
          teach:
            "A scholar of literature is finally meant to become a maker of it, because understanding how stories work equips you to tell them well. Using the tools of the year, Truma can shape a tale with a clear plot and a real conflict, round characters, a vivid setting drawn with sensory imagery, a well-placed symbol, and a theme worth believing. As a sub-creator made in the image of the great Creator, she can write something true and beautiful, whether a short story, a retold legend, or a poem. To write well is one good way to love God with the mind He gave.",
          memoryWork:
            "A good story: clear plot, real conflict, round characters, vivid setting, true theme.",
          practiceFocus:
            "Guide her to outline and draft an original short story using the year's tools.",
        },
      ],
    },
  ],
};
