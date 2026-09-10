/* ==========================================================================
   REGINA FRAGA ABUALRISH - LUXURY REAL ESTATE
   INTERACTIVE MULTI-STEP HOME VALUATION ENGINE
   ========================================================================== */

const ValuationEngine = {
  currentStep: 1,
  data: {
    address: '',
    neighborhood: 'Highland Park',
    propertyType: 'Single Family Estate',
    timeline: '30-60 days',
    beds: 4,
    baths: 4.5,
    sqft: 4500,
    condition: 'Designer Remodeled'
  },

  init() {
    const form = document.querySelector('#valuation-wizard-form');
    if (!form) return;

    this.bindEvents(form);
    this.goToStep(1);
  },

  bindEvents(form) {
    // Next buttons
    const nextBtns = form.querySelectorAll('[data-wizard-next]');
    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.validateStep(this.currentStep)) {
          this.goToStep(this.currentStep + 1);
        }
      });
    });

    // Prev buttons
    const prevBtns = form.querySelectorAll('[data-wizard-prev]');
    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.goToStep(this.currentStep - 1);
      });
    });

    // Option selectors (pills)
    const optionPills = form.querySelectorAll('.wizard-option-pill');
    optionPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const group = pill.dataset.group;
        form.querySelectorAll(`.wizard-option-pill[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.data[group] = pill.dataset.value;
      });
    });

    // Form submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFinalSubmit(form);
    });
  },

  validateStep(step) {
    if (step === 1) {
      const addressInput = document.querySelector('#val-address');
      if (addressInput && !addressInput.value.trim()) {
        addressInput.focus();
        addressInput.style.borderColor = '#D32F2F';
        return false;
      }
      if (addressInput) {
        addressInput.style.borderColor = '';
        this.data.address = addressInput.value.trim();
      }
      const neighInput = document.querySelector('#val-neighborhood');
      if (neighInput) this.data.neighborhood = neighInput.value;
    }

    if (step === 2) {
      const sqftInput = document.querySelector('#val-sqft');
      if (sqftInput && sqftInput.value) {
        this.data.sqft = parseInt(sqftInput.value, 10) || 4500;
      }
    }

    return true;
  },

  goToStep(step) {
    this.currentStep = step;
    const stepPanels = document.querySelectorAll('.wizard-step-panel');
    const stepIndicators = document.querySelectorAll('.wizard-indicator-step');

    stepPanels.forEach((panel, i) => {
      if (i + 1 === step) {
        panel.classList.add('active');
        panel.style.display = 'block';
      } else {
        panel.classList.remove('active');
        panel.style.display = 'none';
      }
    });

    stepIndicators.forEach((ind, i) => {
      if (i + 1 <= step) {
        ind.classList.add('active');
      } else {
        ind.classList.remove('active');
      }
    });

    // When entering Step 3, calculate valuation range
    if (step === 3) {
      this.calculateEstimate();
    }

    // Scroll gently to wizard top
    const wizardCard = document.querySelector('#valuation-wizard-card');
    if (wizardCard && window.innerWidth < 768) {
      wizardCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  calculateEstimate() {
    // Neighborhood price per sqft baseline in DFW Luxury
    const baseRates = {
      'Highland Park': 850,
      'Preston Hollow': 720,
      'Uptown': 680,
      'Lakewood': 620,
      'Southlake': 560,
      'Plano / Frisco': 480,
      'Addison': 450
    };

    const conditionMultipliers = {
      'Designer Remodeled': 1.18,
      'Pristine Executive': 1.08,
      'Well Maintained': 1.0,
      'Original Character': 0.88
    };

    const rate = baseRates[this.data.neighborhood] || 600;
    const mult = conditionMultipliers[this.data.condition] || 1.0;
    const sqft = this.data.sqft || 4500;

    const midEstimate = Math.round((sqft * rate * mult) / 10000) * 10000;
    const lowEstimate = Math.round((midEstimate * 0.94) / 10000) * 10000;
    const highEstimate = Math.round((midEstimate * 1.06) / 10000) * 10000;

    const displayEl = document.querySelector('#valuation-calc-result');
    if (displayEl) {
      displayEl.innerHTML = `
        <div class="val-result-box clay-card" style="padding: 24px; text-align: center; margin-bottom: 24px; background: linear-gradient(135deg, #FAF6EE 0%, #EFE4D2 100%);">
          <span class="eyebrow" style="margin-bottom: 8px;">Estimated Market Value Range</span>
          <h3 style="font-size: clamp(2rem, 3.5vw, 2.8rem); font-family: var(--font-serif); color: var(--bronze-dark); margin: 6px 0;">
            $${(lowEstimate / 1000000).toFixed(2)}M – $${(highEstimate / 1000000).toFixed(2)}M
          </h3>
          <p style="font-size: 0.92rem; color: var(--text-muted);">
            Based on active market comparables in <strong>${this.data.neighborhood}</strong> (${sqft.toLocaleString()} sq ft • ${this.data.condition})
          </p>
        </div>
      `;
    }
  },

  handleFinalSubmit(form) {
    const name = form.querySelector('#val-name')?.value || 'Valued Client';
    const email = form.querySelector('#val-email')?.value || '';
    const phone = form.querySelector('#val-phone')?.value || '';

    // Show high-end success confirmation modal
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'modal-backdrop open';
    confirmationModal.innerHTML = `
      <div class="modal-content clay-card" style="max-width: 540px; padding: 40px 32px; text-align: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--bronze-surface); color: var(--bronze-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 8px 20px rgba(164,125,73,0.2);">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <span class="eyebrow" style="margin-bottom: 8px;">Dossier Initiated</span>
        <h3 style="font-family: var(--font-serif); font-size: 1.9rem; margin-bottom: 12px;">Thank You, ${name}</h3>
        <p style="color: var(--text-body); line-height: 1.6; margin-bottom: 24px;">
          Your customized comparative market dossier for <strong>${this.data.address || 'your Dallas residence'}</strong> is being finalized. Regina Fraga Abualrish will review recent off-market comps and reach out to you via ${phone || email || 'your contact details'}.
        </p>
        <button class="btn btn-bronze" onclick="this.closest('.modal-backdrop').remove(); ValuationEngine.goToStep(1); form.reset();">Done</button>
      </div>
    `;
    document.body.appendChild(confirmationModal);
  }
};

window.ValuationEngine = ValuationEngine;
