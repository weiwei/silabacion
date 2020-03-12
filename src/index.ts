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

function isVowel(char: string) {
  return ALL_VOWELS.includes(char.toLowerCase());
}

function isWeakVowel(char: string) {
  return WEAK_VOWELS.includes(char.toLowerCase());
}

const SAME_VOWEL_SETS = [
  new Set(['a', 'á']),
  new Set(['o', 'ó']),
  new Set(['e', 'é']),
  new Set(['i', 'í']),
  new Set(['u', 'ú', 'ü']),
];

function isHiatus(a: string, b: string) {
  const aL = a.toLowerCase();
  const bL = b.toLowerCase();
  return (
    // same vowel
    SAME_VOWEL_SETS.some(s => s.has(aL) && s.has(bL)) ||
    // or both stressed
    (STRESSED_VOWELS.has(aL) && STRESSED_VOWELS.has(bL))
  );
}

function makesTriphthong(a: string, b: string) {
  const vowels = a + b;
  return (
    isWeakVowel(vowels[0]) &&
    STRESSED_VOWELS.has(vowels[1].toLowerCase()) &&
    isWeakVowel(vowels[2])
  );
}

export interface Syllable {
  onset: string;
  nucleus: string;
  coda: string;
}

export const syllable2Str = (syllable: Syllable) => {
  return syllable.onset + syllable.nucleus + syllable.coda;
};

export enum Stress {
  Oxytone = 1, // aguda
  Paroxytone, // llana
  Proparoxytone, // esdrújula
  Superproparoxytone, //sobresdrújula
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
  public stress: Stress;
  public rhyme: string;
  private stressPosition = 0;
  public tonic: Syllable;

  constructor(word: string) {
    this.word = word;
    this.length = word.length;
    this.syllables = [];
    this.toSyllables();
    this.stress = this.findStress();
    this.rhyme = this.findRhyme();
    this.tonic = this.syllables[this.stressPosition];
  }

