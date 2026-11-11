#!/bin/sh
# Copies only what visitors need into one folder for hosting:
# pages, assets and host config — never tools, docs or templates.
set -eu
OUT="${1:-_site}"
mkdir -p "$OUT"
cp ./*.html "$OUT"/
rm -f "$OUT/preview.html"
cp -R assets "$OUT"/
for f in favicon.ico robots.txt sitemap.xml _headers .nojekyll CNAME; do
  [ -e "$f" ] && cp "$f" "$OUT"/
done
find "$OUT" -name 'README.md' -delete
find "$OUT" -name '.gitkeep' -delete
echo "site ready in $OUT ($(find "$OUT" -type f | wc -l) files)"
