import { at, times } from 'lodash';

export class Permutation {
  #map: number[];

  constructor(map: number | number[]) {
    if (typeof map === 'number') {
      map = times(map);
    }

    this.#map = map.slice();
  }

  static fromDisjointCycles(cycles: string, n: number): Permutation {
    return new Permutation(
      Array.from(cycles.matchAll(/\((\d+(\s+\d+)*)\)/g))
        .map(([_, cycle]) => cycle.split(/\s+/).map(Number))
        .reduce((map, cycle) => {
          cycle.forEach((x, i) => (map[x] = cycle[(i + 1) % cycle.length]));

          return map;
        }, times(n))
    );
  }

  apply(permutation: Permutation): Permutation {
    this.#map = at(permutation.#map, this.#map);

    return this;
  }

  image(x: number): number {
    return this.#map[x];
  }

  inverse(): Permutation {
    return new Permutation(
      this.#map.reduce(
        (inverse, y, x) => Object.assign(inverse, { [y]: x }),
        Array(this.#map.length)
      )
    );
  }

  preimage(y: number): number {
    return this.#map.indexOf(y);
  }
}
