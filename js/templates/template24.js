/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 24: MATRIX/TERMINAL
   Cascading code rain, green digital rain effect,
   different from T06 — more immersive, full-screen rain.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template24'] = {
  id: 'template24',
  name: 'Matrix Terminal',
  description: 'Full-screen cascading code rain with portrait overlay.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Black background
    C.drawBackground(ctx, '#000000');

    // Matrix rain effect
    C.drawMatrixRain(ctx, 0, 0, W, H, { color: '#18E58A', fontSize: 12, density: 0.25 });

    // Central portrait with glow
    const pCX = W/2;
    const pCY = 400;
    const pR = 140;

    // Green glow
    C.drawCircle(ctx, pCX, pCY, pR + 30, { fill: 'rgba(24,229,138,0.1)' });
    C.drawCircle(ctx, pCX, pCY, pR + 15, { fill: 'rgba(24,229,138,0.05)' });

    // Portrait with green tint
    ctx.save();
    ctx.beginPath();
    ctx.arc(pCX, pCY, pR, 0, Math.PI * 2);
    ctx.clip();
    const imgRatio = image.width / image.height;
    let sx, sy, sw, sh;
    if (imgRatio > 1) { sh = image.height; sw = image.height; sx = (image.width - sw) / 2; sy = 0; }
    else { sw = image.width; sh = image.width; sx = 0; sy = (image.height - sh) / 2; }
    ctx.filter = 'contrast(1.2) brightness(0.9)';
    ctx.drawImage(image, sx, sy, sw, sh, pCX - pR, pCY - pR, pR * 2, pR * 2);
    ctx.filter = 'none';
    ctx.restore();

    // Green ring
    C.drawCircle(ctx, pCX, pCY, pR, { stroke: '#18E58A', lineWidth: 2 });
    C.drawCircle(ctx, pCX, pCY, pR + 5, { stroke: 'rgba(24,229,138,0.3)', lineWidth: 1 });

    // "The One" style text
    C.drawGlowText(ctx, 'THE VIBE', W/2, 120, {
      font: F.display(42, '900'), color: '#18E58A', glowColor: '#18E58A', glowBlur: 30, align: 'center',
    });

    // Scores as code
    const entries = Object.entries(cardData.scores);
    let codeY = pCY + pR + 60;
    C.drawText(ctx, '>>> DECODING_SUBJECT_METRICS', 60, codeY, {
      font: F.mono(11), color: '#18E58A', align: 'left',
    });
    codeY += 28;

    entries.forEach(([label, score]) => {
      const hex = Math.floor(score * 2.55).toString(16).toUpperCase().padStart(2, '0');
      C.drawText(ctx, `> ${label}_VAL = 0x${hex} // ${score.toFixed(1)}`, 60, codeY, {
        font: F.mono(11), color: '#8A938E', align: 'left',
      });
      codeY += 24;
    });

    codeY += 15;
    C.drawText(ctx, `> TOTAL_VIBE = ${cardData.finalScore.toFixed(1)}`, 60, codeY, {
      font: F.mono(14, '700'), color: '#18E58A', align: 'left',
    });

    // Verdict
    C.drawText(ctx, `> VERDICT: "${cardData.verdict}"`, 60, codeY + 35, {
      font: F.mono(12), color: '#F2F5F2', align: 'left',
    });

    // Vibe label
    C.drawRect(ctx, 60, codeY + 60, 200, 26, { fill: '#18E58A', radius: 2 });
    C.drawText(ctx, cardData.vibeLabel, 160, codeY + 77, {
      font: F.mono(10, '700'), color: '#000000', align: 'center',
    });

    // Bottom
    C.drawLine(ctx, 50, H - 70, W - 50, H - 70, { color: '#1a3a2a', width: 0.5 });
    C.drawText(ctx, 'SYS_ID: ' + cardData.certId, 50, H - 48, { font: F.mono(8), color: '#333333', align: 'left' });
    C.drawText(ctx, 'TEMPLATE 24 / MATRIX', W - 50, H - 48, { font: F.mono(8), color: '#333333', align: 'right' });

    C.drawRobotMark(ctx, W - 80, H - 100, 24, { expression: 'scanning' });

    C.drawNoise(ctx, 0.02);
  },
};
