import type { Course } from "./types";

// Titus, Fishing (grammar stage, 3rd grade, age 8). His favorite thing in the world,
// taught by Buck the hunter-fisherman. Real skills a young angler learns: gear, knots,
// casting, bait, knowing his fish, reading the water, landing and cleaning a catch, and
// caring for God's creation (licenses, limits, catch-and-release, gratitude). These are
// AI-conductor lessons (no fixed quiz), so Buck teaches each one live, and when the
// authored course is finished the tutor keeps generating fresh fishing lessons, so Titus
// never runs out. Wonder runs all through it: God made the waters teem with life
// (Gen. 1:20), and a patient angler learns to see it.

export const TITUS_FISHING: Course = {
  kidId: "titus",
  subject: "fishing",
  subjectLabel: "Fishing",
  emoji: "🎣",
  gradeLabel: "3rd Grade",
  stage: "grammar",
  overview:
    "Titus's favorite thing, taught for real by Buck. He learns his gear and his knots, how to cast, what bait to use, how to tell a bass from a bluegill, how to read the water and find fish, how to land and clean a catch, and how to care for God's creation with licenses, limits, and catch-and-release. When the course is done, Buck keeps making new fishing lessons, so there is always more water to explore.",
  units: [
    {
      id: "titus-fishing-u1",
      title: "Unit 1 · Gear and Getting Started",
      summary: "Rod, reel, line, hook, and how it all works together.",
      lessons: [
        { id: "titus-fishing-u1-l1", title: "The Parts of a Rod and Reel", objective: "Name the main parts of a rod and reel.", teach: "A fishing setup has a rod (the long pole), a reel (the wheel that holds and winds the line), the line, and at the end a hook. Line runs from the reel up through the little guides along the rod and out the tip. Knowing the parts is the first step to using them well.", memoryWork: "Rod, reel, line, hook." },
        { id: "titus-fishing-u1-l2", title: "Kinds of Rods and Reels", objective: "Tell a spincast, spinning, and baitcast reel apart at a basic level.", teach: "A spincast reel has a push button and is the easiest to learn, great for a young angler. A spinning reel is open-faced and casts light bait far. A baitcaster is powerful but takes practice. Start with the push-button spincast and grow into the rest.", memoryWork: "Start with the push-button spincast reel." },
        { id: "titus-fishing-u1-l3", title: "Setting Up Your Line", objective: "Understand how line runs from reel to rod tip.", teach: "Open the bail or hold the button, then thread the line off the spool, up through each guide from the reel to the very tip, so it runs smooth with no skips. A line that skips a guide will not cast right. Take your time and check every guide.", memoryWork: "Thread the line through every guide, reel to tip." },
        { id: "titus-fishing-u1-l4", title: "A Simple Tackle Box", objective: "List the basic tackle a beginner carries.", teach: "A young angler's box holds hooks, some sinkers (little weights), a few bobbers (floats), some soft plastic worms or a can of live bait, needle-nose pliers, and line clippers. Simple and tidy beats big and messy. Take care of your gear and it takes care of you.", memoryWork: "Hooks, sinkers, bobbers, bait, pliers, clippers." },
      ],
    },
    {
      id: "titus-fishing-u2",
      title: "Unit 2 · Knots and Rigging",
      summary: "Tie on a hook, add a bobber and a sinker.",
      lessons: [
        { id: "titus-fishing-u2-l1", title: "The Improved Clinch Knot", objective: "Learn the steps of the improved clinch knot to tie on a hook.", teach: "The improved clinch is the go-to knot for tying line to a hook: pass the line through the eye, wrap it around itself five or six times, then back through the little loop by the eye and through the big loop, wet it, and pull tight. Wetting the knot keeps it from burning weak. A good knot is the difference between landing the fish and telling a sad story.", memoryWork: "Through the eye, wrap 5-6, back through, wet, and cinch." },
        { id: "titus-fishing-u2-l2", title: "The Palomar Knot", objective: "Learn the palomar knot as a strong, simple option.", teach: "The palomar is strong and simple: double the line into a loop, pass it through the hook eye, tie a loose overhand knot, pass the loop over the hook, wet it, and pull tight. Many anglers trust it above all others. Learn two knots well and you are set for most days.", memoryWork: "Double, through, overhand, over the hook, wet, tight." },
        { id: "titus-fishing-u2-l3", title: "Adding a Bobber", objective: "Understand what a bobber does and where to place it.", teach: "A bobber is a float that keeps your bait at a set depth and tells you when a fish bites, it dips or goes under. Clip it on the line above your hook, closer for shallow water, farther for deep. When that bobber goes down, you set the hook!", memoryWork: "Bobber up top; when it dips, a fish is on." },
        { id: "titus-fishing-u2-l4", title: "Adding a Sinker", objective: "Know why and how to add a small sinker.", teach: "A sinker is a small weight that helps your bait cast farther and sink to where the fish are. Pinch a little split-shot onto the line a few inches above the hook. Use just enough weight to do the job, not so much it drags. Small and simple wins.", memoryWork: "A little weight, a few inches above the hook." },
      ],
    },
    {
      id: "titus-fishing-u3",
      title: "Unit 3 · Casting",
      summary: "Cast safely and accurately, then reel in.",
      lessons: [
        { id: "titus-fishing-u3-l1", title: "Look Before You Cast", objective: "Always check behind and around before casting.", teach: "Before every cast, look behind you and to the sides, a hook on a fast line can hurt a person badly. Make sure no one is close, then cast. Buck's rule: eyes before the line, every single time. Safety is how we love the people fishing with us.", memoryWork: "Look behind you before every cast." },
        { id: "titus-fishing-u3-l2", title: "The Overhead Cast", objective: "Perform a basic overhead cast.", teach: "Point the rod at your target, bring it back to about one o'clock over your shoulder, then sweep it forward and release (or let off the button) around ten o'clock. Let the weight of the bait load the rod and do the work. Smooth beats hard, every time.", memoryWork: "Back to one o'clock, forward to ten, release." },
        { id: "titus-fishing-u3-l3", title: "The Sidearm Cast", objective: "Use a sidearm cast under low cover.", teach: "When there are branches overhead, cast sidearm: keep the rod low and swing it out to the side, level with the water, to slide your bait under the cover. It takes practice to aim. Fish love to hide under low branches, so this cast catches them.", memoryWork: "Low and level to reach under the branches." },
        { id: "titus-fishing-u3-l4", title: "Reeling In", objective: "Reel in smoothly and keep the line tight.", teach: "Turn the reel handle at a steady pace and keep a little tension so the line stays tight, a loose line lets fish shake free. Vary your speed sometimes to make a lure look alive. Patience on the reel lands more fish than a fast, jerky retrieve.", memoryWork: "Steady reel, tight line." },
      ],
    },
    {
      id: "titus-fishing-u4",
      title: "Unit 4 · Bait and Lures",
      summary: "Live bait, artificial lures, and matching them to fish.",
      lessons: [
        { id: "titus-fishing-u4-l1", title: "Live Bait", objective: "Know common live baits and how to hook them.", teach: "Worms, minnows, and crickets are classic live baits, and fish love them because they are the real thing. Hook a worm so it still wiggles, and a minnow through the lips or back so it swims. Live bait is a great way for a young angler to catch a first fish.", memoryWork: "Worms, minnows, crickets: the real thing." },
        { id: "titus-fishing-u4-l2", title: "Soft Plastics and Lures", objective: "Understand artificial lures and why they work.", teach: "Artificial lures, like soft plastic worms, spinners, and crankbaits, trick a fish by looking or moving like food. They let you cover water fast and reuse them all day. Learning to make a lure 'swim' like something alive is a real skill.", memoryWork: "A lure fools the fish by acting alive." },
        { id: "titus-fishing-u4-l3", title: "Match the Bait to the Fish", objective: "Choose bait based on what the fish eats.", teach: "Big bass want a big meal like a plastic worm or a minnow; little bluegill want a small bit of worm on a small hook. 'Match the hatch' means offer what the fish are already eating that day. Watch the water and think like the fish.", memoryWork: "Big fish, big bait; little fish, little bait." },
        { id: "titus-fishing-u4-l4", title: "Keep It Fresh and Simple", objective: "Care for bait and start with one good setup.", teach: "Keep live bait cool and lively, a dead worm catches less. When you are learning, do not overthink it: a worm under a bobber catches more fish than a tackle box full of fancy lures you cannot use yet. Master the simple thing first.", memoryWork: "A worm under a bobber catches plenty." },
      ],
    },
    {
      id: "titus-fishing-u5",
      title: "Unit 5 · Know Your Fish",
      summary: "Identify the fish of Texas waters.",
      lessons: [
        { id: "titus-fishing-u5-l1", title: "Largemouth Bass", objective: "Identify a largemouth bass and how it behaves.", teach: "The largemouth bass is Texas's favorite gamefish: greenish, with a mouth that opens past its eye and a dark stripe down the side. Bass are ambush hunters that hide near cover and strike hard. Hook one and you will feel why anglers chase them.", memoryWork: "Big mouth past the eye, dark side stripe: largemouth bass." },
        { id: "titus-fishing-u5-l2", title: "Bluegill and Sunfish", objective: "Identify bluegill and other sunfish.", teach: "Bluegill are small, round, colorful panfish with a dark spot near the gill, and they are perfect for a young angler because they bite eagerly. A tiny hook, a bit of worm, and a bobber will keep you busy all afternoon. Everybody starts with sunfish, and they are a joy.", memoryWork: "Small, round, colorful, dark gill spot: bluegill." },
        { id: "titus-fishing-u5-l3", title: "Catfish", objective: "Identify catfish and how to fish for them.", teach: "Catfish have smooth skin, no scales, and whisker-like barbels they use to smell food along the bottom. They love stinky bait and bite best at dusk and night. Watch their sharp fin spines when you handle them, a catfish demands respect.", memoryWork: "Whiskers, no scales, bottom feeder: catfish." },
        { id: "titus-fishing-u5-l4", title: "Crappie and Others", objective: "Identify crappie and name other common catches.", teach: "Crappie are silvery, speckled panfish that school up around brush and bite small jigs and minnows, and they are wonderful to eat. You may also meet perch, carp, and gar. Learning your fish helps you fish smarter and thank God for the variety He made.", memoryWork: "Silvery and speckled, schools by the brush: crappie." },
      ],
    },
    {
      id: "titus-fishing-u6",
      title: "Unit 6 · Reading the Water",
      summary: "Find where the fish are hiding.",
      lessons: [
        { id: "titus-fishing-u6-l1", title: "Fish Love Cover", objective: "Look for structure and cover where fish hide.", teach: "Fish hang near 'structure' and 'cover': fallen logs, weed beds, docks, rocks, and drop-offs, because these give them shade, safety, and food. Open, empty water usually holds fewer fish. Cast near the cover, not the middle of nowhere.", memoryWork: "Fish the cover: logs, weeds, docks, rocks." },
        { id: "titus-fishing-u6-l2", title: "Best Times to Fish", objective: "Know why dawn and dusk are prime times.", teach: "Fish feed most heavily at dawn and dusk when the light is low and the water is cool, so early and late are prime times. Midday sun pushes fish deep and into the shade. The patient early-riser catches the fish.", memoryWork: "Dawn and dusk are the best bite." },
        { id: "titus-fishing-u6-l3", title: "Weather and Water", objective: "Understand how weather changes the bite.", teach: "A gentle overcast or a light breeze rippling the surface often makes fish bold, while bright, dead-calm days make them shy. A cold front can shut the bite down for a day. Learning to read the sky is part of learning to read the water.", memoryWork: "Clouds and a little wind: often a good bite." },
        { id: "titus-fishing-u6-l4", title: "Still Water vs. Moving Water", objective: "Fish a pond differently than a river.", teach: "In a still pond, fish gather near cover and edges. In a moving river or creek, fish face upstream and wait behind rocks and bends where the current slows and carries food to them. Cast upstream and let your bait drift down to them naturally.", memoryWork: "In current, fish face upstream behind the rocks." },
      ],
    },
    {
      id: "titus-fishing-u7",
      title: "Unit 7 · The Catch",
      summary: "Set the hook, land the fish, and handle it well.",
      lessons: [
        { id: "titus-fishing-u7-l1", title: "Setting the Hook", objective: "Set the hook at the right moment.", teach: "When you feel a solid tug or see the bobber go under, sweep the rod up firmly (not wildly) to drive the hook home. Too soon and you pull it away; too late and the fish spits it. Feeling that right moment comes with practice and patience.", memoryWork: "Feel the tug, sweep the rod up." },
        { id: "titus-fishing-u7-l2", title: "Fighting and Landing", objective: "Play a fish and bring it in without breaking off.", teach: "Keep the rod tip up and the line tight, and let a big fish run against the reel's drag instead of horsing it in. Tire it out, then guide it to the bank or a net. A steady hand lands the fish a rushed one loses.", memoryWork: "Rod tip up, let it run, then bring it in." },
        { id: "titus-fishing-u7-l3", title: "Handle a Fish Gently", objective: "Handle a fish with wet hands and care.", teach: "Wet your hands before touching a fish so you do not rub off the slime coat that protects it. Support its belly, hold it firmly but gently, and keep it out of the water only a short time. Gentle hands honor the creature God made.", memoryWork: "Wet hands, support the belly, be quick and gentle." },
        { id: "titus-fishing-u7-l4", title: "Removing the Hook", objective: "Remove a hook safely with pliers.", teach: "Use needle-nose pliers to back the hook out the way it went in. If it is deep or you plan to release the fish, a barbless or pinched-barb hook comes out easier and hurts the fish less. Take care of your fingers and the fish both.", memoryWork: "Pliers back it out the way it went in." },
      ],
    },
    {
      id: "titus-fishing-u8",
      title: "Unit 8 · Stewardship and the Table",
      summary: "Licenses, limits, catch-and-release, and cooking your catch.",
      lessons: [
        { id: "titus-fishing-u8-l1", title: "Licenses and Limits", objective: "Understand fishing rules as good stewardship.", teach: "Grown-ups need a fishing license, and everyone must obey size and bag limits that say how many and how big you may keep. These rules protect the fish so there are plenty for years to come. Obeying them honors God and the folks in charge (Rom. 13:1).", memoryWork: "Obey the license and the limits; it protects the fish." },
        { id: "titus-fishing-u8-l2", title: "Catch and Release", objective: "Release a fish so it survives.", teach: "If you are not keeping a fish, release it well: keep it wet, remove the hook quickly, and hold it in the water facing the current until it swims off strong. A fish handled gently lives to be caught again. Good stewards take only what they need.", memoryWork: "Keep it wet, revive it, let it swim off strong." },
        { id: "titus-fishing-u8-l3", title: "Cleaning Your Catch", objective: "Know the basics of cleaning a fish with an adult.", teach: "To keep a fish, put it on ice right away to stay fresh, then clean it with an adult using a sharp fillet knife, cutting away from yourself. It is a real skill that takes showing, not just telling. Waste none of what you take.", memoryWork: "On ice, then clean with an adult, cutting away from you." },
        { id: "titus-fishing-u8-l4", title: "Give Thanks and Cook It", objective: "Cook the catch and thank God for provision.", teach: "A fresh fish, rolled in a little cornmeal and fried, or baked with butter, is a feast you helped provide. Before you eat, give thanks: the God who filled the waters with life (Gen. 1:20) fed your family through your patience today. That is a good day's work.", memoryWork: "Thank God who filled the waters, then enjoy the feast." },
      ],
    },
  ],
};
