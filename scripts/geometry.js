/* Merkabit — geometric SVG kit. Inline string templates returning SVG markup. */

window.MerkabitGeo = (() => {
  const C = {
    gold: 'var(--gold)',
    soft: 'var(--gold-soft)',
    copper: 'var(--copper)',
    ink: 'var(--ink)',
    dim: 'var(--ink-dim)',
    line: 'var(--line-strong)',
  };

  // Triangle (equilateral)
  const triangle = ({ s = 1, fill = 'none', stroke = C.gold, sw = 1.4, flip = false } = {}) => `
    <polygon points="${flip ? '0,42 -36.4,-21 36.4,-21' : '0,-42 36.4,21 -36.4,21'}"
      fill="${fill}" stroke="${stroke}" stroke-width="${sw / s}" />`;

  // Merkabit (dual tetrahedra projected)
  const merkabit = ({ size = 220, animate = false } = {}) => `
    <svg viewBox="-50 -50 100 100" width="${size}" height="${size}" class="${animate ? 'merkabit-anim' : ''}">
      <g fill="none" stroke="${C.gold}" stroke-width="1.2">
        <circle r="42" stroke="${C.line}" stroke-dasharray="2 4"/>
        ${triangle({ stroke: C.gold })}
        ${triangle({ stroke: C.copper, flip: true })}
        <circle r="2" fill="${C.gold}" stroke="none"/>
      </g>
    </svg>`;

  // Star tetrahedron 3D-ish (two interlocking triangles + axonometric edges)
  const merkabit3D = ({ size = 320 } = {}) => `
    <svg viewBox="-60 -60 120 120" width="${size}" height="${size}">
      <defs>
        <radialGradient id="mb-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="${C.gold}" stop-opacity="0.16"/>
          <stop offset="60%" stop-color="${C.gold}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle r="56" fill="url(#mb-glow)"/>
      <g fill="none" stroke-linejoin="round">
        <!-- back tetra (copper) -->
        <g stroke="${C.copper}" stroke-width="1.2" opacity="0.85">
          <polygon points="0,46 -39.8,-23 39.8,-23"/>
          <line x1="0" y1="46" x2="0" y2="-12"/>
          <line x1="-39.8" y1="-23" x2="0" y2="-12"/>
          <line x1="39.8" y1="-23" x2="0" y2="-12"/>
        </g>
        <!-- front tetra (gold) -->
        <g stroke="${C.gold}" stroke-width="1.4">
          <polygon points="0,-46 39.8,23 -39.8,23"/>
          <line x1="0" y1="-46" x2="0" y2="12"/>
          <line x1="-39.8" y1="23" x2="0" y2="12"/>
          <line x1="39.8" y1="23" x2="0" y2="12"/>
        </g>
        <!-- shared hexagon ring -->
        <polygon points="20,-11.5 20,11.5 0,23 -20,11.5 -20,-11.5 0,-23"
          stroke="${C.gold}" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.6"/>
      </g>
      <circle r="1.6" fill="${C.gold}"/>
    </svg>`;

  // Hexagon
  const hex = ({ size = 60, stroke = C.gold, sw = 1, fill = 'none' } = {}) => {
    const r = 24;
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 3 * i - Math.PI / 2;
      pts.push(`${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`);
    }
    return `<svg viewBox="-30 -30 60 60" width="${size}" height="${size}">
      <polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
    </svg>`;
  };

  // Pentachoron (4-simplex projected)
  const pentachoron = ({ size = 60 } = {}) => {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (Math.PI * 2 * i) / 5;
      pts.push([Math.cos(a) * 26, Math.sin(a) * 26]);
    }
    let edges = '';
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
      edges += `<line x1="${pts[i][0].toFixed(2)}" y1="${pts[i][1].toFixed(2)}" x2="${pts[j][0].toFixed(2)}" y2="${pts[j][1].toFixed(2)}"/>`;
    }
    return `<svg viewBox="-30 -30 60 60" width="${size}" height="${size}">
      <g fill="none" stroke="${C.gold}" stroke-width="1">${edges}</g>
      ${pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="1.6" fill="${C.gold}"/>`).join('')}
    </svg>`;
  };

  // Tesseract 4-cube (Schlegel)
  const tesseract = ({ size = 60 } = {}) => {
    const o = 22, i = 11;
    const outer = [[-o,-o],[o,-o],[o,o],[-o,o]];
    const inner = [[-i,-i],[i,-i],[i,i],[-i,i]];
    const lines = [
      ...outer.map((p,k)=>[p, outer[(k+1)%4]]),
      ...inner.map((p,k)=>[p, inner[(k+1)%4]]),
      ...outer.map((p,k)=>[p, inner[k]]),
    ];
    return `<svg viewBox="-30 -30 60 60" width="${size}" height="${size}">
      <g fill="none" stroke="${C.gold}" stroke-width="1">
        ${lines.map(([a,b])=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`).join('')}
      </g>
    </svg>`;
  };

  // Fano plane (7 points, 7 lines)
  const fano = ({ size = 280, color = C.gold } = {}) => {
    // Vertices (3 outer, 3 mid, 1 center)
    const R = 80;
    const v = [
      [0, -R],
      [R * Math.sin(2 * Math.PI / 3), R * Math.cos(2 * Math.PI / 3) * -1],
      [R * Math.sin(4 * Math.PI / 3), R * Math.cos(4 * Math.PI / 3) * -1],
    ];
    // mid points
    const m = [
      [(v[1][0] + v[2][0]) / 2, (v[1][1] + v[2][1]) / 2],
      [(v[0][0] + v[2][0]) / 2, (v[0][1] + v[2][1]) / 2],
      [(v[0][0] + v[1][0]) / 2, (v[0][1] + v[1][1]) / 2],
    ];
    const c = [0, 0];
    // 7 lines: 3 sides, 3 medians, 1 inner circle
    const sides = [[v[0], m[2], v[1]], [v[1], m[0], v[2]], [v[2], m[1], v[0]]];
    const medians = [[v[0], c, m[0]], [v[1], c, m[1]], [v[2], c, m[2]]];
    const lineMarkup = [...sides, ...medians].map(([a, , b]) =>
      `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`).join('');
    // inner circle through midpoints
    const cr = Math.hypot(m[0][0], m[0][1]);
    const dots = [...v, ...m, c].map(([x, y]) =>
      `<circle cx="${x}" cy="${y}" r="3.2" fill="${color}"/>`).join('');
    return `<svg viewBox="-100 -100 200 200" width="${size}" height="${size}" class="fano">
      <g fill="none" stroke="${color}" stroke-width="1.2">${lineMarkup}
        <circle r="${cr.toFixed(2)}"/>
      </g>${dots}
    </svg>`;
  };

  // 24-cell schlegel (very stylised)
  const cell24 = ({ size = 80 } = {}) => {
    const pts = [];
    for (let r of [10, 22]) {
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12;
        pts.push([Math.cos(a) * r, Math.sin(a) * r]);
      }
    }
    let edges = '';
    for (let i = 0; i < 12; i++) {
      const a = pts[i], b = pts[(i + 1) % 12], c = pts[i + 12], d = pts[((i + 1) % 12) + 12];
      edges += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
      edges += `<line x1="${c[0]}" y1="${c[1]}" x2="${d[0]}" y2="${d[1]}"/>`;
      edges += `<line x1="${a[0]}" y1="${a[1]}" x2="${c[0]}" y2="${c[1]}"/>`;
    }
    return `<svg viewBox="-30 -30 60 60" width="${size}" height="${size}">
      <g fill="none" stroke="${C.gold}" stroke-width="0.8">${edges}</g>
    </svg>`;
  };

  // Eisenstein lattice (hex lattice patch)
  const eisenstein = ({ w = 480, h = 200 } = {}) => {
    const a = 22; // edge
    const sqrt3 = Math.sqrt(3);
    const out = [];
    for (let row = -2; row <= 8; row++) {
      for (let col = -1; col <= 26; col++) {
        const cx = col * a + (row % 2 ? a / 2 : 0);
        const cy = row * a * sqrt3 / 2;
        // hex
        const pts = [];
        for (let i = 0; i < 6; i++) {
          const ang = -Math.PI / 2 + Math.PI / 3 * i;
          pts.push(`${(cx + Math.cos(ang) * a / sqrt3).toFixed(2)},${(cy + Math.sin(ang) * a / sqrt3).toFixed(2)}`);
        }
        out.push(`<polygon points="${pts.join(' ')}"/>`);
      }
    }
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="${C.gold}" stroke-width="0.4" opacity="0.35">${out.join('')}</g>
    </svg>`;
  };

  // Klein quartic stylised (genus-3 indication via symmetric petals)
  const klein = ({ size = 60 } = {}) => {
    const r = 22;
    let petals = '';
    for (let i = 0; i < 7; i++) {
      const a = (Math.PI * 2 * i) / 7 - Math.PI / 2;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      petals += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="9" />`;
    }
    return `<svg viewBox="-30 -30 60 60" width="${size}" height="${size}">
      <g fill="none" stroke="${C.gold}" stroke-width="0.7">${petals}<circle r="${r}"/></g>
    </svg>`;
  };

  return { triangle, merkabit, merkabit3D, hex, pentachoron, tesseract, fano, cell24, eisenstein, klein };
})();
