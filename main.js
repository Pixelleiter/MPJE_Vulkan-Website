/* Preloader */
(function () {
  const assets = [
    'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=2400',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600'
  ];
  const pre = document.getElementById('preloader');
  const bar = pre.querySelector('.bar > i');
  let loaded = 0;
  function done() { gsap.to(pre, { autoAlpha: 0, duration: .6, pointerEvents: 'none', onComplete: () => pre.style.display = 'none' }); }
  assets.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = img.onerror = () => {
      loaded++;
      bar.style.width = Math.round((loaded / assets.length) * 100) + '%';
      if (loaded === assets.length) setTimeout(done, 350);
    };
  });
})();

/* Cursor */
document.addEventListener('mousemove', e => {
  const c = document.getElementById('cursor');
  c.style.left = e.clientX + 'px';
  c.style.top = e.clientY + 'px';
});
document.addEventListener('mousedown', () => document.getElementById('cursor').classList.add('big'));
document.addEventListener('mouseup', () => document.getElementById('cursor').classList.remove('big'));

/* GSAP / ScrollTrigger */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { console.warn('GSAP/ScrollTrigger nicht verfügbar'); return; }
  gsap.registerPlugin(ScrollTrigger);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { gsap.utils.toArray('.panel .inner').forEach(el => gsap.from(el, { opacity: 1, y: 0, duration: 0 })); return; }

  /* HERO TIMELINE */
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '+=1400',
      scrub: 0.8,
      pin: true,
      anticipatePin: 1
    }
  });
  heroTl.to('#heroBg', { scale: 1.18, duration: 1.6, ease: 'power1.out' }, 0);
  heroTl.to('#heroTint', { background: "linear-gradient(180deg, rgba(68,0,0,0.45), rgba(0,0,0,0.55))", duration: 1.4, ease: 'power2.out' }, 0.2);
  gsap.set('#lava', { scaleY: 0.03, scaleX: 0.2, opacity: 0 });
  heroTl.to('#lava', { opacity: 1, scaleY: 1.06, scaleX: 1.2, y: '-18vh', x: '-3.7vh', duration: 1.2, ease: 'power2.out' }, 0.25); gsap.set('#smoke', { opacity: 0, scale: 0.98 });
  heroTl.to('#smoke', { opacity: 0.98, y: '-26vh', scale: 1.06, duration: 1.8, ease: 'power2.out' }, 0.5);
  gsap.set('#ash', { opacity: 0, y: 0 });
  heroTl.to('#ash', { opacity: 1, y: '-6vh', duration: 1.1, ease: 'power2.out' }, 0.45);
  heroTl.to('.hero__content', { y: -48, duration: 1.2, ease: 'power2.out' }, 0.15);
  heroTl.to('.v-base', { x: '4px', duration: .08, yoyo: true, repeat: 6, ease: 'sine.inOut' }, 0.9);
  heroTl.to('body', { background: '#120202', duration: 1.6, ease: 'power2.inOut' }, 0.6);

  /* Loop Smoke & Lava */
  gsap.to('#smoke', { x: 40, duration: 8, yoyo: true, repeat: -1, ease: 'sine.inOut', opacity: 0.95 });
  gsap.to('#lava', {
    rotation: 3,         // swings +3 degrees (you can change this)
    duration: 4,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  });

  /* Panels fade-ins */
  gsap.utils.toArray('section.panel').forEach(panel => {
    gsap.from(panel.querySelector('.inner'), {
      scrollTrigger: {
        trigger: panel,
        start: 'top 70%',
        end: 'top 40%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      duration: .9,
      ease: 'power2.out'
    });
  });

  /* Horizontale Scroll-Sektion */
  const hWrapper = document.querySelector('.panel.horizontal .inner-wrapper');
  gsap.to(hWrapper, {
    xPercent: -200,
    ease: "none",
    scrollTrigger: {
      trigger: ".panel.horizontal",
      start: "top top",
      end: () => "+=" + window.innerWidth * 2,
      scrub: true,
      pin: true,
      anticipatePin: 1
    }
  });
});

/* Audio Player */
(function () {
  const btn = document.getElementById('playBtn');
  const audio = document.getElementById('bgAudio');
  btn.addEventListener('click', async () => {
    if (audio.paused) {
      try { await audio.play(); btn.textContent = '⏸'; btn.setAttribute('aria-pressed', 'true'); } catch (e) { console.warn('Audio Start blocked', e); }
    } else {
      audio.pause(); btn.textContent = '▶'; btn.setAttribute('aria-pressed', 'false');
    }
  });
})();