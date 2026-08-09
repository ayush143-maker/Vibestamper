/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 05: DIGITAL BIOMETRIC PROFILE
   Scan-line aesthetic, hexagonal elements, data readouts,
   technical readouts with a clinical digital feel.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template05'] = {
  id: 'template05',
  name: 'Digital Biometric',
  description: 'Clinical digital profile with scan lines and hex data.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Background with scan lines
    C.drawBackground(ctx, P.bg);
    C.drawScanLines(ctx, 0, 0, W, H, 6, { color: 'rgba(24, 229, 138, 0.04)' });

    // Top header bar
    C.drawRect(ctx, 0, 0, W, 60, { fill: P.surface });
    C.drawLine(ctx, 0, 60, W, 60, { color: P.accentDim, width: 1 });
    C.drawText(ctx, 'BIOMETRIC ANALYSIS SYSTEM', 40, 38, {
      font: F.mono(11, '600'), color: P.accent, align: 'left', letterSpacing: 2,
    });
    C.drawText(ctx, 'ID: ' + cardData.certId.split('-')[1], W - 40, 38, {
      font: F.mono(10), color: P.textDim, align: 'right',
    });

    // Left: Hexagon portrait with scan overlay
    const hexCX = 260;
    const hexCY = 380;
    const hexR = 150;

    // Outer hex rings
    C.drawHexagon(ctx, hexCX, hexCY, hexR + 20, { stroke: 'rgba(24,229,138,0.2)', lineWidth: 1 });
    C.drawHexagon(ctx, hexCX, hexCY, hexR + 10, { stroke: P.accentDim, lineWidth: 1 });

    // Portrait in hex
    ctx.save();
    C.drawHexagon(ctx, hexCX, hexCY, hexR, {});
    ctx.clip();
    const imgRatio = image.width / image.height;
    let sx, sy, sw, sh;
    if (imgRatio > 1) { sh = image.height; sw = image.height; sx = (image.width - sw) / 2; sy = 0; }
    else { sw = image.width; sh = image.width; sx = 0; sy = (image.height - sh) / 2; }
    ctx.drawImage(image, sx, sy, sw, sh, hexCX - hexR, hexCY - hexR, hexR * 2, hexR * 2);
    ctx.restore();

    // Scan line sweep across portrait
    C.drawLine(ctx, hexCX - hexR - 20, hexCY, hexCX + hexR + 20, hexCY, {
      color: 'rgba(24,229,138,0.4)', width: 1, dash: [8, 4],
    });

    // Corner brackets on hex
    const hexPoints = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      hexPoints.push({
        x: hexCX + (hexR + 25) * Math.cos(angle),
        y: hexCY + (hexR + 25) * Math.sin(angle),
      });
    }
    hexPoints.forEach((pt, i) => {
      const next = hexPoints[(i + 1) % 6];
      const mx = (pt.x + next.x) / 2;
      const my = (pt.y + next.y) / 2;
      C.drawCircle(ctx, mx, my, 2, { fill: P.accent });
    });

    // Right side: Data columns
    const dataX = 520;
    const dataY = 140;

    C.drawText(ctx, 'SUBJECT METRICS', dataX, dataY, {
      font: F.display(20, '600'), color: P.text, align: 'left',
    });
    C.drawLine(ctx, dataX, dataY + 12, dataX + 280, dataY + 12, { color: P.accent, width: 1 });

    // Circular gauges for each score
    const entries = Object.entries(cardData.scores);
    let gaugeY = dataY + 50;
    let gaugeX = dataX;
    entries.forEach(([label, score], i) => {
      C.drawCircularGauge(ctx, score, label, gaugeX + 50, gaugeY + 50, 35, {
        trackColor: P.border, fillColor: P.accent, textColor: P.text, labelColor: P.textDim,
      });
      gaugeX += 130;
      if ((i + 1) % 3 === 0) { gaugeX = dataX; gaugeY += 130; }
    });

    // Final score (large, below gauges)
    const finalY = gaugeY + 40;
    C.drawText(ctx, 'AGGREGATE', dataX, finalY, {
      font: F.mono(10), color: P.textDim, align: 'left', letterSpacing: 2,
    });
    C.drawText(ctx, cardData.finalScore.toFixed(1), dataX, finalY + 45, {
      font: F.display(56, '700'), color: P.accent, align: 'left',
    });

    // Vibe label
    C.drawRect(ctx, dataX, finalY + 70, 200, 28, {
      fill: 'rgba(24,229,138,0.1)', stroke: P.accentDim, lineWidth: 1, radius: 2,
    });
    C.drawText(ctx, cardData.vibeLabel, dataX + 100, finalY + 88, {
      font: F.mono(10, '500'), color: P.accent, align: 'center', letterSpacing: 1,
    });

    // Bottom: Verdict + metadata
    C.drawRect(ctx, 0, H - 120, W, 120, { fill: P.surface });
    C.drawLine(ctx, 0, H - 120, W, H - 120, { color: P.border, width: 0.5 });

    C.drawText(ctx, 'ANALYSIS: ' + cardData.verdict, 40, H - 85, {
      font: F.body(16, '400'), color: P.textMuted, align: 'left',
    });

    C.drawRobotMark(ctx, W - 80, H - 100, 28, { expression: 'scanning' });
    C.drawText(ctx, 'SYSTEM VERIFIED', W - 80, H - 65, {
      font: F.mono(8), color: P.textDim, align: 'center',
    });

    C.drawText(ctx, cardData.certId, 40, H - 50, {
      font: F.mono(9), color: P.textDim, align: 'left',
    });
    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), W - 40, H - 50, {
      font: F.mono(9), color: P.textDim, align: 'right',
    });

    C.drawNoise(ctx, 0.015);
  },
};
