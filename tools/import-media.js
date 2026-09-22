#!/usr/bin/env node
/* =========================================================
   Wires dropped-in media into assets/js/data.js.

     node tools/import-media.js --scaffold   make the folders
     node tools/import-media.js --dry-run    show what it would do
     node tools/import-media.js              write it into data.js

   Drop files here, named however you like:

     assets/img/work/<project-id>/…          photographs
     assets/video/work/<project-id>/…        films
     assets/img/heroes/<category-id>.jpg     category hero stills
     assets/video/heroes/<category-id>.mp4   category hero clips
     assets/img/crew/…                       crew portraits
     assets/img/clients/…                    client logos

   Then run it. Filenames become captions ("01-first-look.jpg"
   → "First look"), portrait/landscape and 16:9 / 9:16 come
   from the real pixel dimensions, and MP4 durations are read
   from the file. data.js is backed up and validated; if
   anything fails to parse, the backup is restored.

   Conventions it understands:
     cover.*              the project's tile image
     *-preview.mp4        hover preview for the film of the
                          same name (highlight.mp4)
     *-poster.jpg         still for the film of the same name
   ========================================================= */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'assets/js/data.js');
const ARGS = process.argv.slice(2);
const DRY = ARGS.includes('--dry-run');
const SCAFFOLD = ARGS.includes('--scaffold');

const IMG = /\.(jpe?g|png|webp|avif)$/i;
const VID = /\.(mp4|webm|mov|m4v)$/i;

/* ---------------------------------------------------------
   read the data file
   --------------------------------------------------------- */
function loadData(text) {
  const sandbox = { window: {}, navigator: {} };
  vm.createContext(sandbox);
  vm.runInContext(text, sandbox, { filename: 'data.js' });
  return sandbox.window.ZANGRID;
}

let source = fs.readFileSync(DATA, 'utf8');
const D = loadData(source);

/* ---------------------------------------------------------
   image dimensions, straight from the file header
   --------------------------------------------------------- */
function imageSize(file) {
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const head = Buffer.alloc(65536);
    const read = fs.readSync(fd, head, 0, head.length, 0);
    const buf = head.slice(0, read);

    /* PNG */
    if (buf.slice(0, 8).toString('hex') === '89504e470d0a1a0a') {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    /* WebP */
    if (buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') {
      const tag = buf.slice(12, 16).toString('ascii');
      if (tag === 'VP8X') return { width: (buf.readUIntLE(24, 3) & 0xffffff) + 1, height: (buf.readUIntLE(27, 3) & 0xffffff) + 1 };
      if (tag === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
    /* JPEG — walk the segments to the frame header */
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) { i++; continue; }
        const marker = buf[i + 1];
        const len = buf.readUInt16BE(i + 2);
        const isFrame = (marker >= 0xc0 && marker <= 0xcf) &&
          marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
        if (isFrame) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        i += 2 + len;
      }
    }
  } catch (e) {
    /* unreadable — caller falls back to landscape */
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
  return null;
}

/* ---------------------------------------------------------
   mp4 duration + dimensions, from the moov atom
   --------------------------------------------------------- */
