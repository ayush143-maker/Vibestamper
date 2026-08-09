/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 14: DIGITAL BOARDING PASS
   Ticket layout with barcode, perforated edges, gate/seat style
   info blocks, and flight-card proportions.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template14'] = {
  id: 'template14',
  name: 'Digital Boarding Pass',
  description: 'Ticket layout with barcode and perforated edges.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    C.drawBackground(ctx, P.bg);

    // Ticket shape with perforated edges
    C.drawRect(ctx, 40, 40, W - 80, H - 80, { fill: P.bgElevated, stroke: P.border, lineWidth: 1 });

    // Perforated line (middle tear)
    const tearY = H / 2 + 50;
    C.drawLine(ctx, 40, tearY, W - 40, tearY, { color: P.border, width: 1, dash: [8, 6] });

    // Semi-circle perforations
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    for (let x = 40; x <= W - 40; x += 30) {
      ctx.beginPath();
      ctx.arc(x, tearY, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Top section: Airline style header
    C.drawRect(ctx, 40, 40, W - 80, 70, { fill: P.surface });
    C.drawLine(ctx, 40, 110, W - 40, 110, { color: P.accent, width: 2 });

    C.drawText(ctx, 'VIBESTAMP AIRLINES', 70, 82, {
      font: F.display(18, '700'), color: P.text, align: 'left',
    });
    C.drawText(ctx, 'BOARDING PASS', W - 70, 82, {
      font: F.mono(12, '600'), color: P.accent, align: 'right', letterSpacing: 2,
    });

    // Portrait (small, passport photo style)
    const pX = 70;
    const pY = 140;
    const pW = 180;
    const pH = 220;

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

    // Flight info blocks (right of portrait)
    const infoX = pX + pW + 40;
    let infoY = pY;

    const infoBlocks = [
      { label: 'PASSENGER', value: 'VIBE USER' },
      { label: 'FLIGHT', value: 'VS-' + Math.floor(cardData.finalScore) },
      { label: 'GATE', value: cardData.vibeLabel.split(' ')[0] },
      { label: 'SEAT', value: String(Math.floor(cardData.scores.AURA || 50)).padStart(2, '0') + 'A' },
      { label: 'BOARDING', value: window.VibeStampState.formatShortDate(cardData.timestamp).split(' ')[0] },
    ];

    infoBlocks.forEach(block => {
      C.drawText(ctx, block.label, infoX, infoY, {
        font: F.mono(8), color: P.textDim, align: 'left', letterSpacing: 1,
      });
      C.drawText(ctx, block.value, infoX, infoY + 22, {
        font: F.mono(16, '600'), color: P.text, align: 'left',
      });
      infoY += 50;
    });

    // Score section (below tear line)
    const scoreY = tearY + 60;
    C.drawText(ctx, 'VIBE METRICS', 70, scoreY, {
      font: F.mono(10, '700'), color: P.accent, align: 'left', letterSpacing: 2,
    });

    const entries = Object.entries(cardData.scores);
    let metricY = scoreY + 35;
    const metricCols = 3;
    const metricColW = 280;

    entries.forEach(([label, score], i) => {
      const col = i % metricCols;
      const row = Math.floor(i / metricCols);
      const mx = 70 + col * metricColW;
      const my = metricY + row * 50;

      C.drawText(ctx, label, mx, my, { font: F.mono(9), color: P.textDim, align: 'left' });
      C.drawText(ctx, score.toFixed(1), mx + 80, my, { font: F.mono(18, '700'), color: P.text, align: 'left' });
    });

    // Final score (big, bottom right)
    C.drawText(ctx, 'TOTAL', W - 200, scoreY, { font: F.mono(9), color: P.textDim, align: 'left' });
    C.drawText(ctx, cardData.finalScore.toFixed(1), W - 200, scoreY + 40, {
      font: F.display(56, '700'), color: P.accent, align: 'left',
    });

    // Barcode at bottom
    C.drawBarcode(ctx, 70, H - 140, 400, 60, { color: P.textMuted, density: 50 });
    C.drawText(ctx, cardData.certId, 70, H - 65, { font: F.mono(10), color: P.textDim, align: 'left' });

    // Verdict
    C.drawText(ctx, '"' + cardData.verdict + '"', W - 70, H - 100, {
      font: F.body(14, '400'), color: P.textMuted, align: 'right',
    });

    // Robot mark
    C.drawRobotMark(ctx, W - 80, H - 70, 24, { expression: 'certified' });

    C.drawNoise(ctx, 0.015);
  },
};
