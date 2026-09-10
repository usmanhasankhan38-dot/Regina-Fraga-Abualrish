/* ==========================================================================
   REGINA FRAGA ABUALRISH - LUXURY REAL ESTATE
   MAIN APPLICATION CORE & LIFECYCLE CONTROLLER
   ========================================================================== */

const App = {
  init() {
    // 1. Initialize SPA Router
    if (window.Router) {
      window.Router.init();
    }

    // 2. Global header scroll listener
    this.initHeaderScroll();

    // 3. Initialize current page modules
    this.initPage();
  },

  initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  },

  initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const backdrop = document.querySelector('.drawer-backdrop');
    const closeBtn = document.querySelector('.drawer-close-btn');

    if (toggleBtn && drawer && backdrop) {
      toggleBtn.onclick = () => {
        drawer.classList.add('open');
        backdrop.classList.add('open');
      };

      const closeMenu = () => {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
      };

      if (closeBtn) closeBtn.onclick = closeMenu;
      backdrop.onclick = closeMenu;
    }
  },

  initHeroSearchTabs() {
    const searchTabs = document.querySelectorAll('.search-tab-btn');
    searchTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        searchTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });

    const heroSearchForm = document.querySelector('#hero-search-form');
    if (heroSearchForm) {
      heroSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const location = heroSearchForm.querySelector('#hero-search-location')?.value || '';
        const propType = heroSearchForm.querySelector('#hero-search-type')?.value || 'all';
        const targetURL = `properties.html?search=${encodeURIComponent(location)}&type=${encodeURIComponent(propType)}`;
        if (window.Router) {
          window.Router.navigate(targetURL);
        } else {
          window.location.href = targetURL;
        }
      });
    }
  },

  initPage() {
    // Re-bind mobile menu
    this.initMobileMenu();

    // Re-bind hero search bar
    this.initHeroSearchTabs();

    // Initialize Properties Module
    if (window.PropertiesManager) {
      window.PropertiesManager.init();
    }

    // Initialize Home Valuation Module
    if (window.ValuationEngine) {
      window.ValuationEngine.init();
    }

    // Initialize GSAP Animations & Triggers
    if (window.Animations) {
      window.Animations.init();
    }

    // Dynamic Query Param Handling (e.g. from hero search to properties page)
    this.handleQueryParams();
  },

  handleQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchVal = urlParams.get('search');
    const typeVal = urlParams.get('type');

    if ((searchVal || typeVal) && document.querySelector('#properties-filter-form')) {
      const searchInput = document.querySelector('#filter-search');
      const typeSelect = document.querySelector('#filter-type');

      if (searchInput && searchVal) searchInput.value = searchVal;
      if (typeSelect && typeVal) typeSelect.value = typeVal;

      if (window.PropertiesManager) {
        window.PropertiesManager.applyFilters();
      }
    }
  }
};

window.App = App;

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
