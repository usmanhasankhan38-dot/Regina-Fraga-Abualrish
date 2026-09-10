/* ==========================================================================
   REGINA FRAGA ABUALRISH - LUXURY REAL ESTATE
   PROPERTIES DATASET & DYNAMIC FILTER ENGINE
   ========================================================================== */

const PropertiesManager = {
  properties: [
    {
      id: 'prop-1',
      title: 'The Highland Park French Chateau',
      address: '4320 Armstrong Pkwy, Highland Park, TX 75205',
      neighborhood: 'Highland Park',
      price: 5850000,
      priceFormatted: '$5,850,000',
      type: 'estate',
      status: 'sale',
      badge: 'Exclusive Listing',
      beds: 5,
      baths: 6.5,
      sqft: 7850,
      garage: 3,
      image: 'assets/images/property_highland_park.jpg',
      featured: true,
      description: 'Masterpiece of French provincial architecture by renowned Dallas estate builders. Features handcrafted Texas limestone facade, slate roof, dramatic double-height foyer, limestone fireplaces, temperature-controlled wine salon, resort-style parterre gardens, and heated swimming pool with fountains.'
    },
    {
      id: 'prop-2',
      title: 'The Preston Hollow Organic Modern',
      address: '5410 Deloache Ave, Preston Hollow, TX 75220',
      neighborhood: 'Preston Hollow',
      price: 4950000,
      priceFormatted: '$4,950,000',
      type: 'modern',
      status: 'sale',
      badge: 'Just Listed',
      beds: 5,
      baths: 5.5,
      sqft: 6920,
      garage: 3,
      image: 'assets/images/property_preston_hollow.jpg',
      featured: true,
      description: 'An architectural sanctuary blending warm Texas limestone, architectural wood louvers, and motorized glass walls. Central private courtyard with ancient olive tree and tranquil reflecting pool, Poliform kitchen, and separate detached guest pavilion.'
    },
    {
      id: 'prop-3',
      title: 'The Residences at Uptown Penthouse',
      address: '2555 N Pearl St #PH32, Uptown Dallas, TX 75201',
      neighborhood: 'Uptown',
      price: 3750000,
      priceFormatted: '$3,750,000',
      type: 'penthouse',
      status: 'sale',
      badge: 'Skyline Residence',
      beds: 3,
      baths: 3.5,
      sqft: 4200,
      garage: 2,
      image: 'assets/images/property_uptown_penthouse.jpg',
      featured: true,
      description: 'Perched 32 stories above Uptown, this corner duplex penthouse boasts 24-foot double-height glass with uninhibited vistas of the Downtown Dallas skyline. Includes custom marble fireplace, Sub-Zero & Wolf chef suite, and 1,200 sqft wraparound terrace.'
    },
    {
      id: 'prop-4',
      title: 'The Lakewood Water\'s Edge Contemporary',
      address: '7115 Tokalon Dr, Lakewood, TX 75214',
      neighborhood: 'Lakewood',
      price: 3250000,
      priceFormatted: '$3,250,000',
      type: 'modern',
      status: 'sale',
      badge: 'Lakeside Living',
      beds: 4,
      baths: 4.5,
      sqft: 5100,
      garage: 2,
      image: 'assets/images/property_lakewood.jpg',
      featured: true,
      description: 'Rare opportunity overlooking the shimmering waters near White Rock Lake. Cantilevered terraces, rich cedar cladding, custom outdoor kitchen pavilion with sunset bar, and private dock access. Modern warmth at its peak.'
    },
    {
      id: 'prop-5',
      title: 'The Southlake Tuscan Sanctuary',
      address: '1400 Continental Blvd, Southlake, TX 76092',
      neighborhood: 'Southlake',
      price: 4200000,
      priceFormatted: '$4,200,000',
      type: 'estate',
      status: 'sale',
      badge: 'Private Gated',
      beds: 6,
      baths: 7,
      sqft: 8400,
      garage: 4,
      image: 'assets/images/property_southlake.jpg',
      featured: false,
      description: 'Set behind private gates in prestigious Southlake, this sprawling Mediterranean estate features Italian clay tile roof, dual grand staircases, private theater room, resort grounds with multi-tier fountain, and pristine Carroll ISD access.'
    },
    {
      id: 'prop-6',
      title: 'The Turtle Creek Luxury High-Rise Suite',
      address: '3883 Turtle Creek Blvd #18A, Dallas, TX 75219',
      neighborhood: 'Uptown',
      price: 16500,
      priceFormatted: '$16,500 / mo',
      type: 'penthouse',
      status: 'rent',
      badge: 'Luxury Lease',
      beds: 3,
      baths: 3,
      sqft: 3100,
      garage: 2,
      image: 'assets/images/hero_estate.jpg',
      featured: false,
      description: 'Furnished executive lease along the famed Turtle Creek corridor. Full service concierge, 24/7 valet, private elevator foyer, automated Lutron shading, and expansive balcony overlooking lush parkland.'
    }
  ],

  likedProps: JSON.parse(localStorage.getItem('regina_liked_props') || '[]'),

  init() {
    this.renderFeatured();
    this.initFilterPage();
    this.initModal();
  },

  renderFeatured() {
    const container = document.querySelector('#featured-properties-grid');
    if (!container) return;

    const featuredList = this.properties.filter(p => p.featured);
    container.innerHTML = featuredList.map(p => this.createCardHTML(p)).join('');
    this.bindCardEvents(container);
  },

  initFilterPage() {
    const filterForm = document.querySelector('#properties-filter-form');
    const container = document.querySelector('#all-properties-grid');
    if (!container) return;

    this.renderAllProperties(this.properties);

    if (filterForm) {
      const inputs = filterForm.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('change', () => this.applyFilters());
        input.addEventListener('input', () => this.applyFilters());
      });

      // Price slider label update
      const priceSlider = filterForm.querySelector('#filter-price');
      const priceLabel = filterForm.querySelector('#price-value-display');
      if (priceSlider && priceLabel) {
        priceSlider.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          if (val >= 10000000) {
            priceLabel.innerText = '$10M+';
          } else {
            priceLabel.innerText = `$${(val / 1000000).toFixed(1)}M`;
          }
        });
      }

      // Quick filter buttons (Buy/Rent)
      const statusPills = filterForm.querySelectorAll('.filter-status-pill');
      statusPills.forEach(pill => {
        pill.addEventListener('click', () => {
          statusPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.applyFilters();
        });
      });
    }
  },

  applyFilters() {
    const filterForm = document.querySelector('#properties-filter-form');
    if (!filterForm) return;

    const searchInput = filterForm.querySelector('#filter-search')?.value.toLowerCase().trim() || '';
    const neighborhood = filterForm.querySelector('#filter-neighborhood')?.value || 'all';
    const propertyType = filterForm.querySelector('#filter-type')?.value || 'all';
    const beds = filterForm.querySelector('#filter-beds')?.value || 'all';
    const maxPrice = parseInt(filterForm.querySelector('#filter-price')?.value || '10000000', 10);
    const activeStatusPill = filterForm.querySelector('.filter-status-pill.active')?.dataset.status || 'all';
    const sortBy = filterForm.querySelector('#filter-sort')?.value || 'featured';

    let filtered = this.properties.filter(p => {
      // Search term
      if (searchInput && !p.title.toLowerCase().includes(searchInput) && !p.address.toLowerCase().includes(searchInput) && !p.neighborhood.toLowerCase().includes(searchInput)) {
        return false;
      }
      // Neighborhood
      if (neighborhood !== 'all' && p.neighborhood.toLowerCase() !== neighborhood.toLowerCase()) {
        return false;
      }
      // Property type
      if (propertyType !== 'all' && p.type !== propertyType) {
        return false;
      }
      // Beds
      if (beds !== 'all' && p.beds < parseInt(beds, 10)) {
        return false;
      }
      // Status (buy/rent)
      if (activeStatusPill !== 'all' && p.status !== activeStatusPill) {
        return false;
      }
      // Price
      if (p.status === 'sale' && maxPrice < 10000000 && p.price > maxPrice) {
        return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'beds') {
      filtered.sort((a, b) => b.beds - a.beds);
    }

    this.renderAllProperties(filtered);
  },

  renderAllProperties(list) {
    const container = document.querySelector('#all-properties-grid');
    const countDisplay = document.querySelector('#properties-count');
    if (!container) return;

    if (countDisplay) {
      countDisplay.innerText = `${list.length} ${list.length === 1 ? 'Residence' : 'Residences'} Available`;
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;" class="clay-card">
          <h3 style="margin-bottom: 12px;">No properties match your current filters</h3>
          <p style="margin-bottom: 24px;">Try broadening your price range or clearing selected criteria to view more Dallas luxury homes.</p>
          <button class="btn btn-bronze" onclick="PropertiesManager.resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(p => this.createCardHTML(p)).join('');
    this.bindCardEvents(container);

    if (window.gsap) {
      gsap.fromTo(container.querySelectorAll('.property-card'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.45, ease: 'power2.out' }
      );
    }
  },

  resetFilters() {
    const filterForm = document.querySelector('#properties-filter-form');
    if (!filterForm) return;
    filterForm.reset();
    const pills = filterForm.querySelectorAll('.filter-status-pill');
    pills.forEach((p, i) => {
      if (i === 0) p.classList.add('active');
      else p.classList.remove('active');
    });
    this.renderAllProperties(this.properties);
  },

  createCardHTML(p) {
    const isLiked = this.likedProps.includes(p.id);
    return `
      <div class="property-card clay-card" data-id="${p.id}">
        <div class="property-media">
          <span class="property-badge ${p.badge === 'Exclusive Listing' ? 'exclusive' : ''}">${p.badge}</span>
          <button class="property-like-btn ${isLiked ? 'liked' : ''}" data-like-id="${p.id}" title="Save Residence" aria-label="Save Property">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isLiked ? '#D32F2F' : 'none'}" stroke="${isLiked ? '#D32F2F' : '#181513'}" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <img src="${p.image}" alt="${p.title}" loading="lazy">
        </div>
        <div class="property-body">
          <div class="property-price-row">
            <div class="property-price">${p.priceFormatted}</div>
            <div class="property-type-tag">${p.neighborhood}</div>
          </div>
          <h4 class="property-title">${p.title}</h4>
          <p class="property-address">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${p.address}
          </p>
          <div class="property-specs">
            <div class="spec-item">
              <svg viewBox="0 0 24 24"><path d="M2 19h20v2H2v-2zm1-8V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a3 3 0 0 1 3 3v4H0v-4a3 3 0 0 1 3-3zm2-4v4h14V7H5z"/></svg>
              ${p.beds} Beds
            </div>
            <div class="spec-item">
              <svg viewBox="0 0 24 24"><path d="M21 10H7V7c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v3zm-9-5c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1h4V5zm-8 7h18a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"/></svg>
              ${p.baths} Baths
            </div>
            <div class="spec-item">
              <svg viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h4v4H7V7zm6 0h4v4h-4V7zm-6 6h4v4H7v-4zm6 0h4v4h-4v-4z"/></svg>
              ${p.sqft.toLocaleString()} Sq Ft
            </div>
          </div>
          <div class="property-footer-actions">
            <button class="btn btn-light btn-sm view-details-btn" data-modal-id="${p.id}">Quick View</button>
            <a href="contact.html?property=${encodeURIComponent(p.title)}" class="btn btn-bronze btn-sm">Inquire</a>
          </div>
        </div>
      </div>
    `;
  },

  bindCardEvents(container) {
    // Like button toggle
    const likeBtns = container.querySelectorAll('.property-like-btn');
    likeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.likeId;
        if (this.likedProps.includes(id)) {
          this.likedProps = this.likedProps.filter(item => item !== id);
          btn.classList.remove('liked');
          btn.querySelector('svg').setAttribute('fill', 'none');
          btn.querySelector('svg').setAttribute('stroke', '#181513');
        } else {
          this.likedProps.push(id);
          btn.classList.add('liked');
          btn.querySelector('svg').setAttribute('fill', '#D32F2F');
          btn.querySelector('svg').setAttribute('stroke', '#D32F2F');
        }
        localStorage.setItem('regina_liked_props', JSON.stringify(this.likedProps));
      });
    });

    // Quick View Modal
    const viewBtns = container.querySelectorAll('.view-details-btn');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.modalId;
        this.openModal(id);
      });
    });
  },

  initModal() {
    // Create modal DOM if not present
    if (!document.querySelector('#property-modal')) {
      const modal = document.createElement('div');
      modal.id = 'property-modal';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `
        <div class="modal-content clay-card">
          <button class="modal-close-btn" aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div id="modal-dynamic-body"></div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('.modal-close-btn').addEventListener('click', () => this.closeModal());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
      });
    }
  },

  openModal(id) {
    const prop = this.properties.find(p => p.id === id);
    if (!prop) return;

    const modal = document.querySelector('#property-modal');
    const body = document.querySelector('#modal-dynamic-body');
    if (!modal || !body) return;

    body.innerHTML = `
      <div style="position: relative; height: 360px; overflow: hidden; border-radius: 32px 32px 0 0;">
        <img src="${prop.image}" alt="${prop.title}" style="width: 100%; height: 100%; object-fit: cover;">
        <span class="property-badge exclusive" style="top: 20px; left: 20px;">${prop.badge}</span>
      </div>
      <div style="padding: clamp(1.5rem, 3vw, 2.5rem);">
        <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">
          <h2 style="font-size: clamp(1.8rem, 3vw, 2.4rem); font-family: var(--font-serif);">${prop.title}</h2>
          <div style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 700; color: var(--bronze-dark);">${prop.priceFormatted}</div>
        </div>
        <p style="color: var(--text-muted); font-size: 1.05rem; display: flex; align-items: center; gap: 6px; margin-bottom: 20px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          ${prop.address} • ${prop.neighborhood}
        </p>
        
        <div class="property-specs" style="margin-bottom: 24px; padding-bottom: 16px; font-size: 1rem;">
          <div class="spec-item"><strong>${prop.beds}</strong> Bedrooms</div>
          <div class="spec-item"><strong>${prop.baths}</strong> Bathrooms</div>
          <div class="spec-item"><strong>${prop.sqft.toLocaleString()}</strong> Living Sq Ft</div>
          <div class="spec-item"><strong>${prop.garage}</strong> Car Garage</div>
        </div>

        <h4 style="margin-bottom: 10px; font-family: var(--font-serif); font-size: 1.3rem;">Architectural Overview</h4>
        <p style="color: var(--text-body); line-height: 1.7; margin-bottom: 24px;">${prop.description}</p>

        <div style="background: var(--bg-travertine-warm); padding: 24px; border-radius: 24px; border: 1px solid rgba(164,125,73,0.2);">
          <h4 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 8px;">Schedule a Private Showing with Regina</h4>
          <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 16px;">Direct confidential consultation & private property walkthrough.</p>
          <form onsubmit="event.preventDefault(); alert('Showing request submitted! Regina Fraga Abualrish will contact you within 2 business hours.'); PropertiesManager.closeModal();" style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px;">
            <input type="text" placeholder="Your Name" required class="clay-input" style="padding: 10px 14px;">
            <input type="tel" placeholder="Phone Number" required class="clay-input" style="padding: 10px 14px;">
            <button type="submit" class="btn btn-bronze" style="padding: 10px 20px;">Request Tour</button>
          </form>
        </div>
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    const modal = document.querySelector('#property-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
};

window.PropertiesManager = PropertiesManager;
