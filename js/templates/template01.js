/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 01: SIGNATURE MINIMAL EMERALD CERTIFICATION

   The flagship card. Dark, minimal, premium. Circular portrait with
   emerald certification ring. Typographic score grid. Robot seal.

   EDIT TARGET: Yes — modify layout, colors, typography, or decorative
   elements. This is the visual benchmark for all templates.
   ═══════════════════════════════════════════════════════════════ */

// ── SECTION: Template Registration ───────────────────────────
if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template01'] = {
  id: 'template01',
  name: 'Signature Minimal Emerald',
  description: 'The flagship VibeStamp card. Dark minimal with emerald accent ring.',

  // ── SECTION: Render Function ─────────────────────────────
  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // ═══════════════════════════════════════════════════════
    // LAYER 1: Background
    // ═══════════════════════════════════════════════════════
    C.drawBackground(ctx, P.bg);

    // Subtle top-to-bottom gradient overlay
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(17, 20, 20, 0.4)');
    grad.addColorStop(0.5, 'rgba(7, 9, 9, 0)');
    grad.addColorStop(1, 'rgba(17, 20, 20, 0.6)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Micro grid pattern (very subtle, upper area)
    C.drawMicroGrid(ctx, 60, 60, W - 120, 340, 40, {
      color: 'rgba(36, 42, 39, 0.3)',
      lineWidth: 0.5,
    });

    // ═══════════════════════════════════════════════════════
    // LAYER 2: Registration Marks
    // ═══════════════════════════════════════════════════════
    C.drawRegistrationMarks(ctx, 24, 10);

    // ═══════════════════════════════════════════════════════
    // LAYER 3: Top Branding Bar
    // ═══════════════════════════════════════════════════════
    // Thin top line
    C.drawLine(ctx, 60, 70, W - 60, 70, {
      color: P.border,
      width: 0.5,
    });

    // VibeStamp wordmark (left)
    C.drawText(ctx, 'VIBESTAMP', 60, 52, {
      font: F.display(14, '600'),
      color: P.text,
      align: 'left',
      letterSpacing: 3,
    });

    // Certification label (right)
    C.drawText(ctx, 'OFFICIAL CERTIFICATION', W - 60, 52, {
      font: F.mono(9),
      color: P.textDim,
      align: 'right',
      letterSpacing: 1.5,
    });

    // Index number
    C.drawIndex(ctx, 1, 'SIGNATURE EDITION', 60, 90, {
      color: P.accentDim,
    });

    // ═══════════════════════════════════════════════════════
    // LAYER 4: Portrait Frame
    // ═══════════════════════════════════════════════════════
    const portraitCX = W / 2;
    const portraitCY = 340;
    const portraitR = 160;

    // Outer glow ring (subtle)
    C.drawCircle(ctx, portraitCX, portraitCY, portraitR + 18, {
      fill: 'rgba(24, 229, 138, 0.04)',
    });

    // Emerald certification ring
    C.drawRing(ctx, portraitCX, portraitCY, portraitR + 8, portraitR + 4, {
      fill: P.accent,
    });

    // Secondary thin ring
    C.drawCircle(ctx, portraitCX, portraitCY, portraitR + 14, {
      stroke: P.border,
      lineWidth: 0.5,
    });

    // Portrait image (circular crop)
    C.drawCirclePortrait(ctx, image, portraitCX, portraitCY, portraitR, {
      borderColor: P.border,
      borderWidth: 1,
    });

    // Small decorative dots around portrait
    const dotCount = 12;
    const dotRadius = portraitR + 22;
    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2 - Math.PI / 2;
      const dx = portraitCX + Math.cos(angle) * dotRadius;
      const dy = portraitCY + Math.sin(angle) * dotRadius;
      const isAccent = i % 3 === 0;
      C.drawCircle(ctx, dx, dy, isAccent ? 2 : 1, {
        fill: isAccent ? P.accent : P.border,
      });
    }

    // ═══════════════════════════════════════════════════════
    // LAYER 5: Vibe Label (Badge)
    // ═══════════════════════════════════════════════════════
    const badgeY = portraitCY + portraitR + 50;
    const badgeText = cardData.vibeLabel;
    const badgeWidth = badgeText.length * 7 + 32;
    const badgeX = (W - badgeWidth) / 2;

    // Badge background
    C.drawRect(ctx, badgeX, badgeY - 10, badgeWidth, 24, {
      fill: P.surface,
      stroke: P.accentDim,
      lineWidth: 1,
      radius: 2,
    });

    // Badge text
    C.drawText(ctx, badgeText, W / 2, badgeY + 4, {
      font: F.mono(10, '500'),
      color: P.accent,
      align: 'center',
      letterSpacing: 2,
    });

    // ═══════════════════════════════════════════════════════
    // LAYER 6: Score Grid
    // ═══════════════════════════════════════════════════════
    const scoreY = badgeY + 70;
    const scoreEntries = Object.entries(cardData.scores);
    const cols = 3;
    const colWidth = 140;
    const rowHeight = 70;
    const gridStartX = (W - (cols * colWidth)) / 2 + colWidth / 2;

    scoreEntries.forEach(([label, score], i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const sx = gridStartX + col * colWidth;
      const sy = scoreY + row * rowHeight;

      // Label
      C.drawText(ctx, label, sx, sy - 6, {
        font: F.mono(9),
        color: P.textDim,
        align: 'center',
        letterSpacing: 1.5,
      });

      // Score
      const scoreStr = score.toFixed(1);
      C.drawText(ctx, scoreStr, sx, sy + 22, {
        font: F.display(28, '600'),
        color: P.text,
        align: 'center',
      });

      // Small accent underline
      C.drawLine(ctx, sx - 16, sy + 30, sx + 16, sy + 30, {
        color: P.accentDim,
        width: 1,
      });
    });

    // ═══════════════════════════════════════════════════════
    // LAYER 7: Final Score (Large)
    // ═══════════════════════════════════════════════════════
    const finalY = scoreY + Math.ceil(scoreEntries.length / cols) * rowHeight + 50;

    C.drawText(ctx, 'FINAL SCORE', W / 2, finalY - 20, {
      font: F.mono(10),
      color: P.textDim,
      align: 'center',
      letterSpacing: 2,
    });

    C.drawText(ctx, cardData.finalScore.toFixed(1), W / 2, finalY + 35, {
      font: F.display(72, '700'),
      color: P.accent,
      align: 'center',
    });

    // Decorative line under final score
    C.drawLine(ctx, W / 2 - 60, finalY + 55, W / 2 + 60, finalY + 55, {
      color: P.border,
      width: 0.5,
    });

    // ═══════════════════════════════════════════════════════
    // LAYER 8: Verdict
    // ═══════════════════════════════════════════════════════
    const verdictY = finalY + 90;

    C.drawText(ctx, '"' + cardData.verdict + '"', W / 2, verdictY, {
      font: F.body(18, '400'),
      color: P.textMuted,
      align: 'center',
    });

    // ═══════════════════════════════════════════════════════
    // LAYER 9: Robot Certification Mark
    // ═══════════════════════════════════════════════════════
    const robotY = verdictY + 60;
    C.drawRobotMark(ctx, W / 2 - 16, robotY, 32, {
      expression: 'certified',
    });

    C.drawText(ctx, 'VERIFIED BY VIBE SYSTEM', W / 2, robotY + 42, {
      font: F.mono(8),
      color: P.textDim,
      align: 'center',
      letterSpacing: 1,
    });

    // ═══════════════════════════════════════════════════════
    // LAYER 10: Bottom Metadata Bar
    // ═══════════════════════════════════════════════════════
    const metaY = H - 60;

    // Bottom line
    C.drawLine(ctx, 60, metaY - 20, W - 60, metaY - 20, {
      color: P.border,
      width: 0.5,
    });

    // Left: Cert ID
    C.drawMicroLabel(ctx, 'CERT ID', 60, metaY, {
      color: P.textDim,
    });
    C.drawText(ctx, cardData.certId, 60, metaY + 14, {
      font: F.mono(10, '500'),
      color: P.textMuted,
      align: 'left',
    });

    // Center: Date
    const dateStr = window.VibeStampState.formatShortDate(cardData.timestamp);
    C.drawMicroLabel(ctx, 'ISSUED', W / 2 - 30, metaY, {
      color: P.textDim,
      align: 'center',
    });
    C.drawText(ctx, dateStr, W / 2, metaY + 14, {
      font: F.mono(10, '500'),
      color: P.textMuted,
      align: 'center',
    });

    // Right: Template ref
    C.drawMicroLabel(ctx, 'TEMPLATE', W - 60, metaY, {
      color: P.textDim,
      align: 'right',
    });
    C.drawText(ctx, '01 / SIGNATURE', W - 60, metaY + 14, {
      font: F.mono(10, '500'),
      color: P.textMuted,
      align: 'right',
    });

    // ═══════════════════════════════════════════════════════
    // LAYER 11: Subtle Noise Overlay
    // ═══════════════════════════════════════════════════════
    C.drawNoise(ctx, 0.02);

    // ═══════════════════════════════════════════════════════
    // LAYER 12: Edge Vignette
    // ═══════════════════════════════════════════════════════
    const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
    vignette.addColorStop(0, 'rgba(7, 9, 9, 0)');
    vignette.addColorStop(1, 'rgba(7, 9, 9, 0.3)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
  },
};
