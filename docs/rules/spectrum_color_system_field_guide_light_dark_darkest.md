# Spectrum Color System – Field Guide

A single, practical reference that merges **Color System** and **Color Fundamentals** into a consumable guide for design + engineering.

---

## 1) Big picture
- **Goal:** Color reinforces meaning & hierarchy, not decoration. Maintain legibility across Light, Dark, and Darkest.
- **Three token families:**
  1) **Global colors** – base palettes (grays + hues). Not theme‑aware by themselves.
  2) **Theme‑specific tokens** – adapt per theme. Use for **text, icons, borders, focus**, anything that must meet WCAG over background layers.
  3) **Static colors** – fixed across themes. Use for **solid color backgrounds/fills** with **black/white** foreground depending on contrast.
- **Alias tokens:** Convenience names that point to underlying tokens (e.g., background layers).
- **Perceptual uniformity:** Indices step in even perceptual deltas. Don’t manually lighten/darken with code.

---

## 2) Background layers (for app framing only)
Use aliases below to frame the product UI (chrome, panels, canvas surroundings). **Do not** sprinkle raw global grays for framing.

| Alias | Light maps to | Dark/Darkest map to | Notes |
|---|---|---|---|
| **background-base** | `gray-200` | `gray-50` | Base/pasteboard/surrounding space. In Light, often too low contrast for content. |
| **background-layer-1** | `gray-100` | `gray-75` | Headers/footers/toolbars/panels. |
| **background-layer-2** | `gray-50` | `gray-100` | Primary content surface (not artboards). |

> Background layer colors are **alias tokens** that reference different global grays per theme.

### App framing patterns
- **Pro apps (option A):** Header/toolbar/panels = layer‑1; content = layer‑2; pasteboard/surrounds = base.
- **Pro apps (option B):** All chrome at layer‑2; no layer‑1 (e.g., platform convention).
- **Lightweight/content apps:** Most surfaces = layer‑2; content clusters may step down to layer‑1; **never** use base.

---

## 3) Theme‑specific vs static

### Theme‑specific tokens (adaptive)
- Use when color is applied to **text, icons, borders, indicators**, etc.
- Guaranteed WCAG contrast against background layers for the supported themes.
- Example: error text/icon uses theme‑specific **red** at appropriate index per theme.

### Static tokens (fixed)
- Use when color is used as a **background/fill** with text or icons over it.
- Pair with **white** text/icons except these require **black** to preserve hue identity while meeting contrast: **yellow, orange, chartreuse, cyan**.
- Example: `static-blue-900` chip with **white** label; `static-yellow-300` badge with **black** label.

---

## 4) Interactive states (index stepping)
- **Theme‑specific:**
  - **Light themes:** State progression gets **darker** (e.g., default 900 → hover 1000 → down 1100).
  - **Dark themes:** State progression gets **lighter** (indices increase towards lighter variants).
- **Static:** Always get **darker** regardless of theme.
- **Keyboard focus:** Typically equals hover color + separate focus ring token.

---

## 5) Two‑tone color pairing (optional accents)
- Background: **index‑100** of a hue (e.g., `magenta-100`).
- Foreground icon/illustration: **index‑900** in Light; **700–1200** range in Dark/Darkest (pick by hue for best legibility). Example: **yellow** prefers ~1200; **red** often ~700.
- Always include a **text label**; not CVD‑safe by itself.

---

## 6) Accessibility & contrast
- Use theme‑specific tokens for text/icons over background layers – they’re tuned to meet or exceed WCAG on `background‑base/layer‑1/layer‑2` per theme.
- Avoid placing equally‑light/saturated contrasting hues adjacent (chromostereopsis). Prefer static black/white components on color/image backgrounds.
- When in doubt, **measure contrast** for all supported themes.

---

## 7) Don’ts
- **Don’t create custom colors** in product UI; stay within Spectrum.
- **Don’t** programmatically lighten/darken Spectrum tokens in code; step indices instead.
- **Don’t** use transparency to emulate Spectrum colors (only exceptions: overlays, shadows, highlight selection styles). For on‑image text, use the **transparent black/white** palette provided.
- **Don’t** use theme colors for data viz; use the dedicated **data visualization** palettes.

---

## 8) Practical token wiring (CSS)

