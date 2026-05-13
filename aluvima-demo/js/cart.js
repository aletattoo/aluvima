/**
 * cart.js — Aluvima Mérida
 * Lógica completa del carrito de compras con persistencia en localStorage.
 * Funciones: agregar, actualizar cantidad, eliminar, calcular totales, renderizar.
 */

const Cart = (() => {
  // ─── CONSTANTES ───────────────────────────────────────────────────────────
  const STORAGE_KEY = 'aluvima_cart';

  // ─── ESTADO INTERNO ───────────────────────────────────────────────────────
  let items = [];

  // ─── PERSISTENCIA ─────────────────────────────────────────────────────────

  /** Carga el carrito desde localStorage */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      items = raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('[Cart] Error al cargar desde localStorage:', e);
      items = [];
    }
  }

  /** Guarda el carrito en localStorage */
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('[Cart] Error al guardar en localStorage:', e);
    }
  }

  // ─── OPERACIONES CRUD ─────────────────────────────────────────────────────

  /**
   * Agrega un producto al carrito o incrementa su cantidad si ya existe.
   * @param {Object} product - Objeto del catálogo PRODUCTS
   * @param {number} [qty=1] - Cantidad a agregar
   */
  function addItem(product, qty = 1) {
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id:    product.id,
        name:  product.name,
        price: product.price,
        unit:  product.unit,
        qty:   qty
      });
    }
    save();
    render();
    updateCounter();
    animateCartBtn();
    showToast(`✅ "${product.name}" agregado al pedido`, 'success');
  }

  /**
   * Actualiza la cantidad de un ítem. Si qty <= 0, lo elimina.
   * @param {number} id - ID del producto
   * @param {number} qty - Nueva cantidad
   */
  function updateQty(id, qty) {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    const item = items.find(i => i.id === id);
    if (item) {
      item.qty = qty;
      save();
      render();
      updateCounter();
    }
  }

  /**
   * Elimina un ítem del carrito por su ID.
   * @param {number} id - ID del producto
   */
  function removeItem(id) {
    items = items.filter(i => i.id !== id);
    save();
    render();
    updateCounter();
  }

  /** Vacía completamente el carrito */
  function clear() {
    items = [];
    save();
    render();
    updateCounter();
  }

  // ─── CÁLCULOS ─────────────────────────────────────────────────────────────

  /** Retorna el subtotal (suma de precio × cantidad de cada ítem) */
  function getSubtotal() {
    return items.reduce((acc, i) => acc + i.price * i.qty, 0);
  }

  /** Retorna el total (en esta versión demo = subtotal, sin impuestos) */
  function getTotal() {
    return getSubtotal();
  }

  /** Retorna la cantidad total de ítems (suma de cantidades) */
  function getTotalQty() {
    return items.reduce((acc, i) => acc + i.qty, 0);
  }

  /** Retorna una copia del array de ítems */
  function getItems() {
    return [...items];
  }

  // ─── RENDERIZADO ──────────────────────────────────────────────────────────

  /** Formatea un número como precio en dólares */
  function formatPrice(amount) {
    return `$${amount.toFixed(2)}`;
  }

  /** Actualiza el contador de ítems en el botón del header */
  function updateCounter() {
    const counter = document.getElementById('cart-count');
    if (!counter) return;
    const qty = getTotalQty();
    counter.textContent = qty;

    // Animación de "bump" al cambiar
    counter.classList.remove('bump');
    void counter.offsetWidth; // reflow para reiniciar animación
    counter.classList.add('bump');
    setTimeout(() => counter.classList.remove('bump'), 300);
  }

  /** Anima el botón del carrito en el header */
  function animateCartBtn() {
    const btn = document.getElementById('cart-btn');
    if (!btn) return;
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  }

  /** Renderiza todos los ítems en el panel lateral del carrito */
  function render() {
    const container = document.getElementById('cart-items-container');
    const emptyMsg  = document.getElementById('cart-empty');
    const footer    = document.getElementById('cart-footer');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl    = document.getElementById('cart-total');

    if (!container) return;

    if (items.length === 0) {
      // Mostrar estado vacío
      container.innerHTML = '';
      container.appendChild(emptyMsg || createEmptyState());
      if (emptyMsg) emptyMsg.style.display = 'flex';
      if (footer) footer.style.display = 'none';
      return;
    }

    // Ocultar mensaje vacío
    if (emptyMsg) emptyMsg.style.display = 'none';
    if (footer) footer.style.display = 'block';

    // Renderizar ítems
    container.innerHTML = '';
    items.forEach(item => {
      const el = createCartItemElement(item);
      container.appendChild(el);
    });

    // Actualizar totales
    if (subtotalEl) subtotalEl.textContent = formatPrice(getSubtotal());
    if (totalEl)    totalEl.textContent    = formatPrice(getTotal());

    // Re-inicializar iconos Lucide en los nuevos elementos
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /** Crea el elemento DOM de un ítem del carrito */
  function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.id = item.id;

    div.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
        <div class="cart-item-unit-price">${formatPrice(item.price)} / ${escapeHtml(item.unit)}</div>
        <div class="cart-item-controls">
          <button class="qty-btn qty-minus" data-id="${item.id}" aria-label="Reducir cantidad">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn qty-plus" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
        <button class="cart-item-remove" data-id="${item.id}" aria-label="Eliminar ${escapeHtml(item.name)}">
          <i data-lucide="trash-2"></i>
        </button>
        <span class="cart-item-subtotal">${formatPrice(item.price * item.qty)}</span>
      </div>
    `;

    // Eventos de cantidad y eliminación
    div.querySelector('.qty-minus').addEventListener('click', () => updateQty(item.id, item.qty - 1));
    div.querySelector('.qty-plus').addEventListener('click', () => updateQty(item.id, item.qty + 1));
    div.querySelector('.cart-item-remove').addEventListener('click', () => removeItem(item.id));

    return div;
  }

  /** Crea el estado vacío del carrito */
  function createEmptyState() {
    const div = document.createElement('div');
    div.id = 'cart-empty';
    div.className = 'cart-empty';
    div.innerHTML = `
      <i data-lucide="package-open"></i>
      <p>Tu carrito está vacío.</p>
      <a href="#catalogo" class="btn btn-outline-dark btn-sm">Ver Catálogo</a>
    `;
    return div;
  }

  // ─── UTILIDADES ───────────────────────────────────────────────────────────

  /** Escapa caracteres HTML para prevenir XSS */
  function escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(str).replace(/[&<>"']/g, m => map[m]);
  }

  // ─── INICIALIZACIÓN ───────────────────────────────────────────────────────

  /** Inicializa el carrito: carga datos y renderiza */
  function init() {
    load();
    render();
    updateCounter();
  }

  // ─── API PÚBLICA ──────────────────────────────────────────────────────────
  return {
    init,
    addItem,
    updateQty,
    removeItem,
    clear,
    getItems,
    getSubtotal,
    getTotal,
    getTotalQty,
    formatPrice
  };
})();
