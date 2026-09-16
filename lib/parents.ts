/** Parents who run Schoolhouse. PIN is still PARENT_PIN. This list is the roster. */
export const PARENTS = [
  { name: "Briana", email: "briana.echols86@gmail.com", role: "admin" as const },
  { name: "John-Mark", email: "echolsjm@gmail.com", role: "admin" as const },
];

export function isParentEmail(email: string) {
  const n = email.trim().toLowerCase();
  return PARENTS.some((p) => p.email === n);
}
