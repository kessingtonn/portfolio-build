#!/usr/bin/env node
/* =========================================================
   Reports which media slots are filled, which are still
   placeholders, and which point at a file that isn't there.

     node tools/check-media.js

   Run it after every batch of files you drop in. A MISSING
   line is a broken image or video on the live site; a
   placeholder line is just work still to do.
   ========================================================= */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const sandbox = { window: {}, navigator: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8'), sandbox, { filename: 'data.js' });
const D = sandbox.window.ZANGRID;

const SAMPLE = /commondatastorage\.googleapis\.com/;
const local = (p) => p && !/^https?:/.test(p);
const exists = (p) => fs.existsSync(path.join(ROOT, p));

const rows = [];      /* { slot, where, value } */
const add = (slot, where, value) => rows.push({ slot, where, value: value || null });

/* ---- 1. home hero ---- */
(D.site.heroVideo || []).forEach((s, i) => add('Home hero clip', 'site.heroVideo[' + i + ']', s.src));

/* ---- 2. category heroes ---- */
D.categories.forEach((c) => {
  add('Category hero still', c.id + '.heroImage', c.heroImage);
  add('Category hero clip', c.id + '.heroVideo', c.heroVideo);
});

/* ---- 3. projects ---- */
D.projects.forEach((p) => {
  add('Project cover', p.id + '.cover', p.cover);
  (p.films || []).forEach((f, i) => {
    const ref = p.id + '.films[' + i + ']';
    const v = f.video || {};
    add('Film source', ref, v.type === 'file' ? v.src : v.type ? v.type + ':' + v.id : null);
    add('Film poster', ref + '.poster', f.poster);
    add('Hover preview', ref + '.preview', f.preview || (v.type === 'file' ? v.src : null));
  });
  (p.gallery || []).forEach((g, i) => add('Photograph', p.id + '.gallery[' + i + ']', g.src));
});

/* ---- 4. studio + brand assets ---- */
(D.crew || []).forEach((c, i) => add('Crew portrait', 'crew[' + i + '] ' + c.name, c.photo));
(D.clients || []).forEach((c, i) => add('Client logo', 'clients[' + i + '] ' + c.name, c.logo));
['assets/img/favicon.svg', 'assets/img/og.svg'].forEach((f) => add('Site asset', f, f));

/* ---- verdicts ---- */
const missing = [];
const placeholder = [];
const sample = [];
let ready = 0;

rows.forEach((r) => {
  if (!r.value) return placeholder.push(r);
  if (SAMPLE.test(r.value)) return sample.push(r);
  if (!local(r.value)) return ready++;            /* youtube / vimeo / remote, fine */
  if (!exists(r.value)) return missing.push(r);
  ready++;
});

const group = (list) => {
  const by = {};
  list.forEach((r) => { (by[r.slot] = by[r.slot] || []).push(r); });
  return by;
};

const line = (label, n) => '  ' + String(n).padStart(4) + '  ' + label;

console.log('\nZangrid media check');
console.log('===================\n');
console.log(line('in place', ready));
console.log(line('still placeholder', placeholder.length));
console.log(line('sample clips to replace', sample.length));
console.log(line('MISSING FILES', missing.length));

if (missing.length) {
  console.log('\nMISSING — these paths are set but the file is not there:');
  missing.forEach((r) => console.log('  ✗ ' + r.where + '  →  ' + r.value));
}

if (sample.length) {
  console.log('\nSample clips still in use (replace before launch):');
  Object.entries(group(sample)).forEach(([slot, list]) => {
    console.log('  • ' + slot + ' × ' + list.length + '  (' + list.slice(0, 3).map((r) => r.where).join(', ') +
      (list.length > 3 ? ', …' : '') + ')');
  });
}

if (placeholder.length) {
  console.log('\nStill placeholders — nothing broken, just empty:');
  Object.entries(group(placeholder)).forEach(([slot, list]) => {
    console.log('  · ' + slot.padEnd(22) + list.length);
  });
}

console.log('\n' + (missing.length ? 'Fix the MISSING paths — those show as broken media.\n' : 'No broken paths.\n'));
process.exit(missing.length ? 1 : 0);