### Background alias tokens
```css
/* Light */
:root[data-theme="light"] {
  --bg-base:        var(--spectrum-global-color-gray-200);
  --bg-layer-1:     var(--spectrum-global-color-gray-100);
  --bg-layer-2:     var(--spectrum-global-color-gray-50);
}

/* Dark + Darkest (same aliases → different underlying values per theme) */
:root[data-theme="dark"],
:root[data-theme="darkest"] {
  --bg-base:        var(--spectrum-global-color-gray-50);
  --bg-layer-1:     var(--spectrum-global-color-gray-75);
  --bg-layer-2:     var(--spectrum-global-color-gray-100);
}
```

### Foregrounds (example theme‑specific mappings)
```css
/* Example – grayscale text tiers that adapt by theme via theme‑specific tokens */
:root[data-theme] {
  --fg-primary:   var(--spectrum-global-color-gray-900); /* Light→dark text; Dark→light text */
  --fg-secondary: var(--spectrum-global-color-gray-800);
  --fg-muted:     var(--spectrum-global-color-gray-700);
  --border-subtle:var(--spectrum-global-color-gray-400);
}
```

### Component scaffolding
```css
.app      { background: var(--bg-base); }
.header,
.footer,
.sidebar  { background: var(--bg-layer-1); }
.content  { background: var(--bg-layer-2); }

.text-primary   { color: var(--fg-primary); }
.text-secondary { color: var(--fg-secondary); }
.text-muted     { color: var(--fg-muted); }
.border-subtle  { border-color: var(--border-subtle); }
```

### Static color backgrounds (pairing rules)
```css
.badge--blue     { background: var(--spectrum-global-color-static-blue-900); color: white; }
.badge--yellow   { background: var(--spectrum-global-color-static-yellow-300); color: black; }
.badge--orange   { background: var(--spectrum-global-color-static-orange-300); color: black; }
.badge--chartreuse{ background: var(--spectrum-global-color-static-chartreuse-300); color: black; }
.badge--cyan     { background: var(--spectrum-global-color-static-cyan-300); color: black; }
```

### Interaction example (theme‑specific blue)
```css
.button {
  /* default */
  background: var(--spectrum-global-color-blue-900);
}
.button:hover,
.button:focus-visible { background: var(--spectrum-global-color-blue-1000); }
.button:active        { background: var(--spectrum-global-color-blue-1100); }
```

---

## 9) Reference palettes (from your pasted values)
Use these when you need explicit numbers (engineering handoff, audits, or quick checks). The **indices** are stable; the **perceived contrast** is tuned per theme.

### Light – Grays (samples)
- `gray-50` `#ffffff`, `gray-75` `#fdfdfd`, `gray-100` `#f8f8f8`, `gray-200` `#e6e6e6`, `gray-300` `#d5d5d5`, `gray-400` `#b1b1b1`, `gray-500` `#909090` … `gray-900` `#000000`

### Dark – Grays (samples)
- `gray-50` `#1d1d1d`, `gray-75` `#262626`, `gray-100` `#323232`, `gray-200` `#3f3f3f`, `gray-300` `#545454`, … `gray-900` `#ffffff`

### Darkest – Grays (samples)
- `gray-50` `#000000`, `gray-75` `#0e0e0e`, `gray-100` `#1d1d1d`, `gray-200` `#303030`, `gray-300` `#4b4b4b`, … `gray-900` `#ffffff`

> For full hue scales (blue, green, red, etc.), continue to use the indices you pasted; choose indices per the interaction rules and background contrast.

---

## 10) Implementation tips for your stack
- **UXP + React Aria headless bridge:** Apply the global **UXP reset** first; then set the background aliases on the root. Components inherit theme‑specific tokens via CSS vars.
- **No transparency for base colors:** Only use transparency for overlays/shadows/highlights; otherwise pick the correct token.
- **Data viz:** Use **Spectrum data visualization** palettes, not theme/static tokens.

---

## 11) Quick checklist
- [ ] App framing uses only `background‑base/layer‑1/layer‑2` aliases.
- [ ] Text/icons/borders use **theme‑specific** tokens and pass WCAG on all supported themes.
- [ ] Static backgrounds pair with correct **black/white** text.
- [ ] Interactive states step indices (no color math in code).
- [ ] No ad‑hoc colors; no transparency hacks (except allowed cases).



---

# 12) Typography (v5.1.0)

## Typefaces
Use **Adobe Clean**, **Adobe Clean Serif**, **Adobe Clean Han** (CJK), and **Source Code Pro**. Ship fallbacks (see below) and prefer system-available fonts where licensing/loading is constrained.

