/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 23: BLACK-ON-BLACK LUXURY
   Extremely minimal, embossed feel, subtle textures,
   barely-there typography, premium darkness.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template23'] = {
  id: 'template23',
  name: 'Black-on-Black Luxury',
  description: 'Extremely minimal with embossed feel and subtle textures.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Pure black
    C.drawBackground(ctx, '#000000');

    // Subtle texture overlay
    C.drawCrosshatch(ctx, 0, 0, W, H, 60, { color: 'rgba(255,255,255,0.015)', lineWidth: 0.3 });

    // Ultra-thin frame
    C.drawRect(ctx, 80, 80, W - 160, H - 160, { stroke: '#1a1a1a', lineWidth: 0.5 });

    // Portrait: small, centered, with soft shadow
    const pCX = W/2;
    const pCY = 340;
    const pR = 100;

    // Soft glow behind portrait
    C.drawCircle(ctx, pCX, pCY, pR + 30, { fill: 'rgba(255,255,255,0.02)' });
    C.drawCircle(ctx, pCX, pCY, pR + 15, { fill: 'rgba(255,255,255,0.015)' });

    C.drawCirclePortrait(ctx, image, pCX, pCY, pR, {
      borderColor: '#222222', borderWidth: 0.5,
    });

    // Score: barely visible, elegant
    C.drawText(ctx, cardData.finalScore.toFixed(1), W/2, pCY + pR + 60, {
      font: F.display(48, '200'), color: '#333333', align: 'center',
    });

    // Micro label
    C.drawText(ctx, 'CERTIFIED', W/2, pCY + pR + 95, {
      font: F.mono(8), color: '#222222', align: 'center', letterSpacing: 6,
    });

    // Verdict: whisper
    C.drawText(ctx, cardData.verdict, W/2, pCY + pR + 130, {
      font: F.body(12, '300'), color: '#2a2a2a', align: 'center',
    });

    // Scores: minimal list
    const entries = Object.entries(cardData.scores);
    let scoreY = pCY + pR + 180;
    entries.forEach(([label, score]) => {
      C.drawText(ctx, label, W/2 - 40, scoreY, {
        font: F.mono(8), color: '#1a1a1a', align: 'right', letterSpacing: 1,
      });
      C.drawText(ctx, score.toFixed(1), W/2 + 40, scoreY, {
        font: F.mono(8), color: '#222222', align: 'left',
      });
      scoreY += 20;
    });

    // Bottom: One emerald dot (only color)
    C.drawCircle(ctx, W/2, H - 100, 3, { fill: P.accent });

    // Metadata: barely there
    C.drawText(ctx, cardData.certId, W/2, H - 70, {
      font: F.mono(7), color: '#1a1a1a', align: 'center',
    });
    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), W/2, H - 55, {
      font: F.mono(7), color: '#1a1a1a', align: 'center',
    });

    C.drawRobotMark(ctx, W/2 - 10, H - 40, 20, { expression: 'neutral', opacity: 0.3 });

    C.drawNoise(ctx, 0.01);
  },
};
