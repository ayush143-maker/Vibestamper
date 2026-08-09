/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 26: TECHNICAL BLUEPRINT
   Engineering drawing style, white lines on blue,
   dimension lines, grid paper, technical annotations.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template26'] = {
  id: 'template26',
  name: 'Technical Blueprint',
  description: 'Engineering drawing with white lines on blue background.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Blueprint blue background
    C.drawBackground(ctx, '#1a3a5c');
    C.drawBlueprintGrid(ctx, 0, 0, W, H, 40, { color: 'rgba(255,255,255,0.1)', lineWidth: 0.5 });

    // Title block
    C.drawRect(ctx, 60, 60, 400, 80, { fill: 'rgba(255,255,255,0.05)', stroke: 'rgba(255,255,255,0.3)', lineWidth: 1 });
    C.drawText(ctx, 'VIBESTAMP BLUEPRINT', 80, 95, {
      font: F.display(20, '700'), color: '#ffffff', align: 'left',
    });
    C.drawText(ctx, 'SHEET 1 OF 1  |  SCALE: 1:1', 80, 120, {
      font: F.mono(9), color: 'rgba(255,255,255,0.6)', align: 'left',
    });

    // Portrait as technical drawing
    const pX = 100;
    const pY = 180;
    const pW = 400;
    const pH = 500;

    // Dimension lines
    C.drawLine(ctx, pX - 30, pY, pX - 10, pY, { color: 'rgba(255,255,255,0.5)', width: 0.5 });
    C.drawLine(ctx, pX - 20, pY, pX - 20, pY + pH, { color: 'rgba(255,255,255,0.5)', width: 0.5 });
    C.drawLine(ctx, pX - 30, pY + pH, pX - 10, pY + pH, { color: 'rgba(255,255,255,0.5)', width: 0.5 });
    C.drawText(ctx, pH + 'mm', pX - 35, pY + pH/2, { font: F.mono(8), color: 'rgba(255,255,255,0.5)', align: 'right' });

    C.drawLine(ctx, pX, pY - 30, pX, pY - 10, { color: 'rgba(255,255,255,0.5)', width: 0.5 });
    C.drawLine(ctx, pX, pY - 20, pX + pW, pY - 20, { color: 'rgba(255,255,255,0.5)', width: 0.5 });
    C.drawLine(ctx, pX + pW, pY - 30, pX + pW, pY - 10, { color: 'rgba(255,255,255,0.5)', width: 0.5 });
    C.drawText(ctx, pW + 'mm', pX + pW/2, pY - 35, { font: F.mono(8), color: 'rgba(255,255,255,0.5)', align: 'center' });

    // Portrait (blue-tinted)
    ctx.save();
    ctx.beginPath();
    ctx.rect(pX, pY, pW, pH);
    ctx.clip();
    const imgRatio = image.width / image.height;
    let sx, sy, sw, sh;
    if (imgRatio > pW / pH) { sh = image.height; sw = image.height * (pW / pH); sx = (image.width - sw) / 2; sy = 0; }
    else { sw = image.width; sh = image.width / (pW / pH); sx = 0; sy = (image.height - sh) / 2; }
    ctx.filter = 'grayscale(100%) brightness(1.2) contrast(1.1)';
    ctx.drawImage(image, sx, sy, sw, sh, pX, pY, pW, pH);
    ctx.filter = 'none';
    ctx.restore();

    // Blueprint overlay on portrait
    ctx.fillStyle = 'rgba(26, 58, 92, 0.3)';
    ctx.fillRect(pX, pY, pW, pH);

    // Technical border
    C.drawRect(ctx, pX, pY, pW, pH, { stroke: 'rgba(255,255,255,0.5)', lineWidth: 1 });

    // Right side: Technical specs
    const specX = pX + pW + 60;
    let specY = 180;

    C.drawText(ctx, 'TECHNICAL SPECIFICATIONS', specX, specY, {
      font: F.mono(11, '700'), color: '#ffffff', align: 'left', letterSpacing: 1,
    });
    C.drawLine(ctx, specX, specY + 12, specX + 300, specY + 12, { color: 'rgba(255,255,255,0.5)', width: 1 });
    specY += 35;

    const entries = Object.entries(cardData.scores);
    entries.forEach(([label, score]) => {
      C.drawText(ctx, label, specX, specY, { font: F.mono(10), color: 'rgba(255,255,255,0.7)', align: 'left' });
      C.drawText(ctx, score.toFixed(1), specX + 180, specY, { font: F.mono(12, '600'), color: '#ffffff', align: 'left' });
      specY += 26;
    });

    specY += 20;
    C.drawLine(ctx, specX, specY, specX + 200, specY, { color: 'rgba(255,255,255,0.3)', width: 0.5 });
    specY += 20;
    C.drawText(ctx, 'COMPOSITE RATING', specX, specY, { font: F.mono(10), color: 'rgba(255,255,255,0.7)', align: 'left' });
    C.drawText(ctx, cardData.finalScore.toFixed(1), specX + 180, specY, { font: F.display(28, '700'), color: '#ffffff', align: 'left' });

    // Verdict
    specY += 50;
    C.drawRect(ctx, specX, specY, 300, 80, { fill: 'rgba(255,255,255,0.05)', stroke: 'rgba(255,255,255,0.3)', lineWidth: 0.5 });
    C.drawText(ctx, 'ANALYSIS:', specX + 15, specY + 25, { font: F.mono(9), color: 'rgba(255,255,255,0.6)', align: 'left' });
    C.drawText(ctx, '"' + cardData.verdict + '"', specX + 15, specY + 55, { font: F.body(13, '400'), color: '#ffffff', align: 'left' });

    // Vibe label
    C.drawText(ctx, cardData.vibeLabel, specX, specY + 110, { font: F.mono(10, '500'), color: '#18E58A', align: 'left', letterSpacing: 2 });

    // Bottom title block
    C.drawRect(ctx, 60, H - 100, W - 120, 60, { fill: 'rgba(255,255,255,0.05)', stroke: 'rgba(255,255,255,0.3)', lineWidth: 1 });
    C.drawText(ctx, 'DRAWN BY: VIBE SYSTEM', 80, H - 70, { font: F.mono(9), color: 'rgba(255,255,255,0.6)', align: 'left' });
    C.drawText(ctx, 'DATE: ' + window.VibeStampState.formatShortDate(cardData.timestamp), W/2, H - 70, { font: F.mono(9), color: 'rgba(255,255,255,0.6)', align: 'center' });
    C.drawText(ctx, 'DWG NO: ' + cardData.certId, W - 80, H - 70, { font: F.mono(9), color: 'rgba(255,255,255,0.6)', align: 'right' });

    C.drawRobotMark(ctx, W - 80, H - 55, 20, { expression: 'certified' });

    C.drawNoise(ctx, 0.015);
  },
};
