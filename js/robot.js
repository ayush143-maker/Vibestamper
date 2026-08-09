/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — ROBOT.JS
   Mascot logo injector — swaps in the VibeStamp mascot image and
   drives its "expression" through CSS animation classes.

   EDIT TARGET: Yes — swap MASCOT_LOGO_SRC or tweak animation classes
   ═══════════════════════════════════════════════════════════════ */

// ── SECTION: Mascot Configuration ────────────────────────────
const MASCOT_LOGO_SRC = 'assets/logo/byte-mascot.png';

// Each "expression" maps to a CSS animation class applied to the
// mascot <img>. There's one shared static artwork — the different
// states are communicated through motion/glow instead of redrawn
// facial features.
const EXPRESSION_CLASS = {
  neutral:   'vs-mascot--neutral',
  scanning:  'vs-mascot--scanning',
  impressed: 'vs-mascot--impressed',
  confused:  'vs-mascot--confused',
  certified: 'vs-mascot--certified',
};

// ── SECTION: Markup Generator ─────────────────────────────────
/**
 * Generate the VibeStamp mascot markup
 * @param {string} expression - One of: neutral, scanning, impressed, confused, certified
 * @param {number} size - Rendered box size in px (mascot is aspect-fit inside it)
 * @returns {string} HTML markup
 */
function generateRobotSVG(expression = 'neutral', size = 64) {
  const cls = EXPRESSION_CLASS[expression] || EXPRESSION_CLASS.neutral;
  return `
    <img
      src="${MASCOT_LOGO_SRC}"
      alt=""
      class="vs-robot ${cls}"
      data-expression="${expression}"
      draggable="false"
      style="width:${size}px;height:auto;max-height:${size}px;object-fit:contain;"
    />
  `;
}

// ── SECTION: Inject Mascot into DOM Element ──────────────────
/**
 * Inject the mascot into a DOM element
 * @param {HTMLElement} element - Target element
 * @param {string} expression - Expression name
 * @param {number} size - Rendered size
 */
function injectRobot(element, expression = 'neutral', size = 64) {
  if (!element) return;
  element.innerHTML = generateRobotSVG(expression, size);
}

/**
 * Change mascot expression on an existing element.
 * Updates the animation class in place rather than re-injecting the
 * <img>, so the browser doesn't re-decode/flash the image on every
 * processing step.
 * @param {HTMLElement} element - Element containing the mascot img
 * @param {string} expression - New expression
 * @param {number} size - Rendered size
 */
function setRobotExpression(element, expression = 'neutral', size = 64) {
  if (!element) return;
  const img = element.querySelector('img.vs-robot');
  if (!img) {
    injectRobot(element, expression, size);
    return;
  }
  const cls = EXPRESSION_CLASS[expression] || EXPRESSION_CLASS.neutral;
  img.className = `vs-robot ${cls}`;
  img.dataset.expression = expression;
  img.style.width = size + 'px';
  img.style.maxHeight = size + 'px';
}

// ── SECTION: CSS Animations for Mascot States ────────────────
// Injected once into the page
(function injectRobotStyles() {
  if (document.getElementById('vs-robot-styles')) return;
  const style = document.createElement('style');
  style.id = 'vs-robot-styles';
  style.textContent = `
    .vs-robot { display: block; }

    @keyframes vsMascotPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.55; }
    }
    @keyframes vsMascotBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    @keyframes vsMascotWiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-6deg); }
      75% { transform: rotate(6deg); }
    }
    @keyframes vsMascotGlow {
      0%, 100% { filter: drop-shadow(0 0 0px #18E58A); }
      50% { filter: drop-shadow(0 0 10px #18E58A); }
    }

    .vs-mascot--neutral { animation: none; filter: none; }
    .vs-mascot--scanning { animation: vsMascotPulse 1s ease-in-out infinite; }
    .vs-mascot--impressed { animation: vsMascotBounce 0.6s ease-in-out infinite; }
    .vs-mascot--confused { animation: vsMascotWiggle 0.5s ease-in-out infinite; }
    .vs-mascot--certified { animation: vsMascotGlow 1.2s ease-in-out infinite; }
  `;
  document.head.appendChild(style);
})();

// ── SECTION: Export ──────────────────────────────────────────
if (typeof window !== 'undefined') {
  window.VibeStampRobot = {
    generate: generateRobotSVG,
    inject: injectRobot,
    setExpression: setRobotExpression,
    expressions: Object.keys(EXPRESSION_CLASS),
    logoSrc: MASCOT_LOGO_SRC,
  };
}
