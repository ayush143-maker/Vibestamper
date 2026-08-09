/* ═══════════════════════════════════════════════════════════════
   VIBE  TEMPLATE 20: ARCHIVE SPECIMEN
   Museum label, specimen tag, catalog number,
   preservation notes, and archival aesthetic.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template20'] = {
  id: 'template20',
  name: 'Archive Specimen',
  description: 'Museum specimen tag with catalog and preservation notes.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Aged paper background
    C.drawBackground(ctx, '#0f0f0d');
    C.drawDiagonalStripes(ctx, 0, 0, W, H, 80, { color: 'rgba(139,119,101,0.03)', lineWidth: 0.5, angle: 30 });

    // Museum header
    C.drawRect(ctx, 0, 0, W, 60, { fill: '#1a1815' });
    C.drawLine(ctx, 0, 60, W, 60, { color: '#8B7355', width: 2 });
    C.drawText(ctx, 'VIBESTAMP ARCHIVE', W/2, 38, {
      font: F.display(16, '700'), color: '#C4A77D', align: 'center', letterSpacing: 4,
    });

    // Specimen tag (top right)
    C.drawRect(ctx, W - 220, 90, 160, 80, { fill: '#C4A77D', stroke: '#8B7355', lineWidth: 1 });
    C.drawText(ctx, 'SPECIMEN', W - 140, 115, { font: F.mono(9, '700'), color: '#1a1815', align: 'center' });
    C.drawText(ctx, 'NO. ' + cardData.certId.split('-')[1], W - 140, 140, { font: F.mono(12, '700'), color: '#1a1815', align: 'center' });
    C.drawText(ctx, 'CLASS: VIBE', W - 140, 158, { font: F.mono(8), color: '#5a4a3a', align: 'center' });

    // Portrait (framed like museum display)
    const pX = 80;
    const pY = 120;
    const pW = 400;
    const pH = 500;

    // Frame
    C.drawRect(ctx, pX - 15, pY - 15, pW + 30, pH + 30, { fill: '#1a1815', stroke: '#8B7355', lineWidth: 2 });
    C.drawRect(ctx, pX - 8, pY - 8, pW + 16, pH + 16, { stroke: '#5a4a3a', lineWidth: 0.5 });

    ctx.save();
    ctx.beginPath();
    ctx.rect(pX, pY, pW, pH);
    ctx.clip();
    const imgRatio = image.width / image.height;
    let sx, sy, sw, sh;
    if (imgRatio > pW / pH) { sh = image.height; sw = image.height * (pW / pH); sx = (image.width - sw) / 2; sy = 0; }
    else { sw = image.width; sh = image.width / (pW / pH); sx = 0; sy = (image.height - sh) / 2; }
    // Sepia tint
    ctx.filter = 'sepia(0.3) contrast(1.1)';
    ctx.drawImage(image, sx, sy, sw, sh, pX, pY, pW, pH);
    ctx.filter = 'none';
    ctx.restore();

    // Specimen label below portrait
    C.drawRect(ctx, pX, pY + pH + 20, pW, 50, { fill: '#C4A77D' });
    C.drawText(ctx, 'Vibestampus ' + cardData.vibeLabel.toLowerCase().replace(/ /g, '_'), pX + pW/2, pY + pH + 50, {
      font: F.mono(11, '700'), color: '#1a1815', align: 'center',
    });

    // Right side: Catalog data
    const catX = pX + pW + 60;
    let catY = 140;

    C.drawText(ctx, 'CATALOG ENTRY', catX, catY, {
      font: F.display(18, '700'), color: '#C4A77D', align: 'left',
    });
    C.drawLine(ctx, catX, catY + 12, catX + 300, catY + 12, { color: '#8B7355', width: 1 });
    catY += 40;

    const catalogData = [
      { label: 'Collection Date', value: window.VibeStampState.formatShortDate(cardData.timestamp) },
      { label: 'Collector', value: 'Vibe System' },
      { label: 'Location', value: 'Digital Realm' },
      { label: 'Condition', value: 'OPTIMAL' },
      { label: 'Preservation', value: 'LOCAL STORAGE' },
    ];

    catalogData.forEach(item => {
      C.drawText(ctx, item.label, catX, catY, { font: F.mono(9), color: '#8B7355', align: 'left' });
      C.drawText(ctx, item.value, catX + 150, catY, { font: F.mono(11, '500'), color: '#C4A77D', align: 'left' });
      catY += 28;
    });

    // Metrics section
    catY += 20;
    C.drawText(ctx, 'METRIC ANALYSIS', catX, catY, { font: F.mono(10, '700'), color: '#C4A77D', align: 'left' });
    catY += 20;

    const entries = Object.entries(cardData.scores);
    entries.forEach(([label, score]) => {
      C.drawText(ctx, label, catX, catY, { font: F.mono(10), color: '#8B7355', align: 'left' });
      C.drawText(ctx, score.toFixed(1), catX + 150, catY, { font: F.mono(12, '600'), color: '#C4A77D', align: 'left' });
      catY += 24;
    });

    catY += 15;
    C.drawText(ctx, 'AGGREGATE', catX, catY, { font: F.mono(9), color: '#8B7355', align: 'left' });
    C.drawText(ctx, cardData.finalScore.toFixed(1), catX + 150, catY, { font: F.display(28, '700'), color: '#C4A77D', align: 'left' });

    // Preservation notes
    C.drawRect(ctx, catX, H - 280, 320, 120, { fill: '#1a1815', stroke: '#8B7355', lineWidth: 0.5 });
    C.drawText(ctx, 'PRESERVATION NOTES', catX + 15, H - 260, { font: F.mono(9, '700'), color: '#8B7355', align: 'left' });
    C.drawColumnText(ctx, 'Specimen exhibits ' + cardData.verdict + ' Preservation recommended via immediate sharing. Handle with care. Main character energy detected at stable levels.', catX + 15, H - 240, 290, 18, 5, { font: F.body(11), color: '#C4A77D' });

    // Bottom: Museum footer
    C.drawLine(ctx, 60, H - 70, W - 60, H - 70, { color: '#8B7355', width: 0.5 });
    C.drawText(ctx, cardData.certId, 60, H - 48, { font: F.mono(8), color: '#5a4a3a', align: 'left' });
    C.drawText(ctx, 'TEMPLATE 20 / ARCHIVE', W - 60, H - 48, { font: F.mono(8), color: '#5a4a3a', align: 'right' });

    C.drawRobotMark(ctx, W/2 - 12, H - 45, 24, { expression: 'certified' });

    C.drawNoise(ctx, 0.02);
  },
};
