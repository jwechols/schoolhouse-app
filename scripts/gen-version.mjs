// Stamps a build version into public/version.json and lib/version.ts.
// Runs before `next build` (see package.json). The running app compares the
// version baked into its bundle (lib/version.ts) against the live
// public/version.json and reloads itself when a new build is deployed.
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

let version = process.env.COMMIT_REF || "";
if (!version) {
  try {
    version = execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    /* not a git checkout */
  }
}
if (!version) version = String(Date.now());

writeFileSync("public/version.json", JSON.stringify({ version }) + "\n");
writeFileSync(
  "lib/version.ts",
  `// AUTO-GENERATED at build by scripts/gen-version.mjs. Do not edit by hand.\nexport const APP_VERSION = "${version}";\n`,
);
console.log("[gen-version] APP_VERSION =", version);
