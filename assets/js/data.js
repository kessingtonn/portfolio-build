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

  /* ---- portfolio ------------------------------------
     category    : wedding | portrait | brand | ugc
     format      : film | photo
     orientation : horizontal (16:9) | vertical (9:16)
     video       : { type:'file',   src:'…mp4' }
                   { type:'youtube', id:'dQw4w9WgXcQ' }
                   { type:'vimeo',   id:'76979871' }
                   omit `video` for a photo-only story
     preview     : short muted mp4 played on hover. Falls
                   back to `video.src` for self-hosted
                   films; required for youtube/vimeo ones.
     link        : optional "watch on …" destination
     poster      : optional still, e.g. 'assets/img/still-01.jpg'
     hue         : 0–360, tints the generated poster when no
                   still is supplied
     ---------------------------------------------------- */
  const S = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';

  const projects = [
    {
      id: 'harper-elliot',
      orientation: 'horizontal',
      title: 'Harper & Elliot',
      client: 'Somerset, England',
      category: 'wedding',
      format: 'film',
      year: '2026',
      featured: true,
      wide: true,
      hue: 32,
      blurb:
        'A two-day celebration in a walled garden — shot on a single 35mm prime, cut to the vows.',
      tags: ['Wedding film', 'Documentary', '6 min'],
      video: { type: 'file', src: S + 'ForBiggerJoyrides.mp4' }
    },
    {
      id: 'noor-and-sam',
      orientation: 'horizontal',
      title: 'Noor & Sam',
      client: 'Lake Como, Italy',
      category: 'wedding',
      format: 'film',
      year: '2026',
      featured: true,
      hue: 18,
      blurb: 'Destination weekend, golden-hour ceremony, a highlight film that runs like a trailer.',
      tags: ['Wedding film', 'Destination', '4 min'],
      video: { type: 'file', src: S + 'ForBiggerEscapes.mp4' }
    },
    {
      id: 'the-daylight-room',
      title: 'The Daylight Room',
      client: 'Studio portraits',
      category: 'portrait',
      format: 'photo',
      year: '2026',
      portrait: true,
      hue: 210,
      blurb: 'Natural-light portrait sittings — one window, one wall, forty frames that feel like you.',
      tags: ['Portrait', 'Studio', '40 images']
    },
    {
      id: 'atlas-coffee',
      orientation: 'horizontal',
      title: 'Atlas Coffee Roasters',
      client: 'Brand campaign',
      category: 'brand',
      format: 'film',
      year: '2026',
      featured: true,
      hue: 26,
      blurb: 'Origin-to-cup brand film plus a stills library for a national wholesale launch.',
      tags: ['Brand film', 'Stills', '90 sec'],
      video: { type: 'file', src: S + 'ForBiggerMeltdowns.mp4' }
    },
    {
      id: 'kindred-skincare',
      orientation: 'vertical',
      title: 'Kindred Skincare',
      client: 'UGC / paid social',
      category: 'ugc',
      format: 'film',
      year: '2026',
      featured: true,
      portrait: true,
      hue: 320,
      blurb: 'Twelve vertical creator-style cuts built for paid social — three hooks, three edits each.',
      tags: ['UGC', '9:16', '12 assets'],
      video: { type: 'file', src: S + 'ForBiggerFun.mp4' }
    },
    {
      id: 'field-notes',
      title: 'Field Notes',
      client: 'Editorial portraits',
      category: 'portrait',
      format: 'photo',
      year: '2025',
      hue: 150,
      blurb: 'On-location editorial sittings for a founders series — shot across four cities in nine days.',
      tags: ['Portrait', 'Editorial', 'On location']
    },
    {
      id: 'north-rail',
      orientation: 'horizontal',
      title: 'North Rail',
      client: 'Corporate brand',
      category: 'brand',
      format: 'film',
      year: '2025',
      featured: true,
      wide: true,
      hue: 205,
      blurb: 'Recruitment film and photography refresh for a national infrastructure operator.',
      tags: ['Brand film', 'Interviews', '3 min'],
      video: { type: 'file', src: S + 'ForBiggerBlazes.mp4' }
    },
    {
      id: 'ivy-and-june',
      title: 'Ivy & June',
      client: 'City hall elopement',
      category: 'wedding',
      format: 'photo',
      year: '2025',
      hue: 42,
      blurb: 'Two hours, two witnesses, one very good pub afterwards. Reportage from start to finish.',
      tags: ['Elopement', 'Reportage', '120 images']
    },
    {
      id: 'sable-studio',
      orientation: 'vertical',
      title: 'Sable Studio',
      client: 'Product & UGC',
      category: 'ugc',
      format: 'film',
      year: '2025',
      portrait: true,
      hue: 275,
      blurb: 'Monthly always-on content drop — unboxings, demos and testimonials in creator voice.',
      tags: ['UGC', 'Retainer', 'Monthly'],
      video: { type: 'file', src: S + 'WeAreGoingOnBullrun.mp4' }
    },
    {
      id: 'lantern-house',
      title: 'Lantern House',
      client: 'Hospitality brand',
      category: 'brand',
      format: 'photo',
      year: '2025',
      hue: 12,
      blurb: 'Interiors, food and team photography for a restaurant group opening its second site.',
      tags: ['Brand stills', 'Hospitality', '180 images']
    },
    {
      id: 'first-light',
      orientation: 'horizontal',
      title: 'First Light',
      client: 'Couples session',
      category: 'portrait',
      format: 'film',
      year: '2025',
      hue: 190,
      blurb: 'A sunrise couples session on the coast, cut short and slow for the way it actually felt.',
      tags: ['Couples', 'Short film', '90 sec'],
      video: { type: 'file', src: S + 'ElephantsDream.mp4' }
    },
    {
      id: 'maren-atelier',
      orientation: 'horizontal',
      title: 'Maren Atelier',
      client: 'Fashion label',
      category: 'brand',
      format: 'film',
      year: '2024',
      hue: 340,
      blurb: 'Lookbook film and campaign stills for an independent label’s first flagship collection.',
      tags: ['Campaign', 'Fashion', '2 min'],
      video: { type: 'file', src: S + 'Sintel.mp4' }
    },
    {
      id: 'fold-and-co',
      orientation: 'vertical',
      title: 'Fold & Co',
      client: 'Product launch',
      category: 'brand',
      format: 'film',
      year: '2026',
      portrait: true,
      hue: 95,
      blurb: 'Vertical launch teasers cut three ways for TikTok, Reels and Shorts on the same shoot day.',
      tags: ['Vertical', '9:16', '6 assets'],
      video: { type: 'file', src: S + 'ForBiggerBlazes.mp4' }
    },
    {
      id: 'ovett-cycles',
      orientation: 'vertical',
      title: 'Ovett Cycles',
      client: 'Paid social',
      category: 'ugc',
      format: 'film',
      year: '2025',
      portrait: true,
      hue: 250,
      blurb: 'Hook-led vertical ads shot handheld — the winning cut ran for two quarters straight.',
      tags: ['UGC', 'Paid social', '9:16'],
      video: { type: 'file', src: S + 'ForBiggerEscapes.mp4' }
    },
    {
      id: 'vows-vertical',
      orientation: 'vertical',
      title: 'Vows, Vertical',
      client: 'Wedding social cuts',
      category: 'wedding',
      format: 'film',
      year: '2026',
      portrait: true,
      hue: 20,
      blurb: 'A 60-second vertical cut of the ceremony, delivered the morning after for the couple to share.',
      tags: ['Wedding', 'Vertical', '60 sec'],
      video: { type: 'file', src: S + 'ForBiggerJoyrides.mp4' }
    },
    {
      id: 'hartwell-founders',
      orientation: 'vertical',
      title: 'Hartwell Founders',
      client: 'Founder series',
      category: 'portrait',
      format: 'film',
      year: '2025',
      portrait: true,
      hue: 175,
      blurb: 'Vertical talking-head series for a hiring campaign — twelve founders, one afternoon each.',
      tags: ['Portrait', 'Interview', '9:16'],
      video: { type: 'file', src: S + 'ForBiggerMeltdowns.mp4' }
    }
  ];

  const categories = [
    { id: 'all', label: 'All work' },
    { id: 'wedding', label: 'Weddings' },
    { id: 'portrait', label: 'Portraits' },
    { id: 'brand', label: 'Brand' },
    { id: 'ugc', label: 'UGC' }
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
