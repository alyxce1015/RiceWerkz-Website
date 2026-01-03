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

                    // allow the wrapper to be focusable for keyboard users
                    carouselWrap.setAttribute('tabindex', '0');
                  })();