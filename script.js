// Cristiano Saraiva – portfolio
// Menu no telemóvel, copiar email, secção ativa na navegação e diagramas

(function () {
  'use strict';

  // ── Menu no telemóvel ──────────────────────────────────
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('nav');

  function setMenu(open) {
    if (!menuBtn || !nav) return;
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? menuBtn.dataset.close : menuBtn.dataset.open);
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
  }

  // ── Copiar email ───────────────────────────────────────
  const copyBtn = document.getElementById('copy');
  const email = 'cristianosaraiva.dev@gmail.com';

  if (copyBtn) {
    const label = copyBtn.querySelector('.copy-label');

    copyBtn.addEventListener('click', async () => {
      let copied = false;

      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { copied = document.execCommand('copy'); } catch (__) {}
        document.body.removeChild(ta);
      }

      label.textContent = copied ? (copyBtn.dataset.copied || 'copied') : (copyBtn.dataset.error || 'could not copy');
      copyBtn.classList.toggle('copied', copied);
      setTimeout(() => {
        label.textContent = copyBtn.dataset.copy || 'copy';
        copyBtn.classList.remove('copied');
      }, 2200);
    });
  }

  // ── Secção ativa ───────────────────────────────────────
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const targets = links.map((l) => document.querySelector(l.getAttribute('href')));

  function updateActive() {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const line = window.scrollY + window.innerHeight * 0.35;
    let current = -1;

    targets.forEach((t, i) => { if (t && t.offsetTop <= line) current = i; });
    if (atBottom) current = targets.length - 1;

    links.forEach((l, i) => l.classList.toggle('active', i === current));
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();
  // ── Diagramas ──────────────────────────────────────────
  const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.diagram').forEach((fig) => {
    const svg = fig.querySelector('svg');
    if (!svg) return;

    const lines = Array.from(svg.querySelectorAll('path.d-line, g.d-line > path'));
    const group = svg.querySelector('g.d-line');
    const boxes = Array.from(svg.querySelectorAll('rect.d-box')).filter((r) => Number(r.getAttribute('width')) >= 100);
    const roles = boxes.filter((r) => r.getAttribute('x') === '0');
    const mods = boxes.filter((r) => r.getAttribute('x') === '350');

    // Realce da ligação ao passar o rato (só no diagrama com perfis e módulos)
    if (group) {
      const paths = Array.from(group.querySelectorAll('path'));
      const link = (box, path) => {
        if (!path) return;
        box.addEventListener('mouseenter', () => { svg.classList.add('hovering'); path.classList.add('on'); box.classList.add('on'); });
        box.addEventListener('mouseleave', () => { svg.classList.remove('hovering'); path.classList.remove('on'); box.classList.remove('on'); });
      };
      roles.forEach((b, i) => link(b, paths[i]));
      mods.forEach((b, i) => link(b, paths[roles.length + i]));
    }

    // As ligações desenham-se quando o diagrama entra no ecrã
    if (motionOk && 'IntersectionObserver' in window) {
      lines.forEach((p, i) => {
        p.setAttribute('pathLength', '1');
        p.classList.add('draw');
        p.style.setProperty('--d', (i * 0.06).toFixed(2) + 's');
      });

      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { fig.classList.add('in'); io.unobserve(fig); }
        });
      }, { threshold: 0.35 });
      io.observe(fig);
    }
  });
})();
