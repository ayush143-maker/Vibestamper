/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 07: LUXURY BLACK CERTIFICATION
   Deep blacks, elegant spacing, thin emerald lines, premium
   minimal aesthetic with refined typography and gold accents.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template07'] = {
  id: 'template07',
  name: 'Luxury Black',
  description: 'Premium minimal certification with elegant spacing.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Deep black with subtle warmth
    C.drawBackground(ctx, '#050505');

    // Very subtle radial gradient from center
    const grad = ctx.createRadialGradient(W/2, H/2, 100, W/2, H/2, H);
    grad.addColorStop(0, 'rgba(24, 229, 138, 0.02)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Ultra-thin border frame
    C.drawRect(ctx, 50, 50, W - 100, H - 100, { stroke: '#1a1a1a', lineWidth: 0.5 });
    C.drawRect(ctx, 55, 55, W - 110, H - 110, { stroke: '#0d0d0d', lineWidth: 0.5 });

    // Top: Minimal branding
    C.drawText(ctx, 'VIBESTAMP', W/2, 100, {
      font: F.display(12, '500'), color: '#333333', align: 'center', letterSpacing: 8,
    });
    C.drawLine(ctx, W/2 - 40, 115, W/2 + 40, 115, { color: P.accentDim, width: 0.5 });

    // Center: Portrait in elegant circle
    const pCX = W/2;
    const pCY = 420;
    const pR = 140;

    // Outer glow
    C.drawCircle(ctx, pCX, pCY, pR + 30, { fill: 'rgba(24,229,138,0.03)' });
    C.drawCircle(ctx, pCX, pCY, pR + 20, { fill: 'rgba(24,229,138,0.02)' });

    // Triple ring
    C.drawCircle(ctx, pCX, pCY, pR + 6, { stroke: P.accentDim, lineWidth: 0.5 });
    C.drawCircle(ctx, pCX, pCY, pR + 3, { stroke: '#2a2a2a', lineWidth: 0.5 });
    C.drawCircle(ctx, pCX, pCY, pR + 1, { stroke: P.accent, lineWidth: 0.5 });

    // Portrait
    C.drawCirclePortrait(ctx, image, pCX, pCY, pR, {
      borderColor: 'transparent', borderWidth: 0,
    });

    // Score: Large, centered below portrait
    C.drawText(ctx, cardData.finalScore.toFixed(1), W/2, pCY + pR + 80, {
      font: F.display(80, '300'), color: P.text, align: 'center',
    });

    C.drawText(ctx, 'CERTIFICATION SCORE', W/2, pCY + pR + 110, {
      font: F.mono(9), color: P.textDim, align: 'center', letterSpacing: 3,
    });

    // Thin separator
    C.drawLine(ctx, W/2 - 60, pCY + pR + 130, W/2 + 60, pCY + pR + 130, {
      color: P.border, width: 0.5,
    });

    // Verdict
    C.drawText(ctx, '"' + cardData.verdict + '"', W/2, pCY + pR + 165, {
      font: F.body(16, '300'), color: P.textMuted, align: 'center',
    });

    // Vibe label (elegant, small)
    C.drawText(ctx, cardData.vibeLabel, W/2, pCY + pR + 200, {
      font: F.mono(10, '500'), color: P.accent, align: 'center', letterSpacing: 3,
    });

    // Bottom: Scores in horizontal line
    const entries = Object.entries(cardData.scores);
    const totalWidth = entries.length * 100;
    const startX = (W - totalWidth) / 2 + 50;
    const scoreY = H - 200;

    entries.forEach(([label, score], i) => {
      const sx = startX + i * 100;
      C.drawText(ctx, label, sx, scoreY, {
        font: F.mono(8), color: P.textDim, align: 'center', letterSpacing: 1,
      });
      C.drawText(ctx, score.toFixed(1), sx, scoreY + 22, {
        font: F.mono(16, '500'), color: P.text, align: 'center',
      });
      if (i < entries.length - 1) {
        C.drawLine(ctx, sx + 40, scoreY + 5, sx + 40, scoreY + 20, { color: '#1a1a1a', width: 0.5 });
      }
    });

    // Bottom metadata
    C.drawLine(ctx, 80, H - 100, W - 80, H - 100, { color: '#1a1a1a', width: 0.5 });

    C.drawText(ctx, cardData.certId, 80, H - 75, {
      font: F.mono(9), color: '#333333', align: 'left',
    });
    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), W/2, H - 75, {
      font: F.mono(9), color: '#333333', align: 'center',
    });
    C.drawText(ctx, 'TEMPLATE 07 / LUXURY', W - 80, H - 75, {
      font: F.mono(9), color: '#333333', align: 'right',
    });

    // Small robot mark
    C.drawRobotMark(ctx, W/2 - 12, H - 55, 24, { expression: 'certified' });

    C.drawNoise(ctx, 0.01);
  },
};
