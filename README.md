# Zangrid Studios — photo & video portfolio

A static, dependency-free portfolio site for a photo and film studio: looping video hero,
six category collections with photo and film grids, an embedded video player and photo viewer,
package/pricing pages, client reviews, and a working enquiry form.

No build step, no framework, no npm install. Open `index.html` or serve the folder.

```bash
python3 -m http.server 8000     # then visit http://localhost:8000
```

## Pages

| File            | What it is |
| --------------- | ---------- |
| `index.html`    | Home — looping video hero, statement, featured work, the six collections, client logo strip, reviews |
| `work.html`     | Everything, filterable by category (`?c=weddings` deep-links a filter), plus 16:9 (`#films`) and 9:16 (`#vertical`) reels and a mixed photo grid |
| `fashion.html` `events.html` `weddings.html` `portraits.html` `commercial.html` `brand.html` | One presentation page per category — films in both orientations, a photo grid, and full project details. **Generated** by `node tools/build-categories.js` from `templates/category.template.html` |
| `packages.html` | Wedding / portrait / brand / UGC packages, add-ons, FAQ |
| `reviews.html`  | Client reviews, filterable by service, with average rating |
| `enquiry.html`  | Enquiry form with package prefill (`?service=wedding&package=wedding-signature`) |
| `about.html`    | Studio, crew, kit |
| `404.html`      | Not-found page |

The primary nav uses two dropdowns — **Work** (all work, then the six categories) and **Studio**
(the studio / client reviews). They open on hover, on click, and with the keyboard (`ArrowDown`
to enter, `Escape` to leave); the mobile menu lists the same links as sub-items.

**New here? [`docs/MEDIA-GUIDE.md`](docs/MEDIA-GUIDE.md) walks through putting your own photos and
videos into the placeholders, field by field.**

## Everything you edit lives in `assets/js/data.js`

* `site` — studio name, email, phone, location, social links, form endpoint, hero fallback clip.
  Anything marked `data-site="email"` etc. in the HTML is filled from here, so changing the
  email once changes it everywhere.
* `clients` — the moving "brands & companies we have worked with" strip. Add
  `logo: 'assets/img/clients/name.svg'` to an entry to use a real logo file instead of the
  typographic wordmark; `note` becomes the tooltip.
* `categories` — the six collections, each with the copy for its own page.
* `projects` — the portfolio. One entry per project, holding films, photographs and details.
* `packages` — the four services and their three tiers each. The packages page, the enquiry
  form's package dropdown and the enquiry sidebar summary all read from this.
* `testimonials` — client reviews. Drives the reviews page, the quote strips (`featured: true`
  picks those) and the average rating shown on the home page and reviews hero.

### Adding a project

Each project can hold **films**, **photographs**, or both, plus a details block:

```js
{
  id: 'smith-wedding',            // unique slug
  title: 'Ada & Sam',
  category: 'weddings',           // fashion | events | weddings | portraits | commercial | brand
  year: '2026',
  featured: true,                 // include on the home page
  hue: 32,                        // tints any remaining placeholders
  blurb: 'One line about the project.',
  tags: ['Wedding film', '6 min'],
  cover: 'assets/img/work/smith/cover.jpg',

  films: [
    { title: 'Highlight film', duration: '6:12', orientation: 'horizontal',
      preview: 'assets/video/work/smith/preview.mp4',
      video: { type: 'file', src: 'assets/video/work/smith/highlight.mp4' } },
    { title: 'Vertical cut', duration: '0:58', orientation: 'vertical',
      video: { type: 'youtube', id: 'dQw4w9WgXcQ' } }
  ],

  gallery: stills(32, [
    { src: 'assets/img/work/smith/01.jpg', caption: 'Vows', alt: 'Exchanging vows', orientation: 'portrait' }
  ]),

  details: {
    client: 'Ada & Sam',
    location: 'Yorkshire, England',
    date: 'June 2026',
    services: ['Wedding film', 'Photography'],
    deliverables: ['6-minute highlight film', '500 edited images'],
    credits: [{ role: 'Direction', name: 'Zangrid Studios' }]
  }
}
```

`video` accepts three shapes:

```js
video: { type: 'file',    src: 'assets/video/work/smith/film.mp4' }  // self-hosted
video: { type: 'youtube', id: 'VIDEO_ID' }                           // youtube-nocookie embed
video: { type: 'vimeo',   id: '123456789' }                          // vimeo player
```

Gallery entries with no `src` draw a tinted placeholder, so you can build a project out before the
photographs are ready.

**Full instructions — folder layout, export settings, what each field controls, hosting options —
are in [`docs/MEDIA-GUIDE.md`](docs/MEDIA-GUIDE.md).**

### Adding a category

Add an entry to `categories` in `data.js`, then regenerate the pages:

```bash
node tools/build-categories.js
```

Edit `templates/category.template.html`, never the generated category pages — they are overwritten
on every run.

## The hero video

The looping background is driven by `site.heroVideo` in `data.js` — a list of sources, first
playable one wins. Out of the box it points at a remote sample clip. Drop your own loop into
`assets/video/` and uncomment the local entries:

```js
heroVideo: [
  { src: 'assets/video/hero-loop.webm', type: 'video/webm' },
  { src: 'assets/video/hero-loop.mp4',  type: 'video/mp4'  },
  { src: 'https://…/fallback.mp4',      type: 'video/mp4'  }   // optional safety net
]
```

Aim for 10–20 seconds, 1920×1080, no audio, under ~5 MB:

```bash
ffmpeg -i source.mov -t 15 -an -vf scale=1920:-2 -c:v libx264 -crf 26 -movflags +faststart \
  assets/video/hero-loop.mp4
ffmpeg -i assets/video/hero-loop.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -an assets/video/hero-loop.webm
```

The hero also has an animated gradient fallback behind the video, a play/pause control, and it
respects `prefers-reduced-motion` (video paused, fallback shown). It pauses itself when scrolled
out of view.

## Placeholder media — replace before launch

* Portfolio clips point at Google's public sample videos so the player works immediately.
* Photo tiles and project tiles with no `src` render a generated gradient placeholder tinted by `hue`.
* Crew photos on `about.html` are the same placeholders.
* Prices, copy, stats, testimonials and contact details are plausible drafts, not real terms.

## Making the enquiry form deliver

Out of the box the form validates, then hands the visitor a pre-filled email (because no endpoint
is configured). To receive submissions properly, set `formEndpoint` in `data.js` to any service
that accepts a JSON `POST`:

```js
formEndpoint: 'https://formspree.io/f/xxxxxxxx'
```

Works with Formspree, Basin, Formcarry, a Netlify function, or your own API. The payload includes
`name`, `email`, `phone`, `service`, `serviceLabel`, `package`, `packageLabel`, `date`,
`location`, `budget`, `source`, `message`, `consent` and a `_subject` line. A hidden honeypot
field (`company`) is dropped before sending.

Package buttons deep-link into the form: `enquiry.html?service=brand&package=brand-story`
preselects the service, the package and the sidebar summary.

## Deploying

Any static host works — the repo root *is* the site.

* **Netlify / Vercel / Cloudflare Pages** — no build command, publish directory `.`
* **GitHub Pages** — Settings → Pages → deploy from branch, root folder
* **Any web server** — copy the folder

## Browser support & accessibility

Modern evergreen browsers. Keyboard-navigable throughout, skip link, focus-visible outlines,
focus-trapped lightbox, `aria-live` form errors, and full `prefers-reduced-motion` handling.
