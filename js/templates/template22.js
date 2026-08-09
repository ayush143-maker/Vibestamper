/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 22: DIGITAL ACHIEVEMENT
   Unlocked badge, XP bar, trophy icon, level up animation feel.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template22'] = {
  id: 'template22',
  name: 'Digital Achievement',
  description: 'Unlocked badge with XP bar and trophy icon.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    C.drawBackground(ctx, P.bg);

    // Subtle circuit pattern background
    C.drawCircuitPattern(ctx, 0, 0, W, H, { color: 'rgba(24,229,138,0.04)', density: 20 });

    // Top: Achievement unlocked banner
    C.drawRect(ctx, 0, 0, W, 70, { fill: P.surface });
    C.drawLine(ctx, 0, 70, W, 70, { color: P.accent, width: 2 });
    C.drawText(ctx, '★ ACHIEVEMENT UNLOCKED ★', W/2, 42, {
      font: F.display(18, '700'), color: P.accent, align: 'center',
    });

    // Trophy icon (large, centered top)
    C.drawTrophy(ctx, W/2, 180, 60, { color: P.accent, strokeColor: P.text });

    // Portrait (medium, below trophy)
    const pCX = W/2;
    const pCY = 380;
    const pR = 120;

    C.drawCircle(ctx, pCX, pCY, pR + 10, { fill: 'rgba(24,229,138,0.1)' });
    C.drawCircle(ctx, pCX, pCY, pR + 5, { stroke: P.accent, lineWidth: 2 });
    C.drawCirclePortrait(ctx, image, pCX, pCY, pR, { borderColor: P.border, borderWidth: 1 });

    // Achievement name
    C.drawText(ctx, cardData.vibeLabel, W/2, pCY + pR + 40, {
      font: F.display(24, '700'), color: P.accent, align: 'center',
    });

    // XP Bar
    const xpY = pCY + pR + 80;
    C.drawText(ctx, 'VIBE XP', W/2 - 140, xpY - 8, {
      font: F.mono(9), color: P.textDim, align: 'left',
    });
    C.drawXPBar(ctx, cardData.finalScore, 100, W/2 - 140, xpY, 280, 20, {
      fillColor: P.accent, bgColor: P.border, textColor: P.bg,
    });

    // Score grid as skill tree
    const skillY = xpY + 60;
    C.drawText(ctx, 'SKILL TREE', 60, skillY, {
      font: F.mono(10, '700'), color: P.text, align: 'left', letterSpacing: 2,
    });

    const entries = Object.entries(cardData.scores);
    let skillRowY = skillY + 30;
    entries.forEach(([label, score]) => {
      const barW = 200;
      const fillW = (score / 100) * barW;

      C.drawText(ctx, label, 60, skillRowY, { font: F.mono(10), color: P.textMuted, align: 'left' });
      C.drawRect(ctx, 180, skillRowY - 12, barW, 14, { fill: P.bg });
      C.drawRect(ctx, 180, skillRowY - 12, fillW, 14, { fill: P.accent });
      C.drawText(ctx, score.toFixed(1), 400, skillRowY, { font: F.mono(11, '600'), color: P.text, align: 'left' });

      skillRowY += 28;
    });

    // Final score as level
    C.drawText(ctx, 'LEVEL', W - 80, skillY, { font: F.mono(10), color: P.textDim, align: 'right' });
    C.drawText(ctx, Math.floor(cardData.finalScore / 10), W - 80, skillY + 40, {
      font: F.display(48, '900'), color: P.accent, align: 'right',
    });

    // Verdict
    C.drawText(ctx, '"' + cardData.verdict + '"', W/2, H - 140, {
      font: F.body(16, '400'), color: P.textMuted, align: 'center',
    });

    // Bottom
    C.drawLine(ctx, 50, H - 80, W - 50, H - 80, { color: P.border, width: 0.5 });
    C.drawText(ctx, cardData.certId, 50, H - 55, { font: F.mono(9), color: P.textDim, align: 'left' });
    C.drawText(ctx, 'TEMPLATE 22 / ACHIEVEMENT', W - 50, H - 55, { font: F.mono(9), color: P.textDim, align: 'right' });

    C.drawRobotMark(ctx, W/2 - 12, H - 45, 24, { expression: 'impressed' });

    C.drawNoise(ctx, 0.015);
  },
};