  private toSyllables() {
    let index = 0;
    let position = Position.None;
    let syllable: Syllable = { onset: '', nucleus: '', coda: '' };
    while (true) {
      const char = this.word[index];
      if (!isVowel(char)) {
        if (position === Position.None || position === Position.atOnset) {
          position = Position.atOnset;
          syllable.onset = syllable.onset + char;
        } else if (position === Position.atNucleus) {
          if (index === this.length - 1 && char === 'y') {
            syllable.nucleus = syllable.nucleus + char;
          } else if (char === 'h') {
            index += 1;
            const nextChar = this.word[index];
            if (isVowel(nextChar)) {
              if (isHiatus(syllable.nucleus, nextChar)) {
                this.syllables.push(syllable);
                syllable = { onset: char, nucleus: nextChar, coda: '' };
                position = Position.atNucleus;
              } else {
                index += 1;
                const nnextChar = this.word[index];
                if (isVowel(nnextChar)) {
                  if (makesTriphthong(syllable.nucleus + nextChar, nnextChar)) {
                    // Could this happen?
                  } else {
                    this.syllables.push(syllable);
                    syllable = {
                      onset: char,
                      nucleus: nextChar + nnextChar,
                      coda: '',
                    };
                    position = Position.atNucleus;
                  }
                } else {
                  syllable.nucleus = syllable.nucleus + char + nextChar;
                  syllable.coda = nnextChar;
                  position = Position.atCoda;
                }
              }
            } else {
              syllable.coda = char;
              this.syllables.push(syllable);
              syllable = { onset: nextChar, nucleus: '', coda: '' };
              position = Position.atOnset;
            }
          } else {
            syllable.coda = syllable.coda + char;
            position = Position.atCoda;
          }
        } else if (position === Position.atCoda) {
          position = Position.atCoda;
          syllable.coda = syllable.coda + char;
        }
      } else {
        // is vowel
        if (position === Position.None || position === Position.atOnset) {
          position = Position.atNucleus;
          syllable.nucleus = syllable.nucleus + char;
        } else if (position === Position.atNucleus) {
          if (syllable.nucleus.length === 1) {
            if (isHiatus(char, syllable.nucleus)) {
              this.syllables.push(syllable);
              syllable = { onset: '', nucleus: char, coda: '' };
              position = Position.atNucleus;
            } else {
              syllable.nucleus = syllable.nucleus + char;
              position = Position.atNucleus;
            }
          } else if (syllable.nucleus.length === 2) {
            if (makesTriphthong(syllable.nucleus, char)) {
              syllable.nucleus = syllable.nucleus + char;
              position = Position.atNucleus;
            } else {
              const lastNucleus = syllable.nucleus[1];
              if (isWeakVowel(lastNucleus)) {
                this.syllables.push({
                  ...syllable,
                  nucleus: syllable.nucleus[0],
                });
                syllable = { onset: '', nucleus: lastNucleus + char, coda: '' };
              } else {
                this.syllables.push(syllable);
                syllable = { onset: '', nucleus: char, coda: '' };
              }
              position = Position.atNucleus;
            }
          }
        } else if (position === Position.atCoda) {
          if (syllable.coda.length === 1) {
            const temp = syllable.coda;
            syllable.coda = '';
            this.syllables.push(syllable);
            syllable = { onset: temp, nucleus: char, coda: '' };
          } else if (syllable.coda.length === 2) {
            let temp: string;
            if (
              CONSONANT_BLENDS.includes(syllable.coda) ||
              DIAGRAPHS.includes(syllable.coda)
            ) {
              temp = syllable.coda;
              syllable.coda = '';
            } else {
              temp = syllable.coda[1];
              syllable.coda = syllable.coda[0];
            }
            this.syllables.push(syllable);
            syllable = { onset: temp, nucleus: char, coda: '' };
          } else if (syllable.coda.length === 3) {
            const temp = syllable.coda.slice(1, 3);
            syllable.coda = syllable.coda[0];
            this.syllables.push(syllable);
            syllable = { onset: temp, nucleus: char, coda: '' };
          } else if (syllable.coda.length === 4) {
            const temp = syllable.coda.slice(2, 4);
            syllable.coda = syllable.coda.slice(0, 2);
            this.syllables.push(syllable);
            syllable = { onset: temp, nucleus: char, coda: '' };
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

  private findStress(): Stress {
    const numberOfSyllables = this.syllables.length;
    if (numberOfSyllables === 1) {
      return Stress.Oxytone;
    }
    if (numberOfSyllables > 1) {
      for (const char of this.syllables[numberOfSyllables - 1].nucleus) {
        if (ACCENTED_VOWELS.includes(char)) {
          this.stressPosition = 1;
          return Stress.Oxytone;
        }
      }
    }
    if (numberOfSyllables >= 2) {
      for (const char of this.syllables[numberOfSyllables - 2].nucleus) {
        if (ACCENTED_VOWELS.includes(char)) {
          this.stressPosition = 2;
          return Stress.Paroxytone;
        }
      }
    }
    if (numberOfSyllables >= 3) {
      for (const char of this.syllables[numberOfSyllables - 3].nucleus) {
        if (ACCENTED_VOWELS.includes(char)) {
          this.stressPosition = 3;
          return Stress.Proparoxytone;
        }
      }
    }
    if (numberOfSyllables >= 4) {
      let index = numberOfSyllables - 4;
      while (index >= 0) {
        for (const char of this.syllables[index].nucleus) {
          if (ACCENTED_VOWELS.includes(char)) {
            this.stressPosition = numberOfSyllables - index;
            return Stress.Superproparoxytone;
          }
        }
        index -= 1;
      }
    }

    const lastCoda = this.syllables[numberOfSyllables - 1].coda;
    if (lastCoda !== '' && lastCoda !== 'n' && lastCoda !== 's') {
      return Stress.Oxytone;
    }
    return Stress.Paroxytone;
  }

  private findRhyme(): string {
    switch (this.stress) {
      case Stress.Oxytone: {
        const lastSyllable = this.syllables[this.syllables.length - 1];
        return lastSyllable.nucleus + lastSyllable.coda;
      }
      case Stress.Paroxytone: {
        const lastSyllable = this.syllables[this.syllables.length - 1];
        const nextSyllable = this.syllables[this.syllables.length - 2];
        if (nextSyllable.nucleus.length === 1) {
          return (
            nextSyllable.nucleus +
            nextSyllable.coda +
            syllable2Str(lastSyllable)
          );
        } else {
          let stressIndex = 0;
          for (const char of nextSyllable.nucleus) {
            if (STRESSED_VOWELS.has(char)) {
              return (
                nextSyllable.nucleus.slice(
                  stressIndex,
                  nextSyllable.nucleus.length
                ) +
                nextSyllable.coda +
                syllable2Str(lastSyllable)
              );
            }
            stressIndex += 1;
          }
          // Not possible
          return (
            nextSyllable.nucleus +
            nextSyllable.coda +
            syllable2Str(lastSyllable)
          );
        }
      }
      case Stress.Proparoxytone: {
        const lastSyllable = this.syllables[this.syllables.length - 1];
        const nextSyllable = this.syllables[this.syllables.length - 2];
        const nnextSyllable = this.syllables[this.syllables.length - 3];
        return (
          nnextSyllable.nucleus +
          nnextSyllable.coda +
          syllable2Str(nextSyllable) +
          syllable2Str(lastSyllable)
        );
      }
      case Stress.Superproparoxytone: {
        // What's the point
        return this.word;
      }
      default: {
        return this.word;
      }
    }
  }
}

export enum SoundType {
  Monophthong,
  Diphthong,
  Triphthong,
  Hiatus,
  Other,
}

export function classify(word: Word) {
  console.log(word);
  return [
    { str: 'j', sound: SoundType.Other },
    { str: 'au', sound: SoundType.Diphthong },
    { str: 'l', sound: SoundType.Other },
    { str: 'a', sound: SoundType.Monophthong },
  ];
}
