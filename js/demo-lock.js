/**
 * demo-lock.js — Aluvima Mérida
 * Pantalla de bloqueo con contraseña para el Modo Demo.
 * Protege el contenido del sitio antes del lanzamiento oficial.
 *
 * CONTRASEÑA POR DEFECTO: demo2026
 * Para cambiarla, modifica el valor de DEMO_PASSWORD abajo.
 */

// ─── ⚙️ CONFIGURACIÓN ─────────────────────────────────────────────────────
const DEMO_PASSWORD    = 'demo2026';          // Contraseña de acceso al demo
const SESSION_KEY      = 'aluvima_demo_auth'; // Clave en sessionStorage
const MAX_ATTEMPTS     = 5;                   // Intentos máximos antes de bloqueo temporal
const LOCKOUT_DURATION = 30;                  // Segundos de bloqueo tras agotar intentos
// ──────────────────────────────────────────────────────────────────────────

const DemoLock = (() => {

  let attempts = 0;
  let lockedUntil = null;

  // ─── ELEMENTOS DEL DOM ──────────────────────────────────────────────────
  const getOverlay    = () => document.getElementById('demo-lock-overlay');
  const getMainContent= () => document.getElementById('main-content');
  const getForm       = () => document.getElementById('demo-lock-form');
  const getInput      = () => document.getElementById('demo-password');
  const getError      = () => document.getElementById('demo-lock-error');

  // ─── VERIFICACIÓN DE SESIÓN ─────────────────────────────────────────────

  /**
   * Comprueba si el usuario ya se autenticó en esta sesión del navegador.
   * Usa sessionStorage para que expire al cerrar la pestaña.
   */
  function isAuthenticated() {
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'granted';
    } catch (e) {
      return false;
    }
  }

  /** Guarda la autenticación en sessionStorage */
  function setAuthenticated() {
    try {
      sessionStorage.setItem(SESSION_KEY, 'granted');
    } catch (e) {
      console.warn('[DemoLock] No se pudo guardar sesión:', e);
    }
  }

  // ─── CONTROL DE BLOQUEO TEMPORAL ────────────────────────────────────────

  /** Verifica si el usuario está en período de bloqueo temporal */
  function isLockedOut() {
    if (!lockedUntil) return false;
    return Date.now() < lockedUntil;
  }

  /** Inicia el bloqueo temporal y muestra cuenta regresiva */
  function startLockout() {
    lockedUntil = Date.now() + LOCKOUT_DURATION * 1000;
    const input = getInput();
    const errorEl = getError();
    if (input) input.disabled = true;

    let remaining = LOCKOUT_DURATION;
    const interval = setInterval(() => {
      remaining--;
      if (errorEl) {
        errorEl.textContent = `🔒 Demasiados intentos. Espera ${remaining}s para intentar de nuevo.`;
      }
      if (remaining <= 0) {
        clearInterval(interval);
        lockedUntil = null;
        attempts = 0;
        if (input) {
          input.disabled = false;
          input.focus();
        }
        if (errorEl) errorEl.textContent = '';
      }
    }, 1000);

    if (errorEl) {
      errorEl.textContent = `🔒 Demasiados intentos. Espera ${remaining}s para intentar de nuevo.`;
    }
  }

  // ─── MOSTRAR / OCULTAR ──────────────────────────────────────────────────

  /** Oculta el overlay y revela el contenido principal con animación */
  function unlock() {
    const overlay = getOverlay();
    const content = getMainContent();

    if (overlay) {
      overlay.style.transition = 'opacity 0.5s ease';
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
      }, 500);
    }

    if (content) {
      content.classList.remove('hidden');
      // Pequeño delay para que la transición de opacidad sea visible
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          content.classList.add('visible');
        });
      });
    }

    // Inicializar iconos Lucide ahora que el contenido es visible
    if (window.lucide) {
      setTimeout(() => window.lucide.createIcons(), 100);
    }
  }

  // ─── MANEJO DEL FORMULARIO ──────────────────────────────────────────────

  /** Procesa el intento de autenticación */
  function handleSubmit(e) {
    e.preventDefault();

    // Verificar bloqueo temporal
    if (isLockedOut()) return;

    const input   = getInput();
    const errorEl = getError();
    const entered = input ? input.value.trim() : '';

    if (!entered) {
      if (errorEl) errorEl.textContent = 'Por favor ingresa la contraseña.';
      return;
    }

    if (entered === DEMO_PASSWORD) {
      // ✅ Contraseña correcta
      attempts = 0;
      setAuthenticated();
      if (errorEl) errorEl.textContent = '';
      if (input) input.value = '';

      // Feedback visual antes de desbloquear
      if (errorEl) {
        errorEl.style.color = '#4CAF50';
        errorEl.textContent = '✅ Acceso concedido. Cargando...';
      }
      setTimeout(unlock, 600);

    } else {
      // ❌ Contraseña incorrecta
      attempts++;
      const remaining = MAX_ATTEMPTS - attempts;

      if (input) {
        input.value = '';
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
        input.focus();
      }

      if (attempts >= MAX_ATTEMPTS) {
        startLockout();
      } else {
        if (errorEl) {
          errorEl.style.color = '';
          errorEl.textContent = remaining > 0
            ? `❌ Contraseña incorrecta. ${remaining} intento(s) restante(s).`
            : '❌ Contraseña incorrecta.';
        }
      }
    }
  }

  // ─── INICIALIZACIÓN ─────────────────────────────────────────────────────

  /** Inicializa el sistema de bloqueo demo */
  function init() {
    // Si ya está autenticado en esta sesión, desbloquear directamente
    if (isAuthenticated()) {
      unlock();
      return;
    }

    // Configurar el formulario
    const form = getForm();
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }

    // Enfocar el input automáticamente
    const input = getInput();
    if (input) {
      setTimeout(() => input.focus(), 300);
    }

    // Permitir Enter en el input (ya manejado por el form submit)
    // Agregar efecto de shake al CSS dinámicamente
    injectShakeAnimation();
  }

  /** Inyecta la animación de shake en el DOM */
  function injectShakeAnimation() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        15%       { transform: translateX(-8px); }
        30%       { transform: translateX(8px); }
        45%       { transform: translateX(-6px); }
        60%       { transform: translateX(6px); }
        75%       { transform: translateX(-4px); }
        90%       { transform: translateX(4px); }
      }
      .shake { animation: shake 0.5s ease; }
    `;
    document.head.appendChild(style);
  }

  return { init };
})();

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => DemoLock.init());
