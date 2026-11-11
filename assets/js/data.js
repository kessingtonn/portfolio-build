/* =========================================================
   Zangrid Studios — site data
   ---------------------------------------------------------
   Everything an editor needs to change lives in this file:
   studio details, the enquiry endpoint, and the portfolio.

   PLACEHOLDER MEDIA
   The `video.src` links below point at Google's public
   sample clips so the site plays out of the box. Replace
   them with real Zangrid work — see README.md.
   ========================================================= */

window.ZANGRID = (function () {
  'use strict';

  /* ---- studio details -------------------------------- */
  const site = {
    name: 'Zangrid Studios',
    tagline: 'Photo & film for weddings, portraits, brands and creators.',
    email: 'hello@zangridstudios.com',
    phone: '+44 7700 900 118',
    location: 'London · Travelling worldwide',
    instagram: 'https://instagram.com/zangridstudios',
    vimeo: 'https://vimeo.com/zangridstudios',
    youtube: 'https://youtube.com/@zangridstudios',

    /* Enquiry form delivery.
       Paste a form endpoint (Formspree, Basin, Netlify Forms
       action, Google Apps Script, your own API…) to receive
       submissions by email. Leave empty and the form falls
       back to opening a pre-filled email instead. */
    formEndpoint: '',

    /* How photo and film sections are laid out.
         'grid'       even tiles with captions underneath
         'masonry'    columns, every frame at its natural shape (photos only)
         'seamless'   edge-to-edge rows with no gaps, captions on hover
         'filmstrip'  one full-width row you swipe or drag through
         'cinema'     one big frame at a time, crossfading, with thumbnails
       `photos` covers photography sections, `films` the 16:9
       reels and `vertical` the 9:16 reels. Any category can
       override these with its own `layouts: { … }` below.
       `switcher: true` shows a small control above each
       section so visitors can pick their own view; set it to
       false to lock every section to the layout you chose. */
    layouts: {
      photos: 'seamless',
      films: 'cinema',
      vertical: 'filmstrip',
      switcher: true
    },

    /* Hero background clip.
       Drop your own loop into assets/video/ and list it
       here — the first source the browser can play wins.
       Leave the local entries commented out until the
       files exist, or they 404 on every page load. */
    heroVideo: [
      /* phones get the original vertical clip, wider screens a
         16:9 version with the clip centred over a blurred copy */
      { src: 'assets/video/hero-loop-portrait.mp4', type: 'video/mp4', media: '(max-aspect-ratio: 4/5)' },
      { src: 'assets/video/hero-loop.mp4', type: 'video/mp4' }
    ]
  };

  /* ---- the crew --------------------------------------
     Portraits on about.html. Add `photo` to replace the
     placeholder; 4:5 (portrait) crops best.
     ---------------------------------------------------- */
  const crew = [
    { name: 'Founder', role: 'Director & lead filmmaker', photo: null, hue: 35 },
    { name: 'Lead photographer', role: 'Photography', photo: null, hue: 200 },
    { name: 'Second shooter', role: 'Camera & colour', photo: null, hue: 280 },
    { name: 'Producer', role: 'Production & content', photo: null, hue: 120 }
  ];

  /* ---- brands & clients ------------------------------
     Feeds the moving logo strip. Give a `logo` path to use
     a real logo file; without one the name is set as a
     typographic wordmark.
     ---------------------------------------------------- */
  const clients = [
    { name: 'Atlas Coffee', note: 'Brand film + stills' },
    { name: 'Kindred', note: 'UGC campaign' },
    { name: 'North Rail', note: 'Recruitment film' },
    { name: 'Maren Atelier', note: 'Lookbook' },
    { name: 'Lantern House', note: 'Hospitality' },
    { name: 'Sable Studio', note: 'Always-on content' },
    { name: 'Fold & Co', note: 'Product launch' },
    { name: 'Hartwell', note: 'Founder series' },
    { name: 'Ovett Cycles', note: 'Campaign' },
    { name: 'Bloom Botanics', note: 'Social content' }
  ];

  /* ---- categories ------------------------------------
     Each one gets its own presentation page, generated
     from templates/category.template.html by
     `node tools/build-categories.js`.
     ---------------------------------------------------- */
  const categories = [
    {
      id: 'fashion',
      /* hero backdrop — a still, or a silent clip that loops.
         Suggested: a runway or campaign frame. */
      heroImage: 'assets/img/work/rooftop/film-1-rooftop.jpg',
      heroVideo: 'assets/video/work/rooftop/film-1-rooftop.mp4',
      /* optional — overrides site.layouts on this page only */
      layouts: { photos: 'masonry' },
      label: 'Fashion',
      page: 'fashion.html',
      title: 'Fashion',
      lede: 'Lookbooks, campaigns and runway — stills and motion shot on the same call sheet.',
      intro:
        'Editorial and commercial fashion for labels, stylists and agencies. We light for the garment, ' +
        'cut for the silhouette, and deliver a set that works across a lookbook, a website and a feed.'
    },
    {
      id: 'events',
      /* hero backdrop — a still, or a silent clip that loops.
         Suggested: a room at full tilt. */
      heroImage: 'assets/img/work/the-grid/film-1-event-film.jpg',
      heroVideo: 'assets/video/work/the-grid/film-1-event-film.mp4',
      label: 'Events',
      page: 'events.html',
      title: 'Events',
      lede: 'Launches, conferences, parties and everything that only happens once.',
      intro:
        'Same-day highlights, next-morning galleries, and a recap film that gets the room back. ' +
        'We cover the keynote and the corridor conversation, and we stay out of the sightlines.'
    },
    {
      id: 'weddings',
      /* hero backdrop — a still, or a silent clip that loops.
         Suggested: a wide from a ceremony. */
      heroImage: 'assets/img/work/iris-2025/film-1-wedding-film.jpg',
      heroVideo: 'assets/video/work/iris-2025/film-1-wedding-film.mp4',
      layouts: { photos: 'cinema' },
      label: 'Weddings',
      page: 'weddings.html',
      title: 'Weddings',
      lede: 'The whole day, documented — a film to sit through and a gallery to print.',
      intro:
        'Two-person crews on every wedding, photo and film from one team. Highlight films cut to real ' +
        'audio, vertical shares delivered within days, and galleries that look like the day you had.'
    },
    {
      id: 'portraits',
      /* hero backdrop — a still, or a silent clip that loops.
         Suggested: a favourite sitting. */
      heroImage: 'assets/img/work/golden-hour/film-2-field.jpg',
      heroVideo: 'assets/video/work/golden-hour/film-2-field.mp4',
      label: 'Portraits',
      page: 'portraits.html',
      title: 'Portraits',
      lede: 'Individuals, couples, families and founders — in daylight or on location.',
      intro:
        'Sittings that stay comfortable and finish with frames you actually use. Headshots, editorial ' +
        'sets and founder series, retouched with a light hand and licensed for however you need them.'
    },
    {
      id: 'commercial',
      /* hero backdrop — a still, or a silent clip that loops.
         Suggested: a product or set still. */
      heroImage: 'assets/img/work/matchday/film-1-matchday.jpg',
      heroVideo: 'assets/video/work/matchday/film-1-matchday.mp4',
      label: 'Commercial',
      page: 'commercial.html',
      title: 'Commercial',
      lede: 'Product, advertising and creator-style content built to perform.',
      intro:
        'Ads, product films, demos and UGC. Multiple hooks per concept, cut to every platform spec, ' +
        'with usage rights sorted before the shoot so the winning asset can run.'
    },
    {
      id: 'brand',
      /* hero backdrop — a still, or a silent clip that loops.
         Suggested: a hero-film frame. */
      heroImage: 'assets/img/work/travel/film-1-travel.jpg',
      heroVideo: 'assets/video/work/travel/film-1-travel.mp4',
      label: 'Brand',
      page: 'brand.html',
      title: 'Brand',
      lede: 'Hero films and stills libraries that carry a whole identity.',
      intro:
        'Brand films, recruitment stories and photography systems. Scripting, casting and art direction ' +
        'handled in-house so the film and the stills come out of one idea, not two briefs.'
    }
  ];

  /* ---- portfolio ------------------------------------
     Every project can carry FILMS, PHOTOS, or both.

     id          : unique slug, used in URLs
     category    : one of the ids above
     films[]     : { title, duration, orientation, video, preview, poster, link }
                   video: { type:'file',    src:'…mp4' }
                          { type:'youtube', id:'dQw4w9WgXcQ' }
                          { type:'vimeo',   id:'76979871' }
     gallery[]   : { src, alt, caption, orientation, hue }
                   omit `src` and a tinted placeholder is
                   drawn in its place
     details     : the credit block shown with the project
     hue         : 0–360, tints every generated placeholder
     ---------------------------------------------------- */
  const S = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';

  /* Builds gallery entries, filling in the defaults so each
     still only has to name what makes it different. */
  function stills(hue, items) {
    return items.map(function (item, i) {
      return {
        src: item.src || null,
        caption: item.caption || '',
        alt: item.alt || item.caption || 'Photograph',
        orientation: item.orientation || 'landscape',
        hue: item.hue == null ? (hue + i * 7) % 360 : item.hue
      };
    });
  }

  const projects = [
    /* ---------------- weddings ---------------- */
    {
      id: 'iris-2025',
      title: 'Iris',
      category: 'weddings',
      year: '2025',
      featured: true,
      hue: 32,
      blurb: 'A white-tuxedo wedding shot as a full feature film, a vertical cut and a photo story.',
      tags: ['Wedding film', 'Photography', 'Vertical cut'],
      orientation: 'horizontal',
      portrait: true,
      cover: 'assets/img/work/iris-2025/01-the-kiss.jpg',
      films: [
        {
          title: 'Wedding film',
          duration: '2:10',
          orientation: 'horizontal',
          poster: 'assets/img/work/iris-2025/film-1-wedding-film.jpg',
          preview: 'assets/video/work/iris-2025/film-1-wedding-film.mp4',
          video: { type: 'drive', id: '18OZ-GRT5klVN5I4nAPFwHmMK-gkdpJsO' }
        },
        {
          title: 'Vertical cut',
          duration: '0:23',
          orientation: 'vertical',
          poster: 'assets/img/work/iris-2025/film-2-vertical-cut.jpg',
          preview: 'assets/video/work/iris-2025/film-2-vertical-cut.mp4',
          video: { type: 'drive', id: '1CJihPuxXEJH7RysPWCkSa63T-nSZcETJ' }
        },
        {
          title: 'Teaser',
          duration: '0:15',
          orientation: 'horizontal',
          poster: 'assets/img/work/iris-2025/film-3-teaser.jpg',
          preview: 'assets/video/work/iris-2025/film-3-teaser.mp4',
          video: { type: 'drive', id: '1FVCIw2SmtIuGJaohs_ErTMMBXrgCSI0H' }
        }
      ],
      gallery: stills(32, [
        { src: 'assets/img/work/iris-2025/01-the-kiss.jpg', caption: 'The kiss', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/iris-2025/02-the-arrival.jpg', caption: 'The arrival', width: 1920, height: 1080 },
        { src: 'assets/img/work/iris-2025/03-the-groom.jpg', caption: 'The groom', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/iris-2025/04-under-the-arch.jpg', caption: 'Under the arch', width: 1920, height: 1080 },
        { src: 'assets/img/work/iris-2025/05-the-groomsmen.jpg', caption: 'The groomsmen', width: 1920, height: 1080 },
        { src: 'assets/img/work/iris-2025/06-best-man.jpg', caption: 'Best man', width: 1920, height: 1080 },
        { src: 'assets/img/work/iris-2025/07-the-veil.jpg', caption: 'The veil', width: 2400, height: 1600 },
        { src: 'assets/img/work/iris-2025/08-vows.jpg', caption: 'Vows', width: 2400, height: 1600 }
      ]),
      details: {
        client: 'Iris',
        date: '2025',
        services: ['Wedding film', 'Photography', 'Vertical cut'],
        deliverables: ['3 films', '8 selected photographs'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'wendy-wedding',
      title: 'Wendy',
      category: 'weddings',
      year: '2024',
      featured: true,
      hue: 32,
      blurb: 'A lace-dress wedding day across gardens, hills and city streets.',
      tags: ['Photography', 'Wedding film'],
      orientation: 'horizontal',
      portrait: true,
      cover: 'assets/img/work/wendy-wedding/01-the-couple.jpg',
      films: [
        {
          title: 'With the bridesmaids',
          duration: '0:28',
          orientation: 'vertical',
          poster: 'assets/img/work/wendy-wedding/film-1-with-the-bridesmaids.jpg',
          preview: 'assets/video/work/wendy-wedding/film-1-with-the-bridesmaids.mp4',
          video: { type: 'drive', id: '1cazlWTGn-10ohzxUu6oKEMf0QB4XGoN-' }
        }
      ],
      gallery: stills(32, [
        { src: 'assets/img/work/wendy-wedding/01-the-couple.jpg', caption: 'The couple', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/wendy-wedding/02-doorway.jpg', caption: 'Doorway', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/wendy-wedding/03-the-dress.jpg', caption: 'The dress', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/wendy-wedding/04-quiet-moment.jpg', caption: 'Quiet moment', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/wendy-wedding/05-the-getaway-car.jpg', caption: 'The getaway car', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/wendy-wedding/06-the-bridge.jpg', caption: 'The bridge', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/wendy-wedding/07-the-ring.jpg', caption: 'The ring', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/wendy-wedding/08-through-the-trees.jpg', caption: 'Through the trees', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/wendy-wedding/09-hidden-in-the-green.jpg', caption: 'Hidden in the green', width: 1920, height: 2400, orientation: 'portrait' }
      ]),
      details: {
        client: 'Wendy',
        date: '2024',
        services: ['Photography', 'Wedding film'],
        deliverables: ['1 film', '9 selected photographs'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'tim-wedding',
      title: 'Tim',
      category: 'weddings',
      year: '2025',
      featured: true,
      hue: 32,
      blurb: 'A spring city wedding — dancing in the park, running across the road, all smiles.',
      tags: ['Photography'],
      orientation: 'horizontal',
      portrait: true,
      cover: 'assets/img/work/tim-wedding/01-first-embrace.jpg',
      gallery: stills(32, [
        { src: 'assets/img/work/tim-wedding/01-first-embrace.jpg', caption: 'First embrace', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/02-crossing-the-street.jpg', caption: 'Crossing the street', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/03-hand-in-hand.jpg', caption: 'Hand in hand', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/04-the-dip.jpg', caption: 'The dip', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/05-the-signpost.jpg', caption: 'The signpost', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/06-lifted.jpg', caption: 'Lifted', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/07-bow-and-smile.jpg', caption: 'Bow and smile', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/08-city-steps.jpg', caption: 'City steps', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/09-under-the-willows.jpg', caption: 'Under the willows', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/10-close.jpg', caption: 'Close', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/11-the-walk.jpg', caption: 'The walk', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/12-a-look.jpg', caption: 'A look', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/13-jump.jpg', caption: 'Jump', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/14-reaching-out.jpg', caption: 'Reaching out', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/15-kick.jpg', caption: 'Kick', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/16-running.jpg', caption: 'Running', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/tim-wedding/17-laughing.jpg', caption: 'Laughing', width: 1920, height: 2400, orientation: 'portrait' }
      ]),
      details: {
        client: 'Tim',
        date: '2025',
        services: ['Photography'],
        deliverables: ['17 selected photographs'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'mudi-and-piotr',
      title: 'Mudi & Piotr',
      category: 'weddings',
      year: '2024',
      hue: 32,
      blurb: 'A bright waterside reception — the dance floor, the first dance and the moments between.',
      tags: ['Photography', 'Vertical film'],
      orientation: 'horizontal',
      cover: 'assets/img/work/mudi-and-piotr/01-under-the-flowers.jpg',
      films: [
        {
          title: 'Wedding cut',
          duration: '0:15',
          orientation: 'vertical',
          poster: 'assets/img/work/mudi-and-piotr/film-1-wedding-cut.jpg',
          preview: 'assets/video/work/mudi-and-piotr/film-1-wedding-cut.mp4',
          video: { type: 'drive', id: '12-5ArblnhKBHrjs2keaGk4_4wLb8nRyU' }
        }
      ],
      gallery: stills(32, [
        { src: 'assets/img/work/mudi-and-piotr/01-under-the-flowers.jpg', caption: 'Under the flowers', width: 2400, height: 1600 },
        { src: 'assets/img/work/mudi-and-piotr/02-the-entrance.jpg', caption: 'The entrance', width: 2400, height: 1600 },
        { src: 'assets/img/work/mudi-and-piotr/03-close.jpg', caption: 'Close', width: 2400, height: 1600 },
        { src: 'assets/img/work/mudi-and-piotr/04-dance-off.jpg', caption: 'Dance-off', width: 2400, height: 1600 },
        { src: 'assets/img/work/mudi-and-piotr/05-forehead-to-forehead.jpg', caption: 'Forehead to forehead', width: 2400, height: 1600 },
        { src: 'assets/img/work/mudi-and-piotr/06-first-dance.jpg', caption: 'First dance', width: 2400, height: 1718 },
        { src: 'assets/img/work/mudi-and-piotr/07-the-room.jpg', caption: 'The room', width: 2400, height: 1600 }
      ]),
      details: {
        client: 'Mudi & Piotr',
        date: '2024',
        services: ['Photography', 'Vertical film'],
        deliverables: ['1 film', '7 selected photographs'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'izu-and-oge',
      title: 'Izu & Oge',
      category: 'weddings',
      year: '2025',
      hue: 32,
      blurb: 'Lace, candlelight and a staircase entrance, cut for the feed.',
      tags: ['Vertical film'],
      cover: 'assets/img/work/izu-and-oge/film-1-getting-ready.jpg',
      films: [
        {
          title: 'Getting ready',
          duration: '0:22',
          orientation: 'vertical',
          poster: 'assets/img/work/izu-and-oge/film-1-getting-ready.jpg',
          preview: 'assets/video/work/izu-and-oge/film-1-getting-ready.mp4',
          video: { type: 'drive', id: '189r9yTI8ofDRzwNjNFTzx-gjjoFpoxsm' }
        },
        {
          title: 'The ceremony',
          duration: '0:16',
          orientation: 'vertical',
          poster: 'assets/img/work/izu-and-oge/film-2-the-ceremony.jpg',
          preview: 'assets/video/work/izu-and-oge/film-2-the-ceremony.mp4',
          video: { type: 'drive', id: '1iWwwsXaRuCRvZwSXIhVxlT_1KhZMB7vC' }
        }
      ],
      details: {
        client: 'Izu & Oge',
        date: '2025',
        services: ['Vertical film'],
        deliverables: ['2 films'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'wedding-films',
      title: 'Wedding Days',
      category: 'weddings',
      year: '2025',
      hue: 32,
      blurb: 'Church ceremonies, garden vows and receptions — highlights from across the season.',
      tags: ['Wedding film'],
      cover: 'assets/img/work/wedding-films/film-1-garden-ceremony.jpg',
      films: [
        {
          title: 'Garden ceremony',
          duration: '0:16',
          orientation: 'horizontal',
          poster: 'assets/img/work/wedding-films/film-1-garden-ceremony.jpg',
          preview: 'assets/video/work/wedding-films/film-1-garden-ceremony.mp4',
          video: { type: 'drive', id: '1rzku_iEMaSz52M1KkHBzsYafbk_o7Ax3' }
        },
        {
          title: 'The church',
          duration: '0:21',
          orientation: 'horizontal',
          poster: 'assets/img/work/wedding-films/film-2-the-church.jpg',
          preview: 'assets/video/work/wedding-films/film-2-the-church.mp4',
          video: { type: 'drive', id: '1K6aSXFv28PJkG66f6CrrweRqQnPma6pj' }
        },
        {
          title: 'Morning to aisle',
          duration: '0:15',
          orientation: 'horizontal',
          poster: 'assets/img/work/wedding-films/film-3-morning-to-aisle.jpg',
          preview: 'assets/video/work/wedding-films/film-3-morning-to-aisle.mp4',
          video: { type: 'drive', id: '1l8xQD8EnZpazsuocnKV_-UMxnVNGVMzd' }
        },
        {
          title: 'The bride',
          duration: '0:03',
          orientation: 'horizontal',
          poster: 'assets/img/work/wedding-films/film-4-the-bride.jpg',
          preview: 'assets/video/work/wedding-films/film-4-the-bride.mp4',
          video: { type: 'drive', id: '1mAKmrpFI0djpGO4jqwlo2ZsgZHC8Qe40' }
        }
      ],
      details: {
        client: 'Wedding Days',
        date: '2025',
        services: ['Wedding film'],
        deliverables: ['4 films'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    /* ---------------- portraits ---------------- */
    {
      id: 'wendy-gold',
      title: 'Wendy in Gold',
      category: 'portraits',
      year: '2024',
      featured: true,
      hue: 200,
      blurb: 'A gold gown, a hotel lobby and a garden terrace.',
      tags: ['Portrait session'],
      orientation: 'horizontal',
      portrait: true,
      cover: 'assets/img/work/wendy-gold/01-gold.jpg',
      gallery: stills(200, [
        { src: 'assets/img/work/wendy-gold/01-gold.jpg', caption: 'Gold', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/wendy-gold/02-the-lobby.jpg', caption: 'The lobby', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/wendy-gold/03-blue-velvet.jpg', caption: 'Blue velvet', width: 1714, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/wendy-gold/04-over-the-shoulder.jpg', caption: 'Over the shoulder', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/wendy-gold/05-earrings.jpg', caption: 'Earrings', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/wendy-gold/06-the-terrace.jpg', caption: 'The terrace', width: 1920, height: 2400, orientation: 'portrait' }
      ]),
      details: {
        client: 'Wendy in Gold',
        date: '2024',
        services: ['Portrait session'],
        deliverables: ['6 selected photographs'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'studio-couple',
      title: 'Studio Couple',
      category: 'portraits',
      year: '2025',
      hue: 200,
      blurb: 'Black and white, one light, two people.',
      tags: ['Couples portraits', 'Large-format prints'],
      orientation: 'horizontal',
      portrait: true,
      cover: 'assets/img/work/studio-couple/01-close.jpg',
      gallery: stills(200, [
        { src: 'assets/img/work/studio-couple/01-close.jpg', caption: 'Close', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/studio-couple/02-seated.jpg', caption: 'Seated', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/studio-couple/03-standing.jpg', caption: 'Standing', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/studio-couple/04-on-the-chair.jpg', caption: 'On the chair', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/studio-couple/05-embrace.jpg', caption: 'Embrace', width: 1822, height: 2277, orientation: 'portrait' }
      ]),
      details: {
        client: 'Studio Couple',
        date: '2025',
        services: ['Couples portraits', 'Large-format prints'],
        deliverables: ['5 selected photographs'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'oge',
      title: 'Oge',
      category: 'portraits',
      year: '2025',
      hue: 200,
      blurb: 'Warm studio portraits in lace and amber.',
      tags: ['Studio portraits'],
      orientation: 'horizontal',
      portrait: true,
      cover: 'assets/img/work/oge/01-seated.jpg',
      gallery: stills(200, [
        { src: 'assets/img/work/oge/01-seated.jpg', caption: 'Seated', width: 1080, height: 1350, orientation: 'portrait' },
        { src: 'assets/img/work/oge/02-hands-in-hair.jpg', caption: 'Hands in hair', width: 1080, height: 1350, orientation: 'portrait' },
        { src: 'assets/img/work/oge/03-crouched.jpg', caption: 'Crouched', width: 1080, height: 1350, orientation: 'portrait' }
      ]),
      details: {
        client: 'Oge',
        date: '2025',
        services: ['Studio portraits'],
        deliverables: ['3 selected photographs'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'georgia',
      title: 'Georgia',
      category: 'portraits',
      year: '2025',
      hue: 200,
      blurb: 'Curls, soft light and long summer grass.',
      tags: ['Portrait', 'Vertical film'],
      orientation: 'horizontal',
      portrait: true,
      cover: 'assets/img/work/georgia/01-georgia.jpg',
      films: [
        {
          title: 'In the grass',
          duration: '0:12',
          orientation: 'vertical',
          poster: 'assets/img/work/georgia/film-1-in-the-grass.jpg',
          preview: 'assets/video/work/georgia/film-1-in-the-grass.mp4',
          video: { type: 'drive', id: '1_xPwZrIbID9YxmOTEzrCaaEuTMW83yHa' }
        }
      ],
      gallery: stills(200, [
        { src: 'assets/img/work/georgia/01-georgia.jpg', caption: 'Georgia', width: 1920, height: 2400, orientation: 'portrait' }
      ]),
      details: {
        client: 'Georgia',
        date: '2025',
        services: ['Portrait', 'Vertical film'],
        deliverables: ['1 film', '1 selected photograph'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'nenye',
      title: 'Nenye',
      category: 'portraits',
      year: '2024',
      hue: 200,
      blurb: 'Pearls, red blossom and a shaded garden.',
      tags: ['Portrait', 'Vertical film'],
      orientation: 'horizontal',
      portrait: true,
      cover: 'assets/img/work/nenye/01-nenye.jpg',
      films: [
        {
          title: 'Garden film',
          duration: '0:16',
          orientation: 'vertical',
          poster: 'assets/img/work/nenye/film-1-garden-film.jpg',
          preview: 'assets/video/work/nenye/film-1-garden-film.mp4',
          video: { type: 'drive', id: '1byL1lPuVwYuMuxzzIepdwm777VoRd7np' }
        }
      ],
      gallery: stills(200, [
        { src: 'assets/img/work/nenye/01-nenye.jpg', caption: 'Nenye', width: 1920, height: 2400, orientation: 'portrait' }
      ]),
      details: {
        client: 'Nenye',
        date: '2024',
        services: ['Portrait', 'Vertical film'],
        deliverables: ['1 film', '1 selected photograph'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'levi',
      title: 'Levi',
      category: 'portraits',
      year: '2025',
      hue: 200,
      blurb: 'Two short portrait films — one in the city, one in the park.',
      tags: ['Portrait film'],
      cover: 'assets/img/work/levi/film-1-heart.jpg',
      films: [
        {
          title: 'Heart',
          duration: '1:06',
          orientation: 'vertical',
          poster: 'assets/img/work/levi/film-1-heart.jpg',
          preview: 'assets/video/work/levi/film-1-heart.mp4',
          video: { type: 'drive', id: '1oUxBeQNbppW-W58umbJLLTAOLhqrlVAU' }
        },
        {
          title: 'Spirit',
          duration: '2:05',
          orientation: 'vertical',
          poster: 'assets/img/work/levi/film-2-spirit.jpg',
          preview: 'assets/video/work/levi/film-2-spirit.mp4',
          video: { type: 'drive', id: '129pwhwCqCYl9ePwz4MFCO1O01YY-P72f' }
        }
      ],
      details: {
        client: 'Levi',
        date: '2025',
        services: ['Portrait film'],
        deliverables: ['2 films'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'golden-hour',
      title: 'Golden Hour',
      category: 'portraits',
      year: '2024',
      hue: 200,
      blurb: 'Portrait films shot in the last light of the day.',
      tags: ['Portrait film'],
      orientation: 'horizontal',
      portrait: true,
      cover: 'assets/img/work/golden-hour/01-studio-portrait.jpg',
      films: [
        {
          title: 'The young one',
          duration: '0:17',
          orientation: 'horizontal',
          poster: 'assets/img/work/golden-hour/film-1-the-young-one.jpg',
          preview: 'assets/video/work/golden-hour/film-1-the-young-one.mp4',
          video: { type: 'drive', id: '1UbP5Ar2deycWY41dD9c8-GUrcBrPs00G' }
        },
        {
          title: 'Field',
          duration: '0:17',
          orientation: 'horizontal',
          poster: 'assets/img/work/golden-hour/film-2-field.jpg',
          preview: 'assets/video/work/golden-hour/film-2-field.mp4',
          video: { type: 'drive', id: '1RvE6Pk-wJyW2sLf6lmRC2aV0SZtuTgSd' }
        }
      ],
      gallery: stills(200, [
        { src: 'assets/img/work/golden-hour/01-studio-portrait.jpg', caption: 'Studio portrait', width: 1080, height: 1350, orientation: 'portrait' }
      ]),
      details: {
        client: 'Golden Hour',
        date: '2024',
        services: ['Portrait film'],
        deliverables: ['2 films', '1 selected photograph'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    /* ---------------- fashion ---------------- */
    {
      id: 'jimenez',
      title: 'Jimenez',
      category: 'fashion',
      year: '2025',
      featured: true,
      hue: 330,
      blurb: 'Black leather, café tables and city kerbs.',
      tags: ['Editorial', 'Vertical film'],
      orientation: 'horizontal',
      portrait: true,
      cover: 'assets/img/work/jimenez/01-portrait.jpg',
      films: [
        {
          title: 'Street film',
          duration: '0:28',
          orientation: 'vertical',
          poster: 'assets/img/work/jimenez/film-1-street-film.jpg',
          preview: 'assets/video/work/jimenez/film-1-street-film.mp4',
          video: { type: 'drive', id: '1TKiMgP-k6bBypT6qhAYj-XRq1x18cPOm' }
        }
      ],
      gallery: stills(330, [
        { src: 'assets/img/work/jimenez/01-portrait.jpg', caption: 'Portrait', width: 1080, height: 1350, orientation: 'portrait' },
        { src: 'assets/img/work/jimenez/02-caf.jpg', caption: 'Café', width: 1080, height: 1350, orientation: 'portrait' },
        { src: 'assets/img/work/jimenez/03-night.jpg', caption: 'Night', width: 1080, height: 1350, orientation: 'portrait' },
        { src: 'assets/img/work/jimenez/04-seated.jpg', caption: 'Seated', width: 1080, height: 1350, orientation: 'portrait' },
        { src: 'assets/img/work/jimenez/05-street.jpg', caption: 'Street', width: 1080, height: 1350, orientation: 'portrait' }
      ]),
      details: {
        client: 'Jimenez',
        date: '2025',
        services: ['Editorial', 'Vertical film'],
        deliverables: ['1 film', '5 selected photographs'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'tunde',
      title: 'Tunde',
      category: 'fashion',
      year: '2025',
      featured: true,
      hue: 330,
      blurb: 'Red knit, black wool and a car park as a runway.',
      tags: ['Editorial'],
      orientation: 'horizontal',
      portrait: true,
      cover: 'assets/img/work/tunde/01-bench.jpg',
      gallery: stills(330, [
        { src: 'assets/img/work/tunde/01-bench.jpg', caption: 'Bench', width: 1080, height: 1350, orientation: 'portrait' },
        { src: 'assets/img/work/tunde/02-saver-menu.jpg', caption: 'Saver menu', width: 1080, height: 1350, orientation: 'portrait' },
        { src: 'assets/img/work/tunde/03-car-park-walk.jpg', caption: 'Car park walk', width: 1080, height: 1350, orientation: 'portrait' },
        { src: 'assets/img/work/tunde/04-phone-box.jpg', caption: 'Phone box', width: 1080, height: 1350, orientation: 'portrait' },
        { src: 'assets/img/work/tunde/05-jacket-off.jpg', caption: 'Jacket off', width: 1080, height: 1350, orientation: 'portrait' },
        { src: 'assets/img/work/tunde/06-relaxed.jpg', caption: 'Relaxed', width: 1080, height: 1350, orientation: 'portrait' }
      ]),
      details: {
        client: 'Tunde',
        date: '2025',
        services: ['Editorial'],
        deliverables: ['6 selected photographs'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'red-tint',
      title: 'Red Tint',
      category: 'fashion',
      year: '2025',
      featured: true,
      hue: 330,
      blurb: 'A red sports car and an all-black look through the old town.',
      tags: ['Fashion film', 'Vertical'],
      cover: 'assets/img/work/red-tint/film-1-red-tint.jpg',
      films: [
        {
          title: 'Red Tint',
          duration: '0:55',
          orientation: 'vertical',
          poster: 'assets/img/work/red-tint/film-1-red-tint.jpg',
          preview: 'assets/video/work/red-tint/film-1-red-tint.mp4',
          video: { type: 'drive', id: '1gx5oKA67KlX_11AQ1kFo5K9wqKfmfmqX' }
        },
        {
          title: 'The walk',
          duration: '0:36',
          orientation: 'vertical',
          poster: 'assets/img/work/red-tint/film-2-the-walk.jpg',
          preview: 'assets/video/work/red-tint/film-2-the-walk.mp4',
          video: { type: 'drive', id: '1JINXTMogkvyJUCjfMM2UxER4d9uJq9kv' }
        },
        {
          title: 'Details',
          duration: '0:27',
          orientation: 'vertical',
          poster: 'assets/img/work/red-tint/film-3-details.jpg',
          preview: 'assets/video/work/red-tint/film-3-details.mp4',
          video: { type: 'drive', id: '1u9_PxHvG5xFuFPG4m_S2ovBxJXrHYzfZ' }
        }
      ],
      details: {
        client: 'Red Tint',
        date: '2025',
        services: ['Fashion film', 'Vertical'],
        deliverables: ['3 films'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'charlene',
      title: 'Charlene',
      category: 'fashion',
      year: '2024',
      hue: 330,
      blurb: 'A gothic editorial in black lace and a churchyard.',
      tags: ['Fashion film'],
      cover: 'assets/img/work/charlene/film-1-charlene.jpg',
      films: [
        {
          title: 'Charlene',
          duration: '0:48',
          orientation: 'vertical',
          poster: 'assets/img/work/charlene/film-1-charlene.jpg',
          preview: 'assets/video/work/charlene/film-1-charlene.mp4',
          video: { type: 'drive', id: '1WVQhqgJUccpE50dStrsdoMlk6Ez5i_QB' }
        }
      ],
      details: {
        client: 'Charlene',
        date: '2024',
        services: ['Fashion film'],
        deliverables: ['1 film'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'street-black',
      title: 'Street Black',
      category: 'fashion',
      year: '2025',
      hue: 330,
      blurb: 'Pleats, shades and brick walls.',
      tags: ['Fashion film'],
      cover: 'assets/img/work/street-black/film-1-street-black.jpg',
      films: [
        {
          title: 'Street Black',
          duration: '0:26',
          orientation: 'vertical',
          poster: 'assets/img/work/street-black/film-1-street-black.jpg',
          preview: 'assets/video/work/street-black/film-1-street-black.mp4',
          video: { type: 'drive', id: '1XR9NO03YEerY6Ed2geAyZ0x6SOWIiqvb' }
        }
      ],
      details: {
        client: 'Street Black',
        date: '2025',
        services: ['Fashion film'],
        deliverables: ['1 film'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'lakeside',
      title: 'Lakeside',
      category: 'fashion',
      year: '2024',
      hue: 330,
      blurb: 'Linen, water and late afternoon light.',
      tags: ['Fashion film'],
      cover: 'assets/img/work/lakeside/film-1-lakeside.jpg',
      films: [
        {
          title: 'Lakeside',
          duration: '0:15',
          orientation: 'horizontal',
          poster: 'assets/img/work/lakeside/film-1-lakeside.jpg',
          preview: 'assets/video/work/lakeside/film-1-lakeside.mp4',
          video: { type: 'drive', id: '1538RDoTuxnXdRn8XZbWQ0hHN8L9W1uic' }
        }
      ],
      details: {
        client: 'Lakeside',
        date: '2024',
        services: ['Fashion film'],
        deliverables: ['1 film'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'rooftop',
      title: 'Rooftop',
      category: 'fashion',
      year: '2024',
      hue: 330,
      blurb: 'White shirt, black tie, open sky.',
      tags: ['Fashion film'],
      cover: 'assets/img/work/rooftop/film-1-rooftop.jpg',
      films: [
        {
          title: 'Rooftop',
          duration: '0:39',
          orientation: 'horizontal',
          poster: 'assets/img/work/rooftop/film-1-rooftop.jpg',
          preview: 'assets/video/work/rooftop/film-1-rooftop.mp4',
          video: { type: 'drive', id: '1k7wf5zA-lkyz12UKShh55Aaggr_fPAOu' }
        }
      ],
      details: {
        client: 'Rooftop',
        date: '2024',
        services: ['Fashion film'],
        deliverables: ['1 film'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    /* ---------------- events ---------------- */
    {
      id: 'asambe',
      title: 'Asambe',
      category: 'events',
      year: '2025',
      featured: true,
      hue: 260,
      blurb: 'A night of amapiano — the DJ booth, the dance floor and everyone on it.',
      tags: ['Event photography'],
      orientation: 'horizontal',
      portrait: true,
      cover: 'assets/img/work/asambe/01-behind-the-decks.jpg',
      gallery: stills(260, [
        { src: 'assets/img/work/asambe/01-behind-the-decks.jpg', caption: 'Behind the decks', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/asambe/02-the-floor.jpg', caption: 'The floor', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/asambe/03-on-the-decks.jpg', caption: 'On the decks', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/asambe/04-hands-up.jpg', caption: 'Hands up', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/asambe/05-wings.jpg', caption: 'Wings', width: 1080, height: 1350, orientation: 'portrait' },
        { src: 'assets/img/work/asambe/06-the-crowd.jpg', caption: 'The crowd', width: 1920, height: 2400, orientation: 'portrait' },
        { src: 'assets/img/work/asambe/07-the-hype.jpg', caption: 'The hype', width: 1920, height: 2400, orientation: 'portrait' }
      ]),
      details: {
        client: 'Asambe',
        date: '2025',
        services: ['Event photography'],
        deliverables: ['7 selected photographs'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'the-grid',
      title: 'The Grid',
      category: 'events',
      year: '2025',
      featured: true,
      hue: 260,
      blurb: 'Basketball, DJs and a packed room — the full night in one film.',
      tags: ['Event film'],
      cover: 'assets/img/work/the-grid/film-1-event-film.jpg',
      films: [
        {
          title: 'Event film',
          duration: '1:29',
          orientation: 'horizontal',
          poster: 'assets/img/work/the-grid/film-1-event-film.jpg',
          preview: 'assets/video/work/the-grid/film-1-event-film.mp4',
          video: { type: 'drive', id: '1Q5C1xWdFQGFCd2cRsFs7hjr_GT3qjlj-' }
        }
      ],
      details: {
        client: 'The Grid',
        date: '2025',
        services: ['Event film'],
        deliverables: ['1 film'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'dj-sark',
      title: 'DJ Sark',
      category: 'events',
      year: '2025',
      hue: 260,
      blurb: 'The party from behind the decks.',
      tags: ['Event film'],
      cover: 'assets/img/work/dj-sark/film-1-night-out.jpg',
      films: [
        {
          title: 'Night out',
          duration: '0:59',
          orientation: 'horizontal',
          poster: 'assets/img/work/dj-sark/film-1-night-out.jpg',
          preview: 'assets/video/work/dj-sark/film-1-night-out.mp4',
          video: { type: 'drive', id: '1aGvXXWWC2mtj6wrvuu-YvHaOXT9x2mb8' }
        },
        {
          title: 'Colour',
          duration: '0:15',
          orientation: 'vertical',
          poster: 'assets/img/work/dj-sark/film-2-colour.jpg',
          preview: 'assets/video/work/dj-sark/film-2-colour.mp4',
          video: { type: 'drive', id: '112kn6ZeJA_ISoaOPW8_l2QjHeKXxCxre' }
        }
      ],
      details: {
        client: 'DJ Sark',
        date: '2025',
        services: ['Event film'],
        deliverables: ['2 films'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'wtm',
      title: 'WTM London',
      category: 'events',
      year: '2024',
      hue: 260,
      blurb: 'Three days on the trade-show floor, recapped in half a minute.',
      tags: ['Event recap'],
      cover: 'assets/img/work/wtm/film-1-recap.jpg',
      films: [
        {
          title: 'Recap',
          duration: '0:32',
          orientation: 'horizontal',
          poster: 'assets/img/work/wtm/film-1-recap.jpg',
          preview: 'assets/video/work/wtm/film-1-recap.mp4',
          video: { type: 'drive', id: '1VV7SYhRH8-mtIkPv1_rrf4ZjDhot45Zw' }
        }
      ],
      details: {
        client: 'WTM London',
        date: '2024',
        services: ['Event recap'],
        deliverables: ['1 film'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'violin',
      title: 'Violin Solo',
      category: 'events',
      year: '2025',
      hue: 260,
      blurb: 'A violinist under the station lights.',
      tags: ['Performance film'],
      cover: 'assets/img/work/violin/film-1-violin-solo.jpg',
      films: [
        {
          title: 'Violin solo',
          duration: '0:53',
          orientation: 'vertical',
          poster: 'assets/img/work/violin/film-1-violin-solo.jpg',
          preview: 'assets/video/work/violin/film-1-violin-solo.mp4',
          video: { type: 'drive', id: '15-X11SDxCl2hsR46smwaSf0pnfsM5TJN' }
        }
      ],
      details: {
        client: 'Violin Solo',
        date: '2025',
        services: ['Performance film'],
        deliverables: ['1 film'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    /* ---------------- commercial ---------------- */
    {
      id: 'showreel',
      title: 'Showreel',
      category: 'commercial',
      year: '2026',
      featured: true,
      hue: 140,
      blurb: 'The studio in ninety seconds — and in twenty, for the feed.',
      tags: ['Showreel'],
      cover: 'assets/img/work/showreel/film-1-showreel.jpg',
      films: [
        {
          title: 'Showreel',
          duration: '1:28',
          orientation: 'horizontal',
          poster: 'assets/img/work/showreel/film-1-showreel.jpg',
          preview: 'assets/video/work/showreel/film-1-showreel.mp4',
          video: { type: 'drive', id: '1eZiQGFpbhYm41sMZZSTksLhv1U-HQaWq' }
        },
        {
          title: 'Showreel — vertical',
          duration: '0:20',
          orientation: 'vertical',
          poster: 'assets/img/work/showreel/film-2-showreel-vertical.jpg',
          preview: 'assets/video/work/showreel/film-2-showreel-vertical.mp4',
          video: { type: 'drive', id: '1GN26iBGL_kvKvAc_4pN8Uf89A22yI0xf' }
        }
      ],
      details: {
        client: 'Showreel',
        date: '2026',
        services: ['Showreel'],
        deliverables: ['2 films'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'matchday',
      title: 'Matchday',
      category: 'commercial',
      year: '2025',
      featured: true,
      hue: 140,
      blurb: 'Football and basketball — boots, nets, floodlights and crowds.',
      tags: ['Sports film'],
      cover: 'assets/img/work/matchday/film-1-matchday.jpg',
      films: [
        {
          title: 'Matchday',
          duration: '0:25',
          orientation: 'horizontal',
          poster: 'assets/img/work/matchday/film-1-matchday.jpg',
          preview: 'assets/video/work/matchday/film-1-matchday.mp4',
          video: { type: 'drive', id: '1Xe2KoKKQhpxL4zpR9hJWRzeOcDENeNRt' }
        },
        {
          title: 'Under the lights',
          duration: '0:19',
          orientation: 'horizontal',
          poster: 'assets/img/work/matchday/film-2-under-the-lights.jpg',
          preview: 'assets/video/work/matchday/film-2-under-the-lights.mp4',
          video: { type: 'drive', id: '1pKznyw8stfHzMzr2ksb-52iDx_VzQVuY' }
        },
        {
          title: 'Rivals',
          duration: '0:17',
          orientation: 'vertical',
          poster: 'assets/img/work/matchday/film-3-rivals.jpg',
          preview: 'assets/video/work/matchday/film-3-rivals.mp4',
          video: { type: 'drive', id: '1csbWAJ69hsL7PMRFEzayMEkNAcpvNZrM' }
        },
        {
          title: 'On court',
          duration: '0:14',
          orientation: 'vertical',
          poster: 'assets/img/work/matchday/film-4-on-court.jpg',
          preview: 'assets/video/work/matchday/film-4-on-court.mp4',
          video: { type: 'drive', id: '11urJUl5wSJAhtdcQYSfjWpXr9DQ7Unzo' }
        }
      ],
      details: {
        client: 'Matchday',
        date: '2025',
        services: ['Sports film'],
        deliverables: ['4 films'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'six-am',
      title: '6AM',
      category: 'commercial',
      year: '2025',
      hue: 140,
      blurb: 'Headphones on, the city still asleep.',
      tags: ['Music film'],
      cover: 'assets/img/work/six-am/film-1-6am.jpg',
      films: [
        {
          title: '6AM',
          duration: '1:07',
          orientation: 'vertical',
          poster: 'assets/img/work/six-am/film-1-6am.jpg',
          preview: 'assets/video/work/six-am/film-1-6am.mp4',
          video: { type: 'drive', id: '1NUqigkqkgupmy6o57DSMDPNHGwmg0vCj' }
        }
      ],
      details: {
        client: '6AM',
        date: '2025',
        services: ['Music film'],
        deliverables: ['1 film'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'transform',
      title: 'Transform',
      category: 'commercial',
      year: '2024',
      hue: 140,
      blurb: 'A fitness spot built on before and after.',
      tags: ['Ad'],
      cover: 'assets/img/work/transform/film-1-transform.jpg',
      films: [
        {
          title: 'Transform',
          duration: '0:11',
          orientation: 'horizontal',
          poster: 'assets/img/work/transform/film-1-transform.jpg',
          preview: 'assets/video/work/transform/film-1-transform.mp4',
          video: { type: 'drive', id: '1nVdC-4Z9E0jrNc5nbXcE9DNgZUX8Ox4J' }
        },
        {
          title: 'Spec ad',
          duration: '0:17',
          orientation: 'horizontal',
          poster: 'assets/img/work/transform/film-2-spec-ad.jpg',
          preview: 'assets/video/work/transform/film-2-spec-ad.mp4',
          video: { type: 'drive', id: '1q3qKbq4TF6T6WFwotemj_U4rDqKgcSWV' }
        }
      ],
      details: {
        client: 'Transform',
        date: '2024',
        services: ['Ad'],
        deliverables: ['2 films'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'the-ways',
      title: 'The Ways',
      category: 'commercial',
      year: '2025',
      hue: 140,
      blurb: 'A seven-second hook.',
      tags: ['Social'],
      cover: 'assets/img/work/the-ways/film-1-the-ways.jpg',
      films: [
        {
          title: 'The Ways',
          duration: '0:07',
          orientation: 'vertical',
          poster: 'assets/img/work/the-ways/film-1-the-ways.jpg',
          preview: 'assets/video/work/the-ways/film-1-the-ways.mp4',
          video: { type: 'drive', id: '1ZOxpISGVdqyxlTzRP5HaJQj41GCjYfOk' }
        }
      ],
      details: {
        client: 'The Ways',
        date: '2025',
        services: ['Social'],
        deliverables: ['1 film'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    /* ---------------- brand ---------------- */
    {
      id: 'gg-hair',
      title: 'Gg Hair Studio',
      category: 'brand',
      year: '2025',
      featured: true,
      hue: 45,
      blurb: 'A salon interior, styled and lit like a showroom.',
      tags: ['Brand film'],
      cover: 'assets/img/work/gg-hair/film-1-salon-film.jpg',
      films: [
        {
          title: 'Salon film',
          duration: '0:24',
          orientation: 'vertical',
          poster: 'assets/img/work/gg-hair/film-1-salon-film.jpg',
          preview: 'assets/video/work/gg-hair/film-1-salon-film.mp4',
          video: { type: 'drive', id: '1tsgYKoHx7sddkhjL9dW3JsyPWYd5Kk09' }
        }
      ],
      details: {
        client: 'Gg Hair Studio',
        date: '2025',
        services: ['Brand film'],
        deliverables: ['1 film'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'the-suit',
      title: 'The Suit',
      category: 'brand',
      year: '2024',
      hue: 45,
      blurb: 'A tailoring story, from the iron to the open road.',
      tags: ['Brand film'],
      orientation: 'horizontal',
      portrait: true,
      cover: 'assets/img/work/the-suit/01-reading-room.jpg',
      films: [
        {
          title: 'The Suit',
          duration: '0:22',
          orientation: 'horizontal',
          poster: 'assets/img/work/the-suit/film-1-the-suit.jpg',
          preview: 'assets/video/work/the-suit/film-1-the-suit.mp4',
          video: { type: 'drive', id: '1AAmIdqAZB-hNlaergJKXKtdtIZYTHH1h' }
        }
      ],
      gallery: stills(45, [
        { src: 'assets/img/work/the-suit/01-reading-room.jpg', caption: 'Reading room', width: 1080, height: 1350, orientation: 'portrait' }
      ]),
      details: {
        client: 'The Suit',
        date: '2024',
        services: ['Brand film'],
        deliverables: ['1 film', '1 selected photograph'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'travel',
      title: 'Travel',
      category: 'brand',
      year: '2024',
      featured: true,
      hue: 45,
      blurb: 'Desert dunes, city skylines and open water, cut with in-camera transitions.',
      tags: ['Travel film'],
      cover: 'assets/img/work/travel/film-1-travel.jpg',
      films: [
        {
          title: 'Travel',
          duration: '0:28',
          orientation: 'horizontal',
          poster: 'assets/img/work/travel/film-1-travel.jpg',
          preview: 'assets/video/work/travel/film-1-travel.mp4',
          video: { type: 'drive', id: '1Ozoom7Unp2x-AGbDZ-70V53fgObDWuYI' }
        },
        {
          title: 'Frames',
          duration: '0:18',
          orientation: 'horizontal',
          poster: 'assets/img/work/travel/film-2-frames.jpg',
          preview: 'assets/video/work/travel/film-2-frames.mp4',
          video: { type: 'drive', id: '12BHMYvjlHG7z97xP29lbRPaVqbXFjVvn' }
        },
        {
          title: 'Transitions',
          duration: '0:19',
          orientation: 'horizontal',
          poster: 'assets/img/work/travel/film-3-transitions.jpg',
          preview: 'assets/video/work/travel/film-3-transitions.mp4',
          video: { type: 'drive', id: '171AljQepHwK5Cnujy8O7H9ylUYz6NZL_' }
        }
      ],
      details: {
        client: 'Travel',
        date: '2024',
        services: ['Travel film'],
        deliverables: ['3 films'],
        credits: [{ role: 'Photo & film', name: 'Zangrid Studios' }]
      }
    }
  ];

  /* ---- packages --------------------------------------
     Grouped by service. `featured` highlights one tier.
     Prices are indicative starting points — edit freely.
     ---------------------------------------------------- */
  const packages = {
    wedding: {
      label: 'Weddings',
      intro:
        'Photo, film, or both — covered by one team that has worked together for years, so nothing gets shot twice.',
      note: 'Travel within the UK is included. Destination weddings quoted on request.',
      tiers: [
        {
          id: 'wedding-elopement',
          name: 'The Elopement',
          price: 'from £1,450',
          unit: 'up to 4 hours',
          desc: 'Small ceremonies, city halls and two-witness days.',
          includes: [
            '4 hours of coverage, one photographer',
            '150+ edited images in a private gallery',
            'Optional 90-second vertical film',
            'Sneak peek within 48 hours',
            'Full delivery in 3 weeks'
          ]
        },
        {
          id: 'wedding-signature',
          name: 'The Signature',
          price: 'from £2,950',
          unit: 'full day',
          desc: 'The standard booking — preparations through to first dance.',
          featured: true,
          includes: [
            '10 hours of coverage, photographer + filmmaker',
            '500+ edited images, colour and black & white',
            '4–6 minute highlight film with live audio',
            'Pre-wedding call and a shot-priority plan',
            'Online gallery with download and print rights',
            'Full delivery in 6 weeks'
          ]
        },
        {
          id: 'wedding-legacy',
          name: 'The Legacy',
          price: 'from £4,800',
          unit: 'two days',
          desc: 'Multi-day, multi-location and destination celebrations.',
          includes: [
            'Two days of coverage, two-person crew each day',
            'Everything in The Signature',
            'Documentary feature edit (20–30 minutes)',
            'Rehearsal dinner or welcome party coverage',
            'Fine-art album, 30 spreads, designed with you',
            'Second shooter and drone where permitted'
          ]
        }
      ]
    },

    portrait: {
      label: 'Portraits',
      intro:
        'Individuals, couples, families and founders. Studio daylight or a location that means something to you.',
      note: 'Hair and make-up can be arranged for an additional £180.',
      tiers: [
        {
          id: 'portrait-session',
          name: 'The Session',
          price: '£350',
          unit: '60 minutes',
          desc: 'One look, one location, a tight edit of the best frames.',
          includes: [
            '60-minute sitting',
            '2 outfit changes',
            '25 retouched images',
            'Web and print files',
            'Delivery in 7 days'
          ]
        },
        {
          id: 'portrait-extended',
          name: 'The Extended',
          price: '£620',
          unit: 'half day',
          desc: 'More looks, more locations, room for the shot to arrive.',
          featured: true,
          includes: [
            'Half-day sitting (up to 4 hours)',
            'Two locations, unlimited changes',
            '60 retouched images',
            'Styling guidance ahead of the shoot',
            '15-second vertical clip for social',
            'Delivery in 10 days'
          ]
        },
        {
          id: 'portrait-editorial',
          name: 'The Editorial',
          price: 'from £1,200',
          unit: 'full day',
          desc: 'Founder series, press kits and personal branding libraries.',
          includes: [
            'Full-day shoot with lighting kit',
            'Creative direction and mood board',
            '100+ retouched images, licensed for commercial use',
            'Headshot, environmental and detail sets',
            'Behind-the-scenes reel',
            'Delivery in 14 days'
          ]
        }
      ]
    },

    brand: {
      label: 'Brand',
      intro:
        'Films and stills that sell the thing — built around a message, not a mood board alone.',
      note: 'Licensing is included for organic and owned channels; paid media licensing quoted per campaign.',
      tiers: [
        {
          id: 'brand-starter',
          name: 'Brand Starter',
          price: 'from £1,600',
          unit: 'one shoot day',
          desc: 'A first content library for a launch or a rebrand.',
          includes: [
            'Half-day shoot, one location',
            '40 edited stills',
            'One 30–45 second brand cut',
            '3 vertical cut-downs for social',
            'Delivery in 10 days'
          ]
        },
        {
          id: 'brand-story',
          name: 'Brand Story',
          price: 'from £3,400',
          unit: 'two shoot days',
          desc: 'The flagship film plus everything around it.',
          featured: true,
          includes: [
            'Two shoot days, crew of three',
            'Scripting, storyboard and casting support',
            '90-second hero film with licensed music',
            '6 social cut-downs (9:16, 1:1, 16:9)',
            '80 edited stills',
            'Subtitles, thumbnails and delivery specs per platform'
          ]
        },
        {
          id: 'brand-partner',
          name: 'Brand Partner',
          price: 'from £2,200 / month',
          unit: 'retainer, 3-month minimum',
          desc: 'An always-on content engine with a predictable rhythm.',
          includes: [
            'One shoot day per month',
            '12 short-form videos per month',
            '40 stills per month',
            'Quarterly strategy and performance review',
            'Priority turnaround (72 hours on request)',
            'Shared asset library with usage rights'
          ]
        }
      ]
    },

    ugc: {
      label: 'UGC',
      intro:
        'Creator-style content made to look native in the feed — hooks first, polish second.',
      note: 'Whitelisting and paid-usage rights available from £120 per asset, per 6 months.',
      tiers: [
        {
          id: 'ugc-starter',
          name: 'Starter Pack',
          price: '£480',
          unit: '3 assets',
          desc: 'Test the format before you scale the spend.',
          includes: [
            '3 vertical videos (15–30 seconds)',
            '1 hook variation per asset',
            'Raw and edited files',
            'Captions burned in',
            '30-day organic usage rights'
          ]
        },
        {
          id: 'ugc-bundle',
          name: 'Creator Bundle',
          price: '£1,150',
          unit: '9 assets',
          desc: 'Enough variations to actually learn what converts.',
          featured: true,
          includes: [
            '9 vertical videos across 3 concepts',
            '3 hook variations per concept',
            'Unboxing, demo and testimonial formats',
            '20 lifestyle stills',
            '6-month paid usage rights',
            'Delivery in 12 days'
          ]
        },
        {
          id: 'ugc-always-on',
          name: 'Always-On',
          price: 'from £1,600 / month',
          unit: 'retainer',
          desc: 'A monthly drop that keeps the ad account fed.',
          includes: [
            '12 vertical videos per month',
            'Monthly concept workshop',
            'Performance-led iteration on winning hooks',
            'Trend and sound monitoring',
            '12-month paid usage rights',
            'Dedicated creator matched to your brand'
          ]
        }
      ]
    }
  };

  /* ---- reviews ---------------------------------------
     Powers the quote strips and the full reviews page.
     `featured` picks the ones shown on home and studio.
     `project` links a review to a portfolio entry id.
     ---------------------------------------------------- */
  const testimonials = [
    {
      quote:
        'We have watched our film more times than we can admit. It does not feel staged — it feels like the day we actually had. The sneak peek landed while we were still at breakfast the next morning.',
      by: 'Harper & Elliot',
      role: 'Somerset, June 2026',
      service: 'wedding',
      rating: 5,
      featured: true,
      project: 'harper-elliot'
    },
    {
      quote:
        'Zangrid turned around a full campaign in ten days. The stills and the film came out of the same shoot and it shows — everything sits together on the site and in the ads.',
      by: 'Priya N.',
      role: 'Head of Brand, Atlas Coffee Roasters',
      service: 'brand',
      rating: 5,
      featured: true,
      project: 'atlas-coffee'
    },
    {
      quote:
        'The UGC pack outperformed our agency creative on every hook. We moved the whole budget across and now book a monthly drop.',
      by: 'Dani R.',
      role: 'Growth Lead, Kindred Skincare',
      service: 'ugc',
      rating: 5,
      featured: true,
      project: 'kindred-skincare'
    },
    {
      quote:
        'Two crews, three countries, one weekend, and not a single moment where we felt watched. The Como film still gets sent around our family.',
      by: 'Noor & Sam',
      role: 'Lake Como, May 2026',
      service: 'wedding',
      rating: 5,
      project: 'noor-and-sam'
    },
    {
      quote:
        'I hate having my photo taken and said so in the first email. They planned around it, and I ended up with headshots I actually use.',
      by: 'Marcus T.',
      role: 'Founder, Hartwell',
      service: 'portrait',
      rating: 5,
      project: 'hartwell-founders'
    },
    {
      quote:
        'Recruitment applications went up 40% in the quarter the film went live. HR has never once asked us for a different edit.',
      by: 'Sian W.',
      role: 'Comms Director, North Rail',
      service: 'brand',
      rating: 5,
      project: 'north-rail'
    },
    {
      quote:
        'Six vertical cuts from one shoot day, each with a different hook. Two of them are still running as our best performing ads.',
      by: 'Jonah K.',
      role: 'Fold & Co',
      service: 'ugc',
      rating: 5,
      project: 'fold-and-co'
    },
    {
      quote:
        'Booking was the easy part — a clear price, a clear contract, and someone who answered emails the same day.',
      by: 'Ivy & June',
      role: 'City hall elopement, 2025',
      service: 'wedding',
      rating: 5,
      project: 'ivy-and-june'
    },
    {
      quote:
        'The daylight session was 60 minutes and I got 25 images I love. My only complaint is that I did not book the longer one.',
      by: 'Amara O.',
      role: 'Portrait client',
      service: 'portrait',
      rating: 4,
      project: 'the-daylight-room'
    },
    {
      quote:
        'They shot our second site opening in a single evening service without getting in the kitchen’s way once. The gallery sold the room out for a month.',
      by: 'Tom B.',
      role: 'Operations, Lantern House',
      service: 'brand',
      rating: 5,
      project: 'lantern-house'
    },
    {
      quote:
        'The monthly retainer took content off my plate entirely. Same look every month, no chasing, no scope arguments.',
      by: 'Elle M.',
      role: 'Sable Studio',
      service: 'ugc',
      rating: 5,
      project: 'sable-studio'
    },
    {
      quote:
        'A sunrise session that ran 20 minutes over because the light turned, and nobody rushed us. That is the whole review, really.',
      by: 'Rae & Tomas',
      role: 'Couples session, 2025',
      service: 'portrait',
      rating: 5,
      project: 'first-light'
    }
  ];

  return { site, crew, clients, projects, categories, packages, testimonials };
})();
