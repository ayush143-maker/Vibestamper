/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — APP.JS
   Main application controller: upload, processing, generation, viewer
   EDIT TARGET: Yes — modify flow, timing, or event wiring
   ═══════════════════════════════════════════════════════════════ */

// ── SECTION: DOM References ──────────────────────────────────
const DOM = {
  landingView:    document.getElementById('landingView'),
  processingView: document.getElementById('processingView'),
  resultView:     document.getElementById('resultView'),
  siteFooter:     document.getElementById('siteFooter'),
  headerRobot:    document.getElementById('headerRobot'),
  scannerRobot:   document.getElementById('scannerRobot'),
  processingRobot: document.getElementById('processingRobot'),
  scannerZone:    document.getElementById('scannerZone'),
  scannerViewport: document.getElementById('scannerViewport'),
  scannerStatus:  document.getElementById('scannerStatus'),
  uploadTrigger:  document.getElementById('uploadTrigger'),
  photoInput:     document.getElementById('photoInput'),
  processingSteps: document.getElementById('processingSteps'),
  processingBar:  document.getElementById('processingBar'),
  cardCanvas:     document.getElementById('cardCanvas'),
  resultMeta:     document.getElementById('resultMeta'),
  btnDownload:    document.getElementById('btnDownload'),
  btnRegenerate:  document.getElementById('btnRegenerate'),
  btnNewPhoto:    document.getElementById('btnNewPhoto'),
};

// ── SECTION: File Validation ───────────────────────────────
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

function validateFile(file) {
  if (!file) return { valid: false, error: 'No file selected.' };
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Please upload a JPG, PNG, or WEBP image.' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large. Maximum size is 15MB.' };
  }
  return { valid: true };
}

function showError(message) {
  DOM.scannerStatus.textContent = message.toUpperCase();
  DOM.scannerStatus.style.color = 'var(--vs-error)';
  setTimeout(() => {
    DOM.scannerStatus.textContent = 'SCAN READY';
    DOM.scannerStatus.style.color = '';
  }, 3000);
}

// ── SECTION: Processing Steps Config ───────────────────────
const PROCESSING_STEPS = [
  { text: 'SCANNING PORTRAIT',  expression: 'scanning',  duration: 600 },
  { text: 'CALCULATING AURA',   expression: 'scanning',  duration: 700 },
  { text: 'CONSULTING ROBOT',   expression: 'confused',  duration: 800 },
  { text: 'APPLYING STAMP',     expression: 'impressed', duration: 700 },
  { text: 'CERTIFIED',          expression: 'certified', duration: 500 },
];

// ── SECTION: Initialize ────────────────────────────────────
function init() {
  VibeStampRobot.inject(DOM.headerRobot, 'neutral', 28);
  VibeStampRobot.inject(DOM.scannerRobot, 'neutral', 56);
  VibeStampRobot.inject(DOM.processingRobot, 'scanning', 80);
  bindEvents();
}

// ── SECTION: Event Binding ───────────────────────────────────
function bindEvents() {
  DOM.uploadTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    DOM.photoInput.click();
  });
  DOM.photoInput.addEventListener('change', handleFileSelect);
  DOM.scannerViewport.addEventListener('dragover', handleDragOver);
  DOM.scannerViewport.addEventListener('dragleave', handleDragLeave);
  DOM.scannerViewport.addEventListener('drop', handleDrop);
  DOM.btnDownload.addEventListener('click', handleDownload);
  DOM.btnRegenerate.addEventListener('click', handleRegenerate);
  DOM.btnNewPhoto.addEventListener('click', handleNewPhoto);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && VibeStampState.state.view === 'result') {
      handleNewPhoto();
    }
  });
}

function handleDragOver(e) {
  e.preventDefault();
  DOM.scannerViewport.classList.add('drag-over');
  DOM.scannerStatus.textContent = 'DROP TO SCAN';
}

function handleDragLeave(e) {
  e.preventDefault();
  DOM.scannerViewport.classList.remove('drag-over');
  DOM.scannerStatus.textContent = 'SCAN READY';
}

function handleDrop(e) {
  e.preventDefault();
  DOM.scannerViewport.classList.remove('drag-over');
  DOM.scannerStatus.textContent = 'SCAN READY';
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processUpload(files[0]);
  }
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) processUpload(file);
}

