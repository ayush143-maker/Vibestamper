/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — CANVAS.JS
   Canvas rendering engine with reusable drawing primitives

   EDIT TARGET: Yes — modify primitives, add new drawing utilities,
   or change the high-res scaling logic
   ═══════════════════════════════════════════════════════════════ */

// ── SECTION: Canvas Constants ────────────────────────────────
const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1350;
const CARD_RATIO = CARD_WIDTH / CARD_HEIGHT; // 4:5

// ── SECTION: Mascot Logo Preload ─────────────────────────────
// Loaded once, reused by drawRobotMark() on every card render.
// robot.js (loaded before this file) is the single source of truth
// for the logo path — fall back to the literal only if it's absent.
const MASCOT_CARD_LOGO_SRC = (typeof window !== 'undefined' && window.VibeStampRobot && window.VibeStampRobot.logoSrc)
  || 'assets/logo/byte-mascot.png';
let _mascotImg = null;
let _mascotLoadPromise = null;

function loadMascotImage() {
  if (_mascotLoadPromise) return _mascotLoadPromise;
  _mascotLoadPromise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { _mascotImg = img; resolve(img); };
    img.onerror = () => {
      console.warn('VibeStamp: mascot logo failed to load, falling back to geometric mark');
      resolve(null);
    };
    img.src = MASCOT_CARD_LOGO_SRC;
  });
  return _mascotLoadPromise;
}

// Kick off loading as soon as the script runs, so it's almost
// always ready well before the first card render (which also
// awaits this promise as a safety net).
loadMascotImage();

// ── SECTION: Color Palette (for canvas use) ──────────────────
const PALETTE = {
  bg:           '#070909',
  bgElevated:   '#111414',
  surface:      '#181C1A',
  border:       '#242A27',
  borderLight:  '#2A302C',
  accent:       '#18E58A',
  accentDim:    '#0B9F5B',
  accentGlow:   'rgba(24, 229, 138, 0.15)',
  text:         '#F2F5F2',
  textMuted:    '#8A938E',
  textDim:      '#5A635E',
  white:        '#FFFFFF',
  black:        '#000000',
};

// ── SECTION: Font Presets ──────────────────────────────────
const FONTS = {
  display: (size, weight = '500') => `${weight} ${size}px "Space Grotesk", sans-serif`,
  body:    (size, weight = '400') => `${weight} ${size}px "Inter", sans-serif`,
  mono:    (size, weight = '400') => `${weight} ${size}px "IBM Plex Mono", monospace`,
};

// ── SECTION: Canvas Setup ────────────────────────────────────
/**
 * Create and configure a high-resolution canvas
 * @returns {Object} { canvas, ctx, width, height }
 */
function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const ctx = canvas.getContext('2d', { alpha: false });

  // Enable high-quality image rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  return { canvas, ctx, width: CARD_WIDTH, height: CARD_HEIGHT };
}

// ── SECTION: Background Primitives ───────────────────────────

/**
 * Fill entire canvas with a solid color
 */
function drawBackground(ctx, color = PALETTE.bg) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
}

/**
 * Draw a subtle noise texture overlay
 */
function drawNoise(ctx, opacity = 0.03) {
  const imageData = ctx.getImageData(0, 0, CARD_WIDTH, CARD_HEIGHT);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);

  // Apply opacity via overlay
  ctx.fillStyle = `rgba(7, 9, 9, ${1 - opacity})`;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
}

/**
 * Draw a gradient background
 */
function drawGradientBackground(ctx, colorTop, colorBottom) {
  const grad = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
  grad.addColorStop(0, colorTop);
  grad.addColorStop(1, colorBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
}

// ── SECTION: Text Primitives ───────────────────────────────

/**
 * Draw text with precise control
 */
function drawText(ctx, text, x, y, options = {}) {
  const {
    font = FONTS.body(24),
    color = PALETTE.text,
    align = 'left',
    baseline = 'alphabetic',
    maxWidth = null,
    letterSpacing = 0,
  } = options;

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;

  if (letterSpacing !== 0) {
    // Manual letter spacing
    const chars = String(text).split('');
    let currentX = x;

    if (align === 'center') {
      const totalWidth = ctx.measureText(text).width + (chars.length - 1) * letterSpacing;
      currentX = x - totalWidth / 2;
    } else if (align === 'right') {
      const totalWidth = ctx.measureText(text).width + (chars.length - 1) * letterSpacing;
      currentX = x - totalWidth;
    }

    chars.forEach(char => {
      ctx.fillText(char, currentX, y);
      currentX += ctx.measureText(char).width + letterSpacing;
    });
  } else {
    ctx.fillText(text, x, y, maxWidth);
  }
}

/**
 * Draw outlined/stroke text
 */
function drawStrokeText(ctx, text, x, y, options = {}) {
  const {
    font = FONTS.display(48, '700'),
    strokeColor = PALETTE.accent,
    fillColor = null,
    lineWidth = 1,
    align = 'left',
    baseline = 'alphabetic',
  } = options;

  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeColor;

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillText(text, x, y);
  }

  ctx.strokeText(text, x, y);
}

