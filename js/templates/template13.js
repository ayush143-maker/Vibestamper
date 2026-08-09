/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 13: CLASSIFIED DOSSIER
   Redacted text, confidential stamps, folder aesthetic,
   top-secret document styling.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template13'] = {
  id: 'template13',
  name: 'Classified Dossier',
  description: 'Top-secret document with redactions and stamps.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Manila folder color background
    C.drawBackground(ctx, '#0f0f0d');
    C.drawDiagonalStripes(ctx, 0, 0, W, H, 60, { color: 'rgba(255,255,255,0.02)', lineWidth: 0.5, angle: 45 });

    // Top secret banner
    C.drawRect(ctx, 0, 40, W, 50, { fill: '#8B0000' });
    C.drawText(ctx, 'TOP SECRET — EYES ONLY', W/2, 72, {
      font: F.display(16, '900'), color: '#F2F5F2', align: 'center', letterSpacing: 4,
    });

    // Folder tab
    C.drawRect(ctx, 60, 0, 180, 40, { fill: '#1a1a18' });
    C.drawText(ctx, 'DOSSIER', 150, 26, {
      font: F.mono(10), color: P.textDim, align: 'center',
    });

    // Portrait with redaction bars
    const pX = 60;
    const pY = 130;
    const pW = 320;
    const pH = 400;

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

    // Redaction bars over portrait
    C.drawRect(ctx, pX + 20, pY + 30, 200, 18, { fill: '#1a1a1a' });
    C.drawRect(ctx, pX + 40, pY + 120, 180, 18, { fill: '#1a1a1a' });
    C.drawRect(ctx, pX + 10, pY + 250, 220, 18, { fill: '#1a1a1a' });

    // Photo label
    C.drawText(ctx, 'PHOTOGRAPH — CLASSIFIED', pX, pY + pH + 15, {
      font: F.mono(8), color: P.textDim, align: 'left', letterSpacing: 1,
    });

    // Right side: Dossier data
    const dX = pX + pW + 50;
    let dY = 130;

    C.drawText(ctx, 'SUBJECT FILE', dX, dY, {
      font: F.display(18, '700'), color: P.text, align: 'left',
    });
    C.drawLine(ctx, dX, dY + 12, dX + 300, dY + 12, { color: '#8B0000', width: 1 });
    dY += 40;

    // Document fields with some redacted
    const fields = [
      { label: 'FILE NO', value: cardData.certId, redact: false },
      { label: 'AURA INDEX', value: cardData.scores.AURA?.toFixed(1) || '—', redact: false },
      { label: 'CLEARANCE', value: 'LEVEL 5', redact: true },
      { label: 'STATUS', value: cardData.vibeLabel, redact: false },
      { label: 'ORIGIN', value: 'LOCAL SCAN', redact: true },
    ];

    fields.forEach(field => {
      C.drawText(ctx, field.label, dX, dY, {
        font: F.mono(9), color: P.textDim, align: 'left', letterSpacing: 1,
      });

      if (field.redact) {
        C.drawRect(ctx, dX + 120, dY - 10, 150, 16, { fill: '#1a1a1a' });
        C.drawText(ctx, '[REDACTED]', dX + 125, dY, {
          font: F.mono(9), color: '#8B0000', align: 'left',
        });
      } else {
        C.drawText(ctx, field.value, dX + 120, dY, {
          font: F.mono(12, '500'), color: P.text, align: 'left',
        });
      }
      dY += 32;
    });

    // Score grid
    dY += 20;
    C.drawText(ctx, 'METRICS ANALYSIS', dX, dY, {
      font: F.mono(10, '700'), color: P.text, align: 'left', letterSpacing: 1,
    });
    dY += 25;

    const entries = Object.entries(cardData.scores);
    entries.forEach(([label, score]) => {
      C.drawText(ctx, label, dX, dY, { font: F.mono(10), color: P.textMuted, align: 'left' });
      C.drawText(ctx, score.toFixed(1), dX + 200, dY, { font: F.mono(12, '600'), color: P.text, align: 'right' });
      dY += 24;
    });

    // Final score
    dY += 15;
    C.drawText(ctx, 'COMPOSITE', dX, dY, { font: F.mono(10), color: P.textDim, align: 'left' });
    C.drawText(ctx, cardData.finalScore.toFixed(1), dX + 200, dY, { font: F.display(24, '700'), color: '#8B0000', align: 'right' });

    // Verdict
    C.drawRect(ctx, 60, H - 220, W - 120, 80, {
      fill: 'rgba(139,0,0,0.1)', stroke: '#8B0000', lineWidth: 1,
    });
    C.drawText(ctx, 'ANALYST NOTE:', 80, H - 195, {
      font: F.mono(9, '700'), color: '#8B0000', align: 'left', letterSpacing: 1,
    });
    C.drawText(ctx, '"' + cardData.verdict + '"', 80, H - 170, {
      font: F.body(14, '400'), color: P.textMuted, align: 'left',
    });

    // Bottom stamps
    C.drawStamp(ctx, 'CLASSIFIED', 120, H - 100, { radius: 40, color: '#8B0000', textColor: '#8B0000', fontSize: 8, rotate: -15 });
    C.drawStamp(ctx, 'CONFIDENTIAL', W - 120, H - 100, { radius: 40, color: '#8B0000', textColor: '#8B0000', fontSize: 8, rotate: 12 });

    C.drawText(ctx, cardData.certId, 60, H - 45, { font: F.mono(8), color: P.textDim, align: 'left' });
    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), W - 60, H - 45, { font: F.mono(8), color: P.textDim, align: 'right' });

    C.drawNoise(ctx, 0.02);
  },
};
