import type { Course } from "./types";

// Titus, Gun Safety (grammar stage, 3rd grade, age 8). Buck the hunter-fisherman
// teaches real firearm safety to a boy who is growing up around hunting and fishing.
// The backbone is the four universal safety rules, then finding a gun (Eddie Eagle),
// safe handling, field/hunting safety, and storage + respect. A gun is a serious
// tool, never a toy. Sober-mindedness (1 Peter 5:8) and loving your neighbor shape
// how a Christian handles a weapon: we are careful because life is precious.

export const TITUS_GUNSAFETY: Course = {
  kidId: "titus",
  subject: "gunsafety",
  subjectLabel: "Gun Safety",
  emoji: "🎯",
  gradeLabel: "3rd Grade",
  stage: "grammar",
  overview:
    "Real, hands-off-until-you-are-ready gun safety for a boy growing up around hunting and fishing, taught by Buck. Titus learns the four universal safety rules cold, what to do if he ever finds a gun, how guns are safely handled and carried, how to be safe in the field (blaze orange, muzzle control, treestands), and why guns are stored locked up and respected as serious tools, never toys. Safety first, every single time.",
  units: [
    {
      id: "titus-gunsafety-u1",
      title: "Unit 1 · The Four Rules",
      summary: "The four universal firearm safety rules, memorized cold.",
      lessons: [
        { id: "titus-gunsafety-u1-l1", title: "Treat Every Gun as Loaded", objective: "Always treat every firearm as if it is loaded.", teach: "Rule one: treat every gun as if it is loaded, always, even if someone just told you it is empty. Checking is good, but your hands and your habits act as though a round is in there every time. This one rule prevents most accidents all by itself.", memoryWork: "Rule 1: Every gun is always loaded." },
        { id: "titus-gunsafety-u1-l2", title: "Watch the Muzzle", objective: "Never point the muzzle at anything you are not willing to destroy.", teach: "Rule two: never let the muzzle, the open end the bullet comes out of, point at anything you are not willing to destroy. Keep it pointed in a safe direction at all times, usually up or at the ground away from people. Where the muzzle points is where the danger is.", memoryWork: "Rule 2: Muzzle in a safe direction, always." },
        { id: "titus-gunsafety-u1-l3", title: "Finger Off the Trigger", objective: "Keep your finger off the trigger until ready to shoot.", teach: "Rule three: keep your finger straight and OFF the trigger, resting along the side of the gun, until your sights are on the target and you have decided to shoot. Fingers do not go near a trigger for carrying, climbing, or showing. The trigger is the very last step.", memoryWork: "Rule 3: Finger off the trigger till ready." },
        { id: "titus-gunsafety-u1-l4", title: "Know Your Target and Beyond", objective: "Be sure of your target and what is behind it before shooting.", teach: "Rule four: be completely sure of your target and what is beyond it, because a bullet can travel far past what you aim at. You never shoot at a sound, a shape, or a movement. Loving your neighbor means you protect everything that could be behind that target.", memoryWork: "Rule 4: Know your target and what's beyond it." },
      ],
    },
    {
      id: "titus-gunsafety-u2",
      title: "Unit 2 · If You Find a Gun",
      summary: "Stop, don't touch, leave the area, tell an adult, even with friends.",
      lessons: [
        { id: "titus-gunsafety-u2-l1", title: "Stop, Don't Touch, Leave, Tell", objective: "Know exactly what to do if you find an unattended gun.", teach: "If you ever find a gun with no adult around, do four things: STOP, don't touch it, leave the area, and go tell an adult right away. An unattended gun is never yours to check or make safe, that is an adult's job. You will never be in trouble for leaving it alone and telling.", memoryWork: "Stop. Don't touch. Leave. Tell an adult." },
        { id: "titus-gunsafety-u2-l2", title: "Even With Friends", objective: "Follow the find-a-gun rule even when a friend wants to show you.", teach: "Sometimes a friend finds a gun and wants to show it off or say it's fine because it's 'not loaded.' Rule one still stands: every gun is always loaded. Be the brave one, don't touch it, leave, and tell an adult. A real friend keeps his friends safe.", memoryWork: "The rule doesn't change because a friend says so." },
      ],
    },
    {
      id: "titus-gunsafety-u3",
      title: "Unit 3 · Safe Handling",
      summary: "Muzzle discipline, the safety, loading/unloading, and carrying.",
      lessons: [
        { id: "titus-gunsafety-u3-l1", title: "Muzzle Discipline", objective: "Keep the muzzle in a safe direction at all times.", teach: "A 'safe direction' is one where a bullet could not hurt anyone if the gun went off, like up at the sky or down at the ground away from feet. Handing a gun to someone, turning around, climbing, resting, the muzzle stays safe the whole time. You control that muzzle like it is the most important job in the world, because it is.", memoryWork: "I control the muzzle every second." },
        { id: "titus-gunsafety-u3-l2", title: "The Safety Is Not Your Safety", objective: "Understand that the mechanical safety never replaces the four rules.", teach: "A gun's 'safety' is a small switch that can help block the trigger, and you keep it ON until you are ready to shoot. But a safety is a machine, and machines can fail, so it never replaces the four rules. Your habits keep you safe, not a little switch.", memoryWork: "The switch can fail; the four rules don't." },
        { id: "titus-gunsafety-u3-l3", title: "Loading and Unloading", objective: "Know that loading and unloading are done with an adult, muzzle safe.", teach: "Loading and unloading only happen with an adult, muzzle pointed in a safe direction, and finger off the trigger. When you are done shooting, an adult helps make the gun safe and shows it is empty, action open. A gun is always made safe before it is set down or handed over.", memoryWork: "Load and unload with an adult, muzzle safe." },
        { id: "titus-gunsafety-u3-l4", title: "Carrying a Gun", objective: "Carry a firearm safely and cross obstacles without an accident.", teach: "Carry a gun with the muzzle in a safe direction and the action open when you can. Before crossing a fence, ditch, or slick spot, unload it or hand it to your adult, cross, then take it back, never climb with a gun in your hands. Slips and falls are exactly when accidents happen.", memoryWork: "Cross fences empty-handed; hand the gun over first." },
      ],
    },
    {
      id: "titus-gunsafety-u4",
      title: "Unit 4 · In the Field",
      summary: "Blaze orange, everyone's location, treestands, and sure identification.",
      lessons: [
        { id: "titus-gunsafety-u4-l1", title: "Blaze Orange: Be Seen", objective: "Wear hunter orange so others can see you.", teach: "In the field you wear blaze orange, a bright color no animal wears, so other hunters can see you clearly and never mistake you for game. Being seen keeps you safe. A good hunter wants to stand out to people and blend in only to the deer.", memoryWork: "Wear blaze orange: be seen by people." },
        { id: "titus-gunsafety-u4-l2", title: "Know Where Everyone Is", objective: "Track the location of every person and keep your muzzle off them.", teach: "Before you ever raise your gun, you know where every person is, and you keep your muzzle from ever swinging across them. Hunters talk about their 'zone of fire,' the safe area in front of them, and never shoot outside it. People first, the shot second.", memoryWork: "Know where everyone is; muzzle never crosses a person." },
        { id: "titus-gunsafety-u4-l3", title: "Treestand Safety", objective: "Use a harness and raise an unloaded gun by rope.", teach: "Most hunting injuries are actually falls from treestands, not gunshots. You always wear a safety harness, and you never climb with a gun in your hands, you climb first, then pull the unloaded gun up on a rope, muzzle down. Down the same careful way.", memoryWork: "Harness on; climb empty; haul the unloaded gun up by rope." },
        { id: "titus-gunsafety-u4-l4", title: "Be Sure Before You Shoot", objective: "Positively identify game before ever pulling the trigger.", teach: "You must be one hundred percent sure your target is the animal you are hunting, never a sound, a color, or a wiggle in the brush. If there is any doubt at all, you do not shoot. It might be another hunter, a dog, or a cow, so certainty comes before every single shot.", memoryWork: "If you are not 100% sure, you do NOT shoot." },
      ],
    },
    {
      id: "titus-gunsafety-u5",
      title: "Unit 5 · Storage and Respect",
      summary: "Guns live locked up, they are tools not toys, and you always ask an adult.",
      lessons: [
        { id: "titus-gunsafety-u5-l1", title: "Guns Live Locked Up", objective: "Understand that guns are stored unloaded, locked, ammo separate.", teach: "Guns are stored unloaded and locked in a safe, with the ammunition kept separately. Kids never get into the safe on their own. Good storage is love: it protects little brothers and sisters and everyone who visits your home.", memoryWork: "Unloaded, locked up, ammo apart, kids never alone with it." },
        { id: "titus-gunsafety-u5-l2", title: "A Tool, Not a Toy", objective: "Treat a firearm with sober respect, never as a plaything.", teach: "A gun is a serious tool, like a chainsaw, not a toy and never a joke. You never point one at a person even in play, never pretend, never show off. 'Be sober-minded; be watchful' (1 Peter 5:8), a steady, careful heart is what handles a weapon rightly.", memoryWork: "'Be sober-minded; be watchful' (1 Peter 5:8). Never point at a person, even in fun." },
        { id: "titus-gunsafety-u5-l3", title: "Always Ask an Adult", objective: "Never handle a firearm without an adult's permission and presence.", teach: "You never take out or handle a gun without a trusted adult giving permission and being right there with you. There is no exception to this while you are young. Asking first is not babyish, it is exactly what a wise and safe hunter does.", memoryWork: "Never handle a gun without an adult right there." },
      ],
    },
  ],
};
