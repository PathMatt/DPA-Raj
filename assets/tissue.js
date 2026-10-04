// Placeholder histology, drawn procedurally so the zoom has something to land on.
// Replace with real images through CONFIG.images in index.html. Each layer is
// centred on the same point, so a real 40x crop must sit at the centre of the
// real 4x crop, which must sit at the centre of the slide photo.
//
// Coordinates are millimetres from the centre of the 40x field, y pointing down.

(function () {
  const FIELD40 = { w: 0.5, h: 0.28125 };   // mm
  const FIELD4 = { w: 5, h: 2.8125 };
  const SLIDE = { w: 76, h: 25.333 };

  // The melanocytic nests. The 40x and 4x layers draw the same layout.
  const NESTS = [
    { x: 0.06, y: -0.01, rx: 0.095, ry: 0.072, main: true },
    { x: 0.17, y: 0.085, rx: 0.04, ry: 0.03 },
    { x: -0.12, y: 0.07, rx: 0.05, ry: 0.038 },
    { x: -0.17, y: -0.08, rx: 0.035, ry: 0.028 },
    { x: 0.215, y: -0.095, rx: 0.03, ry: 0.024 },
  ];
  const FEATURE = { x: 0.075, y: -0.025 };   // the mitotic figure

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function inEllipse(x, y, n, pad = 1) {
    const dx = (x - n.x) / (n.rx * pad), dy = (y - n.y) / (n.ry * pad);
    return dx * dx + dy * dy <= 1;
  }
  function inAnyNest(x, y, pad) { return NESTS.some(n => inEllipse(x, y, n, pad)); }
  function label(g, text, w, h, size) {
    g.save();
    g.font = `600 ${size}px "Overpass", sans-serif`;
    g.textAlign = 'right'; g.textBaseline = 'bottom';
    g.fillStyle = 'rgba(22,22,22,.42)';
    g.fillText(text, w - size * 0.8, h - size * 0.6);
    g.restore();
  }

  // 40x: a dermal nest of epithelioid melanocytes with one mitosis.
  function field40() {
    const W = 2400, H = 1350, S = W / FIELD40.w;   // px per mm
    const c = canvas(W, H), g = c.getContext('2d'), r = rng(11);
    const px = (x, y) => [(x + FIELD40.w / 2) * S, (y + FIELD40.h / 2) * S];
    const um = S / 1000;                            // px per micron

    g.fillStyle = '#f1cdd9'; g.fillRect(0, 0, W, H);
    // collagen
    for (let i = 0; i < 1400; i++) {
      const x = r() * W, y = r() * H, len = 80 + r() * 260;
      const a = -0.25 + Math.sin(y / 260 + x / 900) * 0.5 + (r() - 0.5) * 0.3;
      const dx = Math.cos(a) * len, dy = Math.sin(a) * len;
      g.strokeStyle = `rgba(${200 + r() * 30 | 0},${112 + r() * 40 | 0},${150 + r() * 30 | 0},${0.12 + r() * 0.22})`;
      g.lineWidth = 3 + r() * 9;
      g.beginPath(); g.moveTo(x, y);
      g.bezierCurveTo(x + dx * 0.3, y + dy * 0.3 + (r() - 0.5) * 30, x + dx * 0.7, y + dy * 0.7 + (r() - 0.5) * 30, x + dx, y + dy);
      g.stroke();
    }
    // a capillary
    {
      const [vx, vy] = px(-0.05, 0.095);
      g.save(); g.translate(vx, vy); g.rotate(-0.3);
      g.fillStyle = '#fbeff3'; g.beginPath(); g.ellipse(0, 0, 26 * um, 13 * um, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#d9475e';
      for (let i = 0; i < 9; i++) { g.beginPath(); g.arc((r() - 0.5) * 34 * um, (r() - 0.5) * 12 * um, 3.6 * um, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = '#4b3680';
      for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; g.beginPath(); g.ellipse(Math.cos(a) * 28 * um, Math.sin(a) * 14 * um, 6 * um, 1.6 * um, a + Math.PI / 2, 0, Math.PI * 2); g.fill(); }
      g.restore();
    }
    // fibroblasts and lymphocytes in the stroma
    for (let i = 0; i < 220; i++) {
      const x = (r() - 0.5) * FIELD40.w, y = (r() - 0.5) * FIELD40.h;
      if (inAnyNest(x, y, 1.12)) continue;
      const [cx, cy] = px(x, y);
      g.fillStyle = `rgba(${64 + r() * 20 | 0},${44 + r() * 14 | 0},${116 + r() * 30 | 0},.85)`;
      g.beginPath();
      if (r() < 0.78) g.ellipse(cx, cy, (7 + r() * 5) * um, (1.3 + r() * 0.9) * um, -0.25 + Math.sin(cy / 260 + cx / 900) * 0.5, 0, Math.PI * 2);
      else g.arc(cx, cy, (3.2 + r()) * um, 0, Math.PI * 2);
      g.fill();
    }
    // nests
    for (const n of NESTS) {
      const [nx, ny] = px(n.x, n.y);
      // retraction cleft
      g.fillStyle = '#fbf1f5';
      g.beginPath(); g.ellipse(nx, ny, n.rx * S * 1.05, n.ry * S * 1.06, 0, 0, Math.PI * 2); g.fill();
      const pts = [], step = 17 * um;
      for (let y = ny - n.ry * S; y <= ny + n.ry * S; y += step * 0.87) {
        for (let x = nx - n.rx * S; x <= nx + n.rx * S; x += step) {
          const jx = x + (r() - 0.5) * step * 0.55 + ((Math.round((y - ny) / (step * 0.87)) & 1) * step / 2);
          const jy = y + (r() - 0.5) * step * 0.5;
          const mmx = jx / S - FIELD40.w / 2, mmy = jy / S - FIELD40.h / 2;
          if (inEllipse(mmx, mmy, n, 0.97)) pts.push([jx, jy]);
        }
      }
      if (pts.length < 3) continue;
      const vor = d3.Delaunay.from(pts).voronoi([nx - n.rx * S * 1.1, ny - n.ry * S * 1.1, nx + n.rx * S * 1.1, ny + n.ry * S * 1.1]);
      g.save();
      g.beginPath(); g.ellipse(nx, ny, n.rx * S, n.ry * S, 0, 0, Math.PI * 2); g.clip();
      pts.forEach((p, i) => {
        const poly = vor.cellPolygon(i); if (!poly) return;
        g.beginPath();
        poly.forEach(([x, y], j) => { const sx = p[0] + (x - p[0]) * 0.93, sy = p[1] + (y - p[1]) * 0.93; j ? g.lineTo(sx, sy) : g.moveTo(sx, sy); });
        g.closePath();
        g.fillStyle = `rgb(${222 + r() * 14 | 0},${166 + r() * 22 | 0},${194 + r() * 16 | 0})`;
        g.fill();
        g.strokeStyle = 'rgba(160,96,140,.35)'; g.lineWidth = 1.5; g.stroke();
      });
      g.restore();
      // nuclei
      pts.forEach(([x, y]) => {
        const mmx = x / S - FIELD40.w / 2, mmy = y / S - FIELD40.h / 2;
        if (Math.hypot(mmx - FEATURE.x, mmy - FEATURE.y) < 0.008) return;
        const rx = (5 + r() * 2.6) * um, ry = (4 + r() * 1.8) * um, a = r() * Math.PI;
        const grad = g.createRadialGradient(x - rx * 0.3, y - ry * 0.3, 1, x, y, rx);
        grad.addColorStop(0, '#7a5fae'); grad.addColorStop(1, '#46327e');
        g.fillStyle = grad;
        g.beginPath(); g.ellipse(x, y, rx, ry, a, 0, Math.PI * 2); g.fill();
        g.fillStyle = 'rgba(40,24,80,.5)';
        for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(x + (r() - 0.5) * rx, y + (r() - 0.5) * ry, 0.8 * um, 0, Math.PI * 2); g.fill(); }
        g.fillStyle = '#9b2453';
        g.beginPath(); g.arc(x + (r() - 0.5) * rx * 0.4, y + (r() - 0.5) * ry * 0.4, 1.3 * um, 0, Math.PI * 2); g.fill();
        if (r() < 0.12) {
          g.fillStyle = 'rgba(110,70,30,.75)';
          for (let k = 0; k < 7; k++) { g.beginPath(); g.arc(x + (r() - 0.5) * 22 * um, y + (r() - 0.5) * 18 * um, 1 * um, 0, Math.PI * 2); g.fill(); }
        }
      });
    }
    // the mitotic figure
    {
      const [fx, fy] = px(FEATURE.x, FEATURE.y);
      g.save(); g.translate(fx, fy); g.rotate(0.5);
      g.fillStyle = '#2b1d4d';
      for (let i = 0; i < 26; i++) { g.beginPath(); g.arc((r() - 0.5) * 11 * um, (r() - 0.5) * 3 * um, (1.2 + r() * 1.3) * um, 0, Math.PI * 2); g.fill(); }
      g.strokeStyle = '#2b1d4d'; g.lineWidth = 0.9 * um; g.lineCap = 'round';
      for (let i = 0; i < 18; i++) {
        const x = (r() - 0.5) * 11 * um, s = r() < 0.5 ? -1 : 1;
        g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (r() - 0.5) * 2 * um, s * (2.5 + r() * 2.8) * um); g.stroke();
      }
      g.restore();
    }
    label(g, 'PLACEHOLDER · 40× FIELD', W, H, 26);
    return c;
  }

  // 4x: skin with the lesion in the dermis.
  function field4() {
    const W = 2400, H = 1350, S = W / FIELD4.w;
    const c = canvas(W, H), g = c.getContext('2d'), r = rng(23);
    const px = (x, y) => [(x + FIELD4.w / 2) * S, (y + FIELD4.h / 2) * S];
    const top = x => -0.86 + Math.sin(x * 2.1) * 0.035 + Math.sin(x * 7.3) * 0.012;
    const bottom = x => 1.3 + Math.sin(x * 1.7 + 1) * 0.05;

    g.fillStyle = '#f4f3ef'; g.fillRect(0, 0, W, H);
    // dermis
    g.beginPath();
    for (let i = 0; i <= 200; i++) { const x = -2.5 + i * 5 / 200; const [a, b] = px(x, top(x)); i ? g.lineTo(a, b) : g.moveTo(a, b); }
    for (let i = 200; i >= 0; i--) { const x = -2.5 + i * 5 / 200; const [a, b] = px(x, bottom(x)); g.lineTo(a, b); }
    g.closePath(); g.fillStyle = '#efc4d4'; g.fill();
    g.save(); g.clip();
    for (let i = 0; i < 2600; i++) {
      const x = r() * W, y = r() * H, len = 14 + r() * 40, a = (r() - 0.5) * 0.9;
      g.strokeStyle = `rgba(${196 + r() * 30 | 0},${108 + r() * 40 | 0},${148 + r() * 30 | 0},${0.15 + r() * 0.25})`;
      g.lineWidth = 1 + r() * 3;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); g.stroke();
    }
    // subcutis fat at the base
    for (let i = 0; i < 90; i++) {
      const x = -2.5 + r() * 5, y = 1.12 + r() * 0.3;
      const [a, b] = px(x, y);
      g.fillStyle = '#fbf6f4'; g.strokeStyle = 'rgba(200,120,160,.6)'; g.lineWidth = 1.5;
      g.beginPath(); g.ellipse(a, b, 18 + r() * 14, 14 + r() * 10, r() * 3, 0, Math.PI * 2); g.fill(); g.stroke();
    }
    // follicles
    for (const [fx, fy] of [[-1.9, 0.35], [1.95, 0.2], [-1.55, 0.95]]) {
      const [a, b] = px(fx, fy);
      g.strokeStyle = '#5a418f'; g.lineWidth = 10;
      g.beginPath(); g.ellipse(a, b, 34, 46, 0.2, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#f6e6d0'; g.beginPath(); g.ellipse(a, b, 20, 30, 0.2, 0, Math.PI * 2); g.fill();
    }
    // the lesion: nests across the papillary and reticular dermis
    const lesion = (x, y) => {
      const w = 1.25 - (y + 0.8) * 0.45;
      return y > -0.8 && y < 0.95 && Math.abs(x - 0.05) < w;
    };
    for (let i = 0; i < 260; i++) {
      const x = -1.4 + r() * 2.9, y = -0.78 + r() * 1.7;
      if (!lesion(x, y)) continue;
      const [a, b] = px(x, y), rr = 8 + r() * 16;
      g.fillStyle = 'rgba(215,160,190,.9)'; g.beginPath(); g.ellipse(a, b, rr, rr * 0.8, r() * 3, 0, Math.PI * 2); g.fill();
      g.fillStyle = 'rgba(74,52,130,.9)';
      for (let k = 0; k < rr * 0.9; k++) { g.beginPath(); g.arc(a + (r() - 0.5) * rr * 1.6, b + (r() - 0.5) * rr * 1.2, 1.6 + r() * 1.2, 0, Math.PI * 2); g.fill(); }
    }
    for (const n of NESTS) {
      const [a, b] = px(n.x, n.y);
      g.fillStyle = 'rgba(218,164,194,1)'; g.beginPath(); g.ellipse(a, b, n.rx * S, n.ry * S, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = 'rgba(70,50,126,.95)';
      const count = n.rx * n.ry * S * S / 22;
      for (let k = 0; k < count; k++) {
        const t = r() * Math.PI * 2, d = Math.sqrt(r());
        g.beginPath(); g.arc(a + Math.cos(t) * d * n.rx * S, b + Math.sin(t) * d * n.ry * S, 2.2, 0, Math.PI * 2); g.fill();
      }
    }
    // scattered stromal nuclei
    g.fillStyle = 'rgba(70,50,126,.7)';
    for (let i = 0; i < 1600; i++) { g.beginPath(); g.arc(r() * W, r() * H, 1 + r() * 0.8, 0, Math.PI * 2); g.fill(); }
    g.restore();
    // epidermis and stratum corneum
    for (let i = 0; i < 4200; i++) {
      const x = -2.5 + r() * 5, d = r() * 0.085 + (Math.max(0, Math.sin(x * 22)) * 0.04 * r());
      const [a, b] = px(x, top(x) + d);
      g.fillStyle = `rgba(${78 + r() * 20 | 0},${54 + r() * 14 | 0},${136 + r() * 20 | 0},.85)`;
      g.beginPath(); g.arc(a, b, 2 + r() * 1.2, 0, Math.PI * 2); g.fill();
    }
    g.strokeStyle = 'rgba(226,150,180,.75)'; g.lineWidth = 2;
    for (let j = 0; j < 7; j++) {
      g.beginPath();
      for (let i = 0; i <= 200; i++) { const x = -2.5 + i * 5 / 200; const [a, b] = px(x, top(x) - 0.012 - j * 0.012 + Math.sin(x * 40 + j) * 0.003); i ? g.lineTo(a, b) : g.moveTo(a, b); }
      g.stroke();
    }
    label(g, 'PLACEHOLDER · 4× FIELD', W, H, 22);
    return c;
  }

  // The glass slide with three levels.
  function slide() {
    const W = 2400, H = 800, S = W / SLIDE.w;
    const c = canvas(W, H), g = c.getContext('2d'), r = rng(5);
    const px = (x, y) => [(x + SLIDE.w / 2) * S, (y + SLIDE.h / 2) * S];
    g.fillStyle = 'rgba(214,224,228,.7)';
    g.strokeStyle = 'rgba(110,124,134,.8)'; g.lineWidth = 4;
    g.beginPath(); g.roundRect(3, 3, W - 6, H - 6, 18); g.fill(); g.stroke();
    // frosted label end
    const [lx] = px(-16, 0);
    g.fillStyle = '#f2f1ec'; g.fillRect(6, 6, lx - 6, H - 12);
    g.fillStyle = 'rgba(22,22,22,.06)';
    for (let i = 0; i < 4000; i++) g.fillRect(6 + r() * (lx - 12), 6 + r() * (H - 12), 2, 2);
    g.fillStyle = '#161616'; g.font = '500 52px "Overpass Mono", monospace'; g.textBaseline = 'top';
    g.fillText('PV26-001', 60, 120);
    g.font = '400 40px "Overpass Mono", monospace';
    g.fillText('A1 · H&E', 60, 210);
    g.fillStyle = '#9c423c'; g.fillText('[accession]', 60, 290);
    g.fillStyle = 'rgba(22,22,22,.45)'; g.font = '600 26px "Overpass", sans-serif';
    g.fillText('PLACEHOLDER', 60, H - 90);
    // coverslip
    const [cx0, cy0] = px(-14, -11), [cx1, cy1] = px(36, 11);
    g.strokeStyle = 'rgba(110,124,134,.45)'; g.lineWidth = 2; g.strokeRect(cx0, cy0, cx1 - cx0, cy1 - cy0);
    // three levels; the first sits at the centre of the slide
    for (const ox of [0, 11, 22]) {
      g.beginPath();
      for (let i = 0; i <= 80; i++) {
        const t = i / 80, x = -3.3 + t * 6.6;
        const y = -0.95 + Math.sin(x * 2.1) * 0.035 - Math.cos(t * Math.PI - Math.PI / 2) * 0.12;
        const [a, b] = px(ox + x, y); i ? g.lineTo(a, b) : g.moveTo(a, b);
      }
      for (let i = 80; i >= 0; i--) {
        const t = i / 80, x = -3.3 + t * 6.6;
        const y = 1.35 - Math.pow(Math.abs(t - 0.5) * 2, 3) * 0.8;
        const [a, b] = px(ox + x, y); g.lineTo(a, b);
      }
      g.closePath();
      g.fillStyle = '#e7a9c1'; g.fill();
      g.strokeStyle = '#6c4d9c'; g.lineWidth = 2.5; g.stroke();
      const [a, b] = px(ox + 0.05, 0.05);
      g.fillStyle = 'rgba(108,77,156,.55)';
      g.beginPath(); g.ellipse(a, b, 40, 22, 0, 0, Math.PI * 2); g.fill();
    }
    return c;
  }

  window.TISSUE = { FIELD40, FIELD4, SLIDE, NESTS, FEATURE, field40, field4, slide };
})();
