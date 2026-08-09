/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 09: TECHNICAL SCAN REPORT
   Radar chart for scores, scan grid, measurement marks,
   technical readouts with precise engineering aesthetic.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template09'] = {
  id: 'template09',
  name: 'Technical Scan',
  description: 'Engineering report with radar chart and scan grid.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Technical background
    C.drawBackground(ctx, P.bgElevated);
    C.drawMicroGrid(ctx, 0, 0, W, H, 30, { color: 'rgba(36,42,39,0.2)', lineWidth: 0.3 });

    // Top header
    C.drawRect(ctx, 0, 0, W, 50, { fill: P.surface });
    C.drawLine(ctx, 0, 50, W, 50, { color: P.accent, width: 1 });
    C.drawText(ctx, 'TECHNICAL SCAN REPORT — VIBE ANALYSIS', 40, 32, {
      font: F.mono(11, '600'), color: P.accent, align: 'left', letterSpacing: 1,
    });
    C.drawText(ctx, 'DOC REF: ' + cardData.certId, W - 40, 32, {
      font: F.mono(9), color: P.textDim, align: 'right',
    });

    // Left: Portrait in technical frame
    const pX = 80;
    const pY = 120;
    const pW = 360;
    const pH = 450;

    // Technical frame with measurement marks
    C.drawRect(ctx, pX - 10, pY - 10, pW + 20, pH + 20, { stroke: P.border, lineWidth: 1 });
    C.drawCornerBracket(ctx, pX - 15, pY - 15, 20, 'tl', { color: P.accent, width: 2 });
    C.drawCornerBracket(ctx, pX + pW + 15, pY - 15, 20, 'tr', { color: P.accent, width: 2 });
    C.drawCornerBracket(ctx, pX - 15, pY + pH + 15, 20, 'bl', { color: P.accent, width: 2 });
    C.drawCornerBracket(ctx, pX + pW + 15, pY + pH + 15, 20, 'br', { color: P.accent, width: 2 });

    // Measurement ticks
    for (let i = 0; i <= 10; i++) {
      const ty = pY + (pH / 10) * i;
      C.drawLine(ctx, pX - 15, ty, pX - 8, ty, { color: P.textDim, width: 0.5 });
      C.drawLine(ctx, pX + pW + 8, ty, pX + pW + 15, ty, { color: P.textDim, width: 0.5 });
    }

    // Portrait
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

    // Scan line overlay
    C.drawLine(ctx, pX, pY + pH / 2, pX + pW, pY + pH / 2, {
      color: 'rgba(24,229,138,0.3)', width: 1, dash: [6, 3],
    });

    // Right: Radar chart
    const radarCX = 720;
    const radarCY = 380;
    const radarR = 160;

    const entries = Object.entries(cardData.scores);
    const labels = entries.map(e => e[0]);
    const values = entries.map(e => e[1]);

    C.drawRadarChart(ctx, values, labels, radarCX, radarCY, radarR, {
      fillColor: 'rgba(24, 229, 138, 0.12)',
      strokeColor: P.accent,
      gridColor: P.border,
      textColor: P.textDim,
    });

    // Radar center: Final score
    C.drawText(ctx, cardData.finalScore.toFixed(1), radarCX, radarCY + 6, {
      font: F.display(28, '700'), color: P.accent, align: 'center',
    });

    // Below radar: Score table
    const tableX = 560;
    let tableY = radarCY + radarR + 50;

    C.drawText(ctx, 'METRIC BREAKDOWN', tableX, tableY, {
      font: F.mono(10, '600'), color: P.text, align: 'left', letterSpacing: 1,
    });
    C.drawLine(ctx, tableX, tableY + 10, tableX + 320, tableY + 10, { color: P.accent, width: 1 });
    tableY += 30;

    entries.forEach(([label, score]) => {
      C.drawText(ctx, label, tableX, tableY, {
        font: F.mono(11), color: P.textMuted, align: 'left',
      });
      C.drawText(ctx, score.toFixed(1), tableX + 200, tableY, {
        font: F.mono(13, '500'), color: P.text, align: 'right',
      });
      C.drawLine(ctx, tableX, tableY + 8, tableX + 200, tableY + 8, { color: P.border, width: 0.3 });
      tableY += 28;
    });

    // Bottom: Verdict + metadata
    C.drawRect(ctx, 0, H - 130, W, 130, { fill: P.surface });
    C.drawLine(ctx, 0, H - 130, W, H - 130, { color: P.border, width: 0.5 });

    C.drawText(ctx, 'SCAN VERDICT:', 40, H - 100, {
      font: F.mono(10), color: P.accent, align: 'left', letterSpacing: 1,
    });
    C.drawText(ctx, '"' + cardData.verdict + '"', 40, H - 75, {
      font: F.body(16, '400'), color: P.textMuted, align: 'left',
    });

    // Vibe label badge
    C.drawRect(ctx, 40, H - 55, 180, 26, {
      fill: 'rgba(24,229,138,0.1)', stroke: P.accentDim, lineWidth: 1, radius: 2,
    });
    C.drawText(ctx, cardData.vibeLabel, 130, H - 40, {
      font: F.mono(9, '500'), color: P.accent, align: 'center', letterSpacing: 1,
    });

    C.drawRobotMark(ctx, W - 80, H - 100, 28, { expression: 'certified' });
    C.drawText(ctx, 'SYS.VERIFIED', W - 80, H - 65, {
      font: F.mono(8), color: P.textDim, align: 'center',
    });

    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), W - 40, H - 40, {
      font: F.mono(9), color: P.textDim, align: 'right',
    });

    // Registration marks
    C.drawRegistrationMarks(ctx, 20, 8);

    C.drawNoise(ctx, 0.015);
  },
};
