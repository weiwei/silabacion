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
  'pié',
];

const HIATOS = [
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
];

const NO_TRIPTONGOS = ['lim-pia-ú-ñas', 'vi-ví-ais'];

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
  'por-que',
  'abs-tra-er',
  'cons-truir',
  'ads-cri-bir',
  'ads-trin-gir',
  'ah-re',
];

const WITH_H = ['a-ni-hi-lar', 'ma-ri-hua-na'];

describe('separate properly', () => {
  TEST_DATA.forEach((word) => {
    const combined = word.replace(/-/g, '');
    const split = word.split('-');
    it(`${combined} => ${word}`, () => {
      const word = new Word(combined);
      expect(word.syllables.map(syllable2Str)).toEqual(split);
    });
  });

  DIPTONGOS.forEach((word) => {
    const combined = word.replace(/-/g, '');
    const split = word.split('-');
    it(`${combined} => ${word}`, () => {
      const word = new Word(combined);
      expect(word.syllables.map(syllable2Str)).toEqual(split);
      expect(word.diphthongs.length).toBeGreaterThanOrEqual(1);
    });
  });

  TRIPTONGOS.forEach((word) => {
    const combined = word.replace(/-/g, '');
    const split = word.split('-');
    it(`${combined} => ${word}`, () => {
      const word = new Word(combined);
      expect(word.syllables.map(syllable2Str)).toEqual(split);
      expect(word.triphthongs.length).toBeGreaterThanOrEqual(1);
    });
  });

  NO_TRIPTONGOS.forEach((word) => {
    const combined = word.replace(/-/g, '');
    const split = word.split('-');
    it(`${combined} => ${word}`, () => {
      const word = new Word(combined);
      expect(word.syllables.map(syllable2Str)).toEqual(split);
      expect(word.triphthongs.length).toBeGreaterThanOrEqual(0);
    });
  });

  HIATOS.forEach((word) => {
    const combined = word.replace(/-/g, '');
    const split = word.split('-');
    it(`${combined} => ${word}`, () => {
      const word = new Word(combined);
      expect(word.syllables.map(syllable2Str)).toEqual(split);
      expect(word.hiatuses.length).toBeGreaterThanOrEqual(1);
    });
  });

  WITH_H.forEach((word) => {
    const combined = word.replace(/-/g, '');
    const split = word.split('-');
    it(`${combined} => ${word}`, () => {
      const word = new Word(combined);
      expect(word.syllables.map(syllable2Str)).toEqual(split);
    });
  });
});
