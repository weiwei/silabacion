import { Word } from '../src/syllabize';

describe('syllabize properly', () => {
  it('agudo', () => {
    const word = new Word('pié');
    expect(word.rhyme).toEqual('ié');
  });
  it('llano', () => {
    const word = new Word('ciento');
    expect(word.rhyme).toEqual('ento');
  });
  it('esdrújulo', () => {
    const word = new Word('esdrújulo');
    expect(word.rhyme).toEqual('újulo');
  });
});
