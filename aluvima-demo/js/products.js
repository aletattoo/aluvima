/**
 * products.js — Aluvima Mérida
 * Catálogo de productos en formato JSON/JS (datos de prueba / MODO DEMO)
 * Los precios son REFERENCIALES y solo para demostración interna.
 */

const PRODUCTS = [
  // ─── VIDRIO ───────────────────────────────────────────────────────────────
  {
    id: 1,
    name: "Vidrio Templado de Seguridad 4mm",
    category: "vidrio",
    description: "Vidrio templado de seguridad en medidas estándar. Disponibilidad inmediata. Ideal para puertas, ventanas y divisiones interiores.",
    price: 18.50,
    unit: "m²",
    badge: "badge-vidrio",
    badgeLabel: "Vidrio",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75",
    featured: true
  },
  {
    id: 2,
    name: "Vidrio Templado de Seguridad 6mm",
    category: "vidrio",
    description: "Mayor resistencia y seguridad. Perfecto para fachadas, barandas de vidrio y espacios de alto tráfico.",
    price: 26.00,
    unit: "m²",
    badge: "badge-vidrio",
    badgeLabel: "Vidrio",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=75",
    featured: false
  },
  {
    id: 3,
    name: "Vidrio Laminado a la Medida",
    category: "vidrio",
    description: "Láminas de vidrio cortadas exactamente a tu medida. Consulta disponibilidad de espesores: 3mm, 4mm, 6mm y 8mm.",
    price: 22.00,
    unit: "m²",
    badge: "badge-vidrio",
    badgeLabel: "Vidrio",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=75",
    featured: false
  },
  {
    id: 4,
    name: "Vidrio Reflectivo Bronce / Gris",
    category: "vidrio",
    description: "Vidrio con capa reflectiva para control solar. Reduce el calor y aporta privacidad con un acabado estético moderno.",
    price: 34.00,
    unit: "m²",
    badge: "badge-vidrio",
    badgeLabel: "Vidrio",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=75",
    featured: false
  },

  // ─── ALUMINIO ─────────────────────────────────────────────────────────────
  {
    id: 5,
    name: "Ventana Corrediza de Aluminio",
    category: "aluminio",
    description: "Ventana corrediza de aluminio anodizado con vidrio de 4mm incluido. Fabricación e instalación a medida. Acabado natural o lacado.",
    price: 85.00,
    unit: "m²",
    badge: "badge-aluminio",
    badgeLabel: "Aluminio",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=75",
    featured: true
  },
  {
    id: 6,
    name: "Ventana Panorámica Fija",
    category: "aluminio",
    description: "Ventana fija de gran formato para maximizar la entrada de luz natural. Estructura de aluminio de alta resistencia con sellado hermético.",
    price: 95.00,
    unit: "m²",
    badge: "badge-aluminio",
    badgeLabel: "Aluminio",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=75",
    featured: false
  },
  {
    id: 7,
    name: "Puerta de Aluminio y Vidrio",
    category: "aluminio",
    description: "Puerta principal o de servicio en aluminio con panel de vidrio templado. Diseño moderno, cierre seguro y acabado profesional.",
    price: 220.00,
    unit: "unidad",
    badge: "badge-aluminio",
    badgeLabel: "Aluminio",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=75",
    featured: true
  },
  {
    id: 8,
    name: "División de Oficina en Aluminio",
    category: "aluminio",
    description: "Tabiques y divisiones modulares para oficinas y locales comerciales. Optimiza el espacio con un diseño limpio y profesional.",
    price: 110.00,
    unit: "m²",
    badge: "badge-aluminio",
    badgeLabel: "Aluminio",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=75",
    featured: false
  },

  // ─── ACERO INOXIDABLE ─────────────────────────────────────────────────────
  {
    id: 9,
    name: "Baranda de Acero Inoxidable",
    category: "acero",
    description: "Barandas y pasamanos en acero inoxidable 304. Acabado espejo o satinado. Instalación en escaleras, balcones y terrazas.",
    price: 145.00,
    unit: "ml",
    badge: "badge-acero",
    badgeLabel: "Acero",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75",
    featured: true
  },
  {
    id: 10,
    name: "Estructura Metálica en Acero",
    category: "acero",
    description: "Estructuras y marcos en acero inoxidable para fachadas, pérgolas y elementos decorativos. Resistencia y elegancia garantizadas.",
    price: 180.00,
    unit: "m²",
    badge: "badge-acero",
    badgeLabel: "Acero",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=75",
    featured: false
  },
  {
    id: 11,
    name: "Puerta Enrollable de Acero",
    category: "acero",
    description: "Puerta enrollable de acero galvanizado para locales comerciales y garajes. Alta seguridad, operación manual o motorizada.",
    price: 350.00,
    unit: "unidad",
    badge: "badge-acero",
    badgeLabel: "Acero",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=75",
    featured: false
  },

  // ─── ACCESORIOS ───────────────────────────────────────────────────────────
  {
    id: 12,
    name: "Kit de Herrajes para Vidrio",
    category: "accesorios",
    description: "Bisagras, manijas, topes y soportes de acero inoxidable para puertas y ventanas de vidrio. Acabado cromado de alta durabilidad.",
    price: 28.00,
    unit: "kit",
    badge: "badge-accesorios",
    badgeLabel: "Accesorios",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&q=75",
    featured: false
  },
  {
    id: 13,
    name: "Perfil de Aluminio Estructural",
    category: "accesorios",
    description: "Perfiles de aluminio extruido para fabricación de ventanas, puertas y estructuras. Disponibles en varios calibres y acabados.",
    price: 12.00,
    unit: "ml",
    badge: "badge-accesorios",
    badgeLabel: "Accesorios",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=75",
    featured: false
  },
  {
    id: 14,
    name: "Silicona Estructural y Sellante",
    category: "accesorios",
    description: "Silicona estructural neutra y de acetato para sellado de vidrios y aluminio. Resistente a la intemperie y rayos UV.",
    price: 8.50,
    unit: "tubo",
    badge: "badge-accesorios",
    badgeLabel: "Accesorios",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&q=75",
    featured: false
  },
  {
    id: 15,
    name: "Ruedas y Rieles para Ventanas",
    category: "accesorios",
    description: "Repuestos y accesorios de deslizamiento para ventanas corredizas. Compatibles con los principales sistemas de aluminio del mercado.",
    price: 15.00,
    unit: "par",
    badge: "badge-accesorios",
    badgeLabel: "Accesorios",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=75",
    featured: false
  }
];

// Exportar para uso en otros módulos (compatible con script tag clásico)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRODUCTS;
}
