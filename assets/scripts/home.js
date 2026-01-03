(function(){
                    const carousel = document.querySelector('.carousel');
                    const cta = carousel ? carousel.querySelector('.redirect-gallery') : null;
                    let hovered = false;
                    if (!carousel || !cta) return;

                    carousel.addEventListener('mouseenter', ()=> hovered = true);
                    carousel.addEventListener('mouseleave', ()=> hovered = false);

                    // clicking the carousel area when hovered navigates to the CTA href
                    carousel.addEventListener('click', function(e){
                      // ignore clicks on actual links (cards or the CTA itself)
                      if (e.target.closest('a')) return;
                      if (hovered) {
                        const url = cta.getAttribute('href');
                        if (url && url !== '#') window.location.href = url;
                      }
                    });

                    // keyboard accessibility: Enter on the carousel navigates
                    carousel.addEventListener('keydown', function(e){
                      if (e.key === 'Enter') {
                        const url = cta.getAttribute('href');
                        if (url && url !== '#') window.location.href = url;
                      }
                    });

                    // allow the carousel to be focusable for keyboard users
                    carousel.setAttribute('tabindex', '0');
                  })();

/* Large image carousel (switches slides every 4s) */
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

  const delay = 4500; // 4 seconds
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
  function stop(){ if (timer) { clearInterval(timer); timer = null; } }

  // pause on hover / focus
  home.addEventListener('mouseenter', stop);
  home.addEventListener('mouseleave', start);
  home.addEventListener('focusin', stop);
  home.addEventListener('focusout', start);

  start();
})();