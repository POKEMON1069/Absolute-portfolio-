/**
 * Contrast check — APCA (W3C draft, APCA-W3 0.1.9) with WCAG 2 ratios.
 *
 * The Web Interface Guidelines ask for APCA over WCAG 2 because it models
 * perceptual contrast (polarity-aware, size-aware). This script is the source
 * of the numbers quoted in README §7.
 *
 * Run: npm run check:contrast
 */

const mainTRC = 2.4;
const Rco = 0.2126729;
const Gco = 0.7151522;
const Bco = 0.072175;
const normBG = 0.56;
const normTXT = 0.57;
const revTXT = 0.62;
const revBG = 0.65;
const blkThrs = 0.022;
const blkClmp = 1.414;
const scale = 1.14;
const loOffset = 0.027;
const deltaYmin = 0.0005;

const hex = (value) => {
  const v = value.replace("#", "");
  const full =
    v.length === 3
      ? v
          .split("")
          .map((c) => c + c)
          .join("")
      : v;
  return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16));
};

/** Blend a foreground with alpha over an opaque background. */
const composite = (fg, alpha, bg) =>
  fg.map((channel, i) => Math.round(channel * alpha + bg[i] * (1 - alpha)));

const luminance = (rgb) =>
  rgb.reduce(
    (sum, channel, i) =>
      sum + [Rco, Gco, Bco][i] * Math.pow(channel / 255, mainTRC),
    0,
  );

const softClamp = (Y) =>
  Y < blkThrs ? Y + Math.pow(blkThrs - Y, blkClmp) : Y;

function apca(fg, bg) {
  const Ytxt = softClamp(luminance(fg));
  const Ybg = softClamp(luminance(bg));
  if (Math.abs(Ybg - Ytxt) < deltaYmin) return 0;
  if (Ybg > Ytxt) {
    const s = (Math.pow(Ybg, normBG) - Math.pow(Ytxt, normTXT)) * scale;
    return (s < 0.001 ? 0 : s - loOffset) * 100;
  }
  const s = (Math.pow(Ybg, revBG) - Math.pow(Ytxt, revTXT)) * scale;
  return (s > -0.001 ? 0 : s + loOffset) * 100;
}

function wcag(fg, bg) {
  const r = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const l = (rgb) => 0.2126 * r(rgb[0]) + 0.7152 * r(rgb[1]) + 0.0722 * r(rgb[2]);
  const a = l(fg) + 0.05;
  const b = l(bg) + 0.05;
  return a > b ? a / b : b / a;
}

/** APCA minimums by role, from the Lc lookup table. */
const MIN = {
  body: 75, // 14–18px regular
  large: 45, // 24px+ regular / 18px+ bold
  label: 60, // small text, any weight
  nonText: 30, // icons, borders, graphics
};

/**
 * Pairs are written as [label, foreground, alpha|null, background, minimum].
 * `minimum: null` marks an informational row (measured, not enforced) — used
 * for the vendored footer's as-delivered opacities, which the unlayered
 * contrast floor in `app/globals.css` supersedes.
 *
 * Alpha is composited over the background first, which is what the browser
 * paints for Tailwind's `/NN` colour modifiers.
 */
const PAIRS = [
  // Light surfaces
  ["h1 name · neutral-900 / slate-50", "#171717", null, "#f8fafc", MIN.large],
  ["h1 name (muted) · neutral-500", "#737373", null, "#f8fafc", MIN.large],
  ["body · neutral-600 / slate-50", "#525252", null, "#f8fafc", MIN.body],
  ["body · neutral-600 / white", "#525252", null, "#ffffff", MIN.body],
  ["eyebrow · neutral-600 / slate-50", "#525252", null, "#f8fafc", MIN.label],
  ["cta label · slate-50 / neutral-900", "#f8fafc", null, "#171717", MIN.body],
  // Footer — values below are what the CSS floor actually paints
  ["footer copyright · floor #cccccc", "#cccccc", null, "#0a0a0d", MIN.body],
  ["footer tagline · floor #cccccc", "#cccccc", null, "#0a0a0d", MIN.body],
  ["footer link · floor #d4d4d8", "#d4d4d8", null, "#0a0a0d", MIN.body],
  ["footer column title · zinc-50 on dark", "#fafafa", null, "#0a0a0d", MIN.label],
  ["footer social icon · zinc-400 on dark", "#a1a1aa", null, "#0a0a0d", MIN.nonText],
  ["info: footer as shipped · zinc-400/76", "#a1a1aa", 0.76, "#0a0a0d", null],
  ["info: footer as shipped · zinc-300/70", "#d4d4d8", 0.7, "#0a0a0d", null],
  ["info: footer as shipped · zinc-300/78", "#d4d4d8", 0.78, "#0a0a0d", null],
  // Dark surfaces
  ["contact h2 · zinc-100 / #0b0b0e", "#f4f4f5", null, "#0b0b0e", MIN.large],
  ["contact h2 (muted) · zinc-400", "#a1a1aa", null, "#0b0b0e", MIN.large],
  ["contact label · zinc-300", "#d4d4d8", null, "#0b0b0e", MIN.label],
  ["contact social link · zinc-300", "#d4d4d8", null, "#0b0b0e", MIN.body],
  ["contact location · zinc-300", "#d4d4d8", null, "#0b0b0e", MIN.body],
  ["info: contact h2 (muted) as first drafted · zinc-500", "#71717a", null, "#0b0b0e", null],
  ["info: contact label as first drafted · zinc-400", "#a1a1aa", null, "#0b0b0e", null],
  // Overlays
  ["brand menu item · zinc-100 / neutral-950", "#f4f4f5", null, "#0a0a0a", MIN.body],
  ["brand menu hint · zinc-400 (decorative)", "#a1a1aa", null, "#0a0a0a", MIN.nonText],
];

let failures = 0;
let enforced = 0;
const rows = PAIRS.map(([label, fg, alpha, bg, min]) => {
  const bgRGB = hex(bg);
  const fgRGB = hex(fg);
  const effective = alpha === null ? fgRGB : composite(fgRGB, alpha, bgRGB);
  const lc = apca(effective, bgRGB);
  const ratio = wcag(effective, bgRGB);
  const magnitude = Math.abs(lc);
  const informational = min === null;
  const pass = informational || magnitude >= min;
  if (!informational) {
    enforced += 1;
    if (!pass) failures += 1;
  }
  return {
    label,
    lc: magnitude.toFixed(1),
    ratio: ratio.toFixed(2),
    min: informational ? "—" : String(min),
    verdict: informational ? "info" : pass ? "pass" : "FAIL",
  };
});

const width = Math.max(...rows.map((r) => r.label.length));
console.log(`${"pair".padEnd(width)}  Lc     WCAG   min   verdict`);
console.log("-".repeat(width + 30));
for (const row of rows) {
  console.log(
    `${row.label.padEnd(width)}  ${row.lc.padStart(5)}  ${row.ratio.padStart(5)}  ${row.min.padStart(3)}   ${row.verdict}`,
  );
}
console.log(
  `\n${enforced - failures}/${enforced} enforced pairs meet their APCA minimum.`,
);
console.log(
  "Informational rows are measured, not enforced (as-delivered values kept for the record).",
);
process.exitCode = failures === 0 ? 0 : 1;
