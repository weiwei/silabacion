import {
  Syllable,
  isVowel,
  isHiatus,
  makesTriphthong,
  isWeakVowel,
  isConsonantGroup,
  hasAccent,
  syllable2Str,
  stressIndex,
} from './util';

export enum Stress {
  Oxytone = 1, // aguda
  Paroxytone, // llana
  Proparoxytone, // esdrújula
  Superproparoxytone, //sobresdrújula
}

enum Position {
  None,
  atOnset, // Dos
  atNucleus, // dOs
  atCoda, // doS
}

export class Word {
  private stressPosition = 0;

  /**
   * The word itself
   */
  public word: string;

  /**
   * Length of the word
   */
  public length: number;

  /**
   * Word devided to syllables
   */
  public syllables: Syllable[];

  /**
   * Type of stress
   */
  public stress: Stress;

  /**
   * The rhyming part
   */
  public rhyme: string;

  /**
   * The tonic syllable
   */
  public tonic: Syllable;

  /**
   * List of syllable indexes where the hiatus first occurred
   */
  public hiatuses: Hiatus[] = [];
  public diphthongs: Diptong[] = [];
  public triphthongs: Triphthong[] = [];

  constructor(word: string) {
    this.word = word;
    this.length = word.length;
    this.syllables = [];
    this.syllabize();
    this.findVowelCombos();
    this.stress = this.findStress();
    this.rhyme = this.findRhyme();
    this.tonic = this.syllables[this.stressPosition];
  }

  private syllabize() {
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
          if (
            char === 'y' &&
            (index === this.length - 1 ||
              (index + 1 < this.word.length && !isVowel(this.word[index + 1])))
          ) {
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
            if (isConsonantGroup(syllable.coda)) {
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
      if (hasAccent(this.syllables[numberOfSyllables - 1])) {
        this.stressPosition = 1;
        return Stress.Oxytone;
      }
    }
    if (numberOfSyllables >= 2) {
      if (hasAccent(this.syllables[numberOfSyllables - 2])) {
        this.stressPosition = 2;
        return Stress.Paroxytone;
      }
    }
    if (numberOfSyllables >= 3) {
      if (hasAccent(this.syllables[numberOfSyllables - 3])) {
        this.stressPosition = 3;
        return Stress.Proparoxytone;
      }
    }
    if (numberOfSyllables >= 4) {
      let index = numberOfSyllables - 4;
      while (index >= 0) {
        if (hasAccent(this.syllables[index])) {
          this.stressPosition = numberOfSyllables - index;
          return Stress.Superproparoxytone;
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

  private findVowelCombos(): void {
    let index = 0;
    while (index < this.syllables.length) {
      if (
        this.syllables[index].coda === '' &&
        this.syllables[index].nucleus.length === 1 &&
        index + 1 < this.syllables.length &&
        (this.syllables[index + 1].onset === '' ||
          this.syllables[index + 1].onset === 'h') &&
        this.syllables[index + 1].nucleus.length === 1
      ) {
        // Find hiatuses
        this.hiatuses.push({
          syllableIndex: index,
          composite:
            this.syllables[index].nucleus + this.syllables[index + 1].nucleus,
          type:
            hasAccent(this.syllables[index]) ||
            hasAccent(this.syllables[index + 1])
              ? HiatusType.Acentual
              : HiatusType.Simple,
        });
      } else if (this.syllables[index].nucleus.length === 2) {
        // Find diptongs
        let type;
        if (this.syllables[index].nucleus.match(/[iíuúü][aáeéoó]/)) {
          type = DiphthongType.Creciente;
        } else if (this.syllables[index].nucleus.match(/[aáeéoó][iíuúüy]/)) {
          type = DiphthongType.Decreciente;
        } else if (this.syllables[index].nucleus.match(/[iíuúü][iíuúüy]/)) {
          type = DiphthongType.Homogéneo;
        } else {
          throw new Error('Not a diphthong');
        }
        this.diphthongs.push({
          syllableIndex: index,
          type,
          composite: this.syllables[index].nucleus,
        });
      } else if (this.syllables[index].nucleus.length === 3) {
        this.triphthongs.push({
          syllableIndex: index,
          composite: this.syllables[index].nucleus,
        });
      } else if (
        this.syllables[index].coda === '' &&
        this.syllables[index].nucleus.length === 2 &&
        index + 1 < this.syllables.length &&
        (this.syllables[index + 1].onset === '' ||
          this.syllables[index + 1].onset === 'h') &&
        this.syllables[index + 1].nucleus.length === 1
      ) {
      }
      index += 1;
    }
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
          const sIndex = stressIndex(nextSyllable.nucleus);
          return (
            nextSyllable.nucleus.slice(sIndex, nextSyllable.nucleus.length) +
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

export enum HiatusType {
  Simple,
  Acentual,
}

export enum DiphthongType {
  Creciente,
  Decreciente,
  Homogéneo,
}

export interface Hiatus {
  syllableIndex: number;
  composite: string;
  type: HiatusType;
}

export interface Diptong {
  syllableIndex: number;
  composite: string;
  type: DiphthongType;
}

export interface Triphthong {
  syllableIndex: number;
  composite: string;
}
