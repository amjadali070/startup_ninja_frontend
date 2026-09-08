// Single source of truth for the responsive-preview breakpoints, shared by
// both preview surfaces: the dashboard's PreviewModal (WebBuilder.tsx, a
// plain React component) and the in-editor preview (WebsiteBuilderStudio.tsx,
// built through the GrapesJS Studio SDK's declarative `layoutToggle` layout
// schema — not JSX, so the two can't share actual rendering code without a
// much larger SDK-integration change). They previously used different,
// silently-inconsistent values (mobile was 420-600px on the dashboard but
// 568-768px in the editor) — this fixes that by giving both the same numbers.
export const PREVIEW_DEVICE_SIZES: Record<
  "desktop" | "tablet" | "mobile",
  { width: string; maxWidth: string }
> = {
  desktop: { width: "100%", maxWidth: "1200px" },
  tablet: { width: "768px", maxWidth: "992px" },
  mobile: { width: "420px", maxWidth: "600px" },
};
