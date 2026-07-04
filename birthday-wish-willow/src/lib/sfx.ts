// ══════════════════════════════════════════════════
// ONE WISH WILLOW — Dark / Mysterious SFX Engine
// Web Audio API synthesizer — no external audio files
// ══════════════════════════════════════════════════

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** White / pink noise buffer generator */
function createNoiseBuffer(duration: number, type: 'white' | 'pink' = 'white'): AudioBuffer {
  const c = getCtx();
  const len = c.sampleRate * duration;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);

  if (type === 'white') {
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  } else {
    // Pink noise via Voss-McCartney
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.96900 * b2 + w * 0.1538520;
      b3 = 0.86650 * b3 + w * 0.3104856;
      b4 = 0.55000 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.05;
      b6 = w * 0.115926;
    }
  }
  return buf;
}

/** Static crackle — old radio hiss */
export function playCrackle(duration = 1.5, volume = 0.12): void {
  const c = getCtx();
  const now = c.currentTime;
  const noise = c.createBufferSource();
  noise.buffer = createNoiseBuffer(duration);

  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 3000;
  bp.Q.value = 0.5;

  const gain = c.createGain();
  // Random amplitude for crackle
  gain.gain.setValueAtTime(0, now);
  const steps = Math.floor(duration * 20);
  for (let i = 0; i < steps; i++) {
    const t = now + (i / steps) * duration;
    gain.gain.setValueAtTime(Math.random() * volume, t);
  }
  gain.gain.setValueAtTime(0, now + duration);

  noise.connect(bp).connect(gain).connect(c.destination);
  noise.start(now);
  noise.stop(now + duration);
}

/** Deep ominous buzz */
export function playBuzz(duration = 0.8, volume = 0.15): void {
  const c = getCtx();
  const now = c.currentTime;

  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(55, now);
  osc.frequency.linearRampToValueAtTime(40, now + duration);

  const distortion = c.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i * 2) / 256 - 1;
    curve[i] = (Math.PI + 50) * x / (Math.PI + 50 * Math.abs(x));
  }
  distortion.curve = curve;

  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(distortion).connect(gain).connect(c.destination);
  osc.start(now);
  osc.stop(now + duration);
}

/** Whisper hiss — ghostly breath */
export function playWhisperHiss(duration = 2, volume = 0.08): void {
  const c = getCtx();
  const now = c.currentTime;

  const noise = c.createBufferSource();
  noise.buffer = createNoiseBuffer(duration, 'pink');

  const hp = c.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2000;

  const gain = c.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + duration * 0.3);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  noise.connect(hp).connect(gain).connect(c.destination);
  noise.start(now);
  noise.stop(now + duration);
}

/** Spark pop — electrical snap */
export function playSparkPop(volume = 0.2): void {
  const c = getCtx();
  const now = c.currentTime;

  const noise = c.createBufferSource();
  noise.buffer = createNoiseBuffer(0.08);

  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  const hp = c.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 1500;

  noise.connect(hp).connect(gain).connect(c.destination);
  noise.start(now);
  noise.stop(now + 0.1);
}

/** Cipher tick — metallic typewriter click */
export function playCipherTick(volume = 0.15): void {
  const c = getCtx();
  const now = c.currentTime;

  const osc = c.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(2800 + Math.random() * 600, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.03);

  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain).connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.05);
}

/** Wood creak — organic tension */
export function playWoodCreak(duration = 1.2, volume = 0.1): void {
  const c = getCtx();
  const now = c.currentTime;

  const osc1 = c.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(120, now);
  osc1.frequency.linearRampToValueAtTime(80, now + duration);

  const osc2 = c.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(123, now);
  osc2.frequency.linearRampToValueAtTime(77, now + duration);

  const gain = c.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.1);
  gain.gain.linearRampToValueAtTime(volume * 0.6, now + duration * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc1.connect(gain).connect(c.destination);
  osc2.connect(gain);
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration);
  osc2.stop(now + duration);
}

