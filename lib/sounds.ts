// ── Web Audio API sound effects ────────────────────────────────────────────────
// All sounds are generated programmatically, no external files needed.

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    return new AudioContext();
  } catch {
    return null;
  }
}

function tone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

/** Rising chime: C5 – E5 – G5 */
export function playCorrect() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(ctx, 523.25, t,        0.18, "sine", 0.3);
  tone(ctx, 659.25, t + 0.12, 0.18, "sine", 0.3);
  tone(ctx, 783.99, t + 0.24, 0.28, "sine", 0.35);
}

/** Low wrong buzz */
export function playWrong() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(ctx, 220, t,        0.15, "sawtooth", 0.25);
  tone(ctx, 196, t + 0.12, 0.20, "square",   0.20);
}

/** 7-note fanfare for level up: C4 E4 G4 C5 E5 G5 C6 */
export function playLevelUp() {
  const ctx = getCtx();
  if (!ctx) return;
  const freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
  const t = ctx.currentTime;
  freqs.forEach((f, i) => {
    tone(ctx, f, t + i * 0.1, 0.18, "sine", 0.28);
  });
}

/** Quick 4-note streak run: G4 C5 E5 A5 */
export function playStreak() {
  const ctx = getCtx();
  if (!ctx) return;
  const freqs = [392.00, 523.25, 659.25, 880.00];
  const t = ctx.currentTime;
  freqs.forEach((f, i) => {
    tone(ctx, f, t + i * 0.08, 0.14, "sine", 0.25);
  });
}

/** Sparkle: ascending high notes 880–1760 */
export function playConfetti() {
  const ctx = getCtx();
  if (!ctx) return;
  const freqs = [880, 1046.5, 1174.66, 1318.51, 1567.98, 1760];
  const t = ctx.currentTime;
  freqs.forEach((f, i) => {
    tone(ctx, f, t + i * 0.07, 0.14, "sine", 0.18);
  });
}
