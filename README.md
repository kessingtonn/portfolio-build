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

**New here? [`docs/MEDIA-GUIDE.md`](docs/MEDIA-GUIDE.md) is a step-by-step walkthrough of putting
your own photos and videos into every slot on the site. Check your progress any time with:**

```bash
node tools/import-media.js --scaffold   # make the folders, one per project
#  … drop your photos and films into them …
node tools/import-media.js --dry-run    # see what it would wire up
node tools/import-media.js              # write it into data.js
node tools/check-media.js               # what's in place, what's still missing
```

The importer reads the files themselves: captions come from filenames, portrait/landscape from the
real pixel dimensions, and 16:9 / 9:16 and film durations straight out of the MP4.

## Everything you edit lives in `assets/js/data.js`

* `site` — studio name, email, phone, location, social links, form endpoint, hero fallback clip.
  Anything marked `data-site="email"` etc. in the HTML is filled from here, so changing the
  email once changes it everywhere.
* `crew` — the portraits, names and roles on the studio page.
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
video: { type: 'drive',   id: 'GOOGLE_DRIVE_FILE_ID' }               // google drive player
```

`drive` plays the file from Google Drive. The file must be shared as *Anyone with the link can view*,
and the ID is the long string in its share link (`drive.google.com/file/d/<ID>/view`). Drive's player
works but is basic and can hit viewing limits on busy days, so move hero pieces to YouTube or Vimeo
when you can. Changing `type` and `id` is all it takes. The `preview` clip (a 6-second silent loop
in `assets/video/work/`) and the `poster` still stay on the site, so tiles and slideshows never wait on
Drive.

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

## Gallery layouts

Every photography and film section can be shown five ways. Pick the defaults in `site.layouts` in
`data.js`:

```js
layouts: {
  photos: 'seamless',     // photography sections
  films: 'cinema',        // 16:9 reels
  vertical: 'filmstrip',  // 9:16 reels
  switcher: true          // let visitors change the view
}
```

| Layout      | What it looks like | Works for |
| ----------- | ------------------ | --------- |
| `grid`      | Even tiles with captions underneath (the original look) | photos, films |
| `masonry`   | Columns, each frame at its natural shape, no cropping | photos |
| `seamless`  | Full-width rows edge to edge with hairline gaps; every row the same height, captions on hover | photos, films |
| `filmstrip` | One full-width row you swipe, drag or arrow through, snapping frame to frame | photos, films |
| `cinema`    | One big frame at a time, crossfading on a timer, with a thumbnail rail, play/pause and a progress line. Films loop a muted preview on the big frame | photos, films |

A category can use its own layouts on its own page. Add `layouts` to its entry:

```js
{ id: 'weddings', …, layouts: { photos: 'cinema' } }
```

With `switcher: true`, a small control sits above each section and the visitor's choice is
remembered in their browser. Set it to `false` to lock every section to your choice. A grid can also
be fixed in the HTML with `data-layout="masonry"`.

Seamless and masonry use each photograph's real shape. They read it from the image once it loads, so
nothing needs adding. To avoid a small reflow, you can give `width`/`height` (or `ratio`) on a
gallery entry.

**The viewer** pages through the whole section you opened it from: photos and films together,
across projects. Arrow keys, on-screen arrows, swiping, and swiping down to close all work, and there
is a full-screen button. It preloads the frames either side so paging doesn't wait. Clicking a
project card pages through that project's films and then its photographs.

Autoplay, crossfades and the slow zoom are switched off for visitors who ask for reduced motion or
are on data-saver. Slideshows pause on hover, on focus, and when scrolled out of view.

## The hero video

The looping background is driven by `site.heroVideo` in `data.js` — a list of sources, first
playable one wins. Out of the box it points at a remote sample clip. Drop your own loop into
`assets/video/` and uncomment the local entries:

An entry can carry `media`, so phones and desktops get different cuts. The site ships with the
original vertical clip for portrait screens and a 16:9 version for everything else:

```js
heroVideo: [
  { src: 'assets/video/hero-loop-portrait.mp4', type: 'video/mp4', media: '(max-aspect-ratio: 4/5)' },
  { src: 'assets/video/hero-loop.mp4',          type: 'video/mp4' }
]
```

Without `media`, the list works as before:

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

* The portfolio is real work: 33 projects, 77 photographs and 45 films. Project titles, blurbs, years
  and categories were drafted from the files themselves, so check them and correct any names.
* Crew photos on `about.html` and client logos are still placeholders.
* Reviews link to the old sample projects, so their "See the work" links are hidden until each
  `testimonials[].project` is pointed at a real project id.
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

## Going live (public website)

The site is static files with no build step. Pick one host:

**GitHub Pages (free, already set up in this repo)**
1. On GitHub, open the repo, then **Settings → Pages**. Under *Build and deployment* set
   **Source: GitHub Actions**.
2. Merge the work into the default branch. `.github/workflows/pages.yml` checks every media path,
   copies only the public files and publishes them. The address appears under *Settings → Pages*
   (`https://<user>.github.io/portfolio-build/`), usually within a minute.
