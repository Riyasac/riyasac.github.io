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
assets/js/posts.js             Blog post list; drives the homepage Blog section and /blog/
blog/index.html                Blog index with tag filter
blog/<slug>/index.html         One folder per post
blog/_post-template.html       Starting point for new posts (noindex)
assets/img/blog/<slug>/          Post images; cover.webp for the page, cover.jpg for link previews
assets/docs/Riyas_AC_Resume.pdf  Resume served by the download buttons
assets/img/riyas-portrait.webp   Hero portrait, background removed
assets/img/favicon/            Favicons and logo files; riyas.jpeg is the link-preview image
site.webmanifest               Web app manifest
robots.txt, sitemap.txt        Crawler files
```

## Sections

Hero, About, Impact, Experience, Projects, Skills, Blog, Education and Awards, Contact.

All content comes from the resume. Do not add figures, projects or claims that are not on it.

## Features

- Light and dark themes. Follows the system setting until the visitor uses the toggle; the choice is saved in `localStorage`.
- Sticky header with scroll progress bar and active-section highlight.
- Reveal-on-scroll with staggered grids, count-up figures, typing stack card, timeline line draw, floating stat chips, tech marquee and card spotlight.
- All looping motion stops under `prefers-reduced-motion`.
- Skip link, visible focus states, semantic headings, WCAG AA colour contrast in both themes.

## Add a blog post

1. Copy `blog/_post-template.html` to `blog/<slug>/index.html`, e.g. `blog/django-signals/index.html`.
2. Replace every `POST_*` placeholder and write the article inside `#postBody`. Each `h2` needs an `id`; the "On this page" list is built from them.
3. Put images in `assets/img/blog/<slug>/`. Export `cover.webp` (page) and `cover.jpg` (social previews) at 1024 x 535.
4. Add an entry at the top of `assets/js/posts.js` (newest first) and a line to `sitemap.txt`.
5. Remove the `<meta name="robots" content="noindex">` line from the new page.
6. If the post was first published on Medium, keep its `canonical` pointing at the Medium URL and keep the "Originally published on Medium" line.

Blog pages use root-relative paths (`/assets/...`), so preview them through the local server below rather than opening the file directly.

## Run locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. The homepage also works opened directly from disk; blog pages need the server.

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
