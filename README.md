# Regina Fraga Abualrish — Luxury Real Estate

An elite, bespoke luxury real estate platform inspired by [reginalovesrealestate.com](https://www.reginalovesrealestate.com/), crafted with semantic HTML5, modern CSS3, vanilla JavaScript, GSAP 3 animations, and high-end Claymorphism UI architecture.

---

## Key Highlights

- **Multi-Page SPA Architecture (Zero Full Page Reloads)**: Seamless AJAX-based router (`router.js`) with History PushState API and GSAP curtain exit/enter transitions across `index.html`, `properties.html`, `about.html`, and `contact.html`.
- **Tactile Claymorphism UI System**: Multi-level inner/outer shadow depth, high border-radii (22px–36px), and springy micro-interaction click states.
- **Asymmetrical Hero Section**: Live market counters (`$120M+` volume, `22+` years experience), floating live insight badges, and integrated quick search.
- **Interactive Property Search & Filter**: Real-time keyword search, submarket filter, architectural style, bedroom count, dynamic price slider, and quick-view modal.
- **Tactile 3-Step Home Valuation Calculator**: Dynamic market estimate based on DFW comparables with lead capture.
- **Fully Responsive**: Tailored layout supporting desktop (max 1500px), tablet (1024px), and mobile phones (zero horizontal overflow).

---

## Project Structure

```
├── index.html                  # Home Page
├── properties.html             # Properties / Listings Page
├── about.html                  # About Regina Page
├── contact.html                # Contact & Home Valuation Page
├── css/
│   ├── main.css                # Design system tokens, claymorphism, and .container
│   ├── components.css          # Navigation, hero, cards, modals, and responsive queries
│   └── transitions.css         # GSAP transition curtains and animation states
├── js/
│   ├── router.js               # Seamless SPA Fetch + PushState router
│   ├── animations.js           # GSAP timelines, ScrollTrigger reveals, 3D tilt
│   ├── properties.js           # Property dataset, dynamic filters, modal
│   ├── valuation.js            # 3-step home valuation calculator
│   └── main.js                 # Lifecycle controller & mobile drawer
├── assets/
│   └── images/                 # High-resolution architectural photography
├── vercel.json                 # Vercel configuration for static clean URLs
├── .gitignore
└── README.md
```

---

## How to Run Locally

1. Clone or download the repository.
2. Run with any local static server:
   - **Node.js (npx serve)**:
     ```bash
     npx serve .
     ```
   - **Python**:
     ```bash
     python -m http.server 3000
     ```
   - **VS Code**: Use the "Live Server" extension on `index.html`.
3. Open `http://localhost:3000` (or the port specified by your server) in any modern web browser.
