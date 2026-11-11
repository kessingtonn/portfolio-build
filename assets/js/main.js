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
    /* an entry with `media` (e.g. '(orientation: portrait)') is only
       offered to screens that match it */
    const sources = ((DATA.site && DATA.site.heroVideo) || []).filter(
      (item) => !item.media || window.matchMedia(item.media).matches
    );
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

    /* Muted + inline is what lets browsers autoplay without a click. */
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    /* Only the visitor's own pause button stops the loop. */
    const userPaused = () => {
      const c = $('.hero__ctrl');
      return !!c && c.getAttribute('aria-pressed') === 'true';
    };

    /* Some devices refuse autoplay outright (iPhone Low Power Mode,
       data-saver modes). There the loop starts on the visitor's first
       touch, click, scroll or key press instead. */
    const KICKS = ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel'];
    let armed = false;
    const kick = () => {
      disarm();
      if (!userPaused()) play();
    };
    function arm() {
      if (armed) return;
      armed = true;
      KICKS.forEach((type) => window.addEventListener(type, kick, { passive: true }));
    }
    function disarm() {
      armed = false;
      KICKS.forEach((type) => window.removeEventListener(type, kick));
    }

    function play() {
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(arm);
    }

    video.addEventListener('playing', disarm);
    video.addEventListener('canplay', () => {
      if (video.paused && !userPaused()) play();
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && video.paused && !userPaused()) play();
    });

    video.load();
    play();

    /* Play / pause control */
    const ctrl = $('.hero__ctrl');
    if (ctrl) {
      ctrl.setAttribute('aria-pressed', 'false');
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
            if (paused) return;
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
      cover: p.cover || (gallery[0] && gallery[0].src) || p.poster || null,
      coverThumb: (function () {
        const c = p.cover || (gallery[0] && gallery[0].src);
        const hit = gallery.filter((g) => g.src === c)[0];
        return (hit && hit.thumb) || c || p.poster || null;
      })()
    });
  });

  const projectById = (id) => PROJECTS.filter((p) => p.id === id)[0];

  /* Flat lists, each item carrying a pointer back to its project */
  const FILMS = [];
  const PHOTOS = [];
  PROJECTS.forEach(function (p) {
    p.films.forEach(function (film, i) {
      const orientation = film.orientation || 'horizontal';
      FILMS.push({ project: p, film: film, index: i, orientation: orientation, ratio: orientation === 'vertical' ? 0.5625 : 1.7778 });
    });
    p.gallery.forEach(function (photo, i) {
      PHOTOS.push({ project: p, photo: photo, index: i, ratio: photoRatio(photo) });
    });
  });

  /* width ÷ height: an explicit `ratio`, else `width`/`height`,
     else a guess from `orientation` (corrected once the image loads) */
  function photoRatio(ph) {
    if (ph.ratio) return +ph.ratio;
    if (ph.width && ph.height) return +(ph.width / ph.height).toFixed(4);
    return ph.orientation === 'portrait' ? 0.6667 : 1.5;
  }

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

    const media = mediaFor(project.coverThumb, project.title, project.hue, String(index + 1).padStart(2, '0'));
    const preview = project.hasFilm ? previewFor(project, project.films[0]) : null;
    const badge = project.hasFilm
      ? '<span class="card__play"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z"/></svg>' +
        (project.films.length > 1 ? project.films.length + ' films' : 'Play film') + '</span>'
      : '<span class="card__play">' + project.gallery.length + ' photographs</span>';
    const ratio = project.hasFilm
      ? '<span class="card__ratio">' + (project.films[0].orientation === 'vertical' ? '9:16' : '16:9') + '</span>'
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
      'data-film="' + escapeHtml(p.id) + ':' + entry.index + '" style="--r:' + entry.ratio + '" ' +
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
      'data-photo="' + escapeHtml(p.id) + ':' + entry.index + '" style="--r:' + entry.ratio + '" data-category="' + escapeHtml(p.category) + '">' +
      '<span class="shot__media">' +
      mediaFor(ph.thumb || ph.src, ph.alt || ph.caption || p.title, ph.hue == null ? p.hue : ph.hue, String(index + 1).padStart(2, '0')) +
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

  function fadeIn(host) {
    $$('img', host).forEach(function (img) {
      const loaded = () => img.classList.add('is-loaded');
      if (img.complete) loaded();
      else {
        img.addEventListener('load', loaded, { once: true });
        img.addEventListener('error', loaded, { once: true });
      }
    });
  }

  function finish(host) {
    fadeIn(host);
    $$('.reveal', host).forEach((el) => el.classList.add('is-in'));
    if (canPreview) $$('[data-preview]', host).forEach(attachPreview);
  }

  function emptyNote(host, message) {
    host.innerHTML = '<p class="empty-note">' + message + '</p>';
  }

  /* ---- layouts ---------------------------------------
     Photo and film sections can be shown five ways:

       grid       even tiles with captions (the original)
       masonry    columns at each frame's natural shape
       seamless   edge-to-edge justified rows, no gaps
       filmstrip  one swipeable row, full width
       cinema     one big frame at a time, crossfading,
                  with a thumbnail rail underneath

     The default comes from data.js — a category's own
     `layouts`, then `site.layouts`. When the switcher is
     on, visitors can change it with the small control
     above each section and their pick is remembered.
     ---------------------------------------------------- */
  const LAYOUTS = {
    grid:      { label: 'Grid',      icon: 'M1 1h4.2v4.2H1zM6.8 1H11v4.2H6.8zM1 6.8h4.2V11H1zM6.8 6.8H11V11H6.8z' },
    masonry:   { label: 'Masonry',   icon: 'M1 1h4.2v6H1zM6.8 1H11v3.4H6.8zM1 8.2h4.2V11H1zM6.8 5.6H11V11H6.8z' },
    seamless:  { label: 'Seamless',  icon: 'M0 1h7.4v4.6H0zM7.6 1H12v4.6H7.6zM0 5.8h4.4V11H0zM4.6 5.8H12V11H4.6z' },
    filmstrip: { label: 'Filmstrip', icon: 'M0 3h2.6v6H0zM3.4 3h5.2v6H3.4zM9.4 3H12v6H9.4z' },
    cinema:    { label: 'Cinema',    icon: 'M1 1h10v7H1zM1 9.4h2.2V11H1zM3.9 9.4h2.2V11H3.9zM6.8 9.4H9V11H6.8zM9.7 9.4H11V11H9.7z' }
  };
  const ALLOWED = {
    photos: ['grid', 'masonry', 'seamless', 'filmstrip', 'cinema'],
    films: ['grid', 'seamless', 'filmstrip', 'cinema'],
    vertical: ['grid', 'seamless', 'filmstrip', 'cinema']
  };
  const SITE_LAYOUTS = (DATA.site && DATA.site.layouts) || {};
  const SWITCHER = SITE_LAYOUTS.switcher !== false;

  const store = {
    get: (k) => { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { window.localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  function layoutFor(grid) {
    const s = grid._zg;
    const allowed = ALLOWED[s.kind];
    const pick = (v) => (v && allowed.indexOf(v) !== -1 ? v : null);
    const own = (s.cat && category(s.cat).layouts) || {};
    return (
      (SWITCHER && pick(store.get(s.key))) ||
      pick(grid.getAttribute('data-layout')) ||
      pick(own[s.kind]) ||
      pick(SITE_LAYOUTS[s.kind]) ||
      'grid'
    );
  }

  /* Can we quietly autoplay muted clips and slideshows? */
  const canAutoplay = (function () {
    if (reducedMotion) return false;
    const conn = navigator.connection;
    return !(conn && (conn.saveData || /2g/.test(conn.effectiveType || '')));
  })();

  /* Real photographs report their true shape once loaded,
     so seamless rows and masonry columns fit them exactly. */
  function trackRatios(host) {
    $$('.shot img', host).forEach(function (img) {
      const apply = () => {
        if (!img.naturalWidth || !img.naturalHeight) return;
        const tile = img.closest('[style*="--r"]');
        if (tile) tile.style.setProperty('--r', (img.naturalWidth / img.naturalHeight).toFixed(4));
      };
      if (img.complete) apply();
      else img.addEventListener('load', apply, { once: true });
    });
  }

  /* ---- toolbar: layout switcher + filmstrip arrows ---- */
  function toolbar(grid) {
    const s = grid._zg;
    const bar = document.createElement('div');
    bar.className = 'layout-bar';
    const switcher = SWITCHER
      ? '<div class="layout-switch" role="radiogroup" aria-label="Layout">' +
        ALLOWED[s.kind]
          .map(function (l) {
            return (
              '<button type="button" role="radio" class="layout-switch__btn" data-set-layout="' + l + '" ' +
              'aria-checked="false" title="' + LAYOUTS[l].label + '">' +
              '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="' + LAYOUTS[l].icon + '"/></svg>' +
              '<span>' + LAYOUTS[l].label + '</span></button>'
            );
          })
          .join('') +
        '</div>'
      : '<span></span>';
    bar.innerHTML =
      switcher +
      '<div class="layout-bar__arrows" hidden>' +
      '<button type="button" class="round-btn" data-strip="-1" aria-label="Scroll back">&#8249;</button>' +
      '<button type="button" class="round-btn" data-strip="1" aria-label="Scroll on">&#8250;</button>' +
      '</div>';
    grid.parentNode.insertBefore(bar, grid);

    bar.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-set-layout]');
      if (btn) {
        s.layout = btn.getAttribute('data-set-layout');
        store.set(s.key, s.layout);
        present(grid);
        return;
      }
      const arrow = e.target.closest('[data-strip]');
      if (arrow) {
        const dir = parseInt(arrow.getAttribute('data-strip'), 10);
        grid.scrollBy({ left: dir * grid.clientWidth * 0.8, behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    });

    /* arrow keys move between the radio options */
    bar.addEventListener('keydown', function (e) {
      if (!e.target.matches('[data-set-layout]')) return;
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const opts = $$('[data-set-layout]', bar);
      const next = opts[(opts.indexOf(e.target) + (e.key === 'ArrowRight' ? 1 : -1) + opts.length) % opts.length];
      next.click();
      next.focus();
    });
    return bar;
  }

  function syncToolbar(grid) {
    const bar = grid._zg.bar;
    if (!bar) return;
    $$('[data-set-layout]', bar).forEach(function (b) {
      const on = b.getAttribute('data-set-layout') === grid._zg.layout;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    $('.layout-bar__arrows', bar).hidden = grid._zg.layout !== 'filmstrip' || grid._zg.items.length < 2;
  }

  /* ---- filmstrip: drag to scroll with a mouse ---- */
  function dragScroll(grid) {
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;
    grid.addEventListener('pointerdown', function (e) {
      if (grid._zg.layout !== 'filmstrip' || e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = grid.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) {
        moved = true;
        grid.classList.add('is-dragging');
      }
      if (moved) grid.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!dragging) return;
      dragging = false;
      grid.classList.remove('is-dragging');
    });
    /* a drag should not also open the viewer */
    grid.addEventListener('click', function (e) {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    }, true);
  }

  /* ---- cinema: one big frame, crossfading ---------- */
  function cinemaSlide(grid, i) {
    const s = grid._zg;
    const entry = s.items[i];
    const p = entry.project;
    let attr;
    let media;
    let caption;
    if (entry.film) {
      const f = entry.film;
      const preview = previewFor(p, f);
      attr = 'data-film="' + escapeHtml(p.id) + ':' + entry.index + '"';
      media =
        mediaFor(f.poster, f.title || p.title, p.hue, String(i + 1).padStart(2, '0')) +
        (preview && canAutoplay
          ? '<video class="cine__video" src="' + escapeHtml(preview) + '" muted loop playsinline autoplay preload="metadata" aria-hidden="true"></video>'
          : '');
      caption = (f.title || p.title) + (f.duration ? ' · ' + f.duration : '');
    } else {
      const ph = entry.photo;
      attr = 'data-photo="' + escapeHtml(p.id) + ':' + entry.index + '"';
      media = ph.src
        ? '<img class="cine__blur" src="' + escapeHtml(ph.thumb || ph.src) + '" alt="" aria-hidden="true">' +
          '<img src="' + escapeHtml(ph.src) + '" alt="' + escapeHtml(ph.alt || ph.caption || p.title) + '">'
        : placeholder(ph.hue == null ? p.hue : ph.hue, ph.caption || p.title, String(i + 1).padStart(2, '0'));
      caption = ph.caption || p.title;
    }
    return {
      html:
        '<button type="button" class="cine__slide" ' + attr + ' aria-label="Open ' + escapeHtml(caption) + ' in the viewer">' +
        media +
        (entry.film ? '<span class="card__play cine__play"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z"/></svg>Play film</span>' : '') +
        '</button>',
      caption: caption,
      project: p
    };
  }

  function thumbMarkup(grid, entry, i) {
    const p = entry.project;
    const src = entry.film ? entry.film.poster : entry.photo.thumb || entry.photo.src;
    const hue = entry.photo && entry.photo.hue != null ? entry.photo.hue : p.hue;
    return (
      '<button type="button" class="cine__thumb" data-cine-go="' + i + '" style="--r:' + entry.ratio + '" ' +
      'aria-label="Show ' + escapeHtml((entry.film ? entry.film.title : entry.photo.caption) || p.title) + '">' +
      (src ? '<img src="' + escapeHtml(src) + '" alt="" loading="lazy" decoding="async">' : placeholder(hue, '', '')) +
      '</button>'
    );
  }

  function buildCinema(grid) {
    const s = grid._zg;
    const vertical = s.kind === 'vertical';
    const delay = s.kind === 'photos' ? 5000 : 9000;
    grid.innerHTML =
      '<div class="cine' + (vertical ? ' cine--vertical' : '') + (s.kind === 'photos' ? ' cine--photos' : '') + '" ' +
      'tabindex="0" role="region" aria-roledescription="carousel" aria-label="Slideshow">' +
      '<div class="cine__stage" data-cine-stage></div>' +
      '<div class="cine__bar">' +
      '<div class="cine__caption" aria-live="polite"><span class="cine__title" data-cine-title></span>' +
      '<span class="cine__meta" data-cine-meta></span></div>' +
      '<div class="cine__controls">' +
      '<button type="button" class="round-btn" data-cine-step="-1" aria-label="Previous">&#8249;</button>' +
      '<button type="button" class="round-btn" data-cine-toggle aria-label="Pause slideshow"></button>' +
      '<button type="button" class="round-btn" data-cine-step="1" aria-label="Next">&#8250;</button>' +
      '</div></div>' +
      '<div class="cine__progress"><span data-cine-progress></span></div>' +
      '<div class="cine__rail">' + s.items.map((e, i) => thumbMarkup(grid, e, i)).join('') + '</div>' +
      '</div>';

    const root = $('.cine', grid);
    const stage = $('[data-cine-stage]', root);
    const titleEl = $('[data-cine-title]', root);
    const metaEl = $('[data-cine-meta]', root);
    const toggle = $('[data-cine-toggle]', root);
    const bar = $('[data-cine-progress]', root);
    const thumbs = $$('.cine__thumb', root);
    let current = -1;
    let timer = null;
    let playing = canAutoplay && s.items.length > 1;
    let hovering = false;
    let visible = true;

    function paintToggle() {
      toggle.innerHTML = playing
        ? '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z"/></svg>'
        : '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5l7.5 4.5L3 10.5z"/></svg>';
      toggle.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
      toggle.hidden = s.items.length < 2;
    }

    function schedule() {
      clearTimeout(timer);
      bar.style.transition = 'none';
      bar.style.transform = 'scaleX(0)';
      if (!playing || hovering || !visible || s.items.length < 2) return;
      void bar.offsetWidth; /* restart the progress line */
      bar.style.transition = 'transform ' + delay + 'ms linear';
      bar.style.transform = 'scaleX(1)';
      timer = setTimeout(() => go(current + 1), delay);
    }

    function go(i) {
      const n = s.items.length;
      i = ((i % n) + n) % n;
      if (i === current) return;
      const slide = cinemaSlide(grid, i);
      const layer = document.createElement('div');
      layer.className = 'cine__layer';
      layer.innerHTML = slide.html;
      stage.appendChild(layer);
      const old = $$('.cine__layer', stage).filter((l) => l !== layer);
      $$('video', layer).forEach((v) => v.addEventListener('playing', () => v.classList.add('is-ready'), { once: true }));
      fadeIn(layer);
      void layer.offsetWidth; /* commit the faded-out state so the crossfade runs */
      layer.classList.add('is-in');
      setTimeout(() => old.forEach((l) => l.remove()), reducedMotion ? 0 : 900);

      current = i;
      titleEl.textContent = slide.caption;
      metaEl.textContent = slide.project.title + ' · ' + (i + 1) + ' / ' + n;
      thumbs.forEach((t, k) => {
        t.classList.toggle('is-active', k === i);
        if (k === i) t.setAttribute('aria-current', 'true');
        else t.removeAttribute('aria-current');
      });
      const t = thumbs[i];
      const rail = t.parentNode;
      rail.scrollTo({ left: t.offsetLeft - rail.clientWidth / 2 + t.clientWidth / 2, behavior: reducedMotion ? 'auto' : 'smooth' });

      /* warm the next frame so the crossfade never waits */
      const next = s.items[(i + 1) % n];
      if (next && next.photo && next.photo.src) new Image().src = next.photo.src;
      schedule();
    }

    root.addEventListener('click', function (e) {
      const step = e.target.closest('[data-cine-step]');
      if (step) return go(current + parseInt(step.getAttribute('data-cine-step'), 10));
      const thumb = e.target.closest('[data-cine-go]');
      if (thumb) return go(parseInt(thumb.getAttribute('data-cine-go'), 10));
      if (e.target.closest('[data-cine-toggle]')) {
        playing = !playing;
        paintToggle();
        schedule();
      }
    });
    root.addEventListener('keydown', function (e) {
      if (e.target !== root && !e.target.matches('.cine__thumb')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
    });
    root.addEventListener('mouseenter', () => { hovering = true; schedule(); });
    root.addEventListener('mouseleave', () => { hovering = false; schedule(); });
    root.addEventListener('focusin', () => { hovering = true; schedule(); });
    root.addEventListener('focusout', () => { hovering = false; schedule(); });

    /* swipe the stage on touch screens */
    let sx = null;
    let swiped = false;
    stage.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; swiped = false; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (sx == null) return;
      const dx = e.changedTouches[0].clientX - sx;
      sx = null;
      if (Math.abs(dx) > 45) {
        swiped = true;
        go(current + (dx < 0 ? 1 : -1));
      }
    });
    stage.addEventListener('click', function (e) {
      if (swiped) { e.stopPropagation(); swiped = false; }
    }, true);

    /* rest when scrolled away */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        $$('video', stage).forEach((v) => {
          if (visible) { const p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
        });
        schedule();
      }, { threshold: 0.25 });
      io.observe(root);
      s.teardown = () => { io.disconnect(); clearTimeout(timer); };
    } else {
      s.teardown = () => clearTimeout(timer);
    }

    paintToggle();
    go(0);
  }

  function present(grid) {
    const s = grid._zg;
    if (s.teardown) { s.teardown(); s.teardown = null; }
    Object.keys(LAYOUTS).forEach((l) => grid.classList.toggle('is-layout-' + l, l === s.layout));
    syncToolbar(grid);
    if (!s.items.length) {
      emptyNote(grid, s.empty);
      return;
    }
    if (s.layout === 'cinema') buildCinema(grid);
    else {
      grid.innerHTML = s.items.map(s.markup).join('');
      grid.scrollLeft = 0;
    }
    finish(grid);
    trackRatios(grid);
  }

  function setUp(grid, kind, items, markup, empty) {
    const cat = grid.getAttribute('data-category');
    grid._zg = {
      kind: kind,
      cat: cat,
      items: items,
      markup: markup,
      empty: empty,
      key: 'zg-layout:' + location.pathname + ':' + (cat || 'all') + ':' + kind
    };
    grid._zg.layout = layoutFor(grid);
    if (items.length) grid._zg.bar = toolbar(grid);
    dragScroll(grid);
    present(grid);
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

    setUp(
      grid,
      orientation === 'vertical' ? 'vertical' : 'films',
      list,
      filmMarkup,
      'No ' + (orientation === 'vertical' ? 'vertical' : 'films') + ' in this collection yet.'
    );
  }

  function renderPhotoGrid(grid) {
    const cat = grid.getAttribute('data-category');
    const limit = parseInt(grid.getAttribute('data-limit'), 10);

    let list = PHOTOS.slice();
    if (cat) list = list.filter((e) => e.project.category === cat);
    if (!isNaN(limit)) list = list.slice(0, limit);

    setUp(grid, 'photos', list, photoMarkup, 'Photographs from this collection are on their way.');
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
    if (cat.heroVideo) {
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
      const start = function () {
        const attempt = video.play();
        if (attempt && attempt.catch) {
          attempt.catch(function () {
            /* autoplay refused: start on the first touch, scroll or key */
            ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel'].forEach(function (type) {
              window.addEventListener(type, start, { passive: true, once: true });
            });
          });
        }
      };
      start();
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
      '<div class="lb__top">' +
      '<span class="lb__count" data-lb-count></span>' +
      '<button type="button" class="lb__tool" data-lb-full aria-label="Full screen">' +
      '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1h3.5v1.2H2.2v2.3H1zM7.5 1H11v3.5H9.8V2.2H7.5zM1 7.5h1.2v2.3h2.3V11H1zM9.8 7.5H11V11H7.5V9.8h2.3z"/></svg></button>' +
      '<button type="button" class="lb__close" aria-label="Close viewer">&#10005;</button>' +
      '</div>' +
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
    const countEl = $('[data-lb-count]', box);
    const fullBtn = $('[data-lb-full]', box);
    const closeBtn = $('.lb__close', box);
    const prevBtn = $('.lb__nav--prev', box);
    const nextBtn = $('.lb__nav--next', box);
    let lastFocus = null;
    /* everything the visitor can page through: photos and
       films alike, in the order of the section they opened */
    let sequence = [];
    let position = 0;

    if (!(box.requestFullscreen || box.webkitRequestFullscreen)) fullBtn.hidden = true;

    /* The claude.ai preview blocks embedded players from other sites;
       a normal web host does not. */
    const CAN_EMBED_DRIVE = !/(^|\.)(claude\.ai|claudeusercontent\.com|claude\.site)$/.test(location.hostname);

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
      if (v.type === 'drive' && !CAN_EMBED_DRIVE) {
        /* hosts that refuse outside players (the claude.ai preview):
           loop the preview here and send the full film to Drive */
        const prev = film.preview || '';
        return (
          (prev
            ? '<video src="' + escapeHtml(prev) + '" muted loop autoplay playsinline' +
              (film.poster ? ' poster="' + escapeHtml(film.poster) + '"' : '') + '></video>'
            : '') +
          '<a class="lb__watch" href="https://drive.google.com/file/d/' + encodeURIComponent(v.id) +
          '/view" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z"/></svg>Watch the full film</a>'
        );
      }
      if (v.type === 'drive') {
        /* plays straight from Google Drive — the file must be shared
           as "anyone with the link can view" */
        return (
          '<iframe src="https://drive.google.com/file/d/' + encodeURIComponent(v.id) +
          '/preview" title="' + escapeHtml(film.title || project.title) +
          '" allow="autoplay; fullscreen" allowfullscreen></iframe>'
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
      if (v.type === 'drive') return 'https://drive.google.com/file/d/' + v.id + '/view';
      return v.src || null;
    }

    function tags(list) {
      return list.map((t) => '<span class="tag">' + escapeHtml(t) + '</span>').join('');
    }

    function paintFilm(project, film) {
      frame.classList.toggle('lb__frame--vertical', (film.orientation || project.orientation) === 'vertical');
      frame.innerHTML = filmEmbed(project, film);
      titleEl.textContent = film.title && film.title !== project.title
        ? project.title + ' — ' + film.title
        : project.title;
      blurbEl.textContent = project.blurb || '';
      tagsEl.innerHTML = tags((project.tags || []).concat(film.duration ? [film.duration] : []));

      const url = filmUrl(project, film);
      const v = film.video || {};
      if (url) {
        linkEl.href = url;
        linkEl.textContent =
          v.type === 'youtube' ? 'Watch on YouTube' : v.type === 'vimeo' ? 'Watch on Vimeo'
            : v.type === 'drive' ? 'Open in Google Drive' : 'Open full film';
        linkEl.parentElement.style.display = '';
      } else {
        linkEl.parentElement.style.display = 'none';
      }
    }

    function paintPhoto(p, ph) {
      frame.classList.toggle('lb__frame--vertical', ph.orientation === 'portrait');
      frame.innerHTML = ph.src
        ? '<img src="' + escapeHtml(ph.src) + '" alt="' + escapeHtml(ph.alt || ph.caption || p.title) + '">'
        : '<div class="lb__missing"><p class="eyebrow">' + escapeHtml(ph.caption || 'Photograph') + '</p>' +
          '<p class="muted">Add a `src` to this gallery entry in assets/js/data.js.</p></div>';
      titleEl.textContent = ph.caption ? p.title + ' — ' + ph.caption : p.title;
      blurbEl.textContent = p.details && p.details.location ? p.details.location : '';
      tagsEl.innerHTML = tags(p.tags || []);
      linkEl.parentElement.style.display = 'none';
    }

    function preload(entry) {
      if (entry && entry.photo && entry.photo.src) new Image().src = entry.photo.src;
    }

    function paint() {
      const entry = sequence[position];
      if (!entry) return;
      if (entry.film) paintFilm(entry.project, entry.film);
      else paintPhoto(entry.project, entry.photo);
      const many = sequence.length > 1;
      prevBtn.hidden = !many;
      nextBtn.hidden = !many;
      countEl.textContent = many ? (position + 1) + ' / ' + sequence.length : '';
      if (!reducedMotion && frame.animate) {
        frame.animate([{ opacity: 0, transform: 'scale(0.985)' }, { opacity: 1, transform: 'none' }],
          { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      }
      if (many) {
        preload(sequence[(position + 1) % sequence.length]);
        preload(sequence[(position - 1 + sequence.length) % sequence.length]);
      }
    }

    function step(delta) {
      if (sequence.length < 2) return;
      position = (position + delta + sequence.length) % sequence.length;
      paint();
    }

    function reveal() {
      if (box.classList.contains('is-open')) return;
      box.classList.add('is-open');
      document.body.classList.add('is-locked');
      closeBtn.focus();
    }

    /* A project on its own: its films first, then its photographs */
    function projectSequence(project) {
      return project.films
        .map((film, i) => ({ project: project, film: film, index: i }))
        .concat(project.gallery.map((photo, i) => ({ project: project, photo: photo, index: i })));
    }

    function open(seq, start) {
      lastFocus = document.activeElement;
      sequence = seq;
      position = Math.max(0, Math.min(start, seq.length - 1));
      paint();
      reveal();
    }

    function close() {
      if (document.fullscreenElement === box && document.exitFullscreen) document.exitFullscreen();
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

    /* Open at a given film or photo, paging through the
       section it sits in when there is one. */
    function openAt(type, ref, trigger) {
      const project = projectById(ref.id);
      if (!project) return;
      const host = trigger.closest('[data-photo-grid], [data-film-grid]');
      let seq = host && host._zg ? host._zg.items : null;
      let start = -1;
      if (seq) {
        start = seq.findIndex((e) => e.project.id === ref.id && e.index === ref.index && !!e.film === (type === 'film'));
      }
      if (start < 0) {
        seq = projectSequence(project);
        start = type === 'film' ? ref.index : project.films.length + ref.index;
      }
      open(seq, start);
    }

    document.addEventListener('click', (e) => {
      const filmBtn = e.target.closest('[data-film]');
      if (filmBtn) return openAt('film', parse(filmBtn.getAttribute('data-film')), filmBtn);
      const photoBtn = e.target.closest('[data-photo]');
      if (photoBtn) return openAt('photo', parse(photoBtn.getAttribute('data-photo')), photoBtn);
      const card = e.target.closest('[data-project]');
      if (card) {
        const project = projectById(card.getAttribute('data-project'));
        if (project) open(projectSequence(project), 0);
        return;
      }
      if (e.target === box) close();
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => step(-1));
    nextBtn.addEventListener('click', () => step(1));
    fullBtn.addEventListener('click', function () {
      if (document.fullscreenElement) return document.exitFullscreen();
      const req = box.requestFullscreen || box.webkitRequestFullscreen;
      if (req) req.call(box);
    });

    /* swipe left / right on touch screens */
    let sx = null;
    let sy = null;
    box.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { sx = null; return; }
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (sx == null) return;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) close();   /* swipe down to dismiss */
    });

    document.addEventListener('keydown', (e) => {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') return close();
      if (sequence.length > 1 && !(e.target && e.target.tagName === 'VIDEO')) {
        if (e.key === 'ArrowLeft') return step(-1);
        if (e.key === 'ArrowRight') return step(1);
      }
      if (e.key === 'Tab') {
        const focusable = $$('a[href], button:not([hidden]), iframe, video, [tabindex]:not([tabindex="-1"])', box)
          .filter((el) => el.offsetParent !== null || el === closeBtn);
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
