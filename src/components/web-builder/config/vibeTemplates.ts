export type Vibe =
  | "modern"
  | "minimal"
  | "bold"
  | "elegant"
  | "local-business"
  | "portfolio"
  | "let-ninja-choose";

export interface VibeOption {
  id: Vibe;
  label: string;
  description: string;
}

export const VIBE_OPTIONS: VibeOption[] = [
  { id: "modern", label: "Modern", description: "Clean, tech-forward, confident" },
  { id: "minimal", label: "Minimal", description: "Lots of whitespace, understated" },
  { id: "bold", label: "Bold", description: "High contrast, strong statements" },
  { id: "elegant", label: "Elegant", description: "Refined, premium, polished" },
  { id: "local-business", label: "Local Business", description: "Warm, approachable, community feel" },
  { id: "portfolio", label: "Portfolio", description: "Showcase-first, visual-led" },
  { id: "let-ninja-choose", label: "Let Ninja choose for me", description: "We'll pick based on your business" },
];

// Shape this module operates on — matches WebBuilderService's WebsiteTemplate
// but kept loosely typed here so config code doesn't need to import the
// services layer. Templates are now DB-backed (see plan.md 3.2 — previously
// this file imported a static DemoTemplates.tsx and matched off hardcoded
// id lists); callers fetch the list once (TemplateService.getTemplates())
// and pass it into these otherwise-pure functions.
export interface TemplateLike {
  templateId: string;
  name: string;
  industry: string;
  vibes: string[];
  primaryColor?: string | null;
  pages: Array<{ name: string; component: string }>;
}

// Matches the wizard's Step 1 industry <option> values (their literal
// label text, e.g. "Restaurant / Coffee") to a template's DB `industry`
// slug (e.g. "restaurant-coffee") — the 16 labels in CreateWebsiteWizard's
// INDUSTRIES list were deliberately chosen so this normalization is exact,
// not a fuzzy heuristic.
function normalizeIndustry(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/\s*\/\s*/g, "-")
    .replace(/\s+/g, "-");
}

