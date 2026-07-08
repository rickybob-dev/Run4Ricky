# DESIGN.md — Run4Ricky Foundation

Direction: **bold & energetic, but light and centered.** Warm porcelain surfaces,
near-black type, a rose-ember red that carries the energy, and one athletic display
face. The feeling is a start line at sunrise: charged, human, forward-leaning.

Palette name: **"Second Wind"** (art-directed with Fable 5; replaced the earlier
flat-orange scheme). Every accent was chosen to live *inside* the warm golden-sunrise
photography so the colour and the images never fight.

## Color

Strategy: light-dominant, warm-neutral surfaces + one committed red accent + an amber
secondary for graphic touches. OKLCH throughout, no pure black/white. Defined once as
tokens at the top of `css/style.css`.

```
--paper      oklch(0.978 0.007 80)   /* page bg, warm porcelain   ~#faf7f3 */
--paper-2    oklch(0.94 0.013 80)    /* alternate band            ~#f0eae2 */
--card       oklch(0.995 0.003 90)   /* cards / raised            ~#fefdfb */
--line       oklch(0.89 0.013 80)    /* hairlines                 ~#dfdad1 */
--ink        oklch(0.215 0.014 60)   /* headings / text           ~#1e1813 */
--ink-dim    oklch(0.42 0.017 58)    /* body copy                 ~#5f564e */
--ink-mute   oklch(0.50 0.016 60)    /* muted / captions          ~#6a615a */
--orange     oklch(0.545 0.195 22)   /* PRIMARY rose-ember        ~#c92838 */
--orange-hi  oklch(0.605 0.185 24)   /* hover                     ~#e23a48 */
--ember      oklch(0.52 0.115 66)    /* readable bronze accent    ~#8a6a20 */
--amber      oklch(0.76 0.14 78)     /* graphic-only amber        ~#e1a536 */
--night      oklch(0.18 0.014 55)    /* dark bands, lightbox      */
--on-night   oklch(0.965 0.010 85)   /* text on dark              */
```

Contrast: ink on porcelain is ~16:1 (AAA). The primary red takes **white/`--card`
text** (~5.5:1, AA). `--amber` is graphic-only (fills, the timeline spine): it fails as
text on light, so never use it for type. `--ember` is the readable warm accent (kickers
on `.invert` bands). The token name `--orange` was kept for the primary even though it is
now red, so component rules didn't have to change.

## Typography

Two families, both Google-hosted, both distinctive (off the impeccable reflex-reject list).

- **Display / headlines: `Big Shoulders Display`** (weights 600–900). A tall condensed
  industrial grotesque with real athletic character. Used uppercase for the hero word,
  section titles, dates, stat-style numbers, gallery captions.
- **Body / UI: `Hanken Grotesk`** (400/500/600/700). Warm, highly legible workhorse for
  long copy and donation flows.

Load only those weights, `display=swap`, `<link rel=preconnect>` to gstatic. Scale is
fluid `clamp()` with ≥1.25 ratio; the hero word is enormous. Headlines use
`text-wrap: balance`; body uses `text-wrap: pretty`; dates/amounts use `tabular-nums`.

## Layout

- Light, centered composition (the client's explicit preference). Section heads, hero,
  leads, form, and footer are centre-aligned; the story block and galleries carry
  intentional editorial variety so "centered" never reads as a generic template.
- Container: `--content = min(92vw, 1120px)`. Fluid spacing via `clamp()`; the first
  section after the hero opens with extra air for rhythm.
- Cards are used only where they're the right affordance; the 3-up card rows are
  de-uniformed (lead card wider) rather than N identical columns.

## Components

- **Nav (sticky):** brand + page links on the LEFT; Instagram icon + Donate pill on the
  RIGHT. Active link + hover share an origin-swept underline. Mobile: brand + IG + Donate
  stay in the bar, links collapse into a hamburger slide-panel.
- **Hero (home):** full-viewport warm marathon image (runners + a racing wheelchair at
  sunrise) with the huge "KEEP MOVING FORWARD" headline, one mission line, two CTAs. A
  soft light wash + text halo keep centred dark text legible over the photo. Optionally
  upgraded to a muted autoplay-loop background **video** with the image as poster
  fallback (reduced-motion → static image).
- **Interior page heroes (`.phero`):** each page has its own warm marathon-context
  background (`assets/brand/bg-events|media|living|donate.jpg`) under a light wash.
- **Timeline:** centered vertical spine, milestones alternating left/right on desktop
  (collapses to a single left spine on mobile), rose→amber gradient spine, illustrated
  SVG node per milestone that pops in on scroll. Two graphic tiles (logo, home photo)
  use `contain` so they fit rather than crop.
- **Media galleries — editorial mosaic:** a 6-col grid with size-modifier tiles
  (`--feature`, `--tall`, `--big`, default) so images vary in size; the lead shot carries
  an on-image caption. Video tiles show a distinct poster frame + a play badge. Clicking
  any tile opens the navigable lightbox.
- **Lightbox:** click a tile → enlarge, with ‹ › arrows + counter + caption, cycling the
  whole gallery in DOM order; plays video in place. Keyboard + Escape supported.
- **Team carousel (events):** bold portrait + long quote; prev/dots/next in a control bar
  below the slide (never over the caption). Crops favour faces (`object-position`).
- **Donate:** suggested-amount tiles deep-linking to PayPal with the amount prefilled,
  impact framing, a trust aside (Spinal Research certificate + charity numbers).
- **Buttons:** primary = red fill / near-white text; ghost = ink border. Icons nudge on
  hover; real pressed state.

## Motion

Differentiated scroll choreography (not one fade for everything): headlines fade, body
rises, cards stagger, gallery/story blocks reveal, timeline nodes pop as each milestone
enters. Hero background parallax. Everything is gated behind `.js` (progressive
enhancement: content is fully visible with no JS) and fully disabled under
`@media (prefers-reduced-motion: reduce)`.

## Imagery

- Real photos/videos of Ricky and the team are primary.
- Warm golden-sunrise marathon imagery throughout (harmonises with the red/amber palette).
- AI (Higgsfield): hero + interior-page backgrounds, atmospheric bands, the hero video,
  distinct video poster frames (ffmpeg), and a custom SVG icon set. Never fabricate
  photos of Ricky as if real, never fake events; AI silhouettes/atmospheres only.
- Alt text is specific and present-tense.

## Accessibility

WCAG 2.1 AA. Keyboard-complete (nav, carousel, lightbox), visible focus, skip link,
semantic landmarks + heading order, `prefers-reduced-motion` honored, media has controls
(no autoplay with sound), colour is never the sole signal, target sizes ≥44px.

## Stack & constraints

Hand-written HTML/CSS/JS, no framework, no build step. `css/` + `js/` + `assets/{brand,
images,video,guides}/`; pages at root for GitHub Pages URLs; custom domain via `CNAME`.
