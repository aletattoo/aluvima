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
