import type { Course } from "./types";

// Truma, Gun Safety (logic/dialectic stage, 6th grade). Lydia teaches the same real
// firearm safety Titus learns, tuned for a thoughtful young woman: the four universal
// rules, finding a gun, safe handling, field safety, and storage + respect. Lydia
// frames the "why" for a junior theologian: human life is precious because people
// bear the image of God (Gen. 1:27), so a weapon is handled with sober self-control
// (a fruit of the Spirit, Gal. 5:23), never carelessly and never as a toy. Same
// content as titus-gunsafety, her voice.

export const TRUMA_GUNSAFETY: Course = {
  kidId: "truma",
  subject: "gunsafety",
  subjectLabel: "Gun Safety",
  emoji: "🎯",
  gradeLabel: "6th Grade",
  stage: "logic",
  overview:
    "Real, serious gun safety for a capable young woman, taught by Lydia. Truma learns the four universal safety rules cold, what to do if she ever finds a gun, how firearms are safely handled and carried, how to stay safe in the field, and why guns are stored securely and respected as serious tools. Lydia grounds it in the sanctity of life and the self-control of a mature Christian: we are careful because people bear God's image and life is precious.",
  units: [
    {
      id: "truma-gunsafety-u1",
      title: "Unit 1 · The Four Rules",
      summary: "The four universal firearm safety rules, memorized cold.",
      lessons: [
        { id: "truma-gunsafety-u1-l1", title: "Treat Every Gun as Loaded", objective: "Always treat every firearm as if it is loaded.", teach: "Rule one: treat every firearm as if it is loaded, always, even when someone insists it is empty. You still verify, but your habits never depend on someone's word. This single discipline prevents the great majority of accidents on its own.", memoryWork: "Rule 1: Every gun is always loaded." },
        { id: "truma-gunsafety-u1-l2", title: "Watch the Muzzle", objective: "Never point the muzzle at anything you are not willing to destroy.", teach: "Rule two: never allow the muzzle to cover anything you are not willing to destroy. It stays pointed in a genuinely safe direction at all times. Where the muzzle points is precisely where the danger is, so you are deliberate about it every second.", memoryWork: "Rule 2: Muzzle in a safe direction, always." },
        { id: "truma-gunsafety-u1-l3", title: "Finger Off the Trigger", objective: "Keep your finger off the trigger until ready to shoot.", teach: "Rule three: keep your trigger finger straight and indexed along the frame until your sights are on target and you have decided to fire. Carrying, handling, and showing all happen with the finger off the trigger. Squeezing the trigger is the final, deliberate step, never an accident.", memoryWork: "Rule 3: Finger off the trigger till ready." },
        { id: "truma-gunsafety-u1-l4", title: "Know Your Target and Beyond", objective: "Be sure of your target and what is behind it before shooting.", teach: "Rule four: be certain of your target and of everything beyond it, since a projectile carries far past its mark. You never fire at a sound or a shape. This rule is love of neighbor made practical: you account for every life your shot could ever reach.", memoryWork: "Rule 4: Know your target and what's beyond it." },
      ],
    },
    {
      id: "truma-gunsafety-u2",
      title: "Unit 2 · If You Find a Gun",
      summary: "Stop, don't touch, leave the area, tell an adult, even with peers.",
      lessons: [
        { id: "truma-gunsafety-u2-l1", title: "Stop, Don't Touch, Leave, Tell", objective: "Know exactly what to do if you find an unattended gun.", teach: "If you ever come upon a firearm with no responsible adult present, do four things: stop, don't touch it, leave the area, and tell an adult immediately. Making an unattended gun safe is not your task, it is an adult's. You will never be in trouble for leaving it and reporting it.", memoryWork: "Stop. Don't touch. Leave. Tell an adult." },
        { id: "truma-gunsafety-u2-l2", title: "Even With Peers", objective: "Follow the find-a-gun rule even under peer pressure.", teach: "A peer may find a gun and insist it is fine because it is 'unloaded.' Rule one answers that: every gun is treated as loaded. Have the maturity to refuse, leave, and tell an adult, even if it is unpopular. Real courage protects people rather than impressing them.", memoryWork: "The rule doesn't bend to peer pressure." },
      ],
    },
    {
      id: "truma-gunsafety-u3",
      title: "Unit 3 · Safe Handling",
      summary: "Muzzle discipline, the safety, loading/unloading, and carrying.",
      lessons: [
        { id: "truma-gunsafety-u3-l1", title: "Muzzle Discipline", objective: "Keep the muzzle in a safe direction at all times.", teach: "A safe direction is one where a discharge could injure no one, typically up or at the ground clear of people. Turning, handing off, resting, adjusting, the muzzle remains controlled the entire time. Muzzle discipline is the habit that quietly protects everyone around you.", memoryWork: "I control the muzzle every second." },
        { id: "truma-gunsafety-u3-l2", title: "The Safety Is Not Your Safety", objective: "Understand that the mechanical safety never replaces the four rules.", teach: "The mechanical 'safety' is a switch that can help block the trigger, and you leave it engaged until ready to fire. But it is a device, and devices fail, so it never substitutes for the four rules. Your trained habits, not a small lever, are what actually keep people safe.", memoryWork: "The switch can fail; the four rules don't." },
        { id: "truma-gunsafety-u3-l3", title: "Loading and Unloading", objective: "Know that loading and unloading are done with an adult, muzzle safe.", teach: "Loading and unloading happen with a responsible adult, the muzzle in a safe direction, and the finger off the trigger. When shooting is finished, the firearm is confirmed empty with the action open before it is ever set down or passed to another person. Safe is the default state.", memoryWork: "Load and unload with an adult, muzzle safe." },
        { id: "truma-gunsafety-u3-l4", title: "Carrying a Gun", objective: "Carry a firearm safely and cross obstacles without an accident.", teach: "Carry with the muzzle in a safe direction and, when possible, the action open. Before crossing a fence, ditch, or unstable ground, unload the firearm or hand it to your adult, cross, then take it back. You never climb or scramble with a gun in your hands, because falls are when accidents happen.", memoryWork: "Cross obstacles empty-handed; hand the gun over first." },
      ],
    },
    {
      id: "truma-gunsafety-u4",
      title: "Unit 4 · In the Field",
      summary: "Blaze orange, everyone's location, treestands, and sure identification.",
      lessons: [
        { id: "truma-gunsafety-u4-l1", title: "Blaze Orange: Be Seen", objective: "Wear hunter orange so others can see you.", teach: "In the field you wear blaze orange, a color no game animal wears, so other people can see you plainly and never mistake you for an animal. Visibility is safety. The goal is to stand out clearly to people and blend in only to the wildlife.", memoryWork: "Wear blaze orange: be seen by people." },
        { id: "truma-gunsafety-u4-l2", title: "Know Where Everyone Is", objective: "Track the location of every person and keep your muzzle off them.", teach: "Before a firearm is ever raised, you know where every person is, and you never let the muzzle swing across a single one of them. Experienced shooters keep to a defined 'zone of fire' and refuse any shot outside it. People are always accounted for before the target is.", memoryWork: "Know where everyone is; muzzle never crosses a person." },
        { id: "truma-gunsafety-u4-l3", title: "Treestand Safety", objective: "Use a harness and raise an unloaded gun by rope.", teach: "In hunting, most injuries are actually falls from treestands rather than gunshots. You always wear a safety harness, climb with empty hands, and raise the unloaded firearm afterward on a haul line, muzzle down. You descend with the same deliberate care.", memoryWork: "Harness on; climb empty; haul the unloaded gun up by rope." },
        { id: "truma-gunsafety-u4-l4", title: "Be Sure Before You Shoot", objective: "Positively identify the target before ever firing.", teach: "You must positively identify your target, never firing at a sound, a color, or movement in cover. If there is any doubt whatsoever, you do not shoot, because it could be a person, a pet, or livestock. Certainty precedes every shot, without exception.", memoryWork: "If you are not 100% sure, you do NOT shoot." },
      ],
    },
    {
      id: "truma-gunsafety-u5",
      title: "Unit 5 · Storage and Respect",
      summary: "Guns live locked up, they are tools not toys, and you always ask an adult.",
      lessons: [
        { id: "truma-gunsafety-u5-l1", title: "Guns Live Locked Up", objective: "Understand that guns are stored unloaded, locked, ammo separate.", teach: "Firearms are stored unloaded and locked, with ammunition kept separately, and young people never access them alone. Responsible storage is itself an act of love: it guards younger siblings, guests, and anyone who enters the home. Care is not fear, it is stewardship.", memoryWork: "Unloaded, locked up, ammo apart, never accessed alone." },
        { id: "truma-gunsafety-u5-l2", title: "A Tool, Not a Toy", objective: "Treat a firearm with sober respect, never as a plaything.", teach: "A firearm is a serious tool, never a toy, a prop, or a joke, and it is never pointed at a person even in play. Human life is precious because people bear the image of God (Gen. 1:27), so a weapon is handled with the self-control the Spirit grows in us (Gal. 5:22-23). Reverence for life shapes every motion.", memoryWork: "Life bears God's image (Gen. 1:27); handle a weapon with self-control, never as a toy." },
        { id: "truma-gunsafety-u5-l3", title: "Always Ask an Adult", objective: "Never handle a firearm without an adult's permission and presence.", teach: "While you are young you never handle a firearm without a trusted adult's permission and presence, and there is no exception to that. Asking first is not childish, it is exactly the judgment a mature, trustworthy person shows. Wisdom waits and asks.", memoryWork: "Never handle a gun without a trusted adult present." },
      ],
    },
  ],
};
