const ACCENTED_VOWELS = ['á', 'é', 'í', 'ó', 'ú'];
const NON_ACCENTED_VOWELS = ['a', 'e', 'i', 'o', 'u', 'ü'];
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

// TODO: What is "Y"?
// TODO: Vowel clusters?

export const DIAGRAPHS = ['ch', 'll', 'rr'];

function isVowel(char: string) {
  return ALL_VOWELS.includes(char);
}

export function isWeakVowel(char: string) {
  return WEAK_VOWELS.includes(char);
}

export function isAccentedVowel(char: string) {
  return ACCENTED_VOWELS.includes(char);
}

interface Syllable {
  onset: string;
  nucleus: string;
  coda: string;
}

export const syllable2Str = (syllable: Syllable) => {
  return syllable.onset + syllable.nucleus + syllable.coda;
}

enum Position {
  None,
  atOnset,
  atNucleus,
  atCoda,
}

export class Word {
  public word: string;
  public length: number;
  public syllables: Syllable[];
  constructor(word: string) {
    this.word = word;
    this.length = word.length;
    this.syllables = [];
    this.parse();
  }
  private parse() {
    let index = 0;
    let position = Position.None;
    let syllable: Syllable = {onset: '', nucleus: '', coda: ''};
    // const nextsyllable: Syllable = {onset: '', nucleus: '', coda: ''};
    while (true) {
      const char = this.word[index];
      if (!isVowel(char)) {
        if (position === Position.None || position === Position.atOnset) {
          position = Position.atOnset;
          syllable.onset = syllable.onset + char;
        } else if (position === Position.atNucleus) {
          position = Position.atCoda;
          syllable.coda = syllable.coda + char;
        } else if (position === Position.atCoda) {
          position = Position.atCoda;
          syllable.coda = syllable.coda + char;
        }
      } else {
        // is vowel
        if (
          position === Position.None ||
          position === Position.atOnset ||
          position === Position.atNucleus
        ) {
          position = Position.atNucleus;
          syllable.nucleus = syllable.nucleus + char;
        } else if (position === Position.atCoda) {
          if (syllable.coda.length === 1) {
            const temp = syllable.coda;
            syllable.coda = '';
            this.syllables.push(syllable);
            syllable = {onset: temp, nucleus: char, coda: ''};
          } else if (syllable.coda.length === 2) {
            let temp: string;
            if (CONSONANT_BLENDS.includes(syllable.coda) || DIAGRAPHS.includes(syllable.coda)) {
              temp = syllable.coda;
              syllable.coda = '';
            } else {
              temp = syllable.coda[1];
              syllable.coda = syllable.coda[0];
            }
            this.syllables.push(syllable);
            syllable = {onset: temp, nucleus: char, coda: ''};
          } else if (syllable.coda.length === 3) {
            const temp = syllable.coda.slice(1, 3);
            syllable.coda = syllable.coda[0];
            this.syllables.push(syllable);
            syllable = {onset: temp, nucleus: char, coda: ''};
          } else if (syllable.coda.length === 4) {
            const temp = syllable.coda.slice(2, 4);
            syllable.coda = syllable.coda.slice(0, 2);
            this.syllables.push(syllable);
            syllable = {onset: temp, nucleus: char, coda: ''};
          }
          position = Position.atNucleus;
        }
      }
      index += 1;
      if (this.word[index] === undefined) {
        this.syllables.push(syllable);
        break;
      }
    }
  }
}
