import { Word, syllable2Str } from '../src';

const DIPTONGOS = [
  'pai-sa-je',
  'pei-ne',
  'an-droi-de',
  'pau-sa',
  'feu-do',
  'es-ta-dou-ni-den-se',
  'su-cia',
  'tie-rra',
  'pio-jo',
  're-cua',
  'puer-ta',
  're-si-duo',
  'ciu-dad',
  'bui-tre',
  'muy',
  'viu-da',
];

export const HIATOS = [
  // e
  'le-e',
  'pa-se-é',
  'se-a',
  'te-a-tro',
  'cre-ó',
  'fe-o',
  're-í',
  're-ú-ne',
  // a
  'ca-e',
  'a-é-re-o',
  'a-za-har',
  'na-o',
  'ca-o-ba',
  'pa-ís',
  'ba-úl',
  // o
  'ro-e',
  'No-é',
  'bo-a-to',
  'Sa-mo-a',
  'lo-ó',
  'zo-o',
  'o-ír',
  'No-ú-me-no',
  // i
  'rí-e',
  'fi-lo-so-fí-a',
  'rí-o',
  'chi-i-ta',
  // u
  'li-cú-e',
  'pú-a',
  'a-cen-tú-o',
  'du-un-vi-ro',
];

// TODO: oa, ea no son hiatos en Mexico

const TRIPTONGOS = [
  'A-bre-viáis',
  'A-bre-viéis',
  'Ac-tuáis',
  'A-huau-tle',
  'Buey',
  'Ca-ma-güey',
  'Ciais',
  'Crieis',
  'Cuai-mas',
  'Dioi-co',
  'Guay-mas',
  'Huey-pox-tla',
  'Miau',
  // No son triptongos
  'lim-pia-ú-ñas',
  'vi-ví-ais',
];

// Most from https://github.com/vic/silabas.js
const TEST_DATA = [
  'va-te',
  'su-yo',
  'ár-bol',
  'pa-la-bra',
  'es-to-cól-mo',
  'i-dí-li-co',
  'i-rru-ma-ción',
  'i-ne-fa-ble',
  'hi-po-pó-ta-mo',
  'ay',
  'hay',
  'ma-guey',
  'a-buha-do',
  'ac-mé',
  'hai-ga',
  'mam-po-rre-ro',
  'mur-cié-la-go',
  'ple-io-tro-pí-a',
  'Ab-yec-ción',
  'A-he-rro-jar',
  'güe-ro',
  'a-ve-ri-guáis',
  'U-ru-guay',
  'huí-a',
  'az-ca-pot-zal-co',
  'va-he-e',
  'pte-ra-sau-rio',
];

const WITH_H = ['a-ni-hi-lar', 'ma-ri-hua-na'];

describe('blah', () => {
  it('vc', () => {
    const word = new Word('la');
    expect(word.length).toEqual(2);
    expect(word.syllables).toEqual([{ coda: '', nucleus: 'a', onset: 'l' }]);
  });
  it('cv', () => {
    const word = new Word('al');
    expect(word.length).toEqual(2);
    expect(word.syllables).toEqual([{ coda: 'l', nucleus: 'a', onset: '' }]);
  });
  it('cvy', () => {
    const word = new Word('doy');
    expect(word.syllables).toEqual([{ coda: '', nucleus: 'oy', onset: 'd' }]);
  });
  it('cvv', () => {
    const word = new Word('duo');
    expect(word.syllables).toEqual([{ coda: '', nucleus: 'uo', onset: 'd' }]);
  });
  it('cvvy', () => {
    const word = new Word('buey');
    expect(word.syllables).toEqual([{ coda: '', nucleus: 'uey', onset: 'b' }]);
  });
  it('cvvy', () => {
    const word = new Word('buey');
    expect(word.syllables).toEqual([{ coda: '', nucleus: 'uey', onset: 'b' }]);
  });
  it('vcvc', () => {
    const word = new Word('lalo');
    expect(word.syllables.map(syllable2Str)).toEqual(['la', 'lo']);
  });
  it('vcv', () => {
    const word = new Word('ala');
    expect(word.syllables.map(syllable2Str)).toEqual(['a', 'la']);
  });
  it('vccv', () => {
    const word = new Word('alto');
    expect(word.syllables.map(syllable2Str)).toEqual(['al', 'to']);
  });
  it('vccv, digraph', () => {
    const word = new Word('allá');
    expect(word.syllables.map(syllable2Str)).toEqual(['a', 'llá']);
  });
  it('vccv, compound', () => {
    const word = new Word('extra');
    expect(word.syllables.map(syllable2Str)).toEqual(['ex', 'tra']);
  });

  TEST_DATA.forEach(word => {
    const combined = word.replace(/-/g, '');
    const split = word.split('-');
    it(`${combined} => ${word}`, () => {
      const word = new Word(combined);
      expect(word.syllables.map(syllable2Str)).toEqual(split);
    });
  });

  DIPTONGOS.forEach(word => {
    const combined = word.replace(/-/g, '');
    const split = word.split('-');
    it(`${combined} => ${word}`, () => {
      const word = new Word(combined);
      expect(word.syllables.map(syllable2Str)).toEqual(split);
    });
  });

  TRIPTONGOS.forEach(word => {
    const combined = word.replace(/-/g, '');
    const split = word.split('-');
    it(`${combined} => ${word}`, () => {
      const word = new Word(combined);
      expect(word.syllables.map(syllable2Str)).toEqual(split);
    });
  });

  HIATOS.forEach(word => {
    const combined = word.replace(/-/g, '');
    const split = word.split('-');
    it(`${combined} => ${word}`, () => {
      const word = new Word(combined);
      expect(word.syllables.map(syllable2Str)).toEqual(split);
    });
  });

  WITH_H.forEach(word => {
    const combined = word.replace(/-/g, '');
    const split = word.split('-');
    it(`${combined} => ${word}`, () => {
      const word = new Word(combined);
      expect(word.syllables.map(syllable2Str)).toEqual(split);
    });
  });
});
