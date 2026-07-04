# 🌿 One Wish Willow — Birthday Puzzle Website

A mystical, interactive birthday website themed after the **"One Wish Willow"** from the 2026 film *Obsession*. Your girlfriend must solve a series of enchanting puzzles — each themed as a ritual step — to unlock the ultimate birthday wish page.

## Design Theme — "One Wish Willow" Aesthetic

Based on thorough research of the [onewishwillow.com](https://onewishwillow.com) official site and fan-created replicas:

### Color Palette
| Token | Color | Usage |
|---|---|---|
| `--oww-red` | `#C41E3A` (Deep Blood Red) | Primary accent, headings, glowing elements |
| `--oww-cream` | `#F1E7CF` (Aged Cream) | Background base, "old paper" feel |
| `--oww-cream-dark` | `#E8D5B0` (Darker Cream) | Card backgrounds, panels |
| `--oww-black` | `#111111` | Strong lines, text, borders |
| `--oww-brown` | `#3A2A1A` (Dark Brown) | Earthy wood tones, the "willow" |
| `--oww-gold` | `#D4A853` (Muted Gold) | Stars, magical accents, sparkle |
| `--oww-green` | `#2D5A3D` (Deep Forest Green) | Willow leaves, nature elements |
| `--oww-glow` | `#FFD700` | Wish sparkle, success states |

### Typography
- **Display/Headings**: Bold serif font (Playfair Display) — vintage product packaging feel
- **Body/Labels**: Monospace (Courier Prime) — instruction manual / retro typewriter aesthetic
- **Magical text**: Cinzel Decorative — for mystical headings and wish reveals

### Visual Motifs
- ⭐ Stars and celestial symbols scattered throughout
- 🌿 Willow branches as decorative borders
- 📦 Retro "novelty box" packaging layout
- 🔥 Flame/spark animations for the "ignition" step
- 💫 Particle effects for magical moments
- Grain/paper texture overlays for vintage authenticity
- Hand-drawn style illustrations (SVG)

---

## Architecture — Pure HTML/CSS/JS (No Framework)

This will be a **single-page application** built with vanilla HTML, CSS, and JavaScript — no dependencies required. All files live in `c:\Projects\MyGobla\birthday-wish-willow\`.

```
birthday-wish-willow/
├── index.html              # Single HTML entry point
├── css/
│   ├── styles.css          # Global design system & variables
│   ├── animations.css      # Keyframe animations & transitions
│   └── pages.css           # Page-specific layouts
├── js/
│   ├── app.js              # Main app controller & page routing
│   ├── audio.js            # SFX & voice narration engine
│   ├── particles.js        # Particle effects (stars, sparks, confetti)
│   ├── puzzles/
│   │   ├── puzzle1-unbox.js    # Puzzle 1: Unbox the Willow
│   │   ├── puzzle2-wish.js     # Puzzle 2: Decode the Wish
│   │   ├── puzzle3-spark.js    # Puzzle 3: Ignite the Spark
│   │   └── puzzle4-break.js    # Puzzle 4: Break & Reveal
│   └── utils.js            # Shared helpers
├── assets/
│   ├── images/
│   │   ├── placeholder-1.jpg   # Placeholder for girlfriend's photo
│   │   ├── placeholder-2.jpg   # Placeholder photo 2
│   │   └── placeholder-3.jpg   # Placeholder photo 3
│   ├── audio/
│   │   ├── ambient.mp3         # Mystical ambient background (generated)
│   │   ├── click.mp3           # UI click sound
│   │   ├── success.mp3         # Puzzle complete sound
│   │   ├── whoosh.mp3          # Page transition sound
│   │   ├── spark.mp3           # Fire/spark ignition
│   │   └── reveal.mp3          # Final wish reveal
│   └── svg/
│       ├── willow-branch.svg   # Decorative willow branch
│       ├── stars.svg           # Star decorations
│       └── box.svg             # One Wish Willow box
└── README.md
```

---

## Page Flow (5 Stages)

### 🏠 Stage 0: Landing Page — "The Package Has Arrived"
- **Design**: Retro e-commerce style mimicking onewishwillow.com
- **Elements**:
  - Vintage-styled "ONE WISH WILLOW" header in bold serif
  - A triangular box illustration (SVG) centered on cream background
  - Tagline: *"Amaze your friends! Remove from the box and just make a wish!"*
  - Red "OPEN THE BOX →" button styled as a vintage label
  - Grain overlay + stars particle effect in background
  - Paper texture background
- **SFX**: Soft ambient mystical music begins on first interaction
- **Voice**: Browser SpeechSynthesis whispers: *"A package has arrived for you..."*

### 🧩 Stage 1: Puzzle 1 — "Remove From The Box"
- **Puzzle Type**: **Drag-and-drop unboxing**
- **Mechanic**: A vintage box appears sealed with illustrated tape/ribbons. The user must drag 4 "seals" (corners/ribbons) off the box in the correct order (matching symbols on each seal — ⭐, 🌙, ♥, 🌿). Dragging in wrong order shakes the box with an error SFX.
- **Visual**: The box has the One Wish Willow retro branding. As seals are removed, the box lid slowly animates open.
- **SFX**: Paper tearing / unwrapping sounds per seal
- **Voice**: *"Carefully now... the seals must be broken in order..."*
- **On Complete**: Box opens with a golden glow burst, revealing a willow stick + a photo of the girlfriend (placeholder)

### 🔮 Stage 2: Puzzle 2 — "Make A Wish" (Decode the Message)
- **Puzzle Type**: **Cipher / Word scramble**
- **Mechanic**: A scrambled birthday message appears on a vintage card. Letters are displayed in "tiles" (like Scrabble pieces styled as old wooden blocks). The user must rearrange the tiles to spell out a birthday wish phrase (e.g., "HAPPY BIRTHDAY MY LOVE").
- **Visual**: Wooden letter tiles on a cream paper backdrop, surrounded by willow leaf decorations. A photo frame (placeholder) sits in the corner.
- **SFX**: Tile click/place sounds, soft chime on correct word
- **Voice**: *"The willow speaks in riddles... unscramble its message..."*
- **Hints**: After 30 seconds, letters gently pulse in correct order

### 🔥 Stage 3: Puzzle 3 — "Spark The Middle"
- **Puzzle Type**: **Connect-the-dots / Constellation tracing**
- **Mechanic**: Stars appear on screen forming a hidden pattern (a heart or a willow tree). The user must connect dots in the right order by clicking them sequentially. Connected dots create glowing golden lines. Wrong connections fade out with a "fizzle" effect.
- **Visual**: Deep dark background (night sky) with animated twinkling stars. Successfully connected constellation glows with fire/gold energy.
- **SFX**: Each correct dot produces a musical note (ascending scale). Wrong dot = fizzle. Complete = ignition/flame burst.
- **Voice**: *"Find the spark within the stars... connect them to ignite the wish..."*
- **On Complete**: The constellation bursts into a flame animation that illuminates a hidden photo

### 💔➡️✨ Stage 4: Puzzle 4 — "Break It In Half"
- **Puzzle Type**: **Split-screen reveal / Interactive "breaking" animation**
- **Mechanic**: A large willow stick image spans the screen. The user must click and hold in the center, then "drag" both halves apart (like snapping a wishbone). As they pull, golden particles stream from the break point. At full separation, the wish is revealed.
- **Visual**: The stick is detailed with wood grain texture. Breaking reveals a golden crack/light beam. Sparks and stars pour from the center.
- **SFX**: Wood creaking → SNAP → magical burst → triumphant music swell
- **Voice**: *"Break the willow... and set your wish free..."*

### 🎂 Stage 5: The Ultimate Wish Page — "Your Wish Has Been Granted"
- **Design**: Full-screen celebration
- **Elements**:
  - Explosive confetti / golden particle shower
  - Large animated "HAPPY BIRTHDAY [NAME]!" in Cinzel Decorative font
  - A photo carousel of the girlfriend (placeholder images)
  - A heartfelt birthday message that types out letter-by-letter (typewriter effect)
  - Floating hearts and stars animation
  - Background shifts from dark to warm golden
  - A "replay" button styled as the willow box
- **SFX**: Celebration music, confetti burst sounds
- **Voice**: Full narrated birthday wish using SpeechSynthesis API
- **Special**: The page gently "pulses" with a warm golden glow, like a living wish

---

## Technical Implementation Details

### SFX System (`audio.js`)
- Use **Web Audio API** with `AudioContext` for low-latency SFX
- Synthesize sounds programmatically (no external audio files needed initially):
  - Click: Short sine wave burst
  - Success: Ascending chord (C-E-G)
  - Error: Low buzz
  - Whoosh: White noise sweep
  - Spark: Crackling noise pattern
  - Celebration: Multi-layered chord progression
- Background ambient: Oscillator-based pad with gentle LFO modulation
- All audio initialized on first user click (browser autoplay policy)

### Interactive Voice (`audio.js`)
- Use **SpeechSynthesis API** (`window.speechSynthesis`)
- Female voice preference (fallback to default)
- Low pitch, slow rate for mystical atmosphere
- Voice triggered at key moments (page transitions, puzzle starts, hints)

### Particle System (`particles.js`)
- Canvas-based particle renderer
- Particle types: Stars (✦), Sparks (●), Confetti (■), Hearts (♥)
- Physics: gravity, wind, fade-out
- Used for: background ambiance, puzzle completions, final celebration

### Responsive Design
- Mobile-first approach
- Touch support for all drag/swipe interactions
- Portrait mode optimized (most likely viewed on phone)

---

## User Review Required

> [!IMPORTANT]
> **Girlfriend's Name**: I'll use `[NAME]` as placeholder — please provide her name so I can personalize all messages and the final wish.

> [!IMPORTANT]
> **Birthday Message**: Would you like to write the final birthday wish message yourself, or should I craft a romantic/heartfelt one? I can include placeholder text and you can edit it later.

> [!IMPORTANT]
> **Photos**: You mentioned you'll provide photos later. I'll use styled placeholder boxes with the text "Your Photo Here" — easy to swap out. How many photos total would you like displayed across the site?

## Open Questions

1. **Her Name?** — Needed for personalized messages throughout the journey.
2. **Specific birthday message?** — Do you have one in mind, or should I write one?
3. **How many photos?** — I'll place 3-5 placeholder slots across the puzzles and final page.
4. **Any inside jokes or special references?** — These would make the puzzles more personal (e.g., a scramble of a phrase only she'd know).
5. **Birthday date?** — So I can include it in the design.

## Proposed Changes

### [NEW] `c:\Projects\MyGobla\birthday-wish-willow\`

Complete new project with the following key files:

#### [NEW] [index.html](file:///c:/Projects/MyGobla/birthday-wish-willow/index.html)
Single-page HTML with all 6 stages as hidden sections. SEO-friendly with meta tags. Google Fonts loaded for Playfair Display, Courier Prime, and Cinzel Decorative.

#### [NEW] [css/styles.css](file:///c:/Projects/MyGobla/birthday-wish-willow/css/styles.css)
Complete design system with CSS custom properties matching the One Wish Willow palette. Paper textures via CSS gradients, grain overlays, typography scale.

#### [NEW] [css/animations.css](file:///c:/Projects/MyGobla/birthday-wish-willow/css/animations.css)
All keyframe animations: box opening, letter tile movements, star twinkle, fire effects, confetti burst, typewriter text, golden glow pulse.

#### [NEW] [css/pages.css](file:///c:/Projects/MyGobla/birthday-wish-willow/css/pages.css)
Stage-specific layouts: landing grid, puzzle containers, constellation canvas, breaking mechanic, celebration layout.

#### [NEW] [js/app.js](file:///c:/Projects/MyGobla/birthday-wish-willow/js/app.js)
Main controller managing stage transitions, state persistence (localStorage), and page routing via hash or section visibility.

#### [NEW] [js/audio.js](file:///c:/Projects/MyGobla/birthday-wish-willow/js/audio.js)
Web Audio API sound synthesizer + SpeechSynthesis voice narration engine.

#### [NEW] [js/particles.js](file:///c:/Projects/MyGobla/birthday-wish-willow/js/particles.js)
Canvas-based particle system for stars, sparks, confetti, and hearts.

#### [NEW] [js/puzzles/puzzle1-unbox.js](file:///c:/Projects/MyGobla/birthday-wish-willow/js/puzzles/puzzle1-unbox.js)
Drag-and-drop seal removal puzzle with symbol matching.

#### [NEW] [js/puzzles/puzzle2-wish.js](file:///c:/Projects/MyGobla/birthday-wish-willow/js/puzzles/puzzle2-wish.js)
Letter tile scramble/rearrange puzzle.

#### [NEW] [js/puzzles/puzzle3-spark.js](file:///c:/Projects/MyGobla/birthday-wish-willow/js/puzzles/puzzle3-spark.js)
Connect-the-dots constellation puzzle.

#### [NEW] [js/puzzles/puzzle4-break.js](file:///c:/Projects/MyGobla/birthday-wish-willow/js/puzzles/puzzle4-break.js)
Interactive willow-breaking mechanic.

#### [NEW] [js/utils.js](file:///c:/Projects/MyGobla/birthday-wish-willow/js/utils.js)
Shared utilities: DOM helpers, easing functions, random number generators.

## Verification Plan

### Manual Verification
- Open `index.html` in a browser via a local dev server
- Test all 5 puzzle stages end-to-end
- Verify SFX plays on interactions
- Verify SpeechSynthesis narration triggers
- Test on mobile viewport (responsive design)
- Verify touch interactions (drag, swipe, tap)
- Check all animations run smoothly at 60fps
- Verify localStorage state persistence (refresh mid-puzzle)
