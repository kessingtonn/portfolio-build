#!/usr/bin/env node
/* =========================================================
   Generates one presentation page per portfolio category
   from templates/category.template.html, using the
   `categories` list in assets/js/data.js.

     node tools/build-categories.js

   Run it after adding, renaming or removing a category.
   Edit the TEMPLATE, never the generated pages — they are
   overwritten every time this runs.
   ========================================================= */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const TEMPLATE = path.join(ROOT, 'templates', 'category.template.html');
const DATA = path.join(ROOT, 'assets', 'js', 'data.js');

/* data.js is a browser file; give it a window to attach to. */
const sandbox = { window: {}, navigator: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(DATA, 'utf8'), sandbox, { filename: 'data.js' });

const { categories, projects } = sandbox.window.ZANGRID;
const template = fs.readFileSync(TEMPLATE, 'utf8');

/* Which enquiry service a category maps to, so the CTAs
   preselect something sensible on the enquiry form. */
const SERVICE = {
  fashion: 'brand',
  events: 'brand',
  weddings: 'wedding',
  portraits: 'portrait',
  commercial: 'ugc',
  brand: 'brand'
};

const escapeAttr = (s) => String(s).replace(/"/g, '&quot;');

let written = 0;
categories.forEach((cat) => {
  const count = projects.filter((p) => p.category === cat.id).length;
  const page = template
    .replace(/\{\{ID\}\}/g, cat.id)
    .replace(/\{\{PAGE\}\}/g, cat.page)
    .replace(/\{\{LABEL_LOWER\}\}/g, cat.label.toLowerCase())
    .replace(/\{\{LABEL\}\}/g, escapeAttr(cat.label))
    .replace(/\{\{TITLE\}\}/g, escapeAttr(cat.title || cat.label))
    .replace(/\{\{LEDE\}\}/g, escapeAttr(cat.lede || ''))
    .replace(/\{\{INTRO\}\}/g, escapeAttr(cat.intro || ''))
    .replace(/\{\{SERVICE\}\}/g, SERVICE[cat.id] || 'other');

  fs.writeFileSync(path.join(ROOT, cat.page), page);
  console.log('  ' + cat.page.padEnd(18) + count + (count === 1 ? ' project' : ' projects'));
  written++;
});

console.log('\n' + written + ' category pages generated from ' + path.relative(ROOT, TEMPLATE));
