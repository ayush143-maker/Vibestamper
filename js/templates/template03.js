/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 03: EDITORIAL FASHION POSTER
   Magazine-style layout with oversized typography, asymmetric
   composition, and a dominant portrait with minimal metadata.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template03'] = {
  id: 'template03',
  name: 'Editorial Fashion',
  description: 'Magazine editorial with large type and dominant portrait.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Background: soft gradient
    C.drawGradientBackground(ctx, '#0D0F0F', '#070909');

    // Large portrait (dominant, left-aligned, full height crop)
    const portraitW = 560;
    const portraitH = 900;
    const portraitX = 0;
    const portraitY = 0;

    ctx.save();
    ctx.beginPath();
    ctx.rect(portraitX, portraitY, portraitW, portraitH);
    ctx.clip();
    const imgRatio = image.width / image.height;
    let sx, sy, sw, sh;
    if (imgRatio > portraitW / portraitH) {
      sh = image.height; sw = image.height * (portraitW / portraitH);
      sx = (image.width - sw) / 2; sy = 0;
    } else {
      sw = image.width; sh = image.width / (portraitW / portraitH);
      sx = 0; sy = (image.height - sh) / 2;
    }
    ctx.drawImage(image, sx, sy, sw, sh, portraitX, portraitY, portraitW, portraitH);
    ctx.restore();

    // Gradient overlay on portrait (fade to black on right)
    const fadeGrad = ctx.createLinearGradient(portraitW - 200, 0, portraitW + 100, 0);
    fadeGrad.addColorStop(0, 'rgba(7,9,9,0)');
    fadeGrad.addColorStop(1, 'rgba(7,9,9,1)');
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(portraitW - 200, 0, 300, portraitH);

    // Right side editorial typography
    const textX = portraitW + 50;

    // Issue number
    C.drawText(ctx, 'ISSUE 001', textX, 100, {
      font: F.mono(10), color: P.textDim, align: 'left', letterSpacing: 2,
    });

    // Giant "VIBE" word
    C.drawText(ctx, 'VIBE', textX, 260, {
      font: F.display(110, '700'), color: P.text, align: 'left',
    });

    // Score as large number
    C.drawText(ctx, cardData.finalScore.toFixed(0), textX, 400, {
      font: F.display(140, '700'), color: P.accent, align: 'left',
    });
    C.drawText(ctx, '/100', textX + 200, 400, {
      font: F.display(28, '300'), color: P.textDim, align: 'left',
    });

    // Verdict as pull quote
    C.drawLine(ctx, textX, 480, textX + 60, 480, { color: P.accent, width: 2 });
    C.drawText(ctx, '"' + cardData.verdict + '"', textX, 530, {
      font: F.body(18, '400'), color: P.textMuted, align: 'left',
    });

    // Vibe label
    C.drawText(ctx, cardData.vibeLabel, textX, 600, {
      font: F.mono(11, '500'), color: P.accent, align: 'left', letterSpacing: 2,
    });

    // Score list (vertical)
    const scoreEntries = Object.entries(cardData.scores);
    let scoreY = 680;
    scoreEntries.forEach(([label, score]) => {
      C.drawText(ctx, label, textX, scoreY, {
        font: F.mono(9), color: P.textDim, align: 'left', letterSpacing: 1,
      });
      C.drawText(ctx, score.toFixed(1), textX + 100, scoreY, {
        font: F.mono(13, '500'), color: P.text, align: 'left',
      });
      scoreY += 28;
    });

    // Bottom bar
    C.drawLine(ctx, 40, H - 80, W - 40, H - 80, { color: P.border, width: 0.5 });
    C.drawText(ctx, 'VIBESTAMP EDITORIAL', 40, H - 55, {
      font: F.mono(9), color: P.textDim, align: 'left', letterSpacing: 1,
    });
    C.drawText(ctx, cardData.certId, W - 40, H - 55, {
      font: F.mono(9), color: P.textDim, align: 'right',
    });
    C.drawText(ctx, window.VibeStampState.formatShortDate(cardData.timestamp), W - 40, H - 38, {
      font: F.mono(9), color: P.textDim, align: 'right',
    });

    // Small robot mark
    C.drawRobotMark(ctx, textX, 760, 24, { expression: 'certified' });

    C.drawNoise(ctx, 0.02);
  },
};
