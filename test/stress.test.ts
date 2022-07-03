import { Word, Stress } from '../src';

const Oxytones = [
  'a',
  'la',
  'gol',
  'olé',
  'pié',
  'piedad',
  'pastel',
  'habló',
  'reloj',
  'vivir',
];
const Paroxytones = [
  'pena',
  'gases',
  'ponen',
  'lee',
  'cóctel',
  'espantoso',
  'bíceps',
  'fértil',
];
const ProParoxytones = ['esdrújula', 'teléfono', 'árboles'];
const Superproparoxytone = [
  'tráiganosla',
  'gíratelo',
  'rápidamente',
  'ávidamente',
];

describe('stress', () => {
  Oxytones.forEach((word) => {
    it(`${word} is oxytone`, () => {
      const obj = new Word(word);
      expect(obj.stress).toEqual(Stress.Oxytone);
    });
  });

  Paroxytones.forEach((word) => {
    it(`${word} is paroxytone`, () => {
      const obj = new Word(word);
      expect(obj.stress).toEqual(Stress.Paroxytone);
    });
  });

  ProParoxytones.forEach((word) => {
    it(`${word} is proparoxytone`, () => {
      const obj = new Word(word);
      expect(obj.stress).toEqual(Stress.Proparoxytone);
    });
  });

  Superproparoxytone.forEach((word) => {
    it(`${word} is superproparoxytone`, () => {
      const obj = new Word(word);
      expect(obj.stress).toEqual(Stress.Superproparoxytone);
    });
  });
});
