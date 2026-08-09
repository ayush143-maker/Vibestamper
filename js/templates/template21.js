/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 21: HIGH-FASHION CAMPAIGN
   Runway poster, dramatic lighting, bold minimal type,
   campaign season aesthetic with model focus.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template21'] = {
  id: 'template21',
  name: 'High-Fashion Campaign',
  description: 'Runway poster with dramatic lighting and bold type.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Deep black with subtle warm undertone
    C.drawBackground(ctx, '#080808');

    // Dramatic portrait (full width, cropped)
    const pH = 750;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, pH);
    ctx.clip();
    const imgRatio = image.width / image.height;
    let sx, sy, sw, sh;
    if (imgRatio > W / pH) { sh = image.height; sw = image.height * (W / pH); sx = (image.width - sw) / 2; sy = 0; }
    else { sw = image.width; sh = image.width / (W / pH); sx = 0; sy = (image.height - sh) / 2; }
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, W, pH);
    ctx.restore();

    // Dramatic bottom gradient
    const grad = ctx.createLinearGradient(0, pH - 300, 0, pH);
    grad.addColorStop(0, 'rgba(8,8,8,0)');
    grad.addColorStop(1, 'rgba(8,8,8,1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, pH - 300, W, 300);

    // Season text
    C.drawText(ctx, 'FW/26', 50, pH - 120, {
      font: F.display(14, '300'), color: 'rgba(255,255,255,0.4)', align: 'left', letterSpacing: 4,
    });

    // Campaign title
    C.drawText(ctx, 'VIBE', 50, pH - 80, {
      font: F.display(72, '900'), color: '#ffffff', align: 'left',
    });
    C.drawText(ctx, 'COLLECTION', 50, pH - 20, {
      font: F.display(28, '300'), color: P.accent, align: 'left', letterSpacing: 6,
    });

    // Score as campaign metric
    C.drawText(ctx, cardData.finalScore.toFixed(1), W - 50, pH - 80, {
      font: F.display(64, '700'), color: '#ffffff', align: 'right',
    });
    C.drawText(ctx, 'CAMPAIGN SCORE', W - 50, pH - 40, {
      font: F.mono(9), color: 'rgba(255,255,255,0.4)', align: 'right', letterSpacing: 2,
    });

    // Bottom section: Scores as look numbers
    const lookY = pH + 60;
    C.drawLine(ctx, 50, lookY, W - 50, lookY, { color: '#333333', width: 0.5 });

    const entries = Object.entries(cardData.scores);
    let lookX = 50;
    entries.forEach(([label, score], i) => {
      C.drawText(ctx, 'LOOK ' + String(i + 1).padStart(2, '0'), lookX, lookY + 25, {
        font: F.mono(9), color: '#555555', align: 'left',
      });
      C.drawText(ctx, label, lookX, lookY + 45, {
        font: F.mono(10, '500'), color: '#888888', align: 'left',
      });
      C.drawText(ctx, score.toFixed(1), lookX, lookY + 70, {
        font: F.display(20, '600'), color: '#ffffff', align: 'left',
      });
      lookX += 140;
    });

    // Verdict
    C.drawText(ctx, '"' + cardData.verdict + '"', 50, lookY + 120, {
      font: F.body(16, '300'), color: '#888888', align: 'left',
    });

    // Vibe label
    C.drawText(ctx, cardData.vibeLabel, 50, lookY + 155, {
      font: F.mono(10, '500'), color: P.accent, align: 'left', letterSpacing: 2,
    });

    // Footer
    C.drawLine(ctx, 50, H - 60, W - 50, H - 60, { color: '#333333', width: 0.5 });
    C.drawText(ctx, cardData.certId, 50, H - 38, { font: F.mono(8), color: '#555555', align: 'left' });
    C.drawText(ctx, 'TEMPLATE 21 / CAMPAIGN', W - 50, H - 38, { font: F.mono(8), color: '#555555', align: 'right' });

    C.drawRobotMark(ctx, W/2 - 12, H - 40, 24, { expression: 'certified' });

    C.drawNoise(ctx, 0.02);
  },
};
