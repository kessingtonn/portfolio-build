/* =========================================================
   Zangrid Studios — site behaviour
   Each block is independent and no-ops when its markup is
   absent, so one file serves every page.
   ========================================================= */
(function () {
  'use strict';

  const DATA = window.ZANGRID || { site: {}, projects: [], categories: [], testimonials: [] };
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------
     1. Sticky nav + mobile menu
     --------------------------------------------------- */
  (function nav() {
    const bar = $('.nav');
    if (!bar) return;

    const onScroll = () => bar.classList.toggle('is-stuck', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const toggle = $('.nav__toggle');
    const menu = $('#site-menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
      menu.setAttribute('aria-hidden', String(!open));
    };

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

    /* Dropdowns: hover opens them on pointer devices, click and
       arrow keys work everywhere. */
    const drops = $$('.nav__drop');
    const closeDrops = (except) => {
      drops.forEach((d) => {
        if (d === except) return;
        d.classList.remove('is-open');
        $('.nav__drop-btn', d).setAttribute('aria-expanded', 'false');
      });
    };

    drops.forEach((drop) => {
      const btn = $('.nav__drop-btn', drop);
      const panel = $('.nav__panel', drop);
      if (!btn || !panel) return;

      const openDrop = (open) => {
        drop.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        if (open) closeDrops(drop);
      };

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrop(btn.getAttribute('aria-expanded') !== 'true');
      });
      drop.addEventListener('mouseenter', () => openDrop(true));
      drop.addEventListener('mouseleave', () => openDrop(false));
      drop.addEventListener('focusout', (e) => {
        if (!drop.contains(e.relatedTarget)) openDrop(false);
      });
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDrop(true);
          const first = $('a', panel);
          if (first) first.focus();
        }
      });
      panel.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        openDrop(false);
        btn.focus();
      });
    });
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) setOpen(false);
    });
  })();

  /* ---------------------------------------------------
     2. Current page highlight
     --------------------------------------------------- */
  (function currentPage() {
    let path = window.location.pathname.split('/').pop();
    if (!path) path = 'index.html';
    $$('[data-nav]').forEach((link) => {
      if (link.getAttribute('data-nav') === path) link.setAttribute('aria-current', 'page');
    });
    /* a dropdown parent counts as current when one of its links is */
    $$('.nav__drop').forEach((drop) => {
      if (drop.querySelector('[aria-current="page"]')) {
        const btn = drop.querySelector('.nav__drop-btn');
        if (btn) btn.classList.add('is-current');
      }
    });
  })();

  /* ---------------------------------------------------
     3. Hero background video
     Autoplays muted + looping; falls back to the animated
     gradient if the browser or network refuses it.
     --------------------------------------------------- */
  (function heroVideo() {
    const hero = $('.hero');
    const video = $('.hero__media video');
    if (!hero || !video) return;

    /* Sources come from data.js so nothing 404s before the
       studio has dropped its own loop in. */
    const sources = (DATA.site && DATA.site.heroVideo) || [];
    sources.forEach((item) => {
      const source = document.createElement('source');
      source.src = item.src;
      if (item.type) source.type = item.type;
      video.appendChild(source);
    });

    const markPlaying = () => {
      hero.classList.add('is-playing');
      video.classList.add('is-ready');
    };

    video.addEventListener('playing', markPlaying);
    video.addEventListener('loadeddata', () => {
      if (video.readyState >= 2 && !video.paused) markPlaying();
    });
    video.addEventListener('error', () => hero.classList.remove('is-playing'), true);

    const play = () => {
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => {
          /* Autoplay blocked — the animated fallback stays,
             and the toggle below lets the visitor start it. */
        });
      }
    };

    if (reducedMotion) {
      video.removeAttribute('autoplay');
      video.pause();
    } else {
      video.load();
      play();
    }

    /* Play / pause control */
    const ctrl = $('.hero__ctrl');
    if (ctrl) {
      ctrl.setAttribute('aria-pressed', String(reducedMotion));
      ctrl.addEventListener('click', () => {
        if (video.paused) {
          play();
          ctrl.setAttribute('aria-pressed', 'false');
          ctrl.setAttribute('aria-label', 'Pause background video');
        } else {
          video.pause();
          ctrl.setAttribute('aria-pressed', 'true');
          ctrl.setAttribute('aria-label', 'Play background video');
        }
      });
    }

    /* Stop decoding while the hero is off-screen */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const paused = ctrl && ctrl.getAttribute('aria-pressed') === 'true';
            if (paused || reducedMotion) return;
            if (entry.isIntersecting) play();
            else video.pause();
          });
        },
        { threshold: 0.15 }
      );
      io.observe(hero);
    }
  })();

  /* ---------------------------------------------------
     4. Scroll reveals
     --------------------------------------------------- */
  (function reveals() {
    const items = $$('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || reducedMotion) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    items.forEach((el) => io.observe(el));
  })();

  /* ---------------------------------------------------
     5. Marquee — duplicate the track for a seamless loop
     --------------------------------------------------- */
  (function marquee() {
    $$('.marquee').forEach((el) => {
      const track = $('.marquee__track', el);
      if (!track) return;
      const clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      el.appendChild(clone);
    });
  })();

  /* ---------------------------------------------------
     6. Portfolio — projects, films, photos
     --------------------------------------------------- */
  const escapeHtml = (value) =>
    String(value == null ? '' : value).replace(/[&<>"']/g, (c) => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });

  const CATS = DATA.categories || [];
  const category = (id) => CATS.filter((c) => c.id === id)[0] || { id: id, label: id, page: 'work.html' };
  const categoryLabel = (id) => category(id).label;

  /* Normalised view of the data: every project ends up with
     films[] and gallery[], plus a cover and an orientation,
     whichever shape it was written in. */
  const PROJECTS = (DATA.projects || []).map(function (p) {
    const films = (p.films || []).slice();
    /* legacy single-video shape stays supported */
    if (!films.length && p.video) {
      films.push({
        title: p.title,
        orientation: p.orientation || 'horizontal',
        video: p.video,
        preview: p.preview,
        poster: p.poster,
        link: p.link
      });
    }
    const gallery = (p.gallery || []).slice();
    return Object.assign({}, p, {
      films: films,
      gallery: gallery,
      orientation: p.orientation || (films[0] && films[0].orientation) || 'horizontal',
      hasFilm: films.length > 0,
      hasPhoto: gallery.length > 0,
      cover: p.cover || (gallery[0] && gallery[0].src) || p.poster || null
    });
  });

  const projectById = (id) => PROJECTS.filter((p) => p.id === id)[0];

  /* Flat lists, each item carrying a pointer back to its project */
  const FILMS = [];
  const PHOTOS = [];
  PROJECTS.forEach(function (p) {
    p.films.forEach(function (film, i) {
      FILMS.push({ project: p, film: film, index: i, orientation: film.orientation || 'horizontal' });
    });
    p.gallery.forEach(function (photo, i) {
      PHOTOS.push({ project: p, photo: photo, index: i });
    });
  });

  function previewFor(project, film) {
    if (film && film.preview) return film.preview;
    if (film && film.video && film.video.type === 'file') return film.video.src;
    if (project.preview) return project.preview;
    return null;
  }

  /* Placeholder tile, tinted by hue, used until real media lands */
  function placeholder(hue, label, num) {
    return (
      '<span class="card__poster" style="--h:' + (hue || 40) + '"' +
      (num ? ' data-num="' + escapeHtml(num) + '"' : '') +
      ' role="img" aria-label="' + escapeHtml(label || 'Placeholder artwork') + '"></span>'
    );
  }

  function mediaFor(src, alt, hue, num) {
    return src
      ? '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(alt || '') + '" loading="lazy" decoding="async">'
      : placeholder(hue, alt, num);
  }

  /* ---- project tile (work page + home) ---- */
  function cardMarkup(project, index) {
    const classes = ['card'];
    if (project.wide) classes.push('card--wide');
    if (project.portrait || project.orientation === 'vertical') classes.push('card--portrait');

    const media = mediaFor(project.cover, project.title, project.hue, String(index + 1).padStart(2, '0'));
    const preview = project.hasFilm ? previewFor(project, project.films[0]) : null;
    const badge = project.hasFilm
      ? '<span class="card__play"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z"/></svg>' +
        (project.films.length > 1 ? project.films.length + ' films' : 'Play film') + '</span>'
      : '<span class="card__play">' + project.gallery.length + ' photographs</span>';
    const ratio = project.hasFilm
      ? '<span class="card__ratio">' + (project.orientation === 'vertical' ? '9:16' : '16:9') + '</span>'
      : '<span class="card__ratio">Photo</span>';

    return (
      '<button type="button" class="' + classes.join(' ') + ' reveal" data-project="' + escapeHtml(project.id) + '" ' +
      'data-category="' + escapeHtml(project.category) + '" data-orientation="' + escapeHtml(project.orientation) + '"' +
      (preview ? ' data-preview="' + escapeHtml(preview) + '"' : '') + '>' +
      '<span class="card__media">' + media + ratio + badge + '</span>' +
      '<span class="card__body">' +
      '<span class="card__title">' + escapeHtml(project.title) + '</span>' +
      '<span class="card__meta">' + escapeHtml(categoryLabel(project.category)) + ' · ' + escapeHtml(project.year) + '</span>' +
      '</span>' +
      '</button>'
    );
  }

  /* ---- film tile ---- */
  function filmMarkup(entry, index) {
    const p = entry.project;
    const f = entry.film;
    const vertical = entry.orientation === 'vertical';
    const preview = previewFor(p, f);
    const media = mediaFor(f.poster, f.title || p.title, p.hue, String(index + 1).padStart(2, '0'));

    return (
      '<button type="button" class="card reveal' + (vertical ? ' card--portrait' : '') + '" ' +
      'data-film="' + escapeHtml(p.id) + ':' + entry.index + '" ' +
      'data-category="' + escapeHtml(p.category) + '" data-orientation="' + escapeHtml(entry.orientation) + '"' +
      (preview ? ' data-preview="' + escapeHtml(preview) + '"' : '') + '>' +
      '<span class="card__media">' + media +
      '<span class="card__ratio">' + (vertical ? '9:16' : '16:9') + (f.duration ? ' · ' + escapeHtml(f.duration) : '') + '</span>' +
      '<span class="card__play"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z"/></svg>Play</span>' +
      '</span>' +
      '<span class="card__body">' +
      '<span class="card__title">' + escapeHtml(f.title || p.title) + '</span>' +
      '<span class="card__meta">' + escapeHtml(p.title) + '</span>' +
      '</span>' +
      '</button>'
    );
  }

  /* ---- photo tile ---- */
  function photoMarkup(entry, index) {
    const p = entry.project;
    const ph = entry.photo;
    const portraitShot = ph.orientation === 'portrait';
    return (
      '<button type="button" class="shot reveal' + (portraitShot ? ' shot--portrait' : '') + '" ' +
      'data-photo="' + escapeHtml(p.id) + ':' + entry.index + '" data-category="' + escapeHtml(p.category) + '">' +
      '<span class="shot__media">' +
      mediaFor(ph.src, ph.alt || ph.caption || p.title, ph.hue == null ? p.hue : ph.hue, String(index + 1).padStart(2, '0')) +
      '<span class="shot__zoom" aria-hidden="true">View</span>' +
      '</span>' +
      '<span class="shot__cap">' + escapeHtml(ph.caption || p.title) +
      '<span class="muted"> — ' + escapeHtml(p.title) + '</span></span>' +
      '</button>'
    );
  }

  /* ---- hover / focus preview ------------------------
     A muted, looping clip plays inside the tile while the
     visitor hovers or tabs to it. Skipped for reduced
     motion, data-saver, and coarse pointers (where there
     is no hover and the data would be wasted).
     -------------------------------------------------- */
  const canPreview = (function () {
    if (reducedMotion) return false;
    if (!window.matchMedia('(hover: hover)').matches) return false;
    const conn = navigator.connection;
    return !(conn && (conn.saveData || /2g/.test(conn.effectiveType || '')));
  })();

  function attachPreview(card) {
    const src = card.getAttribute('data-preview');
    const media = $('.card__media', card);
    if (!src || !media) return;
    let video = null;

    const start = () => {
      if (video) {
        const p = video.play();
        if (p && p.catch) p.catch(function () {});
        return;
      }
      video = document.createElement('video');
      video.className = 'card__preview';
      video.src = src;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('aria-hidden', 'true');
      video.preload = 'metadata';
      video.addEventListener('playing', () => video.classList.add('is-ready'));
      media.appendChild(video);
      const attempt = video.play();
      if (attempt && attempt.catch) attempt.catch(function () {});
    };

    const stop = () => {
      if (!video) return;
      video.classList.remove('is-ready');
      video.pause();
    };

    card.addEventListener('mouseenter', start);
    card.addEventListener('mouseleave', stop);
    card.addEventListener('focus', start);
    card.addEventListener('blur', stop);
  }

  function finish(host) {
    $$('.reveal', host).forEach((el) => el.classList.add('is-in'));
    if (canPreview) $$('[data-preview]', host).forEach(attachPreview);
  }

  function emptyNote(host, message) {
    host.innerHTML = '<p class="empty-note">' + message + '</p>';
  }

  /* ---- grids ---- */
  function renderGrid(grid) {
    const only = grid.getAttribute('data-filter');
    const cat = grid.getAttribute('data-category');
    const orientation = grid.getAttribute('data-orientation');
    const limit = parseInt(grid.getAttribute('data-limit'), 10);
    const featuredOnly = grid.hasAttribute('data-featured');

    let list = PROJECTS.slice();
    if (featuredOnly) list = list.filter((p) => p.featured);
    if (cat) list = list.filter((p) => p.category === cat);
    if (orientation) list = list.filter((p) => p.orientation === orientation);
    if (only && only !== 'all') list = list.filter((p) => p.category === only);
    if (!isNaN(limit)) list = list.slice(0, limit);

    if (!list.length) {
      emptyNote(grid, 'No projects in this collection yet — new work lands here first.');
      return;
    }
    grid.innerHTML = list.map(cardMarkup).join('');
    finish(grid);
  }

  function renderFilmGrid(grid) {
    const cat = grid.getAttribute('data-category');
    const orientation = grid.getAttribute('data-orientation');
    const limit = parseInt(grid.getAttribute('data-limit'), 10);

    let list = FILMS.slice();
    if (cat) list = list.filter((e) => e.project.category === cat);
    if (orientation) list = list.filter((e) => e.orientation === orientation);
    if (!isNaN(limit)) list = list.slice(0, limit);

    if (!list.length) {
      emptyNote(grid, 'No ' + (orientation === 'vertical' ? 'vertical' : 'films') + ' in this collection yet.');
      return;
    }
    grid.innerHTML = list.map(filmMarkup).join('');
    finish(grid);
  }

  function renderPhotoGrid(grid) {
    const cat = grid.getAttribute('data-category');
    const limit = parseInt(grid.getAttribute('data-limit'), 10);

    let list = PHOTOS.slice();
    if (cat) list = list.filter((e) => e.project.category === cat);
    if (!isNaN(limit)) list = list.slice(0, limit);

    if (!list.length) {
      emptyNote(grid, 'Photographs from this collection are on their way.');
      return;
    }
    grid.innerHTML = list.map(photoMarkup).join('');
    finish(grid);
  }

  const grids = $$('[data-work-grid]');
  grids.forEach(renderGrid);
  $$('[data-film-grid]').forEach(renderFilmGrid);
  $$('[data-photo-grid]').forEach(renderPhotoGrid);

  /* ---- project detail blocks ---- */
  function detailMarkup(project) {
    const d = project.details || {};
    const rows = [
      ['Client', d.client],
      ['Location', d.location],
      ['Date', d.date],
      ['Services', (d.services || []).join(', ')]
    ].filter((row) => row[1]);

    const deliverables = (d.deliverables || [])
      .map((item) => '<li><span>' + escapeHtml(item) + '</span></li>')
      .join('');
    const credits = (d.credits || [])
      .map(
        (c) =>
          '<div class="credit"><span class="credit__role">' + escapeHtml(c.role) +
          '</span><span class="credit__name">' + escapeHtml(c.name) + '</span></div>'
      )
      .join('');

    const counts = [];
    if (project.hasFilm) counts.push(project.films.length + (project.films.length === 1 ? ' film' : ' films'));
    if (project.hasPhoto) counts.push(project.gallery.length + ' photographs');

    return (
      '<article class="proj reveal" id="' + escapeHtml(project.id) + '">' +
      '<div class="proj__head">' +
      '<div><h3 class="proj__title">' + escapeHtml(project.title) + '</h3>' +
      '<p class="muted">' + escapeHtml(project.blurb || '') + '</p></div>' +
      '<p class="eyebrow">' + escapeHtml(counts.join(' · ')) + '</p>' +
      '</div>' +
      '<div class="proj__grid">' +
      '<dl class="spec">' +
      rows
        .map((row) => '<div><dt>' + escapeHtml(row[0]) + '</dt><dd>' + escapeHtml(row[1]) + '</dd></div>')
        .join('') +
      '</dl>' +
      (deliverables ? '<div><p class="eyebrow">Delivered</p><ul class="pkg__list">' + deliverables + '</ul></div>' : '') +
      (credits ? '<div><p class="eyebrow">Credits</p><div class="credits">' + credits + '</div></div>' : '') +
      '</div>' +
      (project.hasFilm
        ? '<div class="proj__films">' +
          project.films
            .map(function (f, i) {
              return (
                '<button type="button" class="chipbtn" data-film="' + escapeHtml(project.id) + ':' + i + '">' +
                '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z"/></svg>' +
                escapeHtml(f.title || 'Film') +
                (f.duration ? ' · ' + escapeHtml(f.duration) : '') +
                '</button>'
              );
            })
            .join('') +
          '</div>'
        : '') +
      '</article>'
    );
  }

  $$('[data-project-details]').forEach(function (host) {
    const cat = host.getAttribute('data-project-details');
    const list = cat && cat !== 'all' ? PROJECTS.filter((p) => p.category === cat) : PROJECTS;
    if (!list.length) {
      emptyNote(host, 'Project details land here as work is published.');
      return;
    }
    host.innerHTML = list.map(detailMarkup).join('');
    finish(host);
  });

  /* ---- category copy, counts and links ---- */
  $$('[data-category-copy]').forEach(function (el) {
    const parts = el.getAttribute('data-category-copy').split(':');
    const cat = category(parts[0]);
    const field = parts[1] || 'intro';
    if (cat[field]) el.textContent = cat[field];
  });

  $$('[data-category-stats]').forEach(function (host) {
    const id = host.getAttribute('data-category-stats');
    const list = PROJECTS.filter((p) => p.category === id);
    const films = list.reduce((n, p) => n + p.films.length, 0);
    const photos = list.reduce((n, p) => n + p.gallery.length, 0);
    const years = list.map((p) => p.year).sort();
    const stat = (n, label) => '<div class="stat"><p class="stat__n">' + n + '</p><p class="stat__l">' + label + '</p></div>';
    host.innerHTML =
      stat(list.length, list.length === 1 ? 'Project' : 'Projects') +
      stat(films, films === 1 ? 'Film' : 'Films') +
      stat(photos, 'Photographs') +
      stat(years.length ? years[years.length - 1] : '—', 'Most recent');
  });

  /* ---- inner-page hero backdrop ----------------------
     A category can supply a still or a silent looping clip;
     without one the animated gradient carries the hero.
     -------------------------------------------------- */
  $$('[data-hero-media]').forEach(function (host) {
    const cat = category(host.getAttribute('data-hero-media'));
    const hero = host.closest('.hero');
    if (cat.heroVideo && !reducedMotion) {
      const video = document.createElement('video');
      video.src = cat.heroVideo;
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('aria-hidden', 'true');
      if (cat.heroImage) video.poster = cat.heroImage;
      video.addEventListener('playing', function () {
        video.classList.add('is-ready');
        if (hero) hero.classList.add('is-playing');
      });
      host.insertBefore(video, host.firstChild);
      const attempt = video.play();
      if (attempt && attempt.catch) attempt.catch(function () {});
    } else if (cat.heroImage) {
      const img = document.createElement('img');
      img.src = cat.heroImage;
      img.alt = '';
      img.className = 'is-ready';
      host.insertBefore(img, host.firstChild);
      if (hero) hero.classList.add('is-playing');
    }
  });

  /* ---- the crew (studio page) ---- */
  $$('[data-crew]').forEach(function (host) {
    const list = DATA.crew || [];
    host.innerHTML = list
      .map(function (person, i) {
        const media = person.photo
          ? '<img class="ratio-4-5" src="' + escapeHtml(person.photo) + '" alt="' +
            escapeHtml(person.name) + '" loading="lazy" decoding="async">'
          : '<div class="card__poster ratio-4-5" style="--h:' + (person.hue || 40) +
            '" role="img" aria-label="Portrait placeholder for ' + escapeHtml(person.name) + '"></div>';
        return (
          '<figure class="figure reveal" data-delay="' + (i % 4) + '">' + media +
          '<figcaption>' + escapeHtml(person.name) +
          (person.role ? ' · ' + escapeHtml(person.role) : '') + '</figcaption></figure>'
        );
      })
      .join('');
    finish(host);
  });

  /* Numbered category rows (home page) */
  $$('[data-category-rows]').forEach(function (host) {
    host.innerHTML = CATS.map(function (c, i) {
      const list = PROJECTS.filter((p) => p.category === c.id);
      const films = list.reduce((n, p) => n + p.films.length, 0);
      const photos = list.reduce((n, p) => n + p.gallery.length, 0);
      const counts = [];
      if (films) counts.push(films + (films === 1 ? ' film' : ' films'));
      if (photos) counts.push(photos + ' photographs');
      return (
        '<article class="row reveal">' +
        '<p class="row__n">' + String(i + 1).padStart(2, '0') + '</p>' +
        '<h3 class="row__t"><a href="' + c.page + '" class="link-u">' + escapeHtml(c.label) + '</a></h3>' +
        '<p class="row__d">' + escapeHtml(c.lede || '') +
        (counts.length ? '<span class="muted"> — ' + counts.join(', ') + '</span>' : '') +
        '</p>' +
        '</article>'
      );
    }).join('');
    finish(host);
  });

  $$('[data-category-nav]').forEach(function (host) {
    const current = host.getAttribute('data-category-nav');
    host.innerHTML = CATS.map(
      (c) =>
        '<a class="filter" href="' + c.page + '"' + (c.id === current ? ' aria-current="page"' : '') + '>' +
        escapeHtml(c.label) + '</a>'
    ).join('');
  });

  /* Filters (work page) */
  (function filters() {
    const bar = $('[data-filters]');
    const grid = $('[data-work-grid][data-filterable]');
    if (!bar || !grid) return;

    const all = [{ id: 'all', label: 'All work' }].concat(CATS);
    bar.innerHTML = all
      .map(
        (c) =>
          '<button type="button" class="filter" data-cat="' + c.id + '" aria-pressed="' +
          (c.id === 'all') + '">' + escapeHtml(c.label) + '</button>'
      )
      .join('');

    const apply = (cat, push) => {
      grid.setAttribute('data-filter', cat);
      renderGrid(grid);
      $$('.filter', bar).forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === cat)));
      const count = $('[data-work-count]');
      if (count) {
        const n = grid.querySelectorAll('.card').length;
        count.textContent = n + (n === 1 ? ' project' : ' projects');
      }
      if (push && window.history && window.history.replaceState) {
        const url = cat === 'all' ? window.location.pathname : window.location.pathname + '?c=' + cat;
        window.history.replaceState({}, '', url);
      }
    };

    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter');
      if (btn) apply(btn.getAttribute('data-cat'), true);
    });

    const initial = new URLSearchParams(window.location.search).get('c');
    apply(initial && all.some((c) => c.id === initial) ? initial : 'all', false);
  })();

  /* ---------------------------------------------------
     7. Lightbox — plays films, shows photographs
     Opened by any [data-project], [data-film="id:index"]
     or [data-photo="id:index"] control on the page.
     --------------------------------------------------- */
  (function lightbox() {
    if (!PROJECTS.length) return;

    const box = document.createElement('div');
    box.className = 'lb';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Project viewer');
    box.innerHTML =
      '<button type="button" class="lb__close" aria-label="Close viewer">&#10005;</button>' +
      '<button type="button" class="lb__nav lb__nav--prev" aria-label="Previous">&#8249;</button>' +
      '<button type="button" class="lb__nav lb__nav--next" aria-label="Next">&#8250;</button>' +
      '<div class="lb__inner">' +
      '<div class="lb__frame" data-lb-frame></div>' +
      '<div class="lb__meta">' +
      '<div><p class="lb__title" data-lb-title></p><p class="muted" data-lb-blurb></p></div>' +
      '<div class="tag-list" data-lb-tags></div>' +
      '</div>' +
      '<p><a class="arrow-link" data-lb-link href="#" target="_blank" rel="noopener">Watch full film</a></p>' +
      '</div>';
    document.body.appendChild(box);

    const frame = $('[data-lb-frame]', box);
    const titleEl = $('[data-lb-title]', box);
    const blurbEl = $('[data-lb-blurb]', box);
    const tagsEl = $('[data-lb-tags]', box);
    const linkEl = $('[data-lb-link]', box);
    const closeBtn = $('.lb__close', box);
    const prevBtn = $('.lb__nav--prev', box);
    const nextBtn = $('.lb__nav--next', box);
    let lastFocus = null;
    let sequence = [];   /* photos being paged through */
    let position = 0;

    function filmEmbed(project, film) {
      const v = film.video || {};
      if (v.type === 'youtube') {
        return (
          '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) +
          '?autoplay=1&rel=0&modestbranding=1" title="' + escapeHtml(film.title || project.title) +
          '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
        );
      }
      if (v.type === 'vimeo') {
        return (
          '<iframe src="https://player.vimeo.com/video/' + encodeURIComponent(v.id) +
          '?autoplay=1&title=0&byline=0&portrait=0" title="' + escapeHtml(film.title || project.title) +
          '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>'
        );
      }
      if (v.src) {
        return '<video src="' + escapeHtml(v.src) + '" controls autoplay playsinline preload="metadata"></video>';
      }
      return (
        '<div class="lb__missing"><p class="eyebrow">Film coming soon</p>' +
        '<p class="muted">Add a `video` to this film in assets/js/data.js.</p></div>'
      );
    }

    function filmUrl(project, film) {
      if (film.link) return film.link;
      const v = film.video || {};
      if (v.type === 'youtube') return 'https://www.youtube.com/watch?v=' + v.id;
      if (v.type === 'vimeo') return 'https://vimeo.com/' + v.id;
      return v.src || null;
    }

    function setNav(show) {
      prevBtn.hidden = !show;
      nextBtn.hidden = !show;
    }

    function showFilm(project, index) {
      const film = project.films[index] || project.films[0];
      if (!film) return showPhotoSet(project, 0);
      sequence = [];
      setNav(false);
      frame.classList.toggle('lb__frame--vertical', (film.orientation || project.orientation) === 'vertical');
      frame.innerHTML = filmEmbed(project, film);
      titleEl.textContent = film.title && film.title !== project.title
        ? project.title + ' — ' + film.title
        : project.title;
      blurbEl.textContent = project.blurb || '';
      tagsEl.innerHTML = (project.tags || [])
        .concat(film.duration ? [film.duration] : [])
        .map((t) => '<span class="tag">' + escapeHtml(t) + '</span>')
        .join('');

      const url = filmUrl(project, film);
      const v = film.video || {};
      if (url) {
        linkEl.href = url;
        linkEl.textContent =
          v.type === 'youtube' ? 'Watch on YouTube' : v.type === 'vimeo' ? 'Watch on Vimeo' : 'Open full film';
        linkEl.parentElement.style.display = '';
      } else {
        linkEl.parentElement.style.display = 'none';
      }
      reveal();
    }

    function showPhotoSet(project, index) {
      sequence = project.gallery.map((photo, i) => ({ project: project, photo: photo, index: i }));
      position = Math.max(0, Math.min(index, sequence.length - 1));
      setNav(sequence.length > 1);
      paintPhoto();
      reveal();
    }

    function paintPhoto() {
      const entry = sequence[position];
      if (!entry) return;
      const p = entry.project;
      const ph = entry.photo;
      frame.classList.toggle('lb__frame--vertical', ph.orientation === 'portrait');
      frame.innerHTML = ph.src
        ? '<img src="' + escapeHtml(ph.src) + '" alt="' + escapeHtml(ph.alt || ph.caption || p.title) + '">'
        : '<div class="lb__missing"><p class="eyebrow">' + escapeHtml(ph.caption || 'Photograph') + '</p>' +
          '<p class="muted">Add a `src` to this gallery entry in assets/js/data.js.</p></div>';
      titleEl.textContent = ph.caption ? p.title + ' — ' + ph.caption : p.title;
      blurbEl.textContent =
        (p.details && p.details.location ? p.details.location + ' · ' : '') +
        (position + 1) + ' of ' + sequence.length;
      tagsEl.innerHTML = (p.tags || []).map((t) => '<span class="tag">' + escapeHtml(t) + '</span>').join('');
      linkEl.parentElement.style.display = 'none';
    }

    function step(delta) {
      if (!sequence.length) return;
      position = (position + delta + sequence.length) % sequence.length;
      paintPhoto();
    }

    function reveal() {
      if (box.classList.contains('is-open')) return;
      box.classList.add('is-open');
      document.body.classList.add('is-locked');
      closeBtn.focus();
    }

    function open(project, kind, index) {
      lastFocus = document.activeElement;
      if (kind === 'photo') showPhotoSet(project, index);
      else if (kind === 'film') showFilm(project, index);
      else if (project.hasFilm) showFilm(project, 0);
      else showPhotoSet(project, 0);
    }

    function close() {
      box.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      frame.innerHTML = '';
      sequence = [];
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function parse(value) {
      const parts = String(value).split(':');
      return { id: parts[0], index: parseInt(parts[1], 10) || 0 };
    }

    document.addEventListener('click', (e) => {
      const filmBtn = e.target.closest('[data-film]');
      if (filmBtn) {
        const ref = parse(filmBtn.getAttribute('data-film'));
        const project = projectById(ref.id);
        if (project) open(project, 'film', ref.index);
        return;
      }
      const photoBtn = e.target.closest('[data-photo]');
      if (photoBtn) {
        const ref = parse(photoBtn.getAttribute('data-photo'));
        const project = projectById(ref.id);
        if (project) open(project, 'photo', ref.index);
        return;
      }
      const card = e.target.closest('[data-project]');
      if (card) {
        const project = projectById(card.getAttribute('data-project'));
        if (project) open(project, 'project', 0);
        return;
      }
      if (e.target === box) close();
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => step(-1));
    nextBtn.addEventListener('click', () => step(1));

    document.addEventListener('keydown', (e) => {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') return close();
      if (sequence.length > 1) {
        if (e.key === 'ArrowLeft') return step(-1);
        if (e.key === 'ArrowRight') return step(1);
      }
      if (e.key === 'Tab') {
        const focusable = $$('a[href], button:not([hidden]), iframe, video, [tabindex]:not([tabindex="-1"])', box);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  })();

  /* ---------------------------------------------------
     8. Studio details injected from data.js
     --------------------------------------------------- */
  (function details() {
    $$('[data-site]').forEach((el) => {
      const key = el.getAttribute('data-site');
      const value = DATA.site[key];
      if (!value) return;
      if (el.tagName === 'A') {
        el.href = key === 'email' ? 'mailto:' + value : key === 'phone' ? 'tel:' + value.replace(/\s/g, '') : value;
      }
      if (!el.hasAttribute('data-site-href-only')) el.textContent = value;
    });
    const year = $('[data-year]');
    if (year) year.textContent = new Date().getFullYear();
  })();
})();
