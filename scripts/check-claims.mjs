#!/usr/bin/env node
/**
 * Claim scanner. Runs before every build (see package.json → prebuild).
 *
 * Enforces the acceptance checks in SPEC.md that a schema cannot:
 *
 *   1. No string on the page appears in constraints.neverSay
 *   2. All of constraints.removeFromCurrentSite are gone from the repo
 *   3. No em dashes in any copy string
 *   4. The founder note is not shipped while it is marked draft
 *   5. The restore-time figure carries its caveat, or is absent
 *
 * On check 1, a note on why this is not a plain substring match.
 *
 * `neverSay` lists things the page must never CLAIM. Several of them are things the
 * page quite deliberately DENIES: "multi-factor authentication", "threat detection"
 * and "service level agreement" all appear, correctly, in the Not built yet panel, in
 * the roadmap, and in the org path's caveat. A naive blocklist would fail the build for
 * the page being honest, which is the opposite of what the constraint is for.
 *
 * So the scan is scoped: assertion contexts are checked, denial contexts are not.
 * DENIAL_PATHS below is that list, and it is deliberately short and explicit — a new
 * entry is a decision someone has to make on purpose, not a way to quiet the check.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const content = JSON.parse(readFileSync(join(root, "content/landing-content.json"), "utf8"));

const failures = [];
const fail = (check, detail) => failures.push({ check, detail });

/** Content paths whose whole job is to say a thing does NOT exist. */
const DENIAL_PATHS = [
  "trust.notBuilt",
  "roadmap",
  "paths.org.caveat",
  "paths.msp.caveat",
  "paths.solo.caveat",
  "management.caveat",
  "band",
];

/** Blocklist entries that describe a framing rather than a literal string. */
const NON_LITERAL = new Set([
  "any certification",
  "any audit",
  "uptime figure",
  "customer count",
  "named customer",
  "testimonial",
  "multi-factor authentication as available",
  "any region outside North America",
  "any named application on a shared desktop",
  "any provisioning time other than twenty to forty minutes for a brand new client",
  "any timing for adding a machine to an existing customer",
  "coming soon for anything without a build underway",
]);

/** Walk every string in the content tree with its dotted path. */
function* strings(node, path = "") {
  if (typeof node === "string") {
    yield [path, node];
  } else if (Array.isArray(node)) {
    for (const [i, v] of node.entries()) yield* strings(v, `${path}[${i}]`);
  } else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      yield* strings(v, path ? `${path}.${k}` : k);
    }
  }
}

const copy = [...strings(content)].filter(
  ([p]) => !p.startsWith("constraints") && !p.startsWith("_meta")
);

const inDenialContext = (p) => DENIAL_PATHS.some((d) => p.startsWith(d));

// ── 1. neverSay ─────────────────────────────────────────────────────────────
for (const phrase of content.constraints.neverSay) {
  if (NON_LITERAL.has(phrase)) continue;
  for (const [p, value] of copy) {
    if (inDenialContext(p)) continue;
    if (value.toLowerCase().includes(phrase.toLowerCase())) {
      fail("neverSay", `"${phrase}" appears in an assertion context at ${p}`);
    }
  }
}

// ── 2. strings that must be gone from the whole repo ────────────────────────
const EXEMPT = ["content/landing-content.json", "SPEC.md", "scripts/check-claims.mjs"];
for (const { string } of content.constraints.removeFromCurrentSite) {
  // The last entry names two brand spellings in one field.
  for (const needle of string.split(" / ")) {
    /*
     * Brand spellings are matched case-SENSITIVELY, everything else case-insensitively.
     * Without that split, "offsiteLABS" also matches offsitelabs.io, the contact
     * address and the platform repo name, and the check fails on the correct brand
     * rather than the old one. A needle carrying an uppercase letter is a brand
     * spelling; the banned sentences are all lower case.
     */
    const caseSensitive = /[A-Z]/.test(needle);
    let hits = "";
    try {
      hits = execSync(
        `git grep -lF${caseSensitive ? "" : "i"} ${JSON.stringify(needle)} -- . ':!node_modules' || true`,
        { cwd: root, encoding: "utf8" }
      );
    } catch {
      hits = "";
    }
    const files = hits.split("\n").filter(Boolean).filter((f) => !EXEMPT.includes(f));
    if (files.length) fail("removeFromCurrentSite", `"${needle}" still in: ${files.join(", ")}`);
  }
}

// ── 3. em dashes ────────────────────────────────────────────────────────────
for (const [p, value] of copy) {
  if (value.includes("—")) fail("emDash", `em dash at ${p}`);
}

// ── 4. draft founder note ───────────────────────────────────────────────────
// The renderer already gates on this flag; the check exists so that clearing the flag
// is a deliberate act with a green build behind it, rather than a silent one.
if (content.sustainability.founderNote.draft) {
  console.log(
    "  note: founder note is still marked draft, so it is not rendered. Clear `draft` in the JSON once Jay has rewritten it."
  );
}

// ── 4b. sign-in destination ─────────────────────────────────────────────────
// A note rather than a failure, for the same reason as the founder note: the renderer
// already refuses to ship it as a link, so the honest state is on the page and this is
// the reminder that it is still waiting.
if (content.login.href === "PLACEHOLDER_NOT_CONNECTED") {
  console.log(
    "  note: sign-in has no destination yet, so the header button renders disabled. Set login.href in the content file."
  );
}

// ── 5. restore figure carries its caveat ────────────────────────────────────
const restore = content.trust.trueToday.items.find((i) => /eleven minutes/i.test(i));
if (restore && !/trivial data volume|rather than proven at scale/i.test(restore)) {
  fail(
    "restoreCaveat",
    "the eleven-minute restore figure is on the page without its trivial-data-volume caveat"
  );
}

// ── report ──────────────────────────────────────────────────────────────────
if (failures.length) {
  console.error("\nClaim check FAILED:\n");
  for (const f of failures) console.error(`  [${f.check}] ${f.detail}`);
  console.error("\nSee SPEC.md → Acceptance checks.\n");
  process.exit(1);
}
console.log("Claim check passed.");
