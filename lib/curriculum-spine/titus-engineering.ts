import type { Course } from "./types";

// Titus, Build It (grammar stage, 3rd grade, age 8). For a boy who is full of ideas
// but stalls on turning them into real things. Buck the hunter-builder teaches the
// engineering design loop (Ask, Imagine, Plan, Build, Test, Improve), how to sketch
// and plan, tools and safe building, testing and iterating, simple machines, and a
// set of real projects (ending with designing his own fishing lure and a build of
// his own). The backbone is the vision-to-reality bridge: break a big idea into small
// steps and finish what you start. Maker theology runs through it, God is the great
// Creator, and we build as those made in His image, with diligence and care.

export const TITUS_ENGINEERING: Course = {
  kidId: "titus",
  subject: "engineering",
  subjectLabel: "Build It",
  emoji: "🛠️",
  gradeLabel: "3rd Grade",
  stage: "grammar",
  overview:
    "For the boy with a hundred ideas and a workshop in his head. Buck teaches Titus how to actually build the things he dreams up: the engineer's design loop, how to sketch and plan an idea, how to use tools and join parts so they hold, how to test and improve instead of quitting, how simple machines work, and how to carry a real project all the way to done. The heart of it is turning a vision into a finished thing, one small step at a time, the way our Maker made us to build.",
  units: [
    {
      id: "titus-engineering-u1",
      title: "Unit 1 · The Engineer's Way",
      summary: "What an engineer does and the design loop that turns ideas into things.",
      lessons: [
        { id: "titus-engineering-u1-l1", title: "What Is an Engineer?", objective: "Understand that an engineer solves problems and builds things.", teach: "An engineer is a builder and a problem-solver: someone who looks at a need and makes something to meet it. If you have ever dreamed up a fort, a trap, or a gadget, you are already thinking like one. God made you an ideas person, and this course teaches you to build those ideas for real.", memoryWork: "An engineer solves problems by building." },
        { id: "titus-engineering-u1-l2", title: "The Design Loop", objective: "Learn the six steps: Ask, Imagine, Plan, Build, Test, Improve.", teach: "Every real builder follows a loop: ASK what the problem is, IMAGINE lots of ideas, PLAN one out, BUILD it, TEST it, then IMPROVE it and go around again. This loop is the secret that turns a head full of ideas into things you can hold. We will practice every step.", memoryWork: "Ask, Imagine, Plan, Build, Test, Improve." },
        { id: "titus-engineering-u1-l3", title: "Ask: Name the Problem", objective: "Start a project by clearly naming what you want to make or fix.", teach: "Before you build, say out loud exactly what you are trying to make or fix: 'I want a way to carry my fishing gear with one hand.' Naming the problem clearly is half of solving it. A fuzzy idea builds a fuzzy thing.", memoryWork: "Say the problem clearly before you build." },
        { id: "titus-engineering-u1-l4", title: "Imagine: Many Ideas", objective: "Brainstorm several ideas before choosing one.", teach: "Now let your ideas run wild: think of five or six different ways to solve it, even silly ones, before you pick. Do not judge them yet, just get them out. The best idea usually shows up only after a few not-so-great ones.", memoryWork: "Think of many ideas before you pick one." },
      ],
    },
    {
      id: "titus-engineering-u2",
      title: "Unit 2 · From Idea to Sketch",
      summary: "Get the idea out of your head and onto paper.",
      lessons: [
        { id: "titus-engineering-u2-l1", title: "Draw Your Idea", objective: "Sketch an idea so you can see it outside your head.", teach: "An idea living only in your head is slippery. Draw it, even a rough sketch, and suddenly it is real enough to work on. Engineers sketch first, every time. Your drawing does not have to be pretty, it just has to show the plan.", memoryWork: "A sketch turns an idea into a plan you can see." },
        { id: "titus-engineering-u2-l2", title: "Label the Parts", objective: "Name each part of your design and what it does.", teach: "On your sketch, label each part and what it does: 'this is the handle,' 'this hook holds the line.' Labeling forces you to think through whether every part has a job. If a part has no job, you probably do not need it.", memoryWork: "Label each part and its job." },
        { id: "titus-engineering-u2-l3", title: "What Will You Need?", objective: "List the materials before starting to build.", teach: "Before you build, write a list of everything you will need: cardboard, tape, string, a bottle cap. Gathering your materials first means you do not stop halfway to hunt for something. A good builder sets out his tools before he starts.", memoryWork: "List and gather materials before you build." },
        { id: "titus-engineering-u2-l4", title: "How Big? Measure It", objective: "Use measurement to size the parts of a design.", teach: "Ask how big each part should be, and measure so the parts will fit together. A ruler or a tape measure keeps your build from ending up too big, too small, or crooked. Numbers make your idea buildable.", memoryWork: "Measure so the parts fit together." },
      ],
    },
    {
      id: "titus-engineering-u3",
      title: "Unit 3 · Make a Plan",
      summary: "Break a big idea into small steps, and finish what you start.",
      lessons: [
        { id: "titus-engineering-u3-l1", title: "Break It Into Steps", objective: "Split a big build into a list of small, doable steps.", teach: "A big project feels impossible until you chop it into small steps. 'Build a birdhouse' becomes: cut the walls, glue the walls, add the roof, cut the door, paint it. Each little step is easy. The whole thing gets built one small step at a time.", memoryWork: "A big build is just many small steps." },
        { id: "titus-engineering-u3-l2", title: "First Things First", objective: "Put the steps in the right order.", teach: "Order matters: you cannot paint the walls before you build them, or add a roof before there are walls to hold it. Number your steps so each one is ready for the next. Getting the order right saves you from doing things twice.", memoryWork: "Do the steps in the right order." },
        { id: "titus-engineering-u3-l3", title: "One Step at a Time", objective: "Beat overwhelm by focusing only on the next step.", teach: "When a project feels too big and you want to quit, stop looking at the whole mountain and just do the very next step. Then the next. This is how every big thing that has ever been built got built. You do not have to see the whole path, just the next stone.", memoryWork: "Do not quit. Just do the next step." },
        { id: "titus-engineering-u3-l4", title: "Finish What You Start", objective: "Value diligence and the joy of a completed project.", teach: "Lots of people start; builders finish. Pushing through the boring middle of a project to a finished thing is a skill worth more than talent. 'The hand of the diligent will rule' (Prov. 12:24), and there is real joy in holding something you saw all the way through.", memoryWork: "'The hand of the diligent will rule' (Prov. 12:24). Finishers win." },
      ],
    },
    {
      id: "titus-engineering-u4",
      title: "Unit 4 · Tools and Building",
      summary: "Use tools well and safely, and make things sturdy.",
      lessons: [
        { id: "titus-engineering-u4-l1", title: "Know Your Tools", objective: "Match common tools to their jobs.", teach: "A ruler measures, scissors cut, tape and glue join, a screwdriver drives screws, a hammer drives nails. Using the right tool for the job makes the work easier and the build better. A wise builder knows what each tool is for.", memoryWork: "The right tool for the right job." },
        { id: "titus-engineering-u4-l2", title: "Measure Twice, Cut Once", objective: "Check measurements before making a permanent cut.", teach: "Old builder's rule: measure twice, cut once. You can always cut more off, but you can never put it back. Slowing down to check before the cut saves your materials and your project. Careful beats fast.", memoryWork: "Measure twice, cut once." },
        { id: "titus-engineering-u4-l3", title: "Build Safely", objective: "Use sharp or powerful tools only with an adult.", teach: "Sharp knives, saws, hot glue, and power tools are used with a grown-up, always, and cutting is done away from your body. Safety is not the boring part of building, it is what lets you keep building. Ask for help with the risky steps, that is what smart builders do.", memoryWork: "Risky tools, only with a grown-up." },
        { id: "titus-engineering-u4-l4", title: "Strong and Sturdy", objective: "Join parts so a build holds together.", teach: "A build is only as good as its joints. Glue needs time to dry, tape wraps all the way around, and a triangle is the strongest shape, so add one to keep things from wobbling. Test each joint by giving it a gentle wiggle before you move on.", memoryWork: "Triangles are strong. Let the glue dry." },
      ],
    },
    {
      id: "titus-engineering-u5",
      title: "Unit 5 · Test and Improve",
      summary: "Try it, learn from what breaks, and make version two.",
      lessons: [
        { id: "titus-engineering-u5-l1", title: "Try It Out", objective: "Test a finished build to see if it works.", teach: "The moment of truth: try your build and watch closely. Does it do the job you designed it for? Testing tells you the truth that guessing cannot. Every engineer tests before they call it done.", memoryWork: "Test it and watch what happens." },
        { id: "titus-engineering-u5-l2", title: "It's OK to Fail", objective: "See failure as useful information, not defeat.", teach: "If it breaks or flops, good, now you know something you did not before. Failure is not the end, it is data. Thomas Edison found a thousand ways a bulb would not work on the way to the one that did. A flop is just step one of a fix.", memoryWork: "A failure is information, not the end." },
        { id: "titus-engineering-u5-l3", title: "Fix One Thing at a Time", objective: "Change a single variable, then re-test.", teach: "When something is wrong, resist changing everything at once. Change ONE thing, then test again, so you know what actually helped. Fixing one thing at a time is slower for a minute but far faster in the end.", memoryWork: "Change one thing, then test again." },
        { id: "titus-engineering-u5-l4", title: "Make It Better", objective: "Run the improve step to create a better version.", teach: "Now loop back: take what you learned and build version two. Maybe stronger, simpler, or nicer looking. The improve step is where good builds become great ones, and it is why the design loop is a loop, not a straight line.", memoryWork: "Version two is always better than version one." },
      ],
    },
    {
      id: "titus-engineering-u6",
      title: "Unit 6 · How Things Work",
      summary: "The simple machines hiding inside everything you build.",
      lessons: [
        { id: "titus-engineering-u6-l1", title: "The Lever", objective: "Understand how a lever multiplies force.", teach: "A lever is a stiff bar that pivots on a point, and it lets a small push move a big load, like a seesaw or a crowbar. Move the pivot closer to the load and lifting gets even easier. Levers are everywhere once you start looking.", memoryWork: "A lever lets a small push move a big load." },
        { id: "titus-engineering-u6-l2", title: "The Wheel and Axle", objective: "Understand how wheels move loads.", teach: "A wheel turning on an axle rolls a heavy load with far less effort than dragging it. It is why carts, cars, and fishing reels all spin on axles. Rolling beats dragging almost every time.", memoryWork: "A wheel and axle roll heavy loads easily." },
        { id: "titus-engineering-u6-l3", title: "The Ramp", objective: "Understand how an inclined plane eases lifting.", teach: "A ramp, or inclined plane, lets you raise something heavy by pushing it up a slope instead of lifting it straight up. It trades a longer distance for an easier push. That is why loading ramps and wheelchair ramps exist.", memoryWork: "A ramp trades distance for an easier lift." },
        { id: "titus-engineering-u6-l4", title: "The Pulley", objective: "Understand how a pulley changes the direction of force.", teach: "A pulley is a wheel with a rope over it, so you can lift a load UP by pulling DOWN, which is easier because you can use your weight. Add more pulleys and lifting gets easier still. Flagpoles and cranes run on pulleys.", memoryWork: "A pulley lets you lift up by pulling down." },
        { id: "titus-engineering-u6-l5", title: "Machines Work Together", objective: "See how simple machines combine into bigger machines.", teach: "Real machines stack simple machines together: a fishing reel uses a wheel-and-axle and gears; a wheelbarrow uses a lever and a wheel. Once you can spot the simple machines inside a big one, you can understand, fix, and build almost anything.", memoryWork: "Big machines are simple machines combined." },
      ],
    },
    {
      id: "titus-engineering-u7",
      title: "Unit 7 · Real Projects",
      summary: "Run the whole design loop on real builds, finishing each one.",
      lessons: [
        { id: "titus-engineering-u7-l1", title: "A Cardboard Creation", objective: "Build something useful or fun from a cardboard box.", teach: "A cardboard box is a whole workshop of possibility: a castle, a marble maze, a gear car. Pick one, sketch it, plan your steps, and build it with tape and scissors. Cardboard is the perfect place to fail cheap and learn fast.", memoryWork: "Sketch it, plan it, build it, from a box." },
        { id: "titus-engineering-u7-l2", title: "A Marble Run", objective: "Design a track that guides a marble using ramps and turns.", teach: "Build a marble run from tubes, cardboard, or blocks, using ramps (inclined planes) and gentle turns to keep the marble rolling. Test it, watch where the marble jumps off, and fix one section at a time. It is the design loop in action.", memoryWork: "Ramps and turns keep the marble rolling." },
        { id: "titus-engineering-u7-l3", title: "A Simple Catapult", objective: "Build a small catapult using a lever and stored energy.", teach: "With popsicle sticks and rubber bands you can build a small catapult: a lever arm that stores energy when you press it and flings a pom-pom when you let go. Change the arm length and see how the throw changes. Always aim it safely, never at a person.", memoryWork: "A catapult is a lever that stores and releases energy." },
        { id: "titus-engineering-u7-l4", title: "A Birdhouse", objective: "Complete a real woodworking project with an adult.", teach: "A birdhouse is a real woodworking build: measure and cut the pieces with a grown-up, join them square and sturdy, add a roof that sheds rain and a hole the right size. Finish it, hang it, and watch God's creatures move into something your hands made.", memoryWork: "Measure, cut with a grown-up, join it square, finish it." },
        { id: "titus-engineering-u7-l5", title: "Design Your Own Fishing Lure", objective: "Apply the full design loop to build and test a homemade lure.", teach: "Now for your world: design a fishing lure. Ask what fish you want and what they eat, imagine a shape and color, plan and build it from a bead, a hook, and some feather or foil, then TEST it at the water and improve it. An idea you can cast is an idea made real.", memoryWork: "Design it, build it, test it at the water, improve it." },
        { id: "titus-engineering-u7-l6", title: "A Build of Your Own", objective: "Run the complete design loop on a self-chosen project.", teach: "Last one, and it is all yours: pick an idea you have been carrying around and run the whole loop, Ask, Imagine, Plan, Build, Test, Improve. Take it all the way to finished. That idea in your head is exactly the kind of thing God made you to bring into the world.", memoryWork: "Take one of your own ideas all the way to done." },
      ],
    },
  ],
};
