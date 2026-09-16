import type { Course } from "./types";

// Truma, 6th Grade Science (top of the GRAMMAR stage; see docs/mca-curriculum-research.md).
// MCA 6th science = a real study of birds + an introduction to the human body, plus the
// scientific method and classification. Grammar-stage means the year is built on MEMORIZED
// facts and precise vocabulary Truma can recite. Confessional Reformed Baptist (1689): the
// design and order of living things declares their Creator (Genesis 1; Psalm 139). We study
// what God has made and how it works; we do not teach evolution as fact.

export const TRUMA_SCIENCE: Course = {
  kidId: "truma",
  subject: "science",
  subjectLabel: "Science",
  emoji: "🔬",
  gradeLabel: "6th Grade",
  stage: "grammar",
  overview:
    "A full 6th-grade science year in two great studies. First, birds: how living things are classified, then bird orders, anatomy, feathers, flight, beaks and adaptation, migration, nesting, and field identification. Second, the human body: the cell, then the skeletal, muscular, circulatory, respiratory, digestive, nervous, and immune systems, and health. The year opens with the scientific method and the taxonomy ladder (kingdom to species). Grammar-stage goal: a mastered bank of facts and vocabulary Truma can recite by heart. Everything is studied as the ordered, designed work of the Creator (Genesis 1; Psalm 139), never as the product of chance.",
  units: [
    {
      id: "truma-science-u1",
      title: "Unit 1 · How Scientists Think & How Life Is Classified",
      summary:
        "The scientific method and the taxonomy ladder from kingdom down to species.",
      lessons: [
        {
          id: "truma-science-u1-l1",
          title: "What Science Is",
          objective:
            "Define science as the careful study of God's created world through observation and testing.",
          teach:
            "Science is the orderly study of the natural world by observing it, asking questions, and testing answers. It works only because the world is orderly, and it is orderly because a faithful God upholds it the same way every day. When a scientist trusts that dropping a stone will fall the same way tomorrow, he is leaning on God's steady rule over creation (Genesis 8:22). Example: noticing that ice always floats and then asking why is the beginning of real science.",
          memoryWork:
            "Science = the careful study of the created world through observation and testing.",
        },
        {
          id: "truma-science-u1-l2",
          title: "The Scientific Method",
          objective:
            "List and explain the steps of the scientific method in order.",
          teach:
            "The scientific method is a repeatable path: observe, ask a question, form a hypothesis (a testable guess), experiment, record data, and draw a conclusion. A good experiment changes only one thing at a time, the variable, so you know what caused the result. Example: to test if plants need light, keep two identical plants but put one in the dark; light is the only variable, so any difference must come from the light.",
          memoryWork:
            "Steps: observe, question, hypothesis, experiment, record data, conclusion. A hypothesis is a testable guess. A variable is the one thing you change.",
        },
        {
          id: "truma-science-u1-l3",
          title: "Living Things & Their Kinds",
          objective:
            "Name the characteristics of living things and explain that God created creatures 'according to their kinds.'",
          teach:
            "Living things share traits: they grow, use energy, respond to their surroundings, and reproduce after their own kind. In Genesis 1 God repeats that He made plants and animals 'according to their kinds,' which is why a bird produces a bird and an oak produces an oak. Classification is simply the work of naming and grouping the kinds God made so we can study them. Example: a robin and an eagle are both birds, but a robin never hatches an eagle.",
          memoryWork:
            "Living things grow, use energy, respond, and reproduce. God made creatures 'according to their kinds' (Genesis 1).",
        },
        {
          id: "truma-science-u1-l4",
          title: "The Classification Ladder",
          objective:
            "Recite the taxonomy ranks from kingdom down to species in order.",
          teach:
            "Scientists sort living things down a ladder of ever-smaller groups: Kingdom, Phylum, Class, Order, Family, Genus, Species. Each step down means the members are more alike. Example: a human is Kingdom Animalia, Phylum Chordata, Class Mammalia, Order Primates, and so on down to the species. A common way to remember the order is the sentence 'King Philip Came Over For Good Soup.'",
          memoryWork:
            "Kingdom, Phylum, Class, Order, Family, Genus, Species. 'King Philip Came Over For Good Soup.'",
        },
        {
          id: "truma-science-u1-l5",
          title: "Naming Creatures: Genus & Species",
          objective:
            "Explain the two-part scientific name and why one is used worldwide.",
          teach:
            "Every kind of creature gets a two-part Latin name made of its genus and species, called binomial nomenclature. The genus is capitalized and the species is lowercase, and both are italicized, like Homo sapiens for humans or Haliaeetus leucocephalus for the bald eagle. One shared Latin name keeps scientists in every country from being confused by different common names. Example: a 'robin' means different birds in England and America, but Turdus migratorius means only one.",
          memoryWork:
            "A scientific name has two parts: Genus (capitalized) + species (lowercase). This is called binomial nomenclature.",
        },
      ],
    },
    {
      id: "truma-science-u2",
      title: "Unit 2 · Birds: What They Are & Their Orders",
      summary:
        "The class Aves, the traits that make a bird, and the major bird orders.",
      lessons: [
        {
          id: "truma-science-u2-l1",
          title: "What Makes a Bird a Bird",
          objective:
            "Name the defining traits shared by all birds in the class Aves.",
          teach:
            "All birds belong to the class Aves and share four traits no other animals combine: feathers, wings, a toothless beak, and hard-shelled eggs. Birds are also warm-blooded (they keep a steady body temperature) and have hollow, lightweight bones. Feathers are the surest sign: every bird has them and no other creature does. Example: a bat flies and a lizard lays eggs, but only a bird has true feathers.",
          memoryWork:
            "Birds (class Aves): feathers, wings, beak (no teeth), hard-shelled eggs, warm-blooded, hollow bones. Only birds have feathers.",
        },
        {
          id: "truma-science-u2-l2",
          title: "Birds Are Vertebrates",
          objective:
            "Explain that birds are vertebrates and place them among the animal classes.",
          teach:
            "A vertebrate is an animal with a backbone and internal skeleton. The main vertebrate classes are fish, amphibians, reptiles, birds, and mammals. Birds share the backbone with all these, but their feathers, beaks, and egg-laying set the class Aves apart. Example: run your hand down your own spine, then remember that a sparrow has a bony spine too, just far lighter.",
          memoryWork:
            "A vertebrate has a backbone. The five vertebrate classes: fish, amphibians, reptiles, birds, mammals.",
        },
        {
          id: "truma-science-u2-l3",
          title: "Birds of Prey (Raptors)",
          objective:
            "Describe raptors and name birds in the order of hawks, eagles, and owls.",
          teach:
            "Raptors, or birds of prey, are hunters built with hooked beaks, sharp gripping talons, and keen eyesight. Daytime raptors like hawks, eagles, and falcons hunt by sight, while owls hunt mostly at night with silent flight and sharp hearing. Example: a red-tailed hawk can spot a mouse from high in the sky, then dive and seize it with its talons.",
          memoryWork:
            "Raptors (birds of prey) have hooked beaks, sharp talons, and keen eyesight. Examples: hawk, eagle, falcon, owl.",
        },
        {
          id: "truma-science-u2-l4",
          title: "Songbirds (Perching Birds)",
          objective:
            "Describe the order Passeriformes and why it is the largest bird group.",
          teach:
            "Songbirds belong to the order Passeriformes, the perching birds, which is the largest of all bird orders, containing more than half of all bird species. They have feet with three toes forward and one back that lock onto a branch, and most have complex, musical songs. Example: robins, sparrows, cardinals, and finches are all perching songbirds you can hear in a Texas backyard.",
          memoryWork:
            "Passeriformes = perching songbirds, the LARGEST bird order (over half of all species). Foot: 3 toes forward, 1 back.",
        },
        {
          id: "truma-science-u2-l5",
          title: "Water Birds & Wading Birds",
          objective:
            "Compare waterfowl and wading birds and name examples of each.",
          teach:
            "Waterfowl such as ducks, geese, and swans have webbed feet for paddling and waterproof feathers for swimming. Wading birds such as herons, egrets, and cranes have long legs for standing in shallow water and long necks and bills for spearing fish. Example: a duck floats and paddles with webbed feet, while a great blue heron stands still on stilt-like legs waiting to strike.",
          memoryWork:
            "Waterfowl (ducks, geese, swans) have webbed feet. Wading birds (herons, egrets, cranes) have long legs and necks.",
        },
        {
          id: "truma-science-u2-l6",
          title: "Flightless Birds & Special Groups",
          objective:
            "Explain that some birds do not fly and name flightless and specialized birds.",
          teach:
            "Not every bird flies. Flightless birds like the ostrich, emu, and penguin still have feathers and lay eggs but use their bodies differently: the ostrich runs, and the penguin 'flies' underwater with flipper-like wings. Other specialized birds include hummingbirds, which hover and beat their wings dozens of times a second. Example: the ostrich is the largest living bird and can outrun a horse, yet it cannot leave the ground.",
          memoryWork:
            "Flightless birds still have feathers and lay eggs: ostrich, emu, penguin. The ostrich is the largest living bird.",
        },
      ],
    },
    {
      id: "truma-science-u3",
      title: "Unit 3 · Bird Anatomy, Feathers & Flight",
      summary:
        "How a bird's body, feathers, and wings are designed for flight.",
      lessons: [
        {
          id: "truma-science-u3-l1",
          title: "The Bird's Body Plan",
          objective:
            "Label the main external parts of a bird.",
          teach:
            "A bird's body is built in clear parts: the beak (or bill), head, eyes, throat, breast, wings, tail, legs, and feet. Fieldbook study starts with knowing these names, because bird identification depends on describing them accurately. Example: to tell two similar birds apart, a birder might note that one has a streaked breast and the other a plain breast.",
          memoryWork:
            "External bird parts: beak/bill, head, eye, throat, breast, wing, tail, leg, foot.",
        },
        {
          id: "truma-science-u3-l2",
          title: "Hollow Bones & the Skeleton",
          objective:
            "Explain how a bird's skeleton is designed to be strong yet light.",
          teach:
            "A bird's bones are hollow with thin internal struts, making the skeleton very light but still strong, which is essential for flight. The breastbone has a large ridge called the keel where the powerful flight muscles attach. This is careful design: heavy bones could never leave the ground, so the Creator gave birds a frame that is both light and sturdy. Example: a frigatebird's whole skeleton can weigh less than its feathers.",
          memoryWork:
            "Bird bones are hollow (light + strong). Flight muscles attach to the keel on the breastbone.",
        },
        {
          id: "truma-science-u3-l3",
          title: "Feathers: Kinds & Care",
          objective:
            "Name the main types of feathers and explain preening.",
          teach:
            "Feathers are made of keratin, the same material as your fingernails, and come in main types: flight feathers on the wings and tail for lift and steering, contour feathers that shape and color the body, and soft down feathers underneath for warmth. Birds keep feathers working by preening, drawing each feather through the beak to clean and re-align it, and by spreading oil from a gland near the tail. Example: a duck stays dry because preened, oiled feathers shed water.",
          memoryWork:
            "Feathers are made of keratin. Types: flight feathers, contour feathers, down feathers. Cleaning them = preening.",
        },
        {
          id: "truma-science-u3-l4",
          title: "How Wings Create Lift",
          objective:
            "Explain how the shape of a wing lets a bird fly.",
          teach:
            "A wing is shaped like an airfoil: curved on top and flatter beneath, so air moving over the top travels faster and presses down less, while slower air below pushes up. That upward push is called lift. Birds also flap to create thrust, the forward push, and tilt their wings and tail to steer. Example: an eagle holds its wings out and rides rising warm air, called a thermal, circling upward without a single flap.",
          memoryWork:
            "Wing shape = airfoil (curved on top). Upward push = lift. Forward push = thrust. Rising warm air = a thermal.",
        },
        {
          id: "truma-science-u3-l5",
          title: "How Birds Breathe for Flight",
          objective:
            "Describe the bird's air-sac system and why flight needs so much oxygen.",
          teach:
            "Flight burns enormous energy, so birds have one of the most efficient breathing systems in creation. Besides lungs, birds have air sacs that keep fresh air flowing through the lungs in one direction, so oxygen is taken in both when breathing in and when breathing out. This lets birds fly high where the air is thin. Example: bar-headed geese fly over the Himalayas at heights where a person would faint from lack of oxygen.",
          memoryWork:
            "Birds have lungs PLUS air sacs, giving one-way airflow. This is why birds breathe so efficiently during flight.",
        },
      ],
    },
    {
      id: "truma-science-u4",
      title: "Unit 4 · Beaks, Adaptation, Migration & Nesting",
      summary:
        "How birds are fitted to their food and habitat, and how they travel, nest, and are identified.",
      lessons: [
        {
          id: "truma-science-u4-l1",
          title: "Beaks & Feet Fit the Food",
          objective:
            "Explain how beak and foot shapes match how a bird feeds and lives.",
          teach:
            "A bird's beak and feet are designed for its way of life, a good match called an adaptation. Seed-eaters have short, thick, cracking beaks; hunters have hooked, tearing beaks; hummingbirds have long, thin beaks for nectar; and ducks have flat, straining bills. Feet match too: talons for gripping prey, webbed feet for swimming, perching feet for branches. Example: a cardinal's stout beak cracks sunflower seeds a heron's spear-like bill never could.",
          memoryWork:
            "An adaptation is a feature that fits a creature to its life. Beak shape matches food: cracking, tearing, sipping, straining.",
        },
        {
          id: "truma-science-u4-l2",
          title: "Adaptation & the Creator's Design",
          objective:
            "Explain adaptation as evidence of God's design, not of one kind turning into another.",
          teach:
            "Adaptations let birds thrive in many habitats, and within a kind God gave the ability to vary, so finches can have thicker or thinner beaks over generations. But this variation always stays within the kind: a finch remains a finch. The stunning fit between a creature and its world points to a wise Designer, not to blind chance (Psalm 104:24). We can admire the many varieties without claiming one kind became a different kind.",
          memoryWork:
            "Variation happens within a kind (a finch stays a finch). Design points to a Designer (Psalm 104:24: 'in wisdom you made them all').",
        },
        {
          id: "truma-science-u4-l3",
          title: "Migration",
          objective:
            "Define migration and explain why and how birds travel long distances.",
          teach:
            "Migration is the seasonal journey many birds make between a summer breeding home and a warmer winter home, chasing food and mild weather. Birds navigate using the sun, the stars, landmarks, and even the earth's magnetic field, abilities they did not teach themselves. Example: the Arctic tern migrates from the Arctic to Antarctica and back each year, the longest migration of any animal, tens of thousands of miles.",
          memoryWork:
            "Migration = seasonal travel for food and warmth. Birds navigate by sun, stars, landmarks, and Earth's magnetic field. Longest: the Arctic tern.",
        },
        {
          id: "truma-science-u4-l4",
          title: "Nests & Eggs",
          objective:
            "Describe how birds build nests and care for their eggs and young.",
          teach:
            "Birds build nests of twigs, grass, mud, or feathers to hold and protect their eggs. A parent keeps the eggs warm by incubating them, sitting on them until they hatch, then feeds the helpless chicks. Different birds nest differently: robins weave cup nests, woodpeckers carve holes in trees, and eagles pile huge stick nests reused for years. Example: a hummingbird's nest is the size of a walnut, bound together with spider silk.",
          memoryWork:
            "Keeping eggs warm until they hatch = incubation. Nest materials: twigs, grass, mud, feathers. A baby bird = a chick.",
        },
        {
          id: "truma-science-u4-l5",
          title: "Identifying Birds in the Field",
          objective:
            "List the clues a birder uses to identify a bird and use a field guide.",
          teach:
            "Birders identify a bird by noticing field marks: its size and shape, colors and patterns, the shape of the beak, its behavior, its song, and its habitat. A field guide organizes birds so you can match what you see to a picture and description. Example: a bright red bird with a crest and a thick orange beak at a Texas feeder is almost certainly a northern cardinal.",
          memoryWork:
            "Field marks for ID: size/shape, color/pattern, beak, behavior, song, habitat. A birder's book is a field guide.",
        },
      ],
    },
    {
      id: "truma-science-u5",
      title: "Unit 5 · The Human Body: The Cell, Bones & Muscles",
      summary:
        "The building block of life and the framework and movers of the body.",
      lessons: [
        {
          id: "truma-science-u5-l1",
          title: "Fearfully & Wonderfully Made",
          objective:
            "Explain the biblical view of the human body as God's intricate work.",
          teach:
            "Before studying its parts, we start with what the human body IS: the handiwork of God, who knit each person together in the womb (Psalm 139:13-14). The body is not an accident but a wonder, 'fearfully and wonderfully made,' and studying it should lead to worship. This truth also grounds human dignity: because people bear God's image, every body deserves honor. Example: even one cell of your body carries more coded instruction than a library.",
          memoryWork:
            "'I praise you, for I am fearfully and wonderfully made' (Psalm 139:14). The body is God's designed handiwork.",
        },
        {
          id: "truma-science-u5-l2",
          title: "The Cell: Life's Building Block",
          objective:
            "Define the cell and name its main parts and their jobs.",
          teach:
            "The cell is the smallest unit of life, and every living thing is made of one or more cells. Key parts include the cell membrane (the outer wall that lets things in and out), the nucleus (the control center holding DNA), and the cytoplasm (the jelly where work happens). Tiny organelles like mitochondria make energy for the cell. Example: your body has trillions of cells, and each one is like a busy, walled city with its own government in the nucleus.",
          memoryWork:
            "The cell = the smallest unit of life. Parts: membrane (wall), nucleus (control center, holds DNA), cytoplasm, mitochondria (energy).",
        },
        {
          id: "truma-science-u5-l3",
          title: "From Cells to the Whole Body",
          objective:
            "Explain how cells build into tissues, organs, and organ systems.",
          teach:
            "The body is organized in levels: cells group into tissues, tissues form organs, and organs work together as organ systems. For example, muscle cells form muscle tissue, muscle tissue helps form the heart (an organ), and the heart works with vessels as the circulatory system. This ordered layering is like well-designed architecture. Example: cell to tissue to organ to system to the whole living person.",
          memoryWork:
            "Levels of organization: cells → tissues → organs → organ systems → organism.",
        },
        {
          id: "truma-science-u5-l4",
          title: "The Skeletal System",
          objective:
            "Describe the jobs of the skeleton and name key bones.",
          teach:
            "The skeletal system is the body's frame of about 206 bones in an adult. Bones give the body shape and support, protect soft organs (the skull guards the brain, the ribs guard the heart and lungs), let us move where muscles pull, and make blood cells in their soft marrow. Bones meet at joints, held by tough ligaments. Example: your femur, the thigh bone, is the longest and strongest bone in your body.",
          memoryWork:
            "The adult skeleton has about 206 bones. Jobs: support, protect, allow movement, make blood cells. Bones meet at joints; ligaments hold them.",
        },
        {
          id: "truma-science-u5-l5",
          title: "The Muscular System",
          objective:
            "Describe the three kinds of muscle and how muscles move the body.",
          teach:
            "Muscles are the body's movers, and there are three kinds: skeletal muscle that you control to move bones, smooth muscle that works automatically in organs like the stomach, and cardiac muscle found only in the heart. Skeletal muscles attach to bones by tendons and work in pairs, one pulling as the other relaxes, because muscles can only pull, never push. Example: to bend your arm the biceps contracts while the triceps relaxes; to straighten it, they swap.",
          memoryWork:
            "Three muscle types: skeletal (voluntary), smooth (involuntary organs), cardiac (heart only). Muscles attach by tendons and only PULL.",
        },
      ],
    },
    {
      id: "truma-science-u6",
      title: "Unit 6 · The Body's Transport & Fuel Systems",
      summary:
        "The circulatory, respiratory, and digestive systems keep the body supplied.",
      lessons: [
        {
          id: "truma-science-u6-l1",
          title: "The Circulatory System: The Heart",
          objective:
            "Describe the heart and how it pumps blood through the body.",
          teach:
            "The circulatory system carries blood everywhere, and its pump is the heart, a muscle about the size of your fist. The heart has four chambers: two upper atria that receive blood and two lower ventricles that push it out. It beats about 100,000 times a day without rest, sending blood to the lungs for oxygen and then out to the whole body. Example: press two fingers to your wrist and you can feel each heartbeat as a pulse.",
          memoryWork:
            "The heart has four chambers: two atria (top, receive) and two ventricles (bottom, pump). It beats about 100,000 times a day.",
        },
        {
          id: "truma-science-u6-l2",
          title: "Blood & Blood Vessels",
          objective:
            "Name the parts of blood and the three kinds of blood vessels.",
          teach:
            "Blood is a living fluid with red cells that carry oxygen, white cells that fight germs, platelets that clot cuts, and plasma, the liquid that carries them. It travels in three vessel types: arteries carry blood away from the heart, veins return it to the heart, and tiny capillaries connect them and let oxygen pass into cells. Example: a scrape heals because platelets rush in and form a clot, then a scab.",
          memoryWork:
            "Blood = red cells (oxygen), white cells (fight germs), platelets (clot), plasma (liquid). Vessels: arteries (away), veins (back), capillaries (tiny).",
        },
        {
          id: "truma-science-u6-l3",
          title: "The Respiratory System",
          objective:
            "Explain how the lungs take in oxygen and remove carbon dioxide.",
          teach:
            "The respiratory system brings in the oxygen every cell needs and removes the waste gas carbon dioxide. Air travels down the trachea (windpipe) into the two lungs, branching into smaller tubes that end in tiny air sacs called alveoli, where oxygen passes into the blood. The diaphragm, a dome-shaped muscle below the lungs, pulls down to draw air in and relaxes to push it out. Example: blow on a cold window and the fog is the water vapor your lungs breathe out.",
          memoryWork:
            "Air path: trachea → lungs → alveoli (tiny air sacs, gas exchange). The breathing muscle is the diaphragm. Waste gas = carbon dioxide.",
        },
        {
          id: "truma-science-u6-l4",
          title: "The Digestive System",
          objective:
            "Trace the path of food and explain how the body breaks it down.",
          teach:
            "The digestive system turns food into fuel the body can use. Food travels a long path: mouth (chewing and saliva start digestion), down the esophagus to the stomach (acid and churning break it into mush), then the small intestine, where nutrients pass into the blood, and finally the large intestine, which absorbs water before waste leaves. The liver and pancreas add juices that help break food down. Example: chew a cracker for a minute and it turns sweet, because saliva is already breaking starch into sugar.",
          memoryWork:
            "Food path: mouth → esophagus → stomach → small intestine (nutrients absorbed) → large intestine (water absorbed). Helpers: liver, pancreas.",
        },
      ],
    },
    {
      id: "truma-science-u7",
      title: "Unit 7 · Control, Defense & Health",
      summary:
        "The nervous and immune systems, and how to steward the body well.",
      lessons: [
        {
          id: "truma-science-u7-l1",
          title: "The Nervous System",
          objective:
            "Describe the brain, spinal cord, and nerves and how they control the body.",
          teach:
            "The nervous system is the body's control and message network. Its center is the brain, protected by the skull, which thinks, remembers, and directs everything. The spinal cord runs down the backbone and carries messages between the brain and the body along nerves, which fire faster than any wire. Example: touch something hot and a reflex yanks your hand back before you even 'decide,' because the spinal cord answers instantly.",
          memoryWork:
            "Nervous system: brain (control center) + spinal cord + nerves. It carries messages as fast signals. A quick automatic response = a reflex.",
        },
        {
          id: "truma-science-u7-l2",
          title: "The Senses",
          objective:
            "Name the five senses and the organs that carry them to the brain.",
          teach:
            "The senses are how the nervous system learns about the world: sight (eyes), hearing (ears), smell (nose), taste (tongue), and touch (skin). Each sense organ gathers a signal and sends it along nerves to the brain, which interprets it. The eye alone has over a hundred million light-sensing cells, an instrument no camera fully matches. Example: your ears not only hear but also help you keep your balance.",
          memoryWork:
            "Five senses and organs: sight (eyes), hearing (ears), smell (nose), taste (tongue), touch (skin). Each sends signals to the brain.",
        },
        {
          id: "truma-science-u7-l3",
          title: "The Immune System",
          objective:
            "Explain how the body defends itself against germs and disease.",
          teach:
            "The immune system is the body's defense army against germs like bacteria and viruses. The skin is the first wall; if germs get past it, white blood cells hunt them down, and the body makes antibodies, special proteins that recognize and mark a specific invader so the body can beat it faster next time. This memory is why a vaccine, a safe practice dose, can train the body ahead of time. Example: after chickenpox, most people never catch it again because the immune system remembers.",
          memoryWork:
            "Immune system = the body's defense. Skin is the first barrier; white blood cells attack; antibodies mark invaders and remember them.",
        },
        {
          id: "truma-science-u7-l4",
          title: "Health: Stewarding the Body",
          objective:
            "List habits that keep the body healthy and explain why care of the body honors God.",
          teach:
            "Good health comes from steady habits: nourishing food, clean water, exercise, enough sleep, cleanliness, and rest. Scripture teaches that a believer's body is a temple of the Holy Spirit, so caring for it is a way of honoring God, not vanity (1 Corinthians 6:19-20). We steward the body as a gift, neither worshiping it nor neglecting it. Example: sleep is when the body repairs itself and locks in memory, which is why rest is not lazy but wise.",
          memoryWork:
            "Health habits: good food, water, exercise, sleep, cleanliness, rest. 'Your body is a temple of the Holy Spirit' (1 Corinthians 6:19).",
        },
      ],
    },
  ],
};
