# Zangrid Studios — photo & video portfolio

A static, dependency-free portfolio site for a photo and film studio: looping video hero,
filterable portfolio with an embedded video player, package/pricing pages for weddings,
portraits, brand and UGC, and a working enquiry form.

No build step, no framework, no npm install. Open `index.html` or serve the folder.

```bash
python3 -m http.server 8000     # then visit http://localhost:8000
```

## Pages

| File            | What it is |
| --------------- | ---------- |
| `index.html`    | Home — looping video hero, statement, featured work, services, client logo strip, reviews |
| `work.html`     | Portfolio grid with service filters (`?c=wedding` deep-links a filter), plus dedicated 16:9 (`#films`) and 9:16 (`#vertical`) reels with hover previews |
| `packages.html` | Wedding / portrait / brand / UGC packages, add-ons, FAQ |
| `reviews.html`  | Client reviews, filterable by service, with average rating |
| `enquiry.html`  | Enquiry form with package prefill (`?service=wedding&package=wedding-signature`) |
| `about.html`    | Studio, crew, kit |
| `404.html`      | Not-found page |

The primary nav uses two dropdowns — **Work** (all work / horizontal / vertical) and **Studio**
(the studio / client reviews). They open on hover, on click, and with the keyboard (`ArrowDown`
to enter, `Escape` to leave); the mobile menu lists the same links as sub-items.

## Everything you edit lives in `assets/js/data.js`

* `site` — studio name, email, phone, location, social links, form endpoint, hero fallback clip.
  Anything marked `data-site="email"` etc. in the HTML is filled from here, so changing the
  email once changes it everywhere.
* `clients` — the moving "brands & companies we have worked with" strip. Add
  `logo: 'assets/img/clients/name.svg'` to an entry to use a real logo file instead of the
  typographic wordmark; `note` becomes the tooltip.
* `projects` — the portfolio. One entry per project.
* `packages` — the four services and their three tiers each. The packages page, the enquiry
  form's package dropdown and the enquiry sidebar summary all read from this.
* `testimonials` — client reviews. Drives the reviews page, the quote strips (`featured: true`
  picks those) and the average rating shown on the home page and reviews hero.

### Adding a project

```js
{
  id: 'smith-wedding',              // unique, used in URLs
  title: 'Ada & Sam',
  client: 'Yorkshire, England',
  category: 'wedding',              // wedding | portrait | brand | ugc
  format: 'film',                   // film | photo
  orientation: 'horizontal',        // horizontal (16:9) | vertical (9:16)
  year: '2026',
  featured: true,                   // shows on the home page
  wide: true,                       // spans two grid columns (optional)
  portrait: true,                   // 4:5 tile instead of 16:10 (optional)
  hue: 32,                          // tints the generated placeholder tile
  blurb: 'One line about the project.',
  tags: ['Wedding film', '6 min'],
  poster: 'assets/img/ada-still.jpg',      // optional still
  preview: 'assets/video/ada-preview.mp4', // plays on hover (optional)
  video: { type: 'youtube', id: 'dQw4w9WgXcQ' }
}
```

`orientation` decides which dedicated reel the project appears in on the work page — the 16:9
section, or the 9:16 section where tiles and the player both switch to a portrait stage. Shoot
and export vertical work at 9:16; the tiles crop to fill, so a cropped landscape master will look
like one.

### Previews

Hovering (or tabbing to) a tile plays a muted, looping preview inside it. The clip comes from
`preview` if set, otherwise from `video.src` for self-hosted films — YouTube and Vimeo projects
need their own `preview` file, since their embeds cannot be used this way. Keep previews short
and small (5–8 seconds, ~1 MB); they load only on hover, and are skipped entirely for
reduced-motion users, data-saver mode, slow connections, and touch devices with no hover.

`video` accepts three shapes — omit it entirely for a photo-only story:

```js
video: { type: 'youtube', id: 'VIDEO_ID' }                  // youtube-nocookie embed
video: { type: 'vimeo',   id: '123456789' }                 // vimeo player embed
video: { type: 'file',    src: 'assets/video/film.mp4' }    // self-hosted
```

Every project also gets a "Watch on YouTube / Vimeo / Open full film" link in the player.
Override the destination with `link: 'https://…'`.

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
* Project tiles with no `poster` render a generated gradient placeholder tinted by `hue`.
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
