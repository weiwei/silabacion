const ACCENTED_VOWELS = ['á', 'é', 'í', 'ó', 'ú'];
const NON_ACCENTED_VOWELS = ['a', 'e', 'i', 'o', 'u', 'ü'];
const STRESSED_VOWELS = new Set([...ACCENTED_VOWELS, 'a', 'o', 'e']);
const ALL_VOWELS = [...ACCENTED_VOWELS, ...NON_ACCENTED_VOWELS];
const WEAK_VOWELS = ['i', 'u', 'ü'];
const CONSONANT_BLENDS = [
  'bl',
  'fl',
  'cl',
  'gl',
  'pl',
  'cr',
  'br',
  'tr',
  'gr',
  'fr',
  'pr',
  'dr',
  'tl',
];
const DIAGRAPHS = ['ch', 'll', 'rr'];

export function isVowel(char: string) {
  return ALL_VOWELS.includes(char.toLowerCase());
}

export function isWeakVowel(char: string) {
  return WEAK_VOWELS.includes(char.toLowerCase());
}

export function isConsonantGroup(str: string) {
  return (
    CONSONANT_BLENDS.includes(str.toLowerCase()) ||
    DIAGRAPHS.includes(str.toLowerCase())
  );
}

export interface Syllable {
  onset: string;
  nucleus: string;
  coda: string;
}

export function hasAccent(syllable: Syllable) {
  for (const char of syllable.nucleus) {
    if (ACCENTED_VOWELS.includes(char.toLowerCase())) {
      return true;
    }
  }
  return false;
}

export function stressIndex(str: string) {
  let stressIndex = 0;
  for (const char of str) {
    if (STRESSED_VOWELS.has(char.toLowerCase())) {
      return stressIndex;
    }
    stressIndex += 1;
  }
  return stressIndex;
}

const SAME_VOWEL_SETS = [
  new Set(['a', 'á']),
  new Set(['o', 'ó']),
  new Set(['e', 'é']),
  new Set(['i', 'í']),
  new Set(['u', 'ú', 'ü']),
];

export function isHiatus(a: string, b: string) {
  const aL = a.toLowerCase();
  const bL = b.toLowerCase();
  return (
    // same vowel
    SAME_VOWEL_SETS.some(s => s.has(aL) && s.has(bL)) ||
    // or both stressed
    (STRESSED_VOWELS.has(aL) && STRESSED_VOWELS.has(bL))
  );
}

export function makesTriphthong(a: string, b: string) {
  const vowels = a + b;
  return (
    isWeakVowel(vowels[0]) &&
    STRESSED_VOWELS.has(vowels[1].toLowerCase()) &&
    isWeakVowel(vowels[2])
  );
}

export const syllable2Str = (syllable: Syllable) => {
  return syllable.onset + syllable.nucleus + syllable.coda;
};
