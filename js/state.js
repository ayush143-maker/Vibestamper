/* ═══════════════════════════════════════════════════════════════
   VIBESTAMP — STATE.JS
   Centralized application state and data generation

   EDIT TARGET: Yes — modify state shape, add new fields, or change defaults
   ═══════════════════════════════════════════════════════════════ */

// ── SECTION: Application State ───────────────────────────────
const VSState = {
  // Current view: 'landing' | 'processing' | 'result'
  view: 'landing',

  // Uploaded image data
  image: {
    file: null,
    dataUrl: null,
    width: 0,
    height: 0,
    aspectRatio: 1,
  },

  // Generated card data
  card: {
    templateId: null,
    scores: {},
    finalScore: 0,
    verdict: '',
    vibeLabel: '',
    certId: '',
    timestamp: '',
    seed: 0,
  },

  // Processing state
  processing: {
    step: 0,
    totalSteps: 5,
    isComplete: false,
  },

  // History (for regeneration deduplication)
  history: {
    lastTemplateId: null,
    generatedCount: 0,
  },
};

// ── SECTION: Score Categories ────────────────────────────────
const SCORE_CATEGORIES = [
  'AURA',
  'STYLE', 
  'FIT',
  'VIBE',
  'ENERGY',
  'PRESENCE',
];

// ── SECTION: Vibe Labels ─────────────────────────────────────
const VIBE_LABELS = [
  'AURA DETECTED',
  'VIBE VERIFIED',
  'LOCKED IN',
  'MAIN CHARACTER',
  'CLEAN SIGNAL',
  'NO NOTES',
  'CERTIFIED',
  'HIGH AURA',
  'OFF DUTY',
  'CHAOTIC GOOD',
  'VIBE STABLE',
  'UNEXPECTEDLY HARD',
  'ZERO NOTES',
  'SIGNAL LOCKED',
  'APPROVED',
  'VERIFIED',
  'CLEARED',
  'OPTIMAL',
  'PRISTINE',
  'LEGENDARY',
];

// ── SECTION: Verdict Phrases ───────────────────────────────
const VERDICTS = [
  'aura detected.',
  'bro understood the assignment.',
  'lowkey certified.',
  'zero notes.',
  'locked in.',
  'this passed the vibe check.',
  'unexpectedly hard.',
  'main character behavior.',
  'respectfully, this works.',
  'the vibe is undeniable.',
  'byte has spoken.',
  'certified.',
  'no further questions.',
  'okay this actually goes hard.',
  'vibe check: passed.',
  'absolutely unhinged in the best way.',
  'the algorithm approves.',
  'undeniable main character energy.',
  'this is giving what it is supposed to give.',
  'no notes. just vibes.',
  'certified fresh.',
  'the robot is impressed.',
  'vibe coefficient: optimal.',
  'aura reading off the charts.',
  'this one is different.',
  'respectfully, iconic.',
  'vibe stamp applied.',
  'the streets will remember this.',
  'certified banger.',
  'no cap, this slaps.',
  'the simulation glitched in your favor.',
  'vibe entropy: minimal.',
  'signal strength: maximum.',
  'this passed all 47 vibe subroutines.',
  'the machine has spoken.',
  'vibe resonance: confirmed.',
  'aura signature: unique.',
  'certified by the byte.',
  'this one goes in the archive.',
  'vibe stability: 100%.',
  'the council approves.',
  'no further analysis needed.',
  'this is the one.',
  'vibe transmission: successful.',
  'the data does not lie.',
  'certified specimen.',
  'vibe profile: exemplary.',
  'the robot nodded.',
  'stamp applied. case closed.',
  'vibe authenticity: verified.',
];

// ── SECTION: Seeded Random Generator ─────────────────────────
// Deterministic random based on seed string
function createSeededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  // `hash` can come out negative (32-bit signed int), and JS's `%`
  // keeps the sign of the left operand — so a negative hash would
  // make every subsequent draw negative too. Normalize to a
  // positive, non-zero seed before starting the generator.
  hash = Math.abs(hash) % 2147483647;
  if (hash === 0) hash = 1;

  return function() {
    hash = (hash * 16807) % 2147483647;
    return (hash - 1) / 2147483646;
  };
}

// ── SECTION: Card Data Generator ───────────────────────────
/**
 * Generate all card data from an image file
 * @param {File} file - The uploaded image file
 * @returns {Promise<Object>} Generated card data
 */
async function generateCardData(file) {
  const seed = file.name + file.size + file.lastModified + Date.now();
  const rng = createSeededRandom(seed);

  // Generate scores (70-99 range, weighted toward higher values)
  const scores = {};
  let total = 0;

  SCORE_CATEGORIES.forEach(cat => {
    const base = 70 + Math.floor(rng() * 30);
    const decimal = Math.floor(rng() * 10);
    scores[cat] = parseFloat(`${base}.${decimal}`);
    total += scores[cat];
  });

  // Final score is average, formatted to 1 decimal
  const finalScore = parseFloat((total / SCORE_CATEGORIES.length).toFixed(1));

  // Select verdict
  const verdictIndex = Math.floor(rng() * VERDICTS.length);
  const verdict = VERDICTS[verdictIndex];

  // Select vibe label
  const labelIndex = Math.floor(rng() * VIBE_LABELS.length);
  const vibeLabel = VIBE_LABELS[labelIndex];

  // Generate certification ID
  const certId = generateCertId(rng);

  // Timestamp
  const now = new Date();
  const timestamp = now.toISOString();

  return {
    templateId: null, // Set by caller
    scores,
    finalScore,
    verdict,
    vibeLabel,
    certId,
    timestamp,
    seed,
  };
}

// ── SECTION: Certification ID Generator ──────────────────────
function generateCertId(rng) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'VS-';
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      id += chars[Math.floor(rng() * chars.length)];
    }
    if (i < 2) id += '-';
  }
  return id;
}

// ── SECTION: Format Timestamp ──────────────────────────────
function formatTimestamp(isoString) {
  const d = new Date(isoString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} — ${hh}:${min}:${ss}`;
}

// ── SECTION: Format Short Date ───────────────────────────────
function formatShortDate(isoString) {
  const d = new Date(isoString);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ── SECTION: Export ────────────────────────────────────────
if (typeof window !== 'undefined') {
  window.VibeStampState = {
    state: VSState,
    SCORE_CATEGORIES,
    VIBE_LABELS,
    VERDICTS,
    generateCardData,
    formatTimestamp,
    formatShortDate,
    createSeededRandom,
  };
}
