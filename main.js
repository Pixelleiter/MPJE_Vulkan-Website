/* --------------------------------------------------
   PRELOADER
-------------------------------------------------- */
(function () {
  const assets = [
    'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=2400',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600'
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

  /* HERO TIMELINE */
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=1400",
      scrub: 0.8,
      pin: true
    }
  });

  heroTl
    .to(".hero__bg", { scale: 1.18, duration: 1.6 }, 0)
    .to(".hero__tint", { opacity: 0.7, duration: 1.4 }, 0.2)
    .fromTo(".lava", { scaleY: 0.03, opacity: 0 },
      { scaleY: 1.1, opacity: 1, y: "-18vh", duration: 1.2 }, 0.25)
    .fromTo(".smoke", { opacity: 0, scale: 0.98 },
      { opacity: 1, y: "-26vh", scale: 1.06, duration: 1.8 }, 0.5)
    .fromTo(".ash", { opacity: 0, y: 0 },
      { opacity: 1, y: "-6vh", duration: 1.1 }, 0.45)
    .to(".hero__content", { y: -48, duration: 1.2 }, 0.15)
    .to(".v-base", { x: 4, yoyo: true, repeat: 6, duration: 0.08 }, 0.9)
    .to("body", { background: "#120202", duration: 1.6 }, 0.6);

  /* LOOP ANIMATION */
  gsap.to(".smoke", { x: 40, duration: 8, yoyo: true, repeat: -1 });
  gsap.to(".lava", { rotation: 3, duration: 4, yoyo: true, repeat: -1 });

  /* PANEL FADE-INS */
  gsap.utils.toArray("section.panel").forEach(panel => {
    gsap.from(panel.querySelector(".inner"), {
      scrollTrigger: {
        trigger: panel,
        start: "top 70%",
        toggleActions: "play none none reverse"
      },
      y: 40,
      opacity: 0,
      duration: 0.9
    });
  });

  /* HORIZONTAL SCROLL */
  const wrapper = document.querySelector(".panel.horizontal .inner-wrapper");

  gsap.to(wrapper, {
    xPercent: -200,
    ease: "none",
    scrollTrigger: {
      trigger: ".panel.horizontal",
      start: "top top",
      end: () => "+=" + window.innerWidth * 2,
      scrub: true,
      pin: true
    }
  });
});
