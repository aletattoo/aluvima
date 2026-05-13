/**
 * main.js — Aluvima Mérida
 * Orquestador principal: inicializa todos los módulos, renderiza el catálogo,
 * gestiona la navegación, el panel del carrito y los efectos de scroll.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. INICIALIZAR MÓDULOS ──────────────────────────────────────────────
  Cart.init();
  Checkout.init();

  // Inicializar iconos Lucide (los que ya están en el DOM estático)
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ─── 2. RENDERIZAR CATÁLOGO DE PRODUCTOS ────────────────────────────────
  renderCatalog(PRODUCTS);

  // ─── 2b. RENDERIZAR PASARELAS DE PAGO + APLICAR CONFIG GLOBAL ──────────
  applyAluvimaConfig();

  // ─── 3. NAVEGACIÓN MÓVIL (hamburger menu) ───────────────────────────────
  initMobileNav();

  // ─── 4. PANEL LATERAL DEL CARRITO ───────────────────────────────────────
  initCartPanel();

  // ─── 5. FILTROS DEL CATÁLOGO ────────────────────────────────────────────
  initFilters();

  // ─── 6. EFECTOS DE SCROLL ───────────────────────────────────────────────
  initScrollEffects();

  // ─── 7. ANIMACIONES DE ENTRADA (Intersection Observer) ──────────────────
  initFadeInAnimations();

  // ─── 8. BOTÓN SCROLL TO TOP ─────────────────────────────────────────────
  initScrollTopBtn();

  // ─── 9. ACTIVE NAV LINK EN SCROLL ───────────────────────────────────────
  initActiveNavOnScroll();

});

// ═══════════════════════════════════════════════════════════════════════════
// RENDERIZADO DEL CATÁLOGO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Renderiza todas las tarjetas de producto en el grid del catálogo.
 * @param {Array} products - Array de productos desde products.js
 */
