/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 11: Y2K DIGITAL PROFILE
   Chrome gradients, star motifs, playful digital aesthetic
   with early-2000s internet culture vibes.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template11'] = {
  id: 'template11',
  name: 'Y2K Digital Profile',
  description: 'Chrome effects, stars, and playful digital aesthetic.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Background with subtle radial
    C.drawBackground(ctx, P.bg);
    const bgGrad = ctx.createRadialGradient(W/2, H/3, 50, W/2, H/2, H);
    bgGrad.addColorStop(0, 'rgba(24, 229, 138, 0.05)');
    bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Decorative stars
    C.drawStar(ctx, 100, 120, 18, 8, 5, { fill: P.accent });
    C.drawStar(ctx, W - 100, 200, 12, 5, 5, { fill: P.accentDim });
    C.drawStar(ctx, 80, H - 200, 10, 4, 5, { stroke: P.accent, lineWidth: 1 });
    C.drawStar(ctx, W - 80, H - 150, 14, 6, 5, { fill: 'rgba(24,229,138,0.3)' });

    // Top: Chrome-style header
    const chromeGrad = ctx.createLinearGradient(0, 0, W, 0);
    chromeGrad.addColorStop(0, P.bg);
    chromeGrad.addColorStop(0.3, P.surface);
    chromeGrad.addColorStop(0.5, P.borderLight);
    chromeGrad.addColorStop(0.7, P.surface);
    chromeGrad.addColorStop(1, P.bg);

    C.drawRect(ctx, 0, 0, W, 70, { fill: chromeGrad });
    C.drawLine(ctx, 0, 70, W, 70, { color: P.accent, width: 2 });

    C.drawText(ctx, '★ VIBESTAMP ★', W/2, 42, {
      font: F.display(20, '700'), color: P.accent, align: 'center',
    });

    // Portrait: circle with chrome ring
    const pCX = W/2;
    const pCY = 300;
    const pR = 130;

    // Outer glow rings
    C.drawCircle(ctx, pCX, pCY, pR + 25, { fill: 'rgba(24,229,138,0.06)' });
    C.drawCircle(ctx, pCX, pCY, pR + 15, { stroke: 'rgba(24,229,138,0.3)', lineWidth: 1 });
    C.drawCircle(ctx, pCX, pCY, pR + 8, { stroke: P.accent, lineWidth: 2 });

    // Star decorations around portrait
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const dist = pR + 35;
      const sx = pCX + Math.cos(angle) * dist;
      const sy = pCY + Math.sin(angle) * dist;
      C.drawStar(ctx, sx, sy, 5, 2, 4, { fill: i % 2 === 0 ? P.accent : P.accentDim });
    }

    C.drawCirclePortrait(ctx, image, pCX, pCY, pR, { borderColor: P.border, borderWidth: 1 });

    // Username-style display
    C.drawText(ctx, '@VIBED_USER', W/2, pCY + pR + 35, {
      font: F.mono(14, '600'), color: P.text, align: 'center', letterSpacing: 2,
    });

    // Vibe label
    C.drawRect(ctx, W/2 - 90, pCY + pR + 55, 180, 26, {
      fill: P.accent, radius: 13,
    });
    C.drawText(ctx, cardData.vibeLabel, W/2, pCY + pR + 72, {
      font: F.mono(10, '700'), color: P.bg, align: 'center', letterSpacing: 1,
    });

    // Score display: playful blocks
    const entries = Object.entries(cardData.scores);
    const blockW = 70;
    const blockGap = 16;
    const totalBlockW = entries.length * blockW + (entries.length - 1) * blockGap;
    let bx = (W - totalBlockW) / 2 + blockW / 2;
    const by = pCY + pR + 130;

    entries.forEach(([label, score]) => {
      // Block background
      C.drawRect(ctx, bx - blockW/2, by - 20, blockW, 70, {
        fill: P.surface, stroke: P.border, lineWidth: 1, radius: 4,
      });

      C.drawText(ctx, label, bx, by + 5, {
        font: F.mono(8), color: P.textDim, align: 'center', letterSpacing: 1,
      });
      C.drawText(ctx, score.toFixed(0), bx, by + 30, {
        font: F.display(22, '700'), color: P.accent, align: 'center',
      });

      bx += blockW + blockGap;
    });

    // Final score: big and bold
    C.drawText(ctx, 'TOTAL VIBE', W/2, by + 80, {
      font: F.mono(10), color: P.textDim, align: 'center', letterSpacing: 2,
    });
    C.drawText(ctx, cardData.finalScore.toFixed(1), W/2, by + 130, {
      font: F.display(64, '900'), color: P.accent, align: 'center',
    });

    // Verdict
    C.drawText(ctx, '"' + cardData.verdict + '"', W/2, by + 170, {
      font: F.body(16, '400'), color: P.textMuted, align: 'center',
    });

    // Bottom metadata
    C.drawLine(ctx, 60, H - 70, W - 60, H - 70, { color: P.border, width: 0.5 });
    C.drawText(ctx, cardData.certId, 60, H - 48, {
      font: F.mono(9), color: P.textDim, align: 'left',
    });
    C.drawText(ctx, 'TEMPLATE 11 / Y2K', W - 60, H - 48, {
      font: F.mono(9), color: P.textDim, align: 'right',
    });

    C.drawRobotMark(ctx, W/2 - 12, H - 40, 24, { expression: 'certified' });

    C.drawNoise(ctx, 0.02);
  },
};
