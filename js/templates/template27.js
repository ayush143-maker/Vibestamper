/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 27: MAGAZINE INDEX
   Table of contents style, numbered entries, editorial grid,
   index page aesthetic with clean hierarchy.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template27'] = {
  id: 'template27',
  name: 'Magazine Index',
  description: 'Table of contents with numbered entries and editorial grid.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    C.drawBackground(ctx, '#f5f5f0');
    C.drawPaperTexture(ctx, 0.03);

    // Header
    C.drawText(ctx, 'CONTENTS', 60, 90, {
      font: F.display(36, '900'), color: '#1a1a1a', align: 'left',
    });
    C.drawLine(ctx, 60, 115, W - 60, 115, { color: '#1a1a1a', width: 2 });

    // Issue info
    C.drawText(ctx, 'VIBESTAMP MAGAZINE  |  ISSUE ' + Math.floor(cardData.finalScore), W - 60, 90, {
      font: F.mono(10), color: '#888888', align: 'right',
    });

    // Portrait (small, index-style thumbnail)
    const pX = 60;
    const pY = 150;
    const pW = 200;
    const pH = 250;

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

    C.drawRect(ctx, pX - 2, pY - 2, pW + 4, pH + 4, { stroke: '#cccccc', lineWidth: 1 });

    // Index entries (right of portrait)
    const entryX = pX + pW + 50;
    let entryY = 160;

    C.drawText(ctx, 'FEATURED', entryX, entryY, {
      font: F.mono(9, '700'), color: '#888888', align: 'left', letterSpacing: 2,
    });
    entryY += 30;

    // Main feature
    C.drawText(ctx, '01', entryX, entryY, { font: F.display(28, '700'), color: '#1a1a1a', align: 'left' });
    C.drawText(ctx, 'THE VIBE ANALYSIS', entryX + 60, entryY + 5, { font: F.display(16, '600'), color: '#1a1a1a', align: 'left' });
    C.drawText(ctx, cardData.verdict, entryX + 60, entryY + 28, { font: F.body(12), color: '#888888', align: 'left' });
    C.drawText(ctx, cardData.finalScore.toFixed(1), W - 60, entryY + 15, { font: F.mono(14, '600'), color: '#1a1a1a', align: 'right' });

    C.drawLine(ctx, entryX, entryY + 45, W - 60, entryY + 45, { color: '#dddddd', width: 0.5 });
    entryY += 65;

    // Score entries as article list
    const entries = Object.entries(cardData.scores);
    entries.forEach(([label, score], i) => {
      const num = String(i + 2).padStart(2, '0');

      C.drawText(ctx, num, entryX, entryY, { font: F.display(20, '700'), color: '#cccccc', align: 'left' });
      C.drawText(ctx, label + ' BREAKDOWN', entryX + 50, entryY + 3, { font: F.body(13, '500'), color: '#333333', align: 'left' });
      C.drawText(ctx, score.toFixed(1), W - 60, entryY + 8, { font: F.mono(12), color: '#888888', align: 'right' });

      // Dotted leader
      C.drawDottedLine(ctx, entryX + 180, entryY + 12, W - 100, entryY + 12, {
        color: '#cccccc', dotSize: 1, spacing: 4,
      });

      entryY += 40;
    });

    // Bottom section: Vibe label as category
    C.drawRect(ctx, 60, H - 180, W - 120, 80, { fill: '#1a1a1a' });
    C.drawText(ctx, 'CATEGORY', 80, H - 155, { font: F.mono(9), color: '#888888', align: 'left', letterSpacing: 2 });
    C.drawText(ctx, cardData.vibeLabel, 80, H - 125, { font: F.display(20, '700'), color: '#ffffff', align: 'left' });

    // Footer
    C.drawLine(ctx, 60, H - 70, W - 60, H - 70, { color: '#cccccc', width: 0.5 });
    C.drawText(ctx, cardData.certId, 60, H - 48, { font: F.mono(8), color: '#888888', align: 'left' });
    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), W - 60, H - 48, { font: F.mono(8), color: '#888888', align: 'right' });

    C.drawRobotMark(ctx, W/2 - 10, H - 40, 20, { expression: 'certified' });

    C.drawNoise(ctx, 0.01);
  },
};
