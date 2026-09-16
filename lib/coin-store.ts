/**
 * Coin Store, rewards kids can spend coins on.
 *
 * Two categories:
 *   digital , unlocks content immediately in the app
 *   physical, generates a coupon Briana honors (choose dinner, stay up late, etc.)
 *
 * Screen time is handled separately via the hub button → HA webhook.
 */

export type RewardCategory = "fun" | "knowledge" | "physical";

export interface StoreReward {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  cost: number;
  category: RewardCategory;
  /** Kids this reward is available to. Omit for all. */
  kidIds?: string[];
  /** Content pool, one item is picked fresh on each purchase. */
  contentPool?: string[];
  /** Resolved content (set by getStoreRewards, never hardcoded). */
  content?: string;
  /** Physical rewards generate a coupon, no content */
  physical?: true;
}

// ── Per-kid fun content pools ─────────────────────────────────────────────────

const HUNTING_FISHING_FACTS = [
  "A largemouth bass can hear underwater using its lateral line, a row of sensors that feels vibrations through the water! 🎣",
  "White-tailed deer can run up to 30 mph and jump 8 feet high. They could clear your front door! 🦌",
  "Catfish have taste buds ALL over their body, their skin can taste the water around them! 😮",
  "A whitetail buck sheds and regrows its antlers every single year. That's like growing a whole new set of bones! 🦌",
  "Bluegill are one of the best fish to catch because they bite almost any bait, even a tiny piece of worm works! 🪱🎣",
  "Deer can smell you from over half a mile away. That's why hunters always check the wind direction! 💨",
  "The biggest largemouth bass ever caught weighed 22 lbs. Most people fish their whole life and never catch one that big! 🏆",
  "Wild turkeys can see almost 270 degrees without turning their head, that's why they're so hard to sneak up on! 🦃",
  "Crappie tend to school together, so if you catch one, there are almost always more right in the same spot! 🐟",
  "God gave animals their instincts, He designed deer, fish, and birds with exactly what they need to survive. 🙌",
];

const HUNTING_FISHING_JOKES = [
  "Q: Why don't fish play basketball?\nA: Because they're afraid of the net! 🎣",
  "Q: What did the fish say when it swam into a wall?\nA: Dam! 🐟",
  "Q: Why do fishermen make great musicians?\nA: Because they always know their scales! 🎵🎣",
  "Q: What do you call a fish with no eyes?\nA: A fsh! 😂",
  "Q: Why did the hunter bring a ladder?\nA: Because he heard the deer were up in the stands! 🦌😄",
];

const PRINCESS_STORIES = [
  "Once upon a time, Princess Lois woke up and her whole room was made of CLOUDS. Soft, fluffy, rainbow clouds. She bounced and bounced until she bounced all the way to the breakfast table where pancakes were already waiting. The End! 🌈👑",
  "Princess Lois had a crown that could talk. It whispered, 'You are so brave!' every time she did something hard. One day she tied her own shoes, and the crown said it so loud the whole kingdom heard! 👑✨",
  "In the enchanted garden, Princess Lois found a tiny dragon named Sparkle. Sparkle didn't breathe fire, she sneezed glitter! They became best friends and had a glitter party every single day. 🐉✨",
  "Princess Lois discovered that every time she said 'please' and 'thank you,' a flower bloomed somewhere in the kingdom. By bedtime, the whole land was covered in flowers just because she was so kind. 🌸👑",
];

const MERCY_GARDEN_STORIES = [
  "In Mercy's garden, the flowers could whisper. The roses said 'you're loved,' the daisies said 'you're brave,' and the sunflowers said 'you shine so bright!' Mercy listened carefully and believed every word, because God planted every flower, and He planted her too. 🌸",
  "There was once a tiny seed that didn't think it could ever grow. But the Gardener knew better. He watered it, gave it sunshine, and waited patiently. One day, POP, the most beautiful flower! God tends our hearts the same way. 🌱➡️🌺",
  "Mercy found a caterpillar in her garden who was afraid of his cocoon. But she told him: 'Something beautiful is happening inside, even when it's dark.' Three weeks later, a butterfly! Change isn't always scary. 🦋",
];

const BONUS_BIBLE_STORIES = [
  "**David and Goliath** 🪨\nEveryone was afraid of the giant Goliath, except David. Not because David was big or strong, but because he knew the Lord of Hosts was on his side. One smooth stone. One giant. One God who never loses. (1 Samuel 17)",
  "**The Feeding of 5,000** 🐟🍞\nA boy brought his lunch, 5 loaves and 2 fish, to Jesus. It wasn't much. But Jesus took what little was offered and fed over 5,000 people with twelve baskets left over. God delights in using small things for His glory. (John 6:1-14)",
  "**Shadrach, Meshach, and Abednego** 🔥\nThe king threatened to throw them into a furnace if they didn't bow. They said: 'Our God can save us, but even if He doesn't, we still won't bow.' That's what real faith looks like. And God showed up in the fire. (Daniel 3)",
  "**Ruth and Naomi** 🌾\n'Where you go, I will go.' Ruth left everything she knew to stay with her mother-in-law, a widow with nothing. God saw her faithfulness and gave her a new family, a husband named Boaz, and a place in the line of King David, and Jesus. (Ruth 1-4)",
];