function renderCatalog(products) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (!products || products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:3rem;color:#6C757D;">
        <p>No hay productos disponibles en este momento.</p>
      </div>`;
    return;
  }

  products.forEach((product, index) => {
    const card = createProductCard(product, index);
    grid.appendChild(card);
  });

  // Re-inicializar iconos Lucide en las tarjetas recién creadas
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Crea el elemento DOM de una tarjeta de producto.
 * @param {Object} product - Objeto del catálogo
 * @param {number} index   - Índice para animación escalonada
 * @returns {HTMLElement}
 */
function createProductCard(product, index) {
  const card = document.createElement('article');
  card.className = 'product-card fade-in-up';
  card.dataset.category = product.category;
  card.style.animationDelay = `${index * 60}ms`;

  // Imagen con fallback
  const imgSrc = product.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75';

  card.innerHTML = `
    <div class="product-card-image">
      <img
        src="${escapeHtml(imgSrc)}"
        alt="${escapeHtml(product.name)}"
        loading="lazy"
        onerror="this.src='https://placehold.co/600x400/8B1A2B/FFFFFF?text=Aluvima'"
      />
      <span class="product-badge ${escapeHtml(product.badge)}">${escapeHtml(product.badgeLabel)}</span>
      ${product.featured ? '<span class="product-badge" style="top:auto;bottom:12px;left:12px;background:#FFD700;color:#333;">⭐ Destacado</span>' : ''}
    </div>
    <div class="product-card-body">
      <h3 class="product-card-name">${escapeHtml(product.name)}</h3>
      <p class="product-card-desc">${escapeHtml(product.description)}</p>
      <div class="product-card-footer">
        <div class="product-price">
          <span class="product-price-label">Precio ref.</span>
          <span class="product-price-value">$${product.price.toFixed(2)}</span>
          <span class="product-price-unit">por ${escapeHtml(product.unit)}</span>
        </div>
        <button
          class="add-to-cart-btn"
          data-product-id="${product.id}"
          aria-label="Agregar ${escapeHtml(product.name)} al carrito"
        >
          <i data-lucide="plus"></i>
          Agregar
        </button>
      </div>
    </div>
  `;

  // Evento: agregar al carrito
  const addBtn = card.querySelector('.add-to-cart-btn');
  addBtn.addEventListener('click', () => {
    Cart.addItem(product);
    // Abrir el panel del carrito automáticamente
    openCartPanel();
  });

  return card;
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVEGACIÓN MÓVIL
// ═══════════════════════════════════════════════════════════════════════════

function initMobileNav() {
  const toggle   = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.innerHTML = isOpen
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons();
  });

  // Cerrar menú al hacer clic en un enlace
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i data-lucide="menu"></i>';
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// PANEL LATERAL DEL CARRITO
// ═══════════════════════════════════════════════════════════════════════════

function initCartPanel() {
  const cartBtn     = document.getElementById('cart-btn');
  const closeBtn    = document.getElementById('cart-close-btn');
  const overlay     = document.getElementById('cart-overlay');

  if (cartBtn)  cartBtn.addEventListener('click', openCartPanel);
  if (closeBtn) closeBtn.addEventListener('click', closeCartPanel);
  if (overlay)  overlay.addEventListener('click', closeCartPanel);

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCartPanel();
  });
}

function openCartPanel() {
  const panel   = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  if (panel)   panel.classList.add('open');
  if (overlay) overlay.classList.add('visible');
  if (panel)   panel.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCartPanel() {
  const panel   = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  if (panel)   panel.classList.remove('open');
  if (overlay) overlay.classList.remove('visible');
  if (panel)   panel.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ═══════════════════════════════════════════════════════════════════════════
// FILTROS DEL CATÁLOGO
// ═══════════════════════════════════════════════════════════════════════════

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const grid       = document.getElementById('products-grid');

  if (!filterBtns.length || !grid) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Actualizar botón activo
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const cards  = grid.querySelectorAll('.product-card');

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden-by-filter');
          card.style.display = '';
        } else {
          card.classList.add('hidden-by-filter');
          card.style.display = 'none';
        }
      });
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// EFECTOS DE SCROLL
// ═══════════════════════════════════════════════════════════════════════════

function initScrollEffects() {
  const header = document.getElementById('site-header');

  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMACIONES DE ENTRADA (Intersection Observer)
// ═══════════════════════════════════════════════════════════════════════════

function initFadeInAnimations() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: mostrar todo sin animación
    document.querySelectorAll('.fade-in-up').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  // Observar elementos con clase fade-in-up
  document.querySelectorAll('.fade-in-up, .about-card, .contact-item').forEach(el => {
    el.classList.add('fade-in-up');
    observer.observe(el);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// BOTÓN SCROLL TO TOP
// ═══════════════════════════════════════════════════════════════════════════

function initScrollTopBtn() {
  // Crear el botón dinámicamente
  const btn = document.createElement('button');
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Volver al inicio');
  btn.innerHTML = '<i data-lucide="chevron-up"></i>';
  document.body.appendChild(btn);

  if (window.lucide) window.lucide.createIcons();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTIVE NAV LINK EN SCROLL (Intersection Observer)
// ═══════════════════════════════════════════════════════════════════════════

function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.4
  });

  sections.forEach(section => observer.observe(section));
}

// ═══════════════════════════════════════════════════════════════════════════
// TOAST GLOBAL (accesible desde cart.js y checkout.js)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Muestra una notificación tipo toast en la parte inferior de la pantalla.
 * @param {string} message - Texto del mensaje
 * @param {'success'|'error'|'info'} [type='info'] - Tipo de toast
 * @param {number} [duration=3000] - Duración en ms
 */
function showToast(message, type = 'info', duration = 3000) {
  // Eliminar toast anterior si existe
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  // Mostrar con animación
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Ocultar y eliminar
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILIDAD: Escape HTML (compartida con cart.js)
// ═══════════════════════════════════════════════════════════════════════════

function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIG GLOBAL: Aplica datos de ALUVIMA_CONFIG (config.js) al sitio
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lee window.ALUVIMA_CONFIG y actualiza:
 *  - El iframe del Google Maps (ubicación + zoom)
 *  - El link "Abrir en Google Maps"
 *  - El grid de pasarelas de pago
 */
function applyAluvimaConfig() {
  const cfg = window.ALUVIMA_CONFIG;
  if (!cfg) {
    console.warn('[Aluvima] No se encontró ALUVIMA_CONFIG. Verifica que js/config.js esté cargado.');
    return;
  }

  // 1) Mapa
  renderMap(cfg.mapa);

  // 2) Pasarelas de pago
  renderPasarelas(cfg.pasarelas);

  // 3) Selector de método de pago en el carrito
  const select = document.getElementById('cart-payment-method');
  if (select && cfg.pasarelas?.length) {
    select.innerHTML = cfg.pasarelas.map(p =>
      `<option value="${escapeHtml(p.id)}">${escapeHtml(p.nombre)} (${escapeHtml(p.moneda)})</option>`
    ).join('');
  }

  // Re-inicializar iconos Lucide para los recién inyectados
  if (window.lucide) window.lucide.createIcons();
}

/**
 * Inyecta el iframe del mapa usando una consulta de texto + zoom.
 * Usa el endpoint público de embed (no requiere API key).
 */
function renderMap(mapa) {
  if (!mapa || !mapa.consulta) return;
  const iframe = document.getElementById('aluvima-map');
  const link   = document.getElementById('aluvima-map-link');
  const q = encodeURIComponent(mapa.consulta);
  const z = mapa.zoom || 16;

  if (iframe) {
    iframe.src = `https://www.google.com/maps?q=${q}&z=${z}&output=embed`;
  }
  if (link) {
    link.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  }
}