/**
 * Draw multi-line text block
 */
function drawTextBlock(ctx, lines, x, y, options = {}) {
  const {
    font = FONTS.body(20),
    color = PALETTE.text,
    lineHeight = 28,
    align = 'left',
  } = options;

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';

  lines.forEach((line, i) => {
    ctx.fillText(line, x, y + i * lineHeight);
  });
}

// ── SECTION: Micro Labels ────────────────────────────────────

/**
 * Draw a tiny technical label (e.g., "AURA INDEX", "CERT ID")
 */
function drawMicroLabel(ctx, text, x, y, options = {}) {
  const {
    fontSize = 11,
    color = PALETTE.textDim,
    align = 'left',
    letterSpacing = 0.12,
  } = options;

  drawText(ctx, text, x, y, {
    font: FONTS.mono(fontSize),
    color,
    align,
    letterSpacing: fontSize * letterSpacing,
  });
}

/**
 * Draw an index number like "01", "02" with label
 */
function drawIndex(ctx, number, label, x, y, options = {}) {
  const { color = PALETTE.textMuted } = options;

  const numStr = String(number).padStart(2, '0');
  drawText(ctx, numStr, x, y, {
    font: FONTS.mono(10),
    color: PALETTE.textDim,
    align: 'left',
  });

  drawText(ctx, label, x + 18, y, {
    font: FONTS.mono(10),
    color,
    align: 'left',
  });
}

// ── SECTION: Line & Shape Primitives ─────────────────────────

/**
 * Draw a thin line
 */
function drawLine(ctx, x1, y1, x2, y2, options = {}) {
  const {
    color = PALETTE.border,
    width = 1,
    dash = [],
  } = options;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.stroke();
  ctx.setLineDash([]);
}

/**
 * Draw a rectangle with optional border
 */
