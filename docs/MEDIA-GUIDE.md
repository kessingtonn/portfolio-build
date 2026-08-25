# Adding your photos, videos and project details

Every placeholder on the site comes from one file: **`assets/js/data.js`**. There is no CMS and no
database — you edit that file, save, refresh. This guide shows exactly what to change.

- [Where the files go](#1-where-the-files-go)
- [Replace a photo placeholder](#2-replace-a-photo-placeholder)
- [Replace a video placeholder](#3-replace-a-video-placeholder)
- [A complete project, field by field](#4-a-complete-project-field-by-field)
- [Which field shows up where](#5-which-field-shows-up-where)
- [Export settings that keep the site fast](#6-export-settings-that-keep-the-site-fast)
- [Adding or renaming a category](#7-adding-or-renaming-a-category)
- [The hero background clip](#8-the-hero-background-clip)
- [Checklist before you publish](#9-checklist-before-you-publish)

---

## 1. Where the files go

Keep one folder per project. The slug in the folder name should match the project's `id`:

```
assets/
  img/
    work/
      harper-elliot/
        cover.jpg          ← tile image for the project
        01-getting-ready.jpg
        02-ceremony.jpg
        03-confetti.jpg
      atlas-coffee/
        cover.jpg
        01-roastery.jpg
    clients/
      atlas-coffee.svg     ← optional real client logos
  video/
    hero-loop.mp4          ← the home page background clip
    work/
      harper-elliot/
        highlight.mp4
        highlight-preview.mp4   ← 6-second silent clip for hover
        vertical.mp4
```

Nothing enforces this layout — it is just the one the paths in this guide assume. Lowercase names
with hyphens, no spaces, keeps every host happy.

---

## 2. Replace a photo placeholder

Right now a gallery entry with no `src` draws a tinted rectangle. Add `src` and the real photograph
takes its place — nothing else changes.

**Before** (placeholder):

```js
gallery: stills(32, [
  { caption: 'Getting ready, north light', orientation: 'portrait' },
  { caption: 'The walk down' }
])
```

**After** (your photographs):

```js
gallery: stills(32, [
  {
    src: 'assets/img/work/harper-elliot/01-getting-ready.jpg',
    caption: 'Getting ready, north light',   // shown under the tile and in the viewer
    alt: 'Bride at a window in morning light', // for screen readers and SEO
    orientation: 'portrait'                   // portrait = tall tile, landscape = wide (default)
  },
  {
    src: 'assets/img/work/harper-elliot/02-walk.jpg',
    caption: 'The walk down',
    alt: 'Walking down the garden aisle'
  }
])
```

`stills()` is a small helper at the top of the portfolio section — it fills in the defaults so each
entry only names what makes it different. You can also write plain objects if you prefer.

**Mixed sets are fine.** Real photographs and placeholders can sit side by side while you work
through a backlog; the ones with `src` show the photo, the ones without keep the tinted block.

**Project tile image.** The tile in the work grid uses, in order: `cover`, the first gallery image
with a `src`, then a placeholder. To set it explicitly:

```js
cover: 'assets/img/work/harper-elliot/cover.jpg',
```

---

## 3. Replace a video placeholder

Films live in a `films: []` array, so one project can hold as many cuts as you like — a highlight
film, a vertical share, a teaser. Each film gets its own tile in the 16:9 or 9:16 reel.

### Option A — self-hosted (best quality, you own the file)

```js
films: [
  {
    title: 'Highlight film',
    duration: '6:12',
    orientation: 'horizontal',                                   // horizontal | vertical
    poster: 'assets/img/work/harper-elliot/film-still.jpg',      // optional tile still
    preview: 'assets/video/work/harper-elliot/highlight-preview.mp4', // plays on hover
    video: { type: 'file', src: 'assets/video/work/harper-elliot/highlight.mp4' }
  }
]
```

Self-hosting means the file counts against your hosting bandwidth. Fine for a handful of trimmed
films; for a dozen full features, use B or C.

### Option B — YouTube

```js
video: { type: 'youtube', id: 'dQw4w9WgXcQ' }
```

The `id` is the part after `v=` in `https://www.youtube.com/watch?v=dQw4w9WgXcQ`. The player only
loads when someone clicks — no YouTube script runs before that — and the viewer gets a
"Watch on YouTube" link automatically.

### Option C — Vimeo

```js
video: { type: 'vimeo', id: '76979871' }
```

The `id` is the number in `https://vimeo.com/76979871`. Vimeo Pro accounts can also give you a
direct `.mp4` link, which you can use with `type: 'file'` instead.

### Hover previews

YouTube and Vimeo embeds **cannot** be used as hover previews, so those films need their own
`preview` file. Self-hosted films fall back to the film itself if you do not set one — fine for a
short clip, wasteful for a 6-minute master, so export a small dedicated preview:

```bash
ffmpeg -i highlight.mp4 -ss 00:00:12 -t 6 -an -vf scale=960:-2 \
  -c:v libx264 -crf 30 -movflags +faststart highlight-preview.mp4
```

Previews are skipped automatically on touch devices, on data-saver, on slow connections, and for
visitors who ask for reduced motion — so they never cost a mobile visitor anything.

---

## 4. A complete project, field by field

This is a whole entry with every option filled in. Copy it, change the values, drop it into the
`projects` array in `assets/js/data.js`.

```js
{
  /* --- identity --- */
  id: 'harper-elliot',            // unique slug; also the anchor link on the category page
  title: 'Harper & Elliot',       // shown on the tile and in the viewer
  category: 'weddings',           // fashion | events | weddings | portraits | commercial | brand
  year: '2026',                   // shown next to the category on the tile

  /* --- presentation --- */
  featured: true,                 // include on the home page grid
  wide: true,                     // tile spans two columns in the work grid
  hue: 32,                        // 0–360, tints any remaining placeholders
  blurb: 'A two-day celebration in a walled garden — shot on a single 35mm prime.',
  tags: ['Wedding film', 'Photography', '6 min'],   // chips in the viewer
  cover: 'assets/img/work/harper-elliot/cover.jpg',

  /* --- films --- */
  films: [
    {
      title: 'Highlight film',
      duration: '6:12',
      orientation: 'horizontal',
      poster: 'assets/img/work/harper-elliot/film-still.jpg',
      preview: 'assets/video/work/harper-elliot/highlight-preview.mp4',
      video: { type: 'file', src: 'assets/video/work/harper-elliot/highlight.mp4' },
      link: 'https://vimeo.com/yourchannel/harper-elliot'   // optional "watch full film" target
    },
    {
      title: 'Vertical share cut',
      duration: '0:58',
      orientation: 'vertical',
      video: { type: 'file', src: 'assets/video/work/harper-elliot/vertical.mp4' }
    }
  ],

  /* --- photographs --- */
  gallery: stills(32, [
    { src: 'assets/img/work/harper-elliot/01.jpg', caption: 'Getting ready', alt: '…', orientation: 'portrait' },
    { src: 'assets/img/work/harper-elliot/02.jpg', caption: 'Vows', alt: '…' }
  ]),

  /* --- the details block --- */
  details: {
    client: 'Harper & Elliot',
    location: 'Somerset, England',
    date: 'June 2026',
    services: ['Wedding film', 'Photography'],
    deliverables: [
      '6-minute highlight film',
      '520 edited images',
      '60-second vertical cut'
    ],
    credits: [
      { role: 'Director & lead film', name: 'Zangrid Studios' },
      { role: 'Photography',          name: 'Zangrid Studios' },
      { role: 'Second shooter',       name: 'Sam Okafor' },
      { role: 'Venue',                name: 'The Walled Garden' }
    ]
  }
}
```

Everything except `id`, `title` and `category` is optional:

- no `films` → the project is photography only
- no `gallery` → film only
- no `details` → the details block is skipped for that project
- no `src` anywhere → placeholders, exactly as the site ships today

---

## 5. Which field shows up where

| Field | Where it appears |
| ----- | ---------------- |
| `title`, `year`, `category` | Project tile caption, viewer title |
| `cover` / first `gallery` image | Project tile image |
| `blurb` | Under the tile title in the viewer, and in the details block |
| `tags` | Chips in the viewer |
| `films[].title`, `.duration` | Film tile caption and the 16:9 / 9:16 badge |
| `films[].orientation` | Which reel it lands in, and the shape of the player |
| `films[].poster` | Film tile image |
| `films[].preview` | The clip that plays on hover |
| `gallery[].caption` | Under each photo tile, and in the photo viewer |
| `gallery[].alt` | Screen readers, image SEO |
| `gallery[].orientation` | `portrait` gives a tall tile in the grid |
| `details.client/location/date/services` | The spec list on the category page |
| `details.deliverables` | The "Delivered" list |
| `details.credits` | The credits column |
| `featured` | Whether it appears on the home page |

---

## 6. Export settings that keep the site fast

**Photographs** — long edge 2000px, JPEG quality 80, sRGB, metadata stripped:

```bash
# one file
magick input.jpg -resize 2000x2000\> -quality 80 -strip 01.jpg

# a whole folder
for f in raw/*.jpg; do
  magick "$f" -resize 2000x2000\> -quality 80 -strip "assets/img/work/harper-elliot/$(basename "$f")"
done
```

Aim for under 400 KB per image. The grid loads images lazily, so a long gallery is fine — a single
6 MB export is not.

**Films** — 1080p, H.264, faststart so playback begins before the file finishes downloading:

```bash
# horizontal master
ffmpeg -i master.mov -vf scale=1920:-2 -c:v libx264 -crf 21 -preset slow \
  -c:a aac -b:a 160k -movflags +faststart highlight.mp4

# vertical cut (9:16 — export it vertical, don't crop a landscape master)
ffmpeg -i vertical-master.mov -vf scale=1080:-2 -c:v libx264 -crf 21 -preset slow \
  -c:a aac -b:a 160k -movflags +faststart vertical.mp4
```

If a film is over ~50 MB, put it on YouTube or Vimeo and use `type: 'youtube'` / `type: 'vimeo'`
instead. Some hosts (GitHub Pages included) also cap individual files at 100 MB.

---

## 7. Adding or renaming a category

Categories live at the top of the portfolio section in `data.js`:

```js
{
  id: 'automotive',            // used in `category:` on projects and in URLs
  label: 'Automotive',         // nav and filter label
  page: 'automotive.html',     // the page that gets generated
  title: 'Automotive',         // the <h1>
  lede: 'One line under the title.',
  intro: 'A paragraph for the top of the page.'
}
```

Then regenerate the pages:

```bash
node tools/build-categories.js
```

That rewrites one HTML page per category from `templates/category.template.html`. **Edit the
template, never the generated pages** — `fashion.html`, `events.html`, `weddings.html`,
`portraits.html`, `commercial.html` and `brand.html` are overwritten every time the script runs.

Add the new page to the nav dropdown in each page's `<nav class="nav__links">` block, or leave it
reachable from the work page filters and the category strip.

---

## 8. The hero background clip

The home page hero reads `site.heroVideo` in `data.js` — a list of sources, first playable one wins:

```js
heroVideo: [
  { src: 'assets/video/hero-loop.webm', type: 'video/webm' },
  { src: 'assets/video/hero-loop.mp4',  type: 'video/mp4'  }
]
```

10–20 seconds, no audio track, under about 5 MB. Delete the remote sample entry once yours is in
place. Behind it sits an animated gradient that covers the moments before the video paints and any
case where it cannot play at all, so the hero never looks broken.

---

## 9. Checklist before you publish

- [ ] Replace the sample film URLs (`commondatastorage.googleapis.com`) with your own work
- [ ] Drop in `assets/video/hero-loop.mp4` and uncomment it in `site.heroVideo`
- [ ] Set real `src` values on the galleries you want live
- [ ] Write `alt` text on every photograph
- [ ] Update `site.email`, `site.phone`, `site.location` and the social links
- [ ] Set `site.formEndpoint` so enquiries reach your inbox
- [ ] Replace the placeholder crew portraits on `about.html`
- [ ] Check the prices on `packages.html` are yours
- [ ] Swap the client names in `clients` for real ones (add `logo:` paths if you have the files)
- [ ] Run `node tools/build-categories.js` if you changed any category
