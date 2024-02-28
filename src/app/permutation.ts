import { at, clone, isEqual, pull, sortBy, times } from 'lodash';

export class DictPermutation<T> {
  #dictionary: T[];
  #map: number[];
  #n: number;

  get n(): number {
    return this.#n;
  }

  constructor(dictionary: T[]) {
    this.#dictionary = clone(dictionary);
    this.#n = this.#dictionary.length;
    this.#map = times(this.#n);
  }

  apply(permutation: DictPermutation<T>): DictPermutation<T> {
    this.#map = at(permutation.#map, this.#map);

    return this;
  }

  clone(): DictPermutation<T> {
    return this.identity().setFromArray(this.#map);
  }

  identity(): DictPermutation<T> {
    return new DictPermutation(this.#dictionary);
  }

  inverse(): DictPermutation<T> {
    return this.identity().setFromArray(
      this.#map.reduce(
        (map, y, x) => Object.assign(map, { [y]: x }),
        Array(this.n)
      )
    );
  }

  invert(): DictPermutation<T> {
    return this.setFromArray(this.inverse().#map);
  }

  map(x: number): number {
    return this.#map[x];
  }

  pow(exp: number): DictPermutation<T> {
    const permutation = this.clone();

    for (let k = 1; k < Math.abs(exp); k++) {
      this.apply(permutation);
    }

    if (exp < 0) {
      this.invert();
    }

    return this;
  }

  pull(y: number): T {
    return this.#dictionary[this.#map.indexOf(y)];
  }

  setFromArray(map: number[]): DictPermutation<T> {
    if (!isEqual(sortBy(map), times(this.n))) {
      throw new Error(
        `map ${JSON.stringify(map)} is not an element of S(${this.n})`
      );
    }

    this.#map = map.slice();

    return this;
  }

  setFromCycles(cycles: string): DictPermutation<T> {
    return this.setFromArray(
      Array.from(cycles.matchAll(/\((\d+(\s+\d+)*)\)/g))
        .map(([_, cycle]) => cycle.split(/\s+/).map(Number))
        .reduce((permutation, cycle) => {
          return permutation.apply(
            this.identity().setFromArray(
              cycle.reduce(
                (map, x, i) =>
                  Object.assign(map, {
                    [x]: cycle[(i + 1) % cycle.length],
                  }),
                times(this.n)
              )
            )
          );
        }, this.identity()).#map
    );
  }

  toDisjointCycles(): string {
    const domain = times(this.n);
    const cycles: number[][] = [];

    while (domain.length) {
      let x: number;
      const cycle = [(x = domain[0])];

      while (cycle[0] !== (x = this.map(x))) {
        cycle.push(x);
      }

      pull(domain, ...cycle);

      if (cycle.length > 1) {
        cycles.push(cycle);
      }
    }

    return cycles.map((cycle) => `(${cycle.join(' ')})`).join('');
  }
}

export class Permutation extends DictPermutation<number> {
  constructor(n: number) {
    super(times(n));
  }
}