function mp4Meta(file) {
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const size = fs.fstatSync(fd).size;
    const out = {};

    const walk = (start, end, depth) => {
      let pos = start;
      while (pos < end - 8 && depth < 6) {
        const header = Buffer.alloc(8);
        fs.readSync(fd, header, 0, 8, pos);
        let boxSize = header.readUInt32BE(0);
        const type = header.slice(4, 8).toString('ascii');
        if (boxSize === 1) {
          const big = Buffer.alloc(8);
          fs.readSync(fd, big, 0, 8, pos + 8);
          boxSize = Number(big.readBigUInt64BE(0));
        }
        if (boxSize < 8) break;

        if (type === 'mvhd') {
          const b = Buffer.alloc(Math.min(boxSize, 120));
          fs.readSync(fd, b, 0, b.length, pos + 8);
          const version = b[0];
          const timescale = version === 1 ? b.readUInt32BE(20) : b.readUInt32BE(12);
          const duration = version === 1 ? Number(b.readBigUInt64BE(24)) : b.readUInt32BE(16);
          if (timescale) out.duration = duration / timescale;
        }
        if (type === 'tkhd') {
          const b = Buffer.alloc(Math.min(boxSize, 100));
          fs.readSync(fd, b, 0, b.length, pos + 8);
          const version = b[0];
          const base = version === 1 ? 92 : 80;
          if (b.length >= base + 8) {
            const w = b.readUInt32BE(base) / 65536;
            const h = b.readUInt32BE(base + 4) / 65536;
            /* keep the largest track — that's the video one */
            if (w && h && (!out.width || w * h > out.width * out.height)) {
              out.width = Math.round(w);
              out.height = Math.round(h);
            }
          }
        }
        if (type === 'moov' || type === 'trak' || type === 'mdia') walk(pos + 8, pos + boxSize, depth + 1);
        pos += boxSize;
      }
    };

    walk(0, size, 0);
    return out.duration || out.width ? out : null;
  } catch (e) {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

const clock = (seconds) => {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m + ':' + String(s === 60 ? 0 : s).padStart(2, '0');
};

/* ---------------------------------------------------------
   filenames → captions and titles
   --------------------------------------------------------- */
function words(file) {
  const base = path.basename(file).replace(/\.[^.]+$/, '');
  const cleaned = base
    .replace(/^\d+[-_\s]*/, '')        /* leading 01- */
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

const list = (dir, re) => {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full)
    .filter((f) => re.test(f) && !f.startsWith('.'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => ({ name: f, rel: dir + '/' + f, abs: path.join(full, f) }));
};

/* ---------------------------------------------------------
   scaffold
   --------------------------------------------------------- */
if (SCAFFOLD) {
  const dirs = ['assets/img/heroes', 'assets/img/crew', 'assets/img/clients', 'assets/video/heroes'];
  D.projects.forEach((p) => {
    dirs.push('assets/img/work/' + p.id, 'assets/video/work/' + p.id);
  });
  dirs.forEach((d) => fs.mkdirSync(path.join(ROOT, d), { recursive: true }));
  console.log('\nFolders ready — drop your files in:\n');
  D.projects.forEach((p) => {
    console.log('  ' + p.title);
    console.log('    photos  assets/img/work/' + p.id + '/');
    console.log('    films   assets/video/work/' + p.id + '/');
  });
  console.log('\n  category heroes  assets/img/heroes/<category>.jpg');
  console.log('  crew portraits   assets/img/crew/');
  console.log('  client logos     assets/img/clients/');
  console.log('\nThen run: node tools/import-media.js --dry-run\n');
  process.exit(0);
}

/* ---------------------------------------------------------
   collect what's on disk
   --------------------------------------------------------- */
const plan = [];   /* { pid, key, value, summary } */

D.projects.forEach((p) => {
  const imgs = list('assets/img/work/' + p.id, IMG);
  const vids = list('assets/video/work/' + p.id, VID);
  if (!imgs.length && !vids.length) return;

  /* --- cover --- */
  const coverFile = imgs.filter((f) => /^cover\./i.test(f.name))[0];
  if (coverFile) plan.push({ pid: p.id, key: 'cover', value: "'" + coverFile.rel + "'", summary: 'cover → ' + coverFile.name });

  /* --- films --- */
  const previews = {};
  const posters = {};
  imgs.forEach((f) => {
    const m = f.name.match(/^(.*)-poster\.[^.]+$/i);
    if (m) posters[m[1].toLowerCase()] = f.rel;
  });
  vids.forEach((f) => {
    const m = f.name.match(/^(.*)-preview\.[^.]+$/i);
    if (m) previews[m[1].toLowerCase()] = f.rel;
  });

  const films = vids
    .filter((f) => !/-preview\.[^.]+$/i.test(f.name))
    .map((f) => {
      const stem = path.basename(f.name).replace(/\.[^.]+$/, '').toLowerCase();
      const meta = /\.mp4$/i.test(f.name) ? mp4Meta(f.abs) : null;
      let orientation = 'horizontal';
      if (meta && meta.width && meta.height) {
        orientation = meta.height > meta.width ? 'vertical' : 'horizontal';
      } else if (/vertical|9x16|reel|story|short|tiktok/i.test(f.name)) {
        orientation = 'vertical';
      }
      const duration = meta && meta.duration ? clock(meta.duration) : null;
      return {
        title: words(f.name) || p.title,
        duration: duration,
        orientation: orientation,
        poster: posters[stem] || null,
        preview: previews[stem] || null,
        src: f.rel
      };
    });

  if (films.length) {
    const js =
      '[\n' +
      films
        .map(function (f) {
          return (
            '        {\n' +
            "          title: '" + f.title.replace(/'/g, "\\'") + "',\n" +
            (f.duration ? "          duration: '" + f.duration + "',\n" : '') +
            "          orientation: '" + f.orientation + "',\n" +
            (f.poster ? "          poster: '" + f.poster + "',\n" : '') +
            (f.preview ? "          preview: '" + f.preview + "',\n" : '') +
            "          video: { type: 'file', src: '" + f.src + "' }\n" +
            '        }'
          );
        })
        .join(',\n') +
      '\n      ]';
    plan.push({
      pid: p.id,
      key: 'films',
      value: js,
      summary: 'films → ' + films.length + ' (' +
        films.map((f) => f.orientation[0].toUpperCase() + (f.duration ? ' ' + f.duration : '')).join(', ') + ')'
    });
  }

  /* --- gallery --- */
  const stills = imgs.filter((f) => !/^cover\./i.test(f.name) && !/-poster\.[^.]+$/i.test(f.name));
  if (stills.length) {
    let portraits = 0;
    const entries = stills.map(function (f) {
      const size = imageSize(f.abs);
      const portrait = size && size.height > size.width;
      if (portrait) portraits++;
      const caption = words(f.name);
      return (
        '        { src: ' + "'" + f.rel + "'" +
        (caption ? ", caption: '" + caption.replace(/'/g, "\\'") + "'" : '') +
        (caption ? ", alt: '" + caption.replace(/'/g, "\\'") + "'" : '') +
        (portrait ? ", orientation: 'portrait'" : '') +
        ' }'
      );
    });
    plan.push({
      pid: p.id,
      key: 'gallery',
      value: 'stills(' + (p.hue || 40) + ', [\n' + entries.join(',\n') + '\n      ])',
      summary: 'gallery → ' + stills.length + ' photographs (' + portraits + ' portrait)'
    });
  }
});

/* --- category heroes --- */
const heroPlan = [];
D.categories.forEach((c) => {
  const still = list('assets/img/heroes', IMG).filter((f) => f.name.replace(/\.[^.]+$/, '') === c.id)[0];
  const clip = list('assets/video/heroes', VID).filter((f) => f.name.replace(/\.[^.]+$/, '') === c.id)[0];
  if (still) heroPlan.push({ id: c.id, key: 'heroImage', value: still.rel });
  if (clip) heroPlan.push({ id: c.id, key: 'heroVideo', value: clip.rel });
});

/* --- crew + clients: matched by filename against the name --- */
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const crewFiles = list('assets/img/crew', IMG);
const clientFiles = list('assets/img/clients', /\.(svg|png|jpe?g|webp)$/i);

const crewPlan = [];
(D.crew || []).forEach((person, i) => {
  const want = slug(person.name);
  const hit = crewFiles.filter((f) => slug(f.name.replace(/\.[^.]+$/, '')) === want)[0] || crewFiles[i];
  if (hit) crewPlan.push({ index: i, name: person.name, value: hit.rel });
});

const clientPlan = [];
(D.clients || []).forEach((client, i) => {
  const want = slug(client.name);
  const hit = clientFiles.filter((f) => slug(f.name.replace(/\.[^.]+$/, '')) === want)[0];
  if (hit) clientPlan.push({ index: i, name: client.name, value: hit.rel });
});

/* --- home hero --- */
const homeHero = ['assets/video/hero-loop.webm', 'assets/video/hero-loop.mp4']
  .filter((f) => fs.existsSync(path.join(ROOT, f)));

/* ---------------------------------------------------------
   report
   --------------------------------------------------------- */
const nothing = !plan.length && !heroPlan.length && !crewPlan.length && !clientPlan.length && !homeHero.length;

console.log('\nMedia import');
console.log('============\n');

if (nothing) {
  console.log('No media found. Run `node tools/import-media.js --scaffold` to');
  console.log('create the folders, drop your files in, then run this again.\n');
  process.exit(0);
}

const byProject = {};
plan.forEach((item) => { (byProject[item.pid] = byProject[item.pid] || []).push(item); });
Object.keys(byProject).forEach((pid) => {
  console.log('  ' + pid);
  byProject[pid].forEach((item) => console.log('      ' + item.summary));
});
heroPlan.forEach((h) => console.log('  ' + h.id + ' hero → ' + h.value));
crewPlan.forEach((c) => console.log('  crew: ' + c.name + ' → ' + c.value));
clientPlan.forEach((c) => console.log('  logo: ' + c.name + ' → ' + c.value));
if (homeHero.length) console.log('  home hero → ' + homeHero.join(', '));

if (DRY) {
  console.log('\nDry run — nothing written. Drop the --dry-run flag to apply.\n');
  process.exit(0);
}

/* ---------------------------------------------------------
   surgery on data.js
   --------------------------------------------------------- */

/* Finds the object literal that holds `id: '<wanted>'` and
   returns its [start, end] offsets in the text. */
function objectSpan(text, wanted) {
  const marker = text.indexOf("id: '" + wanted + "'");
  if (marker < 0) return null;
  let start = text.lastIndexOf('{', marker);
  if (start < 0) return null;

  let depth = 0;
  let inString = null;
  let inComment = null;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (inComment === 'line') { if (c === '\n') inComment = null; continue; }
    if (inComment === 'block') { if (c === '*' && next === '/') { inComment = null; i++; } continue; }
    if (inString) {
      if (c === '\\') i++;
      else if (c === inString) inString = null;
      continue;
    }
    if (c === '/' && next === '/') { inComment = 'line'; i++; continue; }
    if (c === '/' && next === '*') { inComment = 'block'; i++; continue; }
    if (c === "'" || c === '"' || c === '`') { inString = c; continue; }
    if (c === '{' || c === '[' || c === '(') depth++;
    else if (c === '}' || c === ']' || c === ')') {
      depth--;
      if (depth === 0) return [start, i + 1];
    }
  }
  return null;
}

/* Within one object literal, finds a top-level key's full
   `key: value` span (not including the trailing comma). */
function keySpan(block, key) {
  let depth = 0;
  let inString = null;
  let inComment = null;
  for (let i = 0; i < block.length; i++) {
    const c = block[i];
    const next = block[i + 1];
    if (inComment === 'line') { if (c === '\n') inComment = null; continue; }
    if (inComment === 'block') { if (c === '*' && next === '/') { inComment = null; i++; } continue; }
    if (inString) {
      if (c === '\\') i++;
      else if (c === inString) inString = null;
      continue;
    }
    if (c === '/' && next === '/') { inComment = 'line'; i++; continue; }
    if (c === '/' && next === '*') { inComment = 'block'; i++; continue; }
    if (c === "'" || c === '"' || c === '`') { inString = c; continue; }
    if (c === '{' || c === '[' || c === '(') { depth++; continue; }
    if (c === '}' || c === ']' || c === ')') { depth--; continue; }

    if (depth === 1 && block.startsWith(key + ':', i) && /[\s{,]/.test(block[i - 1] || '')) {
      /* walk to the end of this value: a comma or the closing brace at depth 1 */
      let j = i + key.length + 1;
      let d = 0;
      let s = null;
      let cm = null;
      for (; j < block.length; j++) {
        const ch = block[j];
        const nx = block[j + 1];
        if (cm === 'line') { if (ch === '\n') cm = null; continue; }
        if (cm === 'block') { if (ch === '*' && nx === '/') { cm = null; j++; } continue; }
        if (s) { if (ch === '\\') j++; else if (ch === s) s = null; continue; }
        if (ch === '/' && nx === '/') { cm = 'line'; j++; continue; }
        if (ch === '/' && nx === '*') { cm = 'block'; j++; continue; }
        if (ch === "'" || ch === '"' || ch === '`') { s = ch; continue; }
        if (ch === '{' || ch === '[' || ch === '(') { d++; continue; }
        if (ch === '}' || ch === ']' || ch === ')') {
          if (d === 0) break;      /* closing brace of the object */
          d--;
          continue;
        }
        if (ch === ',' && d === 0) break;
      }
      return [i, j];
    }
  }
  return null;
}

function setKey(text, wanted, key, value) {
  const span = objectSpan(text, wanted);
  if (!span) throw new Error('could not locate ' + wanted);
  const block = text.slice(span[0], span[1]);
  const at = keySpan(block, key);

  let updated;
  if (at) {
    updated = block.slice(0, at[0]) + key + ': ' + value + block.slice(at[1]);
  } else {
    /* insert before the closing brace, after the last entry */
    const close = block.lastIndexOf('}');
    const before = block.slice(0, close).replace(/\s*$/, '');
    const comma = before.endsWith(',') ? '' : ',';
    updated = before + comma + '\n      ' + key + ': ' + value + '\n    }' + block.slice(close + 1);
  }
  return text.slice(0, span[0]) + updated + text.slice(span[1]);
}

const backup = DATA + '.backup';
fs.writeFileSync(backup, source);

try {
  let text = source;

  plan.forEach((item) => { text = setKey(text, item.pid, item.key, item.value); });
  heroPlan.forEach((h) => { text = setKey(text, h.id, h.key, "'" + h.value + "'"); });
  /* the "// 'assets/img/heroes/x.jpg'" hint has served its purpose */
  text = text.replace(/(hero(?:Image|Video): '[^']*',)[ \t]*\/\/[^\n]*/g, '$1');

  /* crew + clients are plain arrays, patched by index */
  const patchArray = (t, arrayName, entries, key) => {
    if (!entries.length) return t;
    const start = t.indexOf('const ' + arrayName + ' = [');
    if (start < 0) return t;
    let depth = 0;
    let end = start;
    for (let i = t.indexOf('[', start); i < t.length; i++) {
      if (t[i] === '[') depth++;
      else if (t[i] === ']') { depth--; if (!depth) { end = i + 1; break; } }
    }
    let block = t.slice(start, end);
    /* split the top-level object literals */
    const items = [];
    let d = 0;
    let from = -1;
    for (let i = 0; i < block.length; i++) {
      if (block[i] === '{') { if (!d) from = i; d++; }
      else if (block[i] === '}') { d--; if (!d) items.push([from, i + 1]); }
    }
    entries.slice().reverse().forEach((entry) => {
      const span = items[entry.index];
      if (!span) return;
      let obj = block.slice(span[0], span[1]);
      const at = keySpan(obj, key);
      const value = "'" + entry.value + "'";
      obj = at
        ? obj.slice(0, at[0]) + key + ': ' + value + obj.slice(at[1])
        : obj.replace(/\}$/, ', ' + key + ': ' + value + ' }');
      block = block.slice(0, span[0]) + obj + block.slice(span[1]);
    });
    return t.slice(0, start) + block + t.slice(end);
  };

  text = patchArray(text, 'crew', crewPlan, 'photo');
  text = patchArray(text, 'clients', clientPlan, 'logo');

  /* home hero sources */
  if (homeHero.length) {
    const sources = homeHero
      .map((f) => "      { src: '" + f + "', type: 'video/" + (f.endsWith('.webm') ? 'webm' : 'mp4') + "' }")
      .join(',\n');
    text = text.replace(/heroVideo: \[[\s\S]*?\n {4}\]/, 'heroVideo: [\n' + sources + '\n    ]');
  }

  /* validate before keeping it */
  const after = loadData(text);
  if (!after || !after.projects || after.projects.length !== D.projects.length) {
    throw new Error('project count changed after rewrite');
  }

  fs.writeFileSync(DATA, text);
  console.log('\nWritten to assets/js/data.js (backup at data.js.backup).');
  console.log('Next: node tools/check-media.js, then reload the site.\n');
} catch (err) {
  fs.writeFileSync(DATA, source);
  console.error('\nSomething went wrong — data.js left untouched.');
  console.error('  ' + err.message + '\n');
  process.exit(1);
}
