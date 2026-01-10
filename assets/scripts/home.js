/* =========================================================
   Hero Image Carousel - Auto-rotating slides ONLY
   (no click / hover interference)
========================================================= */
(function () {
  const home = document.querySelector('.home-image');
  if (!home) return;

  const slides = Array.from(home.querySelectorAll('.home-slide'));
  if (slides.length <= 1) return;

  let current = slides.findIndex(s => s.classList.contains('active'));
  if (current === -1) {
    slides.forEach((s, i) => s.classList.toggle('active', i === 0));
    current = 0;
  }

  const delay = 3200;
  let timer = null;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
  }

  function next() {
    current = (current + 1) % slides.length;
    show(current);
  }

  function start() {
    if (prefersReduced) return;
    stop();
    timer = setInterval(next, delay);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  start();
})();


/* =========================================================
   Mobile Menu Toggle (touch-safe, reliable)
========================================================= */
(function () {
  function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const links = document.querySelectorAll('.mobile-nav a');

    if (!toggle || !overlay) return;

    function openMenu() {
      toggle.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggle.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    function toggleMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      overlay.classList.contains('active') ? closeMenu() : openMenu();
    }

    /* ONE reliable event */
    toggle.addEventListener('pointerdown', toggleMenu);

    /* Navigation links */
    links.forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');

        // In-page anchor links
        if (href.startsWith('#')) {
          e.preventDefault();
          closeMenu();
          document.querySelector(href)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          return;
        }

        // Normal navigation
        setTimeout(closeMenu, 0);
      });
    });

    /* Click outside to close */
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeMenu();
    });

    /* ESC key */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });

    /* Safety: close on resize */
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
