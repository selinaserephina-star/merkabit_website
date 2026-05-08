// Merkabit Genesis Sequence engine — animated build of all 17 rungs
// Each rung has a draw(t, ctx) where t∈[0,1] is the build phase.
// Cumulative scenes ghost earlier polytopes; later phases switch scene.

(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('gn-svg');

  // ── Geometry helpers ─────────────────────────────────────────────────────
  const project = (p3, rotY = 0.6, rotX = -0.4) => {
    const cy = Math.cos(rotY), sy = Math.sin(rotY);
    const cx = Math.cos(rotX), sx = Math.sin(rotX);
    let [x, y, z] = p3;
    let x1 = cy * x + sy * z;
    let z1 = -sy * x + cy * z;
    let y1 = cx * y - sx * z1;
    return [x1 * 0.85, y1 * 0.85];
  };
  const project4 = (p4, t = 0) => {
    // simple 4D→3D projection by w-perspective, then to 2D
    const w = p4[3];
    const k = 2.4 / (2.4 - w * 0.6);
    return project([p4[0] * k, p4[1] * k, p4[2] * k], 0.55 + t * 0.2, -0.4);
  };

  function el(tag, attrs, parent) {
    const n = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  // path-length stroke draw helper (returns dasharray/offset for phase t)
  const drawAt = (len, t) => ({
    'stroke-dasharray': len,
    'stroke-dashoffset': len * (1 - t),
  });

  function lineLen(a, b) {
    return Math.hypot(b[0] - a[0], b[1] - a[1]);
  }

  // Draw an edge with progressive reveal
  function drawLine(a, b, t, color = 'var(--gold)', width = 1.2, opacity = 1) {
    const len = lineLen(a, b);
    const p = el('line', {
      x1: a[0], y1: a[1], x2: b[0], y2: b[1],
      stroke: color, 'stroke-width': width,
      'stroke-linecap': 'round', opacity,
      ...drawAt(len, t),
    });
    return p;
  }

  function drawCircle(cx, cy, r, color = 'var(--gold)', t = 1, fill = 'none') {
    const C = 2 * Math.PI * r;
    return el('circle', {
      cx, cy, r,
      stroke: color, fill, 'stroke-width': 1.2,
      ...drawAt(C, t),
    });
  }

  function drawDot(cx, cy, r = 1.6, color = 'var(--gold)', opacity = 1) {
    return el('circle', { cx, cy, r, fill: color, opacity });
  }

  function drawText(x, y, text, color = 'var(--ink-mid)', size = 5) {
    return el('text', {
      x, y, fill: color,
      'font-family': 'JetBrains Mono, monospace',
      'font-size': size, 'text-anchor': 'middle',
      'letter-spacing': 0.4,
    });
  }

  // ── Polytope vertex tables ───────────────────────────────────────────────
  const TRI = (() => {
    const pts = [];
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / 3;
      pts.push([Math.cos(a) * 60, Math.sin(a) * 60]);
    }
    return pts;
  })();

  const TET3 = [
    [0, -55, 0],
    [50, 28, 30],
    [-50, 28, 30],
    [0, 28, -45],
  ];

  const PENTA3 = [
    [0, -60, 0],
    [55, 18, 0],
    [-55, 18, 0],
    [0, 12, 50],
    [0, 12, -50],
  ];

  const TESS4 = (() => {
    const v = [];
    for (let a = 0; a < 16; a++) {
      v.push([
        ((a >> 0) & 1) ? 40 : -40,
        ((a >> 1) & 1) ? 40 : -40,
        ((a >> 2) & 1) ? 40 : -40,
        ((a >> 3) & 1) ? 40 : -40,
      ]);
    }
    return v;
  })();
  const TESS_EDGES = (() => {
    const e = [];
    for (let i = 0; i < 16; i++)
      for (let j = i + 1; j < 16; j++)
        if (Math.abs(((i ^ j).toString(2).split('1').length - 1)) === 1) e.push([i, j]);
    return e;
  })();

  // 24-cell vertices: permutations of (±1,±1,0,0)
  const CELL24 = (() => {
    const v = [];
    const dims = [0, 1, 2, 3];
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++)
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
        const p = [0, 0, 0, 0]; p[i] = sx * 50; p[j] = sy * 50;
        v.push(p);
      }
    return v;
  })();
  const CELL24_EDGES = (() => {
    const e = [];
    for (let i = 0; i < CELL24.length; i++)
      for (let j = i + 1; j < CELL24.length; j++) {
        let d = 0;
        for (let k = 0; k < 4; k++) d += (CELL24[i][k] - CELL24[j][k]) ** 2;
        if (Math.abs(d - 5000) < 1) e.push([i, j]);
      }
    return e;
  })();

  // Fano plane (PSL(2,7))
  const FANO_PTS = (() => {
    const r = 60, R = 32;
    const pts = [];
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / 3;
      pts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / 3 + Math.PI / 3;
      pts.push([Math.cos(a) * R, Math.sin(a) * R]);
    }
    pts.push([0, 0]);
    return pts;
  })();
  const FANO_LINES = [
    [0, 5, 1], [1, 3, 2], [2, 4, 0],
    [0, 6, 3], [1, 6, 4], [2, 6, 5],
  ];

  // ── Rung definitions ─────────────────────────────────────────────────────
  // Each rung: phase index, name, invariant label/val, body, draw(t, scene)
  const PHASES = [
    { roman: 'I', name: 'Substrate', rungs: [0, 1] },
    { roman: 'II', name: 'Polytope chain', rungs: [2, 3, 4, 5, 6] },
    { roman: 'III', name: 'PSL(2,7)', rungs: [7, 8] },
    { roman: 'IV', name: 'Octonions · Newton', rungs: [9, 10] },
    { roman: 'V', name: 'Sedenions · dark', rungs: [11, 12] },
    { roman: 'VI', name: 'Holography', rungs: [13, 14, 15, 16] },
  ];

  const RUNGS = [
    {
      phase: 0, n: 'Two binary substrates', sym: '0|1', center: '4/3',
      inv: 'mean entanglement', val: '⟨E⟩ → 4/3',
      arch: '+ rhythm + distinction',
      body: "Two binary registers couple across a shared rotation. The mean entanglement settles at 4/3 — the triple avoided crossing. Every later rung descends from this constant.",
      paper: { id: 1, label: 'Paper 1' },
      trace: 'binary registers · ⟨E⟩ = 1.3333 · seed acquired',
      sceneClear: true,
      draw(g, t) {
        // two parallel binary strips
        for (let row = 0; row < 2; row++) {
          const y = row === 0 ? -25 : 25;
          for (let i = 0; i < 11; i++) {
            const x = -55 + i * 11;
            const show = Math.min(1, Math.max(0, t * 1.5 - i * 0.06));
            const txt = drawText(x, y + 2, ((i + row) % 2).toString(), 'var(--gold)', 12);
            txt.setAttribute('opacity', show);
            g.appendChild(txt);
          }
        }
        // coupling arc between rows
        const arc = el('path', {
          d: `M -55 -25 Q 0 0 -55 25  M 55 -25 Q 0 0 55 25`,
          stroke: 'var(--copper)', fill: 'none', 'stroke-width': 0.8,
          opacity: t > 0.5 ? Math.min(1, (t - 0.5) * 2) : 0,
          'stroke-dasharray': '2 2',
        });
        g.appendChild(arc);
        // 4/3 banner appears at end
        if (t > 0.7) {
          const b = drawText(0, 5, '⟨E⟩ = 4/3', 'var(--gold)', 8);
          b.setAttribute('opacity', (t - 0.7) / 0.3);
          g.appendChild(b);
        }
      },
    },
    {
      phase: 0, n: 'Triangle · N=3 overshoot', sym: '△', center: 'N=3',
      inv: 'overshoot above 4/3', val: '⟨E⟩(N=3) > 4/3',
      arch: '+ chirality + closure',
      body: "Three substrates close into a triangle. Mean entanglement overshoots the binary 4/3 — the first non-trivial deviation, and the seed of chirality.",
      paper: { id: 2, label: 'Paper 2' },
      trace: 'N=3 closure · ⟨E⟩ = 1.4142 · overshoot confirmed',
      sceneClear: true,
      draw(g, t) {
        const pts = TRI;
        // edges
        for (let i = 0; i < 3; i++) {
          const a = pts[i], b = pts[(i + 1) % 3];
          const ti = Math.min(1, Math.max(0, t * 3 - i * 0.6));
          g.appendChild(drawLine(a, b, ti, 'var(--gold)', 1.4));
        }
        // dots
        if (t > 0.6) {
          for (const p of pts) g.appendChild(drawDot(p[0], p[1], 2, 'var(--gold)'));
          // chirality arrows
          for (let i = 0; i < 3; i++) {
            const a = pts[i], b = pts[(i + 1) % 3];
            const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
            const txt = drawText(mx * 0.65, my * 0.65, '↻', 'var(--copper)', 10);
            txt.setAttribute('opacity', Math.min(1, (t - 0.6) * 3));
            g.appendChild(txt);
          }
        }
      },
    },
    {
      phase: 1, n: 'Tetrahedron · |A₄|=12', sym: '△→▲', center: 'A₄',
      inv: '|A₄|', val: '|A₄| = 12 · forces lift',
      arch: '+ volume',
      body: "The triangle lifts to a tetrahedron. Its rotation group A₄ has order 12 — and that 12 forces the lift to four dimensions.",
      paper: { id: 3, label: 'Paper 3' },
      trace: '|A₄| = 12 · tetrahedron complete · forcing lift to 4D',
      sceneClear: true,
      draw(g, t) {
        const proj = TET3.map(p => project(p));
        const edges = [[0,1],[0,2],[0,3],[1,2],[2,3],[3,1]];
        edges.forEach(([i, j], k) => {
          const ti = Math.min(1, Math.max(0, t * 2.2 - k * 0.18));
          g.appendChild(drawLine(proj[i], proj[j], ti, 'var(--gold)', 1.4));
        });
        if (t > 0.7) {
          proj.forEach(p => g.appendChild(drawDot(p[0], p[1], 2)));
        }
      },
    },
    {
      phase: 1, n: 'Pentachoron · K₅ ouroboros', sym: '▲→4D', center: 'K₅',
      inv: 'complete graph on 5', val: 'K₅ · ouroboros 5-cycle',
      arch: '+ 4D simplex',
      body: "The minimal 4-simplex. Five vertices, ten edges — the complete graph K₅. Five-vertex ouroboros cycles weave around the closure.",
      paper: { id: 4, label: 'Paper 4' },
      trace: 'pentachoron · K₅ verified · 5-ouroboros loops embed',
      sceneClear: true,
      draw(g, t) {
        const proj = PENTA3.map(p => project(p, 0.6, -0.3));
        const edges = [];
        for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) edges.push([i, j]);
        edges.forEach(([i, j], k) => {
          const ti = Math.min(1, Math.max(0, t * 2 - k * 0.08));
          const op = (i === 0 && j === 1) || (j === 4) ? 1 : 0.85;
          g.appendChild(drawLine(proj[i], proj[j], ti, 'var(--gold)', 1.1, op));
        });
        if (t > 0.7) proj.forEach(p => g.appendChild(drawDot(p[0], p[1], 2)));
      },
    },
    {
      phase: 1, n: 'Dual pentachoron · 8-vertex ≅ Q₃', sym: '⋈', center: 'Q₃',
      inv: 'dual graph', val: '8-vertex graph ≅ cube Q₃',
      arch: '+ R_inter shared',
      body: "Two pentachora share an R_inter axis. The eight free vertices form a graph isomorphic to the cube Q₃ — and the cube is what we lift.",
      paper: { id: 5, label: 'Paper 5' },
      trace: 'dual pentachoron · 8 free vertices · graph ≅ Q₃ confirmed',
      sceneClear: true,
      draw(g, t) {
        // Q3 cube projection
        const cube = [];
        for (let a = 0; a < 8; a++) cube.push([
          ((a >> 0) & 1) ? 40 : -40,
          ((a >> 1) & 1) ? 40 : -40,
          ((a >> 2) & 1) ? 40 : -40,
        ].map((v, i) => v));
        const proj = cube.map(p => project(p, 0.7, -0.4));
        const edges = [];
        for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
          const ham = ((i ^ j).toString(2).split('1').length - 1);
          if (Math.abs(ham) === 1) edges.push([i, j]);
        }
        edges.forEach(([i, j], k) => {
          const ti = Math.min(1, Math.max(0, t * 2 - k * 0.08));
          g.appendChild(drawLine(proj[i], proj[j], ti, 'var(--gold)', 1.1));
        });
        if (t > 0.7) proj.forEach(p => g.appendChild(drawDot(p[0], p[1], 1.8)));
      },
    },
    {
      phase: 1, n: 'Tesseract · spectral gap = 1/4', sym: 'Q₄', center: '1/4',
      inv: 'gap / bandwidth', val: 'Δ / W = 1/4',
      arch: '+ self-sustenance',
      body: "Q₄, the 4-cube, lifts the cube. Its discrete-Laplace spectrum has gap 2 and bandwidth 8 — gap-to-bandwidth ratio one quarter.",
      paper: { id: 6, label: 'Paper 6' },
      trace: 'tesseract Q₄ · Spec(L) gap=2 bandwidth=8 · Δ/W = 1/4 ✓',
      sceneClear: true,
      draw(g, t) {
        const proj = TESS4.map(p => project4(p, t));
        TESS_EDGES.forEach(([i, j], k) => {
          const ti = Math.min(1, Math.max(0, t * 1.7 - k * 0.025));
          g.appendChild(drawLine(proj[i], proj[j], ti, 'var(--gold)', 0.9, 0.85));
        });
        if (t > 0.7) proj.forEach(p => g.appendChild(drawDot(p[0], p[1], 1.5)));
      },
    },
    {
      phase: 1, n: '24-cell · gap/bw = 1/3 → α⁻¹', sym: '24c', center: 'α⁻¹',
      inv: 'fine structure', val: 'α⁻¹ = 137 − ln(F)/10 ≈ 137.036',
      arch: '+ exceptional symmetry',
      body: "The 24-cell — exceptional 4-polytope, root system of F₄. Its gap-to-bandwidth jumps to 1/3, and α⁻¹ falls out as 137 − ln(F)/10.",
      paper: { id: 7, label: 'Paper 7' },
      trace: '24-cell · gap=4 bw=12 · Δ/W = 1/3 · α⁻¹ = 137.0360 ✓',
      sceneClear: true,
      draw(g, t) {
        const proj = CELL24.map(p => project4(p, t * 0.5));
        CELL24_EDGES.forEach(([i, j], k) => {
          const ti = Math.min(1, Math.max(0, t * 1.4 - k * 0.008));
          g.appendChild(drawLine(proj[i], proj[j], ti, 'var(--gold)', 0.7, 0.8));
        });
        if (t > 0.7) proj.forEach(p => g.appendChild(drawDot(p[0], p[1], 1.2)));
      },
    },
    {
      phase: 2, n: 'PSL(2,7) · strata 31, 62, 75', sym: '|G|=168', center: '168',
      inv: 'four α routes', val: '|PSL(2,7)| = 168 · 4 routes to α',
      arch: '+ projective symmetry',
      body: "The 24-cell's symmetry forces PSL(2,7), order 168. Strata of sizes 31, 62, 75 each give independent counts; four routes converge on α.",
      paper: { id: 11, label: 'Paper 11' },
      trace: 'PSL(2,7) · |G|=168 · strata {31,62,75} · 4 routes → α agree ✓',
      sceneClear: true,
      draw(g, t) {
        // Fano plane build
        const pts = FANO_PTS;
        // outer triangle
        for (let i = 0; i < 3; i++) {
          const a = pts[i], b = pts[(i + 1) % 3];
          const ti = Math.min(1, Math.max(0, t * 2.5 - i * 0.3));
          g.appendChild(drawLine(a, b, ti, 'var(--gold)', 1.1));
        }
        // medians
        for (let i = 0; i < 3; i++) {
          const a = pts[i], b = pts[((i + 1) % 3) + 3];
          const ti = Math.min(1, Math.max(0, t * 2 - 0.6 - i * 0.15));
          g.appendChild(drawLine(a, b, ti, 'var(--gold)', 1.1));
        }
        // incircle
        if (t > 0.7) {
          const c = drawCircle(0, 0, 32, 'var(--copper)', Math.min(1, (t - 0.7) * 4));
          g.appendChild(c);
        }
        if (t > 0.85) {
          pts.forEach(p => g.appendChild(drawDot(p[0], p[1], 2)));
        }
      },
    },
    {
      phase: 2, n: 'PSL(2,7) orbits → SM constants', sym: 'SM', center: 'sin²θ_W',
      inv: 'gauge counting', val: 'sin²θ_W = 0.23122 · g₂/g₁ from orbits',
      arch: '+ Standard Model',
      body: "Orbit-stabiliser bookkeeping on PSL(2,7) yields the Standard Model couplings. Three generations, mixing angles, all from orbit sizes.",
      paper: { id: 11, label: 'Paper 11' },
      trace: 'orbits {21,42,56,168} · sin²θ_W=0.23122 ✓ · 3 generations ✓',
      sceneClear: false,
      draw(g, t) {
        // overlay orbit decomposition: three colored arcs around incircle
        const colors = ['var(--gold)', 'var(--copper)', 'var(--status-confirmed)'];
        const labels = ['g₁', 'g₂', 'g₃'];
        for (let i = 0; i < 3; i++) {
          const a0 = -Math.PI / 2 + i * 2 * Math.PI / 3;
          const a1 = a0 + 2 * Math.PI / 3 * 0.8;
          const r = 78;
          const start = [Math.cos(a0) * r, Math.sin(a0) * r];
          const end = [Math.cos(a1) * r, Math.sin(a1) * r];
          const ti = Math.min(1, Math.max(0, t * 2 - i * 0.3));
          const arc = el('path', {
            d: `M ${start[0]} ${start[1]} A ${r} ${r} 0 0 1 ${end[0]} ${end[1]}`,
            stroke: colors[i], fill: 'none', 'stroke-width': 2,
            'stroke-linecap': 'round', opacity: 0.9,
            ...drawAt(2 * Math.PI * r * 0.27, ti),
          });
          g.appendChild(arc);
          if (ti > 0.7) {
            const mid = [(start[0] + end[0]) / 2 * 1.15, (start[1] + end[1]) / 2 * 1.15];
            g.appendChild(drawText(mid[0], mid[1] + 1.5, labels[i], colors[i], 6));
          }
        }
      },
    },
    {
      phase: 3, n: 'Octonions 𝕆 · alternative', sym: '𝕆', center: '8',
      inv: 'Cayley–Dickson(ℍ→𝕆)', val: 'alternative · non-associative',
      arch: '+ octonion algebra',
      body: "Cayley–Dickson lifts the quaternions to the octonions. 𝕆 is alternative but no longer associative — the loss of associativity is what gravity will use.",
      paper: { id: 20, label: 'Paper 20' },
      trace: '𝕆 · dim=8 · alternative ✓ · non-associative ✓ · norm preserved',
      sceneClear: true,
      draw(g, t) {
        // octonion fano (same as fano) but with 7 imaginary units labelled
        const pts = FANO_PTS;
        for (let i = 0; i < 3; i++) {
          const a = pts[i], b = pts[(i + 1) % 3];
          const ti = Math.min(1, Math.max(0, t * 2 - i * 0.2));
          g.appendChild(drawLine(a, b, ti, 'var(--gold)', 1.1));
        }
        for (let i = 0; i < 3; i++) {
          const a = pts[i], b = pts[((i + 1) % 3) + 3];
          const ti = Math.min(1, Math.max(0, t * 2 - 0.4 - i * 0.15));
          g.appendChild(drawLine(a, b, ti, 'var(--gold)', 1.1));
        }
        if (t > 0.5) {
          const c = drawCircle(0, 0, 32, 'var(--gold)', Math.min(1, (t - 0.5) * 3));
          g.appendChild(c);
        }
        // unit labels
        if (t > 0.7) {
          const units = ['e₁', 'e₂', 'e₃', 'e₄', 'e₅', 'e₆', 'e₇'];
          pts.forEach((p, i) => {
            const tx = drawText(p[0], p[1] - 5, units[i], 'var(--gold)', 5);
            tx.setAttribute('opacity', Math.min(1, (t - 0.7) * 3));
            g.appendChild(tx);
            g.appendChild(drawDot(p[0], p[1], 2));
          });
        }
      },
    },
    {
      phase: 3, n: '3D Laplacian → Newton 1/r', sym: '∇²', center: '1/r',
      inv: 'discrete Green function', val: 'G(r) ∝ 1/r · α_g matches',
      arch: '+ gravity',
      body: "The discrete 3D Laplacian on the octonion lattice has Green's function 1/r. Newton's gravitational constant emerges; the cosmological constant lands at 1.105×10⁻¹²².",
      paper: { id: 20, label: 'Paper 20' },
      trace: '∇²G = δ · G(r) = 1/(4πr) · G_N matched · Λ = 1.105e-122 ✓',
      sceneClear: true,
      draw(g, t) {
        // concentric rings showing 1/r falloff
        for (let i = 0; i < 7; i++) {
          const r = 12 + i * 10;
          const op = (1 / (i + 1)) * 1.1;
          const ti = Math.min(1, Math.max(0, t * 2 - i * 0.12));
          const c = drawCircle(0, 0, r, 'var(--gold)', ti, 'none');
          c.setAttribute('opacity', op);
          c.setAttribute('stroke-width', 0.8);
          g.appendChild(c);
        }
        // central source
        const src = drawDot(0, 0, 3, 'var(--gold)');
        src.setAttribute('opacity', 1);
        g.appendChild(src);
        if (t > 0.7) {
          const tx = drawText(0, -85, 'G(r) = 1/(4πr)', 'var(--copper)', 6);
          tx.setAttribute('opacity', (t - 0.7) / 0.3);
          g.appendChild(tx);
        }
      },
    },
    {
      phase: 4, n: 'Sedenions 𝕊 · zero divisors', sym: '𝕊', center: '16',
      inv: 'Cayley–Dickson(𝕆→𝕊)', val: 'non-alternative · zero divisors',
      arch: '+ sedenion algebra',
      body: "The next Cayley–Dickson lift. 𝕊 has zero divisors — a · b = 0 with a, b ≠ 0. The dark sector lives precisely in this defect.",
      paper: { id: 22, label: 'Paper 22' },
      trace: '𝕊 · dim=16 · zero divisors detected · 84 pairs · alternative lost',
      sceneClear: true,
      draw(g, t) {
        // 16 dots in a ring; some pairs connected by faint lines (zero divisors)
        const pts = [];
        for (let i = 0; i < 16; i++) {
          const a = -Math.PI / 2 + i * 2 * Math.PI / 16;
          pts.push([Math.cos(a) * 60, Math.sin(a) * 60]);
        }
        // connecting zero-divisor pairs (just stylized: a few crossings)
        const pairs = [[0,5],[1,6],[2,9],[3,12],[4,11],[7,14],[8,13],[10,15]];
        pairs.forEach(([a, b], k) => {
          const ti = Math.min(1, Math.max(0, t * 2 - k * 0.08));
          g.appendChild(drawLine(pts[a], pts[b], ti, 'var(--copper)', 0.7, 0.5));
        });
        pts.forEach((p, i) => {
          if (t > 0.3 + i * 0.02) g.appendChild(drawDot(p[0], p[1], 1.8));
        });
      },
    },
    {
      phase: 4, n: '84 pairs · three dark species', sym: '84', center: '3 dark',
      inv: 'orbit decomposition', val: '84 = 28+28+28 · three species',
      arch: '+ dark matter / energy / radiation',
      body: "The 84 sedenion zero-divisor pairs split into three orbits of 28 — the three dark species. Ω_DM = 0.265 falls out without tuning.",
      paper: { id: 22, label: 'Paper 22' },
      trace: '84 pairs · orbits {28,28,28} · Ω_DM=0.265 ✓ · 3 species confirmed',
      sceneClear: false,
      draw(g, t) {
        // overlay: classify the 8 visible pairs into 3 colored species
        const species = ['var(--gold)', 'var(--copper)', 'var(--status-confirmed)'];
        for (let i = 0; i < 3; i++) {
          const a = -Math.PI / 2 + i * 2 * Math.PI / 3;
          const r = 80;
          const cx = Math.cos(a) * r, cy = Math.sin(a) * r;
          const ti = Math.min(1, Math.max(0, t * 2 - i * 0.3));
          const c = drawCircle(cx, cy, 8, species[i], ti, species[i]);
          c.setAttribute('opacity', 0.7);
          g.appendChild(c);
          if (ti > 0.7) g.appendChild(drawText(cx, cy + 14, '28', species[i], 6));
        }
      },
    },
    {
      phase: 5, n: 'Envelope bootstrap', sym: '⊃', center: 'r_s',
      inv: 'self-consistent envelope', val: 'r_s = 2GM (Schwarzschild)',
      arch: '+ horizon emerges',
      body: "The architecture's own divergence forms an envelope. The self-consistent solution is Schwarzschild — black holes appear without postulating them.",
      paper: { id: 27, label: 'Paper 27' },
      trace: 'envelope bootstrap · self-consistent · r_s = 2GM ✓',
      sceneClear: true,
      draw(g, t) {
        // shrinking core surrounded by expanding horizon
        const coreT = Math.max(0, Math.min(1, t * 1.5));
        const horT = Math.max(0, Math.min(1, t * 1.5 - 0.2));
        const core = drawCircle(0, 0, 18, 'var(--gold)', coreT, 'rgba(212,175,55,0.15)');
        g.appendChild(core);
        if (horT > 0) {
          const hor = drawCircle(0, 0, 55, 'var(--gold)', horT);
          hor.setAttribute('stroke-dasharray', '3 3');
          g.appendChild(hor);
        }
        if (t > 0.7) {
          const tx = drawText(0, -68, 'r_s = 2GM', 'var(--copper)', 6);
          tx.setAttribute('opacity', (t - 0.7) / 0.3);
          g.appendChild(tx);
        }
      },
    },
    {
      phase: 5, n: 'T₇₅ saturation · 2/3', sym: '2/3', center: '62/93',
      inv: 'core ratio', val: 'r_core / r_horizon = 62/93 = 2/3',
      arch: '+ saturation locked',
      body: "The 75-stratum saturates. The ratio of inner core to outer horizon locks at 62/93 = 2/3 — independent of mass, exactly.",
      paper: { id: 27, label: 'Paper 27' },
      trace: 'T₇₅ saturation · r_core/r_horizon = 62/93 = 0.6667 ✓ exact',
      sceneClear: false,
      draw(g, t) {
        // animate ratio measurement: shrink core to 2/3 of horizon
        const ratio = Math.min(1, t * 1.5);
        const r = 18 + (55 * 2 / 3 - 18) * ratio;
        const core = drawCircle(0, 0, r, 'var(--copper)', 1, 'rgba(184,115,51,0.12)');
        core.setAttribute('opacity', 0.9);
        g.appendChild(core);
        if (t > 0.6) {
          const arrow = el('path', {
            d: `M ${-r * 0.95} 0 L ${-55 * 0.95} 0`,
            stroke: 'var(--gold)', 'stroke-width': 0.6,
            'marker-end': '',
          });
          arrow.setAttribute('opacity', (t - 0.6) / 0.4);
          g.appendChild(arrow);
          const tx = drawText(0, -75, '62/93 = 2/3', 'var(--copper)', 6);
          tx.setAttribute('opacity', (t - 0.6) / 0.4);
          g.appendChild(tx);
        }
      },
    },
    {
      phase: 5, n: 'Stretched horizon · T_H', sym: 'T', center: 'T_H ∝ 1/M',
      inv: 'Hawking temperature', val: 'T_H = ℏc³ / (8πGMk_B)',
      arch: '+ Berry phase',
      body: "On the stretched horizon a Berry phase produces the Hawking temperature. T scales as 1/M, exactly Hawking — derived, not postulated.",
      paper: { id: 27, label: 'Paper 27' },
      trace: 'stretched horizon · Berry phase γ=π/2 · T_H ∝ 1/M ✓ Hawking matched',
      sceneClear: false,
      draw(g, t) {
        // shimmer at horizon — animated wave
        const phase = t * Math.PI * 3;
        for (let i = 0; i < 20; i++) {
          const a = i / 20 * 2 * Math.PI;
          const r = 55 + Math.sin(phase + i * 0.6) * 2;
          const x = Math.cos(a) * r, y = Math.sin(a) * r;
          const dot = drawDot(x, y, 0.9, 'var(--gold)');
          dot.setAttribute('opacity', t * 0.85);
          g.appendChild(dot);
        }
        if (t > 0.7) {
          const tx = drawText(0, 80, 'T_H = ℏc³/(8πGMk_B)', 'var(--gold)', 5);
          tx.setAttribute('opacity', (t - 0.7) / 0.3);
          g.appendChild(tx);
        }
      },
    },
    {
      phase: 5, n: 'Holographic entropy · S = A/4', sym: 'S', center: 'A/4',
      inv: 'Bekenstein–Hawking', val: 'S = A / 4ℓ_P² · (1/3)·(3/4) counting',
      arch: '+ closure of cycle',
      body: "The 75-stratum counting gives exactly (1/3)·(3/4) = 1/4 — the Bekenstein–Hawking coefficient. Cycle closes; substrate becomes architecture; architecture becomes substrate.",
      paper: { id: 27, label: 'Paper 27' },
      trace: 'holographic counting · (1/3)(3/4)=1/4 · S = A/4 ✓ · cycle closed',
      sceneClear: false,
      draw(g, t) {
        // tile the horizon area with planck cells lighting up
        const tiles = 36;
        for (let i = 0; i < tiles; i++) {
          const a0 = (i / tiles) * 2 * Math.PI;
          const a1 = ((i + 1) / tiles) * 2 * Math.PI;
          const r0 = 50, r1 = 60;
          const p0 = [Math.cos(a0) * r0, Math.sin(a0) * r0];
          const p1 = [Math.cos(a1) * r0, Math.sin(a1) * r0];
          const p2 = [Math.cos(a1) * r1, Math.sin(a1) * r1];
          const p3 = [Math.cos(a0) * r1, Math.sin(a0) * r1];
          const ti = Math.min(1, Math.max(0, t * 2 - (i / tiles) * 1.0));
          if (ti > 0) {
            const tile = el('polygon', {
              points: `${p0.join(',')} ${p1.join(',')} ${p2.join(',')} ${p3.join(',')}`,
              fill: 'var(--gold)', opacity: ti * 0.5,
              stroke: 'var(--gold-soft)', 'stroke-width': 0.3,
            });
            g.appendChild(tile);
          }
        }
        if (t > 0.7) {
          const tx = drawText(0, 0, 'S = A/4', 'var(--gold)', 14);
          tx.setAttribute('opacity', (t - 0.7) / 0.3);
          tx.setAttribute('font-family', 'EB Garamond, serif');
          g.appendChild(tx);
        }
      },
    },
  ];

  // ── Engine ───────────────────────────────────────────────────────────────
  const RUNG_DUR = 3.0; // seconds per rung (build phase)
  const HOLD_DUR = 0.5; // hold after build
  const TOTAL_DUR = RUNGS.length * (RUNG_DUR + HOLD_DUR);

  let playing = false;
  let speed = 1;
  let elapsed = 0;
  let lastTs = 0;
  let lastRevealed = 0; // for trace lines

  // Build phase ticks
  const ticksEl = document.getElementById('ticks');
  PHASES.forEach((p, pi) => {
    const span = p.rungs.length;
    const div = document.createElement('div');
    div.className = `t phase-${p.roman}`;
    div.style.flex = span;
    div.innerHTML = `<span class="lbl">${p.roman}</span>`;
    ticksEl.appendChild(div);
  });

  // Phase rail
  const phasesEl = document.getElementById('phases');
  PHASES.forEach((p, pi) => {
    const d = document.createElement('div');
    d.className = 'ph';
    d.dataset.phase = pi;
    d.innerHTML = `<span class="roman">${p.roman}</span><span class="name">${p.name}</span><span class="rungs">Rungs ${p.rungs[0]}–${p.rungs[p.rungs.length - 1]}</span>`;
    d.addEventListener('click', () => {
      seekToRung(p.rungs[0]);
    });
    phasesEl.appendChild(d);
  });

  // Trace
  const traceEl = document.getElementById('trace');

  function pad2(n) { return String(Math.floor(n)).padStart(2, '0'); }
  function fmtTime(s) {
    const m = Math.floor(s / 60);
    return `${pad2(m)}:${pad2(s - m * 60)}`;
  }

  function rungAt(t) {
    // Returns { idx, phase: 0..1 (build) or 1..1.166 (hold) }
    const total = RUNG_DUR + HOLD_DUR;
    const idx = Math.min(RUNGS.length - 1, Math.floor(t / total));
    const within = t - idx * total;
    const buildPhase = Math.min(1, within / RUNG_DUR);
    const holding = within > RUNG_DUR;
    return { idx, buildPhase, holding };
  }

  function seekToRung(idx) {
    elapsed = idx * (RUNG_DUR + HOLD_DUR);
    lastRevealed = idx; // re-reveal trace lines up to this point
    refreshTrace(idx);
    render();
  }

  function refreshTrace(uptoIdx) {
    // Clear and repopulate trace lines up to uptoIdx
    traceEl.innerHTML = '<span class="line head shown">$ python -m merkabit.genesis --verify  ·  17 rungs · 6 phases · 0 free parameters</span>';
    for (let i = 0; i <= uptoIdx; i++) addTraceLine(i);
  }

  function addTraceLine(idx) {
    const r = RUNGS[idx];
    const line = document.createElement('span');
    line.className = 'line';
    const num = String(idx).padStart(2, '0');
    line.innerHTML = `<span class="gold">→</span> rung ${num} <span class="dim">·</span> ${r.trace} <span class="ok">✓</span>`;
    traceEl.appendChild(line);
    requestAnimationFrame(() => line.classList.add('shown'));
    // scroll trace
    traceEl.scrollTop = traceEl.scrollHeight;
  }

  // ── Rendering ────────────────────────────────────────────────────────────
  // Maintain "memory" group (faded earlier scenes that are cumulative).
  // For simplicity we render every frame from scratch.

  function render() {
    const { idx, buildPhase, holding } = rungAt(elapsed);
    const r = RUNGS[idx];

    // Clear svg
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // GHOST: previous rungs in same scene (cumulative within phase)
    // For polytope-chain (phase II) and beyond, we ghost prior rungs of the same phase if !sceneClear
    const ghostStart = Math.max(0, findGhostStart(idx));
    for (let g = ghostStart; g < idx; g++) {
      if (RUNGS[g].sceneClear && g !== ghostStart) continue;
      const layer = el('g', { opacity: 0.15 }, svg);
      RUNGS[g].draw(layer, 1);
    }

    // CURRENT
    const layer = el('g', { opacity: holding ? 1 : 0.3 + buildPhase * 0.7 }, svg);
    r.draw(layer, buildPhase);

    // Side panel
    document.getElementById('num').textContent = String(idx).padStart(2, '0');
    document.getElementById('ttl').textContent = r.n;
    document.getElementById('inv-lbl').textContent = `Invariant · ${r.inv}`;
    document.getElementById('inv-val').textContent = r.val;
    document.getElementById('body').textContent = r.body;
    document.getElementById('paper-link').textContent = r.paper.label + ' →';
    const phase = PHASES[r.phase];
    document.getElementById('ph-tag').textContent = `Phase ${phase.roman} · ${phase.name} · ${idx}/17`;

    // Stamps
    document.getElementById('stamp-rung').textContent = `Rung ${String(idx).padStart(2, '0')}`;
    document.getElementById('stamp-phase').textContent = `Phase ${phase.roman} · ${phase.name}`;
    document.getElementById('stamp-arch').textContent = r.arch;
    document.getElementById('stamp-center').textContent = r.center;
    document.getElementById('stamp-time').textContent = `t = ${elapsed.toFixed(2)}s`;

    // Check row
    const check = document.getElementById('check');
    check.classList.remove('testing', 'pass');
    if (buildPhase < 0.9) {
      check.classList.add('testing');
      document.getElementById('check-lbl').textContent = `testing invariant…`;
    } else {
      check.classList.add('pass');
      document.getElementById('check-lbl').textContent = `invariant holds · ${r.val}`;
    }

    // Phase rail highlight
    document.querySelectorAll('.ph').forEach((p, i) => {
      p.classList.toggle('on', i === r.phase);
    });

    // Scrub
    const pct = elapsed / TOTAL_DUR;
    document.getElementById('scrub-fill').style.width = (pct * 100) + '%';
    document.getElementById('scrub-thumb').style.left = (pct * 100) + '%';
    document.getElementById('clock').textContent = `${fmtTime(elapsed)} / ${fmtTime(TOTAL_DUR)}`;

    // Trace add-on when reaching new rung
    if (buildPhase >= 0.95 && idx > lastRevealed) {
      lastRevealed = idx;
      addTraceLine(idx);
    } else if (idx === 0 && buildPhase >= 0.95 && lastRevealed < 0) {
      lastRevealed = 0; addTraceLine(0);
    }
  }

  function findGhostStart(idx) {
    // Walk backward; ghost group starts at the most recent sceneClear rung
    for (let i = idx; i >= 0; i--) {
      if (RUNGS[i].sceneClear) return i;
    }
    return 0;
  }

  // ── RAF loop ─────────────────────────────────────────────────────────────
  function tick(ts) {
    if (lastTs && playing) {
      const dt = (ts - lastTs) / 1000;
      elapsed = Math.min(TOTAL_DUR, elapsed + dt * speed);
      if (elapsed >= TOTAL_DUR) playing = false;
      render();
    }
    lastTs = ts;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ── Controls ─────────────────────────────────────────────────────────────
  const playBtn = document.getElementById('play');
  function setPlaying(p) {
    playing = p;
    playBtn.classList.toggle('playing', p);
    playBtn.textContent = p ? '❚❚' : '▶';
    if (p && elapsed >= TOTAL_DUR - 0.01) {
      elapsed = 0;
      lastRevealed = -1;
      refreshTrace(-1);
    }
  }
  playBtn.addEventListener('click', () => setPlaying(!playing));

  document.getElementById('back').addEventListener('click', () => {
    const { idx } = rungAt(elapsed);
    seekToRung(Math.max(0, idx - 1));
  });
  document.getElementById('fwd').addEventListener('click', () => {
    const { idx } = rungAt(elapsed);
    seekToRung(Math.min(RUNGS.length - 1, idx + 1));
  });

  // Speed buttons
  document.querySelectorAll('.speed button').forEach(b => {
    b.addEventListener('click', () => {
      speed = parseFloat(b.dataset.s);
      document.querySelectorAll('.speed button').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
    });
  });

  // Scrub
  const scrub = document.getElementById('scrub');
  let scrubbing = false;
  function scrubFromEvent(e) {
    const rect = scrub.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX) || 0) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    elapsed = pct * TOTAL_DUR;
    const { idx } = rungAt(elapsed);
    lastRevealed = idx;
    refreshTrace(idx);
    render();
  }
  scrub.addEventListener('mousedown', e => { scrubbing = true; scrubFromEvent(e); });
  window.addEventListener('mousemove', e => { if (scrubbing) scrubFromEvent(e); });
  window.addEventListener('mouseup', () => { scrubbing = false; });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === ' ') { e.preventDefault(); setPlaying(!playing); }
    if (e.key === 'ArrowRight') { document.getElementById('fwd').click(); }
    if (e.key === 'ArrowLeft') { document.getElementById('back').click(); }
  });

  // Initial render and autoplay
  render();
  setTimeout(() => setPlaying(true), 600);
})();
