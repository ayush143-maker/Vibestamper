/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — TEMPLATE 06: RETRO COMPUTER TERMINAL
   Green-on-black CRT aesthetic. Monospace everything. Command-line
   style layout with typing cursor and terminal readouts.
   ═══════════════════════════════════════════════════════════════ */

if (typeof window.VibeStampTemplates === 'undefined') {
  window.VibeStampTemplates = {};
}

window.VibeStampTemplates['template06'] = {
  id: 'template06',
  name: 'Retro Terminal',
  description: 'CRT terminal aesthetic with green monospace readouts.',

  render: function(ctx, image, cardData) {
    const C = window.VibeStampCanvas;
    const P = C.PALETTE;
    const F = C.FONTS;
    const W = C.CARD_WIDTH;
    const H = C.CARD_HEIGHT;

    // Terminal black background
    C.drawBackground(ctx, '#050505');

    // CRT scanlines
    C.drawCRTScanlines(ctx, 0, 0, W, H, 3, { color: 'rgba(24, 229, 138, 0.06)' });

    // Terminal border
    C.drawRect(ctx, 30, 30, W - 60, H - 60, { stroke: '#1a3a2a', lineWidth: 1 });
    C.drawRect(ctx, 34, 34, W - 68, H - 68, { stroke: '#0d2618', lineWidth: 0.5 });

    // Top bar: terminal header
    C.drawRect(ctx, 30, 30, W - 60, 36, { fill: '#0d1f14' });
    C.drawText(ctx, 'vibe_system.exe — VIBESTAMP TERMINAL v2.6', 50, 54, {
      font: F.mono(10), color: '#18E58A', align: 'left',
    });
    C.drawText(ctx, '[ONLINE]', W - 50, 54, {
      font: F.mono(10), color: '#18E58A', align: 'right',
    });

    let y = 100;
    const leftMargin = 60;

    // Terminal prompt lines
    const lines = [
      { text: '> INITIATING VIBE ANALYSIS...', color: '#18E58A' },
      { text: '> LOADING BIOMETRIC DATA...', color: '#18E58A' },
      { text: '> SUBJECT DETECTED', color: '#0B9F5B' },
      { text: '', color: '#18E58A' },
    ];

    lines.forEach(line => {
      C.drawText(ctx, line.text, leftMargin, y, {
        font: F.mono(12), color: line.color, align: 'left',
      });
      y += 22;
    });

    // Portrait as ASCII-art style block (small, framed)
    const pX = leftMargin;
    const pY = y + 10;
    const pW = 280;
    const pH = 350;

    // Portrait frame with terminal brackets
    C.drawText(ctx, '┌' + '─'.repeat(36) + '┐', pX, pY, {
      font: F.mono(10), color: '#0B9F5B', align: 'left',
    });

    ctx.save();
    ctx.beginPath();
    ctx.rect(pX + 8, pY + 12, pW - 16, pH - 24);
    ctx.clip();
    const imgRatio = image.width / image.height;
    let sx, sy, sw, sh;
    if (imgRatio > (pW - 16) / (pH - 24)) {
      sh = image.height; sw = image.height * ((pW - 16) / (pH - 24));
      sx = (image.width - sw) / 2; sy = 0;
    } else {
      sw = image.width; sh = image.width / ((pW - 16) / (pH - 24));
      sx = 0; sy = (image.height - sh) / 2;
    }
    // Desaturate and tint green for terminal look
    ctx.filter = 'grayscale(100%) brightness(0.8)';
    ctx.drawImage(image, sx, sy, sw, sh, pX + 8, pY + 12, pW - 16, pH - 24);
    ctx.filter = 'none';
    ctx.restore();

    // Green overlay on portrait
    ctx.fillStyle = 'rgba(11, 159, 91, 0.15)';
    ctx.fillRect(pX + 8, pY + 12, pW - 16, pH - 24);

    C.drawText(ctx, '└' + '─'.repeat(36) + '┘', pX, pY + pH - 6, {
      font: F.mono(10), color: '#0B9F5B', align: 'left',
    });

    C.drawText(ctx, '[IMG_001.JPG] — 640×480 — OK', pX, pY + pH + 16, {
      font: F.mono(9), color: '#5A635E', align: 'left',
    });

    // Right column: Data output
    const dataX = pX + pW + 50;
    let dataY = pY + 20;

    C.drawText(ctx, '=== VIBE METRICS ===', dataX, dataY, {
      font: F.mono(12, '600'), color: '#18E58A', align: 'left',
    });
    dataY += 35;

    const entries = Object.entries(cardData.scores);
    entries.forEach(([label, score]) => {
      const barLen = Math.floor((score / 100) * 20);
      const emptyLen = 20 - barLen;
      const bar = '█'.repeat(barLen) + '░'.repeat(emptyLen);
      C.drawText(ctx, `${label.padEnd(8)} [${bar}] ${score.toFixed(1)}`, dataX, dataY, {
        font: F.mono(11), color: '#8A938E', align: 'left',
      });
      dataY += 24;
    });

    dataY += 20;
    C.drawText(ctx, '=== FINAL SCORE ===', dataX, dataY, {
      font: F.mono(12, '600'), color: '#18E58A', align: 'left',
    });
    dataY += 35;
    C.drawText(ctx, cardData.finalScore.toFixed(1) + ' / 100.0', dataX, dataY, {
      font: F.mono(36, '700'), color: '#18E58A', align: 'left',
    });

    dataY += 50;
    C.drawText(ctx, '=== VERDICT ===', dataX, dataY, {
      font: F.mono(12, '600'), color: '#18E58A', align: 'left',
    });
    dataY += 30;
    C.drawText(ctx, '> "' + cardData.verdict + '"', dataX, dataY, {
      font: F.mono(12), color: '#F2F5F2', align: 'left',
    });

    dataY += 35;
    C.drawText(ctx, '=== STATUS ===', dataX, dataY, {
      font: F.mono(12, '600'), color: '#18E58A', align: 'left',
    });
    dataY += 28;
    C.drawText(ctx, '[ ' + cardData.vibeLabel + ' ]', dataX, dataY, {
      font: F.mono(11, '500'), color: '#18E58A', align: 'left',
    });

    // Bottom terminal line
    const bottomY = H - 70;
    C.drawLine(ctx, 30, bottomY, W - 30, bottomY, { color: '#1a3a2a', width: 1 });
    C.drawText(ctx, '> CERT_ID: ' + cardData.certId, 60, bottomY + 22, {
      font: F.mono(9), color: '#5A635E', align: 'left',
    });
    C.drawText(ctx, '> DATE: ' + window.VibeStampState.formatShortDate(cardData.timestamp), 60, bottomY + 40, {
      font: F.mono(9), color: '#5A635E', align: 'left',
    });
    C.drawText(ctx, '> TEMPLATE: 06 // TERMINAL', W - 60, bottomY + 22, {
      font: F.mono(9), color: '#5A635E', align: 'right',
    });

    // Blinking cursor at bottom
    C.drawRect(ctx, 60, bottomY + 55, 10, 16, { fill: '#18E58A' });

    // Robot mark (tiny, terminal style)
    C.drawRobotMark(ctx, W - 100, bottomY + 30, 20, { expression: 'certified' });

    // Subtle vignette
    const vig = ctx.createRadialGradient(W/2, H/2, H*0.4, W/2, H/2, H*0.8);
    vig.addColorStop(0, 'rgba(5,5,5,0)');
    vig.addColorStop(1, 'rgba(5,5,5,0.5)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  },
};
