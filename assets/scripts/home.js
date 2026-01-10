/* Gallery Carousel - Click to navigate */
(function(){
  // target the wrapper so focus/hover align with section title
  const carouselWrap = document.querySelector('.carousel-wrap');
  const carousel = carouselWrap ? carouselWrap.querySelector('.carousel') : null;
  const cta = carouselWrap ? carouselWrap.querySelector('.redirect-gallery') : null;
  let hovered = false;
  if (!carouselWrap || !cta) return;

  carouselWrap.addEventListener('mouseenter', ()=> hovered = true);
  carouselWrap.addEventListener('mouseleave', ()=> hovered = false);

  // clicking the carousel area when hovered navigates to the CTA href
  carouselWrap.addEventListener('click', function(e){
    // ignore clicks on actual links (cards or the CTA itself)
    if (e.target.closest('a')) return;
    if (hovered) {
      const url = cta.getAttribute('href');
      if (url && url !== '#') window.location.href = url;
    }
  });

  // keyboard accessibility: Enter on the carousel navigates
  carouselWrap.addEventListener('keydown', function(e){
    if (e.key === 'Enter') {
      const url = cta.getAttribute('href');
      if (url && url !== '#') window.location.href = url;
    }
  });

  // allow the carousel to be focusable for keyboard users
  carousel.setAttribute('tabindex', '0');
})();

/* Hero Image Carousel - Auto-rotating slides */
(function(){
  const home = document.querySelector('.home-image');
  if (!home) return;
  const slides = Array.from(home.querySelectorAll('.home-slide'));
  if (slides.length <= 1) return;

  // make sure exactly one slide is active
  let current = slides.findIndex(s=> s.classList.contains('active'));
  if (current === -1) {
    slides.forEach((s,i)=> s.classList.toggle('active', i===0));
    current = 0;
  } else {
    slides.forEach((s,i)=> s.classList.toggle('active', i===current));
  }

  const delay = 3200; // 3.2 seconds
  let timer = null;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(index){
    slides.forEach((s,i)=> s.classList.toggle('active', i===index));
  }

  function next(){
    current = (current + 1) % slides.length;
    show(current);
  }

  function start(){
    if (prefersReduced) return; // don't auto-rotate for reduced motion users
    stop();
    timer = setInterval(next, delay);
  }
  
  function stop(){ 
    if (timer) { 
      clearInterval(timer); 
      timer = null; 
    } 
  }

  // pause on hover / focus
  home.addEventListener('mouseenter', stop);
  home.addEventListener('mouseleave', start);
  home.addEventListener('focusin', stop);
  home.addEventListener('focusout', start);

  start();
})();

/* Mobile Menu Toggle */
(function () {
  function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    if (!menuToggle || !mobileNavOverlay) return;

    function openMenu() {
      menuToggle.classList.add('active');
      mobileNavOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      menuToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      menuToggle.classList.remove('active');
      mobileNavOverlay.classList.remove('active');
      document.body.style.overflow = '';
      menuToggle.setAttribute('aria-expanded', 'false');
    }

    function toggleMenu(e) {
      // Prevent mobile “ghost clicks” / link behaviors
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const isOpen = mobileNavOverlay.classList.contains('active');
      if (isOpen) closeMenu();
      else openMenu();
    }

    // Accessibility attributes (safe even if you don’t use them)
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    menuToggle.setAttribute('aria-expanded', 'false');

    // Use pointer events (covers mouse + touch + pen)
    menuToggle.addEventListener('pointerup', toggleMenu);

    // Fallback for older browsers
    menuToggle.addEventListener('click', toggleMenu);

    // Stop clicks inside menu from closing it unintentionally
    const mobileNav = mobileNavOverlay.querySelector('.mobile-nav');
    if (mobileNav) {
      mobileNav.addEventListener('pointerup', (e) => e.stopPropagation());
      mobileNav.addEventListener('click', (e) => e.stopPropagation());
    }

    // Close menu when clicking outside (overlay background)
    mobileNavOverlay.addEventListener('pointerup', function (e) {
      if (e.target === mobileNavOverlay) closeMenu();
    });

    mobileNavOverlay.addEventListener('click', function (e) {
      if (e.target === mobileNavOverlay) closeMenu();
    });

    // Close menu when clicking a link
    mobileNavLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
      link.addEventListener('pointerup', closeMenu);
    });

    // Close menu on ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
        closeMenu();
      }
    });

    // If screen resizes to desktop, force close menu
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  // Make sure DOM exists before running
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
