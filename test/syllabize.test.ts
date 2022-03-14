import { Word, syllable2Str } from '../src';

describe('syllabize properly', () => {
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
});