3. Custom domain: add it on that same page, then point the domain's DNS at GitHub, either a `CNAME`
   to `<user>.github.io` or the four GitHub `A` records. Tick *Enforce HTTPS*.

**Netlify or Cloudflare Pages (also free; these also apply the security headers)**
Import the repo. The build command and output folder are in `netlify.toml` (for Cloudflare use the
same values: command `sh tools/ci-site.sh _site`, output `_site`). `_headers` adds a strict
Content-Security-Policy, HSTS, `X-Frame-Options`, `nosniff`, `Referrer-Policy` and
`Permissions-Policy` to every page.

## Enquiries straight to Gmail

Set `site.enquiryEmail` in `assets/js/data.js` to the studio's Gmail address. The form then posts
through [FormSubmit](https://formsubmit.co), which is free and needs no account:

1. Send yourself a test enquiry from the live site.
2. FormSubmit emails that Gmail address once, asking you to **Activate** the form. Click it.
3. From then on every enquiry arrives as a tidy table email. **Reply** answers the client directly.

Tip: after activating, FormSubmit gives you a random alias for your address. Use it as
`site.formEndpoint = 'https://formsubmit.co/ajax/<alias>'` so your real address never appears in
the page source.

With no address set, the form still works: it writes the email for the visitor and offers **Send
with Gmail** or **Use my email app**. The enquiry page's contact card and the phone action bar also
link straight to the inbox, with a copy button.

Spam protection: a hidden honeypot field, a 3-second time trap (bots submit instantly), and a
20-second resend cooldown.

## Instagram and TikTok

Set `site.instagram`, `site.tiktok` and their `…Handle` values in `data.js`. They feed:
- the **Follow the work** section on the home page (a card per network plus a swipeable strip of
  your vertical films)
- icons in the desktop nav, the phone action bar, and the enquiry contact card
- the footer and mobile menu

They are links rather than embedded feeds on purpose. Instagram and TikTok embeds load several
megabytes of third-party script, track visitors, and would weaken the security policy.

## Security

- No inline JavaScript and no third-party scripts, so the Content-Security-Policy allows scripts from
  this site only.
- Fonts are self-hosted (`assets/fonts`), so no request reaches Google and nothing breaks if a CDN
  does.
- Every outbound link uses `rel="noopener noreferrer"`.
- All data rendered into pages is escaped.
- No secrets in the repository. The only external services are FormSubmit for enquiries and Google
  Drive for full films.

## Seeing it without deploying

```bash
python3 -m http.server 8000        # then open http://localhost:8000
```

Or bundle every page into one self-contained file you can email, open from a USB stick, or drop
anywhere:

```bash
node tools/build-preview.js        # writes preview.html
```

`preview.html` inlines the CSS and JS and swaps pages with a small router, so all twelve pages work
with no server behind it. It is a preview artefact — deploy the real multi-page site for anything
public.

## Deploying

Any static host works — the repo root *is* the site.

* **Netlify / Vercel / Cloudflare Pages** — no build command, publish directory `.`
* **GitHub Pages** — Settings → Pages → deploy from branch, root folder
* **Any web server** — copy the folder

## Browser support & accessibility

Modern evergreen browsers. Keyboard-navigable throughout, skip link, focus-visible outlines,
focus-trapped lightbox, `aria-live` form errors, and full `prefers-reduced-motion` handling.
