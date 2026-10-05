// The case slide. The tissue is a real whole-slide image used as a stand-in
// until the case's own H&E is added: alveolar rhabdomyosarcoma, head and neck,
// 3-year-old (patient PBCWJS), frozen-section H&E scanned at 40x
// (0.2635 µm/px). Childhood Cancer Data Initiative Molecular Characterization
// Initiative (CCDI-MCI), Children's Oncology Group, via the NCI Imaging Data
// Commons, CC BY 4.0.
//
// Coordinates are millimetres from the centre of the opening 40x field, y down.

(function () {
  const MPP = 0.000263466;                                // mm per level-0 pixel
  const SCAN = { w: 103437, h: 21624 };                   // full scan, level-0 px
  const CENTRE = { x: 91290, y: 13090 };                  // opening field, level-0 px
  const CROP = { x: 84600, y: 6500, w: 12200, h: 8600 };  // the fragment that is tiled
  const mm = px => px * MPP;

  // Rectangles in mm relative to the opening field: [left, top, width, height]
  const OVERVIEW = [mm(-CENTRE.x), mm(-CENTRE.y), mm(SCAN.w), mm(SCAN.h)];
  const TILES = [mm(CROP.x - CENTRE.x), mm(CROP.y - CENTRE.y), mm(CROP.w), mm(CROP.h)];
  // the scan starts just right of the 21 mm frosted label
  const GLASS = { w: 76, h: 25.333, cx: OVERVIEW[0] + 15, cy: OVERVIEW[1] + OVERVIEW[3] / 2 };

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
    g.fillText('STAND-IN: CCDI-MCI · ARMS', 60, H - 96);
    // coverslip
    g.strokeStyle = 'rgba(110,124,134,.45)'; g.lineWidth = 2;
    g.strokeRect(labelW + 1.5 * S, 2 * S, W - labelW - 3.5 * S, H - 4 * S);
    return c;
  }

  window.TISSUE = { MPP, SCAN, CENTRE, CROP, OVERVIEW, TILES, GLASS, glass,
    dzi: 'assets/wsi/case.dzi', tiles: 'assets/wsi/case_files', spriteCells: 42, maxLevel: Math.ceil(Math.log2(Math.max(CROP.w, CROP.h))),
    FIELD40: { w: 0.5, h: 0.28125 } };
})();
