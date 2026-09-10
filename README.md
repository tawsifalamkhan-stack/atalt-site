# ATALT — all things altered

**ATA — 001 · Chapter One**
FR · 25.09.26 · Outskirts of Dhaka · starts 15:00 · ends 00:50

Static site. No build step, no dependencies, no framework.

## Structure

    index.html          markup only
    css/atalt.css       design system + the spring easings
    js/atalt.js         displacement engine, accordion, countdown
    assets/*.webp       artist portraits and partner marks
    netlify.toml        publish config and cache headers

## Deploy

Netlify builds from `main` on every push. No build command; publish directory
is the repo root. Markup is served with `must-revalidate`, assets are
immutable, so edits appear immediately while images stay cached.

## Brand

Warm monochrome only (`#0A0A0A` ink / `#F5F3ED` off-white / `#EBE7DA` cream).
No pure black or white. No accent colour — the sole exception is the Live the
Moment partner mark, which appears in its own colours by agreement.
The altering line is the only horizontal gesture: asymmetric, longer right.
No glitch, RGB-split or scan-line filters. Distortion is structural — cut into
the marks, names and headlines, and driven by scroll, drag, cursor and the
countdown through one spring system in `js/atalt.js`.

## Open items

- Quicket still lists 14:30; this site says 15:00. Reconcile.
- Tikt!k! bio. shadYman, OMDG and The Brown Testament Instagram confirmed;
  Tikt!k! SoundCloud outstanding.
- Confirm which portrait belongs to which artist before any is captioned.
- Running order not yet fixed.
