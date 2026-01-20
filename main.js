/* --------------------------------------------------
   PRELOADER
-------------------------------------------------- */
(function () {
  const assets = [
    'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=2400',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600'
  ];

  const preloader = document.getElementById('preloader');
  if (!preloader) return;

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
      if (loaded === assets.length) {
        setTimeout(finish, 350);
      }
    };
  });
})();

/* --------------------------------------------------
   CUSTOM CURSOR
-------------------------------------------------- */
const cursor = document.getElementById('cursor');

if (cursor) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  document.addEventListener('mousedown', () => cursor.classList.add('big'));
  document.addEventListener('mouseup', () => cursor.classList.remove('big'));
}

/* --------------------------------------------------
   GSAP SCROLL ANIMATIONS
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  /* --------------------------------------------------
     HERO TIMELINE
  -------------------------------------------------- */
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=2200",
      scrub: 0.9,
      pin: true
    }
  });

  heroTl
    .to(".hero__bg", {
      scale: 1.15,
      duration: 2.2
    }, 0)

    .to(".hero__tint", {
      opacity: 1,
      background: "linear-gradient(180deg, rgba(15,5,2,0.5), rgba(0,0,0,0.9))",
      duration: 1.8
    }, 0.1)

    .fromTo(".lava",
      {
        scaleY: 0,
        opacity: 0.1,
        y: "0vh"
      },
      {
        scaleY: 1.2,
        opacity: 1,
        y: "-22vh",
        duration: 1.6,
        ease: "power2.out"
      },
      0.8
    )

    .to(".shake-layer", {
      x: 6,
      y: 6,
      yoyo: true,
      repeat: 10,
      duration: 0.06,
      ease: "steps(1)"
    }, 1.6)

    .to(".hero__content", {
      y: -60,
      opacity: 0,
      duration: 1
    }, 1.2)

    .to("body", {
      background: "#120202",
      duration: 1.8
    }, 1.4)

    .to(".topnav", {
      background: "rgba(0,0,0,0.9)",
      backdropFilter: "blur(10px)",
      duration: 0.6
    }, 1.4);

  /* --------------------------------------------------
     LAVA LOOP
  -------------------------------------------------- */
  gsap.to(".lava", {
    rotation: 3,
    duration: 4,
    yoyo: true,
    repeat: -1
  });

  /* --------------------------------------------------
     PANEL FADE-INS
  -------------------------------------------------- */
  gsap.utils.toArray("section.panel").forEach(panel => {

    const inner = panel.querySelector(".inner");
    if (!inner) return;

    gsap.from(inner, {
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

    if (panel.id === "panel1") {
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
  });
  gsap.fromTo(
  "#panel3 .gallery-item",
  {
    y: 60,
    opacity: 0,
    scale: 0.96
  },
  {
    y: 0,
    opacity: 1,
    scale: 1,
    duration: 1.1,
    ease: "power3.out",
    stagger: 0.2,
    scrollTrigger: {
      trigger: "#panel3",
      start: "top 75%",
      end: "bottom 60%",
      toggleActions: "play reverse play reverse"
    }
  }
);
// --------------------------------------------------
// HOVER EFFECT FOR GALLERY ITEMS
// --------------------------------------------------
gsap.utils.toArray("#panel3 .gallery-item").forEach(item => {

  item.addEventListener("mouseenter", () => {
    gsap.to(item, {
      y: -8,
      duration: 0.35,
      ease: "power2.out"
    });
  });

  item.addEventListener("mouseleave", () => {
    gsap.to(item, {
      y: 0,
      duration: 0.35,
      ease: "power2.out"
    });
  });

});


/* --------------------------------------------------
   GALERIE PARALLAX
-------------------------------------------------- */
gsap.utils.toArray(".gallery-item").forEach(item => {
  gsap.fromTo(
    item,
    { backgroundPositionY: "-8%" },
    {
      backgroundPositionY: "8%",
      ease: "none",
      scrollTrigger: {
        trigger: item,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.4
      }
    }
  );
});


/* --------------------------------------------------
   HORIZONTAL SCROLL
-------------------------------------------------- */
const wrapper = document.querySelector(".panel.horizontal .inner-wrapper");

if (wrapper) {
  const slides = wrapper.querySelectorAll(".inner-slide").length;

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
}


/* --------------------------------------------------
   PANEL 2 – 3D CAROUSEL
-------------------------------------------------- */
const carousel = document.getElementById("carousel");

if (carousel) {
  const items = carousel.querySelectorAll(".item");

  // 🔒 Native Drag & Drop deaktivieren
  items.forEach(item => {
    item.setAttribute("draggable", "false");
  });

  const total = items.length;

  let rotation = 0;
  let isDragging = false;
  let startX = 0;

  const radius = 280;
  const speed = 0.02;

  function updateCarousel() {
    items.forEach((item, i) => {
      const angle = (360 / total) * i + rotation;
      const rad = angle * Math.PI / 180;
      const z = Math.cos(rad);

      item.style.transform =
        `rotateY(${angle}deg) translateZ(${radius}px)`;

      item.classList.toggle("hidden", z < 0);
    });
  }

  function animate() {
    if (!isDragging) {
      rotation += speed;
      updateCarousel();
    }
    requestAnimationFrame(animate);
  }

  carousel.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", e => {
    if (!isDragging) return;
    rotation += (e.clientX - startX) * 0.3;
    startX = e.clientX;
    updateCarousel();
  });

  carousel.addEventListener("touchstart", e => {
    isDragging = true;
    startX = e.touches[0].clientX;
  });

  carousel.addEventListener("touchend", () => {
    isDragging = false;
  });

  // 📱 Touch stabil + kein Page-Scroll / Ghost-Drag
  carousel.addEventListener(
    "touchmove",
    e => {
      e.preventDefault();
      rotation += (e.touches[0].clientX - startX) * 0.3;
      startX = e.touches[0].clientX;
      updateCarousel();
    },
    { passive: false }
  );
  

  updateCarousel();
  animate();
}

});