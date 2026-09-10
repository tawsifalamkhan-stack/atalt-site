# ATALT — all things altered

**ATA — 001 · Chapter One**  
FR · 25.09.26 · Outskirts of Dhaka · starts 15:00 · ends 00:50

Single-page event site. No build step, no dependencies, no external assets.

## Structure

    index.html    the entire site

One file. HTML, CSS and JS are inline. All ten images — six artist
portraits, the ATALT sigil, the Live the Moment mark and the Funktion-One
mark — are embedded as base64 data URIs, so the page has no asset
directory and cannot break from a missing file. Roughly 1.3 MB, of which
1.24 MB is imagery and 42 KB is markup.

Only external calls: Google Fonts (Inter, IBM Plex Mono) and one
SoundCloud iframe on the AAYNA panel.

## Deploy

Any static host. Drop `index.html` at the web root.
Netlify project: https://atalt-ata-001.netlify.app

## Brand

Warm monochrome only (`#0A0A0A` ink / `#F5F3ED` off-white / `#EBE7DA` cream).
No pure black or white. No accent colour — the one exception is the Live the
Moment partner mark, which appears in its own colours by agreement.
The altering line is the only horizontal gesture: asymmetric, longer right.
No glitch, RGB-split or scan-line filters; the distortion is structural,
cut into the marks, names and headlines themselves.

## Open items

- Gate time: hero says 15:00, the countdown targets 14:30 — reconcile.
- Tikt!k! bio and links.
- shadYman Instagram and SoundCloud. OMDG and The Brown Testament Instagram.
- Confirm which portrait belongs to which artist before any is captioned.
- Second paragraph of each artist bio describes their expected direction
  for Chapter 01; confirm with each artist before this is public.
- Running order not yet fixed.
