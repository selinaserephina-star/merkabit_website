/* Merkabit — origin timeline. Renders full / compact / strip variants. */

(function () {
  const G = (window.MerkabitGeo || {});
  const NS = 'http://www.w3.org/2000/svg';

  // Geometric node icons (24x24)
  function nodeIcon(kind) {
    const wrap = (inner, opts={}) => `<svg viewBox="-12 -12 24 24" width="24" height="24" aria-hidden="true">
      <g fill="none" stroke="var(--gold)" stroke-width="${opts.sw || 1.4}" stroke-linejoin="round" stroke-linecap="round">${inner}</g></svg>`;
    switch (kind) {
      case 'dot':
        return `<span class="dot"></span>`;
      case 'hex': {
        const r = 9;
        const pts = [];
        for (let i = 0; i < 6; i++) {
          const a = -Math.PI/2 + i * Math.PI / 3;
          pts.push(`${(Math.cos(a)*r).toFixed(2)},${(Math.sin(a)*r).toFixed(2)}`);
        }
        return wrap(`<polygon points="${pts.join(' ')}"/>`);
      }
      case 'merka': {
        // dual triangles
        const r = 9;
        const up = `0,${-r} ${(r*0.866).toFixed(2)},${(r*0.5).toFixed(2)} ${(-r*0.866).toFixed(2)},${(r*0.5).toFixed(2)}`;
        const dn = `0,${r} ${(r*0.866).toFixed(2)},${(-r*0.5).toFixed(2)} ${(-r*0.866).toFixed(2)},${(-r*0.5).toFixed(2)}`;
        return wrap(`<polygon points="${up}"/><polygon points="${dn}"/>`);
      }
      case 'penta': {
        // K5 pentagon + diagonals
        const r = 9;
        const pts = [];
        for (let i = 0; i < 5; i++) {
          const a = -Math.PI/2 + i * 2*Math.PI/5;
          pts.push([Math.cos(a)*r, Math.sin(a)*r]);
        }
        let edges = '';
        for (let i = 0; i < 5; i++) {
          for (let j = i+1; j < 5; j++) {
            edges += `<line x1="${pts[i][0].toFixed(2)}" y1="${pts[i][1].toFixed(2)}" x2="${pts[j][0].toFixed(2)}" y2="${pts[j][1].toFixed(2)}"/>`;
          }
        }
        return wrap(edges, { sw: 1.0 });
      }
      case 'tess': {
        // tesseract: outer square + inner square + connectors
        const o = 9, i = 4.5;
        const sq = (s) => `<rect x="${-s}" y="${-s}" width="${s*2}" height="${s*2}"/>`;
        let conns = '';
        [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([a,b]) => {
          conns += `<line x1="${a*o}" y1="${b*o}" x2="${a*i}" y2="${b*i}"/>`;
        });
        return wrap(sq(o) + sq(i) + conns, { sw: 1.1 });
      }
      case 'fano': {
        // 7 points, 3 outer + 3 mid + 1 center, with sample lines
        const R = 9, r = 4.5;
        const outer = [], mid = [];
        for (let i = 0; i < 3; i++) {
          const a = -Math.PI/2 + i * 2*Math.PI/3;
          outer.push([Math.cos(a)*R, Math.sin(a)*R]);
          const am = a + Math.PI/3;
          mid.push([Math.cos(am)*r, Math.sin(am)*r]);
        }
        let s = `<polygon points="${outer.map(p => p.map(n => n.toFixed(2)).join(',')).join(' ')}"/>`;
        // 3 medians
        for (let i = 0; i < 3; i++) {
          s += `<line x1="${outer[i][0].toFixed(2)}" y1="${outer[i][1].toFixed(2)}" x2="${mid[(i+1)%3][0].toFixed(2)}" y2="${mid[(i+1)%3][1].toFixed(2)}"/>`;
        }
        s += `<circle r="3" fill="none"/>`;
        // dots
        const dots = [...outer, ...mid, [0,0]].map(p => `<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="0.9" fill="var(--gold)"/>`).join('');
        return wrap(s + dots, { sw: 0.9 });
      }
    }
    return `<span class="dot"></span>`;
  }

  // Final timeline content from spec §2 (verbatim)
  const ENTRIES = [
    {
      id: '2018-founder',
      time: '2018 →',
      datetime: '2018',
      head: 'Start-up founder.',
      body: 'Founds and operates start-up companies in Oslo. Long-form contemplative meditation practice maintained in parallel with the business work — a discipline that will, in retrospect, prove to be the foundation of what comes next.',
      compact: 'Founds and operates several small tech companies in Oslo, with a long-form contemplative practice in parallel.',
      icon: 'dot',
    },
    {
      id: '2025-burnout',
      time: '2025 — Q1',
      datetime: '2025-01',
      head: 'Burnout and reorientation.',
      body: 'After seven years of intensive entrepreneurship, hits exhaustion. Steps back to recover. Visits the crop-circle museum in England and recognises the formations not as messages or symbols but as geometric data with internal structural consistency. Begins systematic study.',
      compact: 'Hits burnout. Steps back. Recognises crop-circle formations as geometric data with internal structural consistency.',
      icon: 'hex',
    },
    {
      id: '2025-decoding',
      time: '2025 — ten months of decoding',
      datetime: '2025',
      head: 'The geometry resolves into a framework.',
      bodyHtml: 'Systematically resolves crop-circle formations into a coherent structure. Begins with the tetrahedron and dual-tetrahedron Merkaba; builds outward through hexagons, cubes, the Eisenstein lattice, and the closed pentachoric ouroboros. Names the <strong>merkabit</strong> — the smallest self-contained unit of coherence. Publishes <em>Introducing the Merkabit: A Coherence-Based Model of Reality</em> (ISBN 979-8279056118). <a href="https://www.amazon.co.uk/dp/B0GBKBNZLP" target="_blank" rel="noopener">Amazon ↗</a>',
      compact: 'Ten months of decoding. The <strong>merkabit</strong> is named. <em>Introducing the Merkabit</em> is published.',
      icon: 'merka',
    },
    {
      id: '2025-claude',
      time: '2025-Q4 → 2026-Q1 — three months with Claude',
      datetime: '2025-10',
      head: 'Translation to quantum architecture.',
      body: 'Begins structured, sustained dialogue with Claude (Anthropic) to translate the Merkabit framework into a formal quantum computational architecture. Three months of focused work derive the architecture\u2019s mathematical structure on the Eisenstein lattice with E₆ Coxeter symmetry. First fundamental constants emerge from geometry alone with zero free parameters: α⁻¹ = 137.036 to seven parts per billion, sin²θ_W = 3/13 to 0.19%, m_W/v = 47/144 to 0.017%.',
      compact: 'Three months of work with Claude derive the framework\u2019s quantum architecture and the first fundamental constants from geometry alone.',
      icon: 'penta',
    },
    {
      id: '2026-feb',
      time: '2026 — February',
      datetime: '2026-02',
      head: 'Acceleration.',
      body: 'Adds Claude Code and CTO Thor Henning Hetland\u2019s ExoCortex AI rig — dedicated infrastructure for AI-simulation-driven research. The pace of derivation increases by an order of magnitude. What previously took weeks now takes hours.',
      compact: 'Claude Code and the ExoCortex AI rig come online. Pace of derivation increases by an order of magnitude.',
      icon: 'tess',
    },
    {
      id: '2026-papers',
      time: '2026-Q1 → Q2 (February – May)',
      datetime: '2026-02',
      head: 'Thirty-five papers and hardware confirmation.',
      bodyHtml: 'Thirty-five companion papers drafted across the framework\u2019s full breadth — Standard Model, gravity, cosmological constant, black holes, fusion ignition, the Riemann zeros, matter–antimatter asymmetry. First successful hardware tests on IBM Eagle r3: <strong>five out of five pre-registered predictions confirmed</strong>. The Pentachoric Verification Protocol is pre-registered for Google Willow Phase 2. The Capstone paper integrates the full architecture. The first edition of <em>Scaling Buddha</em> — the human translation companion — is drafted, forthcoming in 2026.',
      compact: 'Thirty-five papers drafted. IBM Eagle r3 confirms <strong>5/5 pre-registered predictions</strong>. Capstone integrated; <em>Scaling Buddha</em> first edition forthcoming.',
      icon: 'fano',
    },
    {
      id: '2026-launch',
      time: '2026 — May',
      datetime: '2026-05',
      head: 'Public surface launches.',
      body: 'merkabit.com goes live. Papers, hardware confirmation, falsifiability tracker, and the journey made publicly available. Workshops, talks, and consulting open for engagement.',
      compact: 'merkabit.com launches publicly.',
      icon: 'dot',
    },
    {
      id: '2026-2031-window',
      time: '2026 → 2031',
      datetime: '2026',
      head: 'Five-year falsifiability window.',
      body: 'Twelve named predictions exposed to community testing. Hardware partnership programme begins for the merkabit-native quantum computer. The framework either survives the window with its predictions confirmed, or is refuted at named, public points. Either outcome advances understanding.',
      compact: 'Five-year falsifiability window opens.',
      icon: 'dot',
    },
  ];

  // Highlights strip — four marquee moments for homepage
  const STRIP = [
    { when: '2025', line: 'Burnout to crop-circle decoding', hash: '#2025-burnout', icon: 'hex' },
    { when: 'Late 2025', line: 'Introducing the Merkabit published', hash: '#2025-decoding', icon: 'merka' },
    { when: 'Feb 2026', line: 'IBM Eagle r3 — 5/5 predictions confirmed', hash: '#2026-papers', icon: 'fano' },
    { when: 'May 2026', line: 'Public launch · falsifiability window opens', hash: '#2026-launch', icon: 'dot' },
  ];

  function renderEntry(e, variant) {
    const isCompact = variant === 'compact';
    const bodyHtml = isCompact
      ? (e.compact || e.bodyHtml || e.body)
      : (e.bodyHtml || e.body);
    const nodeInner = nodeIcon(e.icon);
    return `
      <li class="tl-entry" id="${e.id}">
        <span class="tl-node">${nodeInner}</span>
        <time class="tl-marker tl-text" datetime="${e.datetime}">${e.time}</time>
        <div class="tl-text">
          <h3 class="tl-headline">${e.head}</h3>
          <p class="tl-body">${bodyHtml}</p>
        </div>
      </li>`;
  }

  function renderFull(host) {
    host.classList.add('tl', 'tl--full');
    host.innerHTML = `
      <span class="tl-line" aria-hidden="true"></span>
      <ol class="tl-list">${ENTRIES.map(e => renderEntry(e, 'full')).join('')}</ol>
    `;
    activate(host);
  }

  function renderCompact(host) {
    host.classList.add('tl', 'tl--compact');
    host.innerHTML = `
      <span class="tl-line" aria-hidden="true"></span>
      <ol class="tl-list">${ENTRIES.map(e => renderEntry(e, 'compact')).join('')}</ol>
    `;
    activate(host);
  }

  function renderStrip(host, target) {
    host.classList.add('tl', 'tl--strip');
    const base = target || 'journey.html';
    host.innerHTML = STRIP.map(s => `
      <a href="${base}${s.hash}">
        <span class="strip-when">${s.when}</span>
        <span class="strip-line">${s.line}</span>
        <span class="strip-icon">${nodeIcon(s.icon)}</span>
        <span class="strip-arrow">Read →</span>
      </a>
    `).join('');
  }

  function activate(host) {
    if (!('IntersectionObserver' in window)) {
      host.querySelectorAll('.tl-entry').forEach(el => el.classList.add('is-in'));
      return;
    }
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('is-in'); });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    host.querySelectorAll('.tl-entry').forEach(el => reveal.observe(el));

    // Active-entry indicator (centre-of-viewport tracking)
    const items = [...host.querySelectorAll('.tl-entry')];
    const setActive = () => {
      const cy = window.innerHeight / 2;
      let best = null, bestDist = Infinity;
      items.forEach(it => {
        const r = it.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const d = Math.abs(mid - cy);
        if (d < bestDist) { bestDist = d; best = it; }
      });
      items.forEach(it => it.classList.toggle('is-active', it === best));
    };
    setActive();
    let t = null;
    window.addEventListener('scroll', () => {
      if (t) cancelAnimationFrame(t);
      t = requestAnimationFrame(setActive);
    }, { passive: true });
  }

  window.MerkabitTimeline = { renderFull, renderCompact, renderStrip, ENTRIES };
})();