## Components
- **Heading** – page/section titles and major hierarchy.
- **Body** – component text and running paragraphs.
- **Detail** – supplemental/ancillary text.
- **Code** – inline/blocks of code.

## Type scale (major second, ×1.125)
Use only these sizes for any custom text outside the components.

| Token | Desktop | Mobile |
|---|---:|---:|
| `font-size-50` | 11px | 13px |
| `font-size-75` | 12px | 15px |
| `font-size-100` (base) | 14px | 17px |
| `font-size-200` | 16px | 19px |
| `font-size-300` | 18px | 22px |
| `font-size-400` | 20px | 24px |
| `font-size-500` | 22px | 27px |
| `font-size-600` | 25px | 31px |
| `font-size-700` | 28px | 34px |
| `font-size-800` | 32px | 39px |
| `font-size-900` | 36px | 44px |
| `font-size-1000` | 40px | 49px |
| `font-size-1100` | 45px | 55px |
| `font-size-1200` | 50px | 62px |
| `font-size-1300` | 60px | 70px |

## Text formatting rules
- **Bold**: in-sentence hierarchy, button labels, referring to UI nouns.
- **Italic**: placeholders & image captions only (*not* for CJK/Han scripts).
- **Underline**: **links only** (either default or hover depending on link design).
- **Strong/Emphasis**: semantic emphasis (strong = heavier; emphasis = italic or heavier for CJK).

## Line-height multipliers
- **Heading & Detail**: `1.3` (Latin/Arabic/Hebrew), `1.5` (Han scripts).
- **Body & Code**: `1.5` (Latin/Arabic/Hebrew), `1.7` (Han scripts).
- **Within components**: `1.3` (Latin/Arabic/Hebrew), `1.5` (Han scripts).

## Usage guidelines
- Use Spectrum’s scale; avoid ad‑hoc sizes.
- On mobile, reuse component size tokens; when down‑sizing, do it intentionally (e.g., desktop `400` → mobile `200`).
- Sentence case for UX copy.
- Use **tabular, lining** figures for numeric UI, right-align numeric columns.
- Paragraph width target ≈ **70ch** (keep **50–120ch**); avoid ultra‑narrow columns.
- Avoid indentation; separate paragraphs with margins.
- Avoid full justification; prefer ragged‑right (left aligned) for paragraphs.
- Define semantic **heading levels** independent of size.
- Pair Heading/Body/Detail/Code by equal sizes or deliberate stepped relationships.

## Fallback fonts (by priority)
- **Adobe Clean** → *Source Sans Pro*, San Francisco, Roboto, Segoe UI, Trebuchet MS, Lucida Grande
- **Adobe Clean Serif** → *Source Serif Pro*, Georgia
- **Source Code Pro** → Monaco
- **Adobe Clean Japanese** → Source Han Japanese, Yu Gothic, メイリオ, ヒラギノ角ゴ Pro W3, Hiragino Kaku Gothic Pro W3, Osaka, ＭＳＰゴシック, MS PGothic
- **Adobe Clean Chinese (Traditional)** → Source Han Traditional, MingLiu, Heiti TC Light
- **Adobe Clean Chinese (Simplified)** → Source Han Simplified C, SimSun, Heiti SC Light
- **Adobe Clean Korean** → Source Han Korean, Malgun Gothic, Apple Gothic

---

# 13) Object styles (v5.0.0)

## Rounding
- **Default rounding**: 4px (desktop) / 5px (mobile) – most components.
- **Small rounding**: e.g., Checkbox; radius tied to border thickness (inner square, outer rounded).
- **Full rounding**: sparing, commonly basic buttons/CTAs.

## Border width
- **1px**: common borders & small dividers (text fields, popovers, tables).
- **2px**: emphasized borders & medium dividers; focus ring is **2px**.
- **4px**: large dividers only.

## Drop shadow
- One default style; scales by platform size; **opacity increases in dark/darkest** for perceptual parity. Use shadows for **transient, dismissible** elements (menus, etc.); most other elevation is done by color/layer change.

---

# 14) Motion (v5.0.0)

## Principles
**Purposeful** (supports task), **Intuitive** (natural accel/decel), **Seamless** (never distracts).

## Easing
- **Spectrum ease‑out**: `cubic-bezier(0, 0, 0.40, 1)` – entering/fading in (most common).
- **Spectrum ease‑in**: `cubic-bezier(0.50, 0, 1, 1)` – exiting/fading out.
- **Spectrum ease‑in‑out**: `cubic-bezier(0.45, 0, 0.40, 1)` – travel/movement.

