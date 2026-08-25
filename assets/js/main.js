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
     6. Work grid
     --------------------------------------------------- */
  const escapeHtml = (value) =>
    String(value == null ? '' : value).replace(/[&<>"']/g, (c) => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });

  const categoryLabel = (id) => {
    const found = DATA.categories.filter((c) => c.id === id)[0];
    return found ? found.label.replace(/s$/, '') : id;
  };

  function previewSrc(project) {
    if (project.preview) return project.preview;
    if (project.video && project.video.type === 'file') return project.video.src;
    return null;
  }

  function cardMarkup(project, index) {
    const classes = ['card'];
    if (project.wide) classes.push('card--wide');
    if (project.portrait || project.orientation === 'vertical') classes.push('card--portrait');

    const media = project.poster
      ? '<img src="' + escapeHtml(project.poster) + '" alt="' + escapeHtml(project.title) + '" loading="lazy" decoding="async">'
      : '<div class="card__poster" style="--h:' + (project.hue || 40) + '" data-num="' +
        String(index + 1).padStart(2, '0') + '" role="img" aria-label="Artwork placeholder for ' +
        escapeHtml(project.title) + '"></div>';

    const playable = !!project.video;
    const badge = playable
      ? '<span class="card__play"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z"/></svg>Play film</span>'
      : '<span class="card__play">View gallery</span>';

    const preview = previewSrc(project);
    const ratio = project.orientation
      ? '<span class="card__ratio">' + (project.orientation === 'vertical' ? '9:16' : '16:9') + '</span>'
      : '';

    return (
      '<button type="button" class="' + classes.join(' ') + ' reveal" data-project="' + escapeHtml(project.id) + '" ' +
      'data-category="' + escapeHtml(project.category) + '"' +
      (project.orientation ? ' data-orientation="' + escapeHtml(project.orientation) + '"' : '') +
      (preview ? ' data-preview="' + escapeHtml(preview) + '"' : '') + '>' +
      '<span class="card__media">' + media + ratio + badge + '</span>' +
      '<span class="card__body">' +
      '<span class="card__title">' + escapeHtml(project.title) + '</span>' +
      '<span class="card__meta">' + escapeHtml(categoryLabel(project.category)) + ' · ' + escapeHtml(project.year) + '</span>' +
      '</span>' +
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

  function renderGrid(grid) {
    const only = grid.getAttribute('data-filter');
    const orientation = grid.getAttribute('data-orientation');
    const limit = parseInt(grid.getAttribute('data-limit'), 10);
    const featuredOnly = grid.hasAttribute('data-featured');

    let list = DATA.projects.slice();
    if (featuredOnly) list = list.filter((p) => p.featured);
    if (orientation) list = list.filter((p) => p.orientation === orientation);
    if (only && only !== 'all') list = list.filter((p) => p.category === only);
    if (!isNaN(limit)) list = list.slice(0, limit);

    if (!list.length) {
      grid.innerHTML = '<p class="empty-note">No projects in this collection yet — new work lands here first.</p>';
      return;
    }
    grid.innerHTML = list.map(cardMarkup).join('');
    $$('.reveal', grid).forEach((el) => el.classList.add('is-in'));
    if (canPreview) $$('[data-preview]', grid).forEach(attachPreview);
  }

  const grids = $$('[data-work-grid]');
  grids.forEach(renderGrid);

  /* Filters (work page) */
  (function filters() {
    const bar = $('[data-filters]');
    const grid = $('[data-work-grid][data-filterable]');
    if (!bar || !grid) return;

    bar.innerHTML = DATA.categories
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
    apply(initial && DATA.categories.some((c) => c.id === initial) ? initial : 'all', false);
  })();

  /* ---------------------------------------------------
     7. Lightbox — embedded player + external link
     --------------------------------------------------- */
  (function lightbox() {
    if (!grids.length) return;

    const box = document.createElement('div');
    box.className = 'lb';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Project player');
    box.hidden = false;
    box.innerHTML =
      '<button type="button" class="lb__close" aria-label="Close player">&#10005;</button>' +
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
    let lastFocus = null;

    function embed(project) {
      const v = project.video;
      if (!v) {
        return (
          '<div class="lb__missing"><p class="eyebrow">Gallery</p><p>' +
          escapeHtml(project.blurb || '') +
          '</p><p class="muted">Full gallery delivered privately to every client.</p></div>'
        );
      }
      if (v.type === 'youtube') {
        return (
          '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) +
          '?autoplay=1&rel=0&modestbranding=1" title="' + escapeHtml(project.title) +
          '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
        );
      }
      if (v.type === 'vimeo') {
        return (
          '<iframe src="https://player.vimeo.com/video/' + encodeURIComponent(v.id) +
          '?autoplay=1&title=0&byline=0&portrait=0" title="' + escapeHtml(project.title) +
          '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>'
        );
      }
      return (
        '<video src="' + escapeHtml(v.src) + '" controls autoplay playsinline preload="metadata"></video>'
      );
    }

    function externalUrl(project) {
      if (project.link) return project.link;
      const v = project.video;
      if (!v) return null;
      if (v.type === 'youtube') return 'https://www.youtube.com/watch?v=' + v.id;
      if (v.type === 'vimeo') return 'https://vimeo.com/' + v.id;
      return v.src;
    }

    function open(project) {
      lastFocus = document.activeElement;
      frame.classList.toggle('lb__frame--vertical', project.orientation === 'vertical');
      frame.innerHTML = embed(project);
      titleEl.textContent = project.title;
      blurbEl.textContent = project.blurb || '';
      tagsEl.innerHTML = (project.tags || []).map((t) => '<span class="tag">' + escapeHtml(t) + '</span>').join('');

      const url = externalUrl(project);
      if (url) {
        linkEl.href = url;
        linkEl.textContent = project.video && project.video.type === 'youtube'
          ? 'Watch on YouTube'
          : project.video && project.video.type === 'vimeo'
          ? 'Watch on Vimeo'
          : 'Open full film';
        linkEl.parentElement.style.display = '';
      } else {
        linkEl.parentElement.style.display = 'none';
      }

      box.classList.add('is-open');
      document.body.classList.add('is-locked');
      /* next frame: the dialog is still visibility:hidden this tick,
         and a hidden element cannot take focus */
      window.requestAnimationFrame(function () {
        closeBtn.focus();
      });
    }

    function close() {
      box.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      frame.innerHTML = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener('click', (e) => {
      const card = e.target.closest('[data-project]');
      if (card) {
        const project = DATA.projects.filter((p) => p.id === card.getAttribute('data-project'))[0];
        if (project) open(project);
        return;
      }
      if (e.target === box) close();
    });

    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const focusable = $$('a[href], button, iframe, video, [tabindex]:not([tabindex="-1"])', box);
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
