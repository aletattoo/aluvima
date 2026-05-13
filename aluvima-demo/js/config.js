/* ════════════════════════════════════════════════════════════════════════
   ALUVIMA MÉRIDA — ARCHIVO DE CONFIGURACIÓN EDITABLE
   ────────────────────────────────────────────────────────────────────────
   👉 ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR PARA CAMBIAR:
        • Datos de las pasarelas de pago (Pago Móvil, Zelle, Binance Pay)
        • Teléfonos, WhatsApp y correos
        • Dirección y horarios
        • Ubicación del Google Maps
        • Redes sociales

   No hace falta tocar el HTML ni el CSS. Cambia los valores entre
   comillas y guarda. Refresca el navegador y los cambios se aplican.
   ════════════════════════════════════════════════════════════════════════ */

const ALUVIMA_CONFIG = {

  /* ─────────────────────────────────────────────────────────────────────
     1. DATOS DE LA EMPRESA
     ───────────────────────────────────────────────────────────────────── */
  empresa: {
    nombre:        "Aluvima Mérida",
    eslogan:       "Modernizando espacios con calidad y categoría",
    rif:           "J-XXXXXXXXX-X",          // ← pon tu RIF aquí
    direccion:     "Sector El Caucho, Av. Los Próceres",
    ciudad:        "Mérida, Venezuela",
    horario:       "Lun–Vie: 7:30 AM – 12:00 PM · 1:00 PM – 4:00 PM",
  },

  /* ─────────────────────────────────────────────────────────────────────
     2. CONTACTO
     ───────────────────────────────────────────────────────────────────── */
  contacto: {
    whatsapp:      "584247247358",            // formato internacional, sin + ni espacios
    telefono1:     "0424-724 7358",
    telefono2:     "0274-416 0252",
    email:         "ventas@aluvimamerida.com",
    instagram:     "https://instagram.com/aluvimamerida",
    facebook:      "https://facebook.com/aluvimamerida",
  },

  /* ─────────────────────────────────────────────────────────────────────
     3. GOOGLE MAPS
     ───────────────────────────────────────────────────────────────────── */
  mapa: {
    // Búsqueda que se enviará al embed de Google Maps.
    // Cambia este texto por la dirección exacta o coordenadas (ej: "8.5897,-71.1444")
    consulta:      "Sector El Caucho, Av. Los Próceres, Mérida, Venezuela",
    // Zoom: 1 (mundo) → 20 (calle). 16 es lo recomendable para una sede.
    zoom:          16,
  },

  /* ─────────────────────────────────────────────────────────────────────
     4. PASARELAS DE PAGO — VENEZUELA 🇻🇪
     ───────────────────────────────────────────────────────────────────── */
  pasarelas: [

    /* ── PAGO MÓVIL ─────────────────────────────────────────────────── */
    {
      id:          "pago-movil",
      nombre:      "Pago Móvil",
      moneda:      "Bs",
      icono:       "smartphone",              // ícono Lucide
      color:       "#0066B3",                  // azul Mercantil (cámbialo si usas otro banco)
      destacado:   true,                       // muestra etiqueta "Más usado"
      etiqueta:    "Más usado",
      datos: [
        { campo: "Banco",     valor: "Mercantil (0105)" },
        { campo: "Cédula",    valor: "V-XXXXXXXX" },
        { campo: "Teléfono",  valor: "0424-724 7358" },
      ],
      nota: "Envía el comprobante al WhatsApp para confirmar tu pedido.",
    },

    /* ── ZELLE ──────────────────────────────────────────────────────── */
    {
      id:          "zelle",
      nombre:      "Zelle",
      moneda:      "USD",
      icono:       "dollar-sign",
      color:       "#6D1ED4",                  // morado Zelle
      destacado:   false,
      etiqueta:    "",
      datos: [
        { campo: "Correo",    valor: "pagos@aluvimamerida.com" },
        { campo: "Titular",   valor: "Aluvima Mérida C.A." },
      ],
      nota: "Coloca tu nombre y número de pedido en el concepto de la transferencia.",
    },

    /* ── BINANCE PAY ────────────────────────────────────────────────── */
    {
      id:          "binance",
      nombre:      "Binance Pay",
      moneda:      "USDT",
      icono:       "bitcoin",
      color:       "#F0B90B",                  // amarillo Binance
      destacado:   false,
      etiqueta:    "Cripto",
      datos: [
        { campo: "Pay ID",    valor: "XXXXXXXX" },
        { campo: "Usuario",   valor: "@aluvimamerida" },
        { campo: "Red",       valor: "BSC / TRON (USDT)" },
      ],
      nota: "Solo USDT. Asegúrate de seleccionar la red correcta antes de enviar.",
    },

  ],

};

// Hacer accesible la configuración de forma global (no editar)
window.ALUVIMA_CONFIG = ALUVIMA_CONFIG;
