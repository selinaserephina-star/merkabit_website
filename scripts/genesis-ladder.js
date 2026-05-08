// Static Genesis ladder — single-glance reference map.
// Mirrors the executive 11/12-rung view: rungs read 1 (bottom) → 11 (top),
// with rung 12 as a satellite next to 11. Side annotations:
//   left bracket  — BINARY ARCHITECTURE (rungs 1–7, approaches 4/3)
//   top bracket   — TERNARY SCALING (rungs 9–12, overshoot → 1.0)
//   rung 8 box    — THE PHASE TRANSITION
//   right stack   — 1/3 → 4/3 → 137 with operators
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('ladder');
  if (!svg) return;

  // Layout constants
  const W = 1100, H = 1740;
  const AXIS_X = 540;          // center vertical axis
  const NUM_R = 22;
  const ROW_H = 110;
  const TOP = 150;
  const ROWS = 11;             // visible rungs
  const PHASE_BOX_PAD = 22;

  const COL = {
    bg: '#0A0F1F',
    line: 'rgba(245,240,230,0.10)',
    lineStrong: 'rgba(245,240,230,0.22)',
    ink: '#F5F0E6',
    inkMid: 'rgba(245,240,230,0.78)',
    inkDim: 'rgba(245,240,230,0.55)',
    inkFaint: 'rgba(245,240,230,0.35)',
    gold: '#D4AF37',
    copper: '#B87333',
    confirmed: '#6FB78A',
    refuted: '#C56B5C',
  };

  // Rung palette — color-codes echo the supplied diagram, retoned to fit the dark indigo system.
  const RUNGS = [
    { n: 1,  name: 'ENTANGLEMENT',     sub: 'The First Lock · 4/3',           glyph: 'venn',     formula: 'S̄ = 4/3',                color: '#D4AF37' },
    { n: 2,  name: 'Z₃',               sub: 'The Trit · {+1, 0, −1}',          glyph: 'trit',     formula: '|+1⟩  |0⟩  |−1⟩',         color: '#5DBFC9' },
    { n: 3,  name: 'EISENSTEIN LATTICE',sub: 'Space · ℤ[ω]',                    glyph: 'lattice',  formula: 'ω = e^{2πi/3}',          color: '#5B8DD9' },
    { n: 4,  name: 'TRIANGLES',        sub: 'First Loop · Circulation',         glyph: 'triangle', formula: 'Z₃ as topology',         color: '#7BC685' },
    { n: 5,  name: 'TETRAHEDRA',       sub: 'Volume · A₄',                      glyph: 'tetra',    formula: 'A₄ → 12 rotations',      color: '#D17A38' },
    { n: 6,  name: 'COUNTER-TETRA',    sub: 'Duality · Stella Octangula',       glyph: 'stella',   formula: 'Forward ⊕ Inverse',      color: '#A06FD9' },
    { n: 7,  name: 'PENTACHORON',      sub: '4D · 5 Gates · No Scaling',        glyph: 'k5',       formula: 'S  R  T  P  F',          color: '#D9579A' },
    { n: 8,  name: 'DUAL PENTACHORON', sub: '168 = |PSL(2,7)| total · 31 binary-accessible · 137 ternary-essential',
             glyph: 'fano',  formula: '4 fwd + 4 inv = 8 = 2³',                                               color: '#E04F4F', highlight: true,
             tag: 'THE PHASE TRANSITION', tagRight: 'CUBE → SCALING BEGINS' },
    { n: 9,  name: 'HONEYCOMB',        sub: 'Tiled Space · Hexagonal',          glyph: 'honeycomb',formula: 'Hexagonal tiling',       color: '#5DBFC9' },
    { n: 10, name: 'TESSERACT',        sub: 'Self-Sustaining · |C|=0.47',       glyph: 'tess',     formula: 'No external drive',      color: '#D4AF37' },
    { n: 11, name: 'OUROBOROS',        sub: 'It Loops · h=12 · α⁻¹=137',        glyph: 'loop',     formula: 'h(E₆) = 12',             color: COL.ink, satellite: 12, satFormula: 'α⁻¹ = 137.036' },
  ];

  // -------- helpers -----------------------------------------------------
  const el = (tag, attrs = {}, parent = svg) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const text = (x, y, str, opts = {}, parent = svg) => {
    const t = el('text', {
      x, y,
      fill: opts.fill || COL.ink,
      'font-family': opts.mono ? 'JetBrains Mono, monospace' : (opts.serif ? 'EB Garamond, serif' : 'JetBrains Mono, monospace'),
      'font-size': opts.size || 13,
      'font-weight': opts.weight || 400,
      'text-anchor': opts.anchor || 'start',
      'letter-spacing': opts.tracking != null ? opts.tracking : 0,
      'font-style': opts.italic ? 'italic' : 'normal',
      'text-transform': opts.upper ? 'uppercase' : 'none',
    }, parent);
    t.textContent = str;
    return t;
  };

  const rowY = (n) => TOP + (ROWS - n) * ROW_H;

  // -------- glyph drawer -----------------------------------------------
  function drawGlyph(kind, cx, cy, color) {
    const g = el('g', { transform: `translate(${cx} ${cy})`, stroke: color, fill: 'none', 'stroke-width': 1.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    const s = 26;
    switch (kind) {
      case 'venn': {
        el('circle', { cx: -10, cy: 0, r: 16 }, g);
        el('circle', { cx: 10, cy: 0, r: 16 }, g);
        break;
      }
      case 'trit': {
        el('circle', { cx: -18, cy: 0, r: 3, fill: color }, g);
        el('circle', { cx: 0,   cy: 0, r: 3, fill: color }, g);
        el('circle', { cx: 18,  cy: 0, r: 3, fill: color }, g);
        break;
      }
      case 'lattice': {
        // 4×4 rhombic dot grid (Eisenstein)
        for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) {
          const x = i * 9 + j * 4.5;
          const y = j * 8;
          if (Math.abs(x) > 22 || Math.abs(y) > 18) continue;
          el('circle', { cx: x, cy: y, r: 1.6, fill: color, stroke: 'none' }, g);
        }
        break;
      }
      case 'triangle': {
        const a = 22;
        el('polygon', { points: `0,${-a} ${a*0.866},${a*0.5} ${-a*0.866},${a*0.5}` }, g);
        break;
      }
      case 'tetra': {
        const r = 22;
        const top = [0, -r], bl = [-r * 0.85, r * 0.55], br = [r * 0.85, r * 0.55], bk = [0, r * 0.18];
        const poly = (pts) => el('polygon', { points: pts.map(p => p.join(',')).join(' ') }, g);
        poly([top, bl, br]);
        el('line', { x1: top[0], y1: top[1], x2: bk[0], y2: bk[1] }, g);
        el('line', { x1: bl[0], y1: bl[1], x2: bk[0], y2: bk[1] }, g);
        el('line', { x1: br[0], y1: br[1], x2: bk[0], y2: bk[1] }, g);
        break;
      }
      case 'stella': {
        // two interpenetrating triangles (star of david motif for stella octangula 2D shadow)
        const r = 22;
        const p1 = [], p2 = [];
        for (let i = 0; i < 3; i++) {
          const a = -Math.PI / 2 + i * 2 * Math.PI / 3;
          p1.push([Math.cos(a) * r, Math.sin(a) * r]);
          p2.push([Math.cos(a + Math.PI) * r, Math.sin(a + Math.PI) * r]);
        }
        el('polygon', { points: p1.map(p => p.join(',')).join(' ') }, g);
        el('polygon', { points: p2.map(p => p.join(',')).join(' ') }, g);
        break;
      }
      case 'k5': {
        const r = 22;
        const pts = [];
        for (let i = 0; i < 5; i++) {
          const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
          pts.push([Math.cos(a) * r, Math.sin(a) * r]);
        }
        for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
          el('line', { x1: pts[i][0], y1: pts[i][1], x2: pts[j][0], y2: pts[j][1] }, g);
        }
        pts.forEach(p => el('circle', { cx: p[0], cy: p[1], r: 1.8, fill: color, stroke: 'none' }, g));
        break;
      }
      case 'fano': {
        // dual-pentachoron stylized as Fano-plane (PSL(2,7))
        const R = 22, r = 11;
        const outer = [], inner = [];
        for (let i = 0; i < 3; i++) {
          const a = -Math.PI / 2 + i * 2 * Math.PI / 3;
          outer.push([Math.cos(a) * R, Math.sin(a) * R]);
          const b = a + Math.PI / 3;
          inner.push([Math.cos(b) * r, Math.sin(b) * r]);
        }
        el('polygon', { points: outer.map(p => p.join(',')).join(' ') }, g);
        for (let i = 0; i < 3; i++) {
          el('line', { x1: outer[i][0], y1: outer[i][1], x2: inner[(i+1)%3][0], y2: inner[(i+1)%3][1] }, g);
        }
        el('circle', { cx: 0, cy: 0, r: 11 }, g);
        break;
      }
      case 'honeycomb': {
        const hex = (cx, cy, r) => {
          const pts = [];
          for (let i = 0; i < 6; i++) {
            const a = i * Math.PI / 3;
            pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
          }
          el('polygon', { points: pts.map(p => p.join(',')).join(' ') }, g);
        };
        const r = 9;
        hex(0, 0, r);
        hex(r * Math.sqrt(3), 0, r);
        hex(-r * Math.sqrt(3), 0, r);
        hex(r * Math.sqrt(3) / 2, -r * 1.5, r);
        hex(-r * Math.sqrt(3) / 2, -r * 1.5, r);
        hex(r * Math.sqrt(3) / 2, r * 1.5, r);
        hex(-r * Math.sqrt(3) / 2, r * 1.5, r);
        break;
      }
      case 'tess': {
        // tesseract: outer + inner cube + connectors
        const drawCube = (s, off) => {
          const pts = [
            [-s, -s], [s, -s], [s, s], [-s, s],
          ].map(([x, y]) => [x + off[0], y + off[1]]);
          el('polygon', { points: pts.map(p => p.join(',')).join(' ') }, g);
          return pts;
        };
        const outer = drawCube(20, [0, 0]);
        const inner = drawCube(10, [4, -4]);
        for (let i = 0; i < 4; i++) {
          el('line', { x1: outer[i][0], y1: outer[i][1], x2: inner[i][0], y2: inner[i][1] }, g);
        }
        break;
      }
      case 'loop': {
        // ouroboros: ring with arrowhead
        el('circle', { cx: 0, cy: 0, r: 18 }, g);
        // small arrowhead at top
        el('polyline', { points: '4,-20 -2,-18 1,-13' }, g);
        break;
      }
    }
  }

  // -------- background guides ------------------------------------------
  // central dotted axis
  el('line', {
    x1: AXIS_X, y1: rowY(11) - 30, x2: AXIS_X, y2: rowY(1) + 30,
    stroke: COL.line, 'stroke-width': 1, 'stroke-dasharray': '2 4',
  });

  // Phase transition box (rung 8) — frame around the whole row
  {
    const y = rowY(8);
    const boxX = 70, boxW = W - 140, boxH = 92;
    const boxY = y - boxH / 2;
    // outer red dashed frame
    el('rect', {
      x: boxX - 6, y: boxY - 6, width: boxW + 12, height: boxH + 12,
      fill: 'none', stroke: 'rgba(224,79,79,0.35)', 'stroke-width': 1, 'stroke-dasharray': '4 4',
    });
    el('rect', {
      x: boxX, y: boxY, width: boxW, height: boxH,
      fill: 'rgba(224,79,79,0.06)', stroke: '#E04F4F', 'stroke-width': 1.4,
    });
    // dashed crossbars top/bottom outside
    [-30, boxH + 30].forEach(off => {
      el('line', {
        x1: boxX + 8, y1: boxY + off, x2: boxX + boxW - 8, y2: boxY + off,
        stroke: 'rgba(224,79,79,0.25)', 'stroke-width': 0.8, 'stroke-dasharray': '2 6',
      });
    });
  }

  // -------- side annotations: brackets ---------------------------------
  // BINARY ARCHITECTURE bracket — covers rungs 1–7 (left side)
  {
    const xL = 36;
    const yT = rowY(7) - 20, yB = rowY(1) + 20;
    el('path', {
      d: `M ${xL + 14} ${yT} L ${xL} ${yT} L ${xL} ${yB} L ${xL + 14} ${yB}`,
      fill: 'none', stroke: COL.lineStrong, 'stroke-width': 1,
    });
    // arrowheads at top + bottom
    el('polyline', { points: `${xL + 4},${yT + 6} ${xL},${yT} ${xL - 4},${yT + 6}`, stroke: COL.inkDim, fill: 'none', 'stroke-width': 1 });
    el('polyline', { points: `${xL + 4},${yB - 6} ${xL},${yB} ${xL - 4},${yB - 6}`, stroke: COL.inkDim, fill: 'none', 'stroke-width': 1 });

    // label box (vertically stacked)
    const lx = xL - 28;
    const ly = (yT + yB) / 2;
    const labelG = el('g', { transform: `translate(${lx} ${ly}) rotate(-90)` });
    text(0, -10, 'BINARY ARCHITECTURE', { fill: COL.inkDim, size: 9.5, anchor: 'middle', tracking: 1.4, weight: 500 }, labelG);
    text(0, 4,  'approaches 4/3 — cannot cross', { fill: COL.inkFaint, size: 8.5, anchor: 'middle', tracking: 0.6, italic: true }, labelG);
  }

  // TERNARY SCALING bracket — covers rungs 9–12 (left side)
  {
    const xL = 36;
    const yT = rowY(11) - 30, yB = rowY(9) + 20;
    el('path', {
      d: `M ${xL + 14} ${yT} L ${xL} ${yT} L ${xL} ${yB} L ${xL + 14} ${yB}`,
      fill: 'none', stroke: COL.gold, 'stroke-width': 1, opacity: 0.55,
    });
    el('polyline', { points: `${xL + 4},${yT + 6} ${xL},${yT} ${xL - 4},${yT + 6}`, stroke: COL.gold, fill: 'none', 'stroke-width': 1 });
    el('polyline', { points: `${xL + 4},${yB - 6} ${xL},${yB} ${xL - 4},${yB - 6}`, stroke: COL.gold, fill: 'none', 'stroke-width': 1 });

    const lx = xL - 28;
    const ly = (yT + yB) / 2;
    const labelG = el('g', { transform: `translate(${lx} ${ly}) rotate(-90)` });
    text(0, -10, 'TERNARY SCALING', { fill: COL.gold, size: 9.5, anchor: 'middle', tracking: 1.6, weight: 500 }, labelG);
    text(0, 4,  '4/3 → ~1.43 overshoot → 1.0 stability', { fill: 'rgba(212,175,55,0.6)', size: 8.5, anchor: 'middle', italic: true, tracking: 0.4 }, labelG);
  }

  // -------- right-side constants stack ---------------------------------
  // Three stacked boxes: 1/3 (zero point) → 4/3 (threshold) → 137 (coupling)
  // with operator labels on connecting arrows.
  {
    const cx = W - 70;
    const boxes = [
      { y: rowY(1) - 10, big: '1/3',  small: 'Zero Point', stroke: '#5DBFC9' },
      { y: rowY(4),      big: '4/3',  small: 'Threshold',  stroke: COL.gold },
      { y: rowY(8) - 30, big: '137',  small: 'Coupling',   stroke: COL.ink },
    ];
    boxes.forEach((b, i) => {
      const w = 88, h = 56;
      el('rect', {
        x: cx - w/2, y: b.y - h/2, width: w, height: h,
        rx: 8, ry: 8,
        fill: 'rgba(20,28,52,0.6)',
        stroke: b.stroke, 'stroke-width': 1.4,
      });
      const t = el('text', {
        x: cx, y: b.y - 4,
        'text-anchor': 'middle', fill: b.stroke,
        'font-family': 'EB Garamond, serif', 'font-size': 22, 'font-weight': 500,
      });
      t.textContent = b.big;
      const s = el('text', {
        x: cx, y: b.y + 16,
        'text-anchor': 'middle', fill: COL.inkDim,
        'font-family': 'JetBrains Mono, monospace', 'font-size': 9.5,
        'letter-spacing': 0.6,
      });
      s.textContent = b.small;
    });

    // Connectors with operator labels
    const arrow = (y1, y2, label) => {
      el('line', { x1: cx, y1, x2: cx, y2, stroke: COL.lineStrong, 'stroke-width': 1 });
      el('polyline', {
        points: `${cx - 3.5},${y2 - 5} ${cx},${y2} ${cx + 3.5},${y2 - 5}`,
        stroke: COL.inkDim, fill: 'none', 'stroke-width': 1,
      });
      const lbl = text(cx + 10, (y1 + y2) / 2 + 3, label, { fill: COL.inkDim, size: 9.5, tracking: 0.5 });
    };
    arrow(boxes[0].y - 28, boxes[1].y + 28, '(1/3)/(1/4)');
    arrow(boxes[1].y - 28, boxes[2].y + 28, '×78×|γ₀|/π');
  }

  // -------- rungs (foreground) -----------------------------------------
  RUNGS.forEach(r => {
    const y = rowY(r.n);

    // left label (name + sublabel) — anchored end at axis - 110
    const labelX = AXIS_X - 110;
    text(labelX, y - 4, `${r.n}. ${r.name}`, {
      fill: r.color, size: 17, weight: 600, anchor: 'end', tracking: 0.6,
    });
    text(labelX, y + 14, r.sub, {
      fill: COL.inkDim, size: 11, anchor: 'end', tracking: 0.2,
    });

    // numbered disc on axis
    const numFill = r.highlight ? r.color : 'rgba(20,28,52,0.85)';
    const numStroke = r.color;
    el('circle', {
      cx: AXIS_X, cy: y, r: NUM_R,
      fill: numFill, stroke: numStroke, 'stroke-width': 1.6,
    });
    text(AXIS_X, y + 6, String(r.n), {
      fill: r.highlight ? COL.bg : r.color, size: 16, anchor: 'middle', weight: 600,
    });

    // satellite (rung 12 next to 11)
    if (r.satellite) {
      const sx = AXIS_X + 70;
      el('circle', { cx: sx, cy: y, r: NUM_R - 4, fill: 'rgba(20,28,52,0.85)', stroke: COL.ink, 'stroke-width': 1.4 });
      text(sx, y + 5, String(r.satellite), { fill: COL.ink, size: 14, anchor: 'middle', weight: 600 });
      // satFormula on the right
      text(sx + 38, y - 3, r.satFormula, { fill: r.color, size: 13, weight: 500, mono: true });
    }

    // glyph
    drawGlyph(r.glyph, AXIS_X + 130, y, r.color);

    // formula on right
    const fx = AXIS_X + 200;
    if (r.highlight) {
      // dual-pentachoron: also show right-side phase tag
      text(fx, y - 4, r.formula, { fill: COL.ink, size: 14, weight: 500 });
      text(fx, y + 14, r.tagRight, { fill: COL.copper, size: 10.5, tracking: 1.4, weight: 500 });
    } else if (!r.satellite) {
      text(fx, y + 5, r.formula, { fill: r.color, size: 14, weight: 500 });
    }

    // For rung 8 (highlight): a small mono caption above the formula
    if (r.highlight) {
      text(labelX, y - 26, r.tag, { fill: r.color, size: 11, tracking: 1.6, anchor: 'end', weight: 600 });
    }
  });
})();
