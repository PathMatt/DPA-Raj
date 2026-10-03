# Better Together · Pathology Visions 2026

One case, followed from a single cell to the other side of the world. A 16:9
HTML presentation built around a continuous zoom: from a 40x field in a
community hospital out to Cincinnati, Columbus, Pittsburgh and Nagasaki, then
back down to the same field.

No build step. Serve the folder (`python3 -m http.server`) or deploy to Vercel.
Everything, including the map data and libraries, is in `assets/`, so it runs
offline.

## Controls

- Right arrow, Space, Enter, Page Down or click: next. Left arrow or Page Up: back.
- If a zoom or animation is playing, the next press finishes it instead of advancing.
- Going back jumps straight to the finished state of the earlier slide.
- `F` toggles fullscreen. Home and End jump to the first and last slide.
- `#12` in the URL opens slide 12.

## How the zoom works

The camera is a longitude, latitude and screen width in metres. The tissue,
the glass slide, the map and the globe are all drawn from that one number, so
a move from 0.45 mm to 30,000 km is a single camera flight (van Wijk and Nuij
smooth zoom along a great circle). The scale bar and magnification readout in
the top right are computed from the same value.

## Story

1. Title, disclosures
2. 40x in a community hospital, one feature marked, vote 1
3. Zoom out to the region, the case flies to Cincinnati Children's
4. Cincinnati: the slide pulls back to the whole case (clinical photo, history,
   priors, gross, stains, molecular), what moved the differential
5. Cincinnati to Columbus: the consult, the 23 h vs 30 min referral data, the finding
6. Columbus to Pittsburgh: the case pulls back into a shared collection, AI status
7. Pittsburgh to Nagasaki across the Pacific: teaching from the case
8. The globe with every handoff and the learners, vote 2, comparison
9. The dive back to the same 40x field, now carrying all four sites' annotations
10. Final diagnosis, platform history, status, panel, close, three backup slides

## Placeholders

- Inline text in rust brackets, for example `[feature]`, is content to fill in.
- Dashed boxes are image placeholders.
- `CONFIG` at the top of `index.html` holds the community hospital's location
  and name, the poll and teaching-module URLs (a real QR code is drawn when
  set), the case images, and the learner locations on the globe, which are
  illustrative until replaced.
- The tissue is drawn procedurally and labelled PLACEHOLDER. See
  `assets/case/README.md` for the image sizes that replace it.
- Annotation positions on the 40x field are in `MARKS` in `assets/app.js`,
  in millimetres from the field centre.

## Data

- Map: Natural Earth via world-atlas and us-atlas, plus Natural Earth highways,
  rivers, populated places and the Great Lakes, clipped to the Ohio Valley and
  Kyushu (`assets/geo/context.json`).
- d3 v7, topojson-client and qrcode-generator are vendored in `assets/vendor`.
- Elmore JG et al. BMJ 2017;357:j2813 (doi:10.1136/bmj.j2813): accuracy 25%,
  40% and 43% for classes II to IV.
