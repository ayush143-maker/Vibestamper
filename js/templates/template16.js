/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 16: MINIMAL SWISS
   Strict grid system, maximum whitespace, Helvetica-like precision,
   asymmetric balance, and typographic purity.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template16'] = {
  id: 'template16',
  name: 'Minimal Swiss',
  description: 'Strict grid system with maximum whitespace.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    C.drawBackground(ctx, '#ffffff'); // White background for Swiss purity

    // Swiss grid (subtle, for structure)
    C.drawSwissGrid(ctx, 60, 20, { color: '#eeeeee', width: 0.5 });

    // Top left: Index
    C.drawText(ctx, '01', 60, 100, { font: F.display(14, '300'), color: '#cccccc', align: 'left' });

    // Top right: Brand
    C.drawText(ctx, 'VIBESTAMP', W - 60, 100, {
      font: F.mono(10), color: '#000000', align: 'right', letterSpacing: 4,
    });

    // Large portrait (asymmetric, left-aligned)
    const pX = 60;
    const pY = 160;
    const pW = 480;
    const pH = 600;

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

    // Thin line under portrait
    C.drawLine(ctx, pX, pY + pH + 20, pX + pW, pY + pH + 20, { color: '#000000', width: 1 });

    // Right column: Scores (aligned to grid)
    const scoreX = 580;
    let scoreY = 200;

    C.drawText(ctx, 'VIBE ANALYSIS', scoreX, scoreY, {
      font: F.mono(10), color: '#999999', align: 'left', letterSpacing: 2,
    });
    scoreY += 40;

    const entries = Object.entries(cardData.scores);
    entries.forEach(([label, score]) => {
      C.drawText(ctx, label, scoreX, scoreY, { font: F.mono(11), color: '#666666', align: 'left' });
      C.drawText(ctx, score.toFixed(1), scoreX + 200, scoreY, { font: F.mono(14, '600'), color: '#000000', align: 'right' });
      scoreY += 32;
    });

    // Final score (large, right side)
    scoreY += 30;
    C.drawLine(ctx, scoreX, scoreY, scoreX + 220, scoreY, { color: '#000000', width: 1 });
    scoreY += 25;
    C.drawText(ctx, 'TOTAL', scoreX, scoreY, { font: F.mono(9), color: '#999999', align: 'left' });
    C.drawText(ctx, cardData.finalScore.toFixed(1), scoreX + 220, scoreY + 20, {
      font: F.display(48, '700'), color: '#000000', align: 'right',
    });

    // Verdict (bottom right)
    C.drawText(ctx, '"' + cardData.verdict + '"', scoreX, H - 200, {
      font: F.body(14, '400'), color: '#666666', align: 'left',
    });

    // Vibe label (bottom left, under portrait)
    C.drawText(ctx, cardData.vibeLabel.toUpperCase(), pX, H - 200, {
      font: F.mono(10, '600'), color: '#000000', align: 'left', letterSpacing: 2,
    });

    // Bottom metadata line
    C.drawLine(ctx, 60, H - 80, W - 60, H - 80, { color: '#000000', width: 0.5 });
    C.drawText(ctx, cardData.certId, 60, H - 55, { font: F.mono(8), color: '#999999', align: 'left' });
    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), W - 60, H - 55, { font: F.mono(8), color: '#999999', align: 'right' });

    // One emerald accent (only color besides black/white)
    C.drawRect(ctx, W - 100, H - 55, 8, 8, { fill: '#18E58A' });

    C.drawNoise(ctx, 0.01);
  },
};
