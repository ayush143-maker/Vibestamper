/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 19: FUTURISTIC EMPLOYEE BADGE
   ID card layout, holographic strip, department info,
   access level, and corporate future aesthetic.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template19'] = {
  id: 'template19',
  name: 'Futuristic Employee Badge',
  description: 'Corporate ID with holographic strip and access level.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    C.drawBackground(ctx, P.bgElevated);

    // Badge shape with rounded corners
    C.drawRect(ctx, 80, 60, W - 160, H - 120, { fill: P.surface, stroke: P.border, lineWidth: 1, radius: 8 });

    // Holographic strip at top
    C.drawHolographicStrip(ctx, 80, 60, W - 160, 40, {
      colors: ['#18E58A', '#0B9F5B', '#F2F5F2', '#18E58A'],
    });

    // Company name on strip
    C.drawText(ctx, 'VIBESTAMP CORP', W/2, 85, {
      font: F.mono(12, '700'), color: P.bg, align: 'center', letterSpacing: 3,
    });

    // Portrait (ID photo style)
    const pX = 120;
    const pY = 140;
    const pW = 240;
    const pH = 300;

    ctx.save();
    ctx.beginPath();
    ctx.rect(pX, pY, pW, pH);
    ctx.clip();
    const imgRatio = image.width / image.height;
    let sx, sy, sw, sh;
    if (imgRatio > pW / pH) { sh = image.height; sw = image.height * (pW / pH); sx = (image.width - sw) / 2; sy = 0; }
    else { sw = image.width; sh = image.width / (pW / pH); sx = 0; sy = (image.height - sh) / 2; }
    ctx.drawImage(image, sx, sy, sw, sh, pX, pY, pW, pH);
    ctx.restore();

    C.drawRect(ctx, pX - 2, pY - 2, pW + 4, pH + 4, { stroke: P.border, lineWidth: 1 });

    // Employee info (right of photo)
    const infoX = pX + pW + 50;
    let infoY = 160;

    C.drawText(ctx, 'EMPLOYEE ID', infoX, infoY, {
      font: F.mono(9), color: P.textDim, align: 'left', letterSpacing: 1,
    });
    C.drawText(ctx, cardData.certId, infoX, infoY + 22, {
      font: F.mono(14, '600'), color: P.text, align: 'left',
    });
    infoY += 60;

    C.drawText(ctx, 'DEPARTMENT', infoX, infoY, { font: F.mono(9), color: P.textDim, align: 'left' });
    C.drawText(ctx, 'VIBE OPERATIONS', infoX, infoY + 22, { font: F.mono(13, '500'), color: P.text, align: 'left' });
    infoY += 55;

    C.drawText(ctx, 'ACCESS LEVEL', infoX, infoY, { font: F.mono(9), color: P.textDim, align: 'left' });
    C.drawText(ctx, 'ALPHA', infoX, infoY + 22, { font: F.mono(16, '700'), color: P.accent, align: 'left' });
    infoY += 55;

    C.drawText(ctx, 'CLEARANCE', infoX, infoY, { font: F.mono(9), color: P.textDim, align: 'left' });
    C.drawText(ctx, cardData.vibeLabel, infoX, infoY + 22, { font: F.mono(12, '500'), color: P.accent, align: 'left' });

    // Score section (bottom of badge)
    const scoreY = pY + pH + 50;
    C.drawLine(ctx, 120, scoreY, W - 120, scoreY, { color: P.border, width: 0.5 });

    C.drawText(ctx, 'PERFORMANCE METRICS', 120, scoreY + 25, {
      font: F.mono(10, '700'), color: P.accent, align: 'left', letterSpacing: 1,
    });

    const entries = Object.entries(cardData.scores);
    const scoreCols = 3;
    const scoreColW = 220;
    let scoreY2 = scoreY + 55;

    entries.forEach(([label, score], i) => {
      const col = i % scoreCols;
      const row = Math.floor(i / scoreCols);
      const sx = 120 + col * scoreColW;
      const sy = scoreY2 + row * 40;

      C.drawText(ctx, label, sx, sy, { font: F.mono(9), color: P.textDim, align: 'left' });
      C.drawText(ctx, score.toFixed(1), sx + 100, sy, { font: F.mono(14, '600'), color: P.text, align: 'left' });
    });

    // Final score (large, bottom center)
    C.drawText(ctx, 'OVERALL', W/2 - 60, scoreY2 + 100, { font: F.mono(9), color: P.textDim, align: 'left' });
    C.drawText(ctx, cardData.finalScore.toFixed(1), W/2 + 40, scoreY2 + 100, {
      font: F.display(36, '700'), color: P.accent, align: 'right',
    });

    // Verdict
    C.drawText(ctx, '"' + cardData.verdict + '"', W/2, H - 140, {
      font: F.body(14, '400'), color: P.textMuted, align: 'center',
    });

    // Bottom barcode
    C.drawBarcode(ctx, 120, H - 110, 300, 50, { color: P.textMuted, density: 35 });
    C.drawText(ctx, cardData.certId, 120, H - 50, { font: F.mono(8), color: P.textDim, align: 'left' });

    // Robot mark
    C.drawRobotMark(ctx, W - 140, H - 100, 24, { expression: 'certified' });

    // Access chip (bottom right corner)
    C.drawRect(ctx, W - 180, H - 110, 40, 30, { fill: P.accent, radius: 3 });
    C.drawText(ctx, 'RFID', W - 160, H - 92, { font: F.mono(7), color: P.bg, align: 'center' });

    C.drawNoise(ctx, 0.015);
  },
};
