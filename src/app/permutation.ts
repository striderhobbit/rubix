import { at, clone, isEqual, pull, sortBy, times } from 'lodash';

export class Permutation<T> {
  readonly #dictionary: T[];
  readonly #map: number[];

  get n(): number {
    return this.#dictionary.length;
  }

  constructor(dictionary: T[]) {
    this.#dictionary = clone(dictionary);
    this.#map = times(this.n);
  }

  apply<U>(permutation: Permutation<U>): Permutation<T> {
    Object.assign(this.#map, at(permutation.#map, this.#map));

    return this;
  }

  clone(): Permutation<T> {
    return this.identity().setFromArray(this.#map);
  }

  identity(): Permutation<T> {
    return new Permutation(this.#dictionary);
  }

  inverse(): Permutation<T> {
    return this.identity().setFromArray(
      this.#map.reduce(
        (map, y, x) => Object.assign(map, { [y]: x }),
        Array(this.n)
      )
    );
  }

  invert(): Permutation<T> {
    return this.setFromArray(this.inverse().#map);
  }

  map(x: number): T {
    return this.#dictionary[this.#map[x]];
  }

  pow(exp: number): Permutation<T> {
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

  setFromArray(map: number[]): Permutation<T> {
    if (!isEqual(sortBy(map), times(this.n))) {
      throw new Error(
        `map ${JSON.stringify(map)} is not an element of S(${this.n})`
      );
    }

    Object.assign(this.#map, map);

    return this;
  }

  setFromCycles(cycles: string): Permutation<T> {
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

      while (cycle[0] !== (x = this.#map[x])) {
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

export class SimplePermutation extends Permutation<number> {
  constructor(n: number) {
    super(times(n));
  }
}
