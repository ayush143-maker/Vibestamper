/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 30: GRAND FINALE
   The ultimate card. Holographic elements, combined motifs,
   premium everything. A celebration of all 30 templates.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template30'] = {
  id: 'template30',
  name: 'Grand Finale',
  description: 'The ultimate card with holographic elements and premium finish.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Deep black with subtle shimmer
    C.drawBackground(ctx, '#050505');

    // Holographic corner accents
    C.drawHolographicStrip(ctx, 0, 0, W, 6, { colors: ['#18E58A', '#0B9F5B', '#F2F5F2', '#18E58A'] });
    C.drawHolographicStrip(ctx, 0, H - 6, W, 6, { colors: ['#18E58A', '#0B9F5B', '#F2F5F2', '#18E58A'] });

    // Central portrait with multiple rings
    const pCX = W/2;
    const pCY = 380;
    const pR = 140;

    // Outer glow layers
    C.drawCircle(ctx, pCX, pCY, pR + 50, { fill: 'rgba(24,229,138,0.03)' });
    C.drawCircle(ctx, pCX, pCY, pR + 35, { fill: 'rgba(24,229,138,0.05)' });
    C.drawCircle(ctx, pCX, pCY, pR + 20, { stroke: 'rgba(24,229,138,0.2)', lineWidth: 1 });
    C.drawCircle(ctx, pCX, pCY, pR + 12, { stroke: P.accentDim, lineWidth: 1 });
    C.drawCircle(ctx, pCX, pCY, pR + 5, { stroke: P.accent, lineWidth: 2 });

    // Portrait
    C.drawCirclePortrait(ctx, image, pCX, pCY, pR, { borderColor: 'transparent', borderWidth: 0 });

    // Decorative dots around portrait
    const dotCount = 16;
    const dotRadius = pR + 28;
    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2 - Math.PI / 2;
      const dx = pCX + Math.cos(angle) * dotRadius;
      const dy = pCY + Math.sin(angle) * dotRadius;
      C.drawCircle(ctx, dx, dy, i % 4 === 0 ? 3 : 1.5, { fill: i % 4 === 0 ? P.accent : P.border });
    }

    // Top: Grand title
    C.drawGlowText(ctx, 'VIBESTAMP', W/2, 100, {
      font: F.display(28, '700'), color: P.accent, glowColor: P.accent, glowBlur: 20, align: 'center',
    });
    C.drawText(ctx, 'SPECIAL EDITION  |  TEMPLATE 30', W/2, 135, {
      font: F.mono(9), color: P.textDim, align: 'center', letterSpacing: 3,
    });

    // Score: massive, centered below portrait
    C.drawText(ctx, cardData.finalScore.toFixed(1), W/2, pCY + pR + 80, {
      font: F.display(80, '900'), color: P.text, align: 'center',
    });
    C.drawText(ctx, 'CERTIFICATION SCORE', W/2, pCY + pR + 120, {
      font: F.mono(9), color: P.textDim, align: 'center', letterSpacing: 3,
    });

    // Thin decorative line
    C.drawLine(ctx, W/2 - 80, pCY + pR + 145, W/2 + 80, pCY + pR + 145, { color: P.accentDim, width: 1 });

    // Verdict
    C.drawText(ctx, '"' + cardData.verdict + '"', W/2, pCY + pR + 185, {
      font: F.body(18, '400'), color: P.textMuted, align: 'center',
    });

    // Vibe label (holographic badge)
    C.drawHolographicStrip(ctx, W/2 - 120, pCY + pR + 220, 240, 32, {
      colors: ['#18E58A', '#0B9F5B', '#F2F5F2', '#18E58A'],
    });
    C.drawText(ctx, cardData.vibeLabel, W/2, pCY + pR + 240, {
      font: F.mono(11, '700'), color: P.bg, align: 'center', letterSpacing: 2,
    });

    // Score breakdown (horizontal, compact)
    const entries = Object.entries(cardData.scores);
    const totalWidth = entries.length * 100;
    const startX = (W - totalWidth) / 2 + 50;
    const scoreY = H - 180;

    entries.forEach(([label, score], i) => {
      const sx = startX + i * 100;
      C.drawText(ctx, label, sx, scoreY, { font: F.mono(8), color: P.textDim, align: 'center', letterSpacing: 1 });
      C.drawText(ctx, score.toFixed(1), sx, scoreY + 22, { font: F.mono(16, '500'), color: P.text, align: 'center' });
      if (i < entries.length - 1) {
        C.drawLine(ctx, sx + 45, scoreY + 5, sx + 45, scoreY + 20, { color: P.border, width: 0.5 });
      }
    });

    // Bottom metadata
    C.drawLine(ctx, 60, H - 80, W - 60, H - 80, { color: P.border, width: 0.5 });
    C.drawText(ctx, cardData.certId, 60, H - 58, { font: F.mono(9), color: P.textDim, align: 'left' });
    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), W/2, H - 58, { font: F.mono(9), color: P.textDim, align: 'center' });
    C.drawText(ctx, 'TEMPLATE 30 / FINALE', W - 60, H - 58, { font: F.mono(9), color: P.textDim, align: 'right' });

    // Robot mark
    C.drawRobotMark(ctx, W/2 - 16, H - 45, 32, { expression: 'certified' });

    // Subtle vignette
    const vig = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.8);
    vig.addColorStop(0, 'rgba(5,5,5,0)');
    vig.addColorStop(1, 'rgba(5,5,5,0.4)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    C.drawNoise(ctx, 0.02);
  },
};
