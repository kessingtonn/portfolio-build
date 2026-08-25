/* =========================================================
   Zangrid Studios — package rendering
   Reads ZANGRID.packages and fills any element marked with
   data-packages="<service>". Also powers the service jump
   nav and the testimonial strip.
   ========================================================= */
(function () {
  'use strict';

  const DATA = window.ZANGRID || {};
  const PACKS = DATA.packages || {};
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const esc = (value) =>
    String(value == null ? '' : value).replace(/[&<>"']/g, (c) => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });

  function tierMarkup(service, tier, i) {
    const href =
      'enquiry.html?service=' + encodeURIComponent(service) + '&package=' + encodeURIComponent(tier.id);
    return (
      '<article class="pkg reveal' + (tier.featured ? ' pkg--featured' : '') + '" data-delay="' + (i % 3) + '">' +
      (tier.featured ? '<p class="pkg__flag">Most booked</p>' : '') +
      '<h3 class="pkg__name">' + esc(tier.name) + '</h3>' +
      '<p class="pkg__price">' + esc(tier.price) + '<small>' + esc(tier.unit) + '</small></p>' +
      '<p class="pkg__desc">' + esc(tier.desc) + '</p>' +
      '<ul class="pkg__list">' +
      tier.includes.map((item) => '<li><span>' + esc(item) + '</span></li>').join('') +
      '</ul>' +
      '<a class="btn' + (tier.featured ? ' btn--solid' : '') + '" href="' + href + '">Enquire</a>' +
      '</article>'
    );
  }

  $$('[data-packages]').forEach((host) => {
    const service = host.getAttribute('data-packages');
    const pack = PACKS[service];
    if (!pack) return;
    host.innerHTML = pack.tiers.map((tier, i) => tierMarkup(service, tier, i)).join('');
  });

  $$('[data-package-note]').forEach((el) => {
    const pack = PACKS[el.getAttribute('data-package-note')];
    if (pack && pack.note) el.textContent = pack.note;
  });

  /* Service jump nav */
  $$('[data-service-nav]').forEach((nav) => {
    nav.innerHTML = Object.keys(PACKS)
      .map((key) => '<a class="filter" href="#' + key + '">' + esc(PACKS[key].label) + '</a>')
      .join('');
  });

  /* ---- reviews ---------------------------------------
     data-testimonials           → featured quotes only
     data-testimonials="all"     → every review
     data-reviews                → full review cards + filters
     ---------------------------------------------------- */
  const REVIEWS = DATA.testimonials || [];
  const PROJECTS = DATA.projects || [];

  const stars = (n) => {
    const filled = Math.max(0, Math.min(5, n || 5));
    return (
      '<span class="stars" role="img" aria-label="' + filled + ' out of 5">' +
      '★★★★★'.slice(0, filled) +
      '<span class="stars__empty">' + '★★★★★'.slice(0, 5 - filled) + '</span></span>'
    );
  };

  const serviceLabel = (id) => {
    const pack = PACKS[id];
    return pack ? pack.label : id || '';
  };

  $$('[data-testimonials]').forEach((host) => {
    const mode = host.getAttribute('data-testimonials');
    const list = mode === 'all' ? REVIEWS : REVIEWS.filter((t) => t.featured);
    host.innerHTML = list
      .map(
        (t, i) =>
          '<figure class="quote reveal" data-delay="' + (i % 3) + '">' +
          stars(t.rating) +
          '<p>&ldquo;' + esc(t.quote) + '&rdquo;</p>' +
          '<footer>' + esc(t.by) + (t.role ? ' — ' + esc(t.role) : '') + '</footer>' +
          '</figure>'
      )
      .join('');
  });

  $$('[data-reviews]').forEach((host) => {
    const render = (service) => {
      const list = service && service !== 'all' ? REVIEWS.filter((r) => r.service === service) : REVIEWS;
      if (!list.length) {
        host.innerHTML = '<p class="empty-note">No reviews in this category yet.</p>';
        return;
      }
      host.innerHTML = list
        .map(function (r, i) {
          const project = PROJECTS.filter((p) => p.id === r.project)[0];
          const link = project
            ? '<a class="arrow-link" href="work.html?c=' + esc(project.category) + '">See the work</a>'
            : '';
          return (
            '<figure class="review reveal" data-delay="' + (i % 3) + '" data-service="' + esc(r.service || '') + '">' +
            '<div class="review__top">' + stars(r.rating) +
            '<span class="tag">' + esc(serviceLabel(r.service)) + '</span></div>' +
            '<blockquote class="review__quote">&ldquo;' + esc(r.quote) + '&rdquo;</blockquote>' +
            '<figcaption class="review__by"><strong>' + esc(r.by) + '</strong>' +
            (r.role ? '<span class="muted">' + esc(r.role) + '</span>' : '') + '</figcaption>' +
            link +
            '</figure>'
          );
        })
        .join('');
      $$('.reveal', host).forEach((el) => el.classList.add('is-in'));
    };

    const bar = document.querySelector('[data-review-filters]');
    if (bar) {
      const cats = [{ id: 'all', label: 'All reviews' }].concat(
        Object.keys(PACKS).map((k) => ({ id: k, label: PACKS[k].label }))
      );
      bar.innerHTML = cats
        .map(
          (c) =>
            '<button type="button" class="filter" data-rev="' + c.id + '" aria-pressed="' +
            (c.id === 'all') + '">' + esc(c.label) + '</button>'
        )
        .join('');
      bar.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter');
        if (!btn) return;
        const id = btn.getAttribute('data-rev');
        render(id);
        $$('.filter', bar).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        const count = document.querySelector('[data-review-count]');
        if (count) {
          const n = host.querySelectorAll('.review').length;
          count.textContent = n + (n === 1 ? ' review' : ' reviews');
        }
      });
    }

    render('all');
    const count = document.querySelector('[data-review-count]');
    if (count) count.textContent = REVIEWS.length + ' reviews';
  });

  /* Average rating + counts */
  const avg = REVIEWS.length
    ? (REVIEWS.reduce((sum, r) => sum + (r.rating || 5), 0) / REVIEWS.length).toFixed(1)
    : '—';
  $$('[data-review-average]').forEach((el) => (el.textContent = avg));
  $$('[data-review-total]').forEach((el) => (el.textContent = String(REVIEWS.length)));

  /* ---- client / brand strip -------------------------- */
  $$('[data-clients]').forEach((host) => {
    const list = DATA.clients || [];
    host.innerHTML =
      '<div class="marquee__track">' +
      list
        .map(function (c) {
          const mark = c.logo
            ? '<img src="' + esc(c.logo) + '" alt="' + esc(c.name) + '" loading="lazy">'
            : '<span class="logo__word">' + esc(c.name) + '</span>';
          return '<span class="logo" title="' + esc(c.note || c.name) + '">' + mark + '</span>';
        })
        .join('') +
      '</div>';
  });
})();
