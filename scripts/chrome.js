/* Merkabit — shared chrome (header + footer + logo SVG).
   Pages mark current section with <body data-nav="science"> etc. */

(function () {
  const NAV = [
    { key: 'science',  label: 'Science',  href: 'science.html' },
    { key: 'quantum',  label: 'Quantum',  href: 'quantum.html' },
    { key: 'journey',  label: 'Journey',  href: 'journey.html' },
    { key: 'services', label: 'Services', href: 'services.html' },
    { key: 'about',    label: 'About',    href: 'about.html' },
  ];

  // Animated 2D Merkabit mark — interlocking triangles, hexagonal projection.
  const LOGO_MARK = (size = 28, animate = false) => `
    <svg class="logo-mark${animate ? ' logo-mark--anim' : ''}" width="${size}" height="${size}" viewBox="-50 -50 100 100" aria-label="Merkabit mark">
      <g fill="none" stroke="var(--gold)" stroke-width="1.6" stroke-linejoin="round">
        <polygon class="tri-up"   points="0,-42 36.4,21 -36.4,21" />
        <polygon class="tri-down" points="0,42 -36.4,-21 36.4,-21" />
      </g>
      <g class="dots" fill="var(--gold)">
        <circle r="1.6" cx="0" cy="0"/>
      </g>
    </svg>`;

  function header(active) {
    const links = NAV.map(n => `<a href="${n.href}" class="${n.key === active ? 'active' : ''}">${n.label}</a>`).join('');
    return `
      <header class="site-header">
        <div class="wrap wrap--wide">
          <a class="brand" href="index.html">
            ${LOGO_MARK(28, true)}
            <span class="wordmark">Merkabit<span class="small">research programme</span></span>
          </a>
          <nav class="nav">${links}</nav>
          <span class="nav-meta">v1 · 2026</span>
          <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
            <span class="bar"></span><span class="bar"></span><span class="bar"></span>
          </button>
        </div>
        <nav class="mobile-nav" id="mobile-nav" aria-hidden="true">
          <div class="mobile-nav-inner">
            ${NAV.map(n => `<a href="${n.href}" class="${n.key === active ? 'active' : ''}">${n.label}</a>`).join('')}
            <a class="mobile-nav-cta" href="about.html#contact">selina@exoreaction.com</a>
          </div>
        </nav>
      </header>`;
  }

  function footer() {
    return `
      <footer class="site-footer">
        <div class="wrap wrap--wide">
          <div>
            <div class="brand" style="margin-bottom:14px;">
              ${LOGO_MARK(24, false)}
              <span class="wordmark">Merkabit</span>
            </div>
            <p class="txt-dim" style="font-size:14px;max-width:34ch;">
              A unified theory of physics, derived from geometry alone. Fifteen constants. Zero parameters. One geometry.
            </p>
          </div>
          <div>
            <h4>Science</h4>
            <ul>
              <li><a href="papers.html">Papers</a></li>
              <li><a href="hardware.html">Hardware</a></li>
              <li><a href="falsifiability.html">Falsifiability</a></li>
              <li><a href="constants.html">15 Constants</a></li>
              <li><a href="five-faces.html">Five Faces</a></li>
            </ul>
          </div>
          <div>
            <h4>Journey</h4>
            <ul>
              <li><a href="journey.html#origin">Origin</a></li>
              <li><a href="genesis.html">Genesis Sequence</a></li>
              <li><a href="journey.html#book">Scaling Buddha</a></li>
              <li><a href="collaboration.html">Tunnel Collaboration</a></li>
            </ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li><a href="services.html#workshops">Workshops</a></li>
              <li><a href="services.html#talks">Talks</a></li>
              <li><a href="services.html#book">Book</a></li>
              <li><a href="services.html#consulting">Consulting</a></li>
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li><a href="about.html#selina">Selina Stenberg</a></li>
              <li><a href="about.html#thor">Thor H. Hetland</a></li>
              <li><a href="about.html#contact">Contact</a></li>
              <li><a href="mailto:selina@exoreaction.com">selina@exoreaction.com</a></li>
              <li><a href="https://github.com/SelinaAliens?tab=repositories" target="_blank" rel="noopener">GitHub ↗</a></li>
              <li><a href="https://www.linkedin.com/in/selinas/" target="_blank" rel="noopener">LinkedIn ↗</a></li>
              <li><a href="https://zenodo.org" target="_blank" rel="noopener">Zenodo ↗</a></li>
            </ul>
          </div>
          <div class="meta">
            <span>© 2026 · Merkabit Research Programme · Selina Stenberg</span>
            <span>Built with care · merkabit.com</span>
          </div>
        </div>
      </footer>`;
  }

  function mount() {
    const active = document.body.dataset.nav || '';
    const headerHost = document.getElementById('site-header');
    const footerHost = document.getElementById('site-footer');
    if (headerHost) headerHost.outerHTML = header(active);
    if (footerHost) footerHost.outerHTML = footer();

    // Mobile-menu toggle wiring (must run after header is mounted)
    const toggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    if (toggle && mobileNav) {
      const closeMenu = () => {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      };
      const openMenu = () => {
        document.body.classList.add('nav-open');
        toggle.setAttribute('aria-expanded', 'true');
        mobileNav.setAttribute('aria-hidden', 'false');
      };
      toggle.addEventListener('click', () => {
        if (document.body.classList.contains('nav-open')) closeMenu();
        else openMenu();
      });
      // Close on link click (so anchor jumps work and SPA-feel returns)
      mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
      // Close on Escape
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && document.body.classList.contains('nav-open')) closeMenu();
      });
    }

    // Tell parent (browser frame) what URL to display
    const path = location.pathname.split('/').pop() || 'index.html';
    try {
      window.parent && window.parent.postMessage({ type: 'merkabit:nav', path, title: document.title }, '*');
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  window.MerkabitChrome = { LOGO_MARK };
})();
