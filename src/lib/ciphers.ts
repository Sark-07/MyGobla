// ══════════════════════════════════════════════════
// ONE WISH WILLOW — Cipher Algorithms
// Caesar, Atbash, Runic, Morse, Reverse, Symbol
// ══════════════════════════════════════════════════

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const RUNE_MAP: Record<string, string> = {
  A: 'ᚨ', B: 'ᛒ', C: 'ᚲ', D: 'ᛞ', E: 'ᛖ', F: 'ᚠ',
  G: 'ᚷ', H: 'ᚺ', I: 'ᛁ', J: 'ᛃ', K: 'ᚲ', L: 'ᛚ',
  M: 'ᛗ', N: 'ᚾ', O: 'ᛟ', P: 'ᛈ', Q: 'ᚲ', R: 'ᚱ',
  S: 'ᛊ', T: 'ᛏ', U: 'ᚢ', V: 'ᚹ', W: 'ᚹ', X: 'ᚲᛊ',
  Y: 'ᛃ', Z: 'ᛉ',
};

const MORSE_MAP: Record<string, string> = {
  A: '·—', B: '—···', C: '—·—·', D: '—··', E: '·',
  F: '··—·', G: '——·', H: '····', I: '··', J: '·———',
  K: '—·—', L: '·—··', M: '——', N: '—·', O: '———',
  P: '·——·', Q: '——·—', R: '·—·', S: '···', T: '—',
  U: '··—', V: '···—', W: '·——', X: '—··—', Y: '—·——',
  Z: '——··',
  '0': '—————', '1': '·————', '2': '··———', '3': '···——',
  '4': '····—', '5': '·····', '6': '—····', '7': '——···',
  '8': '———··', '9': '————·',
};

export const SYMBOL_MAP: Record<string, string> = {
  A: '★', B: '☽', C: '♠', D: '◆', E: '☾', F: '✦',
  G: '⚝', H: '♦', I: '☆', J: '◇', K: '⬡', L: '△',
  M: '▽', N: '⊕', O: '⊗', P: '⊙', Q: '⬢', R: '♧',
  S: '⚘', T: '⊛', U: '⟡', V: '⟐', W: '⊞', X: '⊠',
  Y: '⊡', Z: '⊟',
};

export function caesarCipher(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26;
  return text.toUpperCase().split('').map((ch) => {
    const i = ALPHABET.indexOf(ch);
    return i === -1 ? ch : ALPHABET[(i + s) % 26];
  }).join('');
}

export function caesarDecipher(text: string, shift: number): string {
  return caesarCipher(text, -shift);
}

export function atbashCipher(text: string): string {
  return text.toUpperCase().split('').map((ch) => {
    const i = ALPHABET.indexOf(ch);
    return i === -1 ? ch : ALPHABET[25 - i];
  }).join('');
}

export function runicCipher(text: string): string {
  return text.toUpperCase().split('').map((ch) => RUNE_MAP[ch] || ch).join('');
}

export function morseCipher(text: string): string {
  return text.toUpperCase().split('').map((ch) => {
    if (ch === ' ') return ' / ';
    return MORSE_MAP[ch] || ch;
  }).join(' ');
}

export function reverseCipher(text: string): string {
  return text.split('').reverse().join('');
}

export function symbolCipher(text: string): string {
  return text.toUpperCase().split('').map((ch) => SYMBOL_MAP[ch] || ch).join('');
}

export type CipherMode = 'caesar' | 'atbash' | 'runic' | 'morse' | 'reversed';

export const CIPHER_MODES: { id: CipherMode; label: string; symbol: string }[] = [
  { id: 'caesar', label: 'CAESAR XIII', symbol: '⟳' },
  { id: 'atbash', label: 'ATBASH', symbol: '⇄' },
  { id: 'runic', label: 'ELDER FUTHARK', symbol: 'ᚠ' },
  { id: 'morse', label: 'MORSE CODE', symbol: '·—' },
  { id: 'reversed', label: 'MIRROR', symbol: '⊘' },
];

export function applyCipher(text: string, mode: CipherMode): string {
  switch (mode) {
    case 'caesar': return caesarCipher(text, 13);
    case 'atbash': return atbashCipher(text);
    case 'runic': return runicCipher(text);
    case 'morse': return morseCipher(text);
    case 'reversed': return reverseCipher(text);
  }
}
