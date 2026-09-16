import type { Course } from "./types";

// Mercy, Kindergarten Science (grammar stage). "The world God made": a first walk
// through creation for a five-year-old. Concrete, delight-filled, and simple (short
// sentences, one big idea per lesson) to match her age and uiSize "large". Princess
// Rose frames it with garden and flower warmth. Confessional Reformed Baptist: every
// living thing was made by God and shows His care (Genesis 1; Psalm 104; Matthew 6:26).
//
// Skill scaffolding (the ordered topics + mastery evidence) is adapted from the Marble
// open skill taxonomy, Kindergarten Science domains, used as a coverage map only. The
// taxonomy's Common Core / NGSS alignment file is NOT used, and all teaching content is
// authored fresh in the family's confessional idiom.
// Source: github.com/withmarbleapp/os-taxonomy (ODbL 1.0 / CC BY-SA 4.0).

export const MERCY_SCIENCE: Course = {
  kidId: "mercy",
  subject: "science",
  subjectLabel: "Science",
  emoji: "🌿",
  gradeLabel: "Kindergarten",
  stage: "grammar",
  overview:
    "A first walk through the world God made. Mercy learns to tell living things from non-living, names common animals and what they need, and discovers plants, bugs, and where creatures live, from the ocean to the rainforest to the cold poles. She meets the weather and the four seasons, and learns that everyday things are made of materials like wood, metal, and glass. The goal is simple wonder: God made it all, He made it good, and He takes care of every living thing (Psalm 104).",
  units: [
    {
      id: "mercy-science-u1",
      title: "Unit 1 · Living Things God Made",
      summary: "Living or not, naming animals, what living things need, and where they live.",
      lessons: [
        { id: "mercy-science-u1-l1", title: "Living or Not Living", objective: "Tell a living thing from a non-living thing.", teach: "Some things are alive, and some things are not. Living things grow, eat, and need water, like a puppy, a flower, and you! A rock and a toy are not living. God made all the living things and gives them life.", memoryWork: "Living things grow, eat, and need water. God gives them life." },
        { id: "mercy-science-u1-l2", title: "Naming God's Animals", objective: "Name common animals and where they belong.", teach: "God made so many animals! A dog barks, a cow says moo, a bird sings, a fish swims. Farm animals like cows and pigs live on a farm. Pets like cats and dogs live with us. God made each one special.", memoryWork: "God made every animal, from the tiny bee to the tall giraffe." },
        { id: "mercy-science-u1-l3", title: "What Living Things Need", objective: "Say the things living things need to stay alive.", teach: "Every living thing needs food, water, air, and a home. A bunny needs grass to eat, water to drink, air to breathe, and a burrow to sleep in. You need those things too! God gives His creatures what they need.", memoryWork: "Living things need food, water, air, and a home." },
        { id: "mercy-science-u1-l4", title: "Animal Homes", objective: "Match an animal to the home God gave it.", teach: "God gave each animal just the right home. A bird lives in a nest, a bee lives in a hive, a fish lives in the water, and a bear sleeps in a den. The place an animal lives is called its habitat.", memoryWork: "The place an animal lives is its home, or habitat." },
        { id: "mercy-science-u1-l5", title: "What Animals Eat", objective: "Sort animals by what they eat: plants, meat, or both.", teach: "Animals eat different things. A rabbit eats only plants. A lion eats meat. A bear eats both plants and meat! God feeds every animal, big and small.", memoryWork: "Some animals eat plants, some eat meat, and some eat both." },
      ],
    },
    {
      id: "mercy-science-u2",
      title: "Unit 2 · Plants & Little Creatures",
      summary: "Plants and trees, the parts of a plant, what plants need, and minibeasts.",
      lessons: [
        { id: "mercy-science-u2-l1", title: "Plants and Trees", objective: "Name common plants and trees.", teach: "God made plants and trees all around us. Grass is a plant, and so is a flower like a rose. A tree is a big, tall plant with a wooden trunk. Some trees give us apples and some give us shade.", memoryWork: "Grass, flowers, and trees are all plants God made." },
        { id: "mercy-science-u2-l2", title: "The Parts of a Plant", objective: "Name the roots, stem, leaves, and flower.", teach: "A plant has parts, and each one has a job. The roots drink water from the dirt, the stem holds the plant up, the leaves catch the sunshine, and the flower is the pretty bloom. Just like a rose in a garden!", memoryWork: "Roots, stem, leaves, and flower are the parts of a plant." },
        { id: "mercy-science-u2-l3", title: "What Plants Need to Grow", objective: "Say what a plant needs to grow.", teach: "Plants are living, so they need things to grow: sunlight, water, and soil (dirt). If you plant a seed and give it sun and water, God makes it grow into a plant. A garden shows us His good care.", memoryWork: "Plants need sun, water, and soil to grow." },
        { id: "mercy-science-u2-l4", title: "Minibeasts (Little Bugs)", objective: "Name common minibeasts like bugs and worms.", teach: "Minibeasts are the little creatures like bugs, worms, and snails. A ladybug has spots, an ant is very tiny, a spider spins a web, and a worm wiggles in the dirt. Even the smallest bug was made by God.", memoryWork: "Minibeasts are little creatures like bugs, worms, and snails." },
        { id: "mercy-science-u2-l5", title: "Where Minibeasts Live", objective: "Say where little bugs like to live.", teach: "Little minibeasts have homes too. Worms live under the ground, spiders live in webs, and ants live in an anthill with lots of friends. Look under a rock or a leaf, and you may find one!", memoryWork: "Bugs live under rocks, under the ground, and in webs." },
      ],
    },
    {
      id: "mercy-science-u3",
      title: "Unit 3 · Creatures All Over the World",
      summary: "Animals everywhere: the ocean, the rainforest, the cold poles, and simple food chains.",
      lessons: [
        { id: "mercy-science-u3-l1", title: "Animals Everywhere", objective: "Know that animals live in many different places.", teach: "God put animals all over the world! Some live where it is hot, some where it is cold, some in the water, and some in the trees. He made each animal to fit right where it lives.", memoryWork: "God made animals to live all over the world." },
        { id: "mercy-science-u3-l2", title: "The Ocean", objective: "Name animals that live in the ocean.", teach: "The ocean is a huge, deep sea of salty water. Fish, whales, dolphins, crabs, and starfish all live there. A whale is the biggest animal of all, and God made it to swim in the deep water!", memoryWork: "Fish, whales, and crabs live in the salty ocean." },
        { id: "mercy-science-u3-l3", title: "The Rainforest", objective: "Know the rainforest is warm and rainy with many animals.", teach: "A rainforest is a warm, wet forest with tall trees and lots of rain. Colorful birds, monkeys, frogs, and butterflies live there. So many kinds of animals live in the rainforest, all made by God.", memoryWork: "The rainforest is warm and rainy, full of monkeys and colorful birds." },
        { id: "mercy-science-u3-l4", title: "The Cold Poles", objective: "Know the poles are icy cold with special animals.", teach: "The very top and bottom of the world are the poles, and they are icy and cold. Polar bears, penguins, and seals live there. God gave them thick fur and feathers to keep warm in the snow.", memoryWork: "The poles are icy cold. Polar bears and penguins live there." },
        { id: "mercy-science-u3-l5", title: "A Simple Food Chain", objective: "Follow a simple who-eats-what food chain.", teach: "A food chain shows who eats what. The sun helps the grass grow, a bunny eats the grass, and a fox eats the bunny. It always starts with the sun and plants. God feeds them all.", memoryWork: "A food chain: sun, then plant, then plant-eater, then meat-eater." },
      ],
    },
    {
      id: "mercy-science-u4",
      title: "Unit 4 · Weather, Seasons & Materials",
      summary: "Kinds of weather, the four seasons, and what everyday things are made of.",
      lessons: [
        { id: "mercy-science-u4-l1", title: "Kinds of Weather", objective: "Name kinds of weather: sunny, rainy, windy, snowy.", teach: "Weather is what it is like outside. It can be sunny and warm, rainy and wet, windy and blowy, or snowy and cold. God sends the sunshine and the rain to help the world grow.", memoryWork: "Weather can be sunny, rainy, windy, or snowy." },
        { id: "mercy-science-u4-l2", title: "The Four Seasons", objective: "Name the four seasons and one thing about each.", teach: "God made four seasons that come every year. In spring, flowers bloom. In summer, it is hot and sunny. In fall, leaves turn orange and drop. In winter, it is cold and it may snow. Then spring comes again!", memoryWork: "The four seasons are spring, summer, fall, and winter." },
        { id: "mercy-science-u4-l3", title: "Everyday Materials", objective: "Name what everyday things are made of.", teach: "Things are made of materials. A chair can be made of wood, a spoon of metal, a window of glass, and a toy of plastic. God gave us wood, rock, and more to make good and useful things.", memoryWork: "Wood, metal, glass, and plastic are materials things are made of." },
        { id: "mercy-science-u4-l4", title: "Hard, Soft, Rough, Smooth", objective: "Describe materials by how they feel.", teach: "We can describe materials by how they feel. A rock is hard, a pillow is soft, sandpaper is rough, and glass is smooth. Touching and describing helps us learn about the things God made.", memoryWork: "Materials can be hard or soft, rough or smooth." },
        { id: "mercy-science-u4-l5", title: "Solid, Liquid: Ice and Water", objective: "Tell a solid from a liquid using ice and water.", teach: "A solid keeps its shape, like a block of ice or a rock. A liquid can pour and take the shape of its cup, like water or juice. When ice gets warm it melts into water. God made water that can be both!", memoryWork: "A solid keeps its shape; a liquid can pour. Ice melts into water." },
      ],
    },
  ],
};
