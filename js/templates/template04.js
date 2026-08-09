/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 04: BRUTALIST BLACK-AND-WHITE
   Stark contrasts, heavy grid, bold raw typography. Minimal color.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template04'] = {
  id: 'template04',
  name: 'Brutalist B&W',
  description: 'Raw brutalist design with heavy grid and stark typography.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Pure black background
    C.drawBackground(ctx, '#000000');

    // Heavy crosshatch pattern overlay
    C.drawCrosshatch(ctx, 0, 0, W, H, 24, { color: 'rgba(255,255,255,0.03)' });

    // Thick border frame
    C.drawRect(ctx, 20, 20, W - 40, H - 40, { stroke: '#333333', lineWidth: 3 });
    C.drawRect(ctx, 28, 28, W - 56, H - 56, { stroke: '#1a1a1a', lineWidth: 1 });

    // Top: Giant stamped text
    C.drawText(ctx, 'CERTIFIED', 60, 120, {
      font: F.display(72, '900'), color: '#1a1a1a', align: 'left',
    });

    // Portrait: square, brutalist crop
    const pSize = 380;
    const pX = 60;
    const pY = 180;

    ctx.save();
    ctx.beginPath();
    ctx.rect(pX, pY, pSize, pSize);
    ctx.clip();
    const imgRatio = image.width / image.height;
    let sx, sy, sw, sh;
    if (imgRatio > 1) { sh = image.height; sw = image.height; sx = (image.width - sw) / 2; sy = 0; }
    else { sw = image.width; sh = image.width; sx = 0; sy = (image.height - sh) / 2; }
    ctx.drawImage(image, sx, sy, sw, sh, pX, pY, pSize, pSize);
    ctx.restore();

    // Brutalist border around portrait
    C.drawRect(ctx, pX - 4, pY - 4, pSize + 8, pSize + 8, { stroke: '#ffffff', lineWidth: 2 });
    C.drawRect(ctx, pX - 10, pY - 10, pSize + 20, pSize + 20, { stroke: '#333333', lineWidth: 1 });

    // Right side: Massive score
    C.drawText(ctx, cardData.finalScore.toFixed(0), W - 60, 340, {
      font: F.display(160, '900'), color: '#ffffff', align: 'right',
    });
    C.drawText(ctx, 'POINTS', W - 60, 420, {
      font: F.mono(14, '700'), color: '#666666', align: 'right', letterSpacing: 4,
    });

    // Score grid (brutalist blocks)
    const entries = Object.entries(cardData.scores);
    const gridX = W - 300;
    let gridY = 500;
    entries.forEach(([label, score]) => {
      C.drawRect(ctx, gridX, gridY, 240, 40, { fill: '#111111', stroke: '#333333', lineWidth: 1 });
      C.drawText(ctx, label, gridX + 12, gridY + 25, {
        font: F.mono(11, '600'), color: '#888888', align: 'left',
      });
      C.drawText(ctx, score.toFixed(1), gridX + 220, gridY + 25, {
        font: F.mono(14, '700'), color: '#ffffff', align: 'right',
      });
      gridY += 50;
    });

    // Bottom: Verdict in raw block
    C.drawRect(ctx, 60, H - 200, W - 120, 100, { fill: '#0a0a0a', stroke: '#333333', lineWidth: 1 });
    C.drawText(ctx, 'VERDICT', 80, H - 175, {
      font: F.mono(10), color: '#555555', align: 'left', letterSpacing: 2,
    });
    C.drawText(ctx, cardData.verdict.toUpperCase(), 80, H - 145, {
      font: F.display(20, '700'), color: '#cccccc', align: 'left',
    });

    // Vibe label as stamp
    C.drawStamp(ctx, cardData.vibeLabel, W - 120, H - 140, {
      radius: 40, color: '#444444', textColor: '#888888', fontSize: 7, rotate: -12,
    });

    // Metadata line
    C.drawLine(ctx, 60, H - 60, W - 60, H - 60, { color: '#333333', width: 1 });
    C.drawText(ctx, cardData.certId + ' // ' + window.VibeStampState.formatShortDate(cardData.timestamp), 60, H - 40, {
      font: F.mono(9), color: '#444444', align: 'left',
    });
    C.drawText(ctx, 'TEMPLATE 04', W - 60, H - 40, {
      font: F.mono(9), color: '#444444', align: 'right',
    });

    // One emerald accent line (the only color)
    C.drawLine(ctx, 60, 160, 200, 160, { color: P.accent, width: 3 });
  },
};
