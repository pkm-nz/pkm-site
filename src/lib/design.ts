import D from "../data/design.json";

// Heading fonts on offer in /admin → Design. Each brings its Google Fonts request and a bold weight that suits it.
const FONTS: Record<string, { css: string; family: string; weight: number }> = {
  "Libre Franklin": { css: "Libre+Franklin:wght@600..800", family: '"Libre Franklin"', weight: 750 },
  "Manrope": { css: "Manrope:wght@600..800", family: "Manrope", weight: 800 },
  "Inter Tight": { css: "Inter+Tight:wght@600..800", family: '"Inter Tight"', weight: 700 },
  "Familjen Grotesk": { css: "Familjen+Grotesk:wght@600..700", family: '"Familjen Grotesk"', weight: 700 },
  "Fraunces": { css: "Fraunces:opsz,wght@9..144,600..700", family: "Fraunces", weight: 650 },
  "Archivo": { css: "", family: "Archivo", weight: 750 },   // already loaded for the body text
};
const SCALE: Record<string, number> = { Small: 0.85, Medium: 1, Large: 1.15 };

const font = FONTS[D.headingFont] ?? FONTS["Libre Franklin"];
export const headingFontCss = font.css;
export const designVars =
  `--head:${font.family},"Helvetica Neue",Arial,sans-serif;--hw:${font.weight};` +
  `--hs:${SCALE[D.headingSize] ?? 1};--ts:${SCALE[D.textSize] ?? 1}`;