// ── SECTION: Main Processing Flow ──────────────────────────
async function processUpload(file) {
  const validation = validateFile(file);
  if (!validation.valid) {
    showError(validation.error);
    return;
  }

  VibeStampState.state.image.file = file;
  VibeStampState.state.view = 'processing';
  showView('processing');

  await runProcessingAnimation();

  try {
    // Make sure the mascot logo is decoded and ready before the
    // card templates try to stamp it onto the canvas.
    await VibeStampCanvas.loadMascotImage();

    const image = await VibeStampCanvas.loadImage(file);
    VibeStampState.state.image.width = image.width;
    VibeStampState.state.image.height = image.height;
    VibeStampState.state.image.aspectRatio = image.width / image.height;
    VibeStampState.state.image.dataUrl = image.src;

    const cardData = await VibeStampState.generateCardData(file);

    const availableTemplates = Object.keys(window.VibeStampTemplates);
    let selectedTemplate;
    do {
      selectedTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    } while (selectedTemplate === VibeStampState.state.history.lastTemplateId && availableTemplates.length > 1);

    cardData.templateId = selectedTemplate;
    VibeStampState.state.card = cardData;
    VibeStampState.state.history.lastTemplateId = selectedTemplate;
    VibeStampState.state.history.generatedCount++;

    await renderCard(image, cardData);

    VibeStampState.state.view = 'result';
    showView('result');

  } catch (err) {
    console.error('Card generation failed:', err);
    DOM.scannerStatus.textContent = 'SCAN FAILED';
    setTimeout(() => showView('landing'), 1500);
  }
}

// ── SECTION: Processing Animation ───────────────────────────
function runProcessingAnimation() {
  return new Promise((resolve) => {
    const steps = DOM.processingSteps.querySelectorAll('.vs-step');
    const robot = DOM.processingRobot;
    let currentStep = 0;

    steps.forEach(s => {
      s.classList.remove('active', 'done');
      s.style.position = 'absolute';
    });

    function advance() {
      if (currentStep > 0) {
        steps[currentStep - 1].classList.remove('active');
        steps[currentStep - 1].classList.add('done');
      }

      if (currentStep >= PROCESSING_STEPS.length) {
        resolve();
        return;
      }

      const config = PROCESSING_STEPS[currentStep];
      const stepEl = steps[currentStep];

      stepEl.style.position = 'relative';
      stepEl.classList.add('active');

      VibeStampRobot.setExpression(robot, config.expression, 80);

      const pct = ((currentStep + 1) / PROCESSING_STEPS.length) * 100;
      DOM.processingBar.style.width = pct + '%';

      currentStep++;
      setTimeout(advance, config.duration);
    }

    advance();
  });
}

// ── SECTION: Card Rendering ────────────────────────────────
async function renderCard(image, cardData) {
  const C = window.VibeStampCanvas;

  // Cleanup previous canvas if exists
  if (DOM.cardCanvas._fullRes) {
    DOM.cardCanvas._fullRes.width = 0;
    DOM.cardCanvas._fullRes.height = 0;
    delete DOM.cardCanvas._fullRes;
  }

  const { canvas, ctx } = C.createCanvas();

  const template = window.VibeStampTemplates[cardData.templateId];
  if (!template) {
    throw new Error('Template not found: ' + cardData.templateId);
  }

  template.render(ctx, image, cardData);

  DOM.cardCanvas.width = C.CARD_WIDTH;
  DOM.cardCanvas.height = C.CARD_HEIGHT;
  const displayCtx = DOM.cardCanvas.getContext('2d');
  displayCtx.drawImage(canvas, 0, 0);

  DOM.cardCanvas._fullRes = canvas;

  DOM.resultMeta.innerHTML = `
    <span>${cardData.certId}</span>
    <span>·</span>
    <span>${window.VibeStampState.formatShortDate(cardData.timestamp)}</span>
    <span>·</span>
    <span>SCORE ${cardData.finalScore.toFixed(1)}</span>
  `;
}

// ── SECTION: View Management ─────────────────────────────────
function showView(viewName) {
  DOM.landingView.hidden = viewName !== 'landing';
  DOM.landingView.setAttribute('aria-hidden', viewName !== 'landing');

  DOM.processingView.hidden = viewName !== 'processing';
  DOM.processingView.setAttribute('aria-hidden', viewName !== 'processing');

  DOM.resultView.hidden = viewName !== 'result';
  DOM.resultView.setAttribute('aria-hidden', viewName !== 'result');

  DOM.siteFooter.hidden = viewName === 'processing';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── SECTION: Result Actions ────────────────────────────────
function handleDownload() {
  const canvas = DOM.cardCanvas._fullRes;
  if (!canvas) return;

  const score = VibeStampState.state.card.finalScore.toFixed(1);
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const filename = `vibestamp-${score}-${date}.png`;

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

function handleRegenerate() {
  const file = VibeStampState.state.image.file;
  if (!file) return;
  processUpload(file);
}

function handleNewPhoto() {
  VibeStampState.state.image = {
    file: null, dataUrl: null, width: 0, height: 0, aspectRatio: 1,
  };
  VibeStampState.state.card = {
    templateId: null, scores: {}, finalScore: 0,
    verdict: '', vibeLabel: '', certId: '', timestamp: '', seed: 0,
  };
  VibeStampState.state.view = 'landing';

  DOM.photoInput.value = '';
  showView('landing');
}

// ── SECTION: Start ─────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
