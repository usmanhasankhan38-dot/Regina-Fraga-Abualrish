/* ==========================================================================
   REGINA FRAGA ABUALRISH - LUXURY REAL ESTATE
   GSAP ANIMATIONS & CLAYMORPHIC MICRO-INTERACTIONS
   ========================================================================== */

const Animations = {
  init() {
    if (!window.gsap) return;
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    this.animateHero();
    this.initScrollReveals();
    this.initCounters();
    this.init3DTilt();
  },

  animateHero() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const eyebrow = heroSection.querySelector('.eyebrow');
    const headline = heroSection.querySelector('.hero-headline');
    const desc = heroSection.querySelector('.hero-description');
    const statsRow = heroSection.querySelector('.hero-stats-row');
    const searchBox = heroSection.querySelector('.quick-search-box');
    const heroVisual = heroSection.querySelector('.hero-visual-wrapper');
    const floatingCards = heroSection.querySelectorAll('.floating-insight');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (eyebrow) {
      tl.fromTo(eyebrow, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
    }
    if (headline) {
      tl.fromTo(headline, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
    }
    if (desc) {
      tl.fromTo(desc, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
    }
    if (statsRow) {
      tl.fromTo(statsRow.children, { opacity: 0, scale: 0.9, y: 15 }, { opacity: 1, scale: 1, y: 0, stagger: 0.1, duration: 0.5 }, '-=0.4');
    }
    if (searchBox) {
      tl.fromTo(searchBox, { opacity: 0, y: 35, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.2)' }, '-=0.4');
    }
    if (heroVisual) {
      tl.fromTo(heroVisual, { opacity: 0, x: 40, scale: 0.96 }, { opacity: 1, x: 0, scale: 1, duration: 1 }, '-=0.8');
    }
    if (floatingCards.length > 0) {
      tl.fromTo(floatingCards, { opacity: 0, y: 20, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, stagger: 0.2, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4');
    }
  },

  initScrollReveals() {
    if (!window.ScrollTrigger) return;

    // Reveal section headers
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.fromTo(header, 
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Reveal property cards in stagger
    const propertyCards = gsap.utils.toArray('.properties-grid .property-card');
    if (propertyCards.length > 0) {
      gsap.fromTo(propertyCards,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.properties-grid',
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Reveal Difference cards
    const diffCards = gsap.utils.toArray('.difference-card');
    if (diffCards.length > 0) {
      gsap.fromTo(diffCards,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.difference-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Reveal Neighborhood cards
    const neighCards = gsap.utils.toArray('.neighborhood-card');
    if (neighCards.length > 0) {
      gsap.fromTo(neighCards,
        { opacity: 0, scale: 0.92, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.neighborhood-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  },

  initCounters() {
    const counterElements = document.querySelectorAll('[data-counter]');
    if (!counterElements.length) return;

    counterElements.forEach(el => {
      const target = parseFloat(el.getAttribute('data-counter'));
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

      const obj = { val: 0 };
      
      const trigger = el.closest('.hero-section') || el;
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: trigger,
          start: 'top 85%',
          once: true
        },
        onUpdate: () => {
          el.innerText = prefix + (decimals > 0 ? obj.val.toFixed(decimals) : Math.floor(obj.val).toLocaleString()) + suffix;
        }
      });
    });
  },

  init3DTilt() {
    const cards = document.querySelectorAll('.clay-card, .property-card, .difference-card');
    
    // Only apply on non-touch screens
    if (window.matchMedia('(pointer: coarse)').matches) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.4,
          ease: 'power1.out',
          transformPerspective: 1000
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      });
    });
  }
};

window.Animations = Animations;
