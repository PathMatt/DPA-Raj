// Better Together: one camera that zooms from a 40x field to the whole planet.
//
// The camera is { lon, lat, w }, where w is the width of the screen in metres.
// Everything (tissue, slide, map, globe) is drawn from that one value, so a
// zoom is a single continuous move across eleven orders of magnitude.

(function () {
  const { sites: SITES, learners: LEARNERS } = CONFIG;
  const R = 6371008.8;                       // earth radius, metres
  const PAPER = '#fafaf8', INK = '#161616', RUST = '#9c423c';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const lg = Math.log10;
  const ease = d3.easeCubicInOut;

  const deck = $('#deck'), canvas = $('#world'), ctx = canvas.getContext('2d');
  let W = 1600, H = 900, DPR = 1, U = 1;     // U: one "design pixel" at 1600 wide

  // ---------- views ----------
  const geo = s => [s.lon, s.lat];
  function viewAt(site, w, shift = 0.12) {
    // put the site right of centre so the left-hand cards don't cover it
    const dLon = (shift * w) / (R * Math.cos(site.lat * Math.PI / 180)) * 180 / Math.PI;
    return { lon: site.lon - dLon, lat: site.lat, w };
  }
  const C = SITES.community;
  const ohioMid = d3.geoInterpolate(geo(C), geo(SITES.cincinnati))(0.5);
  const pacific = d3.geoInterpolate(geo(SITES.pittsburgh), geo(SITES.nagasaki))(0.5);
  const VIEWS = {
    lab40: { lon: C.lon, lat: C.lat, w: 0.00045 },
    lab4: { lon: C.lon, lat: C.lat, w: 0.0045 },
    ohio: { lon: ohioMid[0], lat: ohioMid[1], w: 380e3 },
    cincinnati: viewAt(SITES.cincinnati, 260e3),
    columbus: viewAt(SITES.columbus, 260e3),
    pittsburgh: viewAt(SITES.pittsburgh, 320e3),
    nagasaki: viewAt(SITES.nagasaki, 700e3),
    globe: { lon: pacific[0], lat: pacific[1] - 6, w: 30000e3 },
  };

  const ROUTES = [
    { key: 'r1', a: 'community', b: 'cincinnati' },
    { key: 'r2', a: 'cincinnati', b: 'columbus' },
    { key: 'r3', a: 'columbus', b: 'pittsburgh' },
    { key: 'r4', a: 'pittsburgh', b: 'nagasaki' },
  ];
  ROUTES.forEach(r => { r.km = d3.geoDistance(geo(SITES[r.a]), geo(SITES[r.b])) * R / 1000; });
  const TOTAL_KM = ROUTES.reduce((s, r) => s + r.km, 0);
  $$('[data-dist="pittsburgh-nagasaki"]').forEach(el => { el.textContent = (Math.round(ROUTES[3].km / 100) * 100).toLocaleString(); });

  // Annotations on the opening 40x field, in mm from its centre (y down). They sit
  // on real structures in the stand-in slide; the labels are placeholders.
  const MARKS = {
    community: { color: INK, items: [{ type: 'circle', x: 0.0925, y: 0.0045, r: 0.022, label: '[the feature]', dx: 0.03, dy: -0.012 }] },
    cincinnati: { color: RUST, tag: 'CIN', items: [
      { type: 'num', n: 1, x: 0.045, y: -0.0465, r: 0.009, label: '[features 1–3]', dx: 0.014, dy: -0.004 },
      { type: 'num', n: 2, x: 0.155, y: -0.0665, r: 0.009 },
      { type: 'num', n: 3, x: 0.010, y: 0.0635, r: 0.009 },
    ] },
    columbus: { color: RUST, tag: 'OSU', items: [{ type: 'rect', x0: 0.095, y0: 0.07, x1: 0.185, y1: 0.12, label: '[area that changed the read]', dx: 0.09, dy: -0.014, anchor: 'right' }] },
    pittsburgh: { color: RUST, tag: 'UPMC', items: [{ type: 'ellipse', x: 0.055, y: -0.0065, rx: 0.105, ry: 0.09, dash: true, label: '[n] cases share this pattern', dx: -0.04, dy: -0.098 }] },
    nagasaki: { color: RUST, tag: 'NGS', items: [{ type: 'pin', x: 0.0, y: 0.1, label: '[teaching note]', dx: 0.006, dy: -0.011 }] },
  };

  // ---------- geography ----------
  const GEO = { ready: false };
  function pieces(geom) {
    const out = [];
    const push = g => {
      const c = d3.geoCentroid(g); let r = 0;
      const walk = a => typeof a[0] === 'number' ? (r = Math.max(r, d3.geoDistance(c, a))) : a.forEach(walk);
      walk(g.coordinates);
      out.push({ g, c, r });
    };
    const each = g => {
      if (!g) return;
      if (g.type === 'FeatureCollection') g.features.forEach(f => each(f.geometry));
      else if (g.type === 'Feature') each(g.geometry);
      else if (g.type === 'MultiPolygon') g.coordinates.forEach(c => push({ type: 'Polygon', coordinates: c }));
      else if (g.type === 'MultiLineString') g.coordinates.forEach(c => push({ type: 'LineString', coordinates: c }));
      else if (g.type === 'Polygon' || g.type === 'LineString') push(g);
    };
    each(geom);
    return out;
  }
  const ringsAsLines = fc => {
    const lines = [];
    fc.features.forEach(f => {
      const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      polys.forEach(p => p.forEach(ring => lines.push(ring)));
    });
    return { type: 'MultiLineString', coordinates: lines };
  };
  Promise.all(['countries-110m', 'countries-50m', 'states-10m', 'great-lakes-50m', 'japan-10m', 'context']
    .map(n => fetch(`assets/geo/${n}.json`).then(r => r.json())))
    .then(([c110, c50, st, lakes, jp, cx]) => {
      const ml = lines => pieces({ type: 'MultiLineString', coordinates: lines });
      GEO.ctx = { major: ml(cx.major), secondary: ml(cx.secondary), rivers: ml(cx.rivers), places: cx.places };
      const isJp = f => f.properties && f.properties.name === 'Japan';
      const c50f = topojson.feature(c50, c50.objects.countries);
      GEO.lo = {
        fill: pieces(topojson.feature(c110, c110.objects.land)),
        coast: pieces(topojson.mesh(c110, c110.objects.countries, (a, b) => a === b)),
        borders: pieces(topojson.mesh(c110, c110.objects.countries, (a, b) => a !== b)),
      };
      GEO.hi = {
        fill: pieces({ type: 'FeatureCollection', features: c50f.features.filter(f => !isJp(f)) }),
        fillJp: pieces({ type: 'FeatureCollection', features: c50f.features.filter(isJp) }),
        coast: pieces(topojson.mesh(c50, c50.objects.countries, (a, b) => a === b && !isJp(a))),
        coastJp: pieces(topojson.mesh(c50, c50.objects.countries, (a, b) => a === b && isJp(a))),
        borders: pieces(topojson.mesh(c50, c50.objects.countries, (a, b) => a !== b)),
        states: pieces(topojson.mesh(st, st.objects.states, (a, b) => a !== b)),
        lakes: pieces(lakes),
        jp10: pieces(jp),
        jp10coast: pieces(ringsAsLines(jp)),
      };
      GEO.graticule = d3.geoGraticule10();
      GEO.ready = true;
    });

  // ---------- textures ----------
  const loadImage = src => { const im = new Image(); im.src = src; return im; };
  const TEX = { glass: TISSUE.glass(), overview: loadImage('assets/wsi/overview.jpg'), field40: loadImage('assets/wsi/field40.jpg'), sprite: loadImage('assets/wsi/cohort.jpg') };
  const ready = im => im.complete && im.naturalWidth > 0;

  // ---------- the slide's tile pyramid, drawn straight into the camera ----------
  const tileCache = new Map(), tileQueue = [];
  let tileFlight = 0, frameNo = 0;
  function requestTile(L, x, y, want) {
    const key = `${L}/${x}_${y}`;
    let t = tileCache.get(key);
    if (!t) { t = { key, L, img: null, state: 0, want: 0, queued: false }; tileCache.set(key, t); }
    t.want = Math.max(t.want, want);
    if (t.state === 0 && !t.queued) { t.queued = true; tileQueue.push(t); }
    return t;
  }
  function pumpTiles() {
    if (!tileQueue.length) return;
    tileQueue.sort((a, b) => b.want - a.want || b.L - a.L);
    while (tileFlight < 12 && tileQueue.length) {
      const t = tileQueue.shift(); t.queued = false;
      if (frameNo - t.want > 30) continue;      // scrolled past; can be asked for again
      t.state = 1; tileFlight++;
      const im = new Image();
      im.onload = () => { t.img = im; t.state = 2; tileFlight--; };
      im.onerror = () => { t.state = 3; tileFlight--; };   // blank glass tiles were left out of the pyramid
      im.src = `${TISSUE.tiles}/${t.key}.jpg`;
    }
  }
  function levelInfo(L) {
    const f = Math.pow(2, L - TISSUE.maxLevel);
    return { f, nx: Math.ceil(Math.ceil(TISSUE.CROP.w * f) / 512), ny: Math.ceil(Math.ceil(TISSUE.CROP.h * f) / 512) };
  }
  // cx, cy: screen position of the opening field's centre; kmm: screen px per mm
  function drawTiles(cx, cy, kmm, { draw = true, want = frameNo } = {}) {
    const T = TISSUE, s = kmm * T.MPP;         // screen px per level-0 px
    if (s * DPR < 1 / 40) return;               // the overview image is already sharp enough
    const top = Math.min(T.maxLevel, Math.max(8, T.maxLevel + Math.ceil(Math.log2(s * DPR))));
    const ox = cx + (T.CROP.x - T.CENTRE.x) * s, oy = cy + (T.CROP.y - T.CENTRE.y) * s;
    for (let L = Math.max(8, top - 3); L <= top; L++) {
      const { f, nx, ny } = levelInfo(L), ts = 512 / f * s;
      const x0 = Math.max(0, Math.floor(-ox / ts)), x1 = Math.min(nx - 1, Math.floor((W - ox) / ts));
      const y0 = Math.max(0, Math.floor(-oy / ts)), y1 = Math.min(ny - 1, Math.floor((H - oy) / ts));
      if (x1 < x0 || y1 < y0 || (x1 - x0 + 1) * (y1 - y0 + 1) > 220) continue;
      for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
        const t = (L === top || L === top - 2) ? requestTile(L, tx, ty, want) : tileCache.get(`${L}/${tx}_${ty}`);
        if (draw && t && t.state === 2) ctx.drawImage(t.img, ox + tx * ts, oy + ty * ts, t.img.width / f * s + 0.6, t.img.height / f * s + 0.6);
      }
    }
  }
  // Warm the cache along the opening zoom so the first pull-back is sharp.
  function prefetchOpening() {
    for (let w = 0.00045; w < 0.02; w *= 2) drawTiles(W / 2, H / 2, W / (w * 1000), { draw: false, want: 1e9 });
  }

  // ---------- state ----------
  const S = {
    cam: { ...VIEWS.lab40 },
    routes: Object.fromEntries(ROUTES.map(r => [r.key, 0])),
    packet: null,            // { key, f }
    marks: {},               // site -> 0..1
    learners: 0,
    spin: false, spinFrom: 0, spinLon: 0,
    showSites: true,
  };

  // ---------- projection ----------
  const projection = d3.geoOrthographic().clipAngle(90).precision(0.35);
  const path = d3.geoPath(projection, ctx);
  function setProjection() {
    projection.rotate([-S.cam.lon, -S.cam.lat]).translate([W / 2, H / 2]).scale(R * W / S.cam.w);
  }
  const center = () => [S.cam.lon, S.cam.lat];
  const visibleGeo = p => d3.geoDistance(center(), p) < Math.PI / 2 - 0.005;

  // A great circle bowed sideways (northward) so every handoff reads as a flight.
  function bowed(a, b, bulge = 0.12) {
    const toV = ([lon, lat]) => { const l = lon * Math.PI / 180, p = lat * Math.PI / 180; return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)]; };
    const A = toV(a), B = toV(b);
    let N = [A[1] * B[2] - A[2] * B[1], A[2] * B[0] - A[0] * B[2], A[0] * B[1] - A[1] * B[0]];
    const n = Math.hypot(...N) || 1; N = N.map(v => v / n);
    if (N[2] < 0) N = N.map(v => -v);
    const ang = d3.geoDistance(a, b), gi = d3.geoInterpolate(a, b);
    return f => {
      const P = toV(gi(f)), d = Math.sin(Math.PI * f) * bulge * ang;
      const X = P.map((v, i) => v * Math.cos(d) + N[i] * Math.sin(d));
      return [Math.atan2(X[1], X[0]) * 180 / Math.PI, Math.asin(Math.max(-1, Math.min(1, X[2]))) * 180 / Math.PI];
    };
  }
  const ROUTE_PATH = Object.fromEntries(ROUTES.map(r => [r.key, bowed(geo(SITES[r.a]), geo(SITES[r.b]))]));
  const LEARNER_PATH = LEARNERS.map(p => bowed(geo(SITES.nagasaki), p, 0.08));

  // ---------- drawing ----------
  function resize() {
    const r = deck.getBoundingClientRect();
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height; U = W / 1600;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function drawGrid(ox, oy, k, A) {
    for (let e = -6; e <= 6; e++) {
      const s = Math.pow(10, e) * k;
      if (s < 10 * U || s > W * 1.4) continue;
      const a = A * clamp01(lg(s / (10 * U)) / 0.9) * clamp01(lg(W * 1.4 / s) / 0.7) * 0.085;
      if (a <= 0.002) continue;
      ctx.strokeStyle = `rgba(22,22,22,${a})`; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = ((ox % s) + s) % s; x < W; x += s) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = ((oy % s) + s) % s; y < H; y += s) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();
    }
  }

  // Draw an image that represents wm x hm metres, centred at (cx, cy) on screen.
  function drawLayer(img, wm, hm, cx, cy, k, alpha) {
    if (alpha <= 0) return;
    const dw = wm * k, dh = hm * k, dx = cx - dw / 2, dy = cy - dh / 2;
    const x0 = Math.max(0, dx), y0 = Math.max(0, dy), x1 = Math.min(W, dx + dw), y1 = Math.min(H, dy + dh);
    if (x1 <= x0 || y1 <= y0) return;
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    const sx = (x0 - dx) / dw * iw, sy = (y0 - dy) / dh * ih, sw = (x1 - x0) / dw * iw, sh = (y1 - y0) / dh * ih;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, sx, sy, Math.max(sw, 0.5), Math.max(sh, 0.5), x0, y0, x1 - x0, y1 - y0);
    ctx.globalAlpha = 1;
  }

  function drawMicro(cx, cy, k) {
    const T = TISSUE, kmm = k * 0.001, G = T.GLASS;
    const glassW = G.w * kmm;
    if (glassW < 2) return;
    // the glass fades into a dot once it is a few pixels wide
    const ga = clamp01((glassW - 4 * U) / (14 * U));
    drawLayer(TEX.glass, G.w / 1000, G.h / 1000, cx + G.cx * kmm, cy + G.cy * kmm, k, ga);
    const O = T.OVERVIEW;
    if (ready(TEX.overview)) drawLayer(TEX.overview, O[2] / 1000, O[3] / 1000, cx + (O[0] + O[2] / 2) * kmm, cy + (O[1] + O[3] / 2) * kmm, k, ga);
    drawTiles(cx, cy, kmm);
    // as the slide shrinks it turns into tiles: the case becoming data
    const tA = Math.min(clamp01((glassW - 70 * U) / (90 * U)), clamp01((900 * U - glassW) / (400 * U)));
    if (tA > 0) {
      const sw = glassW, sh = G.h * kmm, x0 = cx + G.cx * kmm - sw / 2, y0 = cy + G.cy * kmm - sh / 2, n = 28, st = sw / n;
      ctx.strokeStyle = `rgba(156,66,60,${0.45 * tA})`; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) { ctx.moveTo(x0 + i * st, y0); ctx.lineTo(x0 + i * st, y0 + sh); }
      for (let y = 0; y <= sh + 0.1; y += st) { ctx.moveTo(x0, y0 + y); ctx.lineTo(x0 + sw, y0 + y); }
      ctx.stroke();
    }
    // annotations, only once the 40x field is large enough to read
    const mA = clamp01((T.FIELD40.w * kmm / W - 0.45) / 0.3);
    if (mA > 0) drawMarks(cx, cy, kmm, mA);
  }

  const FAMILY = { sans: '"Overpass", "Helvetica Neue", Arial, sans-serif', mono: '"Overpass Mono", Menlo, monospace', serif: 'italic "Source Serif 4", Georgia, serif' };
  function font(px, weight = 400, family = 'sans') {
    return family === 'serif' ? `italic ${weight} ${px * U}px ${FAMILY.serif.replace('italic ', '')}` : `${weight} ${px * U}px ${FAMILY[family]}`;
  }
  const track = em => { if ('letterSpacing' in ctx) ctx.letterSpacing = em ? `${em}em` : '0px'; };
  function tagLabel(x, y, tag, text, color, alpha, anchor = 'left') {
    ctx.font = font(15);
    const tagW = tag ? ctx.measureText(tag + ' ').width : 0;
    ctx.font = font(15);
    const tw = ctx.measureText(text).width + tagW;
    const pad = 6 * U, h = 24 * U;
    let bx = anchor === 'right' ? x - tw - pad * 2 : x;
    const by = y - h / 2;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(250,250,248,.94)';
    ctx.fillRect(bx, by, tw + pad * 2, h);
    ctx.textBaseline = 'middle';
    if (tag) { ctx.font = font(15, 800); ctx.fillStyle = color; ctx.fillText(tag, bx + pad, y + 1 * U); }
    ctx.font = font(15); ctx.fillStyle = INK; ctx.fillText(text, bx + pad + tagW, y + 1 * U);
    ctx.globalAlpha = 1;
  }

  function drawMarks(cx, cy, kmm, alpha) {
    const X = x => cx + x * kmm, Y = y => cy + y * kmm;
    for (const [site, def] of Object.entries(MARKS)) {
      const p = (S.marks[site] || 0);
      if (p <= 0) continue;
      ctx.strokeStyle = def.color; ctx.fillStyle = def.color;
      ctx.lineWidth = 2.5 * U;
      def.items.forEach((m, i) => {
        const local = clamp01(p * def.items.length - i);
        if (local <= 0) return;
        ctx.globalAlpha = alpha;
        ctx.setLineDash(m.dash ? [8 * U, 6 * U] : []);
        ctx.beginPath();
        if (m.type === 'circle' || m.type === 'num') {
          ctx.arc(X(m.x), Y(m.y), m.r * kmm, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * local);
          ctx.stroke();
          if (m.type === 'num' && local > 0.6) {
            ctx.font = font(15, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            const lx = X(m.x) - (m.r * kmm + 12 * U), ly = Y(m.y) - (m.r * kmm + 4 * U);
            ctx.fillStyle = 'rgba(250,250,248,.94)'; ctx.fillRect(lx - 9 * U, ly - 11 * U, 18 * U, 22 * U);
            ctx.fillStyle = def.color; ctx.fillText(String(m.n), lx, ly + 1 * U); ctx.textAlign = 'left';
          }
        } else if (m.type === 'rect') {
          const x0 = X(m.x0), y0 = Y(m.y0), w = (m.x1 - m.x0) * kmm, h = (m.y1 - m.y0) * kmm;
          const per = 2 * (w + h), len = per * local;
          ctx.moveTo(x0, y0);
          const seg = [[w, 0], [0, h], [-w, 0], [0, -h]]; let used = 0, x = x0, y = y0;
          for (const [dx, dy] of seg) {
            const L = Math.abs(dx + dy); if (used >= len) break;
            const t = Math.min(1, (len - used) / L); x += dx * t; y += dy * t; ctx.lineTo(x, y); used += L;
          }
          ctx.stroke();
        } else if (m.type === 'ellipse') {
          ctx.ellipse(X(m.x), Y(m.y), m.rx * kmm, m.ry * kmm, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * local);
          ctx.stroke();
        } else if (m.type === 'pin') {
          const x = X(m.x), y = Y(m.y);
          ctx.arc(x, y, 5 * U, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 16 * U * local); ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        if (m.label && local > 0.85) {
          const a = alpha * clamp01((local - 0.85) / 0.15);
          const ax = m.type === 'rect' ? m.x0 : m.x, ay = m.type === 'rect' ? m.y0 : m.y;
          tagLabel(X(ax + m.dx), Y(ay + m.dy), def.tag, m.label, def.color, a, m.anchor);
        }
      });
    }
  }

  function drawMap(alpha) {
    if (!GEO.ready) return;
    const w = S.cam.w, c = center();
    const rView = Math.min(Math.PI / 2 + 0.05, Math.hypot(W, H) / 2 * (w / W) / R + 0.03);
    const vis = p => d3.geoDistance(c, p.c) - p.r < rView;
    const draw = list => { for (const p of list) if (vis(p)) path(p.g); };
    const hi = w <= 3.5e6, L = hi ? GEO.hi : GEO.lo, jpFine = w < 1.6e6;
    ctx.save();
    ctx.globalAlpha = alpha;
    const sphereA = clamp01((w - 1.2e6) / 3e6);
    if (sphereA > 0) {
      ctx.globalAlpha = alpha * sphereA;
      ctx.beginPath(); path({ type: 'Sphere' }); ctx.fillStyle = '#f2f2ed'; ctx.fill();
      ctx.beginPath(); path(GEO.graticule); ctx.strokeStyle = 'rgba(22,22,22,.07)'; ctx.lineWidth = 0.7 * U; ctx.stroke();
      ctx.globalAlpha = alpha;
    }
    ctx.beginPath(); draw(L.fill); if (hi) draw(jpFine ? L.jp10 : L.fillJp);
    ctx.fillStyle = '#efeee8'; ctx.fill();
    if (hi) {
      ctx.beginPath(); draw(L.lakes); ctx.fillStyle = sphereA > 0 ? '#f2f2ed' : PAPER; ctx.fill();
      ctx.strokeStyle = 'rgba(22,22,22,.45)'; ctx.lineWidth = 0.8 * U; ctx.stroke();
      if (w < 6e6) {
        ctx.beginPath(); draw(L.states); ctx.strokeStyle = 'rgba(22,22,22,.22)'; ctx.lineWidth = 0.8 * U;
        ctx.setLineDash([4 * U, 3 * U]); ctx.stroke(); ctx.setLineDash([]);
      }
    }
    if (hi && w < 1.6e6) {
      const cA = clamp01((1.6e6 - w) / 0.8e6);
      ctx.globalAlpha = alpha * cA;
      ctx.beginPath(); draw(GEO.ctx.rivers); ctx.strokeStyle = 'rgba(70,110,150,.5)'; ctx.lineWidth = 1.1 * U; ctx.stroke();
      if (w < 700e3) { ctx.beginPath(); draw(GEO.ctx.secondary); ctx.strokeStyle = 'rgba(22,22,22,.13)'; ctx.lineWidth = 0.8 * U; ctx.stroke(); }
      ctx.beginPath(); draw(GEO.ctx.major); ctx.strokeStyle = 'rgba(22,22,22,.3)'; ctx.lineWidth = 1.3 * U; ctx.stroke();
      ctx.globalAlpha = alpha;
    }
    ctx.beginPath(); draw(L.borders); ctx.strokeStyle = 'rgba(22,22,22,.32)'; ctx.lineWidth = 0.8 * U; ctx.stroke();
    ctx.beginPath(); draw(L.coast); if (hi) draw(jpFine ? L.jp10coast : L.coastJp);
    ctx.strokeStyle = 'rgba(22,22,22,.6)'; ctx.lineWidth = 0.9 * U; ctx.stroke();
    if (sphereA > 0) {
      ctx.globalAlpha = alpha * sphereA;
      ctx.beginPath(); path({ type: 'Sphere' }); ctx.strokeStyle = 'rgba(22,22,22,.45)'; ctx.lineWidth = 1 * U; ctx.stroke();
    }
    ctx.restore();
  }

  // project a geographic point; null if it is on the far side of the globe
  const P = p => visibleGeo(p) ? projection(p) : null;

  function strokeGeoPath(fn, f0, f1, n) {
    let open = false;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const p = P(fn(f0 + (f1 - f0) * i / n));
      if (!p) { open = false; continue; }
      open ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); open = true;
    }
    ctx.stroke();
  }

  function drawRoutes(now, alpha) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.lineCap = 'round';
    for (const r of ROUTES) {
      const p = S.routes[r.key];
      if (p <= 0) continue;
      ctx.strokeStyle = RUST; ctx.lineWidth = 2.2 * U;
      strokeGeoPath(ROUTE_PATH[r.key], 0, p, 96);
    }
    // learners: thin arcs out of Nagasaki
    if (S.learners > 0) {
      const N = LEARNERS.length;
      LEARNERS.forEach((pt, i) => {
        const start = (i / N) * 0.7, local = clamp01((S.learners - start) / 0.3);
        if (local <= 0) return;
        ctx.strokeStyle = 'rgba(156,66,60,.22)'; ctx.lineWidth = 0.9 * U;
        strokeGeoPath(LEARNER_PATH[i], 0, local, 40);
        if (local >= 1) {
          const q = P(pt); if (!q) return;
          const pulse = (now / 1000 + i * 0.37) % 2.4;
          ctx.fillStyle = RUST; ctx.beginPath(); ctx.arc(q[0], q[1], 2.6 * U, 0, Math.PI * 2); ctx.fill();
          if (pulse < 1.2) { ctx.strokeStyle = `rgba(156,66,60,${0.5 * (1 - pulse / 1.2)})`; ctx.beginPath(); ctx.arc(q[0], q[1], (3 + pulse * 10) * U, 0, Math.PI * 2); ctx.stroke(); }
        }
      });
    }
    // the case in transit
    if (S.packet) {
      const q = P(ROUTE_PATH[S.packet.key](S.packet.f));
      if (q) {
        const pulse = (now / 700) % 1;
        ctx.fillStyle = 'rgba(156,66,60,.18)'; ctx.beginPath(); ctx.arc(q[0], q[1], (10 + pulse * 14) * U, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = RUST; ctx.strokeStyle = PAPER; ctx.lineWidth = 2 * U;
        ctx.beginPath(); ctx.rect(q[0] - 7 * U, q[1] - 3.5 * U, 14 * U, 7 * U); ctx.fill(); ctx.stroke();
      }
    }
    ctx.restore();
  }

  function sitesToShow() {
    const shown = new Set(['community']);
    ROUTES.forEach(r => { if (S.routes[r.key] >= 1 || (S.packet && S.packet.key === r.key && S.packet.f > 0.85)) { shown.add(r.a); shown.add(r.b); } });
    return shown;
  }

  function drawSites(now, alpha) {
    const shown = sitesToShow(), placed = [];
    const order = [current.at, 'community', 'cincinnati', 'columbus', 'pittsburgh', 'nagasaki'].filter((v, i, a) => v && a.indexOf(v) === i);
    ctx.save();
    for (const key of order) {
      if (!shown.has(key)) continue;
      const s = SITES[key], q = P(geo(s));
      if (!q) continue;
      const here = key === current.at;
      let a = alpha;
      if (S.packet && ROUTES.find(r => r.key === S.packet.key).b === key) a *= clamp01((S.packet.f - 0.85) / 0.15);
      ctx.globalAlpha = a;
      if (here) {
        const pulse = (now / 1000) % 2;
        if (pulse < 1.4) { ctx.strokeStyle = `rgba(156,66,60,${0.6 * (1 - pulse / 1.4)})`; ctx.lineWidth = 1.5 * U; ctx.beginPath(); ctx.arc(q[0], q[1], (6 + pulse * 16) * U, 0, Math.PI * 2); ctx.stroke(); }
      }
      ctx.fillStyle = here ? RUST : INK; ctx.strokeStyle = PAPER; ctx.lineWidth = 2 * U;
      ctx.beginPath(); ctx.arc(q[0], q[1], (here ? 5 : 4) * U, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      const text = s.name.toUpperCase();
      ctx.font = font(here ? 14 : 12, here ? 800 : 600); track(0.14);
      const tw = ctx.measureText(text).width, lx = q[0] + 12 * U, ly = q[1] - 12 * U;
      const box = [lx - 4 * U, ly - 11 * U, tw + 8 * U, 22 * U];
      if (placed.some(b => !(box[0] > b[0] + b[2] || box[0] + box[2] < b[0] || box[1] > b[1] + b[3] || box[1] + box[3] < b[1]))) continue;
      placed.push(box);
      ctx.fillStyle = 'rgba(250,250,248,.85)'; ctx.fillRect(...box);
      ctx.fillStyle = INK; ctx.textBaseline = 'middle'; ctx.fillText(text, lx, ly + 1.5 * U);
    }
    track(0);
    ctx.restore();
    return placed;
  }

  // Water, set the way printed maps set it: italic serif, blue, letter-spaced.
  const WATER = [
    { name: 'Ohio River', lon: -83.95, lat: 38.66, size: 13, min: 90e3, max: 900e3 },
    { name: 'Lake Erie', lon: -81.4, lat: 42.15, size: 15, min: 150e3, max: 2.5e6, track: 0.12 },
    { name: 'Lake Michigan', lon: -87.1, lat: 43.6, size: 15, min: 300e3, max: 2.5e6, track: 0.12 },
    { name: 'East China Sea', lon: 127.9, lat: 32.15, size: 16, min: 300e3, max: 6e6, track: 0.16 },
    { name: 'Sea of Japan', lon: 133.8, lat: 39.5, size: 16, min: 900e3, max: 9e6, track: 0.16 },
    { name: 'Pacific Ocean', lon: -165, lat: 32, size: 20, min: 4e6, max: 1e9, track: 0.3 },
  ];
  function drawWater(alpha) {
    const w = S.cam.w;
    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#47698c';
    for (const l of WATER) {
      const a = alpha * Math.min(clamp01(lg(w / l.min) / 0.25), clamp01(lg(l.max / w) / 0.25));
      if (a <= 0) continue;
      const q = P([l.lon, l.lat]); if (!q) continue;
      ctx.globalAlpha = a * 0.85; ctx.font = font(l.size, 400, 'serif'); track(l.track || 0.06);
      ctx.fillText(l.name, q[0], q[1]);
    }
    track(0); ctx.restore();
  }

  // Reference cities, the way a web map labels them: smaller and greyer than the sites.
  const SITE_CITIES = { Cincinnati: 'cincinnati', Columbus: 'columbus', Pittsburgh: 'pittsburgh', Nagasaki: 'nagasaki' };
  function drawPlaces(placed, alpha) {
    const w = S.cam.w;
    if (!GEO.ready || w > 1.4e6) return;
    const minPop = w < 500e3 ? 0 : w < 900e3 ? 300e3 : 1.2e6;
    const shown = sitesToShow();
    const a = alpha * clamp01((1.4e6 - w) / 0.6e6) * clamp01(lg(w / 20e3));
    if (a <= 0) return;
    const siteDots = [...shown].map(k => P(geo(SITES[k]))).filter(Boolean);
    ctx.save(); ctx.globalAlpha = a; ctx.font = font(12.5, 500); ctx.textBaseline = 'middle';
    const list = GEO.ctx.places.filter(p => p[3] >= minPop && !shown.has(SITE_CITIES[p[0]])).sort((x, y) => y[3] - x[3]);
    for (const [name, lon, lat] of list) {
      const q = P([lon, lat]);
      if (!q || q[0] < 0 || q[0] > W || q[1] < 0 || q[1] > H) continue;
      if (siteDots.some(d => Math.hypot(d[0] - q[0], d[1] - q[1]) < 30 * U)) continue;
      const tw = ctx.measureText(name).width, box = [q[0] + 6 * U, q[1] - 9 * U, tw + 8 * U, 18 * U];
      if (placed.some(b => !(box[0] > b[0] + b[2] || box[0] + box[2] < b[0] || box[1] > b[1] + b[3] || box[1] + box[3] < b[1]))) continue;
      placed.push(box);
      ctx.fillStyle = 'rgba(22,22,22,.5)'; ctx.beginPath(); ctx.arc(q[0], q[1], 2.2 * U, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(22,22,22,.55)'; ctx.fillText(name, q[0] + 9 * U, q[1] + 1 * U);
    }
    ctx.restore();
  }

  function render(now) {
    frameNo++;
    ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
    if (S.spin) { S.cam.lon = S.spinLon - (now - S.spinFrom) / 1000 * 3; }
    setProjection();
    const w = S.cam.w, k = W / w;
    const lab = geo(C), labVis = d3.geoDistance(center(), lab) < 0.5;
    const L0 = labVis ? projection(lab) : null;
    const gridA = 1 - clamp01(lg(w / 3e3));
    if (gridA > 0 && L0) drawGrid(L0[0], L0[1], k, gridA);
    const mapA = clamp01(lg(w / 1500));
    if (mapA > 0) { drawMap(mapA); drawWater(mapA); }
    if (w < 60 && L0) drawMicro(L0[0], L0[1], k);
    const siteA = clamp01(lg(w / 0.4));
    if (siteA > 0) { drawRoutes(now, siteA); const placed = drawSites(now, siteA); drawPlaces(placed, mapA); }
    pumpTiles();
    updateHUD();
  }

  // ---------- HUD ----------
  const hud = { scale: $('#scale'), bar: $('#scale-bar'), label: $('#scale-label'), mag: $('#scale-mag'), coords: $('#coords'), route: $('#route') };
  let hudText = '';
  function fmtLen(m) {
    if (m < 1e-3) return `${Math.round(m * 1e6)} µm`;
    if (m < 1e-2) return `${+(m * 1e3).toPrecision(2)} mm`;
    if (m < 1) return `${+(m * 100).toPrecision(2)} cm`;
    if (m < 1000) return `${Math.round(m)} m`;
    return `${Math.round(m / 1000).toLocaleString()} km`;
  }
  function updateHUD() {
    const w = S.cam.w, target = w * 0.1, base = Math.pow(10, Math.floor(lg(target))), m = target / base;
    const nice = (m >= 5 ? 5 : m >= 2 ? 2 : 1) * base;
    hud.bar.style.width = (nice / w * 100) + 'cqw';
    const mag = w < 0.03 ? 40 * 0.00045 / w : 0;
    const magText = mag >= 0.5 ? (mag >= 9.5 ? Math.round(mag) : mag.toFixed(1)) + '×' : '';
    const lat = S.cam.lat, lon = ((S.cam.lon + 540) % 360) - 180;
    const coord = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}  ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`;
    const text = fmtLen(nice) + '|' + magText + '|' + coord;
    if (text !== hudText) { hudText = text; hud.label.textContent = fmtLen(nice); hud.mag.textContent = magText; hud.coords.textContent = coord; }
    if (S.packet) {
      const r = ROUTES.find(r => r.key === S.packet.key);
      const el = $('[data-km]', $('#' + current.slide));
      if (el) el.textContent = Math.round(r.km * S.packet.f).toLocaleString();
    }
  }

  // ---------- tweens ----------
  const running = [];
  function tween(delay, dur, fn, done) {
    if (RM) { fn(1); done && done(); return; }
    running.push({ t0: performance.now() + delay, dur: Math.max(1, dur), fn, done });
  }
  function tick(now) {
    for (const a of running.slice()) {
      if (now < a.t0) continue;
      const t = clamp01((now - a.t0) / a.dur);
      a.fn(t);
      if (t >= 1) { running.splice(running.indexOf(a), 1); a.done && a.done(); }
    }
  }
  function finishAll() { while (running.length) { const a = running.shift(); a.fn(1); a.done && a.done(); } }

  // van Wijk & Nuij smooth zoom in one dimension. Same maths as d3.interpolateZoom,
  // but written with asinh so it stays finite when the widths differ by 10^11
  // (d3's log(sqrt(b*b+1) - b) underflows to log(0) at those ratios).
  function smoothZoom(d, w0, w1, rho) {
    const r2 = rho * rho;
    if (d < 1e-9) { const S = Math.log(w1 / w0) / rho; return t => [0, w0 * Math.exp(rho * t * S)]; }
    const b0 = (w1 * w1 - w0 * w0 + r2 * r2 * d * d) / (2 * w0 * r2 * d);
    const b1 = (w1 * w1 - w0 * w0 - r2 * r2 * d * d) / (2 * w1 * r2 * d);
    const r0 = -Math.asinh(b0), r1 = -Math.asinh(b1), S = (r1 - r0) / rho;
    const ch = Math.cosh(r0), sh = Math.sinh(r0);
    return t => {
      const q = rho * t * S + r0;
      return [w0 / (r2 * d) * (ch * Math.tanh(q) - sh) * d, w0 * ch / Math.cosh(q)];
    };
  }

  // A camera move: van Wijk & Nuij smooth zoom (what d3.zoom and web maps use),
  // run along a great circle, so it reads as zoom out, travel, zoom in.
  function flight(to, dur, opts = {}) {
    const from = { ...S.cam };
    const a = [from.lon, from.lat], b = [to.lon, to.lat];
    const d = d3.geoDistance(a, b) * R;
    const zi = smoothZoom(d, from.w, to.w, opts.rho || 1.4);
    const gi = d3.geoInterpolate(a, b);
    tween(opts.delay || 0, dur, t => {
      const e = (opts.ease || ease)(t), [x, w] = zi(e);
      const f = d > 1e-9 ? Math.min(1, Math.max(0, x / d)) : e, [lon, lat] = gi(f);
      S.cam = { lon, lat, w };
      opts.onStep && opts.onStep(f, e);
    }, opts.done);
  }

  // Zoom a DOM element out from one of its children, scaling about a fixed point.
  function domZoom(frame, focus, dur, delay = 0, onDone) {
    frame.style.transform = 'none';
    const d = deck.getBoundingClientRect(), fr = frame.getBoundingClientRect(), t = focus.getBoundingClientRect();
    const s0 = Math.max(d.width / t.width, d.height / t.height);
    const dc = [d.left + d.width / 2, d.top + d.height / 2], tc = [t.left + t.width / 2, t.top + t.height / 2];
    const Fp = [(dc[0] - tc[0] * s0) / (1 - s0), (dc[1] - tc[1] * s0) / (1 - s0)];
    const set = z => {
      const s = Math.pow(s0, 1 - z);
      frame.style.transform = `translate(${(Fp[0] - fr.left) * (1 - s)}px, ${(Fp[1] - fr.top) * (1 - s)}px) scale(${s})`;
    };
    set(0);
    tween(delay, dur, t => set(d3.easeCubicInOut(t)), () => { frame.style.transform = 'none'; onDone && onDone(); });
  }

  // ---------- DOM helpers ----------
  function paintThumbs() {
    if (ready(TEX.field40) && ready(TEX.sprite)) buildCohort();
  }
  [TEX.field40, TEX.sprite].forEach(im => im.addEventListener('load', paintThumbs));
  // The collection: crops of the stand-in slide, one of them the case.
  function buildCohort() {
    const grid = $('#cohort-grid'); grid.innerHTML = '';
    const cols = 18, rows = 12, r = d3.randomLcg(42), caseIndex = 6 * cols + 9;
    const matches = new Set();
    while (matches.size < 17) { const i = Math.floor(r() * cols * rows); if (i !== caseIndex) matches.add(i); }
    for (let i = 0; i < cols * rows; i++) {
      const c = document.createElement('canvas'); c.width = 128; c.height = 96;
      const g = c.getContext('2d');
      if (i === caseIndex) {
        const f = TEX.field40;
        g.drawImage(f, f.naturalWidth * 0.3, f.naturalHeight * 0.15, f.naturalWidth * 0.5, f.naturalHeight * 0.667, 0, 0, 128, 96);
        c.className = 'is-case';
      } else {
        const cell = Math.floor(r() * 48), sx = (cell % 8) * 256, sy = Math.floor(cell / 8) * 192;
        g.filter = `hue-rotate(${(r() - 0.5) * 24}deg) saturate(${0.75 + r() * 0.5}) brightness(${0.94 + r() * 0.12})`;
        if (r() < 0.5) { g.translate(128, 96); g.rotate(Math.PI); }
        g.drawImage(TEX.sprite, sx, sy, 256, 192, 0, 0, 128, 96);
        if (matches.has(i)) c.className = 'is-match';
      }
      grid.appendChild(c);
    }
  }

  // ---------- slide viewers (OpenSeadragon) ----------
  // The same tile pyramid, as a live viewer: in the Cincinnati workspace, and
  // full screen on any tissue view with V.
  const fieldRect = (wMm, aspect) => {
    const T = TISSUE, wPx = wMm / T.MPP, hPx = wPx / aspect;
    const cx = T.CENTRE.x - T.CROP.x, cy = T.CENTRE.y - T.CROP.y;
    return new OpenSeadragon.Rect((cx - wPx / 2) / T.CROP.w, (cy - hPx / 2) / T.CROP.w, wPx / T.CROP.w, hPx / T.CROP.w);
  };
  function makeViewer(el, onReady) {
    const v = OpenSeadragon({
      element: el, tileSources: TISSUE.dzi, drawer: 'canvas', prefixUrl: '',
      showNavigationControl: false, showNavigator: false, animationTime: 0.6, springStiffness: 7,
      maxZoomPixelRatio: 2, visibilityRatio: 0.5, constrainDuringPan: true, immediateRender: true,
      gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true },
    });
    v.addOnceHandler('open', () => onReady && onReady(v));
    return v;
  }
  let wsViewer = null;
  function initWorkspaceViewer() {
    if (wsViewer) return;
    const el = $('#ws-viewer');
    wsViewer = makeViewer(el, v => {
      const r = el.getBoundingClientRect();
      v.viewport.fitBounds(fieldRect(0.6, r.width / r.height), true);
      v.addOnceHandler('tile-drawn', () => el.classList.add('is-live'));
    });
  }
  const rv = { el: $('#reviewer'), viewer: null };
  function rvMag() {
    if (!rv.viewer || !rv.viewer.world.getItemAt(0)) return;
    // same definition as the deck's readout: 40x when the screen spans 0.45 mm
    const wMm = rv.viewer.viewport.getBounds(true).width * TISSUE.CROP.w * TISSUE.MPP, m = 40 * 0.45 / wMm;
    $('#rv-mag').textContent = `${m.toFixed(m >= 9.5 ? 0 : 1)}×`;
  }
  function openReviewer() {
    finishAll();
    rv.el.hidden = false;
    const fit = v => {
      const r = $('#rv-view').getBoundingClientRect();
      if (S.cam.w < 0.02) v.viewport.fitBounds(fieldRect(S.cam.w * 1000, r.width / r.height), true);
      else v.viewport.goHome(true);
      rvMag();
    };
    if (!rv.viewer) {
      rv.viewer = makeViewer($('#rv-view'), fit);
      rv.viewer.addHandler('animation', rvMag);
    } else fit(rv.viewer);
    setTimeout(() => rv.viewer.canvas && rv.viewer.canvas.focus(), 50);
  }
  function closeReviewer() { rv.el.hidden = true; deck.focus && deck.focus(); }
  rv.el.addEventListener('click', e => {
    e.stopPropagation();
    const b = e.target.closest('[data-rv]'); if (!b || !rv.viewer) return;
    const vp = rv.viewer.viewport, a = b.dataset.rv;
    if (a === 'in') vp.zoomBy(1.6); else if (a === 'out') vp.zoomBy(1 / 1.6); else if (a === 'home') vp.goHome(); else if (a === 'close') closeReviewer();
    vp.applyConstraints();
  });
  $('#rv-open').addEventListener('click', e => { e.stopPropagation(); openReviewer(); });

  function drawQRs() {
    $$('[data-qr]').forEach(el => {
      const url = el.dataset.qr === 'poll' ? CONFIG.pollUrl : CONFIG.moduleUrl;
      if (!url) return;
      const q = qrcode(0, 'M'); q.addData(url); q.make();
      el.classList.remove('ph'); el.innerHTML = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    });
  }
  function setBars(t) { $$('#s-arrival [data-bar]').forEach(el => { el.style.width = (+el.dataset.bar * t) + '%'; }); }
  // The title as a map cartouche: the frame and title settle, the compass needle
  // swings and comes to rest on north, the scale bar fills, the coordinates count in.
  const fmtCoord = (lat, lon) => `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'} · ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`;
  const dms = (v, pos, neg) => { const a = Math.abs(v), d = Math.floor(a), m = Math.floor((a - d) * 60), sec = Math.round(((a - d) * 60 - m) * 60); return `${d}°${String(m).padStart(2, '0')}′${String(sec).padStart(2, '0')}″ ${v >= 0 ? pos : neg}`; };
  $('[data-corner="lat"]').textContent = dms(C.lat, 'N', 'S');
  $('[data-corner="lon"]').textContent = dms(C.lon, 'E', 'W');
  function setTitle(t) {
    const word = $('#title-word'), sub = $('#s-title .title-sub'), legend = $('#s-title .carto-legend'), frame = $('#cartouche');
    const e1 = d3.easeCubicOut(clamp01(t / 0.55));
    frame.style.opacity = clamp01(t / 0.2);
    word.style.opacity = e1; word.style.letterSpacing = `${0.32 - 0.355 * e1}em`;
    sub.style.opacity = clamp01((t - 0.35) / 0.25);
    legend.style.opacity = clamp01((t - 0.25) / 0.2);
    const tn = clamp01((t - 0.25) / 0.75);
    const angle = tn >= 1 ? 0 : 80 * Math.exp(-4.2 * tn) * Math.cos(11 * tn);
    $('#needle').setAttribute('transform', `rotate(${angle.toFixed(2)})`);
    $$('#sbar span').forEach((el, i) => el.classList.toggle('on', t >= 0.4 + i * 0.1));
    const ec = d3.easeCubicOut(clamp01((t - 0.3) / 0.6));
    $('#title-coord').textContent = fmtCoord(C.lat * ec, C.lon * ec);
  }

  // ---------- steps ----------
  // Each step is a final state. `enter` animates into it when moving forward.
  const send = (key, view, dur, rho) => () => {
    S.routes[key] = 0; S.packet = { key, f: 0 };
    flight(VIEWS[view], dur, { rho, onStep: f => { S.packet.f = f; S.routes[key] = f; }, done: () => { S.packet = null; S.routes[key] = 1; } });
  };
  const STEPS = [
    { slide: 's-title', veil: 0.9, view: 'lab40', enter: () => { setTitle(0); tween(300, 3200, setTitle); } },
    { slide: 's-disclosures', veil: 1, view: 'lab40' },
    { slide: 's-case', veil: 0, view: 'lab40', at: 'community', scale: true, marks: ['community'], captionDelay: 2400,
      enter: () => { S.cam = { ...VIEWS.lab4 }; S.marks.community = 0; flight(VIEWS.lab40, 3000, { rho: 1 }); tween(2700, 900, t => { S.marks.community = t; }); } },
    { slide: 's-vote1', stage: 0, veil: 0, view: 'lab40', at: 'community', scale: true, marks: ['community'] },
    { slide: 's-vote1', stage: 1, veil: 0, view: 'lab40', at: 'community', scale: true, marks: ['community'] },
    { slide: 's-zoom1', veil: 0, view: 'ohio', at: 'community', scale: true,
      enter: () => flight(VIEWS.ohio, 7500, { rho: 1.6, ease: d3.easeSinInOut }) },
    { slide: 's-send1', veil: 0, view: 'cincinnati', at: 'cincinnati', scale: true, route: 'r1', enter: send('r1', 'cincinnati', 3800, 1.3) },
    { slide: 's-card1', veil: 0, view: 'cincinnati', at: 'cincinnati', scale: true },
    { slide: 's-workspace', veil: 1, at: 'cincinnati',
      enter: () => { const h = $('#s-workspace .ws-heading'); h.style.opacity = 0; domZoom($('#s-workspace .ws-frame'), $('#s-workspace .t-slide'), 2200, 500, initWorkspaceViewer); tween(2500, 600, t => { h.style.opacity = t; h.style.transform = 'none'; }); } },
    { slide: 's-diff', stage: 0, veil: 1, at: 'cincinnati' },
    { slide: 's-diff', stage: 1, veil: 1, at: 'cincinnati' },
    { slide: 's-send2', veil: 0, view: 'columbus', at: 'columbus', scale: true, route: 'r2', enter: send('r2', 'columbus', 3800, 1.4) },
    { slide: 's-card2', veil: 0, view: 'columbus', at: 'columbus', scale: true },
    { slide: 's-arrival', veil: 1, at: 'columbus', enter: () => { setBars(0); tween(700, 1600, t => setBars(d3.easeCubicOut(t))); } },
    { slide: 's-finding', veil: 1, at: 'columbus' },
    { slide: 's-send3', veil: 0, view: 'pittsburgh', at: 'pittsburgh', scale: true, route: 'r3', enter: send('r3', 'pittsburgh', 3800, 1.4) },
    { slide: 's-card3', veil: 0, view: 'pittsburgh', at: 'pittsburgh', scale: true },
    { slide: 's-cohort', stage: 0, veil: 1, at: 'pittsburgh', enter: () => { const g = $('#cohort-grid'); g.classList.remove('is-settled'); domZoom(g, $('.is-case', g), 2600, 400, () => g.classList.add('is-settled')); } },
    { slide: 's-cohort', stage: 1, veil: 1, at: 'pittsburgh' },
    { slide: 's-ai', veil: 1, at: 'pittsburgh' },
    { slide: 's-send4', veil: 0, view: 'nagasaki', at: 'nagasaki', scale: true, route: 'r4', enter: send('r4', 'nagasaki', 9000, 1.5) },
    { slide: 's-card4', veil: 0, view: 'nagasaki', at: 'nagasaki', scale: true },
    { slide: 's-teach', veil: 1, at: 'nagasaki' },
    { slide: 's-world', veil: 0, view: 'globe', at: 'nagasaki', scale: true, learners: true,
      enter: () => { S.spin = false; S.learners = 0; flight(VIEWS.globe, 4200, { rho: 1.3, done: startSpin }); tween(3200, 5000, t => { S.learners = t; }); countTotal(); } },
    { slide: 's-vote2', veil: 0.94, view: 'globe', at: 'nagasaki', learners: true },
    { slide: 's-compare', veil: 0.94, view: 'globe', at: 'nagasaki', learners: true },
    { slide: 's-home', veil: 0, view: 'lab40', at: 'community', home: true, scale: true, marks: ['community', 'cincinnati', 'columbus', 'pittsburgh', 'nagasaki'], captionDelay: 9800,
      enter: () => {
        S.spin = false;
        Object.keys(MARKS).forEach(k => { S.marks[k] = k === 'community' ? 1 : 0; });
        flight(VIEWS.lab40, 10000, { rho: 1.5 });
        ['cincinnati', 'columbus', 'pittsburgh', 'nagasaki'].forEach((k, i) => tween(10200 + i * 900, 900, t => { S.marks[k] = t; }));
      } },
    { slide: 's-final', veil: 0, view: 'lab40', at: 'community', home: true, scale: true, marks: ['community', 'cincinnati', 'columbus', 'pittsburgh', 'nagasaki'] },
    { slide: 's-history', veil: 1, view: 'globe' },
    { slide: 's-status', veil: 1, view: 'globe' },
    { slide: 's-panel', veil: 1, view: 'globe' },
    { slide: 's-close', veil: 0.9, view: 'globe', learners: true },
    { slide: 's-b1', veil: 1, view: 'globe' },
    { slide: 's-b2', veil: 1, view: 'globe' },
    { slide: 's-b3', veil: 1, view: 'globe' },
  ];
  // inherit the camera from the previous step, and collect finished routes
  STEPS.forEach((s, i) => {
    s.view = s.view || STEPS[i - 1].view;
    s.routesDone = new Set(STEPS.slice(0, i + 1).filter(x => x.route).map(x => x.route));
    if (s.home || i > STEPS.findIndex(x => x.slide === 's-send4')) ROUTES.forEach(r => s.routesDone.add(r.key));
  });

  function startSpin() { S.spin = true; S.spinFrom = performance.now(); S.spinLon = S.cam.lon; }
  function countTotal() { const el = $('[data-total-km]'); tween(500, 2500, t => { el.textContent = Math.round(TOTAL_KM * d3.easeCubicOut(t)).toLocaleString(); }); }

  let index = 0, current = STEPS[0];
  function applyState(st) {
    const keepSpin = st.view === 'globe' && S.spin;
    if (!keepSpin) { S.cam = { ...VIEWS[st.view] }; S.spin = false; if (st.view === 'globe') startSpin(); }
    ROUTES.forEach(r => { S.routes[r.key] = st.routesDone.has(r.key) ? 1 : 0; });
    S.packet = null;
    S.marks = {}; (st.marks || []).forEach(k => { S.marks[k] = 1; });
    S.learners = st.learners ? 1 : 0;
    document.documentElement.style.setProperty('--veil', st.veil);
    hud.scale.classList.toggle('is-on', !!st.scale);
    hud.route.classList.toggle('is-on', !!st.at && st.veil < 0.5);
    const order = ['community', 'cincinnati', 'columbus', 'pittsburgh', 'nagasaki'];
    const hereIdx = st.home ? 5 : order.indexOf(st.at);
    $$('span', hud.route).forEach((el, i) => {
      el.classList.toggle('is-done', i < hereIdx || !!st.home);
      el.classList.toggle('is-here', st.home ? i === 0 : i === hereIdx);
    });
    // finished DOM states
    setBars(1); setTitle(1);
    $('#cohort-stage').classList.toggle('is-filtered', st.slide === 's-cohort' && st.stage === 1);
    $('[data-total-km]').textContent = Math.round(TOTAL_KM).toLocaleString();
    $$('[data-km]').forEach(el => { const s = el.closest('.slide').id.slice(-1); const r = ROUTES[+s - 1]; if (r) el.textContent = Math.round(r.km).toLocaleString(); });
    $$('.ws-frame, #cohort-grid').forEach(el => { el.style.transform = 'none'; });
    $('#cohort-grid').classList.add('is-settled');
    $$('.slide.is-waiting').forEach(el => el.classList.remove('is-waiting'));
    const h = $('#s-workspace .ws-heading'); h.style.opacity = 1; h.style.transform = 'none';
    if (st.slide === 's-workspace') initWorkspaceViewer();
    $('#rv-open').classList.toggle('is-on', st.view === 'lab40' && st.veil < 0.5);
  }

  function show(st) {
    $$('.slide').forEach(el => el.classList.toggle('is-active', el.id === st.slide));
    const el = $('#' + st.slide);
    if (st.stage !== undefined) el.dataset.stage = st.stage;
  }

  function go(i, animate) {
    i = Math.max(0, Math.min(STEPS.length - 1, i));
    finishAll();
    const prev = current, fromCam = { ...S.cam };
    index = i; current = STEPS[i];
    show(current);
    applyState(current);
    // an animation plays only when stepping forward into a new state, and starts
    // from wherever the camera was
    if (animate && current.enter && !(prev.slide === current.slide && prev.stage === current.stage)) {
      S.cam = fromCam; current.enter();
      if (current.captionDelay && !RM) { const el = $('#' + current.slide); el.classList.add('is-waiting'); tween(current.captionDelay, 1, () => {}, () => el.classList.remove('is-waiting')); }
    }
    history.replaceState(null, '', '#' + (i + 1));
  }
  function next() { if (running.length) { finishAll(); return; } if (index < STEPS.length - 1) go(index + 1, true); }
  function prev() { if (running.length) finishAll(); go(index - 1, false); }

  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (!rv.el.hidden) {
      if (e.key === 'Escape' || e.key === 'v' || e.key === 'V') { e.preventDefault(); closeReviewer(); }
      return;                                   // everything else belongs to the viewer
    }
    if (e.key === 'v' || e.key === 'V') { openReviewer(); return; }
    if (e.key.startsWith('Arrow') && e.target.closest && e.target.closest('.ws-osd')) return;  // panning the workspace viewer
    if (['ArrowRight', 'PageDown', ' ', 'Enter', 'ArrowDown'].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace', 'ArrowUp'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') go(0, false);
    else if (e.key === 'End') go(STEPS.length - 1, false);
    else if (e.key === 'f' || e.key === 'F') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
  });
  deck.addEventListener('click', e => { if (!e.target.closest('a, .ws-osd, #reviewer, #rv-open')) next(); });
  let touchX = null;
  deck.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  deck.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX; touchX = null;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  });

  // ---------- start ----------
  Promise.all(['400 20px "Overpass"', '400 20px "Overpass Mono"'].map(f => document.fonts.load(f))).then(() => { TEX.glass = TISSUE.glass(); }).catch(() => {});
  window.addEventListener('resize', resize);
  resize();
  prefetchOpening();
  paintThumbs();
  drawQRs();
  const start = parseInt(location.hash.slice(1), 10);
  go(Number.isFinite(start) ? start - 1 : 0, !Number.isFinite(start));
  (function loop(now) { tick(now); render(now); requestAnimationFrame(loop); })(performance.now());

  window.DECK = { go: i => go(i, true), STEPS, S, VIEWS };
})();
