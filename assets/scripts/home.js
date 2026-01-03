(function(){
  // Gallery CTA behavior (works with .carousel-wrap when present)
  const carouselWrap = document.querySelector('.carousel-wrap');
  const carousel = carouselWrap ? carouselWrap.querySelector('.carousel') : document.querySelector('.carousel');
  // find the gallery container and the CTA inside it (CTA now lives as a sibling to the carousel)
  const gallery = carousel ? carousel.closest('.gallery') : document.querySelector('.gallery');
  const cta = gallery ? gallery.querySelector('.redirect-gallery') : null;
  let hovered = false;

  if (carousel) {
    const targetForHover = carouselWrap || carousel;

    targetForHover.addEventListener('mouseenter', ()=> hovered = true);
    targetForHover.addEventListener('mouseleave', ()=> hovered = false);

    // clicking the carousel area when hovered navigates to the CTA href
    targetForHover.addEventListener('click', function(e){
      // ignore clicks on actual links (cards or the CTA itself)
      if (e.target.closest('a')) return;
      if (hovered && cta) {
        const url = cta.getAttribute('href');
        if (url && url !== '#') window.location.href = url;
      }
    });

    // keyboard accessibility: Enter on the carousel navigates
    targetForHover.addEventListener('keydown', function(e){
      if (e.key === 'Enter' && cta) {
        const url = cta.getAttribute('href');
        if (url && url !== '#') window.location.href = url;
      }
    });

    // allow the wrapper to be focusable for keyboard users
    targetForHover.setAttribute('tabindex', '0');
  }

  // Home hero carousel: cycles slides every 4s, pauses on hover/focus
  const homeCarousel = document.querySelector('.home-image .home-carousel');
  if (homeCarousel) {
    const slides = Array.from(homeCarousel.querySelectorAll('.slide'));
    if (slides.length > 0) {
      let current = slides.findIndex(s => s.classList.contains('active'));
      if (current === -1) { current = 0; slides[0].classList.add('active'); }

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let intervalId = null;

      const show = (idx) => {
        slides.forEach((s,i)=> s.classList.toggle('active', i===idx));
      };

      const start = ()=> {
        if (prefersReduced || slides.length <= 1) return;
        if (intervalId) return;
        intervalId = setInterval(()=>{
          current = (current + 1) % slides.length;
          show(current);
        }, 4500);
      };

      const stop = ()=> {
        if (intervalId) { clearInterval(intervalId); intervalId = null; }
      };


      // init
      start();

      // cleanup
      window.addEventListener('beforeunload', stop);
    }
  }
})();