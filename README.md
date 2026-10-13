# Better Together · Pathology Visions 2026

One case, followed from a single slide in Columbus to the other side of the
world. A 16:9 HTML presentation built around a continuous zoom: from a 40x
field at Ohio State out to Cincinnati Children's, Pittsburgh and Nagasaki,
then back down to the same field.

No build step. Serve the folder (`python3 -m http.server`) or deploy to Vercel.
Everything, including the map data and libraries, is in `assets/`, so it runs
offline.

## Controls

- Right arrow, Space, Enter, Page Down or click: next. Left arrow or Page Up: back.
- If a zoom or animation is playing, the next press finishes it instead of advancing.
- Going back jumps straight to the finished state of the earlier slide.
- `F` toggles fullscreen. `N` shows the speaker notes from the script.
- Type is set like a map: Overpass (from the Highway Gothic road-sign lineage)
  for labels and headings, Overpass Mono for coordinates and distances, and
  Source Serif 4 italic for water and quotes. Fonts are vendored in `assets/fonts`. Home and End jump to the first and last slide.
- `#12` in the URL opens slide 12.
- Whenever the slide is on screen at 40x (the opening case, both votes, the
  return home and the final diagnosis) the stage is a slide viewer: drag to
  move, scroll or pinch to zoom, double-click to zoom in, `+`/`-` to zoom and
  `0` to reset. Clicks don't advance on those views; arrow keys and clickers
  do. The view carries between those steps and eases back to the planned
  field before the next camera move.
- `V` on any tissue view opens a full-screen slide viewer at the same spot
  (drag to pan, scroll to zoom, Escape or `V` to close). The H&E tile in the
  Ohio State workspace is also a live viewer.

## How the zoom works

The camera is a longitude, latitude and screen width in metres. The tissue,
the glass slide, the map and the globe are all drawn from that one number, so
a move from 0.45 mm to 30,000 km is a single camera flight (van Wijk and Nuij
smooth zoom along a great circle). The scale bar and magnification readout in
the top right are computed from the same value.

## Story

Content follows the final PowerPoint script ("Hopefully final deck"), built on
Dharmik's branch, which adds the opening question slide and the demo
screenshots and live PathPresenter links. The words live in
`assets/content.js`; bump the `?v=` on the script tags in `index.html` after
editing so browsers reload.

1. Title (a map cartouche with the four stops and presenters), disclosures,
   the question that started it (diagnose, consult, discover, teach)
2. The case at 40x at Ohio State: round blue cells in a 14-year-old (forearm
   excision), vote 1 (Ewing sarcoma, alveolar rhabdomyosarcoma, CIC-rearranged
   sarcoma, DSRCT), why a second read matters (Ray-Coquard et al., Ann Oncol
   2012), the overview with the leg distances
3. The camera pulls back from the slide to Columbus. 01 · Care: the whole case
   in one place, then Swati's eight demo steps
4. Leg 1, 159 km to Cincinnati Children's. 02 · Consult: glass vs digital
   consult, Archana's seven steps, then days to under an hour and the
   LIS-integrated portal
5. Leg 2, 414 km to Pittsburgh. 03 · Discover: Matt's eight-step rail, with
   built visuals for search by image and the ADC Alliance, the contributing
   datasets, and the cohort grid after "Build a cohort"
6. Leg 3, 11,317 km across the Pacific. 04 · Teach: Junya's seven steps
7. The whole journey (11,890 km), vote 2, the comparison, and the dive back
   to the same 40x field at Ohio State with all four sites' annotations
8. The diagnosis (CIC-rearranged sarcoma), how it was built, the case never
   started over, the intelligence layer, status, tissue intelligence, better
   together, close, thank you (both with the QR to the case)

Each demo step shows the site's step rail, the speaker's line and a screen
frame. A step can carry `images` (clicked through in order), an `iframe` to a
live PathPresenter link, a single `img`, a built `html` visual, or nothing, in
which case the frame shows the `screen` text as a placeholder.

## Placeholders

- Inline text in rust brackets, for example `[feature]`, is content to fill in.
- Dashed boxes are image placeholders.
- `CONFIG` at the top of `index.html` holds the four sites, the poll and teaching-module URLs (a real QR code is drawn when
  set), the case images, and the learner locations on the globe, which are
  illustrative until replaced.
- The tissue is the case's own H&E, scanned at 40x (0.2633 µm/px). The source
  `.svs` is not in the repo (about 1.2 GB); only web images built from it are:
  - `assets/wsi/case.dzi` and `assets/wsi/case_files/`: a Deep Zoom pyramid
    of a 16,384 x 12,288 px (4.3 x 3.2 mm) region around the opening field, at
    full 40x resolution (512 px JPEG tiles, blank glass skipped, ~50 MB). This
    is what the stage and the `V` viewer show when you zoom in.
  - `assets/wsi/overview.jpg`: the whole scan at 1/16 resolution, shown when
    zoomed out to the glass.
  - `assets/wsi/field40.jpg`: the opening 40x field, used for the case's tile
    in the cohort grid and the image-search query in Discover.
  - `assets/wsi/cohort.jpg`: 48 crops from around the slide (8 x 6 sprite)
    standing in for other cases in the cohort grid and search results.
  Vercel serves these as static files straight from the repo, so a push to
  `main` publishes them; no separate storage is involved.
- To swap in another slide: crop the region to tile and build the pyramid
  (`vips crop slide.svs crop.v X Y W H`, `vips flatten crop.v crop3.v
  --background 255`, then `vips dzsave crop3.v assets/wsi/case --tile-size 512
  --overlap 0 --suffix '.jpg[Q=72]' --skip-blanks 6 --keep none`), delete the
  `vips-properties.xml` it writes (it carries scanner metadata), rebuild the
  overview, 40x still and sprite, and update `MPP`, `SCAN`, `CENTRE` and
  `CROP` in `assets/tissue.js` (level-0 pixels; `CENTRE` is the middle of the
  opening 40x field) and `spriteCells`.
- Annotation positions on the 40x field are in `MARKS` in `assets/app.js`,
  in millimetres from the field centre.

## Data

- Map: Natural Earth via world-atlas and us-atlas, plus Natural Earth highways,
  rivers, populated places and the Great Lakes, clipped to the Ohio Valley and
  Kyushu (`assets/geo/context.json`).
- d3 v7, topojson-client, qrcode-generator and OpenSeadragon 6 are vendored
  in `assets/vendor`.
- Elmore JG et al. BMJ 2017;357:j2813 (doi:10.1136/bmj.j2813): accuracy 25%,
  40% and 43% for classes II to IV.
