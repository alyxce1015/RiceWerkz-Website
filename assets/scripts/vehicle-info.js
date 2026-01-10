/* =========================================================
   Gallery Image Zoom Modal
========================================================= */
(function () {
  const modal = document.getElementById('myModal');
  const modalImg = document.getElementById('img01');
  const closeBtn = document.querySelector('.close');

  if (!modal || !modalImg || !closeBtn) return;

  // Close with X
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close when clicking backdrop (not the image)
  modal.addEventListener('click', (e) => {
    if (e.target !== modalImg) {
      modal.style.display = 'none';
    }
  });

  // ONLY target gallery images (important fix)
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  const images = gallery.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('click', () => {
      modal.style.display = 'block';
      modalImg.src = img.src;
      modalImg.alt = img.alt || '';
    });
  });
})();


/* =========================================================
   Mobile Menu Toggle (shared behavior)
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

    // ONE reliable event for mobile
    toggle.addEventListener('pointerdown', toggleMenu);

    // Handle navigation links
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // In-page anchor links
        if (href && href.startsWith('#')) {
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

    // Click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeMenu();
    });

    // ESC key support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Safety: close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 520) closeMenu();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
