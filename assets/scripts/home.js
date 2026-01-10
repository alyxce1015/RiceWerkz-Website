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
(function(){
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  
  if (!menuToggle || !mobileNavOverlay) return;

  function toggleMenu() {
    menuToggle.classList.toggle('active');
    mobileNavOverlay.classList.toggle('active');
    
    // Prevent scrolling when menu is open
    if (mobileNavOverlay.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function closeMenu() {
    menuToggle.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Toggle menu on button click/touch
  menuToggle.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });

  // Also listen for touchstart for better mobile support
  menuToggle.addEventListener('touchstart', function(e){
    e.preventDefault();
    toggleMenu();
  }, { passive: false });

  // Close menu when clicking on a link
  mobileNavLinks.forEach(function(link){
    link.addEventListener('click', closeMenu);
    link.addEventListener('touchstart', closeMenu);
  });

  // Close menu when clicking/touching outside
  mobileNavOverlay.addEventListener('click', function(e){
    if (e.target === mobileNavOverlay) {
      closeMenu();
    }
  });

  mobileNavOverlay.addEventListener('touchstart', function(e){
    if (e.target === mobileNavOverlay) {
      closeMenu();
    }
  });

  // Close menu on ESC key
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
      closeMenu();
    }
  });
})();/* Gallery Carousel - Click to navigate */
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
(function(){
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  
  if (!menuToggle || !mobileNavOverlay) return;

  // Toggle menu on button click
  menuToggle.addEventListener('click', function(){
    menuToggle.classList.toggle('active');
    mobileNavOverlay.classList.toggle('active');
    
    // Prevent scrolling when menu is open
    if (mobileNavOverlay.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking on a link
  mobileNavLinks.forEach(function(link){
    link.addEventListener('click', function(){
      menuToggle.classList.remove('active');
      mobileNavOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  mobileNavOverlay.addEventListener('click', function(e){
    if (e.target === mobileNavOverlay) {
      menuToggle.classList.remove('active');
      mobileNavOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close menu on ESC key
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
      menuToggle.classList.remove('active');
      mobileNavOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
})();