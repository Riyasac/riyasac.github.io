# riyasac.github.io

Personal portfolio of **Riyas A C**, Senior Backend Developer (Python, Django, REST APIs, PostgreSQL, Golang).

Live site: <https://riyasac.github.io/>

## Stack

- Static HTML, CSS and vanilla JavaScript. No build step.
- Bootstrap 5.3 (grid, navbar collapse) and Bootstrap Icons, loaded from jsDelivr.
- Google Fonts: Manrope and JetBrains Mono.
- Hosted on GitHub Pages from the `master` branch.

## Structure

```text
index.html                     Page markup, SEO metadata, JSON-LD
assets/css/style.css           Design tokens, layout, light and dark themes, motion
assets/js/scripts.js           Interactions (see below)
assets/docs/Riyas_AC_Resume.pdf  Resume served by the download buttons
assets/img/riyas-portrait.webp   Hero portrait, background removed
assets/img/favicon/            Favicons and logo files; riyas.jpeg is the link-preview image
site.webmanifest               Web app manifest
robots.txt, sitemap.txt        Crawler files
```

## Sections

Hero, About, Impact, Experience, Projects, Skills, Education and Awards, Contact.

All content comes from the resume. Do not add figures, projects or claims that are not on it.

## Features

- Light and dark themes. Follows the system setting until the visitor uses the toggle; the choice is saved in `localStorage`.
- Sticky header with scroll progress bar and active-section highlight.
- Reveal-on-scroll with staggered grids, count-up figures, typing stack card, timeline line draw, floating stat chips, tech marquee and card spotlight.
- All looping motion stops under `prefers-reduced-motion`.
- Skip link, visible focus states, semantic headings, WCAG AA colour contrast in both themes.

## Run locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly in a browser also works.

## Common edits

| Change | Where |
| --- | --- |
| Resume PDF | Replace `assets/docs/Riyas_AC_Resume.pdf` (keep the file name) |
| A metric (e.g. 60%) | `index.html`: hero chips, Impact `data-count`, Experience bullet, featured project. Update the resume PDF too |
| Hero stat chips | `.float-chip` spans in `index.html`; positions are the `.chip-*` rules in `style.css` |
| Typing stack lines | `data-typing` on the stack card `<code>`, lines separated by `\|` |
| Colours | Tokens in `:root` and `:root[data-theme="dark"]` at the top of `style.css` |
| Portrait | Replace `assets/img/riyas-portrait.webp` with a transparent cut-out of similar proportions |

## Deploy

Commit and push to `master`. GitHub Pages publishes the site within a minute or two.
