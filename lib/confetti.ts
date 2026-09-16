/**
 * Pure CSS/DOM confetti burst, no external libraries.
 * Creates 24 colored divs that fly outward and fade away.
 */

const COLORS = [
  "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff",
  "#ff6fcf", "#a855f7", "#f97316", "#06b6d4",
];

export function burstConfetti(
  x: number,
  y: number,
  kidColor?: string
) {
  const count = 24;
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  `;
  document.body.appendChild(container);

  const palette = kidColor
    ? [kidColor, ...COLORS.slice(0, 5)]
    : COLORS;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const angle = (i / count) * 360;
    const distance = 80 + Math.random() * 120;
    const dx = Math.cos((angle * Math.PI) / 180) * distance;
    const dy = Math.sin((angle * Math.PI) / 180) * distance - 60;
    const size = 6 + Math.random() * 10;
    const color = palette[i % palette.length];
    const isCircle = Math.random() > 0.5;
    const rotation = Math.random() * 360;

    el.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${isCircle ? "50%" : "2px"};
      opacity: 1;
      transform: translate(-50%, -50%) rotate(${rotation}deg);
      animation: confetti-fly-${i} 1.4s ease-out forwards;
    `;

    // Inject unique keyframe for this particle
    const keyId = `confetti-fly-${i}`;
    if (!document.getElementById(keyId)) {
      const style = document.createElement("style");
      style.id = keyId;
      style.textContent = `
        @keyframes ${keyId} {
          0% {
            transform: translate(-50%, -50%) rotate(${rotation}deg) scale(1);
            opacity: 1;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rotation + 180}deg) scale(0.3);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    container.appendChild(el);
  }

  setTimeout(() => {
    container.remove();
  }, 1500);
}

/** Burst confetti from the center of an element */
export function burstConfettiFromElement(
  el: HTMLElement,
  kidColor?: string
) {
  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  burstConfetti(x, y, kidColor);
}
