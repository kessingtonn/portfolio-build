# Hero video

Drop the looping background clip here as:

- `hero-loop.mp4`  (H.264)
- `hero-loop.webm` (VP9, optional but smaller)

10–20 seconds, 1920x1080, no audio track, ideally under 5 MB.

Then uncomment the two local entries in `site.heroVideo` in `assets/js/data.js`
so the browser reaches for them before the remote fallback clip.
