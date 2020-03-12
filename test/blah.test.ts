import { Word, syllable2Str } from '../src';

const TEST_DATA = [
  "va-te", "ár-bol", "pa-la-bra", "es-to-cól-mo", "i-dí-li-co", 
  "i-rru-ma-ción" ,"i-ne-fa-ble", "hi-po-pó-ta-mo", 
  "ay", "hay", "ma-guey", "a-buha-do", "ac-mé",
  "hai-ga", "mam-po-rre-ro", "mur-cié-la-go", "ple-io-tro-pí-a"
]

describe('blah', () => {
  it('vc', () => {
    const word = new Word('la');
    expect(word.length).toEqual(2);
    expect(word.syllables).toEqual([{coda: "", nucleus: "a", onset: "l"}]);
  });
  it('vcvc', () => {
    const word = new Word('lalo');
    expect(word.syllables.map(syllable2Str)).toEqual(["la", "lo"]);
  });
  it('vcv', () => {
    const word = new Word('ala');
    expect(word.syllables.map(syllable2Str)).toEqual(["a", "la"]);
  });
  it('vccv', () => {
    const word = new Word('alto');
    expect(word.syllables.map(syllable2Str)).toEqual(["al", "to"]);
  });
  it('vccv, digraph', () => {
    const word = new Word('allá');
    expect(word.syllables.map(syllable2Str)).toEqual(["a", "llá"]);
  });
  it('vccv, compound', () => {
    const word = new Word('extra');
    expect(word.syllables.map(syllable2Str)).toEqual(["ex", "tra"]);
  });

  TEST_DATA.map(word => {
    const combined = word.replace(/-/g, "")
    const splitted = word.split("-")
    it(`${combined} => ${word}`, () => {
      const word = new Word(combined);
      expect(word.syllables.map(syllable2Str)).toEqual(splitted);
    });
  })

});
