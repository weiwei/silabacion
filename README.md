# Silabación

Separate Spanish words into syllables.

![build](https://github.com/gastlygem/silabacion/workflows/build/badge.svg)

## Installation

As with any other NPM package, you can install it with `npm` or `yarn`.

## Usage

```typescript
import { Word, Stress } from 'silabacion';

const word = new Word('hispanófilo');
console.log(word.word); // hispanófilo
console.log(word.length); // 11
console.log(word.syllables.length); // 5
console.log(word.syllables[0]); // { onset: 'h', nucleus: 'i', coda: 's' }
console.log(Stress[word.stress]); // Proparoxytone
console.log(word.rhyme); // ófilo
console.log(word.tonic); // { onset: 'f', nucleus: 'i', coda: '' }

const word = new Word('aéreo');
console.log(word.hiatuses);
// [
//   { syllableIndex: 0, composite: 'aé', type: 1 },
//   { syllableIndex: 2, composite: 'eo', type: 0 }
// ]
console.log(word.diphthongs);
// []
console.log(word.triphthongs);
// []

// Note: diphthongs and hiatuses have a enum type attribute
export enum HiatusType {
  Simple,
  Acentual,
}

export enum DiphthongType {
  Creciente,
  Decreciente,
  Homogéneo,
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Compare

- [silabas.js](https://github.com/vic/silabas.js) only separates syllables. GNU licensed.
- [silabajs](https://github.com/nicofrem/silabajs) functionally comparable. It's in pure js instead of typescript.
