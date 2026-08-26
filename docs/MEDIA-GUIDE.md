# Adding your photos and videos — step by step

Every image and every film on this site is listed in one file: **`assets/js/data.js`**. You copy
files into `assets/`, point at them from that file, and refresh the browser. No CMS, no build step,
no database.

Work through the steps in order, or jump to whichever slot you're filling:

| Step | What you're filling | Where it shows |
| ---- | ------------------- | -------------- |
| [0](#step-0--set-up-once) | Set up once | — |
| [1](#step-1--export-your-files) | Export your files | everywhere |
| [2](#step-2--the-home-page-hero-clip) | Home hero clip | the big looping background |
| [3](#step-3--category-hero-stills) | Category hero stills | top of each category page |
| [4](#step-4--photographs) | Photographs | photo grids + the viewer |
| [5](#step-5--films) | Films | 16:9 and 9:16 reels |
| [6](#step-6--hover-previews-and-film-posters) | Previews & posters | film tiles |
| [7](#step-7--crew-portraits) | Crew portraits | the studio page |
| [8](#step-8--client-logos) | Client logos | the moving brand strip |
| [9](#step-9--project-covers) | Project covers | tiles on work + home |
| [10](#step-10--favicon-and-share-image) | Favicon & share image | browser tab, link previews |
| [11](#step-11--check-your-work) | Check your work | — |

---

## Step 0 — set up once

Get the site running so you can see each change as you make it:

```bash
git clone -b claude/zangrid-studios-portfolio-ax32no https://github.com/kessingtonn/portfolio-build
cd portfolio-build
python3 -m http.server 8000
```

Open http://localhost:8000. Leave that running. Open `assets/js/data.js` in your editor — that's
the only file you'll edit in the steps below.

Two rules that save pain later:

- **Filenames**: lowercase, hyphens, no spaces — `01-first-look.jpg`, never `01 First Look.JPG`.
- **Paths are relative to the site root**, always starting `assets/…`, never `/assets/…` or
  `C:\Users\…`.

After any edit: save the file, then **hard refresh** the browser (`Ctrl`/`Cmd` + `Shift` + `R`).
A normal refresh may serve you the old cached `data.js`.

---

## Step 1 — export your files

Do this once for a batch of media, before you start pointing at it.

**Photographs** — long edge 2000px, quality 80, sRGB, metadata stripped:

```bash
# a whole folder at once
mkdir -p assets/img/work/harper-elliot
for f in ~/exports/harper-elliot/*.jpg; do
  magick "$f" -resize 2000x2000\> -quality 80 -strip \
    "assets/img/work/harper-elliot/$(basename "$f")"
done
```

No ImageMagick? Lightroom or Capture One: export JPEG, quality 80, long edge 2000px, sRGB.
Aim for under 400 KB per file.

**Films** — 1080p H.264, `+faststart` so playback begins before the download finishes:

```bash
mkdir -p assets/video/work/harper-elliot
ffmpeg -i ~/exports/highlight-master.mov -vf scale=1920:-2 \
  -c:v libx264 -crf 21 -preset slow -c:a aac -b:a 160k -movflags +faststart \
  assets/video/work/harper-elliot/highlight.mp4
```

Vertical cuts export vertical — `scale=1080:-2` from a 9:16 master. Never crop a landscape master
to fake it; the tiles crop to fill and it shows.

**If a film is over ~50 MB, don't self-host it.** Put it on YouTube or Vimeo and use step 5's
option B or C. (GitHub Pages also rejects individual files over 100 MB.)

---

## Step 2 — the home page hero clip

The looping background behind "Days worth keeping".

1. Export a 10–20 second silent loop, 1920×1080, under ~5 MB:

   ```bash
   ffmpeg -i source.mov -t 15 -an -vf scale=1920:-2 \
     -c:v libx264 -crf 26 -movflags +faststart assets/video/hero-loop.mp4
   ```

2. Optional but worth it — a WebM half the size for browsers that take it:

   ```bash
   ffmpeg -i assets/video/hero-loop.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -an \
     assets/video/hero-loop.webm
   ```

3. In `data.js`, find `site.heroVideo` and swap the commented lines for the sample:

   ```js
   heroVideo: [
     { src: 'assets/video/hero-loop.webm', type: 'video/webm' },
     { src: 'assets/video/hero-loop.mp4',  type: 'video/mp4'  }
   ]
   ```

   The list is tried in order — first one the browser can play wins. Delete the
   `commondatastorage.googleapis.com` entry; that's the sample clip.

4. Refresh the home page. The clip should fade in over the gradient within a second or two.

**Pick a clip that loops without a jarring cut** — slow camera movement, no hard scene changes, and
ideally the first and last frames are similar. It sits behind text, so avoid busy centres.

---

## Step 3 — category hero stills

The band at the top of `fashion.html`, `weddings.html` and the other four.

1. Export one wide frame per category, ~2400px wide, into `assets/img/heroes/`.

2. In `data.js`, find the `categories` array and set `heroImage` on the one you're filling:

   ```js
   {
     id: 'weddings',
     heroImage: 'assets/img/heroes/weddings.jpg',
     heroVideo: null,
     label: 'Weddings',
     …
   }
   ```

3. To use a moving backdrop instead, set `heroVideo` to a silent 8–15 second loop
   (`assets/video/heroes/weddings.mp4`). Keep `heroImage` set too — it becomes the poster frame
   while the clip loads, and what visitors with reduced-motion enabled see.

Leave both `null` and the hero keeps the animated gradient — which looks deliberate, not broken.

---

## Step 4 — photographs

This is the big one: the photo grids on each category page and on `work.html`.

Each project in `data.js` has a `gallery`. Right now the entries have no `src`, so each one draws a
tinted placeholder. Add `src` and your photograph takes its place.

**Before:**

```js
gallery: stills(32, [
  { caption: 'Getting ready, north light', orientation: 'portrait' },
  { caption: 'The walk down' }
])
```

**After:**

```js
gallery: stills(32, [
  {
    src: 'assets/img/work/harper-elliot/01-getting-ready.jpg',
    caption: 'Getting ready, north light',       // sits under the tile, and in the viewer
    alt: 'Bride at a window in morning light',   // screen readers + image search
    orientation: 'portrait'                      // tall tile; omit for a wide one
  },
  {
    src: 'assets/img/work/harper-elliot/02-walk.jpg',
    caption: 'The walk down',
    alt: 'Walking down the garden aisle'
  }
])
```

Notes that matter:

- **`orientation: 'portrait'`** makes a tall tile that spans two grid rows. Everything else is
  wide. Mixing them is what gives the grid its rhythm — aim for roughly one portrait in three.
- **Add as many entries as you like.** Ten to twenty per project reads well; the grid lazy-loads so
  a long set costs nothing until it's scrolled to.
- **Mixed sets are fine.** Entries with `src` show photographs, entries without keep their
  placeholder, so you can publish a project before every frame is retouched.
- **Order is the order they appear**, and the viewer's arrow keys move through them in that order.

---

## Step 5 — films

Each project has a `films` array. One entry per cut — a highlight film and a vertical share are two
entries in the same project, and each gets its own tile in the matching reel.

### Option A — self-hosted (best quality, you own the file)

```js
films: [
  {
    title: 'Highlight film',        // tile caption
    duration: '6:12',               // shown on the tile badge
    orientation: 'horizontal',      // horizontal → 16:9 reel, vertical → 9:16 reel
    video: { type: 'file', src: 'assets/video/work/harper-elliot/highlight.mp4' }
  }
]
```

### Option B — YouTube

```js
video: { type: 'youtube', id: 'dQw4w9WgXcQ' }
```

The id is the part after `v=` in `https://www.youtube.com/watch?v=dQw4w9WgXcQ`. Nothing from
YouTube loads until someone clicks play, and the viewer gets a "Watch on YouTube" link for free.

### Option C — Vimeo

```js
video: { type: 'vimeo', id: '76979871' }
```

The id is the number in `https://vimeo.com/76979871`. On a Vimeo Pro account you can also grab a
direct `.mp4` link and use option A with it.

**Which to choose:** self-host trimmed highlight films and vertical cuts (fast, no branding, no
recommendations at the end). Put full-length features and anything over ~50 MB on Vimeo or YouTube.

Add `link: 'https://vimeo.com/…'` to any film to point its "watch full film" button somewhere
specific — for example, the self-hosted highlight linking to the full feature on Vimeo.

---

## Step 6 — hover previews and film posters

**Previews** are the muted clips that play inside a tile when someone hovers it.

- Self-hosted films reuse their own file automatically — fine for a 20-second cut, wasteful for a
  6-minute master.
- YouTube and Vimeo films **cannot** preview from their embed, so they need their own file.

Export a small dedicated preview and point at it:

```bash
ffmpeg -i highlight.mp4 -ss 00:00:12 -t 6 -an -vf scale=960:-2 \
  -c:v libx264 -crf 30 -movflags +faststart highlight-preview.mp4
```

```js
{
  title: 'Highlight film',
  duration: '6:12',
  orientation: 'horizontal',
  preview: 'assets/video/work/harper-elliot/highlight-preview.mp4',
  poster:  'assets/img/work/harper-elliot/film-still.jpg',
  video:   { type: 'file', src: 'assets/video/work/harper-elliot/highlight.mp4' }
}
```

Pick six seconds that read at a glance with no sound. Previews never load until hover, and are
skipped entirely on touch devices, on data-saver, on slow connections, and for anyone with
reduced-motion enabled — so they cost mobile visitors nothing.

**Posters** are the still shown on a film tile before hover. Without one the tile uses a tinted
placeholder. Grab a frame from the film itself:

```bash
ffmpeg -i highlight.mp4 -ss 00:00:24 -frames:v 1 -q:v 2 film-still.jpg
```

---

## Step 7 — crew portraits

1. Export one 4:5 portrait per person, ~1600px long edge, into `assets/img/crew/`.
2. In `data.js`, find `crew` near the top and fill in the real names, roles and paths:

   ```js
   const crew = [
     { name: 'Ada Zangrid', role: 'Director & lead filmmaker',
       photo: 'assets/img/crew/ada.jpg', hue: 35 },
     { name: 'Sam Okafor', role: 'Lead photographer',
       photo: 'assets/img/crew/sam.jpg', hue: 200 }
   ];
   ```

Add or remove people freely — the grid on `about.html` follows the array. `hue` only tints the
placeholder for anyone without a photo yet.

---

## Step 8 — client logos

The moving strip on the home, studio and reviews pages.

1. Put single-colour SVGs (or transparent PNGs at 2x) in `assets/img/clients/`.
2. Add `logo` to the matching entry in `clients`:

   ```js
   { name: 'Atlas Coffee', note: 'Brand film + stills',
     logo: 'assets/img/clients/atlas-coffee.svg' }
   ```

Entries without a `logo` set the name as a typographic wordmark instead — which looks intentional,
so there's no rush to collect every file. `note` is the tooltip on hover.

Only list clients who are happy to be named.

---

## Step 9 — project covers

The tile image for a project on `work.html` and the home page.

The cover falls back to the first gallery photograph with a `src`, so after step 4 most projects
already have one. To choose a different frame:

```js
cover: 'assets/img/work/harper-elliot/cover.jpg',
```

Covers are cropped to 16:10 (or 4:5 on projects marked `portrait: true`), so leave a little room
around the subject.

---

## Step 10 — favicon and share image

- **Favicon** — replace `assets/img/favicon.svg` with your own mark, keeping the filename. SVG is
  ideal; a 512×512 PNG works if you also change the `<link rel="icon">` type in each page's head.
- **Share image** — replace `assets/img/og.svg` with a 1200×630 JPEG or PNG, then update the
  `og:image` line in `index.html`:

  ```html
  <meta property="og:image" content="assets/img/og.jpg">
  ```

  That's the picture that shows when the site is pasted into WhatsApp, Slack or a text message.

---

## Step 11 — check your work

```bash
node tools/check-media.js
```

It reads `data.js`, checks every path, and prints four numbers:

```
     2  in place
   125  still placeholder
    37  sample clips to replace
     0  MISSING FILES
```

- **MISSING FILES** — a path is set but the file isn't there. These show as broken media on the live
  site, so fix them first; the report names each one.
- **sample clips to replace** — still pointing at the Google demo videos.
- **still placeholder** — empty slots. Nothing broken, just work outstanding.

Then look at the site itself: hard refresh, click through each category page, hover a film tile,
open a photograph and arrow through the set.

If an image doesn't appear, it's almost always one of three things: a typo in the path, a
capitalised file extension (`.JPG` vs `.jpg`), or a leading slash on the path. Open the browser
console (`F12`) — a 404 there names the exact path it tried.

---

## Where each field ends up

| Field in `data.js` | What it fills |
| ------------------ | ------------- |
| `site.heroVideo[]` | Home page looping background |
| `categories[].heroImage` / `.heroVideo` | Top of that category's page |
| `projects[].cover` | The project's tile on work + home |
| `projects[].gallery[].src` | Photo grids and the photo viewer |
| `projects[].gallery[].caption` / `.alt` | Tile caption; screen readers |
| `projects[].films[].video` | What plays when a film tile is clicked |
| `projects[].films[].preview` | The clip that plays on hover |
| `projects[].films[].poster` | The film tile's still |
| `projects[].films[].orientation` | Which reel it lands in, and the player's shape |
| `crew[].photo` | Portraits on the studio page |
| `clients[].logo` | The moving brand strip |

Anything not listed here is text — captions, credits, deliverables, prices — and works the same
way: change it in `data.js`, refresh, done.
