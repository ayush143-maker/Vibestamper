/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 18: CAMERA METADATA
   EXIF data style, histogram, lens info, shot settings,
   and photography workflow aesthetic.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template18'] = {
  id: 'template18',
  name: 'Camera Metadata',
  description: 'EXIF data style with histogram and shot settings.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    C.drawBackground(ctx, P.bg);

    // Top: Camera brand bar
    C.drawRect(ctx, 0, 0, W, 55, { fill: P.surface });
    C.drawLine(ctx, 0, 55, W, 55, { color: P.accent, width: 1 });
    C.drawText(ctx, 'VIBE-1  |  f/' + (Math.random() * 2 + 1).toFixed(1) + '  |  ISO ' + Math.floor(Math.random() * 800 + 100), 40, 35, {
      font: F.mono(11), color: P.accent, align: 'left',
    });
    C.drawText(ctx, 'RAW', W - 40, 35, { font: F.mono(10), color: P.textDim, align: 'right' });

    // Large portrait (camera viewfinder style)
    const pX = 60;
    const pY = 90;
    const pW = 520;
    const pH = 650;

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

    // Viewfinder overlay
    C.drawDashedBorder(ctx, pX + 20, pY + 20, pW - 40, pH - 40, [20, 10], { color: 'rgba(255,255,255,0.3)', width: 1 });
    C.drawLine(ctx, pX + pW/2, pY, pX + pW/2, pY + pH, { color: 'rgba(255,255,255,0.1)', width: 0.5 });
    C.drawLine(ctx, pX, pY + pH/2, pX + pW, pY + pH/2, { color: 'rgba(255,255,255,0.1)', width: 0.5 });

    // Focus brackets
    C.drawCornerBracket(ctx, pX + 40, pY + 40, 30, 'tl', { color: 'rgba(255,255,255,0.5)', width: 2 });
    C.drawCornerBracket(ctx, pX + pW - 40, pY + 40, 30, 'tr', { color: 'rgba(255,255,255,0.5)', width: 2 });
    C.drawCornerBracket(ctx, pX + 40, pY + pH - 40, 30, 'bl', { color: 'rgba(255,255,255,0.5)', width: 2 });
    C.drawCornerBracket(ctx, pX + pW - 40, pY + pH - 40, 30, 'br', { color: 'rgba(255,255,255,0.5)', width: 2 });

    // Right panel: EXIF-style data
    const dX = pX + pW + 40;
    let dY = 100;

    C.drawText(ctx, 'FILE INFO', dX, dY, { font: F.mono(10, '700'), color: P.accent, align: 'left', letterSpacing: 1 });
    dY += 25;

    const exifData = [
      { label: 'File Name', value: 'VIBE_' + cardData.certId.split('-')[1] + '.JPG' },
      { label: 'Camera', value: 'VibeStamp Pro' },
      { label: 'Lens', value: 'VS 50mm f/1.4' },
      { label: 'Aperture', value: 'f/' + (Math.random() * 2 + 1).toFixed(1) },
      { label: 'Shutter', value: '1/' + Math.floor(Math.random() * 500 + 100) + 's' },
      { label: 'ISO', value: Math.floor(Math.random() * 800 + 100) },
      { label: 'Dimensions', value: image.width + '×' + image.height },
    ];

    exifData.forEach(item => {
      C.drawText(ctx, item.label, dX, dY, { font: F.mono(9), color: P.textDim, align: 'left' });
      C.drawText(ctx, String(item.value), dX + 140, dY, { font: F.mono(10, '500'), color: P.text, align: 'left' });
      dY += 22;
    });

    // Histogram
    dY += 20;
    C.drawText(ctx, 'HISTOGRAM', dX, dY, { font: F.mono(10, '700'), color: P.accent, align: 'left', letterSpacing: 1 });
    dY += 20;

    const entries = Object.entries(cardData.scores);
    const histValues = entries.map(e => e[1]);
    C.drawHistogram(ctx, histValues, dX, dY, 260, 80, { barColor: P.accent, bgColor: P.border, barCount: 24 });
    dY += 100;

    // Score readout
    C.drawText(ctx, 'VIBE METRICS', dX, dY, { font: F.mono(10, '700'), color: P.accent, align: 'left', letterSpacing: 1 });
    dY += 20;

    entries.forEach(([label, score]) => {
      C.drawText(ctx, label, dX, dY, { font: F.mono(10), color: P.textMuted, align: 'left' });
      C.drawText(ctx, score.toFixed(1), dX + 140, dY, { font: F.mono(12, '600'), color: P.text, align: 'left' });
      dY += 22;
    });

    dY += 15;
    C.drawText(ctx, 'TOTAL', dX, dY, { font: F.mono(10), color: P.textDim, align: 'left' });
    C.drawText(ctx, cardData.finalScore.toFixed(1), dX + 140, dY, { font: F.display(28, '700'), color: P.accent, align: 'left' });

    // Bottom: Verdict + metadata
    C.drawRect(ctx, 0, H - 100, W, 100, { fill: P.surface });
    C.drawLine(ctx, 0, H - 100, W, H - 100, { color: P.border, width: 0.5 });

    C.drawText(ctx, '"' + cardData.verdict + '"', 60, H - 70, { font: F.body(14, '400'), color: P.textMuted, align: 'left' });

    C.drawRobotMark(ctx, W - 80, H - 80, 24, { expression: 'certified' });

    C.drawText(ctx, cardData.certId, 60, H - 45, { font: F.mono(9), color: P.textDim, align: 'left' });
    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), W - 60, H - 45, { font: F.mono(9), color: P.textDim, align: 'right' });

    // Vibe label
    C.drawRect(ctx, W - 220, H - 70, 130, 24, { fill: P.accent, radius: 2 });
    C.drawText(ctx, cardData.vibeLabel, W - 155, H - 55, { font: F.mono(8, '700'), color: P.bg, align: 'center' });

    C.drawNoise(ctx, 0.015);
  },
};