function findTemplateById(templates: TemplateLike[], id: string): TemplateLike | null {
  return templates.find((t) => t.templateId === id) || null;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function colorDistance(a: string, b: string): number {
  const rgbA = hexToRgb(a);
  const rgbB = hexToRgb(b);
  if (!rgbA || !rgbB) return Infinity;
  return Math.sqrt((rgbA[0] - rgbB[0]) ** 2 + (rgbA[1] - rgbB[1]) ** 2 + (rgbA[2] - rgbB[2]) ** 2);
}

// Used only to break ties between templates that already match on the
// criteria that matter most (industry, then vibe) — never a primary filter,
// since most templates won't have a genuinely close match to an arbitrary
// user-picked color. Falls back to the first candidate when nobody has a
// tagged primaryColor, or no brand color was chosen.
function pickClosestByColor(candidates: TemplateLike[], brandColor?: string): TemplateLike {
  if (!brandColor || candidates.length === 1) return candidates[0];
  const tagged = candidates.filter((t) => !!t.primaryColor);
  if (!tagged.length) return candidates[0];
  return tagged.reduce((best, t) =>
    colorDistance(t.primaryColor!, brandColor) < colorDistance(best.primaryColor!, brandColor) ? t : best
  , tagged[0]);
}

export function pickTemplateForVibe(
  templates: TemplateLike[],
  vibe: Vibe,
  industry?: string,
  brandColor?: string
): TemplateLike | null {
  if (!templates.length) return null;

  const normalizedIndustry = industry ? normalizeIndustry(industry) : "";
  const industryMatches = normalizedIndustry
    ? templates.filter((t) => t.industry === normalizedIndustry)
    : [];

  if (vibe === "let-ninja-choose") {
    if (industryMatches.length) return pickClosestByColor(industryMatches, brandColor);
    return findTemplateById(templates, "paksoft-main") || templates[0];
  }

  // A specific vibe was chosen — prefer a template matching BOTH the chosen
  // industry and vibe; fall back to industry-only, then vibe-only. Never
  // jump to an unrelated industry's template while a same-industry one
  // exists, which is what caused Industry="Law" + a popular vibe to
  // silently return some other industry's template before this fix.
  if (industryMatches.length) {
    const industryAndVibe = industryMatches.filter((t) => t.vibes.includes(vibe));
    if (industryAndVibe.length) return pickClosestByColor(industryAndVibe, brandColor);
    return pickClosestByColor(industryMatches, brandColor);
  }

  const vibeMatches = templates.filter((t) => t.vibes.includes(vibe));
  if (vibeMatches.length) return pickClosestByColor(vibeMatches, brandColor);
  return findTemplateById(templates, "paksoft-main") || templates[0];
}

export function getTemplatesForVibe(templates: TemplateLike[], vibe: Vibe): TemplateLike[] {
  if (vibe === "let-ninja-choose") return [];
  return templates.filter((t) => t.vibes.includes(vibe));
}

/**
 * Smart template-fill (no AI): swaps the home page's hero heading/subheading
 * text for the user's actual business name/description. Scoped to the first
 * <h1> and a short nearby <p> on the home page only, so it can't clobber
 * other pages (About/Contact/etc.) or long body copy on multi-page templates.
 */
export function fillTemplateDraft(
  template: TemplateLike,
  businessName: string,
  description: string,
  logoUrl?: string
): { id: string; name: string; data: { pages: Array<{ name: string; component: string }> } } {
  const pages = template?.pages || [];
  const filledPages = pages.map((page, index) => {
    if (index !== 0 || typeof page.component !== "string") return page;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(page.component, "text/html");

      const h1 = doc.querySelector("h1");
      if (h1 && businessName.trim()) {
        h1.textContent = businessName.trim();
      }

      if (description.trim()) {
        const nearbyP =
          (h1?.parentElement?.querySelector("p") as HTMLElement | null) ||
          doc.querySelector("p");
        if (nearbyP && nearbyP.textContent && nearbyP.textContent.length < 220) {
          nearbyP.textContent = description.trim();
        }
      }

      // Logo: every template's nav/header consistently puts the brand mark
      // as the first element inside <nav>/<header> (confirmed across all 20
      // templates) — inserting an <img> before its existing text is purely
      // additive (nothing removed/replaced), so it can't break an unknown
      // template's layout the way overwriting text could. Brand color is
      // deliberately NOT auto-applied here: with 20 independently-styled
      // templates using inline styles (no shared CSS variables), there's no
      // safe general way to retarget "the accent color" without per-template
      // mapping — it's persisted on the website record for later/manual use
      // instead of risking a blind find-and-replace across arbitrary inline
      // styles.
      if (logoUrl) {
        const brandEl =
          (doc.querySelector("nav")?.firstElementChild as HTMLElement | null) ||
          (doc.querySelector("header")?.firstElementChild as HTMLElement | null);
        if (brandEl) {
          const img = doc.createElement("img");
          img.src = logoUrl;
          img.alt = businessName.trim() || template.name;
          img.style.cssText =
            "height:32px;width:auto;vertical-align:middle;margin-right:8px;display:inline-block;";
          brandEl.insertBefore(img, brandEl.firstChild);
        }
      }

      // DOMParser hoists a leading <style> tag (which every template starts
      // with) into doc.head, not doc.body — returning body.innerHTML alone
      // silently drops all the template's CSS. Concatenate both back
      // together so the output keeps the same "style, then markup"
      // structure the original template string had.
      return { ...page, component: doc.head.innerHTML + doc.body.innerHTML };
    } catch {
      return page;
    }
  });

  return {
    id: template.templateId,
    name: businessName.trim() || template.name,
    data: { pages: filledPages },
  };
}
