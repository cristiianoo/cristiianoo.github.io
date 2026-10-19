// ==========================================================================
// Cristiano Saraiva — Portfolio Interactive Features
// Theme Switching, Mobile Nav, Copy-to-Clipboard & Scroll Animations
// ==========================================================================

document.documentElement.classList.add('js-enabled');

function initPortfolio() {
  // --- Theme Management ---
  const themeToggleBtn = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      const isDark = theme === 'dark';
      const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
      themeToggleBtn.setAttribute('aria-label', label);
      themeToggleBtn.setAttribute('title', label);
    }
  }

  let storedTheme = null;
  try {
    storedTheme = localStorage.getItem('theme');
  } catch (error) {
    // Storage may be disabled in private browsing
  }

  // Default to 'dark' theme (unless user specifically chose 'light' before)
  const initialTheme = storedTheme === 'light' ? 'light' : 'dark';
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(targetTheme);
      try {
        localStorage.setItem('theme', targetTheme);
      } catch (error) {
        // Continue even if storage fails
      }
    });
  }

  // --- Mobile Navigation Drawer ---
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMobileMenu() {
    if (!mobileToggleBtn || !navMenu) return;
    navMenu.classList.add('open');
    mobileToggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    if (!mobileToggleBtn || !navMenu) return;
    navMenu.classList.remove('open');
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when a navigation item is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close when tapping outside the menu on mobile
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close when pressing the Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  // --- Copy Email to Clipboard ---
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailText = 'cristianosaraiva.dev@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const originalText = copyEmailBtn.innerText;
      let copied = false;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailText);
          copied = true;
        } else {
          throw new Error('Clipboard API unavailable');
        }
      } catch (err) {
        // Fallback for file:// or unsecure contexts
        const textArea = document.createElement('textarea');
        textArea.value = emailText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          copied = document.execCommand('copy');
        } catch (e) {
          copied = false;
        }
        document.body.removeChild(textArea);
      }

      if (copied) {
        copyEmailBtn.innerText = 'Copied to clipboard! ✓';
        copyEmailBtn.classList.add('copied');
      } else {
        copyEmailBtn.innerText = 'cristianosaraiva.dev@gmail.com';
      }

      setTimeout(() => {
        copyEmailBtn.innerText = originalText;
        copyEmailBtn.classList.remove('copied');
      }, 2000);
    });
  }

  // --- Scroll Reveal Animations ---
  const fadeElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    fadeElements.forEach(element => observer.observe(element));
  } else {
    fadeElements.forEach(element => element.classList.add('visible'));
  }

  // --- Active Section Link Tracking on Scroll ---
  const sections = document.querySelectorAll('main section[id]');
  function updateActiveLink() {
    let activeSection = '';
    const marker = window.scrollY + 120;

    sections.forEach(section => {
      if (marker >= section.offsetTop && marker < section.offsetTop + section.offsetHeight) {
        activeSection = section.id;
      }
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${activeSection}`;
      link.classList.toggle('active', Boolean(activeSection) && isActive);
      if (isActive && activeSection) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);
  updateActiveLink();
}

// Ensure execution whether document is loading or already ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}
