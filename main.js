/* --------------------------------------------------
   PRELOADER
-------------------------------------------------- */
(function () {
    const assets = [
      'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=2400',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600'
      // Füge hier weitere Bilder-URLs ein, die vor dem Start geladen werden sollen
    ];
  
    const preloader = document.getElementById('preloader');
    const bar = preloader.querySelector('.bar i');
    let loaded = 0;
  
    const finish = () =>
      gsap.to(preloader, {
        autoAlpha: 0,
        duration: 0.6,
        pointerEvents: "none",
        onComplete: () => (preloader.style.display = "none")
      });
  
    assets.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loaded++;
        bar.style.width = `${(loaded / assets.length) * 100}%`;
        if (loaded === assets.length) setTimeout(finish, 350);
      };
    });
})();

/* --------------------------------------------------
   CUSTOM CURSOR
-------------------------------------------------- */
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

document.addEventListener('mousedown', () => cursor.classList.add('big'));
document.addEventListener('mouseup', () => cursor.classList.remove('big'));

/* --------------------------------------------------
   GSAP SCROLL ANIMATIONS
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  /* HERO TIMELINE (MODERATERER START, VERZÖGERTE ERUPTION) */
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      // Scroll-Distanz beibehalten
      end: "+=2200", 
      scrub: 0.9,
      pin: true
    }
  });

  heroTl
    // Phase 1: Hintergrund & Tint werden dunkler, aber sanfter.
    .to(".hero__bg", { scale: 1.15, duration: 2.2 }, 0) // Skalierung reduziert
    .to(".hero__tint", { opacity: 1.0, background: 'linear-gradient(180deg, rgba(15, 5, 2, 0.5), rgba(0, 0, 0, 0.9))', duration: 1.8 }, 0.1)
    
    // Phase 2: Lava beginnt aufzusteigen (Startet später)
    .fromTo(".lava", { scaleY: 0.0, opacity: 0.1, y: "0vh" },
      { scaleY: 1.2, opacity: 1.0, y: "-22vh", duration: 1.6, ease: "power2.out" }, 0.8) // Startet später bei 0.8s
      
    // Phase 3: Eruptions-Schock (Startet später)
    .to(".shake-layer", { 
        x: 6, 
        y: 6, 
        yoyo: true, 
        repeat: 10, 
        duration: 0.06, 
        ease: "steps(1)" 
    }, 1.6) // Startet später bei 1.6s
    
    // Phase 4: Text wegbewegen & Nacht-Modus (Startet später)
    .to(".hero__content", { y: -60, opacity: 0, duration: 1.0 }, 1.2) // Startet später bei 1.2s
    
    // Verdunkelung des Bodys (Startet später)
    .to("body", { 
        background: "#120202", 
        duration: 1.8 
    }, 1.4) // Startet später bei 1.4s
    
    // Topnav wird bei Eruption dunkel (Startet später)
    .to(".topnav", { 
        background: 'rgba(0, 0, 0, 0.9)', 
        backdropFilter: 'blur(10px)', 
        duration: 0.6 
    }, 1.4);


  /* LOOP ANIMATION */
  gsap.to(".lava", { rotation: 3, duration: 4, yoyo: true, repeat: -1 });

  /* PANEL FADE-INS & INHALTS-ANIMATIONEN */
  gsap.utils.toArray("section.panel").forEach(panel => {
    
    // Allgemeine Einblendung für alle Panel-Inner-Elemente
    gsap.from(panel.querySelector(".inner"), {
      scrollTrigger: {
        trigger: panel,
        start: "top 75%",
        toggleActions: "play none none reverse"
      },
      y: 60, 
      opacity: 0,
      duration: 1.1,
      ease: "power3.out"
    });

    // Spezielle Animation für das Feature-Grid in Panel 1
    if (panel.id === 'panel1') {
        gsap.from(panel.querySelectorAll(".feature-item"), {
            scrollTrigger: {
                trigger: panel,
                start: "center 85%", 
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.25, 
            ease: "back.out(1.2)"
        });
    }

    // Spezielle Animation für die Vulkantypen in Panel 2
    if (panel.id === 'panel2') {
        gsap.from(panel.querySelectorAll(".typ"), {
            scrollTrigger: {
                trigger: panel,
                start: "center 80%",
                toggleActions: "play none none reverse"
            },
            scale: 0.6,
            opacity: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)", 
            stagger: 0.15
        });
    }

  });
  
  /* GALERIE PARALLAX (Panel 3) */
  gsap.utils.toArray(".gallery-item").forEach((item, i) => {
      
      gsap.fromTo(item, 
          { backgroundPositionY: "-8%" }, 
          { 
              backgroundPositionY: "8%",
              ease: "none",
              scrollTrigger: {
                  trigger: item, 
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.4,
              }
          }
      );
  });


  /* HORIZONTAL SCROLL (Optimiert) */
  const wrapper = document.querySelector(".panel.horizontal .inner-wrapper");
  const slides = wrapper.querySelectorAll('.inner-slide').length;

  gsap.to(wrapper, {
    xPercent: -100 * (slides - 1), 
    ease: "none",
    scrollTrigger: {
      trigger: ".panel.horizontal",
      start: "top top",
      end: () => `+=${(slides - 1) * window.innerWidth}`, 
      scrub: true,
      pin: true
    }
  });

});