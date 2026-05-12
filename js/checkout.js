/**
 * checkout.js — Aluvima Mérida
 * Pasarela de checkout vía WhatsApp.
 *
 * INSTRUCCIONES:
 *   1. Cambia el valor de NUMERO_DESTINO por tu número personal de pruebas.
 *   2. Formato: código de país + número, sin espacios ni guiones.
 *      Ejemplo Venezuela: "584241234567"
 *   3. Cuando el sitio esté listo para producción, reemplaza con el número
 *      oficial de Aluvima Mérida: 584247247358
 */

// ─── ⚙️ CONFIGURACIÓN — EDITA AQUÍ ────────────────────────────────────────
// const NUMERO_DESTINO = "58XXXXXXXXXX"; // ← PON AQUÍ TU NÚMERO DE PRUEBAS
const NUMERO_DESTINO = "584247247358"; // Número oficial (reemplazar para pruebas)
// ──────────────────────────────────────────────────────────────────────────

const Checkout = (() => {

  /**
   * Genera el mensaje de WhatsApp con el resumen del pedido.
   * Usa formato de WhatsApp: *negrita*, saltos de línea limpios.
   * @param {Array} items  - Array de ítems del carrito
   * @param {number} total - Total calculado
   * @returns {string} Mensaje formateado listo para WhatsApp
   */
  function buildWhatsAppMessage(items, total) {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-VE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const hora = now.toLocaleTimeString('es-VE', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Encabezado con aviso de MODO DEMO
    let msg = '';
    msg += `⚠️ *PEDIDO DE PRUEBA / MODO DEMO* ⚠️\n`;
    msg += `_Este mensaje fue generado desde el sitio de demostración de Aluvima Mérida. No es un pedido real._\n`;
    msg += `\n`;

    // Datos del pedido
    msg += `🏢 *ALUVIMA MÉRIDA*\n`;
    msg += `_Modernizando espacios con calidad y categoría._\n`;
    msg += `\n`;
    msg += `📋 *RESUMEN DE PEDIDO*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📅 Fecha: ${fecha}\n`;
    msg += `🕐 Hora: ${hora}\n`;
    msg += `\n`;

    // Detalle de productos
    msg += `🛒 *PRODUCTOS SOLICITADOS:*\n`;
    msg += `─────────────────────────\n`;

    items.forEach((item, index) => {
      const subtotal = (item.price * item.qty).toFixed(2);
      msg += `\n*${index + 1}. ${item.name}*\n`;
      msg += `   • Cantidad: ${item.qty} ${item.unit}\n`;
      msg += `   • Precio unitario: $${item.price.toFixed(2)}\n`;
      msg += `   • Subtotal: *$${subtotal}*\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 *TOTAL ESTIMADO: $${total.toFixed(2)}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `\n`;

    // Nota de precios
    msg += `📌 _Los precios son referenciales y están sujetos a confirmación según disponibilidad y medidas exactas._\n`;
    msg += `\n`;

    // Datos de contacto
    msg += `📍 *Visítanos:*\n`;
    msg += `Sector El Caucho, Av. Los Próceres\n`;
    msg += `Mérida, Venezuela\n`;
    msg += `\n`;
    msg += `🕐 *Horario:* Lun–Vie 7:30 AM – 12:00 PM · 1:00 PM – 4:00 PM\n`;
    msg += `\n`;

    // Pie de modo demo
    msg += `─────────────────────────\n`;
    msg += `⚠️ *MODO DEMO — PEDIDO DE PRUEBA* ⚠️\n`;
    msg += `_Generado desde: aluvima-merida (sitio privado de desarrollo)_`;

    return msg;
  }

  /**
   * Ejecuta el proceso de checkout:
   * 1. Obtiene los ítems del carrito
   * 2. Valida que no esté vacío
   * 3. Construye el mensaje
   * 4. Codifica y redirige a WhatsApp
   */
  function processCheckout() {
    const items = Cart.getItems();

    // Validación: carrito vacío
    if (!items || items.length === 0) {
      showToast('⚠️ Tu carrito está vacío. Agrega productos primero.', 'error');
      return;
    }

    const total = Cart.getTotal();
    const message = buildWhatsAppMessage(items, total);

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);

    // Construir URL de WhatsApp API
    const whatsappURL = `https://wa.me/${NUMERO_DESTINO}?text=${encodedMessage}`;

    // Confirmación antes de redirigir
    const confirmed = confirm(
      `📋 RESUMEN DEL PEDIDO DE PRUEBA\n\n` +
      `Productos: ${items.length} tipo(s)\n` +
      `Total estimado: $${total.toFixed(2)}\n\n` +
      `⚠️ MODO DEMO: Este pedido se enviará como mensaje de prueba a WhatsApp.\n\n` +
      `¿Deseas continuar?`
    );

    if (!confirmed) return;

    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappURL, '_blank', 'noopener,noreferrer');

    // Feedback al usuario
    showToast('✅ Redirigiendo a WhatsApp...', 'success');

    // Opcional: limpiar carrito después del checkout
    // Cart.clear();
  }

  /**
   * Inicializa el botón de checkout
   */
  function init() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', processCheckout);
    }
  }

  return { init, processCheckout };
})();
