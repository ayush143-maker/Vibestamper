/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 15: PRODUCT LABEL/BARCODE
   Nutrition label style, ingredients list, barcode,
   certification marks, and product packaging aesthetic.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template15'] = {
  id: 'template15',
  name: 'Product Label',
  description: 'Nutrition label style with barcode and ingredients.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    C.drawBackground(ctx, '#f5f5f5'); // Light background for label contrast

    // Product label container
    C.drawRect(ctx, 60, 60, W - 120, H - 120, { fill: '#ffffff', stroke: '#000000', lineWidth: 2 });
    C.drawRect(ctx, 65, 65, W - 130, H - 130, { stroke: '#000000', lineWidth: 0.5 });

    // Brand header
    C.drawRect(ctx, 60, 60, W - 120, 80, { fill: '#000000' });
    C.drawText(ctx, 'VIBESTAMP', 90, 105, {
      font: F.display(22, '900'), color: '#ffffff', align: 'left',
    });
    C.drawText(ctx, 'PREMIUM VIBE PRODUCT', W - 90, 105, {
      font: F.mono(10), color: '#888888', align: 'right', letterSpacing: 2,
    });

    // Portrait (product image style)
    const pX = 90;
    const pY = 170;
    const pW = 280;
    const pH = 350;

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

    C.drawRect(ctx, pX - 3, pY - 3, pW + 6, pH + 6, { stroke: '#000000', lineWidth: 1 });

    // Nutrition-style label (right side)
    const labelX = pX + pW + 50;
    let labelY = 170;

    C.drawText(ctx, 'VIBE FACTS', labelX, labelY, {
      font: F.display(20, '900'), color: '#000000', align: 'left',
    });
    C.drawLine(ctx, labelX, labelY + 12, labelX + 300, labelY + 12, { color: '#000000', width: 2 });
    labelY += 35;

    // Serving size
    C.drawText(ctx, 'Serving Size', labelX, labelY, { font: F.mono(10), color: '#666666', align: 'left' });
    C.drawText(ctx, '1 Vibe', labelX + 200, labelY, { font: F.mono(10, '600'), color: '#000000', align: 'right' });
    labelY += 22;
    C.drawLine(ctx, labelX, labelY, labelX + 300, labelY, { color: '#cccccc', width: 0.5 });
    labelY += 15;

    // Score rows (nutrition style)
    const entries = Object.entries(cardData.scores);
    entries.forEach(([label, score]) => {
      C.drawText(ctx, label, labelX, labelY, { font: F.mono(11, '600'), color: '#000000', align: 'left' });
      C.drawText(ctx, score.toFixed(1) + ' pts', labelX + 200, labelY, { font: F.mono(11), color: '#000000', align: 'right' });

      // Percentage bar
      const barW = 120;
      const fillW = (score / 100) * barW;
      C.drawRect(ctx, labelX + 80, labelY + 8, barW, 6, { fill: '#eeeeee' });
      C.drawRect(ctx, labelX + 80, labelY + 8, fillW, 6, { fill: '#18E58A' });

      labelY += 32;
      C.drawLine(ctx, labelX, labelY - 5, labelX + 300, labelY - 5, { color: '#cccccc', width: 0.5 });
    });

    // Total
    labelY += 10;
    C.drawLine(ctx, labelX, labelY, labelX + 300, labelY, { color: '#000000', width: 3 });
    labelY += 20;
    C.drawText(ctx, 'TOTAL VIBE', labelX, labelY, { font: F.mono(12, '900'), color: '#000000', align: 'left' });
    C.drawText(ctx, cardData.finalScore.toFixed(1), labelX + 200, labelY, { font: F.mono(24, '900'), color: '#000000', align: 'right' });

    // Ingredients (verdict)
    labelY += 40;
    C.drawText(ctx, 'INGREDIENTS:', labelX, labelY, { font: F.mono(9, '700'), color: '#666666', align: 'left' });
    C.drawColumnText(ctx, cardData.verdict + ', certified vibes, main character energy, zero notes, locked in aura.', labelX, labelY + 18, 300, 16, 4, {
      font: F.body(11), color: '#666666',
    });

    // Barcode at bottom
    const barcodeY = H - 180;
    C.drawBarcode(ctx, 90, barcodeY, 300, 70, { color: '#000000', density: 40 });
    C.drawText(ctx, cardData.certId, 90, barcodeY + 85, { font: F.mono(10), color: '#666666', align: 'left' });

    // Vibe label certification mark
    C.drawRect(ctx, W - 220, barcodeY, 140, 50, { fill: '#000000', radius: 2 });
    C.drawText(ctx, cardData.vibeLabel, W - 150, barcodeY + 30, {
      font: F.mono(9, '700'), color: '#ffffff', align: 'center', letterSpacing: 1,
    });

    // Robot mark
    C.drawRobotMark(ctx, W - 80, barcodeY + 10, 24, { expression: 'certified' });

    C.drawNoise(ctx, 0.01);
  },
};
