import { SiteSchema, type Site } from "./schema";
import { site as rawSite } from "./site";

/**
 * THE READ LAYER. Components import content from here and nowhere else.
 *
 * Today it reads a typed in-repo object and validates it. When edits become more
 * frequent than deploys, replace the body of `getSite()` with a Supabase read that
 * returns the same shape — components never change. That is the whole point of this
 * file. See TODO.md → "Content migration trigger".
 *
 * Validation runs at module load (build/SSR time). A bad edit — a missing headline,
 * a Fact marked known:true with no value, a malformed email — throws HERE and fails
 * the build, instead of shipping an empty section or a wrong claim.
 */
function loadSite(): Site {
  const parsed = SiteSchema.safeParse(rawSite);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Content validation failed. Fix content/site.ts:\n${issues}\n`
    );
  }
  return parsed.data;
}

const validated = loadSite();

export function getSite(): Site {
  return validated;
}

export type { Site } from "./schema";
export type { Fact, Cta, TenantRow } from "./schema";
