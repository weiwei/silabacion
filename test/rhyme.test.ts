import { Word } from '../src';

describe('gets rhyming parts', () => {
  it.skip('agudo', () => {
    // TODO: fix
    const word = new Word('pié');
    expect(word.rhyme).toEqual('é');
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