// ── Reward catalog ────────────────────────────────────────────────────────────

export const STORE_REWARDS: StoreReward[] = [

  // ── TITUS, hunting & fishing fun ─────────────────────────────
  {
    id: "outdoors-fact",
    emoji: "🎣",
    title: "Outdoors Fact",
    desc: "Unlock a secret hunting or fishing fact",
    cost: 5,
    category: "fun",
    kidIds: ["titus"],
    contentPool: HUNTING_FISHING_FACTS,
  },
  {
    id: "outdoors-joke",
    emoji: "🦌",
    title: "Outdoors Joke",
    desc: "A hunting or fishing joke",
    cost: 3,
    category: "fun",
    kidIds: ["titus"],
    contentPool: HUNTING_FISHING_JOKES,
  },

  // ── LOIS, princess stories ────────────────────────────────────
  {
    id: "princess-story",
    emoji: "👑",
    title: "Princess Story",
    desc: "A brand new story just for you",
    cost: 5,
    category: "fun",
    kidIds: ["lois"],
    contentPool: PRINCESS_STORIES,
  },

  // ── MERCY, garden stories ─────────────────────────────────────
  {
    id: "garden-story",
    emoji: "🌸",
    title: "Garden Story",
    desc: "A garden parable just for Mercy",
    cost: 5,
    category: "fun",
    kidIds: ["mercy"],
    contentPool: MERCY_GARDEN_STORIES,
  },

  // ── ALL KIDS, bonus Bible story ───────────────────────────────
  {
    id: "bible-story",
    emoji: "📖",
    title: "Bonus Bible Story",
    desc: "A great story from God's Word",
    cost: 8,
    category: "knowledge",
    contentPool: BONUS_BIBLE_STORIES,
  },

  // ── PHYSICAL REWARDS, Briana honors these ─────────────────────
  {
    id: "pick-dinner",
    emoji: "🍕",
    title: "Pick Tonight's Dinner",
    desc: "You choose what the family eats",
    cost: 40,
    category: "physical",
    physical: true,
  },
  {
    id: "pick-movie",
    emoji: "🎬",
    title: "Pick the Family Movie",
    desc: "Movie night, your pick, no arguments",
    cost: 30,
    category: "physical",
    physical: true,
  },
  {
    id: "stay-up-late",
    emoji: "🌙",
    title: "30 Min Late Bedtime",
    desc: "One night you get to stay up 30 min later",
    cost: 35,
    category: "physical",
    physical: true,
  },
  {
    id: "special-treat",
    emoji: "🍦",
    title: "Special Treat",
    desc: "A treat of your choice on the next store run",
    cost: 50,
    category: "physical",
    physical: true,
  },
  {
    id: "read-to-me",
    emoji: "📚",
    title: "Dad Reads to Me",
    desc: "Dad reads any book you pick, start to finish",
    cost: 20,
    category: "physical",
    physical: true,
  },
];

/** Returns rewards available for a specific kid.
 *  Pool-based rewards get a fresh random content pick on every call, 
 *  so each purchase draws a different item from the pool. */
export function getStoreRewards(kidId: string): StoreReward[] {
  return STORE_REWARDS
    .filter((r) => !r.kidIds || r.kidIds.includes(kidId))
    .map((r) => {
      if (!r.contentPool?.length) return r;
      const pick = r.contentPool[Math.floor(Math.random() * r.contentPool.length)];
      return { ...r, content: pick };
    });
}

/** Storage key for redeemed coupons */
function couponKey(kidId: string) {
  return `elc-coupons-${kidId}`;
}

export interface Coupon {
  id: string;
  rewardId: string;
  rewardTitle: string;
  rewardEmoji: string;
  redeemedAt: string;
  honored: boolean;
}

export function getCoupons(kidId: string): Coupon[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(couponKey(kidId));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addCoupon(kidId: string, reward: StoreReward): Coupon {
  const coupon: Coupon = {
    id: `${reward.id}-${Date.now()}`,
    rewardId: reward.id,
    rewardTitle: reward.title,
    rewardEmoji: reward.emoji,
    redeemedAt: new Date().toISOString(),
    honored: false,
  };
  const existing = getCoupons(kidId);
  localStorage.setItem(couponKey(kidId), JSON.stringify([coupon, ...existing]));
  return coupon;
}

/** Mark a coupon as honored by a parent. Returns updated list. */
export function honorCoupon(kidId: string, couponId: string): Coupon[] {
  const coupons = getCoupons(kidId).map((c) =>
    c.id === couponId ? { ...c, honored: true } : c
  );
  localStorage.setItem(couponKey(kidId), JSON.stringify(coupons));
  return coupons;
}

/** All pending (un-honored) coupons across all kids */
export function getAllPendingCoupons(): Array<Coupon & { kidId: string }> {
  if (typeof window === "undefined") return [];
  const kids = ["titus", "mercy", "lois", "truma"];
  return kids.flatMap((kidId) =>
    getCoupons(kidId)
      .filter((c) => !c.honored)
      .map((c) => ({ ...c, kidId }))
  );
}
