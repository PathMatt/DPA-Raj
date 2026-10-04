// The case slide. The tissue is a real whole-slide image: SN_0023 from the
// SOPHIE Spitzoid tumour dataset (CC0), a Spitz nevus of the head and neck in
// an 8-year-old, scanned at 40x (0.25 µm/px). It stands in for the case until
// the real slides are added.
//
// Coordinates are millimetres from the centre of the opening 40x field, y down.

(function () {
  const MPP = 0.00025;                                    // mm per level-0 pixel
  const SCAN = { w: 55008, h: 26368 };                    // full scan, level-0 px
  const CENTRE = { x: 46775, y: 13426 };                  // opening field, level-0 px
  const CROP = { x: 28500, y: 1900, w: 21700, h: 20100 }; // the section that is tiled
  const mm = px => px * MPP;

  // Rectangles in mm relative to the opening field: [left, top, width, height]
  const OVERVIEW = [mm(-CENTRE.x), mm(-CENTRE.y), mm(SCAN.w), mm(SCAN.h)];
  const TILES = [mm(CROP.x - CENTRE.x), mm(CROP.y - CENTRE.y), mm(CROP.w), mm(CROP.h)];
  const GLASS = { w: 76, h: 25.333, cx: OVERVIEW[0] + OVERVIEW[2] / 2 + 8, cy: OVERVIEW[1] + OVERVIEW[3] / 2 };

  // A glass slide with a frosted label end, drawn so the scanned area sits in the clear part.
  function glass() {
    const W = 2400, H = 800, S = W / GLASS.w;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = 'rgba(214,224,228,.7)';
    g.strokeStyle = 'rgba(110,124,134,.8)'; g.lineWidth = 4;
    g.beginPath(); g.roundRect(3, 3, W - 6, H - 6, 18); g.fill(); g.stroke();
    const labelW = 21 * S;
    g.fillStyle = '#f2f1ec'; g.fillRect(6, 6, labelW, H - 12);
    g.fillStyle = 'rgba(22,22,22,.05)';
    for (let i = 0; i < 4000; i++) g.fillRect(6 + Math.random() * (labelW - 12), 6 + Math.random() * (H - 12), 2, 2);
    g.textBaseline = 'top';
    g.fillStyle = '#161616'; g.font = '500 52px "Overpass Mono", monospace'; g.fillText('PV26-001', 60, 120);
    g.font = '400 40px "Overpass Mono", monospace'; g.fillText('A1 · H&E', 60, 210);
    g.fillStyle = '#9c423c'; g.fillText('[accession]', 60, 290);
    g.fillStyle = 'rgba(22,22,22,.5)'; g.font = '600 24px "Overpass", sans-serif';
    g.fillText('STAND-IN: SOPHIE SN_0023', 60, H - 96);
    // coverslip
    g.strokeStyle = 'rgba(110,124,134,.45)'; g.lineWidth = 2;
    g.strokeRect(labelW + 1.5 * S, 2 * S, W - labelW - 3.5 * S, H - 4 * S);
    return c;
  }

  window.TISSUE = { MPP, SCAN, CENTRE, CROP, OVERVIEW, TILES, GLASS, glass,
    dzi: 'assets/wsi/sn0023.dzi', tiles: 'assets/wsi/sn0023_files', maxLevel: Math.ceil(Math.log2(Math.max(CROP.w, CROP.h))),
    FIELD40: { w: 0.5, h: 0.28125 } };
})();
