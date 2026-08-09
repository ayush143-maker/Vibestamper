# VibeStamp

> One photo. One verdict. One very questionable certification.

**VibeStamp** is a privacy-first, browser-based photo stamping tool that transforms your portrait into a collectible certification card. Everything runs locally — your photo never leaves your device.

## What It Does

1. **Upload** a photo (JPG, PNG, WEBP)
2. The **Vibe System** scans your aura
3. Receive a unique **collectible VibeStamp card** with scores, a Gen-Z verdict, and a certification seal
4. **Download** your card as a high-resolution 1080×1350 PNG

## Features

- **30 Unique Card Templates** — from editorial fashion to retro terminal to classified dossier
- **5 Robot Expressions** — neutral, scanning, impressed, confused, certified
- **Deterministic Scoring** — AURA, STYLE, FIT, VIBE, ENERGY, PRESENCE
- **100+ Original Verdicts** — Gen-Z phrases, no copyrighted content
- **100% Private** — zero server upload, zero API calls, zero tracking
- **High-Res Export** — crisp 1080×1350 PNG via Canvas API
- **Mobile-First** — designed for phones, works everywhere

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla HTML5 / CSS3 / JavaScript |
| Rendering | HTML5 Canvas API |
| Fonts | Space Grotesk, IBM Plex Mono, Inter (Google Fonts) |
| Backend | None |
| Dependencies | Zero |

## Project Structure

```
VibeStamp/
├── index.html              # Main entry point
├── vercel.json             # Vercel deployment config
├── README.md               # This file
├── .gitignore              # Git ignore rules
├── assets/
│   ├── logo/
│   │   └── robot.svg       # Robot mascot logo
│   └── og-image.png        # Open Graph social image
├── css/
│   ├── base.css            # Design tokens, reset, utilities
│   ├── landing.css         # Landing page, scanner, header
│   └── cards.css           # Result viewer, processing animation
└── js/
    ├── robot.js             # SVG robot mascot (5 expressions)
    ├── state.js             # App state, scoring engine, content
    ├── canvas.js            # Canvas primitives (30+ utilities)
    ├── app.js               # Main controller, upload, download
    └── templates/
        ├── template01.js    # Signature Minimal Emerald
        ├── template02.js    # Futuristic Passport
        ├── template03.js    # Editorial Fashion
        ├── template04.js    # Brutalist B&W
        ├── template05.js    # Digital Biometric
        ├── template06.js    # Retro Terminal
        ├── template07.js    # Luxury Black
        ├── template08.js    # Streetwear Rating
        ├── template09.js    # Technical Scan
        ├── template10.js    # Music Cover
        ├── template11.js    # Y2K Digital Profile
        ├── template12.js    # Newspaper Editorial
        ├── template13.js    # Classified Dossier
        ├── template14.js    # Digital Boarding Pass
        ├── template15.js    # Product Label
        ├── template16.js    # Minimal Swiss
        ├── template17.js    # Glitch Error
        ├── template18.js    # Camera Metadata
        ├── template19.js    # Employee Badge
        ├── template20.js    # Archive Specimen
        ├── template21.js    # High-Fashion Campaign
        ├── template22.js    # Digital Achievement
        ├── template23.js    # Black-on-Black Luxury
        ├── template24.js    # Matrix Terminal
        ├── template25.js    # Hand-Stamped Analog
        ├── template26.js    # Technical Blueprint
        ├── template27.js    # Magazine Index
        ├── template28.js    # Robot Approved
        ├── template29.js    # Signature Flagship Alt
        └── template30.js    # Grand Finale
```

## Development

Built in 4 sequential parts:

1. **Part 1** — Brand foundation, robot mascot, landing page, flagship card
2. **Part 2** — Canvas primitives engine, templates 02–10
3. **Part 3** — Templates 11–20, new primitives
4. **Part 4** — Templates 21–30, final primitives, deployment config

Each file contains clearly marked `SECTION:` comments for targeted future edits.

## Local Development

```bash
# Clone or download the repository
cd VibeStamp

# Option 1: Open index.html directly in your browser
open index.html

# Option 2: Use a local server (recommended)
npx serve .
# or
python3 -m http.server 3000
# or
php -S localhost:3000
```

Then open `http://localhost:3000`.

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

### Option 2: GitHub + Vercel Dashboard

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and click "New Project"
3. Import your GitHub repository
4. Framework preset: **Other** (static)
5. Click **Deploy**

### Option 3: Vercel Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/vibestamp)

> Replace `YOUR_USERNAME` with your actual GitHub username after pushing.

## Customization

Every major section is marked with a comment block:

```js
// ═══════════════════════════════════════════════════════════════
// SECTION: [NAME] — [DESCRIPTION]
// EDIT TARGET: Yes — [what to modify]
// ═══════════════════════════════════════════════════════════════
```

To customize a specific area, tell the AI:

> "Regenerate only the **SCORING ENGINE** section in `state.js`"
> "Update the **ROBOT EXPRESSIONS** in `robot.js`"
> "Change the **PROCESSING ANIMATION** timing"

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome / Edge | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support |
| Mobile Chrome | ✅ Full support |
| Mobile Safari | ✅ Full support |
| Samsung Internet | ✅ Full support |

## Accessibility

- Keyboard navigation supported (Tab, Enter, Escape)
- Focus-visible outlines on all interactive elements
- ARIA labels on buttons and views
- `prefers-reduced-motion` respected
- Touch targets minimum 44px on mobile
- Screen reader friendly structure

## Privacy

- **No server upload** — images processed entirely in-browser via FileReader
- **No API calls** — no external services for generation
- **No tracking** — no analytics, no cookies, no fingerprinting
- **No database** — nothing is stored anywhere

## License

MIT License — feel free to fork, modify, and deploy your own version.

---

Built with 💚 and questionable vibes.
