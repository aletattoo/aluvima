# Aluvima Mérida — Sitio Web Oficial (MODO DEMO)

> ⚠️ **SITIO EN MODO DEMO / PRIVADO** — No compartir con clientes. Solo para revisión interna.

---

## 📋 Descripción

Landing page de alta conversión para **Aluvima Mérida**, empresa especializada en distribución, fabricación e instalación de aluminio, vidrio y acero en Mérida, Venezuela.

**Eslogan:** *"Modernizando espacios con calidad y categoría."*

---

## 🗂️ Estructura del Proyecto

```
aluvima-merida/
├── index.html          ← Página principal (todas las secciones)
├── css/
│   └── styles.css      ← Estilos completos (paleta vino/acero/blanco)
├── js/
│   ├── products.js     ← Catálogo de productos (datos de prueba)
│   ├── cart.js         ← Lógica del carrito (localStorage)
│   ├── checkout.js     ← Pasarela WhatsApp
│   ├── demo-lock.js    ← Pantalla de bloqueo con contraseña
│   └── main.js         ← Orquestador principal
└── assets/             ← (Carpeta para imágenes locales futuras)
```

---

## 🚀 Cómo Usar

### Opción 1: Abrir directamente en el navegador
1. Abre la carpeta `aluvima-merida/` en VS Code.
2. Haz clic derecho en `index.html` → **"Open with Live Server"** (extensión recomendada).
3. O simplemente arrastra `index.html` a tu navegador.

### Opción 2: Desplegar en GitHub Pages
1. Crea un repositorio en GitHub (puede ser privado).
2. Sube todos los archivos de esta carpeta a la raíz del repositorio.
3. Ve a **Settings → Pages → Source → main branch → / (root)**.
4. GitHub Pages generará una URL. Compártela solo con quien deba revisar el demo.

> **Nota:** El sitio tiene `<meta name="robots" content="noindex, nofollow">` para evitar indexación en Google.

---

## 🔐 Acceso al Demo

La página está protegida con una contraseña de acceso:

| Campo | Valor |
|-------|-------|
| **Contraseña** | `demo2026` |

Para cambiarla, edita la constante `DEMO_PASSWORD` en [`js/demo-lock.js`](js/demo-lock.js):
```js
const DEMO_PASSWORD = 'demo2026'; // ← Cambia aquí
```

---

## 📱 Configurar WhatsApp de Pruebas

Para recibir los pedidos de prueba en tu número personal, edita [`js/checkout.js`](js/checkout.js):

```js
// Línea ~14 — Reemplaza con tu número personal de pruebas
// const NUMERO_DESTINO = "58XXXXXXXXXX"; // ← TU NÚMERO DE PRUEBAS

const NUMERO_DESTINO = "584247247358"; // Número oficial (cambiar para pruebas)
```

**Formato del número:** código de país + número, sin espacios ni guiones.
- Venezuela: `58` + número sin el `0` inicial → `584241234567`

---

## 🛒 Funcionalidades Implementadas

| Funcionalidad | Estado |
|---------------|--------|
| Hero section con CTA | ✅ |
| Sección "Quiénes Somos" (6 tarjetas) | ✅ |
| Catálogo con 15 productos (4 categorías) | ✅ |
| Filtros por categoría | ✅ |
| Carrito lateral con localStorage | ✅ |
| Agregar / sumar / restar / eliminar ítems | ✅ |
| Contador en tiempo real en el header | ✅ |
| Cálculo de subtotal y total | ✅ |
| Checkout vía WhatsApp con mensaje formateado | ✅ |
| Aviso "⚠️ PEDIDO DE PRUEBA / MODO DEMO" en el mensaje | ✅ |
| Pantalla de bloqueo con contraseña | ✅ |
| Bloqueo temporal tras 5 intentos fallidos | ✅ |
| Meta `noindex` para evitar indexación | ✅ |
| Diseño responsive (móvil, tablet, desktop) | ✅ |
| Menú hamburguesa en móvil | ✅ |
| Animaciones de entrada (Intersection Observer) | ✅ |
| Botón "Scroll to Top" | ✅ |
| Sección de contacto con mapa | ✅ |
| Footer completo | ✅ |

---

## 🎨 Paleta de Colores

| Nombre | Hex | Uso |
|--------|-----|-----|
| Vino Tinto | `#8B1A2B` | Color principal de marca |
| Vino Oscuro | `#6A1220` | Hover / estados activos |
| Acero | `#8A9BA8` | Acentos secundarios |
| Blanco | `#FFFFFF` | Fondos limpios |
| Negro Moderno | `#1A1A2E` | Texto y footer |

---

## 📦 Dependencias Externas (CDN)

| Librería | Versión | Uso |
|----------|---------|-----|
| [Lucide Icons](https://lucide.dev/) | Latest | Iconografía |
| [Google Fonts](https://fonts.google.com/) | — | Montserrat + Open Sans |

> No se requiere `npm install` ni ningún proceso de build. El proyecto es **100% HTML/CSS/JS vanilla**.

---

## 📞 Datos de Contacto Oficiales

- **Dirección:** Sector El Caucho, Av. Los Próceres — Mérida, Venezuela
- **Teléfonos:** 0424-724 7358 · 0274-416 0252
- **Horario:** Lunes a Viernes, 7:30 AM – 12:00 PM · 1:00 PM – 4:00 PM

---

## ⚠️ Notas Importantes para el Lanzamiento

Antes de publicar el sitio oficialmente, recuerda:

1. **Eliminar** la pantalla de bloqueo demo (o desactivar `DemoLock.init()` en `demo-lock.js`).
2. **Cambiar** `<meta name="robots" content="noindex">` a `<meta name="robots" content="index, follow">`.
3. **Actualizar** `NUMERO_DESTINO` en `checkout.js` con el número oficial de Aluvima.
4. **Eliminar** el banner amarillo de "MODO DEMO" del `index.html`.
5. **Actualizar** los precios referenciales con los precios reales.
6. **Reemplazar** el iframe del mapa con las coordenadas exactas del local.

---

*Desarrollado con ❤️ para Aluvima Mérida — 2026*