/**
 * Logos SVG inline por pasarela (más profesionales que un ícono genérico).
 */
const PAYMENT_LOGOS = {
  'pago-movil': `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="pm-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0066B3"/>
          <stop offset="100%" stop-color="#003E70"/>
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#pm-grad)"/>
      <rect x="20" y="12" width="24" height="40" rx="4" fill="#fff"/>
      <rect x="22" y="16" width="20" height="26" fill="#0066B3" opacity=".15"/>
      <circle cx="32" cy="47" r="2" fill="#0066B3"/>
      <path d="M28 24 L32 28 L40 20" stroke="#0066B3" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  'zelle': `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#6D1ED4"/>
      <path d="M22 18 H42 L26 46 H42" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="32" y1="12" x2="32" y2="18" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <line x1="32" y1="46" x2="32" y2="52" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  'binance': `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0B0E11"/>
      <g fill="#F0B90B">
        <path d="M32 16 L36 20 L32 24 L28 20 Z"/>
        <path d="M20 28 L24 32 L20 36 L16 32 Z"/>
        <path d="M44 28 L48 32 L44 36 L40 32 Z"/>
        <path d="M32 40 L36 44 L32 48 L28 44 Z"/>
        <path d="M32 24 L40 32 L32 40 L24 32 Z"/>
      </g>
    </svg>`,
};

/**
 * Renderiza las tarjetas de pasarelas de pago en el grid #payments-grid.
 */

function renderPasarelas(pasarelas) {
  const grid = document.getElementById('payments-grid');
  if (!grid || !pasarelas || !pasarelas.length) return;

  grid.innerHTML = pasarelas.map(p => {
    const datosHTML = p.datos.map(d => `
      <li class="payment-data-row">
        <span class="payment-data-label">${escapeHtml(d.campo)}</span>
        <span class="payment-data-value" data-copy="${escapeHtml(d.valor)}">
          <span class="payment-data-text">${escapeHtml(d.valor)}</span>
          <button class="payment-copy-btn" type="button" aria-label="Copiar ${escapeHtml(d.campo)}" title="Copiar">
            <i data-lucide="copy"></i>
          </button>
        </span>
      </li>
    `).join('');

    const badge = p.etiqueta
      ? `<span class="payment-badge">${escapeHtml(p.etiqueta)}</span>`
      : '';

    const logo = PAYMENT_LOGOS[p.id] || `<div class="payment-logo-fallback" style="background:${p.color}"><i data-lucide="${escapeHtml(p.icono)}"></i></div>`;

    return `
      <article class="payment-card ${p.destacado ? 'is-featured' : ''}" data-id="${escapeHtml(p.id)}" style="--accent:${p.color};">
        <div class="payment-card-glow"></div>
        <header class="payment-card-header">
          <div class="payment-logo">${logo}</div>
          <div class="payment-title-block">
            <h3 class="payment-name">${escapeHtml(p.nombre)}</h3>
            <span class="payment-currency-pill">${escapeHtml(p.moneda)}</span>
          </div>
          ${badge}
        </header>
        <ul class="payment-data-list">${datosHTML}</ul>
        ${p.nota ? `<p class="payment-note"><i data-lucide="info"></i><span>${escapeHtml(p.nota)}</span></p>` : ''}
      </article>
    `;
  }).join('');

  // Listeners de copiado
  grid.querySelectorAll('.payment-copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const valueEl = btn.closest('.payment-data-value');
      const text = valueEl?.dataset.copy || '';
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        showToast(`✅ Copiado: ${text}`, 'success', 2200);
        btn.classList.add('is-copied');
        setTimeout(() => btn.classList.remove('is-copied'), 1500);
      }).catch(() => {
        showToast('No se pudo copiar al portapapeles.', 'error');
      });
    });
  });
}
