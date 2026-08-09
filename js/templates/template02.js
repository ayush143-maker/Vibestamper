/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 02: FUTURISTIC PASSPORT / SPECIMEN CARD
   Document-style layout with specimen labeling, hexagon portrait,
   data fields, and official certification strips.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template02'] = {
  id: 'template02',
  name: 'Futuristic Passport',
  description: 'Official specimen document with hexagon portrait and data fields.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Background
    C.drawBackground(ctx, P.bgElevated);
    C.drawMicroGrid(ctx, 0, 0, W, H, 60, { color: 'rgba(36,42,39,0.15)', lineWidth: 0.3 });

    // Top official strip
    C.drawRect(ctx, 0, 0, W, 50, { fill: P.surface });
    C.drawLine(ctx, 0, 50, W, 50, { color: P.accent, width: 2 });
    C.drawText(ctx, 'SPECIMEN DOCUMENT / CLASSIFIED', 40, 32, {
      font: F.mono(11, '600'), color: P.accent, align: 'left', letterSpacing: 2,
    });
    C.drawText(ctx, cardData.certId, W - 40, 32, {
      font: F.mono(10), color: P.textDim, align: 'right',
    });

    // Left column: Hexagon portrait
    const hexCX = 220;
    const hexCY = 340;
    const hexR = 130;

    // Hexagon frame
    C.drawHexagon(ctx, hexCX, hexCY, hexR + 10, { stroke: P.accentDim, lineWidth: 2 });
    C.drawHexagon(ctx, hexCX, hexCY, hexR + 4, { stroke: P.border, lineWidth: 0.5 });

    // Portrait clipped to hexagon
    ctx.save();
    C.drawHexagon(ctx, hexCX, hexCY, hexR, {});
    ctx.clip();
    const imgRatio = image.width / image.height;
    let sx, sy, sw, sh;
    if (imgRatio > 1) { sh = image.height; sw = image.height; sx = (image.width - sw) / 2; sy = 0; }
    else { sw = image.width; sh = image.width; sx = 0; sy = (image.height - sh) / 2; }
    ctx.drawImage(image, sx, sy, sw, sh, hexCX - hexR, hexCY - hexR, hexR * 2, hexR * 2);
    ctx.restore();

    // Specimen label
    C.drawRect(ctx, hexCX - 60, hexCY + hexR + 20, 120, 26, {
      fill: P.accent, radius: 2,
    });
    C.drawText(ctx, 'SPECIMEN', hexCX, hexCY + hexR + 38, {
      font: F.mono(10, '700'), color: P.bg, align: 'center',
    });

    // Right column: Document fields
    const fieldX = 420;
    const fieldY = 160;
    const fieldGap = 70;

    C.drawText(ctx, 'BIOMETRIC PROFILE', fieldX, fieldY - 30, {
      font: F.display(22, '600'), color: P.text, align: 'left',
    });
    C.drawLine(ctx, fieldX, fieldY - 18, fieldX + 300, fieldY - 18, { color: P.accent, width: 1 });

    const entries = Object.entries(cardData.scores);
    entries.forEach(([label, score], i) => {
      C.drawDocumentField(ctx, label, score.toFixed(1), fieldX, fieldY + i * fieldGap, {
        width: 280, lineColor: P.borderLight,
      });
    });

    // Final score box
    const finalBoxY = fieldY + entries.length * fieldGap + 30;
    C.drawRect(ctx, fieldX, finalBoxY, 200, 70, {
      fill: P.bg, stroke: P.accent, lineWidth: 1, radius: 2,
    });
    C.drawText(ctx, 'FINAL CLASSIFICATION', fieldX + 15, finalBoxY + 18, {
      font: F.mono(9), color: P.textDim, align: 'left', letterSpacing: 1,
    });
    C.drawText(ctx, cardData.finalScore.toFixed(1), fieldX + 15, finalBoxY + 50, {
      font: F.display(32, '700'), color: P.accent, align: 'left',
    });

    // Bottom strip: Verdict + metadata
    C.drawRect(ctx, 0, H - 100, W, 100, { fill: P.surface });
    C.drawLine(ctx, 0, H - 100, W, H - 100, { color: P.accentDim, width: 1 });

    C.drawText(ctx, '"' + cardData.verdict + '"', 40, H - 65, {
      font: F.body(16, '400'), color: P.textMuted, align: 'left',
    });

    C.drawRobotMark(ctx, W - 80, H - 80, 28, { expression: 'certified' });
    C.drawText(ctx, 'VERIFIED', W - 80, H - 45, {
      font: F.mono(8), color: P.textDim, align: 'center',
    });

    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), 40, H - 35, {
      font: F.mono(9), color: P.textDim, align: 'left',
    });
    C.drawText(ctx, 'TEMPLATE 02 / PASSPORT', W - 40, H - 35, {
      font: F.mono(9), color: P.textDim, align: 'right',
    });

    // Vibe label badge (top right floating)
    C.drawRect(ctx, W - 200, 80, 160, 28, {
      fill: P.bg, stroke: P.accentDim, lineWidth: 1, radius: 2,
    });
    C.drawText(ctx, cardData.vibeLabel, W - 120, 98, {
      font: F.mono(10, '500'), color: P.accent, align: 'center', letterSpacing: 1,
    });

    C.drawNoise(ctx, 0.015);
  },
};
