# Run4Ricky Foundation

> Keep moving forward.

The website of the **Run4Ricky Foundation**, a spinal cord injury (SCI) charity
built around one true story. In December 2022 Riccardo "Ricky" Barbieri fractured
his neck (C4/C5) in a fall in the Omani mountains. What followed, a coma, months of
rehabilitation, relearning to move, became a movement: Ricky and his twin brother
run marathons with a team of friends to fund spinal cord research and support
everyone living with paralysis.

- **Live site:** https://run4ricky.xyz
- **Hosting:** GitHub Pages (custom domain via `CNAME`)

---

## What it's built with

Deliberately simple. No framework, no build step, no dependencies to install. Open
the files and read them.

| Layer | Choice | Why |
|------|--------|-----|
| Markup | Hand-written **HTML5** | Static, portable, hostable anywhere |
| Styling | Vanilla **CSS** (`@layer`, custom properties, **OKLCH** colour) | One design system, no preprocessor |
| Behaviour | Vanilla **JavaScript** (ES modules, `IntersectionObserver`) | No runtime, no bundler |
| Type | **Saira Condensed** + **Archivo** (Google Fonts) | Athletic condensed display + clean geometric body |
| Icons | **Font Awesome 6** (social) + hand-drawn inline **SVG** (milestones, UI) | Crisp, recolourable, no extra requests |
| Imagery | Real photos/videos + AI **atmospheric** backgrounds (Higgsfield) | Real story stays real; AI is texture only |

The whole site is plain files served statically. There is nothing to compile.

---

## Project structure

```
.
├── index.html              Home: hero, story, recovery timeline
├── events-newsletter.html  Events & the team (carousel)
├── media.html              Photo/video galleries with lightbox
├── disabled-living.html    Guides, adaptive-equipment resources, community
├── donate.html             Donation tiles, impact framing, trust
├── CNAME                   Custom domain for GitHub Pages
├── README.md
├── .gitignore
│
├── css/
│   └── style.css           The entire design system (tokens + components)
├── js/
│   └── script.js           Nav, scroll reveals, parallax, quotes, lightbox, carousel
│
├── docs/                   Design & product context (not shipped as pages)
│   ├── PRODUCT.md          Audience, voice, principles
│   └── DESIGN.md           Colour, type, motion, component decisions
│
└── assets/
    ├── brand/              logo.png, hero.jpg, texture.jpg (AI atmospheric)
    ├── images/             Photos (marathons, rehab, team) + portofino/
    ├── video/              Clips (accident, rehab, races) + portofino/
    └── guides/             Downloadable PDF guides & handbooks
```

---

## Design system (the short version)

Full rationale lives in [`docs/DESIGN.md`](docs/DESIGN.md). In brief:

- **Direction:** bold and energetic, but **light**. Warm off-white surfaces,
  near-black text, one electric-orange accent that carries the energy.
- **Colour:** defined once as OKLCH custom properties in `css/style.css`
  (`--paper`, `--ink`, `--orange`, …). Change a token, change the whole site.
- **Type:** `Saira Condensed` for big kinetic headlines, `Archivo` for body.
- **Motion:** scroll-reveals and a subtle hero parallax, all disabled under
  `prefers-reduced-motion`.

## Accessibility

This is a disability charity, so accessibility is treated as the point, not a
checkbox: semantic landmarks, a skip link, visible focus rings, keyboard-operable
nav / carousel / lightbox, `prefers-reduced-motion` honoured, and reveal animations
that **degrade to fully visible content if JavaScript is off** (progressive
enhancement via the `html.js` flag).

---

## Run it locally

No install needed. From the project root, start any static server:

```bash
# Python 3
python -m http.server 8000
```

Then open http://localhost:8000. (Opening the files directly with `file://` mostly
works, but a local server is recommended so the ES-module script loads cleanly.)

## Deploy

The site is served by **GitHub Pages** from the default branch. `CNAME` points it at
`run4ricky.xyz`. Push to the branch and Pages redeploys. There is no build step.

---

## Editing guide

- **Text & story:** edit the relevant `*.html` file directly.
- **Colours, spacing, type:** change the tokens at the top of `css/style.css`.
- **Add a gallery item** (`media.html`): copy a `<button class="tile">` block. For a
  photo set `data-full`; for a video set `data-video` + `data-poster` and include the
  play-badge `<span class="play">`. The lightbox picks it up automatically.
- **Add a timeline milestone** (`index.html`): copy an `<li>` inside `.timeline`
  (node icon + `.t-date` + `.t-body` + `.t-media`).
- **Images:** drop files in `assets/images/`, reference them, and add `loading="lazy"`.

---

## Credits

Story and media: the Barbieri family and the Run4Ricky team. Funds raised support
[Spinal Research](https://spinal-research.org). Not sponsored by any of the
equipment or travel resources listed.
