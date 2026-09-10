/* ==========================================================================
   REGINA FRAGA ABUALRISH - LUXURY REAL ESTATE
   SPA ROUTER (SEAMLESS MULTI-PAGE EXPERIENCE WITHOUT PAGE RELOAD)
   ========================================================================== */

const Router = {
  isTransitioning: false,

  init() {
    // If opened directly via file:// protocol (e.g. double-clicked from local folder),
    // disable the fetch-based SPA interceptor so native browser navigation works smoothly.
    if (window.location.protocol === 'file:') {
      console.log('Regina Fraga: running on file:// protocol. Using native browser navigation.');
      return;
    }

    this.createCurtain();
    this.bindLinks();
    window.addEventListener('popstate', (e) => this.handlePopState(e));
  },

  createCurtain() {
    if (document.querySelector('.transition-curtain')) return;
    const curtain = document.createElement('div');
    curtain.className = 'transition-curtain';
    curtain.innerHTML = `
      <div class="curtain-layer layer-bronze"></div>
      <div class="curtain-layer layer-charcoal">
        <div class="curtain-brand">
          <h2>Regina Fraga Abualrish</h2>
          <p>Luxury Real Estate • Dallas-Fort Worth</p>
          <div class="curtain-spinner"></div>
        </div>
      </div>
    `;
    document.body.appendChild(curtain);
  },

  bindLinks(container = document) {
    if (window.location.protocol === 'file:') return;

    const links = container.querySelectorAll('a[href]');
    links.forEach(link => {
      if (link.dataset.routerBound) return;
      const href = link.getAttribute('href');

      // Ignore anchors, external links, mailto, tel, downloads
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || 
          href.startsWith('http://') || href.startsWith('https://') || link.hasAttribute('download') || 
          link.getAttribute('target') === '_blank') {
        return;
      }

      link.dataset.routerBound = 'true';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(href);
      });
    });
  },

  normalizePath(url) {
    const raw = (url || '').split('?')[0].split('#')[0].split('/').pop() || 'index';
    const clean = raw.replace(/\.html$/, '');
    return clean === '' ? 'index' : clean;
  },

  async navigate(url, push = true) {
    if (this.isTransitioning) return;
    const currentClean = this.normalizePath(window.location.pathname);
    const targetClean = this.normalizePath(url);
    
    // If navigating to the exact same page without query, just smooth scroll top
    if (currentClean === targetClean && !url.includes('?')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.isTransitioning = true;

    // 1. Trigger GSAP Exit Curtain Transition
    await this.playExitTransition();

    try {
      // 2. Fetch destination page (with .html fallback if server doesn't rewrite clean URLs)
      let response = await fetch(url);
      if (!response.ok && !url.includes('.html') && !url.includes('?')) {
        const fallbackUrl = url.endsWith('/') ? `${url}index.html` : `${url}.html`;
        const fallbackRes = await fetch(fallbackUrl);
        if (fallbackRes.ok) response = fallbackRes;
      }
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const htmlText = await response.text();

      // 3. Parse fetched HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const newContent = doc.querySelector('#page-container');
      const newTitle = doc.querySelector('title')?.innerText || document.title;

      if (!newContent) {
        // Fallback to normal navigation if container not found
        this.resetCurtain();
        this.isTransitioning = false;
        window.location.href = url;
        return;
      }

      // 4. Update Document Title
      document.title = newTitle;

      // 5. Clean up old GSAP ScrollTriggers to prevent memory leaks
      if (window.ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }

      // 6. Swap Content
      const currentContainer = document.querySelector('#page-container');
      currentContainer.innerHTML = newContent.innerHTML;

      // 7. Update History
      if (push) {
        window.history.pushState({ path: url }, newTitle, url);
      }

      // 8. Update Active Nav Links
      this.updateActiveNav(url);

      // 9. Scroll to top
      window.scrollTo(0, 0);

      // 10. Rebind newly inserted links
      this.bindLinks(currentContainer);

      // 11. Re-initialize Page Logic & GSAP Triggers
      if (window.App && typeof window.App.initPage === 'function') {
        window.App.initPage();
      }

    } catch (err) {
      console.warn('SPA fetch navigation fallback to native:', err);
      this.resetCurtain();
      this.isTransitioning = false;
      window.location.href = url;
      return;
    }

    // 12. Trigger GSAP Enter Curtain Transition
    await this.playEnterTransition();
    this.isTransitioning = false;
  },

  handlePopState(e) {
    const url = window.location.pathname.split('/').pop() || 'index.html';
    this.navigate(url, false);
  },

  resetCurtain() {
    const bronzeLayer = document.querySelector('.curtain-layer.layer-bronze');
    const charcoalLayer = document.querySelector('.curtain-layer.layer-charcoal');
    const brand = document.querySelector('.curtain-brand');
    if (bronzeLayer) bronzeLayer.style.transform = 'translateY(100%)';
    if (charcoalLayer) charcoalLayer.style.transform = 'translateY(100%)';
    if (brand) brand.style.opacity = '0';
  },

  playExitTransition() {
    return new Promise(resolve => {
      const bronzeLayer = document.querySelector('.curtain-layer.layer-bronze');
      const charcoalLayer = document.querySelector('.curtain-layer.layer-charcoal');
      const brand = document.querySelector('.curtain-brand');

      if (!window.gsap || !bronzeLayer || !charcoalLayer) {
        setTimeout(resolve, 150);
        return;
      }

      const tl = gsap.timeline({ onComplete: resolve });
      tl.set([bronzeLayer, charcoalLayer], { y: '100%' })
        .set(brand, { opacity: 0, y: 20 })
        .to(bronzeLayer, {
          y: '0%',
          duration: 0.45,
          ease: 'power3.inOut'
        })
        .to(charcoalLayer, {
          y: '0%',
          duration: 0.45,
          ease: 'power3.inOut'
        }, '-=0.3')
        .to(brand, {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: 'power2.out'
        }, '-=0.15');
    });
  },

  playEnterTransition() {
    return new Promise(resolve => {
      const bronzeLayer = document.querySelector('.curtain-layer.layer-bronze');
      const charcoalLayer = document.querySelector('.curtain-layer.layer-charcoal');
      const brand = document.querySelector('.curtain-brand');

      if (!window.gsap || !bronzeLayer || !charcoalLayer) {
        setTimeout(resolve, 150);
        return;
      }

      const tl = gsap.timeline({ onComplete: resolve });
      tl.to(brand, {
          opacity: 0,
          y: -20,
          duration: 0.2,
          ease: 'power2.in'
        })
        .to(charcoalLayer, {
          y: '-100%',
          duration: 0.45,
          ease: 'power3.inOut'
        })
        .to(bronzeLayer, {
          y: '-100%',
          duration: 0.45,
          ease: 'power3.inOut'
        }, '-=0.3')
        .set([bronzeLayer, charcoalLayer], { y: '100%' });
    });
  },

  updateActiveNav(url) {
    const targetClean = this.normalizePath(url);
    const navLinks = document.querySelectorAll('.nav-link, .drawer-links a');
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      const linkClean = this.normalizePath(linkHref);
      if (linkClean === targetClean) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile drawer if open
    const drawer = document.querySelector('.mobile-drawer');
    const backdrop = document.querySelector('.drawer-backdrop');
    if (drawer && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
    }
  }
};

window.Router = Router;
