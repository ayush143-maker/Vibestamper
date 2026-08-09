/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 29: SIGNATURE FLAGSHIP (ALTERNATE)
   A fresh take on the flagship — vertical layout, side portrait,
   stacked score display, and a different compositional rhythm.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template29'] = {
  id: 'template29',
  name: 'Signature Flagship Alt',
  description: 'Alternate flagship with vertical layout and side portrait.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    C.drawBackground(ctx, P.bg);

    // Top accent bar
    C.drawRect(ctx, 0, 0, W, 8, { fill: P.accent });

    // Left side: Portrait (full height, partial width)
    const pX = 0;
    const pY = 0;
    const pW = 420;
    const pH = H;

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

    // Gradient fade from portrait to right side
    const fadeGrad = ctx.createLinearGradient(pW - 100, 0, pW + 100, 0);
    fadeGrad.addColorStop(0, 'rgba(7,9,9,0)');
    fadeGrad.addColorStop(1, 'rgba(7,9,9,1)');
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(pW - 100, 0, 200, H);

    // Right side content
    const contentX = pW + 60;

    // Brand
    C.drawText(ctx, 'VIBESTAMP', contentX, 80, {
      font: F.display(16, '600'), color: P.text, align: 'left', letterSpacing: 4,
    });
    C.drawLine(ctx, contentX, 95, contentX + 180, 95, { color: P.accent, width: 2 });

    // Index
    C.drawIndex(ctx, 29, 'FLAGSHIP ALT', contentX, 120, { color: P.accentDim });

    // Vibe label
    C.drawRect(ctx, contentX, 160, 200, 28, {
      fill: P.surface, stroke: P.accent, lineWidth: 1, radius: 2,
    });
    C.drawText(ctx, cardData.vibeLabel, contentX + 100, 178, {
      font: F.mono(10, '500'), color: P.accent, align: 'center', letterSpacing: 1,
    });

    // Scores (stacked vertically)
    let scoreY = 230;
    const entries = Object.entries(cardData.scores);
    entries.forEach(([label, score]) => {
      C.drawText(ctx, label, contentX, scoreY, {
        font: F.mono(9), color: P.textDim, align: 'left', letterSpacing: 1,
      });
      C.drawText(ctx, score.toFixed(1), contentX + 160, scoreY, {
        font: F.display(24, '600'), color: P.text, align: 'left',
      });
      C.drawLine(ctx, contentX, scoreY + 12, contentX + 200, scoreY + 12, {
        color: P.border, width: 0.5,
      });
      scoreY += 45;
    });

    // Final score (large)
    C.drawText(ctx, 'FINAL', contentX, scoreY + 20, {
      font: F.mono(10), color: P.textDim, align: 'left', letterSpacing: 2,
    });
    C.drawText(ctx, cardData.finalScore.toFixed(1), contentX, scoreY + 65, {
      font: F.display(56, '700'), color: P.accent, align: 'left',
    });

    // Verdict
    C.drawText(ctx, '"' + cardData.verdict + '"', contentX, scoreY + 120, {
      font: F.body(15, '400'), color: P.textMuted, align: 'left',
    });

    // Robot mark
    C.drawRobotMark(ctx, contentX, scoreY + 160, 32, { expression: 'certified' });
    C.drawText(ctx, 'VERIFIED', contentX + 16, scoreY + 205, {
      font: F.mono(8), color: P.textDim, align: 'left',
    });

    // Bottom metadata
    C.drawLine(ctx, contentX, H - 80, W - 60, H - 80, { color: P.border, width: 0.5 });
    C.drawMicroLabel(ctx, 'CERT ID', contentX, H - 60, { color: P.textDim });
    C.drawText(ctx, cardData.certId, contentX, H - 45, { font: F.mono(9), color: P.textMuted, align: 'left' });
    C.drawMicroLabel(ctx, 'ISSUED', W - 60, H - 60, { color: P.textDim, align: 'right' });
    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), W - 60, H - 45, { font: F.mono(9), color: P.textMuted, align: 'right' });

    C.drawNoise(ctx, 0.02);
  },
};
