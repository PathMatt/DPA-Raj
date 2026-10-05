# Better Together · Pathology Visions 2026

One case, followed from a single slide in Cincinnati to the other side of the
world. A 16:9 HTML presentation built around a continuous zoom: from a 40x
field at Cincinnati Children's out to Columbus, Pittsburgh and Nagasaki, then
back down to the same field.

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
  Cincinnati workspace is also a live viewer.

## How the zoom works

The camera is a longitude, latitude and screen width in metres. The tissue,
the glass slide, the map and the globe are all drawn from that one number, so
a move from 0.45 mm to 30,000 km is a single camera flight (van Wijk and Nuij
smooth zoom along a great circle). The scale bar and magnification readout in
the top right are computed from the same value.

## Story

Content follows the "Better Together · PV 2026" PowerPoint script; the words
live in `assets/content.js`.

1. Title (a map cartouche with the four stops), disclosures
2. The case at 40x in Cincinnati: round blue cells, vote 1 (four options),
   why a second read matters (Ray-Coquard et al., Ann Oncol 2012), the overview
3. The camera pulls back from the slide to Cincinnati Children's.
   01 · Care: the whole case in one place, then Archana's eight demo steps
4. Leg 1, 159 km to Columbus. 02 · Consult: Swati's eight steps, then the
   23 h vs 30 min referral data
5. Leg 2, 264 km to Pittsburgh. 03 · Discover: Matt's eight steps, with the
   cohort grid after "Build a cohort"
6. Leg 3, 11,317 km across the Pacific. 04 · Teach: Junya's seven steps
7. The whole journey (11,740 km), vote 2, the comparison
8. The dive back to the same 40x field in Cincinnati, with all four sites'
   annotations; final diagnosis, history, what we believe, status, panel,
   close, three backup slides

Each demo step shows the site's step rail, the speaker's line and a screen
frame holding the placeholder for the live demo. To show a screenshot
instead, add `img: 'assets/screens/<file>.jpg'` to that step in
`assets/content.js`.

## Placeholders

- Inline text in rust brackets, for example `[feature]`, is content to fill in.
- Dashed boxes are image placeholders.
- `CONFIG` at the top of `index.html` holds the four sites, the poll and teaching-module URLs (a real QR code is drawn when
  set), the case images, and the learner locations on the globe, which are
  illustrative until replaced.
- The tissue is a real whole-slide image used as a stand-in: SN_0023 from the
  SOPHIE Spitzoid tumour dataset (Spitz nevus, head and neck, 8-year-old),
  CC0, Mosquera-Zamudio A et al. Sci Data 2023;10:704
  (doi:10.1038/s41597-023-02585-2). The tiled section is in `assets/wsi/`
  (Deep Zoom, 512 px JPEG tiles, blank glass tiles skipped, ~50 MB), with a
  whole-slide overview, the 40x still and a crop sprite for the cohort grid.
- To swap in the real case: build a Deep Zoom pyramid of the section
  (`vips dzsave section.tif assets/wsi/sn0023 --tile-size 512 --overlap 0
  --suffix '.jpg[Q=72]' --skip-blanks 6`), replace the overview and 40x
  still, and update `SCAN`, `CENTRE` and `CROP` in `assets/tissue.js`
  (level-0 pixels; `CENTRE` is the middle of the opening 40x field).
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
