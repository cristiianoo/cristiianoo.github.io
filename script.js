(function () {
  'use strict';

  // ── Theme ──────────────────────────────────────────────────────
  const btn = document.getElementById('theme-toggle');

  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    if (btn) btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (_) {}
  setTheme(saved === 'light' ? 'light' : 'dark');

  if (btn) btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('theme', next); } catch (_) {}
  });

  // ── Mobile nav ─────────────────────────────────────────────────
  const menuBtn = document.getElementById('mobile-toggle');
  const nav = document.getElementById('nav-menu');

  function close() {
    if (!nav || !menuBtn) return;
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', close));
    document.addEventListener('click', e => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) close();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // ── Copy email ─────────────────────────────────────────────────
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    const label = copyBtn.querySelector('.copy-label');
    copyBtn.addEventListener('click', async () => {
      let ok = false;
      const email = 'cristianosaraiva.dev@gmail.com';
      try {
        if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(email); ok = true; }
        else throw 0;
      } catch (_) {
        const t = document.createElement('textarea');
        t.value = email; t.style.cssText = 'position:fixed;left:-9999px';
        document.body.appendChild(t); t.select();
        try { ok = document.execCommand('copy'); } catch (__) {}
        document.body.removeChild(t);
      }
      if (ok && label) { label.textContent = 'copied!'; copyBtn.classList.add('copied'); }
      setTimeout(() => { if (label) label.textContent = 'copy'; copyBtn.classList.remove('copied'); }, 2000);
    });
  }

  // ── Scroll reveal ──────────────────────────────────────────────
  const els = document.querySelectorAll('.fade-up');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('visible'));
  }

  // ── Active nav ─────────────────────────────────────────────────
  const sections = document.querySelectorAll('.section[id]');
  const links = document.querySelectorAll('.nav-link');
  function update() {
    const y = scrollY + 100;
    let id = '';
    sections.forEach(s => { if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) id = s.id; });
    links.forEach(l => l.classList.toggle('active', !!id && l.getAttribute('href') === '#' + id));
  }
  addEventListener('scroll', update, { passive: true });
  update();
})();
