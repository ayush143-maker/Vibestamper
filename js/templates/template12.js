/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 12: NEWSPAPER/EDITORIAL
   Classic newspaper layout with columns, dateline, headline,
   and editorial typography.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template12'] = {
  id: 'template12',
  name: 'Newspaper Editorial',
  description: 'Classic newspaper columns with headline and dateline.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Newsprint background
    C.drawBackground(ctx, '#0c0c0c');

    // Masthead
    C.drawLine(ctx, 50, 50, W - 50, 50, { color: P.text, width: 2 });
    C.drawText(ctx, 'THE DAILY VIBE', W/2, 85, {
      font: F.display(32, '900'), color: P.text, align: 'center', letterSpacing: 4,
    });
    C.drawLine(ctx, 50, 105, W - 50, 105, { color: P.text, width: 1 });

    // Dateline
    const dateStr = window.VibeStampState.formatShortDate(cardData.timestamp).toUpperCase();
    C.drawText(ctx, dateStr + '  |  VOL. ' + Math.floor(cardData.finalScore) + '  |  VIBESTAMP PRESS', W/2, 122, {
      font: F.mono(9), color: P.textDim, align: 'center', letterSpacing: 1,
    });
    C.drawLine(ctx, 50, 138, W - 50, 138, { color: P.border, width: 0.5 });

    // Headline
    C.drawText(ctx, 'BREAKING:', 50, 175, {
      font: F.mono(11, '700'), color: P.accent, align: 'left', letterSpacing: 2,
    });
    C.drawText(ctx, 'SUBJECT PASSES', 50, 215, {
      font: F.display(42, '900'), color: P.text, align: 'left',
    });
    C.drawText(ctx, 'VIBE CHECK', 50, 265, {
      font: F.display(42, '900'), color: P.accent, align: 'left',
    });

    // Portrait (right side, newspaper photo style)
    const pX = W - 380;
    const pY = 160;
    const pW = 330;
    const pH = 280;

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

    // Photo caption
    C.drawText(ctx, 'Fig. 1 — Subject during analysis', pX, pY + pH + 12, {
      font: F.mono(8), color: P.textDim, align: 'left', letterSpacing: 0.5,
    });

    // Article columns
    const colY = 310;
    const colW = 220;
    const colGap = 30;

    // Column 1: Scores
    C.drawText(ctx, 'METRICS REPORT', 50, colY, {
      font: F.mono(10, '700'), color: P.text, align: 'left', letterSpacing: 1,
    });
    C.drawLine(ctx, 50, colY + 12, 50 + colW, colY + 12, { color: P.border, width: 0.5 });

    let scoreY = colY + 30;
    const entries = Object.entries(cardData.scores);
    entries.forEach(([label, score]) => {
      C.drawText(ctx, label + ':', 50, scoreY, {
        font: F.body(13), color: P.textMuted, align: 'left',
      });
      C.drawText(ctx, score.toFixed(1), 50 + colW - 10, scoreY, {
        font: F.mono(13, '600'), color: P.text, align: 'right',
      });
      scoreY += 26;
    });

    // Column 2: Verdict
    const col2X = 50 + colW + colGap;
    C.drawText(ctx, 'VERDICT', col2X, colY, {
      font: F.mono(10, '700'), color: P.text, align: 'left', letterSpacing: 1,
    });
    C.drawLine(ctx, col2X, colY + 12, col2X + colW, colY + 12, { color: P.border, width: 0.5 });

    C.drawColumnText(ctx, cardData.verdict + ' The VibeStamp editorial board has reviewed all submitted materials and reached a final determination based on proprietary aura analysis algorithms.', col2X, colY + 28, colW, 20, 8, {
      font: F.body(12), color: P.textMuted,
    });

    // Final score box (spanning bottom)
    C.drawRect(ctx, 50, H - 220, W - 100, 100, {
      fill: P.surface, stroke: P.border, lineWidth: 0.5,
    });
    C.drawText(ctx, 'FINAL DETERMINATION', 70, H - 195, {
      font: F.mono(10), color: P.textDim, align: 'left', letterSpacing: 2,
    });
    C.drawText(ctx, cardData.finalScore.toFixed(1), 70, H - 155, {
      font: F.display(48, '700'), color: P.accent, align: 'left',
    });
    C.drawText(ctx, '/100', 180, H - 155, {
      font: F.mono(16), color: P.textDim, align: 'left',
    });

    // Vibe label stamp
    C.drawStamp(ctx, cardData.vibeLabel, W - 150, H - 170, {
      radius: 35, color: P.accent, textColor: P.accent, fontSize: 7, rotate: -10,
    });

    // Footer
    C.drawLine(ctx, 50, H - 70, W - 50, H - 70, { color: P.border, width: 0.5 });
    C.drawText(ctx, cardData.certId, 50, H - 50, {
      font: F.mono(8), color: P.textDim, align: 'left',
    });
    C.drawText(ctx, 'TEMPLATE 12 / PRESS', W - 50, H - 50, {
      font: F.mono(8), color: P.textDim, align: 'right',
    });

    C.drawNoise(ctx, 0.015);
  },
};
