// Best-effort extraction of a website's real "brand" colors from its raw
// markup or serialized project data, used to seed the Global Styles panel's
// Primary/Accent defaults with something related to the actual site instead
// of a hardcoded placeholder palette. This is a heuristic, not a guarantee —
// templates hardcode colors directly rather than exposing a real theme
// object, so there's no authoritative source to read from.

const HEX_OR_RGB_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)/g;

function rgbToHex(value: string): string | null {
  const m = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!m) return null;
  const toHex = (n: string) => Math.min(255, Number(n)).toString(16).padStart(2, "0");
  return `#${toHex(m[1])}${toHex(m[2])}${toHex(m[3])}`;
}

function normalizeColor(raw: string): string | null {
  const value = raw.trim();
  if (value.startsWith("#")) {
    if (value.length === 4) {
      // #abc -> #aabbcc
      const [, r, g, b] = value;
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    if (value.length === 7) return value.toLowerCase();
    return null; // #rgba/#rrggbbaa shorthand-with-alpha, skip (ambiguous for a solid swatch)
  }
  return rgbToHex(value);
}

// Skips near-white/near-black/gray tones — real UI chrome, not a brand color.
function isChromatic(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 18) return false; // grayscale-ish
  if (max < 40) return false; // near-black
  if (min > 235) return false; // near-white
  return true;
}

function firstChromaticColorIn(snippet: string): string | null {
  const matches = snippet.match(HEX_OR_RGB_RE);
  if (!matches) return null;
  for (const raw of matches) {
    const hex = normalizeColor(raw);
    if (hex && isChromatic(hex)) return hex;
  }
  return null;
}

function extractOpeningTag(html: string, tag: string): string | null {
  const m = html.match(new RegExp(`<${tag}\\b[^>]*>`, "i"));
  return m ? m[0] : null;
}

function extractButtonLikeTag(html: string): string | null {
  const patterns = [/<button\b[^>]*>/i, /<a\b[^>]*class="[^"]*\b(?:btn|button|cta)\b[^"]*"[^>]*>/i];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[0];
  }
  return null;
}

export interface ExtractedTheme {
  primary?: string;
  accent?: string;
}

/**
 * `source` can be a template/website page's raw HTML string, or a
 * JSON.stringify'd GrapesJS project (for an already-saved website, whose
 * stored data is a component tree, not HTML). Tag-aware extraction only
 * fires for real HTML; for serialized JSON it falls back to picking the
 * first two distinct chromatic colors in document order, which tends to
 * land on header/nav then a CTA color for most real layouts.
 */
export function extractThemeColors(source: string): ExtractedTheme {
  const theme: ExtractedTheme = {};

  const navTag = extractOpeningTag(source, "nav") || extractOpeningTag(source, "header");
  if (navTag) {
    const c = firstChromaticColorIn(navTag);
    if (c) theme.primary = c;
  }
  const btnTag = extractButtonLikeTag(source);
  if (btnTag) {
    const c = firstChromaticColorIn(btnTag);
    if (c) theme.accent = c;
  }

  if (!theme.primary || !theme.accent) {
    const seen = new Set<string>();
    const matches = source.match(HEX_OR_RGB_RE) || [];
    for (const raw of matches) {
      const hex = normalizeColor(raw);
      if (!hex || !isChromatic(hex) || seen.has(hex)) continue;
      seen.add(hex);
      if (!theme.primary) {
        theme.primary = hex;
      } else if (!theme.accent && hex !== theme.primary) {
        theme.accent = hex;
      }
      if (theme.primary && theme.accent) break;
    }
  }

  return theme;
}