function drawRect(ctx, x, y, w, h, options = {}) {
  const {
    fill = null,
    stroke = null,
    lineWidth = 1,
    radius = 0,
  } = options;

  ctx.beginPath();

  if (radius > 0) {
    ctx.roundRect(x, y, w, h, radius);
  } else {
    ctx.rect(x, y, w, h);
  }

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

/**
 * Draw a circle
 */
function drawCircle(ctx, cx, cy, r, options = {}) {
  const {
    fill = null,
    stroke = null,
    lineWidth = 1,
  } = options;

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

/**
 * Draw a ring (circle with hole)
 */
function drawRing(ctx, cx, cy, outerR, innerR, options = {}) {
  const { fill = PALETTE.accent } = options;

  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
  ctx.fillStyle = fill;
  ctx.fill();
}

// ── SECTION: Portrait Primitives ─────────────────────────────

/**
 * Draw an image cropped to a circle (object-cover style)
 */
function drawCirclePortrait(ctx, image, cx, cy, radius, options = {}) {
  const {
    borderColor = PALETTE.border,
    borderWidth = 2,
    ringColor = null,
    ringWidth = 0,
    shadow = false,
  } = options;

  ctx.save();

  // Create circular clip
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  // Calculate cover crop
  const imgRatio = image.width / image.height;
  const destRatio = 1; // circle is 1:1

  let sx, sy, sWidth, sHeight;

  if (imgRatio > destRatio) {
    // Image is wider than tall relative to destination
    sHeight = image.height;
    sWidth = image.height * destRatio;
    sx = (image.width - sWidth) / 2;
    sy = 0;
  } else {
    // Image is taller than wide
    sWidth = image.width;
    sHeight = image.width / destRatio;
    sx = 0;
    sy = (image.height - sHeight) / 2;
  }

  // Draw image
  ctx.drawImage(image, sx, sy, sWidth, sHeight, cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  // Draw optional ring
  if (ringColor && ringWidth > 0) {
    drawCircle(ctx, cx, cy, radius + ringWidth / 2, {
      stroke: ringColor,
      lineWidth: ringWidth,
    });
  }

  // Draw border
  if (borderWidth > 0) {
    drawCircle(ctx, cx, cy, radius, {
      stroke: borderColor,
      lineWidth: borderWidth,
    });
  }
}

/**
 * Draw an image cropped to a rounded rectangle
 */
function drawRoundedPortrait(ctx, image, x, y, w, h, radius, options = {}) {
  const {
    borderColor = PALETTE.border,
    borderWidth = 2,
  } = options;

  ctx.save();

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.clip();

  // Cover crop logic
  const imgRatio = image.width / image.height;
  const destRatio = w / h;

  let sx, sy, sWidth, sHeight;

  if (imgRatio > destRatio) {
    sHeight = image.height;
    sWidth = image.height * destRatio;
    sx = (image.width - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = image.width;
    sHeight = image.width / destRatio;
    sx = 0;
    sy = (image.height - sHeight) / 2;
  }

  ctx.drawImage(image, sx, sy, sWidth, sHeight, x, y, w, h);

  ctx.restore();

  if (borderWidth > 0) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
  }
}

// ── SECTION: Score Primitives ──────────────────────────────

/**
 * Draw a large score with label (e.g., "94.2" with "AURA" above)
 */
function drawScoreBig(ctx, score, label, x, y, options = {}) {
  const {
    scoreColor = PALETTE.text,
    labelColor = PALETTE.textDim,
    accentColor = PALETTE.accent,
  } = options;

  // Label
  drawText(ctx, label, x, y - 8, {
    font: FONTS.mono(11),
    color: labelColor,
    align: 'left',
    letterSpacing: 1.5,
  });

  // Score number
  const scoreStr = typeof score === 'number' ? score.toFixed(1) : score;
  drawText(ctx, scoreStr, x, y + 32, {
    font: FONTS.display(42, '600'),
    color: scoreColor,
    align: 'left',
  });

  // Small underline accent
  drawLine(ctx, x, y + 42, x + 50, y + 42, {
    color: accentColor,
    width: 2,
  });
}

/**
 * Draw a score grid (2x3 or similar)
 */
function drawScoreGrid(ctx, scores, x, y, cols = 2, options = {}) {
  const {
    colWidth = 140,
    rowHeight = 80,
    scoreColor = PALETTE.text,
    labelColor = PALETTE.textDim,
  } = options;

  const entries = Object.entries(scores);

  entries.forEach(([label, score], i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = x + col * colWidth;
    const cy = y + row * rowHeight;

    drawScoreBig(ctx, score, label, cx, cy, {
      scoreColor,
      labelColor,
    });
  });
}

/**
 * Draw a circular gauge/score
 */
function drawCircularGauge(ctx, value, label, cx, cy, radius = 40, options = {}) {
  const {
    trackColor = PALETTE.border,
    fillColor = PALETTE.accent,
    textColor = PALETTE.text,
    labelColor = PALETTE.textDim,
    lineWidth = 3,
  } = options;

  const pct = Math.min(100, Math.max(0, value)) / 100;
  const angle = -Math.PI / 2 + (pct * Math.PI * 2);

  // Track
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = trackColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Fill arc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, angle);
  ctx.strokeStyle = fillColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Value text
  const valStr = typeof value === 'number' ? value.toFixed(1) : value;
  drawText(ctx, valStr, cx, cy + 4, {
    font: FONTS.display(20, '600'),
    color: textColor,
    align: 'center',
  });

  // Label
  drawText(ctx, label, cx, cy + radius + 16, {
    font: FONTS.mono(9),
    color: labelColor,
    align: 'center',
    letterSpacing: 1,
  });
}

/**
 * Draw a final score block (giant number)
 */
function drawFinalScore(ctx, score, x, y, options = {}) {
  const {
    size = 120,
    color = PALETTE.text,
    label = 'FINAL',
    labelColor = PALETTE.textDim,
    suffix = '',
  } = options;

  const scoreStr = typeof score === 'number' ? score.toFixed(1) : score;

  drawText(ctx, label, x, y - size * 0.6, {
    font: FONTS.mono(11),
    color: labelColor,
    align: 'center',
    letterSpacing: 2,
  });

  drawText(ctx, scoreStr + suffix, x, y, {
    font: FONTS.display(size, '700'),
    color,
    align: 'center',
  });
}

// ── SECTION: Robot Mark Primitives ───────────────────────────

/**
 * Draw a small robot certification mark on canvas
 */
function drawRobotMark(ctx, x, y, size = 32, options = {}) {
  const { expression = 'certified', opacity = 1 } = options;

  ctx.save();
  ctx.globalAlpha = opacity;

  // Preferred path: draw the actual mascot logo, aspect-fit into
  // the requested size x size box.
  if (_mascotImg) {
    const iw = _mascotImg.width;
    const ih = _mascotImg.height;
    const scale = Math.min(size / iw, size / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = x + (size - dw) / 2;
    const dy = y + (size - dh) / 2;
    ctx.drawImage(_mascotImg, dx, dy, dw, dh);
    ctx.restore();
    return;
  }

  // Fallback: geometric robot mark (used only if the logo image
  // hasn't finished loading yet, e.g. on a very slow connection)
  const s = size;
  const cx = x + s / 2;
  const cy = y + s / 2;

  // Body
  ctx.fillStyle = PALETTE.surface;
  ctx.strokeStyle = PALETTE.accent;
  ctx.lineWidth = 1;

  const bw = s * 0.7;
  const bh = s * 0.6;
  const bx = cx - bw / 2;
  const by = cy - bh / 2 + 2;

  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 4);
  ctx.fill();
  ctx.stroke();

  // Face screen
  ctx.fillStyle = PALETTE.bg;
  ctx.beginPath();
  ctx.roundRect(bx + 3, by + 3, bw - 6, bh - 8, 2);
  ctx.fill();

  // Eyes based on expression
  ctx.fillStyle = PALETTE.text;
  const eyeY = by + (bh - 8) / 2 + 2;

  if (expression === 'certified' || expression === 'happy') {
    // Happy eyes (arcs)
    ctx.beginPath();
    ctx.arc(bx + 6, eyeY, 2, Math.PI, 0);
    ctx.strokeStyle = PALETTE.text;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(bx + bw - 6, eyeY, 2, Math.PI, 0);
    ctx.stroke();
  } else if (expression === 'scanning') {
    // Slit eyes
    ctx.fillRect(bx + 4, eyeY - 0.5, 4, 1);
    ctx.fillRect(bx + bw - 8, eyeY - 0.5, 4, 1);
  } else {
    // Round eyes
    ctx.beginPath();
    ctx.arc(bx + 6, eyeY, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx + bw - 6, eyeY, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Antenna
  ctx.strokeStyle = PALETTE.accent;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, by);
  ctx.lineTo(cx, by - 5);
  ctx.stroke();

  ctx.fillStyle = PALETTE.accent;
  ctx.beginPath();
  ctx.arc(cx, by - 7, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ── SECTION: Stamp & Certification Primitives ────────────────

/**
 * Draw a certification stamp mark
 */
function drawStamp(ctx, text, cx, cy, options = {}) {
  const {
    radius = 45,
    color = PALETTE.accent,
    textColor = PALETTE.accent,
    fontSize = 9,
    rotate = -15,
  } = options;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotate * Math.PI) / 180);

  // Outer ring
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Inner ring
  ctx.beginPath();
  ctx.arc(0, 0, radius - 6, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Cross lines
  ctx.beginPath();
  ctx.moveTo(-radius + 4, 0);
  ctx.lineTo(radius - 4, 0);
  ctx.moveTo(0, -radius + 4);
  ctx.lineTo(0, radius - 4);
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Text curved around (simplified: straight text)
  ctx.font = FONTS.mono(fontSize);
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);

  ctx.restore();
}

/**
 * Draw registration/crop marks
 */
function drawRegistrationMarks(ctx, margin = 30, length = 12) {
  const color = PALETTE.textDim;
  const w = CARD_WIDTH;
  const h = CARD_HEIGHT;

  // Top left
  drawLine(ctx, margin, margin, margin + length, margin, { color, width: 0.5 });
  drawLine(ctx, margin, margin, margin, margin + length, { color, width: 0.5 });

  // Top right
  drawLine(ctx, w - margin - length, margin, w - margin, margin, { color, width: 0.5 });
  drawLine(ctx, w - margin, margin, w - margin, margin + length, { color, width: 0.5 });

  // Bottom left
  drawLine(ctx, margin, h - margin, margin + length, h - margin, { color, width: 0.5 });
  drawLine(ctx, margin, h - margin - length, margin, h - margin, { color, width: 0.5 });

  // Bottom right
  drawLine(ctx, w - margin - length, h - margin, w - margin, h - margin, { color, width: 0.5 });
  drawLine(ctx, w - margin, h - margin - length, w - margin, h - margin, { color, width: 0.5 });
}

// ── SECTION: Barcode Primitive ───────────────────────────────

/**
 * Draw a simple barcode-like pattern
 */
function drawBarcode(ctx, x, y, w, h, options = {}) {
  const { color = PALETTE.textMuted, density = 40 } = options;

  ctx.fillStyle = color;

  for (let i = 0; i < density; i++) {
    const barW = Math.random() * 3 + 1;
    const barX = x + (i / density) * w;
    const barH = h * (0.5 + Math.random() * 0.5);
    const barY = y + (h - barH) / 2;

    if (barX + barW <= x + w) {
      ctx.fillRect(barX, barY, barW, barH);
    }
  }
}

// ── SECTION: Grid Pattern ────────────────────────────────────

/**
 * Draw a micro grid pattern
 */
function drawMicroGrid(ctx, x, y, w, h, spacing = 20, options = {}) {
  const { color = PALETTE.border, lineWidth = 0.5 } = options;

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();

  // Vertical lines
  for (let ix = x; ix <= x + w; ix += spacing) {
    ctx.moveTo(ix, y);
    ctx.lineTo(ix, y + h);
  }

  // Horizontal lines
  for (let iy = y; iy <= y + h; iy += spacing) {
    ctx.moveTo(x, iy);
    ctx.lineTo(x + w, iy);
  }

  ctx.stroke();
}

// ── SECTION: Decorative Elements ─────────────────────────────

/**
 * Draw a corner bracket decoration
 */
function drawCornerBracket(ctx, x, y, size, position, options = {}) {
  const { color = PALETTE.accent, width = 1.5 } = options;
  const s = size;

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';

  ctx.beginPath();

  switch (position) {
    case 'tl':
      ctx.moveTo(x + s, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + s);
      break;
    case 'tr':
      ctx.moveTo(x - s, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + s);
      break;
    case 'bl':
      ctx.moveTo(x + s, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y - s);
      break;
    case 'br':
      ctx.moveTo(x - s, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y - s);
      break;
  }

  ctx.stroke();
}

/**
 * Draw a dashed border rectangle
 */
function drawDashedBorder(ctx, x, y, w, h, dash = [8, 4], options = {}) {
  const { color = PALETTE.border, width = 1 } = options;

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
}

// ── SECTION: Image Loading ───────────────────────────────────

/**
 * Load an image from a File or URL
 * @param {File|string} source - File object or data URL
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = reject;

    if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target.result; };
      reader.onerror = reject;
      reader.readAsDataURL(source);
    } else {
      img.src = source;
    }
  });
}



// ═══════════════════════════════════════════════════════════════
// SECTION: NEW PRIMITIVES FOR TEMPLATES 11–20
// Added in Part 3. Edit target for template-specific utilities.
// ═══════════════════════════════════════════════════════════════

// ── SECTION: Star Shape ──────────────────────────────────────
function drawStar(ctx, cx, cy, outerR, innerR, points, options = {}) {
  const { fill = null, stroke = null, lineWidth = 1 } = options;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}

// ── SECTION: Perforated Line (Ticket Style) ──────────────────
function drawPerforatedLine(ctx, x1, y1, x2, y2, options = {}) {
  const { holeRadius = 3, holeSpacing = 12, color = PALETTE.border } = options;
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const steps = dist / holeSpacing;

  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const px = x1 + dx * t;
    const py = y1 + dy * t;
    ctx.beginPath();
    ctx.arc(px, py, holeRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Draw the cut line
  drawLine(ctx, x1, y1, x2, y2, { color, width: 0.5, dash: [4, 4] });
}

// ── SECTION: Redacted Text Block ─────────────────────────────
function drawRedactedText(ctx, text, x, y, options = {}) {
  const { font = FONTS.mono(12), barColor = '#1a1a1a', textColor = PALETTE.text, reveal = false } = options;
  const metrics = ctx.measureText(text);
  const height = 16;

  if (!reveal) {
    ctx.fillStyle = barColor;
    ctx.fillRect(x, y - height + 4, metrics.width + 8, height);
  } else {
    ctx.font = font;
    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y);
  }
}

// ── SECTION: Histogram Bars ────────────────────────────────
function drawHistogram(ctx, values, x, y, w, h, options = {}) {
  const { barColor = PALETTE.accent, bgColor = PALETTE.border, barCount = 20 } = options;
  const barW = w / barCount;

  for (let i = 0; i < barCount; i++) {
    const val = values[i % values.length] || Math.random() * 100;
    const barH = (val / 100) * h;
    const bx = x + i * barW;
    const by = y + h - barH;

    ctx.fillStyle = bgColor;
    ctx.fillRect(bx + 1, y, barW - 2, h);
    ctx.fillStyle = barColor;
    ctx.fillRect(bx + 1, by, barW - 2, barH);
  }
}

// ── SECTION: Glitch Rect ─────────────────────────────────────
function drawGlitchRect(ctx, x, y, w, h, options = {}) {
  const { color = PALETTE.accent, intensity = 5 } = options;

  // Main rect
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);

  // Glitch offsets
  for (let i = 0; i < intensity; i++) {
    const gy = y + Math.random() * h;
    const gh = Math.random() * 8 + 2;
    const offset = (Math.random() - 0.5) * 20;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,0,0,0.3)' : 'rgba(0,255,255,0.3)';
    ctx.fillRect(x + offset, gy, w, gh);
  }
}

// ── SECTION: Holographic Strip ───────────────────────────────
function drawHolographicStrip(ctx, x, y, w, h, options = {}) {
  const { colors = ['#18E58A', '#0B9F5B', '#F2F5F2'] } = options;
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));

  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  // Diagonal shine lines
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 0.5;
  for (let i = -h; i < w; i += 8) {
    ctx.beginPath();
    ctx.moveTo(x + i, y + h);
    ctx.lineTo(x + i + h, y);
    ctx.stroke();
  }
}

// ── SECTION: Newspaper Column Text ───────────────────────────
function drawColumnText(ctx, text, x, y, colW, lineHeight, maxLines, options = {}) {
  const { font = FONTS.body(12), color = PALETTE.text } = options;
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';

  const words = text.split(' ');
  let line = '';
  let lineCount = 0;
  let cy = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > colW && line !== '') {
      if (lineCount >= maxLines) break;
      ctx.fillText(line, x, cy);
      line = words[i] + ' ';
      cy += lineHeight;
      lineCount++;
    } else {
      line = testLine;
    }
  }
  if (lineCount < maxLines) ctx.fillText(line, x, cy);
}

// ── SECTION: Dotted Grid ─────────────────────────────────────
function drawDottedGrid(ctx, x, y, w, h, spacing, options = {}) {
  const { color = PALETTE.border, dotSize = 1 } = options;
  ctx.fillStyle = color;
  for (let ix = x; ix <= x + w; ix += spacing) {
    for (let iy = y; iy <= y + h; iy += spacing) {
      ctx.beginPath();
      ctx.arc(ix, iy, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ── SECTION: Swiss Grid Lines ────────────────────────────────
function drawSwissGrid(ctx, margin, gutter, options = {}) {
  const { color = PALETTE.border, width = 0.5 } = options;
  const W = CARD_WIDTH;
  const H = CARD_HEIGHT;
  const colW = (W - margin * 2 - gutter * 3) / 4;

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash([2, 4]);

  // Vertical grid lines
  for (let i = 0; i <= 4; i++) {
    const x = margin + i * (colW + gutter);
    ctx.beginPath();
    ctx.moveTo(x, margin);
    ctx.lineTo(x, H - margin);
    ctx.stroke();
  }

  // Horizontal baseline
  ctx.beginPath();
  ctx.moveTo(margin, H - margin);
  ctx.lineTo(W - margin, H - margin);
  ctx.stroke();

  ctx.setLineDash([]);
}

// ═══════════════════════════════════════════════════════════════
// SECTION: NEW PRIMITIVES FOR TEMPLATES 02–10
// Added in Part 2. Edit target for template-specific utilities.
// ═══════════════════════════════════════════════════════════════

// ── SECTION: Scan Lines ──────────────────────────────────────
function drawScanLines(ctx, x, y, w, h, spacing = 4, options = {}) {
  const { color = 'rgba(24, 229, 138, 0.06)', lineWidth = 1 } = options;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  for (let iy = y; iy <= y + h; iy += spacing) {
    ctx.moveTo(x, iy);
    ctx.lineTo(x + w, iy);
  }
  ctx.stroke();
}

// ── SECTION: CRT Terminal Scanlines ──────────────────────────
function drawCRTScanlines(ctx, x, y, w, h, spacing = 3, options = {}) {
  const { color = 'rgba(24, 229, 138, 0.08)' } = options;
  ctx.fillStyle = color;
  for (let iy = y; iy <= y + h; iy += spacing * 2) {
    ctx.fillRect(x, iy, w, spacing);
  }
}

// ── SECTION: Star / Block Rating ─────────────────────────────
function drawBlockRating(ctx, x, y, value, max = 5, options = {}) {
  const { size = 14, gap = 4, fillColor = PALETTE.accent, emptyColor = PALETTE.border } = options;
  for (let i = 0; i < max; i++) {
    const bx = x + i * (size + gap);
    const filled = i < Math.round(value * max / 100);
    ctx.fillStyle = filled ? fillColor : emptyColor;
    ctx.fillRect(bx, y, size, size);
  }
}

// ── SECTION: Document Field (Passport Style) ───────────────
function drawDocumentField(ctx, label, value, x, y, options = {}) {
  const { width = 300, labelColor = PALETTE.textDim, valueColor = PALETTE.text, lineColor = PALETTE.border } = options;

  drawText(ctx, label, x, y, {
    font: FONTS.mono(9),
    color: labelColor,
    align: 'left',
    letterSpacing: 1,
  });

  drawText(ctx, value, x, y + 18, {
    font: FONTS.mono(13, '500'),
    color: valueColor,
    align: 'left',
  });

  drawLine(ctx, x, y + 24, x + width, y + 24, {
    color: lineColor,
    width: 0.5,
  });
}

// ── SECTION: Hexagon Shape ───────────────────────────────────
function drawHexagon(ctx, cx, cy, radius, options = {}) {
  const { fill = null, stroke = null, lineWidth = 1 } = options;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const px = cx + radius * Math.cos(angle);
    const py = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}

// ── SECTION: Radar / Spider Chart ────────────────────────────
function drawRadarChart(ctx, values, labels, cx, cy, radius, options = {}) {
  const { fillColor = 'rgba(24, 229, 138, 0.15)', strokeColor = PALETTE.accent, gridColor = PALETTE.border, textColor = PALETTE.textDim } = options;
  const count = values.length;
  const angleStep = (Math.PI * 2) / count;

  // Draw grid
  for (let ring = 1; ring <= 4; ring++) {
    const r = (radius / 4) * ring;
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const angle = angleStep * i - Math.PI / 2;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Draw axes
  for (let i = 0; i < count; i++) {
    const angle = angleStep * i - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Labels
    const lx = cx + (radius + 20) * Math.cos(angle);
    const ly = cy + (radius + 20) * Math.sin(angle);
    drawText(ctx, labels[i], lx, ly, {
      font: FONTS.mono(9),
      color: textColor,
      align: 'center',
      baseline: 'middle',
    });
  }

  // Draw data polygon
  ctx.beginPath();
  values.forEach((val, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const r = (val / 100) * radius;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

// ── SECTION: Diagonal Stripes Pattern ────────────────────────
function drawDiagonalStripes(ctx, x, y, w, h, spacing = 8, options = {}) {
  const { color = PALETTE.border, lineWidth = 0.5, angle = 45 } = options;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  const diag = Math.sqrt(w * w + h * h);
  const rad = (angle * Math.PI) / 180;

  for (let i = -diag; i < diag; i += spacing) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i + h / Math.tan(rad), y + h);
    ctx.stroke();
  }
  ctx.restore();
}

// ── SECTION: Crosshatch Pattern ──────────────────────────────
function drawCrosshatch(ctx, x, y, w, h, spacing = 12, options = {}) {
  const { color = PALETTE.border, lineWidth = 0.3 } = options;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  for (let i = -h; i < w + h; i += spacing) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i - h, y + h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + i, y + h);
    ctx.lineTo(x + i - h, y);
    ctx.stroke();
  }
  ctx.restore();
}

// ── SECTION: Glow Text Effect ────────────────────────────────
function drawGlowText(ctx, text, x, y, options = {}) {
  const { font = FONTS.display(48, '700'), color = PALETTE.accent, glowColor = PALETTE.accent, glowBlur = 20, align = 'center' } = options;

  ctx.save();
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = glowBlur;
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}

// ── SECTION: Dotted Line ─────────────────────────────────────
function drawDottedLine(ctx, x1, y1, x2, y2, options = {}) {
  const { color = PALETTE.textDim, dotSize = 1.5, spacing = 6 } = options;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const steps = dist / spacing;

  ctx.fillStyle = color;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const px = x1 + dx * t;
    const py = y1 + dy * t;
    ctx.beginPath();
    ctx.arc(px, py, dotSize, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── SECTION: Rounded Image with Shadow ─────────────────────
function drawPortraitWithShadow(ctx, image, x, y, w, h, radius, options = {}) {
  const { shadowColor = 'rgba(0,0,0,0.4)', shadowBlur = 20, shadowOffsetY = 10 } = options;

  ctx.save();
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetY = shadowOffsetY;

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.clip();

  const imgRatio = image.width / image.height;
  const destRatio = w / h;
  let sx, sy, sWidth, sHeight;

  if (imgRatio > destRatio) {
    sHeight = image.height;
    sWidth = image.height * destRatio;
    sx = (image.width - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = image.width;
    sHeight = image.width / destRatio;
    sx = 0;
    sy = (image.height - sHeight) / 2;
  }

  ctx.drawImage(image, sx, sy, sWidth, sHeight, x, y, w, h);
  ctx.restore();
}

// ── SECTION: Export (UPDATED) ────────────────────────────────
// ═══════════════════════════════════════════════════════════════
// SECTION: NEW PRIMITIVES FOR TEMPLATES 21–30
// Added in Part 4. Final batch of drawing utilities.
// ═══════════════════════════════════════════════════════════════

// ── SECTION: Circuit Pattern ───────────────────────────────
function drawCircuitPattern(ctx, x, y, w, h, options = {}) {
  const { color = PALETTE.accent, lineWidth = 0.5, density = 15 } = options;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  const nodes = [];
  for (let i = 0; i < density; i++) {
    nodes.push({ x: x + Math.random() * w, y: y + Math.random() * h });
  }

  nodes.forEach((node, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
    ctx.fill();

    const neighbors = nodes.filter((n, j) => j !== i).sort((a, b) => {
      const da = Math.hypot(a.x - node.x, a.y - node.y);
      const db = Math.hypot(b.x - node.x, b.y - node.y);
      return da - db;
    }).slice(0, 2);

    neighbors.forEach(n => {
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      const midX = (node.x + n.x) / 2;
      ctx.lineTo(midX, node.y);
      ctx.lineTo(midX, n.y);
      ctx.lineTo(n.x, n.y);
      ctx.stroke();
    });
  });
}

// ── SECTION: Blueprint Grid ──────────────────────────────────
function drawBlueprintGrid(ctx, x, y, w, h, spacing = 40, options = {}) {
  const { color = 'rgba(255,255,255,0.15)', lineWidth = 0.5 } = options;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  for (let ix = x; ix <= x + w; ix += spacing) { ctx.moveTo(ix, y); ctx.lineTo(ix, y + h); }
  for (let iy = y; iy <= y + h; iy += spacing) { ctx.moveTo(x, iy); ctx.lineTo(x + w, iy); }
  ctx.stroke();
}

// ── SECTION: Ink Stamp (Rough) ─────────────────────────────
function drawInkStamp(ctx, text, cx, cy, options = {}) {
  const { radius = 50, color = '#8B4513', fontSize = 10, rotate = -15 } = options;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2;
    const r = radius + (Math.random() - 0.5) * 3;
    const px = r * Math.cos(angle);
    const py = r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  for (let i = 0; i <= 80; i++) {
    const angle = (i / 80) * Math.PI * 2;
    const r = radius - 8 + (Math.random() - 0.5) * 2;
    const px = r * Math.cos(angle);
    const py = r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.font = FONTS.mono(fontSize);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

// ── SECTION: XP / Progress Bar ─────────────────────────────
function drawXPBar(ctx, value, max, x, y, w, h, options = {}) {
  const { fillColor = PALETTE.accent, bgColor = PALETTE.border, textColor = PALETTE.text, showText = true } = options;
  const pct = Math.min(1, Math.max(0, value / max));
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, w * pct, h);
  ctx.strokeStyle = fillColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);
  if (showText) {
    drawText(ctx, Math.floor(pct * 100) + '%', x + w / 2, y + h / 2 + 4, {
      font: FONTS.mono(10, '700'), color: textColor, align: 'center',
    });
  }
}

// ── SECTION: Paper Texture Overlay ─────────────────────────
function drawPaperTexture(ctx, opacity = 0.05) {
  const imageData = ctx.getImageData(0, 0, CARD_WIDTH, CARD_HEIGHT);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 40;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
  }
  ctx.putImageData(imageData, 0, 0);
  ctx.fillStyle = `rgba(245, 240, 230, ${opacity})`;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
}

// ── SECTION: Matrix Rain Characters ──────────────────────────
function drawMatrixRain(ctx, x, y, w, h, options = {}) {
  const { color = '#18E58A', fontSize = 14, density = 0.3 } = options;
  const chars = 'アイウエオカキクケコサシスセソタチツテト0123456789';
  const cols = Math.floor(w / fontSize);
  const rows = Math.floor(h / fontSize);
  ctx.font = `${fontSize}px monospace`;
  ctx.fillStyle = color;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (Math.random() < density) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.globalAlpha = Math.random() * 0.5 + 0.1;
        ctx.fillText(char, x + c * fontSize, y + r * fontSize);
      }
    }
  }
  ctx.globalAlpha = 1;
}

// ── SECTION: Trophy / Achievement Icon ─────────────────────
function drawTrophy(ctx, cx, cy, size = 40, options = {}) {
  const { color = PALETTE.accent, strokeColor = PALETTE.text } = options;
  const s = size;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.moveTo(-s * 0.3, -s * 0.2);
  ctx.quadraticCurveTo(-s * 0.4, s * 0.3, -s * 0.15, s * 0.3);
  ctx.lineTo(s * 0.15, s * 0.3);
  ctx.quadraticCurveTo(s * 0.4, s * 0.3, s * 0.3, -s * 0.2);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-s * 0.35, -s * 0.05, s * 0.12, -Math.PI / 2, Math.PI / 2, true);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(s * 0.35, -s * 0.05, s * 0.12, -Math.PI / 2, Math.PI / 2, false);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fillRect(-s * 0.1, s * 0.3, s * 0.2, s * 0.15);
  ctx.fillRect(-s * 0.2, s * 0.42, s * 0.4, s * 0.08);
  ctx.restore();
}

// ── SECTION: Export (FINAL — ALL PARTS) ───────────────────
if (typeof window !== 'undefined') {
  window.VibeStampCanvas = {
    CARD_WIDTH,
    CARD_HEIGHT,
    CARD_RATIO,
    PALETTE,
    FONTS,
    createCanvas,
    drawBackground,
    drawNoise,
    drawGradientBackground,
    drawText,
    drawStrokeText,
    drawTextBlock,
    drawMicroLabel,
    drawIndex,
    drawLine,
    drawRect,
    drawCircle,
    drawRing,
    drawCirclePortrait,
    drawRoundedPortrait,
    drawScoreBig,
    drawScoreGrid,
    drawCircularGauge,
    drawFinalScore,
    drawRobotMark,
    loadMascotImage,
    drawStamp,
    drawRegistrationMarks,
    drawBarcode,
    drawMicroGrid,
    drawCornerBracket,
    drawDashedBorder,
    // Part 2 primitives
    drawScanLines,
    drawCRTScanlines,
    drawBlockRating,
    drawDocumentField,
    drawHexagon,
    drawRadarChart,
    drawDiagonalStripes,
    drawCrosshatch,
    drawGlowText,
    drawDottedLine,
    drawPortraitWithShadow,
    // Part 3 primitives
    drawStar,
    drawPerforatedLine,
    drawRedactedText,
    drawHistogram,
    drawGlitchRect,
    drawHolographicStrip,
    drawColumnText,
    drawDottedGrid,
    drawSwissGrid,
    // Part 4 primitives
    drawCircuitPattern,
    drawBlueprintGrid,
    drawInkStamp,
    drawXPBar,
    drawPaperTexture,
    drawMatrixRain,
    drawTrophy,
    loadImage,
  };
}
