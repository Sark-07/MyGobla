// ══════════════════════════════════════════════════
// ONE WISH WILLOW — Voice Narration Engine
// SpeechSynthesis API — mystical whisper quality
// ══════════════════════════════════════════════════

let voiceReady = false;
let preferredVoice: SpeechSynthesisVoice | null = null;

function loadVoices(): void {
  const voices = speechSynthesis.getVoices();
  // Prefer female English voices
  preferredVoice =
    voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
    voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('zira')) ||
    voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('samantha')) ||
    voices.find((v) => v.lang.startsWith('en-') && !v.name.toLowerCase().includes('male')) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0] || null;
  voiceReady = true;
}

// Load voices (async in some browsers)
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

/**
 * Speak text with a mystical, slow, low-pitched voice
 */
export function speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }): Promise<void> {
  return new Promise((resolve) => {
    if (typeof speechSynthesis === 'undefined') { resolve(); return; }
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? 0.75;   // Slow and deliberate
    utterance.pitch = options?.pitch ?? 0.8;  // Slightly low
    utterance.volume = options?.volume ?? 0.9;
    
    if (voiceReady && preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    speechSynthesis.speak(utterance);
  });
}

/**
 * Whisper — extra slow, very low pitch
 */
export function whisper(text: string): Promise<void> {
  return speak(text, { rate: 0.6, pitch: 0.6, volume: 0.7 });
}

/**
 * Narrate — normal mystical pace
 */
export function narrate(text: string): Promise<void> {
  return speak(text, { rate: 0.8, pitch: 0.85, volume: 0.9 });
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel();
  }
}
