/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 08: STREETWEAR RATING CARD
   Bold blocks, rating bars, urban typography. Sticker-like
   elements with a raw, hypebeast aesthetic.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template08'] = {
  id: 'template08',
  name: 'Streetwear Rating',
  description: 'Urban streetwear style with bold blocks and ratings.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Dark concrete background
    C.drawBackground(ctx, '#0a0a0a');
    C.drawDiagonalStripes(ctx, 0, 0, W, H, 40, { color: 'rgba(255,255,255,0.015)', lineWidth: 0.5, angle: 30 });

    // Top: Bold brand block
    C.drawRect(ctx, 0, 0, W, 80, { fill: P.accent });
    C.drawText(ctx, 'VIBESTAMP', 40, 50, {
      font: F.display(28, '900'), color: P.bg, align: 'left',
    });
    C.drawText(ctx, 'RATING CARD', W - 40, 50, {
      font: F.mono(12, '700'), color: P.bg, align: 'right', letterSpacing: 3,
    });

    // Portrait: large, slightly offset, with shadow
    const pX = 60;
    const pY = 120;
    const pW = 460;
    const pH = 580;

    C.drawPortraitWithShadow(ctx, image, pX, pY, pW, pH, 4, {
      shadowColor: 'rgba(0,0,0,0.6)', shadowBlur: 30, shadowOffsetY: 15,
    });

    // Portrait border
    C.drawRect(ctx, pX - 3, pY - 3, pW + 6, pH + 6, { stroke: P.accent, lineWidth: 2 });

    // Right side: Rating blocks
    const rX = pX + pW + 50;
    let rY = 140;

    // Final score big block
    C.drawRect(ctx, rX, rY, 200, 100, { fill: P.surface, stroke: P.border, lineWidth: 1 });
    C.drawText(ctx, 'RATING', rX + 15, rY + 20, {
      font: F.mono(9), color: P.textDim, align: 'left', letterSpacing: 2,
    });
    C.drawText(ctx, cardData.finalScore.toFixed(0), rX + 15, rY + 75, {
      font: F.display(48, '900'), color: P.accent, align: 'left',
    });
    C.drawText(ctx, '/100', rX + 110, rY + 75, {
      font: F.mono(14), color: P.textDim, align: 'left',
    });

    rY += 130;

    // Individual score bars
    const entries = Object.entries(cardData.scores);
    entries.forEach(([label, score]) => {
      const barW = 200;
      const fillW = (score / 100) * barW;

      C.drawText(ctx, label, rX, rY, {
        font: F.mono(10, '600'), color: P.text, align: 'left',
      });

      // Bar background
      C.drawRect(ctx, rX, rY + 18, barW, 12, { fill: P.bg });
      // Bar fill
      C.drawRect(ctx, rX, rY + 18, fillW, 12, { fill: P.accent });

      C.drawText(ctx, score.toFixed(1), rX + barW + 10, rY + 28, {
        font: F.mono(11, '500'), color: P.accent, align: 'left',
      });

      rY += 55;
    });

    // Block rating
    rY += 20;
    C.drawText(ctx, 'BLOCK RATING', rX, rY, {
      font: F.mono(9), color: P.textDim, align: 'left', letterSpacing: 2,
    });
    C.drawBlockRating(ctx, rX, rY + 18, cardData.finalScore, 5, {
      size: 28, gap: 6, fillColor: P.accent, emptyColor: P.border,
    });

    // Bottom strip: Verdict + metadata
    C.drawRect(ctx, 0, H - 160, W, 160, { fill: P.surface });
    C.drawLine(ctx, 0, H - 160, W, H - 160, { color: P.accent, width: 2 });

    // Verdict
    C.drawText(ctx, '"' + cardData.verdict + '"', 40, H - 120, {
      font: F.display(22, '700'), color: P.text, align: 'left',
    });

    // Vibe label sticker
    C.drawRect(ctx, 40, H - 80, 160, 32, { fill: P.accent, radius: 2 });
    C.drawText(ctx, cardData.vibeLabel, 120, H - 60, {
      font: F.mono(10, '700'), color: P.bg, align: 'center', letterSpacing: 1,
    });

    // Robot mark
    C.drawRobotMark(ctx, W - 80, H - 100, 32, { expression: 'certified' });

    C.drawText(ctx, cardData.certId, W - 40, H - 55, {
      font: F.mono(9), color: P.textDim, align: 'right',
    });
    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), W - 40, H - 38, {
      font: F.mono(9), color: P.textDim, align: 'right',
    });

    C.drawNoise(ctx, 0.02);
  },
};
