/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 28: ROBOT APPROVED
   Robot-centric design, circuit patterns, approval seal,
   mechanical aesthetic with the robot as hero element.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template28'] = {
  id: 'template28',
  name: 'Robot Approved',
  description: 'Robot-centric with circuit patterns and approval seal.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    C.drawBackground(ctx, P.bg);

    // Circuit pattern background
    C.drawCircuitPattern(ctx, 0, 0, W, H, { color: 'rgba(24,229,138,0.06)', density: 25 });

    // Top: Robot approval banner
    C.drawRect(ctx, 0, 0, W, 60, { fill: P.surface });
    C.drawLine(ctx, 0, 60, W, 60, { color: P.accent, width: 2 });
    C.drawText(ctx, '◈ ROBOT APPROVAL SYSTEM ◈', W/2, 38, {
      font: F.mono(12, '700'), color: P.accent, align: 'center', letterSpacing: 2,
    });

    // Large robot mark (center top)
    C.drawRobotMark(ctx, W/2 - 40, 140, 80, { expression: 'certified' });

    // Approval text
    C.drawText(ctx, 'APPROVED', W/2, 260, {
      font: F.display(48, '900'), color: P.accent, align: 'center',
    });
    C.drawText(ctx, 'BY VIBE SYSTEM v3.0', W/2, 300, {
      font: F.mono(10), color: P.textDim, align: 'center', letterSpacing: 2,
    });

    // Portrait (medium, below approval)
    const pCX = W/2;
    const pCY = 480;
    const pR = 120;

    C.drawCircle(ctx, pCX, pCY, pR + 15, { fill: 'rgba(24,229,138,0.08)' });
    C.drawCircle(ctx, pCX, pCY, pR + 8, { stroke: P.accent, lineWidth: 2 });
    C.drawCirclePortrait(ctx, image, pCX, pCY, pR, { borderColor: P.border, borderWidth: 1 });

    // Circuit lines connecting to portrait
    C.drawLine(ctx, pCX - pR - 30, pCY, pCX - pR - 5, pCY, { color: P.accentDim, width: 1 });
    C.drawLine(ctx, pCX + pR + 5, pCY, pCX + pR + 30, pCY, { color: P.accentDim, width: 1 });
    C.drawCircle(ctx, pCX - pR - 35, pCY, 3, { fill: P.accent });
    C.drawCircle(ctx, pCX + pR + 35, pCY, 3, { fill: P.accent });

    // Scores as system readouts
    const entries = Object.entries(cardData.scores);
    let readoutY = pCY + pR + 50;

    C.drawText(ctx, 'SYSTEM METRICS', 60, readoutY, {
      font: F.mono(10, '700'), color: P.accent, align: 'left', letterSpacing: 1,
    });
    readoutY += 25;

    entries.forEach(([label, score]) => {
      C.drawText(ctx, `[${label}]`, 60, readoutY, { font: F.mono(10), color: P.textDim, align: 'left' });
      C.drawText(ctx, score.toFixed(1), 200, readoutY, { font: F.mono(12, '600'), color: P.text, align: 'left' });

      // Status dot
      const dotColor = score > 80 ? P.accent : (score > 60 ? '#D4A017' : '#E55050');
      C.drawCircle(ctx, 280, readoutY - 3, 4, { fill: dotColor });

      readoutY += 24;
    });

    // Final score
    readoutY += 15;
    C.drawLine(ctx, 60, readoutY, 300, readoutY, { color: P.border, width: 0.5 });
    readoutY += 20;
    C.drawText(ctx, '[TOTAL_VIBE]', 60, readoutY, { font: F.mono(10), color: P.accent, align: 'left' });
    C.drawText(ctx, cardData.finalScore.toFixed(1), 200, readoutY, { font: F.display(32, '700'), color: P.accent, align: 'left' });

    // Verdict
    C.drawText(ctx, '"' + cardData.verdict + '"', W/2, H - 140, {
      font: F.body(16, '400'), color: P.textMuted, align: 'center',
    });

    // Vibe label
    C.drawRect(ctx, W/2 - 100, H - 110, 200, 28, {
      fill: P.accent, radius: 2,
    });
    C.drawText(ctx, cardData.vibeLabel, W/2, H - 93, {
      font: F.mono(10, '700'), color: P.bg, align: 'center', letterSpacing: 1,
    });

    // Bottom
    C.drawLine(ctx, 50, H - 70, W - 50, H - 70, { color: P.border, width: 0.5 });
    C.drawText(ctx, cardData.certId, 50, H - 48, { font: F.mono(9), color: P.textDim, align: 'left' });
    C.drawText(ctx, 'TEMPLATE 28 / ROBOT', W - 50, H - 48, { font: F.mono(9), color: P.textDim, align: 'right' });

    C.drawRobotMark(ctx, W/2 - 10, H - 40, 20, { expression: 'certified' });

    C.drawNoise(ctx, 0.015);
  },
};
