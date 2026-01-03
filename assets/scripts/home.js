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