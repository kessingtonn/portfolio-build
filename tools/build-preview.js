#!/usr/bin/env node
/* =========================================================
   Bundles the whole site into ONE self-contained HTML file
   you can email, drop on any host, or open from a USB stick.

     node tools/build-preview.js        → preview.html

   Every page becomes a section of one document, with the CSS
   and JS inlined and a tiny router swapping between them, so
   the links still work with no server behind it.

   This is a preview artefact, not the site itself — deploy
   the real multi-page site for anything public.
   ========================================================= */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

/* Pages in nav order; the first one is what opens. */
const PAGES = [
  'index.html', 'work.html',
  'fashion.html', 'events.html', 'weddings.html',
  'portraits.html', 'commercial.html', 'brand.html',
  'packages.html', 'reviews.html', 'about.html', 'enquiry.html'
];

const shell = read('index.html');
const header = shell.slice(0, shell.indexOf('<main id="main">'));
const footer = shell.slice(shell.indexOf('<footer class="footer">'), shell.indexOf('<script src='));

/* ---- each page's <main>, with its ids namespaced so the
   twelve documents can share one DOM without colliding ---- */
const sections = PAGES.map((file) => {
  const html = read(file);
  const match = html.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/);
  if (!match) throw new Error('no <main> found in ' + file);

  const slug = file.replace('.html', '');
  let body = match[1]
    .replace(/\sid="([^"]+)"/g, (m, id) => ' id="' + slug + '--' + id + '"')
    .replace(/href="#([^"]+)"/g, (m, id) => 'href="#' + slug + '--' + id + '"');

  const title = (html.match(/<title>([^<]*)<\/title>/) || [, file])[1];
  return (
    '<div class="pv-page" data-page="' + file + '" data-title="' + title.replace(/"/g, '&quot;') + '">' +
    body +
    '</div>'
  );
}).join('\n');

const css = read('assets/css/main.css');
const js = ['assets/js/data.js', 'assets/js/packages.js', 'assets/js/enquiry.js', 'assets/js/main.js']
  .map(read)
  .join('\n;\n');

const routerCss = `
/* ---- preview shell ---- */
.pv-page { display: none; }
.pv-page.is-active { display: block; }
.pv-note {
  position: fixed;
  left: 50%;
  bottom: 1rem;
  transform: translateX(-50%);
  z-index: 300;
  max-width: min(92vw, 46rem);
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.7rem 1rem;
  font-size: 0.75rem;
  line-height: 1.45;
  color: var(--bone-dim);
  background: rgba(16, 16, 18, 0.92);
  backdrop-filter: blur(12px);
  border: 1px solid var(--ink-line);
  border-radius: 999px;
}
.pv-note button {
  background: none;
  border: 0;
  color: var(--mute);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0.25rem;
}
.pv-note button:hover { color: var(--bone); }
.pv-note[hidden] { display: none; }
`;

const router = `
/* ---------------------------------------------------------
   Preview router: shows one page section at a time and
   rewrites the site's own links to switch between them.
   --------------------------------------------------------- */
(function () {
  'use strict';
  var pages = Array.prototype.slice.call(document.querySelectorAll('.pv-page'));
  var byName = {};
  pages.forEach(function (p) { byName[p.getAttribute('data-page')] = p; });

  function show(name, anchor) {
    var page = byName[name] || pages[0];
    pages.forEach(function (p) { p.classList.toggle('is-active', p === page); });
    document.title = page.getAttribute('data-title') || document.title;

    /* reveal animations never got their chance while hidden */
    Array.prototype.forEach.call(page.querySelectorAll('.reveal'), function (el) {
      el.classList.add('is-in');
    });

    /* nav state */
    Array.prototype.forEach.call(document.querySelectorAll('[data-nav]'), function (link) {
      if (link.getAttribute('data-nav') === name) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    Array.prototype.forEach.call(document.querySelectorAll('.nav__drop-btn'), function (btn) {
      var drop = btn.closest('.nav__drop');
      btn.classList.toggle('is-current', !!(drop && drop.querySelector('[aria-current="page"]')));
    });

    if (anchor) {
      var target = document.getElementById(name.replace('.html', '') + '--' + anchor);
      if (target) return target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (/^(https?:|mailto:|tel:)/.test(href)) return;

    var parts = href.split('#');
    var file = parts[0].split('?')[0];
    var anchor = parts[1];

    if (file && byName[file]) {
      e.preventDefault();
      show(file, anchor);
      var menu = document.getElementById('site-menu');
      if (menu && menu.classList.contains('is-open')) {
        var toggle = document.querySelector('.nav__toggle');
        if (toggle) toggle.click();
      }
    }
  });

  show('index.html');

  var note = document.querySelector('.pv-note button');
  if (note) note.addEventListener('click', function () { note.parentElement.hidden = true; });
})();
`;

const notice =
  '<div class="pv-note">' +
  '<span><strong>Single-file preview.</strong> Every page and interaction works; the sample film ' +
  'clips are blocked by this sandbox, so tiles and the hero show their placeholder artwork.</span>' +
  '<button type="button" aria-label="Dismiss">&#10005;</button>' +
  '</div>';

const out = header
  /* the router retitles per page; this is the name it opens under */
  .replace(/<title>[^<]*<\/title>/, '<title>Zangrid Studios</title>')
  .replace('<link rel="stylesheet" href="assets/css/main.css">', '<style>\n' + css + '\n' + routerCss + '\n</style>')
  + '\n<main id="main">\n' + sections + '\n</main>\n'
  + footer
  + notice
  + '\n<script>\n' + js + '\n' + router + '\n</script>\n</body>\n</html>\n';

fs.writeFileSync(path.join(ROOT, 'preview.html'), out);
const kb = Math.round(Buffer.byteLength(out) / 1024);
console.log('preview.html written — ' + PAGES.length + ' pages, ' + kb + ' KB');