## Duration tokens

| Token | ms | Type |
|---|---:|---|
| `duration-100` | 130 | Micro |
| `duration-200` | 160 | Micro |
| `duration-300` | 190 | Micro |
| `duration-400` | 220 | Micro |
| `duration-500` | 250 | Macro |
| `duration-600` | 300 | Macro |
| `duration-700` | 350 | Macro |
| `duration-800` | 400 | Macro |
| `duration-900` | 450 | Macro |
| `duration-1000` | 500 | Macro |

## Effect building blocks
Combine easing + duration for patterns like **fade in**, **slide/slide‑fade**, **fill/color**, **expand‑down**, **scale/scale‑fade**.

---

# 15) States

## User‑initiated
- **Hover** – on pointer over.
- **Down** – on press/touch.
- **Keyboard focus** – hover visuals + **2px** blue ring/border.

## Component‑defined
- **Default** – resting.
- **Disabled** – visible but not interactive.
- **Selected** – communicates user choice.
- **Dragged** – communicates grab/move.
- **Error** – communicate invalid/blocked; always pair color with icon/label.

> Interactive color follows Spectrum’s **index stepping**: theme‑specific colors get **darker in Light** and **lighter in Dark/Darkest**; static colors always get **darker**.

---

# 16) Iconography

## Characteristics
- **Metaphors**: simple, consistent, additive; reuse existing metaphors where possible; follow platform‑specific variants sparingly (e.g., *Share*).
- **Appearance**: mostly filled; some mixed fill/stroke; stroke width varies by metaphor.
- **Color**: monochrome; varies by state & theme; keep contrast.

## Sizes & layout
- **Sizes**: 18px (desktop), 22px (mobile). Pixel‑snapped and optimized per size.
- **Stroke**: desktop 1px/2px; mobile 1.5px/2px (thin for lines, thick for balance).
- **Corner radius**: micro rounding on outer angles; inner corners square.
- **Safe area**: designs include padding for balance/placement; pixel‑snap rules may nudge optical centering.

## Types
- **Workflow icons**: navigational/action metaphors, same size per platform.
- **UI icons**: atomic glyphs (arrows, close, etc.), various sizes per component spec.

## Usage
- Respect the **filled** design (don’t switch to outline ad‑hoc).
- **Don’t scale** icons arbitrarily; use the provided sizes.
- Be cautious with **letters**; okay for standardized concepts (Bold/Italic/Underline, code tags), otherwise language‑specific.

---

# 17) Handy CSS snippets

```css
/* Typography scale helpers */
:root {
  --font-size-50: 11px;  --font-size-75: 12px;  --font-size-100: 14px;
  --font-size-200: 16px; --font-size-300: 18px; --font-size-400: 20px;
  --font-size-500: 22px; --font-size-600: 25px; --font-size-700: 28px;
  --font-size-800: 32px; --font-size-900: 36px; --font-size-1000: 40px;
  --font-size-1100: 45px; --font-size-1200: 50px; --font-size-1300: 60px;
}

/* Line-height utilities (Latin/Arabic/Hebrew defaults) */
.lh-heading, .lh-detail { line-height: 1.3; }
.lh-body, .lh-code { line-height: 1.5; }
/* Han scripts override */
:is([lang|="zh"],[lang|="ja"],[lang|="ko"]) .lh-heading,
:is([lang|="zh"],[lang|="ja"],[lang|="ko"]) .lh-detail { line-height: 1.5; }
:is([lang|="zh"],[lang|="ja"],[lang|="ko"]) .lh-body,
:is([lang|="zh"],[lang|="ja"],[lang|="ko"]) .lh-code { line-height: 1.7; }

/* Motion tokens */
:root {
  --ease-out: cubic-bezier(0, 0, 0.40, 1);
  --ease-in: cubic-bezier(0.50, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.45, 0, 0.40, 1);
  --duration-100: 130ms; --duration-200: 160ms; --duration-300: 190ms; --duration-400: 220ms;
  --duration-500: 250ms; --duration-600: 300ms; --duration-700: 350ms; --duration-800: 400ms;
  --duration-900: 450ms; --duration-1000: 500ms;
}

.fade-in   { animation: fade var(--duration-200) var(--ease-out); }
@keyframes fade { from { opacity: 0 } to { opacity: 1 } }

/* Focus ring */
.focus-ring { outline: 2px solid var(--spectrum-global-color-blue-900); outline-offset: 2px; }
```

