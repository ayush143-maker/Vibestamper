/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 25: HAND-STAMPED ANALOG CERTIFICATE
   Paper texture, ink stamps, typewriter text, rough edges,
   vintage document aesthetic with physical artifact feel.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template25'] = {
  id: 'template25',
  name: 'Hand-Stamped Analog',
  description: 'Vintage paper certificate with ink stamps and typewriter text.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Warm paper background
    C.drawBackground(ctx, '#f0ebe3');
    C.drawPaperTexture(ctx, 0.08);

    // Coffee stain (subtle circle)
    C.drawCircle(ctx, W - 150, H - 200, 60, { fill: 'rgba(139,90,43,0.03)' });
    C.drawCircle(ctx, W - 150, H - 200, 50, { fill: 'rgba(139,90,43,0.02)' });

    // Decorative border
    C.drawRect(ctx, 50, 50, W - 100, H - 100, { stroke: '#8B7355', lineWidth: 1 });
    C.drawRect(ctx, 55, 55, W - 110, H - 110, { stroke: '#C4A77D', lineWidth: 0.5 });

    // Corner ornaments
    const ornSize = 20;
    C.drawLine(ctx, 50, 70, 70, 50, { color: '#8B7355', width: 1 });
    C.drawLine(ctx, W - 70, 50, W - 50, 70, { color: '#8B7355', width: 1 });
    C.drawLine(ctx, 50, H - 70, 70, H - 50, { color: '#8B7355', width: 1 });
    C.drawLine(ctx, W - 70, H - 50, W - 50, H - 70, { color: '#8B7355', width: 1 });

    // Header
    C.drawText(ctx, 'CERTIFICATE OF VIBE', W/2, 110, {
      font: F.display(24, '700'), color: '#3a3028', align: 'center', letterSpacing: 3,
    });
    C.drawLine(ctx, W/2 - 120, 130, W/2 + 120, 130, { color: '#8B7355', width: 1 });

    // Portrait (oval, vintage frame)
    const pCX = W/2;
    const pCY = 300;
    const pR = 100;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(pCX, pCY, pR * 0.85, pR, 0, 0, Math.PI * 2);
    ctx.clip();
    const imgRatio = image.width / image.height;
    let sx, sy, sw, sh;
    if (imgRatio > 0.85) { sh = image.height; sw = image.height * 0.85; sx = (image.width - sw) / 2; sy = 0; }
    else { sw = image.width; sh = image.width / 0.85; sx = 0; sy = (image.height - sh) / 2; }
    ctx.filter = 'sepia(0.4) contrast(0.95)';
    ctx.drawImage(image, sx, sy, sw, sh, pCX - pR * 0.85, pCY - pR, pR * 1.7, pR * 2);
    ctx.filter = 'none';
    ctx.restore();

    // Oval frame
    ctx.beginPath();
    ctx.ellipse(pCX, pCY, pR * 0.85 + 5, pR + 5, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 2;
    ctx.stroke();

    // "This certifies that" text
    C.drawText(ctx, 'This certifies that the bearer has been', W/2, pCY + pR + 40, {
      font: F.body(14, '400'), color: '#5a4a3a', align: 'center',
    });
    C.drawText(ctx, 'officially evaluated and found to possess', W/2, pCY + pR + 62, {
      font: F.body(14, '400'), color: '#5a4a3a', align: 'center',
    });

    // Score (large, typewriter style)
    C.drawText(ctx, 'FINAL SCORE: ' + cardData.finalScore.toFixed(1) + ' / 100', W/2, pCY + pR + 110, {
      font: F.mono(22, '700'), color: '#3a3028', align: 'center',
    });

    // Scores table
    const entries = Object.entries(cardData.scores);
    let tableY = pCY + pR + 160;
    const colW = 140;
    const startX = (W - entries.length * colW) / 2 + colW / 2;

    entries.forEach(([label, score], i) => {
      const tx = startX + i * colW;
      C.drawText(ctx, label, tx, tableY, { font: F.mono(9), color: '#8B7355', align: 'center' });
      C.drawText(ctx, score.toFixed(1), tx, tableY + 22, { font: F.mono(14, '600'), color: '#3a3028', align: 'center' });
    });

    // Verdict
    C.drawText(ctx, '"' + cardData.verdict + '"', W/2, tableY + 70, {
      font: F.body(14, '400'), color: '#5a4a3a', align: 'center',
    });

    // Ink stamps
    C.drawInkStamp(ctx, 'APPROVED', 150, H - 140, { radius: 35, color: '#8B0000', fontSize: 9, rotate: -12 });
    C.drawInkStamp(ctx, cardData.vibeLabel, W - 150, H - 140, { radius: 35, color: '#2a5a2a', fontSize: 8, rotate: 8 });

    // Signature line
    C.drawLine(ctx, W/2 - 100, H - 90, W/2 + 100, H - 90, { color: '#8B7355', width: 0.5 });
    C.drawText(ctx, 'Vibe System Operator', W/2, H - 75, { font: F.mono(9), color: '#8B7355', align: 'center' });

    // Date
    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), 60, H - 55, {
      font: F.mono(9), color: '#8B7355', align: 'left',
    });
    C.drawText(ctx, cardData.certId, W - 60, H - 55, { font: F.mono(9), color: '#8B7355', align: 'right' });

    C.drawRobotMark(ctx, W/2 - 10, H - 40, 20, { expression: 'certified' });

    C.drawNoise(ctx, 0.02);
  },
};
