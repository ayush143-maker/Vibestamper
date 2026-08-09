/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 17: GLITCH/ERROR CERTIFICATION
   RGB shift, corrupted text, error messages, broken grid,
   and digital artifact aesthetic.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template17'] = {
  id: 'template17',
  name: 'Glitch Error',
  description: 'Digital corruption with RGB shift and error messages.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    C.drawBackground(ctx, '#000000');

    // Random glitch rectangles
    for (let i = 0; i < 20; i++) {
      const gx = Math.random() * W;
      const gy = Math.random() * H;
      const gw = Math.random() * 200 + 20;
      const gh = Math.random() * 8 + 2;
      const color = ['#ff0000', '#00ffff', '#18E58A', '#ffffff'][Math.floor(Math.random() * 4)];
      ctx.fillStyle = color;
      ctx.globalAlpha = Math.random() * 0.3;
      ctx.fillRect(gx, gy, gw, gh);
    }
    ctx.globalAlpha = 1;

    // Scan lines
    C.drawScanLines(ctx, 0, 0, W, H, 4, { color: 'rgba(255,255,255,0.05)' });

    // Error header
    C.drawText(ctx, 'ERROR: VIBE_TOO_STRONG', 50, 80, {
      font: F.mono(14, '700'), color: '#ff0000', align: 'left',
    });
    C.drawText(ctx, '0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0'), 50, 105, {
      font: F.mono(10), color: '#ff0000', align: 'left',
    });

    // Portrait with RGB shift
    const pCX = W/2;
    const pCY = 350;
    const pR = 150;

    // Red channel offset
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(image, pCX - pR - 5, pCY - pR, pR * 2, pR * 2);
    ctx.restore();

    // Actual portrait (clipped circle)
    ctx.save();
    ctx.beginPath();
    ctx.arc(pCX, pCY, pR, 0, Math.PI * 2);
    ctx.clip();
    const imgRatio = image.width / image.height;
    let sx, sy, sw, sh;
    if (imgRatio > 1) { sh = image.height; sw = image.height; sx = (image.width - sw) / 2; sy = 0; }
    else { sw = image.width; sh = image.width; sx = 0; sy = (image.height - sh) / 2; }
    ctx.drawImage(image, sx, sy, sw, sh, pCX - pR, pCY - pR, pR * 2, pR * 2);
    ctx.restore();

    // Glitch ring around portrait
    C.drawGlitchRect(ctx, pCX - pR - 10, pCY - pR - 10, pR * 2 + 20, 4, { color: '#ff0000', intensity: 3 });
    C.drawGlitchRect(ctx, pCX - pR - 10, pCY + pR + 6, pR * 2 + 20, 4, { color: '#00ffff', intensity: 3 });

    // Corrupted score display
    const entries = Object.entries(cardData.scores);
    let glitchY = 560;

    C.drawText(ctx, '>>> DECODING METRICS...', 50, glitchY, {
      font: F.mono(11), color: '#18E58A', align: 'left',
    });
    glitchY += 30;

    entries.forEach(([label, score]) => {
      const corrupted = score.toFixed(1).split('').map(c => Math.random() > 0.8 ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : c).join('');
      C.drawText(ctx, label + ': ' + corrupted, 50, glitchY, {
        font: F.mono(12), color: '#00ffff', align: 'left',
      });
      glitchY += 26;
    });

    // Fix line
    glitchY += 15;
    C.drawText(ctx, '>>> CORRUPTION STABILIZED', 50, glitchY, {
      font: F.mono(11), color: '#18E58A', align: 'left',
    });
    glitchY += 30;

    // Final score (stable)
    C.drawText(ctx, 'FINAL: ' + cardData.finalScore.toFixed(1), 50, glitchY, {
      font: F.display(36, '700'), color: '#ffffff', align: 'left',
    });

    // Verdict (glitchy)
    C.drawText(ctx, '"' + cardData.verdict + '"', 50, glitchY + 60, {
      font: F.body(16, '400'), color: '#ff0000', align: 'left',
    });

    // Vibe label
    C.drawRect(ctx, 50, glitchY + 90, 200, 28, { fill: '#ff0000', radius: 2 });
    C.drawText(ctx, cardData.vibeLabel, 150, glitchY + 108, {
      font: F.mono(10, '700'), color: '#000000', align: 'center',
    });

    // Bottom error footer
    C.drawLine(ctx, 50, H - 80, W - 50, H - 80, { color: '#333333', width: 0.5 });
    C.drawText(ctx, 'ERR_ID: ' + cardData.certId, 50, H - 55, { font: F.mono(9), color: '#666666', align: 'left' });
    C.drawText(ctx, 'TEMPLATE 17 / GLITCH', W - 50, H - 55, { font: F.mono(9), color: '#666666', align: 'right' });

    C.drawRobotMark(ctx, W - 80, H - 100, 28, { expression: 'confused' });

    C.drawNoise(ctx, 0.02);
  },
};
