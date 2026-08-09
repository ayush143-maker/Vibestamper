/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 10: MUSIC COVER PORTRAIT
   Album cover aesthetic with tracklist-style scores,
   artistic layout, and cover-art proportions.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template10'] = {
  id: 'template10',
  name: 'Music Cover',
  description: 'Album cover aesthetic with tracklist score layout.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Background: deep gradient
    C.drawGradientBackground(ctx, '#0c0e0d', '#070909');

    // Large portrait (upper 60%)
    const pH = 780;
    const pW = W;
    const pX = 0;
    const pY = 0;

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

    // Gradient overlay at bottom of portrait
    const fadeGrad = ctx.createLinearGradient(0, pH - 200, 0, pH);
    fadeGrad.addColorStop(0, 'rgba(7,9,9,0)');
    fadeGrad.addColorStop(1, 'rgba(7,9,9,1)');
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(0, pH - 200, W, 200);

    // Album title overlay on portrait
    C.drawText(ctx, 'VIBE', 50, pH - 140, {
      font: F.display(72, '900'), color: P.text, align: 'left',
    });
    C.drawText(ctx, 'STAMP', 50, pH - 70, {
      font: F.display(48, '300'), color: P.accent, align: 'left',
    });

    // Bottom section: Tracklist-style scores
    const listY = pH + 40;
    const leftCol = 60;

    // Artist / subject info
    C.drawText(ctx, 'CERTIFIED VIBE', leftCol, listY, {
      font: F.mono(10), color: P.textDim, align: 'left', letterSpacing: 2,
    });

    // Tracklist header
    C.drawLine(ctx, leftCol, listY + 20, W - 60, listY + 20, { color: P.border, width: 0.5 });

    const entries = Object.entries(cardData.scores);
    let trackY = listY + 50;

    entries.forEach(([label, score], i) => {
      const trackNum = String(i + 1).padStart(2, '0');

      // Track number
      C.drawText(ctx, trackNum, leftCol, trackY, {
        font: F.mono(12), color: P.textDim, align: 'left',
      });

      // Track name (score label)
      C.drawText(ctx, label, leftCol + 40, trackY, {
        font: F.body(15, '500'), color: P.text, align: 'left',
      });

      // Duration-style score
      C.drawText(ctx, score.toFixed(1), W - 60, trackY, {
        font: F.mono(13), color: P.textMuted, align: 'right',
      });

      trackY += 36;
    });

    // Separator
    C.drawLine(ctx, leftCol, trackY + 10, W - 60, trackY + 10, { color: P.border, width: 0.5 });

    // Final score as "total duration"
    C.drawText(ctx, 'TOTAL', leftCol, trackY + 40, {
      font: F.mono(10), color: P.textDim, align: 'left',
    });
    C.drawText(ctx, cardData.finalScore.toFixed(1), W - 60, trackY + 40, {
      font: F.display(24, '700'), color: P.accent, align: 'right',
    });

    // Verdict as "album review"
    C.drawText(ctx, '"' + cardData.verdict + '"', leftCol, trackY + 80, {
      font: F.body(14, '400'), color: P.textMuted, align: 'left',
    });

    // Vibe label
    C.drawRect(ctx, leftCol, trackY + 105, 140, 26, {
      fill: P.accent, radius: 2,
    });
    C.drawText(ctx, cardData.vibeLabel, leftCol + 70, trackY + 122, {
      font: F.mono(9, '700'), color: P.bg, align: 'center', letterSpacing: 1,
    });

    // Bottom metadata bar
    C.drawLine(ctx, 40, H - 60, W - 40, H - 60, { color: P.border, width: 0.5 });
    C.drawText(ctx, cardData.certId, 40, H - 38, {
      font: F.mono(9), color: P.textDim, align: 'left',
    });
    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), W/2, H - 38, {
      font: F.mono(9), color: P.textDim, align: 'center',
    });
    C.drawText(ctx, 'TEMPLATE 10 / COVER', W - 40, H - 38, {
      font: F.mono(9), color: P.textDim, align: 'right',
    });

    // Small robot
    C.drawRobotMark(ctx, W - 60, trackY + 105, 22, { expression: 'certified' });

    C.drawNoise(ctx, 0.02);
  },
};
