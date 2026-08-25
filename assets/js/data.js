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

    /* Hero background clip.
       Drop your own loop into assets/video/ and list it
       here — the first source the browser can play wins.
       Leave the local entries commented out until the
       files exist, or they 404 on every page load. */
    heroVideo: [
      // { src: 'assets/video/hero-loop.webm', type: 'video/webm' },
      // { src: 'assets/video/hero-loop.mp4',  type: 'video/mp4'  },
      {
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        type: 'video/mp4'
      }
    ]
  };

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
      id: 'harper-elliot',
      title: 'Harper & Elliot',
      category: 'weddings',
      year: '2026',
      featured: true,
      wide: true,
      hue: 32,
      blurb: 'A two-day celebration in a walled garden — shot on a single 35mm prime, cut to the vows.',
      tags: ['Wedding film', 'Photography', '6 min'],
      films: [
        {
          title: 'Highlight film',
          duration: '6:12',
          orientation: 'horizontal',
          video: { type: 'file', src: S + 'ForBiggerJoyrides.mp4' }
        },
        {
          title: 'Vertical share cut',
          duration: '0:58',
          orientation: 'vertical',
          video: { type: 'file', src: S + 'ForBiggerFun.mp4' }
        }
      ],
      gallery: stills(32, [
        { caption: 'Getting ready, north light', orientation: 'portrait' },
        { caption: 'The walk down' },
        { caption: 'Vows' },
        { caption: 'Confetti', orientation: 'portrait' },
        { caption: 'Long table, golden hour' },
        { caption: 'First dance' }
      ]),
      details: {
        client: 'Harper & Elliot',
        location: 'Somerset, England',
        date: 'June 2026',
        services: ['Wedding film', 'Photography'],
        deliverables: ['6-minute highlight film', '520 edited images', '60-second vertical cut', 'Feature edit, 24 min'],
        credits: [
          { role: 'Director & lead film', name: 'Zangrid Studios' },
          { role: 'Photography', name: 'Zangrid Studios' },
          { role: 'Second shooter', name: 'Add name' },
          { role: 'Colour', name: 'Add name' },
          { role: 'Venue', name: 'Add venue' }
        ]
      }
    },
    {
      id: 'noor-and-sam',
      title: 'Noor & Sam',
      category: 'weddings',
      year: '2026',
      featured: true,
      hue: 18,
      blurb: 'Destination weekend, golden-hour ceremony, a highlight film that runs like a trailer.',
      tags: ['Wedding film', 'Destination', '4 min'],
      films: [
        {
          title: 'Highlight film',
          duration: '4:03',
          orientation: 'horizontal',
          video: { type: 'file', src: S + 'ForBiggerEscapes.mp4' }
        }
      ],
      gallery: stills(18, [
        { caption: 'Arrival by water' },
        { caption: 'Ceremony terrace', orientation: 'portrait' },
        { caption: 'Speeches' },
        { caption: 'Lake, last light' }
      ]),
      details: {
        client: 'Noor & Sam',
        location: 'Lake Como, Italy',
        date: 'May 2026',
        services: ['Wedding film', 'Photography'],
        deliverables: ['4-minute highlight film', '380 edited images', 'Welcome party coverage'],
        credits: [
          { role: 'Director & lead film', name: 'Zangrid Studios' },
          { role: 'Photography', name: 'Zangrid Studios' },
          { role: 'Planner', name: 'Add name' }
        ]
      }
    },
    {
      id: 'ivy-and-june',
      title: 'Ivy & June',
      category: 'weddings',
      year: '2025',
      hue: 42,
      blurb: 'Two hours, two witnesses, one very good pub afterwards. Reportage from start to finish.',
      tags: ['Elopement', 'Reportage', '120 images'],
      gallery: stills(42, [
        { caption: 'City hall steps', orientation: 'portrait' },
        { caption: 'The register' },
        { caption: 'Rain, briefly' },
        { caption: 'The pub' },
        { caption: 'Last light on the walk home', orientation: 'portrait' }
      ]),
      details: {
        client: 'Ivy & June',
        location: 'London',
        date: 'October 2025',
        services: ['Photography'],
        deliverables: ['120 edited images', 'Print release'],
        credits: [{ role: 'Photography', name: 'Zangrid Studios' }]
      }
    },

    /* ---------------- fashion ---------------- */
    {
      id: 'maren-atelier',
      title: 'Maren Atelier',
      category: 'fashion',
      year: '2026',
      featured: true,
      wide: true,
      hue: 340,
      blurb: 'Lookbook film and campaign stills for an independent label’s first flagship collection.',
      tags: ['Lookbook', 'Campaign', '2 min'],
      films: [
        {
          title: 'Collection film',
          duration: '2:10',
          orientation: 'horizontal',
          video: { type: 'file', src: S + 'Sintel.mp4' }
        },
        {
          title: 'Runway teaser',
          duration: '0:22',
          orientation: 'vertical',
          video: { type: 'file', src: S + 'ForBiggerBlazes.mp4' }
        }
      ],
      gallery: stills(340, [
        { caption: 'Look 01', orientation: 'portrait' },
        { caption: 'Look 04', orientation: 'portrait' },
        { caption: 'Fabric detail' },
        { caption: 'Look 09', orientation: 'portrait' },
        { caption: 'Backstage' },
        { caption: 'Campaign frame' }
      ]),
      details: {
        client: 'Maren Atelier',
        location: 'London studio',
        date: 'February 2026',
        services: ['Fashion film', 'Campaign stills'],
        deliverables: ['2-minute collection film', '60 retouched images', '6 vertical cut-downs'],
        credits: [
          { role: 'Direction', name: 'Zangrid Studios' },
          { role: 'Photography', name: 'Zangrid Studios' },
          { role: 'Styling', name: 'Add name' },
          { role: 'Hair & make-up', name: 'Add name' },
          { role: 'Models', name: 'Add agency' }
        ]
      }
    },
    {
      id: 'nocturne-edit',
      title: 'Nocturne Edit',
      category: 'fashion',
      year: '2025',
      hue: 265,
      blurb: 'An after-dark editorial shot on location in one night, available light only.',
      tags: ['Editorial', 'Night', '24 images'],
      gallery: stills(265, [
        { caption: 'Underpass', orientation: 'portrait' },
        { caption: 'Neon, wide' },
        { caption: 'Coat detail', orientation: 'portrait' },
        { caption: 'Last frame, 4am' }
      ]),
      details: {
        client: 'Editorial commission',
        location: 'Manchester',
        date: 'November 2025',
        services: ['Editorial photography'],
        deliverables: ['24 retouched images', 'Print licence, 12 months'],
        credits: [
          { role: 'Photography', name: 'Zangrid Studios' },
          { role: 'Styling', name: 'Add name' }
        ]
      }
    },

    /* ---------------- events ---------------- */
    {
      id: 'assembly-24',
      title: 'Assembly ’26',
      category: 'events',
      year: '2026',
      featured: true,
      hue: 200,
      blurb: 'Two-day conference: same-day recap film, next-morning gallery, speaker reels for every session.',
      tags: ['Conference', 'Recap film', 'Same-day'],
      films: [
        {
          title: 'Day one recap',
          duration: '1:45',
          orientation: 'horizontal',
          video: { type: 'file', src: S + 'ForBiggerMeltdowns.mp4' }
        },
        {
          title: 'Speaker reel',
          duration: '0:40',
          orientation: 'vertical',
          video: { type: 'file', src: S + 'ForBiggerEscapes.mp4' }
        }
      ],
      gallery: stills(200, [
        { caption: 'Keynote' },
        { caption: 'Registration' },
        { caption: 'Breakout room', orientation: 'portrait' },
        { caption: 'The corridor track' },
        { caption: 'Closing party' }
      ]),
      details: {
        client: 'Assembly Conference',
        location: 'Barbican, London',
        date: 'March 2026',
        services: ['Event film', 'Event photography'],
        deliverables: ['Same-day recap film', '600 edited images', '18 speaker reels'],
        credits: [
          { role: 'Lead film', name: 'Zangrid Studios' },
          { role: 'Photography', name: 'Zangrid Studios' },
          { role: 'Edit on site', name: 'Add name' }
        ]
      }
    },
    {
      id: 'lantern-house',
      title: 'Lantern House',
      category: 'events',
      year: '2025',
      hue: 12,
      blurb: 'Opening night for a restaurant group’s second site — service documented without stopping it.',
      tags: ['Launch', 'Hospitality', '180 images'],
      gallery: stills(12, [
        { caption: 'Pass, first service' },
        { caption: 'Room at 8pm' },
        { caption: 'Detail, plated' , orientation: 'portrait' },
        { caption: 'Front of house' }
      ]),
      details: {
        client: 'Lantern House',
        location: 'Bristol',
        date: 'September 2025',
        services: ['Event photography', 'Interiors'],
        deliverables: ['180 edited images', 'Press-ready selects'],
        credits: [{ role: 'Photography', name: 'Zangrid Studios' }]
      }
    },

    /* ---------------- portraits ---------------- */
    {
      id: 'the-daylight-room',
      title: 'The Daylight Room',
      category: 'portraits',
      year: '2026',
      featured: true,
      hue: 210,
      blurb: 'Natural-light portrait sittings — one window, one wall, forty frames that feel like you.',
      tags: ['Studio', 'Daylight', '40 images'],
      gallery: stills(210, [
        { caption: 'Sitting 01', orientation: 'portrait' },
        { caption: 'Sitting 02', orientation: 'portrait' },
        { caption: 'Hands' },
        { caption: 'Sitting 03', orientation: 'portrait' },
        { caption: 'Wide, room' },
        { caption: 'Sitting 04', orientation: 'portrait' }
      ]),
      details: {
        client: 'Studio sittings',
        location: 'Zangrid studio, London',
        date: 'Ongoing',
        services: ['Portrait photography'],
        deliverables: ['25–60 retouched images', 'Web and print files'],
        credits: [{ role: 'Photography', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'hartwell-founders',
      title: 'Hartwell Founders',
      category: 'portraits',
      year: '2025',
      hue: 175,
      blurb: 'Vertical talking-head series for a hiring campaign — twelve founders, one afternoon each.',
      tags: ['Founder series', 'Interview', '9:16'],
      films: [
        {
          title: 'Founder film, vertical',
          duration: '1:12',
          orientation: 'vertical',
          video: { type: 'file', src: S + 'ForBiggerMeltdowns.mp4' }
        }
      ],
      gallery: stills(175, [
        { caption: 'Portrait, seated', orientation: 'portrait' },
        { caption: 'At the desk' },
        { caption: 'Environmental', orientation: 'portrait' }
      ]),
      details: {
        client: 'Hartwell',
        location: 'Four cities, UK',
        date: 'August 2025',
        services: ['Portrait photography', 'Interview film'],
        deliverables: ['12 founder films (9:16)', '120 retouched images', 'Subtitled masters'],
        credits: [
          { role: 'Direction', name: 'Zangrid Studios' },
          { role: 'Sound', name: 'Add name' }
        ]
      }
    },
    {
      id: 'first-light',
      title: 'First Light',
      category: 'portraits',
      year: '2025',
      hue: 190,
      blurb: 'A sunrise couples session on the coast, cut short and slow for the way it actually felt.',
      tags: ['Couples', 'Short film', '90 sec'],
      films: [
        {
          title: 'Session film',
          duration: '1:30',
          orientation: 'horizontal',
          video: { type: 'file', src: S + 'ElephantsDream.mp4' }
        }
      ],
      gallery: stills(190, [
        { caption: 'First light' },
        { caption: 'On the rocks', orientation: 'portrait' },
        { caption: 'Walking back' }
      ]),
      details: {
        client: 'Private session',
        location: 'Northumberland coast',
        date: 'July 2025',
        services: ['Couples film', 'Photography'],
        deliverables: ['90-second film', '45 edited images'],
        credits: [{ role: 'Direction & photography', name: 'Zangrid Studios' }]
      }
    },

    /* ---------------- commercial ---------------- */
    {
      id: 'kindred-skincare',
      title: 'Kindred Skincare',
      category: 'commercial',
      year: '2026',
      featured: true,
      hue: 320,
      blurb: 'Twelve vertical creator-style cuts built for paid social — three hooks, three edits each.',
      tags: ['UGC', 'Paid social', '12 assets'],
      films: [
        {
          title: 'Hook A — routine',
          duration: '0:24',
          orientation: 'vertical',
          video: { type: 'file', src: S + 'ForBiggerFun.mp4' }
        },
        {
          title: 'Hook B — before / after',
          duration: '0:18',
          orientation: 'vertical',
          video: { type: 'file', src: S + 'ForBiggerEscapes.mp4' }
        }
      ],
      gallery: stills(320, [
        { caption: 'Product, top light' },
        { caption: 'In hand', orientation: 'portrait' },
        { caption: 'Texture' }
      ]),
      details: {
        client: 'Kindred Skincare',
        location: 'London',
        date: 'January 2026',
        services: ['UGC', 'Product stills'],
        deliverables: ['12 vertical videos', '20 lifestyle stills', '6-month paid usage'],
        credits: [
          { role: 'Direction', name: 'Zangrid Studios' },
          { role: 'Creator', name: 'Add name' }
        ]
      }
    },
    {
      id: 'fold-and-co',
      title: 'Fold & Co',
      category: 'commercial',
      year: '2026',
      hue: 95,
      blurb: 'Vertical launch teasers cut three ways for TikTok, Reels and Shorts on the same shoot day.',
      tags: ['Product launch', 'Vertical', '6 assets'],
      films: [
        {
          title: 'Launch teaser',
          duration: '0:20',
          orientation: 'vertical',
          video: { type: 'file', src: S + 'ForBiggerBlazes.mp4' }
        }
      ],
      gallery: stills(95, [
        { caption: 'Pack shot' },
        { caption: 'Unboxing frame', orientation: 'portrait' },
        { caption: 'Set, wide' }
      ]),
      details: {
        client: 'Fold & Co',
        location: 'Studio',
        date: 'April 2026',
        services: ['Product film', 'Stills'],
        deliverables: ['6 vertical assets', '15 product stills'],
        credits: [{ role: 'Direction & photography', name: 'Zangrid Studios' }]
      }
    },
    {
      id: 'ovett-cycles',
      title: 'Ovett Cycles',
      category: 'commercial',
      year: '2025',
      hue: 250,
      blurb: 'Hook-led vertical ads shot handheld — the winning cut ran for two quarters straight.',
      tags: ['Advertising', 'Vertical', 'Performance'],
      films: [
        {
          title: 'Winning cut',
          duration: '0:15',
          orientation: 'vertical',
          video: { type: 'file', src: S + 'ForBiggerEscapes.mp4' }
        },
        {
          title: 'Long-form edit',
          duration: '1:05',
          orientation: 'horizontal',
          video: { type: 'file', src: S + 'WeAreGoingOnBullrun.mp4' }
        }
      ],
      gallery: stills(250, [{ caption: 'Ride, dawn' }, { caption: 'Frame detail', orientation: 'portrait' }]),
      details: {
        client: 'Ovett Cycles',
        location: 'Peak District',
        date: 'June 2025',
        services: ['Advertising film'],
        deliverables: ['9 vertical ads', '1 long-form edit', '12-month paid usage'],
        credits: [{ role: 'Direction', name: 'Zangrid Studios' }]
      }
    },

    /* ---------------- brand ---------------- */
    {
      id: 'atlas-coffee',
      title: 'Atlas Coffee Roasters',
      category: 'brand',
      year: '2026',
      featured: true,
      wide: true,
      hue: 26,
      blurb: 'Origin-to-cup brand film plus a stills library for a national wholesale launch.',
      tags: ['Brand film', 'Stills library', '90 sec'],
      films: [
        {
          title: 'Brand film',
          duration: '1:30',
          orientation: 'horizontal',
          video: { type: 'file', src: S + 'ForBiggerMeltdowns.mp4' }
        },
        {
          title: 'Social cut-down',
          duration: '0:15',
          orientation: 'vertical',
          video: { type: 'file', src: S + 'ForBiggerFun.mp4' }
        }
      ],
      gallery: stills(26, [
        { caption: 'Roastery floor' },
        { caption: 'Green beans, detail', orientation: 'portrait' },
        { caption: 'The pour' },
        { caption: 'Team portrait', orientation: 'portrait' },
        { caption: 'Packaging, flat lay' }
      ]),
      details: {
        client: 'Atlas Coffee Roasters',
        location: 'Roastery, Leeds',
        date: 'January 2026',
        services: ['Brand film', 'Photography'],
        deliverables: ['90-second hero film', '6 social cut-downs', '80 edited stills'],
        credits: [
          { role: 'Direction', name: 'Zangrid Studios' },
          { role: 'Photography', name: 'Zangrid Studios' },
          { role: 'Sound mix', name: 'Add name' }
        ]
      }
    },
    {
      id: 'north-rail',
      title: 'North Rail',
      category: 'brand',
      year: '2025',
      featured: true,
      hue: 205,
      blurb: 'Recruitment film and photography refresh for a national infrastructure operator.',
      tags: ['Recruitment', 'Interviews', '3 min'],
      films: [
        {
          title: 'Recruitment film',
          duration: '3:02',
          orientation: 'horizontal',
          video: { type: 'file', src: S + 'ForBiggerBlazes.mp4' }
        }
      ],
      gallery: stills(205, [
        { caption: 'Depot, first light' },
        { caption: 'Engineer portrait', orientation: 'portrait' },
        { caption: 'Track team' },
        { caption: 'Control room' }
      ]),
      details: {
        client: 'North Rail',
        location: 'Six depots, UK',
        date: 'November 2025',
        services: ['Brand film', 'Photography'],
        deliverables: ['3-minute film', '200 image library', 'Subtitled and audio-described masters'],
        credits: [
          { role: 'Direction', name: 'Zangrid Studios' },
          { role: 'Interviews', name: 'Add name' }
        ]
      }
    },
    {
      id: 'sable-studio',
      title: 'Sable Studio',
      category: 'brand',
      year: '2025',
      hue: 275,
      blurb: 'Monthly always-on content drop — unboxings, demos and testimonials in creator voice.',
      tags: ['Retainer', 'Always-on', 'Monthly'],
      films: [
        {
          title: 'Monthly drop, edit 03',
          duration: '0:35',
          orientation: 'vertical',
          video: { type: 'file', src: S + 'WeAreGoingOnBullrun.mp4' }
        }
      ],
      gallery: stills(275, [{ caption: 'Set, monthly shoot' }, { caption: 'Product in use', orientation: 'portrait' }]),
      details: {
        client: 'Sable Studio',
        location: 'London',
        date: 'Retainer, 2025–',
        services: ['Content retainer'],
        deliverables: ['12 videos per month', '40 stills per month', 'Shared asset library'],
        credits: [{ role: 'Production', name: 'Zangrid Studios' }]
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

  return { site, clients, projects, categories, packages, testimonials };
})();