/** Radio tune — sweeping through frequencies */
export function playRadioTune(duration = 1.5, volume = 0.1): void {
  const c = getCtx();
  const now = c.currentTime;

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(2000, now + duration * 0.5);
  osc.frequency.exponentialRampToValueAtTime(400, now + duration);

  const noise = c.createBufferSource();
  noise.buffer = createNoiseBuffer(duration);

  const noiseBp = c.createBiquadFilter();
  noiseBp.type = 'bandpass';
  noiseBp.frequency.value = 1500;
  noiseBp.Q.value = 2;

  const noiseGain = c.createGain();
  noiseGain.gain.value = volume * 0.4;

  const oscGain = c.createGain();
  oscGain.gain.setValueAtTime(volume * 0.3, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(oscGain).connect(c.destination);
  noise.connect(noiseBp).connect(noiseGain).connect(c.destination);
  osc.start(now);
  noise.start(now);
  osc.stop(now + duration);
  noise.stop(now + duration);
}

/** Revelation drone — stacked detuned oscillators with tremolo */
export function playRevelationDrone(duration = 4, volume = 0.08): void {
  const c = getCtx();
  const now = c.currentTime;

  const masterGain = c.createGain();
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(volume, now + 1);
  masterGain.gain.setValueAtTime(volume, now + duration - 1.5);
  masterGain.gain.linearRampToValueAtTime(0, now + duration);
  masterGain.connect(c.destination);

  // Tremolo LFO
  const lfo = c.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 3;
  const lfoGain = c.createGain();
  lfoGain.gain.value = volume * 0.3;
  lfo.connect(lfoGain).connect(masterGain.gain);
  lfo.start(now);
  lfo.stop(now + duration);

  // Stacked detuned oscillators
  const freqs = [110, 112, 165, 167, 220, 223];
  freqs.forEach((f) => {
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f;
    osc.connect(masterGain);
    osc.start(now);
    osc.stop(now + duration);
  });
}

/** Eerie ambient bed — background atmosphere */
let ambientNodes: { stop: () => void } | null = null;

export function startAmbient(volume = 0.04): void {
  if (ambientNodes) return;
  const c = getCtx();

  const noiseSource = c.createBufferSource();
  noiseSource.buffer = createNoiseBuffer(10, 'pink');
  noiseSource.loop = true;

  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 400;

  const noiseGain = c.createGain();
  noiseGain.gain.value = volume;

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 55;

  const oscGain = c.createGain();
  oscGain.gain.value = volume * 0.5;

  // Slow LFO on filter
  const lfo = c.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.15;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 200;
  lfo.connect(lfoGain).connect(lp.frequency);

  noiseSource.connect(lp).connect(noiseGain).connect(c.destination);
  osc.connect(oscGain).connect(c.destination);
  lfo.start();
  noiseSource.start();
  osc.start();

  ambientNodes = {
    stop: () => {
      noiseSource.stop();
      osc.stop();
      lfo.stop();
      ambientNodes = null;
    },
  };
}

export function stopAmbient(): void {
  ambientNodes?.stop();
}

/** Winning trumpet fanfare — triumphant but short, with a mysterious edge */
export function playTrumpetFanfare(volume = 0.12): void {
  const c = getCtx();
  const now = c.currentTime;

  const masterGain = c.createGain();
  masterGain.gain.setValueAtTime(0, now);
  masterGain.connect(c.destination);

  // Trumpet-like tone: sawtooth + formant shaping
  const notes = [
    { freq: 349.23, start: 0, dur: 0.15 },     // F4 short
    { freq: 349.23, start: 0.18, dur: 0.15 },   // F4 short
    { freq: 349.23, start: 0.36, dur: 0.15 },   // F4 short
    { freq: 440.00, start: 0.55, dur: 0.4 },    // A4 long
    { freq: 349.23, start: 1.0, dur: 0.15 },    // F4 short
    { freq: 440.00, start: 1.2, dur: 0.15 },    // A4 short
    { freq: 523.25, start: 1.4, dur: 0.8 },     // C5 long hold
  ];

  notes.forEach(({ freq, start, dur }) => {
    const osc = c.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;

    // Formant filter for brass quality
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = freq * 2;
    bp.Q.value = 2;

    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(freq * 3, now + start);
    lp.frequency.linearRampToValueAtTime(freq * 1.5, now + start + dur);

    const noteGain = c.createGain();
    noteGain.gain.setValueAtTime(0, now + start);
    noteGain.gain.linearRampToValueAtTime(volume, now + start + 0.02);
    noteGain.gain.setValueAtTime(volume * 0.85, now + start + 0.05);
    noteGain.gain.linearRampToValueAtTime(0.001, now + start + dur);

    osc.connect(bp).connect(lp).connect(noteGain).connect(masterGain);
    osc.start(now + start);
    osc.stop(now + start + dur + 0.05);
  });

  masterGain.gain.setValueAtTime(1, now);
}

/** Error buzz — dissonant low grind */
export function playErrorBuzz(volume = 0.12): void {
  const c = getCtx();
  const now = c.currentTime;

  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = 80;

  const osc2 = c.createOscillator();
  osc2.type = 'square';
  osc2.frequency.value = 83;

  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 300;

  osc.connect(lp).connect(gain).connect(c.destination);
  osc2.connect(lp);
  osc.start(now);
  osc2.start(now);
  osc.stop(now + 0.35);
  osc2.stop(now + 0.35);
}

/** Success chime — minor key, mysterious not happy */
export function playSuccessChime(volume = 0.1): void {
  const c = getCtx();
  const now = c.currentTime;

  // Minor third interval — mysterious not cheerful
  const freqs = [330, 392, 494]; // E4, G4, B4 (E minor)
  freqs.forEach((freq, i) => {
    const osc = c.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;

    const gain = c.createGain();
    const startTime = now + i * 0.12;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

    osc.connect(gain).connect(c.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.65);
  });
}

/** Snap — wood breaking */
export function playSnap(volume = 0.25): void {
  const c = getCtx();
  const now = c.currentTime;

  const noise = c.createBufferSource();
  noise.buffer = createNoiseBuffer(0.15);

  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 800;
  bp.Q.value = 1;

  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  // Sub thud
  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);

  const thudGain = c.createGain();
  thudGain.gain.setValueAtTime(volume * 0.6, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  noise.connect(bp).connect(gain).connect(c.destination);
  osc.connect(thudGain).connect(c.destination);
  noise.start(now);
  osc.start(now);
  noise.stop(now + 0.2);
  osc.stop(now + 0.15);
}

/** Page transition whoosh — dark sweep */
export function playTransitionWhoosh(volume = 0.1): void {
  const c = getCtx();
  const now = c.currentTime;

  const noise = c.createBufferSource();
  noise.buffer = createNoiseBuffer(0.6);

  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(200, now);
  bp.frequency.exponentialRampToValueAtTime(4000, now + 0.3);
  bp.frequency.exponentialRampToValueAtTime(200, now + 0.6);
  bp.Q.value = 0.7;

  const gain = c.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  noise.connect(bp).connect(gain).connect(c.destination);
  noise.start(now);
  noise.stop(now + 0.65);
}
